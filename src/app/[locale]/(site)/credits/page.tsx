import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { ArrowLeft, ExternalLink } from "lucide-react";

import { Reveal } from "@/components/common/reveal";
import { derivedNote, iconCredits, photoCredits } from "@/content/credits";
import type { Locale } from "@/content/types";
import { routing } from "@/i18n/routing";
import { Link } from "@/i18n/navigation";
import { localeAlternates } from "@/lib/seo";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "credits" });
  return {
    title: t("title"),
    alternates: localeAlternates(locale as "ar" | "en", "credits"),
  };
}

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

export default async function CreditsPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale: rawLocale } = await params;
  const locale = rawLocale as Locale;
  setRequestLocale(locale);

  const t = await getTranslations("credits");
  const common = await getTranslations("common");

  return (
    <div className="container-site section-pad">
      <Link
        href="/"
        className="inline-flex items-center gap-1.5 text-caption font-semibold text-primary hover:text-primary-strong"
      >
        <ArrowLeft className="size-4 rtl:-scale-x-100" aria-hidden="true" />
        {common("backHome")}
      </Link>

      <header className="mt-6 max-w-2xl">
        <h1 className="text-h2">{t("title")}</h1>
        <p className="mt-3 text-body text-muted-foreground">{t("subtitle")}</p>
        <p className="mt-2 text-caption text-muted-foreground">
          {locale === "ar" ? derivedNote.ar : derivedNote.en}
        </p>
      </header>

      <Reveal className="mt-10">
        <div className="overflow-x-auto rounded-2xl border border-border bg-card">
          <table className="w-full min-w-[40rem] text-start text-caption">
            <thead>
              <tr className="border-b border-border bg-surface-2/60">
                <th scope="col" className="px-4 py-3 text-start font-semibold">
                  {t("asset")}
                </th>
                <th scope="col" className="px-4 py-3 text-start font-semibold">
                  {t("usage")}
                </th>
                <th scope="col" className="px-4 py-3 text-start font-semibold">
                  {t("source")}
                </th>
                <th scope="col" className="px-4 py-3 text-start font-semibold">
                  {t("license")}
                </th>
              </tr>
            </thead>
            <tbody>
              {photoCredits.map((credit) => (
                <tr
                  key={credit.file}
                  className="border-b border-border last:border-0"
                >
                  <td className="px-4 py-3 font-mono text-[0.75rem] text-muted-foreground" dir="ltr">
                    {credit.file}
                  </td>
                  <td className="px-4 py-3">
                    {locale === "ar" ? credit.usage.ar : credit.usage.en}
                  </td>
                  <td className="px-4 py-3">
                    <a
                      href={credit.sourceUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1 font-semibold text-primary hover:text-primary-strong"
                    >
                      {credit.source}
                      <ExternalLink className="size-3" aria-hidden="true" />
                      <span className="sr-only">{common("externalLink")}</span>
                    </a>
                  </td>
                  <td className="px-4 py-3">
                    {credit.licenseUrl ? (
                      <a
                        href={credit.licenseUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-primary hover:text-primary-strong"
                      >
                        {credit.license}
                      </a>
                    ) : (
                      credit.license
                    )}
                  </td>
                </tr>
              ))}
              <tr>
                <td className="px-4 py-3 font-mono text-[0.75rem] text-muted-foreground" dir="ltr">
                  icons
                </td>
                <td className="px-4 py-3">{t("icons")}</td>
                <td className="px-4 py-3">
                  <a
                    href="https://lucide.dev"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="font-semibold text-primary hover:text-primary-strong"
                  >
                    Lucide
                  </a>
                </td>
                <td className="px-4 py-3">ISC</td>
              </tr>
            </tbody>
          </table>
        </div>
      </Reveal>
    </div>
  );
}
