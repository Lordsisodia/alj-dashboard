# isso-dashboard Merge Plan

**Date:** 2026-04-11
**Repo:** github.com/Lordsisodia/alj-dashboard.git
**Current checkout:** `dev/isso-dashboard-v2` (at `508897f49`)

---

## 1. Branch Inventory

### main (production base)
- **Tip:** `c07f6d6de` — fix(auth): destructure useSignIn() for Clerk v7 compatibility
- **Content:** Stable base through recon dashboard restructure (`a6888d136`) plus the auth fix
- **Remote:** `origin/main` is in sync

### dev/isso-dashboard-v2 (active dev)
- **Tip:** `508897f49` — chore: track .claude config files for Bifrost infrastructure
- **23 commits ahead of merge-base** (`a6888d136`)
- **1 commit behind main** — the auth fix `c07f6d6de` was committed directly to main
- **Local is 1 commit ahead of origin** — `508897f49` (Bifrost config) is unpushed
- **Remote tip:** `196826ca4` (content-gen implementation)

### clean-main (local only, stale)
- **Tip:** `603eee318` — behind both main and dev
- Main has 5+ commits not in clean-main
- **Verdict:** Stale. Safe to delete.

### Feature branches (all local only)
| Branch | Tip | Unique commits vs dev | Status |
|--------|-----|----------------------|--------|
| `feat/analysis-ui-rebuild` | `12fad2df4` | 0 (all ancestors are in dev's history) | Fully superseded |
| `feat/dashboard-ui-fixes` | `380f7c1bc` | 0 | Fully superseded |
| `feat/insights-ui-rebuild` | `341896948` | 0 | Fully superseded |
| `feat/qualify-ui-fixes` | `eeebb011e` | 0 | Fully superseded |

All four feature branches have ZERO commits not already reachable from `dev/isso-dashboard-v2`. They are remnants from before their work was incorporated into dev. Safe to delete.

### Stash
- `stash@{0}`: WIP on `dev/isso-dashboard-v2: 9aa18abb7` — refactor(recon): deduplicate architecture, split giants, add feature template
- **Action required:** Inspect before any destructive operations. May contain in-progress recon refactor work.

### Worktree
- `worktree-agent-acfb4425` exists as a local branch — likely from a previous Bifrost agent session. Verify no uncommitted work before cleanup.

---

## 2. Key Questions Answered

### Are Hub and Content Gen files present in the working tree on dev?

**YES — both are fully present.**

**Content Gen** (commit `196826ca4`, 26 files changed, +1391/-762):
- Backend: `convex/replicate.ts`, `convex/contentGen.ts`, schema updates
- API routes: `src/app/api/replicate/webhook/route.ts`, `src/app/api/content-gen/upload-image/route.ts`
- UI: Full suite under `src/features/content-gen/components/` — Scenes, Generate, Gallery, Dashboard tabs
- Route pages: `src/app/isso/(content-gen)/contentgen/content-gen/` — scenes, gallery, generate, root

**Hub** (commit `9a2336c32`, 45 files changed, +4193/-1237):
- Backend: `convex/hub.ts` (new), `convex/intelligence.ts`, `convex/intelligenceNode.ts`
- UI: `src/features/hub-swipe/components/` — SwipeStack, AiAnalysisPanel, CriteriaChecklist, QuickAnnotate
- Dashboard: `src/features/community/components/dashboard/` — HubDashboardTab, HubQuickActions, HubSwipeActivityFeed, LastSessionCard, VaultHealthBar
- Approve: `src/features/community/components/approve/ApproveTabContent.tsx`

### What does main have vs dev?

- **main** has 1 unique commit: `c07f6d6de` (auth fix — `src/app/sign-in/[[...sign-in]]/page.tsx`, 1 file, 6 lines)
- **dev** has 23 unique commits: the full feature set (qualify, recon, intelligence, analyser, hub, media, content-gen, bifrost config)
- The auth fix `c07f6d6de` on main and `843ad492e` on dev are **identical patches** (same file, same change, cherry-picked in both directions). `git diff` between them produces empty output — no conflict content.

### Is a single merge safe?

**YES.** The topology is clean:

```
main:  ...─a6888d1─c07f6d6de (auth fix)
                 \
dev:              ├─843ad492e (same auth fix)─...21 more commits...─508897f49
```

The only divergence is the duplicated auth fix. Since both commits produce the identical file state, a merge will auto-resolve (Git recognizes identical changes on both sides).

**197 files changed, +19,777 / -4,027 lines** — large diff but all additive/iterative. No deletions of main-only content.

### Conflicts to watch for?

**LOW RISK.** Specifically:

1. **`src/app/sign-in/[[...sign-in]]/page.tsx`** — The auth fix exists on both branches with identical content. Git should auto-resolve. If it does produce a conflict marker, both sides have the same final state, so either resolution is correct.
2. **No other overlap** — main has no unique file changes beyond the auth fix. All 197 changed files in the diff are dev-only additions/modifications.

---

## 3. Recommended Merge Strategy

### Pre-merge (safety net)

```bash
# 1. Push the unpushed local commit to origin
cd /Users/shaansisodia/SISO_Workspace/SISO_Agency/apps/isso-dashboard
git push origin dev/isso-dashboard-v2

# 2. Tag the current main as a rollback point
git tag pre-merge-main main

# 3. Inspect the stash (decide keep or drop)
git stash show -p stash@{0} | head -100
```

### Merge (single operation)

```bash
# 4. Switch to main
git checkout main

# 5. Merge dev into main (no fast-forward to preserve history)
git merge --no-ff dev/isso-dashboard-v2 -m "merge: dev/isso-dashboard-v2 into main — full feature set (qualify, recon, intelligence, analyser, hub, content-gen, media)"
```

**Why single merge, not staged:**
- All 23 commits are sequential and interdependent (schema changes build on each other)
- No isolated "risky" commits that need separate validation
- The commits were already tested together on dev
- Splitting would create partial states where schema and UI are mismatched

### Post-merge verification

```bash
# 6. Verify no conflicts
git diff --check

# 7. Smoke test build
PATH="/opt/homebrew/bin:$PATH" npx next dev --port 3100
# Manually verify: /isso/content-gen, /isso hub dashboard, /isso intelligence

# 8. Push main
git push origin main
```

### Cleanup

```bash
# 9. Delete fully-merged feature branches
git branch -d feat/analysis-ui-rebuild
git branch -d feat/dashboard-ui-fixes
git branch -d feat/insights-ui-rebuild
git branch -d feat/qualify-ui-fixes

# 10. Delete stale clean-main
git branch -D clean-main
git push origin --delete clean-main

# 11. Inspect worktree branch
git worktree list
# If no active worktree uses it:
git branch -D worktree-agent-acfb4425

# 12. Handle stash (after inspecting in pre-merge step)
# If the recon refactor work is obsolete:
git stash drop stash@{0}
# If it has value, apply to a new branch:
# git stash branch feat/recon-refactor stash@{0}
```

---

## 4. Risk Assessment

| Risk | Likelihood | Impact | Mitigation |
|------|-----------|--------|------------|
| Auth fix conflict marker | Very Low | None (identical content) | Accept either side |
| Build failure after merge | Low | Medium | `pre-merge-main` tag for instant rollback |
| Stash contains needed work | Unknown | Low | Inspect before dropping |
| Convex schema mismatch | Low | High | Run `npx convex dev --once` immediately after merge |

---

## 5. Do NOT Do Yet

- Do NOT merge anything — this is analysis only
- Do NOT delete any branches until merge is verified
- Do NOT drop the stash until inspected
- Do NOT push the local `508897f49` commit until Shaan confirms it should be included

---

## Summary

The repo is in good shape. `dev/isso-dashboard-v2` contains ALL the work (Hub, Content Gen, Intelligence, Analyser, Recon, Qualify). The four feature branches are empty husks. The only divergence from main is a duplicated auth fix that will auto-resolve. A single `--no-ff` merge is the right move. Tag main first for safety, merge, build-test, push.
