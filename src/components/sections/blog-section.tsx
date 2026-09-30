import { useTranslations } from "next-intl";
import Image from "next/image";
import { ArrowUpRight, CalendarDays, Clock } from "lucide-react";

import { Reveal } from "@/components/common/reveal";
import { SectionHeader } from "@/components/common/section-header";
import { Spotlight } from "@/components/common/spotlight";
import { pick } from "@/content/types";
import type { BlogPost, Locale } from "@/content/types";
import { formatDate, formatReadingTime } from "@/lib/format";
import { STAGGER } from "@/lib/motion";
import { Link } from "@/i18n/navigation";

/** Blog — featured article card + compact rows + view-all. */
export function BlogSection({
  locale,
  posts,
  heading,
}: {
  locale: Locale;
  posts: BlogPost[];
  heading: { title: string; subtitle: string };
}) {
  const t = useTranslations("nav");
  const common = useTranslations("common");
  const h = heading;

  const [featured, ...rest] = posts;

  return (
    <section id="blog" className="section-pad scroll-mt-20">
      <div className="container-site">
        <Reveal>
          <SectionHeader
            eyebrow={t("blog")}
            title={h.title}
            subtitle={h.subtitle}
            isSample
          />
        </Reveal>

        <div className="mt-10 grid gap-5 lg:grid-cols-2">
          {featured && (
            <Reveal delay={STAGGER} className="lg:row-span-2">
              <Spotlight className="h-full">
                <FeaturedPost post={featured} locale={locale} />
              </Spotlight>
            </Reveal>
          )}

          <div className="grid gap-4">
            {rest.slice(0, 2).map((post, i) => (
              <Reveal key={post.slug} delay={STAGGER * (i + 2)}>
                <Spotlight className="h-full">
                  <CompactPost post={post} locale={locale} />
                </Spotlight>
              </Reveal>
            ))}

            <Reveal delay={STAGGER * 4}>
              <Link
                href="/blog"
                className="group flex items-center justify-between rounded-2xl border border-dashed border-primary/30 bg-primary/5 px-5 py-4 text-caption font-semibold text-primary transition-all hover:border-primary/50 hover:bg-primary/10"
              >
                {common("viewAll")} — {h.title}
                <ArrowUpRight
                  className="size-4 transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5 rtl:-scale-x-100 rtl:group-hover:-translate-x-0.5"
                  aria-hidden="true"
                />
              </Link>
            </Reveal>
          </div>
        </div>
      </div>
    </section>
  );
}

export function PostMeta({
  post,
  locale,
  className,
}: {
  post: BlogPost;
  locale: Locale;
  className?: string;
}) {
  return (
    <p className={`flex flex-wrap items-center gap-x-4 gap-y-1 text-caption text-muted-foreground ${className ?? ""}`}>
      <span className="flex items-center gap-1.5 tabular-nums">
        <CalendarDays className="size-3.5" aria-hidden="true" />
        {formatDate(post.date, locale)}
      </span>
      <span className="flex items-center gap-1.5 tabular-nums">
        <Clock className="size-3.5" aria-hidden="true" />
        {formatReadingTime(post.readingMinutes, locale)}
      </span>
      <span className="rounded-pill bg-gradient-to-r from-accent-warm/20 to-accent-warm/8 px-2.5 py-0.5 font-semibold text-accent-warm ring-1 ring-accent-warm/25">
        {pick(post.category, locale)}
      </span>
    </p>
  );
}

export function FeaturedPost({ post, locale }: { post: BlogPost; locale: Locale }) {
  return (
    <article className="group h-full overflow-hidden rounded-3xl border border-border bg-card shadow-soft transition-all duration-300 hover:-translate-y-1 hover:border-primary/25 hover:shadow-glow">
      <Link href={`/blog/${post.slug}`} className="flex h-full flex-col">
        <div className="relative aspect-[16/9] overflow-hidden">
          <Image
            src={post.cover.src}
            alt={pick(post.cover.alt, locale)}
            fill
            sizes="(max-width: 1024px) 100vw, 560px"
            className="object-cover transition-transform duration-700 ease-out group-hover:scale-105"
          />
          {/* cinematic veil */}
          <div
            aria-hidden="true"
            className="absolute inset-0 bg-gradient-to-t from-black/45 via-transparent to-transparent opacity-70 transition-opacity duration-300 group-hover:opacity-90"
          />
        </div>
        <div className="flex flex-1 flex-col p-6">
          <PostMeta post={post} locale={locale} />
          <h3 className="mt-3 text-h2 text-balance">{pick(post.title, locale)}</h3>
          <p className="mt-3 flex-1 text-body text-muted-foreground">
            {pick(post.excerpt, locale)}
          </p>
        </div>
      </Link>
    </article>
  );
}

export function CompactPost({ post, locale }: { post: BlogPost; locale: Locale }) {
  return (
    <article className="group h-full rounded-2xl border border-border bg-card p-4 shadow-soft transition-all duration-300 hover:-translate-y-0.5 hover:border-primary/25 hover:shadow-glow">
      <Link
        href={`/blog/${post.slug}`}
        className="flex items-center gap-4"
      >
        <div className="relative hidden h-20 w-28 shrink-0 overflow-hidden rounded-xl sm:block">
          <Image
            src={post.cover.src}
            alt={pick(post.cover.alt, locale)}
            fill
            sizes="112px"
            className="object-cover transition-transform duration-700 ease-out group-hover:scale-110"
          />
        </div>
        <div className="min-w-0">
          <h3 className="text-h3 text-balance">{pick(post.title, locale)}</h3>
          <PostMeta post={post} locale={locale} className="mt-1.5" />
        </div>
      </Link>
    </article>
  );
}
