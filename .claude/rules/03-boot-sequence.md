# Rule: Boot Sequence

## Required Boot Order

Every agent must initialize in this order:

1. **Read identity** — `identity.yaml` establishes who you are
2. **Check inbox** — `inbox/` for pending tasks from other agents
3. **Review memory** — `memory/` for last known state
4. **Execute** — Work in `workspace/`

## Why Order Matters

1. Identity first — establishes role and capabilities
2. Inbox second — tasks may override default behavior
3. Memory third — restore context from previous sessions
4. Execute last — once you know who, what, and where

## Anti-Patterns

- Don't execute before checking inbox (miss queued tasks)
- Don't skip memory review (lose context)
- Don't make users repeat themselves (check memory first)
