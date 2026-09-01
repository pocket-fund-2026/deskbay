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

function pinSvg(color: string) {
  return `
    <svg width="30" height="38" viewBox="0 0 30 38" xmlns="http://www.w3.org/2000/svg" style="display:block;filter:drop-shadow(0 3px 6px rgba(0,0,0,0.45))">
      <path d="M15 37C15 37 28 22.8 28 14C28 6.8 22.2 1 15 1C7.8 1 2 6.8 2 14C2 22.8 15 37 15 37Z"
            fill="${color}" stroke="#f6f1e9" stroke-width="2"/>
      <circle cx="15" cy="14" r="6.5" fill="#f6f1e9"/>
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
  const elsRef = useRef<Record<string, HTMLButtonElement>>({});

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

    const resizeObserver = new ResizeObserver(() => map.resize());
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
              "fill-extrusion-opacity": 0.85,
            },
          },
          labelLayerId
        );
      }

      cafes.forEach((cafe) => {
        const color = scoreColor(cafe.workability);
        const el = document.createElement("button");
        el.setAttribute("aria-label", cafe.name);
        el.style.width = "30px";
        el.style.height = "38px";
        el.style.cursor = "pointer";
        el.style.background = "transparent";
        el.style.border = "none";
        el.style.padding = "0";
        el.style.transformOrigin = "bottom center";
        el.style.transition = "transform 0.15s ease";
        el.innerHTML = pinSvg(color);

        el.addEventListener("mouseenter", () => {
          if (el.dataset.selected !== "true") el.style.transform = "scale(1.15)";
        });
        el.addEventListener("mouseleave", () => {
          if (el.dataset.selected !== "true") el.style.transform = "scale(1)";
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

        el.addEventListener("click", () => onSelect?.(cafe.slug));
        markersRef.current[cafe.slug] = marker;
        elsRef.current[cafe.slug] = el;
      });
    });

    return () => {
      resizeObserver.disconnect();
      map.remove();
      mapRef.current = null;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    Object.entries(elsRef.current).forEach(([slug, el]) => {
      const isSelected = slug === selectedSlug;
      el.dataset.selected = isSelected ? "true" : "false";
      el.style.transform = isSelected ? "scale(1.35)" : "scale(1)";
      el.style.zIndex = isSelected ? "10" : "0";
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

  return <div ref={containerRef} className="h-full w-full" />;
}
