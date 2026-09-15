"use client";

import { useEffect, useRef, useState } from "react";

/**
 * The workability score is the single number most readers scan for first on
 * a cafe page. Printing it as a plain string made it just another line of
 * text; counting up to it once it scrolls into view gives that one number a
 * moment, the way a scoreboard does, without adding a widget that has
 * nothing to do with what the site is actually measuring.
 */
export default function CountUp({ value, decimals = 1 }: { value: number; decimals?: number }) {
  // Starts at the real value (matches the server-rendered HTML, so there's
  // no hydration mismatch) and only drops to 0 once the effect below
  // confirms an observer is actually going to animate it back up —
  // otherwise a reader would see the right score, watch it reset to 0,
  // then climb back, which reads as the score dropping rather than as an
  // entrance animation.
  const [display, setDisplay] = useState(value);
  const ref = useRef<HTMLSpanElement | null>(null);

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const el = ref.current;
    if (!el || typeof IntersectionObserver === "undefined") return;

    const duration = 800;
    let start: number | null = null;
    let raf = 0;

    function step(ts: number) {
      if (start === null) start = ts;
      const progress = Math.min(1, (ts - start) / duration);
      // Ease-out cubic: fast start, gentle settle onto the real number
      // rather than a mechanical linear tick-up.
      const eased = 1 - Math.pow(1 - progress, 3);
      setDisplay(eased * value);
      if (progress < 1) raf = requestAnimationFrame(step);
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          // Only now is it safe to drop to 0 — an animation is actually
          // about to run straight after.
          setDisplay(0);
          raf = requestAnimationFrame(step);
          observer.disconnect();
        }
      },
      { threshold: 0.6 }
    );
    observer.observe(el);
    return () => {
      observer.disconnect();
      cancelAnimationFrame(raf);
    };
  }, [value]);

  return <span ref={ref}>{display.toFixed(decimals)}</span>;
}
