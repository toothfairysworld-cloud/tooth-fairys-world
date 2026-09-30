"use client";

import { useCallback, useRef, useState } from "react";
import {
  motion,
  useMotionValue,
  useReducedMotion,
  useSpring,
  useTransform,
} from "framer-motion";
import Image from "next/image";
import { ChevronsLeftRight } from "lucide-react";

interface BeforeAfterSliderProps {
  before: string;
  after: string;
  alt: string;
  beforeLabel: string;
  afterLabel: string;
  ariaLabel: string;
  hint?: string;
  className?: string;
  aspect?: string;
  sizes?: string;
  priority?: boolean;
}

const MIN = 0;
const MAX = 100;

/**
 * Before/after comparison slider — fully RTL-aware:
 * "before" occupies the inline-start side in both directions, the drag
 * gesture follows reading direction, and arrow keys map to inline
 * start/end. Keyboard accessible (role=slider), pointer + touch drag.
 */
export function BeforeAfterSlider({
  before,
  after,
  alt,
  beforeLabel,
  afterLabel,
  ariaLabel,
  hint,
  className,
  aspect = "aspect-[4/3]",
  sizes = "(max-width: 768px) 100vw, 640px",
  priority = false,
}: BeforeAfterSliderProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [rtl, setRtl] = useState(false);
  const reduce = useReducedMotion();
  const [value, setValue] = useState(50);
  const [dragging, setDragging] = useState(false);

  const source = useMotionValue(50);
  const spring = useSpring(source, {
    stiffness: reduce ? 1000 : 400,
    damping: reduce ? 100 : 35,
  });

  const clipBefore = useTransform(spring, (v) =>
    rtl ? `inset(0 0 0 ${100 - v}%)` : `inset(0 ${100 - v}% 0 0)`,
  );
  const handleStart = useTransform(spring, (v) => `${v}%`);

  const detectRtl = useCallback(() => {
    const el = containerRef.current;
    if (!el) return;
    setRtl(window.getComputedStyle(el).direction === "rtl");
  }, []);

  const updateFromClientX = useCallback(
    (clientX: number) => {
      const rect = containerRef.current?.getBoundingClientRect();
      if (!rect) return;
      const ratio = rtl
        ? (rect.right - clientX) / rect.width
        : (clientX - rect.left) / rect.width;
      const next = Math.round(Math.min(MAX, Math.max(MIN, ratio * 100)));
      setValue(next);
      source.set(next);
    },
    [rtl, source],
  );

  const onPointerDown = (e: React.PointerEvent<HTMLDivElement>) => {
    (e.target as HTMLElement).setPointerCapture?.(e.pointerId);
    setDragging(true);
    detectRtl();
    updateFromClientX(e.clientX);
  };
  const onPointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
    if (!dragging) return;
    updateFromClientX(e.clientX);
  };
  const stop = () => setDragging(false);

  const onKeyDown = (e: React.KeyboardEvent) => {
    // Arrow toward inline-end increases the "after" reveal
    const towardEnd = rtl ? "ArrowLeft" : "ArrowRight";
    const towardStart = rtl ? "ArrowRight" : "ArrowLeft";
    if (e.key !== towardEnd && e.key !== towardStart) return;
    e.preventDefault();
    const delta = e.key === towardEnd ? 4 : -4;
    const next = Math.min(MAX, Math.max(MIN, value + delta));
    setValue(next);
    source.set(next);
  };

  return (
    <figure className={className}>
      <div
        ref={containerRef}
        role="group"
        aria-label={ariaLabel}
        className={`group relative ${aspect} w-full touch-none overflow-hidden rounded-2xl bg-surface-2 select-none`}
        onPointerDown={onPointerDown}
        onPointerMove={onPointerMove}
        onPointerUp={stop}
        onPointerCancel={stop}
        onPointerLeave={stop}
      >
        {/* after (full) */}
        <Image
          src={after}
          alt={alt}
          fill
          priority={priority}
          sizes={sizes}
          className="object-cover"
        />
        {/* before (clipped to inline-start side) */}
        <motion.div
          className="absolute inset-0"
          style={{ clipPath: clipBefore }}
        >
          <Image
            src={before}
            alt={alt}
            fill
            sizes={sizes}
            className="object-cover"
          />
        </motion.div>

        {/* labels */}
        <span className="pointer-events-none absolute top-3 start-3 rounded-pill bg-background/80 px-3 py-1 text-caption font-semibold text-foreground backdrop-blur-sm">
          {beforeLabel}
        </span>
        <span className="pointer-events-none absolute top-3 end-3 rounded-pill bg-primary/85 px-3 py-1 text-caption font-semibold text-primary-foreground backdrop-blur-sm">
          {afterLabel}
        </span>

        {/* handle */}
        <div
          role="slider"
          tabIndex={0}
          aria-label={ariaLabel}
          aria-valuemin={MIN}
          aria-valuemax={MAX}
          aria-valuenow={value}
          aria-valuetext={`${beforeLabel} ${value}% / ${afterLabel} ${100 - value}%`}
          aria-orientation="horizontal"
          onKeyDown={onKeyDown}
          onFocus={detectRtl}
          className="absolute inset-y-0 z-10 flex cursor-ew-resize items-center justify-center py-6 focus-visible:outline-none"
          style={{ insetInlineStart: 0, width: 0 }}
        >
          <motion.div
            aria-hidden="true"
            className="flex h-full items-center"
            style={{ insetInlineStart: handleStart, position: "absolute" }}
          >
            <span className="absolute inset-y-0 start-1/2 w-0.5 -translate-x-1/2 bg-background shadow-[0_0_0_1px_var(--border)]" />
            <span className="relative grid size-10 place-items-center rounded-full border-2 border-border bg-background text-foreground shadow-md transition-transform group-hover:scale-105">
              <ChevronsLeftRight className="size-5" aria-hidden="true" />
            </span>
          </motion.div>
        </div>
      </div>
      {hint && (
        <figcaption className="mt-2 text-caption text-muted-foreground">
          {hint}
        </figcaption>
      )}
    </figure>
  );
}
