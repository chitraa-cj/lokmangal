// Orchestrates the autopilot: gather -> relevance -> hydrate -> freshness ->
// prefer-image -> select -> enrich -> rewrite -> publish, with cross-run dedup.
import { env, CATEGORIES } from "./config.js";
import { fetchInshorts } from "./sources/inshorts.js";
import { fetchSerper } from "./sources/serper.js";
import { fetchSites } from "./sources/siteScraper.js";
import { fetchArticleMeta } from "./sources/common.js";
import { todayDay, freshnessOk } from "./timeline.js";
import { filterRelevantToday, pickBest, rewriteForPublish } from "./editor.js";
import { resolveFeaturedImage } from "./images.js";
import { validateContent } from "./contentGuard.js";
import { usedSourceIds, recordSource, recentHeadlines } from "./state.js";
import { publishArticle } from "./publisher.js";
import { usageStats } from "./budget.js";

const MAX_CANDIDATES = 50; // cap before the relevance LLM call
const MAX_HYDRATE = 14; // bounded article-page fetches per category

const MIN_BODY_CHARS = 250; // reject picks we can't get a real article body for

// Likelihood a candidate yields a real featured image, by source.
// 2 = ships a direct image URL; 1 = real article URL (og:image resolvable).
const IMAGE_RANK = { serper: 2, inshorts: 2, site_scrape: 1 };
const imageRank = (c) => (c.imgUrl ? 2 : IMAGE_RANK[c.origin] ?? 0);

// Keep only the best image-tier candidates available (but never empty the pool).
function preferImageRich(candidates) {
  const withImage = candidates.filter((c) => imageRank(c) >= 1);
  return withImage.length ? withImage : candidates;
}

// Normalised title key for cross-source de-duplication.
function titleKey(t = "") {
  return t.toLowerCase().replace(/[^a-z0-9ऀ-ॿ]+/g, " ").trim().slice(0, 60);
}

// Gather + dedupe candidates from all sources for one category.
// All sources expose real publisher article URLs, so every candidate can yield a
// full body + real image (Google News RSS is intentionally excluded — its
// redirect links hide both).
async function gatherCandidates(category, exclude) {
  const [serper, inshorts, sites] = await Promise.all([
    fetchSerper(category).catch(() => []),
    fetchInshorts(category).catch(() => []),
    fetchSites(category).catch(() => []),
  ]);
  const seenId = new Set();
  const seenTitle = new Set();
  const merged = [];
  // Image-rich, content-rich sources first so they win de-dup ties.
  for (const c of [...serper, ...inshorts, ...sites]) {
    if (!c.title || exclude.has(c.id) || seenId.has(c.id)) continue;
    const tk = titleKey(c.title);
    if (tk && seenTitle.has(tk)) continue;
    seenId.add(c.id);
    if (tk) seenTitle.add(tk);
    merged.push(c);
  }
  return merged;
}

// Fetch an article page once and merge in date + image + full body.
async function hydrate(candidate) {
  try {
    const meta = await fetchArticleMeta(candidate.sourceUrl);
    if (meta.publishedAt && !candidate.createdAt) candidate.createdAt = meta.publishedAt;
    if (!candidate.imgUrl && meta.image) candidate.imgUrl = meta.image;
    if (meta.body && meta.body.length > (candidate.body?.length || 0)) {
      candidate.body = candidate.body ? `${candidate.body}\n\n${meta.body}` : meta.body;
    }
    candidate._hydrated = true;
  } catch (_) {
    /* leave as-is */
  }
  return candidate;
}

// Hydrate an array with bounded concurrency.
async function hydrateAll(candidates, limit = 4) {
  const queue = [...candidates];
  const workers = Array.from({ length: Math.min(limit, queue.length) }, async () => {
    while (queue.length) await hydrate(queue.shift());
  });
  await Promise.all(workers);
  return candidates;
}

// Run one category and publish a single article. Returns a result record.
// Wraps the work so that hitting the daily OpenAI spend cap stops cleanly
// (status "budget_exceeded") instead of throwing.
export async function runCategory(category, opts = {}) {
  try {
    return await runCategoryInner(category, opts);
  } catch (err) {
    if (err.budgetExceeded) {
      console.warn(`[autopilot] ${category}: ${err.message}`);
      return { category, day: todayDay(), status: "budget_exceeded", error: err.message };
    }
    throw err;
  }
}

async function runCategoryInner(category, { exclude } = {}) {
  const day = todayDay();
  const excludeSet = exclude || (await usedSourceIds());
  const base = { category, day };

  let candidates = await gatherCandidates(category, excludeSet);
  if (!candidates.length) return { ...base, status: "no_candidates" };

  // Cap, putting image-rich sources first, before the relevance LLM call.
  candidates.sort((a, b) => imageRank(b) - imageRank(a));
  candidates = candidates.slice(0, MAX_CANDIDATES);

  // Relevance on titles/summaries (cheap) narrows the pool before we fetch pages.
  candidates = await filterRelevantToday(category, candidates);
  if (!candidates.length) return { ...base, status: "no_relevant" };

  // Candidates that already carry a date (URL date / RSS / InShorts): filter them
  // cheaply now so stale ones don't waste the hydration budget. Date-less ones
  // (most site scrapes) get their date by hydrating the article page.
  const dated = candidates.filter((c) => c.createdAt).filter((c) => freshnessOk(c, category));
  const dateless = candidates.filter((c) => !c.createdAt);
  dateless.sort((a, b) => imageRank(b) - imageRank(a));
  await hydrateAll(dateless.slice(0, MAX_HYDRATE));
  const freshHydrated = dateless.filter((c) => freshnessOk(c, category));
  candidates = [...dated, ...freshHydrated];
  if (!candidates.length) return { ...base, status: "no_fresh" };

  // Prefer candidates whose image is actually available.
  candidates = preferImageRich(candidates);

  const recent = await recentHeadlines(category);

  // Select-and-vet loop. For each best pick we enforce, in order: a real article
  // body (no thin/fabricated pieces), a CLEAN featured image (no watermark /
  // publication logo / agency credit), and rewritten copy free of source
  // attribution. Any failure drops that pick and we try the next best — nothing
  // half-vetted is ever published.
  let pool = [...candidates];
  let lastReject = null;
  for (let attempt = 0; attempt < 6 && pool.length; attempt++) {
    const pick = await pickBest(category, pool, recent);
    if (!pick) break;
    pool = pool.filter((c) => c.id !== pick.id); // never reconsider this pick

    if (!pick._hydrated) await hydrate(pick);
    if ((pick.body?.length || 0) < MIN_BODY_CHARS) {
      lastReject = "thin_body";
      continue; // too thin — try the next best
    }

    // Image compliance gate: every published article MUST carry a real, clean,
    // on-topic photo. resolveFeaturedImage tries, in order, the candidate's own
    // image, the article's og:image, a Google Images (Serper) search and a
    // free-licensed search, vetting each through the guard. If NOTHING passes we
    // DISCARD this story rather than fall back to our logo placeholder — an
    // article is never published with the default/branding image. We move on to
    // the next best candidate; if none yields a clean image, the category
    // publishes nothing this run.
    const imgUrl = await resolveFeaturedImage(pick);
    if (!imgUrl) {
      lastReject = "no_clean_image";
      console.warn(`[autopilot] ${category}: dropped "${pick.title}" — no clean image found`);
      continue;
    }

    // Rewrite into publish-ready English HTML.
    let rewritten;
    try {
      rewritten = await rewriteForPublish(category, pick);
    } catch (err) {
      if (err.budgetExceeded) throw err; // spend cap hit — bubble up and stop
      lastReject = `rewrite_failed: ${err.message}`;
      continue; // try the next best rather than failing the whole category
    }

    // Content compliance gate: reject copy that still carries source attribution.
    const content = validateContent(rewritten);
    if (!content.clean) {
      lastReject = "content_provenance";
      console.warn(
        `[autopilot] ${category}: dropped "${pick.title}" — content provenance: ${content.reasons.join("; ")}`
      );
      continue;
    }

    // Passed every gate. Mark used so it can't be re-picked this wave/day.
    excludeSet.add(pick.id);

    if (env.dryRun) {
      await recordSource({ candidate: pick, category, day, dryRun: true });
      return {
        ...base,
        status: "dry_run",
        sourceId: pick.id,
        sourceUrl: pick.sourceUrl,
        headline: rewritten.headlinePlain,
        imgUrl,
        articleType: rewritten.articleType,
        sourceBodyChars: pick.body?.length || 0,
        contentWords: rewritten.content.replace(/<[^>]+>/g, " ").trim().split(/\s+/).length,
        conclusion: rewritten.conclusion,
        content: rewritten.content,
        selectionReason: pick.selectionReason,
      };
    }

    const post = await publishArticle(rewritten, imgUrl);
    await recordSource({ candidate: pick, category, day, newsPostId: post._id, dryRun: false });
    return {
      ...base,
      status: "published",
      sourceId: pick.id,
      sourceUrl: pick.sourceUrl,
      headline: rewritten.headlinePlain,
      imgUrl,
      articleType: rewritten.articleType,
      newsPostId: String(post._id),
    };
  }

  // Nothing cleared every compliance gate this run.
  return { ...base, status: "no_clean_candidate", lastReject };
}

// Run one wave: one article per category, sequentially, sharing a dedup set.
export async function runWave(categories = CATEGORIES) {
  const exclude = await usedSourceIds();
  const startedAt = new Date().toISOString();
  const results = [];
  for (const category of categories) {
    try {
      const r = await runCategory(category, { exclude });
      results.push(r);
      console.log(`[autopilot] ${category}: ${r.status}${r.headline ? ` — ${r.headline}` : ""}`);
      // Daily spend cap hit — no point running the rest of the wave; every call
      // would just fail the same way.
      if (r.status === "budget_exceeded") {
        console.warn("[autopilot] daily OpenAI spend cap reached — stopping this wave");
        break;
      }
    } catch (err) {
      results.push({ category, status: "error", error: err.message });
      console.error(`[autopilot] ${category} errored: ${err.message}`);
    }
  }
  const usage = await usageStats().catch(() => null);
  if (usage) {
    console.log(
      `[autopilot] OpenAI usage today: ${usage.calls}/${usage.maxDailyCalls || "∞"} calls, ` +
        `${usage.totalTokens}/${usage.maxDailyTokens || "∞"} tokens`
    );
  }
  const summary = {
    startedAt,
    finishedAt: new Date().toISOString(),
    dryRun: env.dryRun,
    day: todayDay(),
    published: results.filter((r) => r.status === "published").length,
    results,
  };
  return summary;
}
