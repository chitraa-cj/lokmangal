// Content provenance guard — rejects a rewritten article that still carries
// fingerprints of the source it was lifted from. The rewrite step is told not to
// copy attribution, but this is the safety net: if a publisher name, news-agency
// credit, byline, "read more" call-to-action or copyright line survived into the
// final copy, the article is dropped rather than published.
import { env } from "./config.js";

// Third-party publisher / agency names that should never appear in our own copy.
// Multi-word and distinctive — bare initialisms like "AP"/"HT" are intentionally
// omitted to avoid false positives on ordinary prose.
const SOURCE_NAMES = [
  "Times of India",
  "Hindustan Times",
  "Indian Express",
  "India Today",
  "NDTV",
  "News18",
  "Aaj Tak",
  "ABP News",
  "Zee News",
  "Dainik Bhaskar",
  "Dainik Jagran",
  "Amar Ujala",
  "Navbharat Times",
  "The Hindu",
  "Deccan Herald",
  "Deccan Chronicle",
  "Telegraph India",
  "Economic Times",
  "Financial Express",
  "Firstpost",
  "Republic World",
  "Republic TV",
  "The Tribune",
  "Outlook India",
  "The Print",
  "The Quint",
  "Moneycontrol",
  "Business Standard",
  "Free Press Journal",
  "Times Now",
  "WION",
];

// News-agency / stock credits.
const AGENCIES = ["PTI", "ANI", "IANS", "Reuters", "AFP", "Getty Images", "Shutterstock", "Bloomberg"];

// Attribution / boilerplate phrases that leak from scraped pages.
const BOILERPLATE = [
  "read more",
  "also read",
  "click here",
  "watch video",
  "watch:",
  "all rights reserved",
  "copyright",
  "with inputs from",
  "with input from",
  "source:",
  "sources:",
  "courtesy:",
  "courtesy of",
  "file photo",
  "photo:",
  "image:",
  "image source",
  "representative image",
  "(reuters)",
  "(pti)",
  "(ani)",
];

// Build a regex that matches a phrase as whole words, case-insensitive.
const phraseRe = (p) =>
  new RegExp(`(^|[^\\p{L}])${p.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")}([^\\p{L}]|$)`, "iu");

const SOURCE_RES = SOURCE_NAMES.map(phraseRe);
const AGENCY_RES = AGENCIES.map(phraseRe);
const BOILERPLATE_RES = BOILERPLATE.map(phraseRe);

// A © / ® copyright mark or a social handle that leaked into the copy.
// (No generic "By <Name>" byline rule — it false-positives on ordinary news
// prose like "directed by Karan Johar" or "approved by Chief Minister".)
const SYMBOL_RE = /[©®]|(^|\s)@[A-Za-z0-9_]{3,}/;

function plain(html = "") {
  return String(html)
    .replace(/<[^>]+>/g, " ")
    .replace(/&[a-z]+;/gi, " ")
    .replace(/\s+/g, " ")
    .trim();
}

// Validate a rewritten article (the object rewriteForPublish returns).
// Returns { clean: boolean, reasons: string[] }.
export function validateContent(rewritten) {
  if (!env.contentGuard) return { clean: true, reasons: [] };

  const text = [
    plain(rewritten.headlinePlain || rewritten.title),
    plain(rewritten.conclusion),
    plain(rewritten.content),
    (rewritten.hashtags || []).join(" "),
  ].join("\n");

  const reasons = [];
  for (let i = 0; i < SOURCE_RES.length; i++) {
    if (SOURCE_RES[i].test(text)) reasons.push(`publisher name: ${SOURCE_NAMES[i]}`);
  }
  for (let i = 0; i < AGENCY_RES.length; i++) {
    if (AGENCY_RES[i].test(text)) reasons.push(`agency credit: ${AGENCIES[i]}`);
  }
  for (let i = 0; i < BOILERPLATE_RES.length; i++) {
    if (BOILERPLATE_RES[i].test(text)) reasons.push(`boilerplate: "${BOILERPLATE[i]}"`);
  }
  if (SYMBOL_RE.test(text)) reasons.push("copyright symbol / social handle");

  return { clean: reasons.length === 0, reasons };
}
