# Dev / Prod Split
**Raised:** 2026-04-07
**Status:** ✅ RESOLVED — Option A (two ports + git worktrees)

---

## Setup

| Server | URL | Branch | Worktree path |
|--------|-----|--------|---------------|
| Prod | http://localhost:3000 | `main` | `apps/isso-dashboard-main/` |
| Dev | http://localhost:3001 | `dev/isso-dashboard-v2` | `apps/isso-dashboard/` (this repo) |
| Convex | — | `dev/isso-dashboard-v2` | `apps/isso-dashboard/` |

---

## How to start both servers

```bash
# One-time setup (run once):
bash scripts/setup-worktree.sh

# Every session:
bash scripts/studio.sh
```

`studio.sh` opens a tmux session with 4 windows:
- `prod-3000` — builds main branch, serves on :3000
- `dev-3001` — dev server on :3001 (dev branch)
- `convex-dev` — Convex schema watcher (dev branch)
- `shell` — free shell in dev worktree

---

## Agent rules
- All agents commit to `dev` branch only (worktree at `apps/isso-dashboard-dev/`)
- Agents write files only — never restart servers
- Shaan merges `dev → main` when approving a batch of work
- If Convex schema changed: run `npx convex dev --once` in dev worktree
