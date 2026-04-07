# Issue: Saved tab re-ramp

**Agent:** ui.hub.saved  
**Surface:** surface:35  
**Worktree:** `/Users/shaansisodia/SISO_Workspace/SISO_Agency/apps/isso-dashboard-saved-ramp`  
**Branch:** `feat/saved-ramp`  
**Priority:** P0 — today

---

## What the Saved tab is for

The user's personal content library — posts they've bookmarked from the Vault or Intelligence feed via the "Save to Hub" button. Grouped by niche for easy browsing. Think of it as a mood board / reference folder.

---

## Current state (broken)

| Problem | Location |
|---------|----------|
| Data is `POSTS.filter(p => p.saved)` — static fake array | `SavedTabContent.tsx:25` |
| Uses community `PostCard` — gradient bg, colored initials, no real video | `SavedTabContent.tsx:118` |
| Niche list is hardcoded (`fitness/lifestyle/fashion/wellness`) | `SavedTabContent.tsx:10-16` |
| Niche group headers use `📌` emoji | `SavedTabContent.tsx:133` |

---

## What already exists in Convex

- `scrapedPosts` table has a `saved: boolean` field (defaults `false`)
- `toggleSave` mutation exists at `convex/intelligence.ts` — already wired into Intelligence `PostCard`
- No `getSavedPosts` query exists yet — needs to be added

---

## What to build

### 1. Add `getSavedPosts` query to `convex/intelligence.ts`

```ts
export const getSavedPosts = query({
  args: {},
  handler: async (ctx) => {
    return ctx.db
      .query("scrapedPosts")
      .filter(q => q.eq(q.field("saved"), true))
      .order("desc")
      .collect();
  },
});
```

---

### 2. Wire `SavedTabContent` to Convex

Replace the static `POSTS` source:

```tsx
import { useQuery } from 'convex/react';
import { api } from '@/convex/_generated/api';

const savedPosts = useQuery(api.intelligence.getSavedPosts) ?? [];
```

Show a skeleton/loading state while `savedPosts === undefined` (query loading). Reuse the existing empty state UI (it's good).

---

### 3. Swap community `PostCard` → Intelligence `PostCard`

Replace:
```tsx
import { PostCard } from '../feed/PostCard';
```
With:
```tsx
import { PostCard } from '@/features/intelligence/components/feed/PostCard';
```

The Intelligence `PostCard` has:
- Real thumbnails (`thumbnailUrl` — handles both real URLs and gradient strings)
- Video lightbox on click (plays inline via `VideoLightbox`)
- Real stats (likes, views, saves)
- "Save to Hub" / unsave button (already wired to `toggleSave`)
- `PostDetailDrawer` expand button

Pass visibility:
```tsx
<PostCard
  post={post}
  visibility={{ likes: true, views: true, saveCount: false, brandDetails: true }}
  onPostClick={() => openDrawer(index, savedPosts)}
/>
```

Wire up `PostDetailDrawer` the same way Intelligence does — import `PostDetailDrawer` from `@/features/intelligence/components/drawer/PostDetailDrawer` and add drawer state to `SavedTabContent`.

---

### 4. Dynamic niche grouping from real data

Replace the hardcoded `NICHES` array. Derive available niches from actual saved posts:

```tsx
// Derive unique niches from actual data
const availableNiches = ['all', ...Array.from(new Set(savedPosts.map(p => p.niche))).sort()];
```

For the niche filter pills, use `NICHE_COLORS` from Intelligence constants for color:
```tsx
import { NICHE_COLORS } from '@/features/intelligence/constants';
```

For the grouped view, group dynamically:
```tsx
const grouped = availableNiches
  .filter(n => n !== 'all')
  .map(n => ({ niche: n, posts: savedPosts.filter(p => p.niche === n) }))
  .filter(g => g.posts.length > 0);
```

---

### 5. Fix niche group headers — remove emoji

Replace the `📌` emoji with a small colored dot:

```tsx
function NicheGroup({ niche, posts }: { niche: string; posts: Post[] }) {
  const color = NICHE_COLORS[niche] ?? '#833ab4';
  return (
    <div>
      <div className="flex items-center gap-2 mb-2.5">
        <div className="w-2 h-2 rounded-full flex-shrink-0" style={{ backgroundColor: color }} />
        <span className="text-xs font-bold capitalize" style={{ color }}>
          {niche}
        </span>
        <span
          className="text-[10px] font-semibold px-1.5 py-0.5 rounded-full"
          style={{ backgroundColor: `${color}18`, color }}
        >
          {posts.length}
        </span>
      </div>
      <div className="columns-2 sm:columns-3 lg:columns-4 gap-3">
        {posts.map((post, i) => (
          <div key={post._id} className="break-inside-avoid mb-3">
            <PostCard post={post} visibility={...} onPostClick={() => openDrawer(...)} />
          </div>
        ))}
      </div>
    </div>
  );
}
```

Use masonry columns (same as Intelligence FeedView) not a fixed grid — videos have varying aspect ratios.

---

## Files to touch

| File | Change |
|------|--------|
| `convex/intelligence.ts` | Add `getSavedPosts` query |
| `src/features/community/components/saved/SavedTabContent.tsx` | Wire Convex, swap PostCard, dynamic niches, fix headers, add drawer |

Do **not** touch Intelligence's PostCard, FeedView, or PostDetailDrawer — import and use them as-is.

---

## Done criteria

- [ ] Saved posts pulled from Convex `scrapedPosts` where `saved === true`
- [ ] Loading skeleton shown while query is in flight
- [ ] Intelligence `PostCard` used — real thumbnails, video lightbox works
- [ ] Clicking a card opens `PostDetailDrawer`
- [ ] Niche filter pills derived from real post data, not hardcoded
- [ ] Niche group headers use colored dot, not emoji
- [ ] Masonry layout (not fixed grid) to handle video aspect ratios
- [ ] Empty state CTA ("Browse the Vault") still works
- [ ] No TypeScript errors
