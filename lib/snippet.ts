import type { Cafe } from "@/lib/cafes";

/**
 * Search snippets that answer the question instead of repeating the name.
 *
 * Search Console says most of what reaches this site is someone typing a cafe
 * they already know ("blue tokai goregaon east", "ettarra coffee house
 * andheri"). Those land us around position 8-12 next to Zomato and Google
 * Maps, and we were spending the title and description telling them the name
 * and neighbourhood they had just typed — nothing a Maps listing doesn't
 * already say. The one thing this site knows that they don't is whether you
 * can work there, so the snippet leads with that.
 *
 * Everything below is built from the cafe's own recorded attributes. Where a
 * field is missing it is left out rather than softened into a claim, which is
 * the same rule the score pages follow.
 */

// Titles get " · Bombay Cafe Map" appended by the root layout's template, so
// the budget here is what's left of a ~60-character SERP title after that.
const TITLE_BUDGET = 44;
const DESCRIPTION_BUDGET = 158;

function attr(cafe: Cafe, key: string): string | null {
  const v = cafe.attrs?.[key];
  return typeof v === "string" && v.trim() !== "" ? v.trim() : null;
}

function has(cafe: Cafe, toggle: string): boolean {
  return cafe.toggles.some((t) => t.toLowerCase() === toggle.toLowerCase());
}

/** Wi-Fi, in as few words as the evidence supports. */
function wifiPhrase(cafe: Cafe): string | null {
  const a = attr(cafe, "wifi");
  if (a) return `${a.toLowerCase()} wifi`;
  if (has(cafe, "Fast WiFi")) return "fast wifi";
  if (cafe.scores.wifi !== null && cafe.scores.wifi >= 3.5) return "good wifi";
  return null;
}

function powerPhrase(cafe: Cafe): string | null {
  const a = attr(cafe, "charging");
  if (a) return /ample|plenty|many|good/i.test(a) ? "plenty of plugs" : `${a.toLowerCase()} plugs`;
  if (has(cafe, "Outlets")) return "plugs";
  return null;
}

function stayPhrase(cafe: Cafe): string | null {
  if (has(cafe, "No time limit")) return "no time limit";
  const stay = attr(cafe, "stay")?.toLowerCase();
  if (stay === "long") return "stay for hours";
  if (stay === "medium" || stay === "moderate") return "an hour or two";
  if (stay === "short") return "a quick stop";
  return null;
}

/**
 * The differentiating half of the title: what someone gets if they click,
 * capped at three facts so it stays a phrase rather than a spec sheet.
 */
export function answerFragment(cafe: Cafe): string {
  const facts = [wifiPhrase(cafe), powerPhrase(cafe), stayPhrase(cafe)].filter(
    (f): f is string => f !== null
  );

  // One bare fact ("an hour or two") is a weaker promise than a fact plus the
  // score, so the score joins it whenever we're short of things to say.
  if (facts.length < 2 && cafe.workability !== null) {
    facts.push(`${cafe.workability.toFixed(1)}/5 to work from`);
  }
  if (facts.length === 0) {
    // Nothing recorded yet — say so honestly rather than implying a verdict.
    return "can you work from it?";
  }
  return facts.slice(0, 3).join(", ");
}

/**
 * Keeps the cafe name first (that is what was searched) and spends the rest
 * of the budget on the answer. The neighbourhood is the first thing dropped
 * when it doesn't fit — Google shows the site name alongside anyway.
 */
export function cafeTitle(cafe: Cafe): string {
  const fragment = answerFragment(cafe);
  const withArea = `${cafe.name}, ${cafe.neighborhood}: ${fragment}`;
  if (withArea.length <= TITLE_BUDGET) return withArea;

  const withoutArea = `${cafe.name}: ${fragment}`;
  if (withoutArea.length <= TITLE_BUDGET) return withoutArea;

  // Long names ("Blue Tokai Coffee Roasters — One International Center") leave
  // room for one thing only. Prefer the shortest real fact over the score:
  // "fast wifi" earns a click that "2.9/5" doesn't.
  const shortest = [wifiPhrase(cafe), powerPhrase(cafe), stayPhrase(cafe)]
    .filter((f): f is string => f !== null)
    .sort((a, b) => a.length - b.length)[0];

  if (shortest) return `${cafe.name}: ${shortest}`;
  return `${cafe.name}: ${cafe.workability !== null ? `${cafe.workability.toFixed(1)}/5 to work from` : "can you work from it?"}`;
}

/**
 * Facts first, in the order people ask them, then the editorial line if there
 * is room left. Trimmed on a sentence boundary so it never ends mid-claim.
 */
export function cafeDescription(cafe: Cafe): string {
  const wifi = attr(cafe, "wifi");
  const power = attr(cafe, "charging");
  const noise = attr(cafe, "noise");
  const seating = attr(cafe, "seating");
  const cost = attr(cafe, "avgFoodCost");
  const stay = stayPhrase(cafe);

  // Labelled, because the raw values overlap: one cafe records noise as
  // "Calm, cozy" and seating as "Cozy", which read as a stutter unbadged.
  // Deduped on the value for the same reason.
  const seen = new Set<string>();
  const facts: string[] = [];
  for (const [label, value] of [
    ["Wi-Fi", wifi],
    ["power", power],
    ["noise", noise],
    ["seating", seating],
  ] as const) {
    // Some values are recorded as prose ("High-speed, cited", "Cozy +
    // meeting area", "Likely available"). Keep the first clause, which is the
    // fact; the qualifier after it belongs on the page, not in a
    // 158-character snippet. Anything still long or hedged is dropped.
    if (!value) continue;
    const clause = value.split(/[+,;:]/)[0].trim();
    if (clause.length === 0 || clause.length > 16 || /\blikely\b/i.test(clause)) continue;
    const key = clause.toLowerCase();
    if (seen.has(key)) continue;
    seen.add(key);
    facts.push(`${label} ${clause.toLowerCase()}`);
  }

  const lead =
    facts.length > 0
      ? `${facts.slice(0, 4).join(", ")}.`
      : `${cafe.neighborhood}, Mumbai. Scored on wifi, power, noise and seating.`;

  const tail: string[] = [];
  if (stay) tail.push(stay.charAt(0).toUpperCase() + stay.slice(1));
  if (cost) tail.push(`${cost} a head`);
  if (cafe.workability !== null) {
    tail.push(`${cafe.workability.toFixed(1)}/5 workability, every finding cited`);
  }

  const out = [capitalise(lead), tail.length > 0 ? `${tail.join(". ")}.` : ""]
    .filter(Boolean)
    .join(" ");

  // The editorial line is a bonus, so it goes in only if it fits whole —
  // appending then truncating just threw the sentence away again.
  if (out.length + 1 + cafe.editorialNote.length <= DESCRIPTION_BUDGET) {
    return `${out} ${cafe.editorialNote}`;
  }
  if (out.length <= DESCRIPTION_BUDGET) return out;

  // Cut back to the last complete sentence that fits, so the snippet never
  // trails off in the middle of a claim about a real business.
  const clipped = out.slice(0, DESCRIPTION_BUDGET);
  const lastStop = clipped.lastIndexOf(". ");
  return lastStop > 60 ? clipped.slice(0, lastStop + 1) : `${clipped.trimEnd().replace(/[,.]$/, "")}…`;
}

function capitalise(text: string): string {
  return text.charAt(0).toUpperCase() + text.slice(1);
}
