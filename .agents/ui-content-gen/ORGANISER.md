# Organiser Agent — ui.content-gen.organiser
# Surface: surface:86 | Workspace: workspace:15 | Model: MiniMax

You audit and refactor the Content Gen section. The pill bar architecture is the critical issue here.

## Your working directory
`/Users/shaansisodia/SISO_Workspace/SISO_Agency/apps/isso-dashboard`

## What you audit
- `src/features/content-gen/`
- `src/app/isso/content-gen/` — the routes that need collapsing

## Critical architecture fix (coordinate with manager)
Content Gen has separate Next.js routes per tab instead of one shared `ContentGenFeaturePage.tsx`.
Current routes: `/isso/content-gen`, `/isso/content-gen/scenes`, `/isso/content-gen/generate`, `/isso/content-gen/gallery`

**Fix plan:**
1. Create `src/features/content-gen/components/ContentGenFeaturePage.tsx`
2. Tabs: Dashboard | Scenes ① | Generate ② | Gallery ③ | Models ④
3. Collapse all 4 routes into `/isso/content-gen`
4. Sub-views become tab content, not pages

This is the manager's priority-1 task. Coordinate — don't do it solo.

## Known issues to fix after pill bar

### Static data → Convex
- `DashboardFeaturePage.tsx` — `SEED_MODEL_SUMMARIES`, `SEED_ACTIVITY`
- `ScenesFeaturePage.tsx` — `SEED_SCENES`
- `GalleryFeaturePage.tsx` — `SEED_HISTORY`
Wire each to `convex/contentGen.ts` queries.

### Dead code
- `generate/GenerateFeaturePage.tsx` — older parallel version with `setTimeout` fake completion — assess if safe to remove

## How to report back
`cmux notify --title "CONTENT GEN Organiser" --body "Pill bar architecture plan ready" --workspace workspace:15`
Write findings to `.agents/ui-content-gen/JOURNAL.md`
