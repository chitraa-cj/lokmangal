export const NAV_CATEGORIES = [
  { id: "home", en: "Home", hi: "होम", categorySlug: null },
  { id: "nation", en: "Nation", hi: "देश", categorySlug: "देश" },
  { id: "world", en: "World", hi: "दुनिया", categorySlug: "दुनिया" },
  {
    id: "state",
    en: "State News",
    hi: "प्रदेशक ख़बरें",
    categorySlug: "प्रदेशक ख़बरें",
  },
  { id: "politics", en: "Politics", hi: "राजनीति", categorySlug: "राजनीति" },
  { id: "crime", en: "Crime", hi: "अपराध", categorySlug: "अपराध" },
  { id: "sports", en: "Sports", hi: "खेल", categorySlug: "खेल" },
  {
    id: "cities",
    en: "Our City",
    hi: "हमारा शहर",
    categorySlug: null,
    hasDropdown: true,
  },
  {
    id: "entertainment",
    en: "Entertainment",
    hi: "मनोरंजन",
    categorySlug: "मनोरंजन",
  },
];

// categorySlug must match the stored News.navbarCategories convention:
// "हमारा शहर <City>" (e.g. "हमारा शहर Bhopal"). The "हमारा शहर " prefix was
// dropped earlier, which broke these pages — keep it here.
export const CITY_OPTIONS = [
  {
    en: "Bhopal",
    hi: "भोपाल",
    categorySlug: "हमारा शहर Bhopal",
  },
  {
    en: "Jabalpur",
    hi: "जबलपुर",
    categorySlug: "हमारा शहर Jabalpur",
  },
  {
    en: "Indore",
    hi: "इंदौर",
    categorySlug: "हमारा शहर Indore",
  },
  {
    en: "Maharashtra",
    hi: "महाराष्ट्र",
    categorySlug: "हमारा शहर Maharashtra",
  },
];

export const FALLBACK_HASHTAGS = [
  { en: "#BreakingNews", hi: "#ब्रेकिंगन्यूज़", slug: "#ब्रेकिंगन्यूज़" },
  { en: "#LocalNews", hi: "#स्थानीयन्यूज़", slug: "#स्थानीयन्यूज़" },
  { en: "#TechTrends", hi: "#टेकट्रेंड्स", slug: "#टेकट्रेंड्स" },
  { en: "#HealthUpdates", hi: "#स्वास्थ्यअद्यतन", slug: "#स्वास्थ्यअद्यतन" },
  { en: "#SportsHighlights", hi: "#खेलहाइलाइट्स", slug: "#खेलहाइलाइट्स" },
  { en: "#Community", hi: "#समुदाय", slug: "#समुदाय" },
];

const HASHTAG_LABEL_BY_SLUG = Object.fromEntries(
  FALLBACK_HASHTAGS.map((tag) => [tag.slug, tag]),
);

export const getHashtagLabel = (slug, language = "en") => {
  const mapped = HASHTAG_LABEL_BY_SLUG[slug];
  if (mapped) {
    return language === "hi" ? mapped.hi : mapped.en;
  }
  return slug;
};

export const getCategoryLabel = (category, language = "en") => {
  return language === "hi" ? category.hi : category.en;
};

export const getCityLabel = (city, language = "en") => {
  return language === "hi" ? city.hi : city.en;
};
