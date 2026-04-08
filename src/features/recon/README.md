# Recon — Competitor Intelligence

ISSO's candidate discovery and pipeline tracking product. Scrapes public Instagram/TikTok profiles, surfaces outlier performers, and manages the approval workflow through to tracked creators.

---

## Pipeline

```
Discovery  →  Creators  →  Pipeline  →  Community Feed
```

---

## Structure

```
src/features/recon/
├── README.md
├── types.ts                       ← Candidate, MappedCandidate, ConvexCandidate, Tab, DrawerState
├── constants.ts                   ← animation variants, PRE_APPROVED list, re-exports from creatorData
├── creatorData.ts                 ← computeProfileHealth, COMPETITORS, DAILY_VOLUME, LOG_ENTRIES
├── hooks/                        ← per-tab useQuery/useMutation hooks
└── components/
    ├── ReconFeaturePage.tsx       ← root shell: tab routing, modal orchestration
    ├── shared/                   ← shared recon primitives (RatioBadge, MiniStat, Sparkline, etc.)
    ├── discovery/                ← Kanban triage board (CandidateRow, ApprovedRow, DetailPanel, etc.)
    │   ├── charts/               ← NicheDonut, DiscoveryFunnel widgets
    │   ├── detail/               ← candidate detail panel
    │   ├── hooks/                ← discovery-specific hooks
    │   └── rows/                 ← CandidateRow, ApprovedRow row components
    ├── table/                    ← Creators tracking table
    │   ├── cards/                ← card variants
    │   ├── filters/              ← filter bar components
    │   ├── hooks/                ← table-specific hooks
    │   └── rows/                 ← table row components
    ├── detail/                   ← right-side candidate detail drawer
    │   └── widgets/              ← detail panel widgets
    ├── pipeline/                 ← Pipeline/LogDashboard tab
    │   └── funnel/               ← funnel stage components
    ├── feed/                     ← Community Feed tab
    ├── modals/                   ← AddCandidateModal, BulkImportModal, TrackProfileModal, TrackNicheModal
    └── icons/                   ← IgIcon
```

---

## The Four Tabs

### ① Discovery — Kanban triage board
**Route:** `/isso/recon` (default)

Drag-and-drop kanban with Pending / Approved / Rejected columns. Primary sort signal is **outlier ratio** (`avgViews ÷ followersRaw`). Candidate detail opens in a right-side panel.

**Kanban components** (`creators/discovery/`):
- `CandidateRow` — queue list item with avatar, meta, ratio badge, actions
- `ApprovedRow` — approved row with tilt and live scrape button
- `ScrapingColumn` — animated scrape progress column
- `NicheDonut` — niche distribution donut widget
- `DiscoveryFunnel` — stage funnel widget
- `DiscoveryHeader` — filter tabs (All / Pending / Approved / Rejected)
- `DetailPanel` — right-side candidate detail drawer
- `InfoTooltip` — hover info popover
- `discoveryUtils` — `fmtViews()`, `getRatioColor()`
- `ApprovedCard`, `ScrapedCard`, `DragGhost`, `RejectedPanel` — card primitives

### ② Creators — Active tracking table
**Route:** `/isso/recon?tab=creators`

Master list of approved/tracked creators with filter bar, sortable columns, profile health bar, 7-day sparklines. Click a row for `CreatorDetailView`.

### ③ Pipeline — Scraper operations log
**Route:** `/isso/recon?tab=log`

5-stage funnel (Basket → Scraped → Refined → Generated → Posted), activity feed, volume chart, per-creator `CreatorPipelineRow`.

### ④ Community Feed
**Route:** `/isso/recon?tab=feed`

Instagram-style grid of scraped posts. Sort, date range, visibility filters. Reuses Intelligence's feed components.

---

## Key types

```ts
Candidate          — raw scraped candidate data
MappedCandidate     — Candidate enriched with initials, avatarColor, sampleGradients, etc.
ConvexCandidate    — shape written to / read from Convex
CandidateStatus    — 'pending' | 'approved' | 'rejected'
```

---

## Animation systems (11 distinct)

Documented in `ANIMATIONS.md`.
