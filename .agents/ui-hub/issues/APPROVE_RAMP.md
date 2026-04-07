# Issue: Approve tab re-ramp

**Agent:** ui.hub.approve  
**Surface:** surface:37  
**Priority:** P0 — today

---

## What the Approve tab is for

The swipe engine. Team members rate incoming content from Intelligence — right swipe = up, left = down, send = assign to a model. These ratings train the Intelligence scoring pipeline via `swipeRatings`.

---

## Current state (broken)

| Problem | Location |
|---------|----------|
| `appendRecord()` is pure `useState` — zero Convex writes | `SwipeTabContent.tsx:38` |
| Queue uses `SEED_REELS` (8 static mock items) | `SwipeTabContent.tsx:27`, `constants.ts` |
| `GridMode` is bespoke — gradient bg, no real card component | `SwipeTabContent.tsx:223-298` |
| `SwipeAuditLog` reads from local `allLog` state only — lost on refresh | `SwipeTabContent.tsx:29` |
| Dead space below `WhyTagPanel` in swipe mode | `SwipeTabContent.tsx:179` |

---

## Schema (ready — just not connected)

```ts
swipeRatings: {
  postId:  v.id("scrapedPosts"),
  ratedBy: v.string(),           // "Alex / ALJ" etc
  rating:  "up" | "down" | "save",
  ratedAt: v.number(),           // Date.now()
}
// indexes: by_post, by_rater
```

---

## What to build

### 1. Create `convex/hub.ts` with write + read mutations

```ts
// mutation: record a swipe
export const recordSwipe = mutation({
  args: {
    postId:  v.id("scrapedPosts"),
    ratedBy: v.string(),
    rating:  v.union(v.literal("up"), v.literal("down"), v.literal("save")),
  },
  handler: async (ctx, args) => {
    await ctx.db.insert("swipeRatings", { ...args, ratedAt: Date.now() });
  },
});

// query: get recent ratings with joined post data for history view
export const getSwipeHistory = query({
  args: { limit: v.optional(v.number()) },
  handler: async (ctx, { limit = 50 }) => {
    const ratings = await ctx.db.query("swipeRatings")
      .order("desc")
      .take(limit);
    return Promise.all(ratings.map(async r => ({
      ...r,
      post: await ctx.db.get(r.postId),
    })));
  },
});

// query: get unrated posts for the swipe queue
export const getSwipeQueue = query({
  args: {},
  handler: async (ctx) => {
    const rated = await ctx.db.query("swipeRatings").collect();
    const ratedIds = new Set(rated.map(r => r.postId));
    const posts = await ctx.db.query("scrapedPosts")
      .withIndex("by_engagement")
      .order("desc")
      .take(50);
    return posts.filter(p => !ratedIds.has(p._id));
  },
});
```

---

### 2. Wire `appendRecord` to call `recordSwipe` mutation

In `SwipeTabContent.tsx`, import and call `useMutation(api.hub.recordSwipe)` inside `appendRecord()`.

Map local decision → schema rating:
- `'like'` → `'up'`
- `'pass'` → `'down'`  
- `'sent'` → `'save'`

Keep local `useState` session tracking for the in-session counters (rated/passed/sent) — that's fine. Just add the Convex write alongside it.

```ts
const recordSwipe = useMutation(api.hub.recordSwipe);

function appendRecord(decision: RatingRecord['decision'], ...) {
  const reel = currentReel();
  if (!reel) return;
  
  // Write to Convex
  const ratingMap = { like: 'up', pass: 'down', sent: 'save' } as const;
  if (reel.postId) { // only if it's a real Convex post
    recordSwipe({ postId: reel.postId, ratedBy: 'Alex / ALJ', rating: ratingMap[decision] });
  }

  // Keep existing local state logic unchanged
  ...
}
```

---

### 3. Replace `GridMode` with Intelligence `PostCard` + action overlay

Delete the inline `GridMode` function entirely. Replace with:

```tsx
import { PostCard } from '@/features/intelligence/components/feed/PostCard';

// In grid mode render:
<div className="grid grid-cols-4 gap-3">
  {reels.map((reel, i) => (
    <div key={reel.id} className="relative group">
      <PostCard
        post={reel as any}  // map SwipeReel → Post shape
        visibility={{ likes: true, comments: false, views: true, saveCount: false, brandDetails: true }}
        onPostClick={() => {}}
      />
      {/* Action overlay — shown on card hover */}
      <div className="absolute bottom-14 left-0 right-0 opacity-0 group-hover:opacity-100 transition-opacity flex justify-center gap-2 pb-2">
        <ActionBtn onClick={onPass} color="#ef4444"><X size={12} /></ActionBtn>
        <ActionBtn onClick={onLike} color="linear-gradient(135deg,#ff0069,#833ab4)" gradient><Heart size={12} className="fill-white" /></ActionBtn>
        <ActionBtn onClick={onSend} color="#833ab4"><Send size={12} /></ActionBtn>
      </div>
    </div>
  ))}
</div>
```

Keep the `ActionBtn` helper — it's fine.

**Note:** `SwipeReel` has different field names to Intelligence `Post`. You'll need a small adapter:
- `reel.gradient` → `post.thumbnailUrl` (use gradient string directly — PostCard handles non-http thumbnails as `background`)
- `reel.views` → `post.views`
- `reel.creator.handle` → `post.handle`
- `reel.isVideo` → `post.contentType = 'reel'`

---

### 4. Wire History to Convex

In `SwipeTabContent.tsx`, replace the `allLog` useState with a Convex query:

```tsx
const history = useQuery(api.hub.getSwipeHistory, { limit: 100 }) ?? [];
```

Pass `history` to `SwipeAuditLog`. You'll need to adapt `SwipeAuditLog` to accept the new shape (`{ post, rating, ratedAt, ratedBy }[]` instead of `RatingRecord[]`) — or write a mapper inline. The layout of `SwipeAuditLog` is good, keep it.

---

### 5. Fill dead space below WhyTagPanel — "Last rated" mini-feed

The swipe layout has dead space below `WhyTagPanel` on the right. Add a compact "Last rated" section:

```tsx
{/* Below WhyTagPanel */}
{session.log.length > 0 && (
  <div className="mt-4">
    <p className="text-[10px] font-semibold text-neutral-400 uppercase tracking-wide mb-2">
      Last rated
    </p>
    <div className="flex flex-col gap-1.5">
      {[...session.log].reverse().slice(0, 4).map(entry => {
        const cfg = DECISION_CONFIG[entry.decision];
        return (
          <div key={entry.id} className="flex items-center gap-2 px-2.5 py-1.5 rounded-lg" style={{ background: '#f5f5f4' }}>
            <div className="w-6 h-8 rounded flex-shrink-0 overflow-hidden" style={{ background: entry.reel.gradient }} />
            <span className="text-[10px] font-semibold truncate flex-1" style={{ color: cfg.color }}>
              {entry.reel.creator.handle}
            </span>
            <span style={{ color: cfg.color }}>{cfg.icon}</span>
          </div>
        );
      })}
    </div>
  </div>
)}
```

---

### 6. Pull queue from Convex

Replace `const [queue] = useState(SEED_REELS)` with:

```tsx
const convexQueue = useQuery(api.hub.getSwipeQueue) ?? [];
// Fall back to SEED_REELS if Convex is empty (dev convenience)
const queue = convexQueue.length > 0 ? convexQueue : SEED_REELS;
```

Map `scrapedPosts` fields to `SwipeReel` shape for SwipeStack compatibility — or update SwipeStack to accept the Convex post type directly.

---

## Files to touch

| File | Change |
|------|--------|
| `convex/hub.ts` | **Create new** — `recordSwipe` mutation, `getSwipeHistory` query, `getSwipeQueue` query |
| `src/features/hub-swipe/components/SwipeTabContent.tsx` | Wire mutations, replace GridMode, add Last Rated panel |
| `src/features/hub-swipe/components/SwipeAuditLog.tsx` | Accept Convex history shape |

Do **not** touch `SwipeStack.tsx` — the drag/keyboard logic is solid.

---

## Done criteria

- [ ] Every swipe writes a row to `swipeRatings` in Convex
- [ ] Grid view uses Intelligence `PostCard` with overlaid action buttons
- [ ] History tab reads from Convex `swipeRatings` — persists across refresh
- [ ] Dead space below WhyTagPanel shows "Last rated" mini-feed
- [ ] Queue pulls from `scrapedPosts` (falls back to SEED_REELS if empty)
- [ ] No TypeScript errors
