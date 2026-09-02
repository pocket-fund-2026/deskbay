# Full SEO + GEO Audit — bombaycafemap.com

**Date**: 2026-09-02
**Scope**: Technical SEO, on-page, schema, sitemap, performance, GEO/AI-search readiness, SXO.
**Context**: Site just migrated from `deskbay-blue.vercel.app` to `bombaycafemap.com` and
rebranded from "Deskbay" to "Bombay Cafe Map" earlier the same day.

## SEO Health Score: 88 / 100

| Category | Score | Weight |
|---|---|---|
| Technical SEO | 90 | 22% |
| Content Quality | 85 | 23% |
| On-Page SEO | 92 | 20% |
| Schema / Structured Data | 90 | 10% |
| Performance (CWV) | 78 | 10% |
| AI Search Readiness (GEO) | 90 | 10% |
| Images | 95 | 5% |

## Top findings, fixed this pass

1. **[Critical → Fixed]** `www.bombaycafemap.com` and legacy `deskbay-blue.vercel.app`
   both served live 200 content with no redirect to the canonical apex domain —
   a duplicate-content / split-authority risk introduced by the same-day domain
   migration. **Fix**: 308 permanent redirects set at the Vercel project level from
   both → `https://bombaycafemap.com`. Verified live.
2. **[Medium → Fixed]** No security headers set (`X-Content-Type-Options`,
   `X-Frame-Options`, `Referrer-Policy`, `Permissions-Policy` were all absent;
   only Vercel's default HSTS was present). This was suppressing the Lighthouse
   Best Practices score (77/100) and is baseline crawler-trust hygiene.
   **Fix**: added `headers()` in `next.config.ts`. Verified live via `curl -I`.
3. **[Info, resolved by earlier rebrand work]** All brand/domain references across
   17 files were already updated from Deskbay/old-domain to Bombay Cafe Map/new
   domain (title tags, JSON-LD, sitemap, robots, llms.txt) — confirmed no stale
   `deskbay-blue.vercel.app` or bare "Deskbay" strings remain in source except the
   `submissions@deskbay.app` mailto, which is a separate domain and intentionally
   left alone pending confirmation that mailbox is being changed.

## Remaining findings (not auto-applied — judgment calls, flagged for you)

### Performance — Score 78

- **LCP 3.7s** (target < 2.5s), Speed Index 4.1s, TBT 250ms, CLS 0 (good).
  Lighthouse mobile run via headless Chromium. Real Google CrUX field data
  wasn't available this pass (PageSpeed Insights API was rate-limited at audit
  time — 240 QPM cap hit, likely from other work on this account today; re-run
  `/seo google` once Search Console/PSI access is available for field data
  instead of lab-only numbers).
  - No obvious code-level cause found (no huge blocking JS/CSS, images already
    lean) — likely font loading (3 Google fonts: Fraunces, Inter, IBM Plex Mono)
    or cold serverless function response on the dynamic `/mumbai` route padding
    perceived load. Recommend re-testing after headers deploy settles and,
    if still slow, checking font `display` strategy and whether `/mumbai`'s
    dynamic rendering (`ƒ` in build output) could be made static/ISR since the
    cafe dataset doesn't change per-request.

### Content

- Only 2 blog posts exist; thin content risk is low today (per-cafe pages carry
  real cited detail per the `about` methodology), but blog cadence should pick
  up for the "AI Search Readiness" and topical-authority scores to keep climbing.
- Homepage `<h1>` (`app/page.tsx:107`) is strong on evidence/specificity but
  doesn't explicitly contain "Mumbai" in the heading text itself (it's implied
  by page context/title). Minor; not changed automatically since it's editorial
  copy — consider working "Mumbai" into the H1 directly next copy pass.

### Schema

- No `Review`/`ItemReviewed` or `ItemList` markup yet on cafe/listing pages —
  documented as an opportunity in `seo/schema.md`, not applied (requires
  confirming on-page copy qualifies as a genuine first-party review before
  adding `Review` schema, per Google's quality requirements).

### GEO / AI search readiness — Score 90

- Strong: `llms.txt` present and current, `robots.txt` allows all crawlers
  (no AI-bot-specific blocks), every cafe page carries cited, structured
  evidence (exactly what LLM answer engines prefer to cite).
- Gap: no `sameAs` / social proof signals on the `Organization` schema (none
  exist yet — don't fabricate, add when real profiles exist).

## Verification

- `curl -sI https://bombaycafemap.com` → security headers present.
- `curl -sI https://deskbay-blue.vercel.app` / `https://www.bombaycafemap.com`
  → both `308` to `https://bombaycafemap.com`.
- `npx lighthouse` (headless Chromium, mobile): Performance 83, Accessibility 100,
  Best Practices 77 (pre-fix; header fix expected to raise this — not re-measured
  post-deploy in this pass), SEO 100.
- Sitemap (`/sitemap.xml`) and robots.txt (`/robots.txt`) both resolve and are
  internally consistent with the live route list.

## Tooling notes

- Google PageSpeed Insights API was rate-limited during this audit
  (`PSI rate limit exceeded (240 QPM / 25,000 QPD)`) — Lighthouse was run locally
  via headless Chromium instead for lab metrics. Re-run `/seo google` later for
  real CrUX field data once available.
- No DataForSEO / Search Console / GA4 credentials connected in this session —
  keyword volume, live SERP position, and real organic-traffic figures were not
  available. `seo/keywords.md` is intent-based, not demand-validated; revisit
  once those are connected.
