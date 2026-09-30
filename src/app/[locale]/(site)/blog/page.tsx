import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { ArrowLeft } from "lucide-react";

import { Reveal } from "@/components/common/reveal";
import { SectionHeader } from "@/components/common/section-header";
import {
  CompactPost,
  FeaturedPost,
} from "@/components/sections/blog-section";
import { pick } from "@/content/types";
import type { Locale } from "@/content/types";
import { routing } from "@/i18n/routing";
import { Link } from "@/i18n/navigation";
import { getPublishedPosts, getSections } from "@/lib/data";
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
    title: t("blog"),
    alternates: localeAlternates(locale as "ar" | "en", "blog"),
  };
}

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

export default async function BlogIndexPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale: rawLocale } = await params;
  const locale = rawLocale as Locale;
  setRequestLocale(locale);

  const h = (await getSections()).find((s) => s.id === "blog");
  const common = await getTranslations("common");
  const posts = await getPublishedPosts();
  const [featured, ...rest] = posts;

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

      <div className="mt-10 grid gap-5 lg:grid-cols-2">
        {featured && (
          <Reveal delay={STAGGER} className="lg:row-span-2">
            <FeaturedPost post={featured} locale={locale} />
          </Reveal>
        )}
        <div className="grid gap-4">
          {rest.map((post, i) => (
            <Reveal key={post.slug} delay={STAGGER * (i + 1)}>
              <CompactPost post={post} locale={locale} />
            </Reveal>
          ))}
        </div>
      </div>
    </div>
  );
}
