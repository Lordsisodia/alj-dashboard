# Wireframe: Models Roster (`/agency/models`)

**Features:** A65–A67
**Accent:** `linear-gradient(135deg, #ff0069, #833ab4)`

---

## ASCII Wireframe — Roster View (Desktop, 1440px)

```
┌─────────────────────────────────────────────────────────────────────────────────┐
│ OUTER CANVAS                                                                    │
│  ┌──────────┐  ┌──────────────────────────────────────────────────────────────┐ │
│  │ SIDEBAR  │  │ CONTENT CARD                                                  │ │
│  │          │  │ ┌──────────────────────────────────────────────────────────┐ │ │
│  │          │  │ │ HEADER: [👤] Models  [9 Models]      [Search models...]   │ │ │
│  │          │  │ │                                        [+ Add Model]       │ │ │
│  │          │  │ └──────────────────────────────────────────────────────────┘ │ │
│  │          │  │ ┌──────────────────────────────────────────────────────────┐ │ │
│  │          │  │ │ TABS: [● All Models] [Active] [Inactive]                 │ │ │
│  │          │  │ │  [Niche: All ▾]  [Status: All ▾]  [Add Filter] [Grid/List]│ │ │
│  │          │  │ └──────────────────────────────────────────────────────────┘ │ │
│  │          │  │ ┌──────────────────────────────────────────────────────────┐ │ │
│  │          │  │ │ STATUS STRIP: 9 models │ 7 active │ 84% avg utilization  │ │ │
│  │          │  │ └──────────────────────────────────────────────────────────┘ │ │
│  │          │  │                                                               │ │
│  │          │  │ ── MODELS GRID (A65) ─────────────────────────────────────── │ │
│  │          │  │                                                               │ │
│  │          │  │ ┌──────────────┐ ┌──────────────┐ ┌──────────────┐         │ │
│  │          │  │ │ [Photo]      │ │ [Photo]      │ │ [Photo]      │         │ │
│  │          │  │ │ Ana Russo    │ │ Belle Chen   │ │ Cam Lee      │         │ │
│  │          │  │ │ GFE · Fitness│ │ Fitness      │ │ Meme · GFE   │         │ │
│  │          │  │ │ ● Active     │ │ ● Active     │ │ ● Active     │         │ │
│  │          │  │ │ Earnings     │ │ Earnings     │ │ Earnings     │         │ │
│  │          │  │ │ £4,200 /mo   │ │ £2,800 /mo   │ │ £3,100 /mo   │         │ │
│  │          │  │ │ Utilization  │ │ Utilization  │ │ Utilization  │         │ │
│  │          │  │ │ ████████ 94% │ │ ██████░░ 72% │ │ ███████░ 88% │         │ │
│  │          │  │ │ Next due: 2d │ │ Next due: 5d │ │ Next due: 1d │         │ │
│  │          │  │ └──────────────┘ └──────────────┘ └──────────────┘         │ │
│  │          │  │                                                               │ │
│  │          │  │ ┌──────────────┐ ┌──────────────┐ ┌──────────────┐         │ │
│  │          │  │ │ Dan Wells    │ │ Eve Park     │ │ Fay Torres   │         │ │
│  │          │  │ │ ...          │ │ ○ Inactive   │ │ ...          │         │ │
│  │          │  │ └──────────────┘ └──────────────┘ └──────────────┘         │ │
│  └──────────┘  └──────────────────────────────────────────────────────────────┘ │
└─────────────────────────────────────────────────────────────────────────────────┘
```

---

## Model Detail Page (A66) — Right-side panel or full-page route `/agency/models/[id]`

```
┌─────────────────────────────────────────────────────────────────────────────────┐
│  ← Back to Models                                                               │
│  ┌──────────────────────────────────────────────────────────────────────────┐   │
│  │ [Large Photo]  Ana Russo                                                  │   │
│  │                GFE · Fitness · Meme                                       │   │
│  │                ● Active  |  Joined Jan 2025  |  @ana_russo_ofm            │   │
│  │                [Edit Model] [Deactivate]                                  │   │
│  └──────────────────────────────────────────────────────────────────────────┘   │
│                                                                                  │
│  TABS: [● Overview] [Content] [Social] [Earnings] [Schedule] [Webcam]           │
│                                                                                  │
│  TAB: Overview                                                                   │
│  ┌──────────┐ ┌──────────┐ ┌──────────┐ ┌──────────┐                          │
│  │ Earnings │ │Utilization│ │Content   │ │ER Rate   │                          │
│  │ £4,200   │ │ 94%       │ │ 24 live  │ │ 5.1%     │                          │
│  │ this mo  │ │ ████████  │ │ 3 in PTP │ │ ↑0.3pts  │                          │
│  └──────────┘ └──────────┘ └──────────┘ └──────────┘                          │
│                                                                                  │
│  ── CONTENT SCHEDULE (next 7 days) ───────────────────────────────────────     │
│  Apr 14 Mon  Fitness reel (due)     [View in Content]                           │
│  Apr 16 Wed  GFE Story (scheduled)  [View in Scheduler]                         │
│  Apr 18 Fri  PTP pending approval   [View in PTP]                               │
└─────────────────────────────────────────────────────────────────────────────────┘
```

---

## Component Tree

```
ModelsRosterFeaturePage
├── ContentPageShell
│   ├── header
│   │   ├── ProductIcon "models"
│   │   ├── "Models"
│   │   ├── StatPill "9 Models"
│   │   ├── SearchInput
│   │   └── ActionButton "+ Add Model" (accentGradient pink)
│   ├── tabBar
│   │   ├── Tab "All Models" (active)
│   │   ├── Tab "Active"
│   │   └── Tab "Inactive"
│   │   ├── NicheFilterPill "Niche: All ▾"
│   │   ├── StatusFilterPill "Status: All ▾"
│   │   ├── AddFilterPill
│   │   └── ViewToggle (grid/list)
│   └── content
│       ├── StatusStrip
│       └── AnimatePresence
│           └── ModelsGrid (A65)
│               └── ModelRosterCard × N  (grid-cols-3)

ModelDetailPage (A66) — `/agency/models/[id]`
├── BackLink "← Models"
├── ModelHeader (photo, name, niches, status, actions)
├── DetailTabBar
│   ├── Tab "Overview"
│   ├── Tab "Content"
│   ├── Tab "Social"
│   ├── Tab "Earnings"
│   ├── Tab "Schedule"
│   └── Tab "Webcam"
└── AnimatePresence
    ├── OverviewTab
    │   ├── KPIRow (4 tiles)
    │   └── UpcomingContentList
    ├── ContentTab → links to content gen filtered by model
    ├── SocialTab → links to social analytics filtered by model
    ├── EarningsTab → earnings chart + breakdown
    ├── ScheduleTab → model's posting calendar
    └── WebcamTab → model's streaming stats
```

---

## Key Components

### ModelRosterCard (A65, A67)
```tsx
<motion.div
  whileHover={{ scale: 1.02, y: -2 }}
  transition={{ type: 'spring', stiffness: 400, damping: 25 }}
  className="rounded-xl bg-white cursor-pointer overflow-hidden"
  style={{ border: '1px solid rgba(0,0,0,0.07)', boxShadow: '0 1px 4px rgba(0,0,0,0.04)' }}
  onClick={() => router.push(`/agency/models/${model.id}`)}
>
  {/* Photo */}
  <div className="aspect-[4/3] bg-neutral-100 overflow-hidden">
    <img src={model.photo} className="w-full h-full object-cover" />
  </div>

  <div className="p-4">
    {/* Header */}
    <div className="flex items-start justify-between mb-2">
      <div>
        <p className="text-sm font-semibold text-neutral-900">{model.name}</p>
        <div className="flex gap-1 mt-0.5 flex-wrap">
          {model.niches.map(n => (
            <span key={n} className="text-[10px] text-neutral-500 bg-neutral-100 px-1.5 py-0.5 rounded">{n}</span>
          ))}
        </div>
      </div>
      <StatusDot status={model.status} />  {/* green=active, gray=inactive */}
    </div>

    {/* Earnings */}
    <div className="flex items-center justify-between mb-3">
      <p className="text-[11px] text-neutral-500">Earnings</p>
      <p className="text-sm font-semibold text-neutral-900">£{model.monthlyEarnings}/mo</p>
    </div>

    {/* Utilization bar (A67) */}
    <div>
      <div className="flex items-center justify-between mb-1">
        <p className="text-[11px] text-neutral-500">Utilization</p>
        <p className="text-[11px] font-semibold text-neutral-700">{model.utilization}%</p>
      </div>
      <UtilizationBar value={model.utilization} />
    </div>

    {/* Next content due */}
    {model.nextContentDue && (
      <p className="text-[10px] text-neutral-400 mt-2">
        Next due: <span className="font-medium text-neutral-600">{model.nextContentDue}</span>
      </p>
    )}
  </div>
</motion.div>
```

### UtilizationBar (A67)
```tsx
// booked hours / available hours
<div className="w-full bg-neutral-100 rounded-full h-1.5 overflow-hidden">
  <div
    className="h-full rounded-full transition-all duration-500"
    style={{
      width: `${value}%`,
      background: value > 90
        ? 'linear-gradient(90deg, #16a34a, #22c55e)'   // high utilization = green
        : value > 60
        ? 'linear-gradient(90deg, #ff0069, #833ab4)'   // medium = pink
        : 'linear-gradient(90deg, #f59e0b, #fbbf24)',  // low = amber
    }}
  />
</div>
```

### ModelHeader (detail page)
```tsx
<div className="flex items-start gap-6 p-6 border-b border-neutral-100">
  <img src={model.photo} className="w-20 h-20 rounded-2xl object-cover" />
  <div className="flex-1">
    <div className="flex items-center gap-3 mb-1">
      <h1 className="text-xl font-semibold text-neutral-900">{model.name}</h1>
      <StatusBadge status={model.status} />
    </div>
    <div className="flex gap-1.5 flex-wrap mb-2">
      {model.niches.map(n => <NichePill key={n} niche={n} />)}
    </div>
    <p className="text-xs text-neutral-400">
      Joined {formatDate(model.joinedAt)} · {model.handle}
    </p>
  </div>
  <div className="flex gap-2">
    <button className="px-4 py-2 rounded-xl text-sm font-medium text-neutral-700 hover:bg-black/[0.04]" style={{ border: '1px solid rgba(0,0,0,0.09)' }}>Edit</button>
    <button className="px-4 py-2 rounded-xl text-sm font-medium text-red-600 hover:bg-red-50" style={{ border: '1px solid rgba(239,68,68,0.25)' }}>Deactivate</button>
  </div>
</div>
```

### List View variant (ViewToggle list mode)
```tsx
<tr className="border-b border-neutral-50 hover:bg-black/[0.02] cursor-pointer" onClick={() => navigate(model.id)}>
  <td className="py-3 flex items-center gap-3">
    <img src={model.photo} className="w-8 h-8 rounded-full" />
    <p className="text-sm font-medium text-neutral-800">{model.name}</p>
  </td>
  <td><NichePills niches={model.niches} /></td>
  <td><StatusBadge status={model.status} /></td>
  <td className="text-sm font-semibold text-neutral-900 text-right">£{model.monthlyEarnings}</td>
  <td className="text-right"><UtilizationBar value={model.utilization} className="w-24 inline-block" /></td>
  <td className="text-right"><ChevronRight size={14} className="text-neutral-300" /></td>
</tr>
```

### AddModelDrawer
Right-side slide-in drawer. Fields: Name, Photo upload, Niches (multi-select), Handle, Platform accounts, Status.
```tsx
<Drawer open={addOpen} onClose={() => setAddOpen(false)}>
  <DrawerHeader>Add Model</DrawerHeader>
  <form className="p-6 space-y-4">
    <Field label="Full Name" />
    <Field label="Photo" type="file-upload" />
    <Field label="Niches" type="multi-select" options={NICHES} />
    <Field label="Instagram Handle" />
    <Field label="Status" type="select" options={['Active', 'Inactive']} />
    <SubmitButton label="Add Model" />
  </form>
</Drawer>
```

---

## Interaction Spec

| Interaction | Behaviour |
|-------------|-----------|
| ModelRosterCard click | Navigate to `/agency/models/[id]` (full-page detail) |
| "+ Add Model" | Opens AddModelDrawer (right slide-in) |
| ViewToggle grid | 3-column ModelRosterCard grid |
| ViewToggle list | Compact table rows with same data |
| Niche filter | Filter cards to selected niche(s) |
| Status filter | Show Active / Inactive / All |
| Search | Client-side filter by name or handle |
| Detail tab switch | AnimatePresence slide between detail tabs |
| "Edit" on detail | Inline form fields replace display values |
| "Deactivate" | Confirm modal → sets status to inactive |
| Utilization bar | Hover tooltip: "Booked 38h / Available 40h" |

---

## Reuse Instructions

- `KPIDeltaTile` — intelligence, 4x on detail overview tab
- `StatusStrip` — configure with roster stats
- `ViewToggle` — design system §7c
- `AddFilterPill` — design system §7a
- `ModelCard` from `features/models/` → **adapt as ModelRosterCard** (add utilization bar + earnings)
- `ModelDetailPage` from `features/models/` → **reuse as base** (6-tab detail view already exists)

**NEW components:**
- `UtilizationBar` — new, ~20 lines (A67)
- `ModelRosterCard` — adapt ModelCard, ~60 lines
- `ModelHeader` (detail) — new, ~40 lines

**Note on ModelDetailPage:** The existing `ModelDetailPage` from `features/models/` can serve as the base. Add agency-specific tabs (Earnings, Webcam) to the existing 6-tab structure.
