import { SampleBadge } from "./sample-badge";

interface SectionHeaderProps {
  eyebrow?: string;
  title: string;
  subtitle?: string;
  isSample?: boolean;
  align?: "start" | "center";
  className?: string;
  id?: string;
}

/** Consistent section heading: amber eyebrow, display title, muted subtitle. */
export function SectionHeader({
  eyebrow,
  title,
  subtitle,
  isSample = false,
  align = "start",
  className,
  id,
}: SectionHeaderProps) {
  return (
    <div
      className={`max-w-2xl ${align === "center" ? "mx-auto text-center" : ""} ${className ?? ""}`}
    >
      {(eyebrow || isSample) && (
        <div
          className={`mb-3 flex flex-wrap items-center gap-2.5 ${align === "center" ? "justify-center" : ""}`}
        >
          {eyebrow && (
            <>
              {/* quiet-luxury eyebrow: gold diamond + tracked caption + hairline */}
              <span
                aria-hidden="true"
                className="size-1.5 rotate-45 rounded-[1px] bg-gradient-to-br from-accent-warm to-accent-warm-strong"
              />
              <span className="text-caption font-semibold uppercase tracking-[0.18em] text-accent-warm">
                {eyebrow}
              </span>
              <span
                aria-hidden="true"
                className={`h-px w-10 bg-gradient-to-r from-accent-warm/70 to-transparent ${align === "center" ? "hidden" : ""}`}
              />
            </>
          )}
          {isSample && <SampleBadge />}
        </div>
      )}
      <h2 id={id} className="text-h2 text-balance">
        {title}
      </h2>
      {subtitle && (
        <p className="mt-3 max-w-xl text-body text-muted-foreground">
          {subtitle}
        </p>
      )}
    </div>
  );
}
