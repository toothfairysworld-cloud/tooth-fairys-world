"use client";

import { useSyncExternalStore } from "react";
import { useTheme } from "next-themes";
import { Moon, Sun } from "lucide-react";

import { useTranslations } from "next-intl";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const emptySubscribe = () => () => {};

/** true only after hydration — avoids mismatch without setState-in-effect. */
function useMounted(): boolean {
  return useSyncExternalStore(
    emptySubscribe,
    () => true,
    () => false,
  );
}

/** Light/dark toggle — system default, persists via next-themes. */
export function ThemeToggle({
  tone = "default",
}: {
  tone?: "default" | "invert";
}) {
  const t = useTranslations("a11y");
  const { resolvedTheme, setTheme } = useTheme();
  const mounted = useMounted();

  const isDark = mounted && resolvedTheme === "dark";
  const invert = tone === "invert";

  return (
    <Button
      variant="ghost"
      size="icon"
      aria-label={t("toggleTheme")}
      aria-pressed={isDark}
      className={cn(
        "size-9 rounded-full",
        invert
          ? "text-white/80 hover:bg-white/12 hover:text-white"
          : "text-muted-foreground",
      )}
      onClick={() => setTheme(isDark ? "light" : "dark")}
    >
      {mounted ? (
        isDark ? (
          <Sun className="size-4" aria-hidden="true" />
        ) : (
          <Moon className="size-4" aria-hidden="true" />
        )
      ) : (
        <span className="size-4" aria-hidden="true" />
      )}
    </Button>
  );
}
