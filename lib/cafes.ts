import raw from "@/data/cafes.json";

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
  area: "bandra" | "south-bombay";
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
export const CAFES = raw.spots as Cafe[];

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

export function getCafe(slug: string) {
  return CAFES.find((c) => c.slug === slug);
}
