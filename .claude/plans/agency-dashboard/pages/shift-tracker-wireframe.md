# Wireframe: Shift Tracker (`/agency/shifts`)

**Features:** A51–A56
**Accent:** `linear-gradient(135deg, #ff0069, #833ab4)`

---

## ASCII Wireframe (Desktop, 1440px)

```
┌─────────────────────────────────────────────────────────────────────────────────┐
│ OUTER CANVAS                                                                    │
│  ┌──────────┐  ┌──────────────────────────────────────────────────────────────┐ │
│  │ SIDEBAR  │  │ CONTENT CARD                                                  │ │
│  │          │  │ ┌──────────────────────────────────────────────────────────┐ │ │
│  │          │  │ │ HEADER: [⏱] Shift Tracker  [6 on shift]   [Search]      │ │ │
│  │          │  │ │                              [Today ▾]   [Clock In/Out]   │ │ │
│  │          │  │ └──────────────────────────────────────────────────────────┘ │ │
│  │          │  │ ┌──────────────────────────────────────────────────────────┐ │ │
│  │          │  │ │ TABS: [● Today] [Analytics] [Patterns]                   │ │ │
│  │          │  │ │        [Dept: All ▾]  [Status: All ▾]   [Add Filter]     │ │ │
│  │          │  │ └──────────────────────────────────────────────────────────┘ │ │
│  │          │  │                                                               │ │
│  │          │  │ ── ALERT BANNER (A53) ─────────────────────────────────────  │ │
│  │          │  │ ┌──────────────────────────────────────────────────────────┐  │ │
│  │          │  │ │ ⚠ Senior Alert: Dan Smith is 12 min late. Notify? [Yes] [Dismiss]│  │ │
│  │          │  │ └──────────────────────────────────────────────────────────┘  │ │
│  │          │  │                                                               │ │
│  │          │  │ ── STATUS OVERVIEW ─────────────────────────────────────── │ │
│  │          │  │ ┌──────────┐ ┌──────────┐ ┌──────────┐ ┌──────────┐       │ │
│  │          │  │ │ On Time  │ │  Late    │ │  Absent  │ │Deductions│       │ │
│  │          │  │ │ 8        │ │ 2        │ │ 1        │ │ £42      │       │ │
│  │          │  │ │ today    │ │ today    │ │ today    │ │ pending  │       │ │
│  │          │  │ └──────────┘ └──────────┘ └──────────┘ └──────────┘       │ │
│  │          │  │                                                               │ │
│  │          │  │ ── EMPLOYEE STATUS GRID (A51) ─────────────────────────────  │ │
│  │          │  │ Employee        Status   Clock In   Late By  Deduction  Act │ │
│  │          │  │ ─────────────── ──────── ────────── ──────── ─────────  ─── │ │
│  │          │  │ [●] Ana Russo   ON TIME  09:02 AM    —        —         [·] │ │
│  │          │  │ [●] Belle Chen  ON TIME  08:58 AM    —        —         [·] │ │
│  │          │  │ [⚠] Dan Smith   LATE     —           12 min   -£10     [·] │ │
│  │          │  │ [○] Eve Park    ABSENT   —            —       -£80     [·] │ │
│  │          │  │ [●] Fay Torres  ON TIME  09:00 AM    —        —         [·] │ │
│  │          │  │                                                               │ │
│  │          │  │ [+ Clock In/Out for: _______ ▾]  (TimeButton — A55)          │ │
│  └──────────┘  └──────────────────────────────────────────────────────────────┘ │
└─────────────────────────────────────────────────────────────────────────────────┘
```

### Tab: Analytics (A54)

```
┌────────────────────────────────────────────────────────────────────┐
│ ── LATENESS TREND CHART ──────────────────────────────────────────  │
│  Weekly average late arrivals (FormatChart pattern)                  │
│  Week 1: ████ 3     Week 2: ██ 2     Week 3: █████ 4               │
│                                                                      │
│ ── BY EMPLOYEE ────────────────────────────────────────────────────  │
│  Dan Smith    ██████████████████ 18 late incidents / 30d            │
│  Eve Park     ████████ 8                                             │
│  Fay Torres   ██ 2                                                   │
└────────────────────────────────────────────────────────────────────┘
```

### Tab: Patterns (A56)

```
┌────────────────────────────────────────────────────────────────────┐
│ AUTO-DETECTED PATTERNS                                               │
│                                                                      │
│ ┌─────────────────────────────────────────────────────────────────┐ │
│ │ ⚠ Dan Smith — Late every Tuesday (6 of last 8 Tuesdays)        │ │
│ │   Not random — pattern detected. Action: [Review] [Warn] [Dismiss]│ │
│ └─────────────────────────────────────────────────────────────────┘ │
│ ┌─────────────────────────────────────────────────────────────────┐ │
│ │ ⚠ Eve Park — Absent Fridays 3 weeks in a row                   │ │
│ │   Action: [Review] [Warn] [Dismiss]                             │ │
│ └─────────────────────────────────────────────────────────────────┘ │
└────────────────────────────────────────────────────────────────────┘
```

---

## Component Tree

```
ShiftTrackerFeaturePage
├── ContentPageShell
│   ├── header
│   │   ├── ProductIcon "shifts"
│   │   ├── "Shift Tracker"
│   │   ├── StatPill "6 on shift"
│   │   ├── DatePicker (Today ▾)
│   │   └── TimeButton (A55) — "Clock In/Out" action
│   ├── tabBar
│   │   ├── Tab "Today" (active)
│   │   ├── Tab "Analytics"
│   │   └── Tab "Patterns"
│   │   ├── DeptFilterPill "Dept: All ▾"
│   │   ├── StatusFilterPill "Status: All ▾"
│   │   └── AddFilterPill
│   └── content
│       ├── SeniorAlertBanner (A53, conditional)
│       └── AnimatePresence
│           ├── TodayTab
│           │   ├── StatusOverviewRow (grid-cols-4)
│           │   │   ├── StatTile "On Time"
│           │   │   ├── StatTile "Late"
│           │   │   ├── StatTile "Absent"
│           │   │   └── StatTile "Deductions"
│           │   └── EmployeeStatusGrid (A51)
│           │       └── EmployeeStatusRow × N
│           ├── AnalyticsTab (A54)
│           │   ├── LatenessChart (weekly bar chart)
│           │   └── PerEmployeeLateness (horizontal bars)
│           └── PatternsTab (A56)
│               └── PatternCard × N
```

---

## Key Components

### SeniorAlertBanner (A53)
```tsx
// Only shown when a report is late and senior hasn't been notified yet
{alerts.map(alert => (
  <motion.div
    key={alert.id}
    initial={{ opacity: 0, y: -4 }}
    animate={{ opacity: 1, y: 0 }}
    className="flex items-center gap-3 px-4 py-2.5 rounded-xl bg-amber-50 border border-amber-200 mb-4"
  >
    <AlertTriangle size={14} className="text-amber-500 flex-shrink-0" />
    <p className="text-xs text-amber-700 font-medium flex-1">
      Senior Alert: <strong>{alert.employeeName}</strong> is {alert.minutesLate} min late.
    </p>
    <button onClick={() => notifySenior(alert)} className="text-xs font-semibold text-amber-600 hover:text-amber-800 px-2">Yes, notify</button>
    <button onClick={() => dismissAlert(alert.id)} className="text-xs text-amber-400 hover:text-amber-600">Dismiss</button>
  </motion.div>
))}
```

### EmployeeStatusRow (A51, A52)
```tsx
<tr className="border-b border-neutral-50 hover:bg-black/[0.02] transition-colors">
  <td className="py-3">
    <div className="flex items-center gap-2">
      <StatusDot status={employee.status} />   {/* green/amber/red dot */}
      <img src={employee.avatar} className="w-7 h-7 rounded-full" />
      <p className="text-sm font-medium text-neutral-800">{employee.name}</p>
    </div>
  </td>
  <td>
    <StatusBadge status={employee.status} />   {/* ON TIME / LATE / ABSENT */}
  </td>
  <td className="text-sm text-neutral-600">{employee.clockIn || '—'}</td>
  <td className="text-sm text-neutral-600">{employee.minutesLate ? `${employee.minutesLate} min` : '—'}</td>
  <td>
    {employee.deduction ? (
      <PayrollDeductionBadge amount={employee.deduction} />
    ) : '—'}
  </td>
  <td>
    <ActionsMenu employeeId={employee.id} />
  </td>
</tr>
```

### StatusBadge variants
```tsx
const statusConfig = {
  'ON TIME': { bg: '#f0fdf4', text: '#16a34a', label: 'On Time' },
  'LATE':    { bg: '#fffbeb', text: '#d97706', label: 'Late' },
  'ABSENT':  { bg: '#fef2f2', text: '#dc2626', label: 'Absent' },
  'OFF':     { bg: '#f9fafb', text: '#6b7280', label: 'Day Off' },
}
```

### PayrollDeductionBadge (A52)
```tsx
<span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-semibold bg-red-50 text-red-600">
  <Minus size={9} />
  £{amount}
</span>
```

### TimeButton (A55)
Shaan's existing clock-in/out code — wrap in standard button:
```tsx
// This wraps the existing TimeButton implementation
<TimeButton
  employeeId={currentUserId}
  onClockIn={handleClockIn}
  onClockOut={handleClockOut}
  className="h-9 px-4 rounded-xl text-sm font-semibold text-white"
  style={{ background: 'linear-gradient(135deg, #ff0069, #833ab4)' }}
/>
```

### PatternDetectionCard (A56)
```tsx
<div className="rounded-xl bg-white p-4 border border-amber-200 bg-amber-50/30">
  <div className="flex items-start gap-3">
    <AlertTriangle size={16} className="text-amber-500 mt-0.5 flex-shrink-0" />
    <div className="flex-1">
      <p className="text-sm font-semibold text-neutral-800">{pattern.employeeName}</p>
      <p className="text-xs text-neutral-600 mt-0.5">{pattern.description}</p>
      <p className="text-[11px] text-neutral-400 mt-1">{pattern.evidence}</p>
    </div>
  </div>
  <div className="flex gap-2 mt-3">
    <button className="px-3 py-1.5 rounded-lg text-xs font-medium text-neutral-700 hover:bg-black/[0.04]" style={{ border: '1px solid rgba(0,0,0,0.09)' }}>Review</button>
    <button className="px-3 py-1.5 rounded-lg text-xs font-medium text-amber-700 hover:bg-amber-100" style={{ border: '1px solid #fcd34d' }}>Issue Warning</button>
    <button onClick={() => dismiss(pattern.id)} className="px-3 py-1.5 rounded-lg text-xs font-medium text-neutral-400 hover:bg-black/[0.04]">Dismiss</button>
  </div>
</div>
```

---

## Interaction Spec

| Interaction | Behaviour |
|-------------|-----------|
| Senior Alert "Yes, notify" | Sends Telegram/push notification to the employee's senior |
| Employee row [···] actions | Dropdown: Manual override, View history, Mark absent |
| "Clock In/Out" button | Opens TimeButton modal — select employee + log time |
| Date picker | Change date to view historical shift data |
| Dept filter | Filter rows to specific department |
| Status filter | Show only LATE / ABSENT / ON TIME |
| Analytics tab | Bar chart of weekly late counts per employee |
| Patterns tab | Auto-detected patterns — Review/Warn/Dismiss actions |
| "Issue Warning" | Sends formal warning notification (Telegram + in-app) |
| Deduction badge | Hover tooltip: "Calculated from 12 min late × £5/min policy" |

---

## Reuse Instructions

- `StatusStrip` — configure with today's shift stats
- `AddFilterPill` — design system §7a
- `FormatChart` pattern — reuse for LatenessChart (intelligence)

**NEW components needed:**
- `SeniorAlertBanner` — new, ~30 lines
- `EmployeeStatusRow` — new, ~35 lines
- `PayrollDeductionBadge` — new, ~10 lines
- `PatternDetectionCard` — new, ~40 lines
- `LatenessChart` — adapt FormatChart, ~40 lines

**TimeButton (A55):** Shaan has existing code — import and wrap, don't rebuild.
