import { useTranslations } from "next-intl";

import { Chip } from "@/components/common/chip";
import { Counter } from "@/components/common/counter";
import { Reveal } from "@/components/common/reveal";
import { SectionHeader } from "@/components/common/section-header";
import { Spotlight } from "@/components/common/spotlight";
import { pick } from "@/content/types";
import type { Locale, TimelineEntry } from "@/content/types";
import { STAGGER } from "@/lib/motion";
import { cn } from "@/lib/utils";

/**
 * Clinical experience — vertical timeline.
 * Desktop: center spine, alternating cards. Mobile: spine at the leading
 * edge (inline-start), so it mirrors correctly in RTL.
 */
export function TimelineSection({
  locale,
  timeline,
  heading,
}: {
  locale: Locale;
  timeline: TimelineEntry[];
  heading: { title: string; subtitle: string };
}) {
  const t = useTranslations("nav");
  const h = heading;

  return (
    <section id="experience" className="section-pad scroll-mt-20 aurora-blush">
      <div className="container-site">
        <Reveal>
          <SectionHeader
            eyebrow={t("experience")}
            title={h.title}
            subtitle={h.subtitle}
            isSample
          />
        </Reveal>

        <ol className="relative mt-14 grid gap-10 md:gap-14">
          {/* spine */}
          <span
            aria-hidden="true"
            className="absolute bottom-2 start-[1.125rem] top-2 w-px bg-gradient-to-b from-primary via-primary/40 to-transparent md:start-1/2"
          />

          {timeline.map((entry, i) => {
            const start = i % 2 === 0;
            return (
              <li
                key={entry.year}
                className="relative grid md:grid-cols-[1fr_auto_1fr] md:gap-8"
              >
                {/* node — rose core with a soft glow ring */}
                <span
                  aria-hidden="true"
                  className="absolute start-[1.125rem] top-2 z-10 -translate-x-1/2 md:start-1/2 rtl:translate-x-1/2"
                >
                  <span className="block size-3.5 rounded-full border-[3px] border-background bg-primary shadow-[0_0_0_5px_rgb(156_74_92/0.15)]" />
                </span>

                <Reveal
                  delay={i * STAGGER}
                  className={cn(
                    "ms-12 md:ms-0",
                    // place card on alternating sides of the spine
                    start ? "md:col-start-1" : "md:col-start-3",
                  )}
                >
                  <Spotlight className="h-full">
                  <article className="rounded-2xl border border-border bg-card p-6 shadow-soft transition-all duration-300 hover:-translate-y-1 hover:border-primary/25 hover:shadow-glow">
                    <header className="flex flex-wrap items-center gap-3">
                      <span className="rounded-pill bg-gradient-to-b from-accent-warm to-accent-warm-strong px-3.5 py-1 text-caption font-bold text-white shadow-sm tabular-nums">
                        {entry.year}
                      </span>
                      <h3 className="text-h3">{pick(entry.title, locale)}</h3>
                    </header>

                    <p className="mt-3 text-body text-muted-foreground">
                      {pick(entry.description, locale)}
                    </p>

                    {entry.skills.length > 0 && (
                      <div className="mt-4 flex flex-wrap gap-2">
                        {entry.skills.map((skill) => (
                          <Chip key={skill.en}>{pick(skill, locale)}</Chip>
                        ))}
                      </div>
                    )}

                    {entry.stats.length > 0 && (
                      <dl className="mt-5 grid grid-cols-2 gap-4 border-t border-border pt-4 sm:grid-cols-4">
                        {entry.stats.map((stat) => (
                          <div key={stat.label.en}>
                            <dd className="text-h3 font-bold text-gradient-rose">
                              <Counter
                                value={stat.value}
                                locale={locale}
                                suffix={
                                  stat.suffix ? pick(stat.suffix, locale) : ""
                                }
                              />
                            </dd>
                            <dt className="mt-1 text-caption text-muted-foreground">
                              {pick(stat.label, locale)}
                            </dt>
                          </div>
                        ))}
                      </dl>
                    )}
                  </article>
                  </Spotlight>
                </Reveal>
              </li>
            );
          })}
        </ol>
      </div>
    </section>
  );
}
