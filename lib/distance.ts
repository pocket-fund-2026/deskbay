/**
 * Straight-line distance between the reader and a cafe.
 *
 * Deliberately not a routing distance: Mumbai traffic makes "1.2 km" and "how
 * long it takes to get there" almost unrelated numbers, and pretending
 * otherwise would need a paid directions API. As-the-crow-flies is enough to
 * order a list by "nearest first", which is the only thing it's used for.
 */

const EARTH_RADIUS_KM = 6371;

export type Point = { latitude: number; longitude: number };

export function distanceKm(a: Point, b: Point): number {
  const toRad = (deg: number) => (deg * Math.PI) / 180;
  const dLat = toRad(b.latitude - a.latitude);
  const dLng = toRad(b.longitude - a.longitude);
  const lat1 = toRad(a.latitude);
  const lat2 = toRad(b.latitude);

  const h =
    Math.sin(dLat / 2) ** 2 + Math.cos(lat1) * Math.cos(lat2) * Math.sin(dLng / 2) ** 2;
  return 2 * EARTH_RADIUS_KM * Math.asin(Math.min(1, Math.sqrt(h)));
}

export function formatDistance(km: number): string {
  if (km < 1) return `${Math.round(km * 100) * 10} m`;
  if (km < 10) return `${km.toFixed(1)} km`;
  return `${Math.round(km)} km`;
}
