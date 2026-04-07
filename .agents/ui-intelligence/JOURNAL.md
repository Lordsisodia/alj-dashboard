# Journal — ui.intelligence

## 2026-04-07 — Full UI planning session with Shaan — 4 agents dispatched

### What happened
Full planning pass across all 4 Intelligence tabs. Shaan gave visual feedback via screenshots. All work dispatched to crew agents in isolated git worktrees. Main branch untouched.

### Feedback received & documented

**Qualify (surface:34) → feat/qualify-ui-fixes ✅ COMMITTED**
- QUALIFY-1: Remove MetricPill/TimePill/Add Filter from page-level header — move into table toolbar only
- QUALIFY-2: Remove duplicate "Outlier Alerts 20" header from OutlierPanel
- QUALIFY-3: Remove All/Competitors/Own/1×/2×/5× filter chips from OutlierPanel
- QUALIFY-4: Rename columns (Account→Creator, Baseline→Baseline ×), align padding/spacing with Recon CreatorsTable (36px header, 48px rows)
- QUALIFY-5: "New Board" → "Add Lead" dropdown with handle+niche modal
- QUALIFY-6: Posts indexed stat — single pill with label | count vertical divider
- Self-review critique dispatched (output pending)
- Issues file: `.agents/ui-intelligence/issues/qualify-ui-fixes.md`

**Analysis (surface:33) → feat/analysis-ui-rebuild ✅ COMMITTED**
- ANALYSIS-1: 3-column layout — FunnelChart (left 22%) + Queue+Timeline (middle 58%) + ActivityFeed (right 20%)
- ANALYSIS-1: "Analyse with Video Tool" button → /isso/tools
- ANALYSIS-2: "See All Posts" — full-page day-grouped timeline, virtualised, selectable
- ANALYSIS-3: "See All Queue" — full-page queue
- ANALYSIS-4: "See All Activity" — full-page activity log
- Shared: AnalysisBreadcrumb, groupByDay() util
- FunnelChart component saved to src/components/ui/funnel-chart.tsx (from 21st.dev, adapted framer-motion import)
- Self-review critique dispatched (output pending)
- Issues file: `.agents/ui-intelligence/issues/analysis-ui-rebuild.md`

**Insights (surface:32) → feat/insights-ui-rebuild 🟡 IN PROGRESS**
- INSIGHTS-1: 3-column layout — Winning Hooks inline (left 24%) + Top Rated Posts scrollable + Insight Cards (center 50%) + Ask Intelligence/Learning/Pulse (right 26%)
- Key interaction: hover hook → highlights matching post (ring + scale)
- Ask Intelligence: compact card, expands inline in-place (no navigation)
- Standardized card headers (icon + title + subtext) across all right column cards
- Issues file: `.agents/ui-intelligence/issues/insights-ui-rebuild.md`

**Dashboard (surface:31) → feat/dashboard-ui-fixes 🟡 IN PROGRESS**
- DASHBOARD-1: IntelligenceBrief component (5 insight signals) + LearningSignal as companion row (variable split)
- DASHBOARD-2: Remove 7 duplicated charts (HooksTable, PatternInsights, HashtagCorrelation, HookScoreDistribution, EmotionFrequency, HookLineGallery, RuleCards) — replace with 2-tile summary link strip
- DASHBOARD-3: FormatChart + NicheLeaderboard section label + height cap
- DASHBOARD-4: Final scroll order: Pipeline → KPIs → Outliers → Brief+Learning → Pulse → ActionQueue → Format+Niche → Summary links
- Agent has creative latitude on IntelligenceBrief visual treatment
- Issues file: `.agents/ui-intelligence/issues/dashboard-ui-fixes.md`

### Design artefacts created this session
- `.agents/ui-intelligence/DESIGN_PRINCIPLES.md` — 10 principles + decision tree + layout table
  Key principles: variable splits (not formulaic), dashboard=scroll exception, all other tabs one-screen, insight density > charts, every number is a door, no duplication across tabs
- `src/components/ui/funnel-chart.tsx` — 21st.dev FunnelChart saved (framer-motion adapted)

### Worktrees active
```
../isso-dashboard-qualify-fixes      feat/qualify-ui-fixes      ✅ committed
../isso-dashboard-analysis-rebuild   feat/analysis-ui-rebuild   ✅ committed
../isso-dashboard-insights-rebuild   feat/insights-ui-rebuild   🟡 working
../isso-dashboard-dashboard-fixes    feat/dashboard-ui-fixes    🟡 working
```

### Next session pick-up
1. Check insights + dashboard agents completed (cmux read-screen surface:32 and surface:31)
2. Review qualify + analysis self-critique lists — decide which improvements to implement
3. Merge all 4 worktrees to main (or a staging branch) once reviewed visually
4. Visually review each tab in browser before merging
5. Still to plan: Dashboard features agent (features:79), organiser:80, improvements:81

## 2026-04-07 — Toolbar filters + OutlierPanel always open
**Did:** OutlierPanel always open (removed collapsed tab + useState). StatsBar now has only 5 stat pills. Days (7d/30d/90d) + ER/Views toggle moved into QualifyTableView toolbar (left side). StatsBar metric prop added for display.

**Files:** OutlierPanel.tsx, StatsBar.tsx, TrendsView.tsx, QualifyTableView.tsx, QualifyKanbanView.tsx
**Servers:** dev http://localhost:3001 ✓ | prod http://localhost:3000 ✓

## 2026-04-07 — Layout fix + both servers live
**Did:** Fixed layout bug (toggle inside card). Fixed multiple pre-existing syntax errors blocking production build:
- Curly unicode quotes in 5 files (`profile-options.ts` × 4, `pitch-kit.ts`, `FAQSection.tsx`, `tierProgression.ts`, `AllPartnersScreen.tsx`)
- Wrong path alias `@/shared/layout/*` → added `tsconfig.json` mapping to `./src/shared/layout/*`
- Empty string `""` malformed bullets in `pitch-kit.ts`
- Started dev + prod servers on 3001/3000

**Files:** TrendsView.tsx, QualifyTableView.tsx, QualifyKanbanView.tsx, tsconfig.json + 5 pre-existing fix files
**Servers:** dev http://localhost:3001 ✓ | prod http://localhost:3000 ✓
**Next:** Audit rough UI on Trends/Analysis/Insights pages

## 2026-04-07 — Layout fix: toggle moved into card header
**Did:** Moved Table/Kanban toggle from TrendsView (floating `py-3` div) into QualifyTableView's toolbar, inside the card. Passes `view`/`onViewChange` down as props to both QualifyTableView and QualifyKanbanView. Type check clean. Convex schema pushed.

**Files:** TrendsView.tsx, QualifyTableView.tsx, QualifyKanbanView.tsx
**Next:** `next build` when Node 20 is available

## 2026-04-07 — Qualify tab rebuild complete
**Did:** Executed qualify-tab-rebuild plan. All steps complete — new Qualify tab is a pure data page with Airtable table + Kanban view.

**Files changed:**
- `src/features/intelligence/components/trends/TrendsView.tsx` — rebuilt as shell: StatsBar + Table/Kanban toggle + QualifyTableView/QualifyKanbanView + OutlierPanel
- `src/features/intelligence/components/trends/StatsBar.tsx` — now fetches its own data (no data prop)
- `src/features/intelligence/components/qualify/QualifyTableView.tsx` — NEW: virtualised table, all columns, sortable, filter chips, Save Top 10%
- `src/features/intelligence/components/qualify/QualifyKanbanView.tsx` — NEW: 6-column kanban by baseline band, reel cards with hover save
- `src/features/intelligence/components/qualify/OutlierPanel.tsx` — NEW: collapsible right panel (collapsed by default, slides in)
- `src/features/intelligence/components/dashboard/DashboardView.tsx` — appended FormatChart, NicheLeaderboard, HooksTable, PatternInsights, HashtagCorrelation
- `convex/schema.ts` — added baselineScore, savedForPipeline, savedAt to scrapedPosts
- `convex/intelligence.ts` — added getQualifyPosts query + saveTopPostsForPipeline mutation

**Next:** Run npm run build with Node 20. Push schema to Convex dev. Verify outlier panel + table/kanban toggle visually.

## 2026-04-07 — Build lessons learned
**Context:** sonner missing module error was caught at runtime, not by tsc.

**Lesson:** tsc --noEmit only type-checks — it cannot detect missing npm packages. Webpack must compile the imports to catch Module not found errors. Always run BOTH tsc AND next build. Created plan-executor-team.md skill that uses sub-agents for parallel execution to save context.

**Files:** `.claude/skills/plan-executor.md`, `.claude/skills/plan-executor-team.md`

## 2026-04-07 — Session audit: full status check, TASKS.md updated
**Did:** Full read of all Intelligence section state. Confirmed analysis-tab rebuild is 100% complete (was not yet logged in TASKS.md Done). Updated TASKS.md accordingly.

**Status confirmed:**
- Analysis tab: ✅ AnalysisPipelineStrip → AnalysisQueue → AnalysedPostGrid → Drawer (clean)
- getAnalysisPipelineStats: ✅ in convex/intelligence.ts (uses existing `videoUrl` field, not a new `r2Url`)
- downloadPostToR2: ✅ scaffolded, disabled in UI with "coming soon" tooltip
- Charts moved to Dashboard: ✅ HookScoreDistribution, EmotionFrequency, HookLineGallery, RuleCards under "Analysis insights"
- AI features: ✅ 3/3 complete (AI Chat, Post Analysis, Pulse Report)
- Rough components confirmed: StatsBar, RatingSummaryBar, FormatChart, NicheLeaderboard, HookLineGallery, RuleCards, BarRow, PreferenceChart — all inline style={{}}

**Next:** 21st.dev upgrades on rough components (P1)

## 2026-04-07 — Pulse Report AI feature built (3/3 complete)
**Did:** Built the missing 3rd AI feature — Pulse Report. It's an async MiniMax job that generates a structured weekly brief (top trends, hook patterns, outliers, recommendations) shown as a collapsible card on the Dashboard tab.

**Files created:**
- `src/app/api/intelligence/pulse/route.ts` — POST endpoint, MiniMax streaming, returns `{ topTrends, hookPatterns, outliers, recommendations }`
- `src/features/intelligence/components/dashboard/PulseReportCard.tsx` — collapsible card with 4 sections, Generate button, loading state

**Files modified:**
- `src/features/intelligence/components/dashboard/DashboardView.tsx` — added `PulseReportCard` import and rendered it below LearningSignal

**Model:** MiniMax-M2.7-highspeed via MINIMAX_BASE_URL proxy (same as AI Chat)
**Context fed:** stats + trends + hookStats + insights data
**Status:** tsc --noEmit clean on all new/modified files
**Next:** Visual verification in browser

## 2026-04-07 — Audit: build fixes + gradient map + rough components

### Build errors fixed (3 blocking production)
1. **`CostsView.tsx:19`** — Missing `const PROVIDER_COLORS = {` declaration; 4 provider entries were orphaned object literals after `MONTHLY_BUDGET_CENTS` semicolon. Fixed by adding the declaration.
2. **`api/agents/anomaly/route.ts:8`** — `query: Function` not assignable to `FunctionReference<"query">`. Fixed by importing `FunctionReference` from `convex/server`.
3. **`api/agents/daily-summary/route.ts:10`** — Same `Function` → `FunctionReference` type error. Fixed identically.
4. Both `route.ts` files also had bare `model` reference (should be `MODEL` const) — fixed in both.
5. **`daily-summary/route.ts:32`** — `reduce<Record<string,number>>` initialized with `[]` (array, not object). Fixed with `Object.create(null)`.
6. **`CostsView.tsx:173,202`** — String index not assignable to `PROVIDER_COLORS` keys. Fixed with `as keyof typeof PROVIDER_COLORS` cast.

### Build result
```
○ /isso/intelligence  24.9 kB / 238 kB  (large — 4 tabs, all components)
```
Build passes ✓. Tailwind class ambiguity warnings remain (unrelated to Intelligence).

### Gradient audit
- **Found:** 21 files with hardcoded `linear-gradient(135deg, #ff0069, #833ab4)` — NOT 12 as documented
- **No CSS variable exists** for this gradient — need to create one
- **Fix approach:** Add to `src/app/globals.css` as `var(--grad-pink)` and replace all 21 occurrences
- Files span Intelligence + agents costs + drawer panels (not just Intelligence)

### Rough components (21st.dev upgrade targets — 8 files)
| Component | Status | Issue |
|-----------|--------|-------|
| `StatsBar.tsx` | Inline style objects | bg, border via `style={{}}` |
| `RatingSummaryBar.tsx` | Inline style objects | bgVar, border via `style={{}}` |
| `FormatChart.tsx` | Inline style objects | bg, border, bar fill via `style={{}}` |
| `NicheLeaderboard.tsx` | Inline style objects | bg, border, bar fill via `style={{}}` |
| `HookLineGallery.tsx` | Inline style objects | bg, border, gradient badge via `style={{}}` |
| `RuleCards.tsx` | Inline style objects | border, bgColor per rule color via `style={{}}` |
| `BarRow.tsx` | Inline style objects | bar segments via `style={{}}` |
| `PreferenceChart.tsx` | Inline style objects | Legend dot gradient via `style={{}}` |

All 8 use raw `<div>` with `style={{}}` — should be replaced with proper shadcn/ui or Tailwind-native card patterns.

**Next:** (1) Add `--grad-pink` CSS variable to globals.css, replace all 21 gradient strings. (2) Upgrade rough components to proper Tailwind patterns.
