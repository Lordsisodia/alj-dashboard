# Requests Pill — ISSO Dashboard Agents Feature

The Requests pill is the third tab inside `/isso/agents`. It is a live feature-request tracker: Shaan submits requests, the ISSO team processes them, and the dashboard reflects the current state in real time via Convex.

---

## Architecture

```
/isso/agents  (route)
  └── AgentsFeaturePage
        └── tab: "Requests"
              └── RequestsView          ← orchestrator, Convex state
                    ├── RequestForm     ← animated form, owns its own field state
                    ├── FilterBar       ← filter pills with live counts
                    └── RequestCard     ← per-request card
```

### File map

| File | Responsibility | Lines |
|------|---------------|-------|
| `lib.ts` | Shared types, constants, SLA utilities | ~60 |
| `RequestForm.tsx` | Animated new-request form | ~95 |
| `FilterBar.tsx` | Filter pills with counts | ~25 |
| `RequestCard.tsx` | Individual request card | ~90 |
| `RequestsView.tsx` | Convex hooks + layout composition | ~95 |
| `index.ts` | Public exports | 2 |

---

## Convex Backend

### Table: `featureRequests`

| Field | Type | Notes |
|-------|------|-------|
| `title` | string | Request headline |
| `description` | string | Full description |
| `requestedBy` | string | Always `"Shaan S."` for now |
| `submittedAt` | number | Unix ms — used for SLA countdown |
| `status` | `Queued \| In Progress \| Delivered` | Lifecycle stage |
| `eta` | string | Human-readable deadline or `"72hr SLA"` |
| `priority` | `Low \| Medium \| High` | Set at submission |

Index: `by_submitted` on `submittedAt` — list query returns newest first.

### Convex functions (via `api.agents.*`)

| Function | Type | Description |
|----------|------|-------------|
| `getFeatureRequests` | query | Fetch all requests newest-first |
| `submitRequest` | mutation | Create a new Queued request |
| `seedAgents` | mutation | Idempotent seed — runs once on first empty load |

> The table is also directly accessible via `api.featureRequests.{list,create,seed}` (standalone module).

---

## Features

### Implemented

- **Live data** — `useQuery(api.agents.getFeatureRequests)` streams updates in real time; no manual refresh needed
- **New request form** — slides in/out with Framer Motion; captures title, description, and priority; disabled submit until title is non-empty
- **Priority segmented control** — Low / Medium / High; pink-purple gradient highlight on selected option
- **Priority border** — left 3px colored border on each card (green=Low, amber=Medium, pink=High) — first-principles urgency scan as you scroll the list
- **Status badge with icon** — Queued: clock · In Progress: pulsing dot · Delivered: checkmark
- **72hr SLA countdown** — Queued cards show live hours remaining computed from `submittedAt`; amber → orange (<24h) → red (overdue)
- **Filter pills with counts** — All / Queued / In Progress / Delivered; gradient highlight on active; counts update live
- **Stats header** — "N requests · N queued" summary above filters
- **Loading skeletons** — 3 placeholder cards while Convex loads
- **Empty state** — per-filter message with inbox icon
- **Delivered de-emphasis** — Delivered cards at 82% opacity, no hover lift; resolved work recedes visually
- **Auto-seed** — demo data seeded once on first empty load (idempotent server-side check)

### Design tokens

| Token | Value |
|-------|-------|
| Primary gradient | `linear-gradient(135deg, #ff0069, #833ab4)` |
| Priority Low | `#4a8a2d` (green) |
| Priority Medium | `#92640a` (amber) |
| Priority High | `#c0005a` (pink) |
| SLA normal | `#92640a` amber |
| SLA urgent (<24h) | `#ea580c` orange |
| SLA overdue | `#dc2626` red |

---

## Data Flow

```
User submits form
  → RequestForm.onSubmit(title, desc, priority)
  → RequestsView.handleSubmit()
  → useMutation(api.agents.submitRequest)
  → Convex inserts { status: "Queued", submittedAt: Date.now(), eta: "72hr SLA", ... }
  → useQuery(api.agents.getFeatureRequests) re-renders automatically
  → New card appears at top of list with SLA countdown
```

```
Page loads (first time, empty table)
  → useQuery returns []
  → useEffect fires seedAgents() once (ref guard prevents repeat)
  → Convex inserts 4 demo requests
  → useQuery re-renders with seeded data
```

---

## Future Feature Pipeline

### Near-term (high value, low effort)

- **Status updates from ISSO team** — add an `updateStatus` mutation; let admins move cards from Queued → In Progress → Delivered with an optional note
- **ETA field on submission** — let Shaan optionally set a desired-by date; surface as a separate "Requested by" date vs. ISSO's ETA
- **Upvote / vote weight** — when multiple team members can submit, aggregate votes on shared requests to prioritise the backlog
- **Comment thread** — lightweight per-request comments (title + body mutation) for ISSO → Shaan async comms without leaving the dashboard

### Medium-term

- **Status change notifications** — Convex scheduled function or webhook that fires a Telegram/Slack message when a request moves to In Progress or Delivered
- **Request search** — full-text search across title + description; Convex `searchIndex` already in schema pattern, straightforward to add
- **Bulk status update** — checkbox multi-select + batch mutation for triage sessions
- **Priority escalation rule** — auto-escalate Medium → High if SLA is breached; a scheduled Convex function checks `submittedAt + 72h < now` and patches priority
- **Attach screenshot / reference** — file URL field on the request; store Cloudflare R2 URL; render thumbnail in the card footer

### Longer-term

- **Public roadmap view** — read-only shareable link that shows Delivered and In Progress items (board-sharing pattern, already a delivered request in seed data)
- **Changelog integration** — when status moves to Delivered, auto-generate a changelog entry in a `releases` Convex table and surface in a fourth Changelog pill
- **AI triage assist** — on form submission, call Claude to suggest a priority level and find duplicate requests, surfacing them before the user submits
- **Analytics tab** — average time Queued → In Progress, average time to Delivered, SLA breach rate over time — all computable from `submittedAt` + status transition timestamps
