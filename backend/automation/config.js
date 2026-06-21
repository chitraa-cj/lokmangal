// Central configuration for the News Autopilot pipeline.
// Categories, per-category source queries, editorial guidance for the AI,
// footer tags, freshness rules and the daily publishing schedule.
import "./loadEnv.js"; // ensure .env is loaded before reading process.env below

const bool = (v, def = false) =>
  v === undefined ? def : ["1", "true", "yes", "on"].includes(String(v).toLowerCase());
const int = (v, def) => {
  const n = parseInt(v, 10);
  return Number.isFinite(n) ? n : def;
};
const float = (v, def) => {
  const n = parseFloat(v);
  return Number.isFinite(n) ? n : def;
};

export const env = {
  enabled: bool(process.env.AUTOPILOT_ENABLED, false),
  dryRun: bool(process.env.AUTOPILOT_DRY_RUN, false),
  openaiKey: process.env.OPENAI_API_KEY || "",
  openaiModel: process.env.OPENAI_MODEL || "gpt-4o-mini",
  // Vision-capable model used by the image guard (gpt-4o-mini supports vision).
  openaiVisionModel: process.env.OPENAI_VISION_MODEL || process.env.OPENAI_MODEL || "gpt-4o-mini",
  serperKey: process.env.SERPER_API_KEY || "",
  authorUsername: process.env.AUTOPILOT_AUTHOR_USERNAME || "",
  timezone: process.env.AUTOPILOT_TIMEZONE || "Asia/Kolkata",

  // How many articles to publish per category per day. Each day a category gets
  // `minPerCategory`, and with probability `extraChance` one more, up to `maxPerCategory`.
  minPerCategory: int(process.env.AUTOPILOT_MIN_PER_CATEGORY, 1),
  maxPerCategory: int(process.env.AUTOPILOT_MAX_PER_CATEGORY, 2),
  extraChance: float(process.env.AUTOPILOT_EXTRA_CHANCE, 0.35),

  // Daily window (HH:MM, in the editorial timezone) within which articles are
  // published at random times.
  dayStart: process.env.AUTOPILOT_DAY_START || "08:00",
  dayEnd: process.env.AUTOPILOT_DAY_END || "22:00",

  onlyToday: bool(process.env.AUTOPILOT_ONLY_TODAY, false),
  maxAgeDays: int(process.env.AUTOPILOT_MAX_AGE_DAYS, 2),
  perSourceLimit: int(process.env.AUTOPILOT_PER_SOURCE_LIMIT, 15),
  defaultImage:
    process.env.AUTOPILOT_DEFAULT_IMAGE ||
    "https://res.cloudinary.com/dwhtm8byj/image/upload/v1776178764/mdjzos2cseonbcqp7ioo.jpg",

  // --- Compliance guards ---------------------------------------------------
  // Vision check that rejects images carrying another publication's watermark,
  // logo, channel bug or news-agency credit (the TOI-logo incident). When a
  // candidate has no clean image, the whole article is dropped.
  imageGuard: bool(process.env.AUTOPILOT_IMAGE_GUARD, true),
  // If true, an image that cannot be *verified* (download/vision error) is
  // allowed through. Default false = fail closed (reject on any doubt).
  imageGuardFailOpen: bool(process.env.AUTOPILOT_IMAGE_GUARD_FAIL_OPEN, false),
  // Hard-reject any image hot-linked from a known publisher/agency/stock CDN,
  // before downloading. Off by default because our sources ARE publishers and
  // their own (often clean) og:image lives on these CDNs — the vision check is
  // the real gate. Turn on for the strictest, no-hotlinking posture.
  blockPublisherCdn: bool(process.env.AUTOPILOT_BLOCK_PUBLISHER_CDN, false),
  // Text check that rejects a rewritten article still carrying source
  // attribution (publisher names, agency credits, bylines, "read more", ©).
  contentGuard: bool(process.env.AUTOPILOT_CONTENT_GUARD, true),
  // Detail level for the vision watermark check. "high" is most accurate (catches
  // small corner logos) but costs more tokens; "low" is a flat ~85 tokens/image.
  visionDetail: ["low", "high", "auto"].includes(process.env.AUTOPILOT_VISION_DETAIL)
    ? process.env.AUTOPILOT_VISION_DETAIL
    : "high",

  // --- OpenAI spend cap ----------------------------------------------------
  // Hard daily ceiling so a runaway loop or a bad retry day can't run up a large
  // bill. Checked before every OpenAI call; the day's totals persist in MongoDB
  // (AutopilotUsage) so the cap survives restarts. 0 = that limit is disabled.
  budgetEnabled: bool(process.env.AUTOPILOT_BUDGET_ENABLED, true),
  maxDailyCalls: int(process.env.AUTOPILOT_MAX_DAILY_CALLS, 500),
  maxDailyTokens: int(process.env.AUTOPILOT_MAX_DAILY_TOKENS, 2000000),
};

// Polite identification for outbound scraping requests.
export const USER_AGENT =
  "Mozilla/5.0 (compatible; LokmangalNewsBot/1.0; +https://thelokmangal.com)";

// Never scrape our own site as a "source".
export const BLOCKED_DOMAINS = ["thelokmangal.com", "lokmangal.com"];

// The 8 navbar categories (exact strings stored in News.navbarCategories).
// Mirrors frontend/src/Utils/navConfig.js.
export const CATEGORIES = [
  "देश",
  "दुनिया",
  "प्रदेशक ख़बरें",
  "राजनीति",
  "अपराध",
  "खेल",
  "हमारा शहर",
  "मनोरंजन",
];

// Google News RSS search queries per category (English, India-focused, last 1 day).
// `हमारा शहर` (Our City) rotates across MP cities.
export const CATEGORY_QUERIES = {
  देश: ["India national news today when:1d"],
  दुनिया: ["world news international today India when:1d"],
  "प्रदेशक ख़बरें": ["Madhya Pradesh state regional news today when:1d"],
  राजनीति: ["India politics news today when:1d"],
  अपराध: ["India crime news today when:1d"],
  खेल: ["India sports news today -IPL when:1d"],
  "हमारा शहर": [
    "Bhopal news today when:1d",
    "Indore news today when:1d",
    "Jabalpur news today when:1d",
  ],
  मनोरंजन: ["Bollywood entertainment news today when:1d"],
};

// InShorts English category slug per navbar category (only where it maps cleanly).
export const INSHORTS_CATEGORY = {
  देश: "national",
  दुनिया: "world",
  राजनीति: "politics",
  खेल: "sports",
  मनोरंजन: "entertainment",
  अपराध: "crime",
};

// Editorial guidance fed to the AI for selection + rewriting per category.
export const EDITORIAL_GUIDE = {
  देश: "National India news readers click on: geopolitical twists, big government announcements, security/terror plots, elections, policy shocks.",
  दुनिया: "World news: ongoing geopolitical crises, major decisions by world leaders, conflicts, global events affecting India.",
  "प्रदेशक ख़बरें": "Regional/state news (focus Madhya Pradesh and neighbouring states): governance, local administration, regional development, weather/disasters.",
  राजनीति: "Politics: power moves happening NOW — alliances, defections, cabinet changes, election strategy. Not post-mortems of months-old events.",
  अपराध: "Crime: significant cases, arrests, investigations, court verdicts with public interest. Avoid graphic exploitation.",
  खेल: "Sports that are STILL relevant today — not finished leagues. Do NOT use IPL/IPL-team match stories (season over). Prefer active international cricket/football, national team news, current tournaments, transfers, injuries.",
  "हमारा शहर": "City news for Bhopal/Indore/Jabalpur: civic issues, local events, infrastructure, local administration, things residents care about today.",
  मनोरंजन: "Entertainment: viral NOW — new film/trailer drops, casting news, box office this week, celebrity news. Clickable tabloid energy is fine.",
};

// Footer tags (must match what the site uses elsewhere).
export const FOOTER_TAGS = [
  "Madhya Pradesh News",
  "Uttar Pradesh News",
  "Rajasthan News",
  "Global News",
  "Health News",
  "Fitness News",
  "Fashion News",
  "Spirituality",
  "Bollywood News",
  "TV Serials",
  "Hollywood News",
  "Movie Reviews",
];

export const CATEGORY_DEFAULT_FOOTER = {
  देश: "Madhya Pradesh News",
  दुनिया: "Global News",
  "प्रदेशक ख़बरें": "Madhya Pradesh News",
  राजनीति: "Madhya Pradesh News",
  अपराध: "Madhya Pradesh News",
  खेल: "Health News",
  "हमारा शहर": "Madhya Pradesh News",
  मनोरंजन: "Bollywood News",
};

// Per-category freshness ceiling (days) used when onlyToday is false.
// Kept tight so we publish genuinely recent news; selection always prefers the
// freshest available within this window.
export const CATEGORY_MAX_AGE = {
  देश: 2,
  दुनिया: 2,
  राजनीति: 2,
  अपराध: 3,
  खेल: 3,
  मनोरंजन: 4,
  "प्रदेशक ख़बरें": 3,
  "हमारा शहर": 3,
};
