"use client";

import { useEffect, useRef, useState } from "react";
import { useInView, useReducedMotion } from "framer-motion";

import { formatNumber } from "@/lib/format";
import type { Locale } from "@/content/types";

interface CounterProps {
  value: number;
  locale: Locale;
  suffix?: string;
  className?: string;
  duration?: number;
}

/**
 * Animated count-up that starts when scrolled into view.
 * Reduced motion: the final value renders instantly.
 * Numbers use the site's pinned numbering system (latn by default).
 */
export function Counter({
  value,
  locale,
  suffix = "",
  className,
  duration = 1400,
}: CounterProps) {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true, margin: "-48px" });
  const reduce = useReducedMotion();
  const [display, setDisplay] = useState(0);

  useEffect(() => {
    if (!inView) return;
    let raf = 0;
    const start = performance.now();
    const tick = (now: number) => {
      if (reduce) {
        // Reduced motion: land on the final value immediately (async tick)
        setDisplay(value);
        return;
      }
      const p = Math.min((now - start) / duration, 1);
      const eased = 1 - Math.pow(1 - p, 3);
      setDisplay(Math.round(eased * value));
      if (p < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [inView, value, reduce, duration]);

  return (
    <span ref={ref} className={className}>
      {formatNumber(display, locale)}
      {suffix}
    </span>
  );
}
