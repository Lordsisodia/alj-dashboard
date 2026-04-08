# Discovery — Kanban triage board

The Discovery tab. Owns the kanban-style triage flow for incoming creator candidates: columns, drag-and-drop, candidate rows, the right-hand detail panel, and the discovery-specific charts and hooks. It does NOT own the Creators master table (see `../table/`) or the operational pipeline view (see `../pipeline/`).

---

## Component map

| File | Purpose |
|------|---------|
| `DiscoveryTab.tsx` | Top-level orchestrator. Wires Convex data, drag state, glow pulses, and renders the pipeline grid. |
| `DiscoveryPipeline.tsx` | The kanban grid (4 columns + sidebar widgets). |
| `DiscoveryHeader.tsx` | Header bar with title, counts, action buttons. |
| `DiscoveryStats.tsx` | `computeDiscoveryStats` helper plus the stats display. |
| `DiscoveryFunnel.tsx` | Funnel widget showing pending → approved → scraped. |
| `DiscoveryColumn.tsx` | A single kanban column (legacy wrapper). |
| `PipelineColumn.tsx` | Column with drop zone, glow pulse, and scroll behavior. |
| `ScrapingColumn.tsx` | Live scrape progress column shown during enrichment. |
| `PipelineStats.tsx` | Per-column count summary. |
| `ApprovalRatioWidget.tsx` | Approval rate ratio bar. |
| `InfoTooltip.tsx` | Hover popover used by column headers and stats. |
| `dnd.tsx` | DnD primitives: `DraggableCard`, `DroppableZone`, `DragGhost`, `ColumnId` type. |
| `data.ts` | Avatar colors, sample gradients, formatters, `convexToCandidate` mapper, `MappedCandidate` type. |
| `discoveryUtils.ts` | `fmtViews`, `getRatioColor` — discovery-specific formatters. |

---

## Data flow

`DiscoveryTab` reads pending/approved/scraped/rejected candidates from Convex and runs them through `convexToCandidate` to produce `MappedCandidate[]`. Drag handlers (`useDndHandlers`) and approve/reject/enrich actions (`useDiscoveryActions`) wrap the relevant Convex mutations. The detail panel reads from the selected `MappedCandidate` only — no extra queries.

---

## Subfolder guide

| Folder | Contents |
|--------|---------|
| `rows/` | Kanban row components: `CandidateRow`, `ApprovedRow`, `ScrapedRow`, `RejectedPanel`. |
| `detail/` | Right-side candidate detail drawer: `DetailPanel`, `DetailHeader`, `DetailContent`, `DetailStats`, `DetailActions`, `VerdictSection`. |
| `charts/` | Discovery analytics: `NicheDonut`, `NicheBreakdownChart`, `FollowerScaleChart`, `OutlierRatioChart`, `EngagementChart`, `SourceChart`, `OutlierCard`. |
| `hooks/` | Action hooks: `useDiscoveryActions`, `useDndHandlers`, `useEnrichCandidate`, `useDetailActions`. |
