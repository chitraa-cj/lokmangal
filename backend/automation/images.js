// Featured-image validation and resolution.
import axios from "axios";
import { env, USER_AGENT } from "./config.js";
import { fetchArticleMeta } from "./sources/common.js";

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

// Resolve the best *verified* featured image for a candidate.
// Tries: the candidate's own image, then the article page's og:image, then default.
export async function resolveFeaturedImage(candidate) {
  const tried = new Set();
  const tryUrl = async (url) => {
    if (!url || tried.has(url) || !isValidFeaturedImage(url)) return null;
    tried.add(url);
    return (await imageLoads(url)) ? url : null;
  };

  let ok = await tryUrl(candidate.imgUrl);
  if (ok) return ok;

  try {
    const meta = await fetchArticleMeta(candidate.sourceUrl);
    ok = await tryUrl(meta.image);
    if (ok) return ok;
  } catch (_) {
    /* fall through */
  }

  return env.defaultImage;
}
