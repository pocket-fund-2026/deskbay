"use client";

import { useRef } from "react";

const MAX = 10; // peak tilt in degrees

/** transitions.dev "Card hover tilt": the card leans toward the pointer with a glare; mouse and pen only, so touch still scrolls. */
export function TiltCard({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  const tilt = useRef<HTMLDivElement>(null);
  const card = useRef<HTMLDivElement>(null);

  function reset() {
    tilt.current?.classList.remove("is-hover");
    const c = card.current;
    if (!c) return;
    c.classList.remove("is-tilting");
    c.style.setProperty("--tilt-rx", "0deg");
    c.style.setProperty("--tilt-ry", "0deg");
  }

  function track(e: React.PointerEvent) {
    if (e.pointerType === "touch" || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const t = tilt.current, c = card.current;
    if (!t || !c) return;
    const r = t.getBoundingClientRect();
    const px = Math.min(1, Math.max(0, (e.clientX - r.left) / r.width));
    const py = Math.min(1, Math.max(0, (e.clientY - r.top) / r.height));
    t.classList.add("is-hover");
    c.classList.add("is-tilting");
    c.style.setProperty("--tilt-ry", ((px - 0.5) * MAX).toFixed(2) + "deg");
    c.style.setProperty("--tilt-rx", ((0.5 - py) * MAX).toFixed(2) + "deg");
    c.style.setProperty("--tilt-gx", (px * 100).toFixed(1) + "%");
    c.style.setProperty("--tilt-gy", (py * 100).toFixed(1) + "%");
  }

  return (
    <div ref={tilt} className="t-tilt h-full" style={{ touchAction: "pan-y" }} onPointerMove={track} onPointerLeave={reset} onPointerUp={reset} onPointerCancel={reset}>
      <div ref={card} className={`t-tilt-card ${className}`}>
        {children}
        <div className="t-tilt-glare" aria-hidden="true" />
      </div>
    </div>
  );
}
