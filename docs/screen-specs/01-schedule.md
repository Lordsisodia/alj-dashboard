# Screen 01 — Schedule

**Route:** `/schedule`  
**File:** `src/app/schedule/page.tsx` (510 lines)

---

## What it does

Two views toggled by tabs:

### Calendar View (default)
A monthly calendar showing all scheduled content across model accounts. Each day cell shows colour-coded post thumbnails. Agency can see at a glance what's going out when.

**Key UI:**
- Month nav (prev/next arrows)
- Weekly summary strip: "8 posts · 2 stories · 1 reel · 11 scheduled"
- Content type filter pills: All / Reels / Stories / Carousels / Posts
- Calendar grid (7 cols, 5 rows) — each cell shows up to 2 post thumbnails, "+N more" overflow
- Each thumbnail is colour-coded by content type (post=pink, reel=red, story=amber, carousel=purple)
- Today's date highlighted with pink circle
- "Schedule Post" CTA button (top right)

### Analytics View (tab 2)
Per-account performance summary. Not as deep as the `/analytics` screen — more of a quick overview.

**Key UI:**
- Account header card (handle, name, follower count, PRO badge)
- 4 stat cards: Followers, Following, Total Posts, Avg Engagement
- Bar chart: "Engagement This Week" (Mon–Sun)
- Top Posts grid: 3 cards with thumbnail, likes/comments/saves/reach, date

---

## Data needed (Convex)

```ts
// schedule table
{
  modelId: string,
  date: string,          // "2026-04-01"
  time: string,          // "14:00"
  type: "post" | "reel" | "story" | "carousel",
  status: "scheduled" | "published" | "draft",
  contentId?: string,    // linked content item
  caption?: string,
}

// Per-account analytics summary (denormalised or computed)
{
  modelId: string,
  followers: number,
  following: number,
  totalPosts: number,
  avgEngagement: number,
  weeklyEngagement: { day: string, value: number }[],
  topPosts: TopPost[],
}
```

---

## OFM adaptations

| Reference | ISSO |
|---|---|
| "Schedule Post" → IG post types | "Schedule Post" → OFM post types (photo, video, bundle) |
| Analytics tab uses IG metrics | Analytics tab uses OF metrics (subscribers, tips, PPV revenue) |
| Calendar shows IG content types | Calendar shows OF content types (free, vault, PPV) |
| Engagement = likes/comments | Engagement = views, tips, messages |

---

## Open questions

- OPEN: Do we schedule directly to OnlyFans via API, or is this just a planning calendar?
- OPEN: What OF metrics are available via API vs manual entry?
- OPEN: Should the calendar be per-model or aggregate across all models?
