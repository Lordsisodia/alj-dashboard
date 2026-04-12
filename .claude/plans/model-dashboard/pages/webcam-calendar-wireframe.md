# Webcam Calendar Wireframe + Component Spec
# Route: /model/webcam/calendar
# Features: M3
# Layout: LAPTOP (desktop-first — streaming is done on laptop)
# Last updated: 2026-04-13

---

## 0. Context Summary

The Stream Schedule page is the model's read-only calendar showing upcoming streaming slots.
Desktop layout (laptop). Three zoom levels: daily, weekly, monthly. Each slot shows platform
icons and scheduled time. OFM accent: `linear-gradient(135deg, #ff0069, #833ab4)`.

---

## 1. ASCII WIREFRAME — LAPTOP (1280px)

```
┌────────────────────────────────────────────────────────────────────────────────────────────┐
│  IssoSidebarShell                                                                          │
│                                                                                            │
│  ┌─────────────────────────────────────────────────────────────────────────────────────┐   │
│  │ ContentPageShell                                                                    │   │
│  │                                                                                     │   │
│  │ ┌─ ROW 1 — Header ─────────────────────────────────────────────────────────────┐   │   │
│  │ │  [📹 icon]  Webcam                     [★ 1,240 pts]        [< Apr 2026 >]  │   │   │
│  │ └──────────────────────────────────────────────────────────────────────────────┘   │   │
│  │                                                                                     │   │
│  │ ┌─ ROW 2 — Sub-nav ────────────────────────────────────────────────────────────┐   │   │
│  │ │  [🏠 Home]  [📊 Stats]  [📅 Calendar ●]    [Day] [Week ●] [Month]           │   │   │
│  │ └──────────────────────────────────────────────────────────────────────────────┘   │   │
│  │                                                                                     │   │
│  │ ┌─ ROW 3 — Content ────────────────────────────────────────────────────────────┐   │   │
│  │ │                                                                              │   │   │
│  │ │  WEEKLY VIEW (default)                                                       │   │   │
│  │ │                                                                              │   │   │
│  │ │  ┌─ CalendarGrid (week) ──────────────────────────────────────────────────┐  │   │   │
│  │ │  │                                                                        │  │   │   │
│  │ │  │       MON 7    TUE 8    WED 9    THU 10   FRI 11   SAT 12   SUN 13    │  │   │   │
│  │ │  │      ────────────────────────────────────────────────────────────────  │  │   │   │
│  │ │  │ 6PM  │        │        │        │        │        │         │         │  │   │   │
│  │ │  │      │        │        │        │        │        │         │         │  │   │   │
│  │ │  │ 7PM  │        │        │        │        │        │         │         │  │   │   │
│  │ │  │      │        │        │        │ ┌────┐ │        │         │         │  │   │   │
│  │ │  │ 8PM  │ ┌────┐ │        │ ┌────┐ │ │OF  │ │        │ ┌──────┐│         │  │   │   │
│  │ │  │      │ │OF  │ │        │ │OF  │ │ │Fan.│ │        │ │OF    ││         │  │   │   │
│  │ │  │ 9PM  │ │Fan.│ │        │ │Fan.│ │ │Chat│ │        │ │Fan.  ││         │  │   │   │
│  │ │  │      │ │Chat│ │        │ │    │ │ │    │ │        │ │Chat  ││         │  │   │   │
│  │ │  │10PM  │ │    │ │        │ └────┘ │ │    │ │        │ │Strip.││         │  │   │   │
│  │ │  │      │ └────┘ │        │        │ └────┘ │        │ └──────┘│         │  │   │   │
│  │ │  │11PM  │        │        │        │        │        │         │         │  │   │   │
│  │ │  └────────────────────────────────────────────────────────────────────────┘  │   │   │
│  │ │                                                                              │   │   │
│  │ │  ┌─ StreamSlot detail (on click) ──────────────────────────────────────────┐ │   │   │
│  │ │  │  Monday Apr 7 — 8:00 PM to 10:30 PM (2h 30m)                           │ │   │   │
│  │ │  │                                                                         │ │   │   │
│  │ │  │  Platforms: [OF icon] OnlyFans  [Fansly icon] Fansly  [Chat] Chaturbate │ │   │   │
│  │ │  │                                                                         │ │   │   │
│  │ │  │  Target: 3h   Minimum: 2h                                               │ │   │   │
│  │ │  │                                                                         │ │   │   │
│  │ │  │  [Close ×]                                                              │ │   │   │
│  │ │  └─────────────────────────────────────────────────────────────────────────┘ │   │   │
│  │ │                                                                              │   │   │
│  │ └──────────────────────────────────────────────────────────────────────────────┘   │   │
│  └─────────────────────────────────────────────────────────────────────────────────────┘   │
└────────────────────────────────────────────────────────────────────────────────────────────┘
```

### DAILY VIEW (when Day tab active)

```
┌─ CalendarGrid (day) ──────────────────────────────────────────────────────────────────┐
│  Thursday, April 10                                                                   │
│                                                                                       │
│  6:00 PM  ─────────────────────────────────────────────────────────────               │
│  7:00 PM  ─────────────────────────────────────────────────────────────               │
│  8:00 PM  ┌──────────────────────────────────────────────────────────────┐            │
│           │  🔴 SCHEDULED STREAM                                         │            │
│           │  8:00 PM – 11:00 PM  (3h target)                            │            │
│           │  Platforms: [OF] [Fansly] [Chaturbate]                      │            │
│           │                                                              │            │
│  9:00 PM  │                                                              │            │
│           │                                                              │            │
│  10:00 PM │                                                              │            │
│           │                                                              │            │
│  11:00 PM └──────────────────────────────────────────────────────────────┘            │
│  12:00 AM ─────────────────────────────────────────────────────────────               │
└───────────────────────────────────────────────────────────────────────────────────────┘
```

### MONTHLY VIEW (when Month tab active)

```
┌─ CalendarGrid (month) ──────────────────────────────────────────────────────────────┐
│  April 2026                                                                         │
│                                                                                     │
│  Mon   Tue   Wed   Thu   Fri   Sat   Sun                                            │
│  ┌───┐ ┌───┐ ┌───┐ ┌───┐ ┌───┐ ┌───┐ ┌───┐                                        │
│  │   │ │   │ │ 1 │ │ 2 │ │ 3 │ │ 4 │ │ 5 │                                        │
│  └───┘ └───┘ └───┘ └───┘ └─🔴┘ └───┘ └─🔴┘                                        │
│  ┌───┐ ┌───┐ ┌───┐ ┌───┐ ┌───┐ ┌───┐ ┌───┐                                        │
│  │ 6 │ │ 7 │ │ 8 │ │ 9 │ │10 │ │11 │ │12 │                                        │
│  └───┘ └─🔴┘ └───┘ └─🔴┘ └─🔴┘ └───┘ └─🔴┘                                        │
│  ...                                                                                │
│                                                                                     │
│  🔴 = stream scheduled                                                              │
│  📊 Stats this month: 14 streams · 42h total · £9,800 earned                       │
└─────────────────────────────────────────────────────────────────────────────────────┘
```

---

## 2. COMPONENT TREE

```
WebcamCalendarFeaturePage                 ← default export
│
├── ContentPageShell
│   ├── [header slot]
│   │   ├── ProductIcon (webcam)
│   │   ├── "Webcam" title
│   │   ├── PointsStatPill
│   │   └── MonthNavigator                ← < Apr 2026 > arrows
│   │
│   ├── [sub-nav slot]
│   │   ├── Tab: "Home" → /model/webcam
│   │   ├── Tab: "Stats" → /model/webcam/stats
│   │   ├── Tab: "Calendar" (active)
│   │   └── ViewToggle (Day / Week / Month) ← inline in sub-nav right slot
│   │
│   └── [content slot]
│       ├── AnimatePresence (view transitions)
│       │   ├── DayCalendarView           ← NEW
│       │   ├── WeekCalendarView          ← NEW (default)
│       │   └── MonthCalendarView         ← NEW
│       │
│       └── StreamSlotDetailPanel        ← NEW (appears on click, flyout below)
```

---

## 3. PER-COMPONENT SPECS

---

### 3.1 WeekCalendarView

**File:** `src/features/webcam/components/WeekCalendarView.tsx`

```tsx
interface StreamSlot {
  id: string;
  startAt: number;    // Unix ms
  endAt: number;
  platforms: string[];
  targetHours?: number;
  minHours?: number;
}

interface WeekCalendarViewProps {
  slots: StreamSlot[];
  weekStart: Date;
  onSlotClick: (slot: StreamSlot) => void;
}
```

**Layout:** 7-column grid (one per day). Time axis on left (6 PM–midnight). Each StreamSlot
renders as a colored block, height proportional to duration.

```tsx
<div className="flex gap-0 overflow-x-auto">
  {/* Time axis */}
  <div className="w-12 flex flex-col text-right pr-2">
    {hours.map(h => (
      <div key={h} className="h-16 flex items-start">
        <span className="text-[10px] text-neutral-400">{h}</span>
      </div>
    ))}
  </div>

  {/* Day columns */}
  {weekDays.map(day => (
    <div key={day.toISOString()} className="flex-1 min-w-0 border-l border-neutral-100">
      {/* Day header */}
      <div className={cn(
        'text-center py-2 text-xs font-medium',
        isToday(day) ? 'text-[#ff0069] font-semibold' : 'text-neutral-400'
      )}>
        <span className="block">{format(day, 'EEE')}</span>
        <span className={cn(
          'inline-flex w-6 h-6 rounded-full items-center justify-center text-xs mt-0.5',
          isToday(day) ? 'bg-[#ff0069] text-white' : ''
        )}>
          {format(day, 'd')}
        </span>
      </div>

      {/* Slots */}
      <div className="relative" style={{ height: `${hours.length * 64}px` }}>
        {slotsForDay(day).map(slot => (
          <StreamSlotBlock
            key={slot.id}
            slot={slot}
            onClick={() => onSlotClick(slot)}
            hourHeight={64}
            dayStart={startOfStreamDay(day)}
          />
        ))}
      </div>
    </div>
  ))}
</div>
```

---

### 3.2 StreamSlotBlock

**File:** `src/features/webcam/components/StreamSlotBlock.tsx`

```tsx
interface StreamSlotBlockProps {
  slot: StreamSlot;
  onClick: () => void;
  hourHeight: number;   // px per hour
  dayStart: Date;       // reference point for positioning
}
```

**Positioning:** Absolutely positioned within day column. Top = offset from dayStart in hours × hourHeight.

```tsx
<motion.button
  onClick={onClick}
  className="absolute inset-x-1 rounded-lg overflow-hidden text-left"
  style={{
    top: `${offsetHours * hourHeight}px`,
    height: `${durationHours * hourHeight - 4}px`,
    background: 'linear-gradient(135deg, rgba(255,0,105,0.15), rgba(131,58,180,0.15))',
    border: '1px solid rgba(255,0,105,0.30)',
  }}
  whileHover={{ scale: 1.02 }}
  transition={{ type: 'spring', stiffness: 400, damping: 25 }}
>
  <div className="px-2 py-1.5">
    <div className="flex gap-0.5 flex-wrap mb-1">
      {slot.platforms.slice(0, 3).map(p => (
        <PlatformIcon key={p} platform={p} size={12} />
      ))}
    </div>
    <p className="text-[10px] font-semibold" style={{ color: '#ff0069' }}>
      {format(slot.startAt, 'h:mm a')}
    </p>
    {durationHours >= 1.5 && (
      <p className="text-[9px] text-neutral-400">{durationHours}h</p>
    )}
  </div>
</motion.button>
```

---

### 3.3 StreamSlotDetailPanel

**File:** `src/features/webcam/components/StreamSlotDetailPanel.tsx`

```tsx
interface StreamSlotDetailPanelProps {
  slot: StreamSlot | null;
  onClose: () => void;
}
```

**Pattern:** Flyout panel below the calendar, not a modal. Slides down with Framer Motion.

```tsx
<AnimatePresence>
  {slot && (
    <motion.div
      className="rounded-xl bg-white p-5 mt-3"
      style={{ border: '1px solid rgba(0,0,0,0.07)' }}
      initial={{ opacity: 0, y: -6, scale: 0.97 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: -4, scale: 0.97 }}
      transition={{ duration: 0.18, ease: [0.25, 0.1, 0.25, 1] }}
    >
      <div className="flex items-start justify-between">
        <div>
          <p className="text-sm font-semibold text-neutral-900">
            {format(slot.startAt, 'EEEE MMM d')} — {format(slot.startAt, 'h:mm a')} to {format(slot.endAt, 'h:mm a')}
          </p>
          <p className="text-xs text-neutral-500 mt-0.5">
            {durationHours}h {slot.targetHours ? `· Target: ${slot.targetHours}h` : ''}
            {slot.minHours ? ` · Minimum: ${slot.minHours}h` : ''}
          </p>
        </div>
        <button onClick={onClose} className="text-neutral-400 hover:text-neutral-600 text-lg leading-none">×</button>
      </div>

      <div className="flex items-center gap-2 mt-3">
        <span className="text-xs text-neutral-500">Platforms:</span>
        {slot.platforms.map(p => (
          <div key={p} className="flex items-center gap-1">
            <PlatformIcon platform={p} size={14} />
            <span className="text-xs text-neutral-600 capitalize">{p}</span>
          </div>
        ))}
      </div>
    </motion.div>
  )}
</AnimatePresence>
```

---

### 3.4 MonthCalendarView

**File:** `src/features/webcam/components/MonthCalendarView.tsx`

```tsx
interface MonthCalendarViewProps {
  slots: StreamSlot[];
  month: Date;
  onDayClick: (date: Date) => void;
}
```

**Layout:** Standard 7-column month grid. Days with streams show a pink dot. Clicking a day
switches to DayCalendarView for that date.

```tsx
// Month stats strip at bottom
<div className="mt-4 rounded-lg bg-neutral-50 px-4 py-3 flex items-center gap-6"
  style={{ border: '1px solid rgba(0,0,0,0.05)' }}
>
  {[
    { label: 'Streams', value: monthStats.streamCount },
    { label: 'Total hours', value: `${monthStats.totalHours}h` },
    { label: 'Earned', value: `£${monthStats.earnings.toLocaleString()}` },
  ].map(stat => (
    <div key={stat.label}>
      <p className="text-[11px] text-neutral-400">{stat.label}</p>
      <p className="text-sm font-semibold text-neutral-900">{stat.value}</p>
    </div>
  ))}
</div>
```

---

## 4. INTERACTION SPEC

### 4.1 View switching (Day / Week / Month)
```
User clicks Day / Week / Month in ViewToggle
  → AnimatePresence mode="wait" transitions views
  → slide animation: x: 10 → 0 (entering), x: -10 (exiting)
  → MonthNavigator updates label to match view
```

### 4.2 Click slot → detail panel
```
User clicks StreamSlotBlock
  → setSelectedSlot(slot)
  → StreamSlotDetailPanel animates in below calendar
  → Clicking another slot updates panel in place
  → Clicking × or outside collapses panel
```

### 4.3 Month day click → zoom to day
```
User clicks a day cell in MonthCalendarView
  → Switch view to "Day"
  → MonthNavigator updates to show that date
  → DayCalendarView renders for that date
```

---

## 5. GAMIFICATION INTEGRATION

This page is read-only — no direct point-earning actions. Streak information from
webcam sessions is visible via the StreakBadge in the sub-nav (shared with other webcam pages).

---

## 6. REUSE INSTRUCTIONS

| Component | Source | Notes |
|-----------|--------|-------|
| `ViewToggle` | `@/components/ui/view-toggle` | Day/Week/Month toggle in sub-nav |
| `PointsStatPill` | `@/features/content-requests/` | Shared gamification |
| `StreakBadge` | `@/features/webcam/` | Shared across webcam sub-pages |

---

## 7. FILE ADDITIONS TO `src/features/webcam/`

```
components/
  WebcamCalendarFeaturePage.tsx
  WeekCalendarView.tsx
  DayCalendarView.tsx
  MonthCalendarView.tsx
  StreamSlotBlock.tsx
  StreamSlotDetailPanel.tsx
  MonthNavigator.tsx

src/app/model/webcam/calendar/page.tsx  ← thin wrapper only
```
