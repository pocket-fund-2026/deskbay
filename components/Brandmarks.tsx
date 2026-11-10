// Brand guide §2.7: The Line (route with cafe stops, one filled = the pick)
// and the Ripple (rings at 28% opacity marking a place being found).
// Decorative, so aria-hidden. Colour follows --color-accent: Copper on dark,
// Deep Copper on light, as the guide specifies.

/** Horizontal Line: 4px track, 18px stops, one filled, bleeding off both edges. */
export function TheLine({ stops = 5, filled = 2 }: { stops?: number; filled?: number }) {
  return (
    <div aria-hidden="true" className="relative -mx-6 flex h-[18px] items-center justify-between px-[10%] sm:-mx-10">
      <span className="absolute inset-x-0 top-1/2 h-1 -translate-y-1/2 bg-accent" />
      {Array.from({ length: stops }, (_, i) => (
        <span
          key={i}
          className={`relative h-[18px] w-[18px] rounded-full border-4 border-accent ${i === filled ? "bg-accent" : "bg-ink"}`}
        />
      ))}
    </div>
  );
}

/** Concentric rings, 28% opacity, for the hero corner. */
export function Ripple({ className = "" }: { className?: string }) {
  return (
    <svg viewBox="0 0 560 560" fill="none" stroke="var(--color-accent)" strokeOpacity=".28" strokeWidth="2" aria-hidden="true" className={`pointer-events-none absolute ${className}`}>
      <circle cx="280" cy="280" r="70" />
      <circle cx="280" cy="280" r="140" />
      <circle cx="280" cy="280" r="210" />
      <circle cx="280" cy="280" r="278" strokeDasharray="3 9" />
    </svg>
  );
}
