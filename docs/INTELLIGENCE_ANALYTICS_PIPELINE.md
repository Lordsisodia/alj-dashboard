# Intelligence Analytics Pipeline
## Reverse-Engineering Content Rules at Scale

**Status:** Planning / Pre-implementation  
**Target scale:** 10,000 reels  
**Goal:** Statistical rule discovery — what content features drive outlier performance

---

## 1. The Core Goal

This pipeline is NOT a content editor tool. It is a **research instrument**.

The output is rules like:

> **"niche=Fitness + format=talking_head + hook=negation → avgOutlier=3.8×, lift=2.1, n=43 posts, p=0.003"**

At 10k reels, statistically significant patterns emerge that tell you exactly what content structure, hook type, pacing, and CTA combination drives viral performance for each niche. You then apply those rules to content production.

---

## 2. Why the Current Schema Fails at Scale

The existing `aiAnalysis` shape (`hookScore`, `hookLine`, `emotions[]`, `breakdown`, `suggestions`) is a **writer's assistant schema**, not a research schema. At 10k it fails on every axis:

| Problem | Impact |
|---------|--------|
| `hookScore` is a black box float | Can't GROUP BY it; Gemini collapses 10 signals into one arbitrary number |
| `emotions[]` is open vocabulary | At 10k you get 300+ unique strings ("excited", "enthusiasm", "energetic") — nothing aggregates |
| `breakdown` + `suggestions` are free text | Literally cannot write a query "hook_type=question AND niche=fitness → avg outlier" |
| Nested in `scrapedPosts.aiAnalysis` | Convex can't index nested fields; every query does full 10k `.collect()` into memory |
| `max_tokens: 800` | Silently truncates structured output |
| `json_object` format | Gemini only guarantees "valid JSON", not schema compliance — enums drift |
| Flash-Lite model | 60% reliability on pacing/vibe fields vs ~85% for Flash (not Lite) |

**Root cause:** wrong ontology. The fix is a complete schema redesign around "what query do I want to run" as the primary constraint.

---

## 3. What Gemini Can Reliably Extract (per video)

Everything in the feature vector must be either a **discrete closed enum**, a **bounded numeric score with a rubric**, or a **boolean**. Open text is only kept for transcript/on-screen text.

### 3A. Hook Anatomy (first 3 seconds)

| Field | Type | Notes |
|-------|------|-------|
| `hookStructure` | enum(11) | The structural pattern of the hook — most predictive single field |
| `hookModality` | enum(5) | How the hook is delivered — spoken, text, visual, audio, mixed |
| `firstFrameType` | enum(7) | What the viewer sees at frame 0 |
| `spokenFirstWords` | string | Verbatim first 8 spoken words (null if no speech) |
| `onScreenTextFirstFrame` | string | Verbatim text overlay at t=0 (null if none) |
| `curiosityGapPresent` | boolean | Does the hook pose an unanswered question? |
| `patternInterruptPresent` | boolean | Unexpected visual/audio event in first 2s? |
| `directAddress` | boolean | Creator speaks directly to viewer ("you/your")? |
| `hookDurationSec` | number | When does the setup end and content begin? (0.5–3.0) |

**`hookStructure` enum (force Gemini to pick exactly one):**
- `question` — "Did you know...", "Why does..."
- `shock_claim` — "I made $10k in...", "Nobody tells you..."
- `negation` — "Stop doing X", "Don't buy..."
- `listicle` — "3 things...", "5 ways..."
- `pov` — "POV: you're..."
- `before_after` — transformation promise/tease
- `visual_hook` — no words, pure visual surprise
- `transformation_tease` — "wait for it..."
- `direct_command` — "Watch this", "Try this"
- `storytime` — "Let me tell you..."
- `other` — track frequency; if >5% of dataset, add a new enum

### 3B. Content Format (single most predictive field)

| Field | Type | Notes |
|-------|------|-------|
| `formatPrimary` | enum(14) | The dominant content structure |
| `setting` | enum(8) | Physical environment |
| `creatorOnScreen` | boolean | Is the creator visible at all? |
| `faceVisibility` | enum(4) | full / partial / obscured / none |
| `creatorCount` | 1\|2\|"3+"\|0 | How many people are on screen |

**`formatPrimary` enum:**
- `talking_head` — creator speaks directly to camera
- `voiceover_b_roll` — narration over visuals, face not required
- `pov_action` — first-person action/experience
- `transition_montage` — cut-heavy reveal (outfit, before/after, etc.)
- `lipsync` — syncing to trending audio
- `tutorial_demo` — showing how to do something
- `reaction` — responding to a stimulus
- `skit_scripted` — acted scene or character
- `text_on_screen_silent` — reading content, no speech
- `product_showcase` — item-centric content
- `thirst_trap_static` — aesthetic, body-focused, slow
- `before_after_reveal` — transformation arc
- `dance_performance`
- `day_in_life_vlog`
- `other`

**`setting` enum:** `home_bedroom` / `home_other` / `gym` / `outdoor_urban` / `outdoor_nature` / `studio` / `car` / `mirror` / `other`

### 3C. Pacing & Energy

| Field | Type | Reliability |
|-------|------|-------------|
| `energyLevel` | 1–5 (rubric-anchored) | High — rubric forces calibration |
| `cutsPerSecondBucket` | enum(4) | Medium — bucket, don't ask for exact count |
| `hasJumpCuts` | boolean | High |
| `hasSpeedRamps` | boolean | High |
| `hasZoomPunches` | boolean | High |
| `videoLengthSec` | number | **Get from file metadata, not Gemini** |

**`energyLevel` rubric (ship verbatim in prompt to calibrate Gemini):**
- **1** = static, slow, ASMR-like, <1 cut per 5s
- **2** = calm, measured, 1 cut per 3–5s, soft delivery
- **3** = steady, conversational, 1–2 cuts/s, natural pace
- **4** = high-energy, punchy, 2–4 cuts/s, emphatic delivery
- **5** = chaotic, maximum density, 4+ cuts/s, shouty/hype

**`cutsPerSecondBucket`:** `low` (<1/s) / `med` (1–2/s) / `high` (2–4/s) / `extreme` (4+/s)

### 3D. Audio

| Field | Type | Reliability |
|-------|------|-------------|
| `hasSpokenWords` | boolean | High |
| `hasVoiceover` | boolean | High |
| `musicEnergy` | none/low/mid/high | Medium |
| `soundEffectsPresent` | boolean | High |
| `speakingPace` | slow/normal/fast/rapid | Medium |
| `languageDetected` | ISO-639 code | High |
| `hasTrendingMusic` | boolean | **UNRELIABLE — see §4** |

### 3E. Creator Expression & Vibe

| Field | Type | Notes |
|-------|------|-------|
| `creatorExpressedEmotion` | enum(10) | What emotion the creator displays |
| `vibeKeyword` | enum(15) | Overall content vibe — most useful for niche-filtering |

**`creatorExpressedEmotion` enum:** `neutral` / `confident` / `playful` / `seductive` / `intense` / `vulnerable` / `excited` / `deadpan` / `angry` / `joyful` / `unknown`

**`vibeKeyword` enum:** `aspirational` / `relatable` / `educational` / `provocative` / `cozy` / `hype` / `controversial` / `wholesome` / `premium` / `raw_authentic` / `humorous` / `motivational` / `sensual` / `unknown`

### 3F. Caption & CTA

| Field | Type | Notes |
|-------|------|-------|
| `captionHasCTA` | boolean | Is there a call-to-action? |
| `ctaType` | enum(7) | save / comment / share / follow / dm / link_bio / none |
| `captionAddsContext` | boolean | Caption provides info NOT in video |
| `captionRepeatsVideo` | boolean | Caption just restates what's spoken |
| `captionLengthBucket` | short/medium/long | <50ch / 50–150 / >150 |
| `hashtagCount` | number | Total hashtag count in caption |

### 3G. Transcript & Text (kept structured)

| Field | Type |
|-------|------|
| `transcript` | string \| null — verbatim spoken words |
| `onScreenTextFull` | string \| null — all text overlays, `\n` separated |

### 3H. Extraction Metadata (critical for version control)

| Field | Type | Why |
|-------|------|-----|
| `model` | string | Gemini silently updates; need version per row |
| `promptVersion` | string | e.g. `"v2.1"` — when you revise taxonomy, you know which rows used which prompt |
| `confidence` | 1–5 | Gemini self-reports certainty |
| `flags` | string[] | `truncated_at_15mb` / `no_audio` / `low_quality` / `non_english` |
| `analyzedAt` | number | Unix timestamp |
| `videoBytesAnalyzed` | number | Actual bytes sent (after 25MB cap) |

---

## 4. What Gemini CANNOT Reliably Extract (do not ask)

| Field | Why it fails | What to do instead |
|-------|-------------|-------------------|
| Trending audio name | Doesn't know Instagram's audio library | Pull from Apify scrape metadata |
| Exact cuts per second | Under-counts rapid cuts | Use `cutsPerSecondBucket` |
| Exact video length | ~50% accurate — hallucinates | Extract from file container metadata server-side |
| Viewer emotion | Random projection | Don't ask |
| Viral potential score | Circular — you have `outlierRatio` as ground truth | Use `outlierRatio` |
| "Why this will go viral" | Narrative rationalization, zero statistical value | Delete |
| Volume percentages | Cannot measure audio levels | Human judgment |
| CapCut effect names | Doesn't know specific app affordances | Human brief |
| Creator intent | Subjective, adds noise | Drop |
| Brand safety nuance | Flash-Lite unreliable here | Dedicated moderation API |

---

## 5. Infrastructure Changes Required

### 5A. Model upgrade: Flash, not Flash-Lite

Current code uses `google/gemini-2.0-flash-lite-001` (`src/app/api/intelligence/analyze/route.ts:4`).

**Upgrade to `google/gemini-2.0-flash-001`.**

| | Flash-Lite | Flash |
|--|------------|-------|
| Cost at 10k reels | ~$20 | ~$60 |
| Pacing/vibe reliability | ~60% | ~85% |
| Format classification | ~70% | ~90% |
| Talking head vs voiceover | ~75% | ~92% |

$40 difference. Non-negotiable upgrade.

### 5B. Response format: `json_schema` not `json_object`

Current code: `response_format: { type: 'json_object' }` (`route.ts:101`)  
This only enforces "valid JSON". Enum values drift. Fields get omitted.

Use: `response_format: { type: 'json_schema', json_schema: { schema: { ... } } }`  
This enforces every enum value and required field. Single biggest reliability fix.

### 5C. Bump `max_tokens` from 800 to 2000

Current: `max_tokens: 800` (`route.ts:102`)  
The new 45-field schema needs ~1400–1800 output tokens. 800 silently truncates.

### 5D. Add `"unknown"` escape to every enum

If you force Gemini to pick from 14 format options with no escape, it confidently mislabels. With `"unknown"` available, it uses it ~5–10% of the time on genuinely ambiguous videos. Those rows get excluded from that axis's aggregation. Difference: 85% → 97% precision on categorical fields.

### 5E. New `postAnalyses` table (separate from `scrapedPosts`)

**Do NOT add to `scrapedPosts.aiAnalysis`.** Reason:

1. Convex cannot index nested object fields — all aggregation queries become full `.collect()` at 10k = 30MB heap per invocation
2. You will re-analyze with newer prompt versions — a separate table lets you keep history
3. Analytics queries don't need full post metadata — separating enables single-table aggregation

**Denormalize outcome metrics onto `postAnalyses`:**  
Store `outlierRatio`, `engagementRate`, `views`, `saves`, `niche`, `handle`, `contentType`, `postedAt` directly on the analysis row at write time. This makes all rule-discovery queries single-table.

**Required indexes:**
```
by_niche_format    ["niche", "formatPrimary"]
by_niche_hook      ["niche", "hookStructure"]
by_format_energy   ["formatPrimary", "energyLevel"]
by_hook_outlier    ["hookStructure"]         -- for cross-niche rules
by_prompt_version  ["promptVersion"]         -- for version isolation
by_post_id         ["postId"]               -- join back to scrapedPosts
```

---

## 6. Statistical Analytics Layer

### 6A. The Rule Discovery Query (flagship)

For every single-field and two-field combination of categorical features, compute:

- `support` — count of rows matching this feature combination
- `avgOutlier` — mean outlierRatio for matching rows
- `avgER` — mean engagementRate
- `avgSaves` — mean saves
- `lift` — `avgOutlier / globalAvgOutlier` within niche

Return rules where `support >= 20` (statistically meaningful) and `lift >= 1.5` (meaningfully above average), sorted by `lift × log(support)` (balances magnitude with reliability).

**Example outputs:**
```
niche=Fitness + hookStructure=negation                 → avgOutlier=4.1×, lift=2.3, n=58
niche=Fitness + formatPrimary=talking_head             → avgOutlier=3.8×, lift=2.1, n=43
niche=GFE + energyLevel=5 + hasJumpCuts=true          → avgOutlier=4.2×, lift=2.8, n=67
niche=Lifestyle + ctaType=save + vibeKeyword=relatable → avgOutlier=3.1×, lift=1.9, n=34
```

**This query is the product.** Everything else is infrastructure to make it fast.

**Precompute nightly** into a `computedRules` table via a Convex scheduled action. Real-time rule queries at n=10k are not feasible in-memory.

### 6B. Niche × Format Performance Matrix

2D matrix: rows = niches, columns = format types, cells = `{count, avgOutlier, avgER, medianSaves}`.

The chart Shaan will stare at most.

### 6C. Hook Structure Leaderboard per Niche

For a given niche, rank all `hookStructure` values by `avgOutlier` where `support >= 10`. Include top 3 example posts per structure as reference.

### 6D. Energy-Level Curve per Niche

Group by `energyLevel` (1–5), compute `avgOutlier`, `avgSaves`, `avgER`.

Hypothesis to test: Fitness niche peaks at energyLevel=4; Lifestyle peaks at 2–3; GFE peaks at 3 (intimate, not chaotic).

### 6E. CTA Effectiveness by Niche

Compare `ctaType` values (save vs comment vs none etc.), grouped by niche. Return lift specifically on **saves**, since saves = intent to return = highest-value signal.

Answers: "does 'save this for later' actually drive saves, and does it vary by niche?"

### 6F. Hook Duration Sweet Spot

Bucket `hookDurationSec` into 0–1s, 1–1.5s, 1.5–2s, 2–3s, 3s+. Show `avgOutlier` by bucket.

Tests the content industry folklore: "hook must land by 1.2s".

### 6G. Statistical Confidence on Rules

For any candidate rule, return:
- Sample size `n`
- Mean outlier ± standard deviation
- 95% confidence interval: `mean ± 1.96 × std / sqrt(n)`
- T-test p-value against the global niche mean

Rules with `n < 20` or `p > 0.05` go in a "weak signal" bucket, not the production rule list. **Non-negotiable at research scale.** Without this, you're finding noise in small samples and calling it a rule.

---

## 7. Gemini Reliability Reference

| Capability | Flash-Lite | Flash | Mitigation |
|------------|------------|-------|-----------|
| Transcribing clear speech | 90% | 95% | Acceptable |
| Transcribing noisy/accented/fast speech | 70% | 82% | Flag `confidence<=3` |
| Detecting on-screen text | 85% | 92% | Ask verbatim |
| Counting scene cuts precisely | 60% | 70% | **Use buckets only** |
| Identifying talking_head vs voiceover | 90% | 95% | Reliable |
| Distinguishing lipsync vs talking_head | 70% | 85% | Add `_evidence` field |
| Reading creator emotion (closed enum) | 75% | 87% | Use `"unknown"` escape |
| Reading viewer emotion | ~random | ~random | **Do not ask** |
| Identifying trending audio | ~random | ~random | **Do not ask** |
| Estimating video length | 50% | 55% | **Get from file metadata** |
| Judging production quality | 60% | 72% | Use 3-point scale only |
| Categorising niche-specific vibes | 65% | 80% | Closed vocab + niche-conditional prompt |

---

## 8. Accuracy Risks at 10k Scale

### Risk 1: Model drift
Flash silently updates. Outputs vary slightly over multi-day runs. Always store `extraction.model` exactly as returned in API headers. Bucket analyses by model version for cross-run comparisons.

### Risk 2: JSON parse failures
With a 45-field schema, expect ~1–3% parse failures even with `json_schema` mode. Current code returns 502 with no retry (`route.ts:117`). Need retry-with-repair-prompt pattern or you lose 100–300 rows per 10k run.

### Risk 3: 25MB video truncation
Normal reels are 3–8MB. 4K or 60s reels hit 20–30MB. Expect ~5–10% truncation at current 25MB cap. Set `"truncated_at_25mb"` flag on those rows and exclude from pacing/format analysis. Better long-term: pre-downsample to 720p/30fps before Gemini — guarantees <10MB and saves cost.

### Risk 4: Prompt version drift invalidating comparisons
When you revise the taxonomy (and you will), rows analysed with v1 and v2 prompts are not comparable. Store `promptVersion` on every row and filter by it in aggregation queries. Do not mix versions in the same rule calculation.

---

## 9. `.collect()` Performance Bomb

Current `convex/intelligence.ts` has 11+ `.collect()` calls that work fine at 500 posts but will throttle at 10k (~30MB heap per invocation).

**Fix strategy:**
1. Analytics queries → precompute into `computedRules` / `nicheFormatMatrix` tables via scheduled action every 1–6 hours
2. Filtered reads → use indexes on `postAnalyses` (`withIndex("by_niche", ...)`) not `.collect().filter()`
3. Feed UI → always use `.take(N)` on indexed queries, never collect-then-slice
4. Stats widgets → cache-compute into `intelligenceCache` table nightly

---

## 10. Implementation Sequence

Do these in order. Do not skip steps.

| Day | Task |
|-----|------|
| **Day 1** | **Taxonomy lock-in.** Run the prompt on 20 videos you've personally watched. Manually verify each field. Revise enums. Run 20 more. Lock. |
| **Day 1** | **New `postAnalyses` table** in `convex/schema.ts` with flattened fields, compound indexes, denormalized outcome metrics. Push with `npx convex dev --once`. |
| **Day 2** | **New `/api/intelligence/analyze-v2` route** — `json_schema` format, Flash (not Lite), `max_tokens: 2000`, two-pass for `formatPrimary` + `hookStructure`. Keep old route alive. |
| **Day 2** | **Audit 100 posts.** Manually score 20 of them. Accept ≥85% agreement before scaling. |
| **Day 3** | **Backfill in batches of 500.** Monitor cost, parse-failure rate, average latency. Log to `agentDebugLogs`. |
| **Day 3** | **Rule miner scheduled action** — nightly Convex action that populates `computedRules` with (feature-combo, support, avgOutlier, lift, p-value). |
| **Day 4** | **Rule discovery UI** — reads `computedRules`, filters by niche, shows top 50 rules sorted by lift × log(support). This is the actual deliverable. |
| **Day 5** | **Scale to 10k** with retry-on-parse-failure and cost budgeting. Use `run_in_background`. |
| **Day 6** | **Retire legacy.** Migrate `getHookStats`, `getAnalysedPosts` queries to read from `postAnalyses`. Deprecate `scrapedPosts.aiAnalysis`. |

---

## 11. Cost Estimate (10,000 reels)

| Component | Cost |
|-----------|------|
| Gemini Flash input (~4k tokens/video) | ~$8 |
| Gemini Flash output (~1600 tokens/video) | ~$52 |
| R2 storage (10k videos avg 5MB) | ~$0.75/month |
| Convex compute (10k mutations + queries) | ~$5 |
| **Total first run** | **~$66** |
| Re-analysis after prompt revision (partial, ~2k videos) | ~$13 |

---

## 12. Key Files

| File | Role |
|------|------|
| `src/app/api/intelligence/analyze/route.ts` | Current analyze endpoint — needs v2 |
| `convex/schema.ts:263-322` | `scrapedPosts` with legacy `aiAnalysis` |
| `convex/intelligence.ts:157-180` | `patchAnalysis` mutation — writes legacy shape |
| `convex/intelligence.ts:1012-1053` | `getAnalysedPosts` — reads legacy `aiAnalysis` |
| `convex/intelligence.ts:1213-1269` | `getHookStats` — demonstrates open-vocab aggregation failure |
| `convex/intelligenceNode.ts` | Video download to R2 — the step before analysis |

---

## 13. The Production Rule Format

Final output of the pipeline — a structured rule card:

```json
{
  "rule": {
    "niche": "Fitness",
    "features": {
      "formatPrimary": "talking_head",
      "hookStructure": "negation",
      "energyLevel": 4
    }
  },
  "stats": {
    "support": 58,
    "avgOutlierRatio": 4.1,
    "avgEngagementRate": 0.062,
    "avgSaves": 2340,
    "lift": 2.3,
    "pValue": 0.003,
    "confidenceInterval": [3.6, 4.6]
  },
  "examplePosts": ["postId_1", "postId_2", "postId_3"],
  "promptVersion": "v2.1",
  "computedAt": 1775701539027
}
```

This rule says: **in the Fitness niche, talking-head videos with a negation hook at high energy outperform the average by 2.3× — proven across 58 examples with p=0.003.**

That's what the whole pipeline builds toward.
