"use client";

import { useState } from "react";
import { useLocale, useTranslations } from "next-intl";
import Image from "next/image";
import { ArrowUpRight, CalendarDays } from "lucide-react";

import { BeforeAfterSlider } from "@/components/cases/before-after-slider";
import { Reveal } from "@/components/common/reveal";
import { SectionHeader } from "@/components/common/section-header";
import { Spotlight } from "@/components/common/spotlight";
import { caseCategories, categoryLabel } from "@/content";
import { pick } from "@/content/types";
import type { CaseCategory, CaseEntry, Locale } from "@/content/types";
import { formatMonth } from "@/lib/format";
import { STAGGER } from "@/lib/motion";
import { Link } from "@/i18n/navigation";
import { cn } from "@/lib/utils";

type Filter = CaseCategory | "all";

/**
 * Case gallery — filter chips + bento grid (featured case with the
 * before/after slider, mixed card sizes, NOT a uniform grid).
 */
export function CasesSection({
  cases,
  heading,
}: {
  cases: CaseEntry[];
  heading: { title: string; subtitle: string };
}) {
  const locale = useLocale() as Locale;
  const navT = useTranslations("nav");
  const casesT = useTranslations("cases");
  const h = heading;

  const [filter, setFilter] = useState<Filter>("all");
  const all = cases;
  const featured = all.find((c) => c.featured);
  const rest = all.filter((c) => c.slug !== featured?.slug);
  const visible =
    filter === "all" ? rest : rest.filter((c) => c.category === filter);
  const featuredVisible = filter === "all" || featured?.category === filter;

  const chips: { id: Filter; label: string }[] = [
    { id: "all", label: casesT("all") },
    ...caseCategories.map((c) => ({
      id: c.id as Filter,
      label: pick(c.label, locale),
    })),
  ];

  return (
    <section id="cases" className="section-pad scroll-mt-20">
      <div className="container-site">
        <Reveal>
          <SectionHeader
            eyebrow={navT("cases")}
            title={h.title}
            subtitle={h.subtitle}
            isSample
          />
        </Reveal>

        {/* filter chips — segmented glass bar (award-site idiom) */}
        <Reveal delay={STAGGER}>
          <div
            role="group"
            aria-label={casesT("filterLabel")}
            className="glass-light scrollbar-none mt-8 inline-flex max-w-full gap-1 overflow-x-auto rounded-full border border-border p-1 shadow-soft"
          >
            {chips.map((chip) => (
              <button
                key={chip.id}
                type="button"
                aria-pressed={filter === chip.id}
                onClick={() => setFilter(chip.id)}
                className={cn(
                  "shrink-0 rounded-full px-4 py-1.5 text-caption font-semibold transition-all duration-300 active:scale-[0.97]",
                  filter === chip.id
                    ? "bg-gradient-to-b from-primary to-primary-strong text-primary-foreground shadow-glow"
                    : "text-muted-foreground hover:bg-surface-2/80 hover:text-foreground",
                )}
              >
                {chip.label}
              </button>
            ))}
          </div>
        </Reveal>

        {/* bento grid */}
        <div className="mt-8 grid gap-5 md:grid-cols-3">
          {featured && featuredVisible && (
            <Reveal
              delay={STAGGER * 2}
              className="md:col-span-2 md:row-span-2"
            >
              <Spotlight className="h-full">
                <FeaturedCase entry={featured} />
              </Spotlight>
            </Reveal>
          )}

          {visible.map((entry, i) => (
            <Reveal key={entry.slug} delay={STAGGER * (i + 3)}>
              <Spotlight className="h-full">
                <CaseCard entry={entry} />
              </Spotlight>
            </Reveal>
          ))}

          {visible.length === 0 && !featuredVisible && (
            <div className="md:col-span-3 rounded-2xl border border-dashed border-border p-10 text-center">
              <p className="text-h3">{casesT("empty")}</p>
              <p className="mt-2 text-body text-muted-foreground">
                {casesT("emptyHint")}
              </p>
            </div>
          )}
        </div>

        <Reveal delay={STAGGER}>
          <p className="mt-6 text-caption text-muted-foreground">
            {casesT("disclaimer")}
          </p>
        </Reveal>
      </div>
    </section>
  );
}

function FeaturedCase({ entry }: { entry: CaseEntry }) {
  const locale = useLocale() as Locale;
  const t = useTranslations("cases");
  const a11yT = useTranslations("a11y");

  return (
    <article className="gradient-border group h-full rounded-3xl p-5 shadow-soft transition-all duration-300 hover:-translate-y-1 hover:shadow-glow sm:p-6">
      <div className="mb-5 flex flex-wrap items-center gap-2">
        <CategoryChip entry={entry} />
        <span className="flex items-center gap-1.5 text-caption text-muted-foreground tabular-nums">
          <CalendarDays className="size-3.5" aria-hidden="true" />
          {formatMonth(entry.period, locale)}
        </span>
      </div>

      <BeforeAfterSlider
        before={entry.images.before}
        after={entry.images.after}
        alt={pick(entry.images.alt, locale)}
        beforeLabel={t("before")}
        afterLabel={t("after")}
        ariaLabel={a11yT("beforeAfterSlider")}
        hint={a11yT("sliderHint")}
        aspect="aspect-[4/3]"
        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 60vw, 640px"
        priority={false}
      />

      <h3 className="mt-5 text-h3 text-balance">
        {pick(entry.title, locale)}
      </h3>
      <p className="mt-2 text-body text-muted-foreground">
        {pick(entry.summary, locale)}
      </p>

      <ViewCaseLink slug={entry.slug} className="mt-4" />
    </article>
  );
}

export function CaseCard({ entry }: { entry: CaseEntry }) {
  const locale = useLocale() as Locale;

  return (
    <article className="group flex h-full flex-col overflow-hidden rounded-2xl border border-border bg-card shadow-soft transition-all duration-300 hover:-translate-y-1 hover:border-primary/25 hover:shadow-glow">
      <div className="relative aspect-[16/10] overflow-hidden">
        <Image
          src={entry.images.after}
          alt={pick(entry.images.alt, locale)}
          fill
          sizes="(max-width: 768px) 90vw, 360px"
          className="object-cover transition-transform duration-700 ease-out group-hover:scale-108"
        />
        {/* cinematic veil over the photo */}
        <div
          aria-hidden="true"
          className="absolute inset-0 bg-gradient-to-t from-black/50 via-black/10 to-transparent opacity-80 transition-opacity duration-300 group-hover:opacity-95"
        />
        <span className="absolute bottom-3 start-3">
          <CategoryChip entry={entry} onImage />
        </span>
      </div>
      <div className="flex flex-1 flex-col p-5">
        <h3 className="text-h3 text-balance">{pick(entry.title, locale)}</h3>
        <p className="mt-2 line-clamp-2 flex-1 text-body text-muted-foreground">
          {pick(entry.summary, locale)}
        </p>
        <ViewCaseLink slug={entry.slug} className="mt-4" />
      </div>
    </article>
  );
}

function CategoryChip({
  entry,
  onImage = false,
}: {
  entry: CaseEntry;
  onImage?: boolean;
}) {
  const locale = useLocale() as Locale;
  const label = pick(categoryLabel(entry.category).label, locale);
  return (
    <span
      className={cn(
        "rounded-pill px-3 py-1 text-caption font-semibold",
        onImage
          ? "bg-[#14090c]/55 text-white backdrop-blur-sm"
          : "bg-primary/12 text-primary",
      )}
    >
      {label}
    </span>
  );
}

function ViewCaseLink({
  slug,
  className,
}: {
  slug: string;
  className?: string;
}) {
  const t = useTranslations("common");
  return (
    <Link
      href={`/cases/${slug}`}
      className={`group/link inline-flex items-center gap-1.5 self-start rounded-lg text-caption font-semibold text-primary transition-colors hover:text-primary-strong ${className ?? ""}`}
    >
      {t("readCase")}
      <ArrowUpRight
        className="size-4 transition-transform duration-300 group-hover/link:translate-x-0.5 group-hover/link:-translate-y-0.5 rtl:-scale-x-100 rtl:group-hover/link:-translate-x-0.5"
        aria-hidden="true"
      />
    </Link>
  );
}
