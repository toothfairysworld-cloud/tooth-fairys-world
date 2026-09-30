import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { ArrowLeft } from "lucide-react";

import { VolunteeringSection } from "@/components/sections/volunteering-section";
import { pick } from "@/content/types";
import type { Locale } from "@/content/types";
import { routing } from "@/i18n/routing";
import { Link } from "@/i18n/navigation";
import { getVolunteering, getSections } from "@/lib/data";
import { localeAlternates } from "@/lib/seo";

export const dynamic = "force-dynamic";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "nav" });
  return {
    title: t("volunteering"),
    alternates: localeAlternates(locale as "ar" | "en", "volunteering"),
  };
}

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

export default async function VolunteeringPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale: rawLocale } = await params;
  const locale = rawLocale as Locale;
  setRequestLocale(locale);

  const [sections, volunteering] = await Promise.all([
    getSections(),
    getVolunteering(),
  ]);
  const h = sections.find((s) => s.id === "volunteering");
  const common = await getTranslations("common");

  return (
    <div className="container-site pt-8 pb-16">
      <Link
        href="/"
        className="inline-flex items-center gap-1.5 text-caption font-semibold text-primary hover:text-primary-strong transition-colors"
      >
        <ArrowLeft className="size-4 rtl:-scale-x-100" aria-hidden="true" />
        {common("backHome")}
      </Link>

      <div className="mt-4">
        <VolunteeringSection
          locale={locale}
          volunteering={volunteering}
          heading={{
            title: h ? pick(h.title, locale) : "",
            subtitle: h ? pick(h.subtitle, locale) : "",
          }}
        />
      </div>
    </div>
  );
}
