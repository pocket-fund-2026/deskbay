import { CAFES, FACTORS } from "@/lib/cafes";

export const revalidate = 3600;

export function GET() {
  const factorLines = FACTORS.map((f) => `- ${f.label} (${f.weight}%): ${f.question}`).join("\n");
  const cafeLines = CAFES.slice()
    .sort((a, b) => (b.workability ?? -1) - (a.workability ?? -1))
    .map(
      (c) =>
        `- ${c.name} — ${c.neighborhood}, ${c.area === "bandra" ? "Bandra" : "South Bombay"}. Workability ${c.workability !== null ? `${c.workability.toFixed(1)}/5` : "not enough evidence to score"}. ${c.editorialNote}`
    )
    .join("\n");

  const body = `# Deskbay

> Deskbay ranks Mumbai cafes on how good they actually are to work from — wifi, power outlets, noise and seating — across Bandra and South Bombay.

## What this site is
A curated, cited directory of ${CAFES.length} Mumbai cafes scored on a nine-factor "workability" model, not a general restaurant rating. A high star rating on other platforms does not imply a high workability score here, and vice versa.

## Scoring factors
${factorLines}

## Pages
- / — area overview (Bandra, South Bombay)
- /mumbai — full map and list, filterable by area
- /about — methodology and sourcing rules
- /submit — submit a cafe

## Cafes (sorted by workability score, highest first)
${cafeLines}

## Reuse
Facts here (addresses, scores, citations) may be cited with attribution to Deskbay (https://deskbay-blue.vercel.app). Do not present our editorial scores as an official rating from the cafes themselves.
`;

  return new Response(body, {
    headers: { "Content-Type": "text/plain; charset=utf-8" },
  });
}
