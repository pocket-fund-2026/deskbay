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

const LEGEND: { color: string; label: string }[] = [
  { color: "#3f9e4f", label: "4.0+ works well" },
  { color: "#e08a2e", label: "3.0–3.9 usable" },
  { color: "#d64a3a", label: "under 3.0" },
  { color: "#9c9084", label: "not scored" },
];

function toGeoJSON(cafes: Cafe[]): GeoJSON.FeatureCollection {
  return {
    type: "FeatureCollection",
    features: cafes.map((c) => ({
      type: "Feature",
      geometry: { type: "Point", coordinates: [c.longitude, c.latitude] },
      properties: {
        slug: c.slug,
        name: c.name,
        neighborhood: c.neighborhood,
        // Pre-formatted for the label layer: expressions can't do toFixed.
        scoreLabel: c.workability !== null ? c.workability.toFixed(1) : "",
        color: scoreColor(c.workability),
        topScored: c.workability !== null && c.workability >= 4,
      },
    })),
  };
}

function pointFC(cafe: Cafe | null | undefined): GeoJSON.FeatureCollection {
  if (!cafe) return emptyFC;
  return {
    type: "FeatureCollection",
    features: [
      {
        type: "Feature",
        geometry: { type: "Point", coordinates: [cafe.longitude, cafe.latitude] },
        properties: {},
      },
    ],
  };
}

const emptyFC: GeoJSON.FeatureCollection = { type: "FeatureCollection", features: [] };

function escapeHtml(s: string) {
  return s.replace(/[&<>"']/g, (ch) =>
    ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[ch] as string
  );
}

export default function MapView({
  cafes,
  selectedSlug,
  hoveredSlug,
  onSelect,
  onHover,
}: {
  cafes: Cafe[];
  selectedSlug?: string | null;
  hoveredSlug?: string | null;
  onSelect?: (slug: string) => void;
  onHover?: (slug: string | null) => void;
}) {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const mapRef = useRef<maplibregl.Map | null>(null);
  const popupRef = useRef<maplibregl.Popup | null>(null);
  const onSelectRef = useRef(onSelect);
  onSelectRef.current = onSelect;
  const onHoverRef = useRef(onHover);
  onHoverRef.current = onHover;
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

    // Deliberately not map.fitBounds(): it resets the camera to flat north-up,
    // throwing away the tilt the whole 3D treatment depends on, and with the
    // full city list it frames Palghar to Panvel — a regional map with the
    // cafes bunched into one corner. Take its computed center/zoom, clamp the
    // zoom into a range that still reads as Mumbai, and fly there ourselves
    // with the pitch and bearing intact.
    const camera = map.cameraForBounds(bounds, { padding: 60 });
    if (!camera) return;

    // Small filtered groups (a single area) should zoom in enough to split
    // apart into individual pins; the full, city-wide "All" view stays pulled
    // back and clustered — but never further back than the city itself.
    const maxZoom = list.length <= 25 ? 16 : 13;
    const minZoom = list.length <= 25 ? 12 : 10.6;
    const zoom = Math.min(maxZoom, Math.max(minZoom, camera.zoom ?? maxZoom));

    map.easeTo({
      center: camera.center,
      zoom,
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
    map.addControl(
      new maplibregl.GeolocateControl({ trackUserLocation: false, showAccuracyCircle: true }),
      "top-right"
    );

    // Hover card. Hidden until a pin is hovered; MapLibre keeps it anchored to
    // the coordinate as the map pans and pitches.
    const popup = new maplibregl.Popup({
      closeButton: false,
      closeOnClick: false,
      offset: 14,
      className: "cafe-popup",
      maxWidth: "240px",
    });
    popupRef.current = popup;

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

      // The stock style ships every shop/amenity as a labelled icon, which
      // at city zoom reads as visual noise competing with our own cafe
      // pins. Mute it instead of removing it outright, so streets still
      // orient the reader without shouting over the map's real subject.
      for (const l of layers) {
        if (/poi|shield|transit|railway-label/i.test(l.id) && (l.type === "symbol" || l.type === "circle")) {
          try {
            map.setPaintProperty(l.id, l.type === "symbol" ? "icon-opacity" : "circle-opacity", 0.35);
            if (l.type === "symbol") map.setPaintProperty(l.id, "text-opacity", 0.45);
          } catch {
            /* layer doesn't support this paint property; skip */
          }
        }
      }

      // Real depth instead of a flat dark silhouette: a vertical gradient
      // shades each building darker at street level and warmer near the
      // roofline, like it's catching low light.
      if (map.getSource("openmaptiles")) {
        map.addLayer(
          {
            id: "3d-buildings",
            source: "openmaptiles",
            "source-layer": "building",
            type: "fill-extrusion",
            minzoom: 12.5,
            paint: {
              "fill-extrusion-color": [
                "interpolate",
                ["linear"],
                ["coalesce", ["get", "render_height"], 8],
                0,
                "#241811",
                40,
                "#5c3f28",
                120,
                "#8a5a35",
              ],
              "fill-extrusion-height": ["coalesce", ["get", "render_height"], 8],
              "fill-extrusion-base": ["coalesce", ["get", "render_min_height"], 0],
              "fill-extrusion-opacity": 0.92,
              "fill-extrusion-vertical-gradient": true,
            },
          },
          labelLayerId
        );
      }

      // A warm dusk sky for the tilted 3D view instead of flat void above
      // the horizon.
      map.setSky({
        "sky-color": "#cfa876",
        "sky-horizon-blend": 0.5,
        "horizon-color": "#f2e2c4",
        "horizon-fog-blend": 0.6,
        "fog-color": "#e9d7b2",
        "fog-ground-blend": 0.4,
      });

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

      // Once pins are far enough apart to read, name them. Without this the
      // map is a field of anonymous dots you have to click one at a time to
      // identify. MapLibre's collision detection drops labels that would
      // overlap, so this stays legible rather than piling up.
      map.addLayer({
        id: "cafe-label",
        type: "symbol",
        source: "cafes",
        filter: ["!", ["has", "point_count"]],
        minzoom: 13.5,
        layout: {
          "text-field": ["get", "name"],
          "text-font": ["Noto Sans Bold"],
          "text-size": ["interpolate", ["linear"], ["zoom"], 13.5, 10, 16, 12.5],
          "text-anchor": "top",
          "text-offset": [0, 0.9],
          "text-max-width": 9,
          "text-padding": 4,
          // Top-scored cafes win the collision fight, so the best options
          // stay named when the map gets busy.
          "symbol-sort-key": ["case", ["get", "topScored"], 0, 1],
        },
        paint: {
          "text-color": "#2b1810",
          "text-halo-color": "#f7efe0",
          "text-halo-width": 1.6,
        },
      });

      map.addSource("hovered-cafe", { type: "geojson", data: emptyFC });
      map.addLayer({
        id: "hovered-ring",
        type: "circle",
        source: "hovered-cafe",
        paint: {
          "circle-color": "#b5651d",
          "circle-opacity": 0.25,
          "circle-radius": 18,
          "circle-stroke-width": 2,
          "circle-stroke-color": "#b5651d",
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

      // Hovering a pin names it, scores it, and mirrors the highlight into
      // the cafe list alongside the map.
      map.on("mousemove", "unclustered-point", (e) => {
        const f = e.features?.[0];
        if (!f) return;
        map.getCanvas().style.cursor = "pointer";
        const p = f.properties as { slug: string; name: string; neighborhood: string; scoreLabel: string };
        const score = p.scoreLabel ? `<span class="cafe-popup__score">${escapeHtml(p.scoreLabel)}</span>` : "";
        popup
          .setLngLat((f.geometry as GeoJSON.Point).coordinates as [number, number])
          .setHTML(
            `<div class="cafe-popup__row"><span class="cafe-popup__name">${escapeHtml(p.name)}</span>${score}</div>` +
              `<div class="cafe-popup__area">${escapeHtml(p.neighborhood ?? "")}</div>`
          )
          .addTo(map);
        onHoverRef.current?.(p.slug);
      });

      map.on("mouseleave", "unclustered-point", () => {
        map.getCanvas().style.cursor = "";
        popup.remove();
        onHoverRef.current?.(null);
      });

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

      // A pin's label is a click target too — it sits right under the dot and
      // is often the easier thing to hit.
      map.on("click", "cafe-label", (e) => {
        const slug = e.features?.[0]?.properties?.slug as string | undefined;
        if (slug) onSelectRef.current?.(slug);
      });

      setMapReady(true);
    });

    return () => {
      resizeObserver.disconnect();
      popup.remove();
      popupRef.current = null;
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

    // Refit unless a cafe that is actually in this list is selected — after an
    // area change the old selection is gone, and skipping the refit here used
    // to strand the map over the previous area.
    const stillSelected =
      selectedSlugRef.current && cafes.some((c) => c.slug === selectedSlugRef.current);
    if (!stillSelected) {
      fitToCafes(cafes);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [cafes, mapReady]);

  useEffect(() => {
    const map = mapRef.current;
    if (!map || !mapReady) return;
    const selectedSource = map.getSource("selected-cafe") as maplibregl.GeoJSONSource | undefined;
    const cafe = selectedSlug ? cafes.find((c) => c.slug === selectedSlug) : null;
    selectedSource?.setData(pointFC(cafe));
    if (cafe) {
      map.flyTo({ center: [cafe.longitude, cafe.latitude], zoom: 16, pitch: 60, duration: 900 });
    }
  }, [selectedSlug, cafes, mapReady]);

  // Hovering a card in the list rings the matching pin on the map.
  useEffect(() => {
    const map = mapRef.current;
    if (!map || !mapReady) return;
    const source = map.getSource("hovered-cafe") as maplibregl.GeoJSONSource | undefined;
    const cafe = hoveredSlug ? cafes.find((c) => c.slug === hoveredSlug) : null;
    source?.setData(pointFC(cafe));
  }, [hoveredSlug, cafes, mapReady]);

  return (
    <div className="relative h-full w-full">
      <div ref={containerRef} className="h-full w-full" />
      <button
        onClick={() => fitToCafes(cafesRef.current, { duration: 800 })}
        className="wa-mono absolute left-3 top-3 z-10 rounded-full border border-paper/15 bg-ink/85 px-3 py-1.5 text-paper/70 shadow-sm backdrop-blur-sm transition-colors hover:text-paper"
      >
        Reset view
      </button>

      {/* Without this the dot colors are a private code: the map's whole
          point is the workability score, so say what the colors mean. */}
      <div className="wa-mono absolute bottom-3 left-3 z-10 hidden rounded-xl md:block border border-paper/15 bg-ink/85 px-3 py-2 text-paper/60 shadow-sm backdrop-blur-sm">
        <ul className="space-y-1">
          {LEGEND.map((l) => (
            <li key={l.label} className="flex items-center gap-2 whitespace-nowrap">
              <span
                className="inline-block h-2.5 w-2.5 shrink-0 rounded-full ring-1 ring-paper/20"
                style={{ backgroundColor: l.color }}
              />
              {l.label}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
