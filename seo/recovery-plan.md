# Recovery plan: bombaycafemap.com impressions drop (written 2026-10-15)

Working hypothesis: a scaled-content / thin-page quality demotion after the cafe count grew from 129 to 360 pages, most of them near-identical templates. Impressions fell about 98% in a week. This is a hypothesis; the manual checks below can rule out a manual action or hack first.

Nothing here is deployed. All changes are committed locally in this repo only.

## 1. What changed in the code

1. **No new cafe pages.** No cafes were added. Nothing was bulk-published.
2. **Stricter indexing rule** (`isIndexable` in `lib/cafes.ts`). A cafe page is indexable only if it has (a) at least 3 of 5 work factors recorded (wifi, power, noise, seating, stay length) AND (b) at least 2 evidence notes unique to that venue, not chain-wide sentences shared by several cafes; or (c) real first-hand visit data in `data/visits.json`. All other pages stay live and linked for visitors but get `robots: noindex, follow` and are dropped from `sitemap.xml`.
3. **Duplicates merged with permanent redirects** (`data/merged-slugs.json`, `next.config.ts`), removed from lists, map, sitemap:
   - `third-wave-coffee-mahavir-nagar-mahavir-nagar` -> `third-wave-coffee-kandivali-west` (same V-Souk unit)
   - `starbucks-taj-mahal-palace` -> `starbucks-colaba` (identical coordinates)
   - `chaayos-bkc-g-block` -> `chaayos-one-bkc-one-bkc` (70 m apart, same road)
   Next.js sends these as 308 permanent redirects, which Google treats like 301.
4. **H1 and titles.** The /mumbai, /mumbai?area=*, and /mumbai/near-me pages had an invisible (sr-only) H1; it is now a visible line in the header. Cafe page titles are rebuilt to fit about 60 characters including the brand suffix, drop hedged phrases like "reported, some inconsistency wifi", and keep the branch location for chains.
5. **More distinct cafe pages, from real data only:** a "Nearest cafes on the map" block (distances from recorded coordinates), the existing area comparison, hours, attributes, evidence. Third-party aggregate ratings were removed from the page's structured data (Google does not allow marking up ratings collected elsewhere). The text still shows the sourced public rating.
6. **No placeholder photos.** Pages without a real photo now say "Photo not yet available". Only the 5 cafes with real images in `data/cafes.json` show photos.
7. **Moderated reader notes.** The comment box is now "Submit for review": notes plus an optional visit date and an optional link to the reader's own photo are stored as `pending` and shown nowhere until approved on `/admin` (basic-auth protected). Photos are never auto-displayed. Existing comments stay visible. The DB columns are added automatically on first request (`lib/db.ts`).
8. **First-hand data mechanism.** `data/visits.json` + `lib/visits.ts`: any cafe with an entry gets a "Visit notes" section (speed test, plug count, seating, time limit, coffee price, your photos) and becomes indexable. See `seo/visit-intake-template.md`.
9. **Pages that earned clicks:** /collections/* now show list-derived facts (count, areas, average score), real FAQs computed from the list, and links to guides; /mumbai gets a "Shortlists" link block and a visible H1; the eight work-cafe guides share a Related reading block linking the WiFi, plug-points and no-time-limit lists and sibling guides; the WiFi post gets a data section from the site's own wifi list. Their `lastUpdated` is 2026-10-15 because content did change. The WiFi post is in `lib/blog.ts`, therefore in `sitemap.xml`, with lastmod 2026-10-15 (published 2026-10-14).

Counts are in the final report and in the "Verification" section at the bottom.

## 2. Manual steps for you (in order)

1. **Search Console > Security & Manual Actions > Manual actions**: confirm "No issues detected". **Security issues**: confirm none. If either has an entry, fix that before anything else.
2. After you deploy: **Sitemaps**: resubmit `https://bombaycafemap.com/sitemap.xml`. Check the submitted URL count dropped to the indexable set.
3. **URL Inspection > Request indexing** for `https://bombaycafemap.com/blog/best-cafes-with-wifi-in-mumbai` (and /mumbai, /collections/plug-points, /collections/wifi-for-calls, /collections/no-time-limit). Inspect the live URL first and check "Indexing allowed: Yes".
4. Do not use the Removals tool for the noindexed pages; let Google recrawl them.
5. Do the visits in `seo/visit-intake-template.md` (top 10 cafes by impressions). Data first, then rebuild and deploy.
6. Approve or reject reader notes on `/admin` weekly.
7. Check email at submissions@bombaycafemap.com actually receives mail (open item from the September audit).

## 3. Weekly re-tracking (every Monday, same 15 minutes)

- GSC Performance, last 7 days vs previous 7: total impressions, clicks, average position. Filter pages `/mumbai/`, `/collections/`, `/blog/`.
- GSC Pages report: count of "Indexed" vs "Crawled, currently not indexed" vs "Excluded by noindex". Expect noindex to rise by the number of demoted cafes and "Crawled, not indexed" to fall.
- The seo-dashboard crawl: thin-content count, missing H1 (target 0), long titles (target 0).
- Query check on 5 fixed queries (e.g. "cafes to work from in mumbai", "cafes with wifi in mumbai", "cafes with plug points mumbai", "work friendly cafes bandra", "bombay cafe map"): position and whether the site appears.
- Log each week in `seo/audits/` or the dashboard /changes log. Expect no improvement for 2 to 6 weeks after deploy; quality demotions generally lift only after Google recrawls and reassesses. Do not make more sitewide changes during that window.

## 4. Publishing cadence

1 to 2 strong posts a week at most, and only when there is data behind them. No bulk publishing, no new cafe pages without a visit or sourced evidence. A post should only go live if it contains something a competitor cannot copy from a listing site.

Post ideas, each resting on data you can collect:
1. "We speed-tested wifi at 10 Mumbai work cafes" (speed test at a work seat, two times of day).
2. "How many plug points do Mumbai work cafes really have?" (counted sockets at the cafes you visit).
3. "What a working afternoon costs in Mumbai cafes" (price of a coffee plus cheapest food item, from receipts/menus you photograph).
4. "Which Mumbai cafes let you stay 3 hours: what happened when we did" (stay-length log with date, time and staff reaction).
5. "Weekday vs weekend wifi at the same cafe" (repeat visits, measured).
6. "Mumbai monsoon work cafes: which have power and a dry table" (visit during rain; only if you go).
7. "Noise levels at 8 cafes, measured with a phone decibel app at 11am and 4pm" (state the app and method).
8. "Reader-reported changes this month" (only from approved notes; names withheld unless permitted).

## 5. External mentions: where an honest pitch might fit

Do not automate any of this and do not post or message on anyone's behalf. Each angle must be true when sent. Read each community's rules first; many ban self-promotion, in which case contribute useful answers without links, or ask a mod.

| Where | Angle |
|---|---|
| Reddit r/mumbai | When a thread asks "where can I work from a cafe", answer with your own firsthand findings and, only if the rules allow, mention the map once. Better: post a standalone data thread ("I speed-tested wifi at 10 cafes") after you have done idea 1. |
| Reddit r/bandra, r/IndianStartups, r/developersIndia, r/digitalnomad (Mumbai threads) | Same: useful measured data first, link second, disclose you run the site. |
| Mumbai city blogs and newsletters (e.g. Mumbai-focused food and city writers, LBB-style roundups, Scroll-type city newsletters) | Offer a fact they can verify: a table of measured wifi/plug counts for cafes in their neighbourhood. Offer to correct anything wrong in their existing lists. |
| Local press (city supplements of major dailies, business pages) | Story angle: "remote work moved into cafes: what the cafes allow". Needs the measured data from the post ideas to be credible. |
| Remote-worker and freelancer communities (Slack/Discord/LinkedIn groups in Mumbai, coworking community newsletters) | Share the measured wifi results as a resource, with the method. |
| Cafe owners themselves | Tell them what the page says about their cafe and invite corrections or a photo with permission; a cafe linking to its own page is a natural, legitimate link. |
| Google Business Profile / Maps local guides communities | Do not seed fake reviews. If you visit, you may review honestly as yourself on Maps; do not link the site in reviews. |
| Wikipedia / Wikivoyage Mumbai pages | Only add the site if it genuinely meets their sourcing rules; usually not, so skip unless asked. |

Never: buy links, swap links at scale, comment spam, review exchanges, or fake accounts.

## 6. Verification (this machine, 2026-10-15)

See the final report for the build command and result; results below were produced from the built output.
