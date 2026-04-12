# Screen 04 — Model Dashboard

**Route:** `/models`  
**File:** `src/app/models/page.tsx` (206 lines)

---

## What it does

A per-model view of all active content ideas/briefs in the pipeline. This is where the agency tracks what each model is currently filming, what's been sent back, and what's complete.

This screen is the **middle of the content funnel** — ideas land here from the Ideas screen and move through filming statuses until clips are received.

---

## Layout

### Top stats bar (3 cards)
- Total Ideas (across all models)
- Active Now (status: sent / in_progress / clips_received)
- Completed

### 2-column grid

**Left col (2/5) — Model list**

Scrollable list of model cards. Each card shows:
- Avatar (initials + gradient colour by niche)
- Model name
- Niche · Instagram handle
- Active count badge (e.g. "2 active")
- Done count (green checkmark)
- In Progress count (amber clock)
- Arrow chevron

Click a model to select and load their ideas in the right panel.

**Right col (3/5) — Selected model's ideas**

Header shows selected model's name, niche, handle, and an "IG Profile" external link button.

Each idea shown as a row card:
- Hook text (the opening POV line)
- Status badge + Niche pill + Campaign pill
- Numbered filming steps (up to 3 visible)
- Caption suggestion (italic)

**Status flow:**
```
draft → sent → in_progress → clips_received → complete
```

Status colours:
- Draft: grey
- Sent to Model: amber
- Filming: purple
- Clips Back: pink
- Complete: green

Empty state: "No ideas assigned yet — send ideas from Idea Generation to see them here"

---

## Data needed (Convex)

```ts
// models table
{
  name: string,
  niche: "GFE" | "Fitness" | "Meme" | "Thirst Trap" | "Lifestyle",
  igHandle: string,
  ofHandle?: string,
  avatarColor: string,
  active: boolean,
}

// ideas table (same as /ideas screen)
// Filter by modelId to show per-model view
// ideas.getByModel(modelId) → Idea[]

// Convex mutation:
// ideas.updateStatus(ideaId, status) → updates filming status
```

---

## OFM adaptations

| Reference | ISSO |
|---|---|
| "IG Profile" external link | "OF Profile" external link (OnlyFans handle) |
| Status: "Sent to Model" (implies IG workflow) | Status: "Sent to Model" — same, applies to OFM |
| Model niche shown | Model niche shown — already OFM niches |
| Instagram handle displayed | OnlyFans handle (+ optionally IG handle) |

---

## Workflow context

```
Ideas screen          Models screen         Content screen
[Generate Brief] → [Sent to Model] → [Model films] → [Clips Received] → [Upload to Pipeline]
```

When status reaches `clips_received`, the VA should go to the Content screen to upload and enhance the clips.

---

## Open questions

- OPEN: How does status actually get updated? Does the agency manually change it, or does the model confirm via some mechanism (Telegram bot, form, etc.)?
- OPEN: Should models have a lightweight read-only view (separate login) to see their assigned briefs?
- ASSUMED: Status is manually updated by VA or admin in this dashboard.
