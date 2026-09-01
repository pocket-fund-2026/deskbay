"use client";

import { useEffect, useRef } from "react";
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

    map.on("load", () => {
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
              "fill-extrusion-opacity": 0.85,
            },
          },
          labelLayerId
        );
      }

      cafes.forEach((cafe) => {
        const el = document.createElement("button");
        el.setAttribute("aria-label", cafe.name);
        el.style.width = "14px";
        el.style.height = "14px";
        el.style.borderRadius = "50%";
        el.style.border = "2px solid #f6f1e9";
        el.style.background = scoreColor(cafe.workability);
        el.style.cursor = "pointer";
        el.style.boxShadow = "0 0 0 3px rgba(0,0,0,0.35)";

        const popup = new maplibregl.Popup({ offset: 14, closeButton: false }).setHTML(
          `<div style="font-family: var(--font-inter, sans-serif); min-width:180px">
            <div style="font-weight:600;font-size:13.5px">${cafe.name}</div>
            <div style="font-size:11px;opacity:.6;margin-top:2px">${cafe.neighborhood}</div>
            <div style="font-size:11px;margin-top:6px;opacity:.85">Workability ${cafe.workability !== null ? `${cafe.workability.toFixed(1)}/5` : "too thin to score"}</div>
          </div>`
        );

        const marker = new maplibregl.Marker({ element: el })
          .setLngLat([cafe.longitude, cafe.latitude])
          .setPopup(popup)
          .addTo(map);

        el.addEventListener("click", () => onSelect?.(cafe.slug));
        markersRef.current[cafe.slug] = marker;
      });
    });

    return () => {
      map.remove();
      mapRef.current = null;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (!selectedSlug || !mapRef.current) return;
    const cafe = cafes.find((c) => c.slug === selectedSlug);
    if (!cafe) return;
    mapRef.current.flyTo({
      center: [cafe.longitude, cafe.latitude],
      zoom: 16,
      pitch: 60,
      duration: 900,
    });
    markersRef.current[selectedSlug]?.togglePopup();
  }, [selectedSlug, cafes]);

  return <div ref={containerRef} className="h-full w-full" />;
}
