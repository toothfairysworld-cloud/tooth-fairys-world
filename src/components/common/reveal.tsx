"use client";

import { motion, useReducedMotion } from "framer-motion";
import type { ReactNode } from "react";

import { DURATION, EASE } from "@/lib/motion";

interface RevealProps {
  children: ReactNode;
  className?: string;
  /** Seconds of delay — use i * STAGGER for grid children. */
  delay?: number;
  /** Initial Y offset in px. */
  y?: number;
}

/**
 * Scroll-reveal wrapper: fade + rise, fires once, respects
 * prefers-reduced-motion (content renders instantly, no transform).
 */
export function Reveal({ children, className, delay = 0, y = 24 }: RevealProps) {
  const reduce = useReducedMotion();

  if (reduce) {
    return <div className={className}>{children}</div>;
  }

  return (
    <motion.div
      className={className}
      initial={{ opacity: 0, y }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-64px" }}
      transition={{ duration: DURATION.base, delay, ease: EASE }}
    >
      {children}
    </motion.div>
  );
}
