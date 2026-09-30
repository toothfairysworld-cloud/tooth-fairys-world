"use client";

import { useRef } from "react";
import Image from "next/image";
import { motion, useReducedMotion, useScroll, useTransform } from "framer-motion";
import { useLocale, useTranslations } from "next-intl";
import { ArrowDown, Download, Mail, Sparkle } from "lucide-react";

import { SampleBadge } from "@/components/common/sample-badge";
import { ToothIcon } from "@/components/common/tooth-icon";
import { pick } from "@/content/types";
import type { Locale } from "@/content/types";
import type { ProfileData } from "@/lib/data";
import { DURATION, EASE } from "@/lib/motion";
import { GraduationCounter } from "./graduation-counter";

const RIBBON = {
  ar: [
    "طالبة طب أسنان — السنة الخامسة",
    "دفعة 2027",
    "‏+120 حشوة",
    "‏+45 علاج عصب",
    "‏+60 معالجة لثة",
    "محفظة أكاديمية — ليست عيادة",
  ],
  en: [
    "Fifth-year dental student",
    "Class of 2027",
    "120+ restorations",
    "45+ endodontic cases",
    "60+ periodontal cases",
    "Academic portfolio — not a clinic",
  ],
} as const;

/**
 * Hero — cinematic full-bleed portrait.
 * Big picture, black gradient fading to 0 opacity toward the top,
 * huge serif name, glass countdown + CTAs over the image.
 * Parallax + slow Ken-Burns settle; fully reduced-motion safe.
 */
export function Hero({ profile }: { profile: ProfileData }) {
  const t = useTranslations("hero");
  const locale = useLocale() as Locale;
  const reduce = useReducedMotion();
  const sectionRef = useRef<HTMLElement>(null);

  const name = pick(profile.name, locale);
  const value = pick(profile.valueStatement, locale);
  const portraitAlt = pick(profile.portrait.alt, locale);

  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start start", "end start"],
  });
  const imageY = useTransform(scrollYProgress, [0, 1], ["0%", "18%"]);
  const contentY = useTransform(scrollYProgress, [0, 1], ["0%", "38%"]);
  const contentOpacity = useTransform(scrollYProgress, [0, 0.75], [1, 0]);

  const item = {
    hidden: { opacity: 0, y: 30 },
    show: { opacity: 1, y: 0, transition: { duration: DURATION.slow, ease: EASE } },
  };

  const isEn = locale === "en";

  return (
    <section
      id="hero"
      ref={sectionRef}
      aria-label={name}
      className="noise-grain relative flex min-h-[100svh] flex-col justify-end overflow-hidden bg-[#14090c] text-white"
    >
      {/* full-bleed picture — parallax drift + gentle settle (Ken Burns) */}
      <motion.div
        aria-hidden="true"
        className="absolute inset-0"
        style={reduce ? undefined : { y: imageY }}
      >
        <motion.div
          className="absolute inset-0"
          initial={reduce ? undefined : { scale: 1.12 }}
          animate={{ scale: 1 }}
          transition={reduce ? { duration: 0 } : { duration: 2.2, ease: EASE }}
        >
          <Image
            src={profile.portrait.src}
            alt=""
            fill
            priority
            sizes="100vw"
            className="object-cover object-[50%_38%]"
          />
        </motion.div>
      </motion.div>

      {/* black gradient scrim — solid at the bottom, 0 opacity at the top;
          a soft top band keeps the floating navbar legible;
          on wide screens a side gradient darkens the text side (locale-aware) */}
      <div aria-hidden="true" className="absolute inset-0 hero-scrim" />
      <div
        aria-hidden="true"
        className={
          locale === "ar"
            ? "absolute inset-0 hidden bg-gradient-to-l from-[rgb(10_6_8/0.42)] via-[rgb(10_6_8/0.12)] to-transparent md:block"
            : "absolute inset-0 hidden bg-gradient-to-r from-[rgb(10_6_8/0.42)] via-[rgb(10_6_8/0.12)] to-transparent md:block"
        }
      />

      {/* content */}
      <motion.div
        style={reduce ? undefined : { y: contentY, opacity: contentOpacity }}
        className="container-site relative z-10 pb-24 pt-32 md:pb-28"
      >
        <motion.div
          initial="hidden"
          animate="show"
          variants={{
            hidden: {},
            show: { transition: { staggerChildren: 0.12, delayChildren: 0.15 } },
          }}
          className="max-w-3xl"
        >
          <motion.div variants={item} className="mb-5 flex flex-wrap items-center gap-3">
            <span aria-hidden="true" className="h-px w-10 bg-accent-warm/90" />
            <p className="text-caption font-semibold uppercase tracking-[0.22em] text-[#e7c08a]">
              {t("eyebrow")}
            </p>
            <SampleBadge tone="invert" />
          </motion.div>

          <motion.h1
            variants={item}
            className={`text-display text-balance text-white ${
              isEn ? "font-heading italic" : ""
            }`}
          >
            {name}
          </motion.h1>

          <motion.p
            variants={item}
            className="mt-5 max-w-xl text-body text-white/80 [text-shadow:0_1px_12px_rgb(10_6_8/0.45)]"
          >
            {value}
          </motion.p>

          <motion.div variants={item} className="mt-8">
            <GraduationCounter
              variant="onImage"
              graduationDate={profile.graduationDate}
            />
          </motion.div>

          <motion.div variants={item} className="mt-6">
            <HeroActions t={t} cvPdf={profile.cvPdf ?? "#"} />
          </motion.div>
        </motion.div>
      </motion.div>

      {/* scroll cue */}
      <motion.a
        href="#about"
        aria-label={t("scrollCue")}
        className="absolute bottom-16 start-1/2 z-10 hidden -translate-x-1/2 rounded-full p-2 text-white/70 transition-colors hover:text-white focus-visible:text-white md:block"
        initial={reduce ? undefined : { opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.2, duration: DURATION.slow }}
      >
        <motion.span
          aria-hidden="true"
          className="block"
          animate={reduce ? undefined : { y: [0, 6, 0] }}
          transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
        >
          <ArrowDown className="size-5" />
        </motion.span>
      </motion.a>

      {/* Clean fixed milestone bar with tooth emblem — static and non-animated */}
      <div
        className="absolute inset-x-0 bottom-0 z-20 border-t border-white/15 bg-[#120a0e]/85 py-3.5 backdrop-blur-xl shadow-lg"
      >
        <div className="container-site flex flex-wrap items-center justify-center gap-x-5 gap-y-2.5 text-xs sm:text-sm font-medium text-white/85">
          {/* Clean Tooth Logo / شعار Emblem */}
          <div className="inline-flex items-center gap-2 rounded-full border border-[#e7c08a]/35 bg-[#e7c08a]/15 px-3 py-1 text-xs font-bold text-[#e7c08a] shadow-sm">
            <ToothIcon className="size-4 text-[#e7c08a]" />
            <span>{locale === "ar" ? "عالم جنية الأسنان" : "Tooth Fairy's World"}</span>
          </div>

          <span aria-hidden="true" className="hidden sm:inline text-[#e7c08a]/50">✦</span>

          {/* Milestone items */}
          {RIBBON[locale].map((phrase, i) => (
            <div key={i} className="flex items-center gap-3">
              <span className="whitespace-nowrap font-medium text-white/80">
                {phrase}
              </span>
              {i < RIBBON[locale].length - 1 && (
                <span aria-hidden="true" className="text-[#e7c08a]/40 text-xs">
                  ✦
                </span>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function HeroActions({
  t,
  cvPdf,
}: {
  t: ReturnType<typeof useTranslations>;
  cvPdf: string;
}) {
  return (
    <div className="flex flex-wrap items-center gap-3">
      <a
        href={cvPdf}
        download
        className="btn-shine inline-flex h-11 items-center gap-2 rounded-full bg-white px-6 text-sm font-semibold text-[#4a2030] shadow-lg shadow-black/25 transition-all hover:bg-white/90 hover:shadow-xl focus-visible:outline-2 focus-visible:outline-white active:scale-[0.98]"
      >
        <Download className="size-4" aria-hidden="true" />
        {t("cv")}
      </a>
      <a
        href="/#contact"
        className="inline-flex h-11 items-center gap-2 rounded-full border border-white/35 bg-white/5 px-6 text-sm font-semibold text-white backdrop-blur-sm transition-all hover:border-white/60 hover:bg-white/15 focus-visible:outline-2 focus-visible:outline-white active:scale-[0.98]"
      >
        <Mail className="size-4" aria-hidden="true" />
        {t("contact")}
      </a>
    </div>
  );
}
