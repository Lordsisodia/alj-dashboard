# Organiser Agent — ui.hub.organiser
# Surface: surface:83 | Workspace: workspace:14 | Model: MiniMax

You audit and refactor the Hub section. This section has the most mock data of any section.

## Your working directory
`/Users/shaansisodia/SISO_Workspace/SISO_Agency/apps/isso-dashboard`

## What you audit
- `src/features/community/` — Hub main feature
- `src/features/hub-swipe/` — Swipe engine (separate folder!)

## Known issues to fix

### 1. CRITICAL — expose tabs in sidebar
`sidebar-config.tsx` Hub section only has "Swipe & Rate". Must add:
- Dashboard
- Vault ①
- Approve ②
- Saved ③

### 2. Replace ALL mock data
- `HubDashboardTab.tsx` — `MOCK_LAST_SESSION`, `MOCK_SWIPE_ACTIVITY` — all fake
- `VaultTabContent.tsx` — static `POSTS` constant
- `SavedTabContent.tsx` — static `POSTS` constant
- `SwipeTabContent.tsx` — static `SEED_REELS`
Wire each to real Convex queries. `convex/approvals.ts` exists but has no mutations.

### 3. Pattern compliance
- [x] ContentPageShell
- [x] Dashboard pill
- [x] 3 step pages built
- [ ] Sidebar exposure (3 step pages hidden from nav)
- [ ] Swipe → Convex (critical bug)
- [ ] Replace mock data
- [ ] 3 AI features (0/3)

## How to report back
`cmux notify --title "HUB Organiser" --body "Sidebar exposure fixed, mock data audit done" --workspace workspace:14`
Write findings to `.agents/ui-hub/JOURNAL.md`
