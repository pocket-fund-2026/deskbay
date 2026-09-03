import { CAFES, type Cafe } from "@/lib/cafes";

/**
 * Curated lists over the cafe data.
 *
 * Every collection is a rule, not a hand-picked set: a cafe appears because
 * its own recorded attributes put it there, and `reason` quotes the specific
 * field that qualified it. That keeps these pages honest with the rest of the
 * site — the score pages cite their evidence, so the best-of lists have to as
 * well, or they're just opinion with a number stapled on.
 */
export type Collection = {
  slug: string;
  /** Short label for chips and nav. */
  name: string;
  /** Page heading. */
  title: string;
  /** The question a visitor is actually asking when they land here. */
  question: string;
  /** One or two sentences of framing, shown under the heading. */
  blurb: string;
  /** Search-facing description. */
  description: string;
  match: (c: Cafe) => boolean;
  /** Why this cafe is in this list, quoting its own data. */
  reason: (c: Cafe) => string | null;
  /** Cap the list; used where the ranking itself is the point. */
  limit?: number;
};

function attr(c: Cafe, k: string): string | null {
  const v = c.attrs?.[k];
  return typeof v === "string" ? v : null;
}

function labels(c: Cafe): Set<string> {
  return new Set([...(c.tags ?? []), ...(c.toggles ?? []).map((t) => t.toLowerCase())]);
}

const plugWords = /plug|socket|outlet|ample/i;

export const COLLECTIONS: Collection[] = [
  {
    slug: "best-for-first-timers",
    name: "First timers",
    title: "15 best Mumbai cafes for first timers",
    question: "I've never done this. Where do I go?",
    blurb:
      "The fifteen highest-scoring cafes on the map, ranked on the same nine weighted factors as everywhere else. If you have never worked out of a cafe in Mumbai and do not want your first attempt to be the one that puts you off, start at the top of this list.",
    description:
      "The 15 highest-scoring Mumbai cafes to work from, ranked on power, wifi, seating and whether they'll let you stay.",
    match: (c) => c.workability !== null,
    reason: (c) => (c.workability !== null ? `Scores ${c.workability.toFixed(1)} overall` : null),
    limit: 15,
  },
  {
    slug: "no-time-limit",
    name: "No time limit",
    title: "Mumbai cafes that won't rush you",
    question: "Can I stay three hours?",
    blurb:
      "The single thing most likely to ruin a working afternoon is not bad coffee — it is the second time a waiter asks whether you'd like anything else. These are the cafes recorded as tolerating a long sit.",
    description:
      "Mumbai cafes where you can work for hours without being moved along — long-stay tolerance, recorded per cafe.",
    match: (c) => attr(c, "stay") === "long" || labels(c).has("no time limit"),
    reason: (c) =>
      attr(c, "stay") === "long" ? "Recorded as tolerating a long stay" : "Listed as having no time limit",
  },
  {
    slug: "wifi-for-calls",
    name: "Wi-Fi for calls",
    title: "Mumbai cafes where the wifi holds for a call",
    question: "Can I take the 4pm call from here?",
    blurb:
      "A connection that loads a page is not the same as a connection that survives half an hour of video. These are the cafes whose wifi is recorded as fast rather than merely present.",
    description:
      "Mumbai cafes with wifi fast enough for video calls and uploads, scored from published evidence.",
    match: (c) =>
      (c.scores.wifi ?? 0) >= 3.5 || attr(c, "wifi") === "Fast" || labels(c).has("fast wifi"),
    reason: (c) =>
      c.scores.wifi !== null && c.scores.wifi >= 3.5
        ? `Wi-Fi scores ${c.scores.wifi.toFixed(1)}`
        : attr(c, "wifi") === "Fast"
          ? "Wi-Fi recorded as fast"
          : "Listed as having fast wifi",
  },
  {
    slug: "plug-points",
    name: "Plug points",
    title: "Mumbai cafes where you can actually plug in",
    question: "Will my laptop survive the afternoon?",
    blurb:
      "Power is the heaviest factor in the score, at 22 percent, because nothing else matters once the battery goes. These are the cafes with plug points recorded at the seats — not one behind the counter.",
    description:
      "Mumbai cafes with usable plug points at the tables, recorded per cafe rather than assumed.",
    match: (c) =>
      (c.scores.charging ?? 0) >= 3 || plugWords.test(attr(c, "charging") ?? "") || labels(c).has("outlets"),
    reason: (c) => {
      const recorded = attr(c, "charging");
      // Some cafes record a descriptive phrase ("Sockets at some seats"), others
      // a bare grade ("Good"), which says nothing standing on its own.
      if (recorded && plugWords.test(recorded)) return recorded;
      if (recorded) return `Power recorded as ${recorded.toLowerCase()}`;
      if (c.scores.charging !== null) return `Power scores ${c.scores.charging.toFixed(1)}`;
      return "Listed as having outlets";
    },
  },
  {
    slug: "quiet-enough-to-think",
    name: "Quiet",
    title: "Quiet Mumbai cafes you can think in",
    question: "Can I concentrate here?",
    blurb:
      "Mumbai is loud and most of its cafes have hard floors, open kitchens and a espresso grinder running through the morning. These are the ones recorded as quiet.",
    description: "The quietest Mumbai cafes to work from, for focused work and calls.",
    match: (c) => (c.scores.quiet ?? 0) >= 3.5 || attr(c, "noise") === "Quiet" || labels(c).has("quiet"),
    reason: (c) =>
      c.scores.quiet !== null && c.scores.quiet >= 3.5
        ? `Quiet scores ${c.scores.quiet.toFixed(1)}`
        : attr(c, "noise") === "Quiet"
          ? "Noise recorded as quiet"
          : "Listed as quiet",
  },
  {
    slug: "room-to-spread-out",
    name: "Room to spread out",
    title: "Mumbai cafes with room to spread out",
    question: "Is there a table I can actually work at?",
    blurb:
      "A laptop, a notebook, a coffee and a plate need more surface than a two-top by the door. These are the cafes recorded as having real table space.",
    description:
      "Mumbai cafes with large tables and enough room to work properly, not perched on a two-seater.",
    match: (c) =>
      labels(c).has("roomy") ||
      labels(c).has("large tables") ||
      ["Lots of room", "Plenty of tables"].includes(attr(c, "seating") ?? ""),
    reason: (c) => attr(c, "seating") ?? "Listed as roomy",
  },
  {
    slug: "under-500-a-session",
    name: "Under ₹500",
    title: "Mumbai cafes under ₹500 a session",
    question: "What does a working afternoon cost me?",
    blurb:
      "Working from cafes is a recurring cost, not a one-off. At five sessions a week the difference between a ₹300 cafe and a ₹900 one is roughly a rent payment a year. These are the cheaper end.",
    description:
      "Affordable Mumbai cafes to work from, with average food and drink cost recorded per cafe.",
    match: (c) => ["₹100–250", "₹250–500"].includes(attr(c, "avgFoodCost") ?? ""),
    reason: (c) => `Typically ${attr(c, "avgFoodCost")} a head`,
  },
  {
    slug: "for-the-coffee-itself",
    name: "For the coffee",
    title: "Mumbai cafes worth going to for the coffee itself",
    question: "Where is the coffee actually good?",
    blurb:
      "Everything else on this site scores a cafe as a workplace. This list does not. These are the roasters and specialty rooms where the coffee is the reason to go, whether or not you open a laptop.",
    description:
      "Mumbai's specialty coffee roasters and cafes, for when the coffee is the point rather than the desk.",
    match: (c) => {
      const l = labels(c);
      return l.has("specialty coffee") || l.has("roastery") || l.has("bakehouse");
    },
    reason: (c) => {
      const l = labels(c);
      return l.has("roastery") ? "Roasts its own" : l.has("bakehouse") ? "Bakehouse" : "Specialty coffee";
    },
  },
  {
    slug: "old-bombay-not-for-laptops",
    name: "Old Bombay",
    title: "Old Bombay cafes worth seeing — and not for laptops",
    question: "Which are the famous ones, and can I work there?",
    blurb:
      "The Irani cafes and institutions people mean when they say Bombay cafes. Most of them score badly as workplaces, and that is not a criticism — they were built to turn tables, not to host a laptop for three hours. Go for an hour, eat, and leave the laptop in the bag.",
    description:
      "Mumbai's Irani cafes, heritage rooms and institutions — worth visiting, honestly rated as places to work.",
    match: (c) => {
      const l = labels(c);
      return l.has("institution") || l.has("irani cafe") || l.has("parsi food");
    },
    reason: (c) => {
      const l = labels(c);
      return l.has("irani cafe")
        ? "Irani cafe"
        : l.has("parsi food")
          ? "Parsi food"
          : "Mumbai institution";
    },
  },
  {
    slug: "heritage-buildings",
    name: "Heritage buildings",
    title: "Mumbai cafes in heritage buildings you can work from",
    question: "Can I get the old Bombay room without the bad chair?",
    blurb:
      "The other half of the heritage answer. These are newer cafes that took over old rooms — stone arcades, mill buildings, Ranwar bungalows — and kept them workable. You get the building and a plug.",
    description:
      "Mumbai cafes inside heritage buildings that still work as places to sit and get things done.",
    match: (c) => labels(c).has("heritage building") && !(labels(c).has("institution") || labels(c).has("irani cafe")),
    reason: () => "Heritage building",
  },
];

export function getCollection(slug: string) {
  return COLLECTIONS.find((c) => c.slug === slug);
}

/** Members of a collection, best-scored first, capped at `limit` if set. */
export function collectionCafes(collection: Collection): Cafe[] {
  const matched = CAFES.filter(collection.match).sort(
    (a, b) => (b.workability ?? -1) - (a.workability ?? -1)
  );
  return collection.limit ? matched.slice(0, collection.limit) : matched;
}

export function collectionCount(collection: Collection): number {
  return collectionCafes(collection).length;
}
