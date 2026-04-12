---
name: ISSO Feature Research Synthesis — Apr 6 2026
description: Competitive research findings and missing features across all 5 product icons, synthesized from 3 parallel research agents
type: project
---

## Research Coverage
- **Agent 1:** Recon + Intelligence gaps (Foreplay, Pentos, Iconosquare, BigSpy, TrendTok, Sprout Social)
- **Agent 2:** OFM agency tool gaps (Supercreator, Infloww, Virlo, Xcelerator, FansMetric, Fanfix)
- **Agent 3:** Content gen pipeline gaps (HeyGen, Opus Clip, Captions.ai, Later, Buffer, Planoly)

---

## Key Overarching Gaps

1. **Recon scrapes but doesn't surface what accounts are posting** — no top posts grid, no hook leaderboard, no format breakdown per competitor
2. **No rating signal anywhere in the market** — Foreplay saves reels but has zero rating/thumbs system. ISSO's swipe-to-rate is genuinely novel
3. **No research → generation feedback loop** — "One-click turn into brief" from any Intelligence card is missing everywhere
4. **Approval chains exist in scheduling tools but not AI gen tools** — structured rejection codes, SLA timers, role-based approval lanes all missing from gen pipeline tools
5. **OFM revenue/fan KPIs entirely absent from the pipeline** — fan LTV, expiring subscribers, content-to-PPV attribution are the north-star metrics for OFM agencies

---

## Missing Features by Product Icon

### Hub (human interaction layer)

| Feature | Why it matters | Priority |
|---|---|---|
| Structured rejection reason codes | When a manager rejects generated content, require a reason tag (wrong face, motion artifact, off-brand). Feeds back into AI training. No tool does this. | MVP |
| Per-platform preview at approval stage | Show how video renders on OF/TikTok/IG (aspect ratio, caption truncation) during approval, not just at schedule time | MVP |
| Swipe session history + rating audit log | Record every swipe decision with timestamp + rater ID. Lets you audit training data quality and remove biased ratings | MVP |
| QA checkpoint before schedule | Explicit second-reviewer step between "Approved" and "Scheduled" for policy compliance check | Phase 2 |
| Side-by-side A/B comparison in approval queue | Show two variants side-by-side so approver picks the better one | Phase 2 |
| Approval SLA timer with escalation | Auto-escalate to secondary reviewer if content not reviewed within X hours | Phase 2 |
| Two-track approval: creative vs. compliance | Separate approval lanes for aesthetic quality vs. platform policy — critical for OFM | Phase 2 |
| Batch re-use suggestions | Surface older high-performing assets flagged as "repostable" based on last post date vs. engagement | Phase 2 |
| Hard-negative training set | Mark content as "never generate like this" — not just a low rating. Tightens output quality for OFM | Phase 2 |
| Revenue-per-model summary card | Monthly revenue, 90-day LTV, chatter conversion rate visible on Hub home screen | Future |
| Expiring subscriber queue | Real-time list of fans expiring in 24-72h, triggering one-click winback campaigns | Future |
| Fan score display | Numerical score per subscriber based on spend + engagement so chatters prioritize high-value fans | Future |
| Chatter script library | Library of approved message scripts (welcome, winback, PPV pitch) accessible during chat sessions | Future |

---

### Intelligence (what the data says)

| Feature | Why it matters | Priority |
|---|---|---|
| Hook leaderboard | Ranked list of first 1-3 seconds from top-performing posts across all tracked accounts. Foreplay's most-used feature. | MVP |
| Cross-account pattern detection | AI groups posts across all accounts by theme ("3 of 8 competitors posted POV outdoor content this week, 2.1x normal ER") | MVP |
| One-click "turn into brief" | From any Intelligence card, push content (handle, hook text, format, audio) into Content Gen as a brief template | MVP |
| Outlier alert feed | Feed that flags competitor videos massively outperforming their baseline — focus on genuine signals not average content | MVP |
| Trending audio tracker | Which audio tracks are gaining momentum with velocity score (24h vs. 7-day average) | Phase 2 |
| Saved search with alert | Save a query (e.g. "GFE + mirror + morning") and get notified when new matching posts appear | Phase 2 |
| Niche trend leaderboard | Weekly top-10 content themes outperforming baseline across all accounts in a niche | Phase 2 |
| Engagement rate benchmarking | Show each account's ER vs. niche median — 5.2% means nothing without context | Phase 2 |
| "Inspired by" on generated content | When AI generates content, surface which swipe-rated reels influenced the style | Phase 2 |
| Traffic source → subscription attribution | Which TikTok/IG reel drove which subscription — connects scraping layer to revenue | Future |
| Content-to-PPV sale attribution | Which specific content asset generated which PPV purchase | Future |

---

### Recon (data collection engine)

| Feature | Why it matters | Priority |
|---|---|---|
| Top posts grid per competitor | Click into competitor card → see their top 9 posts ranked by views. Currently "View Content" goes nowhere | MVP |
| Viral velocity alert | In-app notification when tracked account posts something hitting 2x their 30-day average ER in first 6 hours | MVP |
| Scrape failure recovery queue | Inline error reason (rate limit, account private) + one-click retry + auto-retry schedule | MVP |
| Content-type breakdown per competitor | % of posts that are talking-head / B-roll / POV / mirror / outfit / lifestyle. Know if ER spike was a format shift | Phase 2 |
| Posting cadence heatmap | 7-day x 24-hour grid showing when competitors post + when posts get most engagement | Phase 2 |
| Competitor growth rate timeline | Follower count over 30/60/90 days — not just current snapshot | Phase 2 |
| Content velocity score | How fast is this account publishing now vs. historical baseline — sudden frequency doubles are signals | Phase 2 |
| Webhook / alert push | Slack or Discord notification when Recon detects trending sound/hook/format crossing view-velocity threshold | Future |

---

### Agents (automation dashboard)

| Feature | Why it matters | Priority |
|---|---|---|
| Content request form per creator | Lightweight form where creator/manager submits source footage into pipeline without needing dashboard access | Phase 2 |
| Creator onboarding checklist | Structured task list when new model added (face-transfer refs uploaded, Drive linked, pipeline tested, first batch scheduled) | Phase 2 |
| Chatter performance leaderboard | Per-chatter revenue, conversion rate, message count — spot underperformers without digging into logs | Future |

---

### Content Gen (production pipeline)

| Feature | Why it matters | Priority |
|---|---|---|
| Per-job ETA with model-aware estimates | Show estimated completion time before AND during generation (FLUX: ~Xs, Kling: ~Xm) — no tool does this | MVP |
| Delivery receipt | "Confirmed received" or "uploaded to platform" status per Drive asset. Without this, delivery silently fails | MVP |
| Generation failure with specific reason + retry | Surface failure reason (bad face transfer, motion artifact, timeout) with one-click retry. No tool does failure granularity | MVP |
| Batch from single face reference | Fire N simultaneous variants (different scenes, outfits) from one face upload | Phase 2 |
| Parallel job capacity indicator | Show how many generation slots are active and when next slot opens | Phase 2 |
| Frame-level annotation on rejected clips | Mark a specific second ("face looks wrong at 0:04") — artifacts in Kling/Higgsfield are time-local not clip-level | Phase 2 |
| Content expiry + auto re-queue | If scheduled post misses publish window, auto re-queue for next slot rather than silent fail | Future |

---

## Genuinely Novel ISSO Features (whitespace in market)

These don't exist in any competitor — they're ISSO differentiators:

1. **Swipe-to-rate with structured WHY tags** — pairs rating with style dimension tags (hook style, pacing, visual aesthetic, audio). Turns ratings into labeled training data, not just a watchlist. Foreplay has zero rating signal.
2. **Hard-negative training set** — explicit "never generate like this" signals. Most AI preference systems learn from positive only.
3. **Research → generation feedback loop** — "Inspired by" showing which rated reels influenced generated content, closing the loop.
4. **Structured rejection codes** — rejection data feeding directly back into AI training. No approval tool does this.

---

## Priority Tiers Summary

### Build at MVP
- Hub: Structured rejection codes, per-platform preview, swipe session history
- Intelligence: Hook leaderboard, cross-account pattern detection, one-click "turn into brief", outlier alert feed
- Recon: Top posts grid per competitor, viral velocity alert, scrape failure recovery queue
- Content Gen: Per-job ETA, delivery receipt, generation failure with retry

### Phase 2
- Intelligence: Trending audio tracker, saved search + alert, "inspired by" on generated content
- Recon: Content-type breakdown, posting cadence heatmap, competitor growth timeline
- Hub: QA checkpoint, side-by-side A/B, approval SLA, hard-negative training set
- Content Gen: Batch from single face ref, frame-level annotation

### Future / OFM Revenue Layer
- Fan score, expiring subscriber queue, revenue-per-model card, content-to-PPV attribution, chatter leaderboard
