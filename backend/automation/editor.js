// AI editorial layer (OpenAI). Three steps:
//   1. relevance filter  — is this story worth publishing today?
//   2. selection         — pick the single best, avoiding topics we already cover
//   3. rewrite           — produce publish-ready English HTML in a human newsroom voice
import { env, EDITORIAL_GUIDE, FOOTER_TAGS, CATEGORY_DEFAULT_FOOTER } from "./config.js";
import { createChatCompletion } from "./openaiClient.js";

async function chatJSON({ system, user, temperature }) {
  const res = await createChatCompletion({
    model: env.openaiModel,
    temperature,
    response_format: { type: "json_object" },
    messages: [
      { role: "system", content: system },
      { role: "user", content: user },
    ],
  });
  const raw = res.choices?.[0]?.message?.content || "{}";
  return JSON.parse(raw);
}

// Whole-number age in days from an ISO timestamp (null if unknown).
function ageDaysOf(createdAt) {
  if (!createdAt) return null;
  const t = new Date(createdAt).getTime();
  if (isNaN(t)) return null;
  return Math.round((Date.now() - t) / 86400000);
}

function editorialDate() {
  const now = new Date();
  const fmt = new Intl.DateTimeFormat("en-GB", {
    timeZone: env.timezone,
    weekday: "long",
    day: "2-digit",
    month: "long",
    year: "numeric",
  });
  return fmt.format(now); // e.g. "Wednesday, 18 June 2026"
}

// Step 1: keep only candidates the model judges relevant to publish today.
export async function filterRelevantToday(category, candidates) {
  if (!candidates.length) return [];
  const compact = candidates.map((c) => ({
    id: c.id,
    title: c.title,
    summary: (c.summary || "").slice(0, 300),
    ageDays: ageDaysOf(c.createdAt),
  }));
  const system = "You are a strict news editor. Respond with JSON only.";
  const user = `Editorial date: ${editorialDate()} (Asia/Kolkata).
Category: ${category}
Guide: ${EDITORIAL_GUIDE[category] || ""}

For EACH candidate decide if it is relevant to publish TODAY (current, not stale, fits the category).
Candidates JSON:
${JSON.stringify(compact)}

Return JSON: {"assessments":[{"id":"...","relevantToday":true|false,"reason":"..."}]}`;
  try {
    const out = await chatJSON({ system, user, temperature: 0.2 });
    const ok = new Map((out.assessments || []).map((a) => [a.id, a]));
    return candidates
      .filter((c) => ok.get(c.id)?.relevantToday)
      .map((c) => ({ ...c, relevantTodayReason: ok.get(c.id)?.reason }));
  } catch (err) {
    if (err.budgetExceeded) throw err; // spend cap hit — stop, don't fan out more calls
    console.warn(`[autopilot] relevance check failed (${category}): ${err.message}`);
    return candidates; // fail open — better to publish than skip the whole wave
  }
}

// Step 2: pick exactly one story, avoiding anything close to what we already published.
export async function pickBest(category, candidates, recentHeadlines = []) {
  if (!candidates.length) return null;
  if (candidates.length === 1) return candidates[0];
  const compact = candidates.map((c) => ({
    id: c.id,
    title: c.title,
    summary: (c.summary || "").slice(0, 240),
    ageDays: ageDaysOf(c.createdAt),
    hasImage: !!c.imgUrl,
    source: c.sourceName,
  }));
  const system = "You are an engagement-focused news editor. Respond with JSON only.";
  const user = `Editorial date: ${editorialDate()}.
Category: ${category}
Guide: ${EDITORIAL_GUIDE[category] || ""}

We have ALREADY published these headlines recently — do NOT pick a story that covers the same topic:
${JSON.stringify(recentHeadlines)}

Pick exactly ONE source article to publish now. Prefer: high reader curiosity/stakes, freshest (lowest ageDays), and hasImage=true.
Candidates JSON:
${JSON.stringify(compact)}

Return JSON: {"id":"<chosen id>","reason":"<why readers will click>"}`;
  try {
    const out = await chatJSON({ system, user, temperature: 0.35 });
    const chosen = candidates.find((c) => c.id === out.id);
    if (chosen) return { ...chosen, selectionReason: out.reason };
  } catch (err) {
    if (err.budgetExceeded) throw err; // spend cap hit — stop, don't fan out more calls
    console.warn(`[autopilot] selection failed (${category}): ${err.message}`);
  }
  // Fallback: freshest with an image.
  return [...candidates].sort(
    (a, b) =>
      (b.imgUrl ? 1 : 0) - (a.imgUrl ? 1 : 0) ||
      (ageDaysOf(a.createdAt) ?? 99) - (ageDaysOf(b.createdAt) ?? 99)
  )[0];
}

// Step 3: rewrite into publish-ready English HTML.
export async function rewriteForPublish(category, article) {
  const body = (article.body || article.summary || "").slice(0, 8000);
  const sourceDate = article.createdAt
    ? new Date(article.createdAt).toLocaleString("en-IN", { timeZone: env.timezone, dateStyle: "medium", timeStyle: "short" })
    : "unknown";
  const system =
    "You are a senior reporter writing publish-ready news for an Indian news website. Output JSON only. " +
    "Write like a real human reporter — direct, varied sentence length, concrete detail. " +
    "Never sound like an AI: avoid phrases like 'In a significant development', 'delve', 'landscape', 'moreover', 'in conclusion'. " +
    "CRITICAL: use only facts present in the source. Do NOT invent names, numbers, dates, quotes or outcomes. If a detail isn't in the source, leave it out.";
  const user = `Editorial date: ${editorialDate()}.
Category: ${category}
Guide: ${EDITORIAL_GUIDE[category] || ""}
Allowed footer tags: ${JSON.stringify(FOOTER_TAGS)}

Source published: ${sourceDate}
Source title: ${article.title}
Source summary: ${article.summary || ""}
Source article text (may be partial):
${body}

Write a COMPLETE, original news article in ENGLISH. Completely rephrase — new structure and wording (anti-plagiarism) — but keep every fact accurate and preserve ALL the important details from the source. Requirements:
- Cover the full story: lead with what happened, then the WHO, WHAT, WHEN (date/time), WHERE, WHY/HOW, and any background or context the source gives. Include specific names, places, numbers, dates and any quotes that appear in the source.
- Do not omit relevant information that is in the source; expand and explain it for the reader. Do not pad with filler or repeat sentences.
- headline: catchy and accurate (a little punch is fine), plain text, no HTML.
- conclusion: a teaser dek that summarises the stakes, max 280 characters.
- content_html: a substantial article of 6-10 paragraphs (aim ~350-600 words when the source supports it), each wrapped in <p>...</p>. No other tags. The opening paragraph must state the core news with the key facts; later paragraphs add context, background and implications.
- hashtags: 2-4 relevant tags, each starting with #.
- footerTag: exactly one value from the allowed footer tags.
- articleType: "breakingNews" only for urgent national/security/major-incident news, otherwise "main".

Return JSON: {"headline":"...","conclusion":"...","content_html":"<p>...</p>","hashtags":["#.."],"footerTag":"...","articleType":"main"}`;

  const out = await chatJSON({ system, user, temperature: 0.75 });

  const headline = (out.headline || article.title || "").trim();
  const footerTag = FOOTER_TAGS.includes(out.footerTag)
    ? out.footerTag
    : CATEGORY_DEFAULT_FOOTER[category] || FOOTER_TAGS[0];
  const articleType = out.articleType === "breakingNews" ? "breakingNews" : "main";
  let hashtags = Array.isArray(out.hashtags) ? out.hashtags.filter(Boolean) : [];
  hashtags = hashtags.map((h) => (h.startsWith("#") ? h : `#${h}`)).slice(0, 4);

  return {
    // Site stores titles wrapped in an <h1><strong> block.
    title: `<h1><strong>${headline}</strong></h1>`,
    headlinePlain: headline,
    conclusion: (out.conclusion || "").slice(0, 280),
    content: out.content_html || `<p>${article.summary || ""}</p>`,
    hashtags,
    footerTags: footerTag,
    articleType,
    navbarCategories: category,
  };
}
