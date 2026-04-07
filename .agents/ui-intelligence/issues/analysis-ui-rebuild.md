# Analysis Tab — UI Rebuild
**For:** ui.intelligence.analysis (surface:33)
**Date:** 2026-04-07
**Branch:** feat/analysis-ui-rebuild
**Worktree:** /Users/shaansisodia/SISO_Workspace/SISO_Agency/apps/isso-dashboard-analysis-rebuild

---

## Overview
Rebuild the Analysis tab from a single full-width stack into a 3-column desktop layout, then add "See All" expanded views for each panel. All work is in `src/features/intelligence/components/analysis/`.

---

## ANALYSIS-1: 3-column default layout

**This is the foundation — do this first.**

Replace the current `AnalysisView.tsx` full-width stack with a 3-column layout:

```
┌─────────────────┬──────────────────────────────┬──────────────┐
│  LEFT (22%)     │  MIDDLE (58%)                │  RIGHT (20%) │
│  FunnelChart    │  AnalysisQueue               │  ActivityFeed│
│  vertical       │  ──────────────────────────  │              │
│                 │  AnalysedPostsTimeline        │              │
└─────────────────┴──────────────────────────────┴──────────────┘
```

**Left column — FunnelChart:**
- Import `FunnelChart` from `@/components/ui/funnel-chart`
- Use `orientation="vertical"`, `layers={3}`, `showPercentage={false}`, `labelLayout="grouped"`
- Data from `useQuery(api.intelligence.getAnalysisPipelineStats, {})`
- 3 stages with pink gradient colour (`#ff0069`):
  ```tsx
  const funnelData = [
    { label: 'Qualified',  value: stats?.totalQualified ?? 1,  displayValue: String(stats?.totalQualified ?? 0),  color: '#ff0069' },
    { label: 'In R2',      value: stats?.downloaded     ?? 0,  displayValue: String(stats?.downloaded     ?? 0),  color: '#833ab4' },
    { label: 'Analyzed',   value: stats?.analyzed       ?? 0,  displayValue: String(stats?.analyzed       ?? 0),  color: '#4a9eff' },
  ];
  ```
- Note: use `totalQualified ?? 1` as the base (avoid division by zero in chart). If all zeros, chart still renders as flat funnel.
- Add a small label above: `"Pipeline"` in `text-[10px] font-semibold text-neutral-400 uppercase tracking-wide`

**Middle column — Queue + Timeline:**
- Top: `<AnalysisQueue onAnalyse={openDrawer} />` (keep as-is)
- Bottom: new `<AnalysedPostsTimeline>` component (see ANALYSIS-2 for the full-page version — for the default view, show max 10 most recent, with a "See all X posts →" button at the bottom)

**Right column — ActivityFeed:**
- New `<ActivityFeed />` component (see ANALYSIS-4 for full-page version)
- Default view: most recent 15 analysis events, scrollable
- Each row:
  ```
  [24×24 thumb] @handle  hook 8.2  ·  2m ago
  ```
  - Thumbnail: small rounded square
  - Handle: `text-[11px] font-medium text-neutral-700`
  - Hook score badge: small pink pill `text-[10px]`
  - Timestamp: `text-[10px] text-neutral-400`
- Data: derived from `analysedPosts` sorted by `aiAnalysis.analyzedAt` descending
- "See all →" link at bottom

**Link to Video Analyzer tool:**
- Add a button at the top of the middle column (above the queue), or as a header action:
  ```tsx
  <Link href="/isso/tools" className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-[11px] font-semibold text-white"
    style={{ background: 'linear-gradient(135deg, #ff0069, #833ab4)' }}>
    <Video size={11} /> Analyse with Video Tool
  </Link>
  ```
- Import `Link` from `next/link`, `Video` from `lucide-react`

**AnalysisView state:**
```tsx
type AnalysisViewMode = 'default' | 'all-posts' | 'all-queue' | 'all-activity';

export function AnalysisView({ days, niche }: Props) {
  const [viewMode, setViewMode] = useState<AnalysisViewMode>('default');
  const [drawerIndex, setDrawerIndex] = useState<number | null>(null);
  // ...
}
```

**Files to create/modify:**
- `AnalysisView.tsx` — full rebuild with viewMode state + 3-column layout
- `ActivityFeed.tsx` — NEW compact activity feed component
- `AnalysedPostsTimeline.tsx` — NEW timeline component (used in both default and all-posts view)

---

## ANALYSIS-2: "See All Posts" expanded view

**Triggered by:** "See all X posts →" button in middle column bottom
**Sets:** `viewMode = 'all-posts'`

**Layout:**
```
[← Analysis]  All Analysed Posts  (breadcrumb)

Apr 7 — Today                              [Select All]
  □  [thumb]  @handle  Lifestyle · reel  hook 8.2  analyzed 2m ago
  □  [thumb]  @handle  Fitness · reel    hook 7.1  analyzed 1h ago

Apr 6 — Yesterday
  □  [thumb]  @handle  Meme · post       hook 6.8  analyzed 5h ago
  □  [thumb]  @handle  E-Girl · reel     hook 5.9  analyzed 8h ago
```

**Spec:**
- Full width (replaces 3-column layout entirely)
- Breadcrumb at top: `← Analysis  /  All Analysed Posts` — clicking "← Analysis" sets `viewMode = 'default'`
- Posts grouped by day using `aiAnalysis.analyzedAt` timestamp
  - Group header: `"Apr 7 — Today"`, `"Apr 6 — Yesterday"`, `"Apr 5"` etc.
  - Use `date-fns` if installed, otherwise manual `new Date(ts).toLocaleDateString()`
- Each post row:
  - Checkbox (left)
  - 48×48 thumbnail (rounded-lg)
  - Handle + niche badge + content type
  - Hook score pill (pink gradient)
  - `"analyzed X ago"` timestamp (right-aligned)
  - Clicking row → opens `PostDetailDrawer`
- Row height: ~56px, hover: subtle bg highlight
- Virtualised scroll using `@tanstack/react-virtual` (already installed)
- No pagination — all posts in one virtualised list

**Files:**
- `AnalysisView.tsx` — wire up viewMode + render `<AllPostsView>` when `viewMode === 'all-posts'`
- `AllPostsView.tsx` — NEW component

---

## ANALYSIS-3: "See All Queue" expanded view

**Triggered by:** "See all →" link at bottom of AnalysisQueue section
**Sets:** `viewMode = 'all-queue'`

**Layout:**
```
[← Analysis]  Analysis Queue  (breadcrumb)

20 posts waiting · ranked by outlier ratio

[grid of all queued posts — same thumbnail + Analyse button cards as current AnalysisQueue]
```

**Spec:**
- Full width, replaces 3-column layout
- Same breadcrumb pattern as ANALYSIS-2
- Reuse the existing `AnalysisQueue` component internals (just render it full-width without the height cap)
- Add a count header: `"X posts waiting for AI analysis · ranked by outlier ratio"`

**Files:**
- `AnalysisView.tsx` — wire `viewMode === 'all-queue'`
- `AnalysisQueue.tsx` — add optional `fullPage?: boolean` prop that removes any max-height constraint

---

## ANALYSIS-4: "See All Activity" expanded view

**Triggered by:** "See all →" link in right column activity feed
**Sets:** `viewMode = 'all-activity'`

**Layout:**
```
[← Analysis]  Analysis Activity  (breadcrumb)

All analysis events — newest first

Apr 7 — Today
  [thumb]  @handle  hook 8.2  ·  Lifestyle · reel  ·  2m ago
  [thumb]  @handle  hook 7.1  ·  Fitness · reel    ·  1h ago

Apr 6 — Yesterday
  ...
```

**Spec:**
- Same day-grouping pattern as ANALYSIS-2 (extract a shared `groupByDay()` util)
- Each row: thumbnail + handle + niche + hook score + timestamp
- Clicking row → opens drawer
- Virtualised

**Files:**
- `AnalysisView.tsx` — wire `viewMode === 'all-activity'`
- `AllActivityView.tsx` — NEW component
- Extract `groupByDay()` util into `../../utils.ts` (shared by ANALYSIS-2 and ANALYSIS-4)

---

## Shared breadcrumb component

Build once in ANALYSIS-2, reuse in 3 and 4.

```tsx
// AnalysisBreadcrumb.tsx
function AnalysisBreadcrumb({ current, onBack }: { current: string; onBack: () => void }) {
  return (
    <div className="flex items-center gap-2 mb-4 text-[11px] text-neutral-400">
      <button onClick={onBack} className="flex items-center gap-1 hover:text-neutral-700 transition-colors font-medium">
        <ChevronLeft size={11} />
        Analysis
      </button>
      <span>/</span>
      <span className="text-neutral-700 font-semibold">{current}</span>
    </div>
  );
}
```

---

## Definition of done
- [ ] ANALYSIS-1: 3-column layout renders — FunnelChart left, Queue+Timeline middle, ActivityFeed right
- [ ] ANALYSIS-1: "Analyse with Video Tool" button links to `/isso/tools`
- [ ] ANALYSIS-1: FunnelChart shows real pipeline counts
- [ ] ANALYSIS-1: ActivityFeed shows recent analyses with handle, hook score, timestamp
- [ ] ANALYSIS-2: "See All Posts" full-page timeline, day-grouped, selectable, virtualised
- [ ] ANALYSIS-3: "See All Queue" full-page queue view
- [ ] ANALYSIS-4: "See All Activity" full-page activity log, day-grouped
- [ ] All "See All" views have working breadcrumb → back to default 3-column
- [ ] PostDetailDrawer accessible from all views
- [ ] `pnpm build` passes — zero TypeScript errors

## Do NOT
- Don't touch `PostDetailDrawer` internals
- Don't touch `AnalysisQueue` internals beyond adding `fullPage?` prop
- Don't build the R2 download worker — `downloadPostToR2` stays scaffolded
