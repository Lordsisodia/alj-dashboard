# ISSO Features — Architecture Reference

ISSO is an OFM agency SaaS. Five product areas live in `src/features/`, each following the same domain-based structure.

---

## 5-Product Nav

| # | Product | Hotkey | Route prefix | Purpose |
|---|---------|--------|--------------|---------|
| 1 | **Hub** | `⌘1` | `/isso` | Day-to-day ops: approvals, schedule, analytics, community |
| 2 | **Intelligence** | `⌘2` | `/isso/intelligence` | Viral content discovery — browse, save, organise to boards |
| 3 | **Recon** | `⌘3` | `/isso/recon` | Competitor monitoring — scraping log, creator table, community feed |
| 4 | **Agents** | `⌘4` | `/isso/agents` | AI agent transparency — activity feed, reports, custom requests |
| 5 | **Briefs** | `⌘5` | `/isso/ideas` | Content factory — AI briefs, video enhancement, model pipeline |

Persistent sidebar items (always visible): **Team** (`/isso/team`), **Settings** (`/isso/settings`).

---

## Domain-Based Architecture Pattern

Every feature follows the same structure. Never put logic in the page route.

```
src/features/<feature>/
├── types.ts           ← all TS interfaces and type aliases for this domain
├── constants.ts       ← seed data, color maps, animation variants
├── utils.ts           ← pure formatting helpers (fmtNum, timeAgo, etc.)
├── hooks/             ← custom React hooks (useXxx.ts)
│   └── index.ts
└── components/
    ├── <FeatureName>FeaturePage.tsx   ← page shell: state only, delegates to sub-components
    ├── index.ts                       ← re-exports the page component
    └── <sub-folder>/                  ← one folder per logical section
        ├── ComponentA.tsx
        └── index.ts                   ← barrel export
```

**Rules:**
- No component over ~120 lines
- Page component owns state; sub-components are pure/display
- Types and constants stay at the feature root — never duplicated in components
- Shared things (DateRangePill, FeedControls) live in `src/shared/ui/`

---

## Feature Map

### Hub features

| Feature | Page component | Key sub-folders |
|---------|---------------|-----------------|
| `dashboard` | `DashboardFeaturePage` | — |
| `approvals` | `ApprovalsFeaturePage` | — |
| `schedule` | Schedule page | — |
| `analytics` | `AnalyticsFeaturePage` | `charts/`, `insights/`, `stats/`, `tables/`, `placeholders/` |
| `community` | `CommunityFeaturePage` | `feed/PostCard`, `sidebar/LeaderboardSidebar` |

### Intelligence (⌘2)
```
intelligence/
├── types.ts          Post, DrawerPost, Board, Tab, SortId, VisibilityState
├── constants.ts      NICHE_COLORS, BOARDS, animation variants
├── utils.ts          fmtNum, timeAgo, daysLive, avatarColor, truncateId
├── filterConfig.tsx  FILTER_CATEGORIES (JSX icons — .tsx required)
├── hooks/
│   ├── useFeed.ts    wraps Convex getFeed query + auto-seed
│   └── useDrawer.ts  open/close/navigate drawer state
└── components/
    ├── controls/     SortPill, VisibilityPill
    ├── feed/         FeedView, PostCard, PostListItem, SkeletonCard, BoardPickerDropdown
    ├── drawer/       PostDetailDrawer, DrawerMediaPanel, DrawerRightPanel, DetailsTab, AIAnalysisTab, TranscriptTab
    ├── boards/       BoardsView, BoardCard
    └── experts/      ExpertsView
```

### Recon (⌘3)
```
recon/
├── types.ts          Competitor, DailyVolume, Tab, DrawerState
├── constants.ts      COMPETITORS (seed data), DAILY_VOLUME, animation variants
├── hooks/
└── components/
    ├── creators/     ScoreBadge, ScoreColumnHeader, StatCard, VolumeChart, LogDashboard, CreatorsTable
    └── icons/        platform SVG icons
```
Recon tab `feed` re-uses `FeedView` + `PostDetailDrawer` from the Intelligence domain.

### Agents (⌘4)
```
agents/
└── components/
    ├── activity/     ActivityCard, ActivityView
    ├── reports/      ReportCard, ReportsView
    └── requests/     RequestCard, RequestsView
```

### Briefs (⌘5)
```
ideas/          ← AI brief generator (Gemini)
content/
├── constants.ts      ENHANCEMENTS, SEED_CLIPS, STATUS_STYLE
├── types.ts          ClipData, Enhancement, ClipStatus, Tab
└── components/
    ├── upload/       UploadDropzone
    ├── library/      ClipCard, ClipCardActions, EnhancementBadge, LibraryView
    └── delivered/    DeliveredView

models/
├── constants.ts      model seed data, status styles
└── components/
    ├── roster/       ModelCard, RosterView
    ├── pipeline/     PipelineTracker, ReelGrid
    ├── performance/  PerformanceView
    └── onboarding/   OnboardingView
```

### Persistent
```
team/
└── components/
    ├── badges/       RoleBadge, StatusDot
    ├── modals/       InviteModal
    └── pills/        AccountPill

settings/
├── constants.tsx     (JSX icons — .tsx required)
└── components/
    ├── controls/     AnimatedToggle, FieldRow, SettingsCard
    └── tabs/         ProfileTab, ConnectedAccountsTab, IntegrationsTab, ContentDefaultsTab, BillingTab
```

---

## Shared Systems (`src/shared/`)

### `layout/`
| File | What it does |
|------|-------------|
| `ContentPageShell.tsx` | Universal page wrapper: icon + title + stat pill, search bar, tab strip, filter bar (Add Filter pill + right slot), optional view toggle (grid/list). Every feature page uses this. |
| `IssoSidebar.tsx` | 5-product icon column + persistent dropdown nav |
| `ProductIcon.tsx` | Brand icon per product (Hub/Intelligence/Recon/Agents/Briefs) |
| `Shell.tsx` | Outermost layout: sidebar + main content area |

### `ui/`
| File | What it does |
|------|-------------|
| `FeedControls.tsx` | `SortPill`, `VisibilityPill`, `DEFAULT_VISIBILITY`, `SortId`, `VisibilityState` — used by Intelligence and Recon |
| `DateRangePill.tsx` | Date range selector with calendar popover |
| `CreatePresetModal.tsx` | Save/load named filter presets |

Intelligence also has its own `SortPill` + `VisibilityPill` copies in `components/controls/` for domain isolation.

---

## Backend (Convex)

All backend code lives in `convex/`. Key files:

| File | What it owns |
|------|-------------|
| `schema.ts` | `trackedAccounts`, `scrapedPosts`, `swipeRatings` tables |
| `intelligence.ts` | `getFeed`, `searchPosts`, `getStats`, `toggleSave`, `seedIntelligenceFeed` |

Data flow:
```
Recon scrapes → scrapedPosts (Convex) → Intelligence getFeed → FeedView cards
```

---

## Adding a New Feature

1. Create `src/features/<name>/types.ts`, `constants.ts`, `utils.ts`
2. Create `src/features/<name>/hooks/` with any data-fetching hooks
3. Create `src/features/<name>/components/<Name>FeaturePage.tsx` — use `ContentPageShell` as the wrapper
4. Add a route at `src/app/isso/<name>/page.tsx`
5. Wire the nav entry in `IssoSidebar.tsx`

Keep the page component under 120 lines. Extract anything with UI into a named sub-component in a sub-folder.

---

## Routing

App Router. All ISSO routes live under `src/app/isso/`. Each route is a thin wrapper:

```tsx
// src/app/isso/intelligence/page.tsx
import IntelligenceFeaturePage from '@/features/intelligence/components/IntelligenceFeaturePage';
export default function Page() { return <IntelligenceFeaturePage />; }
```

Import alias: `@/` → `src/`  |  `@/isso/` → `src/shared/`
