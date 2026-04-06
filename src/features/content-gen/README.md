# Content Gen — Feature Documentation

**Route:** `/isso/content-gen`
**Owner:** `agency.clients-pm`
**Stack:** Next.js 15 · TypeScript · Tailwind · Convex · Framer Motion

---

## What it is

The Content Gen feature is ISSO's AI video production studio. OFM agency managers use it to brief, dispatch, monitor, and review AI-generated video content for talent — running the full pipeline from scene description → AI generation → approval → delivery.

Three tabs, three stages of the workflow:

| Tab | What it does |
|---|---|
| **Generate** | Write a brief, pick a generator, dispatch a job |
| **Queue** | Live pipeline monitor — active jobs + history |
| **Gallery** | Review completed content — approve, send, or dismiss |

---

## File Map

```
src/features/content-gen/
├── README.md                              ← this file
├── types.ts                               ← ModelDoc, PanelState shared types
├── constants.ts                           ← FILTER_CHIPS, AVATAR_COLORS, GRAD, NICHES
├── utils.ts                               ← completionPct, stripAt
│
└── components/
    ├── GenerateFeaturePage.tsx            ← Generate tab orchestrator (state + Convex)
    ├── ModelsFeaturePage.tsx              ← Models tab orchestrator
    ├── QueueFeaturePage.tsx               ← Queue tab orchestrator
    │
    ├── generate/                          ← Generate tab sub-components
    │   ├── types.tsx                      ← Generator/Style types, GENERATORS, STYLES, helpers
    │   ├── TalentPicker.tsx               ← Model selector with avatar pills
    │   ├── GeneratorPills.tsx             ← FLUX / Kling / Higgsfield selector
    │   ├── StyleChips.tsx                 ← Cinematic / Vlog / Aesthetic / Trending
    │   ├── FaceRefUpload.tsx              ← Face reference image upload (FLUX only)
    │   ├── BriefBuilder.tsx               ← Left column of Generate tab
    │   ├── JobCard.tsx                    ← Card for ideas-table jobs
    │   ├── GalleryCard.tsx                ← 9:16 gallery card with hover actions
    │   ├── RecentJobsPanel.tsx            ← Right column of Generate tab
    │   ├── QueueTabContent.tsx            ← Queue tab layout (in-progress + history)
    │   └── GalleryTabContent.tsx          ← Gallery tab 4-col grid
    │
    ├── queue/                             ← Queue tab sub-components
    │   ├── types.ts                       ← Provider/JobStatus/Outcome types + design tokens
    │   ├── seed.ts                        ← Offline fallback data (SEED_ACTIVE, SEED_HISTORY)
    │   ├── utils.ts                       ← fmtDuration, fmtRelTime, groupByDate
    │   ├── atoms.tsx                      ← ProviderBadge, StatusBadge, OutcomeBadge, ModelAvatar
    │   ├── EtaCountdown.tsx               ← Live ticking ETA display
    │   ├── StatsStrip.tsx                 ← Generating · Queued · Failed pill counts
    │   ├── ActiveJobCard.tsx              ← In-progress job card with progress bar
    │   └── HistorySection.tsx             ← Date-grouped history rows
    │
    ├── ModelCard.tsx                      ← Model grid card with hover overlay
    ├── ModelGrid.tsx                      ← Responsive model grid
    ├── ModelPanel.tsx                     ← Slide-in add/edit panel
    ├── PanelForm.tsx                      ← Panel form fields
    ├── PanelPreview.tsx                   ← Panel avatar preview + drag-drop
    ├── PanelChecklist.tsx                 ← Panel setup checklist + danger zone
    ├── NicheChip.tsx                      ← Coloured niche label pill
    ├── CompletionBar.tsx                  ← Profile completion progress bar
    ├── SkeletonCard.tsx                   ← Loading skeleton
    ├── EmptyState.tsx                     ← Empty state with seed + add buttons
    └── Field.tsx                          ← Labelled form field wrapper

convex/
├── schema.ts                              ← models + ideas + contentGenJobs tables
├── models.ts                              ← list, getAll, create, update, remove, seedModels
└── contentGen.ts                          ← getJobs, getStats, createJob, updateJobStatus,
                                             deleteJob, getActiveJobs, getHistory,
                                             retryJob, cancelJob, updateOutcome, seedJobs
```

---

## Tab 1 — Generate

The brief builder. Two-column layout: left = form, right = live jobs panel.

### Left: BriefBuilder

Five sequential steps:

1. **Talent** — `TalentPicker` shows all active models as avatar pills. Auto-selects first model on load.
2. **Brief** — Free-text textarea. `⌘↵` submits. Char counter shown after first keystroke.
3. **Generator** — `GeneratorPills` picks FLUX / Kling / Higgsfield. ETA shown per pill.
4. **Style** — `StyleChips` picks Cinematic / Vlog / Aesthetic / Trending.
5. **Face Reference** — `FaceRefUpload` shown only when FLUX is selected. Multi-image drag + remove.

Generate CTA dispatches `createJob` mutation → switches to Queue tab → simulates completion after ETA.

### Right: RecentJobsPanel

Live filtered list of jobs from the `ideas` table. Filters (All / Generating / Done) controlled by the header filter bar. Empty state when no jobs. Running count badge when jobs are generating.

### Convex (ideas table)

| Export | Type | Notes |
|---|---|---|
| `getJobs` | query | All jobs, newest first. `campaign` field encodes generator as `gen:flux` etc. |
| `getStats` | query | `{ total, generating, ready, sent }` counts |
| `createJob` | mutation | Inserts into `ideas` with `hook=brief`, `campaign=gen:{generator}` |
| `updateJobStatus` | mutation | Updates `status` field |
| `deleteJob` | mutation | Deletes by id |

---

## Tab 2 — Models

The talent roster. Manages model profiles used in generation.

### Grid view

Responsive grid (2 → 3 → 4 → 5 cols). Each `ModelCard` shows:
- Avatar area (colour + initials + active dot + niche chip)
- Hover overlay: Edit + Ideas buttons
- Info area: name, status, handles, completion bar, idea/clip counts

Filter bar: All / Active / Draft.

### ModelPanel (slide-in)

400px right panel with spring animation. Three sections:

1. **PanelPreview** — avatar with drag-drop photo upload (FileReader → data URL)
2. **PanelForm** — name, niche (5 options), OF handle, IG handle, avatar colour picker, active toggle, bio
3. **PanelChecklist** — setup completion items + danger zone (delete, only on edit mode)

Completion score drives the `CompletionBar` and the `{n}% complete` badge in the panel header.

### Convex (models table)

| Export | Type | Notes |
|---|---|---|
| `list` | query | All models |
| `getAll` | query | Active models only — used by GenerateFeaturePage |
| `ideaCountByModel` | query | `Record<string, number>` — idea count per model |
| `clipCountByModel` | query | `Record<string, number>` — clip count per model |
| `create` | mutation | Insert new model |
| `update` | mutation | Patch by id |
| `remove` | mutation | Delete by id |
| `seedModels` | mutation | Seeds 4 demo models (Ren, Tyler, Ella, Amam) |

---

## Tab 3 — Queue

The production monitor. Two sub-tabs: **In Progress** and **History**.

### In Progress

- `StatsStrip` — pill counts for Generating / Queued / Failed with pulsing dot on Generating
- `ActiveJobCard[]` — one card per live job:
  - Provider accent bar (FLUX=amber, Kling=violet, Higgsfield=emerald)
  - Blue glow ring on Generating, red border on Failed
  - `ModelAvatar` + `ProviderBadge` + `StatusBadge`
  - `EtaCountdown` — ticks every second via `setInterval`
  - Framer Motion animated progress bar (gradient)
  - Context actions: Cancel (Queued), Retry (Failed)

### History

- `HistorySection` — date-grouped rows (Today / Yesterday / date label)
- `HistoryRow` — thumbnail swatch + name + model + duration + `ProviderBadge` + `OutcomeBadge`
- Hover reveals "Review" action (stub — wires to `updateOutcome` in future)

### Convex (contentGenJobs table)

| Export | Type | Notes |
|---|---|---|
| `getActiveJobs` | query | Queued + Generating + Failed, sorted by urgency |
| `getHistory` | query | Done jobs, newest first, `limit` param |
| `retryJob` | mutation | Failed → Queued, resets progress + error |
| `cancelJob` | mutation | Deletes a Queued job |
| `updateOutcome` | mutation | Sets Approved / Rejected / Pending Review |
| `seedJobs` | mutation | Seeds 6 demo records (idempotent) |

### Seed fallback

Both `SEED_ACTIVE` and `SEED_HISTORY` are rendered until Convex returns real data. The page is never blank on first load.

---

## Design Tokens

| Token | Value | Used for |
|---|---|---|
| Inner surfaces | `#f5f5f4` | Card backgrounds, form inputs |
| Page surface | `#fafaf9` | Gallery card caption strip |
| Primary gradient | `linear-gradient(135deg, #ff0069, #833ab4)` | CTAs, active pills, progress bars |
| Text primary | `text-neutral-900` | Headings |
| Text muted | `text-neutral-400` | Labels, secondary text |
| Dividers | `rgba(0,0,0,0.07)` | Borders, separators |
| FLUX accent | `#f59e0b` (amber) | Provider bar + badge |
| Kling accent | `#8b5cf6` (violet) | Provider bar + badge |
| Higgsfield accent | `#10b981` (emerald) | Provider bar + badge |
| Generating glow | `rgba(59,130,246,0.06)` | Active job card box shadow |

---

## Job Naming Convention

```
{face-model}-{video-provider-abbrev}-{reference-id}-{scene-slug}-{version}

FLUX-KL-ref01-gym-mirror-v1
│    │   │     │           └── version
│    │   │     └── scene slug
│    │   └── reference index
│    └── KL=Kling, HF=Higgsfield
└── face model = FLUX (always)
```

---

## Convex Setup

```bash
# Deploy schema + functions to production
cd apps/isso-dashboard
/usr/local/bin/node ./node_modules/.bin/convex deploy --yes

# Seed demo data (run once from any client component or dashboard)
const seed = useMutation(api.contentGen.seedJobs);
await seed({});

const seedM = useMutation(api.models.seedModels);
await seedM({});
```

---

## Feature Pipeline

### Phase 1 — Completeness

| # | Feature | Why |
|---|---|---|
| 1.1 | **Real-time progress updates** | `etaSeconds`/`progress` never update after insert. Wire a Convex scheduled function or provider webhook to tick progress live. |
| 1.2 | **"Review" wires to Approvals** | History row "Review" button is a stub. Should call `updateOutcome` + insert into `approvals` table. |
| 1.3 | **Cancel Generating jobs** | Currently only Queued jobs can be cancelled. Add abort API call + `cancelJob` path for Generating status. |
| 1.4 | **Real thumbnails** | `thumbnailColor` is a hex placeholder. Replace with actual CDN URL from provider webhook payload. |
| 1.5 | **Gallery approval → Drive** | Approving a gallery card should push video to model's Google Drive folder. |

### Phase 2 — Intelligence

| # | Feature | Why |
|---|---|---|
| 2.1 | **Filter bar for Queue** | Filter active/history by provider, model, status, outcome. `ContentPageShell` filter bar is already wired. |
| 2.2 | **Job cost display** | Show estimated cost per card (Kling ≈ $0.08/s, Higgsfield ≈ $0.12/s). |
| 2.3 | **Retry count badge** | Show retry count on Failed cards. Add `retryCount` field to `contentGenJobs` schema. |
| 2.4 | **Provider success rate** | In StatsStrip, show Done/total ratio per provider so managers spot flaky providers. |
| 2.5 | **Bulk actions** | Multi-select → bulk cancel, bulk retry, bulk approve in Queue and Gallery. |

### Phase 3 — Pipeline Integration

| # | Feature | Why |
|---|---|---|
| 3.1 | **"New Job" modal in Queue** | Wire the header "+ New Job" button to a modal: pick model → write scene → choose provider → dispatch. |
| 3.2 | **Google Drive delivery** | After Approved, auto-push video to model's Drive folder (Settings page has OAuth UI). |
| 3.3 | **Notifications** | Telegram/Slack ping when a job completes or fails. `settings.integrations.telegram` already in schema. |
| 3.4 | **Video preview player** | Clicking a history thumbnail opens an inline mp4 player rather than just showing the colour swatch. |
| 3.5 | **Mobile layout** | All layout is desktop-first. Cards need a dedicated mobile stack layout. |

### Phase 4 — Analytics

| # | Feature | Why |
|---|---|---|
| 4.1 | **Provider performance chart** | Average gen time + success rate per provider over time. |
| 4.2 | **Daily throughput** | Jobs dispatched vs completed per day — feeds capacity planning. |
| 4.3 | **Model breakdown** | Which model generates the most, at what cost, with what approval rate. |
| 4.4 | **Content performance loop** | Link approved clips to downstream engagement metrics (views, conversions). |
