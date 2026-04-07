---
agent: ui.agents
icon: ⌘5
status: mostly-complete
---

# UI Agent — Agents

## What you own
The **Agents** nav icon (⌘5) — monitor phase. Visibility into background automation: live activity, reports, requests, costs, org chart, routines, issues.

## Pattern
Follows the standard: `ContentPageShell` + internal `useState<Tab>` + `AnimatePresence`.

## Routes
- `/isso/agents` → `src/app/isso/agents/page.tsx` → renders `<AgentsFeaturePage />`

## Main orchestrator
`src/features/agents/components/AgentsFeaturePage.tsx`
- **10 internal tabs** (Shaan confirmed all fine as-is)
- Default tab: `overview` (the dashboard pill)

## Tab → component map
| Tab id | Label | Component | Data |
|--------|-------|-----------|------|
| `overview` | Dashboard | `components/overview/OverviewView.tsx` | Real Convex `api.agents.getOverview`, `getAgentRuns`, `getActivityLog` |
| `activity` | Runs ① | `components/activity/ActivityView.tsx` | Real Convex `api.agents.getAgentRuns` (live subscription, auto-seeds) |
| `log` | Log | `components/log/ActivityLogView.tsx` | Real Convex `api.agents.getActivityLog` |
| `orgchart` | Org Chart | `components/orgchart/OrgChartView.tsx` | Hardcoded static `ORG_TREE` (3 nodes) |
| `reports` | Reports ② | `components/reports/ReportsView.tsx` | Real Convex `getAgentReports` with seed fallback via ErrorBoundary |
| `requests` | Requests ③ | `components/requests/RequestsView.tsx` | Real Convex `getFeatureRequests` + `submitRequest` (live, auto-seeds) |
| `routines` | Routines | `components/routines/RoutinesView.tsx` | Unknown — likely lighter |
| `issues` | Issues | `components/issues/IssuesView.tsx` | `convex/issues.ts` |
| `inbox` | Inbox | `components/inbox/InboxView.tsx` | Minimal/stub |
| `costs` | Costs | `components/costs/CostsView.tsx` | Real Convex `api.costs.list` |

## Dashboard pill (`components/overview/OverviewView.tsx`)
- "System Operational" health banner with live green pulse dot + % success rate
- 4 metric tiles: Active Agents, In Progress, Month Spend, Pending Approvals — all from `api.agents.getOverview`
- 14-day stacked run-activity bar chart (green = completed, red = failed) from `api.agents.getAgentRuns`
- "Recent Activity" mini-panel — last 6 events from `api.agents.getActivityLog` via `ActivityLogList`

## Key component details
- `ActivityCard.tsx` — animated progress bar, live-dot ping, per-status colors, retry button — polished
- `ReportCard.tsx` / `ReportInsights.tsx` — expandable, color-coded by category, numbered insights — clean
- `OrgChartView.tsx` — custom SVG pan/zoom canvas, dot-grid background, dashed gradient edges — impressive but static
- `RequestsView.tsx` — SLA countdown pill, animated inline form, live Convex reads/writes — production-ready

## Convex files used
- `convex/agents.ts` — `getAgentRuns`, `getAgentReports`, `getFeatureRequests`, `getOverview`, `getActivityLog`, `retryRun`, `addRun`, `submitRequest`, `seedAgents`, `seedActivityLog`
- `convex/costs.ts` — `list`, `seed`
- `convex/issues.ts` — used by IssuesView
- `convex/routines.ts` — used by RoutinesView
- `convex/agentDebugLogs.ts` — **NOT used by Agents section** — belongs to Tools section (`src/features/tools/`)
- `convex/activity.ts` — **Empty stub** (`// TODO`) — actual queries in `convex/agents.ts`
- `convex/agentReports.ts` — **Dead code** — UI routes through `convex/agents.ts` instead

## Important: agentDebugLogs ≠ Agents section
The `agentDebugLogs` table is written by `/api/tools/analyze/route.ts` and read by `src/features/tools/`. The Agents section uses the `activity` table via `api.agents.getActivityLog`.

## AI features (0/3)
None. `requests/README.md` mentions planned "Claude AI triage assist" for requests — not built.
Suggestions:
1. Daily summary block on Overview (Claude reads `agentDebugLogs` → structured summary)
2. Cost analyzer per agent (token spend tracking)
3. Anomaly detector (flag unusual agent run patterns)

## Dead code to clean up
- `convex/agentReports.ts` — duplicate, unused (qa.refactor task)
- `convex/activity.ts` — empty stub (qa.refactor task)
- `OrgChartView` hardcoded `ORG_TREE` — should read from real agent registry

## Pattern compliance
- [x] `ContentPageShell` wrapping
- [x] Dashboard pill (tab `overview`)
- [x] 10 tabs all accessible (Shaan confirmed fine)
- [x] Activity, Reports, Requests — real Convex (live subscriptions)
- [ ] 3 AI features (0/3)
- [ ] Wire OrgChart to real agent registry
