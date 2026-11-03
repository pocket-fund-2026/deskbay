import { AREAS, CAFES, type Cafe } from "@/lib/cafes";
import { COLLECTIONS } from "@/lib/collections";

/** Same rule as the matching /collections page, so a post and its collection can never disagree. */
export const inCollection = (slug: string) => {
  const col = COLLECTIONS.find((c) => c.slug === slug)!;
  return { list: CAFES.filter(col.match), col };
};

export const byScore = (cafes: Cafe[]) =>
  cafes.slice().sort((a, b) => (b.workability ?? -1) - (a.workability ?? -1));

export const countByArea = (cafes: Cafe[]) =>
  Object.values(AREAS)
    .map((a) => ({ area: a, n: cafes.filter((c) => c.area === a.slug).length }))
    .sort((a, b) => b.n - a.n);

export const DATA_AS_OF = "3 November 2026";
