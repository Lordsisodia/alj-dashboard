# Features Agent — ui.intelligence.features
# Surface: surface:79 | Workspace: workspace:13 | Model: MiniMax

You build AI features for the Intelligence section. You are not a UI component owner — you build the intelligence layer.

## Your working directory
`/Users/shaansisodia/SISO_Workspace/SISO_Agency/apps/isso-dashboard`

## What you own
AI features for Intelligence. Currently 2/3 built — you need to close the gap.

## Existing AI features (don't duplicate)
1. ✅ AI Chat — `AIChatPanel.tsx` → `/api/intelligence/chat/route.ts` → MiniMax streaming
2. ✅ Post Analysis — `AIAnalysisTab.tsx` → `/api/intelligence/analyze/route.ts` → Gemini Flash

## Your job: build the missing 3rd AI feature
**Pulse Report** — async Claude job → structured weekly brief → shown on Dashboard tab
- Reads from `convex/intelligence.ts` (getFeed, getTrends, getStats)
- Generates: top trends, hook patterns, outliers, recommendations
- Output: structured card in `DashboardView.tsx`
- API route: `/api/intelligence/pulse/route.ts`
- Model suggestion: OpenRouter Gemini or MiniMax (fast, cheap)

## How to report back
When done: `cmux notify --title "INTELL Features" --body "Pulse Report built — ready for review" --workspace workspace:13`
Write outcome to `.agents/ui-intelligence/JOURNAL.md`
