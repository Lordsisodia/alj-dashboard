# Wireframe: Shift Schedule (`/agency/schedule-shifts`)

**Features:** A57–A64
**Accent:** `linear-gradient(135deg, #ff0069, #833ab4)`

---

## ASCII Wireframe — Weekly View (Desktop, 1440px)

```
┌─────────────────────────────────────────────────────────────────────────────────┐
│ OUTER CANVAS                                                                    │
│  ┌──────────┐  ┌──────────────────────────────────────────────────────────────┐ │
│  │ SIDEBAR  │  │ CONTENT CARD                                                  │ │
│  │          │  │ ┌──────────────────────────────────────────────────────────┐ │ │
│  │          │  │ │ HEADER: [📅] Shift Schedule  [12 staff]   [Search]       │ │ │
│  │          │  │ │                   [◀ Apr 7–13 ▶]  [+ Assign Shift]       │ │ │
│  │          │  │ └──────────────────────────────────────────────────────────┘ │ │
│  │          │  │ ┌──────────────────────────────────────────────────────────┐ │ │
│  │          │  │ │ TABS: [● Weekly] [Monthly] [Employee View]               │ │ │
│  │          │  │ │  [Employee: All ▾]  [Dept: All ▾]   [Add Filter]         │ │ │
│  │          │  │ └──────────────────────────────────────────────────────────┘ │ │
│  │          │  │                                                               │ │
│  │          │  │ ── WHO'S ONLINE RIGHT NOW (A58) ────────────────────────── │ │
│  │          │  │ ● Ana  ● Belle  ● Cam  ○ Dan  ● Eve  ○ Fay  ● Gil  ...     │ │
│  │          │  │ (compact online strip — avatars + dots)                      │ │
│  │          │  │                                                               │ │
│  │          │  │ ── WEEKLY SCHEDULE GRID (A57) ─────────────────────────── │ │
│  │          │  │             Mon     Tue     Wed     Thu     Fri    Sat  Sun  │ │
│  │          │  │             Apr 7   Apr 8   Apr 9   Apr 10  Apr11  12   13   │ │
│  │          │  │ ─────────── ─────── ─────── ─────── ─────── ────── ──── ─── │ │
│  │          │  │ Ana Russo   [9-5]   [9-5]   [ OFF ] [9-5]   [9-5] [ ]  [ ] │ │
│  │          │  │ Belle Chen  [10-6]  [ OFF ] [10-6]  [10-6]  [ ]   [ ]  [ ] │ │
│  │          │  │ Cam Lee     [ OFF ] [9-5]   [9-5]   [ OFF ] [9-5] [ ]  [ ] │ │
│  │          │  │ Dan Smith   [9-5]   [9-5]   [9-5]   [9-5]   [9-5] [ ]  [ ] │ │
│  │          │  │ Eve Park    [10-6]  [ OFF ] [10-6]  [ OFF ] [10-6][ ]  [ ] │ │
│  │          │  │             ↑ drag shifts to re-assign                        │ │
│  │          │  │                                                               │ │
│  │          │  │ ── LABOR COST (inline, A63) ───────────────────────────────  │ │
│  │          │  │ Mon: £420  Tue: £350  Wed: £390  Thu: £420  Fri: £350        │ │
│  │          │  │ Weekly total: £1,930  (↑£80 from last week)                  │ │
│  │          │  │                                                               │ │
│  │          │  │ ── PENDING SHIFT SWAPS (A64) ──────────────────────────── │ │
│  │          │  │ ┌────────────────────────────────────────────────────────┐   │ │
│  │          │  │ │ Dan → Fay swap request for Apr 10  [Approve] [Reject]  │   │ │
│  │          │  │ └────────────────────────────────────────────────────────┘   │ │
│  └──────────┘  └──────────────────────────────────────────────────────────────┘ │
└─────────────────────────────────────────────────────────────────────────────────┘
```

### Monthly View

```
┌─────────────────────────────────────────────────────────────────────────────────┐
│     April 2026                                                                  │
│  Mon   Tue   Wed   Thu   Fri   Sat   Sun                                        │
│  ─────────────────────────────────────────                                      │
│   7     8     9    10    11    12    13                                          │
│  [3]   [4]   [3]   [4]   [3]   [ ]   [ ]    ← number = staff count            │
│                                                                                  │
│  14    15    16    17    18    19    20                                          │
│  [4]   [3]   [4]   [4]   [3]   [ ]   [ ]                                       │
│  ...                                                                             │
└─────────────────────────────────────────────────────────────────────────────────┘
```

### Employee View (A59, A61, A62)

```
┌─────────────────────────────────────────────────────────────────────────────────┐
│  [Avatar] Dan Smith  ▼  [← Apr 2026 →]                                         │
│                                                                                  │
│  STATS: 18 shifts · 3 days off · 0.5 late rate · £2,340 cost this month        │
│                                                                                  │
│  Shift History (chronological):                                                  │
│  Apr 13 Mon  9AM–5PM  ON TIME    ████████  (8h)                                 │
│  Apr 12 Sun  OFF      DAY OFF    —                                               │
│  Apr 11 Fri  9AM–5PM  LATE 12m   ██████▒▒  (7h48m actual)                      │
│  Apr 10 Thu  9AM–5PM  ON TIME    ████████  (8h)                                 │
│  ...                                                                             │
└─────────────────────────────────────────────────────────────────────────────────┘
```

---

## Component Tree

```
ShiftScheduleFeaturePage
├── ContentPageShell
│   ├── header
│   │   ├── ProductIcon "schedule"
│   │   ├── "Shift Schedule"
│   │   ├── StatPill "12 staff"
│   │   ├── WeekNavigator "◀ Apr 7–13 ▶"
│   │   └── ActionButton "+ Assign Shift" (accentGradient pink)
│   ├── tabBar
│   │   ├── Tab "Weekly" (active)
│   │   ├── Tab "Monthly"
│   │   └── Tab "Employee View"
│   │   ├── EmployeeFilterPill "Employee: All ▾"
│   │   ├── DeptFilterPill "Dept: All ▾"
│   │   └── AddFilterPill
│   └── content
│       ├── OnlineNowStrip (A58)
│       ├── ShiftSwapQueue (A64, conditional — shows if pending swaps)
│       └── AnimatePresence
│           ├── WeeklyTab
│           │   ├── ScheduleGrid (A57, A63)
│           │   │   ├── ScheduleGridHeader (day columns)
│           │   │   ├── EmployeeShiftRow × N (draggable shifts)
│           │   │   └── LaborCostFooter (A63)
│           ├── MonthlyTab
│           │   └── MonthlyCalendar
│           │       └── MonthDayCell × 28-31
│           └── EmployeeViewTab (A59, A61, A62)
│               ├── EmployeeSelector
│               ├── EmployeeStatBar
│               └── ShiftHistoryList
│                   └── ShiftHistoryRow × N
```

---

## Key Components

### OnlineNowStrip (A58)
```tsx
<div className="flex items-center gap-3 px-4 py-2.5 rounded-xl bg-white mb-4"
     style={{ border: '1px solid rgba(0,0,0,0.07)' }}>
  <p className="text-[11px] font-semibold text-neutral-500 flex-shrink-0">Online Now</p>
  <div className="flex items-center gap-2 flex-wrap">
    {staff.map(s => (
      <div key={s.id} className="flex items-center gap-1.5">
        <div className="relative">
          <img src={s.avatar} className="w-6 h-6 rounded-full" />
          <span className={cn(
            "absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 rounded-full border-2 border-white",
            s.online ? "bg-green-500" : "bg-neutral-300"
          )} />
        </div>
        <p className="text-[11px] text-neutral-600">{s.firstName}</p>
      </div>
    ))}
  </div>
  <p className="text-[11px] text-neutral-400 ml-auto flex-shrink-0">{onlineCount} / {total}</p>
</div>
```

### ScheduleGrid (A57, A63) — Drag-and-Drop
```tsx
// Uses dnd-kit for drag-drop
<DndContext onDragEnd={handleShiftDrop}>
  <div className="overflow-x-auto">
    <table className="w-full min-w-[900px]">
      <ScheduleGridHeader days={weekDays} />
      <tbody>
        {employees.map(emp => (
          <EmployeeShiftRow key={emp.id} employee={emp} weekDays={weekDays} />
        ))}
        <LaborCostFooter weekDays={weekDays} costs={dailyCosts} />
      </tbody>
    </table>
  </div>
</DndContext>
```

### ShiftCell (individual shift — draggable)
```tsx
<td className="p-1.5 min-w-[110px]">
  {shift ? (
    <Draggable id={`shift-${shift.id}`}>
      <div
        className="rounded-lg px-2 py-1.5 cursor-grab active:cursor-grabbing"
        style={{ backgroundColor: dept.color + '15', border: `1px solid ${dept.color}30` }}
      >
        <p className="text-[11px] font-semibold" style={{ color: dept.color }}>
          {formatTime(shift.start)}–{formatTime(shift.end)}
        </p>
        <p className="text-[10px] text-neutral-400">{shift.role}</p>
      </div>
    </Draggable>
  ) : (
    <Droppable id={`cell-${emp.id}-${day.date}`}>
      <div className="rounded-lg h-12 border-2 border-dashed border-neutral-100 flex items-center justify-center hover:border-[#ff0069]/30 transition-colors">
        <Plus size={12} className="text-neutral-300" />
      </div>
    </Droppable>
  )}
</td>
```

### LaborCostFooter (A63 — real-time cost display)
```tsx
<tr className="border-t border-neutral-100">
  <td className="py-2 text-[11px] font-semibold text-neutral-500">Daily cost</td>
  {weekDays.map(day => (
    <td key={day.date} className="py-2 text-center text-[11px] font-semibold text-neutral-700">
      £{dailyCosts[day.date] ?? 0}
    </td>
  ))}
</tr>
```
Weekly total shown below table: `text-sm font-semibold text-neutral-800`

### ShiftSwapQueue (A64)
```tsx
// Shown as banner if pendingSwaps.length > 0
<div className="rounded-xl bg-blue-50 border border-blue-200 p-3 mb-4">
  <p className="text-[11px] font-semibold text-blue-700 mb-2">
    {pendingSwaps.length} pending shift swap{pendingSwaps.length > 1 ? 's' : ''}
  </p>
  {pendingSwaps.map(swap => (
    <div key={swap.id} className="flex items-center gap-3 py-1.5">
      <p className="text-xs text-neutral-700 flex-1">
        <strong>{swap.requester}</strong> → <strong>{swap.target}</strong> swap on {formatDate(swap.date)}
      </p>
      <button onClick={() => approveSwap(swap.id)} className="text-xs font-semibold text-green-600 hover:text-green-800">Approve</button>
      <button onClick={() => rejectSwap(swap.id)} className="text-xs font-semibold text-red-500 hover:text-red-700">Reject</button>
    </div>
  ))}
</div>
```

### EmployeeShiftHistory (A61, A62)
```tsx
<div className="space-y-1">
  {history.map(record => (
    <div key={record.id} className="flex items-center gap-4 py-2 border-b border-neutral-50">
      <p className="text-xs text-neutral-400 w-24">{formatDate(record.date)}</p>
      <p className="text-xs font-medium text-neutral-700 w-20">{record.shiftLabel}</p>
      <StatusBadge status={record.status} />
      {/* Shift bar: proportional to hours */}
      <div className="flex-1 bg-neutral-100 rounded-full h-2 overflow-hidden">
        <div
          className="h-full rounded-full bg-[#ff0069]"
          style={{ width: `${(record.hoursWorked / 8) * 100}%` }}
        />
      </div>
      <p className="text-xs text-neutral-400 w-12 text-right">{record.hoursWorked}h</p>
    </div>
  ))}
</div>
```

### WeekNavigator
```tsx
<div className="flex items-center gap-2">
  <button onClick={prevWeek} className="p-1.5 rounded-lg hover:bg-black/[0.04] transition-colors">
    <ChevronLeft size={14} className="text-neutral-500" />
  </button>
  <p className="text-xs font-medium text-neutral-700 min-w-[90px] text-center">
    {formatWeekRange(currentWeek)}
  </p>
  <button onClick={nextWeek} className="p-1.5 rounded-lg hover:bg-black/[0.04] transition-colors">
    <ChevronRight size={14} className="text-neutral-500" />
  </button>
</div>
```

---

## Interaction Spec

| Interaction | Behaviour |
|-------------|-----------|
| Drag shift cell | `dnd-kit` drag — drop on empty cell reassigns shift, updates LaborCostFooter in real time |
| Drop on occupied cell | Swap confirmation modal |
| Empty cell click | Opens AssignShiftModal: employee + date pre-filled, set time + role |
| "+ Assign Shift" | Opens AssignShiftModal blank |
| WeekNavigator ◀▶ | Navigates weeks, re-fetches schedule data |
| Approve swap | Marks swap confirmed, updates grid cells |
| Reject swap | Marks swap rejected, sends notification |
| Employee View tab | Shows individual employee; EmployeeSelector dropdown |
| Monthly view | Click on day cell → opens DayDetailPanel (right slide-in) |
| Shift history filter | Year / Month / Week dropdown in EmployeeViewTab |

---

## Reuse Instructions

- `OnlineNowStrip` — new, ~35 lines (similar to StaffOnlinePanel from home, but compact strip)
- `dnd-kit` — already planned as NEW build (component #6 in COMPONENT_REUSE_MAP)
- `ShiftSwapModal` — from page spec, ~50 lines
- `StatusBadge` — reuse from shift-tracker (same variants)

**NEW components in this page:**
- `ScheduleGrid` + `ShiftCell` — new, ~80 lines total
- `LaborCostFooter` — new, ~20 lines
- `ShiftSwapQueue` banner — new, ~30 lines
- `WeekNavigator` — new, ~20 lines
- `MonthlyCalendar` — new, ~40 lines
- `ShiftHistoryRow` — new, ~25 lines
