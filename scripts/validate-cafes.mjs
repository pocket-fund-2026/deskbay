// Runs before every build (see package.json "prebuild"). This is the site's
// only guard against a bad merge into data/cafes.json reaching production —
// several past additions have needed catching (out-of-range coordinates,
// duplicate slugs, a citation that turned out to name a different cafe).
// None of that is a type error TypeScript would catch, since the JSON is
// untyped until `lib/cafes.ts` casts it — so this checks the actual values.
import { readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";

const __dirname = dirname(fileURLToPath(import.meta.url));
const dataPath = join(__dirname, "..", "data", "cafes.json");

const AREAS = new Set([
  "bandra",
  "south-bombay",
  "andheri-juhu",
  "malad-borivali",
  "central-mumbai",
  "eastern-suburbs",
  "bkc",
  "thane",
  "navi-mumbai",
]);

const REQUIRED_FIELDS = [
  "slug",
  "name",
  "area",
  "neighborhood",
  "address",
  "latitude",
  "longitude",
  "website",
  "instagram",
  "googleMapsUrl",
  "openingHours",
  "editorialNote",
  "whyWeRecommend",
  "scores",
  "attrs",
  "evidence",
  "toggles",
  "tags",
  "sources",
  "lastVerifiedAt",
  "publicRating",
  "synthesis",
  "workability",
  "images",
  "menuUrl",
];

const SCORE_KEYS = ["wifi", "charging", "quiet", "seating", "work"];

// Mumbai Metropolitan Region, generously padded — catches a swapped lat/lng
// or a stray digit, not a precise geofence.
const LAT_RANGE = [18.5, 19.5];
const LNG_RANGE = [72.5, 73.3];

const errors = [];
const slugSeen = new Map();

let raw;
try {
  raw = JSON.parse(readFileSync(dataPath, "utf8"));
} catch (e) {
  console.error(`validate-cafes: could not parse ${dataPath}: ${e.message}`);
  process.exit(1);
}

const spots = raw.spots;
if (!Array.isArray(spots) || spots.length === 0) {
  console.error("validate-cafes: data.spots is missing or empty");
  process.exit(1);
}

for (const [i, c] of spots.entries()) {
  const label = c?.slug || `spots[${i}]`;

  for (const field of REQUIRED_FIELDS) {
    if (!(field in c)) errors.push(`${label}: missing field "${field}"`);
  }

  if (typeof c.slug !== "string" || !c.slug) {
    errors.push(`spots[${i}]: missing or invalid slug`);
  } else {
    const count = (slugSeen.get(c.slug) ?? 0) + 1;
    slugSeen.set(c.slug, count);
    if (count > 1) errors.push(`${label}: duplicate slug (appears ${count}x)`);
  }

  if (!AREAS.has(c.area)) {
    errors.push(`${label}: area "${c.area}" is not a known AREAS slug`);
  }

  const lat = c.latitude;
  const lng = c.longitude;
  if (typeof lat !== "number" || Number.isNaN(lat) || lat < LAT_RANGE[0] || lat > LAT_RANGE[1]) {
    errors.push(`${label}: latitude ${lat} is missing or outside the Mumbai region`);
  }
  if (typeof lng !== "number" || Number.isNaN(lng) || lng < LNG_RANGE[0] || lng > LNG_RANGE[1]) {
    errors.push(`${label}: longitude ${lng} is missing or outside the Mumbai region`);
  }

  for (const key of SCORE_KEYS) {
    const v = c.scores?.[key];
    if (v !== null && (typeof v !== "number" || Number.isNaN(v) || v < 0 || v > 5)) {
      errors.push(`${label}: scores.${key} = ${v} is not null or a 0-5 number`);
    }
  }

  if (!Array.isArray(c.sources)) {
    errors.push(`${label}: sources must be an array`);
  }

  if (!Array.isArray(c.images)) {
    errors.push(`${label}: images must be an array`);
  }
}

if (errors.length > 0) {
  console.error(`validate-cafes: ${errors.length} issue(s) found in data/cafes.json:\n`);
  for (const e of errors) console.error(`  - ${e}`);
  console.error("\nFix these before building — a bad entry here is what breaks the map at runtime.");
  process.exit(1);
}

console.log(`validate-cafes: ${spots.length} cafes OK`);
