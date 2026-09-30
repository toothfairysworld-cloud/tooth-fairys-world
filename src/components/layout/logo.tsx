import { Link } from "@/i18n/navigation";
import { cn } from "@/lib/utils";

interface LogoProps {
  name: string;
  className?: string;
  /** "invert" — white/champagne for the dark cinematic hero. */
  tone?: "default" | "invert";
}

/**
 * Feminine monogram — soft arch (dental arch) cradling a tooth,
 * hairline strokes, rosewood + champagne on ivory; white over the hero.
 */
export function Logo({ name, className, tone = "default" }: LogoProps) {
  const invert = tone === "invert";
  return (
    <Link
      href="/"
      aria-label={name}
      className={cn(
        "group inline-flex items-center gap-2.5 rounded-full focus-visible:outline-2",
        invert ? "focus-visible:outline-white" : "focus-visible:outline-ring",
        className,
      )}
    >
      <svg
        viewBox="0 0 40 40"
        className="size-9 shrink-0"
        aria-hidden="true"
        focusable="false"
      >
        {/* soft arch — the dental arch */}
        <path
          d="M8 33 V18 a12 12 0 0 1 24 0 V33"
          fill="none"
          stroke={invert ? "rgba(255,255,255,0.9)" : "var(--primary)"}
          strokeWidth="2"
          strokeLinecap="round"
          className="transition-colors"
        />
        {/* tooth — champagne fill, softer silhouette */}
        <path
          d="M20 11.2 c-3.6 0-5.9 2.2-5.9 5.1 c0 1.8 .7 2.8 .7 4.4 c0 2.5-1.2 4.2-1.2 6.2 c0 2.6 1.3 4.1 2.5 4.1 c1.5 0 1.6-2.1 2.2-3.6 .3-.7 .8-1.1 1.7-1.1 s1.4 .4 1.7 1.1 c.6 1.5 .7 3.6 2.2 3.6 c1.2 0 2.5-1.5 2.5-4.1 c0-2-1.2-3.7-1.2-6.2 c0-1.6 .7-2.6 .7-4.4 c0-2.9-2.3-5.1-5.9-5.1 z"
          fill={invert ? "#e7c08a" : "var(--accent-warm)"}
        />
        {/* sparkle — a small feminine accent */}
        <path
          d="M30.5 8.5 l.7 1.8 1.8 .7 -1.8 .7 -.7 1.8 -.7-1.8 -1.8-.7 1.8-.7 z"
          fill={invert ? "rgba(231,192,138,0.95)" : "var(--primary)"}
          opacity="0.9"
        />
      </svg>
      <span
        className={cn(
          "text-h3 font-bold tracking-normal transition-opacity",
          invert ? "text-white group-hover:opacity-85" : "text-foreground group-hover:opacity-80",
        )}
      >
        {name}
      </span>
    </Link>
  );
}
