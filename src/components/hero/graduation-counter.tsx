"use client";

import { useEffect, useMemo, useState } from "react";
import { useLocale, useTranslations } from "next-intl";
import { GraduationCap } from "lucide-react";

import { formatNumber } from "@/lib/format";
import type { Locale } from "@/content/types";

interface Parts {
  days: number;
  hours: number;
  minutes: number;
  past: boolean;
}

function diffParts(target: Date): Parts {
  const ms = target.getTime() - Date.now();
  if (ms <= 0) return { days: 0, hours: 0, minutes: 0, past: true };
  return {
    days: Math.floor(ms / 86_400_000),
    hours: Math.floor((ms % 86_400_000) / 3_600_000),
    minutes: Math.floor((ms % 3_600_000) / 60_000),
    past: false,
  };
}

/**
 * Live "Graduating in X days" countdown.
 * Past date → celebratory "Graduated" state, so it never renders broken.
 * `variant="onImage"` — frosted dark glass chip for the cinematic hero.
 */
export function GraduationCounter({
  variant = "default",
  graduationDate,
}: {
  variant?: "default" | "onImage";
  graduationDate: string;
}) {
  const t = useTranslations("hero");
  const locale = useLocale() as Locale;
  // Stable across renders (a bare `new Date()` here would re-fire the effect
  // below on every render and loop setState → maximum update depth).
  const target = useMemo(
    () => new Date(graduationDate),
    [graduationDate],
  );
  const [parts, setParts] = useState<Parts>(() => diffParts(target));

  useEffect(() => {
    // Re-sync to the client clock right after mount (SSR text may be a
    // minute stale — suppressHydrationWarning covers the first paint).
    // Scheduled rather than synchronous to avoid cascading renders.
    const sync = setTimeout(() => setParts(diffParts(target)), 0);
    const id = setInterval(() => setParts(diffParts(target)), 30_000);
    return () => {
      clearTimeout(sync);
      clearInterval(id);
    };
  }, [target]);

  const year = target.getFullYear();
  const onImage = variant === "onImage";

  return (
    <div
      className={`inline-flex items-center gap-3.5 rounded-2xl px-5 py-4 ${
        onImage
          ? "glass-dark text-white"
          : "border border-border bg-surface text-foreground shadow-xs"
      }`}
    >
      <span
        className={`grid size-11 shrink-0 place-items-center rounded-xl ${
          onImage ? "bg-white/12 text-[#e7c08a]" : "bg-accent-warm/12 text-accent-warm"
        }`}
      >
        <GraduationCap className="size-6" aria-hidden="true" />
      </span>

      {parts.past ? (
        <div>
          <p
            className={`text-caption font-semibold ${
              onImage ? "text-[#e7c08a]" : "text-accent-warm"
            }`}
          >
            {t("graduatedTitle")}
          </p>
          <p className="text-h3 font-bold">{t("graduatedText", { year })}</p>
        </div>
      ) : (
        <div>
          <p
            className={`text-caption ${
              onImage ? "text-white/70" : "text-muted-foreground"
            }`}
          >
            {t("countdownLabel")}
          </p>
          <p className="flex items-baseline gap-1.5 font-bold leading-tight">
            <span
              suppressHydrationWarning
              className={`text-[1.75rem] tabular-nums ${
                onImage ? "text-white" : "text-primary"
              }`}
            >
              {formatNumber(parts.days, locale)}
            </span>
            <span
              className={`text-caption ${
                onImage ? "text-white/70" : "text-muted-foreground"
              }`}
            >
              {t("days")}
            </span>
            <span
              suppressHydrationWarning
              className={`text-caption tabular-nums ${
                onImage ? "text-white/70" : "text-muted-foreground"
              }`}
            >
              {formatNumber(parts.hours, locale)} {t("hours")} ·{" "}
              {formatNumber(parts.minutes, locale)} {t("minutes")}
            </span>
          </p>
        </div>
      )}
    </div>
  );
}
