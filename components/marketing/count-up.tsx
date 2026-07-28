"use client";

import { useEffect, useRef, useState, useSyncExternalStore } from "react";

const REDUCED_MOTION = "(prefers-reduced-motion: reduce)";

function subscribeReducedMotion(onChange: () => void) {
  const mql = window.matchMedia(REDUCED_MOTION);
  mql.addEventListener("change", onChange);
  return () => mql.removeEventListener("change", onChange);
}

// Reads the media query without setState-in-effect. The server snapshot is
// `false` (no window), so SSR renders the animated path and the real preference
// takes over at hydration.
function usePrefersReducedMotion() {
  return useSyncExternalStore(
    subscribeReducedMotion,
    () => window.matchMedia(REDUCED_MOTION).matches,
    () => false,
  );
}

// Counts from 0 up to `value` once scrolled into view. Honors prefers-reduced-motion
// by jumping straight to the final value.
export function CountUp({
  value,
  duration = 1400,
  prefix = "",
  suffix = "",
}: {
  value: number;
  duration?: number;
  prefix?: string;
  suffix?: string;
}) {
  const ref = useRef<HTMLSpanElement | null>(null);
  const [display, setDisplay] = useState(0);
  const reduce = usePrefersReducedMotion();

  useEffect(() => {
    const el = ref.current;
    if (!el || reduce) return;

    const io = new IntersectionObserver(
      (entries) => {
        if (!entries[0]?.isIntersecting) return;
        io.disconnect();
        const start = performance.now();
        const tick = (now: number) => {
          const p = Math.min(1, (now - start) / duration);
          // easeOutExpo for a snappy finish
          const eased = p === 1 ? 1 : 1 - Math.pow(2, -10 * p);
          setDisplay(Math.round(eased * value));
          if (p < 1) requestAnimationFrame(tick);
        };
        requestAnimationFrame(tick);
      },
      { threshold: 0.4 },
    );
    io.observe(el);
    return () => io.disconnect();
  }, [value, duration, reduce]);

  // Reduced motion jumps straight to the final value — derived, never stored.
  const shown = reduce ? value : display;

  return (
    <span ref={ref}>
      {prefix}
      {shown.toLocaleString("en-NG")}
      {suffix}
    </span>
  );
}
