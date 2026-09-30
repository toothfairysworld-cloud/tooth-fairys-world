import { defineRouting } from "next-intl/routing";

/**
 * Locale routing — English is the default locale and lives at `/`
 * (no prefix, `as-needed` strategy). Arabic lives at `/ar`.
 * hreflang: en -> /, ar -> /ar, x-default -> /
 */
export const routing = defineRouting({
  locales: ["en", "ar"],
  defaultLocale: "en",
  localePrefix: "as-needed",
  // `/` always serves English by default — no Accept-Language negotiation
  localeDetection: false,
});

export type AppLocale = (typeof routing.locales)[number];

export const localeDir = (locale: string): "rtl" | "ltr" =>
  locale === "ar" ? "rtl" : "ltr";
