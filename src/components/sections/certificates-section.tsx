import { useTranslations } from "next-intl";
import { Award, CalendarDays, FileText } from "lucide-react";

import { Reveal } from "@/components/common/reveal";
import { SectionHeader } from "@/components/common/section-header";
import { Spotlight } from "@/components/common/spotlight";
import { pick } from "@/content/types";
import type { Certificate, Locale } from "@/content/types";
import { formatMonth } from "@/lib/format";
import { STAGGER } from "@/lib/motion";

/**
 * Certificates & courses — horizontal scroll-snap cards.
 * Swipeable on mobile, drag-scrollable on desktop.
 */
export function CertificatesSection({
  locale,
  certificates,
  heading,
}: {
  locale: Locale;
  certificates: Certificate[];
  heading: { title: string; subtitle: string };
}) {
  const t = useTranslations("nav");
  const common = useTranslations("common");
  const h = heading;

  return (
    <section id="certificates" className="section-pad scroll-mt-20 aurora-blush">
      <div className="container-site">
        <Reveal>
          <SectionHeader
            eyebrow={t("cases")}
            title={h.title}
            subtitle={h.subtitle}
            isSample
          />
        </Reveal>
      </div>

      <Reveal delay={STAGGER} className="mt-10">
        <div className="relative">
          {/* edge fades hint at scrollability */}
          <div
            aria-hidden="true"
            className="fade-start pointer-events-none absolute inset-y-0 start-0 z-10 w-10"
          />
          <div
            aria-hidden="true"
            className="fade-end pointer-events-none absolute inset-y-0 end-0 z-10 w-10"
          />

          <ul className="scrollbar-slim flex snap-x snap-mandatory gap-4 overflow-x-auto px-4 pb-4 sm:px-6 lg:px-8">
            {certificates.map((cert) => (
              <li
                key={cert.id}
                className="w-[17rem] shrink-0 snap-start sm:w-[19rem]"
              >
                <Spotlight className="h-full">
                  <article className="relative flex h-full flex-col overflow-hidden rounded-2xl border border-border bg-card p-5 shadow-soft transition-all duration-300 hover:-translate-y-1 hover:border-accent-warm/35 hover:shadow-glow">
                    {/* champagne hairline on the top edge */}
                    <span
                      aria-hidden="true"
                      className="absolute inset-x-5 top-0 h-px bg-gradient-to-r from-transparent via-accent-warm/60 to-transparent"
                    />
                    {/* seal watermark */}
                    <Award
                      aria-hidden="true"
                      className="absolute -end-4 -top-5 size-24 rotate-12 text-accent-warm/8"
                    />

                    <span className="grid size-10 place-items-center rounded-xl bg-gradient-to-br from-accent-warm to-accent-warm-strong text-white shadow-sm">
                      <Award className="size-5" aria-hidden="true" />
                    </span>
                    <h3 className="mt-4 text-h3">{pick(cert.title, locale)}</h3>
                    <p className="mt-1.5 flex-1 text-caption text-muted-foreground">
                      {pick(cert.issuer, locale)}
                    </p>
                    <footer className="mt-4 flex items-center justify-between border-t border-border pt-3">
                      <span className="flex items-center gap-1.5 text-caption text-muted-foreground tabular-nums">
                        <CalendarDays className="size-3.5" aria-hidden="true" />
                        {formatMonth(cert.date, locale)}
                      </span>
                      {cert.pdf ? (
                        <a
                          href={cert.pdf}
                          className="inline-flex items-center gap-1.5 rounded-pill bg-primary/10 px-2.5 py-1 text-caption font-semibold text-primary transition-colors hover:bg-primary hover:text-primary-foreground"
                        >
                          <FileText className="size-3.5" aria-hidden="true" />
                          {common("pdf")}
                        </a>
                      ) : (
                        <span className="text-caption text-muted-foreground/60">
                          —
                        </span>
                      )}
                    </footer>
                  </article>
                </Spotlight>
              </li>
            ))}
          </ul>
        </div>
      </Reveal>
    </section>
  );
}
