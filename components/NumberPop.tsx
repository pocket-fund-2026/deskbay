"use client";

import { useEffect, useRef, useState } from "react";

/** transitions.dev "Number pop-in": digits pop in with a stagger once the number scrolls into view. SSR renders the settled number. */
export default function NumberPop({ value, className = "" }: { value: number | string; className?: string }) {
  const chars = String(value).split("");
  const ref = useRef<HTMLSpanElement>(null);
  const [armed, setArmed] = useState(false);
  const [go, setGo] = useState(true);
  useEffect(() => {
    const el = ref.current;
    if (!el || typeof IntersectionObserver === "undefined" || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    setGo(false);
    setArmed(true);
    const io = new IntersectionObserver(([e]) => { if (e.isIntersecting) { setGo(true); io.disconnect(); } }, { threshold: 0.6 });
    io.observe(el);
    return () => io.disconnect();
  }, []);
  return (
    <span ref={ref} className={`t-digit-group ${go ? "is-animating" : ""} ${className}`} aria-label={String(value)} style={{ opacity: armed && !go ? 0 : 1 }}>
      {chars.map((ch, i) => (
        <span key={i} aria-hidden="true" className="t-digit" data-stagger={i === chars.length - 2 ? "1" : i === chars.length - 1 && chars.length > 1 ? "2" : undefined}>{ch}</span>
      ))}
    </span>
  );
}
