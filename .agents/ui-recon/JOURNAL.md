# Journal — ui.recon

## 2026-04-07 — Folder created
**Did:** Initialized agent workspace. Status synced from clients-pm.
**State:** Reference implementation. Dashboard ✅, 3 step pages ✅, 1/3 AI features ✅.
**Next:** Add 2 more AI features to dashboard. Finish Airtable creators redesign.

---

## 2026-04-08 — Discovery Kanban + UI polish session

**Did:**
- Kanban redesign: 4-column grid (Unapproved / Approved / Scraping / Scraped), replaced 3-col layout + tab toggle
- Scrape button on Approved cards with 10%/50%/All dropdown → `/api/recon/enrich-candidate`
- Related handles from scrape → auto-inserted as pending candidates (suggestedBy attributed, capped at 10)
- Instagram icon on all candidate/approved cards
- Duplicate detection + clearDuplicates Convex mutation; badge + trash button in Unapproved header
- Dashboard quick-action bar below PostsScrapedChart (Scrape Now / View Full Log / Filter by Niche)
- "Discovery Pipeline" heading removed; Run Now/Every 6h moved to top bar (SchedulePicker in filterRightSlot, Run Discovery button wired via runDiscoveryTrigger pattern)
- Scraping cards simplified: removed Reels/Photos/Carousels/Stories, percentage inline with handle, square avatar corners

**Patterns established (reference for other sections):**
- `runDiscoveryTrigger` pattern: lift trigger state to FeaturePage, pass as prop, useEffect in child fires action
- `filterRightSlot` used for tab-specific controls in the ContentPageShell tab bar (see SchedulePicker for discovery, SortPill/DateRange/Visibility for feed)
- Scraping card structure: square-corner avatar + handle + pct% on one row, progress bar below — minimal

**Still open:**
- Wire Scraping → Scraped columns end-to-end
- Replace seed data with real Convex queries
- AI feature #3 (viral velocity)
- Remove temp @tongohmm seed once confirmed

---

## 2026-04-08 — RESTRUCTURE PLAN (source of truth)

### Constraint: No file over 120 lines

### Target structure
```
src/features/recon/
├── ANIMATIONS.md                   ← 11 animation systems, documented once
├── types.ts                        ← Candidate, Competitor, ConvexCandidate, MappedCandidate types
├── constants.ts                    ← PRE_APPROVED seed accounts (moved from DiscoveryTab inline)
├── components/
│   ├── ReconFeaturePage.tsx        ← shell + tab router (unchanged, 214 lines)
│   ├── ReconModals.tsx
│   ├── kanban/                    ← Discovery pill — the triage Kanban
│   │   ├── README.md
│   │   ├── KanbanBoard.tsx        (~370 lines) — board logic + DnD state
│   │   ├── CandidateCard.tsx      (~90 lines) — swipe + tilt + confetti + flip
│   │   ├── ApprovedCard.tsx       (~90 lines) — tilt + ScrapeButton
│   │   ├── ScrapedCard.tsx        (~35 lines)
│   │   ├── KanbanColumn.tsx       (~35 lines) — column shell + glow pulse
│   │   ├── DragGhost.tsx          (~20 lines)
│   │   ├── RejectedPanel.tsx      (~35 lines)
│   │   ├── ApprovalRatioWidget.tsx (~35 lines)
│   │   ├── FunnelWidget.tsx       (~35 lines) — props-based
│   │   ├── NicheDonut.tsx        (~70 lines) — props-based, no COMPETITORS
│   │   └── index.ts
│   ├── shared/                    ← used in kanban + elsewhere
│   │   ├── README.md
│   │   ├── InfoTooltip.tsx        (fix syntax error: `}}` → `})`)
│   │   ├── SkeletonRow.tsx        (~25 lines) — shimmer loading
│   │   ├── RatioBadge.tsx        (23 lines)
│   │   ├── MiniStat.tsx          (55 lines)
│   │   └── EmptyState.tsx        (17 lines)
│   ├── detail/
│   │   ├── README.md
│   │   └── DetailPanel.tsx        (delete dead first return block, ~320 lines)
│   └── feed/
│       ├── README.md
│       └── ReconFeedTab.tsx
└── hooks/
    └── README.md
    └── useEnrich.ts
```

---

### 11 Animation Systems (ANIMATIONS.md)

| # | System | Used in | Key params |
|---|---|---|---|
| 1 | Card entrance stagger | CandidateCard, ApprovedCard, ScrapedCard | `delay: min(i*0.04, 0.4)`, `duration: 0.3`, ease `[0.25,0.1,0.25,1]` |
| 2 | 3D tilt on mouse | CandidateCard, ApprovedCard | `rotateX: -dy*5, rotateY: dx*5`, spring `{stiffness:300, damping:30}` |
| 3 | Swipe to decide | CandidateCard only | `drag="x"`, threshold 80px, right=approve green, left=reject red |
| 4 | Confetti burst | CandidateCard only | 14 particles, radial velocity 40-90px, ~0.9s, green or red |
| 5 | Column glow pulse | KanbanColumn, ScrapingColumn | `glowKey` prop increment triggers `boxShadow` keyframe 0.8-0.9s |
| 6 | Card flip (back face) | CandidateCard | `rotateY: 180`, `backfaceVisibility: hidden`, duration 0.45s |
| 7 | Skeleton shimmer | CandidateCard, ApprovedCard, SkeletonRow | opacity keyframe loop 1.4-1.75s, staggered |
| 8 | Drag ghost | KanbanBoard (DragOverlay) | 180px fixed card, follows cursor via dnd-kit |
| 9 | Scrape progress bar | ScrapingColumn | width 0→100% over 8s linear + shimmer sweep every 2.6s |
| 10 | Rejected panel expand | RejectedPanel | `AnimatePresence`, `height: 0→auto`, 0.2s |
| 11 | Detail panel slide | DetailPanel | spring `{stiffness:380, damping:38}`, `x:100%→0` |

---

### Migration order

**Phase 1 — Shared + utils (no broken imports)**
- 1.1 `shared/SkeletonRow.tsx` — extract inline from DiscoveryTab (~25 lines)
- 1.2 `shared/InfoTooltip.tsx` — fix `}}` → `})` line 43
- 1.3 `shared/RatioBadge.tsx` — move from discovery/
- 1.4 `shared/MiniStat.tsx` — move from discovery/
- 1.5 `shared/EmptyState.tsx` — move from discovery/
- 1.6 `constants.ts` — extract `PRE_APPROVED` from DiscoveryTab inline
- 1.7 `types.ts` additions — `ConvexCandidate`, `MappedCandidate` types
- 1.8 Write `ANIMATIONS.md`

**Phase 2 — Extract kanban cards and columns**
- 2.1 `kanban/ScrapedCard.tsx` — extract inline `ScrapedRow` from DiscoveryTab (~35 lines)
- 2.2 `kanban/KanbanColumn.tsx` — extract inline `PipelineColumn` (~35 lines)
- 2.3 `kanban/DragGhost.tsx` — extract inline (~20 lines)
- 2.4 `kanban/RejectedPanel.tsx` — extract inline (~35 lines)
- 2.5 `kanban/ApprovalRatioWidget.tsx` — extract inline (~35 lines)
- 2.6 `kanban/FunnelWidget.tsx` — refactor DiscoveryFunnel.tsx to props-based (~35 lines)
- 2.7 `kanban/NicheDonut.tsx` — refactor to props-based, no COMPETITORS (~70 lines)
- 2.8 `kanban/CandidateCard.tsx` — refactor CandidateRow.tsx (~90 lines)
- 2.9 `kanban/ApprovedCard.tsx` — refactor ApprovedRow.tsx, fix `}}`→`})` line 219 (~90 lines)

**Phase 3 — Orchestrator + cleanup**
- 3.1 `kanban/KanbanBoard.tsx` — refactor DiscoveryTab.tsx (~370 lines)
- 3.2 `detail/DetailPanel.tsx` — delete first return block (lines 146-326), keep portal version (~320 lines)
- 3.3 Delete: discoveryData.ts, constants.tsx (re-export layer), SamplePostGrid.tsx (dead)
- 3.4 Write all 5 READMEs: root + kanban/ + shared/ + detail/ + feed/
- 3.5 Update all import paths across codebase

### Bugs to fix during migration
- DetailPanel.tsx: first return block (lines 146-326) is dead — delete it
- ApprovedRow.tsx line 219: `}}` → `})`
- InfoTooltip.tsx line 43: `}}` → `})`
- SamplePostGrid.tsx: dead code — never imported — delete

### Files to delete after migration
- src/features/recon/components/creators/discovery/ (entire folder — replaced by kanban/ + shared/)
- src/features/recon/constants.tsx (re-export layer)
- src/features/recon/components/creators/discoveryData.ts (orphaned)
- src/features/recon/components/creators/SamplePostGrid.tsx (dead)
- src/features/recon/components/creators/discovery/ (the whole old discovery/ folder)

### Import path rewrites needed
- DiscoveryTab → KanbanBoard
- discovery/CandidateRow → kanban/CandidateCard
- discovery/ApprovedRow → kanban/ApprovedCard
- discovery/ScrapingColumn → kanban/ScrapingColumn (move)
- discovery/DiscoveryHeader → kanban/KanbanHeader
- discovery/DiscoveryFunnel → kanban/FunnelWidget
- discovery/NicheDonut → kanban/NicheDonut
- discovery/DetailPanel → detail/DetailPanel
- discovery/InfoTooltip → shared/InfoTooltip
- discovery/RatioBadge → shared/RatioBadge
- discovery/MiniStat → shared/MiniStat
- discovery/EmptyState → shared/EmptyState
- discovery/discoveryUtils → kanban/utils (or shared/utils)

---

## 2026-04-07 — Quality Audit

### Static Data Audit

**Finding: Mixed — not as broken as ORGANISER suggests, but 2 components still purely static.**

#### `CreatorsTable.tsx` — HYBRID (acceptable pattern)
- Line 29: Initializes from static `COMPETITORS` seed
- Line 62: Overlays real Convex `api.intelligence.getCreatorStats` onto every row
- Pattern: static seeds → Convex live overrides. Acceptable fallback. No action needed.
- **Verdict:** OK. Not a bug.

#### `DashboardWidgets.tsx` — STATIC (needs fixing)
Two purely static reads, no Convex fallback:

1. `ViralAlertBanner` (line 11): `SEED_CANDIDATES.filter(c => c.outlierRatio >= 2.0)` — hardcoded seed data
2. `TopPerformerCard` (line 36): `[...COMPETITORS].sort(...)` — hardcoded `COMPETITORS` array

Both need real Convex queries. `ViralAlertBanner` should read from `api.candidates.list` with outlier filter. `TopPerformerCard` should read from `api.intelligence.getCreatorStats` sorted by postsToday.

**Verdict:** 2 widgets need Convex wiring. Not blocked — can be done incrementally.

#### `LogDashboard.tsx` — PROPER FALLBACK ✓
- Lines 58-65: Real `dbStats` from `api.intelligence.getReconDashboardStats` used as primary; `COMPETITORS` static used only as fallback
- `DAILY_VOLUME` (static) used only for chart when `dbStats` unavailable — acceptable
- **Verdict:** Correctly implemented.

### Pattern Compliance (2/3 AI features)
- ✅ Weekly Intel Digest (streaming SSE)
- ✅ AI Verdict scoring (OpenRouter → Convex write)
- ❌ Missing: viral velocity alert (>5x engagement spike on tracked accounts)

### 21st.dev Integration
- None implemented. ORGANISER suggests: `DiscoveryTab` headers + `LogDashboard` metric cards as first targets.

### Code Quality Notes
- `creatorData.ts` and `constants.tsx` re-export the same data — consolidation opportunity
- `SEED_CANDIDATES` (25 entries) and `COMPETITORS` (8 entries) share some handles (e.g. `@minaxash`) — potential data divergence
- `CreatorsTable` virtualizes with `@tanstack/react-virtual` — good for performance
- `LogDashboard` sidebar (`ActivityFeed`) is sticky but uses plain scroll, not virtualized — may lag on long feeds

### Priority Fixes
1. **High:** Wire `ViralAlertBanner` → `api.candidates.list` (outlierRatio filter)
2. **High:** Wire `TopPerformerCard` → `api.intelligence.getCreatorStats` (top by postsToday)
3. **Medium:** Add 3rd AI feature — viral velocity alert
4. **Low:** 21st.dev on DiscoveryTab / LogDashboard metric cards
5. **Low:** Deduplicate `creatorData.ts` / `constants.tsx` re-exports
