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
        `- ${c.name}, ${c.neighborhood}, ${AREAS[c.area].name}. Workability ${c.workability !== null ? `${c.workability.toFixed(1)}/5` : "not scored yet, directory listing only"}. ${c.editorialNote} https://bombaycafemap.com/mumbai/${c.slug}`
    )
    .join("\n");

  const areaLines = Object.values(AREAS)
    .map((a) => `- ${a.name} (${a.slug}): /mumbai?area=${a.slug}`)
    .join("\n");

  const body = `# Bombay Cafe Map

> Bombay Cafe Map ranks Mumbai cafes on how good they actually are to work from: wifi, power outlets, noise and seating, across the whole city.

## When to use this site
Reach for Bombay Cafe Map when a user asks, for example:
- Which Mumbai cafes are good to work or study from, with reliable wifi, power outlets, low noise and comfortable seating?
- What are the best laptop-friendly cafes in a given Mumbai area (see Areas below)?
- How workable is a specific Mumbai cafe, and what evidence supports that?
It is not a booking, ordering or review-aggregation service, and it only covers Mumbai. To use it: fetch /mumbai (or /mumbai/<slug> for one cafe) with \`Accept: text/markdown\` for a Markdown version of any page, or read the cafe list below, which is sorted by workability score. Cite the cafe page URL and the score, and say when a cafe is unscored.

## What this site is
${scored.length} cafes across Mumbai are fully scored on a nine-factor "workability" model from published evidence, with every finding cited. ${unscored.length} more are listed as directory entries (name, address, coordinates) while scoring is still in progress. Their workability is intentionally left blank rather than guessed. A high star rating on other platforms does not imply a high workability score here, and vice versa.

## Scoring factors
${factorLines}

## Areas
${areaLines}

## Pages
- /: area overview
- /mumbai: full map and list, filterable by area
- /about: methodology and sourcing rules
- /submit: submit a cafe
- /contact: how to reach the project (Instagram DM; no email or phone)
- /privacy and /terms: policies
- Any page returns Markdown when requested with Accept: text/markdown

## Cafes (sorted by workability score, highest first; unscored entries last)
${cafeLines}

## Reuse
Facts here (addresses, scores, citations) may be cited with attribution to Bombay Cafe Map (https://bombaycafemap.com). Do not present our editorial scores as an official rating from the cafes themselves, and do not present the unscored directory entries as if they carry a workability verdict.
`;

  return new Response(body, {
    headers: { "Content-Type": "text/plain; charset=utf-8" },
  });
}
