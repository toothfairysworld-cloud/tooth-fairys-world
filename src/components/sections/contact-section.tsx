import { getTranslations } from "next-intl/server";
import { Instagram } from "lucide-react";

import { ContactForm } from "@/components/contact/contact-form";
import { Reveal } from "@/components/common/reveal";
import { SectionHeader } from "@/components/common/section-header";
import { pick } from "@/content/types";
import type { Locale } from "@/content/types";
import type { ProfileData } from "@/lib/data";
import { STAGGER } from "@/lib/motion";

const CHANNEL_LABELS = {
  instagram: { ar: "إنستغرام", en: "Instagram" },
} as const;

/** Contact — form + direct channels. */
export async function ContactSection({
  locale,
  profile,
  heading,
}: {
  locale: Locale;
  profile: ProfileData;
  heading: { title: string; subtitle: string };
}) {
  const t = await getTranslations("nav");
  const contactT = await getTranslations("contact");
  const h = heading;

  const CHANNELS = [
    ...(profile.socials.instagram
      ? [
          {
            key: "instagram" as const,
            href: profile.socials.instagram,
            label: CHANNEL_LABELS.instagram,
            icon: Instagram,
          },
        ]
      : []),
  ];

  return (
    <section id="contact" className="section-pad scroll-mt-20">
      <div className="container-site">
        <Reveal>
          <SectionHeader
            eyebrow={t("contact")}
            title={h.title}
            subtitle={h.subtitle}
            isSample
          />
        </Reveal>

        <div className="mt-10 grid gap-8 lg:grid-cols-[1.1fr_0.9fr] lg:gap-12">
          <Reveal delay={STAGGER}>
            <ContactForm />
          </Reveal>

          <Reveal delay={STAGGER * 2}>
            <div className="aurora-blush gradient-border flex h-full flex-col justify-center gap-6 rounded-2xl p-6 shadow-soft sm:p-8">
              <p className="text-h3">{contactT("channels")}</p>

              <ul className="grid gap-3">
                {CHANNELS.map((channel) => {
                  const Icon = channel.icon;
                  return (
                    <li key={channel.key}>
                      <a
                        href={channel.href}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="group flex items-center gap-3.5 rounded-xl border border-border bg-card p-4 shadow-soft transition-all duration-300 hover:-translate-y-0.5 hover:border-primary/40 hover:shadow-glow"
                      >
                        <span className="grid size-11 shrink-0 place-items-center rounded-pill bg-gradient-to-br from-primary to-primary-strong text-primary-foreground shadow-sm transition-transform duration-300 group-hover:scale-110">
                          <Icon className="size-5" aria-hidden="true" />
                        </span>
                        <span className="flex-1">
                          <span className="block text-caption font-semibold">
                            {contactT(channel.key)}
                          </span>
                          <span
                            dir="ltr"
                            className="block truncate text-caption text-muted-foreground"
                          >
                            {channel.href.replace("https://", "").replace("http://", "")}
                          </span>
                        </span>
                      </a>
                    </li>
                  );
                })}
              </ul>

              <p className="text-caption text-muted-foreground">
                {contactT("subtitle")}
              </p>
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
