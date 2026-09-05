/**
 * Free-tier geocoding via OpenStreetMap's Nominatim — no API key, matches
 * the map's own OSM-based tiles (OpenFreeMap), and is proportionate to this
 * site's volume of new-cafe submissions (a handful a week at most, not a
 * bulk pipeline). Nominatim's usage policy requires a real identifying
 * User-Agent and caps public requests at ~1/sec, both fine at this scale.
 */
export async function geocodeAddress(
  address: string
): Promise<{ latitude: number; longitude: number } | null> {
  const query = `${address}, Mumbai, Maharashtra, India`;
  const url = `https://nominatim.openstreetmap.org/search?format=json&limit=1&q=${encodeURIComponent(query)}`;

  try {
    const res = await fetch(url, {
      headers: { "User-Agent": "BombayCafeMap/1.0 (https://bombaycafemap.com)" },
    });
    if (!res.ok) return null;
    const results = (await res.json()) as { lat: string; lon: string }[];
    const first = results[0];
    if (!first) return null;
    const latitude = Number(first.lat);
    const longitude = Number(first.lon);
    if (Number.isNaN(latitude) || Number.isNaN(longitude)) return null;
    // Sanity-check against the Mumbai region rather than trusting a
    // possible mismatch (a common street name that also exists elsewhere).
    if (latitude < 18.5 || latitude > 19.5 || longitude < 72.5 || longitude > 73.3) return null;
    return { latitude, longitude };
  } catch {
    return null;
  }
}
