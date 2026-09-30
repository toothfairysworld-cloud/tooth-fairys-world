import { setRequestLocale } from "next-intl/server";
import { Eye, MailOpen, PenLine, Plus } from "lucide-react";

import { db } from "@/lib/db";
import { requireAdmin } from "@/lib/auth";
import { getAnalyticsSummary } from "@/lib/analytics";
import { al, bi } from "@/lib/admin/dict";
import { ENTITIES } from "@/lib/admin/registry";
import type { Locale } from "@/content/types";
import { getProfile, pick } from "@/lib/data";
import { Link } from "@/i18n/navigation";
import { Button } from "@/components/ui/button";

export const dynamic = "force-dynamic";

/** Overview — stats, recent messages, quick actions, rotating tips. */
export default async function AdminHome({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale: rawLocale } = await params;
  const locale = rawLocale as Locale;
  setRequestLocale(locale);
  await requireAdmin();

  const [
    unread,
    archived,
    messages,
    profile,
    timelineCount,
    casesCount,
    certificatesCount,
    researchCount,
    volunteeringCount,
    postsCount,
    faqCount,
    resourcesCount,
    testimonialsCount,
    sectionsCount,
    analytics,
  ] = await Promise.all([
    db.contactMessage.count({ where: { read: false, archived: false } }),
    db.contactMessage.count({ where: { archived: true } }),
    db.contactMessage.findMany({
      where: { archived: false },
      orderBy: { createdAt: "desc" },
      take: 5,
    }),
    getProfile(),
    db.timelineEntry.count(),
    db.caseStudy.count(),
    db.certificate.count(),
    db.researchItem.count(),
    db.volunteeringItem.count(),
    db.blogPost.count(),
    db.faqItem.count(),
    db.resourceItem.count(),
    db.testimonial.count(),
    db.sectionConfig.count(),
    getAnalyticsSummary(),
  ]);

  const counts: Record<string, number> = {
    timeline: timelineCount,
    cases: casesCount,
    certificates: certificatesCount,
    research: researchCount,
    volunteering: volunteeringCount,
    blog: postsCount,
    faq: faqCount,
    resources: resourcesCount,
    testimonials: testimonialsCount,
    sections: sectionsCount,
  };

  const contentTotal =
    timelineCount +
    casesCount +
    certificatesCount +
    researchCount +
    volunteeringCount +
    postsCount +
    faqCount +
    resourcesCount +
    testimonialsCount;
  const tip = al("tips", locale);
  const firstName = profile
    ? pick(profile.name, locale).split(" ")[0]
    : "";

  const quickActions = [
    {
      href: "/admin/content/blog/new",
      icon: PenLine,
      label: { ar: "مقال جديد", en: "New article" },
    },
    {
      href: "/admin/content/cases/new",
      icon: Plus,
      label: { ar: "حالة جديدة", en: "New case" },
    },
    {
      href: "/admin/inbox",
      icon: MailOpen,
      label: { ar: "الرسائل الواردة", en: "Open inbox" },
    },
  ];

  return (
    <div className="mx-auto max-w-5xl">
      <header>
        <h1 className="text-h1 font-heading">
          {al("welcome", locale)}
          {firstName ? `، ${firstName}` : ""}
        </h1>
        <p className="mt-2 text-body text-muted-foreground">
          {bi(
            {
              ar: "كل ما تحتاجينه لإدارة الموقع من مكان واحد.",
              en: "Everything you need to run the site, in one place.",
            },
            locale,
          )}
        </p>
      </header>

      {/* stat cards */}
      <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard
          label={al("unreadMessages", locale)}
          value={unread}
          icon={<MailOpen className="size-5" aria-hidden="true" />}
          highlight
          href="/admin/inbox"
        />
        <StatCard
          label={al("publishedItems", locale)}
          value={contentTotal}
          icon={<PenLine className="size-5" aria-hidden="true" />}
        />
        <StatCard
          label={al("visits30", locale)}
          value={analytics.total30}
          icon={<Eye className="size-5" aria-hidden="true" />}
        />
        <StatCard
          label={al("archivedTab", locale)}
          value={archived}
          icon={<MailOpen className="size-5" aria-hidden="true" />}
          href="/admin/inbox"
        />
      </div>

      {/* quick actions */}
      <section className="mt-10">
        <h2 className="text-h3">{al("quickActions", locale)}</h2>
        <div className="mt-4 flex flex-wrap gap-3">
          {quickActions.map((action) => (
            <Link
              key={action.href}
              href={action.href}
              className="inline-flex h-11 items-center gap-2 rounded-full border border-border bg-card px-5 text-sm font-semibold shadow-xs transition-all hover:border-primary/40 hover:shadow-md"
            >
              <action.icon className="size-4 text-primary" aria-hidden="true" />
              {bi(action.label, locale)}
            </Link>
          ))}
        </div>
      </section>

      {/* visits */}
      <section className="mt-10">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <h2 className="text-h3">{al("visitsSection", locale)}</h2>
          <span className="text-caption font-semibold text-muted-foreground">
            {al("visitsToday", locale)}:{" "}
            <span className="text-primary tabular-nums">{analytics.today}</span>
          </span>
        </div>
        <div className="mt-4 grid gap-4 lg:grid-cols-3">
          {/* 14-day chart */}
          <div className="rounded-2xl border border-border bg-card p-6 shadow-xs lg:col-span-2">
            {analytics.total30 === 0 ? (
              <p className="py-10 text-center text-body text-muted-foreground">
                {al("noVisits", locale)}
              </p>
            ) : (
              <>
                <p className="text-caption font-semibold text-muted-foreground">
                  {al("visitsLast14", locale)}
                </p>
                <div
                  className="mt-4 flex h-28 items-end gap-1.5"
                  role="img"
                  aria-label={`${al("visitsLast14", locale)} — ${analytics.days
                    .map((d) => `${d.day.slice(5)}: ${d.views}`)
                    .join(", ")}`}
                >
                  {analytics.days.map((d, i) => {
                    const max = Math.max(
                      ...analytics.days.map((x) => x.views),
                      1,
                    );
                    const pct = Math.max(
                      d.views === 0 ? 4 : 10,
                      Math.round((d.views / max) * 100),
                    );
                    const isToday = i === analytics.days.length - 1;
                    return (
                      <div
                        key={d.day}
                        className="flex h-full flex-1 flex-col items-center justify-end gap-1"
                        title={`${d.day} — ${d.views}`}
                      >
                        <div
                          className={`w-full rounded-full ${
                            isToday
                              ? "bg-primary"
                              : d.views === 0
                                ? "bg-border"
                                : "bg-primary/45"
                          }`}
                          style={{ height: `${pct}%` }}
                        />
                      </div>
                    );
                  })}
                </div>
                <div className="mt-2 flex justify-between text-[0.6rem] text-muted-foreground/70 tabular-nums">
                  <span dir="ltr">{analytics.days[0]?.day.slice(5)}</span>
                  <span dir="ltr">
                    {analytics.days[analytics.days.length - 1]?.day.slice(5)}
                  </span>
                </div>
              </>
            )}
          </div>
          {/* top pages */}
          <div className="rounded-2xl border border-border bg-card p-6 shadow-xs">
            <p className="text-caption font-semibold text-muted-foreground">
              {al("topPages", locale)}
            </p>
            {analytics.topPages.length === 0 ? (
              <p className="py-6 text-center text-caption text-muted-foreground">
                {al("noVisits", locale)}
              </p>
            ) : (
              <ol className="mt-4 grid gap-3">
                {analytics.topPages.map((page, i) => (
                  <li
                    key={page.path}
                    className="flex items-center justify-between gap-3"
                  >
                    <span className="flex min-w-0 items-center gap-2">
                      <span className="grid size-5 shrink-0 place-items-center rounded-full bg-surface-2 text-[0.65rem] font-bold text-muted-foreground">
                        {i + 1}
                      </span>
                      <span
                        dir="ltr"
                        className="truncate text-caption font-medium"
                      >
                        {page.path === "/"
                          ? al("home", locale)
                          : page.path}
                      </span>
                    </span>
                    <span className="shrink-0 text-caption font-bold text-primary tabular-nums">
                      {page.views}
                    </span>
                  </li>
                ))}
              </ol>
            )}
          </div>
        </div>
        <p className="mt-3 text-caption text-muted-foreground/70">
          {al("visitsNote", locale)}
        </p>
      </section>

      {/* recent messages */}
      <section className="mt-10">
        <div className="flex items-center justify-between">
          <h2 className="text-h3">{al("recentMessages", locale)}</h2>
          <Button asChild variant="ghost" size="sm" className="rounded-full">
            <Link href="/admin/inbox">{al("inbox", locale)}</Link>
          </Button>
        </div>
        <ul className="mt-4 grid gap-3">
          {messages.length === 0 && (
            <li className="rounded-2xl border border-dashed border-border bg-card p-6 text-center text-caption text-muted-foreground">
              {al("noMessages", locale)}
            </li>
          )}
          {messages.map((message) => (
            <li key={message.id}>
              <Link
                href="/admin/inbox"
                className="flex items-center gap-4 rounded-2xl border border-border bg-card p-4 shadow-xs transition-all hover:border-primary/40 hover:shadow-md"
              >
                <span
                  className={`grid size-10 shrink-0 place-items-center rounded-full text-sm font-bold ${
                    message.read
                      ? "bg-surface-2 text-muted-foreground"
                      : "bg-primary/15 text-primary"
                  }`}
                >
                  {message.name.slice(0, 2).toUpperCase()}
                </span>
                <span className="min-w-0 flex-1">
                  <span className="flex items-center gap-2">
                    <span className="truncate text-sm font-semibold">
                      {message.name}
                    </span>
                    {!message.read && (
                      <span className="size-2 shrink-0 rounded-full bg-primary" />
                    )}
                  </span>
                  <span className="block truncate text-caption text-muted-foreground">
                    {message.message}
                  </span>
                </span>
                <time
                  dir="ltr"
                  className="shrink-0 text-caption text-muted-foreground/70 tabular-nums"
                >
                  {new Date(message.createdAt).toLocaleDateString(
                    locale === "ar" ? "ar" : "en",
                    { month: "short", day: "numeric" },
                  )}
                </time>
              </Link>
            </li>
          ))}
        </ul>
      </section>

      {/* content map */}
      <section className="mt-10">
        <h2 className="text-h3">{al("content", locale)}</h2>
        <div className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {ENTITIES.map((entity) => (
            <Link
              key={entity.key}
              href={`/admin/content/${entity.key}`}
              className="flex items-center justify-between rounded-2xl border border-border bg-card px-5 py-4 shadow-xs transition-all hover:border-primary/40 hover:shadow-md"
            >
              <span className="text-sm font-semibold">
                {bi(entity.label, locale)}
              </span>
              <span className="rounded-full bg-surface-2 px-2.5 py-1 text-caption font-bold text-muted-foreground tabular-nums">
                {counts[entity.key] ?? 0}
              </span>
            </Link>
          ))}
        </div>
      </section>

      {/* tip */}
      <aside className="mt-10 rounded-2xl border border-accent-warm/30 bg-accent-warm/10 p-6">
        <p className="text-caption font-bold uppercase tracking-wider text-accent-warm">
          {al("tipTitle", locale)}
        </p>
        <p className="mt-2 text-body">{tip}</p>
      </aside>
    </div>
  );
}

function StatCard({
  label,
  value,
  icon,
  href,
  highlight,
}: {
  label: string;
  value: number;
  icon: React.ReactNode;
  href?: string;
  highlight?: boolean;
}) {
  const inner = (
    <div
      className={`rounded-2xl border p-6 shadow-xs transition-all ${
        href ? "hover:border-primary/40 hover:shadow-md" : ""
      } ${
        highlight && value > 0
          ? "border-primary/40 bg-primary/10"
          : "border-border bg-card"
      }`}
    >
      <div className="flex items-center justify-between">
        <span
          className={`grid size-10 place-items-center rounded-xl ${
            highlight && value > 0
              ? "bg-primary/20 text-primary"
              : "bg-surface-2 text-muted-foreground"
          }`}
        >
          {icon}
        </span>
        <span className="text-h1 font-heading tabular-nums">{value}</span>
      </div>
      <p className="mt-3 text-caption font-semibold text-muted-foreground">
        {label}
      </p>
    </div>
  );
  return href ? <Link href={href}>{inner}</Link> : inner;
}
