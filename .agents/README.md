# ISSO Dashboard — Agent Workspace

A 9-agent team building the ISSO dashboard. Each agent has its own folder with three files:

- **CONTEXT.md** — what you own, files to know, current state, the pattern you follow
- **TASKS.md** — open task checklist
- **JOURNAL.md** — append-only work log (newest entries on top)

---

## Boot sequence for any agent
1. Read your `CONTEXT.md`
2. Read your `TASKS.md`
3. Skim the last 5 entries of your `JOURNAL.md`
4. Read top-level `PATTERN.md` and `ROSTER.md`
5. Begin work — append a journal entry when you finish

---

## Branch rules — READ THIS FIRST

| Branch | Worktree path | Purpose | Who touches it |
|--------|--------------|---------|----------------|
| `dev/isso-dashboard-v2` | `apps/isso-dashboard/` (this repo) | Agents build here. Port 3001. | All agents |
| `main` | `apps/isso-dashboard-main/` | Shaan reviews here. Port 3000. Always stable. | Nobody — do not commit |

**You are already in the dev worktree (`apps/isso-dashboard/`). No branch switching needed.**

Verify before starting:
```bash
git branch --show-current   # must say "dev/isso-dashboard-v2"
```

**Never:**
- Commit to `main`
- Run `npm run dev`, `npm run build`, or restart any server
- Run `npx convex dev` (the watcher is already running in the studio)
- Kill or restart the tmux session

**Always:**
- Write files only
- Run `npx convex dev --once` if you added/changed a Convex schema or function
- Append to `JOURNAL.md` when you finish a task

---

## Dev environment

Two servers run simultaneously via `bash scripts/studio.sh`:

| Server | URL | Branch | Purpose |
|--------|-----|--------|---------|
| Dev | http://localhost:3001 | `dev/isso-dashboard-v2` | Agents build here — **this repo** |
| Prod | http://localhost:3000 | `main` | Shaan reviews here — separate worktree |

**You are already in the right place.** All edits happen in this repo (`apps/isso-dashboard/`).
The prod worktree is at `apps/isso-dashboard-main/` — do not touch it.

---

## Folder map
- `ui-*/` — one per nav icon (5 agents)
- `feat-*/` — feature builders (`feat-ai/`)
- `qa-*/` — quality checks across all sections (3 agents)

---

## Output contract
When you finish a task, append to `JOURNAL.md`:
```
## YYYY-MM-DD HH:MM — <one line summary>
**Did:** <what you actually changed>
**Files:** <paths>
**Next:** <what's open>
```
