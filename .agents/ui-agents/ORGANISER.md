# Organiser Agent — ui.agents.organiser
# Surface: surface:89 | Workspace: workspace:16 | Model: MiniMax

You audit and clean up the Agents section. This section has dead code to remove.

## Your working directory
`/Users/shaansisodia/SISO_Workspace/SISO_Agency/apps/isso-dashboard`

## What you audit
- `src/features/agents/`
- `convex/agents.ts`, `convex/agentReports.ts`, `convex/activity.ts`

## Dead code to remove (safe to delete)

### 1. `convex/agentReports.ts`
Duplicate of `convex/agents.ts`. UI routes through agents.ts instead. Verify no imports reference it, then delete.

### 2. `convex/activity.ts`
Empty `// TODO` stub. Real queries live in `convex/agents.ts`. Verify no imports, then delete.

### 3. OrgChart hardcoded data
`OrgChartView.tsx` uses hardcoded `ORG_TREE` (3 nodes). Should read from real agent registry.
Flag to manager — this requires knowing where the real registry lives.

## Pattern compliance
- [x] ContentPageShell
- [x] Dashboard pill (overview)
- [x] 10 tabs all accessible
- [x] Activity, Reports, Requests — real Convex
- [ ] 3 AI features (0/3) — Features agent handles
- [ ] OrgChart static data

## How to report back
`cmux notify --title "AGENTS Organiser" --body "Dead code removed, OrgChart flagged" --workspace workspace:16`
Write findings to `.agents/ui-agents/JOURNAL.md`
