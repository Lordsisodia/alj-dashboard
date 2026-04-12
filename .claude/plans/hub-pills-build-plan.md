# Hub — 3 Pills Build Plan
> Created: 2026-04-06
> Status: Ready for agent handoff
> Scope: `src/features/dashboard/` (Overview), `src/features/approvals/` (Approvals), new `src/features/hub-swipe/` (Swipe & Rate)

---

## Context

Hub is product icon ⌘3 in the ISSO sidebar. It is the **human interaction layer** — where managers and models touch content before it gets published.

Pipeline position: `Recon → Intelligence → Hub → Content Gen → Agents`

The three pills live inside `DashboardFeaturePage.tsx` at `/isso` via `ContentPageShell` tabs. After the 3rd pill there is a `nextProduct` arrow pointing to Content Gen (`/isso/ideas`).

---

## What Is Already Built (do not rebuild)

| Component | File | Status |
|---|---|---|
| `KpiCards` | `features/dashboard/components/overview/KpiCards.tsx` | ✅ Built — 4-card grid, icon + value + trend |
| `QuickActions` | `features/dashboard/components/overview/QuickActions.tsx` | ✅ Built |
| `ActivityFeed` | `features/dashboard/components/overview/ActivityFeed.tsx` | ✅ Built |
| `UpcomingPosts` | `features/dashboard/components/overview/UpcomingPosts.tsx` | ✅ Built |
| `ModelsOverview` | `features/dashboard/components/overview/ModelsOverview.tsx` | ✅ Built — models strip |
| `ApprovalCard` | `features/approvals/components/cards/ApprovalCard.tsx` | ✅ Built — thumbnail, caption, status badge, Review button |
| `MiniStat` | `features/approvals/components/cards/MiniStat.tsx` | ✅ Built — colored stat pill |
| `DetailModal` | `features/approvals/components/modals/DetailModal.tsx` | ✅ Built — approve/revise/publish workflow |
| `EmptyState` | `features/approvals/components/states/EmptyState.tsx` | ✅ Built |
| `PostCard` | `features/community/components/feed/PostCard.tsx` | ✅ Built — like/bookmark/view card |
| `LeaderboardSidebar` | `features/community/components/sidebar/LeaderboardSidebar.tsx` | ✅ Built |

---

## Pill 1 — Overview

**Route:** `/isso` (default tab)
**File:** `src/features/dashboard/components/DashboardFeaturePage.tsx` → `OverviewContent()`
**Status:** Mostly built. Needs 2 new components.

### What's Already There
- `KpiCards` — 4-up grid: Videos Generated, Approvals Pending, Models Active, Revenue This Month
- `QuickActions` — shortcut buttons
- `ActivityFeed` + `UpcomingPosts` — side-by-side columns
- `ModelsOverview` — horizontal model account strip

### What Needs Building

#### NEW: `ModelPnLCard` — Per-model revenue summary
**Priority:** MVP
**Inspired by:** Xcelerator's Per-model P&L
**Placement:** Between `KpiCards` and `QuickActions`

```
┌─────────────────────────────────────────────────────────┐
│  Model P&L — This Month                    [← →]        │
├──────────────┬──────────────┬──────────────┬────────────┤
│ Tyler        │ Ren          │ Ella         │ Amam       │
│ £4,200 rev   │ £3,100 rev   │ £2,800 rev   │ £1,900 rev │
│ £840 cost    │ £620 cost    │ £560 cost    │ £380 cost  │
│ £3,360 net ↑ │ £2,480 net ↑ │ £2,240 net ↑ │ £1,520 net │
│ 90-day LTV   │ Chatter CVR  │              │            │
└──────────────┴──────────────┴──────────────┴────────────┘
```

Fields per model: Revenue, Cost, Net, 90-day LTV, Chatter conversion rate
Seed with: 4 models matching existing seed data (Tyler, Ren, Ella, Amam)

#### NEW: `ExpiringSubscriberQueue` — Fans expiring in 24-72h
**Priority:** Future (build as placeholder card for now, real data later)
**Placement:** Right column alongside `ActivityFeed`

```
┌─────────────────────────────────┐
│  ⚠ Expiring Soon      24h view  │
│  @fan_xyz    expires in 18h  [→]│
│  @fan_abc    expires in 22h  [→]│
│  @fan_def    expires in 31h  [→]│
│  + 7 more                       │
└─────────────────────────────────┘
```

Seed with: 5-7 placeholder fan entries with countdown timestamps.

### Component List for Agent

| Component | New/Edit | Priority | Notes |
|---|---|---|---|
| `ModelPnLCard` | NEW | MVP | Horizontal scrollable, 4 model columns |
| `ExpiringSubscriberQueue` | NEW | Future | Placeholder card, real data later |
| Update `OverviewContent` layout | EDIT | MVP | Insert `ModelPnLCard` between KpiCards and QuickActions |

---

## Pill 2 — Approvals

**Route:** `/isso` (tab `approvals`)
**Current reality:** `ApprovalsFeaturePage` exists as a standalone page at `/isso/approvals`. It needs to be consumed as tab content inside `DashboardFeaturePage`.
**Status:** Core card grid + modal built. Missing 4 key features.

### What's Already There
- `MiniStat` row: Pending Review, Awaiting Client, Approved Today, Published This Week
- Account filter dropdown (All Accounts, Tyler, Ren, Ella, Amam)
- Content type filter chips (Reels, Posts, Stories, Carousels)
- `ApprovalCard` grid — thumbnail, caption, status badge, Review button
- `DetailModal` — full-screen modal with approve/revise/publish actions
- Sub-tabs inside: Pending · Approved · Published

### What Needs Building

#### NEW: `RejectionReasonPicker` — Structured rejection codes
**Priority:** MVP — this feeds AI training. No competitor has it.
**Placement:** Inside `DetailModal`, shown when user clicks "Request Revision"

```
┌──────────────────────────────────────────┐
│  Why are you requesting a revision?      │
│                                          │
│  [Wrong face]    [Motion artifact]       │
│  [Off-brand]     [Wrong tone]            │
│  [Bad lighting]  [Wrong format]          │
│  [Platform rule violation]               │
│                                          │
│  Additional notes (optional)             │
│  ┌────────────────────────────────────┐  │
│  │                                    │  │
│  └────────────────────────────────────┘  │
│                                          │
│  [Cancel]      [Send Revision Request →] │
└──────────────────────────────────────────┘
```

Reason codes (store as enum):
- `wrong_face` — Face transfer didn't match
- `motion_artifact` — Video motion glitch or stutter
- `off_brand` — Doesn't match model's style/brand
- `wrong_tone` — Wrong mood/energy for the content
- `bad_lighting` — Scene lighting issues
- `wrong_format` — Wrong aspect ratio or duration
- `platform_violation` — Likely platform policy issue

#### NEW: `PlatformPreviewPanel` — Per-platform rendering preview
**Priority:** MVP — show at approval time, not just schedule time
**Placement:** Inside `DetailModal`, toggle above the video/thumbnail

```
┌─────────────────────────────────────────────────┐
│  Preview as:  [OnlyFans] [TikTok] [Instagram]   │
│                                                  │
│   ┌──────────────────┐                          │
│   │  9:16 frame      │  Caption truncation:     │
│   │  (video here)    │  "First 125 chars..."    │
│   │                  │  [+ see more]            │
│   │                  │                          │
│   └──────────────────┘  Thumbnail frame: [edit] │
└─────────────────────────────────────────────────┘
```

Each platform shows: correct aspect ratio crop, caption truncation, thumbnail frame selection.
Platforms: OnlyFans (9:16), TikTok (9:16), Instagram Reels (9:16 / 4:5 / 1:1)

#### NEW: `SLATimer` — Time-since-submission badge on cards
**Priority:** Phase 2
**Placement:** `ApprovalCard` top-right corner

Small badge: `🕐 2d 4h` — turns amber at 24h, red at 48h.
On hover: tooltip "SLA escalation in 16h → escalates to @manager"

#### NEW: `ABCompareView` — Side-by-side variant picker
**Priority:** Phase 2
**Placement:** New view mode toggle in the Approvals tab header

When 2 cards selected → "Compare" button appears → opens side-by-side modal with both variants, pick winner action.

### Integration Step

The `ApprovalsFeaturePage` currently is a full page. The agent should:
1. Extract its inner content into `ApprovalsTabContent` component
2. Import `ApprovalsTabContent` into `DashboardFeaturePage` for the `approvals` tab
3. Keep `ApprovalsFeaturePage` as a thin wrapper (it may still be linked from other places)

### Component List for Agent

| Component | New/Edit | Priority | Notes |
|---|---|---|---|
| `RejectionReasonPicker` | NEW | MVP | 7 reason code chips + optional notes textarea |
| `PlatformPreviewPanel` | NEW | MVP | 3-platform toggle inside DetailModal |
| `ApprovalsTabContent` | EXTRACT | MVP | Pull inner content out of ApprovalsFeaturePage |
| Update `DetailModal` | EDIT | MVP | Add RejectionReasonPicker + PlatformPreviewPanel |
| `SLATimer` badge | NEW | Phase 2 | Time badge on ApprovalCard |
| `ABCompareView` modal | NEW | Phase 2 | Side-by-side variant comparison |
| Update `DashboardFeaturePage` | EDIT | MVP | Import ApprovalsTabContent for approvals tab |

---

## Pill 3 — Swipe & Rate

**Route:** `/isso` (tab `swipe-rate`)
**Current seed:** `CommunityFeaturePage` (PostCard grid + LeaderboardSidebar)
**Status:** New build. PostCard is reusable. Everything else is new.
**This is ISSO's core differentiator — Foreplay has zero rating system.**

### The Three Audiences (build all three views behind a role toggle)

| Audience | What they see | Key action |
|---|---|---|
| **Manager** | Top 100 scraped reels queue, batch send to models | Approve reel + assign to model |
| **Model (creator)** | Same reels, simpler UI | Swipe right (like) / left (pass) |
| **Admin / ISSO** | All of the above + audit log | Monitor training data quality |

For MVP: build the Manager view. Model view is a simplified version of the same stack.

### Layout — Two modes

**Mode A: Swipe Stack** (default — Tinder UX)
```
┌─────────────────────────────────────────────────────────┐
│  Swipe & Rate          Queue: 87 reels    [Grid mode ⊞] │
├─────────────────────────────────────────────────────────┤
│                                                          │
│              ┌──────────────────┐                        │
│              │                  │  WHY TAGS              │
│              │   Reel card      │  ┌─────────────────┐  │
│              │   9:16 aspect    │  │ ✓ Hook style     │  │
│              │   (video/img)    │  │ ✓ Pacing         │  │
│              │                  │  │ ✓ Visual aesthetic│  │
│              │   @creator_handle│  │ ✓ Audio          │  │
│              │   12.4K views    │  │ ✓ Format type    │  │
│              └──────────────────┘  └─────────────────┘  │
│                                                          │
│    [✕ Pass]    [♥ Rate & Save]    [→ Send to Model]     │
│                                                          │
│    Session: 14 rated · 3 passed · 2 sent                │
└─────────────────────────────────────────────────────────┘
```

**Mode B: Grid** (toggle to grid — for batch review)
```
PostCard grid (reuse existing PostCard) with overlay rating buttons
```

### Core New Components

#### NEW: `SwipeStack` — Tinder-style card stack
**Priority:** MVP
```
- Top card is full-size (9:16 aspect), shows video/thumbnail
- Cards 2-3 peek behind (scale 0.96, 0.92)
- Drag left = pass (red ✕ overlay)
- Drag right = like (green ♥ overlay)
- Keyboard: ← pass, → like, ↑ send to model
- After swipe: next card animates up
- Session counter in header updates live
```

Uses `framer-motion` drag constraints. Reuse gradient/thumbnail from `PostCard`.

#### NEW: `WhyTagPanel` — Structured reason tag selector
**Priority:** MVP — this is the core differentiator
**Placement:** Right of `SwipeStack`, always visible

```
Tags (multi-select, required before rating):

HOOK:        [Strong hook] [Weak hook] [No hook]
PACING:      [Fast] [Medium] [Slow]
VISUAL:      [Clean] [Busy] [Dark] [Bright]
AUDIO:       [Trending sound] [Original] [Silent]
FORMAT:      [Talking head] [B-roll] [POV] [Outfit] [Mirror]
TONE:        [Playful] [Sensual] [Aspirational] [Educational]
```

Rules:
- At least 1 tag required per category before ♥ is enabled
- Tags stored with swipe decision → this IS the training data
- Tags shown as colored chips, active = gradient fill

#### NEW: `SwipeSessionSummary` — Session stats bar
**Priority:** MVP
**Placement:** Bottom of swipe area

```
Session: [♥ 14 rated] [✕ 3 passed] [→ 2 sent to model] [🕐 8 min]  [End session]
```

On "End session" → session written to audit log → `SwipeAuditLog` updates.

#### NEW: `SendToModelModal` — Assign reel to specific model
**Priority:** MVP
**Trigger:** → button or keyboard ↑

```
┌──────────────────────────────────┐
│  Send to model                   │
│                                  │
│  ● Tyler     ○ Ren               │
│  ○ Ella      ○ Amam              │
│                                  │
│  With note: (optional)           │
│  "Good hook for outdoor style"   │
│                                  │
│  [Cancel]    [Send →]            │
└──────────────────────────────────┘
```

#### NEW: `SwipeAuditLog` — Session history + rating record
**Priority:** MVP (for training data integrity)
**Placement:** Separate drawer / tab toggle inside the Swipe & Rate pill

```
┌─────────────────────────────────────────────────────────┐
│  Rating History                          [← Back to swipe│
├─────────────────────────────────────────────────────────┤
│  Today · 14 ratings · 3 passes                          │
│                                                          │
│  ♥  @creator_x  · Mirror reel · Hook:Strong, Pacing:Fast│
│  ✕  @creator_y  · Talking head · Hook:Weak              │
│  →  @creator_z  · B-roll · sent to Tyler                │
│  ♥  @creator_a  · POV · Audio:Trending, Format:POV      │
│  ...                                                     │
│                                                          │
│  Apr 5 · 22 ratings · 5 passes                          │
│  ...                                                     │
└─────────────────────────────────────────────────────────┘
```

Each entry: reel thumbnail, creator handle, your decision, tags selected, timestamp, rater (for multi-user agencies).

#### NEW: `HardNegativeFlag` — "Never generate like this" explicit block
**Priority:** Phase 2
**Placement:** Long-press or right-click on any card in grid mode, or extra button in swipe mode

Marks reel as hard-negative training signal — stored separately from low-rating items.

#### NEW: `InspiredByBadge` — Links generated content back to rated reels
**Priority:** Phase 2
**Placement:** On `ApprovalCard` in Approvals pill, small badge "Inspired by 3 reels →"

Clicking shows which Swipe & Rate reels influenced this generated content.

### Component List for Agent

| Component | New/Edit | Priority | Notes |
|---|---|---|---|
| `SwipeStack` | NEW | MVP | Framer Motion drag, 3-card stack, keyboard support |
| `WhyTagPanel` | NEW | MVP | Multi-select tag grid, 6 categories, required before rating |
| `SwipeSessionSummary` | NEW | MVP | Live session counter bar |
| `SendToModelModal` | NEW | MVP | Assign reel to 1 of 4 models |
| `SwipeAuditLog` | NEW | MVP | Chronological rating history with tags |
| Grid mode toggle | EDIT | MVP | Reuse `PostCard` with rating overlay buttons |
| `HardNegativeFlag` | NEW | Phase 2 | Right-click / long-press action |
| `InspiredByBadge` | NEW | Phase 2 | Cross-link to ApprovalCard |
| `SwipeTabContent` | NEW | MVP | Container wiring SwipeStack + WhyTagPanel + SessionSummary |

---

## Wiring Everything into DashboardFeaturePage

```tsx
// DashboardFeaturePage.tsx — tab content map
const tabContent: Record<Tab, React.ReactNode> = {
  'overview':    <OverviewContent />,           // existing + ModelPnLCard
  'approvals':   <ApprovalsTabContent />,       // extracted from ApprovalsFeaturePage
  'swipe-rate':  <SwipeTabContent />,           // new build
};
```

The `nextProduct` arrow after tab 3 already points to Content Gen (`/isso/ideas`, `<Sparkles>` icon) — no change needed.

---

## File Map — Where Agents Should Work

```
src/features/dashboard/
  components/
    DashboardFeaturePage.tsx       ← wire in ApprovalsTabContent + SwipeTabContent
    overview/
      KpiCards.tsx                 ← no change
      QuickActions.tsx             ← no change
      ActivityFeed.tsx             ← no change
      UpcomingPosts.tsx            ← no change
      ModelsOverview.tsx           ← no change
      ModelPnLCard.tsx             ← NEW
      ExpiringSubscriberQueue.tsx  ← NEW (placeholder)

src/features/approvals/
  components/
    ApprovalsFeaturePage.tsx       ← thin wrapper, keep
    ApprovalsTabContent.tsx        ← NEW EXTRACT from ApprovalsFeaturePage
    cards/
      ApprovalCard.tsx             ← add SLATimer badge (Phase 2)
      MiniStat.tsx                 ← no change
    modals/
      DetailModal.tsx              ← add RejectionReasonPicker + PlatformPreviewPanel
      RejectionReasonPicker.tsx    ← NEW
      PlatformPreviewPanel.tsx     ← NEW
    views/
      ABCompareView.tsx            ← NEW (Phase 2)

src/features/hub-swipe/            ← NEW FEATURE FOLDER
  components/
    SwipeTabContent.tsx            ← container
    SwipeStack.tsx                 ← Tinder card stack
    WhyTagPanel.tsx                ← structured tag selector
    SwipeSessionSummary.tsx        ← session counter bar
    SendToModelModal.tsx           ← model assignment modal
    SwipeAuditLog.tsx              ← rating history drawer
    HardNegativeFlag.tsx           ← Phase 2
  types.ts
  constants.ts                     ← seed reels (reuse PostCard data shape)
```

---

## Seed Data Requirements

All three pills need seed data for demo. Agents should use the existing seed patterns.

| Pill | Seed from | Data shape |
|---|---|---|
| Overview | `features/dashboard/constants.ts` | KPI values, model list (Tyler/Ren/Ella/Amam) |
| Approvals | `features/approvals/constants.ts` | ITEMS array (ApprovalItem type), ACCOUNTS |
| Swipe & Rate | `features/community/constants.ts` | POSTS array (Post type) — reuse directly |

For `ModelPnLCard`: add to `features/dashboard/constants.ts`:
```ts
export const MODEL_PNL = [
  { name: 'Tyler', color: '#7c3aed', revenue: 4200, cost: 840, ltv: 12400, chatCvr: 0.34 },
  { name: 'Ren',   color: '#ff0069', revenue: 3100, cost: 620, ltv: 9800,  chatCvr: 0.28 },
  { name: 'Ella',  color: '#0891b2', revenue: 2800, cost: 560, ltv: 7600,  chatCvr: 0.22 },
  { name: 'Amam',  color: '#d97706', revenue: 1900, cost: 380, ltv: 5200,  chatCvr: 0.19 },
];
```

---

## Design Rules (from ISSO_DASHBOARD_CONTEXT.md — do not drift)

- Outer canvas: `bg-black p-5 gap-5`
- Content card: `#ffffff rounded-2xl`
- Primary accent: `linear-gradient(135deg, #ff0069, #833ab4)`
- Active tab: gradient bg + white text
- Inner surfaces: `#f5f5f4`
- Dividers: `rgba(0,0,0,0.07)`
- All animations: Framer Motion (`fadeUp` stagger pattern from existing components)
- Import alias: `@/isso/*` → `src/shared/*` (NOT `@/shared/*`)

---

## Priority Order for Agents

### Sprint 1 — MVP (build these first)
1. `RejectionReasonPicker` + wire into `DetailModal`
2. `PlatformPreviewPanel` + wire into `DetailModal`
3. `ApprovalsTabContent` extract + wire into `DashboardFeaturePage`
4. `ModelPnLCard` + wire into `OverviewContent`
5. `SwipeStack` + `WhyTagPanel` + `SwipeSessionSummary` + `SendToModelModal`
6. `SwipeAuditLog`
7. `SwipeTabContent` container wiring everything together

### Sprint 2 — Phase 2 (after MVP ships)
8. `SLATimer` badge on `ApprovalCard`
9. `ABCompareView` modal
10. `HardNegativeFlag`
11. `InspiredByBadge` (cross-links Swipe & Rate → Approvals)
12. `ExpiringSubscriberQueue` (real data, not placeholder)
