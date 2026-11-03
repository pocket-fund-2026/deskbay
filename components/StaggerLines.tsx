"use client";

import { useEffect, useRef } from "react";

/** transitions.dev "Texts reveal": each child line rises in, blurred to sharp, on first paint. Content is in the HTML, so SEO is unaffected. */
export default function StaggerLines({ lines, className = "" }: { lines: React.ReactNode[]; className?: string }) {
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const r = requestAnimationFrame(() => el.classList.add("is-shown"));
    return () => cancelAnimationFrame(r);
  }, []);
  return (
    <div ref={ref} className={`t-stagger ${className}`}>
      {lines.map((l, i) => (
        <span key={i} className="t-stagger-line" style={{ transitionDelay: `${i * 90}ms` }}>{l}</span>
      ))}
    </div>
  );
}
