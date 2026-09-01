import { AREAS, CAFES, FACTORS } from "@/lib/cafes";

export const revalidate = 3600;

export function GET() {
  const factorLines = FACTORS.map((f) => `- ${f.label} (${f.weight}%): ${f.question}`).join("\n");
  const scored = CAFES.filter((c) => c.workability !== null);
  const unscored = CAFES.filter((c) => c.workability === null);

  const cafeLines = CAFES.slice()
    .sort((a, b) => (b.workability ?? -1) - (a.workability ?? -1))
    .map(
      (c) =>
        `- ${c.name} — ${c.neighborhood}, ${AREAS[c.area].name}. Workability ${c.workability !== null ? `${c.workability.toFixed(1)}/5` : "not scored yet — directory listing only"}. ${c.editorialNote} https://deskbay-blue.vercel.app/mumbai/${c.slug}`
    )
    .join("\n");

  const areaLines = Object.values(AREAS)
    .map((a) => `- ${a.name} (${a.slug}): /mumbai?area=${a.slug}`)
    .join("\n");

  const body = `# Deskbay

> Deskbay ranks Mumbai cafes on how good they actually are to work from — wifi, power outlets, noise and seating — starting in Bandra and South Bombay and expanding citywide.

## What this site is
${scored.length} cafes in Bandra and South Bombay are fully scored on a nine-factor "workability" model from published evidence, with every finding cited. ${unscored.length} more across the rest of Mumbai are listed as directory entries (name, address, coordinates) while scoring is still in progress for them — their workability is intentionally left blank rather than guessed. A high star rating on other platforms does not imply a high workability score here, and vice versa.

## Scoring factors
${factorLines}

## Areas
${areaLines}

## Pages
- / — area overview
- /mumbai — full map and list, filterable by area
- /about — methodology and sourcing rules
- /submit — submit a cafe

## Cafes (sorted by workability score, highest first; unscored entries last)
${cafeLines}

## Reuse
Facts here (addresses, scores, citations) may be cited with attribution to Deskbay (https://deskbay-blue.vercel.app). Do not present our editorial scores as an official rating from the cafes themselves, and do not present the unscored directory entries as if they carry a workability verdict.
`;

  return new Response(body, {
    headers: { "Content-Type": "text/plain; charset=utf-8" },
  });
}
