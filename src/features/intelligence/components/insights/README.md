# Intelligence — Insights Pill

> **Pipeline position:** Recon → Intelligence → **Insights** → Hub → Content Gen → Schedule → Analytics
>
> **Route:** `/isso/intelligence` → tab `insights` (third pill, step ③)

Insights is the feedback loop of the Intelligence section. It reads the team's swipe decisions (up / skip / save) from Hub's Swipe & Rate session and surfaces what those decisions are teaching the system — which niches resonate, which formats win, whose captions get saved, and who on the team is curating most actively.

---

## Pipeline Context

```
Hub: Swipe & Rate
      │  (writes to swipeRatings table)
      ▼
Convex: insights.getInsights
      │  (aggregates ratings → post joins → niche/format/rater stats)
      ▼
InsightsView
      │
      ├── RatingSummaryBar   — headline KPIs
      ├── LearningSignal     — 3 derived AI signals
      ├── PreferenceChart    — niche + format bar charts
      ├── WinningHooks       — top saved captions
      ├── TopRatedPosts      — scored post grid → links to Content Gen
      └── RaterActivity      — team leaderboard
```

**Data source:** `swipeRatings` table — joined at query time with `scrapedPosts`

**Seeding:** On first load, if `swipeRatings` is empty, `InsightsView` auto-calls `insightsSeed.seedSwipeRatings` to populate ~80 realistic dev ratings across 4 team members with niche-biased preferences (Thirst Trap 70%, GFE 65%, E-Girl 60%, Fitness 55%, Lifestyle 45%).

---

## File Map

```
insights/
├── README.md               — this file
├── index.ts                — barrel export (InsightsView only)
│
├── InsightsView.tsx        — orchestrator: fetches data, renders layout
├── RatingSummaryBar.tsx    — 5 KPI chips (total/liked/saved/skipped/top rater)
├── LearningSignal.tsx      — "What the system is learning" — 3 derived signals
│
├── PreferenceChart.tsx     — exports NichePreferenceChart + FormatPreferenceChart
├── BarRow.tsx              — shared animated stacked bar (used by PreferenceChart)
│
├── WinningHooks.tsx        — 2-col grid of top saved captions
│
├── TopRatedPosts.tsx       — section header + 6-col post grid
├── RatedCard.tsx           — individual post card with hover "Turn into Brief" CTA
│
└── RaterActivity.tsx       — team member leaderboard with animated bars
```

**Convex backend:**
```
convex/
├── insights.ts             — getInsights query (aggregation)
└── insightsSeed.ts         — seedSwipeRatings mutation (dev/demo data)
```

**Types** (`src/features/intelligence/types.ts`):
```
InsightsSummary     — { totalRatings, upCount, downCount, saveCount }
NichePreference     — { niche, upRate, saveRate, total }
FormatPreference    — { format, upRate, saveRate, total }
RaterStat           — { ratedBy, total, upCount, saveCount }
RatedPost           — { _id, handle, niche, contentType, thumbnailUrl, caption?, engagementRate, upCount, saveCount, downCount }
InsightsData        — { summary, nichePreferences, formatPreferences, topRatedPosts, raterActivity }
```

---

## Components

### `InsightsView`
**File:** `InsightsView.tsx` | **Lines:** ~95

The root orchestrator for the Insights pill. Owns the single Convex query and auto-seed logic. Renders a skeleton loading state while data is undefined, then lays out all six sections in a `motion.div` with stagger animation.

```tsx
const data = useQuery(api.insights.getInsights, {});
// auto-seeds via useMutation(api.insightsSeed.seedSwipeRatings) if empty
```

---

### `RatingSummaryBar`
**File:** `RatingSummaryBar.tsx` | **Lines:** ~85

Five KPI chips in a 5-column grid:

| Chip | Value | Color |
|---|---|---|
| Total ratings | count | purple |
| Liked | upCount / totalRatings % | green |
| Saved | saveCount / totalRatings % | pink |
| Skipped | downCount / totalRatings % | grey |
| Top rater | ratedBy name | blue |

Uses `variants={fadeUp}` — propagates from `InsightsView`'s motion parent via Framer Motion context.

---

### `LearningSignal`
**File:** `LearningSignal.tsx` | **Lines:** ~90

Purple-gradient callout card. Derives 3 plain-English signals from live data:

1. **Strongest niche** — top entry from `nichePreferences` with combined positive rate
2. **Preferred format** — top entry from `formatPreferences` with save rate
3. **Curation quality** — compares saveRate vs skipRate; positive or warning signal

Signals are computed entirely client-side — no extra Convex calls needed.

---

### `PreferenceChart` + `BarRow`
**Files:** `PreferenceChart.tsx` | `BarRow.tsx` | **Lines:** ~100 + ~55

`PreferenceChart.tsx` exports two components that share the same `ChartCard` shell and `Legend`:

**`NichePreferenceChart`** — horizontal stacked bars per niche, colored by `NICHE_COLORS` constant.
**`FormatPreferenceChart`** — same layout, colors from local `FORMAT_COLORS` map (`reel` → pink, `post` → blue, `carousel` → orange, `story` → purple).

Each bar is rendered by **`BarRow`**, which independently animates two `motion.div` segments:
- Green segment = liked rate
- Pink gradient segment = saved rate
- Width animates from 0 on mount with a staggered delay by `index`

> **Note:** `BarRow`'s outer wrapper is a plain `<div>` (not a motion element). The inner `motion.div` bars use explicit `initial/animate` so they self-animate without needing a parent variant chain.

---

### `WinningHooks`
**File:** `WinningHooks.tsx` | **Lines:** ~70

Filters `topRatedPosts` for posts that have a `caption` with >15 chars and at least 1 save. Shows the top 6 as quote cards in a 2-column grid. Each card shows:
- Caption text (first 130 chars, truncated)
- `@handle`
- Niche badge (color-coded)
- Save count

Cards self-animate with `initial/animate` (no variant chain needed).

---

### `TopRatedPosts` + `RatedCard`
**Files:** `TopRatedPosts.tsx` | `RatedCard.tsx` | **Lines:** ~45 + ~80

**`TopRatedPosts`** is a thin section wrapper — header text + a `motion.div` with `containerVariants` stagger that renders up to 12 `RatedCard` items in a 6-column grid.

**`RatedCard`** shows:
- Thumbnail (supports real URLs or `linear-gradient(...)` placeholder strings)
- Score badge (up + save×2)
- Hover CTA: **"Turn into Brief"** — deep-links to `/isso/ideas?niche=X&format=Y&from=handle&hook=caption` to pre-fill a Content Gen brief from this post
- Niche badge + like/save/skip counts

Score formula: `score = upCount + (saveCount × 2)` — saves count double because they signal stronger intent.

---

### `RaterActivity`
**File:** `RaterActivity.tsx` | **Lines:** ~85

Team leaderboard. Each row has:
- Avatar (single initial, hash-colored from `AVATAR_COLORS`)
- Name + up/save breakdown
- Animated progress bar relative to top rater's volume

Returns `null` if `raters` array is empty.

---

## Convex Backend

### `getInsights` — `convex/insights.ts`

Single query, no args. Processing pipeline:

```
1. Fetch all swipeRatings
2. Count summary totals
3. Group votes by postId
4. Bulk-fetch rated posts (Promise.all)
5. Aggregate nichePreferences → sort by (upRate + saveRate) desc
6. Aggregate formatPreferences → same sort
7. Score posts (up + save×2) → top 12
8. Aggregate raterActivity → sort by total desc
9. Return all five shapes
```

**Tables accessed:** `swipeRatings` (read all), `scrapedPosts` (get by ID)

### `seedSwipeRatings` — `convex/insightsSeed.ts`

Idempotent seed mutation. Called automatically by `InsightsView` when `totalRatings === 0`.

- 4 raters: Alex, Jordan, Sam, Riley
- 20 random posts per rater (~80 total ratings)
- Niche-biased rating logic to make preference charts show clear signal
- `ratedAt` randomised within the last 7 days

Returns early with `{ seeded: 0, message: "Already seeded" }` if any ratings exist.

---

## Animations

All animations use the shared easing curve `[0.25, 0.1, 0.25, 1]` (cubic bezier).

| Component | Animation type | Trigger |
|---|---|---|
| `InsightsView` | staggerChildren via `containerVariants` | on mount |
| `RatingSummaryBar` | fadeUp via variant | inherited from InsightsView |
| `LearningSignal` | `initial/animate` self-contained | on mount |
| `BarRow` | width: 0 → % (two segments) | on mount |
| `WinningHooks` cards | `initial/animate`, staggered by index | on mount |
| `RatedCard` | `initial/animate`, staggered by index | on mount |
| `RaterActivity` bars | width: 0 → % | on mount |

---

## Cross-Cutting Links

| From | To | How |
|---|---|---|
| `TopRatedPosts` → `RatedCard` | `/isso/ideas` (Content Gen) | "Turn into Brief" button, query params |
| `InsightsView` ← `Hub: Swipe & Rate` | `swipeRatings` table | Hub writes, Insights reads |
| `InsightsView` ← `Recon` | `scrapedPosts` table | Recon scrapes, Insights joins |

---

## Feature Pipeline

Ordered by impact and implementation readiness.

### Phase 1 — Low effort, high signal

| # | Feature | What | Why |
|---|---|---|---|
| 1.1 | **Date range filter** | 7d / 30d / 90d toggle (like Trends) | Rating signal degrades over time — recency matters |
| 1.2 | **Per-rater breakdown modal** | Click a team member → see their full rating history | Accountability + personal taste profiling |
| 1.3 | **Export winning hooks** | Copy-to-clipboard or CSV export of top captions | Direct content creation utility |
| 1.4 | **Real thumbnail resolution** | Proxy thumbnail URLs through a Convex action to avoid referrer blocks | Eliminate gradient placeholders |

### Phase 2 — Medium effort, compound value

| # | Feature | What | Why |
|---|---|---|---|
| 2.1 | **WHY tags on ratings** | Raters tag reason: hook / pacing / audio / format / face | Qualitative signal beyond binary up/save/skip |
| 2.2 | **Daily rating volume sparkline** | 7-bar mini chart showing rating activity per day | Shows team engagement cadence |
| 2.3 | **Niche × format heat map** | 2D grid: niche rows × format cols, color = score | Reveals which format works best *per niche* |
| 2.4 | **Hard-negative list** | Posts rated down by 3+ raters → "never generate like this" block | Closes the training loop explicitly |
| 2.5 | **Post-publish performance join** | Join topRatedPosts with Analytics data once content is published | Validate pre-publish signal against real performance |

### Phase 3 — High effort, strategic

| # | Feature | What | Why |
|---|---|---|---|
| 3.1 | **AI insight generation** | Run rated posts through Claude → structured insight: "Your team favours hook-forward reels with ≤3s grab" | Move from descriptive to prescriptive |
| 3.2 | **Preference drift detection** | Track niche/format scores week-over-week → alert if preferences shift | Catches algorithm changes and taste drift |
| 3.3 | **Model-specific insights** | Separate insight views per model (if multi-model agency setup) | Each model has a different audience and style |
| 3.4 | **Rating replay / audit log** | Full swipe history, filterable by rater / date / niche / result | Compliance + team review sessions |
| 3.5 | **Feedback loop close** | Show whether top-rated posts were actually generated and how they performed | Completes the full Recon → Intelligence → Hub → Generate → Publish → Insights loop |

---

## Known Constraints

- **Seed data** uses gradient placeholders when real thumbnails aren't available (Instagram referrer policy blocks cross-origin image loads without a proxy)
- **`getInsights` scans all swipeRatings** on every request — add a Convex index on `by_rater` and `by_post` as volume grows past ~10k ratings
- **Captions are optional** on `scrapedPosts` — WinningHooks silently hides if fewer than 6 posts have captions

---

*Last updated: 2026-04-06 | Owner: agency.clients-pm*
