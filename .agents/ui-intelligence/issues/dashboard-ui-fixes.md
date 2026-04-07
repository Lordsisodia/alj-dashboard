# Dashboard — UI Fixes
**For:** ui.intelligence.dashboard (surface:31)
**Date:** 2026-04-07
**Branch:** feat/dashboard-ui-fixes
**Worktree:** /Users/shaansisodia/SISO_Workspace/SISO_Agency/apps/isso-dashboard-dashboard-fixes

---

## Context
The top half of the dashboard is good — keep it. Pipeline strip, KPI tiles, and outlier row are solid. Everything below the outlier row needs to be made more space-efficient. You are allowed to be creative with layout. The dashboard scrolls — that's intentional — but every component needs to earn its space.

Read the design principles before starting:
`/Users/shaansisodia/SISO_Workspace/SISO_Agency/apps/isso-dashboard/.agents/ui-intelligence/DESIGN_PRINCIPLES.md`

---

## KEEP AS-IS (do not touch)
- `PipelineStatusStrip` — pipeline idle strip at the top ✅
- KPI tiles row (4 tiles with links) ✅
- `OutlierRow` — top outliers thumbnails ✅

---

## DASHBOARD-1: Merge trending signal + learning signal into one companion row

**Problem:** The trending one-liner (`trendLine`) is a full-width bar for a single sentence. `LearningSignal` is stacked below it. Both answer "what's happening right now?" — they're companions, not a sequence.

**Fix:** Replace them with a single two-column row. Width split: whatever the content needs — the brief side gets more room since it has more content.

```
┌── INTELLIGENCE BRIEF (~65%) ──────────────┬── LEARNING SIGNAL (~35%) ──┐
│  section label: "This week"               │  <LearningSignal data={} /> │
│                                           │  (keep as-is, no changes)  │
│  5 insight bullets derived from trends:  │                            │
│  · Meme carousels leading — 22.9% ER    │                            │
│  · @minaxash Lifestyle in top 3         │                            │  
│  · Outlier count up 3 from last week    │                            │
│  · Hook avg improved +0.4              │                            │
│  · Best day: Thursday evenings         │                            │
└───────────────────────────────────────────┴────────────────────────────┘
```

**Build `IntelligenceBrief` component** (`components/dashboard/IntelligenceBrief.tsx`):

Derives 5 signals from `trends: TrendsData`:
1. Top format + avg ER: `"${topFormat} leading — ${(topNiche.avgER*100).toFixed(1)}% avg ER"`
2. Top account in top niche: find the outlier post with highest ER in top niche
3. Outlier count vs last week (use `trends.outlierPosts.length` — can't compare to last week so just show count + direction arrow if delta available)
4. Hook score trend: from `hookStats` if available, else skip
5. Best posting pattern: from `trends.patternInsights` if available, else use top format + niche combo

Show whichever signals have real data — minimum 2, maximum 5. Don't show empty/zero signals.

Each bullet:
```tsx
<div className="flex items-start gap-2 text-[11px] text-neutral-700 leading-relaxed">
  <span className="text-[#ff0069] shrink-0 mt-0.5">·</span>
  <span>{signal}</span>
</div>
```

Section header: `"This week"` in `text-[10px] font-semibold text-neutral-400 uppercase tracking-wide`

**Remove from DashboardView:**
- The `{trendLine && ...}` full-width box (lines ~99-106)
- The `{insights && <LearningSignal>}` standalone render — move into the companion row

---

## DASHBOARD-2: Remove duplicated analysis/qualify charts

These components are all accessible on their own tabs. Remove them from DashboardView entirely. Each gets replaced with a single compact summary line linking to the right tab.

**Remove these imports and JSX blocks:**
- `HookScoreDistribution` — Analysis tab
- `EmotionFrequency` — Analysis tab
- `HookLineGallery` — Analysis tab
- `RuleCards` — Analysis tab
- `HashtagCorrelation` — Qualify tab
- `HooksTable` — Qualify tab
- `PatternInsights` — Qualify tab
- The entire "Analysis insights" section (lines ~141-163)
- The `useQuery(api.intelligence.getHookStats, { days: 30 })` call (no longer needed here)

**Replace with a compact two-line summary strip:**
```tsx
{/* ── Summary links strip ── */}
<motion.div variants={fadeUp} className="grid grid-cols-2 gap-3">
  <Link href="/isso/intelligence" onClick={() => {/* switch to qualify tab */}}
    className="flex items-center justify-between px-4 py-3 rounded-xl border border-black/[0.07] hover:border-[#ff0069]/30 transition-colors group">
    <div>
      <p className="text-[10px] font-semibold text-neutral-400 uppercase tracking-wide">Top hooks</p>
      <p className="text-xs font-medium text-neutral-700 mt-0.5">
        {trends?.topHooks?.[0]?.hookLine?.slice(0, 48) ?? 'No hooks yet'}{trends?.topHooks?.[0] ? '...' : ''}
      </p>
    </div>
    <ArrowRight size={12} className="text-neutral-300 group-hover:text-[#ff0069] transition-colors" />
  </Link>
  <Link href="/isso/intelligence" className="flex items-center justify-between px-4 py-3 rounded-xl border border-black/[0.07] hover:border-[#ff0069]/30 transition-colors group">
    <div>
      <p className="text-[10px] font-semibold text-neutral-400 uppercase tracking-wide">Hashtag patterns</p>
      <p className="text-xs font-medium text-neutral-700 mt-0.5">View correlation analysis →</p>
    </div>
    <ArrowRight size={12} className="text-neutral-300 group-hover:text-[#ff0069] transition-colors" />
  </Link>
</motion.div>
```

Import `ArrowRight` from lucide-react, `Link` from next/link.

---

## DASHBOARD-3: Make FormatChart + NicheLeaderboard more compact

These two are already side-by-side (good). But they may be too tall. Ensure:
- Each chart has a max height of ~160px (enforced via `style={{ maxHeight: 160 }}` on the chart container if needed)
- The section has a label above: `"Format & Niche breakdown"`
- If the charts already look compact, leave them — just add the section label

---

## DASHBOARD-4: Reorder the scroll sections

Final DashboardView order from top to bottom:

1. `PipelineStatusStrip` ← keep
2. KPI tiles × 4 ← keep
3. `OutlierRow` ← keep
4. `IntelligenceBrief` + `LearningSignal` companion row ← NEW (DASHBOARD-1)
5. `PulseReportCard` ← keep
6. `ActionQueue` ← keep
7. Format & Niche row (`FormatChart` + `NicheLeaderboard`) ← keep, add label
8. Summary links strip (top hooks + hashtag patterns) ← NEW (DASHBOARD-2)

That's it. Nothing else.

---

## Creative latitude

You have freedom in how you implement the `IntelligenceBrief` component visually. The bullets are the minimum — if you have a better idea for how to present 5 signals (e.g. a subtle icon per signal, a colour accent per signal type, a thin left border), do it. The constraint is space efficiency and readability, not the exact visual treatment.

The companion row split (IntelligenceBrief / LearningSignal) doesn't have to be 65/35 — use whatever width makes both components feel natural. LearningSignal already has its own internal layout; just give it the space it needs.

---

## Definition of done
- [ ] Trending one-liner replaced by `IntelligenceBrief` with 2-5 real signals
- [ ] `LearningSignal` is in the same row as `IntelligenceBrief`, not stacked below it
- [ ] All 7 duplicated chart components removed from DashboardView
- [ ] Summary links strip added (2 tiles linking to Qualify/Analysis)
- [ ] Format & niche row has section label
- [ ] Final scroll order matches DASHBOARD-4
- [ ] `pnpm build` passes — zero TypeScript errors in dashboard components

## Do NOT
- Don't touch PipelineStatusStrip, KPI tiles, OutlierRow
- Don't touch PulseReportCard
- Don't touch LearningSignal internals
- Don't add new Convex queries beyond what's already in DashboardView
