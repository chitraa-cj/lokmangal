// Featured-image validation and resolution.
import axios from "axios";
import { USER_AGENT } from "./config.js";
import { fetchArticleMeta } from "./sources/common.js";
import { validateImage } from "./imageGuard.js";

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

// Resolve the best *clean, verified* featured image for a candidate.
// Tries the candidate's own image, then the article page's og:image; each must
// (a) load as a real image and (b) pass the compliance guard (no watermark,
// publication logo, channel bug or agency/stock credit). Returns the first URL
// that passes, or null if none do — the caller drops the article in that case.
export async function resolveFeaturedImage(candidate) {
  const tried = new Set();
  const urls = [];
  const add = (url) => {
    if (url && !tried.has(url) && isValidFeaturedImage(url)) {
      tried.add(url);
      urls.push(url);
    }
  };

  add(candidate.imgUrl);
  try {
    const meta = await fetchArticleMeta(candidate.sourceUrl);
    add(meta.image);
  } catch (_) {
    /* fall through with whatever we have */
  }

  for (const url of urls) {
    if (!(await imageLoads(url))) continue;
    const verdict = await validateImage(url);
    if (verdict.clean) return url;
    console.warn(`[autopilot] image rejected — ${verdict.reason} (${url})`);
  }

  return null;
}
