# AI Features Plan — Intelligence Section
**Author:** ui.intelligence.features | **Date:** 2026-04-07
**Status:** FINAL — post self-critique

---

## Self-Critique: Key Assumption Failures

Before listing features, here are the assumptions I had to challenge:

1. **Week-over-week data exists for velocity.** `getTrends` takes ONE `days` param, not two periods. Computing 7d vs 30d deltas requires two separate hookStats calls + careful diff logic — not simple.
2. **LLM structural analysis is actionable.** "Question + Contrast" as a formula label is too abstract for a content writer to use. The LLM might categorize hooks in ways that don't map to usable writing instructions.
3. **F9 and F12 are the same feature.** Both live in the drawer, both rewrite/generate captions. They should be one: "Hook Optimizer" that both scores an existing hook AND generates alternatives.
4. **Posting time data exists.** No Convex query returns day-of-week engagement patterns. Content Calendar can't recommend times without it.
5. **Hook Alert comparison logic is sound.** `topRatedPosts` = highest-rated by team, not necessarily "saved for library." The diff logic against "new hooks" needs careful definition.
6. **More features = better.** Shaan's journal shows a pattern of preferring quality over quantity. Every feature added is also a feature that can break, confuse, and require maintenance.

**What I'm cutting and why:**
- F10 (Trend Velocity) — requires 7d vs 30d diff that needs two separate Convex calls + more complex state. Medium.
- F1 (Hook Formula Extractor) — LLM structural labels are brittle; replace with a more concrete hook-scoring rubric instead.
- F5 (Content Calendar) — posting time data doesn't exist in Convex. Not buildable without new data.
- F9+F12 merged into one feature.
- F3 (Hook Alert) — the comparison against `topRatedPosts` is conceptually fuzzy. Simplified to "Hook Novelty Flag" using clearer logic.

---

## Final Feature List

---

### Feature 1: Post Pre-Score
- **What it does:** User pastes a caption (pre-pipeline) + selects niche/format; model scores it 1-10 against the team's winning hook patterns and explains why with specific bullet feedback.
- **Where it lives:** Qualify tab toolbar — "Score Caption" button opens a modal
- **Why 10x value:** Stops weak hooks before they enter the pipeline. The single highest-leverage intervention — catching one bad post before production saves more time than any analytics insight.
- **Data it uses:** `getTrends.topHooks[]`, `getHookStats.hookLines[]`, `getHashtagCorrelation`
- **OpenRouter model:** `google/gemini-2.0-flash-lite-001`
- **Implementation:**
  - API: `POST /api/intelligence/pre-score` → `{ caption: string, niche: string, contentType: string }`
  - Returns: `{ score: number, hookTip: string, missingSignals: string[], strongSignals: string[] }`
  - UI: `ScoreCaptionModal.tsx` — textarea + niche selector + Run; result shows 1-10 ring + bullets
- **Complexity:** Simple
- **Priority:** P0 — highest workflow leverage

---

### Feature 2: Hook Optimizer (A/B + Rewrite)
- **What it does:** In the Analysis drawer, takes an existing hook line and generates 2 alternative openings + a full rewrite, all scored against winning patterns.
- **Where it lives:** Analysis drawer — new "Optimize Hook" button in AIAnalysisTab header
- **Why 10x value:** Consolidates F9 (A/B variants) and F12 (rewrite) into one: gives writers a menu of high-performing alternatives in a single click, replacing an entire copywriting iteration.
- **Data it uses:** `getAnalysedPosts[].aiAnalysis.hookLine`, `getHookStats.hookLines[]`, post's niche/contentType
- **OpenRouter model:** `google/gemini-2.0-flash-lite-001`
- **Implementation:**
  - API: `POST /api/intelligence/hook-optimizer` → `{ hookLine: string, niche: string, contentType: string, existingCaption?: string }`
  - Returns: `{ variantA: string, variantB: string, fullRewrite: string, scoreA: number, scoreB: number, rewriteScore: number, tip: string }`
  - UI: Button in `AIAnalysisTab` header → three cards (Variant A, Variant B, Full Rewrite), each with a score + copy button
- **Complexity:** Simple
- **Priority:** P0 — directly accelerates content production

---

### Feature 3: Emotion Gap Analyzer
- **What it does:** Compares emotions in the team's top-rated posts vs emotions driving highest-ER scraped posts; surfaces which emotions are being underweighted.
- **Where it lives:** Insights tab — inline card between RatingSummaryBar and InsightCards
- **Why 10x value:** Reveals a hidden insight that takes hours of cross-tabulation to find. Directly informs brief writing. The team may be avoiding an emotion that actually performs well.
- **Data it uses:** `getInsights.nichePreferences[]`, `getHookStats.emotionFrequency[]`, `getAnalysedPosts[].aiAnalysis.emotions[]`
- **OpenRouter model:** `google/gemini-2.0-flash-lite-001`
- **Implementation:**
  - API: `POST /api/intelligence/emotion-gap` → `{ teamEmotions: { emotion: string; count: number }[], scrapedEmotions: { emotion: string; count: number; avgER: number }[] }`
  - Returns: `{ underusedEmotions: { emotion: string; gap: number; recommendation: string }[] }`
  - UI: `EmotionGapCard.tsx` — 3 emotion chips with directional arrows + recommendation text
- **Complexity:** Simple
- **Priority:** P1 — insight the team genuinely couldn't compute manually

---

### Feature 4: Caption Compliance Checker
- **What it does:** User pastes a caption + selects niche; model checks it against top correlated hashtags and niche conventions, returns a score + specific missing elements.
- **Where it lives:** Qualify tab — "Check Caption" button in table toolbar (modal)
- **Why 10x value:** Replaces manual hashtag research; gives a data-backed go/no-go before posting. Directly complementary to Pre-Score.
- **Data it uses:** `getHashtagCorrelation` (top correlated hashtags per niche), `getTrends.nicheStats`
- **OpenRouter model:** `google/gemini-2.0-flash-lite-001`
- **Implementation:**
  - API: `POST /api/intelligence/check-caption` → `{ caption: string, niche: string }`
  - Returns: `{ score: number, missingHashtags: string[], tip: string, nicheFit: string }`
  - UI: `CaptionCheckModal.tsx` — textarea + niche dropdown; result card shows score + suggestions
- **Complexity:** Simple
- **Priority:** P1 — directly actionable, modal-based (no existing UI changed)

---

### Feature 5: Trending Hook Alert
- **What it does:** Monitors newly scraped posts with high ER; flags when a hook structure or topic appears in top performers that isn't yet represented in the team's saved posts.
- **Where it lives:** Dashboard — small alert strip below Pulse Report, shown only when new patterns detected
- **Why 10x value:** Early warning on emerging hook trends before competitors copy them. The only feature that works proactively vs reactively.
- **Data it uses:** `getTrends.outlierPosts[]` (top ER posts scraped this week) vs `getInsights.topRatedPosts[]`
- **OpenRouter model:** `google/gemini-2.0-flash-lite-001`
- **Implementation:**
  - API: `POST /api/intelligence/hook-alert` → `{ newOutliers: OutlierPost[], teamSaved: RatedPost[] }`
  - Returns: `{ alerts: { hook: string, reason: string, er: number, handle: string }[] }` (empty array if nothing new)
  - UI: `HookAlertStrip.tsx` — conditionally rendered; shows badge count + expandable list; auto-dismisses when seen
- **Complexity:** Simple
- **Priority:** P1 — unique proactive intelligence no other feature provides

---

### Feature 6: Competitor Content Gap
- **What it does:** Takes the team's top-rated posts + top scraped competitor posts (top 10 per niche) and identifies topics/themes in the competitor data that the team hasn't covered.
- **Where it lives:** Insights tab — collapsible card in the right column
- **Why 10x value:** Identifies white-space opportunities. Equivalent manual work = reading hundreds of competitor posts. High strategic value.
- **Data it uses:** `getInsights.topRatedPosts[]` (team), `getFeed` top 10 by ER per niche (competitor — via separate calls per niche)
- **OpenRouter model:** `google/gemini-2.0-flash-lite-001`
- **Implementation:**
  - API: `POST /api/intelligence/content-gap` → `{ teamPosts: RatedPost[], competitorPosts: Post[] }`
  - Returns: `{ gaps: { topic: string, evidence: string, opportunity: string }[] }`
  - UI: `ContentGapCard.tsx` — collapsible card showing 3 gap items, each with evidence + opportunity description
- **Complexity:** Simple (but note: uses top 10 posts per niche to avoid token limits)
- **Priority:** P2 — high strategic value but requires multiple API calls (one per niche)

---

### Feature 7: Niche Saturation Score
- **What it does:** Scores each tracked niche 1-10 on saturation using ER trend direction (rising ER + low volume = emerging; rising volume + flat ER = saturating).
- **Where it lives:** Dashboard — new row between Pulse Report and ActionQueue, or as a tile replacement
- **Why 10x value:** Tells the team where to deploy talent vs where to hold back. Entirely manual to compute. Direct input to brief assignment.
- **Data it uses:** `getTrends.nicheStats[]` (needs two calls: 7d and 30d for comparison)
- **OpenRouter model:** `google/gemini-2.0-flash-lite-001`
- **Implementation:**
  - API: `POST /api/intelligence/niche-saturation` → `{ nicheStats7d: NicheStat[], nicheStats30d: NicheStat[] }`
  - Returns: `{ results: { niche: string, saturation: number, signal: string, recommendation: string }[] }`
  - UI: `NicheSaturationRow.tsx` — horizontal strip, niche pills colored green→red by saturation score
- **Complexity:** Medium (requires two Convex calls + diff logic in the hook)
- **Priority:** P2 — keep in plan but note complexity; builder should assess if two calls is worth it

---

### Feature 8: Creator Brief Fit
- **What it does:** Given a content brief (niche + content type + hook style), scores each tracked creator on how well their historical performance fits that brief.
- **Where it lives:** Qualify tab — hover tooltip on creator handle, or optional Fit Score column in QualifyTableView
- **Why 10x value:** Replaces subjective creator selection with data. Especially useful when assigning a new brief across multiple eligible creators.
- **Data it uses:** `getCreatorStats` (per-creator ER by niche + contentType)
- **OpenRouter model:** `google/gemini-2.0-flash-lite-001`
- **Implementation:**
  - API: `POST /api/intelligence/creator-fit` → `{ creators: CreatorStat[], niche: string, contentType: string, hookStyle?: string }`
  - Returns: `{ fits: { handle: string, fitScore: number, bestNiches: string[], recommendation: string }[] }`
  - UI: `CreatorFitBadge.tsx` — A/B/C colored badge on creator rows; tooltip on hover with breakdown
- **Complexity:** Simple
- **Priority:** P2 — valuable but data-dependent on scrape volume; only meaningful once creators have 10+ real posts

---

## Summary: Final Priority Order

| Priority | Feature | Tab | Why |
|----------|---------|-----|-----|
| P0 | Post Pre-Score | Qualify modal | Prevents bad posts from entering pipeline — highest leverage |
| P0 | Hook Optimizer | Analysis drawer | Generates + scores alternatives — directly accelerates content creation |
| P1 | Emotion Gap Analyzer | Insights | Hidden insight, directly informs briefs |
| P1 | Caption Compliance Checker | Qualify modal | Validates captions against data, no UI changes |
| P1 | Trending Hook Alert | Dashboard | Only proactive intelligence feature |
| P2 | Competitor Content Gap | Insights | Strategic white-space identification |
| P2 | Niche Saturation Score | Dashboard | Strategic deployment guide (Medium complexity) |
| P2 | Creator Brief Fit | Qualify | Data-backed creator assignment (data-dependent) |

**Cut from original 12:**
- Trend Velocity — requires two Convex calls + complex diff; not simple
- Hook Formula Extractor — LLM structural labels are too abstract to be actionable
- Content Calendar — posting time data doesn't exist in Convex
- F9/F12 merged into Hook Optimizer
- Hook Alert simplified with clearer comparison logic

**Notes for builder:**
- All use `google/gemini-2.0-flash-lite-001` via OpenRouter (~$0.001/1M tokens)
- All are 1 API route + 1 UI component
- All data comes from existing Convex queries — no new scraping or schema changes needed
- Emotion Gap, Trending Hook Alert, and Niche Saturation all need careful empty-state handling
