# Intelligence Feature

**Purpose:** Research + competitive intelligence layer in the Recon -> Intelligence -> Hub pipeline. Surfaces trending content, engagement patterns, and team insights from tracked competitor accounts.

**Stack:** Next.js 16, TypeScript, Convex (backend), Framer Motion (animations), Tailwind CSS, Recharts (visualizations)

---

## 1. Overview

Intelligence sits between **Recon** (raw scraping) and **Hub** (human interaction). It transforms scraped posts into:
- **Trends:** Format/niche breakdowns, top hooks, viral outliers
- **Analysis:** Cross-account pattern clustering, anomaly detection
- **Insights:** Team swipe-ratings aggregated into preference data + top performers

The feature page uses numbered tabs (① ② ③) to enforce a sequential workflow: analyze trends → identify patterns → learn from team feedback.

---

## 2. Pills (3 Primary Views)

### ① Trends
**What it shows:** Real-time engagement metrics and content patterns across tracked accounts.

**Components:**
- `StatsBar` — Header metrics (total posts, avg engagement rate)
- `OutlierFeed` — Feed of posts 2x+ baseline engagement (viral signals)
- `FormatChart` — Bar chart: content type (reel/post/carousel) vs. avg ER or views
- `NicheLeaderboard` — Table: niches ranked by avg ER, saves, view count
- `HooksTable` — Top 15 first-line hooks by engagement (sortable)

**Props:**
```typescript
TrendsView({ days: 7 | 14 | 30, metric: 'er' | 'views', niche?: string, platform?: string })
```

**Data flow:**
1. User selects time window (7/14/30 days) and metric (ER or views) in filter pills
2. `api.intelligence.getTrends` query filters posts by date + niche + platform
3. Computes format stats, niche stats, top hooks, outlier posts
4. Components render aggregations with Recharts for charts

---

### ② Analysis
**What it shows:** Deeper pattern discovery—what content themes are outperforming baseline?

**Components:**
- `OutlierFeed` — Same viral feed as Trends (reused)
- `PatternInsights` — AI-detected clusters (hashtag or niche+format based)
  - `PatternCard` — Expandable card per theme, shows multiplier vs. baseline, 3 example posts
  - `AIChatPanel` — Conversational drill-down on pattern (AI-powered, future)

**Props:**
```typescript
AnalysisView({ days: 7 | 14 | 30, niche?: string })
```

**Data flow:**
1. `api.intelligence.getPatterns` groups posts by hashtag (or niche+format fallback)
2. Calculates multiplier = (cluster avg ER) / (global avg ER)
3. Clusters with multiplier > 1 surface top-performing themes
4. Click theme → expand to see all 3 example posts + AI analysis button

---

### ③ Insights
**What it shows:** Team feedback loop—which content styles does your team prefer?

**Components:**
- `RatingSummaryBar` — KPI cards (total ratings, up %, down %, saves %, top rater)
- `LearningSignal` — Banner: "Team prefers {niche} reels over {niche} posts"
- `NichePreferenceChart` — Bar chart: niche up-rate vs. save-rate
- `FormatPreferenceChart` — Bar chart: format (reel/post/carousel) preferences
- `WinningHooks` — Top 3 hooks by team rating with preview
- `TopRatedPosts` — 12-post grid, sorted by score (up + save×2)
- `RaterActivity` — Leaderboard: per-team-member rating count + quality

**Props:**
```typescript
InsightsView() // no args, fetches all swipe ratings
```

**Data flow:**
1. `api.insights.getInsights` aggregates all `swipeRatings` records
2. Joins with `scrapedPosts` to build preference data
3. Computes scores: up × 1 + save × 2 (saves weighted higher)
4. Auto-seeds with demo ratings if `totalRatings === 0` (via `api.insightsSeed.seedSwipeRatings`)
5. All preference data sorted by signal strength, ranked

---

## 3. Component Map

| Component | Pill | Purpose | Lines |
|-----------|------|---------|-------|
| **IntelligenceFeaturePage** | Root | Page shell, tab routing, filter state | 82 |
| **IntelligenceControls** | Root | Time pill (7/14/30), metric pill (ER/views), filter categories | 45 |
| TrendsView | ① | Main trends layout (stats + outliers + charts) | 46 |
| AnalysisView | ② | Pattern insights layout (outliers + clusters) | 30 |
| InsightsView | ③ | Insights layout (summary + preferences + top posts) | 85 |
| **Trends Components** |
| StatsBar | ① | Header: total posts, avg ER, header spacing | 61 |
| OutlierFeed | ①② | Grid/feed of viral posts (outlierRatio > threshold) | 77 |
| OutlierCard | ①② | Single post card in outlier feed | 75 |
| FormatChart | ① | Recharts bar chart: format breakdown | 77 |
| NicheLeaderboard | ① | Table: niches ranked by metrics | 76 |
| HooksTable | ① | Scrollable table: top hooks with post details | 68 |
| PatternCard | ② | Expandable cluster card with 3 posts | 108 |
| PatternInsights | ② | Container: loads patterns, renders cards | 73 |
| AIChatPanel | ② | Collapsible AI chat for pattern drill-down | 107 |
| **Insights Components** |
| RatingSummaryBar | ③ | KPI cards in grid layout | 84 |
| LearningSignal | ③ | Insight banner (AI-generated message) | 89 |
| PreferenceChart | ③ | Recharts: niche + format preferences | 99 |
| WinningHooks | ③ | Top 3 hooks by rating (with preview) | 68 |
| TopRatedPosts | ③ | 12-post grid by score | 43 |
| RatedCard | ③ | Single rated post card | 84 |
| RaterActivity | ③ | Leaderboard: rater stats | 84 |
| BarRow | ③ | Utility: single bar in preference chart | 52 |
| **Feed / Drawer** |
| FeedView | Global | Community feed (not a pill, separate view) | 69 |
| PostListItem | Global | List layout for feed posts | 87 |
| PostCard | Global | Single post card (feed card format) | 118 |
| PostDetailDrawer | Global | Right panel: post details + tabs | 85 |
| DrawerRightPanel | Global | Tab routing inside drawer | 86 |
| DrawerMediaPanel | Global | Media preview (video player) | 84 |
| DetailsTab | Global | Post metadata + hashtags + save | 73 |
| TranscriptTab | Global | AI transcript (if available) | 36 |
| AIAnalysisTab | Global | AI analysis of post | 23 |
| VideoLightbox | Global | Full-screen video viewer | 62 |
| **Controls / Shared** |
| SortPill | Controls | Dropdown: sort orders (newest/trending/top-engagement) | 69 |
| VisibilityPill | Controls | Checkboxes: show/hide columns (likes/views/saves) | 63 |
| ThresholdPill | Signals | Threshold selector (2x/5x/10x/20x multiplier) | 43 |
| BoardPickerDropdown | Feed | Select board to filter by | 48 |
| SkeletonCard | Feed | Loading state | 15 |
| **Experts / Boards** |
| ExpertsView | - | Expert accounts leaderboard (future) | 32 |
| BoardsView | - | Saved boards list (future) | 59 |
| BoardCard | - | Single board preview | 65 |
| BoardDetailView | - | Board detail + posts (future) | 130 |
| **Hooks / Utils** |
| useFeed | Hook | Fetch + sort posts (search, filters) | 39 |
| useDrawer | Hook | Open/close drawer state | 23 |
| types.ts | - | TypeScript interfaces (Post, TrendsData, InsightsData, etc.) | 190 |
| constants.ts | - | Animation variants, defaults | 33 |
| utils.ts | - | Helper functions (formatNumber, etc.) | 48 |
| filterConfig.tsx | - | Filter category definitions | 91 |

---

## 4. Data Layer

### Queries (read-only)

| Query | Purpose | Params | Returns |
|-------|---------|--------|---------|
| `api.intelligence.getFeed` | Community feed (search + sort) | niche, contentType, sortBy, limit | Post[] |
| `api.intelligence.searchPosts` | Full-text search on captions | query, niche, contentType | Post[] |
| `api.intelligence.getStats` | Header stat (total indexed) | - | { totalIndexed } |
| `api.intelligence.getTrends` | Format/niche/hook aggregations | days, niche, platform | TrendsData |
| `api.intelligence.getSignals` | Posts above outlier threshold | minMultiple, niche, limit | Post[] |
| `api.intelligence.getPatterns` | Pattern clusters (hashtag-based) | days, niche | PatternCluster[] |
| `api.intelligence.getCreatorStats` | Per-account stats (real posts only) | - | CreatorStat[] |
| `api.insights.getInsights` | Swipe-rating aggregations | - | InsightsData |

### Mutations (write)

| Mutation | Purpose | Params |
|----------|---------|--------|
| `api.intelligence.toggleSave` | Save/unsave a post | postId |
| `api.intelligence.seedIntelligenceFeed` | Seed demo posts (GFE, Fitness, Lifestyle) | - |
| `api.intelligence.clearSeedData` | Delete all seed_ prefixed posts | - |
| `api.intelligence.importScrapedPost` | Bulk import real scraped post | externalId, handle, caption, hashtags, likes, views, etc. |
| `api.insightsSeed.seedSwipeRatings` | Auto-seed demo ratings (InsightsView calls on mount if empty) | - |

### Data Schema (Convex)

**scrapedPosts table:**
```
_id, externalId, accountId, handle, platform, contentType, niche
thumbnailUrl, videoUrl, caption, hashtags
likes, comments, saves, views, reach, engagementRate
postedAt, scrapedAt, saved, boardIds
firstComment?, outlierRatio?
```

**swipeRatings table:**
```
_id, postId, ratedBy, rating ('up' | 'down' | 'save'), createdAt
```

**trackedAccounts table:**
```
_id, handle, displayName, platform, niche, followerCount, avatarColor
status, lastScrapedAt, postsScraped, avgEngagementRate, isOwn
```

---

## 5. Key Patterns

### Navigation Flow
```
IntelligenceFeaturePage
  ├─ Tab ① (Trends)      → TrendsView
  ├─ Tab ② (Analysis)    → AnalysisView
  └─ Tab ③ (Insights)    → InsightsView

Each tab state isolated in component.
Click a post anywhere → PostDetailDrawer opens (same drawer for all tabs).
"Hub" button top-right → navigate to /isso/community (next product).
```

### Unicode Rule
**NO em-dashes or ellipses inside JS string literals.** SWC parser bug causes crashes.

Bad:
```typescript
const msg = "Transform Tuesday — 12 weeks in..."; // CRASH
```

Good:
```typescript
const msg = "Transform Tuesday - 12 weeks in."; // Use hyphens, periods
```

### Auto-Seed Fallback
`getPatterns` query clusters by hashtag first:
```typescript
const hasHashtags = posts.some(p => (p.hashtags ?? []).length > 0);

if (hasHashtags) {
  // Cluster by hashtag
} else {
  // Fallback: cluster by niche + contentType (e.g., "Fitness · Reel")
}
```

If a niche has no hashtags, you still get clusters based on format preference.

### Outlier Detection
Posts with `outlierRatio >= 2` are "viral." Fallback if no outlierRatio set:
```typescript
const multiplier = (post.engagementRate ?? 0) >= erFloor ? 1 : ...;
// erFloor varies by threshold: 2x → 0.05, 5x → 0.08, 10x → 0.12, 20x → 0.20
```

### InsightsView Auto-Seed
On first load, if `data.summary.totalRatings === 0`, trigger `seedSwipeRatings()`:
```typescript
useEffect(() => {
  if (data && data.summary.totalRatings === 0) {
    seedRatings({});
  }
}, [data, seedRatings]);
```

This ensures demo data loads without manual intervention.

### Seed Data Filtering
Real posts are separated from demo posts:
```typescript
posts = posts.filter(p => !p.externalId?.startsWith('seed_'));
```

`getTrends` excludes seed data. `getPatterns` includes it (for demo clustering).

---

## 6. Feature Pipeline (Future)

Based on competitive research, these are planned additions:

### MVP Next
- **Trending audio tracker** — Surface audio tracks gaining velocity (24h vs. 7-day momentum)
- **Saved search with alert** — Create saved query (e.g., "GFE + mirror + morning"), get notified on new matches

### Phase 2
- **"Inspired by" on generated content** — When AI generates content in Content Gen, show which swipe-rated reels influenced the style (closes research -> generation loop)
- **Engagement rate benchmarking** — Show each account's ER vs. niche median + context (e.g., "5.2% = top 20% in Fitness niche")
- **Niche trend leaderboard** — Weekly top-10 content themes outperforming baseline per niche

### Future (OFM Revenue Layer)
- **Content-to-PPV attribution** — Which specific reel drove which PPV sale
- **Traffic source to subscription** — Which TikTok/IG reel brought which subscriber (connect scraping to revenue)

---

## Development

### Run Locally
```bash
cd apps/isso-dashboard
npm run dev
# Navigate to /isso/intelligence
```

### Add a New Trend Component
1. Create component in `src/features/intelligence/components/trends/`
2. Add query (if needed) to `convex/intelligence.ts`
3. Import + render in `TrendsView.tsx`
4. Test with seeded data: `api.intelligence.seedIntelligenceFeed()`

### Clear Demo Data
```typescript
// Call from browser console
const clearMutation = api.intelligence.clearSeedData;
// or visit any pill and the UI auto-clears on fresh deploy
```

### Type Safety
All component props are in `src/features/intelligence/types.ts`. Convex types auto-generated in `convex/_generated/dataModel.ts`.
