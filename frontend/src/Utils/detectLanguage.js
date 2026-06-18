const DEVANAGARI_REGEX = /[\u0900-\u097F]/;

const stripHtml = (html) => {
  if (!html || typeof html !== "string") return "";
  return html.replace(/<[^>]*>/g, " ").replace(/\s+/g, " ").trim();
};

export const containsDevanagari = (text) => {
  return DEVANAGARI_REGEX.test(stripHtml(text));
};

export const isHindiArticle = (article) => {
  if (!article) return false;

  return (
    containsDevanagari(article.title) ||
    containsDevanagari(article.conclusion) ||
    containsDevanagari(article.content)
  );
};
