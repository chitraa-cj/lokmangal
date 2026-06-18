// Generic, config-driven scraper for the best Indian news sites.
// For each site we list a section URL (or URLs) per category and a regex that
// matches that site's article URLs. We pull article links from the section page;
// the real publisher article page later yields a verified og:image + full body.
import { env } from "../config.js";
import { fetchHtml, sourceIdFromUrl, isBlockedUrl } from "./common.js";

// India Today article URLs end in "-<id>-YYYY-MM-DD" → date is free.
const indiaTodayDate = (u) => {
  const m = /-(\d{4}-\d{2}-\d{2})$/.exec(u);
  return m ? new Date(`${m[1]}T08:00:00+05:30`).toISOString() : null;
};

const SITES = [
  {
    name: "India Today",
    articleRe: /indiatoday\.in\/.+\/story\//i,
    skipRe: /\/(video|videos|live-|photo|photos|podcast|auto)\b/i,
    dateFromUrl: indiaTodayDate,
    sections: {
      देश: "https://www.indiatoday.in/india",
      दुनिया: "https://www.indiatoday.in/world",
      राजनीति: "https://www.indiatoday.in/india",
      // (India Today's /crime feed serves stale cached links — crime is covered
      //  by Times of India + Hindustan Times instead.)
      खेल: "https://www.indiatoday.in/sports",
      मनोरंजन: "https://www.indiatoday.in/movies",
    },
  },
  {
    name: "Times of India",
    articleRe: /timesofindia\.indiatimes\.com\/.+\/articleshow\/\d+\.cms/i,
    skipRe: /\/(videos|photo|photos|web-stories)\b/i,
    dateFromUrl: null,
    sections: {
      देश: "https://timesofindia.indiatimes.com/india",
      दुनिया: "https://timesofindia.indiatimes.com/world",
      राजनीति: "https://timesofindia.indiatimes.com/india",
      अपराध: "https://timesofindia.indiatimes.com/topic/crime",
      खेल: "https://timesofindia.indiatimes.com/sports",
      मनोरंजन: "https://timesofindia.indiatimes.com/entertainment",
      "प्रदेशक ख़बरें": [
        "https://timesofindia.indiatimes.com/city/bhopal",
        "https://timesofindia.indiatimes.com/topic/madhya-pradesh",
      ],
      "हमारा शहर": [
        "https://timesofindia.indiatimes.com/city/bhopal",
        "https://timesofindia.indiatimes.com/city/indore",
        "https://timesofindia.indiatimes.com/city/jabalpur",
      ],
    },
  },
  {
    name: "Hindustan Times",
    articleRe: /hindustantimes\.com\/.+\/[a-z0-9-]+-\d{6,}\.html/i,
    skipRe: /\/(videos|photos|web-stories)\b/i,
    dateFromUrl: null,
    sections: {
      देश: "https://www.hindustantimes.com/india-news",
      दुनिया: "https://www.hindustantimes.com/world-news",
      राजनीति: "https://www.hindustantimes.com/india-news",
      अपराध: "https://www.hindustantimes.com/topic/crime",
      खेल: "https://www.hindustantimes.com/sports",
      मनोरंजन: "https://www.hindustantimes.com/entertainment",
      "प्रदेशक ख़बरें": "https://www.hindustantimes.com/cities/bhopal-news",
      "हमारा शहर": [
        "https://www.hindustantimes.com/cities/bhopal-news",
        "https://www.hindustantimes.com/cities/indore-news",
      ],
    },
  },
];

function absolutize(href, origin) {
  if (href.startsWith("http")) return href;
  if (href.startsWith("//")) return `https:${href}`;
  if (href.startsWith("/")) return `${origin}${href}`;
  return null;
}

async function scrapeSiteSection(site, category, sectionUrl) {
  const loaded = await fetchHtml(sectionUrl, { delayMs: 500, referer: "https://www.google.com/" });
  if (!loaded) return [];
  const { $ } = loaded;
  const origin = new URL(sectionUrl).origin;
  const seen = new Set();
  const out = [];

  $("a[href]").each((_, el) => {
    if (out.length >= env.perSourceLimit) return;
    const href = absolutize(($(el).attr("href") || "").trim(), origin);
    if (!href) return;
    const clean = href.split("#")[0].split("?")[0];
    if (!site.articleRe.test(clean) || site.skipRe.test(clean) || isBlockedUrl(clean)) return;
    if (seen.has(clean)) return;
    const title = ($(el).attr("title") || $(el).text() || "").replace(/\s+/g, " ").trim();
    if (title.length < 20) return; // skip nav/teaser/section links
    seen.add(clean);
    out.push({
      id: sourceIdFromUrl(clean),
      title,
      summary: "",
      url: clean,
      sourceUrl: clean,
      sourceName: site.name,
      createdAt: site.dateFromUrl ? site.dateFromUrl(clean) : null,
      views: 0,
      imgUrl: null, // resolved from the article's og:image during enrichment
      navbarCategories: category,
      origin: "site_scrape",
    });
  });
  return out;
}

// Scrape every configured site for a category, in parallel.
export async function fetchSites(category) {
  const tasks = [];
  for (const site of SITES) {
    const sec = site.sections[category];
    if (!sec) continue;
    for (const url of Array.isArray(sec) ? sec : [sec]) {
      tasks.push(scrapeSiteSection(site, category, url).catch(() => []));
    }
  }
  const results = await Promise.all(tasks);
  return results.flat();
}
