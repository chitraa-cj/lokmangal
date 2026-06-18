// Serper.dev Google News API. Highest-quality candidates with real publisher
// URLs and real images. Only active when SERPER_API_KEY is set.
import axios from "axios";
import { env, CATEGORY_QUERIES } from "../config.js";
import { sourceIdFromUrl, isBlockedUrl } from "./common.js";

const ENDPOINT = "https://google.serper.dev/news";

// Serper returns relative dates ("2 hours ago", "1 day ago", "Yesterday").
// Convert to an approximate ISO timestamp so freshness filtering works.
function parseRelativeDate(text) {
  if (!text) return null;
  const t = String(text).toLowerCase().trim();
  const now = Date.now();
  if (/just now|minute|hour|today/.test(t)) {
    const h = /(\d+)\s*hour/.exec(t);
    return new Date(now - (h ? parseInt(h[1], 10) : 1) * 3600_000).toISOString();
  }
  if (/yesterday/.test(t)) return new Date(now - 24 * 3600_000).toISOString();
  const d = /(\d+)\s*day/.exec(t);
  if (d) return new Date(now - parseInt(d[1], 10) * 24 * 3600_000).toISOString();
  const parsed = new Date(text);
  return isNaN(parsed.getTime()) ? null : parsed.toISOString();
}

function validImg(url) {
  return url && /^https?:\/\//i.test(url) && !/gstatic|googleusercontent|\/logo|favicon/i.test(url);
}

export async function fetchSerper(category) {
  if (!env.serperKey) return [];
  const queries = CATEGORY_QUERIES[category] || [];
  const out = [];
  for (const q of queries) {
    let data;
    try {
      const res = await axios.post(
        ENDPOINT,
        { q, gl: "in", hl: "en", num: env.perSourceLimit },
        {
          timeout: 15000,
          headers: { "X-API-KEY": env.serperKey, "Content-Type": "application/json" },
        }
      );
      data = res.data;
    } catch (err) {
      console.warn(`[autopilot] Serper failed for "${q}": ${err.message}`);
      continue;
    }
    for (const n of (data?.news || []).slice(0, env.perSourceLimit)) {
      const link = n.link;
      if (!link || isBlockedUrl(link)) continue;
      out.push({
        id: sourceIdFromUrl(link),
        title: (n.title || "").trim(),
        summary: (n.snippet || "").trim().slice(0, 800),
        url: link,
        sourceUrl: link,
        sourceName: n.source || "Serper",
        createdAt: parseRelativeDate(n.date),
        views: 0,
        imgUrl: validImg(n.imageUrl) ? n.imageUrl : null,
        navbarCategories: category,
        origin: "serper",
      });
    }
  }
  return out;
}
