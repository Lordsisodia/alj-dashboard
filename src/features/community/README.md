# Community Feature (`src/features/community/`)

Content vault and discovery hub — browse, swipe-approve, and save influencer content.

## Layout

```
community/
├── README.md
├── types.ts                  # Shared TypeScript types
├── types/index.ts            # Barrel: Tab, ContentType, Niche, Creator, Post
├── data.ts                   # All mock seed data (creators, posts, gradients, etc.)
├── constants.ts              # Re-exports data.ts for backwards compatibility
├── utils.ts                  # Utility helpers (fmtK)
├── utils/index.ts            # Barrel: fmtK
├── hooks/
│   ├── index.ts              # Barrel: useRelativeTime
│   └── useRelativeTime.ts    # Relative time formatter (e.g. "2h ago")
└── components/
    ├── CommunityFeaturePage.tsx   # Top-level page shell with tab navigation
    ├── index.ts                    # Barrel: all public components
    ├── feed/
    │   ├── PostCard.tsx           # Single post thumbnail card
    │   └── index.ts
    ├── sidebar/
    │   ├── LeaderboardSidebar.tsx # Top creators + discover panel
    │   └── index.ts
    ├── dashboard/
    │   ├── HubDashboardTab.tsx    # KPI overview tab
    │   ├── LastSessionCard.tsx    # Previous swipe session summary
    │   ├── VaultHealthBar.tsx      # Vault size broken down by niche
    │   ├── HubSwipeActivityFeed.tsx  # Recent swipe decisions list
    │   └── HubQuickActions.tsx     # 3-up quick action buttons
    ├── vault/
    │   └── VaultTabContent.tsx    # Browsable + filterable post grid
    └── saved/
        └── SavedTabContent.tsx   # Bookmarked posts, grouped by niche
```

## Tabs

| Tab | Component | Description |
|-----|-----------|-------------|
| Dashboard | `HubDashboardTab` | KPIs, last session, vault health, activity feed |
| Vault | `VaultTabContent` | Browse all posts, filter by niche + type |
| Approve | `SwipeTabContent` | Swipe-based approve/pass flow |
| Saved | `SavedTabContent` | Bookmarked posts grouped by niche |

## Convex Tables

No Convex tables are used. All data is local mock data defined in `data.ts`.

## Adding a Custom Hook

1. Create `hooks/useYourHookName.ts`
2. Re-export it from `hooks/index.ts`
3. Import from `@/features/community/hooks` in consuming components

## Seed Data

All mock data lives in `data.ts` (`CREATORS`, `POSTS`, `LEADERBOARD_ENTRIES`, `GRADIENTS`, `TYPE_COLORS`, `NICHE_CONFIG`, `MOCK_SWIPE_ACTIVITY`, `MOCK_LAST_SESSION`). `constants.ts` re-exports everything from `data.ts` for backwards compatibility. Replace with Convex queries when a real backend is connected.

## Types

Exposed via `types/index.ts`:
- `Tab` — `'dashboard' | 'vault' | 'approve' | 'saved'`
- `ContentType` — `'Reel' | 'Post' | 'Carousel'`
- `Niche` — `'fitness' | 'lifestyle' | 'fashion' | 'wellness'`
- `Creator` — `{ handle, initials, color, followers, engagementRate }`
- `Post` — full post object
