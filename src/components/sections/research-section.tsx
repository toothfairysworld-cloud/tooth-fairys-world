import { useTranslations } from "next-intl";
import { FileSearch, Link2 } from "lucide-react";

import { Reveal } from "@/components/common/reveal";
import { SectionHeader } from "@/components/common/section-header";
import { Spotlight } from "@/components/common/spotlight";
import { pick } from "@/content/types";
import type { Locale, ResearchItem } from "@/content/types";
import { STAGGER } from "@/lib/motion";

/** Research & projects — list rows: title, abstract, optional link. */
export function ResearchSection({
  locale,
  research,
  heading,
}: {
  locale: Locale;
  research: ResearchItem[];
  heading: { title: string; subtitle: string };
}) {
  const t = useTranslations("nav");
  const common = useTranslations("common");
  const h = heading;

  return (
    <section id="research" className="section-pad scroll-mt-20">
      <div className="container-site">
        <Reveal>
          <SectionHeader
            eyebrow={t("experience")}
            title={h.title}
            subtitle={h.subtitle}
            isSample
          />
        </Reveal>

        <ul className="mt-10 grid gap-4">
          {research.map((item, i) => (
            <Reveal key={item.id} delay={i * STAGGER}>
              <li>
                <Spotlight>
                  <article className="group grid gap-4 rounded-2xl border border-border bg-card p-6 shadow-soft transition-all duration-300 hover:-translate-y-1 hover:border-primary/25 hover:shadow-glow md:grid-cols-[auto_1fr] md:gap-6">
                    <div className="flex items-center gap-3 md:flex-col md:items-start">
                      <span className="grid size-10 place-items-center rounded-xl bg-gradient-to-br from-primary to-primary-strong text-primary-foreground shadow-sm">
                        <FileSearch className="size-5" aria-hidden="true" />
                      </span>
                      <span className="rounded-pill bg-gradient-to-b from-accent-warm/20 to-accent-warm/8 px-3 py-1 text-caption font-bold text-accent-warm ring-1 ring-accent-warm/25 tabular-nums">
                        {item.year}
                      </span>
                    </div>

                    <div>
                      <h3 className="text-h3">{pick(item.title, locale)}</h3>
                      <p className="mt-2 text-body text-muted-foreground">
                        {pick(item.abstract, locale)}
                      </p>
                      {item.link && (
                        <a
                          href={item.link}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="mt-3 inline-flex items-center gap-1.5 rounded-pill bg-primary/10 px-3 py-1 text-caption font-semibold text-primary transition-colors hover:bg-primary hover:text-primary-foreground"
                        >
                          <Link2 className="size-3.5" aria-hidden="true" />
                          {common("pdf")}
                          <span className="sr-only">{common("externalLink")}</span>
                        </a>
                      )}
                    </div>
                  </article>
                </Spotlight>
              </li>
            </Reveal>
          ))}
        </ul>
      </div>
    </section>
  );
}
