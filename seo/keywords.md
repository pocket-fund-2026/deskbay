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
| `/about` | how Bombay Cafe Map scores cafes | workability methodology |
| `/submit` | submit a cafe Mumbai | add a cafe to directory |

## Notes for future content

- The site's real differentiator is the **cited, evidence-based workability score**
  (nine weighted factors) — this is the angle to lean into in title tags and content,
  since "best cafes in X" is a saturated SERP but "cafes scored/verified on wifi+power+noise"
  is a distinct, defensible angle.
- Area coverage today: Bandra, South Bombay (scored); other Mumbai areas are
  directory-only (unscored). As more areas get fully scored, add area-specific
  landing copy and target `[area] cafes to work from` more directly per area.
- No keyword volume/competition data pulled yet (would need `/seo dataforseo` or
  `/seo google` with Search Console connected) — this list is intent-based, not
  volume-validated. Re-run `/seo cluster` or `/seo dataforseo` once GSC is connected
  for demand-validated keyword targets.
