"use client";

import { useLocale, useTranslations } from "next-intl";
import { Languages } from "lucide-react";

import { usePathname, useRouter } from "@/i18n/navigation";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

/** AR ⇄ EN switcher — preserves the current path. */
export function LangSwitcher({
  tone = "default",
}: {
  tone?: "default" | "invert";
}) {
  const t = useTranslations("a11y");
  const locale = useLocale();
  const router = useRouter();
  const pathname = usePathname();
  const target = locale === "ar" ? "en" : "ar";

  return (
    <Button
      variant="ghost"
      size="sm"
      aria-label={t("switchLang")}
      onClick={() => router.replace(pathname, { locale: target })}
      className={cn(
        "h-8 sm:h-9 gap-1 sm:gap-1.5 rounded-full px-2 sm:px-2.5 text-xs sm:text-caption font-semibold shrink-0",
        tone === "invert"
          ? "text-white/85 hover:bg-white/12 hover:text-white"
          : "text-muted-foreground",
      )}
    >
      <Languages className="size-3.5 sm:size-4" aria-hidden="true" />
      <span aria-hidden="true">{target === "en" ? "EN" : "عربي"}</span>
    </Button>
  );
}
