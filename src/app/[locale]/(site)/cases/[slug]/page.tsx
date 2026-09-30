import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { ArrowLeft, CalendarDays } from "lucide-react";

import { BeforeAfterSlider } from "@/components/cases/before-after-slider";
import { Reveal } from "@/components/common/reveal";
import { SampleBadge } from "@/components/common/sample-badge";
import { categoryLabel } from "@/content";
import { pick } from "@/content/types";
import type { Locale } from "@/content/types";
import { formatMonth } from "@/lib/format";
import { getCase } from "@/lib/data";
import { localeAlternates } from "@/lib/seo";
import { Link } from "@/i18n/navigation";

export const dynamic = "force-dynamic";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>;
}): Promise<Metadata> {
  const { locale, slug } = await params;
  const entry = await getCase(slug);
  if (!entry) return {};
  return {
    title: pick(entry.title, locale as Locale),
    description: pick(entry.summary, locale as Locale),
    alternates: localeAlternates(locale as "ar" | "en", `cases/${slug}`),
    openGraph: {
      type: "article",
      title: pick(entry.title, locale as Locale),
      description: pick(entry.summary, locale as Locale),
      images: [
        {
          url: "/images/og-image.png",
          alt: pick(entry.title, locale as Locale),
        },
      ],
    },
  };
}

export default async function CaseDetailPage({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>;
}) {
  const { locale: rawLocale, slug } = await params;
  const locale = rawLocale as Locale;
  setRequestLocale(locale);
  const entry = await getCase(slug);
  if (!entry) notFound();

  const t = await getTranslations("cases");
  const common = await getTranslations("common");
  const a11y = await getTranslations("a11y");

  const storyBlocks: { label: string; text: string }[] = [
    { label: t("story.complaint"), text: pick(entry.story.complaint, locale) },
    { label: t("story.diagnosis"), text: pick(entry.story.diagnosis, locale) },
    { label: t("story.plan"), text: pick(entry.story.plan, locale) },
    { label: t("story.materials"), text: pick(entry.story.materials, locale) },
    { label: t("story.learned"), text: pick(entry.story.learned, locale) },
  ];

  return (
    <article className="container-site section-pad">
      <Link
        href="/cases"
        className="inline-flex items-center gap-1.5 text-caption font-semibold text-primary hover:text-primary-strong"
      >
        <ArrowLeft className="size-4 rtl:-scale-x-100" aria-hidden="true" />
        {common("backToCases")}
      </Link>

      <Reveal className="mt-6">
        <header className="max-w-3xl">
          <div className="flex flex-wrap items-center gap-3">
            <span className="rounded-pill bg-primary/12 px-3 py-1 text-caption font-semibold text-primary">
              {pick(categoryLabel(entry.category).label, locale)}
            </span>
            <span className="flex items-center gap-1.5 text-caption text-muted-foreground tabular-nums">
              <CalendarDays className="size-3.5" aria-hidden="true" />
              {formatMonth(entry.period, locale)}
            </span>
            <SampleBadge />
          </div>
          <h1 className="mt-4 text-h2 text-balance">{pick(entry.title, locale)}</h1>
          <p className="mt-3 text-body text-muted-foreground">
            {pick(entry.summary, locale)}
          </p>
        </header>
      </Reveal>

      <Reveal className="mt-8" delay={0.08}>
        <BeforeAfterSlider
          before={entry.images.before}
          after={entry.images.after}
          alt={pick(entry.images.alt, locale)}
          beforeLabel={t("before")}
          afterLabel={t("after")}
          ariaLabel={a11y("beforeAfterSlider")}
          hint={a11y("sliderHint")}
          aspect="aspect-[16/10]"
          sizes="(max-width: 1024px) 100vw, 1120px"
          priority
        />
      </Reveal>

      <div className="mt-12 grid max-w-3xl gap-4">
        {storyBlocks.map((block, i) => (
          <Reveal key={block.label} delay={0.05 * i}>
            <section className="rounded-2xl border border-border bg-card p-6">
              <h2 className="text-caption font-bold uppercase tracking-wider text-accent-warm">
                {block.label}
              </h2>
              <p className="mt-2.5 text-body">{block.text}</p>
            </section>
          </Reveal>
        ))}
      </div>

      <Reveal className="mt-8">
        <p className="max-w-3xl text-caption text-muted-foreground">
          {t("disclaimer")}
        </p>
      </Reveal>
    </article>
  );
}
