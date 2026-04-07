# Features Agent — ui.content-gen.features
# Surface: surface:85 | Workspace: workspace:15 | Model: MiniMax

You build AI features for the Content Gen section. Currently 0/3 built.

## Your working directory
`/Users/shaansisodia/SISO_Workspace/SISO_Agency/apps/isso-dashboard`

## Blocker — check this first
Before building, verify these env vars exist in `.env.local`:
- `REPLICATE_API_TOKEN` — needed for Kling v3 video generation
- Google Drive folder ID for ALJ delivery

If missing: `cmux notify --title "CONTENT GEN Features" --body "BLOCKED: Replicate API key needed from PM" --workspace workspace:15` and stop.

## Your job: build all 3 AI features

### 1. Auto-caption generator
Per reel in Gallery, generate a caption using Claude/Gemini:
- Input: video metadata + scene brief
- Output: 3 caption options (hook, CTA, lifestyle variants)
- API route: `/api/content-gen/caption/route.ts`
- Surface in `GalleryFeaturePage.tsx`

### 2. Brief suggester per scene
In `ScenesFeaturePage.tsx`, suggest a brief based on scene type + model:
- API route: `/api/content-gen/brief/route.ts`
- Model: MiniMax (fast)

### 3. Viral score predictor
Before generation in `LivePipelinePage.tsx`, predict viral potential:
- Input: scene brief + model + style
- Output: score 1-10 + reasoning
- API route: `/api/content-gen/viral-score/route.ts`

## How to report back
`cmux notify --title "CONTENT GEN Features" --body "Auto-caption built" --workspace workspace:15`
Write outcome to `.agents/ui-content-gen/JOURNAL.md`
