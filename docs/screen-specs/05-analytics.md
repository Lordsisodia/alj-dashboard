# Screen 05 — Analytics

**Route:** `/analytics`  
**File:** `src/app/analytics/page.tsx` (713 lines) — the most built-out screen

---

## What it does

Deep performance analytics for a selected creator account. Shows follower growth, engagement metrics, top posts, audience demographics, and active hours. Contextualised to the currently selected account from the sidebar switcher.

---

## Layout

### Sticky header
- Account name (@handle) as page title
- "Export Report" button
- Radar/scan-line grid overlay effect (CSS background pattern — aesthetic only)

### Account header card
- Avatar (large, gradient)
- Handle + "Creator Account" badge + "Connected" status
- Bio/description line

### Stats Row 1 — Top KPIs (4 cards)
- **Followers** — with +N this week trend indicator
- **Following**
- **Posts** — total post count
- **Engagement Rate %** — with vs last period delta

All 4 cards use animated number counters (count up from 0 on scroll-into-view).

### Stats Row 2 — Avg metrics (4 cards)
- Avg Likes per post
- Avg Comments per post
- Avg Saves per post
- Avg Reach per post

### Follower Growth Chart
- Time range toggle: 7D / 30D / 90D / 1Y
- Custom bar chart (pure CSS + Framer Motion animated bars)
- Y-axis labels, X-axis month labels
- Hover tooltip showing exact value
- Bars: lime green gradient

### Bottom section — 2 columns (3:2 split)

**Left (3 cols) — Top Posts**
- Sort filter: Top Likes / Top Comments / Top Saves / Top Reach
- Each post row: gradient thumbnail, Likes/Comments/Saves/Reach stats, caption, date
- "+18% vs avg" highlight on standout posts

**Right (2 cols) — Two stacked cards**

*Engagement Over Time:*
- Weekly engagement rate bars (W1–W8)
- Horizontal progress bars, lime colour
- Rate percentage shown per week

*Audience Insights:*
- Top Locations (city breakdown, progress bars)
- Top Age Range (25-34 shown with 47% bar)
- Gender Split (dual bar: Male 78% / Female 22%)
- Active Hours (pill tags: "8-11am", "7-10pm")

---

## Data needed (Convex)

```ts
// analytics table (per model, updated periodically)
{
  modelId: string,
  updatedAt: number,
  followers: number,
  following: number,
  totalPosts: number,
  engagementRate: number,
  avgLikes: number,
  avgComments: number,
  avgSaves: number,
  avgReach: number,
  followerGrowth: { label: string, value: number }[],   // monthly data points
  weeklyEngagement: { week: string, rate: number }[],
  topPosts: {
    id: string,
    thumbnailUrl?: string,
    likes: number,
    comments: number,
    saves: number,
    reach: number,
    posted: string,
    caption: string,
    likesChangePct?: number,
  }[],
  audienceLocations: { city: string, pct: number }[],
  ageRange: string,
  agePct: number,
  genderMalePct: number,
  genderFemalePct: number,
  activeHours: string[],
}
```

---

## OFM adaptations

| Reference (IG metrics) | ISSO (OFM metrics) |
|---|---|
| Followers | Subscribers |
| Following | N/A (OF accounts don't "follow") |
| Posts count | Posts + Videos count |
| Engagement Rate | Engagement Rate (likes + comments / subscribers) |
| Avg Likes | Avg Likes |
| Avg Comments | Avg Comments + DMs (OFM has message metrics) |
| Avg Saves | Avg Tips (OFM-specific) |
| Avg Reach | Avg Views |
| Top Locations | Top Subscriber Locations |
| Gender Split | Gender Split (OFM skews heavily male) |
| Active Hours | Active Hours (when fans are online) |

**The chart structure is identical** — just the labels and data sources change.

---

## Key design details to preserve

- Animated number counters on scroll
- Radar scan-line header background effect
- Custom bar chart (no external chart library — pure CSS + Framer Motion)
- Hover tooltips on chart bars
- `SectionCard` wrapper with fade-up scroll animation on every section

---

## Open questions

- OPEN: Is analytics data pulled from OF API directly, or entered manually / via a third-party analytics tool?
- OPEN: Does the sidebar account switcher filter this page to the selected model?
- ASSUMED: Yes — the analytics page is scoped to the currently selected account in the sidebar.
- OPEN: "Export Report" — what format? PDF? CSV?
