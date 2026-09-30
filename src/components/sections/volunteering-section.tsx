import { useTranslations } from "next-intl";
import Image from "next/image";

import { Counter } from "@/components/common/counter";
import { Reveal } from "@/components/common/reveal";
import { SectionHeader } from "@/components/common/section-header";
import { pick } from "@/content/types";
import type { Locale, VolunteeringItem } from "@/content/types";
import { STAGGER } from "@/lib/motion";
import { cn } from "@/lib/utils";

/**
 * Volunteering & community — alternating split rows:
 * arch-masked photo one side, story + impact counters on the other.
 */
export function VolunteeringSection({
  locale,
  volunteering,
  heading,
}: {
  locale: Locale;
  volunteering: VolunteeringItem[];
  heading: { title: string; subtitle: string };
}) {
  const t = useTranslations("nav");
  const h = heading;

  return (
    <section id="volunteering" className="section-pad scroll-mt-20 aurora-blush">
      <div className="container-site">
        <Reveal>
          <SectionHeader
            eyebrow={t("about")}
            title={h.title}
            subtitle={h.subtitle}
            isSample
          />
        </Reveal>

        <ul className="mt-12 grid gap-12 md:gap-16">
          {volunteering.map((item, i) => {
            const photoStart = i % 2 === 1;
            return (
              <li key={item.id}>
                <Reveal delay={STAGGER}>
                  <div
                    className={cn(
                      "grid items-center gap-8 md:grid-cols-2 md:gap-12",
                    )}
                  >
                    <div
                      className={cn(
                        "relative mx-auto w-full max-w-sm",
                        photoStart ? "md:order-2" : "md:order-1",
                      )}
                    >
                      <div className="arch-mask relative aspect-[4/3] bg-surface-2 shadow-soft ring-4 ring-card">
                        <Image
                          src={item.image.src}
                          alt={pick(item.image.alt, locale)}
                          fill
                          sizes="(max-width: 768px) 85vw, 460px"
                          className="object-cover"
                        />
                      </div>
                    </div>

                    <div
                      className={cn(
                        photoStart ? "md:order-1" : "md:order-2",
                      )}
                    >
                      <h3 className="text-h3">{pick(item.title, locale)}</h3>
                      <p className="mt-3 text-body text-muted-foreground">
                        {pick(item.description, locale)}
                      </p>

                      <dl className="mt-6 flex flex-wrap gap-x-10 gap-y-4">
                        {item.impact.map((stat) => (
                          <div key={stat.label.en}>
                            <dd className="text-display text-[2rem] font-bold text-gradient-rose tabular-nums">
                              <Counter
                                value={stat.value}
                                locale={locale}
                                suffix={stat.suffix ? pick(stat.suffix, locale) : ""}
                              />
                            </dd>
                            <dt className="mt-1 text-caption text-muted-foreground">
                              {pick(stat.label, locale)}
                            </dt>
                          </div>
                        ))}
                      </dl>
                    </div>
                  </div>
                </Reveal>
              </li>
            );
          })}
        </ul>
      </div>
    </section>
  );
}
