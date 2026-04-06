# Agents Feature — ISSO Dashboard

> Icon ⌘5 · Three pills: Activity (①), Reports (②), Requests (③) · Connects to Convex real-time DB

---

## Overview

The Agents feature is the operational nerve centre of the ISSO dashboard. It lets agency operators observe AI agent activity in real-time, review generated intelligence reports, and submit build requests to the SISO team — all backed by a live Convex database with optimistic updates and auto-seeding.

---

## Directory Structure

```
src/features/agents/
├── README.md                     ← this file
├── types.ts                      ← shared TypeScript interfaces
├── constants/
│   ├── index.ts                  ← barrel export
│   ├── styles.ts                 ← colors, animation variants
│   └── mock-data.ts              ← fallback/seed data (used while Convex loads)
├── hooks/
│   └── index.ts                  ← useAgentTasks(), useReports()
└── components/
    ├── AgentsFeaturePage.tsx     ← page orchestrator
    ├── activity/
    │   ├── index.ts
    │   ├── ActivityView.tsx      ← filter + grid layout
    │   └── ActivityCard.tsx      ← single agent task card
    ├── reports/
    │   ├── index.ts
    │   ├── ReportsView.tsx       ← filter chips + Convex-backed list
    │   ├── ReportCard.tsx        ← collapsible report card
    │   └── ReportCardExpanded.tsx ← accordion expanded section
    └── requests/
        ├── index.ts
        ├── RequestsView.tsx      ← filter tabs + Convex-backed list
        ├── RequestCard.tsx       ← request card with status pipeline
        └── RequestForm.tsx       ← animated new-request form
```

---

## Convex Schema

Three tables in `convex/schema.ts`:

| Table | Key Fields | Indexes |
|-------|-----------|---------|
| `agentRuns` | `agentName`, `type`, `status`, `startedAt`, `progress`, `outputPreview` | `by_status`, `by_started_at` |
| `agentReports` | `title`, `category`, `insights[]`, `generatedBy`, `generatedAt` | `by_generated_at`, `by_category` |
| `featureRequests` | `title`, `description`, `status`, `priority`, `submittedAt` | `by_submitted` |

All queries and mutations live in `convex/agents.ts`.

---

## Convex API (`convex/agents.ts`)

### Queries
| Function | Returns | Used in |
|----------|---------|---------|
| `getAgentRuns` | Runs sorted by `startedAt` desc | `useAgentTasks()` hook |
| `getAgentReports` | All reports | `useReports()` hook |
| `getFeatureRequests` | Requests sorted by status priority | `RequestsView` |

### Mutations
| Function | Args | Effect |
|----------|------|--------|
| `retryRun` | `id: Id<"agentRuns">` | Resets run to `status: "running"`, `progress: 0` |
| `addRun` | `agentName`, `type`, `description` | Inserts a new running task |
| `submitRequest` | `title`, `description`, `requestedBy`, `priority` | Inserts a Queued feature request |
| `seedAgents` | — | Idempotent seed: 5 runs + 3 reports + 4 requests. Guards with `.first()` check. |

### Auto-seed pattern
On first load when tables are empty, hooks call `seedAgents()` automatically. The mutation guards against double-seeding with an existence check before inserting.

---

## Data Flow

```
ConvexProvider (app layout)
  └── AgentsFeaturePage
        ├── useAgentTasks()         → useQuery(api.agents.getAgentRuns)
        │     ├── retryTask(id)     → useMutation(api.agents.retryRun)
        │     └── addAgent(type)   → useMutation(api.agents.addRun)
        │
        ├── ActivityView(tasks, filter, onRetry)
        │     └── ActivityCard ×N
        │
        ├── ReportsView
        │     ├── useReports()     → useQuery(api.agents.getAgentReports)
        │     └── ReportCard ×N
        │           └── ReportCardExpanded (accordion)
        │
        └── RequestsView
              ├── useQuery(api.agents.getFeatureRequests)
              ├── useMutation(api.agents.submitRequest)
              ├── useMutation(api.agents.seedAgents)
              ├── RequestCard ×N  (with status pipeline track)
              └── RequestForm     (animated slide-down form)
```

---

## Feature Inventory

### ① Activity Pill

| Feature | Details |
|---------|---------|
| Live Convex feed | Tasks sorted by `startedAt` desc, reactive updates |
| Filter chips | All / Running / Completed / Failed |
| Type-specific icons | `Radio` (Scraper), `CalendarClock` (Scheduler), `BarChart2` (Analyst) |
| Colour-coded left accent bar | Type colour normally; red on `failed` |
| Animated progress bar | Gradient progress ring, animated from 0 on mount |
| Live pulse dot | Animated ping on `running` status badge |
| Retry button | Inline with duration; calls `retryRun` mutation |
| Output preview | Mono font terminal-style preview block |
| Empty state | Bot icon + contextual message per filter |
| "New Agent" dropdown | Dispatches `Scraper`, `Scheduler`, or `Analyst` run via mutation |
| Active workers stat | Live count from `tasks.filter(t => t.status === 'running').length` |

### ② Reports Pill

| Feature | Details |
|---------|---------|
| Convex-backed | `useReports()` hook with `generatedAt` timestamp sort |
| Skeleton loading | 3-card pulse skeleton while query resolves |
| Error boundary | Class-based boundary falls back to static constants data |
| Category filter chips | All / Intelligence / Recon / Performance |
| Stats bar | Total report count · Total insights count · Last generated relative time |
| Category colour bar | 3px top bar per card (pink=Intelligence, blue=Recon, green=Performance) |
| Accordion expand | "Read Full Report" / "Close" toggle with height-animated reveal |
| Export button | In expanded section (UI stub, ready for real export wiring) |
| Empty state | Dashed border card with contextual message |

### ③ Requests Pill

| Feature | Details |
|---------|---------|
| Convex-backed | `useQuery(api.agents.getFeatureRequests)` reactive list |
| Auto-seed | `useEffect` guard pattern (single call via `useRef` flag) |
| Filter chips | All / Queued / In Progress / Delivered with live counts |
| Loading skeleton | 3 pulse skeleton cards |
| Status pipeline track | 3-node dot track (Queued → In Progress → Delivered) with connecting line |
| Priority left-border | 3px left accent: green=Low, amber=Medium, pink=High |
| SLA countdown | For Queued items: calculates hours from `submittedAt` to 72h deadline |
| Urgency colours | Normal (amber) → Urgent < 24h (orange) → Overdue (red) |
| New request form | Animated slide-down with title, description, priority segmented control |
| Delivered opacity | Delivered cards dimmed to 0.82 opacity |

### Navigation Integration

| Element | Detail |
|---------|--------|
| Numbered tab badges | ①②③ circle badges using `StepNum` component |
| `nextProduct` arrow | `> Recon` link after tab ③ pointing to the next icon |
| `ContentPageShell` | Shared layout with search, action dropdown, filter chips |
| Route | `/isso/agents` → `src/app/isso/agents/page.tsx` |

---

## Future Feature Pipeline

### Short-term (next sprint)
- [ ] **Real-time progress updates** — websocket/SSE push to update `progress` and `duration` on running tasks without polling
- [ ] **Agent logs drawer** — click any ActivityCard to open a full log stream panel (right drawer)
- [ ] **Export reports** — wire the Export button in ReportCard to generate a PDF/CSV from `insights[]`
- [ ] **Request status updates** — allow SISO team to update status via mutation (Queued → In Progress → Delivered)

### Medium-term
- [ ] **Agent scheduling** — schedule agents to run at specific times (cron-style, e.g. "Scrape every 6h")
- [ ] **Alert rules** — trigger notifications when agent fails or competitor engagement exceeds threshold
- [ ] **Report comparison** — diff two reports side-by-side (e.g. this week vs last week)
- [ ] **Per-model filtering** — filter agent runs by the model/creator they operated on
- [ ] **Agent performance metrics** — success rate, avg duration, tasks/day chart per agent type

### Long-term
- [ ] **Agent builder UI** — visual no-code agent configuration (scrape targets, schedules, output destinations)
- [ ] **Request voting** — team members can upvote/downvote feature requests to prioritise backlog
- [ ] **Webhook triggers** — agent runs triggered by external events (new post approval, calendar event)
- [ ] **Multi-agency** — scope all agent data by workspace/agency ID for multi-tenant deployment

---

## Setup

```bash
# 1. Start Next.js dev server
pnpm dev

# 2. Start Convex dev server (required for live data)
npx convex dev

# First load: tables are empty → seedAgents() fires automatically
# Subsequent loads: data persists in Convex cloud
```

---

## Key Design Decisions

| Decision | Rationale |
|----------|-----------|
| Auto-seed in hook render body | Matches established pattern from `useFeed.ts` in Intelligence feature |
| `DisplayRequest` flexible interface | Handles both Convex docs (`submittedAt: number`) and local constants (`date: string`) without a mapping step |
| Error boundary around Reports | Convex `useQuery` throws when function not found on server (schema not yet synced); boundary falls back to static data gracefully |
| `useRef` seed guard in Requests | Prevents double-seed in React StrictMode (which mounts components twice in dev) |
| Left accent bar (not `border-left`) | `overflow-hidden` + flex div gives a clean accent that respects border-radius, matching ReportCard's top-bar pattern |
