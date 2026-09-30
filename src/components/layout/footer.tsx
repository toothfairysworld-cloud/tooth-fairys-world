import { getTranslations } from "next-intl/server";
import { ArrowUp, Sparkles } from "lucide-react";

import { navItems } from "./nav-items";
import { Link } from "@/i18n/navigation";

/**
 * Footer — dark editorial close (award-site idiom).
 * Always plum-black regardless of theme: champagne hairline on top,
 * soft rose glow, giant watermark wordmark, glass disclaimer chip.
 * Keeps `data-site-footer` + `mt-auto` for the sticky-footer contract.
 */
export async function Footer() {
  const navT = await getTranslations("nav");
  const metaT = await getTranslations("meta");
  const t = await getTranslations("footer");
  const year = new Date().getFullYear();
  const name = metaT("siteName");

  return (
    <footer
      data-site-footer
      className="relative mt-auto overflow-hidden bg-[#191114] text-[#f2e8ea]"
    >
      {/* champagne hairline on the top edge */}
      <div
        aria-hidden="true"
        className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-[#e7c08a]/70 to-transparent"
      />
      {/* soft rose aurora glow */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -top-28 start-[18%] size-[26rem] rounded-full bg-[#9c4a5c]/25 blur-[110px]"
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -bottom-32 end-[8%] size-[22rem] rounded-full bg-[#9e6b25]/15 blur-[110px]"
      />

      {/* giant watermark wordmark — quiet-luxury signature */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-0 bottom-0 select-none whitespace-nowrap text-center font-heading text-[clamp(4.5rem,15vw,12rem)] font-bold leading-[0.9] text-[#f2e8ea]/[0.045]"
      >
        {name}
      </div>

      <div className="container-site relative z-10 grid gap-12 py-16 md:grid-cols-[1.6fr_1fr_1fr] md:py-20">
        {/* brand block */}
        <div className="max-w-sm">
          <p className="font-heading text-h2 font-bold">{name}</p>
          <p className="mt-1 text-caption font-semibold uppercase tracking-[0.18em] text-[#e7c08a]">
            {t("role")}
          </p>

          <p className="mt-5 text-body leading-relaxed text-[#f2e8ea]/70">
            {t("disclaimerFull")}
          </p>

          <span className="mt-6 inline-flex items-center gap-2 rounded-full border border-[#e7c08a]/30 bg-[#e7c08a]/10 px-4 py-2 text-caption font-semibold text-[#e7c08a]">
            <Sparkles className="size-3.5" aria-hidden="true" />
            {t("disclaimer")}
          </span>
        </div>

        {/* site navigation */}
        <nav aria-label={t("navigation")}>
          <h2 className="text-caption font-semibold uppercase tracking-[0.18em] text-[#e7c08a]">
            {t("navigation")}
          </h2>
          <ul className="mt-5 grid gap-3">
            {navItems.map(({ href, key }) => (
              <li key={key}>
                <Link
                  href={href}
                  className="group inline-flex items-center gap-2 text-body text-[#f2e8ea]/70 transition-colors hover:text-[#e7c08a]"
                >
                  <span
                    aria-hidden="true"
                    className="h-px w-0 bg-[#e7c08a] transition-all duration-300 group-hover:w-4"
                  />
                  {navT(key)}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        {/* legal + back to top */}
        <nav aria-label={t("legal")}>
          <h2 className="text-caption font-semibold uppercase tracking-[0.18em] text-[#e7c08a]">
            {t("legal")}
          </h2>
          <ul className="mt-5 grid gap-3">
            <li>
              <Link
                href="/credits"
                className="group inline-flex items-center gap-2 text-body text-[#f2e8ea]/70 transition-colors hover:text-[#e7c08a]"
              >
                <span
                  aria-hidden="true"
                  className="h-px w-0 bg-[#e7c08a] transition-all duration-300 group-hover:w-4"
                />
                {t("credits")}
              </Link>
            </li>
            <li>
              <Link
                href="/privacy"
                className="group inline-flex items-center gap-2 text-body text-[#f2e8ea]/70 transition-colors hover:text-[#e7c08a]"
              >
                <span
                  aria-hidden="true"
                  className="h-px w-0 bg-[#e7c08a] transition-all duration-300 group-hover:w-4"
                />
                {t("privacy")}
              </Link>
            </li>
          </ul>

          <a
            href="#main-content"
            className="mt-8 inline-flex items-center gap-2 rounded-full border border-[#f2e8ea]/20 px-4 py-2 text-caption font-semibold text-[#f2e8ea]/80 transition-all hover:border-[#e7c08a]/50 hover:text-[#e7c08a]"
          >
            <ArrowUp
              className="size-3.5 transition-transform group-hover:-translate-y-0.5"
              aria-hidden="true"
            />
            {t("backToTop")}
          </a>
        </nav>
      </div>

      {/* bottom bar */}
      <div className="relative z-10 border-t border-[#f2e8ea]/10">
        <div className="container-site flex flex-col items-start justify-between gap-2 py-5 text-caption text-[#f2e8ea]/60 sm:flex-row sm:items-center">
          <p>{t("rights", { year })}</p>
          <p className="text-[#f2e8ea]/45">{t("builtNote")}</p>
        </div>
      </div>
    </footer>
  );
}
