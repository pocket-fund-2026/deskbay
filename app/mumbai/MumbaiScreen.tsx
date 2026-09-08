"use client";

import dynamic from "next/dynamic";
import Link from "next/link";
import { useEffect, useMemo, useRef, useState } from "react";
import { AREAS, type AreaSlug, type Cafe } from "@/lib/cafes";
import { distanceKm, formatDistance, type Point } from "@/lib/distance";
import { isOpenNow } from "@/lib/hours";
import CafeCard, { FactorLegend } from "@/components/CafeCard";
import CafeDetailPanel from "@/components/CafeDetailPanel";
import Logo from "@/components/Logo";
import ThemeToggle from "@/components/ThemeToggle";
import MapErrorBoundary from "@/components/MapErrorBoundary";

const MapView = dynamic(() => import("@/components/MapView"), {
  ssr: false,
  loading: () => (
    <div className="grid h-full w-full place-items-center bg-ink">
      <p className="wa-mono text-paper/40">Loading map…</p>
    </div>
  ),
});

export default function MumbaiScreen({
  initialArea,
  allCafes,
  initialNearMe = false,
}: {
  initialArea: AreaSlug | "all";
  allCafes: Cafe[];
  /** Set by /mumbai/near-me, which exists to answer "cafes near me to work". */
  initialNearMe?: boolean;
}) {
  const [area, setArea] = useState<AreaSlug | "all">(initialArea);
  const [selected, setSelected] = useState<string | null>(null);
  // Which cafe is under the cursor, in either the list or the map. Shared so
  // hovering one highlights the other.
  const [hovered, setHovered] = useState<string | null>(null);
  // Mobile-only bottom sheet: the cafe list can be swiped down to collapse,
  // handing the freed-up space to the map, and swiped back up to expand.
  const [sheetOpen, setSheetOpen] = useState(true);
  const [areaMenuOpen, setAreaMenuOpen] = useState(false);
  const touchStartY = useRef<number | null>(null);
  const areaOptions: (AreaSlug | "all")[] = ["all", ...Object.keys(AREAS) as AreaSlug[]];

  const [query, setQuery] = useState("");
  const [openNowOnly, setOpenNowOnly] = useState(false);
  const [nearMe, setNearMe] = useState(initialNearMe);
  const [here, setHere] = useState<Point | null>(null);
  const [geoError, setGeoError] = useState<string | null>(null);

  // "Open now" is a moving target — re-evaluate on the minute so a cafe that
  // shuts at 10pm drops out of the list at 10pm rather than on next reload.
  const [minuteTick, setMinuteTick] = useState(0);
  useEffect(() => {
    if (!openNowOnly) return;
    const timer = setInterval(() => setMinuteTick((n) => n + 1), 60_000);
    return () => clearInterval(timer);
  }, [openNowOnly]);

  // The browser only hands over a location in response to a gesture-adjacent
  // request, and only over https. Asked for once, when the reader turns
  // "Near me" on — never on load.
  useEffect(() => {
    if (!nearMe || here || typeof navigator === "undefined" || !navigator.geolocation) return;
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setHere({ latitude: pos.coords.latitude, longitude: pos.coords.longitude });
        setGeoError(null);
      },
      () => {
        setGeoError("Couldn't get your location. Sorting by score instead.");
        setNearMe(false);
      },
      { enableHighAccuracy: false, timeout: 10_000, maximumAge: 300_000 }
    );
  }, [nearMe, here]);

  const cafes = useMemo(
    () => (area === "all" ? allCafes : allCafes.filter((c) => c.area === area)),
    [area, allCafes]
  );

  const visibleCafes = useMemo(() => {
    const q = query.trim().toLowerCase();
    let list = q
      ? cafes.filter(
          (c) => c.name.toLowerCase().includes(q) || c.neighborhood.toLowerCase().includes(q)
        )
      : cafes;

    if (openNowOnly) {
      // A cafe whose hours we've never recorded is unknown, not open. Hiding
      // it is the same call the scores make when the evidence is too thin.
      list = list.filter((c) => isOpenNow(c.openingHours) === true);
    }

    if (nearMe && here) {
      list = [...list].sort(
        (a, b) =>
          distanceKm(here, { latitude: a.latitude, longitude: a.longitude }) -
          distanceKm(here, { latitude: b.latitude, longitude: b.longitude })
      );
    }

    return list;
    // minuteTick is the clock, not a value — it re-runs the open-now filter.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [cafes, query, openNowOnly, nearMe, here, minuteTick]);

  const hiddenForUnknownHours = useMemo(
    () => (openNowOnly ? cafes.filter((c) => isOpenNow(c.openingHours) === null).length : 0),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [cafes, openNowOnly, minuteTick]
  );

  const selectedCafe = selected ? cafes.find((c) => c.slug === selected) ?? null : null;

  function handleSelect(slug: string) {
    setSelected(slug);
    setSheetOpen(true);
  }

  function onHandleTouchStart(e: React.TouchEvent) {
    touchStartY.current = e.touches[0].clientY;
  }
  function onHandleTouchEnd(e: React.TouchEvent) {
    if (touchStartY.current === null) return;
    const deltaY = e.changedTouches[0].clientY - touchStartY.current;
    touchStartY.current = null;
    if (Math.abs(deltaY) < 8) {
      setSheetOpen((v) => !v); // plain tap on the handle
      return;
    }
    if (deltaY > 30) setSheetOpen(false); // swiped down
    else if (deltaY < -30) setSheetOpen(true); // swiped up
  }

  const areaDropdown = (
    <div className="relative w-full md:w-56">
      <button
        onClick={() => setAreaMenuOpen((v) => !v)}
        className="wa-mono flex w-full items-center justify-between gap-2 rounded-full border border-paper/15 bg-paper/[0.03] px-4 py-2 text-paper/70 transition-colors hover:text-paper"
      >
        <span>{area === "all" ? "All areas" : AREAS[area].name}</span>
        <span className={`text-[10px] transition-transform ${areaMenuOpen ? "rotate-180" : ""}`}>▼</span>
      </button>

      {areaMenuOpen && (
        <>
          <div className="fixed inset-0 z-20" onClick={() => setAreaMenuOpen(false)} />
          <div className="no-scrollbar absolute left-0 right-0 top-full z-30 mt-1.5 max-h-72 overflow-y-auto rounded-xl border border-paper/15 bg-ink shadow-lg">
            {areaOptions.map((a) => (
              <button
                key={a}
                onClick={() => {
                  setArea(a);
                  // The selected cafe usually isn't in the new area; keeping it
                  // would leave the detail panel and the map showing the area
                  // you just navigated away from.
                  setSelected(null);
                  setHovered(null);
                  setAreaMenuOpen(false);
                }}
                className={`wa-mono flex w-full items-center justify-between gap-3 px-4 py-2.5 text-left transition-colors ${
                  area === a ? "bg-paper/10 text-paper" : "text-paper/60 hover:bg-paper/[0.05] hover:text-paper"
                }`}
              >
                <span>{a === "all" ? "All areas" : AREAS[a].name}</span>
                <span className="text-paper/35">
                  {a === "all" ? allCafes.length : allCafes.filter((c) => c.area === a).length}
                </span>
              </button>
            ))}
          </div>
        </>
      )}
    </div>
  );

  return (
    <main className="flex h-dvh flex-col bg-ink text-paper">
      <header className="relative border-b border-paper/10 px-5 py-3.5">
        <div className="flex items-center justify-between gap-4">
          <Link href="/" className="flex items-center gap-1.5 font-display text-[18px] tracking-tight">
            <Logo size={20} />
            Bombay Cafe <em className="font-semibold not-italic italic">Map</em>
          </Link>
          <div className="flex items-center gap-3 md:gap-5">
            <Link href="/collections" className="wa-mono -my-2 py-2 text-paper/45 hover:text-paper">
              Lists
            </Link>
            <Link href="/blog" className="wa-mono -my-2 hidden py-2 text-paper/45 hover:text-paper md:block">
              Blog
            </Link>
            <div className="hidden md:block">{areaDropdown}</div>
            <ThemeToggle />
          </div>
        </div>
        <h1 className="sr-only">
          {area === "all" ? "Mumbai" : AREAS[area].name}: cafes you can work from
        </h1>
        <div className="mt-3 md:hidden">{areaDropdown}</div>
      </header>

      <div className="flex flex-1 flex-col overflow-hidden md:grid md:grid-cols-[380px_1fr]">
        <div
          className={`order-1 transition-[height] duration-300 md:order-2 md:h-full ${
            sheetOpen ? "h-[40dvh]" : "h-[calc(100dvh-148px)]"
          }`}
        >
          <MapErrorBoundary>
            <MapView
              cafes={visibleCafes}
              selectedSlug={selected}
              hoveredSlug={hovered}
              onSelect={handleSelect}
              onHover={setHovered}
            />
          </MapErrorBoundary>
        </div>

        <div
          className={`order-2 flex flex-col overflow-hidden border-paper/10 transition-[flex-basis] duration-300 md:order-1 md:h-full md:flex-1 md:border-r ${
            sheetOpen ? "flex-1" : "flex-none"
          }`}
        >
          <button
            onTouchStart={onHandleTouchStart}
            onTouchEnd={onHandleTouchEnd}
            onClick={() => setSheetOpen((v) => !v)}
            className="flex shrink-0 flex-col items-center gap-1.5 border-b border-paper/10 py-2.5 md:hidden"
            aria-label={sheetOpen ? "Collapse cafe list" : "Expand cafe list"}
          >
            <span className="h-1 w-10 rounded-full bg-paper/25" />
            {!sheetOpen && (
              <span className="wa-mono text-paper/40">{visibleCafes.length} cafes · tap to expand</span>
            )}
          </button>
          <div className="relative shrink-0 border-b border-paper/10 px-3 py-2.5">
            <input
              type="search"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search by name or neighbourhood…"
              aria-label="Search cafes"
              className="wa-mono w-full rounded-full border border-paper/15 bg-paper/[0.03] px-4 py-2 text-paper/80 outline-none placeholder:text-paper/35 focus:border-accent"
            />
            {query && (
              <button
                onClick={() => setQuery("")}
                aria-label="Clear search"
                className="absolute right-6 top-1/2 -translate-y-1/2 text-paper/40 hover:text-paper"
              >
                ×
              </button>
            )}

            <div className="mt-2.5 flex flex-wrap items-center gap-1.5">
              <button
                onClick={() => setOpenNowOnly((v) => !v)}
                aria-pressed={openNowOnly}
                className={`wa-mono rounded-full border px-3 py-1.5 transition-colors ${
                  openNowOnly
                    ? "border-emerald-400/50 bg-emerald-400/10 text-paper"
                    : "border-paper/15 text-paper/55 hover:text-paper"
                }`}
              >
                Open now
              </button>
              <button
                onClick={() => {
                  if (typeof navigator !== "undefined" && !navigator.geolocation) {
                    setGeoError("This browser can't share a location.");
                    return;
                  }
                  setNearMe((v) => !v);
                  setGeoError(null);
                }}
                aria-pressed={nearMe}
                className={`wa-mono rounded-full border px-3 py-1.5 transition-colors ${
                  nearMe
                    ? "border-accent/60 bg-accent/15 text-paper"
                    : "border-paper/15 text-paper/55 hover:text-paper"
                }`}
              >
                {nearMe && !here ? "Locating…" : "Near me"}
              </button>
              {nearMe && here && (
                <span className="wa-mono text-paper/35">nearest first</span>
              )}
            </div>
            {geoError && <p className="wa-mono mt-1.5 text-paper/40">{geoError}</p>}
            {openNowOnly && hiddenForUnknownHours > 0 && (
              <p className="wa-mono mt-1.5 text-paper/35">
                {hiddenForUnknownHours} hidden (hours not recorded yet).
              </p>
            )}
          </div>
          <div className={`min-h-0 flex-1 overflow-y-auto ${sheetOpen ? "" : "hidden"} md:block`}>
            {selectedCafe ? (
              <CafeDetailPanel cafe={selectedCafe} onBack={() => setSelected(null)} />
            ) : visibleCafes.length === 0 ? (
              <p className="wa-mono p-4 text-paper/40">
                No cafes{query ? ` match "${query}"` : ""}
                {area !== "all" ? ` in ${AREAS[area].name}` : ""}
                {openNowOnly ? " are open right now" : ""}.
              </p>
            ) : (
              <>
                <div className="border-b border-paper/10 px-4 py-3">
                  <div className="hidden md:block">
                    <FactorLegend />
                  </div>
                  <Link
                    href="/about"
                    className="wa-mono flex items-center justify-between gap-2 text-paper/40 hover:text-paper md:hidden"
                  >
                    <span>{visibleCafes.length} cafes · scored on 9 weighted factors</span>
                    <span>→</span>
                  </Link>
                </div>
                <div className="space-y-2.5 p-3">
                  {visibleCafes.map((cafe) => (
                    <CafeCard
                      key={cafe.slug}
                      cafe={cafe}
                      active={selected === cafe.slug}
                      hovered={hovered === cafe.slug}
                      onSelect={() => handleSelect(cafe.slug)}
                      onHover={setHovered}
                      distance={
                        here
                          ? formatDistance(
                              distanceKm(here, {
                                latitude: cafe.latitude,
                                longitude: cafe.longitude,
                              })
                            )
                          : null
                      }
                    />
                  ))}
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </main>
  );
}
