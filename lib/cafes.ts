import raw from "@/data/cafes.json";
import merged from "@/data/merged-slugs.json";
import { hasVisitData } from "@/lib/visits";

export type CafeScores = {
  wifi: number | null;
  charging: number | null;
  quiet: number | null;
  seating: number | null;
  work: number | null;
};

export type Cafe = {
  slug: string;
  name: string;
  area:
    | "bandra"
    | "south-bombay"
    | "andheri-juhu"
    | "malad-borivali"
    | "central-mumbai"
    | "eastern-suburbs"
    | "bkc"
    | "thane"
    | "navi-mumbai";
  neighborhood: string;
  address: string;
  latitude: number;
  longitude: number;
  website: string | null;
  instagram: string | null;
  googleMapsUrl: string;
  openingHours: string | null;
  editorialNote: string;
  whyWeRecommend: string;
  scores: CafeScores;
  attrs: Record<string, string | null>;
  evidence: Record<string, string | null>;
  toggles: string[];
  tags: string[];
  sources: string[];
  lastVerifiedAt: string;
  publicRating: { value: number; count: number; source: string; url: string } | null;
  synthesis: string | null;
  workability: number | null;
  images: { url: string; alt: string; credit?: string; creditUrl?: string; license?: string }[];
  menuUrl: string | null;
};

export const CITY = raw.city as { slug: string; name: string; tagline: string; center: { lat: number; lng: number }; zoom: number };
/**
 * Duplicate listings merged into the entry that carries the most data.
 * Same venue, same coordinates or same unit address, listed twice. The old
 * slug 301/308-redirects to the keeper (next.config.ts) and the duplicate is
 * dropped from every list, map, collection and the sitemap.
 */
export const MERGED_SLUGS: Record<string, string> = merged;

export const CAFES = (raw.spots as Cafe[]).filter((c) => !(c.slug in MERGED_SLUGS));

export const AREAS = {
  bandra: {
    slug: "bandra",
    name: "Bandra",
    description:
      "Bungalow lanes and bakeries turned coffee rooms. Independent, unhurried, and the best odds in the city of a table at three in the afternoon.",
    streets: "Sherly Rajan Road · Waterfield Road · Perry Road · Carter Road",
  },
  "south-bombay": {
    slug: "south-bombay",
    name: "South Bombay",
    description:
      "Stone arcades, Irani cafes that have kept the same tables for a century, and new roasters in the old banking streets.",
    streets: "Fort · Colaba · Kala Ghoda · Ballard Estate",
  },
  "andheri-juhu": {
    slug: "andheri-juhu",
    name: "Andheri & Juhu",
    description:
      "Chains and specialty roasters through Andheri, Juhu and Khar: the widest spread of any suburb, from film-crowd regulars to airport-adjacent chains.",
    streets: "Andheri · Juhu · Khar · Santacruz · Versova",
  },
  "malad-borivali": {
    slug: "malad-borivali",
    name: "Malad & Borivali",
    description:
      "The far western suburbs' own cafe stretch, from Goregaon up to Borivali. Quieter rooms, and fewer laptops fighting for the good table.",
    streets: "Malad · Goregaon · Kandivali · Borivali",
  },
  "central-mumbai": {
    slug: "central-mumbai",
    name: "Central Mumbai",
    description:
      "Mill-district roasters and old-Bombay cafes in the middle of the city, where Worli's new openings meet Matunga's century-old Udupi rooms.",
    streets: "Worli · Lower Parel · Dadar · Matunga · Mahim",
  },
  "eastern-suburbs": {
    slug: "eastern-suburbs",
    name: "Eastern Suburbs",
    description:
      "Powai's lakeside cafes anchor a scene now spreading through Ghatkopar, Chembur and Mulund as the eastern belt fills in.",
    streets: "Powai · Ghatkopar · Chembur · Mulund · Vikhroli",
  },
  bkc: {
    slug: "bkc",
    name: "BKC",
    description:
      "Coffee built for the business district's schedule: quick counters and a handful of rooms built for a laptop between meetings.",
    streets: "Bandra Kurla Complex",
  },
  thane: {
    slug: "thane",
    name: "Thane",
    description:
      "The satellite city's own cafe scene, growing fast along Ghodbunder Road as the western suburbs push north.",
    streets: "Ghodbunder Road · Vartak Nagar · Thane West · Thane East",
  },
  "navi-mumbai": {
    slug: "navi-mumbai",
    name: "Navi Mumbai",
    description:
      "Planned-city cafes across Vashi, Nerul and Belapur: wide streets and mall-adjacent rooms built for a different kind of commute.",
    streets: "Vashi · Nerul · Belapur · Kharghar",
  },
} as const;

export type AreaSlug = keyof typeof AREAS;

export const FACTORS: { key: string; label: string; weight: number; question: string }[] = [
  { key: "power", label: "Power", weight: 22, question: "Can you plug in?" },
  { key: "wifi", label: "Wi-Fi", weight: 20, question: "Will the connection hold for a call or an upload?" },
  { key: "seating", label: "Seating", weight: 16, question: "Is there a table you can work at, comfortably?" },
  { key: "longStay", label: "Long stay", weight: 16, question: "Will they let you stay three hours?" },
  { key: "focus", label: "Focus", weight: 14, question: "Can you concentrate?" },
  { key: "calls", label: "Calls", weight: 5, question: "Can you take a call without annoying everyone?" },
  { key: "food", label: "Food", weight: 4, question: "Can you eat a real meal without leaving?" },
  { key: "outdoor", label: "Outdoor", weight: 2, question: "Is there usable outdoor seating?" },
  { key: "bathroom", label: "Bathroom", weight: 1, question: "Is there a bathroom?" },
];

export function cafesByArea(area: AreaSlug) {
  return CAFES.filter((c) => c.area === area);
}

const present = (v: unknown) => v !== null && v !== undefined && String(v).trim() !== "";

// Evidence sentences that appear verbatim on more than one cafe are chain-wide
// boilerplate, not something known about this venue.
const EVIDENCE_COUNTS = new Map<string, number>();
for (const c of CAFES) {
  for (const v of Object.values(c.evidence)) {
    if (v) EVIDENCE_COUNTS.set(v, (EVIDENCE_COUNTS.get(v) ?? 0) + 1);
  }
}

/** How many of wifi / power / noise / seating / stay-length we hold a real value for. */
export function verifiedFactorCount(cafe: Cafe) {
  const a = cafe.attrs ?? {};
  const s = cafe.scores;
  return [
    present(a.wifi) || s.wifi != null,
    present(a.charging) || s.charging != null,
    present(a.noise) || s.quiet != null,
    present(a.seating) || s.seating != null,
    present(a.stay) || cafe.toggles.includes("No time limit"),
  ].filter(Boolean).length;
}

/** Evidence notes written for this venue alone (not shared with any other cafe). */
export function uniqueEvidenceCount(cafe: Cafe) {
  return Object.values(cafe.evidence).filter((v) => v && EVIDENCE_COUNTS.get(v) === 1).length;
}

/**
 * A page is only worth indexing when it holds distinct, cited, work-relevant
 * data of its own: at least three of the five work factors recorded AND at
 * least two evidence notes unique to this venue (or first-hand visit data in
 * data/visits.json). Everything else stays reachable and linked for readers
 * but is noindexed and left out of the sitemap, so near-identical template
 * pages do not dilute the site.
 */
export function isIndexable(cafe: Cafe) {
  if (hasVisitData(cafe.slug)) return true;
  return verifiedFactorCount(cafe) >= 3 && uniqueEvidenceCount(cafe) >= 2;
}

export function getCafe(slug: string) {
  return CAFES.find((c) => c.slug === slug);
}

export function nearbyCafes(cafe: Cafe, limit = 3) {
  return cafesByArea(cafe.area)
    .filter((c) => c.slug !== cafe.slug)
    .sort((a, b) => (b.workability ?? -1) - (a.workability ?? -1))
    .slice(0, limit);
}
