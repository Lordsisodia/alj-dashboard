# Scraper Data Analysis — Instagram Reel Scraper (Apify)
_Date: 2026-04-06_

## Files Analysed
| File | Creator(s) | Niche |
|------|-----------|-------|
| `dataset_..._07-52-33-577.json` | `@minaxash` (Mina Ash) | GFE/Lifestyle |
| `dataset_..._08-08-07-406.json` | `@cuddlesweetbuns` (Emily), `@egirlasianemily` | E-Girl |
| `dataset_..._07-58-47-148.json` | `@a55tr1d` (astrid), `@kittygoofygirl`, `@tootinytrina` | Thirst Trap |

---

## Fields Available from Scraper

| Field | Convex mapping | Useful? |
|-------|---------------|---------|
| `displayUrl` | `thumbnailUrl` | ✅ YES — real CDN image, fixes blank cards |
| `caption` | `caption` | ✅ YES — hashtag extraction, content analysis |
| `ownerUsername` | `handle` | ✅ YES — creator identity |
| `ownerFullName` | `displayName` (added) | ✅ YES — display in UI |
| `url` (shortcode) | `externalId` | ✅ YES — dedup key |
| `likesCount` | `likes` | ✅ YES — primary engagement signal |
| `commentsCount` | `comments` | ✅ YES — secondary engagement |
| `timestamp` | `postedAt` | ✅ YES — recency sorting |
| `firstComment` | `firstComment` (added) | ✅ YES — sentiment signal, quality filter |

## Fields MISSING from Scraper (need different actor)

| Field | Why it matters | Solution |
|-------|---------------|---------|
| `viewsCount` | **Critical** — needed for `outlierRatio = views/followers` | Use Apify `instagram-post-scraper` actor (full post data) or `apify/instagram-profile-scraper` |
| `videoUrl` | Actual playback in cards | `instagram-reel-scraper` only returns thumbnail. Need `apify/instagram-post-scraper` for video URL |
| `savesCount` | Engagement depth signal | Not publicly available from Instagram API |
| `followerCount` | Needed for `outlierRatio` | Scrape profile separately — `apify/instagram-profile-scraper` returns `followersCount` |
| `reach` | Impressions-level signal | Not publicly available |

---

## Schema Changes Made
- `trackedAccounts.displayName` — added (ownerFullName from scraper)
- `scrapedPosts.firstComment` — added (sentiment/quality signal)
- `scrapedPosts.outlierRatio` — added (views ÷ followerCount, computed at insert)

## Files Created
- `convex/scraperImport.ts` — `importFromScraper` mutation, accepts Apify format
- `scripts/import-scraped-reels.mjs` — run to seed Convex from the 3 JSON files

## How to Run Import
```bash
cd apps/isso-dashboard
CONVEX_URL=https://YOUR_DEPLOYMENT.convex.cloud node scripts/import-scraped-reels.mjs
```

## Recommended Next Scrapers
1. **`apify/instagram-profile-scraper`** — get `followersCount` per account → enables `outlierRatio`
2. **`apify/instagram-post-scraper`** — get `videoUrl` + `viewsCount` from post shortcodes
3. Run profile scraper on the accounts we already have to backfill follower counts

## Niche Classification Logic
Auto-classifies from handle + hashtags:
- GFE → keywords: gfe, girlfriend, luxe, softgirl
- Fitness → fit, gym, workout, muscle
- Thirst Trap → thirst, trap, spicy
- E-Girl → egirl, alt, goth, kawaii
- Lifestyle → default fallback

Override with `nicheOverride` param when you know the niche from the scrape context.
