# Plan: Qualify Tab Rebuild — Intelligence ⌘2
**For:** minimax agent (ui.intelligence domain)
**Date:** 2026-04-07
**Approved by:** Shaan via clients-pm

---

## What you're doing in one sentence
Rebuild the Qualify tab as a pure data page — Airtable table + Kanban view of scraped reels organised by viral baseline multiplier. No AI, no charts. Charts move to the Dashboard tab.

---

## Final layout of Qualify tab

```
┌─────────────────────────────────────────────────────────┐
│  [Top 5 stat pills — keep, horizontal strip]            │
│  [Table | Kanban toggle — top right of pill bar]        │
├──────────────────────────────────────────── ┬───────────┤
│                                             │  Outlier  │
│  TABLE VIEW or KANBAN VIEW (main area)      │  Alert    │
│                                             │  Feed     │
│  Shows all scraped reels + raw analytics    │  (right   │
│  Top 10% auto-highlighted by threshold      │  sidebar  │
│                                             │  panel,   │
│                                             │ collapsed │
│                                             │ by default│
└──────────────────────────────────────────── ┴───────────┘
```

**Key rules:**
- NO AI analytics on this page — pure engagement metrics only
- Top 10% is determined by baseline score threshold, not AI scoring
- Outlier Alert Feed moves to a collapsible right-side panel (not inline)
- Top 5 stat pills stay at top (they're good as-is)

---

## Context

### Files you'll touch
- `src/features/intelligence/components/trends/TrendsView.tsx` — current Qualify tab. Strip charts. Keep top 5 pills. Rebuild the body.
- `src/features/intelligence/components/dashboard/DashboardView.tsx` — receives all stripped charts from TrendsView
- `src/features/intelligence/components/IntelligenceFeaturePage.tsx` — add view toggle state

### Files to study (do NOT modify)
- `src/features/recon/components/creators/CreatorsTable.tsx` — Airtable table pattern to replicate
- `src/features/recon/components/creators/TableToolbar.tsx` — search + filter bar
- `src/features/recon/components/creators/BulkActionBar.tsx` — bulk action bar
- `src/features/intelligence/components/trends/OutlierFeed.tsx` — move to right panel
- `src/features/intelligence/components/trends/StatsBar.tsx` — keep at top of Qualify

---

## Step 1 — Move charts to Dashboard

Move these from `TrendsView.tsx` into `DashboardView.tsx` as new card sections:

| Component | Action |
|---|---|
| `FormatChart` | Move to DashboardView |
| `NicheLeaderboard` | Move to DashboardView |
| `HooksTable` | Move to DashboardView |
| `PatternInsights` / `PatternCard` | Move to DashboardView |
| `HashtagCorrelation` | Move to DashboardView |
| `AIChatPanel` | Move to Insights tab (`InsightsView.tsx`) |

**Keep in Qualify:** `StatsBar` (top 5 pills), `OutlierFeed` / `OutlierCard` (right panel only)

---

## Step 2 — Build the Airtable table view

Create `src/features/intelligence/components/qualify/QualifyTableView.tsx`

Follow the exact same structure as `src/features/recon/components/creators/CreatorsTable.tsx`.
Use `@tanstack/react-virtual` for virtualisation (already in package.json).

**Columns:**
| Column | Field | Display |
|--------|-------|---------|
| # | row index | muted number |
| Thumbnail | `post.thumbnailUrl` | 40×56 rounded (9:16 ratio), play icon overlay |
| Account | `post.handle` | `@handle` + platform icon (IG / TikTok) + follower count |
| Niche | `post.niche` | Coloured badge (use `NICHE_COLOR_MAP` from `intelligence/constants.ts`) |
| Views | `post.views` | formatted (e.g. `1.2M`) |
| Likes | `post.likes` | formatted |
| Comments | `post.comments` | formatted |
| Baseline Score | `post.baselineScore` | `×` multiplier in bold (e.g. `12.4×`) — colour-coded (see bands below) |
| Band | derived from baselineScore | pill badge (see 6 bands below) |
| Saved | `post.savedForPipeline` | checkmark icon if true |

**Colour coding for Baseline Score column:**
| Band | Threshold | Colour |
|------|-----------|--------|
| Below Baseline | `< 1×` | `text-neutral-400` |
| 2× | `1× – 4.9×` | `text-blue-400` |
| 5× | `5× – 9.9×` | `text-emerald-400` |
| 10× | `10× – 19.9×` | `text-yellow-400` |
| 20× | `20× – 49.9×` | `text-orange-400` |
| 🔥 50×+ | `≥ 50×` | `text-pink-500` + subtle glow |

**Toolbar above table:**
- Search input (filter by account handle)
- Filter chips: `All` / `2×+` / `5×+` / `10×+` / `20×+` — clicking filters rows to that band and above
- View toggle pill: `Table | Kanban`
- `Save Top 10%` button — bulk saves top 10% by baselineScore to Convex (see Step 4)

**Sorting:** Default sort = `baselineScore` descending. All columns should be sortable by click.

---

## Step 3 — Build the Kanban view

Create `src/features/intelligence/components/qualify/QualifyKanbanView.tsx`

**6 columns — one per baseline band:**

| Column | Label | Threshold | Accent colour |
|--------|-------|-----------|---------------|
| 1 | Below Baseline | `< 1×` | neutral |
| 2 | 2× | `1× – 4.9×` | blue |
| 3 | 5× | `5× – 9.9×` | emerald |
| 4 | 10× | `10× – 19.9×` | yellow |
| 5 | 20× | `20× – 49.9×` | orange |
| 6 | 🔥 50×+ | `≥ 50×` | pink |

**Column header:** band label + count badge (e.g. `5× — 34 reels`)

**Reel card (compact):**
- 9:16 thumbnail (small, ~72px wide)
- `@handle` + platform icon
- Baseline score in bold with band colour
- Views + Likes in small muted text
- On hover: `Save` button appears

**Horizontal scroll** if columns overflow viewport width.
**No drag and drop** — keep it simple for now.

---

## Step 4 — Outlier Alert Feed → right panel

The `OutlierFeed` / `OutlierCard` components currently render inline in TrendsView. Move them to a collapsible right sidebar panel.

Create `src/features/intelligence/components/qualify/OutlierPanel.tsx`:
- Fixed right panel, `w-72`
- Collapsed by default — shows a small `⚡ 4 outliers` tab on the right edge
- Click to expand — slides in over the content (not pushing layout)
- Inside: `OutlierFeed` as-is

In `QualifyTableView` and `QualifyKanbanView`, render `<OutlierPanel />` absolutely positioned right edge.

---

## Step 5 — Convex query

Add to `convex/intelligence.ts`:

```typescript
export const getQualifyPosts = query({
  args: { minBaseline: v.optional(v.number()) },
  handler: async (ctx, { minBaseline }) => {
    const posts = await ctx.db.query('scrapedPosts').collect();
    return posts
      .filter(p => !p.externalId?.startsWith('seed_'))
      .filter(p => minBaseline === undefined || (p.baselineScore ?? 0) >= minBaseline)
      .sort((a, b) => (b.baselineScore ?? 0) - (a.baselineScore ?? 0));
  },
});

export const saveTopPostsForPipeline = mutation({
  args: { postIds: v.array(v.id('scrapedPosts')) },
  handler: async (ctx, { postIds }) => {
    for (const id of postIds) {
      await ctx.db.patch(id, { savedForPipeline: true, savedAt: Date.now() });
    }
  },
});
```

Also add to `scrapedPosts` in `convex/schema.ts` if not present:
```typescript
baselineScore: v.optional(v.number()),   // viral multiplier vs account average
savedForPipeline: v.optional(v.boolean()),
savedAt: v.optional(v.number()),
```

**"Save Top 10%" logic:**
1. Sort all posts by `baselineScore` descending
2. Take top 10% of array length (rounded up)
3. Call `saveTopPostsForPipeline` with their IDs
4. Show a toast: `"Saved 23 reels to pipeline"`

---

## Step 6 — Wire view toggle

In `IntelligenceFeaturePage.tsx`:

```tsx
const [qualifyView, setQualifyView] = useState<'table' | 'kanban'>('table');

// Pass to ContentPageShell when activeTab === 'qualify':
showViewToggle={activeTab === 'qualify'}
viewMode={qualifyView === 'table' ? 'grid' : 'list'}
onViewModeChange={m => setQualifyView(m === 'grid' ? 'table' : 'kanban')}

// Render:
{activeTab === 'qualify' && (
  <div className="relative flex-1">
    {qualifyView === 'table' ? <QualifyTableView /> : <QualifyKanbanView />}
  </div>
)}
```

The `showViewToggle` prop on `ContentPageShell` already renders a grid/list toggle in the filter bar — repurpose it for table/kanban.

---

## Definition of done
- [ ] All charts moved from TrendsView → DashboardView
- [ ] `AIChatPanel` moved to InsightsView
- [ ] Qualify tab shows: top 5 stat pills + table/kanban toggle + main data view + outlier panel
- [ ] Table view: virtualised rows, all columns, colour-coded baseline score, sortable, filter chips working
- [ ] Kanban view: 6 columns by baseline band, correct colours, reel cards with hover save
- [ ] Outlier panel: collapsed by default, slides in from right on click
- [ ] `Save Top 10%` fires Convex mutation and shows toast
- [ ] `convex/schema.ts` updated with `baselineScore`, `savedForPipeline`, `savedAt`
- [ ] `npm run build` passes — zero TypeScript errors
- [ ] No Recon source files modified

---

## Do NOT
- No AI calls anywhere on this page — pure data
- No drag-and-drop on kanban
- Don't redesign the Dashboard — just append the moved components
- Don't delete `OutlierFeed` — relocate it to the right panel
- Don't touch any Recon files
