# Journal — ui.content-gen

## 2026-04-07 AM — Audit complete

### Architecture diagnosis

**Reference pattern (Agents):** `AgentsFeaturePage.tsx` — single route `/isso/agents` rendering ONE `ContentPageShell` with `tabs[]` prop. Tab state drives which sub-view renders inside via `AnimatePresence`. Pill bar is shared across all tabs because `ContentPageShell` is instantiated once.

**Content Gen (broken):** 5 separate Next.js routes, each directly rendering a sub-component that calls `ContentPageShell` independently. Pill bar never appears because there's no shared shell.

| Route | Component | Problem |
|-------|-----------|---------|
| `/isso/content-gen` | `DashboardFeaturePage` | Has ContentPageShell but no tabs |
| `/isso/content-gen/scenes` | `ScenesFeaturePage` | Has ContentPageShell, no tabs |
| `/isso/content-gen/generate` | `LivePipelinePage` | Has ContentPageShell with Live/History sub-tabs |
| `/isso/content-gen/gallery` | `GalleryFeaturePage` | Has ContentPageShell, no tabs |
| `/isso/content-gen/models` | `ModelsFeaturePage` | Has ContentPageShell, no tabs (only one w/ real Convex) |
| `/isso/content-gen/queue` | `QueueFeaturePage` | Not in sidebar, dead route |

**Fix required:** Create `ContentGenFeaturePage.tsx` (mirrors `AgentsFeaturePage`):
- Tabs: Dashboard | Scenes ① | Generate ② | Gallery ③ | Models ④
- Each tab's sub-view is rendered via `AnimatePresence` keyed by `activeTab`
- Sub-views stripped of their own `ContentPageShell` wrapper (they become plain content components)
- Collapsed route: only `/isso/content-gen` renders the shell; others become 404 or redirect

### Sub-view data status
| Component | Data | Real pipeline? |
|-----------|------|----------------|
| `DashboardFeaturePage` | `SEED_MODEL_SUMMARIES`, `SEED_ACTIVITY` (static) | ❌ |
| `ScenesFeaturePage` | `SEED_SCENES` (static) | ❌ |
| `LivePipelinePage` | `SEED_ACTIVE`, `SEED_HISTORY` (static); `cgApi = null` stub | ❌ |
| `GalleryFeaturePage` | `SEED_HISTORY` (static) | ❌ |
| `ModelsFeaturePage` | `useQuery(api.models.*)` — **only real Convex** | ✅ |

### LivePipelinePage issues (generate tab)
- Line 21: `const cgApi: any = null;` — dead stub, never replaced
- Line 132-133: `SEED_ACTIVE` / `SEED_HISTORY` hardcoded imports
- `handleRetry` and `handleCancel` are no-ops (empty functions)
- Has its own Live/History sub-tabs inside ContentPageShell — these become the Generate tab's inner state

### Dead code candidates
- `GenerateFeaturePage.tsx` — older parallel version, real API but `setTimeout` fake completion. Not used by any route. Safe to assess for removal.
- `/isso/content-gen/queue` route — `QueueFeaturePage` rendered but never wired, not in sidebar

### ContentPageShell capabilities (confirmed adequate)
From reading the shell, it supports: `tabs[]`, `activeTab`/`onTabChange`, `pill` (step pills), `stat`, `searchPlaceholder`, `actionLabel`/`actionIcon`/`onAction`, `actionDropdownItems`, `filterChips`, `activeFilter`/`onFilterChange`, `searchValue`/`onSearch`, `showViewToggle`, `nextProduct`. All needed features are available.

### Blocked
- Replicate API key (`REPLICATE_API_TOKEN` in `.env.local`) — needed for Kling
- Google Drive folder ID for ALJ delivery
- FLUX API integration (only string enum, no real calls)

### Next actions (ordered)
1. **Manager creates `ContentGenFeaturePage.tsx`** — coordinate, don't do solo
2. Strip `ContentPageShell` from all 5 sub-views, pass content as children
3. Wire `DashboardFeaturePage` → `api.contentGen.getStats`
4. Wire `ScenesFeaturePage` → scenes query (if exists in convex)
5. Wire `GalleryFeaturePage` → `api.contentGen.getHistory`
6. Wire `LivePipelinePage` → `api.contentGen.getActiveJobs` + retry/cancel mutations
7. Assess `GenerateFeaturePage.tsx` for safe removal or harvest
8. Remove `/queue` route

**Status:** Awaiting manager coordination on pill bar architecture.
