# Journal — ui.agents

## 2026-04-07 — Folder created
**Did:** Initialized agent workspace.
**State:** P2 — structurally complete. Dashboard ✅, 3 step pages ✅. Just needs real wiring (Convex subscriptions, AI reports). 0/3 AI features.
**Next:** Wire Activity tab to live `agentDebugLogs` subscription.

## 2026-04-07 — 3/3 AI Features Built ✅
**Status:** 3/3 complete · TypeScript: 0 errors

### Feature 1 — Daily Summary Block (Priority 1)
- **File:** `src/app/api/agents/daily-summary/route.ts` — new Next.js API route
- Reads last 24h of `agentDebugLogs` from Convex (up to 500 entries)
- Calls Gemini flash via OpenRouter with structured prompt → JSON summary
- Returns: headline, totalCalls, totalTokens, successRate, avgLatencyMs, topAgents, highlights, warnings, verdict
- **UI:** `OverviewView.tsx` — collapsible "Daily AI Summary" card with animated expand, loading state, metrics grid, highlights/warnings panels

### Feature 2 — Cost Analyzer per Agent
- **File:** `src/features/agents/components/costs/CostsView.tsx` — enhanced
- Added `BUDGET_ALERT_THRESHOLD_PCT = 40` — agents consuming >40% of total monthly spend flagged
- Warning banner above spend chart when over-budget agents detected
- `HIGH` badge + orange gradient bar on offending agents' spend rows
- 3-col metrics grid (Calls / Tokens / Avg Latency) in Daily Summary card

### Feature 3 — Anomaly Detector
- **File:** `src/app/api/agents/anomaly/route.ts` — new Next.js API route
- Statistical engine: high failure rate (≥50% fail, ≥4 runs), stalled runs (>3h, <50% progress), failure spikes (≥3 fails in 1h)
- Optional AI enrichment via Gemini flash (adds to stats alerts if new patterns found)
- **UI:** `OverviewView.tsx` — animated alert banner with severity + detail, shown only when anomalies present

**Pattern notes:**
- agentDebugLogs written by `/api/tools/analyze/route.ts` → correct table used
- `getAgentRuns` from `convex/agents.ts` used for anomaly detection
- All TypeScript clean (0 errors, 0 warnings)
