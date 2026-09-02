# Meta Tags — Bombay Cafe Map

Canonical domain: `https://bombaycafemap.com` (set as `metadataBase` in `app/layout.tsx`,
so all relative `alternates.canonical` values below resolve against it).
`www.bombaycafemap.com` and the legacy `deskbay-blue.vercel.app` 308-redirect to this domain.

Title template (`app/layout.tsx`): `%s · Bombay Cafe Map` — child routes that set a bare
`title` string get this suffix automatically; routes that set a full custom title
(homepage, cafe pages, area pages) override it directly.

## Global defaults (`app/layout.tsx`)

- **Title**: `Bombay Cafe Map — find a Mumbai cafe you can actually work from`
- **Description**: `A map of Mumbai cafes scored on wifi, power outlets, noise and seating — starting in Bandra and South Bombay, expanding citywide — so you know which one will let you stay three hours.`
- **OG**: `siteName: "Bombay Cafe Map"`, `locale: en_IN`, `type: website`, image `/opengraph-image`
- **Twitter**: `summary_large_image`, title `Bombay Cafe Map`
- **Robots**: `index: true, follow: true`
- **Icon**: `/icon.svg`

## Per-route

| Route | Title | Description source |
|---|---|---|
| `/` | `Bombay Cafe Map — find a Mumbai cafe you can actually work from` | inline string, `app/page.tsx` |
| `/mumbai` (no area) | `Mumbai — cafes you can work from` | "Cafes across Mumbai ranked on wifi, power outlets, noise and seating. Find one you can actually work from." |
| `/mumbai?area={slug}` | `{Area name} — cafes you can work from` | `Every work-friendly cafe in {Area name}, Mumbai, ranked on wifi, power outlets, noise and seating.` |
| `/mumbai/[slug]` | `{Cafe name} — {neighborhood}, Mumbai` | `{editorialNote} Workability {score}/5 on wifi, power, quiet and seating, with every finding cited.` |
| `/about` | `About` → rendered `About · Bombay Cafe Map` | `How Bombay Cafe Map scores Mumbai cafes on wifi, power, noise and seating — the nine weighted factors, sourcing rules, and what we will not fake.` |
| `/submit` | `Submit a cafe` → `Submit a cafe · Bombay Cafe Map` | `Know a Mumbai cafe that belongs on Bombay Cafe Map? Tell us about it.` |
| `/blog` | `Blog` → `Blog · Bombay Cafe Map` | `Notes on Mumbai's cafe scene — best-of lists pulled from our own data, and what's actually new.` |
| `/blog/15-best-cafes-to-work-from-in-mumbai` | post title (from `lib/blog.ts`) | post description, `type: article` |
| `/blog/whats-new-in-mumbais-cafe-scene` | post title (from `lib/blog.ts`) | post description, `type: article` |

All routes above set `alternates.canonical` to their own path and duplicate title/description
into `openGraph` and `twitter` blocks (Twitter card = `summary_large_image`, shared OG image
`/opengraph-image` generated dynamically via `app/opengraph-image.tsx`).

## GEO-relevant text endpoints

- `/llms.txt` (`app/llms.txt/route.ts`) — plain-text summary of the site, scoring
  methodology, and every scored/unscored cafe with URL, for AI crawler citation.
  Revalidates hourly.
- `robots.txt` — `Allow: /` for all user agents (no AI-crawler-specific blocks),
  so GPTBot / ClaudeBot / PerplexityBot / Google-Extended are all permitted.
