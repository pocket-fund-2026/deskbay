"use client";

import dynamic from "next/dynamic";
import Link from "next/link";
import { useMemo, useState } from "react";
import { AREAS, CAFES, type AreaSlug } from "@/lib/cafes";
import CafeCard, { FactorLegend } from "@/components/CafeCard";
import CafeDetailPanel from "@/components/CafeDetailPanel";

const MapView = dynamic(() => import("@/components/MapView"), {
  ssr: false,
  loading: () => (
    <div className="grid h-full w-full place-items-center bg-ink">
      <p className="wa-mono text-paper/40">Loading map…</p>
    </div>
  ),
});

export default function MumbaiScreen({ initialArea }: { initialArea: AreaSlug | "all" }) {
  const [area, setArea] = useState<AreaSlug | "all">(initialArea);
  const [selected, setSelected] = useState<string | null>(null);

  const cafes = useMemo(
    () => (area === "all" ? CAFES : CAFES.filter((c) => c.area === area)),
    [area]
  );

  const selectedCafe = selected ? cafes.find((c) => c.slug === selected) ?? null : null;

  return (
    <main className="flex h-dvh flex-col bg-ink text-paper">
      <header className="flex items-center justify-between gap-4 border-b border-paper/10 px-5 py-3.5">
        <Link href="/" className="font-display text-[18px] tracking-tight">
          desk<em className="font-semibold not-italic italic">bay</em>
        </Link>
        <h1 className="sr-only">
          {area === "all" ? "Mumbai" : AREAS[area].name} — cafes you can work from
        </h1>
        <div className="wa-mono flex gap-1 rounded-full border border-paper/12 p-1 text-paper/50">
          {(["all", ...Object.keys(AREAS)] as (AreaSlug | "all")[]).map((a) => (
            <button
              key={a}
              onClick={() => setArea(a)}
              className={`rounded-full px-3 py-1 transition-colors ${
                area === a ? "bg-paper text-ink" : "hover:text-paper"
              }`}
            >
              {a === "all" ? "All" : AREAS[a].name}
            </button>
          ))}
        </div>
      </header>

      <div className="grid flex-1 grid-cols-1 overflow-hidden md:grid-cols-[380px_1fr]">
        <div className="order-2 flex flex-col overflow-y-auto border-paper/10 md:order-1 md:border-r">
          {selectedCafe ? (
            <CafeDetailPanel cafe={selectedCafe} onBack={() => setSelected(null)} />
          ) : (
            <>
              <div className="border-b border-paper/10 px-4 py-3">
                <FactorLegend />
              </div>
              <div className="space-y-2.5 p-3">
                {cafes.map((cafe) => (
                  <CafeCard
                    key={cafe.slug}
                    cafe={cafe}
                    active={selected === cafe.slug}
                    onSelect={() => setSelected(cafe.slug)}
                  />
                ))}
              </div>
            </>
          )}
        </div>
        <div className="order-1 h-[40dvh] md:order-2 md:h-full">
          <MapView cafes={cafes} selectedSlug={selected} onSelect={setSelected} />
        </div>
      </div>
    </main>
  );
}
