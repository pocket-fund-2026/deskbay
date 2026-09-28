# Target Keywords — Bombay Cafe Map

Primary market: people looking for a Mumbai cafe to sit and work from (laptop-friendly,
wifi, power, quiet, seating). Local-directory intent, not transactional.

## Site-wide (defined in `app/layout.tsx` metadata.keywords)

- work friendly cafes Mumbai
- cafes with wifi Mumbai
- laptop friendly cafes Bandra
- cafes to work from South Bombay
- best cafes Bandra
- coworking cafes Mumbai

## Per-page primary keyword targets

| Route | Primary keyword | Secondary / supporting |
|---|---|---|
| `/` | Mumbai cafes to work from | wifi, power outlets, workability score |
| `/mumbai` | Mumbai cafes ranked by wifi/power/noise/seating | cafe map, filter by area |
| `/mumbai?area={slug}` (Bandra, South Bombay, etc.) | `[area]` cafes to work from | `[area]` laptop-friendly cafes |
| `/mumbai/[slug]` (per-cafe page) | `{cafe name}` `{neighborhood}` Mumbai | wifi/power/noise/seating for that cafe specifically |
| `/blog/15-best-cafes-to-work-from-in-mumbai` | best cafes to work from in Mumbai | top cafes for laptop work Mumbai |
| `/blog/whats-new-in-mumbais-cafe-scene` | new cafes Mumbai | Mumbai cafe scene updates |
| `/blog/best-cafes-to-work-from-in-bandra` | best cafes to work from in Bandra | laptop friendly cafes Bandra |
| `/blog/best-cafes-to-work-from-in-south-bombay` | best cafes to work from in South Bombay | cafes to work from Fort Colaba Ballard Estate |
| `/blog/best-cafes-to-work-from-in-eastern-suburbs` | best cafes to work from in Powai | cafes to work from Ghatkopar Chembur Mulund |
| `/blog/best-cafes-to-work-from-in-thane` | best cafes to work from in Thane | cafes to work from Ghodbunder Road |
| `/blog/best-cafes-to-work-from-in-andheri-juhu` | best cafes to work from in Andheri | cafes to work from Juhu Khar Versova Santacruz |
| `/about` | how Bombay Cafe Map scores cafes | workability methodology |
| `/submit` | submit a cafe Mumbai | add a cafe to directory |

## Notes for future content

- The site's real differentiator is the **cited, evidence-based workability score**
  (nine weighted factors) — this is the angle to lean into in title tags and content,
  since "best cafes in X" is a saturated SERP but "cafes scored/verified on wifi+power+noise"
  is a distinct, defensible angle.
- Area coverage as of 2026-09-28: Bandra, South Bombay, Eastern Suburbs, Thane and
  Andheri & Juhu each have a dedicated, scored blog post. Remaining gaps: BKC,
  Malad & Borivali, Central Mumbai, Navi Mumbai — add a post once each has enough
  scored cafes to rank a top 8 (the pattern in `app/blog/best-cafes-to-work-from-in-thane/page.tsx`
  is the template: pull `cafesByArea(slug)`, filter `workability !== null`, sort desc, slice 8).
- No keyword volume/competition data pulled yet (would need `/seo dataforseo` or
  `/seo google` with Search Console connected) — this list is intent-based, not
  volume-validated. Re-run `/seo cluster` or `/seo dataforseo` once GSC is connected
  for demand-validated keyword targets.
