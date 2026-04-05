# Intelligence Feature

> Product 2 of 5 in the ISSO nav. Hotkey `⌘2`.
> Purpose: discover what's working — browse viral content, find winning patterns, save to boards.

---

## File Map

```
src/features/intelligence/
├── README.md                          ← you are here
├── types.ts                           ← Post, DrawerPost, Board, Tab, SortId, VisibilityState
├── constants.ts                       ← NICHE_COLORS, BOARDS, animation variants (containerVariants, fadeUp)
├── utils.ts                           ← fmtNum, timeAgo, daysLive, avatarColor, truncateId
├── filterConfig.tsx                   ← FILTER_CATEGORIES with JSX icon nodes (.tsx — contains JSX)
├── hooks/
│   ├── useFeed.ts                     ← Convex getFeed query + auto-seed on empty
│   └── useDrawer.ts                   ← open/close/navigate drawer state
└── components/
    ├── index.ts                       ← re-exports IntelligenceFeaturePage
    ├── IntelligenceFeaturePage.tsx    ← page shell (~75 lines, state only)
    ├── controls/
    │   ├── SortPill.tsx               ← sort dropdown pill (newest / top-engagement / trending…)
    │   └── VisibilityPill.tsx         ← iOS toggles: brandDetails / likeCount / viewCount / saveCount
    ├── feed/
    │   ├── FeedView.tsx               ← grid or list renderer (consumes useFeed)
    │   ├── PostCard.tsx               ← masonry card: thumbnail, metrics, Save to Hub, embed support
    │   ├── PostListItem.tsx           ← horizontal list row
    │   ├── SkeletonCard.tsx           ← loading placeholder
    │   └── BoardPickerDropdown.tsx    ← board selector dropdown
    ├── drawer/
    │   ├── PostDetailDrawer.tsx       ← slide-up drawer shell: backdrop, animation, keyboard nav
    │   ├── DrawerMediaPanel.tsx       ← left panel: image / gradient / Instagram embed + arrows
    │   ├── DrawerRightPanel.tsx       ← right panel: Save to Hub + tab bar
    │   ├── DetailsTab.tsx             ← post metadata (platform, niche, engagement…)
    │   ├── AIAnalysisTab.tsx          ← placeholder (Gemini integration planned)
    │   └── TranscriptTab.tsx          ← caption text + hashtag chips
    ├── boards/
    │   ├── BoardsView.tsx             ← boards grid (Brands tab)
    │   └── BoardCard.tsx              ← single board card with thumbnail mosaic
    └── experts/
        └── ExpertsView.tsx            ← placeholder (Experts tab)
```

**Shared dependencies:**
```
src/shared/layout/
├── ContentPageShell.tsx   ← universal 3-row page wrapper (used by every feature)
└── ProductIcon.tsx        ← product icon sprite

src/shared/ui/
├── FeedControls.tsx       ← SortPill + VisibilityPill base (also used by Recon)
└── DateRangePill.tsx      ← date range selector
```

---

## How It Fits Together

```
/isso/intelligence  →  src/app/isso/intelligence/page.tsx
                              └── <IntelligenceFeaturePage />

IntelligenceFeaturePage
  ├── state: activeTab, sortBy, visibility, viewMode
  ├── useDrawer() → { drawer, open, close }
  │
  ├── <ContentPageShell>
  │     ├── icon: <ProductIcon product="intelligence" />
  │     ├── tabs: Feed | Brands | Experts
  │     ├── filterCategories: FILTER_CATEGORIES (from filterConfig.tsx)
  │     └── filterRightSlot: <SortPill> <DateRangePill> <VisibilityPill>
  │
  ├── activeTab === 'feed'    → <FeedView onPostClick={open} />
  ├── activeTab === 'brands'  → <BoardsView />
  └── activeTab === 'experts' → <ExpertsView />

FeedView
  ├── useFeed({ sortBy, niche, contentType })
  │     └── useQuery(api.intelligence.getFeed) + auto-seed if empty
  ├── grid: CSS `columns` masonry, 4-col max
  └── <PostCard onPostClick={(index, posts) => open(index, posts)} />

PostCard click → open(index, posts)
  └── <PostDetailDrawer posts={[…]} initialIndex={n} onClose={close} />
        ├── keyboard: ← → Esc
        ├── <DrawerMediaPanel /> (left, bg-neutral-950)
        │     ├── real image → <img referrerPolicy="no-referrer" />
        │     ├── Instagram reel → Instagram embed.js blockquote
        │     └── fallback → CSS gradient div
        └── <DrawerRightPanel key={post._id} /> (right)
              ├── Save to Hub → useMutation(toggleSave)
              └── tabs: Details | AI Analysis | Transcript
```

---

## Key Hooks

### `useFeed`
```ts
const { posts, isLoading, isEmpty } = useFeed({ sortBy, niche, contentType, limit })
```
- Wraps `useQuery(api.intelligence.getFeed)`
- Auto-calls `seedIntelligenceFeed()` if posts array is empty on first load
- Returns typed `DrawerPost[]`

### `useDrawer`
```ts
const { drawer, open, close } = useDrawer()
// open(index: number, posts: DrawerPost[]) → sets drawer state
// close() → nulls it
// drawer: { index, posts } | null
```

---

## Convex Backend (`convex/intelligence.ts`)

| Function | Type | Description |
|----------|------|-------------|
| `getFeed` | query | `niche?, contentType?, sortBy?, limit?` → `scrapedPosts[]` |
| `searchPosts` | query | `query, niche?, contentType?` → full-text search on caption |
| `getStats` | query | `{ totalIndexed: number }` |
| `toggleSave` | mutation | flips `saved` boolean on a post |
| `seedIntelligenceFeed` | mutation | inserts 8 seed accounts + 16 posts (dev only) |

### Sorting (server-side in `getFeed`)

| `sortBy` | Behaviour |
|----------|-----------|
| `newest` | `ORDER BY postedAt DESC` |
| `oldest` | `ORDER BY postedAt ASC` |
| `most-likes` | `ORDER BY likes DESC` |
| `most-views` | `ORDER BY views DESC` |
| `most-saves` | `ORDER BY saves DESC` |
| `top-engagement` | `ORDER BY engagementRate DESC` |
| `trending` | last 14 days only, then `ORDER BY engagementRate DESC` |

---

## Database Tables

### `scrapedPosts`
Core table powering the feed.

| Field | Type | Notes |
|-------|------|-------|
| `externalId` | string | Instagram shortcode — used for embed URL |
| `accountId` | FK → trackedAccounts | |
| `handle` | string | denormalised for fast display |
| `platform` | `instagram \| tiktok` | |
| `contentType` | `reel \| post \| carousel \| story` | |
| `niche` | string | GFE, Fitness, Lifestyle… |
| `thumbnailUrl` | string | CDN URL or CSS gradient string |
| `videoUrl` | string? | optional |
| `caption` | string | |
| `hashtags` | string[] | |
| `likes / views / saves` | number | |
| `engagementRate` | number | |
| `postedAt` | number | unix ms |
| `saved` | boolean | user bookmarked |

Indexes: `by_account`, `by_niche`, `by_content_type`, `by_posted_at`, `by_engagement`
Search index: `search_caption` — full-text on caption, filterable by niche + contentType

### `trackedAccounts`
Accounts being monitored by Recon. Each `scrapedPost` links back here.

---

## What's Not Built Yet

| Feature | Notes |
|---------|-------|
| Real scraper | Recon will write to `scrapedPosts` via Convex scheduled functions. Currently seeded. |
| Search wired up | `searchPosts` query exists; search input in `ContentPageShell` not connected yet. |
| Boards (save to board) | `boardIds` field on `scrapedPosts` exists. Board management UI is a static mock. |
| AI Analysis tab | Needs Gemini integration. |
| Transcript tab | Caption is displayed; actual video transcript needs a transcription pipeline. |
| Swipe & Rate | `swipeRatings` table is ready. UI not built. |
| Pagination | `getFeed` has `limit` param. Infinite scroll not implemented. |
