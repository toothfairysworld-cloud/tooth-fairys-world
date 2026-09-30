import { site } from "./site";
import type { Locale } from "@/content/types";

const localeTag = (locale: Locale) => (locale === "ar" ? "ar" : "en");

/** Locale-aware number formatting with a pinned numbering system. */
export function formatNumber(
  value: number,
  locale: Locale,
  options?: Intl.NumberFormatOptions,
): string {
  return new Intl.NumberFormat(localeTag(locale), {
    numberingSystem: site.numerals,
    ...options,
  }).format(value);
}

/** Long localized date, e.g. "12 أغسطس 2026" / "August 12, 2026". */
export function formatDate(iso: string | Date, locale: Locale): string {
  const date = typeof iso === "string" ? new Date(iso) : iso;
  return new Intl.DateTimeFormat(localeTag(locale), {
    year: "numeric",
    month: "long",
    day: "numeric",
    numberingSystem: site.numerals,
  }).format(date);
}

/** Compact month + year for certificates. */
export function formatMonth(iso: string | Date, locale: Locale): string {
  const date = typeof iso === "string" ? new Date(iso) : iso;
  return new Intl.DateTimeFormat(localeTag(locale), {
    year: "numeric",
    month: "short",
    numberingSystem: site.numerals,
  }).format(date);
}

export function formatReadingTime(minutes: number, locale: Locale): string {
  return locale === "ar" ? `${minutes} دقائق قراءة` : `${minutes} min read`;
}
