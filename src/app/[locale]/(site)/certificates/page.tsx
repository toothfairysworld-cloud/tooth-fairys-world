import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { ArrowLeft } from "lucide-react";

import { CertificatesSection } from "@/components/sections/certificates-section";
import { pick } from "@/content/types";
import type { Locale } from "@/content/types";
import { routing } from "@/i18n/routing";
import { Link } from "@/i18n/navigation";
import { getCertificates, getSections } from "@/lib/data";
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
    title: t("certificates"),
    alternates: localeAlternates(locale as "ar" | "en", "certificates"),
  };
}

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

export default async function CertificatesPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale: rawLocale } = await params;
  const locale = rawLocale as Locale;
  setRequestLocale(locale);

  const [sections, certificates] = await Promise.all([
    getSections(),
    getCertificates(),
  ]);
  const h = sections.find((s) => s.id === "certificates");
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
        <CertificatesSection
          locale={locale}
          certificates={certificates}
          heading={{
            title: h ? pick(h.title, locale) : "",
            subtitle: h ? pick(h.subtitle, locale) : "",
          }}
        />
      </div>
    </div>
  );
}
