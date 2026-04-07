# Insights Tab — UI Rebuild
**For:** ui.intelligence.insights (surface:32)
**Date:** 2026-04-07
**Branch:** feat/insights-ui-rebuild
**Worktree:** /Users/shaansisodia/SISO_Workspace/SISO_Agency/apps/isso-dashboard-insights-rebuild

---

## Overview
Rebuild InsightsView from a full-width scroll stack into a live, interactive 3-column layout. Data should be visible inline — not hidden behind cards. Posts are the visual hero. The AI chat lives permanently in the right column.

---

## INSIGHTS-1: 3-column layout with visible data

**This is the foundation — do this first.**

### Top strip — RatingSummaryBar (keep, full width)
Keep `<RatingSummaryBar>` as-is across the full top. It's already compact enough.

### Below: 3-column layout

```
┌── LEFT (24%) ──┬──── CENTER (50%) ────┬── RIGHT (26%) ──┐
│ Winning Hooks  │ Top Rated Posts      │ Ask Intelligence │
│ (visible text) │ (scrollable thumbs)  │ (always-on)      │
│                │ ──────────────────── │ ─────────────── │
│                │ Insight Cards        │ Learning Signal  │
│                │ (visible bullets)    │ ─────────────── │
│                │                      │ Pulse Report     │
└────────────────┴──────────────────────┴─────────────────┘
```

---

## LEFT COLUMN — Winning Hooks (inline, readable)

**Do NOT use InsightCards or WinningHooks components as-is — rebuild this column.**

Each hook is a visible row (not hidden behind a "See all"):

```tsx
// Each row in the hooks list
<div className="flex flex-col gap-1 py-2.5 border-b border-black/5 cursor-pointer hover:bg-black/[0.02] px-2 rounded-lg transition-colors"
  onMouseEnter={() => setHighlightedPostId(hook.postId)}
  onMouseLeave={() => setHighlightedPostId(null)}
>
  <p className="text-[11px] font-medium text-neutral-800 leading-relaxed line-clamp-2">
    "{hook.hookLine}"
  </p>
  <div className="flex items-center gap-2">
    <span className="text-[10px] text-neutral-400">@{hook.handle}</span>
    <span className="text-[10px] font-bold" style={{ color: '#ff0069' }}>{hook.hookScore.toFixed(1)}</span>
    {hook.emotions?.[0] && <span className="text-[10px]">{emotionEmoji(hook.emotions[0])}</span>}
  </div>
</div>
```

- Data: `hookStats.hookLines` from `useQuery(api.intelligence.getHookStats, { days: 30 })`
- Show all hooks in a scrollable list (no "See all" needed — this IS the list)
- `setHighlightedPostId` state in InsightsView — passed down to center column
- Column header: `"Winning Hooks"` + `text-[10px] font-semibold text-neutral-400 uppercase tracking-wide`

**emotionEmoji helper:**
```tsx
function emotionEmoji(e: string): string {
  const map: Record<string, string> = {
    confident: '💪', inspiring: '✨', funny: '😂', relatable: '🙌',
    emotional: '🥺', educational: '📚', shocking: '😱', motivating: '🔥',
  };
  return map[e.toLowerCase()] ?? '💡';
}
```

---

## CENTER COLUMN — Top Rated Posts + Insight Cards

### Top Rated Posts — horizontal scrollable strip

```tsx
<div className="overflow-x-auto flex gap-3 pb-2 -mx-1 px-1">
  {topRatedPosts.map(post => (
    <div
      key={post._id}
      onClick={() => openDrawer(post._id)}
      className={cn(
        "relative shrink-0 w-32 rounded-xl overflow-hidden cursor-pointer transition-all",
        highlightedPostId === post._id ? "ring-2 ring-[#ff0069] scale-105" : "hover:scale-102"
      )}
    >
      <img src={post.thumbnailUrl} className="w-full aspect-[9/16] object-cover" />
      <div className="absolute bottom-0 inset-x-0 p-1.5 bg-gradient-to-t from-black/70 to-transparent">
        <p className="text-[9px] text-white font-bold">{post.aiAnalysis?.hookScore?.toFixed(1) ?? '—'}</p>
      </div>
    </div>
  ))}
</div>
```

- Data: `data.topRatedPosts` from `useQuery(api.insights.getInsights, {})`
- When a hook is hovered in the left column, the matching post gets `ring-2 ring-[#ff0069] scale-105`
- Match by: find post whose `_id` matches `highlightedPostId`
- Click → `PostDetailDrawer`

### Insight Cards — visible bullets, not hidden

Replace `<InsightCards>` with visible inline bullets showing the actual insight text:

```tsx
<div className="mt-4">
  <p className="text-[10px] font-semibold text-neutral-400 uppercase tracking-wide mb-2">Patterns detected</p>
  <div className="space-y-1.5">
    {insights.map((insight, i) => (
      <div key={i} className="flex items-start gap-2 text-[11px] text-neutral-700">
        <span className="text-[#ff0069] mt-0.5 shrink-0">·</span>
        <span className="leading-relaxed">{insight}</span>
      </div>
    ))}
  </div>
</div>
```

- Use `data.insights` or derive from `trends` data (check InsightCards.tsx for the data source)
- Keep it as real readable text — no wrapping in cards

---

## RIGHT COLUMN — AI + Learning + Pulse

### Ask Intelligence — always-on, expands in-place

Replace the current toggle button + full `<AIChatPanel>` with a compact persistent panel:

**Collapsed state (default):**
```tsx
<div className="rounded-xl overflow-hidden border border-black/[0.07]">
  <div className="flex items-center justify-between px-3 py-2.5"
    style={{ background: 'linear-gradient(135deg, rgba(255,0,105,0.04), rgba(131,58,180,0.04))' }}>
    <div className="flex items-center gap-2">
      <div className="w-6 h-6 rounded-lg flex items-center justify-center"
        style={{ background: 'linear-gradient(135deg, #ff0069, #833ab4)' }}>
        <Sparkles size={11} className="text-white" />
      </div>
      <div>
        <p className="text-[11px] font-semibold text-neutral-900">Ask Intelligence</p>
        <p className="text-[9px] text-neutral-400">MiniMax · full context</p>
      </div>
    </div>
    <button onClick={() => setChatOpen(true)}
      className="text-[10px] font-semibold px-2 py-1 rounded-lg text-white"
      style={{ background: 'linear-gradient(135deg, #ff0069, #833ab4)' }}>
      Open
    </button>
  </div>
</div>
```

**Expanded state:** Render `<AIChatPanel>` inline below the header (same card, expands down). Add a "Close" button to collapse back. No navigation.

```tsx
{chatOpen && (
  <div className="border-t border-black/[0.06]">
    <AIChatPanel data={trends} insightsData={data} onClose={() => setChatOpen(false)} embedded />
  </div>
)}
```

Add `embedded?: boolean` prop to `AIChatPanel` — when true, hide its own header/close button (the parent card handles that).

### Learning Signal
Keep `<LearningSignal data={data} />` as-is — already compact enough.

### Pulse Report
Keep `<PulseReportCard>` as-is — already has the right card pattern.

---

## Standardized card section headers

All section headers in the right column use this pattern (already established by PulseReportCard):

```tsx
<div className="flex items-center gap-2 px-3 py-2.5 border-b border-black/[0.06]"
  style={{ background: 'linear-gradient(135deg, rgba(255,0,105,0.04), rgba(131,58,180,0.04))' }}>
  <div className="w-6 h-6 rounded-lg flex items-center justify-center" style={{ background: GRAD }}>
    {icon}
  </div>
  <div>
    <p className="text-[11px] font-semibold text-neutral-900">{title}</p>
    <p className="text-[9px] text-neutral-400">{subtitle}</p>
  </div>
</div>
```

Apply to: Ask Intelligence (above), Learning Signal wrapper, left column header.

---

## InsightsView state

```tsx
export function InsightsView() {
  const [chatOpen, setChatOpen] = useState(false); // collapsed by default
  const [highlightedPostId, setHighlightedPostId] = useState<string | null>(null);
  const [drawerIndex, setDrawerIndex] = useState<number | null>(null);

  const data     = useQuery(api.insights.getInsights, {}) as InsightsData | undefined;
  const trends   = useQuery(api.intelligence.getTrends, { days: 30 }) as TrendsData | undefined;
  const hookStats = useQuery(api.intelligence.getHookStats, { days: 30 });
  const seedRatings = useMutation(api.insightsSeed.seedSwipeRatings);

  useEffect(() => {
    if (data && data.summary.totalRatings === 0) seedRatings({});
  }, [data, seedRatings]);

  function openDrawer(postId: string) {
    const idx = (data?.topRatedPosts ?? []).findIndex(p => p._id === postId);
    if (idx !== -1) setDrawerIndex(idx);
  }
  // ...
}
```

---

## Definition of done
- [ ] 3-column layout renders correctly on desktop
- [ ] Left column: winning hooks visible as readable inline text rows
- [ ] Hovering a hook highlights matching post in center (ring + scale)
- [ ] Center: top rated posts shown as horizontal scrollable thumbnail strip
- [ ] Center: insight patterns shown as visible bullet text (not hidden cards)
- [ ] Right: Ask Intelligence is compact card, expands inline on "Open", collapses on "Close"
- [ ] Right: Learning Signal + Pulse Report use standardized card header pattern
- [ ] PostDetailDrawer works from thumbnail strip click
- [ ] `pnpm build` passes — zero TypeScript errors

## Do NOT
- Don't remove RatingSummaryBar
- Don't touch AIChatPanel internals beyond adding `embedded?` prop
- Don't touch PulseReportCard
- Don't add navigation / breadcrumbs — everything stays on this single view
