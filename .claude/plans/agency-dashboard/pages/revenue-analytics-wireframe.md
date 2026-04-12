# Wireframe: Revenue & ROI Analytics (`/agency/analytics`)

**Features:** A5–A15
**Accent:** `linear-gradient(135deg, #ff0069, #833ab4)`

---

## ASCII Wireframe (Desktop, 1440px)

```
┌─────────────────────────────────────────────────────────────────────────────────┐
│ OUTER CANVAS                                                                    │
│  ┌──────────┐  ┌──────────────────────────────────────────────────────────────┐ │
│  │ SIDEBAR  │  │ CONTENT CARD                                                  │ │
│  │          │  │ ┌──────────────────────────────────────────────────────────┐ │ │
│  │          │  │ │ HEADER: [🏢] Revenue & ROI [£24.8k this month]  [Search] │ │ │
│  │          │  │ │                         [📅 Apr 1–Apr 13 ▾] [Export ▾]   │ │ │
│  │          │  │ └──────────────────────────────────────────────────────────┘ │ │
│  │          │  │ ┌──────────────────────────────────────────────────────────┐ │ │
│  │          │  │ │ TABS: [● P&L] [Departments] [Staff ROI] [Projections]    │ │ │
│  │          │  │ │        [Benchmarking]              [7d][30d][90d] toggle  │ │ │
│  │          │  │ └──────────────────────────────────────────────────────────┘ │ │
│  │          │  │ ┌──────────────────────────────────────────────────────────┐ │ │
│  │          │  │ │ TAB: P&L                                                  │ │ │
│  │          │  │ │                                                            │ │ │
│  │          │  │ │ ┌──────────┐ ┌──────────┐ ┌──────────┐ ┌──────────┐     │ │ │
│  │          │  │ │ │ Revenue  │ │  Costs   │ │  Profit  │ │ Margin % │     │ │ │
│  │          │  │ │ │ £24,800  │ │ £11,200  │ │ £13,600  │ │   54.8%  │     │ │ │
│  │          │  │ │ │ ↑12% MoM │ │ ↑3% MoM  │ │ ↑18% MoM │ │ ↑3.2pts  │     │ │ │
│  │          │  │ │ └──────────┘ └──────────┘ └──────────┘ └──────────┘     │ │ │
│  │          │  │ │                                                            │ │ │
│  │          │  │ │ ┌────────────────────────────────────────────────────┐   │ │ │
│  │          │  │ │ │ TREND LINE CHART (WoW / MoM)                       │   │ │ │
│  │          │  │ │ │   Revenue ─────────────────────────────────        │   │ │ │
│  │          │  │ │ │   Costs   ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─           │   │ │ │
│  │          │  │ │ │   [!] Decline alert: Costs up 3 weeks in a row     │   │ │ │
│  │          │  │ │ └────────────────────────────────────────────────────┘   │ │ │
│  │          │  │ │                                                            │ │ │
│  │          │  │ │ ── DEPARTMENT BREAKDOWN ────────────────────────────────  │ │ │
│  │          │  │ │ ┌──────────────────────────────────────────────────────┐  │ │ │
│  │          │  │ │ │ Dept        Revenue   Cost    ROI    Trend  Actions  │  │ │ │
│  │          │  │ │ │ ─────────── ──────── ─────── ──────  ─────  ───────  │  │ │ │
│  │          │  │ │ │ ▶ Models    £18,400  £6,200  196%   ↑ ↑ ↑  [View]   │  │ │ │
│  │          │  │ │ │ ▶ Marketing £3,800   £2,800   36%   ↑ ↓ ↑  [View]   │  │ │ │
│  │          │  │ │ │ ▶ Tech      £2,600   £2,200   18%   ↓ ↓ ↓  [!][View]│  │ │ │
│  │          │  │ │ │   [expanded row: per-staff breakdown]                  │  │ │ │
│  │          │  │ │ └──────────────────────────────────────────────────────┘  │ │ │
│  │          │  │ └──────────────────────────────────────────────────────────┘ │ │
│  └──────────┘  └──────────────────────────────────────────────────────────────┘ │
└─────────────────────────────────────────────────────────────────────────────────┘
```

---

## Component Tree

```
RevenueAnalyticsFeaturePage
├── ContentPageShell
│   ├── header
│   │   ├── ProductIcon "agency"
│   │   ├── "Revenue & ROI"
│   │   ├── StatPill "£24.8k this month"
│   │   ├── GlobalDateRangeSelector     ← RIGHT SIDE (A13)
│   │   └── ExportButton "Export ▾"     ← split button (A14)
│   ├── tabBar
│   │   ├── Tab "P&L" (active)
│   │   ├── Tab "Departments"
│   │   ├── Tab "Staff ROI"
│   │   ├── Tab "Projections"
│   │   └── Tab "Benchmarking"
│   │   └── DayRangeToggle [7d][30d][90d]   ← right side of tab bar
│   └── content
│       └── AnimatePresence (tab switch)
│           ├── PLTab
│           │   ├── PLSummaryRow (grid-cols-4)
│           │   │   ├── KPIDeltaTile "Revenue"
│           │   │   ├── KPIDeltaTile "Costs"
│           │   │   ├── KPIDeltaTile "Profit"
│           │   │   └── KPIDeltaTile "Margin %"
│           │   ├── TrendLineChart (A11)
│           │   │   └── DeclineAlert (inline banner if 3+ weeks declining)
│           │   └── DepartmentBreakdownTable (A6, A9)
│           │       └── DeptRow (expandable → StaffROIRow)
│           ├── DepartmentsTab
│           │   └── DepartmentBreakdownTable (full, no P&L summary)
│           ├── StaffROITab (A7, A8)
│           │   └── StaffROITable
│           │       └── StaffROIRow (per staff: cost + output + ROI)
│           ├── ProjectionsTab (A12)
│           │   └── ProjectionsChart (actual vs projected per model)
│           └── BenchmarkingTab (A15)
│               └── CompetitorTable
```

---

## Key Components

### GlobalDateRangeSelector (A13)
```tsx
// Sits in the HEADER right slot — all charts/tables react to this
<GlobalDateRangeSelector
  value={dateRange}
  onChange={setDateRange}       // bubbles up to page-level state
  presets={['This week', 'This month', 'Last 30d', 'Last 90d', 'Custom']}
/>
// Renders as a pill button: [📅 Apr 1–Apr 13 ▾]
// Dropdown: preset options + custom date inputs
```
Classes: `px-3 py-1.5 rounded-lg text-xs font-medium` + border `rgba(0,0,0,0.09)`

### ExportButton (A14)
```tsx
// Split button in header action slot
<div className="flex items-center h-9 rounded-xl overflow-hidden" style={{ background: 'linear-gradient(135deg, #ff0069, #833ab4)' }}>
  <button className="flex items-center gap-1.5 px-4 h-full text-sm font-semibold text-white">
    <Download size={14} />
    Export
  </button>
  <div className="w-px h-5 bg-white/25" />
  <button className="flex items-center justify-center w-8 h-full text-white">
    <ChevronDown size={13} />
  </button>
</div>
// Dropdown: [📄 PDF Report] [📊 PPT Deck] [📋 CSV Data]
```

### PLSummaryRow
4x `KPIDeltaTile` in `grid grid-cols-4 gap-4` — reuse from intelligence.

### TrendLineChart (A11)
Custom Framer Motion bars — NO chart library. Two line series (revenue, costs).
```tsx
<TrendLineChart
  series={[
    { label: 'Revenue', data: weeklyRevenue, color: '#ff0069' },
    { label: 'Costs', data: weeklyCosts, color: '#6366f1' },
  ]}
  dateRange={dateRange}
/>
// DeclineAlert rendered below chart if declining3Weeks === true
```

### DeclineAlert (A11)
```tsx
<div className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-amber-50 border border-amber-200 mt-3">
  <AlertTriangle size={14} className="text-amber-500 flex-shrink-0" />
  <p className="text-xs text-amber-700 font-medium">
    {metric} has declined for 3+ consecutive weeks. Consider reviewing {department}.
  </p>
</div>
```

### DepartmentBreakdownTable (A6)
```tsx
// Each row is a DeptRow — click ▶ to expand staff members
<table className="w-full">
  <thead>
    <tr className="text-[11px] font-medium text-neutral-500 border-b border-neutral-100">
      <th>Department</th><th>Revenue</th><th>Cost</th><th>ROI</th><th>3-wk Trend</th><th></th>
    </tr>
  </thead>
  <tbody>
    {departments.map(dept => <DeptRow key={dept.id} dept={dept} />)}
  </tbody>
</table>
```

### DeptRow (expandable, A6 + A9 manual entry)
- Click ▶ arrow → AnimatePresence expands → shows `StaffROIRow` per team member
- Edit cell icon on Revenue/Cost columns → inline input (A9 manual entry)
- 3-wk Trend: three small arrows `↑↓↑` colored green/red
- `!` badge = DeclineAlert trigger

### StaffROIRow (A7, A8)
```tsx
<tr className="text-sm text-neutral-700">
  <td className="flex items-center gap-2 py-2.5">
    <img src={avatar} className="w-6 h-6 rounded-full" />
    {name}
  </td>
  <td>{cost}</td>
  <td>{outputValue}</td>
  <td>
    <span className={roi > 100 ? 'text-green-600' : 'text-red-500'}>
      {roi}%
    </span>
  </td>
  <td><TrendArrows trend={trend3wk} /></td>
</tr>
```

### ProjectionsChart (A12)
Two Framer Motion horizontal bar rows per model: actual vs projected.
```tsx
<ProjectionsChart
  models={models}
  actual={actualEarnings}
  projected={projectedEarnings}
/>
```

### CompetitorTable (A15)
Simple table: competitor handle | posting frequency | avg engagement | follower count | tracked since.
```tsx
<CompetitorTable
  competitors={competitors}
  onAdd={() => setAddCompetitorOpen(true)}
/>
```

---

## Interaction Spec

| Interaction | Behaviour |
|-------------|-----------|
| Tab switch | `AnimatePresence mode="wait"` slide x:10→0 |
| Date range change | All charts/tables re-fetch with new range (A13) |
| DeptRow ▶ expand | AnimatePresence height expand → shows staff rows |
| Manual entry cell | Click pencil → inline `<input>` replaces value (A9) |
| Export PDF | Generates white-label PDF with agency logo (A14) |
| Export PPT | Generates slide deck (A14) |
| DeclineAlert | Shown inline when `declineWeeks >= 3` for any metric |
| [7d][30d][90d] toggle | Updates trend line resolution |
| Add competitor | Modal: handle + platform + notes (A15) |

---

## Reuse Instructions

- `KPIDeltaTile` — intelligence, drop in
- `FormatChart` pattern → `TrendLineChart` (adapt, same animated bar pattern)
- `DayRangeToggle` — design system §7d, drop in (section 7d)
- `StatusStrip` → use for live Sheets sync indicator at top of page

**Role guard:** Entire page is Owner-only. Render nothing + redirect if role !== 'owner'.
