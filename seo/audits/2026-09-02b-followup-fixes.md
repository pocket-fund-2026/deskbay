# Follow-up fixes — bombaycafemap.com

**Date**: 2026-09-02 (same day, second pass)
**Scope**: Closing out the four items flagged as "not auto-changed" in
`2026-09-02-full-audit.md`, plus adding Google Search Console verification.

## Fixed

1. **LCP / image optimization** — the homepage area-card images (`app/page.tsx`)
   were rendered with Next.js `<Image unoptimized>`, bypassing Vercel's image
   optimizer (no resizing, no WebP/AVIF, full-size file served regardless of
   viewport). Removed `unoptimized` and added `priority` on the first card
   (likely LCP element); added `www.subko.coffee` to `next.config.ts`
   `images.remotePatterns` since that host needed to be optimizer-allowlisted.
   Verified live: the image now serves via `/_next/image?...` with a responsive
   `srcSet` (200 OK).

   Deliberately **not** extended to the "landmarks" section images or per-cafe
   detail-page images further down `app/page.tsx` / `/mumbai/[slug]` — those
   pull from a wider set of third-party hosts (TripAdvisor, Wanderlog, magicpin,
   yappe, district.in) that were not investigated for hotlink-optimization
   reliability or reuse terms. Allowlisting all of them for Next's image proxy
   is a bigger decision than the flagged LCP item and risks broken images if
   any of those hosts block hotlinking through Vercel's optimizer — left for a
   deliberate follow-up rather than bundled into this fix.

   **Result**: a local Lighthouse re-run (headless Chromium, mobile) still
   showed LCP ~3.8s post-fix, i.e. no measurable change in this synthetic test.
   The image fix is real and verified independently (smaller optimized bytes,
   proper `srcSet`), but it may not be the actual LCP bottleneck, or the lab
   test isn't sensitive to it (cold Vercel image-optimizer cache on first
   request, etc.). **Recommend re-testing with real CrUX field data** (`/seo
   google`) once available, and profiling with Chrome DevTools' Performance
   panel against the live URL to identify the actual LCP element and its
   critical-path resource before spending more effort here.

2. **Homepage `<h1>` keyword** — added "Mumbai" explicitly to the H1 copy in
   `app/page.tsx` (was implied by page context only). Low-risk copy edit,
   verified live.

3. **`Review` schema on cafe pages** — added to `app/mumbai/[slug]/page.tsx`,
   scoped to cafes with a non-null `workability` score only (i.e. genuinely
   reviewed, not directory-only listings). Uses the existing on-page
   `editorialNote` as `reviewBody` and the workability score as `reviewRating`
   — no fabricated content. See `seo/schema.md` for the full shape. Verified
   live on a sample cafe page.

4. **`submissions@deskbay.app` → `submissions@bombaycafemap.com`** — updated
   in `app/submit/SubmitForm.tsx`. **Caveat carried over from the first audit**:
   this assumes the `bombaycafemap.com` mailbox is receiving mail. If it isn't
   set up yet, cafe submissions sent through this form will bounce — verify
   mail delivery on the new domain (or set up forwarding) before relying on
   this in production.

## Also added (user request, not from the audit)

- **Google Search Console verification** meta tag
  (`google-site-verification=uKGJoLyvBJdHaTySPXTeOr5SqxC9CCnpWwbu28p3G2Y`)
  added to `app/layout.tsx` `metadata.verification.google`. Verified present
  in the rendered `<head>` on the live site — ready to verify ownership in
  Search Console.

## Verification performed

- `npm run build` clean (TypeScript passed).
- `vercel --prod` deploy succeeded.
- `curl` checks: GSC meta tag present, H1 text includes "Mumbai", `Review`
  JSON-LD present on a scored cafe page, no `deskbay.app` strings remain in
  `.next/static/chunks/`, optimized image endpoint returns 200 with a
  responsive `srcSet`.
