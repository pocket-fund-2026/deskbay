"use client";

import Image from "next/image";
import Link from "next/link";
import type { Cafe } from "@/lib/cafes";

const EVIDENCE_ORDER: { key: keyof Cafe["evidence"]; label: string }[] = [
  { key: "wifi", label: "Wi-Fi" },
  { key: "charging", label: "Power" },
  { key: "quiet", label: "Quiet" },
  { key: "seating", label: "Seating" },
  { key: "work", label: "Work friendliness" },
];

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

export default function CafeDetailPanel({ cafe, onBack }: { cafe: Cafe; onBack: () => void }) {
  return (
    <div className="flex h-full flex-col overflow-y-auto">
      <div className="sticky top-0 z-10 border-b border-white/10 bg-ink/95 px-4 py-3 backdrop-blur">
        <button
          onClick={onBack}
          className="wa-mono flex items-center gap-1.5 text-paper/50 hover:text-paper"
        >
          ← All cafes
        </button>
      </div>

      <div className="p-4">
        {cafe.images.length > 0 && (
          <div className="relative mb-4 aspect-[16/9] overflow-hidden rounded-lg border border-white/10">
            <Image
              src={cafe.images[0].url}
              alt={cafe.images[0].alt}
              fill
              unoptimized
              sizes="380px"
              className="object-cover"
            />
          </div>
        )}
        <div className="flex items-start justify-between gap-3">
          <div>
            <h2 className="font-display text-[20px] font-medium leading-snug">{cafe.name}</h2>
            <p className="wa-mono mt-1 text-paper/40">
              {cafe.neighborhood} · {cafe.area === "bandra" ? "Bandra" : "South Bombay"}
            </p>
          </div>
          <div className="shrink-0 rounded-lg border border-white/12 px-2.5 py-1.5 text-center">
            <div className="font-display text-[18px] leading-none">
              {cafe.workability !== null ? cafe.workability.toFixed(1) : "–"}
            </div>
            <div className="wa-mono mt-0.5 text-[9px] text-paper/40">
              {cafe.workability !== null ? "score" : "too thin"}
            </div>
          </div>
        </div>

        <p className="mt-3 text-[14px] leading-relaxed text-paper/70">{cafe.editorialNote}</p>
        <p className="mt-3 text-[13.5px] leading-relaxed text-paper/55">{cafe.whyWeRecommend}</p>

        <div className="mt-4 flex flex-wrap gap-2 text-[12.5px]">
          {cafe.website && (
            <a
              href={cafe.website}
              target="_blank"
              rel="noopener noreferrer"
              className="wa-btn border-white/15"
            >
              Website
            </a>
          )}
          {cafe.instagram && (
            <a
              href={cafe.instagram}
              target="_blank"
              rel="noopener noreferrer"
              className="wa-btn border-white/15"
            >
              Instagram
            </a>
          )}
          {cafe.menuUrl && (
            <a
              href={cafe.menuUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="wa-btn border-white/15"
            >
              Order / menu
            </a>
          )}
          <a
            href={cafe.googleMapsUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="wa-btn border-white/15"
          >
            Directions
          </a>
        </div>

        {cafe.openingHours && (
          <p className="wa-mono mt-4 text-paper/40">{cafe.openingHours}</p>
        )}
        <p className="text-[13px] leading-relaxed text-paper/50 mt-1">{cafe.address}</p>

        <div className="mt-5 space-y-1.5">
          <ScoreBar label="Wi-Fi" value={cafe.scores.wifi} />
          <ScoreBar label="Power" value={cafe.scores.charging} />
          <ScoreBar label="Quiet" value={cafe.scores.quiet} />
          <ScoreBar label="Seating" value={cafe.scores.seating} />
          <ScoreBar label="Work" value={cafe.scores.work} />
        </div>

        {cafe.toggles.length > 0 && (
          <div className="mt-4 flex flex-wrap gap-1.5">
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

        {cafe.publicRating && (
          <p className="wa-mono mt-4 text-paper/40">
            {cafe.publicRating.value.toFixed(1)}★ public rating ({cafe.publicRating.count}) —{" "}
            {cafe.publicRating.source}
          </p>
        )}

        {cafe.synthesis && (
          <div className="mt-6 rounded-lg border border-white/10 bg-white/[0.03] p-3.5">
            <p className="wa-mono mb-1.5 text-paper/40">Verdict</p>
            <p className="text-[13.5px] leading-relaxed text-paper/70">{cafe.synthesis}</p>
          </div>
        )}

        <div className="mt-6">
          <p className="wa-mono mb-2 text-paper/40">Where the scores come from</p>
          <ul className="space-y-3">
            {EVIDENCE_ORDER.filter(({ key }) => cafe.evidence[key]).map(({ key, label }) => (
              <li key={key} className="border-l-2 border-white/10 pl-3">
                <p className="text-[12px] font-medium text-paper/60">{label}</p>
                <p className="mt-0.5 text-[12.5px] leading-relaxed text-paper/50">
                  {cafe.evidence[key]}
                </p>
              </li>
            ))}
          </ul>
        </div>

        {cafe.tags.length > 0 && (
          <div className="mt-5 flex flex-wrap gap-1.5">
            {cafe.tags.map((t) => (
              <span key={t} className="wa-mono text-paper/30">
                #{t.replace(/\s+/g, "-")}
              </span>
            ))}
          </div>
        )}

        {cafe.sources.length > 0 && (
          <p className="wa-mono mt-5 text-paper/30">
            Sources: {cafe.sources.join(" · ")} — verified {cafe.lastVerifiedAt}
          </p>
        )}

        <Link
          href={`/mumbai/${cafe.slug}`}
          className="wa-btn wa-btn--solid mt-6 !bg-paper !text-ink"
        >
          Open full page
        </Link>
      </div>
    </div>
  );
}
