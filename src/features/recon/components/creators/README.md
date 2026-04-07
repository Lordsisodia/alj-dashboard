# Creators — Tab contents

All tab bodies under the ReconFeaturePage shell. Each tab is a separate component.

---

## Tab components

| File | Tab | Purpose |
|---|---|---|
| `DiscoveryTab.tsx` | ① Discovery | Kanban board — stateful drag-and-drop with 4 columns |
| `CreatorsTable.tsx` | ② Creators | Master tracked creator list with filters, health bars, sparklines |
| `CreatorDetailView.tsx` | ② (drill-down) | Full creator profile + reels feed |
| `LogDashboard.tsx` | ③ Pipeline | Scraper operations: funnel, volume chart, activity feed |
| `ReconFeedTab.tsx` | ④ Community Feed | Feed grid reusing Intelligence components |

---

## Sub-folders

| Path | Contents |
|---|---|
| `discovery/` | Discovery pill sub-components: CandidateRow, ApprovedRow, DetailPanel, MiniStat, RatioBadge, NicheDonut, InfoTooltip, DiscoveryFunnel, ScrapingColumn, DiscoveryHeader, EmptyState |
| `funnel/` | `funnelData.tsx`, `StagePill.tsx` |
| `tableUtils.ts` | Sort/filter helpers for CreatorsTable |

---

## Discovery sub-components (`discovery/`)

These are used by DiscoveryTab (original) and KanbanBoard (new). They live here because DiscoveryTab orchestrates them.

**Important:** `InfoTooltip` here (`discovery/InfoTooltip.tsx`) is the canonical one. It takes a `text` prop only — no children.

---

## Constants re-exports

`constants.ts` at feature root re-exports from `creatorData.ts`:
- `computeProfileHealth` — 0–100% enrichment score
- `COMPETITORS` — 8 tracked account seeds
- `DAILY_VOLUME` — 14-day scrape volume series
- `LOG_ENTRIES` — sample activity log
- `type LogStatus`

`PRE_APPROVED` list lives in `constants.ts` (the seed handles).
