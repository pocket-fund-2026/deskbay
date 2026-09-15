"use client";

import { useEffect, useRef, useState } from "react";

/**
 * The workability score is the whole point of this site, and its bars used
 * to render pre-filled with no transition — a static stat. Filling them in
 * on arrival (the way a bar chart animates, or a cup fills) makes the
 * number feel measured rather than printed, without touching what the
 * numbers mean. Starts at 0 and animates to the real width once mounted; a
 * plain static bar for anyone with reduced-motion set.
 */
export default function ScoreFill({
  value,
  color,
}: {
  value: number | null;
  color?: string;
}) {
  const [width, setWidth] = useState(0);
  const ref = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (value === null) return;
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduced) {
      setWidth((value / 5) * 100);
      return;
    }

    const el = ref.current;
    if (!el || typeof IntersectionObserver === "undefined") {
      setWidth((value / 5) * 100);
      return;
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          // rAF so the browser paints the 0-width bar first — animating
          // from a width set in the same tick as the target just snaps.
          requestAnimationFrame(() => setWidth((value / 5) * 100));
          observer.disconnect();
        }
      },
      { threshold: 0.4 }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, [value]);

  return (
    <div ref={ref} className="h-full w-full overflow-hidden rounded-full">
      <div
        className="h-full rounded-full transition-[width] duration-[900ms] ease-out"
        style={{ width: `${width}%`, background: color ?? "var(--color-accent)" }}
      />
    </div>
  );
}
