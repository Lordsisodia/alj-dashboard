# Route Rename Plan: `/isso` to Dashboard-Specific Roots

**Date:** 2026-04-11
**Status:** READY FOR EXECUTION
**Estimated complexity:** HIGH (36 files, 5 route groups, ~200 href replacements)

---

## Context

The isso-dashboard currently nests all dashboards under a single `/isso` route prefix. This plan renames routes to give each dashboard its own top-level root, improving URL clarity and enabling independent middleware protection per dashboard.

### Route Mapping

| Current Route | New Route | Dashboard | Route Group Folder |
|---|---|---|---|
| `/isso/*` (agency routes) | `/content-gen/*` | ContentGen / Agency Dashboard | `(agency)` |
| `/isso/chatter/*` | `/chatters/*` | Chatter Dashboard | `(chatter)` |
| `/isso/owners/*` | `/agency/*` | Agency Owner Dashboard | `(owners)` |
| `/isso/editors/*` | `/models/*` | Model/Editor Dashboard | `(editors)` |
| `/isso/contentgen/*` | `/content-gen/*` | ContentGen (merged) | `(content-gen)` |

### Critical Discovery: `@/isso/*` Import Alias is SAFE

The tsconfig path alias `@/isso/*` maps to `./src/shared/*` (NOT to `./src/app/isso/*`). All layout imports like `@/isso/layout/isso-sidebar` resolve to `src/shared/layout/isso-sidebar/` and are **unaffected** by the folder rename. No import path changes are needed for these.

---

## Guardrails

### Must Have
- All 4 new dashboard roots resolve (`/content-gen`, `/chatters`, `/agency`, `/models`)
- Middleware protects all new routes (authenticated users only)
- Role-based redirect logic works with new paths
- Sign-in/sign-up redirect to `/content-gen` (was `/isso`)
- Zero broken internal hrefs (sidebar nav, feature component links)
- Dev server starts without errors after changes
- `@/isso/*` tsconfig alias remains untouched (maps to `src/shared/*`)

### Must NOT Have
- No changes to `@/isso/*` import paths (they resolve via tsconfig to `src/shared/*`)
- No changes to brand references (`isso.co`, `alex@isso.co`, S3 bucket `isso`, etc.)
- No changes to `src/shared/layout/isso-sidebar/` component names (IssoSidebarShell etc.)
- No changes to marketing page URLs (`app.isso.co/*`)
- No route group folder renames (the `(agency)`, `(chatter)` etc. names stay the same)

---

## File Inventory (36 files with URL-path `/isso` references)

### Category A: Filesystem Rename (1 operation)
- `src/app/isso/` -> `src/app/content-gen/`

### Category B: Middleware + Auth (3 files)
1. `src/middleware.ts` -- role domains, route matchers, access control
2. `src/app/sign-in/[[...sign-in]]/page.tsx` -- redirect URLs
3. `src/app/sign-up/[[...sign-up]]/page.tsx` -- redirect URLs

### Category C: Route Group Sidebar Configs (5 files, move with git mv)
4. `src/app/isso/(agency)/sidebar-config.tsx` -- 25+ href refs
5. `src/app/isso/(chatter)/sidebar-config.tsx` -- 8 href refs
6. `src/app/isso/(content-gen)/sidebar-config.tsx` -- 14 href refs
7. `src/app/isso/(editors)/sidebar-config.tsx` -- 11 href refs
8. `src/app/isso/(owners)/sidebar-config.tsx` -- 12 href refs

### Category D: Shared Layout Sidebar (4 files)
9. `src/shared/layout/isso-sidebar/sidebar-config.tsx` -- 20+ href refs
10. `src/shared/layout/isso-sidebar/IssoIconNav.tsx` -- 15 href refs
11. `src/shared/layout/isso-sidebar/IssoSidebarShell.tsx` -- 2 href refs
12. `src/shared/layout/isso-sidebar/IssoDetailSidebar.tsx` -- 1 href ref

### Category E: Legacy Sidebar (1 file)
13. `src/shared/layout/IssoSidebar.tsx` -- 14 href refs
14. `src/components/layout/Sidebar.tsx` -- 12 href refs

### Category F: Feature Agency Sidebar Config (1 file)
15. `src/features/agency/sidebar-config.tsx` -- 14 href refs

### Category G: Feature Component hrefs (21 files)
16. `src/features/dashboard/components/DashboardFeaturePage.tsx` -- 1 ref
17. `src/features/community/components/CommunityFeaturePage.tsx` -- 1 ref
18. `src/features/community/components/sidebar/LeaderboardSidebar.tsx` -- 1 ref
19. `src/features/content-gen/components/ContentGenFeaturePage.tsx` -- 2 refs
20. `src/features/content-gen/components/dashboard/DashboardFeaturePage.tsx` -- 5 refs
21. `src/features/content-gen/components/QueueFeaturePage.tsx` -- (check for refs)
22. `src/features/editors-dashboard/components/EditorsDashboardPage.tsx` -- 6 refs
23. `src/features/intelligence/components/analysis/AnalysisView.tsx` -- 1 ref
24. `src/features/intelligence/components/dashboard/DashboardView.tsx` -- 3 refs
25. `src/features/intelligence/components/IntelligenceFeaturePage.tsx` -- (check)
26. `src/features/models/components/detail/ModelDetailPage.tsx` -- 2 refs
27. `src/features/models/components/detail/tabs/OverviewTab.tsx` -- 3 refs
28. `src/features/models/components/detail/tabs/ContentTab.tsx` -- 1 ref
29. `src/features/models/components/detail/tabs/AnalyticsTab.tsx` -- 1 ref
30. `src/features/models/components/ModelsFeaturePage.tsx` -- (check)
31. `src/features/owners-dashboard/components/OwnersDashboardPage.tsx` -- 8 refs
32. `src/features/recon/components/ReconFeaturePage.tsx` -- 1 ref
33. `src/features/recon/components/pipeline/funnel/funnelData.tsx` -- 4 refs
34. `src/features/schedule/components/ScheduleFeaturePage.tsx` -- (check)
35. `src/features/team/components/TeamFeaturePage.tsx` -- (check)
36. `src/features/tools/components/ToolsPage.tsx` -- (check)

---

## Task Flow

### Phase 1: Filesystem Rename (BLOCKING -- must complete before Phase 2-4)

**Task 1.1: git mv the isso route folder**

```bash
cd /Users/shaansisodia/SISO_Workspace/SISO_Agency/apps/isso-dashboard
git mv src/app/isso src/app/content-gen
```

This moves ALL route group folders, layouts, and sidebar-configs together. The `(agency)`, `(chatter)`, `(content-gen)`, `(editors)`, `(owners)` route groups and `layout.tsx` all travel with the parent folder.

**Acceptance criteria:**
- `src/app/content-gen/` exists with all 5 route groups + layout.tsx
- `src/app/isso/` no longer exists
- `git status` shows renamed files

**NOTE:** After this rename, `(agency)` pages serve at `/content-gen/*`, `(chatter)` at `/content-gen/chatter/*`, etc. The NEXT phases fix the sub-route paths via Next.js route group mechanics. The route groups `(chatter)`, `(editors)`, `(owners)` contain segment folders (`chatter/`, `editors/`, `owners/`) that define URLs. These will need renaming too -- see Phase 1B.

---

### Phase 1B: Rename URL-segment folders within route groups

Each route group currently has a child folder matching the old URL segment. These must be renamed to match new routes:

```bash
cd /Users/shaansisodia/SISO_Workspace/SISO_Agency/apps/isso-dashboard

# (chatter)/chatter/* stays as /chatters/* -- rename segment folder
git mv src/app/content-gen/\(chatter\)/chatter src/app/content-gen/\(chatter\)/chatters

# (editors)/editors/* becomes /models/* -- rename segment folder  
git mv src/app/content-gen/\(editors\)/editors src/app/content-gen/\(editors\)/models

# (owners)/owners/* becomes /agency/* -- rename segment folder
git mv src/app/content-gen/\(owners\)/owners src/app/content-gen/\(owners\)/agency

# (content-gen)/contentgen/* becomes top-level content-gen/* -- rename segment folder
git mv src/app/content-gen/\(content-gen\)/contentgen src/app/content-gen/\(content-gen\)/content-gen-sub
```

**Wait** -- there is a problem here. The current Next.js routing works as:

- `src/app/isso/(chatter)/chatter/page.tsx` --> URL: `/isso/chatter`
- `src/app/isso/(owners)/owners/page.tsx` --> URL: `/isso/owners`
- `src/app/isso/(editors)/editors/page.tsx` --> URL: `/isso/editors`

After the rename to `src/app/content-gen/`, these become:
- `src/app/content-gen/(chatter)/chatter/page.tsx` --> URL: `/content-gen/chatter`

But we want `/chatters` (no parent prefix). This means each dashboard needs to be its OWN top-level route, NOT nested under `content-gen/`.

### REVISED Phase 1: Split into Independent Top-Level Routes

```bash
cd /Users/shaansisodia/SISO_Workspace/SISO_Agency/apps/isso-dashboard

# Step 1: Move (agency) group to /content-gen (this IS the main content-gen dashboard)
git mv src/app/isso/\(agency\) src/app/content-gen-tmp
mkdir -p src/app/content-gen
mv src/app/content-gen-tmp/* src/app/content-gen/
rm -rf src/app/content-gen-tmp

# Step 2: Move (chatter) group to /chatters
git mv src/app/isso/\(chatter\) src/app/chatters-tmp
mkdir -p src/app/chatters  
# The pages inside (chatter)/chatter/* need to serve at /chatters/*
# Move the inner chatter/ segment pages up
mv src/app/chatters-tmp/chatter/* src/app/chatters/
mv src/app/chatters-tmp/layout.tsx src/app/chatters/layout.tsx
mv src/app/chatters-tmp/sidebar-config.tsx src/app/chatters/sidebar-config.tsx
rm -rf src/app/chatters-tmp

# Step 3: Move (owners) group to /agency  
git mv src/app/isso/\(owners\) src/app/agency-tmp
mkdir -p src/app/agency
mv src/app/agency-tmp/owners/* src/app/agency/
mv src/app/agency-tmp/layout.tsx src/app/agency/layout.tsx
mv src/app/agency-tmp/sidebar-config.tsx src/app/agency/sidebar-config.tsx
rm -rf src/app/agency-tmp

# Step 4: Move (editors) group to /models
git mv src/app/isso/\(editors\) src/app/models-tmp
mkdir -p src/app/models
mv src/app/models-tmp/editors/* src/app/models/
mv src/app/models-tmp/layout.tsx src/app/models/layout.tsx  
mv src/app/models-tmp/sidebar-config.tsx src/app/models/sidebar-config.tsx
rm -rf src/app/models-tmp

# Step 5: Merge (content-gen) into /content-gen
# The (content-gen)/contentgen/* pages merge into /content-gen/*
mv src/app/isso/\(content-gen\)/contentgen/* src/app/content-gen/
# Keep the sidebar-config if it has unique nav items (merge manually)
rm -rf src/app/isso/\(content-gen\)

# Step 6: Copy top-level isso layout if needed, then remove isso/
cp src/app/isso/layout.tsx src/app/content-gen/layout.tsx 2>/dev/null
rm -rf src/app/isso
```

**IMPORTANT:** The above is the conceptual approach. The executor should use `git mv` for tracked files where possible and verify each step. The `(content-gen)` sidebar-config items should be merged into the `(agency)` sidebar-config since they share the `/content-gen` route.

**Acceptance criteria:**
- `src/app/content-gen/` has all former `(agency)` pages + merged `(content-gen)` pages
- `src/app/chatters/` has all former `(chatter)/chatter/` pages
- `src/app/agency/` has all former `(owners)/owners/` pages
- `src/app/models/` has all former `(editors)/editors/` pages
- `src/app/isso/` no longer exists
- Each new folder has its own `layout.tsx` and `sidebar-config.tsx`

---

### Phase 2: Update Sidebar Configs (parallel -- 6 files)

All sidebar-config files need href replacements. These files move physically with Phase 1, but their CONTENTS need updating.

**Task 2.1: `content-gen/sidebar-config.tsx` (was agency sidebar-config)**

Global find-replace within the file:
| Find | Replace |
|------|---------|
| `'/isso/content-gen` | `'/content-gen/content-gen` |
| `'/isso/contentgen` | `'/content-gen` |
| `'/isso/chatter` | `'/chatters` |
| `'/isso/owners` | `'/agency` |
| `'/isso/editors` | `'/models` |
| `'/isso'` | `'/content-gen'` |
| `'/isso/` | `'/content-gen/` |

**Task 2.2: `chatters/sidebar-config.tsx` (was chatter sidebar-config)**

| Find | Replace |
|------|---------|
| `'/isso/chatter` | `'/chatters` |
| `'/isso'` | `'/content-gen'` |

**Task 2.3: `agency/sidebar-config.tsx` (was owners sidebar-config)**

| Find | Replace |
|------|---------|
| `'/isso/owners` | `'/agency` |
| `'/isso'` | `'/content-gen'` |

**Task 2.4: `models/sidebar-config.tsx` (was editors sidebar-config)**

| Find | Replace |
|------|---------|
| `'/isso/editors` | `'/models` |
| `'/isso'` | `'/content-gen'` |

**Task 2.5: `src/shared/layout/isso-sidebar/sidebar-config.tsx`**

| Find | Replace |
|------|---------|
| `'/isso/content-gen` | `'/content-gen/content-gen` |
| `'/isso'` | `'/content-gen'` |
| `'/isso/` | `'/content-gen/` |

**Task 2.6: `src/shared/layout/isso-sidebar/IssoIconNav.tsx`**

Update all route arrays:
| Find | Replace |
|------|---------|
| `'/isso/chatter` | `'/chatters` |
| `'/isso/owners` | `'/agency` |
| `'/isso/editors` | `'/models` |
| `'/isso/contentgen` | `'/content-gen` |
| `'/isso'` | `'/content-gen'` |
| `'/isso/` | `'/content-gen/` |

**Task 2.7: `src/shared/layout/isso-sidebar/IssoSidebarShell.tsx` + `IssoDetailSidebar.tsx`**

| Find | Replace |
|------|---------|
| `'/isso'` | `'/content-gen'` |

**Task 2.8: `src/shared/layout/IssoSidebar.tsx` (legacy sidebar)**

| Find | Replace |
|------|---------|
| `'/isso'` | `'/content-gen'` |
| `'/isso/` | `'/content-gen/` |

**Task 2.9: `src/components/layout/Sidebar.tsx`**

| Find | Replace |
|------|---------|
| `'/isso'` | `'/content-gen'` |
| `'/isso/` | `'/content-gen/` |

**Task 2.10: `src/features/agency/sidebar-config.tsx`**

| Find | Replace |
|------|---------|
| `'/isso/agency` | `'/agency` |
| `'/isso'` | `'/content-gen'` |

**Acceptance criteria per file:** No string `'/isso` remains in the file.

---

### Phase 3: Update Middleware + Auth Redirects (independent of Phase 2)

**Task 3.1: `src/middleware.ts`**

Replace the entire ROLE_DOMAINS map:
```typescript
const ROLE_DOMAINS: Record<string, string> = {
  owner:   "/agency",
  editor:  "/models",
  chatter: "/chatters",
  viewer:  "/content-gen",
  agency:  "/content-gen",
};
```

Replace route matchers:
```typescript
const isProtected = createRouteMatcher([
  "/content-gen(.*)",
  "/chatters(.*)",
  "/agency(.*)",
  "/models(.*)",
]);

const domainRoutes = createRouteMatcher([
  "/agency(.*)",
  "/models(.*)",
  "/chatters(.*)",
]);
```

Replace ROLE_ALLOWED_DOMAINS:
```typescript
const ROLE_ALLOWED_DOMAINS: Record<string, string[]> = {
  owner:   ["/agency", "/content-gen"],
  editor:  ["/models", "/content-gen"],
  chatter: ["/chatters", "/content-gen"],
  viewer:  ["/content-gen"],
  agency:  ["/content-gen"],
};
```

Replace role-based redirect logic (lines 72-78):
- `path === "/isso"` --> `path === "/content-gen"`
- `"/isso"` fallback --> `"/content-gen"`

**Task 3.2: `src/app/sign-in/[[...sign-in]]/page.tsx`**

| Find | Replace |
|------|---------|
| `'/isso'` | `'/content-gen'` |
| `"/isso"` | `"/content-gen"` |

**Task 3.3: `src/app/sign-up/[[...sign-up]]/page.tsx`**

| Find | Replace |
|------|---------|
| `'/isso'` | `'/content-gen'` |
| `"/isso"` | `"/content-gen"` |

**Acceptance criteria:** Sign in redirects to `/content-gen`. Middleware protects all 4 dashboard roots. Role-based routing sends owners to `/agency`, editors to `/models`, chatters to `/chatters`.

---

### Phase 4: Update Feature Component hrefs (parallel -- 21 files)

Every feature component file that has a URL-path `/isso` reference needs updating. The replacement rule depends on which dashboard the href targets:

**Master replacement rules (apply in this ORDER -- most specific first):**

| Pattern | Replacement | Reason |
|---------|-------------|--------|
| `/isso/contentgen/` | `/content-gen/` | ContentGen routes merge into /content-gen |
| `/isso/contentgen` | `/content-gen` | ContentGen root |
| `/isso/content-gen/` | `/content-gen/content-gen/` | Content-gen sub-routes under agency |
| `/isso/content-gen` | `/content-gen/content-gen` | Content-gen sub-route root |
| `/isso/chatter/` | `/chatters/` | Chatter routes |
| `/isso/chatter` | `/chatters` | Chatter root |
| `/isso/owners/` | `/agency/` | Owner routes |
| `/isso/owners` | `/agency` | Owner root |
| `/isso/editors/` | `/models/` | Editor routes |
| `/isso/editors` | `/models` | Editor root |
| `/isso/` | `/content-gen/` | All remaining agency routes |
| `/isso` | `/content-gen` | Agency root |

**Files to update (grouped by concern):**

**Agency/ContentGen feature pages:**
- `src/features/dashboard/components/DashboardFeaturePage.tsx`
- `src/features/content-gen/components/ContentGenFeaturePage.tsx`
- `src/features/content-gen/components/dashboard/DashboardFeaturePage.tsx`
- `src/features/content-gen/components/QueueFeaturePage.tsx`
- `src/features/intelligence/components/analysis/AnalysisView.tsx`
- `src/features/intelligence/components/dashboard/DashboardView.tsx`
- `src/features/community/components/CommunityFeaturePage.tsx`
- `src/features/community/components/sidebar/LeaderboardSidebar.tsx`
- `src/features/recon/components/ReconFeaturePage.tsx`
- `src/features/recon/components/pipeline/funnel/funnelData.tsx`
- `src/features/models/components/detail/tabs/OverviewTab.tsx`
- `src/features/models/components/detail/tabs/ContentTab.tsx`
- `src/features/models/components/detail/tabs/AnalyticsTab.tsx`
- `src/features/models/components/detail/ModelDetailPage.tsx`

**Editors dashboard pages (hrefs change /isso/editors -> /models):**
- `src/features/editors-dashboard/components/EditorsDashboardPage.tsx`

**Owners dashboard pages (hrefs change /isso/owners -> /agency):**
- `src/features/owners-dashboard/components/OwnersDashboardPage.tsx`

**Acceptance criteria per file:** No string `/isso` in any href/URL-path context. Brand strings (`isso.co`, bucket name) remain untouched.

---

### Phase 5: Verification

**Task 5.1: Grep verification**
```bash
cd /Users/shaansisodia/SISO_Workspace/SISO_Agency/apps/isso-dashboard
# Should return ONLY brand refs (isso.co, @isso, bucket "isso"), no URL paths
grep -rn "'/isso\|/isso/" src/ --include="*.tsx" --include="*.ts" | grep -v node_modules | grep -v ".next" | grep -v "isso.co" | grep -v "@isso" | grep -v '"isso"'
```

Expected: zero results.

**Task 5.2: Dev server smoke test**
```bash
cd /Users/shaansisodia/SISO_Workspace/SISO_Agency/apps/isso-dashboard
PATH="/opt/homebrew/bin:$PATH" npx next dev --port 3100
```

Verify these URLs resolve:
- `http://localhost:3100/content-gen` (main agency dashboard)
- `http://localhost:3100/chatters` (chatter dashboard)
- `http://localhost:3100/agency` (owners dashboard)
- `http://localhost:3100/models` (editors dashboard)
- `http://localhost:3100/content-gen/intelligence` (intelligence page)
- `http://localhost:3100/content-gen/schedule` (schedule page)

**Task 5.3: Middleware verification**
- Unauthenticated visit to `/content-gen` redirects to sign-in
- Sign-in redirects to `/content-gen`

**Acceptance criteria:** Dev server starts without errors. All 4 dashboard roots render. No 404s on sidebar nav clicks. Middleware protects all routes.

---

## Dependency Graph

```
Phase 1 (filesystem rename)
    |
    +---> Phase 2 (sidebar configs)  ---|
    |                                    |--> Phase 5 (verify)
    +---> Phase 3 (middleware + auth) ---|
    |                                    |
    +---> Phase 4 (feature hrefs)  ------|
```

Phases 2, 3, and 4 can run in parallel after Phase 1 completes.

---

## Risk Notes

1. **Route group mechanics:** The `(content-gen)` route group's `contentgen/` segment folder pages must merge cleanly into the new `content-gen/` top-level route alongside `(agency)` pages. Check for page.tsx filename collisions.

2. **Nested content-gen paths:** The agency sidebar has hrefs like `/isso/content-gen/scenes` AND the (content-gen) group has `/isso/contentgen/content-gen/scenes`. After the merge, these should both resolve to `/content-gen/content-gen/scenes` or be consolidated. Clarify with Shaan if needed.

3. **Layout duplication:** Each new top-level route needs its own layout.tsx. The current layouts are nearly identical (sidebar shell + main content area) but differ in the sidebar config they pass. Ensure each new folder retains its correct layout.

4. **The `(content-gen)` route group sidebar-config:** Its items will need to be merged into the main content-gen sidebar or kept as a separate config loaded conditionally. The simplest approach is to merge.
