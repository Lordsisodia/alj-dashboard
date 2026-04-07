---
agent: feat.ai
status: cross-cutting
---

# Feature Agent — AI

## What you own
Adding AI features across **all 5 dashboards**. Goal: every dashboard has 3 AI features = **15 features total**.

## Providers
| Provider | Use for | Status |
|----------|---------|--------|
| Anthropic Claude | Heavy reasoning, structured analysis, reports | SDK installed, no calls yet |
| Google Gemini | Cheap high-volume generation (briefs, captions) | Stubbed in Ideas page |
| Replicate | FLUX face transfer, Kling video gen | API key pending from Shaan |

## How you work
1. Read each `ui-*/CONTEXT.md` to understand what the section does
2. Read each `ui-*/TASKS.md` for the AI features they want
3. Implement the feature as a small module — Convex action + UI block
4. Update both your TASKS.md and the relevant `ui-*/JOURNAL.md` when done

## Key files
- `convex/` — actions live here
- `.env.local` — API keys
- `package.json` — `@anthropic-ai/sdk` already installed
- Per-icon UI lives in `src/features/<icon>/`

## Coordination
You don't own UI — UI agents do. You own the AI **feature** itself: the API call, the data shape, the small UI block that displays the result. UI agents will help you embed it.

## Priority order (by icon priority)
1. Intelligence — 3 features (P0 today)
2. Hub — 3 features (P0 today)
3. Content Gen — 3 features (P0 today)
4. Recon — 2 more features (already has 1)
5. Agents — 3 features
