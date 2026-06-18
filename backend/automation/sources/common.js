// Shared HTTP + parsing helpers for scrapers.
// The fetch layer mimics a real browser (rotating modern User-Agents, full
// request headers, retries with backoff, jittered delays) so scraping the big
// news sites is reliable and rarely blocked.
import axios from "axios";
import crypto from "crypto";
import * as cheerio from "cheerio";
import { BLOCKED_DOMAINS } from "../config.js";

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
const jitter = (base) => base + Math.floor(Math.random() * base);

// A small pool of current, real desktop browser User-Agents.
const USER_AGENTS = [
  "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/126.0.0.0 Safari/537.36",
  "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/125.0.0.0 Safari/537.36",
  "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36 Edg/124.0.0.0",
  "Mozilla/5.0 (Macintosh; Intel Mac OS X 10.15; rv:127.0) Gecko/20100101 Firefox/127.0",
  "Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/126.0.0.0 Safari/537.36",
];

function browserHeaders(referer) {
  const ua = USER_AGENTS[Math.floor(Math.random() * USER_AGENTS.length)];
  const isChrome = /Chrome\//.test(ua) && !/Firefox/.test(ua);
  const headers = {
    "User-Agent": ua,
    Accept:
      "text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8",
    "Accept-Language": "en-IN,en-US;q=0.9,en;q=0.8",
    "Cache-Control": "no-cache",
    Pragma: "no-cache",
    "Upgrade-Insecure-Requests": "1",
    "Sec-Fetch-Dest": "document",
    "Sec-Fetch-Mode": "navigate",
    "Sec-Fetch-Site": referer ? "same-origin" : "none",
    "Sec-Fetch-User": "?1",
    Referer: referer || "https://www.google.com/",
  };
  if (isChrome) {
    headers["sec-ch-ua"] = '"Google Chrome";v="126", "Chromium";v="126", "Not.A/Brand";v="24"';
    headers["sec-ch-ua-mobile"] = "?0";
    headers["sec-ch-ua-platform"] = '"Windows"';
  }
  return headers;
}

// Stable 24-char id derived from a URL (used for dedup across runs).
export function sourceIdFromUrl(url) {
  return crypto.createHash("sha256").update(String(url)).digest("hex").slice(0, 24);
}

export function isBlockedUrl(url) {
  if (!url) return true;
  const u = String(url).toLowerCase();
  return BLOCKED_DOMAINS.some((d) => u.includes(d));
}

// Human-like GET: retries with backoff, rotating UA/headers per attempt.
export async function fetchHtml(url, { delayMs = 400, timeout = 15000, retries = 2, referer } = {}) {
  if (delayMs) await sleep(jitter(delayMs));
  let lastErr;
  for (let attempt = 0; attempt <= retries; attempt++) {
    try {
      const res = await axios.get(url, {
        timeout,
        maxRedirects: 5,
        headers: browserHeaders(referer),
        decompress: true,
        validateStatus: (s) => s >= 200 && s < 400,
      });
      return {
        $: cheerio.load(res.data),
        finalUrl: res.request?.res?.responseUrl || url,
        html: res.data,
      };
    } catch (err) {
      lastErr = err;
      const status = err.response?.status;
      // Don't waste retries on hard "not found / gone".
      if (status === 404 || status === 410) break;
      if (attempt < retries) await sleep(jitter(600 * (attempt + 1)));
    }
  }
  return null;
}

// Extract publish date + og:image + main body text from an article page.
export async function fetchArticleMeta(url) {
  const loaded = await fetchHtml(url);
  if (!loaded) return { url, finalUrl: url, image: null, publishedAt: null, body: "" };
  const { $, finalUrl } = loaded;

  const meta = (sel, attr = "content") => {
    const el = $(sel).first();
    return el.length ? (el.attr(attr) || "").trim() : "";
  };

  const image =
    meta('meta[property="og:image"]') ||
    meta('meta[property="og:image:url"]') ||
    meta('meta[name="twitter:image"]') ||
    null;

  // JSON-LD (schema.org NewsArticle) is the most reliable cross-site source of
  // publish date / image / body. Parse every ld+json block and merge.
  const ld = extractJsonLd($);

  const publishedRaw =
    meta('meta[property="article:published_time"]') ||
    meta('meta[property="og:published_time"]') ||
    meta('meta[itemprop="datePublished"]') ||
    meta('meta[name="pubdate"]') ||
    meta('meta[name="publish-date"]') ||
    ld.datePublished ||
    $("time[datetime]").first().attr("datetime") ||
    null;

  let publishedAt = null;
  if (publishedRaw) {
    const d = new Date(publishedRaw);
    if (!isNaN(d.getTime())) publishedAt = d.toISOString();
  }

  // Body: prefer the densest article container; fall back to JSON-LD articleBody.
  let body = "";
  const sels = [
    "[itemprop='articleBody']",
    ".story__content",
    ".article-body",
    "._s30J",
    ".Normal",
    "#pcl-full-content",
    ".storyDetails",
    "article",
    "main",
  ];
  for (const sel of sels) {
    const text = $(sel)
      .find("p")
      .map((_, el) => $(el).text().trim())
      .get()
      .filter((t) => t.length > 40)
      .join("\n\n");
    if (text.length > body.length) body = text;
  }
  if (body.length < 200 && ld.articleBody && ld.articleBody.length > body.length) {
    body = ld.articleBody;
  }
  if (!body) {
    body = $("p")
      .map((_, el) => $(el).text().trim())
      .get()
      .filter((t) => t.length > 40)
      .join("\n\n");
  }

  return {
    url,
    finalUrl,
    image: image || ld.image || null,
    publishedAt,
    body: body.slice(0, 8000),
  };
}

// Pull datePublished / image / articleBody from any NewsArticle JSON-LD blocks.
function extractJsonLd($) {
  const result = {};
  $('script[type="application/ld+json"]').each((_, el) => {
    let json;
    try {
      json = JSON.parse($(el).contents().text());
    } catch (_) {
      return;
    }
    const nodes = Array.isArray(json) ? json : json["@graph"] ? json["@graph"] : [json];
    for (const node of nodes) {
      if (!node || typeof node !== "object") continue;
      const type = String(node["@type"] || "");
      if (!/Article|NewsArticle|ReportageNewsArticle|LiveBlogPosting/i.test(type)) continue;
      if (!result.datePublished && node.datePublished) result.datePublished = node.datePublished;
      if (!result.articleBody && typeof node.articleBody === "string") {
        result.articleBody = node.articleBody.replace(/\s+\n/g, "\n").trim();
      }
      if (!result.image) {
        const img = node.image;
        if (typeof img === "string") result.image = img;
        else if (Array.isArray(img)) result.image = typeof img[0] === "string" ? img[0] : img[0]?.url;
        else if (img?.url) result.image = img.url;
      }
    }
  });
  return result;
}

export { sleep };
