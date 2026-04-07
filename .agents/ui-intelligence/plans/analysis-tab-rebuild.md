# Plan: Analysis Tab Rebuild — Intelligence ⌘2 Step 2
**For:** minimax agent (ui.intelligence domain)
**Date:** 2026-04-07
**Approved by:** Shaan via clients-pm

---

## What you're doing in one sentence
Strip the Analysis tab down to a pipeline status strip + the existing queue/grid/drawer. Move all charts to Dashboard. Add a download-to-R2 status tracker at the top.

---

## Current state (from code read)
`AnalysisView.tsx` renders in this order:
1. `AnalysisQueue` — unanalysed posts queued for AI ✅ KEEP
2. `HookScoreDistribution` + `EmotionFrequency` charts ❌ MOVE TO DASHBOARD
3. `HookLineGallery` ❌ MOVE TO DASHBOARD
4. `RuleCards` ❌ MOVE TO DASHBOARD
5. `AnalysedPostGrid` — grid of AI-analysed posts ✅ KEEP
6. `PostDetailDrawer` — full post detail + AI analysis ✅ KEEP

---

## Target layout

```
┌─────────────────────────────────────────────────────────┐
│  PIPELINE STATUS STRIP                                  │
│  [Top 10% reels: 247] → [In R2 DB: 89] → [Analyzed: 34]│
│  [Not yet downloaded: 158]  [Queued for analysis: 55]   │
└─────────────────────────────────────────────────────────┘
┌─────────────────────────────────────────────────────────┐
│  ANALYSIS QUEUE (keep as-is)                            │
│  Posts saved to DB, waiting for AI analysis             │
└─────────────────────────────────────────────────────────┘
┌─────────────────────────────────────────────────────────┐
│  ANALYSED POST GRID (keep as-is)                        │
│  Click → PostDetailDrawer                               │
└─────────────────────────────────────────────────────────┘
```

---

## Step 1 — Move charts to Dashboard

In `AnalysisView.tsx`, remove these imports and JSX blocks:
- `HookScoreDistribution`
- `EmotionFrequency`
- `HookLineGallery`
- `RuleCards`
- The `hookStats` useQuery call (only used by the above)
- The `ruleInput` derived array (only used by RuleCards)

In `DashboardView.tsx`, add a new "Analysis Insights" section at the bottom:
```tsx
// Import and render these conditionally (only if hookStats has data):
<HookScoreDistribution distribution={hookStats.scoreDistribution} />
<EmotionFrequency emotions={hookStats.emotionFrequency} />
<HookLineGallery hookLines={hookStats.hookLines} />
<RuleCards posts={ruleInput} />
```
Add `useQuery(api.intelligence.getHookStats, { days: 30 })` to DashboardView for this.

---

## Step 2 — Build the pipeline status strip

Create `src/features/intelligence/components/analysis/AnalysisPipelineStrip.tsx`

**This is the key new component.** It shows the funnel from "scraped" → "in DB" → "analyzed".

**Data to show (5 numbers):**

| Stat | Label | Source |
|------|-------|--------|
| Total top 10% | "Qualified reels" | Count of `scrapedPosts` where `savedForPipeline === true` |
| In R2 / DB | "Downloaded to DB" | Count where `savedForPipeline === true AND r2Url exists` |
| Not downloaded | "Pending download" | `qualified - downloaded` |
| Analyzed | "Analyzed" | Count where `aiAnalysis` exists |
| Queued for analysis | "Awaiting analysis" | `downloaded - analyzed` |

**Visual design — funnel strip:**
```
[247 Qualified] ──→ [89 In DB] ──→ [34 Analyzed]
                    [158 pending]   [55 queued]
```

Use a horizontal strip of `StatCard`-style tiles with connecting arrows (`→`).
Accent colour: use the same `linear-gradient(135deg, #ff0069, #833ab4)` for the numbers.
Muted grey for the "pending" / "queued" counts underneath each stage.

**Convex query to add** in `convex/intelligence.ts`:
```typescript
export const getAnalysisPipelineStats = query({
  args: {},
  handler: async (ctx) => {
    const posts = await ctx.db.query('scrapedPosts').collect();
    const real = posts.filter(p => !p.externalId?.startsWith('seed_'));
    const qualified   = real.filter(p => p.savedForPipeline === true);
    const downloaded  = qualified.filter(p => !!p.r2Url);
    const analyzed    = downloaded.filter(p => !!p.aiAnalysis);
    return {
      totalQualified:    qualified.length,
      downloaded:        downloaded.length,
      pendingDownload:   qualified.length - downloaded.length,
      analyzed:          analyzed.length,
      queuedForAnalysis: downloaded.length - analyzed.length,
    };
  },
});
```

Add `r2Url: v.optional(v.string())` to `scrapedPosts` in `convex/schema.ts` if not present.

---

## Step 3 — Download automation note (scaffold only)

The actual download worker (source URL → R2) is a separate backend task.
For now, just scaffold the Convex action so the UI can trigger it:

Add to `convex/intelligence.ts`:
```typescript
// Scaffold - full implementation TBD
export const downloadPostToR2 = action({
  args: { postId: v.id('scrapedPosts') },
  handler: async (ctx, { postId }) => {
    // TODO: fetch video from source URL, upload to R2, patch r2Url on post
    // This will be implemented by the pipeline agent
    throw new Error('Not implemented yet');
  },
});
```

In `AnalysisPipelineStrip`, add a "Download All Pending" button that:
- Is disabled and shows `"Auto-download coming soon"` tooltip for now
- Wired to `downloadPostToR2` action when implemented

---

## Step 4 — Update AnalysisView.tsx

Final `AnalysisView.tsx` should look like:
```tsx
export function AnalysisView({ days, niche }: Props) {
  const [drawerIndex, setDrawerIndex] = useState<number | null>(null);
  const analysed = useQuery(api.intelligence.getAnalysedPosts, { days, niche: niche !== 'all' ? niche : undefined });

  function openDrawer(postId: string) {
    const idx = (analysed ?? []).findIndex(p => p._id === postId);
    if (idx !== -1) setDrawerIndex(idx);
  }

  return (
    <>
      <motion.div variants={containerVariants} initial="hidden" animate="visible" className="space-y-6">
        <AnalysisPipelineStrip />
        <AnalysisQueue onAnalyse={openDrawer} />
        <AnalysedPostGrid posts={...} onSelect={openDrawer} />
      </motion.div>
      <AnimatePresence>
        {drawerIndex !== null && analysed && (
          <PostDetailDrawer posts={analysed as unknown as DrawerPost[]} initialIndex={drawerIndex} onClose={() => setDrawerIndex(null)} />
        )}
      </AnimatePresence>
    </>
  );
}
```

---

## Definition of done
- [ ] `HookScoreDistribution`, `EmotionFrequency`, `HookLineGallery`, `RuleCards` moved to `DashboardView`
- [ ] `AnalysisPipelineStrip` built and shows real counts from Convex
- [ ] `getAnalysisPipelineStats` query added to `convex/intelligence.ts`
- [ ] `r2Url` field added to `scrapedPosts` schema
- [ ] `downloadPostToR2` action scaffolded (disabled in UI, tooltip "coming soon")
- [ ] `AnalysisView` is clean: strip → queue → grid → drawer only
- [ ] `npm run build` passes — zero TypeScript errors

## Do NOT
- Don't build the actual R2 download worker — scaffold only
- Don't touch `AnalysisQueue`, `AnalysedPostGrid`, or `PostDetailDrawer` internals
- Don't remove the `PostDetailDrawer` — it's the main AI analysis trigger
