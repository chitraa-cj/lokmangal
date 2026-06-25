// Featured-image validation and resolution.
import axios from "axios";
import { USER_AGENT } from "./config.js";
import { fetchArticleMeta } from "./sources/common.js";
import { searchImages } from "./sources/serper.js";
import { searchFreeImages } from "./sources/freeImages.js";
import { validateImage } from "./imageGuard.js";

// Token budget guard for each search fallback: how many searched images we are
// willing to run through the (low-detail) vision guard before giving up. Kept
// small so a rejected source image costs at most a few extra cheap vision calls
// per provider.
const MAX_SEARCH_VALIDATIONS = 5;

const BAD_IMAGE =
  /news\.google|gstatic|googleusercontent|google\.com|\/logo|favicon|\/icon|placeholder|sprite|blank|spacer|1x1|pixel/i;

// Cheap structural check (no network).
export function isValidFeaturedImage(url) {
  if (!url || typeof url !== "string") return false;
  if (!/^https?:\/\//i.test(url)) return false;
  if (BAD_IMAGE.test(url)) return false;
  return true;
}

// Network check: confirm the URL actually serves an image (proper image sourcing).
async function imageLoads(url) {
  try {
    const res = await axios.head(url, {
      timeout: 8000,
      maxRedirects: 5,
      headers: { "User-Agent": USER_AGENT },
      validateStatus: (s) => s >= 200 && s < 400,
    });
    const type = String(res.headers["content-type"] || "");
    return /^image\//i.test(type);
  } catch (_) {
    // Some CDNs reject HEAD; fall back to a tiny ranged GET.
    try {
      const res = await axios.get(url, {
        timeout: 8000,
        maxRedirects: 5,
        responseType: "arraybuffer",
        headers: { "User-Agent": USER_AGENT, Range: "bytes=0-1024" },
        validateStatus: (s) => s >= 200 && s < 400,
      });
      return /^image\//i.test(String(res.headers["content-type"] || ""));
    } catch (_2) {
      return false;
    }
  }
}

// Turn a candidate headline into a short, clean Google Images query: strip HTML,
// drop trailing agency/byline+date tails (e.g. "… TNN / Jun 22, 2026, 00:18"),
// and keep it to the first dozen words so the search stays on-topic.
function imageSearchQuery(candidate) {
  let t = String(candidate.title || candidate.headlinePlain || "")
    .replace(/<[^>]+>/g, " ")
    .replace(/&[a-z]+;/gi, " ");
  // Cut everything from a wire-service/byline marker onward.
  t = t.split(/\b(?:TNN|PTI|ANI|IANS|TOI|Reuters|AFP)\b\s*\//i)[0];
  t = t.replace(/\s+/g, " ").trim();
  return t.split(/\s+/).slice(0, 12).join(" ");
}

// Resolve the best *clean, verified* featured image for a candidate.
// In order: the candidate's own image, then the article page's og:image, then —
// if both are rejected — a Serper (Google Images) search, then a free CC/public-
// domain search (Openverse + Wikimedia Commons). Each URL must (a) load as a
// real image and (b) pass the compliance guard — no watermark / publication
// logo / channel bug / screenshot, and also on-topic for the headline and decent
// (no glamour/NSFW). Returns the first URL that passes, or null if none do — the
// caller then falls back to our logo placeholder.
export async function resolveFeaturedImage(candidate) {
  const tried = new Set();

  // Validate a list of candidate URLs through the guard, spending at most
  // `budget` vision checks. Returns the first clean URL, or null.
  const tryUrls = async (urls, budget, label) => {
    let validations = 0;
    for (const url of urls) {
      if (validations >= budget) break;
      if (tried.has(url) || !isValidFeaturedImage(url)) continue;
      tried.add(url);
      if (!(await imageLoads(url))) continue;
      validations++;
      const verdict = await validateImage(url, { headline: candidate.title });
      if (verdict.clean) {
        if (label) console.log(`[autopilot] using ${label} image (${url})`);
        return url;
      }
      console.warn(`[autopilot] ${label || "image"} rejected — ${verdict.reason} (${url})`);
    }
    return null;
  };

  // 1. The candidate's own image + the article page's og:image. No vision budget
  //    cap here — these are the preferred sources and there are at most two.
  const ownUrls = [];
  if (candidate.imgUrl) ownUrls.push(candidate.imgUrl);
  try {
    const meta = await fetchArticleMeta(candidate.sourceUrl);
    if (meta.image) ownUrls.push(meta.image);
  } catch (_) {
    /* fall through with whatever we have */
  }
  const own = await tryUrls(ownUrls, ownUrls.length || 1, "source");
  if (own) return own;

  const query = imageSearchQuery(candidate);

  // 2. Serper (Google Images) — most topical, current news photos.
  const serperHit = await tryUrls(await searchImages(query, 10), MAX_SEARCH_VALIDATIONS, "searched");
  if (serperHit) return serperHit;

  // 3. Free, key-less CC / public-domain search (Openverse + Wikimedia Commons).
  //    Legally cleaner, runs when Serper is unset or found nothing usable.
  const freeHit = await tryUrls(await searchFreeImages(query, 10), MAX_SEARCH_VALIDATIONS, "free-licensed");
  if (freeHit) return freeHit;

  return null;
}
