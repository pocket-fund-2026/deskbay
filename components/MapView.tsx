"use client";

import { useEffect, useRef, useState } from "react";
import * as maplibregl from "maplibre-gl";
import "maplibre-gl/dist/maplibre-gl.css";
import type { Cafe } from "@/lib/cafes";
import { CITY } from "@/lib/cafes";

// Deliberately more saturated than the site's muted palette elsewhere: these
// render as small map-layer dots, filtered by the canvas's warm cast, so a
// gentler color would wash out and become indistinguishable from its
// neighbors. Contrast here matters more than matching the brand tone.
function scoreColor(score: number | null) {
  if (score === null) return "#9c9084";
  if (score >= 4) return "#3f9e4f";
  if (score >= 3) return "#e08a2e";
  if (score >= 2) return "#d64a3a";
  return "#8a4a3a";
}

function toGeoJSON(cafes: Cafe[]): GeoJSON.FeatureCollection {
  return {
    type: "FeatureCollection",
    features: cafes.map((c) => ({
      type: "Feature",
      geometry: { type: "Point", coordinates: [c.longitude, c.latitude] },
      properties: {
        slug: c.slug,
        color: scoreColor(c.workability),
        topScored: c.workability !== null && c.workability >= 4,
      },
    })),
  };
}

const emptyFC: GeoJSON.FeatureCollection = { type: "FeatureCollection", features: [] };

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
    // Small filtered groups (a single area) should zoom in enough to split
    // apart into individual pins; only the full, city-wide "All" view should
    // stay pulled back and clustered.
    map.fitBounds(bounds, {
      padding: 60,
      maxZoom: list.length <= 25 ? 16 : 13,
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
    // Lighter than before: the cafe markers are now real map layers on this
    // same canvas (not separate DOM elements), so a heavy sepia/desaturate
    // filter here was also muddying their green/orange/red workability
    // colors into near-identical browns. This keeps the warm cast on the
    // basemap while marker colors stay legible.
    canvas.style.filter = "sepia(0.15) saturate(1.05) brightness(1.02) contrast(0.98)";

    const resizeObserver = new ResizeObserver(() => {
      map.resize();
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

      // Cafes are shown as a clustered point source instead of one DOM marker
      // per cafe: with 100+ cafes, individual pins overlapped into an
      // unreadable pile whenever several were close together (the "crowded"
      // map). Clustering groups nearby cafes into a count bubble that splits
      // apart as you zoom in.
      map.addSource("cafes", {
        type: "geojson",
        data: emptyFC,
        cluster: true,
        clusterMaxZoom: 14,
        clusterRadius: 45,
      });

      // A two-tone "coffee ring" look for clusters: a soft accent halo behind
      // a solid espresso disc, instead of a single flat circle.
      map.addLayer({
        id: "cluster-halo",
        type: "circle",
        source: "cafes",
        filter: ["has", "point_count"],
        paint: {
          "circle-color": "#b5651d",
          "circle-opacity": 0.22,
          "circle-radius": ["step", ["get", "point_count"], 24, 10, 30, 30, 38],
        },
      });

      map.addLayer({
        id: "clusters",
        type: "circle",
        source: "cafes",
        filter: ["has", "point_count"],
        paint: {
          "circle-color": "#2b1810",
          "circle-stroke-width": 2,
          "circle-stroke-color": "#f7efe0",
          "circle-radius": ["step", ["get", "point_count"], 16, 10, 20, 30, 25],
        },
      });

      map.addLayer({
        id: "cluster-count",
        type: "symbol",
        source: "cafes",
        filter: ["has", "point_count"],
        layout: {
          "text-field": ["get", "point_count_abbreviated"],
          "text-size": 12,
          "text-font": ["Noto Sans Bold"],
        },
        paint: { "text-color": "#f7efe0" },
      });

      map.addLayer({
        id: "point-halo",
        type: "circle",
        source: "cafes",
        filter: ["!", ["has", "point_count"]],
        paint: {
          "circle-color": ["get", "color"],
          "circle-radius": ["case", ["get", "topScored"], 17, 12],
          "circle-opacity": ["case", ["get", "topScored"], 0.3, 0.16],
        },
      });

      map.addLayer({
        id: "unclustered-point",
        type: "circle",
        source: "cafes",
        filter: ["!", ["has", "point_count"]],
        paint: {
          "circle-color": ["get", "color"],
          "circle-radius": ["case", ["get", "topScored"], 9, 7.5],
          "circle-stroke-width": 2,
          "circle-stroke-color": "#fdf9f2",
        },
      });

      map.addSource("selected-cafe", { type: "geojson", data: emptyFC });
      map.addLayer({
        id: "selected-ring",
        type: "circle",
        source: "selected-cafe",
        paint: {
          "circle-color": "transparent",
          "circle-radius": 14,
          "circle-stroke-width": 3,
          "circle-stroke-color": "#2b1810",
        },
      });

      map.on("mouseenter", "clusters", () => (map.getCanvas().style.cursor = "pointer"));
      map.on("mouseleave", "clusters", () => (map.getCanvas().style.cursor = ""));
      map.on("mouseenter", "unclustered-point", () => (map.getCanvas().style.cursor = "pointer"));
      map.on("mouseleave", "unclustered-point", () => (map.getCanvas().style.cursor = ""));

      map.on("click", "clusters", (e) => {
        const features = map.queryRenderedFeatures(e.point, { layers: ["clusters"] });
        const clusterId = features[0]?.properties?.cluster_id;
        const source = map.getSource("cafes") as maplibregl.GeoJSONSource;
        if (clusterId === undefined) return;
        source
          .getClusterExpansionZoom(clusterId)
          .then((zoom) => {
            const geometry = features[0].geometry as GeoJSON.Point;
            map.easeTo({ center: geometry.coordinates as [number, number], zoom, duration: 500 });
          })
          .catch(() => {});
      });

      map.on("click", "unclustered-point", (e) => {
        const slug = e.features?.[0]?.properties?.slug as string | undefined;
        if (slug) onSelectRef.current?.(slug);
      });

      setMapReady(true);
    });

    return () => {
      resizeObserver.disconnect();
      map.remove();
      mapRef.current = null;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Keep the clustered source in sync with whichever cafes are currently shown.
  useEffect(() => {
    const map = mapRef.current;
    if (!map || !mapReady) return;
    (map.getSource("cafes") as maplibregl.GeoJSONSource | undefined)?.setData(toGeoJSON(cafes));

    if (!selectedSlugRef.current) {
      fitToCafes(cafes);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [cafes, mapReady]);

  useEffect(() => {
    const map = mapRef.current;
    if (!map || !mapReady) return;
    const selectedSource = map.getSource("selected-cafe") as maplibregl.GeoJSONSource | undefined;
    const cafe = selectedSlug ? cafes.find((c) => c.slug === selectedSlug) : null;
    selectedSource?.setData(
      cafe
        ? {
            type: "FeatureCollection",
            features: [
              { type: "Feature", geometry: { type: "Point", coordinates: [cafe.longitude, cafe.latitude] }, properties: {} },
            ],
          }
        : emptyFC
    );
    if (cafe) {
      map.flyTo({ center: [cafe.longitude, cafe.latitude], zoom: 16, pitch: 60, duration: 900 });
    }
  }, [selectedSlug, cafes, mapReady]);

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
