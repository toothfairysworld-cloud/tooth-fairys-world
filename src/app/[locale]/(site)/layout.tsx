import { getTranslations, setRequestLocale } from "next-intl/server";

import { Footer } from "@/components/layout/footer";
import { Header } from "@/components/layout/header";
import { PageViewTracker } from "@/components/layout/page-view-tracker";
import { SampleBanner } from "@/components/layout/sample-banner";
import { SkipLink } from "@/components/layout/skip-link";
import { getProfile } from "@/lib/data";
import { routing, type AppLocale } from "@/i18n/routing";

/**
 * Site chrome — header, sample banner, footer. Wraps every public page;
 * /admin deliberately lives outside this group for a chrome-free canvas.
 */
export default async function SiteLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);

  const t = await getTranslations({ locale, namespace: "a11y" });
  const profile = await getProfile();
  const name = profile ? profile.name[locale as AppLocale] : "";

  return (
    <div className="flex min-h-screen flex-col">
      <SkipLink label={t("skip")} />
      <Header name={name} />
      <main id="main-content" className="flex-1">
        {children}
      </main>
      <Footer />
      <PageViewTracker />
    </div>
  );
}
