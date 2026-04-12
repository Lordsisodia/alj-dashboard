# Screen 07 — Community

**Route:** `/community`  
**File:** `src/app/community/page.tsx` (514 lines)

---

## What it does

In the reference app this is a social feed showing all posted content across creator accounts — an internal "Instagram-like" feed. For ISSO/OFM the concept shifts: it becomes an internal content performance feed showing what's live on OnlyFans, how it's performing, and a fan message digest.

**Reference concept:** Agency staff browse a feed of all published posts across all their creators, filtered by niche, searchable by caption/hashtag/creator.

---

## Layout

### Top bar
- Brand logo + "IGINFULL Community" / ISSO Community badge
- Search bar: "Search reels, creators, hashtags..."
- View toggles: For You / Following / By Niche

### Niche filter pills (horizontal scroll)
All / Fitness / Lifestyle / Fashion / Food / Travel / Beauty / Comedy

### Main content area (flex row)

**Left — Feed (flex-1)**

Creator story rings strip (horizontal scroll):
- Top 4 creator avatars with pink ring + gold award badge for #1
- Stats: "+2,847 creators", "14.2M views/mo"

Feed grid (1–3 cols responsive):
Each **PostCard** shows:
- Thumbnail (4:5 aspect, image or gradient fallback)
- Video play button overlay (if video)
- View count badge (top-right)
- "IG Posted" badge (top-left, gradient) if published
- Card body:
  - Creator row: avatar, handle, niche · time ago, external link
  - Caption text
  - First 2 hashtags in pink
  - Action row: Like (with count), Comment (with count), Save (bookmark)

**Right sidebar (xl screens only, w-80)**

*IGINFULL Leaderboard card:*
- Ranked list of creators by total views
- Rank number (gold/silver/bronze), avatar, handle, niche, view count

*"Promote on Instagram" CTA card:*
- Gradient border card
- "Every reel you post through IGINFULL gets featured here"
- "Connect IG Account" button

*Discover Creators card:*
- List of 4 creators with follow buttons

*Footer links + copyright*

---

## Data needed (Convex)

```ts
// posts table (published content)
{
  modelId: string,
  contentId: string,
  caption: string,
  hashtags: string[],
  mediaUrl: string,
  thumbnailUrl?: string,
  isVideo: boolean,
  platform: "onlyfans" | "instagram" | "tiktok",
  publishedAt: number,
  metrics: {
    views: number,
    likes: number,
    comments: number,
    saves?: number,
    tips?: number,        // OFM-specific
  },
  niche: string,
}

// Queries:
// posts.feed(filters) → Post[] sorted by publishedAt desc
// posts.leaderboard() → Creator[] ranked by total views
```

---

## OFM adaptations

This screen needs the **most rethinking** for ISSO. The reference is an IG creator community feed. For OFM:

| Reference | ISSO |
|---|---|
| Public IG-style feed of creator posts | Internal feed of OF content performance |
| Niche: Fitness, Lifestyle, Food etc | Niche: GFE, Fitness, Thirst Trap, Meme etc |
| View count from IG | View count from OF |
| "Like" posts in the feed | Internal reaction (not OF likes) — or remove |
| "Connect IG Account" CTA | "Connect OF Account" CTA |
| Creator leaderboard by IG views | Creator leaderboard by OF subscribers/revenue |
| Community = public social network | Community = internal content library / performance digest |

**Suggested ISSO reframe:**
Rename to **"Content Feed"** — a live view of everything published across all models, sortable by performance. Replaces the social interaction with performance metrics (views, tips, conversion).

---

## Key design details to preserve

- PostCard with 4:5 aspect thumbnail, gradient fallback
- Horizontal story-ring strip at top
- 3-col responsive feed grid
- Niche filter pill strip (horizontal scroll)
- Leaderboard right sidebar
- Search with caption/hashtag/creator filtering

---

## Open questions

- OPEN: Is this screen needed for MVP? It's the most "nice to have" — the core workflow is Ideas → Models → Content → Approvals → Schedule.
- OPEN: If kept, should it show OF-published content or all content (including scheduled/draft)?
- ASSUMED: This becomes a "What's Live" feed — shows only published content with real OF metrics.
