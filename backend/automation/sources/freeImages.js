// Free, key-less image search — the fallback after the (paid) Serper image
// search and before the logo placeholder. Both providers return images that are
// legally reusable (Creative Commons / public domain), which is cleaner for a
// publisher than hot-linking a copyrighted news photo. Hit-rate is lower for
// breaking-news-specific scenes, so this runs only when Serper found nothing.
//
// Each returned URL is still vetted by the image guard (branding / relevance /
// decency) in images.js, exactly like Serper results.
import axios from "axios";
import { USER_AGENT } from "../config.js";

const OPENVERSE_ENDPOINT = "https://api.openverse.org/v1/images/";
const COMMONS_ENDPOINT = "https://commons.wikimedia.org/w/api.php";

function validImg(url) {
  return (
    url &&
    /^https?:\/\//i.test(url) &&
    !/gstatic|googleusercontent|\/logo|favicon/i.test(url)
  );
}

// Openverse (openverse.org) — CC-licensed images aggregated from Flickr,
// Wikimedia, museums, etc. `license_type=commercial` keeps only images cleared
// for commercial reuse. No API key required.
async function searchOpenverse(query, limit) {
  try {
    const res = await axios.get(OPENVERSE_ENDPOINT, {
      timeout: 15000,
      headers: { "User-Agent": USER_AGENT, Accept: "application/json" },
      params: { q: query, page_size: limit, license_type: "commercial", mature: false },
    });
    return (res.data?.results || []).map((r) => r.url).filter(validImg);
  } catch (err) {
    console.warn(`[autopilot] Openverse search failed for "${query}": ${err.message}`);
    return [];
  }
}

// Wikimedia Commons — public-domain / CC media. Strong for places, landmarks and
// well-known subjects; weak on fresh events. No API key required.
async function searchCommons(query, limit) {
  try {
    const res = await axios.get(COMMONS_ENDPOINT, {
      timeout: 15000,
      headers: { "User-Agent": USER_AGENT, Accept: "application/json" },
      params: {
        action: "query",
        generator: "search",
        gsrsearch: query,
        gsrnamespace: 6, // File: namespace
        gsrlimit: limit,
        prop: "imageinfo",
        iiprop: "url|mime",
        format: "json",
        origin: "*",
      },
    });
    const pages = res.data?.query?.pages || {};
    return Object.values(pages)
      .map((p) => p.imageinfo?.[0])
      .filter((info) => info && /^image\//i.test(info.mime || ""))
      .map((info) => info.url)
      .filter(validImg);
  } catch (err) {
    console.warn(`[autopilot] Wikimedia Commons search failed for "${query}": ${err.message}`);
    return [];
  }
}

// Combined free image search: Openverse first (broadest, most photographic),
// then Wikimedia Commons. Returns de-duplicated image URLs, best matches first.
export async function searchFreeImages(query, limit = 8) {
  if (!query) return [];
  const [openverse, commons] = await Promise.all([
    searchOpenverse(query, limit),
    searchCommons(query, Math.ceil(limit / 2)),
  ]);
  return [...new Set([...openverse, ...commons])];
}
