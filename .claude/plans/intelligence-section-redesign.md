# Intelligence Section — Redesign Plan
**Date:** 2026-04-06
**Status:** Planning complete, ready to build
**Owner:** agency.clients-pm

---

## Overview

Splitting Intelligence from 3 blurry tabs into 4 tabs with clear, non-overlapping jobs.

```
OLD: Trends → Analysis (stub) → Insights
NEW: Dashboard → Qualify → Analysis → Insights
```

**The pipeline logic:**
> Scrape → Qualify (filter signal from noise) → Analyse (understand why) → Insights (decide what to do)

Each tab answers exactly one question. If a component doesn't answer that tab's question, it doesn't belong there.

---

## Component Inventory

### What we keep (24 components — ~80% reuse)

| Component | Current home | New home | Change |
|-----------|-------------|----------|--------|
| `StatsBar` | trends/ | Qualify | None |
| `OutlierFeed` | trends/ | Qualify | Remove from Analysis |
| `OutlierCard` | trends/ | Qualify | None |
| `FormatChart` | trends/ | Qualify | None |
| `NicheLeaderboard` | trends/ | Qualify | None |
| `HooksTable` | trends/ | Qualify | None |
| `PatternInsights` | trends/ | Qualify | Remove from Analysis |
| `PatternCard` | trends/ | Qualify | None |
| `AIChatPanel` | trends/ | Insights | Move folder, promote to primary |
| `WinningHooks` | insights/ | Insights | None |
| `LearningSignal` | insights/ | Insights + Dashboard | Borrow for Dashboard too |
| `RatingSummaryBar` | insights/ | Insights | Compact — header stat only |
| `TopRatedPosts` | insights/ | Insights | None |
| `RatedCard` | insights/ | Insights | None |
| `PostDetailDrawer` | drawer/ | Analysis drill-down | None |
| `AIAnalysisTab` | drawer/ | Analysis drill-down | None — ScoreRing, emotions, breakdown all reused |
| `DetailsTab` | drawer/ | Analysis drill-down | None |
| `DrawerMediaPanel` | drawer/ | Analysis drill-down | None |
| `DrawerRightPanel` | drawer/ | Analysis drill-down | None |
| `TranscriptTab` | drawer/ | Analysis drill-down | None |
| `FeedView` | feed/ | Unchanged | Not in intelligence tabs directly |
| `PostCard` | feed/ | Unchanged | None |
| `SortPill` | controls/ | Analysis | None |
| `VisibilityPill` | controls/ | Qualify | None |

### What we cut (3 components)

| Component | Reason |
|-----------|--------|
| `RaterActivity` | Too granular. Team rater leaderboard is not actionable intel. |
| `PreferenceChart` (Niche + Format) | AI can answer "what niche is winning" in a sentence. Charts for chart's sake. |
| `BarRow` | Only exists to serve PreferenceChart — cut with it. |

### What we update (3 files)

| File | Change |
|------|--------|
| `IntelligenceFeaturePage.tsx` | Add `dashboard` tab, rename `trends` → `qualify` id + label, wire new views |
| `types.ts` | Add `'dashboard'` and `'qualify'` to `Tab` type, remove `'trends'` |
| `IntelligenceControls.tsx` | Add qualify-specific filters, wire dashboard (no filters needed) |

### What we rebuild (1 component)

| Component | Reason |
|-----------|--------|
| `AnalysisView.tsx` | Currently 30 lines, just duplicates Qualify. Full rebuild. |

### What we build new (14 components)

**Dashboard (5):**
- `DashboardView.tsx` — root layout
- `PipelineStatusStrip.tsx` — last scrape time, posts added this week
- `KPIDeltaTile.tsx` — KPI tile with ↑↓ delta vs prior period
- `OutlierSpotlight.tsx` — single #1 outlier post card (borrows OutlierCard styling)
- `ActionQueue.tsx` — "X posts unanalysed, Y unrated" → tab CTAs

**Analysis (7):**
- `AnalysisQueue.tsx` — posts that qualified (high outlierRatio) but have no `aiAnalysis` yet
- `AnalysedPostGrid.tsx` — posts with `aiAnalysis`, each showing hookScore + key emotion
- `AnalysedPostCard.tsx` — single card (borrows `ScoreRing` from AIAnalysisTab)
- `HookScoreDistribution.tsx` — histogram of hookScore values across all analysed posts
- `HookLineGallery.tsx` — best opening lines ranked by hookScore × ER, copy-ready
- `EmotionFrequency.tsx` — bar chart: which emotion tags appear in top performers
- `RuleCards.tsx` — derived pattern rules ("Questions as openers → 2.3× ER")

**Qualify (1):**
- `HashtagCorrelation.tsx` — hashtags in top-10% ER posts vs bottom-90%

**Insights (1):**
- `InsightCards.tsx` — 3–5 auto-generated declarative insight statements with "Turn into Brief" CTAs

---

## Tab Plans

---

### ① Dashboard

**Question it answers:** "What happened while I was away?"
**User:** Agency owner. Morning check. 10-second read.
**Key principle:** Show CHANGE not STATE. Deltas matter more than totals.

```
Layout (single column, compact):
┌─────────────────────────────────────────────────────┐
│ PipelineStatusStrip                                  │
│ Last scrape: 2h ago · 47 posts added this week ↑    │
├──────────┬──────────┬──────────┬────────────────────┤
│ KPIDelta │ KPIDelta │ KPIDelta │ KPIDelta            │
│ +12 posts│ ER 4.2%↑ │ 3 outlrs │ 8 unrated          │
│ this wk  │ vs last  │ this wk  │ need attention      │
├──────────┴──────────┴──────────┴────────────────────┤
│ OutlierSpotlight                                     │
│ "Top outlier this week" — single card, thumbnail,   │
│ handle, ER, outlierRatio, "Turn into Brief" CTA     │
├─────────────────────────────────────────────────────┤
│ LearningSignal (borrowed, compact 2-col not 3-col)  │
│ "GFE is strongest niche · Reels save 64% of time"  │
├─────────────────────────────────────────────────────┤
│ ActionQueue                                          │
│ [→ 12 posts need analysis] [→ 8 posts unrated]     │
└─────────────────────────────────────────────────────┘
```

**Convex queries needed:**
- `getStats` (already exists) — totalIndexed, posts this week
- `getTrends` (already exists) — outlierPosts[0] for spotlight, avgER for delta
- Extend `getStats` to return `postsThisWeek`, `postsLastWeek`, `unanalysedCount`, `unratedCount`

**No filters needed on this tab.**

---

### ② Qualify

**Question it answers:** "Which posts from the scraped pool cleared the bar?"
**User:** Agency owner or model manager. Runs weekly after a scrape.
**Key principle:** Statistical qualification layer. Input = full scraped pool. Output = ranked signal posts + the variables that explain performance.

```
Layout:
┌─────────────────────────────────────────────────────┐
│ StatsBar (5 tiles: posts, avg ER, top format,       │
│           top niche, outliers detected)             │
├─────────────────────────────────────────────────────┤
│ OutlierFeed (horizontal scroll, top performers)     │
├──────────────────────────┬──────────────────────────┤
│ FormatChart              │ NicheLeaderboard         │
│ (ER by format)           │ (ER by niche, ranked)    │
├──────────────────────────┴──────────────────────────┤
│ HashtagCorrelation (NEW)                            │
│ Top hashtags in top-10% ER vs bottom-90%           │
│ "Does #gfe → outlier performance?"                 │
├─────────────────────────────────────────────────────┤
│ HooksTable (top hooks in qualified posts)           │
├─────────────────────────────────────────────────────┤
│ PatternInsights (cross-account clusters)            │
└─────────────────────────────────────────────────────┘
```

**Filters:** niche, platform (already wired), time window (TimePill), metric toggle (MetricPill)

**Convex queries needed:**
- `getTrends` (already exists) — all existing sections
- `getPatterns` (already exists) — PatternInsights
- `getHashtagCorrelation` (NEW) — groups hashtags by whether posts are top-10% ER or not, returns top 15 by correlation strength

**Components reused as-is:** StatsBar, OutlierFeed, OutlierCard, FormatChart, NicheLeaderboard, HooksTable, PatternInsights, PatternCard

---

### ③ Analysis

**Question it answers:** "Why did the top posts work? What rules emerge?"
**User:** Model manager or content strategist. Runs after qualification.
**Key principle:** Qualify = WHAT performed. Analysis = WHY it performed. Post anatomy, not aggregate stats.

```
Layout:
┌─────────────────────────────────────────────────────┐
│ AnalysisQueue (NEW)                                 │
│ Posts with high outlierRatio but no aiAnalysis yet  │
│ "12 posts qualified, 4 analysed — 8 in queue"      │
│ Each card: thumbnail + "Run Analysis" button        │
├──────────────────────────┬──────────────────────────┤
│ HookScoreDistribution    │ EmotionFrequency          │
│ Histogram: where does    │ Bar: which emotions       │
│ hook quality cluster?    │ appear in top performers? │
├──────────────────────────┴──────────────────────────┤
│ HookLineGallery                                     │
│ Best opening lines by hookScore × ER               │
│ Copy-ready. "@handle · score 8.4 · 'Are you...' " │
├─────────────────────────────────────────────────────┤
│ RuleCards                                           │
│ Derived patterns: "Questions as openers → 2.3× ER" │
│ 3–6 cards, each with evidence count                │
├─────────────────────────────────────────────────────┤
│ AnalysedPostGrid                                    │
│ All posts with aiAnalysis. Card = thumbnail +      │
│ ScoreRing + top emotion tag. Click → drawer        │
│ (PostDetailDrawer → AIAnalysisTab — already built) │
└─────────────────────────────────────────────────────┘
```

**ScoreRing reuse:** `ScoreRing` is defined inside `AIAnalysisTab.tsx` — extract to `shared/ScoreRing.tsx` so `AnalysedPostCard` can import it.

**Convex queries needed:**
- `getAnalysisQueue` (NEW) — posts where `outlierRatio > 1.5` and `aiAnalysis == null`, ordered by outlierRatio desc
- `getAnalysedPosts` (NEW) — posts where `aiAnalysis != null`, returns hookScore, hookLine, emotions, handle, niche, thumbnailUrl
- `getHookStats` (NEW) — aggregates hookScore distribution + emotion frequency across all analysed posts
- `getRules` (NEW or derived client-side) — can be computed client-side from analysed posts: group by hook pattern (question/statement/number), compute avg ER per group

**Components reused:** PostDetailDrawer + all drawer sub-components (AIAnalysisTab, DetailsTab, DrawerMediaPanel, DrawerRightPanel, TranscriptTab) — all click-through from AnalysedPostGrid

---

### ④ Insights

**Question it answers:** "Based on everything, what should we actually do?"
**User:** Agency owner or strategist. End of the pipeline — this is the output layer.
**Key principle:** Convert patterns into decisions. AI chat is primary. Everything else is context that feeds it.

```
Layout:
┌─────────────────────────────────────────────────────┐
│ RatingSummaryBar (compact — single strip)           │
│ "847 ratings · 64% save rate · top rater: @alex"  │
├─────────────────────────────────────────────────────┤
│ InsightCards (NEW — 3–5 cards)                     │
│ Auto-generated declarative statements:             │
│ "GFE Reels outperform by 40% this month →          │
│  [Turn into Brief]"                                │
│ "Hook questions → 2.3× baseline ER"                │
│ "Competitor @x posts 3× per week, 67% outlier rate"│
├─────────────────────────────────────────────────────┤
│ WinningHooks                                        │
│ (team's most-saved captions — copy-ready)          │
├─────────────────────────────────────────────────────┤
│ AIChatPanel (PROMOTED — full width, primary)       │
│ "Ask Intelligence" — wired to Minimax              │
│ Context: TrendsData + InsightsData                 │
│ Suggested: "What should we brief this week?"       │
│            "What's working in GFE?"               │
│            "Which creator should we push?"         │
└─────────────────────────────────────────────────────┘
```

**Cut from current InsightsView:** NichePreferenceChart, FormatPreferenceChart, RaterActivity grid
**Reason:** The AI can answer preference questions in a sentence. RaterActivity is team admin, not strategy.

**Convex queries needed:**
- `getInsights` (already exists) — feeds WinningHooks, RatingSummaryBar, TopRatedPosts
- `getTrends` (already exists) — feeds AIChatPanel system prompt
- InsightCards generated client-side from TrendsData + InsightsData (no new query needed)

**AIChatPanel system prompt update:** Add InsightsData (winning hooks, top rated posts, save rates) alongside TrendsData so the AI has the full picture.

---

## Build Order

```
Step 1 — Mechanical rename (15 min)
  - Update Tab type: add 'dashboard', 'qualify', remove 'trends'
  - Update IntelligenceFeaturePage: add Dashboard tab, rename Trends→Qualify
  - Rename TrendsView → QualifyView (or keep filename, change export + label)

Step 2 — Qualify additions (1–2h)
  - Write getHashtagCorrelation Convex query
  - Build HashtagCorrelation component
  - Add to QualifyView

Step 3 — Analysis rebuild (3–4h)
  - Extract ScoreRing to shared/ScoreRing.tsx
  - Write getAnalysisQueue, getAnalysedPosts, getHookStats Convex queries
  - Build AnalysisQueue, AnalysedPostCard, AnalysedPostGrid
  - Build HookScoreDistribution, EmotionFrequency
  - Build HookLineGallery
  - Build RuleCards (client-side derivation)
  - Replace AnalysisView.tsx with new layout

Step 4 — Insights refactor (1–2h)
  - Cut RaterActivity, PreferenceChart, BarRow from InsightsView
  - Build InsightCards
  - Move AIChatPanel to insights/ folder
  - Promote AIChatPanel to primary position
  - Update AIChatPanel system prompt with InsightsData context
  - Compact RatingSummaryBar to single strip

Step 5 — Dashboard (2–3h)
  - Extend getStats Convex query (postsThisWeek, postsLastWeek, unanalysedCount, unratedCount)
  - Build KPIDeltaTile, PipelineStatusStrip, OutlierSpotlight, ActionQueue
  - Build DashboardView layout
  - Wire to IntelligenceFeaturePage as first tab
```

---

## New Convex Queries Needed

| Query | Returns | Used by |
|-------|---------|---------|
| `getHashtagCorrelation` | `{ hashtag, topTierCount, bottomTierCount, correlationScore }[]` | Qualify |
| `getAnalysisQueue` | posts where `outlierRatio > 1.5 && aiAnalysis == null` | Analysis |
| `getAnalysedPosts` | posts where `aiAnalysis != null` with hookScore, emotions etc. | Analysis |
| `getHookStats` | `{ scoreDistribution: number[], emotionFrequency: {emotion, count}[] }` | Analysis |
| Extend `getStats` | add `postsThisWeek`, `postsLastWeek`, `unanalysedCount`, `unratedCount` | Dashboard |

---

## Risk / Watch-outs

- `ScoreRing` is currently inlined in `AIAnalysisTab.tsx` — must extract before `AnalysedPostCard` can use it
- `RuleCards` data can be derived client-side (group by hook pattern, compute ER) — no Convex query needed if we do it in the component, but moves to a query if we want it in Dashboard too
- `InsightCards` content is derived from `TrendsData` + `InsightsData` — no LLM call needed, pure computation. Only the *wording* should be declarative sentences, not chart data.
- `AIChatPanel` move: it currently imports from `../../constants` — path aliases will need updating when moved to `insights/`
- Dashboard is built last intentionally — it depends on stable query shapes from all other tabs
