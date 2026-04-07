# Issue: Vault tab re-ramp

**Agent:** ui.hub.vault  
**Surface:** surface:38  
**Priority:** P0 — today

---

## What the Vault is for

The Vault is the curated library of **top-performing content** scraped and scored by Intelligence — the 10% that made the cut. Users browse it to study what works before running a swipe session on Approve.

---

## Current state (broken)

| Problem | Location |
|---------|----------|
| All data is a static `POSTS` constant (10 fake items) | `src/features/community/constants.ts` |
| Uses community's own `PostCard` — gradient bg, colored initials, no real data | `src/features/community/components/feed/PostCard.tsx` |
| Sidebar has 3 blocks: Top Creators, "Grow your reach / Connect Account", "Discover" | `src/features/community/components/sidebar/LeaderboardSidebar.tsx` |
| Creator avatars are colored initials only — no real profile photos | Same |

---

## What to build

### 1. Swap card grid → Intelligence FeedView

Replace the current grid + community `PostCard` with the Intelligence `FeedView` component.

**Component to use:**
```
src/features/intelligence/components/feed/FeedView.tsx
```

It already:
- Pulls real data from Convex via `useFeed` hook
- Handles masonry layout, skeleton loading, grid/list toggle
- Uses the real Intelligence `PostCard` (proper stats, thumbnails, visibility)

**Wire it in with a filter for vault-eligible content** — posts that have been rated positively via `swipeRatings` OR high-scoring posts from Intelligence's scoring pipeline. For now, pass `sortBy="top"` and let it show the full top feed — we'll add the swipe-rating filter later once mutations are wired.

Props signature:
```tsx
<FeedView
  sortBy="top"
  visibility={{ likes: true, comments: true, views: true, engagement: true }}
  viewMode="grid"
  onPostClick={(index, posts) => { /* open detail drawer */ }}
/>
```

Remove the static `POSTS` import, `NICHES` filter, `TYPES` filter, and community `PostCard` usage entirely.

Keep the toolbar row (niche + type filters + "Start Swipe Session" CTA) — just rewire filters to pass as props to FeedView once it supports them (`niche`, `contentType` props already exist on FeedView).

---

### 2. Rebuild the right-hand sidebar — Top Creators only

**File:** `src/features/community/components/sidebar/LeaderboardSidebar.tsx`

**Remove entirely:**
- "Grow your reach" card (the Connect Account CTA block)
- "Discover" section

**Keep and improve:**
- Top Creators leaderboard block

**Changes to Top Creators:**
- Replace colored initial circles with real profile photo `<img>` tags
  - Use `creator.avatarUrl` if available from Convex, fall back to a placeholder avatar service (`https://i.pravatar.cc/32?u={handle}`) until real photos are wired
  - `w-8 h-8 rounded-full object-cover` — same sizing, just real image
- Pull leaderboard data from Convex (query `getTopCreators` or equivalent) — not `LEADERBOARD_ENTRIES` static constant
  - If no Convex query exists yet, keep static data but replace initials with pravatar fallbacks so it looks real
- Keep rank coloring (gold/silver/bronze), engagement rate, follower count — the layout is fine

Result: a single clean card, sleek, tight — just the ranked list with real faces.

---

## Files to touch

| File | Change |
|------|--------|
| `src/features/community/components/vault/VaultTabContent.tsx` | Swap PostCard grid → FeedView |
| `src/features/community/components/sidebar/LeaderboardSidebar.tsx` | Strip to Top Creators only + real avatars |

Do **not** touch:
- `src/features/intelligence/components/feed/FeedView.tsx` — use it, don't modify it
- `src/features/intelligence/components/feed/PostCard.tsx` — use it, don't modify it
- `src/features/community/constants.ts` — leave POSTS for SavedTabContent which still uses it

---

## Done criteria

- [ ] Vault grid shows real Intelligence content (not static POSTS)
- [ ] Cards match Intelligence PostCard style exactly
- [ ] Sidebar shows Top Creators only — Connect Account and Discover blocks gone
- [ ] Creator rows show circular avatar images (real or pravatar fallback), not initials
- [ ] "Start Swipe Session" CTA still works (switches to Approve tab)
- [ ] No TypeScript errors
