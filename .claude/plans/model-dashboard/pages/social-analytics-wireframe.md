# Social Analytics Wireframe + Component Spec
# Route: /model/social
# Features: M12, M13, M14, M15, M16, M17, M18
# Layout: MOBILE-FIRST (375px)
# Last updated: 2026-04-13

---

## 0. Context Summary

The model's personal social media health check. Mobile-first, 375px. Deliberately simple —
"how am I doing" at a glance. No deep analysis. Top 3 posts pinned at top, week-over-week
arrows, all-time best post permanently pinned. IG-focused for now (additional platforms later).
OFM accent: `linear-gradient(135deg, #ff0069, #833ab4)`.

Design philosophy: "Treat models like 5 year olds" — big numbers, clear arrows, no jargon.

---

## 1. ASCII WIREFRAME — MOBILE (375px)

### Main view

```
┌─────────────────────────────────────────┐  375px
│  ░░░ IssoSidebarShell (56px icon rail) ░│
│                                         │
│  ┌───────────────────────────────────┐  │
│  │ ContentPageShell                  │  │
│  │                                   │  │
│  │ ┌─ ROW 1 — Header ──────────────┐ │  │  h-14 px-3
│  │ │ [📷] My Socials  [★ 480 pts]  │ │  │
│  │ └───────────────────────────────┘ │  │
│  │                                   │  │
│  │ ┌─ ROW 2 — Sub-nav ─────────────┐ │  │  px-3 py-2
│  │ │ [This Week ●] [Month] [All]   │ │  │
│  │ │                   [← ↑ 12% →] │ │  │  WeekArrows
│  │ └───────────────────────────────┘ │  │
│  │                                   │  │
│  │ ┌─ ROW 3 — Content ─────────────┐ │  │  overflow-y-auto px-4 py-4
│  │ │                               │ │  │
│  │ │ ┌─ AccountHealthCard ───────┐ │ │  │
│  │ │ │  @modelname               │ │ │  │
│  │ │ │  Instagram                │ │ │  │
│  │ │ │                           │ │ │  │
│  │ │ │  ┌──────────┬───────────┐ │ │ │  │
│  │ │ │  │  12.4K   │   4.8%    │ │ │ │  │
│  │ │ │  │Followers │   Eng.    │ │ │ │  │
│  │ │ │  │  ▲ +340  │  ▲ +0.3% │ │ │ │  │
│  │ │ │  └──────────┴───────────┘ │ │ │  │
│  │ │ │                           │ │ │  │
│  │ │ │  Reach this week: 48,200  │ │ │  │
│  │ │ │  Posts this week: 5       │ │ │  │
│  │ │ └───────────────────────────┘ │ │  │
│  │ │                               │ │  │
│  │ │ ┌─ WeekComparisonBanner ────┐ │ │  │
│  │ │ │  ▲ Up 12% from last week  │ │ │  │
│  │ │ │  "Great job! Keep going!" │ │ │  │
│  │ │ └───────────────────────────┘ │ │  │
│  │ │                               │ │  │
│  │ │  YOUR TOP 3 POSTS THIS WEEK   │ │  │
│  │ │                               │ │  │
│  │ │ ┌─ TopPostCard #1 ──────────┐ │ │  │
│  │ │ │  ┌────────────────────┐   │ │ │  │
│  │ │ │  │                    │   │ │ │  │
│  │ │ │  │   [4:5 thumbnail]  │   │ │ │  │  aspect-[4/5]
│  │ │ │  │                    │   │ │ │  │
│  │ │ │  │  👑 #1 This Week   │   │ │ │  │  overlay badge
│  │ │ │  └────────────────────┘   │ │ │  │
│  │ │ │  👁 8,420 views  ❤ 1,240  │ │ │  │
│  │ │ │  ▲ 3× your average        │ │ │  │
│  │ │ └───────────────────────────┘ │ │  │
│  │ │                               │ │  │
│  │ │ ┌─ TopPostCard #2 + #3 ─────┐ │ │  │
│  │ │ │  [thumb]  [thumb]          │ │ │  │  side-by-side smaller
│  │ │ │  #2 post  #3 post          │ │ │  │
│  │ │ │  4.2K views  3.8K views   │ │ │  │
│  │ │ └───────────────────────────┘ │ │  │
│  │ │                               │ │  │
│  │ │  ─────── ALL TIME ────────    │ │  │
│  │ │                               │ │  │
│  │ │ ┌─ BestPostEverCard ────────┐ │ │  │
│  │ │ │  ⭐ YOUR BEST POST EVER   │ │ │  │
│  │ │ │  ┌────────────────────┐   │ │ │  │
│  │ │ │  │  [4:5 thumbnail]   │   │ │ │  │
│  │ │ │  │  ⭐ Best Ever       │   │ │ │  │
│  │ │ │  └────────────────────┘   │ │ │  │
│  │ │ │  👁 42,800 views  ❤ 6,100  │ │ │  │
│  │ │ │  Posted: Feb 12            │ │ │  │
│  │ │ └───────────────────────────┘ │ │  │
│  │ │                               │ │  │
│  │ └───────────────────────────────┘ │  │
│  └───────────────────────────────────┘  │
└─────────────────────────────────────────┘
```

---

## 2. COMPONENT TREE

```
SocialAnalyticsFeaturePage              ← default export
│
├── ContentPageShell
│   ├── [header slot]
│   │   ├── ProductIcon (Instagram icon)
│   │   ├── "My Socials" (text-sm font-semibold)
│   │   └── PointsStatPill (★ 480 pts)
│   │
│   ├── [sub-nav slot]
│   │   ├── PeriodTabs ("This Week" active / "Month" / "All")
│   │   └── WeekComparisonArrows (← ↑12% →)     ← NEW (M17)
│   │
│   └── [content slot]
│       └── motion.div (staggerChildren)
│           ├── AccountHealthCard               ← NEW (M12, M14)
│           ├── WeekComparisonBanner            ← NEW (M17)
│           ├── section: "Your Top 3 Posts"
│           │   ├── TopPostCard (rank=1)        ← NEW (M13) — large
│           │   └── TopPostCardRow              ← NEW — #2 + #3 side by side
│           └── section: "All Time"
│               └── BestPostEverCard            ← NEW (M18)
```

---

## 3. PER-COMPONENT SPECS

---

### 3.1 AccountHealthCard

**File:** `src/features/social-analytics/components/AccountHealthCard.tsx`

```tsx
interface AccountHealthCardProps {
  handle: string;           // e.g. "@modelname"
  platform: 'instagram';
  followers: number;
  followerDelta: number;    // absolute change this period
  engagementRate: number;   // e.g. 4.8 (%)
  engagementDelta: number;  // e.g. 0.3 (pp change)
  weeklyReach: number;
  weeklyPosts: number;
}
```

**Tailwind:**
```tsx
<div className="rounded-xl bg-white p-4" style={{ border: '1px solid rgba(0,0,0,0.07)', boxShadow: '0 1px 4px rgba(0,0,0,0.04)' }}>
  <div className="flex items-center gap-2 mb-3">
    <div className="w-8 h-8 rounded-full bg-gradient-to-br from-[#f9ce34] via-[#ee2a7b] to-[#6228d7] flex items-center justify-center">
      <Instagram size={14} className="text-white" />
    </div>
    <div>
      <p className="text-sm font-semibold text-neutral-900">{handle}</p>
      <p className="text-xs text-neutral-400">Instagram</p>
    </div>
  </div>

  <div className="grid grid-cols-2 gap-3 mb-3">
    {/* Followers */}
    <div className="rounded-lg bg-neutral-50 px-3 py-2.5" style={{ border: '1px solid rgba(0,0,0,0.05)' }}>
      <p className="text-xs text-neutral-400">Followers</p>
      <p className="text-xl font-bold text-neutral-900 mt-0.5">
        {followers >= 1000 ? `${(followers / 1000).toFixed(1)}K` : followers}
      </p>
      <DeltaArrow value={followerDelta} format="absolute" />
    </div>
    {/* Engagement */}
    <div className="rounded-lg bg-neutral-50 px-3 py-2.5" style={{ border: '1px solid rgba(0,0,0,0.05)' }}>
      <p className="text-xs text-neutral-400">Engagement</p>
      <p className="text-xl font-bold text-neutral-900 mt-0.5">{engagementRate}%</p>
      <DeltaArrow value={engagementDelta} format="pp" />
    </div>
  </div>

  <div className="flex items-center gap-4 text-xs text-neutral-500 border-t border-neutral-100 pt-3">
    <span>Reach: <strong className="text-neutral-700">{(weeklyReach / 1000).toFixed(1)}K</strong></span>
    <span>Posts: <strong className="text-neutral-700">{weeklyPosts}</strong></span>
  </div>
</div>
```

---

### 3.2 DeltaArrow (sub-component)

**Inline utility, not extracted unless reused elsewhere.**

```tsx
interface DeltaArrowProps {
  value: number;
  format: 'absolute' | 'percent' | 'pp';
}

// Renders: ▲ +340   or   ▼ -12   or   ─ 0
const sign = value > 0 ? '▲' : value < 0 ? '▼' : '─';
const color = value > 0 ? 'text-green-600' : value < 0 ? 'text-red-500' : 'text-neutral-400';
const display = format === 'percent' ? `${Math.abs(value)}%`
              : format === 'pp' ? `${Math.abs(value).toFixed(1)}pp`
              : `+${Math.abs(value).toLocaleString()}`;
```

---

### 3.3 WeekComparisonBanner

**File:** `src/features/social-analytics/components/WeekComparisonBanner.tsx`

```tsx
interface WeekComparisonBannerProps {
  percentChange: number;    // e.g. 12 = +12%, -5 = -5%
  message?: string;         // e.g. "Great job! Keep going!"
}
```

**Tailwind:**
```tsx
<motion.div
  className="rounded-xl px-4 py-3 flex items-center gap-3"
  style={percentChange >= 0
    ? { background: 'rgba(34,197,94,0.06)', border: '1px solid rgba(34,197,94,0.20)' }
    : { background: 'rgba(239,68,68,0.06)', border: '1px solid rgba(239,68,68,0.20)' }
  }
  initial={{ opacity: 0, scale: 0.97 }}
  animate={{ opacity: 1, scale: 1 }}
>
  <span className="text-2xl">{percentChange >= 0 ? '📈' : '📉'}</span>
  <div>
    <p className={cn('text-sm font-semibold', percentChange >= 0 ? 'text-green-700' : 'text-red-600')}>
      {percentChange >= 0 ? '▲' : '▼'} {percentChange >= 0 ? 'Up' : 'Down'} {Math.abs(percentChange)}% from last week
    </p>
    {message && <p className="text-xs text-neutral-500 mt-0.5">{message}</p>}
  </div>
</motion.div>
```

**Motivation messages (auto-generated):**
```ts
const motivationMessages: Record<string, string> = {
  high:    "Great job! Keep going!",          // > 20%
  medium:  "Nice progress this week!",         // 5–20%
  low:     "Every post counts. You got this!", // 0–5%
  decline: "No worries — next week is new.",   // negative
};
```

---

### 3.4 WeekComparisonArrows (sub-nav slot)

**Inline in sub-nav slot — not extracted:**

```tsx
// Sits in sub-nav right slot
// Shows ← PREV | ▲ 12% | NEXT → navigation
<div className="flex items-center gap-1 ml-auto">
  <button className="p-1.5 rounded-md hover:bg-neutral-100 transition-colors" onClick={prevWeek}>
    <ChevronLeft size={14} className="text-neutral-400" />
  </button>
  <span className={cn(
    'text-xs font-semibold px-2',
    weekDelta >= 0 ? 'text-green-600' : 'text-red-500'
  )}>
    {weekDelta >= 0 ? '▲' : '▼'} {Math.abs(weekDelta)}%
  </span>
  <button className="p-1.5 rounded-md hover:bg-neutral-100 transition-colors" onClick={nextWeek}>
    <ChevronRight size={14} className="text-neutral-400" />
  </button>
</div>
```

---

### 3.5 TopPostCard (rank=1, large)

**File:** `src/features/social-analytics/components/TopPostCard.tsx`

```tsx
interface TopPostCardProps {
  rank: 1 | 2 | 3;
  post: {
    thumbnailUrl: string;
    views: number;
    likes: number;
    postedAt: number;
    vsAverageMultiplier?: number;  // e.g. 3 = "3× your average"
  };
  variant: 'large' | 'small';
}
```

**Large variant (rank=1):**
```tsx
<motion.div
  className="rounded-xl overflow-hidden"
  style={{ border: '1px solid rgba(0,0,0,0.07)' }}
  initial={{ opacity: 0, y: 12 }}
  animate={{ opacity: 1, y: 0 }}
  transition={{ duration: 0.4, delay: 0.1 }}
>
  {/* Thumbnail — 4:5 aspect ratio */}
  <div className="relative aspect-[4/5] bg-neutral-100">
    <img src={post.thumbnailUrl} className="w-full h-full object-cover" />
    {/* Rank badge */}
    <div className="absolute top-2 left-2 flex items-center gap-1 px-2 py-1 rounded-lg bg-black/50 backdrop-blur-sm">
      <span className="text-sm">👑</span>
      <span className="text-[11px] font-bold text-white">#1 This Week</span>
    </div>
  </div>

  {/* Stats */}
  <div className="px-3 py-2.5">
    <div className="flex items-center gap-3">
      <span className="text-xs text-neutral-600 flex items-center gap-1">
        <Eye size={11} className="text-neutral-400" /> {(post.views / 1000).toFixed(1)}K views
      </span>
      <span className="text-xs text-neutral-600 flex items-center gap-1">
        <Heart size={11} className="text-neutral-400" /> {(post.likes / 1000).toFixed(1)}K
      </span>
    </div>
    {post.vsAverageMultiplier && (
      <p className="text-xs mt-1" style={{ color: '#ff0069' }}>
        ▲ {post.vsAverageMultiplier}× your average
      </p>
    )}
  </div>
</motion.div>
```

**Small variant (#2 and #3):** Same structure but displayed side-by-side in a 2-column grid.
Thumbnail is `aspect-square` instead of 4:5. Rank badge shows `#2` / `#3`.

---

### 3.6 BestPostEverCard

**File:** `src/features/social-analytics/components/BestPostEverCard.tsx`

```tsx
interface BestPostEverCardProps {
  post: {
    thumbnailUrl: string;
    views: number;
    likes: number;
    postedAt: number;
  };
}
```

**Tailwind:**
```tsx
<div className="rounded-xl overflow-hidden"
  style={{ border: '1px solid rgba(255,0,105,0.20)', boxShadow: '0 2px 12px rgba(255,0,105,0.08)' }}
>
  {/* Header */}
  <div className="px-3 py-2 flex items-center gap-2"
    style={{ background: 'linear-gradient(135deg, rgba(255,0,105,0.06), rgba(131,58,180,0.06))' }}
  >
    <Star size={13} style={{ color: '#ff0069' }} fill="#ff0069" />
    <p className="text-[11px] font-bold uppercase tracking-[0.25em]" style={{ color: '#ff0069' }}>
      Your Best Post Ever
    </p>
  </div>

  {/* Thumbnail */}
  <div className="relative aspect-[4/5] bg-neutral-100">
    <img src={post.thumbnailUrl} className="w-full h-full object-cover" />
    <div className="absolute top-2 right-2 px-2 py-1 rounded-lg bg-black/50 backdrop-blur-sm flex items-center gap-1">
      <Star size={10} className="text-yellow-400" fill="#facc15" />
      <span className="text-[11px] font-bold text-white">Best Ever</span>
    </div>
  </div>

  {/* Stats */}
  <div className="px-3 py-2.5">
    <div className="flex items-center gap-3">
      <span className="text-xs text-neutral-600 flex items-center gap-1">
        <Eye size={11} /> {(post.views / 1000).toFixed(1)}K views
      </span>
      <span className="text-xs text-neutral-600 flex items-center gap-1">
        <Heart size={11} /> {(post.likes / 1000).toFixed(1)}K
      </span>
    </div>
    <p className="text-[11px] text-neutral-400 mt-1">
      Posted: {format(post.postedAt, 'MMM d, yyyy')}
    </p>
  </div>
</div>
```

---

## 4. INTERACTION SPEC

### 4.1 Period tab switch
```
User taps "This Week" / "Month" / "All"
  → AnimatePresence mode="wait" transitions content
  → Convex query refires with new date range
  → TopPostCard grid re-renders with new top posts
  → AccountHealthCard stats update
  → WeekComparisonBanner hides when "All" selected
```

### 4.2 Week arrow navigation (M17)
```
User taps ← (prev week)
  → weekOffset state decrements
  → Convex query refires for that week's data
  → WeekComparisonBanner updates delta vs the week before
  → WeekComparisonArrows in sub-nav updates % display
```

### 4.3 Tap post thumbnail
```
User taps a TopPostCard or BestPostEverCard thumbnail
  → Opens VideoLightbox (if reel) or image lightbox (if photo)
  → Fullscreen view with stats overlay
```

### 4.4 Daily top post notification (M16)
```
Push notification (server-side, via Convex scheduled function):
  → Fires daily at model's local 9 AM
  → "Your top post today: 3.2K views 🔥"
  → Deep links to /model/social with that post highlighted
  → No in-page UI needed (notification-only feature)
```

---

## 5. GAMIFICATION INTEGRATION

| Trigger | Points | Display |
|---------|--------|---------|
| Check socials (page visit) | +5 pts | Silent — feeds streak |
| Week-over-week improvement | +20 pts | WeekComparisonBanner pulse |
| Post goes viral (3× average) | +50 pts | TopPostCard badge glow |

PointsStatPill in header shows running total. No floating overlay — lightweight integration.

---

## 6. REUSE INSTRUCTIONS

| Component | Source | Notes |
|-----------|--------|-------|
| `PointsStatPill` | `@/features/content-requests/` | Shared gamification |
| `VideoLightbox` | `@/features/intelligence/` | Post preview lightbox |
| `OutlierRow` | `@/features/intelligence/` | NOT used — TopPostCard is simpler/more visual |
| `FormatChart` | `@/features/intelligence/` | NOT used — engagement shown as simple delta arrows |

---

## 7. FILE STRUCTURE

```
src/features/social-analytics/
  components/
    SocialAnalyticsFeaturePage.tsx
    AccountHealthCard.tsx
    WeekComparisonBanner.tsx
    TopPostCard.tsx
    BestPostEverCard.tsx
    index.ts
  hooks/
    useSocialStats.ts    ← wraps Instagram API via Convex
  types.ts

src/app/model/social/page.tsx    ← thin wrapper only
```

---

## 8. DESIGN TOKEN SUMMARY

| Token | Value | Use |
|-------|-------|-----|
| OFM gradient | `linear-gradient(135deg, #ff0069, #833ab4)` | Accent elements |
| OFM pink | `#ff0069` | Best post border, delta arrows, rank badge |
| Growth green | `text-green-600` / `rgba(34,197,94,...)` | Positive deltas, up-week banner |
| Decline red | `text-red-500` / `rgba(239,68,68,...)` | Negative deltas, down-week banner |
| Card border | `rgba(0,0,0,0.07)` | Standard cards |
| Best post glow | `0 2px 12px rgba(255,0,105,0.08)` | BestPostEverCard |
