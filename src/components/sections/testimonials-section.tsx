import { useTranslations } from "next-intl";
import { Quote } from "lucide-react";

import { Reveal } from "@/components/common/reveal";
import { SectionHeader } from "@/components/common/section-header";
import { pick } from "@/content/types";
import type { Locale, Testimonial } from "@/content/types";
import { STAGGER } from "@/lib/motion";
import { cn } from "@/lib/utils";

const AVATAR_HUES = ["bg-primary/15 text-primary", "bg-accent-warm/15 text-accent-warm"];

/** Testimonials — gentle marquee (pauses on hover/focus, static w/ reduced motion). */
export function TestimonialsSection({
  locale,
  testimonials,
  heading,
}: {
  locale: Locale;
  testimonials: Testimonial[];
  heading: { title: string; subtitle: string };
}) {
  const t = useTranslations("nav");
  const h = heading;

  return (
    <section id="testimonials" className="section-pad overflow-hidden scroll-mt-20 aurora-blush">
      <div className="container-site">
        <Reveal>
          <SectionHeader
            eyebrow={t("about")}
            title={h.title}
            subtitle={h.subtitle}
            align="center"
            isSample
          />
        </Reveal>
      </div>

      <Reveal delay={STAGGER} className="marquee-paused relative mt-12">
        <div className="animate-marquee flex w-max gap-4 px-4">
          {[...testimonials, ...testimonials].map((item, i) => (
            <div
              key={`${item.id}-${i}`}
              className={i >= testimonials.length ? "marquee-clone" : undefined}
            >
              <TestimonialCard
                item={item}
                locale={locale}
                clone={i >= testimonials.length}
              />
            </div>
          ))}
        </div>
      </Reveal>
    </section>
  );
}

function TestimonialCard({
  item,
  locale,
  clone,
}: {
  item: Testimonial;
  locale: Locale;
  clone: boolean;
}) {
  const hue = AVATAR_HUES[item.initials.charCodeAt(0) % AVATAR_HUES.length];

  return (
    <figure
      aria-hidden={clone || undefined}
      className="gradient-border w-[19rem] shrink-0 rounded-2xl p-5 shadow-soft transition-shadow duration-300 hover:shadow-glow sm:w-[22rem]"
    >
      <span
        aria-hidden="true"
        className="grid size-11 place-items-center rounded-pill bg-accent-warm/12 ring-1 ring-accent-warm/25"
      >
        <Quote className="size-5 text-accent-warm" />
      </span>
      <blockquote className="mt-4 text-body leading-relaxed">
        {pick(item.quote, locale)}
      </blockquote>
      <figcaption className="mt-5 flex items-center gap-3 border-t border-border/70 pt-4">
        <span
          aria-hidden="true"
          className={cn(
            "grid size-10 shrink-0 place-items-center rounded-pill text-caption font-bold ring-2 ring-primary/20 ring-offset-2 ring-offset-card",
            hue,
          )}
        >
          {item.initials}
        </span>
        <div>
          <p className="text-caption font-semibold">{item.name}</p>
          <p className="text-caption text-muted-foreground">
            {pick(item.role, locale)}
          </p>
        </div>
      </figcaption>
    </figure>
  );
}
