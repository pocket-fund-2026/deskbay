/**
 * Opening hours, from prose to something a machine can answer questions with.
 *
 * `openingHours` in data/cafes.json is written for a human ("Daily 7am–2:30pm,
 * 4pm–10:30pm", "Mon–Thu 7:30am–10pm · Fri–Sun 7:30am–9:30pm"), which is the
 * right thing to show on the page but useless for the two things people
 * actually search for: "is it open now" and a valid schema.org `openingHours`.
 * The string we were emitting into JSON-LD was free text, which Google ignores
 * — it wants "Mo-Th 07:30-22:00".
 *
 * So this parses the prose once and hands back both. Anything it can't parse
 * returns null rather than a guess: a wrong "open now" is worse than no
 * answer, in the same way an unscored cafe here says "not enough evidence"
 * instead of inventing a number.
 */

/** Minutes from midnight. `end` may exceed 1440 for places open past midnight. */
export type Interval = { start: number; end: number };

/** Indexed by `Date.getDay()` — 0 is Sunday. */
export type WeekHours = Interval[][];

const DAY_INDEX: Record<string, number> = {
  sun: 0,
  mon: 1,
  tue: 2,
  tues: 2,
  wed: 3,
  weds: 3,
  thu: 4,
  thur: 4,
  thurs: 4,
  fri: 5,
  sat: 6,
};

const SCHEMA_DAY = ["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"];
const DISPLAY_DAY = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

const DASH = "[–—−-]";
const TIME = "(?:\\d{1,2}(?::\\d{2})?\\s*(?:am|pm)?|midnight|noon)";
const RANGE_RE = new RegExp(`(${TIME})\\s*${DASH}\\s*(${TIME})`, "gi");

/** "7:30am" -> 450, "midnight" -> 1440, "12am" -> 0. */
function parseTime(raw: string, isEnd: boolean): number | null {
  const text = raw.trim().toLowerCase();
  if (text === "midnight") return isEnd ? 1440 : 0;
  if (text === "noon") return 720;

  const m = /^(\d{1,2})(?::(\d{2}))?\s*(am|pm)?$/.exec(text);
  if (!m) return null;

  let hour = Number(m[1]);
  const minute = m[2] ? Number(m[2]) : 0;
  const meridiem = m[3];
  if (hour > 24 || minute > 59) return null;

  if (meridiem === "am") {
    if (hour === 12) hour = 0;
  } else if (meridiem === "pm") {
    if (hour !== 12) hour += 12;
  } else if (hour === 24) {
    hour = 0;
  }

  const minutes = hour * 60 + minute;
  // "Tue–Sun 8am–12am" — a bare midnight as the closing time means the end of
  // the day, not the start of it.
  if (isEnd && minutes === 0) return 1440;
  return minutes;
}

/**
 * The day tokens ahead of the first time range: "mon–thu", "tue–wed, fri",
 * "daily". Returns null when the segment names no days, which the caller
 * reads as "every day".
 */
function parseDays(text: string): number[] | null {
  const t = text.toLowerCase();
  if (/\b(daily|every ?day|all week|7 days)\b/.test(t)) return [0, 1, 2, 3, 4, 5, 6];

  const days = new Set<number>();
  for (const part of t.split(",")) {
    const tokens = part.match(/[a-z]+/g) ?? [];
    const named = tokens
      .map((tok) => DAY_INDEX[tok.replace(/s$/, "")] ?? DAY_INDEX[tok])
      .filter((d): d is number => d !== undefined);

    if (named.length === 0) continue;

    // A dash between two day names is a span ("mon–thu"), wrapping across the
    // end of the week if it has to ("sat–sun" is fine, so is "fri–mon").
    if (named.length >= 2 && new RegExp(`[a-z]+\\s*${DASH}\\s*[a-z]+`).test(part)) {
      let d = named[0];
      for (let i = 0; i < 7; i++) {
        days.add(d);
        if (d === named[1]) break;
        d = (d + 1) % 7;
      }
    } else {
      for (const d of named) days.add(d);
    }
  }

  return days.size > 0 ? [...days] : null;
}

/**
 * Parse the human string into per-day intervals. Returns null if nothing in
 * it looked like opening hours at all.
 */
export function parseOpeningHours(text: string | null | undefined): WeekHours | null {
  if (!text) return null;

  const week: WeekHours = [[], [], [], [], [], [], []];
  let matched = false;

  for (const segment of text.split(/[·|;]/)) {
    RANGE_RE.lastIndex = 0;
    const firstRange = RANGE_RE.exec(segment);

    // "closed Mondays", "Sun closed" — no times, just days to leave empty.
    // Days default to closed anyway, so this only needs to not derail the
    // rest of the parse.
    if (!firstRange) {
      if (/closed/i.test(segment)) matched = true;
      continue;
    }

    const days = parseDays(segment.slice(0, firstRange.index)) ?? [0, 1, 2, 3, 4, 5, 6];

    RANGE_RE.lastIndex = 0;
    let m: RegExpExecArray | null;
    while ((m = RANGE_RE.exec(segment)) !== null) {
      const start = parseTime(m[1], false);
      let end = parseTime(m[2], true);
      if (start === null || end === null) continue;
      // "11am–1am" closes the following morning.
      if (end <= start) end += 1440;

      matched = true;
      for (const d of days) week[d].push({ start, end });
    }
  }

  if (!matched) return null;
  for (const day of week) day.sort((a, b) => a.start - b.start);
  return week;
}

/** The wall-clock day and minute in Mumbai, whatever timezone the reader is in. */
export function mumbaiNow(now: Date = new Date()): { day: number; minutes: number } {
  const parts = new Intl.DateTimeFormat("en-US", {
    timeZone: "Asia/Kolkata",
    weekday: "short",
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
  }).formatToParts(now);

  const get = (type: string) => parts.find((p) => p.type === type)?.value ?? "";
  const day = DISPLAY_DAY.indexOf(get("weekday"));
  const hour = Number(get("hour")) % 24;
  const minute = Number(get("minute"));

  return { day: day === -1 ? now.getDay() : day, minutes: hour * 60 + minute };
}

export type OpenState =
  | { state: "unknown" }
  | { state: "open"; closesAt: number; closingSoon: boolean }
  | { state: "closed"; opensAt: number | null; opensDay: number | null };

function fmt(minutes: number): string {
  const m = ((minutes % 1440) + 1440) % 1440;
  const hour = Math.floor(m / 60);
  const min = m % 60;
  const meridiem = hour < 12 ? "am" : "pm";
  const h12 = hour % 12 === 0 ? 12 : hour % 12;
  return min === 0 ? `${h12}${meridiem}` : `${h12}:${String(min).padStart(2, "0")}${meridiem}`;
}

/** Is it open right now, and what's the next boundary? */
export function openState(week: WeekHours | null, now: Date = new Date()): OpenState {
  if (!week) return { state: "unknown" };

  const { day, minutes } = mumbaiNow(now);

  // Today's own intervals, plus yesterday's that ran past midnight into now.
  const candidates: Interval[] = [
    ...week[day],
    ...week[(day + 6) % 7].map((i) => ({ start: i.start - 1440, end: i.end - 1440 })),
  ];

  for (const i of candidates) {
    if (minutes >= i.start && minutes < i.end) {
      return { state: "open", closesAt: i.end, closingSoon: i.end - minutes <= 60 };
    }
  }

  const laterToday = week[day].find((i) => i.start > minutes);
  if (laterToday) return { state: "closed", opensAt: laterToday.start, opensDay: day };

  for (let offset = 1; offset <= 7; offset++) {
    const d = (day + offset) % 7;
    if (week[d].length > 0) return { state: "closed", opensAt: week[d][0].start, opensDay: d };
  }

  return { state: "closed", opensAt: null, opensDay: null };
}

/** Short human label for a badge: "Open until 11pm", "Opens 8am Tue". */
export function openLabel(state: OpenState, now: Date = new Date()): string | null {
  if (state.state === "unknown") return null;
  if (state.state === "open") {
    return `Open until ${state.closesAt % 1440 === 0 ? "midnight" : fmt(state.closesAt)}`;
  }
  if (state.opensAt === null) return "Closed";

  const today = mumbaiNow(now).day;
  if (state.opensDay === today) return `Opens ${fmt(state.opensAt)}`;
  const tomorrow = (today + 1) % 7;
  if (state.opensDay === tomorrow) return `Opens ${fmt(state.opensAt)} tomorrow`;
  return `Opens ${fmt(state.opensAt)} ${DISPLAY_DAY[state.opensDay ?? today]}`;
}

export function isOpenNow(text: string | null | undefined, now: Date = new Date()): boolean | null {
  const state = openState(parseOpeningHours(text), now);
  return state.state === "unknown" ? null : state.state === "open";
}

/**
 * schema.org `openingHours`: one string per group of days that share the same
 * intervals, e.g. ["Mo-Th 07:30-22:00", "Fr-Su 07:30-21:30"].
 */
export function toSchemaOpeningHours(week: WeekHours | null): string[] | null {
  if (!week) return null;

  const pad = (m: number) => {
    const capped = Math.min(m, 1439); // schema.org has no 24:00
    return `${String(Math.floor(capped / 60)).padStart(2, "0")}:${String(capped % 60).padStart(2, "0")}`;
  };
  const key = (day: Interval[]) => day.map((i) => `${pad(i.start)}-${pad(i.end)}`).join(",");

  // Walk Monday-first so the common "Mo-Fr" grouping comes out contiguous.
  const order = [1, 2, 3, 4, 5, 6, 0];
  const out: string[] = [];
  let runStart: number | null = null;
  let runKey = "";

  const flush = (runEnd: number | null) => {
    if (runStart === null || runEnd === null || runKey === "") return;
    const label =
      runStart === runEnd ? SCHEMA_DAY[runStart] : `${SCHEMA_DAY[runStart]}-${SCHEMA_DAY[runEnd]}`;
    for (const span of runKey.split(",")) out.push(`${label} ${span}`);
  };

  let previous: number | null = null;
  for (const d of order) {
    const k = key(week[d]);
    if (k !== runKey) {
      flush(previous);
      runStart = k === "" ? null : d;
      runKey = k;
    }
    previous = d;
  }
  flush(previous);

  return out.length > 0 ? out : null;
}
