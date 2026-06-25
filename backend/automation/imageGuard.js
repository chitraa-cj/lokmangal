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
  "You are a strict reviewer for a news publisher. You judge whether an image is " +
  "(a) legally safe to republish as our own and (b) editorially suitable as the " +
  "featured photo for a specific news story. Respond with JSON only.";

// The prompt is built per-image so the model can judge RELEVANCE against the
// actual headline. Rejection here is cheap: the caller falls back to our own
// logo placeholder rather than dropping the story, so erring toward rejecting a
// dubious image is safe.
function buildVisionPrompt(headline) {
  return `You are vetting an image proposed as the featured photo for this news story:

HEADLINE: "${headline || "(headline unavailable)"}"

GUIDING PRINCIPLE — relevance comes first, and we LEAN TOWARD KEEPING images. If the image is a real photograph that is even loosely related to this story and is decent, it is USABLE: return clean=true. When in doubt, KEEP it (clean=true). Reject ONLY when you are confident one of the specific, concrete reasons below clearly applies.

REJECT the image ONLY if ANY of the following is clearly true:

A. BRANDING — it is plainly another outlet's property:
- The image IS essentially a logo, masthead or branding card rather than a real photograph — a solid-colour or graphic panel whose main content is a publication/channel name like "TOI", "Times of India", "HT", "Hindustan Times", "NDTV", "India Today", "ABP", "Zee", "Aaj Tak", "Dainik Bhaskar", "Jagran" (the placeholder cards publishers serve when an article has no real photo).
- A newspaper/website/TV-channel LOGO or WATERMARK DOMINATES the photo — a large, legible masthead stamped across the image or a big semi-transparent watermark covering much of it. A small, faint, partial or corner credit/bug that does not dominate the picture is FINE — do NOT reject for that.
- The image is clearly a SCREENSHOT of another news site, app or social post (visible UI chrome, headlines, "Read more" buttons).

B. IRRELEVANT — it is obviously about something else entirely:
- Reject only when the image has NO plausible connection at all to the headline — e.g. a glamour/model portrait, an unrelated celebrity, or a random product shot with nothing to do with the story. Any generic photo that could plausibly fit (a building, a crowd, officials, a relevant location, a related object, a representative scene) counts as RELEVANT — keep it.

C. INAPPROPRIATE — it is unsuitable atop a general-audience news story:
- Clearly sexual/pin-up, swimwear/lingerie or otherwise not-safe-for-work imagery, or graphic gore. A normal, fully-clothed person or ordinary news scene is FINE.

Do NOT reject a plain, on-topic, decent photograph just because it may have been shot by a news agency, carries a faint credit line, or merely "looks like a news photo" — we care only about clear branding that dominates, total irrelevance, and genuine indecency. Do NOT reject on vague guesses; only reject when you can point to a concrete, obvious reason.

Return JSON:
{
  "clean": true|false,                       // false if ANY flag below is true
  "isLogoOrBrandingCard": true|false,        // the image IS a logo/masthead/branding graphic, not a photo
  "hasPublicationOrChannelLogo": true|false, // a publisher/TV logo or watermark overlaid on a photo
  "isScreenshot": true|false,                // a screenshot of another site/app/social post
  "isIrrelevant": true|false,                // image content does not match the headline
  "isInappropriate": true|false,             // sexual/glamour/NSFW/gore — unfit as a news photo
  "brands": ["..."],                         // any publication/channel names you can actually read
  "reason": "one short sentence — cite the specific problem, or say why it is clean"
}`;
}

// Vision pass over the actual image pixels. Returns a verdict object.
// `context.headline` lets the model judge relevance to the specific story.
async function inspectPixels(url, context = {}) {
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
          { type: "text", text: buildVisionPrompt(context.headline) },
          { type: "image_url", image_url: { url: dataUrl, detail: env.visionDetail } },
        ],
      },
    ],
  });
  const raw = res.choices?.[0]?.message?.content || "{}";
  return JSON.parse(raw);
}

// Full verdict for one image URL.
// `context.headline` is the story headline, used to judge relevance.
// Returns { clean: boolean, reason: string, flags: {...} }.
export async function validateImage(url, context = {}) {
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
    const v = await inspectPixels(url, context);
    // Reject when the image is the source publisher's own branding — a
    // logo/masthead/branding card (the "TOI card" incident), a prominent
    // publication/channel logo or watermark, or a screenshot of another outlet —
    // OR when it is clearly off-topic for this story or indecent (a glamour/model
    // shot on a school-poisoning story is the case this caught). A vague
    // clean=false with none of these flags set is still ignored. Rejection is not
    // a drop: the caller falls back to our logo placeholder.
    const detected =
      v.isLogoOrBrandingCard === true ||
      v.hasPublicationOrChannelLogo === true ||
      v.isScreenshot === true ||
      v.isIrrelevant === true ||
      v.isInappropriate === true;
    const clean = !detected;
    if (!clean) {
      const brands = Array.isArray(v.brands) && v.brands.length ? ` [${v.brands.join(", ")}]` : "";
      return {
        clean: false,
        reason: `${v.reason || "branding/irrelevant/indecent image"}${brands}`,
        flags: { domain: rep, vision: v },
      };
    }
    return { clean: true, reason: "clean & on-topic", flags: { domain: rep, vision: v } };
  } catch (err) {
    if (err.budgetExceeded) throw err; // spend cap hit — stop the wave, don't keep paying
    // Could not verify (download blocked, bad content-type, vision/API error).
    if (env.imageGuardFailOpen) {
      return { clean: true, reason: `unverified, fail-open (${err.message})`, flags: { domain: rep } };
    }
    return { clean: false, reason: `could not verify image (${err.message})`, flags: { domain: rep } };
  }
}
