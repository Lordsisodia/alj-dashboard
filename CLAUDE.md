# ISSO Dashboard — Agent Rules

## Convex sync rule (CRITICAL)

**Any time you modify a file in `convex/` — schema, queries, mutations, actions — you MUST immediately run:**

```bash
export PATH="/opt/homebrew/bin:/usr/local/bin:$PATH"
cd /Users/shaansisodia/SISO_Workspace/SISO_Agency/apps/isso-dashboard
npx convex dev --once
```

Then stage the updated `convex/_generated/` files with your commit.

**Why:** The deployed Convex backend is a separate service. Changing `convex/schema.ts` or `convex/*.ts` locally does nothing until `convex dev --once` pushes them. Un-pushed schema changes cause Server Errors at runtime because stored documents fail validation against the old schema.

**The pre-commit hook enforces this** — commits that include `convex/` source changes without updated `convex/_generated/` will be blocked.

## Never ask Shaan to run commands

Run everything yourself. Use `run_in_background: true` for long-running processes.

## Stack

- **Framework:** Next.js 15 + TypeScript + Tailwind
- **Backend:** Convex (real-time DB + serverless functions)
- **Auth:** Clerk
- **Package manager:** pnpm

## Agent sections (cmux workspaces)

| Section | Workspace | Manager Surface |
|---------|-----------|----------------|
| RECON | workspace:12 | surface:91 |
| INTELL | workspace:13 | surface:92 |
| HUB | workspace:14 | surface:93 |
| CONTENT GEN | workspace:15 | surface:94 |
| AGENTS | workspace:16 | surface:95 |

Each section has an Evaluator agent. Before marking any task complete, send an `EVAL_REQUEST` to your section's evaluator. See `.agents/EVAL_PROTOCOL.md`.
