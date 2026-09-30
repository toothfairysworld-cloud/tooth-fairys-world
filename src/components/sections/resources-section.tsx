import { useTranslations } from "next-intl";
import {
  BookOpen,
  CalendarCheck,
  Download,
  Languages,
  ListChecks,
} from "lucide-react";

import { Reveal } from "@/components/common/reveal";
import { SectionHeader } from "@/components/common/section-header";
import { pick } from "@/content/types";
import type { Locale, ResourceItem } from "@/content/types";
import { formatNumber } from "@/lib/format";
import { STAGGER } from "@/lib/motion";
import { Button } from "@/components/ui/button";

const KIND_ICONS = {
  notes: BookOpen,
  checklist: ListChecks,
  plan: CalendarCheck,
  glossary: Languages,
} as const;

/** Resources for junior students — download cards with counters. */
export function ResourcesSection({
  locale,
  resources,
  heading,
}: {
  locale: Locale;
  resources: ResourceItem[];
  heading: { title: string; subtitle: string };
}) {
  const t = useTranslations("nav");
  const common = useTranslations("common");
  const h = heading;

  return (
    <section id="resources" className="section-pad scroll-mt-20">
      <div className="container-site">
        <Reveal>
          <SectionHeader
            eyebrow={t("about")}
            title={h.title}
            subtitle={h.subtitle}
            isSample
          />
        </Reveal>

        <ul className="mt-10 grid gap-4 sm:grid-cols-2">
          {resources.map((resource, i) => {
            const Icon = KIND_ICONS[resource.kind];
            return (
              <Reveal key={resource.id} delay={i * STAGGER}>
                <li>
                  <article className="flex h-full flex-col gap-4 rounded-2xl border border-border bg-card p-5 shadow-xs sm:flex-row sm:items-center">
                    <span className="grid size-12 shrink-0 place-items-center rounded-xl bg-accent-warm/12 text-accent-warm">
                      <Icon className="size-6" aria-hidden="true" />
                    </span>

                    <div className="min-w-0 flex-1">
                      <h3 className="text-h3">
                        {pick(resource.title, locale)}
                      </h3>
                      <p className="mt-1.5 text-caption text-muted-foreground">
                        {pick(resource.description, locale)}
                      </p>
                      <p className="mt-2 text-caption font-semibold text-primary tabular-nums">
                        {formatNumber(resource.downloads, locale)}{" "}
                        {common("downloads")}
                      </p>
                    </div>

                    <Button
                      asChild
                      variant="outline"
                      size="sm"
                      className="shrink-0 rounded-xl"
                    >
                      <a href={resource.file} download>
                        <Download className="size-4" aria-hidden="true" />
                        {common("download")}
                        <span className="sr-only">
                          {" "}
                          — {pick(resource.title, locale)}
                        </span>
                      </a>
                    </Button>
                  </article>
                </li>
              </Reveal>
            );
          })}
        </ul>
      </div>
    </section>
  );
}
