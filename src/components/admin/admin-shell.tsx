"use client";

import { useState } from "react";
import { usePathname } from "next/navigation";
import { useLocale } from "next-intl";
import { toast } from "sonner";
import {
  Award,
  BookOpen,
  CircleHelp,
  ExternalLink,
  FlaskConical,
  HeartHandshake,
  LayoutList,
  LayoutDashboard,
  LogOut,
  Mail,
  Menu,
  Newspaper,
  Quote,
  Route,
  Settings,
  Smile,
  UserRound,
  X,
} from "lucide-react";

import { logoutAction } from "@/lib/admin/actions";
import { al, bi } from "@/lib/admin/dict";
import { ENTITIES } from "@/lib/admin/registry";
import type { Locale } from "@/content/types";
import type { AdminSession } from "@/lib/auth";
import { Link } from "@/i18n/navigation";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const ICONS: Record<string, React.ComponentType<{ className?: string }>> = {
  Route,
  Smile,
  Award,
  FlaskConical,
  HeartHandshake,
  Newspaper,
  CircleHelp,
  BookOpen,
  Quote,
  LayoutList,
};

function NavIcon({ name, className }: { name: string; className?: string }) {
  const Icon = ICONS[name] ?? LayoutDashboard;
  return <Icon className={className} aria-hidden="true" />;
}

/**
 * Dashboard chrome — sidebar on desktop, slide-over on mobile.
 * Feminine editorial styling to match the public site.
 */
export function AdminShell({
  locale,
  admin,
  unread,
  children,
}: {
  locale: Locale;
  admin: AdminSession;
  unread: number;
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const current = useLocale();
  const [menuOpen, setMenuOpen] = useState(false);
  const other = current === "ar" ? "en" : "ar";

  const isActive = (href: string) =>
    href === "/admin" ? pathname === "/admin" : pathname.startsWith(href);

  const contentLinks = ENTITIES.map((entity) => ({
    href: `/admin/content/${entity.key}`,
    label: bi(entity.label, locale),
    icon: entity.icon,
    key: entity.key,
  }));

  const links = [
    { href: "/admin", label: al("dashboard", locale), icon: "dash" },
    { href: "/admin/inbox", label: al("inbox", locale), icon: "inbox", badge: unread },
    { href: "/admin/profile", label: al("profile", locale), icon: "profile" },
  ];

  const nav = (
    <nav aria-label={al("panelTitle", locale)} className="grid gap-6">
      <ul className="grid gap-1">
        {links.map((link) => (
          <li key={link.href}>
            <Link
              href={link.href}
              onClick={() => setMenuOpen(false)}
              aria-current={isActive(link.href) ? "page" : undefined}
              className={cn(
                "flex items-center gap-3 rounded-xl px-3.5 py-2.5 text-sm font-semibold transition-colors",
                isActive(link.href)
                  ? "bg-primary/12 text-primary"
                  : "text-muted-foreground hover:bg-surface-2 hover:text-foreground",
              )}
            >
              {link.icon === "dash" && <LayoutDashboard className="size-4.5" aria-hidden="true" />}
              {link.icon === "inbox" && <Mail className="size-4.5" aria-hidden="true" />}
              {link.icon === "profile" && <UserRound className="size-4.5" aria-hidden="true" />}
              <span className="flex-1">{link.label}</span>
              {link.badge ? (
                <span className="grid min-w-6 place-items-center rounded-full bg-primary px-1.5 py-0.5 text-[0.7rem] font-bold text-primary-foreground tabular-nums">
                  {link.badge > 99 ? "99+" : link.badge}
                </span>
              ) : null}
            </Link>
          </li>
        ))}
      </ul>

      <div>
        <p className="px-3.5 pb-2 text-[0.7rem] font-bold uppercase tracking-[0.14em] text-muted-foreground/70">
          {al("content", locale)}
        </p>
        <ul className="grid gap-1">
          {contentLinks.map((link) => (
            <li key={link.key}>
              <Link
                href={link.href}
                onClick={() => setMenuOpen(false)}
                aria-current={isActive(link.href) ? "page" : undefined}
                className={cn(
                  "flex items-center gap-3 rounded-xl px-3.5 py-2.5 text-sm font-medium transition-colors",
                  isActive(link.href)
                    ? "bg-primary/12 text-primary"
                    : "text-muted-foreground hover:bg-surface-2 hover:text-foreground",
                )}
              >
                <NavIcon name={link.icon} className="size-4.5" />
                {link.label}
              </Link>
            </li>
          ))}
        </ul>
      </div>

      <div>
        <p className="px-3.5 pb-2 text-[0.7rem] font-bold uppercase tracking-[0.14em] text-muted-foreground/70">
          {al("panelTitle", locale)}
        </p>
        <ul className="grid gap-1">
          <li>
            <Link
              href="/admin/settings"
              onClick={() => setMenuOpen(false)}
              aria-current={isActive("/admin/settings") ? "page" : undefined}
              className={cn(
                "flex items-center gap-3 rounded-xl px-3.5 py-2.5 text-sm font-medium transition-colors",
                isActive("/admin/settings")
                  ? "bg-primary/12 text-primary"
                  : "text-muted-foreground hover:bg-surface-2 hover:text-foreground",
              )}
            >
              <Settings className="size-4.5" aria-hidden="true" />
              {al("changePassword", locale)}
            </Link>
          </li>
          <li>
            <Link
              href="/"
              target="_blank"
              className="flex items-center gap-3 rounded-xl px-3.5 py-2.5 text-sm font-medium text-muted-foreground transition-colors hover:bg-surface-2 hover:text-foreground"
            >
              <ExternalLink className="size-4.5" aria-hidden="true" />
              {al("viewSite", locale)}
            </Link>
          </li>
          <li>
            <Link
              href="/admin"
              locale={other}
              onClick={() => setMenuOpen(false)}
              className="flex items-center gap-3 rounded-xl px-3.5 py-2.5 text-sm font-medium text-muted-foreground transition-colors hover:bg-surface-2 hover:text-foreground"
            >
              <LanguagesGlyph />
              {al("langSwitch", locale)}
            </Link>
          </li>
        </ul>
      </div>
    </nav>
  );

  return (
    <div className="min-h-screen bg-background lg:grid lg:grid-cols-[17rem_1fr]">
      {/* ------------------------------------------------ sidebar (desktop) */}
      <aside className="sticky top-0 hidden h-screen flex-col border-e border-border bg-surface-2/40 p-5 lg:flex">
        <Brand locale={locale} />
        <div className="mt-6 flex-1 overflow-y-auto scrollbar-slim">{nav}</div>
        <form action={logoutAction}>
          <LogoutButton locale={locale} />
        </form>
      </aside>

      {/* --------------------------------------------------- mobile topbar */}
      <header className="sticky top-0 z-40 flex items-center justify-between border-b border-border bg-background/85 px-4 py-3 backdrop-blur-md lg:hidden">
        <Brand locale={locale} compact />
        <div className="flex items-center gap-2">
          <Link
            href="/admin/inbox"
            aria-label={al("inbox", locale)}
            className="relative grid size-10 place-items-center rounded-xl text-muted-foreground transition-colors hover:bg-surface-2 hover:text-foreground"
          >
            <Mail className="size-5" aria-hidden="true" />
            {unread > 0 && (
              <span className="absolute end-1.5 top-1.5 grid min-w-4.5 place-items-center rounded-full bg-primary px-1 text-[0.6rem] font-bold text-primary-foreground">
                {unread > 9 ? "9+" : unread}
              </span>
            )}
          </Link>
          <Button
            variant="outline"
            size="icon"
            className="rounded-xl"
            aria-expanded={menuOpen}
            aria-label={al("panelTitle", locale)}
            onClick={() => setMenuOpen((v) => !v)}
          >
            {menuOpen ? (
              <X className="size-5" aria-hidden="true" />
            ) : (
              <Menu className="size-5" aria-hidden="true" />
            )}
          </Button>
        </div>
      </header>

      {menuOpen && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <button
            type="button"
            aria-label="close menu"
            className="absolute inset-0 bg-black/40 backdrop-blur-sm"
            onClick={() => setMenuOpen(false)}
          />
          <div className="absolute inset-y-0 start-0 flex w-72 max-w-[85vw] flex-col overflow-y-auto bg-background p-5 shadow-2xl">
            <Brand locale={locale} />
            <div className="mt-6">{nav}</div>
            <form action={logoutAction} className="mt-auto pt-6">
              <LogoutButton locale={locale} />
            </form>
          </div>
        </div>
      )}

      {/* -------------------------------------------------------- content */}
      <div className="flex min-h-screen flex-col">
        <div className="flex-1 px-4 py-6 sm:px-6 lg:px-10 lg:py-8">
          <p className="mb-4 hidden text-caption text-muted-foreground lg:block" dir="ltr">
            {admin.email}
          </p>
          {children}
        </div>
        <footer className="border-t border-border px-4 py-4 text-center text-[0.7rem] text-muted-foreground/70 sm:px-6 lg:px-10">
          toothfairysworld.com — {al("panelTitle", locale)}
        </footer>
      </div>
    </div>
  );
}

function Brand({ locale, compact }: { locale: Locale; compact?: boolean }) {
  return (
    <div className="flex items-center gap-3">
      <span className="grid size-10 place-items-center rounded-xl bg-gradient-to-br from-primary to-primary-strong text-primary-foreground shadow-soft">
        <Smile className="size-5" aria-hidden="true" />
      </span>
      <div className={cn(compact ? "hidden sm:block" : "")}>
        <p className="text-sm font-bold leading-tight">{al("panelTitle", locale)}</p>
        <p className="text-[0.7rem] text-muted-foreground" dir="ltr">
          toothfairysworld.com
        </p>
      </div>
    </div>
  );
}

function LogoutButton({ locale }: { locale: Locale }) {
  return (
    <Button
      type="submit"
      variant="outline"
      className="w-full justify-start gap-3 rounded-xl border-border/60 text-muted-foreground hover:text-foreground"
    >
      <LogOut className="size-4 rtl:-scale-x-100" aria-hidden="true" />
      {al("logout", locale)}
    </Button>
  );
}

function LanguagesGlyph() {
  return (
    <span className="grid size-4.5 place-items-center text-xs font-bold" aria-hidden="true">
      ع/EN
    </span>
  );
}

// sonner toast helper used by entity components
export function adminToast(locale: Locale, key: "saved" | "deleted" | "error") {
  if (key === "saved") toast.success(al("saved", locale));
  if (key === "deleted") toast.success(al("del", locale));
  if (key === "error") toast.error(al("saveError", locale));
}
