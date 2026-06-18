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
import { usedSourceIds, recordSource, recentHeadlines } from "./state.js";
import { publishArticle } from "./publisher.js";

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
export async function runCategory(category, { exclude } = {}) {
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

  // Select the best story, but reject any pick we can't get a real article body
  // for (prevents thin, fabricated articles). Retry with the next best a few times.
  let pool = [...candidates];
  let chosen = null;
  for (let attempt = 0; attempt < 4 && pool.length; attempt++) {
    const pick = await pickBest(category, pool, recent);
    if (!pick) break;
    if (!pick._hydrated) await hydrate(pick);
    if ((pick.body?.length || 0) >= MIN_BODY_CHARS) {
      chosen = pick;
      break;
    }
    // Too thin — drop it and try the next best.
    pool = pool.filter((c) => c.id !== pick.id);
    chosen = chosen || pick; // remember a fallback in case nothing qualifies
  }
  if (!chosen) return { ...base, status: "no_selection" };

  const imgUrl = await resolveFeaturedImage(chosen);

  // Rewrite into publish-ready English HTML.
  let rewritten;
  try {
    rewritten = await rewriteForPublish(category, chosen);
  } catch (err) {
    return { ...base, status: "rewrite_failed", error: err.message, sourceId: chosen.id };
  }

  // Mark used immediately so the same story can't be picked again this wave/day.
  excludeSet.add(chosen.id);

  if (env.dryRun) {
    await recordSource({ candidate: chosen, category, day, dryRun: true });
    return {
      ...base,
      status: "dry_run",
      sourceId: chosen.id,
      sourceUrl: chosen.sourceUrl,
      headline: rewritten.headlinePlain,
      imgUrl,
      articleType: rewritten.articleType,
      sourceBodyChars: chosen.body?.length || 0,
      contentWords: rewritten.content.replace(/<[^>]+>/g, " ").trim().split(/\s+/).length,
      conclusion: rewritten.conclusion,
      content: rewritten.content,
      selectionReason: chosen.selectionReason,
    };
  }

  const post = await publishArticle(rewritten, imgUrl);
  await recordSource({ candidate: chosen, category, day, newsPostId: post._id, dryRun: false });
  return {
    ...base,
    status: "published",
    sourceId: chosen.id,
    sourceUrl: chosen.sourceUrl,
    headline: rewritten.headlinePlain,
    imgUrl,
    articleType: rewritten.articleType,
    newsPostId: String(post._id),
  };
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
    } catch (err) {
      results.push({ category, status: "error", error: err.message });
      console.error(`[autopilot] ${category} errored: ${err.message}`);
    }
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
