"use client";

import { useCallback, useEffect, useState, useSyncExternalStore } from "react";
import { useTranslations } from "next-intl";
import { Info, X } from "lucide-react";
import { cn } from "@/lib/utils";

const STORAGE_KEY = "toothfairy-portfolio:sample-banner-dismissed";
const DISMISS_EVENT = "sample-banner-dismissed";

function subscribe(callback: () => void) {
  window.addEventListener(DISMISS_EVENT, callback);
  window.addEventListener("storage", callback);
  return () => {
    window.removeEventListener(DISMISS_EVENT, callback);
    window.removeEventListener("storage", callback);
  };
}

function getSnapshot(): boolean {
  try {
    return localStorage.getItem(STORAGE_KEY) === null;
  } catch {
    return true;
  }
}

function getServerSnapshot(): boolean {
  // Hidden during SSR/hydration; appears right after mount when not dismissed
  return false;
}

/**
 * Dismissible "SAMPLE content" notice — a small floating glass pill
 * under the navbar (works with the fixed header over the dark hero).
 * Remembers the dismissal in localStorage.
 */
export function SampleBanner() {
  const t = useTranslations("sample");
  const visible = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
  const [overHero, setOverHero] = useState(true);

  useEffect(() => {
    const onScroll = () => {
      const hero = document.getElementById("hero");
      const heroH = hero ? hero.offsetHeight : 640;
      setOverHero(window.scrollY < heroH - 96);
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const dismiss = useCallback(() => {
    try {
      localStorage.setItem(STORAGE_KEY, "1");
    } catch {
      /* ignore */
    }
    window.dispatchEvent(new Event(DISMISS_EVENT));
  }, []);

  if (!visible) return null;

  return (
    <div
      role="status"
      className="pointer-events-none fixed inset-x-0 top-20 z-40 md:top-24"
    >
      <div
        className={cn(
          "pointer-events-auto mx-auto flex w-fit max-w-[92%] items-center gap-2 rounded-full border px-4 py-1.5 shadow-soft",
          overHero
            ? "glass-dark border-white/20 text-white/85"
            : "glass-light border-border bg-background/80 text-foreground",
        )}
      >
        <Info
          className={cn(
            "size-3.5 shrink-0",
            overHero ? "text-[#e7c08a]" : "text-accent-warm",
          )}
          aria-hidden="true"
        />
        <p
          className={cn(
            "truncate text-caption",
            overHero ? "text-white/85" : "text-foreground",
          )}
        >
          <span className="font-bold">{t("title")}: </span>
          {t("text")}
        </p>
        <button
          type="button"
          onClick={dismiss}
          aria-label={t("dismiss")}
          className={cn(
            "ms-0.5 rounded-full p-1 transition-colors",
            overHero
              ? "text-white/60 hover:bg-white/12 hover:text-white"
              : "text-muted-foreground hover:bg-surface-2 hover:text-foreground",
          )}
        >
          <X className="size-3.5" aria-hidden="true" />
        </button>
      </div>
    </div>
  );
}
