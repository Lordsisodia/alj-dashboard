---
agent: ui.intelligence
icon: ⌘2
status: priority-today
---

# UI Agent — Intelligence

## What you own
The **Intelligence** nav icon (⌘2) — analyze phase. Discover trends, surface winning content patterns, generate insights.

## Pattern
Follows the standard: `ContentPageShell` + internal `useState<Tab>` + `AnimatePresence` + `StepNum` numbered pills.
**This is the cleanest implementation after Recon — use it as secondary reference.**

## Routes
- `/isso/intelligence` → `src/app/isso/intelligence/page.tsx` → renders `<IntelligenceFeaturePage />`

## Main orchestrator
`src/features/intelligence/components/IntelligenceFeaturePage.tsx`
- 4 internal tabs: `dashboard`, `qualify`, `analysis`, `insights`
- Default tab: `dashboard`
- `nextProduct` → Hub (`/isso/community`)

## Tab → component map
| Tab id | Label | Component | Data |
|--------|-------|-----------|------|
| `dashboard` | Dashboard | `components/dashboard/DashboardView.tsx` | Real Convex `api.intelligence.getStats` |
| `qualify` | Qualify ① | `components/trends/TrendsView.tsx` (exported as `QualifyView`) | Real Convex `getTrends`, `getHashtagCorrelation` |
| `analysis` | Analysis ② | `components/analysis/AnalysisView.tsx` | Real Convex `getAnalysedPosts`, `getHookStats` |
| `insights` | Insights ③ | `components/insights/InsightsView.tsx` | Real Convex `swipeRatings` BUT auto-seeds 80 fake votes if empty |

## Dashboard components (`components/dashboard/`)
`DashboardView.tsx`, `KPIDeltaTile.tsx`, `PipelineStatusStrip.tsx`, `OutlierRow.tsx`, `OutlierSpotlight.tsx`, `ActionQueue.tsx`

## Qualify/Trends components (`components/trends/`)
`TrendsView.tsx`, `StatsBar.tsx`, `FormatChart.tsx`, `NicheLeaderboard.tsx`, `HooksTable.tsx`, `OutlierFeed.tsx`, `PatternInsights.tsx`, `HashtagCorrelation.tsx`, `AIChatPanel.tsx`

## Analysis components (`components/analysis/`)
`AnalysisView.tsx`, `AnalysisQueue.tsx`, `AnalysedPostGrid.tsx`, `AnalysedPostCard.tsx`, `HookScoreDistribution.tsx`, `EmotionFrequency.tsx`, `HookLineGallery.tsx`, `RuleCards.tsx`

## Insights components (`components/insights/`)
`InsightsView.tsx`, `InsightCards.tsx`, `RatingSummaryBar.tsx`, `LearningSignal.tsx`, `TopRatedPosts.tsx`, `WinningHooks.tsx`, `PreferenceChart.tsx`, `RaterActivity.tsx`

## Drawer (post detail slide-in)
`components/drawer/PostDetailDrawer.tsx`, `DrawerMediaPanel.tsx`, `DrawerRightPanel.tsx`, `DetailsTab.tsx`, `AIAnalysisTab.tsx`, `TranscriptTab.tsx`

## Convex files used
- `convex/intelligence.ts` — `getFeed`, `getTrends`, `getStats`, `getAnalysedPosts`, `getAnalysisQueue`, `getHookStats`, `getHashtagCorrelation`, `getPatternInsights`
- `convex/insights.ts` — `getInsights`
- `convex/insightsSeed.ts` — `seedSwipeRatings` (auto-seeds on mount if empty)

## AI features (2/3 — better than expected)
1. ✅ **AI Chat** — `AIChatPanel.tsx` → `/api/intelligence/chat/route.ts` → Anthropic SDK pointed at **Minimax proxy** (`MiniMax-M2.7-highspeed`, `MINIMAX_BASE_URL`), streaming, full trends + ratings as system prompt. Shown on Insights tab.
2. ✅ **Post Analysis** — `AIAnalysisTab.tsx` → `/api/intelligence/analyze/route.ts` → OpenRouter `google/gemini-2.0-flash-lite-001`, returns `transcript`, `hookScore`, `hookLine`, `emotions`, `breakdown`, `suggestions`. Triggered from drawer.
3. ❌ **Missing** — suggest: Pulse Report (async Claude job → structured weekly brief, shown on Dashboard)

## Component quality
- **Polished:** `PipelineStatusStrip`, `KPIDeltaTile`, `HooksTable`, `AIChatPanel`, `PostDetailDrawer`, `InsightCards`
- **Rough (21st.dev targets):** `FormatChart`, `StatsBar`, `RatingSummaryBar`, `NicheLeaderboard`, `AnalysisQueue`, `HookLineGallery`, `RuleCards`, `BarRow`, `PreferenceChart` — all hand-rolled raw `<div>`/`<button>` with inline `style={{}}` objects
- **21st.dev:** None — the pink gradient `linear-gradient(135deg, #ff0069, #833ab4)` is hardcoded as a literal string in 12+ files

## Pattern compliance
- [x] `ContentPageShell` wrapping
- [x] Dashboard pill (tab `dashboard`)
- [x] 3 step pages (Qualify, Analysis, Insights)
- [ ] 3 AI features (2/3 — needs 1 more)
- [ ] 21st.dev component upgrades on rough components
