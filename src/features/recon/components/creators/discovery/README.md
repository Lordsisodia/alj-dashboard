# Discovery — Kanban triage board

Discovery tab (`DiscoveryTab.tsx`) is the kanban orchestrator. All sub-components live in this folder.

---

## File map

```
discovery/
├── README.md              ← this file
├── index.ts               ← barrel: exports everything below
│
├── DiscoveryTab.tsx      ← orchestrator (~335 lines), imports from ./discovery
│
├── data.ts               ← AVATAR_COLORS, SAMPLE_GRADIENTS, PRE_APPROVED,
│                           stableNum, fmtFollowers, getInitials, convexToCandidate
│                           Re-exports types from src/features/recon/types.ts
│
├── dnd.tsx               ← DraggableCard, DroppableZone, DragGhost
│
├── components:
│   ├── PipelineColumn.tsx    ← column with drop zone, glow pulse, scroll
│   ├── ApprovalRatioWidget.tsx ← approval rate bar
│   ├── RejectedPanel.tsx      ← collapsed rejected candidates list
│   ├── ScrapedRow.tsx         ← scraped candidate row
│   ├── SkeletonRow.tsx        ← shimmer loading placeholder
│   ├── CandidateRow.tsx       ← candidate list item with swipe/tilt
│   ├── ApprovedRow.tsx        ← approved row with live scrape button
│   ├── ScrapingColumn.tsx      ← live scrape progress column
│   ├── NicheDonut.tsx         ← niche distribution donut
│   ├── DiscoveryFunnel.tsx     ← pipeline funnel widget
│   ├── DiscoveryHeader.tsx     ← header with stats
│   ├── DetailPanel.tsx         ← right-side candidate detail drawer
│   ├── InfoTooltip.tsx          ← hover popover tooltip
│   ├── EmptyState.tsx           ← empty state per filter
│   ├── RatioBadge.tsx           ← outlier ratio pill
│   ├── MiniStat.tsx             ← metric card with count-up
│   ├── OutlierRatioChart.tsx    ← outlier ratio histogram
│   ├── NicheBreakdownChart.tsx  ← niche distribution pie
│   └── SourceChart.tsx          ← source breakdown pie
│
└── discoveryUtils.ts    ← fmtViews(), getRatioColor() — domain colours
```

---

## Types

Types live in `src/features/recon/types.ts` and are re-exported through the barrel:

```ts
CandidateStatus     = 'pending' | 'approved' | 'rejected'
ColumnId            = 'unapproved' | 'approved' | 'scraped'
ConvexCandidate    = raw Convex document shape
MappedCandidate    = Candidate + _convexId + avatarUrl + enrichStatus
```

---

## Barrel usage

```ts
import {
  DiscoveryHeader,
  CandidateRow,
  PipelineColumn,
  ApprovalRatioWidget,
  PRE_APPROVED,
  convexToCandidate,
  type MappedCandidate,
} from './discovery';
```

---

## Animation systems (from ANIMATIONS.md)

| System | Component |
|---|---|
| Entrance stagger | All 4 kanban columns, CandidateRow, ApprovedRow |
| 3D tilt | CandidateRow, ApprovedRow |
| Swipe to decide | CandidateRow |
| Confetti burst | CandidateRow on approve |
| Column glow pulse | PipelineColumn (glowKey prop) |
| Card flip | CandidateRow |
| Skeleton shimmer | SkeletonRow |
| Drag ghost | DragGhost |
| Scrape progress | ScrapingColumn |
| Rejected panel expand | RejectedPanel |
| Detail panel slide-in | DetailPanel |
