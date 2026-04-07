# Hub AI Features Plan
**Agent:** ui.hub.features | **Date:** 2026-04-07 | **Mode:** Planning only — no code

---

## Context

The Hub has three tabs:

| Tab | What it shows | Key data |
|-----|--------------|----------|
| **Vault** | Top scraped content from Intelligence, filtered by niche + type | `scrapedPosts` (caption, engagementRate, outlierRatio, baselineScore, aiAnalysis.hookScore/hookLine/emotions/transcript) |
| **Approve/Swipe** | Tinder-style rater writing to `swipeRatings` (up/down/save) | Tag categories: Hook, Pacing, Visual, Audio, Format, Tone |
| **Saved** | Bookmarked posts grouped by niche | `scrapedPosts.saved`, `boardIds` |

AI backbone: **OpenRouter** (cheap, model-switchable). All calls go through a single `/api/ai` Next.js route that proxies to OpenRouter with the appropriate model ID.

---

## 15–20 AI Feature Ideas

---

### 1. Auto-Tag Suggester
**What it does:** During a swipe, before the user manually picks tags, pre-fills suggested tags (Hook quality, Pacing, Visual, Audio, Format, Tone) by mapping the post's existing `aiAnalysis` fields into the tag category schema. User can accept with one click or override.

**Where it surfaces:** Approve/Swipe tab — WhyTagPanel, appears automatically when a card lands.

**Model:** `meta-llama/llama-3.2-3b-instruct` — pure classification/mapping against a fixed schema. Input is <200 tokens. At ~$0.06/M tokens this is essentially free per swipe.

**Complexity:** Easy — the post's `aiAnalysis` already has hookScore, hookLine, emotions. It's a prompt that maps structured fields → tag category values.

**Value:** High — the #1 friction in swipe sessions is manually picking tags. Pre-filling them speeds up sessions by 3x and makes the training signal richer.

---

### 2. Swipe Pattern Insights
**What it does:** After a swipe session ends (or on demand from History view), AI analyzes the session log and writes a 3-bullet insight card: what you consistently liked, what you consistently passed on, and one recommended content brief for the models team.

**Where it surfaces:** Approve/Swipe tab — SwipeSessionSummary component, as a collapsible "AI Debrief" panel at the end of a session.

**Model:** `mistralai/mistral-7b-instruct` — summarization + pattern extraction over a JSON log. Cheap at ~$0.07/M input tokens.

**Complexity:** Easy-Medium — session log already exists in state. Feed it as JSON, prompt for pattern extraction, render markdown output.

**Value:** High — turns passive swiping into an active learning signal. Currently the log exists but no one synthesizes it.

---

### 3. Caption Rewriter ("Adapt for Model")
**What it does:** On any saved post in Saved tab or Vault, a button "Adapt for [Model]" rewrites the caption in that model's documented voice and tone. Outputs 2–3 variants optimized for: (a) saves, (b) comments, (c) shares.

**Where it surfaces:** Saved tab — PostCard hover actions. Also available in Vault detail drawer.

**Model:** `anthropic/claude-3-haiku` via OpenRouter — best cost/quality ratio for stylistic rewriting. Fast enough for interactive use (~1-2s).

**Complexity:** Easy — single prompt with model voice description as system prompt, caption as user input. No special tooling.

**Value:** High — currently the team manually rewrites captions. This eliminates the blank-page problem. Direct workflow ROI on content production.

---

### 4. Hook Line Ranker
**What it does:** In Vault, adds a "Top Hooks" mode that re-ranks all visible posts by `aiAnalysis.hookScore` and surfaces the top 10 hook lines in a dedicated "Steal These Hooks" panel in the leaderboard sidebar. For posts without a hookLine, runs a quick extraction.

**Where it surfaces:** Vault tab — leaderboard sidebar (replaces or augments current leaderboard when toggled).

**Model:** `meta-llama/llama-3.2-3b-instruct` for extraction on posts missing hookLine. The ranking itself is just sorting existing data — zero AI cost for posts already analysed.

**Complexity:** Easy — hookLine and hookScore already exist in the schema. The display work is the main effort. AI only runs for the subset of posts missing analysis.

**Value:** High — hook lines are the most valuable creative input for the models team. Having a ranked, scannable list saves 30+ minutes of manual review per week.

---

### 5. "Steal This" Brief Generator
**What it does:** Click any post in Saved tab → opens a drawer → one button generates a full content brief: "Recreate this for [Model]" — hook adaptation, visual direction, suggested audio type, ideal posting time, and a 2-sentence caption draft.

**Where it surfaces:** Saved tab — PostCard click-to-expand detail drawer, "Generate Brief" button.

**Model:** `google/gemini-flash-1.5` via OpenRouter — good at structured document generation, cheap (~$0.075/M input), fast response.

**Complexity:** Medium — requires building the detail drawer UI (if not already present) + prompt engineering for structured brief output. Brief is rendered as formatted markdown.

**Value:** High — turns the Saved tab from a static bookmark list into an active content production tool. This is the killer feature that makes saving posts feel worth it.

---

### 6. Niche Trend Briefing
**What it does:** A collapsible "Daily Brief" card at the top of the Vault tab. AI reads the top 20 posts by engagementRate + outlierRatio across each niche and writes a 1-paragraph summary per niche: what's winning, why, and what to do about it.

**Where it surfaces:** Vault tab — top of page, above the filter bar, collapsed by default.

**Model:** `mistralai/mistral-7b-instruct` — summarisation over structured metrics. Cached daily via a Convex scheduled action so it only runs once per day, not per user.

**Complexity:** Easy-Medium — Convex scheduled action fetches top posts, passes to OpenRouter, stores output in a `briefings` table. UI just reads and renders.

**Value:** Medium-High — gives the team a morning brief without opening Intelligence. Reduces tab-switching. High ROI on the caching approach (runs once, serves everyone).

---

### 7. Smart Queue Builder
**What it does:** Before starting a swipe session, AI pre-ranks the unrated posts in the queue by predicted relevance to the user's historical swipe preferences. Only the top 25 most "on-profile" posts are loaded into the session, not a random pull.

**Where it surfaces:** Vault tab — "Start Swipe Session" button flow. A "Personalise queue" checkbox appears; if checked, AI pre-ranks before loading SwipeStack.

**Model:** `meta-llama/llama-3.2-3b-instruct` — similarity scoring between a preference profile (built from past swipe tags) and each post's attributes. Very short inputs.

**Complexity:** Medium — requires reading past swipeRatings + tags from Convex, building a preference vector as text, scoring each candidate post, re-ordering the queue.

**Value:** High — reduces swipe fatigue. Users currently get random content; personalised queues mean more signal per session and faster throughput.

---

### 8. Voice Matching Scorer
**What it does:** In the "Send to Model" modal (Approve tab), after selecting a model, AI scores how well the content matches that model's documented tone and style on a 0–100 scale with a one-line rationale. "82% on-brand for Tyler — strong hook, aspirational tone, minimal aesthetic."

**Where it surfaces:** Approve/Swipe tab — SendToModelModal, appears as a badge below the model selector.

**Model:** `mistralai/mistral-7b-instruct` — short classification prompt with the model's style description as context.

**Complexity:** Easy-Medium — requires a `modelVoiceProfiles` config object (one per model, written once), then a single scoring prompt per send action.

**Value:** Medium-High — prevents misfires (sending fitness content to a fashion model). Adds a quality gate to the curation workflow.

---

### 9. Board Curator
**What it does:** In Saved tab, an "Auto-organise" action clusters all saved posts into themed boards using AI (e.g. "Morning Routine Hooks", "POV Fashion Moments", "Transformation Arcs"). Writes board names to `scrapedPosts.boardIds`.

**Where it surfaces:** Saved tab — toolbar button "Auto-organise into boards".

**Model:** `meta-llama/llama-3.1-8b-instruct` — clustering/categorisation over post captions + emotion + format tags. Runs once on demand.

**Complexity:** Medium — requires a two-pass prompt (cluster → name boards), then a Convex mutation to write boardIds back. UI needs a board view renderer.

**Value:** Medium — useful once the Saved tab has 50+ posts. Less urgent when starting out. Good Phase 2 feature.

---

### 10. Content Gap Detector
**What it does:** Compares the niche/format distribution of Saved content against what's currently trending in Intelligence (top performers by outlierRatio). Flags gaps: "You have no wellness carousels saved — they're up 40% in outlierRatio this week."

**Where it surfaces:** Saved tab — a "Coverage Analysis" strip above the niche filter, renders 2–4 gap chips.

**Model:** `mistralai/mistral-7b-instruct` — the comparison is mostly arithmetic; AI writes the natural-language gap descriptions. Could potentially be done without AI at all.

**Complexity:** Medium — needs cross-querying Saved content + Intelligence trend data, then prompt for gap narrative. The data pipeline is the main work.

**Value:** Medium — directionally useful but not urgent. The team currently catches gaps manually. Low urgency until the Saved collection is larger.

---

### 11. Emotion Palette Visualiser
**What it does:** In Saved tab sidebar, aggregates all `aiAnalysis.emotions` arrays across saved posts and renders a frequency breakdown: "Aspirational 34% · Playful 28% · Sensual 21% · Calm 17%". Surfaces as a small bar chart.

**Where it surfaces:** Saved tab — right sidebar (mirroring the Leaderboard sidebar in Vault).

**Model:** None — pure data aggregation from existing `emotions` array fields. Zero AI cost. This is a derived-data display feature, not a generative one.

**Complexity:** Easy — aggregate + sort existing structured data.

**Value:** Medium — useful for understanding the emotional profile of your saved content vs. what's trending. Good self-awareness tool for creative direction.

---

### 12. Swipe Fatigue Detector
**What it does:** Monitors swipe pace and decision variance during a session. If the user approves 8+ in a row without a pass, or swipe interval drops below 2 seconds, surfaces a toast: "You might be on autopilot — want to take a 5-minute break?" Optionally auto-pauses the queue.

**Where it surfaces:** Approve/Swipe tab — global toast notification triggered by session state analysis.

**Model:** None — pure client-side logic on session state. No AI needed. Could use a trivial heuristic.

**Complexity:** Easy — session state already tracks rated/passed counts and timestamps.

**Value:** Medium — improves data quality of the swipe training signal. Less critical than workflow-accelerating features.

---

### 13. Viral Score Predictor
**What it does:** For each post in Vault, predicts its virality potential for a specific model's audience, expressed as a "Predicted ROI" badge (Low / Medium / High / 🔥). Factors in: outlierRatio, engagementRate, baselineScore, format fit for the model.

**Where it surfaces:** Vault tab — badge on each PostCard, filterable by predicted ROI.

**Model:** `meta-llama/llama-3.2-3b-instruct` — zero-shot scoring prompt against a rubric. Or could be a weighted formula using existing numeric fields (zero AI cost).

**Complexity:** Medium — the formula approach is easy; the AI approach requires batching all visible posts into a scoring request. Consider server-side computation on ingest.

**Value:** Medium-High — helps prioritise what to swipe first. More useful once Vault has real Convex data (currently seed data).

---

### 14. Trend Velocity Alert
**What it does:** A Convex scheduled action runs every 4 hours, checks for posts whose outlierRatio has spiked >8x in the last window, and pushes a Convex real-time notification to the Hub. A toast appears: "🔥 2 posts going viral right now in Fitness — view them."

**Where it surfaces:** App-wide toast + a "Trending Now" chip in Vault toolbar.

**Model:** None for the alert logic (threshold check). Optionally `mistralai/mistral-7b-instruct` to write a human-readable alert description.

**Complexity:** Medium — Convex scheduled action + real-time subscription + toast UI. The outlierRatio data already exists in schema.

**Value:** High — time-sensitive content discovery. If the team can react to a viral post within hours, the creative advantage is significant.

---

### 15. Multi-Post Story Arc Planner
**What it does:** In Saved tab, select 3–7 posts → "Plan Story Arc" button → AI generates a posting schedule with narrative arc: which post goes first as the hook, which builds the story, which is the payoff. Outputs a 7-day schedule grid.

**Where it surfaces:** Saved tab — multi-select mode + "Plan Arc" CTA → modal with schedule output.

**Model:** `google/gemini-flash-1.5` — strong at structured narrative reasoning and schedule generation.

**Complexity:** Hard — requires multi-select UI, prompt engineering for narrative arc, schedule output format, and a way to push the schedule somewhere useful (e.g., content pipeline).

**Value:** Medium — creative value is high but the downstream scheduling integration is complex. Better suited for Phase 3 once the content pipeline is more mature.

---

### 16. Caption A/B Variant Generator
**What it does:** For any post in Saved tab, generates 3 caption variants optimised for different goals: (a) maximum saves — curiosity-gap hook, (b) maximum comments — opinion-bait or question-end, (c) maximum shares — relatable/quotable. Displayed in a tabbed output.

**Where it surfaces:** Saved tab — PostCard "Generate Variants" button → inline expandable output.

**Model:** `anthropic/claude-3-haiku` — best at tone-aware copywriting at minimal cost.

**Complexity:** Easy — three system prompts with different optimisation objectives, same caption input.

**Value:** High — directly usable output. Saves significant creative copywriting time per post.

---

### 17. Niche Leaderboard AI Commentary
**What it does:** The leaderboard sidebar in Vault already ranks top performers. Add an AI-written one-liner below the #1 performer explaining *why* they're winning: "Ella ranks #1 this week because her transformation reels combine aspirational tone with a fast-cut visual style that has 3x above-baseline saves."

**Where it surfaces:** Vault tab — LeaderboardSidebar, below the top-ranked creator card.

**Model:** `meta-llama/llama-3.2-3b-instruct` — very short output, structured input. Could run on sidebar mount.

**Complexity:** Easy — 1 API call on mount with the top creator's metrics as context.

**Value:** Medium — nice-to-have insight layer. Makes the leaderboard feel intelligent rather than just a sorted list.

---

### 18. Saved Collection Brief Exporter
**What it does:** In Saved tab, "Export Creative Brief" button takes the current filtered collection, has AI write a narrative framing document: what these posts have in common, the creative direction they represent, and 3 recommended briefs for the models team. Outputs as a formatted brief.

**Where it surfaces:** Saved tab — toolbar export button → modal with copyable/downloadable output.

**Model:** `google/gemini-flash-1.5` — good at structured document synthesis.

**Complexity:** Medium — aggregate post data + prompt for brief structure. Output rendering is the main UI work.

**Value:** Medium — useful for creative directors, not for daily workflow. Lower urgency.

---

### 19. Auto-Niche Tagger for Ungrouped Posts
**What it does:** Some posts in Vault/Saved may lack a niche tag (especially after new scrapes). AI batch-classifies them into the niche taxonomy (fitness, lifestyle, fashion, wellness) based on caption + aiAnalysis.emotions.

**Where it surfaces:** Background — runs automatically after each scrape batch. No visible UI except the niche filter now works correctly on previously-untagged posts.

**Model:** `meta-llama/llama-3.2-3b-instruct` — classification against a 4-class taxonomy. Can batch 50 posts in a single prompt with JSON output.

**Complexity:** Easy — Convex action triggered post-scrape, writes `niche` field back to `scrapedPosts`.

**Value:** Medium — maintenance feature. Keeps the niche filters accurate. Background utility, not a headline feature.

---

### 20. Session Replay Highlighter
**What it does:** After a swipe session, AI scans the session log and surfaces the 3 most "decisive" moments — posts where you gave the strongest like signal (tagged highly across multiple categories) — as a "Best of Session" mini-gallery with the tags you gave them.

**Where it surfaces:** Approve/Swipe tab — SwipeSessionSummary, "Highlights" expandable section.

**Model:** `meta-llama/llama-3.2-3b-instruct` — ranking/scoring based on tag completeness + decision type.

**Complexity:** Easy — session log already exists. Scoring completeness of tags is a simple heuristic; AI adds narrative framing.

**Value:** Medium — reinforces the swipe workflow's purpose. Nice for team review but not critical path.

---

## Top 5 by Value-to-Complexity Ratio

Ranking methodology: **High-value features with Easy complexity score highest.** Medium complexity at High value scores second. Hard complexity is penalised regardless of value.

---

### #1 — Auto-Tag Suggester (Feature 1)
**Ratio: High value / Easy complexity**

The raw material is already there — every post in the Vault that's been through the Intelligence analysis pipeline has `hookScore`, `hookLine`, and `emotions` on it. The tag categories in the Approve tab (Hook, Pacing, Visual, Audio, Format, Tone) map almost 1:1 to those fields. This feature is essentially: write a prompt that translates structured data into tag selections.

Zero new data pipelines. Zero schema changes. Just a pre-fill in WhyTagPanel. The UX payoff is enormous — the current friction of manually tagging every swipe card is what limits session length and data quality. Removing that friction compounds: more swipes → richer swipe ratings → better Intelligence signals.

**Build estimate:** ~4 hours end-to-end (prompt + WhyTagPanel integration + one-click accept UX).

---

### #2 — Caption Rewriter / "Adapt for Model" (Feature 3)
**Ratio: High value / Easy complexity**

A single Claude Haiku call per button press. The system prompt is the model's voice profile (written once, stored as a constant). The user input is the caption. Output is 3 variants. No schema changes, no new Convex functions needed for Phase 1 (can be a pure `/api/ai` Next.js route).

This directly eliminates manual work that the content team does every single day. It's the feature most likely to get used repeatedly after ship. High discoverability because it lives on a button that's always visible.

**Build estimate:** ~3 hours (route + prompt + variant display UI in PostCard).

---

### #3 — Caption A/B Variant Generator (Feature 16)
**Ratio: High value / Easy complexity**

Near-identical implementation path to Feature 3 but with a different framing: instead of "adapt for a model's voice", it optimises for engagement objective. Three system prompts, same Haiku model, same API route. Could even share the same `/api/ai` route with a `mode` parameter.

Complementary to Feature 3, not a duplicate — Feature 3 is about voice matching, Feature 16 is about distribution strategy. Together they cover the two main caption decisions: *how to say it* and *what to optimise for*.

**Build estimate:** ~2 hours (reuses everything from Feature 3, just different prompts).

---

### #4 — Swipe Pattern Insights (Feature 2)
**Ratio: High value / Easy-Medium complexity**

The SwipeSessionSummary component already exists and already shows rated/passed/sent counts. Adding an "AI Debrief" panel that takes the session log (already in state as `RatingRecord[]`) and sends it to Mistral-7B for pattern extraction is a low-lift addition.

The value is strategic: this is the feature that proves to the team that the swipe workflow *learns*. Without it, swiping feels like data entry. With it, swiping feels like training your own taste model. This narrative matters for adoption.

**Build estimate:** ~5 hours (API call at session end + markdown render in SwipeSessionSummary + loading state).

---

### #5 — Trend Velocity Alert (Feature 14)
**Ratio: High value / Medium complexity**

Slightly higher complexity than the others because it requires a Convex scheduled action, but the payoff is disproportionate. Viral windows on Instagram/TikTok are measured in hours. If the team can get a real-time alert when a post's outlierRatio spikes, they can ride the wave instead of discovering it in the weekly review.

The schema already has `outlierRatio` on `scrapedPosts`. The Convex scheduled action pattern is already established in the project (CLAUDE.md references it). The main new work is the scheduled action + real-time subscription + toast UI.

**Build estimate:** ~6 hours (Convex scheduled action + real-time subscription + toast component).

---

## Implementation Order Recommendation

```
Week 1: Features #1 + #3 (Auto-Tag + Caption Rewriter) — highest ratio, share the same API route
Week 2: Feature #16 (A/B Variants) — trivial add-on to Week 1 work
Week 2: Feature #2 (Swipe Pattern Insights) — natural complement to the swipe workflow
Week 3: Feature #14 (Trend Velocity Alert) — standalone Convex work, no frontend dependencies
```

All five can be shipped before any schema changes are needed. They layer on top of existing data. Total estimated build: ~20 hours across 3 weeks.

---

## OpenRouter Model Reference

| Model | Use cases in Hub | Cost (input/output per M tokens) |
|-------|-----------------|----------------------------------|
| `meta-llama/llama-3.2-3b-instruct` | Classification, tagging, scoring, ranking | ~$0.06 / ~$0.06 |
| `mistralai/mistral-7b-instruct` | Summarisation, pattern extraction, gap analysis | ~$0.07 / ~$0.07 |
| `anthropic/claude-3-haiku` | Copywriting, caption rewriting, voice adaptation | ~$0.25 / ~$1.25 |
| `google/gemini-flash-1.5` | Structured document generation, story arc, briefs | ~$0.075 / ~$0.30 |
| `meta-llama/llama-3.1-8b-instruct` | Clustering, board curation, multi-class tasks | ~$0.10 / ~$0.10 |
