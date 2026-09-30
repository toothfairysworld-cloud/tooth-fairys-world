import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { ArrowLeft, ShieldCheck } from "lucide-react";

import { Reveal } from "@/components/common/reveal";
import { routing } from "@/i18n/routing";
import { Link } from "@/i18n/navigation";
import type { Locale } from "@/content/types";
import { localeAlternates } from "@/lib/seo";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "privacy" });
  return {
    title: t("title"),
    alternates: localeAlternates(locale as "ar" | "en", "privacy"),
  };
}

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

const SECTIONS = ["s1", "s2", "s3", "s4", "s5"] as const;

export default async function PrivacyPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale: rawLocale } = await params;
  const locale = rawLocale as Locale;
  setRequestLocale(locale);

  const t = await getTranslations("privacy");
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

      <header className="mt-6 max-w-3xl">
        <span className="grid size-12 place-items-center rounded-2xl bg-primary/10 text-primary">
          <ShieldCheck className="size-6" aria-hidden="true" />
        </span>
        <h1 className="mt-4 text-h2">{t("title")}</h1>
        <p className="mt-2 text-caption text-muted-foreground">{t("updated")}</p>
        <p className="mt-4 text-body text-muted-foreground">{t("intro")}</p>
      </header>

      <div className="mt-10 grid max-w-3xl gap-6">
        {SECTIONS.map((key, i) => (
          <Reveal key={key} delay={i * 0.04}>
            <section className="rounded-2xl border border-border bg-card p-6">
              <h2 className="text-h3">{t(`${key}Title`)}</h2>
              <p className="mt-2.5 text-body text-muted-foreground">
                {t(`${key}Body`)}
              </p>
            </section>
          </Reveal>
        ))}
      </div>
    </div>
  );
}
