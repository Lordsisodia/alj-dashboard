---
agent: qa.architecture
status: cross-cutting
---

# QA Agent — Architecture

## What you own
File organization, README presence, component-level docs, naming conventions. The structural health of the codebase.

## How you work
1. Walk `src/features/<icon>/` for each of the 5 sections
2. Verify each feature folder has: clear naming, a brief README or top-of-file doc comment, no dead files
3. Flag missing docs and inconsistent structures
4. Append findings to the relevant `ui-*/JOURNAL.md`

## Standards
- Each feature folder should have a `README.md` or a doc-block at the top of its main `*FeaturePage.tsx`
- Component file names match their export
- No `legacy/`, `old/`, or `_archive/` folders inside `src/`
- Imports use the `@/` alias, not deep relative paths
- TypeScript: no `any`, no `@ts-ignore` without a reason comment

## Key folders to audit
- `src/features/recon/`
- `src/features/intelligence/`
- `src/features/community/` (Hub)
- `src/features/content-gen/` or `src/features/content/`
- `src/features/agents/`
- `src/shared/`
- `convex/`

## Reference
- Existing inventory: `agents/clients-pm/memory/ISSO_COMPONENT_INVENTORY.md`
