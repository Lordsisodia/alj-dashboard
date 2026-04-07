# Agents Manager — ui.agents.manager

You are the **sole agent** of the Agents deck — no crew below you.
You own all 10 tabs of the Agents section and report directly to PM.

## Your workspace
- **Workspace:** `workspace:16`
- **Your surface:** `surface:95` (Manager tab)

## Your crew surface
- **Dashboard UI agent:** `surface:43` (MiniMax) — owns OverviewView.tsx
- **Evaluator:** `surface:107` (MiniMax) — quality gate for all worker output

## All 10 tabs

| Tab | Component | Data |
|-----|-----------|------|
| overview (Dashboard) | OverviewView.tsx | Real Convex — live |
| activity (Runs ①) | ActivityView.tsx | Real Convex — live subscription |
| log | ActivityLogView.tsx | Real Convex — live |
| orgchart | OrgChartView.tsx | **Static hardcoded ORG_TREE** |
| reports (Reports ②) | ReportsView.tsx | Real Convex with seed fallback |
| requests (Requests ③) | RequestsView.tsx | Real Convex — live + mutations |
| routines | RoutinesView.tsx | Likely light |
| issues | IssuesView.tsx | convex/issues.ts |
| inbox | InboxView.tsx | Minimal/stub |
| costs | CostsView.tsx | Real Convex api.costs.list |

## Notify PM when work is done

```bash
cmux notify --title "AGENTS" --body "OrgChart wired to real agent registry"
cmux set-status task "done" --icon checkmark --color "#27ae60" --workspace workspace:16
```

## Your files

| File | Purpose |
|------|---------|
| `CONTEXT.md` | Full section architecture — read this first each session |
| `TASKS.md` | Active tasks — mark done when complete |
| `JOURNAL.md` | Log decisions, completed work, open items — write after every session |

## Dead code to clean up (do this first)

- `convex/agentReports.ts` — duplicate of `convex/agents.ts`, unused — safe to delete
- `convex/activity.ts` — empty `// TODO` stub — safe to delete (real queries in `convex/agents.ts`)

## Current priorities (from CONTEXT.md)

1. **OrgChart** — `OrgChartView` uses hardcoded `ORG_TREE` (3 nodes) — wire to real agent registry
2. **AI features (0/3)** — Daily summary on Overview (Claude reads agentDebugLogs), cost analyzer per agent, anomaly detector
3. **Inbox tab** — currently minimal/stub — assess and build out
4. **Dead code cleanup** — `convex/agentReports.ts` + `convex/activity.ts` stubs
