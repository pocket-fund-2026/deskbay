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
const TITLE_BUDGET = 42;
const DESCRIPTION_BUDGET = 158;

function attr(cafe: Cafe, key: string): string | null {
  const v = cafe.attrs?.[key];
  return typeof v === "string" && v.trim() !== "" ? v.trim() : null;
}

function has(cafe: Cafe, toggle: string): boolean {
  return cafe.toggles.some((t) => t.toLowerCase() === toggle.toLowerCase());
}

/**
 * Attribute values are sometimes recorded as prose ("reported, some
 * inconsistency", "hotel-wide free wifi (four seasons)"). A title wants a
 * short label only, so keep the first clause and drop anything long or hedged.
 */
function shortLabel(value: string | null, max = 14): string | null {
  if (!value) return null;
  const clause = value.split(/[+,;:(]/)[0].trim();
  if (clause.length === 0 || clause.length > max || /\b(reported|likely|unknown|available|wifi)\b/i.test(clause)) return null;
  return clause.toLowerCase();
}

/** Wi-Fi, in as few words as the evidence supports. */
function wifiPhrase(cafe: Cafe): string | null {
  const a = shortLabel(attr(cafe, "wifi"));
  if (a) return `${a} wifi`;
  if (has(cafe, "Fast WiFi")) return "fast wifi";
  if (cafe.scores.wifi !== null && cafe.scores.wifi >= 3.5) return "good wifi";
  return null;
}

function powerPhrase(cafe: Cafe): string | null {
  const a = shortLabel(attr(cafe, "charging"));
  if (a) return /ample|plenty|many|good/i.test(a) ? "plenty of plugs" : `${a} plugs`;
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
 * of the budget on the answer. With the " · Bombay Cafe Map" suffix the whole
 * title stays within ~60 characters. Branch names carry their location, so
 * chain branches stay distinguishable; the brand's "Coffee Roasters" suffix is
 * the first thing dropped, then the fact, and only then is the name trimmed.
 */
export function cafeTitle(cafe: Cafe): string {
  const fragment = answerFragment(cafe);
  const shortest = [wifiPhrase(cafe), powerPhrase(cafe), stayPhrase(cafe)]
    .filter((f): f is string => f !== null)
    .sort((a, b) => a.length - b.length)[0];

  const nameHasArea = cafe.name.toLowerCase().includes(cafe.neighborhood.toLowerCase());
  const names = [
    cafe.name,
    cafe.name.replace(/ Coffee Roasters/i, ""),
    cafe.name.replace(/ Coffee Roasters/i, "").replace(/ Cafe and Bar/i, " Cafe & Bar"),
  ];
  const seenNames = new Set<string>();
  for (const name of names) {
    if (seenNames.has(name)) continue;
    seenNames.add(name);
    const withArea = nameHasArea ? name : `${name}, ${cafe.neighborhood}`;
    const options = [
      `${withArea}: ${fragment}`,
      `${name}: ${fragment}`,
      `${withArea}: ${shortest ?? ""}`,
      `${name}: ${shortest ?? ""}`,
      withArea,
      name,
    ].filter((o) => !o.endsWith(": "));
    const fit = options.find((o) => o.length <= TITLE_BUDGET);
    if (fit) return fit;
  }

  // Name alone is too long: cut on a word boundary.
  const cut = cafe.name.slice(0, TITLE_BUDGET + 1);
  const space = cut.lastIndexOf(" ");
  return (space > 20 ? cut.slice(0, space) : cut.slice(0, TITLE_BUDGET)).replace(/[,\s-]+$/, "");
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

  // Only claim "scored" when it's actually scored — the same honesty rule
  // the site applies everywhere else (see llms.txt: unscored entries are
  // directory listings, not silently implied verdicts).
  const lead =
    facts.length > 0
      ? `${facts.slice(0, 4).join(", ")}.`
      : cafe.workability !== null
        ? `${cafe.neighborhood}, Mumbai. Scored on wifi, power, noise and seating.`
        : `${cafe.neighborhood}, Mumbai. Not yet scored — directory listing for now.`;

  const tail: string[] = [];
  if (stay) tail.push(stay.charAt(0).toUpperCase() + stay.slice(1));
  if (cost) tail.push(`${cost} a head`);
  if (cafe.workability !== null) {
    tail.push(`${cafe.workability.toFixed(1)}/5 workability, every finding cited`);
  }

  const out = [capitalise(lead), tail.length > 0 ? `${tail.join(". ")}.` : ""]
    .filter(Boolean)
    .join(" ");

  // The editorial line is what actually differentiates one cafe's snippet
  // from another's — two unrelated cafes can easily land on the same wifi/
  // power/noise/cost facts, but never on the same hand-written note. So it
  // always goes in, whole when it fits, trimmed to a word boundary when it
  // doesn't, and is dropped only when there's truly no room left.
  const room = DESCRIPTION_BUDGET - out.length - 1;
  if (room >= cafe.editorialNote.length) {
    return `${out} ${cafe.editorialNote}`;
  }
  if (room >= 20) {
    const slice = cafe.editorialNote.slice(0, room - 1);
    const lastSpace = slice.lastIndexOf(" ");
    const trimmed = lastSpace > 10 ? slice.slice(0, lastSpace) : slice;
    return `${out} ${trimmed.trimEnd()}…`;
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
