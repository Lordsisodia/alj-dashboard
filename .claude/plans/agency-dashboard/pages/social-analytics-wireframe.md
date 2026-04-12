# Wireframe: Social Analytics (`/agency/social`)

**Features:** A16–A23
**Accent:** `linear-gradient(135deg, #ff0069, #833ab4)`

---

## ASCII Wireframe (Desktop, 1440px)

```
┌─────────────────────────────────────────────────────────────────────────────────┐
│ OUTER CANVAS                                                                    │
│  ┌──────────┐  ┌──────────────────────────────────────────────────────────────┐ │
│  │ SIDEBAR  │  │ CONTENT CARD                                                  │ │
│  │          │  │ ┌──────────────────────────────────────────────────────────┐ │ │
│  │          │  │ │ HEADER: [📊] Social Analytics  [147 accounts]  [Search]  │ │ │
│  │          │  │ │                                       [+ Tag Content]     │ │ │
│  │          │  │ └──────────────────────────────────────────────────────────┘ │ │
│  │          │  │ ┌──────────────────────────────────────────────────────────┐ │ │
│  │          │  │ │ TABS: [● Instagram] [Twitter/X] [TikTok] [All Platforms] │ │ │
│  │          │  │ │  [Model: All ▾] [Period: 30d ▾]   [Add Filter] [Grid/List]│ │ │
│  │          │  │ └──────────────────────────────────────────────────────────┘ │ │
│  │          │  │ ┌──────────────────────────────────────────────────────────┐ │ │
│  │          │  │ │ STATUS STRIP: ● Scraping active │ 147 accounts │ 4.2% ER │ │ │
│  │          │  │ └──────────────────────────────────────────────────────────┘ │ │
│  │          │  │                                                               │ │
│  │          │  │ ── OVERVIEW STATS ─────────────────────────────────────────  │ │
│  │          │  │ ┌──────────┐ ┌──────────┐ ┌──────────┐ ┌──────────┐        │ │
│  │          │  │ │ Followers │ │ Avg ER   │ │ Posts    │ │ Reach    │        │ │
│  │          │  │ │ 284,100   │ │ 4.2%     │ │ 312      │ │ 1.2M     │        │ │
│  │          │  │ │ ↑3.1%    │ │ ↑0.3pts  │ │ this mo  │ │ ↑18%     │        │ │
│  │          │  │ └──────────┘ └──────────┘ └──────────┘ └──────────┘        │ │
│  │          │  │                                                               │ │
│  │          │  │ ── MODEL ACCOUNTS GRID ────────────────────────────────────  │ │
│  │          │  │ ┌──────────────────────┐ ┌──────────────────────┐           │ │
│  │          │  │ │ [Avatar] Ana Russo   │ │ [Avatar] Belle Chen  │           │ │
│  │          │  │ │ @ana_russo_ofm       │ │ @belle_chen_ig       │           │ │
│  │          │  │ │ 42,100 followers     │ │ 28,400 followers     │           │ │
│  │          │  │ │ ER: 5.1%  ↑  Reach ↑│ │ ER: 3.8%  ↑  Reach ↓│           │ │
│  │          │  │ │ [Top Post thumbnail] │ │ [Top Post thumbnail] │           │ │
│  │          │  │ └──────────────────────┘ └──────────────────────┘           │ │
│  │          │  │                                                               │ │
│  │          │  │ ── TOP PERFORMING POSTS ────────────────────────────────── │ │
│  │          │  │ ← [thumbnail] [thumbnail] [thumbnail] [thumbnail] [thumb] → │ │
│  │          │  │   (horizontal scroll — OutlierRow pattern)                   │ │
│  │          │  │   Each: model name, ER, reach, [+ Tag] [→ Content Gen]       │ │
│  └──────────┘  └──────────────────────────────────────────────────────────────┘ │
└─────────────────────────────────────────────────────────────────────────────────┘
```

---

## Component Tree

```
SocialAnalyticsFeaturePage
├── ContentPageShell
│   ├── header
│   │   ├── ProductIcon "social"
│   │   ├── "Social Analytics"
│   │   ├── StatPill "147 accounts"
│   │   ├── SearchInput
│   │   └── ActionButton "Tag Content" (accentGradient pink)
│   ├── tabBar
│   │   ├── Tab "Instagram" (active)
│   │   ├── Tab "Twitter/X"
│   │   ├── Tab "TikTok"
│   │   ├── Tab "All Platforms"
│   │   ├── ModelFilterPill "Model: All ▾"    ← left filter (A18)
│   │   ├── PeriodFilterPill "Period: 30d ▾"  ← (A19)
│   │   ├── AddFilterPill
│   │   └── ViewToggle (grid/list)
│   └── content
│       ├── StatusStrip (scraping status)
│       └── AnimatePresence
│           └── PlatformTab (shared for all platform tabs)
│               ├── OverviewStatsRow (grid-cols-4)
│               │   ├── KPIDeltaTile "Followers"
│               │   ├── KPIDeltaTile "Avg ER"
│               │   ├── KPIDeltaTile "Posts"
│               │   └── KPIDeltaTile "Reach"
│               ├── ModelAccountsGrid (A16)
│               │   └── AccountCard × N (grid-cols-2 lg:grid-cols-3)
│               └── TopPostsSection (A20)
│                   ├── SectionHeader "Top Performing Posts"
│                   └── OutlierRow (horizontal scroll of PostThumbnails)
```

---

## Key Components

### ModelFilterPill (A18)
```tsx
<button
  className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium text-neutral-600 hover:bg-black/[0.04] transition-colors"
  style={{ border: '1px solid rgba(0,0,0,0.09)' }}
  onClick={() => setModelFilterOpen(true)}
>
  <Users size={12} />
  Model: {selectedModel ? selectedModel.name : 'All'}
  <ChevronDown size={10} />
</button>
// Dropdown: searchable list of all models + "All" option
```

### AccountCard (A16, A17)
```tsx
<div
  className="rounded-xl bg-white p-4 cursor-pointer hover:bg-black/[0.02] transition-colors"
  style={{ border: '1px solid rgba(0,0,0,0.07)' }}
  onClick={() => setSelectedAccount(account)}
>
  {/* Header */}
  <div className="flex items-center gap-3 mb-3">
    <img src={account.modelAvatar} className="w-9 h-9 rounded-full" />
    <div>
      <p className="text-sm font-semibold text-neutral-900">{account.modelName}</p>
      <p className="text-xs text-neutral-400">{account.handle}</p>
    </div>
    <PlatformIcon platform={account.platform} className="ml-auto" />
  </div>

  {/* Stats */}
  <div className="grid grid-cols-3 gap-2 mb-3">
    <StatCell label="Followers" value={account.followers} delta={account.followerDelta} />
    <StatCell label="Avg ER" value={account.avgER + '%'} delta={account.erDelta} />
    <StatCell label="Posts" value={account.postCount} />
  </div>

  {/* Top post preview (A20) */}
  {account.topPost && (
    <div className="rounded-lg overflow-hidden aspect-square bg-neutral-100">
      <img src={account.topPost.thumbnail} className="w-full h-full object-cover" />
    </div>
  )}

  {/* Performance tag (A23) */}
  {account.autoTag && (
    <PerformanceTagBadge tag={account.autoTag} className="mt-2" />
  )}
</div>
```

### TopPostsSection / OutlierRow (A20, A21, A22)
Reuse `OutlierRow` from `features/intelligence/`. Each thumbnail has action overlay:
```tsx
<div className="relative group">
  <img src={post.thumbnail} className="w-32 h-40 object-cover rounded-xl" />
  <div className="absolute inset-0 bg-black/40 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity flex flex-col justify-end p-2 gap-1">
    <p className="text-white text-[10px] font-semibold">{post.modelName}</p>
    <p className="text-white/80 text-[10px]">ER {post.er}% · {post.reach} reach</p>
    <div className="flex gap-1 mt-1">
      <button onClick={() => tagPost(post)} className="text-[10px] bg-white/20 text-white rounded px-1.5 py-0.5">+ Tag</button>
      <button onClick={() => linkToContentGen(post)} className="text-[10px] bg-white/20 text-white rounded px-1.5 py-0.5">→ Content Gen</button>
    </div>
  </div>
</div>
```

### PerformanceTagBadge (A23)
```tsx
<span
  className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-medium"
  style={{ backgroundColor: '#fdf2f8', color: '#ff0069' }}
>
  <Tag size={9} />
  {tag}   {/* e.g. "High ER", "Trending", "Top Reel" */}
</span>
```

### StatusStrip (scraping)
```tsx
<StatusStrip
  status={{ label: 'Scraping active', active: true }}
  stats={[
    { icon: <Users size={10} />, value: accountCount, label: 'accounts' },
    { icon: <TrendingUp size={10} />, value: '4.2%', label: 'avg ER' },
    { icon: <Eye size={10} />, value: '1.2M', label: 'avg reach' },
  ]}
  rightSlot={<>
    <Clock size={10} className="text-red-600" />
    <span>Last scrape: <span className="font-medium text-neutral-700">{timeAgo(lastScrape)}</span></span>
  </>}
/>
```

---

## Interaction Spec

| Interaction | Behaviour |
|-------------|-----------|
| Platform tab switch | Filters all accounts to that platform; animates slide |
| Model filter | Dropdown shows all models; selecting one filters AccountCards |
| Period filter | 7d / 30d / 90d — updates stats and top posts |
| AccountCard click | Opens AccountDetailDrawer (right panel: full stats, all posts, WoW trend) |
| "Tag Content" button | Opens TagModal — select post + assign performance tag (A23) |
| "→ Content Gen" | Links post to R&D Table entry — opens SendToPipelineModal (A22) |
| "+" Tag on post | Inline tag picker overlay (A21, A23) |
| ViewToggle grid/list | Grid = AccountCards, List = compact table rows |

---

## Reuse Instructions

- `KPIDeltaTile` — intelligence, drop in (4 in overview row)
- `OutlierRow` — intelligence, reuse for TopPostsStrip
- `StatusStrip` — design system §9, configure scraping status
- `AddFilterPill` — design system §7a
- `ViewToggle` — design system §7c

**NEW components needed:**
- `AccountCard` — new, ~60 lines
- `ModelFilterPill` — new, ~30 lines (also shared component for other pages)
- `PerformanceTagBadge` — new, ~15 lines
