---
name: ISSO Nav Architecture — Confirmed Decisions
description: What goes in sidebar vs white card pills vs persistent pages for the ISSO dashboard nav
type: project
---

## Confirmed as of Apr 6 2026

### Sidebar contains:
- 5 product icons (Hub, Intelligence, Recon, Agents, Content Gen)
- Persistent pages listed below
- NO product sub-pages in sidebar

### Sub-page pills:
- Live at TOP of white card content area (NOT in sidebar)
- Change based on which product icon is active
- Each pill navigates to a separate route

### Confirmed persistent sidebar pages (always visible, not inside any product):
- Team
- Analytics
- Models
- Schedule

### In avatar popup (not sidebar):
- Settings

---

## The Full Pipeline (confirmed Apr 6 2026)

```
Recon (scrape) → Intelligence (analyze) → Hub (human rates + approves) → Content Gen (generate) → Hub (approve output) → Schedule/Publish → Analytics
```

Swipe ratings from Hub feed back into Intelligence to sharpen future analysis and generation.

---

## 5 Product Icons — Confirmed Sub-pages

### 1. Hub — human interaction layer
Where people touch content (approve, rate, curate).

| Tab | What it is |
|---|---|
| Overview | KPIs, activity feed, quick actions |
| Approvals | Approve/reject generated content before publishing |
| Swipe & Rate | Top 100 scraped reels — manager or model swipes to train the system |

**Key insight:** Generated content from Content Gen flows INTO Hub Approvals once generation completes. Hub is the approval gate, not Content Gen.

---

### 2. Intelligence — what the data says
Takes Recon's raw scrapes and surfaces meaning.

| Tab | What it is |
|---|---|
| Trends | What's performing, what's rising across tracked accounts |
| Analysis | AI breakdown of why content works (hooks, formats, pacing, timing) |
| Insights | Learnings fed back from swipe ratings + post-publish performance |

---

### 3. Recon — data collection engine
Runs 24/7 in background.

| Tab | What it is |
|---|---|
| Competitors | Who's being tracked, last-scraped timestamp |
| Scraping Log | Activity timeline, errors, status |
| Leaderboard | Top content by engagement across all tracked accounts |

---

### 4. Agents — automation dashboard
Visibility into what's running behind the scenes.

| Tab | What it is |
|---|---|
| Activity | What agents are doing right now |
| Reports | Batch results, quality metrics, completed work |
| Requests | Submit a custom task, track 72hr SLA |

---

### 5. Content Gen (Briefs) — production pipeline
FLUX face transfer → Kling/Higgsfield → review in Hub.

| Tab | What it is |
|---|---|
| Generate | Pick model, style, source reel → trigger generation |
| Queue | Batches in progress + generation history |

**Note:** Once generated, content moves to Hub Approvals for human review. No gallery tab here.

---

## Models Dashboard (separate — confirmed Apr 6 2026)

Models get their own separate, simpler dashboard. NOT the same app as the agency dashboard.
- Simple interface
- Can swipe & rate reels (connects to Hub's swipe training data)
- Basic content visibility
- Scope TBD — design separately from main 5-icon structure

---

## Open Questions (still to resolve)

1. **Delivery mechanism** — after Hub Approvals, where does content go? Drive only, or direct publish to TikTok/Instagram? Publish step may live in Schedule or Hub.
2. **Models dashboard scope** — what exactly do models see vs. managers?
3. **Missing features** — research in progress (parallel agents running Apr 6 2026)
4. **Swipe & Rate UX** — Tinder-style swipe or a grid rating system?
