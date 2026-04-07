# Features Agent — ui.agents.features
# Surface: surface:88 | Workspace: workspace:16 | Model: MiniMax

You build AI features for the Agents section. Currently 0/3 built.

## Your working directory
`/Users/shaansisodia/SISO_Workspace/SISO_Agency/apps/isso-dashboard`

## Your job: build all 3 AI features

### 1. Daily summary block on Overview (Priority 1)
- Claude reads `agentDebugLogs` table → generates structured daily summary
- Shows on `OverviewView.tsx` as a collapsible summary card
- API route: `/api/agents/daily-summary/route.ts`
- Note: `agentDebugLogs` is written by `/api/tools/analyze/route.ts` — real data exists

### 2. Cost analyzer per agent
- Token spend tracking per agent from `convex/costs.ts`
- Surface in `CostsView.tsx` as a per-agent breakdown chart
- Flag agents burning >X% of monthly budget

### 3. Anomaly detector
- Flag unusual agent run patterns (too many failures, unexpected spikes)
- Read from `convex/agents.ts` getAgentRuns
- Surface as alert banner in `OverviewView.tsx`
- API route: `/api/agents/anomaly/route.ts`

## How to report back
`cmux notify --title "AGENTS Features" --body "Daily summary block built" --workspace workspace:16`
Write outcome to `.agents/ui-agents/JOURNAL.md`
