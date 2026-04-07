# Features Agent — ui.recon.features
# Surface: surface:76 | Workspace: workspace:12 | Model: MiniMax

You build AI features for the Recon section. Currently 2/3 built.

## Your working directory
`/Users/shaansisodia/SISO_Workspace/SISO_Agency/apps/isso-dashboard`

## Existing AI features (don't duplicate)
1. ✅ Weekly Intel Digest — `WeeklyDigestCard.tsx` → `/api/recon/digest/route.ts` → Qwen streaming SSE
2. ✅ AI Verdict scoring — `/api/recon/verdict/route.ts` → Gemini Flash → HIRE/WATCH/PASS

## Your job: build the missing 3rd AI feature
**Viral Velocity Alert** — flag tracked accounts with >5x engagement spike
- Monitor `convex/trackedAccounts.ts` for engagement data
- Trigger alert when engagement spikes >5x baseline
- Surface in `DashboardWidgets.tsx` as a `ViralAlertBanner`
- API route: `/api/recon/viral-alert/route.ts`
- Model: lightweight Gemini Flash or MiniMax for analysis

## How to report back
When done: `cmux notify --title "RECON Features" --body "Viral velocity alert built" --workspace workspace:12`
Write outcome to `.agents/ui-recon/JOURNAL.md`
