# My Week Wireframe + Component Spec
# Route: /model/week
# Features: M44
# Layout: MOBILE-FIRST (375px)
# Last updated: 2026-04-13

---

## 0. Context Summary

The model's unified weekly calendar. Merges webcam streaming schedule + content request
deadlines into a single view so the model can see her whole week at a glance. Mobile-first,
375px. Read-only — tapping an item shows detail. No editing.
OFM accent: `linear-gradient(135deg, #ff0069, #833ab4)`.

Design philosophy: One simple weekly view, color-coded by type (streams = pink, content = purple),
big enough to read at a glance. No information overload.

---

## 1. ASCII WIREFRAME — MOBILE (375px)

### Main view — Weekly (default)

```
┌─────────────────────────────────────────┐  375px
│  ░░░ IssoSidebarShell (56px icon rail) ░│
│                                         │
│  ┌───────────────────────────────────┐  │
│  │ ContentPageShell                  │  │
│  │                                   │  │
│  │ ┌─ ROW 1 — Header ──────────────┐ │  │  h-14 px-3
│  │ │ [📅] My Week   [★ 560 pts]    │ │  │
│  │ │                  [< Apr 7–13 >]│ │  │
│  │ └───────────────────────────────┘ │  │
│  │                                   │  │
│  │ ┌─ ROW 2 — Sub-nav ─────────────┐ │  │  px-3 py-2
│  │ │ [Week ●] [Month]              │ │  │
│  │ │  ● Stream  ● Content request  │ │  │  legend pills
│  │ └───────────────────────────────┘ │  │
│  │                                   │  │
│  │ ┌─ ROW 3 — Content ─────────────┐ │  │  overflow-y-auto px-4 py-4
│  │ │                               │ │  │
│  │ │ ┌─ WeekSummaryStrip ────────┐ │ │  │
│  │ │ │  3 streams · 2 deadlines  │ │ │  │
│  │ │ │  This week                │ │ │  │
│  │ │ └───────────────────────────┘ │ │  │
│  │ │                               │ │  │
│  │ │ ┌─ Day Row — MON Apr 7 ─────┐ │ │  │
│  │ │ │  MON  7                   │ │ │  │
│  │ │ │  ────────────────────     │ │ │  │
│  │ │ │  ┌─ StreamSlot ─────────┐ │ │ │  │  pink border
│  │ │ │  │ 📹 8:00–10:30 PM     │ │ │ │  │
│  │ │ │  │ OF · Fansly · Chat   │ │ │ │  │
│  │ │ │  └─────────────────────┘ │ │ │  │
│  │ │ └───────────────────────────┘ │ │  │
│  │ │                               │ │  │
│  │ │ ┌─ Day Row — TUE Apr 8 ─────┐ │ │  │
│  │ │ │  TUE  8   (today)          │ │ │  │  "today" highlight
│  │ │ │  ────────────────────      │ │ │  │
│  │ │ │  ┌─ DeadlineCard ───────┐  │ │ │  │  purple border
│  │ │ │  │ 📋 Summer Vlog due   │  │ │ │  │
│  │ │ │  │ ⏰ 11:59 PM tonight  │  │ │ │  │
│  │ │ │  │ ⚠ Upload not done   │  │ │ │  │  red indicator
│  │ │ │  └─────────────────────┘  │ │ │  │
│  │ │ └───────────────────────────┘ │ │  │
│  │ │                               │ │  │
│  │ │ ┌─ Day Row — WED Apr 9 ─────┐ │ │  │
│  │ │ │  WED  9                   │ │ │  │
│  │ │ │  ┌─ StreamSlot ─────────┐ │ │ │  │
│  │ │ │  │ 📹 8:00–10:00 PM     │ │ │ │  │
│  │ │ │  │ OF · Fansly          │ │ │ │  │
│  │ │ │  └─────────────────────┘ │ │ │  │
│  │ │ └───────────────────────────┘ │ │  │
│  │ │                               │ │  │
│  │ │ ┌─ Day Row — THU Apr 10 ────┐ │ │  │
│  │ │ │  THU  10                  │ │ │  │
│  │ │ │  ┌─ StreamSlot ─────────┐ │ │ │  │
│  │ │ │  │ 📹 8:00–11:00 PM     │ │ │ │  │
│  │ │ │  └─────────────────────┘ │ │ │  │
│  │ │ │  ┌─ DeadlineCard ───────┐ │ │ │  │
│  │ │ │  │ 📋 Dance Trend due   │ │ │ │  │
│  │ │ │  │ ⏰ 5:00 PM           │ │ │ │  │
│  │ │ │  │ ✓ Uploaded           │ │ │ │  │  green = done
│  │ │ │  └─────────────────────┘ │ │ │  │
│  │ │ └───────────────────────────┘ │ │  │
│  │ │                               │ │  │
│  │ │ ┌─ Day Row — FRI Apr 11 ────┐ │ │  │
│  │ │ │  FRI  11   (empty)        │ │ │  │
│  │ │ │  ─ Nothing scheduled      │ │ │  │  muted empty state
│  │ │ └───────────────────────────┘ │ │  │
│  │ │                               │ │  │
│  │ │ ┌─ Day Row — SAT Apr 12 ────┐ │ │  │
│  │ │ │  SAT  12                  │ │ │  │
│  │ │ │  ┌─ StreamSlot ─────────┐ │ │ │  │
│  │ │ │  │ 📹 7:00 PM–12:00 AM  │ │ │ │  │
│  │ │ │  └─────────────────────┘ │ │ │  │
│  │ │ └───────────────────────────┘ │ │  │
│  │ │                               │ │  │
│  │ │ ┌─ Day Row — SUN Apr 13 ────┐ │ │  │
│  │ │ │  SUN  13   (empty)        │ │ │  │
│  │ │ └───────────────────────────┘ │ │  │
│  │ │                               │ │  │
│  │ └───────────────────────────────┘ │  │
│  └───────────────────────────────────┘  │
└─────────────────────────────────────────┘
```

### Item detail sheet (tap a StreamSlot or DeadlineCard)

```
┌─────────────────────────────────────────┐
│  ┌─ Bottom Sheet ─────────────────────┐ │
│  │  ▬▬▬  (drag handle)               │ │
│  │                                   │ │
│  │  STREAM DETAIL                    │ │
│  │  Monday Apr 7, 8:00–10:30 PM      │ │
│  │  2h 30m target                    │ │
│  │                                   │ │
│  │  Platforms:                       │ │
│  │  [OF] OnlyFans                    │ │
│  │  [Fan] Fansly                     │ │
│  │  [CB] Chaturbate                  │ │
│  │                                   │ │
│  │  [→ Open Webcam Page]             │ │
│  │                                   │ │
│  │  ─── OR ───                       │ │
│  │                                   │ │
│  │  CONTENT REQUEST DETAIL           │ │
│  │  Summer Vlog                      │ │
│  │  Due: Tonight 11:59 PM            │ │
│  │  Status: ⚠ Not uploaded yet       │ │
│  │                                   │ │
│  │  ╔═══════════════════════════════╗ │ │
│  │  ║  Upload Now  →               ║ │ │
│  │  ╚═══════════════════════════════╝ │ │
│  │                                   │ │
│  └───────────────────────────────────┘ │
└─────────────────────────────────────────┘
```

### Monthly view (when Month tab selected)

```
┌─────────────────────────────────────────┐
│  ┌─ MonthGrid ────────────────────────┐ │
│  │  April 2026                        │ │
│  │                                    │ │
│  │  Mo  Tu  We  Th  Fr  Sa  Su        │ │
│  │   -   -   1   2   3   4   5        │ │
│  │   6   7🔴  8📋  9🔴 10🔴📋 11  12🔴 │ │
│  │  13  14  15📋 16  17🔴 18  19🔴    │ │
│  │  ...                               │ │
│  │                                    │ │
│  │  🔴 = stream   📋 = content deadline│ │
│  └────────────────────────────────────┘ │
└─────────────────────────────────────────┘
```

---

## 2. COMPONENT TREE

```
MyWeekFeaturePage                         ← default export
│
├── ContentPageShell
│   ├── [header slot]
│   │   ├── ProductIcon (calendar icon)
│   │   ├── "My Week" title
│   │   ├── PointsStatPill
│   │   └── WeekNavigator                 ← < Apr 7–13 > arrows
│   │
│   ├── [sub-nav slot]
│   │   ├── ViewTabs (Week / Month)
│   │   └── LegendPills                   ← ● Stream  ● Content Request
│   │
│   └── [content slot — AnimatePresence]
│       ├── WeekView (default)
│       │   ├── WeekSummaryStrip          ← NEW
│       │   └── DayRow[] × 7             ← NEW
│       │       ├── DayHeader
│       │       ├── StreamSlotItem[]      ← ADAPT from WebcamCalendar
│       │       └── DeadlineCard[]        ← NEW
│       │
│       └── MonthView
│           └── UnifiedMonthGrid          ← NEW (dots for both event types)
│
└── ItemDetailSheet                       ← NEW (bottom sheet)
    ├── StreamSlotDetail
    │   └── "Open Webcam" link
    └── DeadlineDetail
        └── "Upload Now" CTA → /model/requests
```

---

## 3. PER-COMPONENT SPECS

---

### 3.1 WeekSummaryStrip

**File:** `src/features/my-week/components/WeekSummaryStrip.tsx`

```tsx
interface WeekSummaryStripProps {
  streamCount: number;
  deadlineCount: number;
  overdueCount: number;
  weekLabel: string;   // e.g. "This week"
}
```

**Tailwind:**
```tsx
<div className="flex items-center gap-4 rounded-xl px-4 py-3 mb-1"
  style={{ background: 'rgba(0,0,0,0.02)', border: '1px solid rgba(0,0,0,0.06)' }}
>
  <div className="flex items-center gap-1.5">
    <div className="w-2.5 h-2.5 rounded-full bg-[#ff0069]" />
    <span className="text-xs text-neutral-600">
      <strong className="text-neutral-900">{streamCount}</strong> stream{streamCount !== 1 ? 's' : ''}
    </span>
  </div>
  <div className="flex items-center gap-1.5">
    <div className="w-2.5 h-2.5 rounded-full bg-[#833ab4]" />
    <span className="text-xs text-neutral-600">
      <strong className="text-neutral-900">{deadlineCount}</strong> deadline{deadlineCount !== 1 ? 's' : ''}
    </span>
  </div>
  {overdueCount > 0 && (
    <div className="flex items-center gap-1 ml-auto">
      <AlertTriangle size={11} className="text-red-500" />
      <span className="text-xs font-semibold text-red-500">{overdueCount} overdue</span>
    </div>
  )}
</div>
```

---

### 3.2 DayRow

**File:** `src/features/my-week/components/DayRow.tsx`

```tsx
interface DayRowProps {
  date: Date;
  streams: StreamSlot[];
  deadlines: ContentDeadline[];
  onItemTap: (item: StreamSlot | ContentDeadline) => void;
}
```

**Tailwind:**
```tsx
<div className={cn(
  'rounded-xl overflow-hidden',
  isToday(date) ? 'ring-2 ring-[#ff0069]/30' : ''
)}>
  {/* Day header */}
  <div className={cn(
    'flex items-center gap-2 px-4 py-2.5',
    isToday(date)
      ? 'bg-gradient-to-r from-[rgba(255,0,105,0.06)] to-transparent'
      : 'bg-neutral-50'
  )}
    style={{ borderBottom: '1px solid rgba(0,0,0,0.05)' }}
  >
    <p className={cn(
      'text-sm font-semibold',
      isToday(date) ? 'text-[#ff0069]' : 'text-neutral-700'
    )}>
      {format(date, 'EEE')}
    </p>
    <p className={cn(
      'text-sm',
      isToday(date) ? 'text-[#ff0069] font-bold' : 'text-neutral-400'
    )}>
      {format(date, 'd')}
    </p>
    {isToday(date) && (
      <span className="ml-1 text-[10px] font-semibold px-1.5 py-0.5 rounded-full bg-[#ff0069] text-white">
        today
      </span>
    )}
  </div>

  {/* Events */}
  <div className="bg-white px-3 py-2 space-y-2">
    {streams.map(s => (
      <StreamSlotItem key={s.id} slot={s} onTap={() => onItemTap(s)} />
    ))}
    {deadlines.map(d => (
      <DeadlineItem key={d.id} deadline={d} onTap={() => onItemTap(d)} />
    ))}
    {streams.length === 0 && deadlines.length === 0 && (
      <p className="text-xs text-neutral-300 py-1.5 px-1">Nothing scheduled</p>
    )}
  </div>
</div>
```

---

### 3.3 StreamSlotItem

**File:** `src/features/my-week/components/StreamSlotItem.tsx`

```tsx
interface StreamSlotItemProps {
  slot: StreamSlot;
  onTap: () => void;
}
```

**Tailwind:**
```tsx
<motion.button
  onClick={onTap}
  className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-left transition-colors active:scale-[0.98]"
  style={{ background: 'rgba(255,0,105,0.04)', border: '1px solid rgba(255,0,105,0.15)' }}
  whileTap={{ scale: 0.98 }}
>
  {/* Left accent bar */}
  <div className="w-1 self-stretch rounded-full bg-[#ff0069] flex-shrink-0" />

  <div className="flex-1 min-w-0">
    <div className="flex items-center gap-2">
      <span className="text-sm">📹</span>
      <p className="text-sm font-medium text-neutral-800">
        {format(slot.startAt, 'h:mm a')} – {format(slot.endAt, 'h:mm a')}
      </p>
    </div>
    <div className="flex items-center gap-1 mt-0.5">
      {slot.platforms.slice(0, 3).map(p => (
        <PlatformIcon key={p} platform={p} size={12} />
      ))}
      {slot.platforms.length > 3 && (
        <span className="text-[10px] text-neutral-400">+{slot.platforms.length - 3}</span>
      )}
    </div>
  </div>

  <ChevronRight size={14} className="text-neutral-300 flex-shrink-0" />
</motion.button>
```

---

### 3.4 DeadlineItem

**File:** `src/features/my-week/components/DeadlineItem.tsx`

```tsx
interface ContentDeadline {
  id: string;
  title: string;
  deadlineAt: number;   // Unix ms
  status: 'pending' | 'uploaded' | 'overdue';
}

interface DeadlineItemProps {
  deadline: ContentDeadline;
  onTap: () => void;
}
```

**Status colors:**
- `pending`: purple border, neutral text
- `uploaded`: green tint, checkmark, muted text
- `overdue`: red border + red text + warning icon

**Tailwind:**
```tsx
<motion.button
  onClick={onTap}
  className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-left active:scale-[0.98]"
  style={
    deadline.status === 'overdue'
      ? { background: 'rgba(239,68,68,0.04)', border: '1px solid rgba(239,68,68,0.25)' }
      : deadline.status === 'uploaded'
      ? { background: 'rgba(34,197,94,0.04)', border: '1px solid rgba(34,197,94,0.20)' }
      : { background: 'rgba(131,58,180,0.04)', border: '1px solid rgba(131,58,180,0.15)' }
  }
  whileTap={{ scale: 0.98 }}
>
  {/* Left accent bar */}
  <div className={cn(
    'w-1 self-stretch rounded-full flex-shrink-0',
    deadline.status === 'overdue' ? 'bg-red-500'
    : deadline.status === 'uploaded' ? 'bg-green-500'
    : 'bg-[#833ab4]'
  )} />

  <div className="flex-1 min-w-0">
    <div className="flex items-center gap-2">
      <span className="text-sm">📋</span>
      <p className={cn(
        'text-sm font-medium truncate',
        deadline.status === 'uploaded' ? 'text-neutral-400 line-through' : 'text-neutral-800'
      )}>
        {deadline.title}
      </p>
    </div>
    <div className="flex items-center gap-1.5 mt-0.5">
      {deadline.status === 'overdue' && (
        <AlertTriangle size={10} className="text-red-500" />
      )}
      {deadline.status === 'uploaded' && (
        <CheckCircle size={10} className="text-green-500" />
      )}
      <span className={cn(
        'text-xs',
        deadline.status === 'overdue' ? 'text-red-500 font-semibold'
        : deadline.status === 'uploaded' ? 'text-green-600'
        : 'text-neutral-400'
      )}>
        {deadline.status === 'uploaded'
          ? 'Uploaded ✓'
          : deadline.status === 'overdue'
          ? 'Overdue!'
          : <DeadlineCountdown deadlineAt={deadline.deadlineAt} />
        }
      </span>
    </div>
  </div>

  <ChevronRight size={14} className="text-neutral-300 flex-shrink-0" />
</motion.button>
```

---

### 3.5 ItemDetailSheet

**File:** `src/features/my-week/components/ItemDetailSheet.tsx`

```tsx
type DetailItem = StreamSlot | ContentDeadline;

interface ItemDetailSheetProps {
  item: DetailItem | null;
  onClose: () => void;
}
```

**Pattern:** Bottom sheet (same as BriefDetailDrawer from content-requests — slide up from bottom).

```tsx
<AnimatePresence>
  {item && (
    <>
      <motion.div
        className="fixed inset-0 bg-black/40 z-40"
        initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
        onClick={onClose}
      />
      <motion.div
        className="fixed inset-x-0 bottom-0 z-50 bg-white rounded-t-2xl"
        style={{ maxHeight: '70vh' }}
        initial={{ y: '100%' }}
        animate={{ y: 0 }}
        exit={{ y: '100%' }}
        transition={{ type: 'spring', stiffness: 400, damping: 35 }}
      >
        {/* Drag handle */}
        <div className="flex justify-center pt-3 pb-2">
          <div className="w-9 h-1 rounded-full bg-neutral-200" />
        </div>

        <div className="px-5 pb-6">
          {isStream(item) ? (
            <StreamSlotDetail slot={item} onClose={onClose} />
          ) : (
            <DeadlineDetail deadline={item} onClose={onClose} />
          )}
        </div>
      </motion.div>
    </>
  )}
</AnimatePresence>
```

**StreamSlotDetail:**
```tsx
<div className="space-y-4">
  <div>
    <p className="text-[11px] uppercase tracking-[0.35em] text-neutral-400">Stream</p>
    <p className="text-base font-semibold text-neutral-900 mt-1">
      {format(slot.startAt, 'EEEE, MMMM d')}
    </p>
    <p className="text-sm text-neutral-500">
      {format(slot.startAt, 'h:mm a')} – {format(slot.endAt, 'h:mm a')}
      {' · '}{Math.round((slot.endAt - slot.startAt) / 3600000)}h target
    </p>
  </div>
  <div className="space-y-2">
    {slot.platforms.map(p => (
      <div key={p} className="flex items-center gap-2">
        <PlatformIcon platform={p} size={16} />
        <span className="text-sm text-neutral-700 capitalize">{p}</span>
      </div>
    ))}
  </div>
  <a href="/model/webcam"
    className="flex items-center justify-center gap-2 w-full py-3 rounded-xl text-sm font-semibold text-white"
    style={{ background: 'linear-gradient(135deg, #ff0069, #833ab4)' }}
  >
    Open Webcam Page <ArrowRight size={14} />
  </a>
</div>
```

**DeadlineDetail:**
```tsx
<div className="space-y-4">
  <div>
    <p className="text-[11px] uppercase tracking-[0.35em] text-neutral-400">Content Request</p>
    <p className="text-base font-semibold text-neutral-900 mt-1">{deadline.title}</p>
    <DeadlineCountdown deadlineAt={deadline.deadlineAt} className="mt-1" />
  </div>

  <div className={cn(
    'flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium',
    deadline.status === 'uploaded'
      ? 'bg-green-50 text-green-700'
      : deadline.status === 'overdue'
      ? 'bg-red-50 text-red-600'
      : 'bg-neutral-50 text-neutral-600'
  )}>
    {deadline.status === 'uploaded'
      ? <><CheckCircle size={14} /> Uploaded — waiting for approval</>
      : deadline.status === 'overdue'
      ? <><AlertTriangle size={14} /> Overdue — upload as soon as possible</>
      : <><Clock size={14} /> Not uploaded yet</>
    }
  </div>

  {deadline.status !== 'uploaded' && (
    <a href={`/model/requests`}
      className="flex items-center justify-center gap-2 w-full py-3 rounded-xl text-sm font-semibold text-white"
      style={{ background: 'linear-gradient(135deg, #ff0069, #833ab4)' }}
    >
      Upload Now <ArrowRight size={14} />
    </a>
  )}
</div>
```

---

### 3.6 LegendPills (sub-nav)

```tsx
// Inline in sub-nav right slot — not extracted
<div className="flex items-center gap-3 ml-auto">
  <div className="flex items-center gap-1">
    <div className="w-2 h-2 rounded-full bg-[#ff0069]" />
    <span className="text-[11px] text-neutral-500">Stream</span>
  </div>
  <div className="flex items-center gap-1">
    <div className="w-2 h-2 rounded-full bg-[#833ab4]" />
    <span className="text-[11px] text-neutral-500">Deadline</span>
  </div>
</div>
```

---

## 4. INTERACTION SPEC

### 4.1 Week navigation
```
User taps < or > in WeekNavigator
  → weekStart state shifts by ±7 days
  → DayRow list re-renders for the new week
  → AnimatePresence slide transition: x: 20→0 (forward), x: -20→0 (back)
  → WeekSummaryStrip recalculates stream/deadline counts
```

### 4.2 Tap item → detail sheet
```
User taps StreamSlotItem or DeadlineItem
  → setSelectedItem(item)
  → ItemDetailSheet animates up (spring, y: 100% → 0)
  → Tap backdrop or drag down: sheet dismisses
```

### 4.3 Deadline "Upload Now" CTA
```
User taps Upload Now in DeadlineDetail
  → Navigate to /model/requests
  → The content requests page auto-opens the matching brief
    (pass requestId as query param: /model/requests?open={id})
```

### 4.4 View switch (Week ↔ Month)
```
User taps Month tab
  → AnimatePresence mode="wait" transitions to UnifiedMonthGrid
  → Shows dots on days (🔴 = stream, 📋 = deadline)
  → Tap a day → switch to Week view scrolled to that day
```

---

## 5. GAMIFICATION INTEGRATION

This page is primarily a read-only calendar view. No direct point-earning actions.

Gamification touchpoints:
- `PointsStatPill` in header shows running total
- Overdue deadlines show warning state — incentive to act (points for uploading are in content-requests)
- Completed deadlines show green ✓ — positive reinforcement

---

## 6. REUSE INSTRUCTIONS

| Component | Source | Notes |
|-----------|--------|-------|
| `DeadlineCountdown` | `@/features/content-requests/` | Reuse directly — same countdown logic |
| `PointsStatPill` | `@/features/content-requests/` | Shared gamification |
| Bottom sheet pattern | `BriefDetailDrawer` in content-requests | Same spring animation pattern |
| `StreamSlot` type | `@/features/webcam/` | Shared type — same data shape |

---

## 7. FILE STRUCTURE

```
src/features/my-week/
  components/
    MyWeekFeaturePage.tsx
    WeekSummaryStrip.tsx
    DayRow.tsx
    StreamSlotItem.tsx
    DeadlineItem.tsx
    ItemDetailSheet.tsx
    StreamSlotDetail.tsx
    DeadlineDetail.tsx
    WeekNavigator.tsx
    LegendPills.tsx
    UnifiedMonthGrid.tsx
    index.ts
  hooks/
    useWeekData.ts    ← merges webcamSchedule + contentRequests queries
  types.ts

src/app/model/week/page.tsx    ← thin wrapper only
```

---

## 8. DESIGN TOKEN SUMMARY

| Token | Value | Use |
|-------|-------|-----|
| Stream pink | `#ff0069` | Stream items, left accent bar, today highlight |
| Deadline purple | `#833ab4` | Deadline items, left accent bar |
| Overdue red | `text-red-500` / `rgba(239,68,68,...)` | Overdue deadline |
| Done green | `text-green-600` / `rgba(34,197,94,...)` | Uploaded deadline |
| Card border | `rgba(0,0,0,0.07)` | DayRow outer |
| Today ring | `ring-2 ring-[#ff0069]/30` | Today's DayRow |
| OFM gradient | `linear-gradient(135deg, #ff0069, #833ab4)` | CTAs in detail sheet |
