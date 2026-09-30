import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Image from "next/image";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { ArrowLeft } from "lucide-react";

import { ShareButtons } from "@/components/blog/share-buttons";
import { PostMeta } from "@/components/sections/blog-section";
import { Reveal } from "@/components/common/reveal";
import { SampleBadge } from "@/components/common/sample-badge";
import { pick } from "@/content/types";
import type { ArticleBlock, Locale } from "@/content/types";
import { getPost, getProfile, getRelatedPosts } from "@/lib/data";
import { formatDate } from "@/lib/format";
import { localeAlternates } from "@/lib/seo";
import { Link } from "@/i18n/navigation";
import { site } from "@/lib/site";

export const dynamic = "force-dynamic";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>;
}): Promise<Metadata> {
  const { locale, slug } = await params;
  const post = await getPost(slug);
  if (!post) return {};
  const l = locale as Locale;
  return {
    title: pick(post.title, l),
    description: pick(post.excerpt, l),
    alternates: localeAlternates(l, `blog/${slug}`),
    openGraph: {
      type: "article",
      title: pick(post.title, l),
      description: pick(post.excerpt, l),
      publishedTime: post.date,
      images: [{ url: post.cover.src, alt: pick(post.cover.alt, l) }],
    },
  };
}

function renderBlock(block: ArticleBlock, key: number) {
  switch (block.type) {
    case "h2":
      return <h2 key={key}>{block.text}</h2>;
    case "ul":
      return (
        <ul key={key}>
          {block.items.map((item, i) => (
            <li key={i}>{item}</li>
          ))}
        </ul>
      );
    default:
      return <p key={key}>{block.text}</p>;
  }
}

export default async function BlogArticlePage({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>;
}) {
  const { locale: rawLocale, slug } = await params;
  const locale = rawLocale as Locale;
  setRequestLocale(locale);
  const post = await getPost(slug);
  if (!post) notFound();
  const profile = await getProfile();

  const common = await getTranslations("common");
  const blogT = await getTranslations("blog");
  const related = await getRelatedPosts(slug, post.category);
  const canonical = `${site.url}${locale === "en" ? "" : "/ar"}/blog/${slug}`;

  const articleJsonLd = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: pick(post.title, locale),
    description: pick(post.excerpt, locale),
    image: `${site.url}${post.cover.src}`,
    datePublished: post.date,
    inLanguage: locale,
    author: {
      "@type": "Person",
      name: profile ? pick(profile.name, locale) : "",
      url: site.url,
    },
    mainEntityOfPage: canonical,
  };

  return (
    <article className="container-site section-pad">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(articleJsonLd) }}
      />
      <Link
        href="/blog"
        className="inline-flex items-center gap-1.5 text-caption font-semibold text-primary hover:text-primary-strong"
      >
        <ArrowLeft className="size-4 rtl:-scale-x-100" aria-hidden="true" />
        {common("backToBlog")}
      </Link>

      <Reveal className="mt-6">
        <header className="mx-auto max-w-3xl">
          <div className="flex flex-wrap items-center gap-3">
            <span className="rounded-pill bg-accent-warm/10 px-3 py-1 text-caption font-semibold text-accent-warm">
              {pick(post.category, locale)}
            </span>
            <SampleBadge />
          </div>
          <h1 className="mt-4 text-h2 text-balance">{pick(post.title, locale)}</h1>
          <PostMeta post={post} locale={locale} className="mt-4" />
        </header>
      </Reveal>

      <Reveal className="mt-8" delay={0.06}>
        <div className="relative mx-auto aspect-[16/8] max-w-4xl overflow-hidden rounded-3xl">
          <Image
            src={post.cover.src}
            alt={pick(post.cover.alt, locale)}
            fill
            priority
            sizes="(max-width: 1024px) 100vw, 896px"
            className="object-cover"
          />
        </div>
      </Reveal>

      <Reveal className="mt-10" delay={0.1}>
        <div className="prose-article mx-auto text-body">
          {pick(post.body, locale).map((block, i) => renderBlock(block, i))}
        </div>
      </Reveal>

      <Reveal className="mt-10">
        <div className="mx-auto max-w-3xl border-t border-border pt-6">
          <ShareButtons url={canonical} title={pick(post.title, locale)} />
        </div>
      </Reveal>

      {related.length > 0 && (
        <section className="mx-auto mt-14 max-w-4xl">
          <h2 className="text-h3">{blogT("related")}</h2>
          <ul className="mt-4 grid gap-4 sm:grid-cols-2">
            {related.map((item) => (
              <li key={item.slug}>
                <Link
                  href={`/blog/${item.slug}`}
                  className="flex h-full flex-col rounded-2xl border border-border bg-card p-5 shadow-xs transition-shadow hover:shadow-md"
                >
                  <span className="text-caption font-semibold text-accent-warm">
                    {pick(item.category, locale)}
                  </span>
                  <span className="mt-1.5 text-h3">{pick(item.title, locale)}</span>
                  <span className="mt-2 line-clamp-2 text-body text-muted-foreground">
                    {pick(item.excerpt, locale)}
                  </span>
                  <span className="mt-3 text-caption text-muted-foreground tabular-nums">
                    {formatDate(item.date, locale)}
                  </span>
                </Link>
              </li>
            ))}
          </ul>
        </section>
      )}
    </article>
  );
}
