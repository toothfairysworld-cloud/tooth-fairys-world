"use client";

import { useTranslations } from "next-intl";
import { ChevronDown } from "lucide-react";

import { LangSwitcher } from "./lang-switcher";
import { Logo } from "./logo";
import { MobileNav } from "./mobile-nav";
import { primaryNavItems, moreNavItems } from "./nav-items";
import { ThemeToggle } from "./theme-toggle";
import { Link, usePathname } from "@/i18n/navigation";
import { cn } from "@/lib/utils";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

/**
 * Classic Navbar — clean, full-width, sticky top navigation.
 * Features:
 * - Solid/frosted backdrop for high readability
 * - Direct links to main section pages
 * - "More" dropdown for secondary sections
 * - Language switcher, theme toggle, and CTA button
 * - Mobile responsive drawer
 */
export function Header({ name }: { name: string }) {
  const t = useTranslations("nav");
  const pathname = usePathname();

  const isMoreActive = moreNavItems.some(
    (item) => pathname === item.href || pathname.startsWith(`${item.href}/`),
  );

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/80 bg-background/95 backdrop-blur-md transition-colors">
      <div className="container-site flex h-16 items-center justify-between gap-4">
        {/* Brand / Logo */}
        <div className="flex shrink-0 items-center">
          <Logo name={name} tone="default" />
        </div>

        {/* Desktop Classic Navigation */}
        <nav aria-label={t("ariaLabel")} className="hidden lg:flex items-center gap-1">
          {primaryNavItems.map(({ href, key }) => {
            const isActive =
              href === "/"
                ? pathname === "/"
                : pathname === href || pathname.startsWith(`${href}/`);
            return (
              <Link
                key={key}
                href={href}
                className={cn(
                  "rounded-lg px-3.5 py-2 text-caption font-semibold transition-colors",
                  isActive
                    ? "bg-primary/10 text-primary font-bold"
                    : "text-muted-foreground hover:bg-surface-2 hover:text-foreground",
                )}
              >
                {t(key)}
              </Link>
            );
          })}

          {/* More sections dropdown */}
          <DropdownMenu>
            <DropdownMenuTrigger
              className={cn(
                "inline-flex items-center gap-1 rounded-lg px-3.5 py-2 text-caption font-semibold transition-colors outline-none",
                isMoreActive
                  ? "bg-primary/10 text-primary font-bold"
                  : "text-muted-foreground hover:bg-surface-2 hover:text-foreground",
              )}
            >
              <span>{t("more")}</span>
              <ChevronDown className="size-3.5 opacity-70" aria-hidden="true" />
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-48 p-1.5 shadow-soft">
              {moreNavItems.map(({ href, key }) => {
                const isActive = pathname === href || pathname.startsWith(`${href}/`);
                return (
                  <DropdownMenuItem key={key} asChild>
                    <Link
                      href={href}
                      className={cn(
                        "w-full cursor-pointer rounded-md px-3 py-2 text-caption font-medium transition-colors",
                        isActive
                          ? "bg-primary/10 text-primary font-bold"
                          : "hover:bg-surface-2 text-foreground",
                      )}
                    >
                      {t(key)}
                    </Link>
                  </DropdownMenuItem>
                );
              })}
            </DropdownMenuContent>
          </DropdownMenu>
        </nav>

        {/* Right utilities & mobile toggle */}
        <div className="flex items-center gap-1.5 sm:gap-2">
          <LangSwitcher tone="default" />
          <ThemeToggle tone="default" />

          <Link
            href="/contact"
            className="btn-shine hidden h-9 items-center rounded-lg bg-primary px-4 text-caption font-semibold text-primary-foreground shadow-sm transition-all hover:bg-primary-strong sm:inline-flex"
          >
            {t("cta")}
          </Link>

          <MobileNav tone="default" />
        </div>
      </div>
    </header>
  );
}
