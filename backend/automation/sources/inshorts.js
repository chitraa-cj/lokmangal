// InShorts source. Only the `top_stories` feed responds reliably, but each item
// carries its own category_names, a real article image and the real publisher URL.
// So we fetch the pool once per wave and bucket it into our categories locally.
import axios from "axios";
import { USER_AGENT } from "../config.js";
import { sourceIdFromUrl, isBlockedUrl } from "./common.js";

const POOL_URL =
  "https://inshorts.com/api/en/news?category=top_stories&max_limit=80&include_card_data=true";

// Map InShorts category_names (lowercased) -> our navbar category.
const MAP = {
  national: "देश",
  world: "दुनिया",
  politics: "राजनीति",
  sports: "खेल",
  fifa_world_cup_2026: "खेल",
  entertainment: "मनोरंजन",
  crime: "अपराध",
};

let cache = { at: 0, items: [] };
const POOL_TTL_MS = 10 * 60 * 1000; // one fetch comfortably covers a full wave

function mapCategory(names = []) {
  for (const n of names) {
    const m = MAP[String(n).toLowerCase()];
    if (m) return m;
  }
  return null;
}

function pickImage(n) {
  const img = n.image_url || n.gallery_image_urls?.[0] || null;
  if (!img || /placeholder|default/i.test(img)) return null;
  return img;
}

async function loadPool() {
  if (Date.now() - cache.at < POOL_TTL_MS && cache.items.length) return cache.items;
  try {
    const res = await axios.get(POOL_URL, {
      timeout: 15000,
      headers: { "User-Agent": USER_AGENT, Accept: "application/json" },
    });
    const list = res.data?.data?.news_list || [];
    const items = [];
    for (const wrap of list) {
      const n = wrap.news_obj || wrap;
      const category = mapCategory(n.category_names);
      const link = n.source_url || n.shortened_url;
      if (!category || !link || isBlockedUrl(link)) continue;
      items.push({
        id: sourceIdFromUrl(link),
        title: (n.title || "").trim(),
        summary: (n.content || "").trim().slice(0, 800),
        body: (n.content || "").trim(), // InShorts content is a clean ~60-word digest
        url: link,
        sourceUrl: link,
        sourceName: n.source_name || "InShorts",
        createdAt: n.created_at ? new Date(Number(n.created_at)).toISOString() : null,
        views: 0,
        imgUrl: pickImage(n),
        navbarCategories: category,
        origin: "inshorts",
      });
    }
    cache = { at: Date.now(), items };
  } catch (err) {
    console.warn(`[autopilot] InShorts pool fetch failed: ${err.message}`);
    if (!cache.items.length) cache = { at: Date.now(), items: [] };
  }
  return cache.items;
}

export async function fetchInshorts(category) {
  const pool = await loadPool();
  return pool.filter((c) => c.navbarCategories === category);
}
