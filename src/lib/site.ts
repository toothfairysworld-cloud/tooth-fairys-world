/** Central site configuration. */

export const site = {
  /** Swappable via env — zero code changes when the real domain is ready. */
  url: process.env.NEXT_PUBLIC_SITE_URL ?? "https://toothfairysworld.com",
  name: { ar: "عالم جنية الأسنان", en: "Tooth Fairy's World" },
  /** Western digits by default (most modern Arabic academic sites); switchable. */
  numerals: "latn" as "latn" | "arab",
  locales: { default: "en", alternate: "ar" } as const,
  /**
   * Privacy-friendly aggregate page views (no cookies, no identifiers —
   * see /api/track and /privacy). Flip to false to switch analytics off
   * site-wide; the beacon stops firing and the dashboard card goes quiet.
   */
  analyticsEnabled: true,
} as const;
