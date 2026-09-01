"use client";

import Link from "next/link";
import type { Cafe } from "@/lib/cafes";
import { FACTORS } from "@/lib/cafes";

function ScoreBar({ label, value }: { label: string; value: number | null }) {
  return (
    <div className="flex items-center gap-2">
      <span className="wa-mono w-16 shrink-0 text-paper/40">{label}</span>
      <div className="h-1.5 flex-1 overflow-hidden rounded-full bg-white/10">
        {value !== null && (
          <div
            className="h-full rounded-full bg-accent"
            style={{ width: `${(value / 5) * 100}%` }}
          />
        )}
      </div>
      <span className="wa-mono w-4 text-right text-paper/50">{value ?? "–"}</span>
    </div>
  );
}

export default function CafeCard({
  cafe,
  active,
  onSelect,
}: {
  cafe: Cafe;
  active: boolean;
  onSelect: () => void;
}) {
  return (
    <div
      role="button"
      tabIndex={0}
      onClick={onSelect}
      onKeyDown={(e) => (e.key === "Enter" || e.key === " ") && onSelect()}
      className={`w-full cursor-pointer rounded-xl border p-4 text-left transition-colors ${
        active ? "border-accent/60 bg-white/[0.06]" : "border-white/10 hover:bg-white/[0.03]"
      }`}
    >
      <div className="flex items-start justify-between gap-3">
        <div>
          <h3 className="font-display text-[17px] font-medium leading-snug">{cafe.name}</h3>
          <p className="wa-mono mt-1 text-paper/40">{cafe.neighborhood}</p>
        </div>
        <div className="shrink-0 rounded-lg border border-white/12 px-2 py-1 text-center">
          <div className="font-display text-[15px] leading-none">
            {cafe.workability !== null ? cafe.workability.toFixed(1) : "–"}
          </div>
          <div className="wa-mono mt-0.5 text-[9px] text-paper/40">
            {cafe.workability !== null ? "score" : "too thin"}
          </div>
        </div>
      </div>

      <p className="mt-2.5 text-[13.5px] leading-relaxed text-paper/65">{cafe.editorialNote}</p>

      <div className="mt-3 space-y-1.5">
        <ScoreBar label="Wi-Fi" value={cafe.scores.wifi} />
        <ScoreBar label="Power" value={cafe.scores.charging} />
        <ScoreBar label="Quiet" value={cafe.scores.quiet} />
        <ScoreBar label="Seating" value={cafe.scores.seating} />
      </div>

      {cafe.toggles.length > 0 && (
        <div className="mt-3 flex flex-wrap gap-1.5">
          {cafe.toggles.map((t) => (
            <span
              key={t}
              className="wa-mono rounded-full border border-white/10 px-2 py-1 text-paper/50"
            >
              {t}
            </span>
          ))}
        </div>
      )}

      <Link
        href={`/mumbai/${cafe.slug}`}
        onClick={(e) => e.stopPropagation()}
        className="wa-mono mt-3 inline-block text-paper/40 hover:text-paper"
      >
        Full page →
      </Link>
    </div>
  );
}

export function FactorLegend() {
  return (
    <ul className="wa-mono flex flex-wrap gap-x-4 gap-y-1 text-paper/35">
      {FACTORS.map((f) => (
        <li key={f.key}>
          {f.label} {f.weight}%
        </li>
      ))}
    </ul>
  );
}
