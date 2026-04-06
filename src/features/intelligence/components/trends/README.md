# Intelligence → Trends Tab

The Trends pill is the first tab inside the Intelligence product (`/isso/intelligence`). It surfaces viral signal data from all tracked creator accounts — what content formats are winning, which niches are performing, which hooks drive the most engagement, and which posts are massively outperforming their baseline (outliers).

It is modelled on Foreplay.co's intelligence layer, rebranded for OFM (OnlyFans Management) agencies as ISSO.

---

## Stack

- Next.js 14 App Router, TypeScript, Tailwind CSS
- Framer Motion for animations
- Convex (real-time database + serverless queries)
- Data source: `scrapedPosts` table, populated by the scraper via `scraperImport.ts`

---

## Component Tree

```
TrendsView                         ← root, owns Convex query
├── StatsBar                       ← 5 stat tiles
├── OutlierFeed                    ← horizontal scroll feed of viral outliers
│   └── OutlierCard × N           ← single outlier card
├── FormatChart                    ← bar chart: format performance
├── NicheLeaderboard               ← ranked niche list by avg ER
└── HooksTable                     ← top hooks table with "Turn into Brief"
```

PatternInsights (cross-account pattern detection) is built but awaiting Convex codegen — it queries `api.intelligence.getPatterns` which needs `npx convex dev` to regenerate types before it can be re-added to TrendsView.

---

## Files

| File | Lines | Purpose |
|---|---|---|
| `TrendsView.tsx` | 46 | Root component — owns `getTrends` Convex query, passes data to children |
| `StatsBar.tsx` | 61 | 5-tile stat bar (posts, avg ER, top format, top niche, outliers detected) |
| `OutlierFeed.tsx` | 77 | Horizontal scroll row — threshold + source filters, empty state |
| `OutlierCard.tsx` | 120 | Single outlier post card with hover "Turn into Brief" CTA |
| `FormatChart.tsx` | 77 | Animated bar chart — format performance by ER or views |
| `NicheLeaderboard.tsx` | 76 | Ranked niche list with animated bars |
| `HooksTable.tsx` | 68 | Top-performing hooks table with per-row "Turn into Brief" |
| `PatternInsights.tsx` | 73 | Cross-account hashtag cluster detection (pending codegen) |
| `PatternCard.tsx` | 108 | Single pattern cluster card with expand/collapse |
| `AIChatPanel.tsx` | 107 | AI chat side panel (stub — real Claude API wiring pending) |

---

## Convex Queries

### `getTrends` (intelligence.ts)

```typescript
Args: { days?, niche?, platform? }
Returns: {
  totalPosts, avgER,
  formatStats: FormatStat[],
  nicheStats: NicheStat[],
  topHooks: HookRow[],
  outlierPosts: OutlierPost[]   ← added by us
}
```

- Filters out seed data (`externalId.startsWith('seed_')`)
- Filters by date window, niche, platform
- Computes outlier posts: sorted by `outlierRatio` (views / followerCount), falls back to ER proxy if ratio unavailable

### `getPatterns` (intelligence.ts) — pending codegen

```typescript
Args: { days?, niche? }
Returns: PatternCluster[]
```

- Groups posts by recurring hashtags (≥ 2 posts sharing a tag)
- Computes avgER per cluster vs global baseline
- Returns top 6 clusters sorted by multiplier (avgER / baselineER)

---

## Data Flow

```
User selects filters (niche, platform, days, metric)
  → IntelligenceFeaturePage state
  → TrendsView props
  → getTrends Convex query args
  → Convex filters scrapedPosts server-side
  → Returns TrendsData
  → Distributed to child components as props
```

**Filter wiring:**
- **Niche / Platform** — `ContentPageShell → onFilterSelect → IntelligenceFeaturePage.handleFilterSelect → niche/platform state → TrendsView → getTrends`
- **Time range (7d/30d/90d)** — `TimePill → days state → TrendsView → getTrends`
- **Metric (ER/Views)** — `MetricPill → metric state → TrendsView → FormatChart`

---

## Seed Data

The `seedIntelligenceFeed` mutation populates 8 tracked accounts and 16 posts for development. All seed posts use `externalId: seed_*` prefix. All Convex queries filter these out automatically — real scraped posts use the Instagram shortcode as `externalId` (no prefix), so they pass through all filters. Seed data can be wiped with `clearSeedData` mutation.

---

## What's Functional

- ✅ StatsBar — live Convex data
- ✅ OutlierFeed — threshold (1×/2×/5×/10×) + source (All/Competitors/Own) filters, client-side
- ✅ FormatChart — ER or Views metric toggle
- ✅ NicheLeaderboard — ranked by avg ER
- ✅ HooksTable — "Turn into Brief" routes to `/isso/ideas` with pre-filled params
- ✅ Niche filter — wired through ContentPageShell → getTrends server-side
- ✅ Platform filter — wired through ContentPageShell → getTrends server-side
- ✅ Time range — 7d/30d/90d wired to getTrends
- ⏳ PatternInsights — built, awaiting `npx convex dev` codegen
- ⏳ AIChatPanel — UI built, Claude API wiring pending

---

## Feature Pipeline

### High Priority

1. **Re-enable PatternInsights** — run `npx convex dev` to regenerate types, remove `as any` cast, add back to TrendsView
2. **Wire AIChatPanel to Claude API** — pass TrendsData as system context, stream responses
3. **OWN_HANDLES dynamic lookup** — OutlierFeed hardcodes own handles; should query `trackedAccounts` where `isOwn: true`

### Medium Priority

4. **Trending audio tracker** — scrape audio track usage across posts, compute velocity (24h vs 7d avg), surface as a new section
5. **Saved search + alert** — save a niche/keyword query and get notified when new matching posts appear
6. **Outlier velocity** — show rate of change (ER 2h after post vs 24h) not just static outlierRatio
7. **"Inspired by" attribution** — when a Brief is generated from a hook, track it back to the source post

### Phase 2

8. **Real-time updates** — Convex subscriptions already support live updates; no polling needed
9. **Per-niche benchmark baselines** — current outlierRatio uses views/followerCount globally; per-niche baselines would be more accurate
10. **Mobile responsive** — all Trends components are desktop-first; needs responsive passes
11. **Export** — CSV export of top hooks + outliers for reporting
