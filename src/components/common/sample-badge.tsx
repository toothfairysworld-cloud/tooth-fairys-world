import { useTranslations } from "next-intl";
import { cn } from "@/lib/utils";

/**
 * Small "نموذج / SAMPLE" marker — dashed outline, unobtrusive.
 * `tone="invert"` for dark photo backgrounds (hero).
 */
export function SampleBadge({
  className,
  tone = "default",
}: {
  className?: string;
  tone?: "default" | "invert";
}) {
  const t = useTranslations("sample");
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-pill border border-dashed px-2 py-0.5 text-[0.6875rem] font-semibold",
        tone === "default" && "border-accent-warm/60 text-accent-warm",
        tone === "invert" && "border-white/45 text-white/85",
        className,
      )}
    >
      {t("badge")}
    </span>
  );
}
