---
page: PTP Approval
route: /agency/ptp
dashboard: agency
status: spec-ready
based-on: ApprovalsFeaturePage (src/features/approvals/components/ApprovalsFeaturePage.tsx)
spec-date: 2026-04-12
---

# PTP Approval — Wireframe + Component Spec

> **Strategy:** Enhance `ApprovalsFeaturePage` — do NOT rebuild it. Add version tracking,
> batch select, and schedule-on-approve on top of the existing card grid + detail modal.

---

## 1. ASCII Wireframe — Desktop Layout

```
╔══════════════════════════════════════════════════════════════════════════════════════════════╗
║  [sidebar]  ║                          bg-white rounded-2xl (ContentPageShell)               ║
║  IssoSide-  ║                                                                                ║
║  barShell   ║  ┌──────────────────────────────────────────────────────────────────────────┐  ║
║  (collapsed ║  │ ROW 1 — Header bar  h-14 px-3                                            │  ║
║  or 280px)  ║  │  [OFM icon 32px]  Post-to-Publish  [7 Pending pill]   [search w-80]     │  ║
║             ║  │                                          [Approve All ▾] gradient btn     │  ║
║             ║  ├──────────────────────────────────────────────────────────────────────────┤  ║
║             ║  │ ROW 2 — Tab nav + filter bar  px-3 py-2                                  │  ║
║             ║  │  [Pending 7] [Approved] [Rejected]  │  [Model ▾] [Niche ▾] [+ Filter]   │  ║
║             ║  │                                          [Grid ▪ List toggle]             │  ║
║             ║  ├──────────────────────────────────────────────────────────────────────────┤  ║
║             ║  │ ROW 3 — StatusStrip (approval session stats)                              │  ║
║             ║  │  ● Session active  │ 7 pending │ 3 approved today │ 1 rejected │ SLA: 2h │  ║
║             ║  ├───────────────────────────────────────┬──────────────────────────────────┤  ║
║             ║  │                                       │                                  │  ║
║             ║  │  REEL GRID  (flex-1, overflow-y-auto) │  DETAIL SIDE PANEL               │  ║
║             ║  │  px-6 py-6                            │  (slides in when card selected)  │  ║
║             ║  │                                       │  w-[420px] border-l              │  ║
║             ║  │  ┌───────┐ ┌───────┐ ┌───────┐       │  ┌────────────────────────────┐  ║
║             ║  │  │ CARD  │ │ CARD  │ │ CARD  │       │  │ VIDEO PLAYER               │  ║
║             ║  │  │       │ │       │ │       │       │  │ (VideoLightbox inline mode)│  ║
║             ║  │  │[thumb]│ │[thumb]│ │[thumb]│       │  │ aspect-video bg-black      │  ║
║             ║  │  │       │ │       │ │       │       │  │ [▶ play] [⛶ fullscreen]    │  ║
║             ║  │  │[V2 ●] │ │[V1]   │ │[V1]   │       │  └────────────────────────────┘  ║
║             ║  │  ├───────┤ ├───────┤ ├───────┤       │                                  ║
║             ║  │  │model  │ │model  │ │model  │       │  ┌────────────────────────────┐  ║
║             ║  │  │niche  │ │niche  │ │niche  │       │  │ AI METADATA PANEL          │  ║
║             ║  │  │[●pend]│ │[✓appd]│ │[✕rjct]│       │  │ (AiAnalysisPanel)          │  ║
║             ║  │  │[Rvw ▢]│ │       │ │       │       │  │ Hook score ████░ 82        │  ║
║             ║  │  └───────┘ └───────┘ └───────┘       │  │ Emotion: Energetic · Bold  │  ║
║             ║  │                                       │  │ Suggestions: [2 items]     │  ║
║             ║  │  ┌───────┐ ┌───────┐ ┌───────┐       │  └────────────────────────────┘  ║
║             ║  │  │ CARD  │ │ CARD  │ │ CARD  │       │                                  ║
║             ║  │  │[V2 ●] │ │[V1]   │ │[V1]   │       │  ┌────────────────────────────┐  ║
║             ║  │  │[SLA!] │ │       │ │       │       │  │ VERSION COMPARISON         │  ║
║             ║  │  └───────┘ └───────┘ └───────┘       │  │ [V1] ─────── [V2 current] │  ║
║             ║  │                                       │  │ side-by-side thumbnails    │  ║
║             ║  │                                       │  │ diff: caption / hook / len │  ║
║             ║  │                                       │  └────────────────────────────┘  ║
║             ║  │                                       │                                  ║
║             ║  │                                       │  ┌────────────────────────────┐  ║
║             ║  │                                       │  │ APPROVAL ACTIONS           │  ║
║             ║  │                                       │  │ [✓ Approve & Schedule]     │  ║
║             ║  │                                       │  │ [✓ Approve]  [✕ Reject]    │  ║
║             ║  │                                       │  │ [⟳ Request Revision]       │  ║
║             ║  │                                       │  └────────────────────────────┘  ║
║             ║  │                                       │                                  ║
║             ║  │                                       │  ┌────────────────────────────┐  ║
║             ║  │                                       │  │ VERSION HISTORY            │  ║
║             ║  │                                       │  │ (SwipeAuditLog adapted)    │  ║
║             ║  │                                       │  │ Apr 11 — V2 submitted      │  ║
║             ║  │                                       │  │ Apr 09 — V1 rejected       │  ║
║             ║  │                                       │  └────────────────────────────┘  ║
║             ║  └───────────────────────────────────────┴──────────────────────────────────┘  ║
╚══════════════════════════════════════════════════════════════════════════════════════════════╝

  FLOATING BATCH ACTION BAR (slides up from bottom when 2+ cards selected via checkbox)
  ┌────────────────────────────────────────────────────────────────┐
  │  bg-[#1a1a1a]  rounded-2xl  fixed bottom-6 left-1/2           │
  │  [3] selected  │  [✓ Approve All]  [✕ Reject All]  [📅 Schedule All]  [×] │
  └────────────────────────────────────────────────────────────────┘

  SCHEDULE DATE POPUP (Popover anchored to "Approve & Schedule" button)
  ┌──────────────────────────┐
  │  bg-white  rounded-2xl   │
  │  Schedule this reel      │
  │  Recommended: Apr 14 Mon │
  │  [calendar date picker]  │
  │  Time: [10:00 AM ▾]      │
  │  [Confirm Schedule →]    │
  └──────────────────────────┘

  REJECTION FLOW (expands inline inside side panel, replaces action row)
  ┌──────────────────────────────┐
  │  Why are you rejecting?      │
  │  [Bad hook] [Off-brand]      │
  │  [Poor quality] [Wrong niche]│
  │  [Free text note...]         │
  │  [Notify Model] [Send]       │
  └──────────────────────────────┘
```

---

## 2. Component Tree

Enhancement strategy: `ApprovalsFeaturePage` is the root — we surgically add new children
and extend existing ones. Nothing is ripped out.

```
ApprovalsFeaturePage (ENHANCE)                              ← existing root, add model/niche state
  └─ ContentPageShell (EXISTING — no change to shell itself)
       ├─ [header] ProductIcon(ofm) + "Post-to-Publish" + StatPill + search + actionBtn
       ├─ [tabs] Pending | Approved | Rejected              ← RENAME "Published" → "Rejected"
       ├─ [filterBar right] ModelSelectorPill (NEW) + NicheFilterPill (NEW) + AddFilterPill + ViewToggle
       │
       └─ [content area]  ← REPLACE single-column content with split-pane layout
            ├─ PtpStatusStrip (NEW — wraps existing StatusStrip pattern)
            │
            └─ PtpSplitPane (NEW wrapper div, flex row)
                 │
                 ├─ PtpReelGrid (ENHANCE ApprovalsTabContent)
                 │    ├─ MiniStat × 4 (EXISTING — keep)
                 │    ├─ AccountSelector (EXISTING — keep)
                 │    ├─ SelectAllToggle (NEW — mirrors QueueFeaturePage pattern)
                 │    └─ grid cols-2 md:cols-3
                 │         └─ ReelApprovalCard (ENHANCE ApprovalCard)
                 │              ├─ [existing] thumbnail, content-type badge, account badge
                 │              ├─ [NEW] VersionBadge (V1 / V2 / V3 pill + "new" dot)
                 │              ├─ [NEW] SelectCheckbox (top-left overlay, visible on hover or when batch active)
                 │              ├─ [existing] caption, submitter, submittedAt
                 │              ├─ [existing] status badge
                 │              ├─ [NEW] SlaIndicator (time-in-queue, amber/red when overdue)
                 │              └─ [existing] Review button (opens side panel, not modal)
                 │
                 └─ PtpDetailPanel (NEW — replaces DetailModal for /agency/ptp route)
                      ├─ PanelHeader (model avatar, name, niche, version badge, close ×)
                      ├─ VideoPlayerInline (VideoLightbox adapted for inline panel mode)
                      ├─ AiAnalysisPanel (REUSE from hub-swipe — hook score, emotion chips)
                      ├─ VersionComparison (NEW — side-by-side V1/V2 thumbnails + diff)
                      ├─ ApprovalActionRow (ENHANCE DetailModal actions)
                      │    ├─ ApproveAndScheduleButton → triggers ScheduleDatePopup (NEW)
                      │    ├─ ApproveButton (existing logic)
                      │    └─ RejectButton → triggers RejectionFlow (ENHANCE existing RejectionReasonPicker)
                      └─ VersionHistoryLog (NEW — SwipeAuditLog adapted for version events)

  BatchApprovalBar (NEW — port from QueueFeaturePage bulk bar, fixed position)
       // [FIXED] Position: use left-[calc(50%+140px)] to account for ~280px expanded sidebar
       // OR render inside ContentPageShell as absolute bottom-6 (not fixed)
       // 'fixed bottom-6 left-1/2 -translate-x-1/2' will be visually off-center with IssoSidebarShell
       ├─ selection count badge
       ├─ BulkApproveButton
       ├─ BulkRejectButton
       ├─ BulkScheduleButton (NEW — not in QueueFeaturePage)
       └─ ClearSelectionButton

  ScheduleDatePopup (NEW — shadcn Popover + DatePicker)
       ├─ RecommendedDateHint
       ├─ CalendarGrid
       ├─ TimePicker
       └─ ConfirmButton
```

---

## 3. Per-Component Spec

### 3a. ApprovalsFeaturePage (ENHANCE — root)

**File:** `src/features/approvals/components/ApprovalsFeaturePage.tsx`

**Add vs Existing:**
| Property | Status | Change |
|---|---|---|
| `activeTab` state | EXISTING | Keep |
| `activeFilter` state | EXISTING | Keep (content-type chips) |
| `selectedIds` state | ADD | `Set<string>` — mirrors QueueFeaturePage |
| `selectedItemId` state | CHANGE | Was `selectedItem: ApprovalItem \| null` → change to id-based so panel re-renders on data update |
| `modelFilter` state | ADD | `string \| 'all'` |
| `nicheFilter` state | ADD | `string \| 'all'` |
| ProductIcon | CHANGE | `product="hub"` → `product="ofm"` (OFM pink accent) |
| title | CHANGE | `"Approvals"` → `"Post-to-Publish"` |
| accentGradient | ADD | Pass `linear-gradient(135deg, #ff0069, #833ab4)` to ContentPageShell |
| filterRightSlot | ADD | `<ModelSelectorPill />` + `<NicheFilterPill />` |
| tabs | CHANGE | Rename `rejected` tab label from `"Published"` → `"Rejected"` |
| content layout | CHANGE | Wrap `<ApprovalsTabContent />` + new `<PtpDetailPanel />` in `PtpSplitPane` flex row |
| DetailModal | REMOVE | Not rendered at /agency/ptp — replaced by side panel |
| BatchApprovalBar | ADD | Rendered at page root, outside ContentPageShell (fixed position) |

---

### 3b. ReelApprovalCard (ENHANCE — was ApprovalCard)

**File:** `src/features/approvals/components/cards/ApprovalCard.tsx`

**What to ADD:**
```
1. SelectCheckbox overlay
   - Position: absolute top-2 left-2
   - Visibility: opacity-0 group-hover:opacity-100 + always visible when batch mode active
   - Element: <input type="checkbox" /> wrapped in styled div
   - onClick: stopPropagation + call onToggle(item.id)
   - When checked: card gets ring-2 ring-[#ff0069]/40 outline

2. VersionBadge
   - Position: absolute bottom-2 left-2 (above the status badge row)
   - Shape: px-1.5 py-0.5 rounded text-[10px] font-bold
   - V1: bg-neutral-100 text-neutral-500
   - V2+: bg-[#ff0069]/10 text-[#ff0069] border border-[#ff0069]/20
   - "new" dot: w-1.5 h-1.5 rounded-full bg-[#ff0069] animate-pulse (only on latest version)

3. SlaIndicator
   - Position: inside card body, below submittedAt
   - Show: only when status === 'pending' and age > 24h
   - Element: <Clock size={10} /> + "Xh in queue"
   - Color: amber when 24-48h, red when >48h

4. Props added to ApprovalCardProps:
   - selected: boolean
   - onToggle: (id: string) => void
   - batchActive: boolean  (drives checkbox visibility)
   - version: number        (1, 2, 3...)
   - isLatestVersion: boolean
   - queueAgeHours: number
```

**What is UNCHANGED:**
- Thumbnail area, gradient, content-type badge, account badge
- Card click → open detail (change from `onOpen(item)` to `onSelect(item.id)`)
- Status badge, caption, submitter/date display
- Review button
- Framer Motion layout + enter/exit animations

---

### 3c. PtpDetailPanel (NEW — replaces DetailModal for this route)

**File:** `src/features/approvals/components/PtpDetailPanel.tsx`

**Purpose:** Persistent side panel (not a modal) that renders when a card is selected.
Stays mounted; item swaps via `AnimatePresence mode="wait"` on `key={selectedItemId}`.

**Structure:**
```tsx
<motion.div
  initial={{ x: 40, opacity: 0 }}
  animate={{ x: 0, opacity: 1 }}
  className="w-[420px] flex-shrink-0 border-l flex flex-col overflow-y-auto"
  style={{ borderColor: 'rgba(0,0,0,0.07)' }}
>
  <PanelHeader />           // model avatar + name + niche + version badge + close
  <VideoPlayerInline />     // VideoLightbox in panel mode, aspect-video
  <AiAnalysisPanel />       // REUSE from hub-swipe
  <VersionComparison />     // NEW component (see 3e)
  <ApprovalActionRow />     // ENHANCE existing action buttons + add schedule
  <VersionHistoryLog />     // NEW component (see 3f)
</motion.div>
```

**Panel animation:** slides in from right when first item selected; swaps content with
`AnimatePresence mode="wait"` + `x: 10 → 0` when switching between cards.

**Collapse:** When `selectedItemId === null`, panel has `w-0 opacity-0` (grid expands to fill).

---

### 3d. VideoPlayerInline (ADAPT — VideoLightbox from intelligence feature)

**Source:** `src/features/intelligence/VideoLightbox.tsx`

**Adaptation:** Add `mode: 'inline' | 'lightbox'` prop.
- `inline`: renders inside panel, `aspect-video w-full rounded-xl overflow-hidden`
- `lightbox`: existing full-screen behaviour (unchanged)
- Controls: play/pause, scrub bar, mute, fullscreen-expand icon (opens lightbox from inline)

---

### 3e. VersionComparison (NEW)

**File:** `src/features/approvals/components/VersionComparison.tsx`

**Purpose:** Side-by-side diff of V1 vs V2 (or latest two versions).

**Layout:**
```
┌──────────────────────────────────────────────────┐
│  VERSION COMPARISON                  [V1] [V2 ●] │
│  ┌─────────────────┐  ┌─────────────────┐        │
│  │  thumbnail V1   │  │  thumbnail V2   │        │
│  │  [▶ play V1]    │  │  [▶ play V2]    │        │
│  └─────────────────┘  └─────────────────┘        │
│                                                   │
│  Caption diff:                                    │
│  V1: "Monday grind starts early..."  (line-clamp-2) │
│  V2: "5am grind. The gym opens..." ← CHANGED      │
│                                                   │
│  Duration: V1 28s  →  V2 31s (+3s)               │
│  Hook: V1 score 74  →  V2 score 82 (+8 ↑)        │
└──────────────────────────────────────────────────┘
```

**Props:**
```ts
interface VersionComparisonProps {
  versions: Array<{
    version: number;
    // [FIXED] thumbnailGradient and thumbnailIcon removed — these are mock-only fields
    // Use thumbnailUrl from canonical reelVersions table; generate deterministic CSS gradient
    // from reelId+versionNumber hash internally when thumbnailUrl is null
    thumbnailUrl?: string;  // [FIXED] from reelVersions.thumbnailUrl
    caption: string;
    durationSeconds: number;
    hookScore: number;
    submittedAt: string;
  }>;
  activeVersions: [number, number];  // which two to compare, default [latest-1, latest]
  onVersionSelect: (v1: number, v2: number) => void;
}
// [FIXED] Deferred: version comparison diff logic (caption word diff, duration delta, hook score delta)
// deferred to Phase 4 — not needed for Phase 3 panel shell
```

**Only render when** `versions.length > 1`. When only one version exists, show
`"No previous version — this is V1"` placeholder in muted text.

---

### 3f. VersionHistoryLog (NEW — adapt SwipeAuditLog)

**Source:** `src/features/hub-swipe/SwipeAuditLog.tsx`

**File:** `src/features/approvals/components/VersionHistoryLog.tsx`

**Adaptation:** Change event types from swipe decisions to version events.

**Event types and badge colours:**
| Event | Badge colour |
|---|---|
| `submitted` | amber — `#d97706` |
| `approved` | green — `#16a34a` |
| `rejected` | red — `#dc2626` |
| `revision_requested` | orange — `#ea580c` |
| `scheduled` | purple — `#7c3aed` |
| `published` | indigo — `#4f46e5` |

**Layout:** Grouped by date (same as SwipeAuditLog). Each row:
```
[date group header: Apr 11]
  ● V2 submitted by VA Mikee       [Submitted]
  ● V2 approved by Alex            [Approved]
  ● Scheduled for Apr 14 10:00am   [Scheduled]
[date group header: Apr 09]
  ● V1 rejected — Bad hook, Off-brand  [Rejected]
  ● V1 submitted by VA Mikee       [Submitted]
```

---

### 3g. ScheduleDatePopup (NEW)

**File:** `src/features/approvals/components/ScheduleDatePopup.tsx`

**Trigger:** "Approve & Schedule" button in `ApprovalActionRow`. Uses shadcn `Popover`.

**Layout:**
```
┌──────────────────────────────────────┐
│  Schedule this reel                  │
│  ─────────────────────────────────  │
│  Recommended                         │
│  [📅 Monday Apr 14]  Best for niche  │
│                                      │
│  [calendar — shadcn DatePicker]      │
│                                      │
│  Time  [10:00 AM ▾]                  │
│                                      │
│  Platform  [IG Feed ▾]               │
│                                      │
│  ┌──────────────────────────────┐    │
│  │  Confirm Schedule  →         │    │
│  └──────────────────────────────┘    │
└──────────────────────────────────────┘
```

**Behaviour:**
1. Popover opens anchored below "Approve & Schedule" button
2. Pre-fills recommended date (passed as prop from parent, computed from niche posting schedule)
3. On "Confirm": calls `onApproveAndSchedule(itemId, scheduledDate)` → closes popup → sets
   status to `'approved'` + creates schedule entry → side panel shows confirmation state

**Styling:** `w-72 rounded-2xl p-5 bg-white` with `border: 1px solid rgba(0,0,0,0.09)`
and `boxShadow: 0 8px 32px rgba(0,0,0,0.12)`.

**Motion:** `initial={{ opacity:0, scale:0.95, y:-6 }} animate={{ opacity:1, scale:1, y:0 }}`

---

### 3h. BatchApprovalBar (NEW — port from QueueFeaturePage)

**File:** `src/features/approvals/components/BatchApprovalBar.tsx`

**Source pattern:** `QueueFeaturePage` bulk action bar (lines 218-261).

**Differences from QueueFeaturePage bar:**
- Adds `[📅 Schedule All]` button (not present in content-gen bar)
- Count badge: `bg-[#ff006918] text-[#ff0069]` (OFM pink, not purple)
- Label: `"{n} reels selected"` not `"{n} selected"`

**Props:**
```ts
interface BatchApprovalBarProps {
  selectedCount: number;
  onApproveAll: () => void;
  onRejectAll: () => void;
  onScheduleAll: () => void;
  onClear: () => void;
}
```

**Animation:** Identical spring to QueueFeaturePage:
`initial={{ y:80, opacity:0 }} animate={{ y:0, opacity:1 }}` with `stiffness:400 damping:30`.

---

### 3i. ModelSelectorPill (NEW — shared)

**File:** `src/shared/components/ModelSelectorPill.tsx`

**Purpose:** Filter by model (account) — dropdown pill in ContentPageShell filterRightSlot.

**Element:** Follows generic filter/control pill pattern (Design System §7b):
```tsx
<button className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium ...">
  <User size={12} style={{ color: '#ff0069' }} />
  {selectedModel ?? 'All Models'}
  <ChevronDown size={10} />
</button>
```
Dropdown: `w-48 rounded-xl` white panel, lists model avatars + handles.

---

### 3j. NicheFilterPill (NEW — shared)

**File:** `src/shared/components/NicheFilterPill.tsx`

**Same pattern as ModelSelectorPill** but for niche categories. Icon: `<Tag size={12} />`.
Options: Fitness, Lifestyle, Fashion, Beauty, Gaming, etc.

---

### 3k. PtpStatusStrip (NEW)

**File:** `src/features/approvals/components/PtpStatusStrip.tsx`

**Wraps existing `StatusStrip` component** with PTP-specific stats:
```tsx
<StatusStrip
  status={{ label: 'Review session', active: pendingCount > 0 }}
  stats={[
    { icon: <Clock size={10} />,      value: pendingCount,  label: 'pending' },
    { icon: <CheckCircle size={10} />, value: approvedToday, label: 'approved today' },
    { icon: <X size={10} />,           value: rejectedToday, label: 'rejected' },
    { icon: <Timer size={10} />,       value: avgSlaHours + 'h', label: 'avg SLA' },
  ]}
  rightSlot={<SlaThresholdBadge />}
/>
```

---

### 3l. SlaIndicator (NEW — small, lives inside ReelApprovalCard)

**Not a standalone file** — inline JSX inside `ApprovalCard.tsx`.

```tsx
{queueAgeHours >= 24 && status === 'pending' && (
  <div className="flex items-center gap-1 mt-1">
    <Clock size={9} style={{ color: queueAgeHours > 48 ? '#dc2626' : '#d97706' }} />
    <span
      className="text-[10px] font-medium"
      style={{ color: queueAgeHours > 48 ? '#dc2626' : '#d97706' }}
    >
      {queueAgeHours}h in queue
    </span>
  </div>
)}
```

---

### 3m. ApprovalActionRow (ENHANCE — was inline in DetailModal)

**Extracted to:** `src/features/approvals/components/ApprovalActionRow.tsx`

**Add vs Existing:**
| Button | Status | Change |
|---|---|---|
| Approve & Publish | EXISTING | RENAME to "Approve & Schedule" → triggers ScheduleDatePopup |
| Approve | EXISTING | Keep (approve without scheduling) |
| Request Revision | EXISTING | Keep — reveals RejectionReasonPicker |
| Reject | ADD | Hard reject (no revision path) — distinct from revision |
| ~~Delegate~~ | REMOVED | [FIXED] Per-reel Delegate button removed — delegation is a standing grant set in /agency/settings, not a per-reel action. Ambiguous semantics. Remove from ApprovalActionRow entirely. |

---

## 4. Interaction Spec

### 4a. Single Approve → Schedule
```
User clicks card → PtpDetailPanel opens (slides in from right, 300ms spring)
User watches video → reviews AI metadata → checks version comparison
User clicks [Approve & Schedule]
  → ScheduleDatePopup opens (popover, 180ms scale-in)
  → recommended date pre-filled (see 3g fix below)
  → user optionally changes date/time
  → clicks [Confirm Schedule →]
  → Convex mutation: api.reels.approveAndSchedule (ATOMIC) [FIXED]
      - updates reels.ptpStatus = 'scheduled'
      - inserts scheduledPosts row in same mutation
      - these two writes must be atomic — if either fails, neither applies
  → popup closes → panel shows ✓ confirmation state (green flash, 600ms)
  → card in grid: status badge flips to "Approved" (Framer Motion layout animation)
  → card in grid: version badge unchanged (V2 stays visible)
  → panel AUTO-ADVANCES to next pending card [FIXED — was "panel remains open" with no next-card logic]
      setSelectedItemId(nextPendingItemId ?? null)
```

> **[FIXED]** `ScheduleDatePopup` pre-fill: "passed as prop from parent, computed from niche posting schedule" is vague — no `nichePostingSchedule` data source exists. For MVP: use a simple "next weekday" default. Deferred: `api.schedule.getOptimalPostDate({ modelId, niche })` based on historical `scheduledPosts` data. Document chosen approach before build.

### 4b. Reject
```
User clicks [Reject] (hard reject) in ApprovalActionRow
  → action row animates out (height: auto → 0, 200ms)
  → RejectionFlow expands (height: 0 → auto, 220ms)
     → chip grid: [Bad hook] [Off-brand] [Poor quality] [Wrong niche] [Timing] [Other]
     → free text note textarea (optional)
     → [Notify Model] toggle (default ON)
     → [Send Rejection] button (disabled until ≥1 chip selected)
  → on Send: status → 'rejected', notification dispatched if toggle ON
  → panel shows rejection confirmation (red, 600ms) → auto-advances to next pending card [FIXED — auto-advance specified]
      setSelectedItemId(nextPendingItemId ?? null)
```

### 4c. Request Revision (existing flow, unchanged)
```
User clicks [⟳ Request Revision]
  → same RejectionReasonPicker as today (already built)
  → status → 'revision' (not 'rejected')
  → version counter does NOT increment (VA needs to resubmit → creates V2)
```

### 4d. Batch Select → Bulk Approve/Reject
```
User hovers over card → SelectCheckbox appears (top-left, opacity transition)
User clicks checkbox → card gets ring outline, selectedIds.add(id)
  → BatchApprovalBar slides up from bottom (spring, identical to QueueFeaturePage)
  → shows count badge
  → shows [✓ Approve All] [✕ Reject All] [📅 Schedule All] [×]

User clicks [✓ Approve All]:
  → all selected cards: status → 'approved'
  → BatchApprovalBar slides down + disappears
  → grid re-renders with layout animation (AnimatePresence mode="popLayout")

User clicks [📅 Schedule All]:
  → ScheduleDatePopup opens (applies same date to all selected)
  → on Confirm: all selected → 'approved' + scheduled
  → BatchApprovalBar disappears

User clicks [✕ Reject All]:
  → inline mini-modal appears ABOVE the bar: "Add rejection reason (optional)"
  → [Skip] or [Add reason] → applies bulk rejection
```

### 4e. Version Toggle in VersionComparison
```
VersionComparison shows two version selectors: [V1] [V2 ●]
User clicks V1 pill → left thumbnail active (border: 2px solid #ff0069)
User clicks V2 pill → right thumbnail active
Clicking thumbnail's [▶] → opens VideoLightbox in lightbox mode for that version

Diff rows animate in/out:
  - caption diff: highlight changed words (no library — split on words, compare)
  - duration delta: +Xs or -Xs badge
  - hook score delta: ↑ green or ↓ red arrow + number
```

### 4f. Detail Panel Keyboard Nav
```
Arrow keys (←→) while panel open: cycle through filtered cards  [KEEP]
Escape: close panel (selectedItemId = null → grid expands)       [KEEP]
// [FIXED] Single-key shortcuts A/S/R REMOVED — conflict with text inputs
// (rejection reason textarea, schedule time picker). Implement only Escape + arrow keys.
// Re-add A/S/R only after adding an activeElement guard:
//   if (document.activeElement?.tagName === 'INPUT' || 'TEXTAREA') return;
```

---

## 5. Reuse Instructions

### 5a. QueueFeaturePage batch bar pattern
**Source:** `src/features/content-gen/components/QueueFeaturePage.tsx` (lines 218-261)

Copy the `AnimatePresence` + `motion.div` block verbatim into `BatchApprovalBar.tsx`.
Change:
- Count badge colour: `bg-[#f0abfc] text-[#701a75]` → `bg-[#ff006918] text-[#ff0069]`
- Button set: remove Retry/Cancel, add Approve/Reject/Schedule
- String: `"selected"` → `"reels selected"`

The `selectedIds` state management pattern (lines 75, 103-107, 114-115) is copy-pasteable
directly into `ApprovalsFeaturePage`. Replace `Id<'contentGenJobs'>` with `string`.

### 5b. AiAnalysisPanel
**Source:** `src/features/hub-swipe/components/AiAnalysisPanel.tsx`

Drop in directly to `PtpDetailPanel`. No adaptation needed — it already renders:
- Hook score bar (0-100)
- Emotion chips
- Content breakdown
- Suggestions list

Pass `reel.aiAnalysis` (new field on `ApprovalItem`) as props. If null, render the panel
in skeleton state (`SkeletonCard` from intelligence feature).

### 5c. VideoLightbox
**Source:** `src/features/intelligence/VideoLightbox.tsx`

Add `mode` prop (inline vs lightbox). In PtpDetailPanel use `mode="inline"`. The existing
`onClick → lightbox` behaviour becomes an `onExpandClick` callback instead.

The inline expand icon (⛶) in the top-right of the inline player calls `setLightboxOpen(true)`
which switches the same component to full-screen mode.

### 5d. SwipeAuditLog → VersionHistoryLog
**Source:** `src/features/hub-swipe/SwipeAuditLog.tsx`

> **[FIXED]** `VersionHistoryLog` must query `api.reelVersions.forReel({ reelId })` and reconstruct the event timeline from `reelVersions` records — NOT from a denormalized `versionHistory` array on the reel. The canonical schema stores version history in the separate `reelVersions` table (each row is an immutable version snapshot).

Adapt event shape. The existing component groups events by date and renders rows with
coloured badges — that structure is kept exactly. Only change:
- `decision: 'pass' | 'swipe' | 'send'` → `eventType: VersionEventType`
- Badge colour map (see §3f above)
- Row text: `"{eventType} by {actor}"` instead of swipe decision labels
- Data source: `useQuery(api.reelVersions.forReel, { reelId })` → map to `AuditLogEntry[]` [FIXED]

Create `src/features/approvals/components/VersionHistoryLog.tsx` as a thin wrapper
that maps `reelVersions` records → `AuditLogEntry[]` and renders SwipeAuditLog.

---

## 6. Data Model Extensions

The following fields must be added to `ApprovalItem` in `types.ts`:

> **[FIXED]** `ApprovalItem` is a VIEW type assembled at query time from: `reels` (primary) + `reelVersions` (version data) + `models` (niche/handle). Do NOT add all fields to the `approvals` table directly.
> - `queueAgeHours` is computed at query time: `Math.floor((Date.now() - reel.updatedAt) / 3600000)` — NOT stored in DB (would go stale). Use `api.reels.getPendingWithAge` query that computes and returns it.
> - `versionHistory` is NOT a field on `reels` — query `api.reelVersions.forReel` instead.
> - `modelNiche` and `modelHandle` come from joining `models` table in the Convex query.
> - `aiAnalysis` is constructed in `PtpDetailPanel` from flat reel fields (`viralityScore`, `captionAI`, `hookVariants`) — NOT a nested object in the schema.

```ts
// NEW fields on ApprovalItem (VIEW type — assembled at query time)
version: number;                     // from reelVersions count [FIXED — joined]
// versionHistory removed — query api.reelVersions.forReel instead [FIXED]
aiAnalysis: AiAnalysisData | null;   // [FIXED] constructed from flat reel fields in PtpDetailPanel adapter
queueAgeHours: number;               // [FIXED] computed at query time, not stored
scheduledDate?: string;              // ISO string, set on Approve & Schedule
modelNiche: string;                  // [FIXED] joined from models table
modelHandle: string;                 // [FIXED] joined from models table (was `account`)
```

```ts
export interface ApprovalVersionEvent {
  version: number;
  eventType: 'submitted' | 'approved' | 'rejected' | 'revision_requested' | 'scheduled' | 'published';
  actor: string;            // "VA Mikee", "Alex (owner)"
  timestamp: string;        // ISO or display string
  note?: string;            // rejection reason or revision note
}
```

```ts
export interface AiAnalysisData {
  hookScore: number;         // 0-100
  emotions: string[];        // ["Energetic", "Bold", "Motivational"]
  suggestions: string[];     // ["Add text overlay at 2s", "Trim outro to 3s"]
  durationSeconds: number;
}
```

// [FIXED] Do NOT add versionHistory array to reels table — normalized in reelVersions table
// [FIXED] Do NOT add aiAnalysis nested object to reels — construct from existing flat fields
// [FIXED] Do NOT add queueAgeHours to reels — computed at query time only
// [FIXED] Do NOT add modelNiche/modelHandle to reels — joined from models table at query time
// Safe to add to reels table: scheduledDate (ISO string)
// Add to CONVEX_SCHEMA_ADDITIONS.md: scheduledDate field on reels

---

## 7. File Map — What Gets Created vs Changed

```
CHANGED (enhance, do not rebuild)
  src/features/approvals/components/ApprovalsFeaturePage.tsx
  src/features/approvals/components/ApprovalsTabContent.tsx   → becomes PtpReelGrid.tsx
  src/features/approvals/components/cards/ApprovalCard.tsx    → add version/select props
  src/features/approvals/types.ts                             → extend ApprovalItem

CREATED (new files)
  src/features/approvals/components/PtpDetailPanel.tsx
  src/features/approvals/components/VideoPlayerInline.tsx     → thin wrapper on VideoLightbox
  src/features/approvals/components/VersionComparison.tsx
  src/features/approvals/components/VersionHistoryLog.tsx     → adapter on SwipeAuditLog
  src/features/approvals/components/BatchApprovalBar.tsx      → port from QueueFeaturePage
  src/features/approvals/components/ScheduleDatePopup.tsx
  src/features/approvals/components/ApprovalActionRow.tsx     → extracted from DetailModal
  src/features/approvals/components/PtpStatusStrip.tsx
  src/shared/components/ModelSelectorPill.tsx
  src/shared/components/NicheFilterPill.tsx

UNCHANGED (do not touch)
  src/features/approvals/components/modals/RejectionReasonPicker.tsx
  src/features/approvals/components/modals/PlatformPreviewPanel.tsx
  src/features/approvals/components/states/EmptyState.tsx
  src/features/approvals/constants.tsx (extend ITEMS seed data only)
```

---

## 8. Build Order (phases for Bifrost workers)

**Phase 1 — Data layer**
- Extend `types.ts` (ApprovalItem + ApprovalVersionEvent + AiAnalysisData)
- Extend `constants.tsx` seed data with version/niche/AI fields
- No UI changes yet — zero visual regression risk

**Phase 2 — Card enhancement**
- Add version badge + select checkbox + SLA indicator to `ApprovalCard`
- Add `selectedIds` state to `ApprovalsFeaturePage`
- Wire `BatchApprovalBar` (port from QueueFeaturePage)
- Verify: grid still renders, batch bar slides up when cards checked

**Phase 3 — Side panel**
- Build `PtpDetailPanel` shell (no video/AI yet — just header + action row)
- Replace `DetailModal` with side panel on click
- Wire `ScheduleDatePopup` to "Approve & Schedule"
- Wire rejection flow (reuse existing `RejectionReasonPicker`)

**Phase 4 — Rich panel content**
- Wire `VideoPlayerInline` (adapt VideoLightbox)
- Wire `AiAnalysisPanel` (direct reuse)
- Build `VersionComparison`
- Build `VersionHistoryLog` (adapt SwipeAuditLog)

**Phase 5 — Filter bar + status strip**
- Add `ModelSelectorPill` + `NicheFilterPill` to filter bar right slot
- Add `PtpStatusStrip` below tab row
- Wire model/niche filter state to grid

**Verify at each phase:** `npm run build` from `/apps/isso-dashboard` before marking done.
