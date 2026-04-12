# Rule: Persistent State Management

## The File System is Truth

Never rely on session memory for project history. Always query the `memory/` directory.

## Atomic Memory Updates

After completing a task, append a summary to `memory/journal.md` including:
- Task ID
- Outcome
- "Next Step" for the next session

## Context Rehydration

Upon initial boot, if the user asks "Where were we?", read the last entry in `memory/journal.md`.

## No Deletions

Never delete from `memory/ARCHIVE/`. Move completed work from `workspace/` to `memory/ARCHIVE/` to keep the active context clean.

## State File

Update `memory/state.json` with current status:
- `Idle` — Waiting for tasks
- `Working` — Active task in progress
- `Blocked` — Waiting on external dependency
- `Error` — Task failed, needs attention
