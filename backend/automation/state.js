// Dedup state backed by MongoDB. Tracks which source articles we've already used
// and what we've recently published (for headline-level topic avoidance).
import AutopilotSource from "../models/AutopilotSourceSchema.js";
import News from "../models/NewsSchema.js";
import { CITY_CATEGORY } from "./cities.js";

// Set of sourceIds we've ever used (so we never repeat a story).
export async function usedSourceIds() {
  const docs = await AutopilotSource.find({}, { sourceId: 1 }).lean();
  return new Set(docs.map((d) => d.sourceId));
}

// Record a used source (whether published live or in a dry run).
export async function recordSource({ candidate, category, day, newsPostId, dryRun }) {
  await AutopilotSource.updateOne(
    { sourceId: candidate.id },
    {
      $set: {
        sourceId: candidate.id,
        sourceUrl: candidate.sourceUrl,
        sourceName: candidate.sourceName,
        category,
        title: candidate.title,
        day,
        newsPostId: newsPostId || undefined,
        dryRun: !!dryRun,
      },
    },
    { upsert: true }
  );
}

// How many live articles we've already published for a category on a given day.
// Used by the scheduler to stay within the per-day cap across restarts.
export async function publishedTodayCount(category, day) {
  return AutopilotSource.countDocuments({
    category,
    day,
    dryRun: { $ne: true },
    newsPostId: { $exists: true, $ne: null },
  });
}

// Recent published headlines in a category — fed to the AI so it avoids
// re-covering topics we've already published.
export async function recentHeadlines(category, limit = 15) {
  // "Our City" articles are stored as "हमारा शहर <City>" — match the whole family
  // by prefix for topic-avoidance, not just the bare umbrella string.
  const filter =
    category === CITY_CATEGORY
      ? { navbarCategories: { $regex: `^${CITY_CATEGORY}` } }
      : { navbarCategories: category };
  const docs = await News.find(filter, { title: 1, conclusion: 1 })
    .sort({ createdAt: -1 })
    .limit(limit)
    .lean();
  // Strip the HTML wrapper the site stores titles in.
  return docs.map((d) =>
    String(d.title || "")
      .replace(/<[^>]+>/g, " ")
      .replace(/\s+/g, " ")
      .trim()
  );
}
