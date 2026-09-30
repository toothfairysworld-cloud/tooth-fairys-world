import { useTranslations } from "next-intl";
import { Quote, Sparkles } from "lucide-react";

import { Chip } from "@/components/common/chip";
import { Reveal } from "@/components/common/reveal";
import { SampleBadge } from "@/components/common/sample-badge";
import { SectionHeader } from "@/components/common/section-header";
import { pick } from "@/content/types";
import type { Locale } from "@/content/types";
import type { ProfileData } from "@/lib/data";
import { STAGGER } from "@/lib/motion";
import { ArchImage } from "@/components/common/arch-image";

const COLLAGE = [
  {
    src: "/images/about-1.webp",
    className: "start-0 top-8 rotate-[-4deg] z-10 w-[46%]",
    alt: {
      ar: "مطابقة درجة لون الأسنان بدليل الظلال في العيادة",
      en: "Matching a tooth shade with a shade guide in the clinic",
    },
  },
  {
    src: "/images/about-2.webp",
    className: "end-0 top-0 rotate-[3deg] z-20 w-[52%]",
    alt: {
      ar: "عيادة أسنان حديثة ومجهزة",
      en: "A modern, well-equipped dental clinic",
    },
  },
  {
    src: "/images/about-3.webp",
    className: "start-[28%] bottom-0 rotate-[-2deg] z-30 w-[48%]",
    alt: {
      ar: "أدوات أسنان مرتبة على صينية معقمة",
      en: "Dental instruments arranged on a sterilized tray",
    },
  },
];

const CLASS_OF = { ar: "دفعة 2027", en: "Class of 2027" };

/** About — mirrored split: overlapping photo collage + story + interests. */
export function AboutSection({
  locale,
  profile,
  heading,
}: {
  locale: Locale;
  profile: ProfileData;
  heading: { title: string; subtitle: string };
}) {
  const t = useTranslations("nav");
  const h = heading;

  const collage = [
    {
      src: profile.aboutImages?.[0] || "/images/about-1.webp",
      className: "start-0 top-8 rotate-[-4deg] z-10 w-[46%]",
      alt: {
        ar: "مطابقة درجة لون الأسنان بدليل الظلال في العيادة",
        en: "Matching a tooth shade with a shade guide in the clinic",
      },
    },
    {
      src: profile.aboutImages?.[1] || "/images/about-2.webp",
      className: "end-0 top-0 rotate-[3deg] z-20 w-[52%]",
      alt: {
        ar: "عيادة أسنان حديثة ومجهزة",
        en: "A modern, well-equipped dental clinic",
      },
    },
    {
      src: profile.aboutImages?.[2] || "/images/about-3.webp",
      className: "start-[28%] bottom-0 rotate-[-2deg] z-30 w-[48%]",
      alt: {
        ar: "أدوات أسنان مرتبة على صينية معقمة",
        en: "Dental instruments arranged on a sterilized tray",
      },
    },
  ];

  return (
    <section id="about" className="section-pad scroll-mt-20">
      <div className="container-site">
        <Reveal>
          <SectionHeader
            eyebrow={t("about")}
            title={h.title}
            subtitle={h.subtitle}
            isSample
          />
        </Reveal>

        <div className="mt-12 grid items-center gap-12 lg:grid-cols-2 lg:gap-16">
          {/* collage — photos + a glass chip pinned on the bottom photo,
              scrapbook-style; column height matches the story column */}
          <Reveal delay={STAGGER} className="relative mx-auto h-[24rem] w-full max-w-md sm:h-[28rem] lg:h-[32rem]">
            {collage.map((item, idx) => (
              <div
                key={`${item.src}-${idx}`}
                className={`absolute transition-transform duration-500 hover:rotate-0 hover:z-40 ${item.className}`}
              >
                <ArchImage
                  src={item.src}
                  alt={pick(item.alt, locale)}
                  aspect="aspect-[4/5]"
                  sizes="(max-width: 1024px) 45vw, 240px"
                  className="shadow-soft ring-4 ring-card"
                />
              </div>
            ))}
            <span className="absolute start-[13%] top-[44%] z-40 rotate-[2deg]">
              <span className="glass-light inline-flex items-center gap-1.5 rounded-full px-4 py-2 shadow-soft">
                <Sparkles
                  className="size-4 text-accent-warm"
                  aria-hidden="true"
                />
                <span className="text-caption font-semibold tabular-nums">
                  {CLASS_OF[locale]}
                </span>
              </span>
            </span>
          </Reveal>

          {/* story */}
          <div className="grid gap-6">
            {profile.bio.map((paragraph, i) => (
              <Reveal key={i} delay={i * STAGGER}>
                <p className="text-body text-muted-foreground">
                  {pick(paragraph, locale)}
                </p>
              </Reveal>
            ))}

            <Reveal delay={0.18}>
              <p className="text-body font-semibold">
                {pick(profile.university, locale)}
              </p>
            </Reveal>

            <Reveal delay={0.22}>
              <div className="flex flex-wrap gap-2">
                {profile.interests.map((interest) => (
                  <Chip key={interest.en} variant="warm">
                    {pick(interest, locale)}
                  </Chip>
                ))}
              </div>
            </Reveal>
          </div>
        </div>

        {/* philosophy pull-quote — full-width editorial close */}
        <Reveal delay={0.26}>
          <figure className="mx-auto mt-14 max-w-2xl text-center">
            <span
              aria-hidden="true"
              className="mx-auto grid size-12 place-items-center rounded-pill bg-gradient-to-br from-accent-warm/15 to-accent-warm/5 ring-1 ring-accent-warm/30"
            >
              <Quote
                className="size-5 text-accent-warm"
                aria-hidden="true"
              />
            </span>
            <span
              aria-hidden="true"
              className="mx-auto mt-5 block h-px w-24 bg-gradient-to-r from-transparent via-accent-warm/50 to-transparent"
            />
            <blockquote className="mt-4 text-balance font-heading text-h3 font-semibold leading-relaxed">
              {pick(profile.philosophy, locale)}
            </blockquote>
            <span
              aria-hidden="true"
              className="mx-auto mt-5 block h-px w-24 bg-gradient-to-r from-transparent via-accent-warm/50 to-transparent"
            />
            <figcaption className="mt-4 flex items-center justify-center gap-2 text-caption text-muted-foreground">
              — {pick(profile.name, locale)}
              <SampleBadge />
            </figcaption>
          </figure>
        </Reveal>
      </div>
    </section>
  );
}
