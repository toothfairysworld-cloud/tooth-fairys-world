"use client";

import { useEffect, useState } from "react";
import { useTranslations } from "next-intl";
import { Menu } from "lucide-react";

import { LangSwitcher } from "./lang-switcher";
import { ThemeToggle } from "./theme-toggle";
import { Link } from "@/i18n/navigation";
import { Button } from "@/components/ui/button";
import {
  Drawer,
  DrawerContent,
  DrawerDescription,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer";
import { navItems } from "./nav-items";
import { cn } from "@/lib/utils";

/** Mobile navigation as a bottom sheet (thumb-friendly). */
export function MobileNav({
  tone = "default",
}: {
  tone?: "default" | "invert";
}) {
  const t = useTranslations("a11y");
  const navT = useTranslations("nav");
  const [open, setOpen] = useState(false);

  // Close the sheet on navigation
  useEffect(() => {
    if (!open) return;
    const close = () => setOpen(false);
    window.addEventListener("hashchange", close);
    return () => window.removeEventListener("hashchange", close);
  }, [open]);

  return (
    <Drawer open={open} onOpenChange={setOpen}>
      <DrawerTrigger asChild>
        <Button
          variant="ghost"
          size="icon"
          aria-label={t("openMenu")}
          className={cn(
            "size-9 rounded-full lg:hidden",
            tone === "invert"
              ? "text-white/85 hover:bg-white/12 hover:text-white"
              : "text-muted-foreground",
          )}
        >
          <Menu className="size-5" aria-hidden="true" />
        </Button>
      </DrawerTrigger>
      <DrawerContent className="mx-auto max-w-lg rounded-t-3xl max-h-[85vh]">
        <DrawerHeader className="sr-only">
          <DrawerTitle>{t("mainNav")}</DrawerTitle>
          <DrawerDescription>{t("mainNav")}</DrawerDescription>
        </DrawerHeader>
        <nav aria-label={t("mainNav")} className="px-6 pb-8 pt-2 overflow-y-auto">
          <ul className="grid grid-cols-2 gap-2 sm:gap-2.5">
            {navItems.map(({ href, key }) => (
              <li key={key}>
                <Link
                  href={href}
                  onClick={() => setOpen(false)}
                  className="flex items-center rounded-xl border border-border/60 bg-card/60 px-3.5 py-3 text-caption font-semibold transition-colors hover:bg-surface-2 hover:border-primary/30"
                >
                  {navT(key)}
                </Link>
              </li>
            ))}
          </ul>
          <div className="mt-5 flex items-center justify-between border-t border-border pt-4">
            <LangSwitcher />
            <ThemeToggle />
          </div>
        </nav>
      </DrawerContent>
    </Drawer>
  );
}
