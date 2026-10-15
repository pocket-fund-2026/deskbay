import raw from "@/data/visits.json";

export type VisitData = {
  visitedOn: string;
  visitedBy?: string;
  wifiDownMbps?: number;
  wifiUpMbps?: number;
  wifiNote?: string;
  plugPoints?: number;
  plugNote?: string;
  seatingNote?: string;
  timeLimit?: string;
  coffeePriceInr?: number;
  photos?: { src: string; alt: string; credit?: string }[];
  notes?: string;
};

const VISITS = raw as unknown as Record<string, VisitData | string>;

/** Only real entries: the readme and the example template are ignored. */
export function getVisit(slug: string): VisitData | null {
  if (slug.startsWith("_") || slug === "example-template") return null;
  const v = VISITS[slug];
  return v && typeof v === "object" && /^\d{4}-\d{2}-\d{2}$/.test(v.visitedOn) ? v : null;
}

export function hasVisitData(slug: string): boolean {
  return getVisit(slug) !== null;
}
