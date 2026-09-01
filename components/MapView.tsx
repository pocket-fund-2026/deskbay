"use client";

import { useEffect, useRef, useState } from "react";
import * as maplibregl from "maplibre-gl";
import "maplibre-gl/dist/maplibre-gl.css";
import type { Cafe } from "@/lib/cafes";
import { CITY } from "@/lib/cafes";

function scoreColor(score: number | null) {
  if (score === null) return "#6b6259";
  if (score >= 4) return "#7fb069";
  if (score >= 3) return "#d97b3f";
  if (score >= 2) return "#c85c3c";
  return "#8a6a5a";
}

function pinSvg(color: string) {
  return `
    <svg width="30" height="38" viewBox="0 0 30 38" xmlns="http://www.w3.org/2000/svg" style="display:block;filter:drop-shadow(0 3px 6px rgba(0,0,0,0.5))">
      <path d="M15 37C15 37 28 22.8 28 14C28 6.8 22.2 1 15 1C7.8 1 2 6.8 2 14C2 22.8 15 37 15 37Z"
            fill="${color}" stroke="#ffffff" stroke-width="2"/>
      <circle cx="15" cy="14" r="6.5" fill="#ffffff"/>
      <path d="M12 12.3h4.6M12 14.3h4.6M12.6 16h3.4" stroke="${color}" stroke-width="1.15" stroke-linecap="round"/>
    </svg>`;
}

export default function MapView({
  cafes,
  selectedSlug,
  onSelect,
}: {
  cafes: Cafe[];
  selectedSlug?: string | null;
  onSelect?: (slug: string) => void;
}) {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const mapRef = useRef<maplibregl.Map | null>(null);
  const markersRef = useRef<Record<string, maplibregl.Marker>>({});
  // The marker root element's own `transform` is owned by MapLibre (it uses it to
  // position the marker at its lng/lat). We must never write to that style — scaling
  // it directly breaks positioning and sends the pin flying to the map's corner.
  // Hover/selected scaling is applied to this inner wrapper instead.
  const innerElsRef = useRef<Record<string, HTMLSpanElement>>({});
  const onSelectRef = useRef(onSelect);
  onSelectRef.current = onSelect;
  const selectedSlugRef = useRef(selectedSlug);
  selectedSlugRef.current = selectedSlug;
  const cafesRef = useRef(cafes);
  cafesRef.current = cafes;
  const [mapReady, setMapReady] = useState(false);

  function fitToCafes(list: Cafe[], opts?: { duration?: number }) {
    const map = mapRef.current;
    if (!map || list.length === 0) return;
    const bounds = list.reduce(
      (b, c) => b.extend([c.longitude, c.latitude]),
      new maplibregl.LngLatBounds([list[0].longitude, list[0].latitude], [list[0].longitude, list[0].latitude])
    );
    map.fitBounds(bounds, {
      padding: 60,
      maxZoom: 14,
      pitch: 55,
      bearing: -12,
      duration: opts?.duration ?? 600,
    });
  }

  useEffect(() => {
    if (!containerRef.current || mapRef.current) return;

    const map = new maplibregl.Map({
      container: containerRef.current,
      style: "https://tiles.openfreemap.org/styles/liberty",
      center: [CITY.center.lng, CITY.center.lat],
      zoom: CITY.zoom,
      pitch: 55,
      bearing: -12,
      attributionControl: { compact: true },
    });

    mapRef.current = map;
    map.addControl(new maplibregl.NavigationControl({ visualizePitch: true }), "top-right");

    // Give the stock OpenFreeMap style a warm, coffee-toned cast so it sits
    // with the site's cream/espresso palette instead of its default bright
    // greens and blues.
    const canvas = map.getCanvas();
    canvas.style.filter = "sepia(0.35) saturate(0.85) brightness(1.04) contrast(0.96)";

    const resizeObserver = new ResizeObserver(() => {
      map.resize();
      // A container resize (e.g. the list panel's content height changing when
      // switching area filters) can leave the WebGL canvas visually blank even
      // though resize() reports the same pixel size. Force a redraw so the
      // basemap always reappears.
      map.triggerRepaint();
    });
    resizeObserver.observe(containerRef.current);

    map.on("load", () => {
      map.resize();
      const layers = map.getStyle().layers ?? [];
      const labelLayerId = layers.find(
        (l) => l.type === "symbol" && (l.layout as { "text-field"?: unknown })?.["text-field"]
      )?.id;

      if (map.getSource("openmaptiles")) {
        map.addLayer(
          {
            id: "3d-buildings",
            source: "openmaptiles",
            "source-layer": "building",
            type: "fill-extrusion",
            minzoom: 13,
            paint: {
              "fill-extrusion-color": "#3a332c",
              "fill-extrusion-height": ["coalesce", ["get", "render_height"], 8],
              "fill-extrusion-base": ["coalesce", ["get", "render_min_height"], 0],
              "fill-extrusion-opacity": 0.9,
            },
          },
          labelLayerId
        );
      }

      setMapReady(true);
    });

    return () => {
      resizeObserver.disconnect();
      map.remove();
      mapRef.current = null;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Keep the markers on the map in sync with whichever cafes are currently
  // being shown (e.g. after switching the area filter), instead of only ever
  // reflecting whatever list was passed in on first mount.
  useEffect(() => {
    const map = mapRef.current;
    if (!map || !mapReady) return;

    const nextSlugs = new Set(cafes.map((c) => c.slug));
    for (const slug of Object.keys(markersRef.current)) {
      if (!nextSlugs.has(slug)) {
        markersRef.current[slug].remove();
        delete markersRef.current[slug];
        delete innerElsRef.current[slug];
      }
    }

    cafes.forEach((cafe) => {
      if (markersRef.current[cafe.slug]) return;

      const color = scoreColor(cafe.workability);
      const el = document.createElement("button");
      el.setAttribute("aria-label", cafe.name);
      el.style.position = "relative";
      el.style.width = "30px";
      el.style.height = "38px";
      el.style.cursor = "pointer";
      el.style.background = "transparent";
      el.style.border = "none";
      el.style.padding = "0";

      if (cafe.workability !== null && cafe.workability >= 4) {
        const pulse = document.createElement("span");
        pulse.className = "marker-pulse";
        pulse.style.background = color;
        el.appendChild(pulse);
      }

      const inner = document.createElement("span");
      inner.style.display = "block";
      inner.style.width = "100%";
      inner.style.height = "100%";
      inner.style.transformOrigin = "bottom center";
      inner.style.transition = "transform 0.15s ease";
      inner.innerHTML = pinSvg(color);
      el.appendChild(inner);

      el.addEventListener("mouseenter", () => {
        if (el.dataset.selected !== "true") inner.style.transform = "scale(1.15)";
      });
      el.addEventListener("mouseleave", () => {
        if (el.dataset.selected !== "true") inner.style.transform = "scale(1)";
      });

      const popup = new maplibregl.Popup({ offset: 20, closeButton: false }).setHTML(
        `<div style="font-family: var(--font-inter, sans-serif); min-width:180px">
          <div style="font-weight:600;font-size:13.5px">${cafe.name}</div>
          <div style="font-size:11px;opacity:.6;margin-top:2px">${cafe.neighborhood}</div>
          <div style="font-size:11px;margin-top:6px;opacity:.85">Workability ${cafe.workability !== null ? `${cafe.workability.toFixed(1)}/5` : "too thin to score"}</div>
        </div>`
      );

      const marker = new maplibregl.Marker({ element: el, anchor: "bottom" })
        .setLngLat([cafe.longitude, cafe.latitude])
        .setPopup(popup)
        .addTo(map);

      el.addEventListener("click", () => onSelectRef.current?.(cafe.slug));
      markersRef.current[cafe.slug] = marker;
      innerElsRef.current[cafe.slug] = inner;
    });

    // Frame the map around whichever cafes are currently shown, so switching
    // an area filter doesn't leave the pins scattered off-screen. Skipped
    // while a cafe is selected, since that has its own closer flyTo.
    if (!selectedSlugRef.current) {
      fitToCafes(cafes);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [cafes, mapReady]);

  useEffect(() => {
    Object.entries(innerElsRef.current).forEach(([slug, inner]) => {
      const isSelected = slug === selectedSlug;
      inner.parentElement!.dataset.selected = isSelected ? "true" : "false";
      inner.style.transform = isSelected ? "scale(1.35)" : "scale(1)";
      inner.parentElement!.style.zIndex = isSelected ? "10" : "0";
    });

    if (!selectedSlug || !mapRef.current) return;
    const cafe = cafes.find((c) => c.slug === selectedSlug);
    if (!cafe) return;
    mapRef.current.flyTo({
      center: [cafe.longitude, cafe.latitude],
      zoom: 16,
      pitch: 60,
      duration: 900,
    });
  }, [selectedSlug, cafes]);

  return (
    <div className="relative h-full w-full">
      <div ref={containerRef} className="h-full w-full" />
      <button
        onClick={() => fitToCafes(cafesRef.current, { duration: 800 })}
        className="wa-mono absolute left-3 top-3 z-10 rounded-full border border-paper/15 bg-ink/85 px-3 py-1.5 text-paper/70 shadow-sm backdrop-blur-sm transition-colors hover:text-paper"
      >
        Reset view
      </button>
    </div>
  );
}
