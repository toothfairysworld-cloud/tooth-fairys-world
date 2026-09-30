import { cn } from "@/lib/utils";

interface ChipProps {
  children: React.ReactNode;
  variant?: "outline" | "soft" | "warm";
  className?: string;
}

/** Static tag pill — interests, skills, meta labels.
 *  Editorial refresh: hairline rose outline, blush fill, champagne glass. */
export function Chip({ children, variant = "outline", className }: ChipProps) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-pill px-3 py-1 text-caption transition-colors",
        variant === "outline" &&
          "border border-primary/25 bg-card/70 text-muted-foreground",
        variant === "soft" &&
          "bg-gradient-to-b from-surface-2 to-accent/8 text-foreground ring-1 ring-primary/10",
        variant === "warm" &&
          "bg-gradient-to-b from-accent-warm/18 to-accent-warm/8 text-accent-warm ring-1 ring-accent-warm/25",
        className,
      )}
    >
      {children}
    </span>
  );
}
