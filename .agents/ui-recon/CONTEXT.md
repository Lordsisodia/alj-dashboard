---
agent: ui.recon
icon: ⌘1
status: reference-implementation
---

# UI Agent — Recon

## What you own
The **Recon** nav icon (⌘1) — collect phase. Scrape competitors, track creators, surface community feed.

## Pattern
Follows the standard: `ContentPageShell` + internal `useState<Tab>` + `AnimatePresence`.
**You are the reference implementation.** When you change a card, layout, or component — note it in JOURNAL.md so other agents can mirror it.

## Routes
- `/isso/recon` → `src/app/isso/recon/page.tsx` → renders `<ReconFeaturePage />`
- `/isso/community` → `src/app/isso/community/page.tsx` → renders `<CommunityFeaturePage />` (Hub section, but Community Feed tab delegates here)

## Main orchestrator
`src/features/recon/components/ReconFeaturePage.tsx`
- 4 internal tabs: `log` (Dashboard), `discovery`, `creators`, `feed`
- Default tab: `log`
- Wrapped in `ContentPageShell`

## Tab → component map
| Tab id | Label | Component | Data |
|--------|-------|-----------|------|
| `log` | Dashboard | `components/creators/LogDashboard.tsx` | Real Convex + mock fallback pattern |
| `discovery` | Discovery | `components/creators/DiscoveryTab.tsx` | Real Convex (`api.candidates.*`) |
| `creators` | Creators | `components/creators/CreatorsTable.tsx` | Static `COMPETITORS` constant (NOT Convex) |
| `feed` | Feed | `components/ReconFeedTab.tsx` → `intelligence/feed/FeedView.tsx` | Real Convex (`api.intelligence.getFeed`) |

## Dashboard pill components (`components/creators/`)
- `LogDashboard.tsx` — WeeklyDigestCard + PipelineFunnel + metric cards + PostsScrapedChart + ScrapingReport + ActivityFeed
- `WeeklyDigestCard.tsx` — AI Weekly Intel Digest (streaming SSE via `/api/recon/digest`)
- `DashboardWidgets.tsx` — ViralAlertBanner + stat widgets
- `ActivityFeed.tsx` — Live activity sidebar
- `PostsScrapedChart.tsx` / `VolumeChart.tsx` — Volume charts
- `PipelineFunnel.tsx` — Funnel (candidates → tracking)

## Discovery tab components (`components/creators/discovery/`)
`DiscoveryTab.tsx`, `CandidateRow.tsx`, `DetailPanel.tsx`, `DiscoveryFunnel.tsx`, `DiscoveryHeader.tsx`, `ScrapingColumn.tsx`, `NicheDonut.tsx`, `RatioBadge.tsx`, `SamplePostGrid.tsx`

## Creators tab components (`components/creators/`)
`CreatorsTable.tsx`, `CreatorCard.tsx`, `CreatorDetailView.tsx`, `CreatorsFilterBar.tsx`, `BulkActionBar.tsx`, `TableToolbar.tsx`, `Sparkline.tsx`, `ScoreBadge.tsx`

## Modals
`components/ReconModals.tsx`, `components/modals/AddCandidateModal.tsx`, `components/modals/BulkImportModal.tsx`, `components/modals/TrackNicheModal.tsx`, `components/modals/TrackProfileModal.tsx`

## Hooks
`hooks/useEnrich.ts` — calls `/api/recon/enrich-candidate` (Apify IG scrape) + `/api/recon/verdict` (AI scoring)

## Convex files used
- `convex/candidates.ts` — `list`, `upsert`, `updateStatus`, `patchVerdict`, `seedPreApproved`
- `convex/intelligence.ts` — `getReconDashboardStats`, `getTrends`, `getRecentActivity`, `getDailyScrapedVolume`, `getFeed`
- `convex/trackedAccounts.ts` — `approveCandidate`, `isTracked`, `upsertEnriched`

## AI features (1/3)
1. ✅ **Weekly Intel Digest** — `WeeklyDigestCard.tsx` → `/api/recon/digest/route.ts` → OpenRouter `qwen/qwen3.6-plus:free`, streaming SSE, cached in localStorage
2. ✅ **AI Verdict scoring** — `/api/recon/verdict/route.ts` → OpenRouter Gemini 2.0 Flash Lite (with fallbacks) → `HIRE/WATCH/PASS` + score, written to Convex via `candidates.patchVerdict`
3. ❌ **Missing** — suggest: viral velocity alert (flag >5x engagement spike on tracked accounts)

## Component quality
- **Polished:** `WeeklyDigestCard`, `DiscoveryTab`, `ReconFeaturePage`, `LogDashboard`
- **Rough:** `CreatorsTable` (static data), `DashboardWidgets` (reads `SEED_CANDIDATES`)
- **21st.dev:** None — all custom Tailwind + Framer Motion

## Pattern compliance
- [x] `ContentPageShell` wrapping
- [x] Dashboard pill (tab `log`)
- [x] 3 step pages (Discovery, Creators, Feed)
- [ ] 3 AI features (2/3 — needs 1 more)
