import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";

import { Hero } from "@/components/hero/hero";
import { SectionHub } from "@/components/home/section-hub";
import { pick } from "@/content/types";
import type { Locale } from "@/content/types";
import { routing, type AppLocale } from "@/i18n/routing";
import {
  getCertificates,
  getFaq,
  getProfile,
  getPublishedCases,
  getPublishedPosts,
  getResearch,
  getResources,
  getSections,
  getTestimonials,
  getTimeline,
  getVolunteering,
} from "@/lib/data";
import { localeAlternates } from "@/lib/seo";
import { site } from "@/lib/site";

/** DB-backed pages render live content from the dashboard. */
export const dynamic = "force-dynamic";

/**
 * Homepage — Main section is the cinematic Hero with a classic navbar,
 * followed by the Section Hub showcasing and linking to every individual section page.
 */
export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations({ locale, namespace: "meta" });
  return {
    title: { absolute: t("title") },
    description: t("description"),
    alternates: localeAlternates(locale as "ar" | "en"),
  };
}

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

export default async function HomePage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale: rawLocale } = await params;
  const locale = rawLocale as Locale;
  setRequestLocale(locale);
  const loc = locale as AppLocale;

  const [
    profile,
    sections,
    timeline,
    cases,
    certificates,
    research,
    volunteering,
    posts,
    faq,
    resources,
    testimonials,
  ] = await Promise.all([
    getProfile(),
    getSections(),
    getTimeline(),
    getPublishedCases(),
    getCertificates(),
    getResearch(),
    getVolunteering(),
    getPublishedPosts(),
    getFaq(),
    getResources(),
    getTestimonials(),
  ]);

  if (!profile) return null;

  const personJsonLd = {
    "@context": "https://schema.org",
    "@type": "Person",
    name: pick(profile.name, loc),
    alternateName: pick(profile.name, loc === "ar" ? "en" : "ar"),
    jobTitle: pick(profile.role, loc),
    description: pick(profile.valueStatement, loc),
    url: site.url,
    alumniOf: pick(profile.university, loc),
    knowsAbout: profile.interests.map((i) => pick(i, loc)),
    sameAs: [profile.socials.instagram].filter(Boolean),
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(personJsonLd) }}
      />

      {/* Main Section: The Hero */}
      <Hero profile={profile} />

      {/* Comprehensive Hub of all other sections */}
      <SectionHub
        locale={loc}
        sections={sections}
        timelineCount={timeline.length}
        casesCount={cases.length}
        certificatesCount={certificates.length}
        researchCount={research.length}
        volunteeringCount={volunteering.length}
        postsCount={posts.length}
        faqCount={faq.length}
        resourcesCount={resources.length}
        testimonialsCount={testimonials.length}
      />
    </>
  );
}
