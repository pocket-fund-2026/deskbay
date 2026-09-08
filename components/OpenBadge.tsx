"use client";

import { useEffect, useState } from "react";
import { openLabel, openState, parseOpeningHours } from "@/lib/hours";

/**
 * "Open until 11pm" / "Opens 8am tomorrow", in Mumbai time.
 *
 * Client-only on purpose. Cafe pages are statically generated, so anything
 * derived from the current time has to be filled in after mount or the
 * prerendered HTML would claim a cafe is open at whatever moment the build
 * ran. It renders nothing until then, which also keeps it out of the way for
 * the 94 cafes whose hours we haven't recorded yet.
 */
export default function OpenBadge({
  openingHours,
  className = "",
}: {
  openingHours: string | null;
  className?: string;
}) {
  const [label, setLabel] = useState<{ text: string; open: boolean; soon: boolean } | null>(null);

  useEffect(() => {
    function update() {
      const state = openState(parseOpeningHours(openingHours));
      const text = openLabel(state);
      if (!text) {
        setLabel(null);
        return;
      }
      setLabel({
        text,
        open: state.state === "open",
        soon: state.state === "open" && state.closingSoon,
      });
    }

    update();
    // Re-check on the minute boundary so a badge doesn't sit there saying
    // "Open until 10pm" at five past.
    const timer = setInterval(update, 60_000);
    return () => clearInterval(timer);
  }, [openingHours]);

  if (!label) return null;

  const tone = label.open
    ? label.soon
      ? "border-amber-400/40 text-amber-300/90"
      : "border-emerald-400/40 text-emerald-300/90"
    : "border-paper/15 text-paper/40";

  return (
    <span
      className={`wa-mono inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 ${tone} ${className}`}
    >
      <span
        aria-hidden
        className={`h-1.5 w-1.5 rounded-full ${
          label.open ? (label.soon ? "bg-amber-400" : "bg-emerald-400") : "bg-paper/30"
        }`}
      />
      {label.text}
    </span>
  );
}
