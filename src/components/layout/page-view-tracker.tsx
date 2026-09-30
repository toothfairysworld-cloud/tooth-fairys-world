"use client";

import { useEffect, useRef } from "react";

import { useLocale } from "next-intl";

import { usePathname } from "@/i18n/navigation";
import { site } from "@/lib/site";

/**
 * Cookie-less page-view beacon — fires once per pathname (SPA navigations
 * included) at the aggregate /api/track endpoint. Gated by the site-wide
 * flag so the owner can switch analytics off completely with one constant.
 */
export function PageViewTracker() {
  const pathname = usePathname();
  const locale = useLocale();
  const seen = useRef<Set<string>>(new Set());

  useEffect(() => {
    if (!site.analyticsEnabled || !pathname) return;
    if (pathname.startsWith("/admin")) return;
    if (seen.current.has(pathname)) return;
    seen.current.add(pathname);

    const body = JSON.stringify({ path: pathname, locale });
    try {
      if (typeof navigator.sendBeacon === "function") {
        navigator.sendBeacon(
          "/api/track",
          new Blob([body], { type: "application/json" }),
        );
      } else {
        void fetch("/api/track", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body,
          keepalive: true,
        }).catch(() => undefined);
      }
    } catch {
      // analytics is best-effort
    }
  }, [pathname, locale]);

  return null;
}
