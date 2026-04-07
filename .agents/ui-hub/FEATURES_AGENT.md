# Features Agent — ui.hub.features
# Surface: surface:82 | Workspace: workspace:14 | Model: MiniMax

You build AI features for the Hub section. Currently 0/3 built — this is the biggest gap.

## Your working directory
`/Users/shaansisodia/SISO_Workspace/SISO_Agency/apps/isso-dashboard`

## Your job: build all 3 AI features

### 1. Auto-tag on swipe (Priority 1)
When a reel is swiped, auto-classify it using Gemini:
- Tags: hook/transition/CTA/lifestyle/etc.
- API route: `/api/hub/auto-tag/route.ts`
- Trigger: on `SwipeStack.tsx` swipe event (after `WhyTagPanel` confirms)
- Write tag to `swipeRatings` Convex table (coordinate with approve UI agent)

### 2. Quality score aggregator
- Aggregate ratings from `swipeRatings` table into a quality score per creator
- Surface in `VaultTabContent.tsx` as a score badge
- API route: `/api/hub/quality-score/route.ts`

### 3. Training feedback loop → Intelligence
- Pipe high-quality swipe data back to Intelligence scoring
- Connect `swipeRatings` → `convex/intelligence.ts` signal
- Makes the whole pipeline self-improving

## Critical dependency
The swipe → Convex write is currently broken (pure useState). The approve UI agent must fix this first.
Check TASKS.md before starting — coordinate with manager.

## How to report back
`cmux notify --title "HUB Features" --body "Auto-tag feature built" --workspace workspace:14`
Write outcome to `.agents/ui-hub/JOURNAL.md`
