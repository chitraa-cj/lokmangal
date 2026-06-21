// Image compliance guard — the legal gate before an image becomes a featured image.
//
// Catches the "TOI logo" class of incident: pictures that carry another
// publication's watermark, a TV-channel bug/DOG, a corner logo, or a news-agency /
// stock credit (PTI, ANI, Reuters, AFP, Getty, Shutterstock, ...). The structural
// check in images.js only proves a URL *is* an image; this proves the image is
// *ours to use*.
//
// Two layers:
//   1. domain reputation  — is the image hot-linked from a known publisher/agency/
//                           stock CDN? (cheap, no download)
//   2. vision inspection  — does the image itself carry watermarks/logos/credits?
//                           (OpenAI vision pass over the actual pixels)
//
// Fails CLOSED: if we cannot prove an image is clean, it is rejected (unless
// AUTOPILOT_IMAGE_GUARD_FAIL_OPEN=true).
import axios from "axios";
import { env, USER_AGENT } from "./config.js";
import { createChatCompletion } from "./openaiClient.js";

// Known publisher / wire-agency / stock-photo domains. Images from these are
// almost always copyrighted and frequently watermarked. Used for the domain
// reputation flag (and, when AUTOPILOT_BLOCK_PUBLISHER_CDN=on, a hard reject).
const PUBLISHER_CDN =
  /(timesofindia|toiimg|indiatimes|hindustantimes|htmedia|livehindustan|ndtv|indianexpress|indiatoday|news18|aajtak|abplive|zeenews|jagran|bhaskar|amarujala|livemint|thehindu|deccanherald|deccanchronicle|telegraphindia|economictimes|financialexpress|firstpost|republicworld|tribuneindia|outlookindia|scroll\.in|theprint|wionews|opindia|thequint|moneycontrol|business-standard|dnaindia|freepressjournal|patrika|navbharattimes|gettyimages|gstatic|shutterstock|istockphoto|stockphoto|alamy|reuters|apnews|bloomberg|afp\.com|pti|ani(news)?)/i;

const MAX_BYTES = 8 * 1024 * 1024; // skip huge downloads; 8MB is plenty for vision

// Cheap, no-network reputation check on the image URL's host.
export function domainReputation(url) {
  try {
    const host = new URL(url).hostname;
    const m = PUBLISHER_CDN.exec(host);
    return { flagged: !!m, publisher: m ? m[1] : null };
  } catch (_) {
    return { flagged: false, publisher: null };
  }
}

// Download the image bytes and return a data URL for the vision call.
async function fetchImageDataUrl(url) {
  const res = await axios.get(url, {
    timeout: 12000,
    maxRedirects: 5,
    responseType: "arraybuffer",
    maxContentLength: MAX_BYTES,
    headers: { "User-Agent": USER_AGENT, Accept: "image/*" },
    validateStatus: (s) => s >= 200 && s < 400,
  });
  const type = String(res.headers["content-type"] || "").toLowerCase();
  if (!/^image\//.test(type)) throw new Error(`not an image (${type || "unknown"})`);
  const b64 = Buffer.from(res.data).toString("base64");
  return `data:${type};base64,${b64}`;
}

const VISION_SYSTEM =
  "You are a strict image-rights compliance reviewer for a news publisher. " +
  "Your job is to reject any image that is NOT safe to republish as our own. " +
  "Respond with JSON only.";

const VISION_PROMPT = `Inspect this image for ANY sign that it belongs to or was produced by a third party. Look carefully at all four corners, edges and any overlaid text — watermarks are often faint, small or semi-transparent.

Flag the image if it contains ANY of:
- a newspaper/website/publication watermark or logo (e.g. "TOI", "Times of India", "HT", "Hindustan Times", "NDTV", "India Today", "ABP", "Zee", "Aaj Tak", "Dainik Bhaskar", "Jagran", or any masthead).
- a TV-channel bug / on-screen graphic (a channel logo sitting in a corner).
- a news-agency or stock credit ("PTI", "ANI", "Reuters", "AFP", "AP", "IANS", "Getty Images", "Shutterstock", "iStock", "Alamy").
- a photographer/agency credit line, a copyright notice (©), a website URL or a social handle (@...) burned into the image.
- the image is clearly a SCREENSHOT of another news site, app or social post (visible UI chrome, headlines, "Read more" buttons).

Return JSON:
{
  "clean": true|false,            // true ONLY if NONE of the above is present
  "hasWatermark": true|false,
  "hasPublicationLogo": true|false,
  "hasChannelBug": true|false,
  "hasAgencyOrStockCredit": true|false,
  "hasBurnedInText": true|false,  // URL, handle, ©, credit line
  "isScreenshot": true|false,
  "brands": ["..."],              // any brand/agency names you can read
  "reason": "one short sentence"
}
If you are unsure whether faint text is a watermark, set clean=false.`;

// Vision pass over the actual image pixels. Returns a verdict object.
async function inspectPixels(url) {
  const dataUrl = await fetchImageDataUrl(url);
  const res = await createChatCompletion({
    model: env.openaiVisionModel,
    temperature: 0,
    response_format: { type: "json_object" },
    messages: [
      { role: "system", content: VISION_SYSTEM },
      {
        role: "user",
        content: [
          { type: "text", text: VISION_PROMPT },
          { type: "image_url", image_url: { url: dataUrl, detail: env.visionDetail } },
        ],
      },
    ],
  });
  const raw = res.choices?.[0]?.message?.content || "{}";
  return JSON.parse(raw);
}

// Full verdict for one image URL.
// Returns { clean: boolean, reason: string, flags: {...} }.
export async function validateImage(url) {
  if (!env.imageGuard) return { clean: true, reason: "guard disabled", flags: {} };

  const rep = domainReputation(url);
  if (rep.flagged && env.blockPublisherCdn) {
    return {
      clean: false,
      reason: `hot-linked from publisher/agency CDN (${rep.publisher})`,
      flags: { domain: rep },
    };
  }

  try {
    const v = await inspectPixels(url);
    const clean = v.clean === true;
    if (!clean) {
      const brands = Array.isArray(v.brands) && v.brands.length ? ` [${v.brands.join(", ")}]` : "";
      return {
        clean: false,
        reason: `${v.reason || "watermark/logo/credit detected"}${brands}`,
        flags: { domain: rep, vision: v },
      };
    }
    return { clean: true, reason: "no watermark/logo/credit", flags: { domain: rep, vision: v } };
  } catch (err) {
    if (err.budgetExceeded) throw err; // spend cap hit — stop the wave, don't keep paying
    // Could not verify (download blocked, bad content-type, vision/API error).
    if (env.imageGuardFailOpen) {
      return { clean: true, reason: `unverified, fail-open (${err.message})`, flags: { domain: rep } };
    }
    return { clean: false, reason: `could not verify image (${err.message})`, flags: { domain: rep } };
  }
}
