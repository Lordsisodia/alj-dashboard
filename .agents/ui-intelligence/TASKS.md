# Tasks — ui.intelligence

## Open (P1 — next session)
- [ ] 21st.dev upgrades: replace inline `style={{}}` in rough components
  - [ ] `StatsBar.tsx` — backgroundColor/border inline → Tailwind
  - [ ] `RatingSummaryBar.tsx` — per-chip bgVar inline → Tailwind
  - [ ] `FormatChart.tsx` — audit + replace inline styles
  - [ ] `NicheLeaderboard.tsx` — audit + replace inline styles
  - [ ] `HookLineGallery.tsx` — audit + replace inline styles
  - [ ] `RuleCards.tsx` — audit + replace inline styles
  - [ ] `BarRow.tsx` — audit + replace inline styles
  - [ ] `PreferenceChart.tsx` — audit + replace inline styles
  - [ ] Remove all hardcoded `linear-gradient(135deg, #ff0069, #833ab4)` strings (12+ files) → shared CSS var or Tailwind class

## Open (P2)
- [ ] Mirror Recon's card density and layout where applicable

## Done
- [x] **Qualify tab rebuild** — pure data page: QualifyTableView + QualifyKanbanView + OutlierPanel + StatsBar. Charts moved to Dashboard.
- [x] **QualifyTableView** — virtualised table, all columns, sortable, filter chips, Save Top 10%
- [x] **QualifyKanbanView** — 6-column kanban by baseline band
- [x] **OutlierPanel** — collapsible right panel, collapsed by default
- [x] **getQualifyPosts + saveTopPostsForPipeline** — Convex API added
- [x] **sonner installed** — toast notifications working
- [x] **Analysis tab rebuild** — AnalysisView is clean: AnalysisPipelineStrip → AnalysisQueue → AnalysedPostGrid → PostDetailDrawer
- [x] **AnalysisPipelineStrip** — funnel strip with real Convex counts (qualified → downloaded → analyzed)
- [x] **getAnalysisPipelineStats** — Convex query using `videoUrl` field (already in schema, same as r2Url)
- [x] **downloadPostToR2** — scaffolded action in convex/intelligence.ts (disabled in UI, tooltip "coming soon")
- [x] **Charts moved to Dashboard** — HookScoreDistribution, EmotionFrequency, HookLineGallery, RuleCards all render in DashboardView under "Analysis insights"
- [x] **AI feature 3: Pulse Report** — PulseReportCard on Dashboard, /api/intelligence/pulse/route.ts, MiniMax-backed weekly brief (all 3/3 AI features complete)
- [x] **Audit rough components** — list confirmed: StatsBar, RatingSummaryBar, FormatChart, NicheLeaderboard, HookLineGallery, RuleCards, BarRow, PreferenceChart all use inline style={{}}
