// Freshness / timeline filtering. Decides whether a candidate is recent enough
// to publish today, working in the configured editorial timezone (IST by default).
import { env, CATEGORY_MAX_AGE } from "./config.js";
import { fetchArticleMeta } from "./sources/common.js";

// Returns YYYY-MM-DD for a date in the editorial timezone.
function calendarDay(date, tz = env.timezone) {
  try {
    return new Intl.DateTimeFormat("en-CA", {
      timeZone: tz,
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
    }).format(date);
  } catch (_) {
    return date.toISOString().slice(0, 10);
  }
}

export function todayDay(tz = env.timezone) {
  return calendarDay(new Date(), tz);
}

function ageDays(createdAtIso) {
  if (!createdAtIso) return null;
  const t = new Date(createdAtIso).getTime();
  if (isNaN(t)) return null;
  return Math.max(0, (Date.now() - t) / 86400000);
}

// Hardcoded stale-sports guard (IPL season is over for the year).
const STALE_SPORTS = [
  /\bipl\b/i,
  /\bindian premier league\b/i,
];

function staleReason(candidate, category) {
  if (category === "खेल") {
    const text = `${candidate.title} ${candidate.summary}`;
    if (STALE_SPORTS.some((re) => re.test(text))) return "IPL/season-over content";
  }
  return null;
}

// Synchronous freshness check (no network). Use after candidates have been
// hydrated with publish dates.
export function freshnessOk(candidate, category) {
  if (staleReason(candidate, category)) return false;
  const age = ageDays(candidate.createdAt);
  const maxAge = CATEGORY_MAX_AGE[category] ?? env.maxAgeDays;
  if (age === null) return !env.onlyToday; // unknown date: keep only if not strict
  if (env.onlyToday) {
    return candidate.createdAt && calendarDay(new Date(candidate.createdAt)) === todayDay();
  }
  return age <= maxAge;
}

// Enrich candidates with timeline info and (optionally) fetch missing publish dates.
// Returns only candidates that pass the freshness rules.
export async function filterFresh(candidates, category, { hydrate = true, maxLookups = 18 } = {}) {
  const today = todayDay();
  const maxAge = CATEGORY_MAX_AGE[category] ?? env.maxAgeDays;

  // First pass: enrich with age + stale reasons; collect those missing dates for hydration.
  const enriched = [];
  const needHydration = [];
  for (const c of candidates) {
    const reason = staleReason(c, category);
    const entry = { ...c, ageDays: ageDays(c.createdAt), staleReason: reason };
    if (reason) continue;
    if (entry.ageDays === null && hydrate) needHydration.push(entry);
    enriched.push(entry);
  }

  // Hydrate a bounded number of date-less candidates from their article pages.
  for (const entry of needHydration.slice(0, maxLookups)) {
    try {
      const meta = await fetchArticleMeta(entry.sourceUrl);
      if (meta.publishedAt) {
        entry.createdAt = meta.publishedAt;
        entry.ageDays = ageDays(meta.publishedAt);
      }
      if (!entry.imgUrl && meta.image) entry.imgUrl = meta.image;
      if (!entry.body && meta.body) entry.body = meta.body;
    } catch (_) {
      /* leave undated */
    }
  }

  // Final freshness decision.
  return enriched.filter((c) => {
    if (c.ageDays === null) {
      // Unknown date: keep only if we are not strictly today-only.
      return !env.onlyToday;
    }
    if (env.onlyToday) {
      return c.createdAt && calendarDay(new Date(c.createdAt)) === today;
    }
    return c.ageDays <= maxAge;
  });
}
