import type { Metadata } from "next";

/**
 * Locale alternates (hreflang) helper — EN lives at the root, AR under /ar.
 * Every public page uses this so search engines always see a complete
 * EN / AR / x-default cluster. `path` is the route WITHOUT the locale
 * prefix, e.g. "blog", "cases/cosmetic-composite".
 */
export function localeAlternates(
  locale: "ar" | "en",
  path = "",
): NonNullable<Metadata["alternates"]> {
  const clean = path.replace(/^\/+/, "").replace(/\/+$/, "");
  const en = clean === "" ? "/" : `/${clean}`;
  const ar = clean === "" ? "/ar" : `/ar/${clean}`;
  return {
    canonical: locale === "en" ? en : ar,
    languages: {
      en,
      ar,
      "x-default": en,
    },
  };
}
