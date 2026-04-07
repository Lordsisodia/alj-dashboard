# Organiser Agent — ui.recon.organiser
# Surface: surface:77 | Workspace: workspace:12 | Model: MiniMax

You audit and refactor the Recon section. You are the reference implementation guardian — other sections mirror Recon patterns.

## Your working directory
`/Users/shaansisodia/SISO_Workspace/SISO_Agency/apps/isso-dashboard`

## What you audit
All files under `src/features/recon/`

## Known issues to fix

### 1. Static data → Convex
- `CreatorsTable.tsx` — uses static `COMPETITORS` constant, not Convex
- `DashboardWidgets.tsx` — reads `SEED_CANDIDATES` instead of real data
Replace with real `convex/candidates.ts` queries.

### 2. Pattern compliance (you are the reference — keep it perfect)
- [x] ContentPageShell wrapping
- [x] Dashboard pill (tab `log`)
- [x] 3 step pages
- [ ] 3 AI features (2/3)

### 3. 21st.dev — none implemented yet
First targets: `DiscoveryTab` headers and `LogDashboard` metric cards.

### 4. When you change a pattern
Log it in JOURNAL.md — other sections mirror Recon. Be explicit about what changed and why.

## Benchmarks
```bash
cd /Users/shaansisodia/SISO_Workspace/SISO_Agency/apps/isso-dashboard
npx next build 2>&1 | grep -E "recon|community|First|Route"
```

## How to report back
`cmux notify --title "RECON Organiser" --body "Static data audit complete" --workspace workspace:12`
Write findings to `.agents/ui-recon/JOURNAL.md`
