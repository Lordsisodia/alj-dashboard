# Screen 10 — Dashboard Home

**Route:** `/`  
**File:** `src/app/page.tsx` (reference has a marketing landing page here — NEEDS FULL REDESIGN)

---

## What it does

The reference app's homepage is a marketing landing page (Hero, SocialProof, HowItWorks, etc.) — **not a dashboard home**. For ISSO this becomes the command centre: a daily at-a-glance view of everything happening across all models.

This is what the agency owner sees first thing every morning.

---

## Purpose

Answer these questions at a glance:
1. What needs my attention right now? (approvals, blocked ideas)
2. How are my models performing this week?
3. What's going out today?
4. Where is each model in the content pipeline?

---

## Proposed layout

### Header
- "Good morning, Alex" + date
- Quick-action buttons: "+ New Idea" / "Upload Clips" / "Review Approvals"
- Notification bell

### Attention row — "Needs Action" (top priority)
3 alert cards for items requiring immediate attention:
- Pending Approvals: "3 items waiting review" → links to /approvals
- Ideas Ready to Send: "2 briefs ready" → links to /ideas
- Models Awaiting Brief: "1 model has nothing assigned" → links to /models

### KPI strip (4 stat cards)
- Total Active Models
- Posts This Week (across all accounts)
- Pending Approvals count
- Ideas in Pipeline count

All with animated number counters.

### 2-column main section

**Left (3/5) — Model Pipeline Status**

Each model as a horizontal pipeline row:
```
[Avatar] Tyler    [Ideas: 2] → [Filming] → [Clips: 0] → [Edit: 1] → [Approval: 1] → [Live: 8]
[Avatar] Ren      [Ideas: 1] → [Brief Sent] → [Clips: 2] → [Edit: 0] → [Approval: 0] → [Live: 5]
[Avatar] Ella     [Ideas: 0] → [No brief]  → ...
```

Click a model row → navigates to /models filtered to that model.

**Right (2/5) — Today's Schedule**

Mini calendar strip: today's posts going out
- Time + content type + account
- Status: Scheduled / Live / Failed
- Empty state: "Nothing scheduled today"

Below that: **Recent Activity feed** (last 5 items from activity log)
```
Mikee approved @abg.ricebunny reel      2h ago
Yssa uploaded 3 clips                   4h ago
Alex generated 2 new briefs             5h ago
```

### Bottom — Performance Snapshot

Compact multi-model analytics strip:
- Each active model: avatar, handle, key metric (subscribers/views/engagement this week)
- Sparkline mini chart per model (7-day trend)
- Click → navigates to /analytics for that model

---

## Data needed (Convex)

```ts
// Queries needed for home screen:
// approvals.countPending() → number
// ideas.countReady() → number
// models.listWithPipelineStatus() → ModelWithStatus[]
// schedule.getToday() → ScheduledPost[]
// activity.getRecent(limit: 5) → ActivityItem[]
// analytics.getWeeklySummary(modelIds) → ModelSummary[]

// ModelWithStatus shape:
{
  modelId: string,
  name: string,
  ideasCount: number,
  filmingStatus: string,
  clipsReceived: number,
  inEditing: number,
  pendingApproval: number,
  liveThisMonth: number,
}
```

---

## OFM adaptations

This screen is **built from scratch** — the reference has no equivalent. Design decisions:

| Design choice | Rationale |
|---|---|
| Pipeline status per model | Core OFM workflow — ideas → filming → editing → live |
| "Needs Action" alerts | Agency owners are busy — surface blockers immediately |
| Today's schedule | Quick daily briefing without going to /schedule |
| Multi-model performance strip | Agency manages 4+ accounts — needs cross-model view |

---

## Key design details (consistent with other screens)

- Wave/3D background from SISO partnership UI (from isso-dashboard)
- Cards using `electric-card` or `card-5` components
- Animated number counters on KPI strip
- Fade-up scroll animations on section entry
- Pink/purple/dark colour system from reference app
- Same sidebar shell as all other screens

---

## MVP vs Phase 2

**MVP (ship first):**
- Attention row (pending approvals, ready ideas)
- KPI stat cards
- Model pipeline status table

**Phase 2:**
- Performance snapshot with sparklines
- Today's schedule mini-view
- Personalised greeting with date

---

## Open questions

- OPEN: Should the home screen be filtered to a specific model (sidebar account switcher) or always show all models?
- ASSUMED: Home is always aggregate — shows all models. Individual model views are on /analytics and /models.
- OPEN: Are sparkline charts worth adding at MVP? They require storing daily time-series data per model.
