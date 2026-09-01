"use client";

import Image from "next/image";
import Link from "next/link";
import type { Cafe } from "@/lib/cafes";
import { tier, SCORE_ROWS, EVIDENCE_ORDER } from "@/lib/scoreTier";

function ScoreBar({ label, value }: { label: string; value: number | null }) {
  return (
    <div className="flex items-center gap-2">
      <span className="wa-mono w-14 shrink-0 text-paper/45">{label}</span>
      <div className="h-[5px] flex-1 overflow-hidden rounded-full bg-white/[0.07]">
        <div
          className="h-full rounded-full"
          style={{
            width: `${((value ?? 0) / 5) * 100}%`,
            background: tier(value).color,
          }}
        />
      </div>
      <span className="wa-mono w-3.5 text-right text-paper/50">{value ?? "–"}</span>
    </div>
  );
}

export default function CafeDetailPanel({ cafe, onBack }: { cafe: Cafe; onBack: () => void }) {
  const scoreTier = tier(cafe.workability);
  const scoredRows = SCORE_ROWS.filter((r) => cafe.scores[r.key] !== null);
  const unscoredRows = SCORE_ROWS.filter((r) => cafe.scores[r.key] === null);

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

      {cafe.images.length > 0 ? (
        <div className="relative aspect-[16/9] overflow-hidden border-b border-white/10">
          <Image
            src={cafe.images[0].url}
            alt={cafe.images[0].alt}
            fill
            unoptimized
            sizes="380px"
            className="object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-ink/80 via-transparent to-transparent" />
        </div>
      ) : (
        <div className="flex aspect-[16/9] items-center justify-center border-b border-dashed border-white/10 bg-white/[0.02]">
          <p className="wa-mono text-paper/25">no photo yet</p>
        </div>
      )}

      <div className="p-4">
        <div className="flex items-start justify-between gap-3">
          <div>
            <h2 className="font-display text-[21px] font-medium leading-snug">{cafe.name}</h2>
            <p className="wa-mono mt-1.5 text-paper/40">
              {cafe.neighborhood} · {cafe.area === "bandra" ? "Bandra" : "South Bombay"}
            </p>
          </div>
          <div
            className="flex shrink-0 flex-col items-center justify-center rounded-full"
            style={{
              width: 54,
              height: 54,
              border: `2px solid ${scoreTier.color}`,
              boxShadow: `0 0 0 3px ${scoreTier.color}22`,
            }}
          >
            <div className="font-display text-[17px] leading-none">
              {cafe.workability !== null ? cafe.workability.toFixed(1) : "–"}
            </div>
            <div className="wa-mono mt-0.5 text-[8px] uppercase text-paper/45">/5</div>
          </div>
        </div>
        <p className="wa-mono mt-1.5" style={{ color: scoreTier.color }}>
          {scoreTier.label}
        </p>

        <p className="mt-3.5 text-[14px] leading-relaxed text-paper/70">{cafe.editorialNote}</p>
        <p className="mt-3 text-[13.5px] leading-relaxed text-paper/55">{cafe.whyWeRecommend}</p>

        <div className="mt-4 flex flex-wrap gap-2 text-[12.5px]">
          {cafe.website && (
            <a href={cafe.website} target="_blank" rel="noopener noreferrer" className="wa-btn border-white/15">
              Website
            </a>
          )}
          {cafe.instagram && (
            <a href={cafe.instagram} target="_blank" rel="noopener noreferrer" className="wa-btn border-white/15">
              Instagram
            </a>
          )}
          {cafe.menuUrl && (
            <a href={cafe.menuUrl} target="_blank" rel="noopener noreferrer" className="wa-btn border-white/15">
              Order / menu
            </a>
          )}
          <a href={cafe.googleMapsUrl} target="_blank" rel="noopener noreferrer" className="wa-btn border-white/15">
            Directions
          </a>
        </div>

        <div className="mt-5 rounded-lg border border-white/10 bg-white/[0.02] px-3.5 py-3">
          {cafe.openingHours && (
            <p className="wa-mono text-paper/50">{cafe.openingHours}</p>
          )}
          <p className={`text-[13px] leading-relaxed text-paper/50 ${cafe.openingHours ? "mt-1.5" : ""}`}>
            {cafe.address}
          </p>
          {cafe.publicRating && (
            <p className="wa-mono mt-2 text-paper/40">
              {cafe.publicRating.value.toFixed(1)}★ public rating ({cafe.publicRating.count.toLocaleString()}) — {cafe.publicRating.source}
            </p>
          )}
        </div>

        <div className="mt-5">
          <p className="wa-mono mb-2 text-paper/40">Workability breakdown</p>
          <div className="space-y-2">
            {scoredRows.map((r) => (
              <ScoreBar key={r.key} label={r.label} value={cafe.scores[r.key]} />
            ))}
          </div>
          {unscoredRows.length > 0 && (
            <p className="wa-mono mt-2 text-paper/30">
              Not enough evidence: {unscoredRows.map((r) => r.label).join(", ")}
            </p>
          )}
        </div>

        {cafe.toggles.length > 0 && (
          <div className="mt-4 flex flex-wrap gap-1.5">
            {cafe.toggles.map((t) => (
              <span key={t} className="wa-mono rounded-full border border-white/10 px-2 py-1 text-paper/50">
                {t}
              </span>
            ))}
          </div>
        )}

        {cafe.synthesis && (
          <div
            className="mt-6 rounded-lg border-l-2 bg-white/[0.03] p-3.5"
            style={{ borderColor: scoreTier.color }}
          >
            <p className="wa-mono mb-1.5 text-paper/40">Verdict</p>
            <p className="text-[13.5px] leading-relaxed text-paper/70">{cafe.synthesis}</p>
          </div>
        )}

        <div className="mt-6 border-t border-white/10 pt-5">
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
