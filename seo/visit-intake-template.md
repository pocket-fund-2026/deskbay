# Cafe visit intake: first-hand data for the top pages

Purpose: give the cafe pages that already get impressions something no other site has, a real visit. Nothing here may be estimated, copied from a review site, or invented. A cafe with no entry stays exactly as it is.

## Which cafes to visit first (top by Search Console impressions, last window)

Only cafes with an existing page. Impressions from the seo-dashboard `gsc_pages` table, 2026-10-15.

| # | Cafe (slug) | Impressions | Why it matters |
|---|---|---|---|
| 1 | cafe-mondegar-colaba | 382 | Most-seen cafe page; currently low score, a visit could confirm or correct it |
| 2 | leaping-windows-cafe-versova | 153 | Earns clicks (6) |
| 3 | boojee-cafe-perry-road | 135 | High impressions, 0 clicks |
| 4 | blue-tokai-coffee-roasters-andheri-east-andheri-east | 97 | Chain branch: branch-specific facts needed to justify its own page |
| 5 | blue-tokai-coffee-roasters-one-world-center-lower-parel-lower-parel | 93 | Same |
| 6 | chaayos-one-bkc-one-bkc | 88 | Merged duplicate now redirects here |
| 7 | cafe-military-fort | 83 | |
| 8 | bombay-island-coffee-company-vikhroli-vikhroli-east | 76 | |
| 9 | subko-coffee-mary-lodge-chapel-road | 66 | Earns clicks (6); evidence notes say wifi/power unverified |
| 10 | blue-tokai-nariman-point-nariman-point | 65 | Earns clicks (6) |

Group visits by neighbourhood (Colaba/Fort/Nariman Point together; Lower Parel; Versova/Andheri; Bandra) to save trips.

## What to capture at each visit

1. Photos you took yourself (3 to 5): entrance/exterior, the seats you would actually work at, a plug point in use, the counter/menu board. No people's faces. Save as `public/visits/<slug>-1.jpg` etc. Check you are allowed to photograph inside.
2. Wi-Fi speed test: run a speed test app at a work seat, note down/up Mbps, time of day, which seat. Ideally two tests an hour apart.
3. Plug points: count sockets reachable from seats; note where (wall, table, floor).
4. Seating: table sizes, number of seats you counted, whether laptop-height tables exist.
5. Time limit: any posted limit; what staff did when you stayed 2+ hours (only if you did).
6. Price of a basic coffee (the cheapest filter/americano/cappuccino on the menu), in INR.
7. Date visited and who visited.
8. Anything else you saw yourself (noise level at the time, crowd, power cuts). Say when.

## Where to put it

Edit `data/visits.json`. Copy the `example-template` entry, rename the key to the cafe slug, fill only fields you measured, delete the rest. Example:

```json
"cafe-mondegar-colaba": {
  "visitedOn": "2026-11-02",
  "visitedBy": "Dev",
  "wifiDownMbps": 18,
  "wifiUpMbps": 6,
  "wifiNote": "speedtest app, 4pm, window table",
  "plugPoints": 3,
  "plugNote": "two on the back wall, one under the corner table",
  "seatingNote": "about 30 seats, mostly small tables",
  "timeLimit": "none posted; stayed 2h, not asked to leave",
  "coffeePriceInr": 150,
  "photos": [{ "src": "/visits/cafe-mondegar-colaba-1.jpg", "alt": "Window tables from the entrance", "credit": "Dev" }]
}
```
(The numbers above are format examples only. Never copy them.)

Effect on the site: the page shows a "Visit notes" section with exactly those fields and becomes indexable and sitemap-listed. Pages without an entry are unchanged. After editing, run `npm run build`, then you deploy.

## Rules

- Only what you measured or saw. Leave a field out if you did not capture it.
- If a visit contradicts the existing score or evidence text in `data/cafes.json`, fix that text too and update `lastVerifiedAt` to the visit date.
- Reader-submitted notes (the review form) are never copied here without the reader's permission.
