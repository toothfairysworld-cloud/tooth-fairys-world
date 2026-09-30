/** Shared motion vocabulary — one place to keep physics consistent. */

export const EASE = [0.22, 1, 0.36, 1] as const;

export const DURATION = {
  fast: 0.15, // hover / micro feedback
  base: 0.25, // section reveals
  slow: 0.55, // hero entrance
} as const;

/** Tooth float, before/after drag release, gentle pops. */
export const SPRING = { type: "spring", stiffness: 120, damping: 14 } as const;

/** Stagger delay used in grids (60ms). */
export const STAGGER = 0.06;
