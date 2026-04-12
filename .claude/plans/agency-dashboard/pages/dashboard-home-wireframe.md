# Wireframe: Dashboard Home (`/agency`)

**Features:** A1, A2, A3, A4
**Accent:** `linear-gradient(135deg, #ff0069, #833ab4)` (ISSO/OFM pink)

---

## ASCII Wireframe (Desktop, 1440px)

```
┌─────────────────────────────────────────────────────────────────────────────────┐
│ OUTER CANVAS (bg-black p-5 gap-5)                                               │
│  ┌──────────┐  ┌──────────────────────────────────────────────────────────────┐ │
│  │ SIDEBAR  │  │ CONTENT CARD (bg-white rounded-2xl flex-1)                   │ │
│  │  64px    │  │ ┌──────────────────────────────────────────────────────────┐ │ │
│  │  rail    │  │ │ ROW 1 — HEADER (h-14 px-3 border-b)                      │ │ │
│  │  +       │  │ │ [🏢 icon] Agency Dashboard [◆ 9 Models]   [Search...]    │ │ │
│  │  detail  │  │ │                                      [+ New Report ▾]    │ │ │
│  │  panel   │  │ └──────────────────────────────────────────────────────────┘ │ │
│  │          │  │ ┌──────────────────────────────────────────────────────────┐ │ │
│  │          │  │ │ ROW 2 — TABS (px-3 py-2 border-b)                        │ │ │
│  │          │  │ │ [● Overview] [Analytics] [Activity]       [ViewToggle]   │ │ │
│  │          │  │ └──────────────────────────────────────────────────────────┘ │ │
│  │          │  │ ┌──────────────────────────────────────────────────────────┐ │ │
│  │          │  │ │ CONTENT AREA (px-6 py-6 overflow-y-auto)                  │ │ │
│  │          │  │ │                                                            │ │ │
│  │          │  │ │ ── KPI CARDS ROW ──────────────────────────────────────── │ │ │
│  │          │  │ │ ┌──────────────┐ ┌──────────────┐ ┌──────────────┐       │ │ │
│  │          │  │ │ │ Total Revenue│ │ Active Models│ │ Staff On Shift│      │ │ │
│  │          │  │ │ │ £24,800      │ │ 9            │ │ 6 / 12       │      │ │ │
│  │          │  │ │ │ ↑12% MoM    │ │ ↑1 this wk  │ │ 2 late       │      │ │ │
│  │          │  │ │ └──────────────┘ └──────────────┘ └──────────────┘       │ │ │
│  │          │  │ │                                                            │ │ │
│  │          │  │ │ ── WHO'S ONLINE + SECTION SUMMARIES ─────────────────── │ │ │
│  │          │  │ │ ┌──────────────────────┐  ┌─────────────────────────────┐ │ │ │
│  │          │  │ │ │ WHO'S ONLINE (A2)    │  │ SECTION SUMMARIES (A3)      │ │ │ │
│  │          │  │ │ │ ● Ana  ● Belle       │  │ ┌──────────┐ ┌──────────┐  │ │ │ │
│  │          │  │ │ │ ● Cam  ○ Dan (off)   │  │ │ Revenue  │ │ Content  │  │ │ │ │
│  │          │  │ │ │ ● Eve  ○ Fay (off)   │  │ │ £24.8k   │ │ 3 in PTP│  │ │ │ │
│  │          │  │ │ │ ● Gil  ● Han         │  │ └──────────┘ └──────────┘  │ │ │ │
│  │          │  │ │ │ 6 online / 8 total   │  │ ┌──────────┐ ┌──────────┐  │ │ │ │
│  │          │  │ │ └──────────────────────┘  │ │ Team     │ │ Shifts   │  │ │ │ │
│  │          │  │ │                            │ │ 6/12 on  │ │ 2 late   │  │ │ │ │
│  │          │  │ │                            │ └──────────┘ └──────────┘  │ │ │ │
│  │          │  │ │                            └─────────────────────────────┘ │ │ │
│  │          │  │ └──────────────────────────────────────────────────────────┘ │ │
│  └──────────┘  └──────────────────────────────────────────────────────────────┘ │
└─────────────────────────────────────────────────────────────────────────────────┘
```

---

## Component Tree

```
AgencyDashboardFeaturePage
├── ContentPageShell
│   ├── header
│   │   ├── ProductIcon (size=32)
│   │   ├── "Agency Dashboard" (text-sm font-semibold text-neutral-900)
│   │   ├── StatPill ("9 Models")
│   │   ├── SearchInput (center, w-80)
│   │   └── ActionButton "New Report ▾" (accentGradient pink)
│   ├── tabBar
│   │   ├── Tab "Overview" (active)
│   │   ├── Tab "Analytics"
│   │   └── Tab "Activity"
│   └── content (px-6 py-6)
│       ├── KPIRow (grid grid-cols-3 gap-4)
│       │   ├── KPIDeltaTile (revenue)
│       │   ├── KPIDeltaTile (models)
│       │   └── KPIDeltaTile (staff)
│       └── BottomRow (grid grid-cols-2 gap-4 mt-6)
│           ├── StaffOnlinePanel
│           │   ├── SectionHeader "Who's Online"
│           │   ├── StaffAvatarGrid (photos + status dots)
│           │   └── OnlineCount "6 online / 8 total"
│           └── SectionSummaryGrid (grid grid-cols-2 gap-3)
│               ├── SummaryCard "Revenue"
│               ├── SummaryCard "Content"
│               ├── SummaryCard "Team"
│               └── SummaryCard "Shifts"
```

---

## Key Components

### KPIDeltaTile
Reuse from `features/intelligence/`. Props:
```tsx
<KPIDeltaTile
  icon={<TrendingUp size={16} />}
  label="Total Revenue"
  value="£24,800"
  delta="+12%"
  deltaDirection="up"        // 'up' | 'down' | 'neutral'
  meta="vs last month"
  accentColor="#ff0069"
/>
```
Classes: `rounded-xl bg-white p-4` + border `rgba(0,0,0,0.07)` + shadow `0 1px 4px rgba(0,0,0,0.04)`
Delta badge: `text-xs font-semibold px-2 py-0.5 rounded-full` — green if up, red if down.

### StaffOnlinePanel
New component. Layout:
```tsx
<div className="rounded-xl bg-white p-4" style={{ border: '1px solid rgba(0,0,0,0.07)' }}>
  <p className="text-xs font-semibold text-neutral-700 mb-3">Who's Online</p>
  <div className="grid grid-cols-4 gap-3">
    {staff.map(s => (
      <div key={s.id} className="flex flex-col items-center gap-1">
        <div className="relative">
          <img src={s.avatar} className="w-10 h-10 rounded-full object-cover" />
          <span className={cn(
            "absolute bottom-0 right-0 w-3 h-3 rounded-full border-2 border-white",
            s.online ? "bg-green-500" : "bg-neutral-300"
          )} />
        </div>
        <p className="text-[10px] text-neutral-600 truncate max-w-[40px]">{s.name}</p>
      </div>
    ))}
  </div>
  <p className="text-[11px] text-neutral-400 mt-3">{onlineCount} online / {total} total</p>
</div>
```

### SummaryCard
```tsx
<div
  className="rounded-xl bg-white p-4 cursor-pointer hover:bg-black/[0.02] transition-colors"
  style={{ border: '1px solid rgba(0,0,0,0.07)' }}
  onClick={() => router.push(href)}
>
  <div className="flex items-center gap-2 mb-2">
    <span className="text-[#ff0069]"><Icon size={14} /></span>
    <p className="text-xs font-semibold text-neutral-700">{title}</p>
  </div>
  <p className="text-xl font-semibold text-neutral-900">{value}</p>
  <p className="text-[11px] text-neutral-400 mt-0.5">{subtext}</p>
</div>
```

### ContentPageShell Props
```tsx
<ContentPageShell
  title="Agency Dashboard"
  productIcon={<ProductIcon name="agency" size={32} />}
  statPill={{ label: "9 Models" }}
  accentGradient="linear-gradient(135deg, #ff0069, #833ab4)"
  actionLabel="New Report"
  actionIcon={<FileText size={14} />}
  tabs={[
    { id: 'overview', label: 'Overview', icon: <LayoutDashboard size={13} /> },
    { id: 'analytics', label: 'Analytics' },
    { id: 'activity', label: 'Activity' },
  ]}
  activeTab={activeTab}
  onTabChange={setActiveTab}
/>
```

---

## Interaction Spec

| Interaction | Behaviour |
|-------------|-----------|
| Tab "Analytics" | Slide-transitions to revenue summary view (links out to /agency/analytics) |
| Tab "Activity" | Shows ActivityFeed (recent events across all sections) |
| SummaryCard click | Navigate to that section's route |
| Staff avatar hover | Tooltip: name + current shift status |
| KPIDeltaTile hover | `whileHover={{ scale: 1.02, y: -2 }}` spring animation |
| "New Report" click | Opens dropdown: Export PDF, Export PPT, Schedule Report |

---

## Reuse Instructions

- `KPIDeltaTile` — from `features/intelligence/` — drop in, supply agency data
- `ActivityFeed` — from `features/intelligence/` — filter by `domain: 'agency'`
- `ContentPageShell` — universal, configure with pink accentGradient
- `StaffOnlinePanel` — NEW, ~30 lines
- `SummaryCard` — NEW, ~20 lines (4 instances, no abstraction needed)

**SIMPLE by design (A4):** No charts on the home page. Just KPIs, who's online, and section links.
