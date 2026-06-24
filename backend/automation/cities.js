// City handling for the "हमारा शहर" (Our City) category.
//
// Our-City articles are stored under a per-city value following the existing DB
// convention: "हमारा शहर <City>" (e.g. "हमारा शहर Bhopal"). The "हमारा शहर"
// prefix marks it as Our-City; the city suffix lets the per-city navbar dropdown
// (/category/हमारा शहर Bhopal, …) filter them. City slugs here must match the
// suffixes used in frontend navConfig CITY_OPTIONS.
export const CITY_CATEGORY = "हमारा शहर";

// Canonical city slug -> match patterns (English + Hindi + nearby places that
// should roll up to that city/region). Order matters: the specific MP cities are
// checked before the broader Maharashtra bucket.
const CITY_PATTERNS = [
  { slug: "Bhopal", re: /\bbhopal\b|भोपाल/i },
  { slug: "Indore", re: /\bindore\b|इंदौर|इन्दौर/i },
  { slug: "Jabalpur", re: /\bjabalpur\b|जबलपुर/i },
  {
    slug: "Maharashtra",
    re: /\bmaharashtra\b|महाराष्ट्र|\bmumbai\b|मुंबई|\bpune\b|पुणे|\bnagpur\b|नागपुर|\bnashik\b|नासिक|\bthane\b|ठाणे|\bnavi mumbai\b/i,
  },
];

export const CITY_SLUGS = CITY_PATTERNS.map((c) => c.slug);

// The stored navbarCategories value for a city article, e.g. "हमारा शहर Bhopal".
export function cityCategory(citySlug) {
  return `${CITY_CATEGORY} ${citySlug}`;
}

// Detect which city a piece of text is about. Returns the canonical slug, or
// null if no known city is mentioned.
export function detectCity(text = "") {
  const t = String(text);
  for (const { slug, re } of CITY_PATTERNS) {
    if (re.test(t)) return slug;
  }
  return null;
}
