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

// Per-city Serper (Google News) query. The city bucket runs once PER CITY (see
// scheduler + pipeline), each scoped to just this query so every city — including
// Maharashtra, which the pooled single-pick used to starve — gets its own slot.
// NOTE: never append `when:1d` (Serper's News endpoint silently returns ZERO
// results for it; recency is enforced by freshnessOk()/CATEGORY_MAX_AGE instead).
export const CITY_QUERIES = {
  Bhopal: "Bhopal city news today",
  Indore: "Indore city news today",
  Jabalpur: "Jabalpur city news today",
  Maharashtra: "Maharashtra Mumbai Pune Nagpur Nashik news today",
};

// Per-city editorial guidance fed to the AI relevance filter, selector and
// rewriter for that city's run. Each names its own city so Maharashtra stories
// are no longer judged off-topic against a Bhopal/Indore/Jabalpur-only guide.
export const CITY_GUIDE = {
  Bhopal: "City news for Bhopal: civic issues, local events, infrastructure, local administration, things Bhopal residents care about today.",
  Indore: "City news for Indore: civic issues, local events, infrastructure, local administration, things Indore residents care about today.",
  Jabalpur: "City news for Jabalpur: civic issues, local events, infrastructure, local administration, things Jabalpur residents care about today.",
  Maharashtra: "City news for Maharashtra (Mumbai, Pune, Nagpur, Nashik, Thane): civic issues, local events, infrastructure, city/state administration, things residents across Maharashtra care about today.",
};

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
