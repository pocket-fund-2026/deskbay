import { AREAS, cafesByArea, type Cafe } from "@/lib/cafes";
import { SCORE_ROWS } from "@/lib/scoreTier";

/**
 * Plain-language comparison of one cafe against the rest of its area, built
 * only from data we already hold (scores, hours, attrs). It gives every cafe
 * page content of its own beyond the template: where it ranks, what it is
 * best and worst at, what we have not verified, and who to try instead.
 * Absent data is stated as "not verified", never guessed.
 */
export type CafeInsight = { heading: string; paragraphs: string[] };

const fmt = (n: number) => (Number.isInteger(n) ? String(n) : n.toFixed(1));
const lower = (s: string) => (s === "Wi-Fi" ? s : s.toLowerCase());

export function cafeInsight(cafe: Cafe): CafeInsight {
  const area = AREAS[cafe.area].name;
  const peers = cafesByArea(cafe.area);
  const rated = peers.filter((c) => c.workability !== null);
  const paragraphs: string[] = [];

  // 1. Where it sits in its area.
  if (cafe.workability !== null) {
    const better = rated.filter((c) => (c.workability ?? 0) > cafe.workability!).length;
    const avg = rated.reduce((s, c) => s + (c.workability ?? 0), 0) / rated.length;
    const diff = cafe.workability - avg;
    const vs =
      Math.abs(diff) < 0.15
        ? "right at the area average"
        : diff > 0
          ? `${fmt(Math.round(diff * 10) / 10)} above the area average`
          : `${fmt(Math.round(-diff * 10) / 10)} below the area average`;
    paragraphs.push(
      `${cafe.name} ranks #${better + 1} of ${rated.length} scored cafes in ${area} for working on a laptop, with a workability score of ${fmt(cafe.workability)} out of 5. That is ${vs} of ${fmt(Math.round(avg * 10) / 10)}.`,
    );
  } else {
    paragraphs.push(
      `We do not have enough evidence to give ${cafe.name} a workability score yet, so it is not ranked among the ${rated.length} scored cafes in ${area}. The page will update as soon as we can verify the basics.`,
    );
  }

  // 2. Strongest and weakest verified factors.
  const known = SCORE_ROWS.map((r) => ({ ...r, value: cafe.scores[r.key] })).filter(
    (r): r is typeof r & { value: number } => r.value !== null,
  );
  const unknown = SCORE_ROWS.filter((r) => cafe.scores[r.key] === null);
  let weakest: (typeof known)[number] | null = null;
  if (known.length >= 2) {
    const sorted = [...known].sort((a, b) => b.value - a.value);
    const top = sorted[0];
    weakest = sorted[sorted.length - 1];
    paragraphs.push(
      top.value === weakest.value
        ? `Every factor we could verify scores the same here, ${fmt(top.value)} out of 5, across ${known.map((k) => lower(k.label)).join(", ")}.`
        : `Of the ${known.length} factors we could verify, ${lower(top.label)} is the strongest at ${fmt(top.value)} out of 5 and ${lower(weakest.label)} is the weakest at ${fmt(weakest.value)}.`,
    );
  } else if (known.length === 1) {
    weakest = known[0];
    paragraphs.push(
      `${known[0].label} is the only factor we have solid evidence for so far, at ${fmt(known[0].value)} out of 5.`,
    );
  } else {
    paragraphs.push(
      `We have not yet verified Wi-Fi, power, noise or seating here, so treat this page as a starting point rather than a recommendation.`,
    );
  }
  if (unknown.length > 0 && known.length > 0) {
    paragraphs.push(
      `Not yet verified: ${unknown.map((r) => lower(r.label)).join(", ")}. If you have worked here, the submit page takes corrections.`,
    );
  }

  // 3. Practical facts we do hold.
  const facts: string[] = [];
  facts.push(
    cafe.openingHours
      ? `It is open ${cafe.openingHours}.`
      : `Opening hours are not confirmed, so check before a long trip.`,
  );
  if (cafe.attrs?.avgFoodCost) facts.push(`Typical spend is ${cafe.attrs.avgFoodCost}.`);
  if (cafe.toggles.includes("No time limit")) facts.push(`There is no time limit on how long you can stay.`);
  facts.push(`It sits in ${cafe.neighborhood}, ${area}.`);
  paragraphs.push(facts.join(" "));

  // 4. Who to try instead, for the thing this cafe is worst at.
  const alt = (weakest ? peers : [])
    .filter((c) => c.slug !== cafe.slug && weakest && c.scores[weakest.key] !== null)
    .sort((a, b) => (b.scores[weakest!.key] ?? 0) - (a.scores[weakest!.key] ?? 0))[0];
  if (weakest && alt && (alt.scores[weakest.key] ?? 0) > weakest.value) {
    paragraphs.push(
      `If ${lower(weakest.label)} matters most for your session, ${alt.name} in ${alt.neighborhood} scores ${fmt(alt.scores[weakest.key]!)} for it.`,
    );
  } else {
    const next = rated
      .filter((c) => c.slug !== cafe.slug)
      .sort((a, b) => (b.workability ?? 0) - (a.workability ?? 0))[0];
    if (next) paragraphs.push(`The top-scored alternative in ${area} is ${next.name} in ${next.neighborhood}, at ${fmt(next.workability!)} out of 5.`);
  }

  return { heading: `How ${cafe.name} compares in ${area}`, paragraphs };
}
