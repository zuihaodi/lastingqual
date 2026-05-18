import type { CmsCardItem, CmsSlugFieldValue } from "../types/content";

export type CardDetailLang = "zh" | "en";
export type CardDetailPageKey = "page1" | "page2" | "page3" | "page4" | "page5";

export function normalizeCardDetailSlugValue(value?: CmsSlugFieldValue): string {
  const raw = typeof value === "string" ? value : value?.slug;
  if (!raw) return "";
  const ascii = raw
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
  if (ascii) return ascii;
  return Array.from(raw.trim())
    .map((char) => char.codePointAt(0)?.toString(36) || "")
    .filter(Boolean)
    .join("-")
    .slice(0, 80);
}

export function cardHasDetailContent(card?: CmsCardItem): boolean {
  const detail = card?.detail;
  if (!detail) return false;
  if (detail.title?.trim() || detail.summary?.trim() || detail.body?.trim()) return true;
  if (detail.images?.some((item) => item.image?.trim())) return true;
  return !!detail.tables?.some(
    (table) => table.title?.trim() || table.tableText?.trim() || table.note?.trim(),
  );
}

export function getCardDetailHref(
  lang: CardDetailLang,
  pageKey: CardDetailPageKey,
  card: CmsCardItem,
): string {
  const slug = normalizeCardDetailSlugValue(card.detail?.slug);
  if (!slug || !cardHasDetailContent(card)) return "";
  return `/${lang}/detail/${pageKey}/${slug}`;
}

export function getCardAction(
  lang: CardDetailLang,
  pageKey: CardDetailPageKey,
  card: CmsCardItem,
): { href: string; text: string } | null {
  const ctaHref = card.ctaHref?.trim() || "";
  const ctaText = card.ctaText?.trim() || "";
  if (ctaHref) return ctaText ? { href: ctaHref, text: ctaText } : null;

  const detailHref = getCardDetailHref(lang, pageKey, card);
  if (!detailHref) return null;
  return { href: detailHref, text: ctaText || (lang === "zh" ? "详细信息" : "Details") };
}
