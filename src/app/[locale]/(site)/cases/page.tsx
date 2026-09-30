import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { ArrowLeft } from "lucide-react";

import { CaseCard } from "@/components/sections/cases-section";
import { Reveal } from "@/components/common/reveal";
import { SectionHeader } from "@/components/common/section-header";
import { pick } from "@/content/types";
import type { Locale } from "@/content/types";
import { routing } from "@/i18n/routing";
import { Link } from "@/i18n/navigation";
import { getPublishedCases, getSections } from "@/lib/data";
import { localeAlternates } from "@/lib/seo";
import { STAGGER } from "@/lib/motion";

export const dynamic = "force-dynamic";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "nav" });
  return {
    title: t("cases"),
    alternates: localeAlternates(locale as "ar" | "en", "cases"),
  };
}

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

export default async function CasesIndexPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale: rawLocale } = await params;
  const locale = rawLocale as Locale;
  setRequestLocale(locale);

  const h = (await getSections()).find((s) => s.id === "cases");
  const common = await getTranslations("common");
  const cases = await getPublishedCases();

  return (
    <div className="container-site section-pad">
      <Link
        href="/"
        className="inline-flex items-center gap-1.5 text-caption font-semibold text-primary hover:text-primary-strong"
      >
        <ArrowLeft className="size-4 rtl:-scale-x-100" aria-hidden="true" />
        {common("backHome")}
      </Link>

      <div className="mt-6">
        <SectionHeader
          title={h ? pick(h.title, locale) : ""}
          subtitle={h ? pick(h.subtitle, locale) : ""}
          isSample
        />
      </div>

      <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {cases.map((entry, i) => (
          <Reveal key={entry.slug} delay={i * STAGGER}>
            <CaseCard entry={entry} />
          </Reveal>
        ))}
      </div>
    </div>
  );
}
