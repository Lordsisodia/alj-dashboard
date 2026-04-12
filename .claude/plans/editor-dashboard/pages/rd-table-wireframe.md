# R&D Table — Detailed Wireframe + Component Spec

**Route:** `/editor/rd-table`
**Feature directory:** `src/features/editors-dashboard/`
**Page file:** `src/app/isso/editor/rd-table/page.tsx`
**Status:** planned (P2–P4)
**Accent gradient:** `linear-gradient(135deg, #ff0069, #833ab4)` (OFM/ISSO pink)

---

## 1. ASCII Wireframe

### 1a. Full Page Shell

```
┌─────────────────────────────────────────────────────────────────────────────┐
│ bg-black p-5 gap-5 flex                                                     │
│  ┌──────────────────┐  ┌───────────────────────────────────────────────────┐│
│  │  IssoSidebarShell│  │  bg-white rounded-2xl flex-1 overflow-hidden      ││
│  │  w-16 + ~280px   │  │  ┌─────────────────────────────────────────────┐ ││
│  │  (collapsed/exp) │  │  │  ContentPageShell                           │ ││
│  │                  │  │  │  flex-1 flex flex-col overflow-hidden        │ ││
│  │                  │  │  │  (ROW 1) Header h-14                        │ ││
│  │                  │  │  │  (ROW 2) Tabs + Filter bar                  │ ││
│  │                  │  │  │  (ROW 3) Content area flex-1 overflow-hidden │ ││
│  │                  │  │  └─────────────────────────────────────────────┘ ││
│  └──────────────────┘  └───────────────────────────────────────────────────┘│
└─────────────────────────────────────────────────────────────────────────────┘
```

### 1b. ROW 1 — Header bar (h-14, px-3, border-bottom rgba(0,0,0,0.07))

```
┌─────────────────────────────────────────────────────────────────────────────┐
│ h-14 px-3 flex items-center gap-4                                           │
│                                                                             │
│  [FlaskConical 16px]  R&D Content Pipeline  [◉ 142 ideas]                  │
│                                                                             │
│                    ┌────────────────────────────────┐                      │
│                    │  🔍  Search ideas...        ⌘K  │  w-80 bg-#f5f5f4   │
│                    └────────────────────────────────┘                      │
│                                                                    [+ Add Idea ▾]│
│                                                      gradient pill h-9 rounded-xl│
└─────────────────────────────────────────────────────────────────────────────┘
```

Measurements:
- Icon: `FlaskConical` size 16, `text-neutral-500`
- Title: `text-sm font-semibold text-neutral-900`
- StatPill: `ml-3 bg-white border border-gray-500/20 rounded-2xl px-2.5 py-0.5` — label "ideas", value = `rdEntries.length`
- Search: `absolute left-1/2 -translate-x-1/2 w-80 h-9 rounded-xl bg-#f5f5f4 border rgba(0,0,0,0.07)`
- Action button: `h-9 rounded-xl overflow-hidden` with `accentGradient` — label "+ Add Idea", split chevron dropdown

Action dropdown items:
```
┌────────────────────────┐
│  📋  Add manually      │
│  🔗  Import from URL   │
│  📦  Bulk import CSV   │
└────────────────────────┘
```

### 1c. ROW 2 — Sub-nav tabs + filter bar (px-3 py-2, border-bottom rgba(0,0,0,0.07))

```
┌─────────────────────────────────────────────────────────────────────────────┐
│ px-3 py-2 flex items-center justify-between                                 │
│                                                                             │
│  LEFT:                                                                      │
│  [▤ Table View]  [◉ Graph View]  [▦ Gallery]  │ > Finished Reels           │
│   active=pink   inactive=neutral                                            │
│                                                                             │
│  RIGHT:                                                                     │
│  [Sunday Batch ◷]  [↕ Sort: Newest ▾]  [👁 Visibility]  [⊞ Add Filter]  [≡▦ Toggle]│
└─────────────────────────────────────────────────────────────────────────────┘
```

Tab details:
- Tab 1 "Table View" icon: `<TableProperties size={13} />` (or `<List size={13} />`)
- Tab 2 "Graph View" icon: `<Network size={13} />`
- Tab 3 "Gallery" icon: `<LayoutGrid size={13} />`
- Next product arrow: `→ Finished Reels` links to `/editor/finished`

Right-side filter controls (left to right):
1. `SundayBatchIndicator` — custom pill, described below
2. `SortPill` (reuse from intelligence/controls)
3. `VisibilityPill` (reuse from intelligence/controls)
4. `AddFilterPill` (from ContentPageShell, passed via `filterCategories`)
5. `ViewToggle` — only visible in Table tab (table/compact modes)

### 1d. ROW 3 — Content area (flex-1 overflow-hidden flex flex-col min-h-0)

#### TABLE VIEW (default tab)

```
┌─────────────────────────────────────────────────────────────────────────────┐
│ flex-1 flex flex-col min-h-0                                                │
│                                                                             │
│  ┌──────────────────────────────────────────────────────────────────────┐  │
│  │  PipelineStatusStrip                                                 │  │
│  │  [● Pipeline active] [142 ideas] [+12 this week] [4 pending review] │  │
│  │                                            [↻ Last batch: 3d ago]   │  │
│  └──────────────────────────────────────────────────────────────────────┘  │
│                                                                             │
│  ┌──────────────────────────────────────────────────────────────────────┐  │
│  │  TanStack Table (flex-1 overflow-y-auto)                             │  │
│  │  ┌───┬──────────────────┬───────────┬────────────┬────────┬───────┐  │  │
│  │  │☐  │  IDEA TITLE      │  MODEL    │  NICHE     │ STATUS │ SCORE │  │  │
│  │  ├───┼──────────────────┼───────────┼────────────┼────────┼───────┤  │  │
│  │  │☐  │ "5 morning rout…"│ @luna     │ 🏃 fitness  │●Proposed│  HIGH │  │  │  ← status=proposed [FIXED]
│  │  │   │ truncated desc…  │           │            │        │       │  │  │  ← description sub-line [FIXED]
│  │  ├───┼──────────────────┼───────────┼────────────┼────────┼───────┤  │  │
│  │  │☐  │ "What I eat in…" │ @jade     │ 🥗 wellness │✓Approved│ MED  │  │  │  ← PriorityBadge replaces ScoreRing [FIXED]
│  │  ├───┼──────────────────┼───────────┼────────────┼────────┼───────┤  │  │
│  │  │☐  │ "outfit unbox…"  │ unassigned│ 👗 fashion  │✗Rejected│ LOW  │  │  │
│  │  ├───┼──────────────────┼───────────┼────────────┼────────┼───────┤  │  │
│  │  │   │  ...             │           │            │        │       │  │  │
│  │  └───┴──────────────────┴───────────┴────────────┴────────┴───────┘  │  │
│  └──────────────────────────────────────────────────────────────────────┘  │
│                                                                             │
│  [EXPANDED ROW DETAIL PANEL — slides down inline below selected row]        │
│  ┌──────────────────────────────────────────────────────────────────────┐  │
│  │  w-full bg-#fafafa border-t border-b rgba(0,0,0,0.06)               │  │
│  │  flex gap-4 px-6 py-4                                                │  │
│  │                                                                       │  │
│  │  ┌─────────────────────────────────┐  ┌────────────────────────────┐│  │
│  │  │  ImportedReferenceCard          │  │  QuickAnnotate tags        ││  │
│  │  │  @sourceHandle / niche badge    │  │  theme • hook style • tone ││  │
│  │  │  outlier · views · ER metrics   │  │                            ││  │
│  │  │  hook line • emotion chips      │  │  [✓ Approve]  [✗ Reject]  ││  │
│  │  └─────────────────────────────────┘  └────────────────────────────┘│  │
│  └──────────────────────────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────────────────────────┘
```

Full column list for TanStack Table:
| # | Column key | Header | Width | Notes |
|---|-----------|--------|-------|-------|
| 0 | select | ☐ | 40px | Checkbox, bulk select |
| 1 | title | Idea Title | flex-1 min-w-[220px] | Bold text + source attribution sub-line |
| 2 | model | Model | 120px | Avatar + name or "unassigned" |
| 3 | niche | Niche | 110px | Niche color chip |
| 4 | theme | Theme | 120px | Text tag |
| 5 | status | Status | 130px | `ApprovalStatusBadge` |
| 6 | source | Source | 100px | `SourceBadge` chip — `editor_sunday \| analytics \| model_swipe \| ai_suggestion \| manual` [FIXED] |
| 7 | priority | Priority | 80px | `PriorityBadge` chip — HIGH/MED/LOW derived from `priorityScore` ranges (not `hookScore` — removed) [FIXED] |
| 8 | addedAt | Added | 90px | relative date |
| 9 | actions | — | 48px | `...` overflow menu |

#### GRAPH VIEW (tab 2)

```
┌─────────────────────────────────────────────────────────────────────────────┐
│ flex-1 flex overflow-hidden                                                 │
│                                                                             │
│  ┌──────────────────────────────────────────────┐  ┌─────────────────────┐ │
│  │  D3GraphCanvas                               │  │  GraphDetailPanel   │ │
│  │  flex-1 h-full                               │  │  w-72 flex-shrink-0 │ │
│  │                                              │  │                     │ │
│  │   ●─────●                                    │  │  [Node selected]    │ │
│  │   │  fitness   ◉ "5 morning…"               │  │  Title              │ │
│  │   ●      \    ◉ "What I eat…"               │  │  Model              │ │
│  │  lifestyle ●──◉ "wellness glow"              │  │  Status badge       │ │
│  │            │                                 │  │  Hook score ring    │ │
│  │           fashion                            │  │  Source card        │ │
│  │                                              │  │  [Approve][Reject]  │ │
│  │  Controls overlay (top-right):               │  │                     │ │
│  │  [+ Zoom In] [- Zoom Out] [⊡ Reset]          │  │                     │ │
│  └──────────────────────────────────────────────┘  └─────────────────────┘ │
└─────────────────────────────────────────────────────────────────────────────┘
```

Graph node types:
- Niche cluster nodes: large circles, niche color, label centered — [FIXED] cluster labels pulled dynamically from `api.rdEntries.distinctNiches()`, NOT hardcoded ('fitness','lifestyle','fashion')
- Entry nodes: smaller circles, color = status (proposed=amber, approved=green, rejected=red) // [FIXED] was 'pending'
- Edges: thin lines connecting entry → niche cluster
- Entry nodes sized by priorityScore (larger = higher score) // [FIXED] was hookScore — hookScore not in rdEntries schema
- Entry node status colors: proposed=amber, approved=green, rejected=red, assigned=blue, in_production=purple // [FIXED] was pending=amber

#### GALLERY VIEW (tab 3) — DEFERRED TO P4 [FIXED]

> **[FIXED]** Gallery View cut from P2 scope. Requires PostCard adaptation and 5-column responsive grid with no decision-making value over Table View. Tab shell kept (hidden/disabled) to avoid future rework. Do not build GalleryView component in P2.

```
┌─────────────────────────────────────────────────────────────────────────────┐
│ flex-1 overflow-y-auto px-6 py-6  [DISABLED in P2 — tab shell only]        │
│                                                                             │
│  ┌────────────┐ ┌────────────┐ ┌────────────┐ ┌────────────┐ ┌────────────┐│
│  │  PostCard  │ │  PostCard  │ │  PostCard  │ │  PostCard  │ │  PostCard  ││
│  │  thumbnail │ │  thumbnail │ │  thumbnail │ │  thumbnail │ │  thumbnail ││
│  │  4:5 ratio │ │            │ │            │ │            │ │            ││
│  │  ─────────  │ │            │ │            │ │            │ │            ││
│  │  @handle    │ │            │ │            │ │            │ │            ││
│  │  ● Pending  │ │  ✓ Approv. │ │  ✗ Reject. │ │  ● Pending │ │  ✓ Approv. ││
│  └────────────┘ └────────────┘ └────────────┘ └────────────┘ └────────────┘│
│  (5-col grid, gap-4, repeating)                                             │
└─────────────────────────────────────────────────────────────────────────────┘
```

Grid: `grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4`

---

## 2. Component Tree

```
RDTablePage                                    src/features/editors-dashboard/components/RDTableFeaturePage.tsx
└── ContentPageShell                           src/shared/layout/ContentPageShell.tsx
    │  (icon, title, stat, accentGradient, tabs, filterCategories, filterRightSlot, actionLabel, actionDropdownItems)
    │
    ├── [filterRightSlot] SundayBatchIndicator src/features/editors-dashboard/components/rd-table/SundayBatchIndicator.tsx  [NEW]
    ├── [filterRightSlot] SortPill             src/features/intelligence/components/controls/SortPill.tsx  [REUSE]
    ├── [filterRightSlot] VisibilityPill       src/features/intelligence/components/controls/VisibilityPill.tsx  [REUSE]
    │    (columns: title,model,niche,theme,status,source,hookScore,addedAt)
    │
    └── [children] AnimatePresence mode="wait"
        ├── [activeTab="table"] TableView      src/features/editors-dashboard/components/rd-table/TableView.tsx  [NEW]
        │   ├── PipelineStatusStrip            src/features/intelligence/components/dashboard/PipelineStatusStrip.tsx  [REUSE]
        │   ├── BulkActionBar                  src/features/editors-dashboard/components/rd-table/BulkActionBar.tsx  [NEW]
        │   │    (visible when selectedIds.length > 0)
        │   └── RDTanStackTable                src/features/editors-dashboard/components/rd-table/RDTanStackTable.tsx  [NEW]
        │       ├── RDEntryRow (×n)            src/features/editors-dashboard/components/rd-table/RDEntryRow.tsx  [NEW]
        │       └── RDRowDetailPanel           src/features/editors-dashboard/components/rd-table/RDRowDetailPanel.tsx  [NEW]
        │           ├── ImportedReferenceCard  src/features/content-gen/components/scenes/ImportedReferenceCard.tsx  [REUSE — adapted]
        │           ├── QuickAnnotate          src/features/hub-swipe/components/QuickAnnotate.tsx  [REUSE]
        │           ├── ApprovalStatusBadge    src/features/editors-dashboard/components/rd-table/ApprovalStatusBadge.tsx  [NEW]
        │           └── ApprovalActionRow      src/features/editors-dashboard/components/rd-table/ApprovalActionRow.tsx  [NEW]
        │
        ├── [activeTab="graph"] GraphView      src/features/editors-dashboard/components/rd-table/GraphView.tsx  [NEW]
        │   ├── D3GraphCanvas                  src/features/editors-dashboard/components/rd-table/D3GraphCanvas.tsx  [NEW]
        │   └── GraphDetailPanel              src/features/editors-dashboard/components/rd-table/GraphDetailPanel.tsx  [NEW]
        │       ├── ScoreRing                  src/features/intelligence/components/shared/ScoreRing.tsx  [REUSE]
        │       ├── ImportedReferenceCard      src/features/content-gen/components/scenes/ImportedReferenceCard.tsx  [REUSE — adapted]
        │       └── ApprovalActionRow          (same component, reused)
        │
        └── [activeTab="gallery"] GalleryView src/features/editors-dashboard/components/rd-table/GalleryView.tsx  [NEW]
            └── PostCard (×n)                  src/features/community/components/feed/PostCard.tsx  [REUSE — adapted]
                └── ApprovalStatusBadge        (overlaid, bottom of card)
```

---

## 3. Per-Component Spec

### 3.1 RDTableFeaturePage (root page component)

**File:** `src/features/editors-dashboard/components/RDTableFeaturePage.tsx`

```typescript
// No external props — owns all state

// Internal state
const [activeTab, setActiveTab]             = useState<'table' | 'graph' | 'gallery'>('table');
const [sortId, setSortId]                   = useState<RDSortId>('newest');
const [visibility, setVisibility]           = useState<RDVisibilityState>(DEFAULT_VISIBILITY);
const [selectedIds, setSelectedIds]         = useState<Set<string>>(new Set());
const [expandedRowId, setExpandedRowId]     = useState<string | null>(null);
const [selectedNodeId, setSelectedNodeId]   = useState<string | null>(null);
const [addModalOpen, setAddModalOpen]       = useState(false);
const [activeFilters, setActiveFilters]     = useState<Record<string, string>>({});
const [searchQuery, setSearchQuery]         = useState('');

// Data
const entries = useQuery(api.rdEntries.list) ?? [];
```

**Outer container classes:** none (ContentPageShell fills the white card shell)

**ContentPageShell props passed:**
```typescript
<ContentPageShell
  icon={<FlaskConical size={16} />}
  title="R&D Content Pipeline"
  stat={{ label: 'ideas', value: entries.length }}
  searchPlaceholder="Search ideas..."
  accentGradient="linear-gradient(135deg, #ff0069, #833ab4)"
  actionLabel="Add Idea"
  actionIcon={<Plus size={14} />}
  onAction={() => setAddModalOpen(true)}
  actionDropdownItems={[
    { id: 'manual', label: 'Add manually', icon: <ClipboardList size={13} />, onClick: () => setAddModalOpen(true) },
    { id: 'url',    label: 'Import from URL', icon: <Link2 size={13} />,       onClick: handleImportUrl },
    { id: 'csv',    label: 'Bulk import CSV', icon: <Upload size={13} />,      onClick: handleBulkImport },
  ]}
  tabs={[
    { id: 'table',   label: 'Table View',  icon: <TableProperties size={13} /> },
    { id: 'graph',   label: 'Graph View',  icon: <Network size={13} /> },
    { id: 'gallery', label: 'Gallery',     icon: <LayoutGrid size={13} /> },
  ]}
  activeTab={activeTab}
  onTabChange={id => setActiveTab(id as typeof activeTab)}
  nextProduct={{ label: 'Finished Reels', icon: <Film size={12} />, href: '/editor/finished' }}
  filterCategories={RD_FILTER_CATEGORIES}
  onFilterSelect={(cat, val) => setActiveFilters(prev => ({ ...prev, [cat]: val }))}
  filterRightSlot={
    <div className="flex items-center gap-1.5">
      <SundayBatchIndicator />
      <SortPill value={sortId} onChange={setSortId} />
      <VisibilityPill value={visibility} onChange={setVisibility} />
    </div>
  }
  searchValue={searchQuery}
  onSearch={setSearchQuery}
>
  {/* tab content */}
</ContentPageShell>
```

**Filter categories config (`RD_FILTER_CATEGORIES`):**
```typescript
// src/features/editors-dashboard/components/rd-table/filterConfig.ts
import type { FilterCategory } from '@/shared/layout/ContentPageShell';

export const RD_FILTER_CATEGORIES: FilterCategory[] = [
  {
    id: 'model',
    label: 'Model',
    icon: <User size={12} />,
    options: [], // populated from useQuery(api.models.getAll)
  },
  {
    id: 'niche',
    label: 'Niche',
    icon: <Tag size={12} />,
    options: [
      { value: 'fitness'   },
      { value: 'lifestyle' },
      { value: 'fashion'   },
      { value: 'wellness'  },
    ],
  },
  {
    id: 'theme',
    label: 'Theme',
    icon: <Lightbulb size={12} />,
    options: [], // populated dynamically from distinct themes in rdEntries
  },
  {
    id: 'status',
    label: 'Status',
    icon: <CheckCircle2 size={12} />,
    options: [
      { value: 'proposed'     },  // [FIXED] was 'pending'
      { value: 'approved'     },
      { value: 'assigned'     },  // [FIXED] added
      { value: 'in_production'},  // [FIXED] added
      { value: 'completed'    },  // [FIXED] added
      { value: 'rejected'     },
    ],
  },
  {
    id: 'source',
    label: 'Source',
    icon: <ExternalLink size={12} />,
    options: [
      { value: 'editor_sunday' },  // [FIXED] updated to match rdEntries.source enum
      { value: 'analytics'     },
      { value: 'model_swipe'   },
      { value: 'ai_suggestion' },
      { value: 'manual'        },
    ],
  },
  {
    id: 'category',
    label: 'Category',
    icon: <Tag size={12} />,
    options: [], // [FIXED] added — populated from distinct categories in rdEntries (hook_reel, tutorial, thirst_trap, etc.)
  },
  { id: 'saved', label: 'Saved Filters', icon: <Bookmark size={12} /> },
];
```

---

### 3.2 TableView

**File:** `src/features/editors-dashboard/components/rd-table/TableView.tsx`

```typescript
interface TableViewProps {
  entries:       RDEntry[];
  sortId:        RDSortId;
  visibility:    RDVisibilityState;
  selectedIds:   Set<string>;
  expandedRowId: string | null;
  onSelect:      (id: string, checked: boolean) => void;
  onSelectAll:   (checked: boolean) => void;
  onRowExpand:   (id: string | null) => void;
  onApprove:     (id: string) => void;
  onReject:      (id: string) => void;
  onBulkApprove: () => void;
  onBulkReject:  () => void;
}
```

**Outer container:** `className="flex flex-col flex-1 min-h-0 overflow-hidden"`

**Internal layout:**
```tsx
<div className="flex flex-col flex-1 min-h-0 overflow-hidden">
  <div className="px-6 pt-4 pb-2 flex-shrink-0">
    <PipelineStatusStrip ... />
  </div>
  {selectedIds.size > 0 && <BulkActionBar ... />}
  <div className="flex-1 overflow-y-auto px-6 pb-6">
    <RDTanStackTable ... />
  </div>
</div>
```

---

### 3.3 RDTanStackTable

**File:** `src/features/editors-dashboard/components/rd-table/RDTanStackTable.tsx`

```typescript
interface RDTanStackTableProps {
  entries:       RDEntry[];
  visibility:    RDVisibilityState;
  selectedIds:   Set<string>;
  expandedRowId: string | null;
  onSelect:      (id: string, checked: boolean) => void;
  onSelectAll:   (checked: boolean) => void;
  onRowExpand:   (id: string | null) => void;
  onApprove:     (id: string) => void;
  onReject:      (id: string) => void;
}
```

**Outer container:**
```
className="w-full"
style={{ border: '1px solid rgba(0,0,0,0.07)', borderRadius: '12px', overflow: 'hidden' }}
```

**Column definitions (TanStack Table v8):**
```typescript
import { createColumnHelper } from '@tanstack/react-table';
const col = createColumnHelper<RDEntry>();

const columns = [
  col.display({
    id: 'select',
    size: 40,
    header: ({ table }) => <Checkbox checked={table.getIsAllRowsSelected()} onChange={...} />,
    cell: ({ row }) => <Checkbox checked={row.getIsSelected()} onChange={...} />,
  }),
  col.accessor('title', {
    header: 'Idea Title',
    size: 240,
    cell: ({ row }) => <RDTitleCell entry={row.original} />,
  }),
  col.accessor('modelId', {
    header: 'Model',
    size: 120,
    cell: ({ getValue }) => <RDModelCell modelId={getValue()} />,
  }),
  col.accessor('niche', {
    header: 'Niche',
    size: 110,
    cell: ({ getValue }) => <NicheChip niche={getValue()} />,
  }),
  col.accessor('theme', {
    header: 'Theme',
    size: 120,
    cell: ({ getValue }) => <span className="text-xs text-neutral-600">{getValue()}</span>,
  }),
  col.accessor('status', {
    header: 'Status',
    size: 130,
    cell: ({ getValue }) => <ApprovalStatusBadge status={getValue()} />,
  }),
  col.accessor('source', {
    // [FIXED] was col.accessor('sourceHandle') — source is the canonical enum field
    header: 'Source',
    size: 100,
    cell: ({ row }) => <SourceBadge source={row.original.source} />,
  }),
  col.accessor('priorityScore', {
    // [FIXED] was col.accessor('hookScore') — hookScore not in rdEntries schema
    // PriorityBadge derives HIGH/MED/LOW from priorityScore ranges (0-100)
    header: 'Priority',
    size: 80,
    cell: ({ getValue }) => <PriorityBadge score={getValue() ?? 0} />,
    // PriorityBadge: score >= 70 → HIGH, 40-69 → MED, < 40 → LOW
  }),
  col.accessor('_creationTime', {
    id: 'addedAt',
    header: 'Added',
    size: 90,
    cell: ({ getValue }) => <span className="text-xs text-neutral-400">{timeAgo(getValue())}</span>,
  }),
  col.display({
    id: 'actions',
    size: 48,
    cell: ({ row }) => <RDRowOverflowMenu entry={row.original} />,
  }),
];
```

**Table header row:**
```
bg-#fafafa border-bottom rgba(0,0,0,0.07)
th: px-3 py-2.5 text-[11px] font-semibold text-neutral-400 uppercase tracking-[0.05em] text-left
```

**Table data row (RDEntryRow):**
```
tr: h-12 hover:bg-black/[0.02] cursor-pointer transition-colors border-bottom rgba(0,0,0,0.05)
tr[selected]: bg-pink-50/40
tr[expanded]: bg-#fafafa border-bottom-none
td: px-3 py-2 text-sm text-neutral-700 align-middle
```

---

### 3.4 RDEntryRow

**File:** Inline within `RDTanStackTable` (rendered via TanStack Table row virtualization)

The row renders two logical elements inside the table body:
1. The data row `<tr>` with all column cells
2. Conditionally: an expanded detail `<tr>` with `colSpan={columns.length}` containing `RDRowDetailPanel`

```typescript
// Expanded detail row
<tr>
  <td colSpan={columns.length} className="p-0">
    <AnimatePresence>
      {isExpanded && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
          exit={{ opacity: 0, height: 0 }}
          transition={{ duration: 0.2, ease: [0.25, 0.1, 0.25, 1] }}
          className="overflow-hidden"
          style={{ borderBottom: '1px solid rgba(0,0,0,0.07)' }}
        >
          <RDRowDetailPanel entry={entry} onApprove={onApprove} onReject={onReject} />
        </motion.div>
      )}
    </AnimatePresence>
  </td>
</tr>
```

---

### 3.5 RDRowDetailPanel

**File:** `src/features/editors-dashboard/components/rd-table/RDRowDetailPanel.tsx`

```typescript
interface RDRowDetailPanelProps {
  entry:     RDEntry;
  onApprove: (id: string) => void;
  onReject:  (id: string) => void;
}
```

**Outer container:**
```
className="flex gap-4 px-6 py-4 bg-[#fafafa]"
style={{ borderTop: '1px solid rgba(0,0,0,0.05)' }}
```

**Internal layout (3 columns):**
```
┌────────────────────────────┬───────────────────────────┬─────────────────┐
│  ImportedReferenceCard     │  QuickAnnotate             │ ApprovalAction  │
│  w-72 flex-shrink-0        │  flex-1                    │ w-40 flex-shrink│
│  (adapted — only when      │  (tags: theme, hook style, │ [✓ Approve]     │
│   referencePostId set;     │   tone, format)            │ [✗ Reject]      │
│   else plain desc card)    │                            │                 │
└────────────────────────────┴───────────────────────────┴─────────────────┘
```

> **[FIXED] Detail panel additions:**
> - **description field:** Always shown as plain text card (`entry.description`) — required field in canonical schema, was missing from wireframe.
> - **contentRequestId linkage:** When `entry.contentRequestId` is set, show "Brief sent →" badge linking to `/editor` queue. Indicates idea is already in-flight. [FIXED]
> - **createdBy:** Show "Added by [name]" tag using `entry.createdBy` lookup. Useful for tracking idea origin. [FIXED]
> - **source fields (ImportedReferenceCard):** Only render when `entry.referencePostId` is populated. Fall back to description card for manually-entered ideas. [FIXED]

**Adaptation for ImportedReferenceCard:** The component expects `Doc<'scenes'>` shape. Create a local adapter:

> [FIXED] Adapter now conditionally renders source fields only when `rdEntries.referencePostId` is populated. For manually-entered ideas (no source post), fall back to a plain text description card instead of an ImportedReferenceCard with mostly-null fields.

```typescript
// Map RDEntry → scenes-compatible shape for ImportedReferenceCard
// [FIXED] Only populate source fields when referencePostId is set
function toSceneShape(entry: RDEntry): Partial<Doc<'scenes'>> | null {
  if (!entry.referencePostId) return null; // fall back to description card
  return {
    sourceHandle:        entry.sourceHandle,
    sourceVerified:      entry.sourceVerified ?? false,
    sourceNiche:         entry.niche,
    sourceViews:         entry.sourceViews,
    // [FIXED] sourceEngagementRate, sourceOutlierRatio, sourceEmotions removed from default render
    // — only populated when referencePostId exists and these fields are non-null
    sourceHookLine:      entry.sourceHookLine,
  };
}
// In RDRowDetailPanel: if toSceneShape returns null, render a plain description card:
// <div className="text-sm text-neutral-700 leading-relaxed">{entry.description}</div>
```

> [FIXED] `description` field added to detail panel — `rdEntries.description` is required in canonical schema but was missing from the wireframe detail panel.

---

### 3.6 ApprovalStatusBadge

**File:** `src/features/editors-dashboard/components/rd-table/ApprovalStatusBadge.tsx`

> [FIXED] Status enum updated to match canonical `rdEntries.status` from `CONVEX_SCHEMA_ADDITIONS.md`. `pending` and `batch_scheduled` removed; `proposed`, `assigned`, `in_production`, `completed` added.

```typescript
// [FIXED] Canonical enum — do NOT use 'pending' or 'batch_scheduled'
type ApprovalStatus = 'proposed' | 'approved' | 'assigned' | 'in_production' | 'completed' | 'rejected';

interface ApprovalStatusBadgeProps {
  status: ApprovalStatus;
  size?:  'sm' | 'md';   // sm = table cell, md = detail panel
}
```

**Visual variants:**
```typescript
const STATUS_CONFIG: Record<ApprovalStatus, { label: string; dot: string; text: string; bg: string; border: string }> = {
  proposed: {         // [FIXED] was 'pending'
    label:  'Proposed',
    dot:    '#f59e0b',
    text:   '#92400e',
    bg:     '#fef3c7',
    border: '#fde68a',
  },
  approved: {
    label:  'Approved',
    dot:    '#22c55e',
    text:   '#14532d',
    bg:     '#dcfce7',
    border: '#bbf7d0',
  },
  assigned: {         // [FIXED] new variant
    label:  'Assigned',
    dot:    '#3b82f6',
    text:   '#1e3a8a',
    bg:     '#dbeafe',
    border: '#bfdbfe',
  },
  in_production: {    // [FIXED] new variant
    label:  'In Production',
    dot:    '#a855f7',
    text:   '#581c87',
    bg:     '#f3e8ff',
    border: '#e9d5ff',
  },
  completed: {        // [FIXED] new variant
    label:  'Completed',
    dot:    '#10b981',
    text:   '#064e3b',
    bg:     '#d1fae5',
    border: '#a7f3d0',
  },
  rejected: {
    label:  'Rejected',
    dot:    '#ef4444',
    text:   '#7f1d1d',
    bg:     '#fee2e2',
    border: '#fecaca',
  },
  // [FIXED] 'batch_scheduled' removed — not a canonical status
};
```

**Rendered as:**
```tsx
<span
  className="inline-flex items-center gap-1.5 px-2 py-1 rounded-lg text-[11px] font-semibold"
  style={{ color: cfg.text, backgroundColor: cfg.bg, border: `1px solid ${cfg.border}` }}
>
  <span className="w-1.5 h-1.5 rounded-full flex-shrink-0" style={{ backgroundColor: cfg.dot }} />
  {cfg.label}
</span>
```

---

### 3.7 SundayBatchIndicator (NEW)

**File:** `src/features/editors-dashboard/components/rd-table/SundayBatchIndicator.tsx`

```typescript
// No props — reads internal schedule state
// Shows: next Sunday date, count of pending items queued for batch review
```

**Visual:**
```tsx
<button
  className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-colors"
  style={{ border: '1px solid rgba(0,0,0,0.09)' }}
  // inactive: text-neutral-500 hover:bg-black/[0.04]
  // active (today is Sunday or batch running): text-purple-700 bg-purple-50 border-purple-200
>
  <Clock size={12} style={{ color: '#833ab4' }} />
  Sun Batch
  <span
    className="text-[9px] font-semibold px-1 py-0.5 rounded"
    style={{ backgroundColor: '#f5f3ff', color: '#7c3aed' }}
  >
    {pendingCount}
  </span>
</button>
```

**Data:** `const pendingCount = useQuery(api.rdEntries.countByStatus, { status: 'proposed' }) ?? 0` // [FIXED] was 'pending' — canonical status is 'proposed'

**Dropdown (click to open):**
```
┌────────────────────────────────────────┐
│  Next batch: Sunday, Apr 14            │
│  ─────────────────────────────────────  │
│  📋  14 ideas pending review           │
│  ✓   Auto-approve threshold: 7.5+      │
│  [Run batch now]  (senior role only)   │
└────────────────────────────────────────┘
```
Container: `w-64 rounded-xl` with standard dropdown shadow

---

### 3.8 BulkActionBar (NEW)

**File:** `src/features/editors-dashboard/components/rd-table/BulkActionBar.tsx`

```typescript
interface BulkActionBarProps {
  selectedCount: number;
  onApproveAll:  () => void;
  onRejectAll:   () => void;
  onClearAll:    () => void;
}
```

**Container:**
```
className="mx-6 mb-2 flex items-center gap-3 px-4 py-2.5 rounded-xl flex-shrink-0"
style={{ background: 'linear-gradient(135deg, #ff006912, #833ab412)', border: '1px solid #ff006930' }}
```

**Content:**
```tsx
<span className="text-xs font-semibold text-neutral-700">{selectedCount} selected</span>
<div className="flex-1" />
<button onClick={onApproveAll} className="px-3 py-1.5 rounded-lg text-xs font-semibold text-white"
  style={{ background: 'linear-gradient(135deg, #22c55e, #16a34a)' }}>
  ✓ Approve all
</button>
<button onClick={onRejectAll} className="px-3 py-1.5 rounded-lg text-xs font-semibold text-white"
  style={{ background: 'linear-gradient(135deg, #ef4444, #b91c1c)' }}>
  ✗ Reject all
</button>
<button onClick={onClearAll} className="px-2 py-1.5 rounded-lg text-xs text-neutral-400 hover:text-neutral-600 hover:bg-black/[0.04]">
  Clear
</button>
```

---

### 3.9 PipelineStatusStrip (REUSE)

**Import:** `import { PipelineStatusStrip } from '@/features/intelligence/components/dashboard/PipelineStatusStrip'`

**Prop adaptation for R&D context:**
```typescript
<PipelineStatusStrip
  totalIndexed={entries.length}
  postsThisWeek={entriesThisWeek}
  latestScrapeAt={lastBatchAt}
  inQueue={pendingCount}
  analysedCount={approvedCount}
  avgHookScore={avgHookScore}
  controlsSlot={null}
/>
```
// [FIXED] PipelineStatusStrip prop naming: 'latestScrapeAt' is semantically wrong here (it means social scrape time).
// For R&D context this is the last approval batch time. Either rename the prop to 'lastBatchAt'
// on PipelineStatusStrip or build an RDStatusStrip variant. Do NOT silently pass lastBatchAt → latestScrapeAt.
Note: `latestScrapeAt` maps to `lastBatchAt` from `rdEntries` Convex query — see fix note above.

---

### 3.10 SortPill (REUSE)

**Import:** `import { SortPill } from '@/features/intelligence/components/controls/SortPill'`

**Prop adaptation:**
```typescript
// SortPill expects SortId from intelligence/types.ts
// [FIXED] R&D sort options updated — 'most-likes' and 'most-views' don't exist on rdEntries
// Canonical sort options for rdEntries:
type RDSortId = 'newest' | 'oldest' | 'highest-priority' | 'lowest-priority' | 'model';

// SortPill's SORT_OPTIONS are hardcoded internally — it will show all 7 options.
// This is acceptable; the unused options simply won't match rdEntries sort logic.
// Pass value + onChange directly:
<SortPill value={sortId as SortId} onChange={id => setSortId(id as RDSortId)} />
```

---

### 3.11 VisibilityPill (REUSE)

**Import:** `import { VisibilityPill } from '@/features/intelligence/components/controls/VisibilityPill'`

**Prop adaptation:**
VisibilityPill internally renders fixed keys (brandDetails, likeCount, viewCount, saveCount). For R&D Table, we need different column labels. Create a local wrapper:

```typescript
// RDVisibilityPill.tsx — thin wrapper that maps RD column names to VisibilityPill keys
type RDVisibilityState = {
  model:     boolean;  // maps to brandDetails
  theme:     boolean;  // maps to likeCount slot
  source:    boolean;  // maps to viewCount slot
  hookScore: boolean;  // maps to saveCount slot
};

// Alternative: build a bespoke VisibilityPill for RD with exact column labels.
// Recommendation: BUILD a new RDVisibilityPill that clones VisibilityPill's
// visual pattern but uses RD-specific keys.
```

**New RDVisibilityPill props:**
```typescript
interface RDVisibilityState {
  model:     boolean;
  niche:     boolean;
  theme:     boolean;
  status:    boolean;
  source:    boolean;
  hookScore: boolean;
  addedAt:   boolean;
}
```

---

### 3.12 ScoreRing (REUSE)

**Import:** `import { ScoreRing } from '@/features/intelligence/components/shared/ScoreRing'`

**Usage in table cell:** `<ScoreRing score={entry.hookScore} size={32} />`
**Usage in GraphDetailPanel:** `<ScoreRing score={selectedEntry.hookScore} size={56} />`

No adaptation needed — props match directly.

---

### 3.13 GraphView

**File:** `src/features/editors-dashboard/components/rd-table/GraphView.tsx`

```typescript
interface GraphViewProps {
  entries:          RDEntry[];
  selectedNodeId:   string | null;
  onNodeSelect:     (id: string | null) => void;
  onApprove:        (id: string) => void;
  onReject:         (id: string) => void;
}
```

**Outer container:** `className="flex flex-1 min-h-0 overflow-hidden"`

**D3GraphCanvas:**
```typescript
interface D3GraphCanvasProps {
  nodes:          GraphNode[];       // entries + niche cluster nodes
  links:          GraphLink[];       // entry → niche edges
  selectedNodeId: string | null;
  onNodeClick:    (id: string) => void;
}

type GraphNode =
  | { type: 'entry'; id: string; label: string; status: ApprovalStatus; hookScore: number; niche: string }
  | { type: 'cluster'; id: string; label: string; niche: string };

type GraphLink = { source: string; target: string };
```

**D3 force simulation config:**
```typescript
const simulation = d3.forceSimulation(nodes)
  .force('link',    d3.forceLink(links).id(d => d.id).distance(80).strength(0.5))
  .force('charge',  d3.forceManyBody().strength(-180))
  .force('center',  d3.forceCenter(width / 2, height / 2))
  .force('collide', d3.forceCollide().radius(d => d.type === 'cluster' ? 40 : 16));
```

**Node rendering:**
- Cluster nodes: `r=28` fill=niche color at 20% opacity, stroke=niche color, label centered in SVG `<text>`
- Entry nodes: `r = 8 + (hookScore / 10) * 8` (range 8–16px), fill=status color
- Selected node: stroke=`#ff0069` strokeWidth=3 with drop shadow

**Container:** `<svg ref={svgRef} className="flex-1 h-full" />` with zoom/pan via `d3.zoom()`

**GraphDetailPanel:**
```typescript
interface GraphDetailPanelProps {
  entry:     RDEntry | null;  // null = show empty state
  onApprove: (id: string) => void;
  onReject:  (id: string) => void;
}
```
Container: `className="w-72 flex-shrink-0 border-l overflow-y-auto p-4 flex flex-col gap-3"` `style={{ borderColor: 'rgba(0,0,0,0.07)' }}`

---

### 3.14 GalleryView

**File:** `src/features/editors-dashboard/components/rd-table/GalleryView.tsx`

```typescript
interface GalleryViewProps {
  entries:   RDEntry[];
  onApprove: (id: string) => void;
  onReject:  (id: string) => void;
}
```

**Outer container:** `className="flex-1 overflow-y-auto px-6 py-6"`

**Grid:** `className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4"`

**PostCard adaptation:**
PostCard is `src/features/community/components/feed/PostCard.tsx` — expects a community post shape. Use a wrapper that overlays `ApprovalStatusBadge`:
```tsx
<div className="relative">
  <PostCard post={toPostShape(entry)} />
  <div className="absolute bottom-2 left-2">
    <ApprovalStatusBadge status={entry.status} size="sm" />
  </div>
</div>
```

---

### 3.15 AddRDEntryModal (NEW)

**File:** `src/features/editors-dashboard/components/rd-table/AddRDEntryModal.tsx`

```typescript
interface AddRDEntryModalProps {
  open:    boolean;
  onClose: () => void;
  onSave:  (entry: NewRDEntry) => void;
}

interface NewRDEntry {
  title:       string;
  description: string;   // [FIXED] required — was missing from modal form
  niche:       string;   // [FIXED] free string not enum — use NICHES constant for combobox options
  category?:   string;   // [FIXED] added — hook_reel | tutorial | thirst_trap etc
  theme:       string;
  sourceUrl?:  string;
  modelId?:    string;
  notes?:      string;
}
// [FIXED] AddRDEntryModal niche field: replace hardcoded pill selector with a combobox
// that loads distinct niche values from api.models.getNiches() + allows free-text entry
// This prevents niche divergence across the system
```

**Follows standard modal pattern from design system (section 12):**
- `dialog` + `bg-black/30 backdrop-blur-sm` overlay
- `motion.div initial={{ opacity: 0, scale: 0.95 }}` entrance
- `bg-white rounded-2xl shadow-2xl w-80`
- Form fields: title (required), niche (pill selector), theme (text input), source URL (optional), model (optional dropdown), notes (textarea)
- Submit button: `accentGradient = 'linear-gradient(135deg, #ff0069, #833ab4)'`

---

## 4. Data Layer

### 4.1 Convex query: `rdEntries`

> **[FIXED — BLOCKER] DO NOT define table schemas here.** The canonical schema is `CONVEX_SCHEMA_ADDITIONS.md`. Reference that file exclusively. Any additions go in that file first, then reference from here. The schema block below is for reference only — the implementation worker must NOT create a divergent table definition.

> **[FIXED]** Key corrections vs original wireframe schema:
> - `status` enum changed to canonical: `proposed | approved | assigned | in_production | completed | rejected` (removed `pending`, `batch_scheduled`)
> - `description: v.string()` added (required field, was missing)
> - `category`, `priorityScore`, `performanceTags`, `linkedPostAnalysisId`, `contentHash`, `createdBy`, `contentRequestId` added (all in canonical schema)
> - `hookScore` removed (not in canonical schema — lives on `scrapedPosts`/`postAnalyses`)
> - `niche` changed to `v.string()` (free string, not enum) — use `NICHES` constant for dropdowns
> - `batchId` omitted (not in canonical schema)
> - `source` enum: `editor_sunday | analytics | model_swipe | ai_suggestion | manual`

```typescript
// convex/rdEntries.ts (to be created)
// REFERENCE ONLY — canonical schema is CONVEX_SCHEMA_ADDITIONS.md

// Table schema (add to CONVEX_SCHEMA_ADDITIONS.md, NOT here):
rdEntries: defineTable({
  title:               v.string(),
  description:         v.string(),                    // [FIXED] required — was missing
  niche:               v.string(),                    // [FIXED] free string, not enum
  category:            v.optional(v.string()),        // [FIXED] hook_reel | tutorial | thirst_trap etc
  theme:               v.optional(v.string()),
  status:              v.union(                       // [FIXED] canonical enum
    v.literal('proposed'),
    v.literal('approved'),
    v.literal('assigned'),
    v.literal('in_production'),
    v.literal('completed'),
    v.literal('rejected'),
  ),
  source:              v.union(                       // [FIXED] added source enum
    v.literal('editor_sunday'),
    v.literal('analytics'),
    v.literal('model_swipe'),
    v.literal('ai_suggestion'),
    v.literal('manual'),
  ),
  priorityScore:       v.optional(v.number()),        // [FIXED] 0-100, replaces hookScore
  modelId:             v.optional(v.id('models')),
  createdBy:           v.optional(v.id('teamMembers')), // [FIXED] added
  contentRequestId:    v.optional(v.id('contentRequests')), // [FIXED] linkage to brief
  referencePostId:     v.optional(v.string()),        // [FIXED] links to scraped post
  sourceHandle:        v.optional(v.string()),
  sourceUrl:           v.optional(v.string()),
  sourcePlatform:      v.optional(v.string()),
  sourceVerified:      v.optional(v.boolean()),
  sourceViews:         v.optional(v.number()),
  sourceHookLine:      v.optional(v.string()),
  notes:               v.optional(v.string()),
  approvedAt:          v.optional(v.number()),
  approvedBy:          v.optional(v.id('teamMembers')),
  // [FIXED] hookScore removed — not in canonical schema
  // [FIXED] batchId removed — not in canonical schema
})
  .index('by_status',   ['status'])
  .index('by_niche',    ['niche'])
  .index('by_model',    ['modelId'])
  .index('by_source',   ['source'])                   // [FIXED] added
  .searchIndex('search_title', { searchField: 'title', filterFields: ['status', 'niche'] }),

// Queries needed:
api.rdEntries.list         // all entries, optional filters
api.rdEntries.countByStatus // count for SundayBatchIndicator
api.rdEntries.getById      // for detail panel

// Mutations needed:
api.rdEntries.create       // add new entry
api.rdEntries.updateStatus // approve/reject single
api.rdEntries.bulkUpdateStatus // approve/reject multiple
api.rdEntries.runBatchApproval // Sunday batch (senior only)
```

### 4.2 Local TypeScript type

```typescript
// src/features/editors-dashboard/types.ts
import type { Doc } from '@/convex/_generated/dataModel';

export type RDEntry = Doc<'rdEntries'>;
// [FIXED] Canonical status enum — matches rdEntries.status in CONVEX_SCHEMA_ADDITIONS.md
export type ApprovalStatus = 'proposed' | 'approved' | 'assigned' | 'in_production' | 'completed' | 'rejected';
// [FIXED] Sort options updated — 'most-likes'/'most-views' don't exist on rdEntries
export type RDSortId = 'newest' | 'oldest' | 'highest-priority' | 'lowest-priority' | 'model';

export interface RDVisibilityState {
  model:     boolean;
  niche:     boolean;
  theme:     boolean;
  status:    boolean;
  source:    boolean;
  priority:  boolean;  // [FIXED] was hookScore — PriorityBadge replaces ScoreRing
  addedAt:   boolean;
}

export const DEFAULT_VISIBILITY: RDVisibilityState = {
  model:     true,    // [FIXED] default hidden for Sunday batch workflow — set false for batch context
  niche:     true,
  theme:     true,
  status:    true,
  source:    true,
  priority:  true,
  addedAt:   true,
};
```

---

## 5. Interaction Spec

### 5.1 Click a row → expand detail panel

**Trigger:** Click anywhere on a `<tr>` (except checkbox column)
**Effect:**
1. `setExpandedRowId(id)` — if same row, collapse (`setExpandedRowId(null)`)
2. A new `<tr>` is rendered immediately below with `colSpan={columns.length}`
3. `RDRowDetailPanel` slides in via Framer Motion:
   ```tsx
   <motion.div
     initial={{ opacity: 0, height: 0 }}
     animate={{ opacity: 1, height: 'auto' }}
     exit={{ opacity: 0, height: 0 }}
     transition={{ duration: 0.2, ease: [0.25, 0.1, 0.25, 1] }}
   >
   ```
4. Row background changes to `bg-[#fafafa]`
5. Only one row can be expanded at a time — expanding a new row auto-collapses the previous

### 5.2 Click "Approve" → status change + notification

**Trigger:** Approve button in `ApprovalActionRow` (detail panel or bulk action bar)
**Effect:**
1. Optimistic update: `setLocalStatus(id, 'approved')` immediately
2. Call `useMutation(api.rdEntries.updateStatus)({ id, status: 'approved', approvedBy: currentUser })`
3. Row's `ApprovalStatusBadge` transitions: amber pill → green pill
   - Framer Motion `layoutId` on the badge dot for smooth color transition
4. `PipelineStatusStrip` `analysedCount` increments by 1
5. Toast notification (use existing toast system if available, else simple in-place confirmation):
   ```
   ✓  "5 morning routines" approved
   ```
6. If this was the last pending item: `SundayBatchIndicator` badge count goes to 0

**Reject flow:** identical, outcome = 'rejected', badge turns red.

### 5.3 Switch view mode → animate transition

**Trigger:** Click a tab (Table / Graph / Gallery)
**Effect:**
```tsx
<AnimatePresence mode="wait">
  <motion.div
    key={activeTab}
    initial={{ opacity: 0, x: 10 }}
    animate={{ opacity: 1, x: 0 }}
    exit={{ opacity: 0, x: -10 }}
    transition={{ duration: 0.22, ease: [0.25, 0.1, 0.25, 1] }}
    className="flex-1 flex flex-col min-h-0 overflow-hidden"
  >
    {activeTab === 'table'   && <TableView   ... />}
    {activeTab === 'graph'   && <GraphView   ... />}
    {activeTab === 'gallery' && <GalleryView ... />}
  </motion.div>
</AnimatePresence>
```
D3 graph initialises lazily on first tab-switch to "graph" (not on mount).

**SortPill and VisibilityPill visibility:**
- Table tab: both SortPill + RDVisibilityPill visible
- Graph tab: SortPill hidden, VisibilityPill hidden (graph has its own controls)
- Gallery tab: SortPill visible, VisibilityPill hidden

### 5.4 Add new entry → modal form

**Trigger:** Click "+ Add Idea" button (primary action) or "Add manually" dropdown item
**Effect:**
1. `setAddModalOpen(true)` → `AddRDEntryModal` renders
2. Modal entrance: `initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }}`
3. Click backdrop or × button → `setAddModalOpen(false)` → exit animation
4. On form submit:
   - Validate: title required, niche required
   - Call `useMutation(api.rdEntries.create)(newEntry)`
   - Optimistic: new row appears at top of table with status=pending
   - Modal closes
   - StatPill count increments by 1

### 5.5 Sunday batch → approval indicator

**Trigger:** Automated — runs every Sunday via Convex scheduled action
**Visual states:**

| Day | State | SundayBatchIndicator appearance |
|-----|-------|--------------------------------|
| Mon–Sat | Upcoming | Purple clock icon, shows days-until-Sunday, badge = pending count |
| Sunday pre-batch | Ready | `bg-purple-50 border-purple-200 text-purple-700`, pulsing dot |
| Sunday during batch | Running | `animate-pulse`, spinner replacing clock icon |
| Sunday post-batch | Complete | Green checkmark, badge = 0 |

**Batch logic:**
- All entries with `status: 'pending'` and `hookScore >= 7.5` → auto-approved
- Remaining pending → stay pending (require manual review)
- After batch: `lastBatchAt` updated → `PipelineStatusStrip` "last scrape" reflects this

**Senior-only "Run batch now" button:** Conditionally rendered based on `roles.includes('Partner') || roles.includes('Owner')`. // [FIXED] was `currentUser.role === 'senior'` — 'senior' is not a valid schema role

### 5.6 Graph node click → detail panel

**Trigger:** Click a node in `D3GraphCanvas`
**Effect:**
1. If entry node: `setSelectedNodeId(id)` → `GraphDetailPanel` shows that entry's detail
2. If cluster node: filters table entries to show only that niche (visual highlight only — no tab switch)
3. Click canvas background: `setSelectedNodeId(null)` → panel shows empty state

### 5.7 Bulk select + bulk actions

**Trigger:** Check header checkbox (select all) or individual row checkboxes
**Effect:**
1. `BulkActionBar` slides in from top of table area (below PipelineStatusStrip):
   ```tsx
   <AnimatePresence>
     {selectedIds.size > 0 && (
       <motion.div initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }}>
         <BulkActionBar ... />
       </motion.div>
     )}
   </AnimatePresence>
   ```
2. "Approve all" → `bulkUpdateStatus({ ids: [...selectedIds], status: 'approved' })`
3. "Reject all" → `bulkUpdateStatus({ ids: [...selectedIds], status: 'rejected' })`
4. "Clear" → `setSelectedIds(new Set())`

---

## 6. Exact Reuse Instructions

### 6.1 FilterBar (NicheFilterBar from community/shared)

**Import:**
```typescript
import { NicheFilterBar } from '@/features/community/components/shared/FilterBar';
```
**Prop adaptation:** Do NOT use `NicheFilterBar` directly in the ContentPageShell — the filter architecture uses `filterCategories` passed to `ContentPageShell`'s `AddFilterPill`. The niche options are listed under `RD_FILTER_CATEGORIES` (section 3.1). The `NicheFilterBar` pill style can be referenced for inline niche chips inside `RDTitleCell` if needed.

### 6.2 PipelineStatusStrip

**Import:**
```typescript
import { PipelineStatusStrip } from '@/features/intelligence/components/dashboard/PipelineStatusStrip';
```
**Prop adaptation:** See section 3.9. Map `lastBatchAt` → `latestScrapeAt`, `pendingCount` → `inQueue`, `approvedCount` → `analysedCount`. Pass `controlsSlot={null}`.

### 6.3 SortPill

**Import:**
```typescript
import { SortPill } from '@/features/intelligence/components/controls/SortPill';
import type { SortId } from '@/features/intelligence/types';
```
**Prop adaptation:** Cast `RDSortId` to `SortId` — the SORT_OPTIONS are internal to the component and include all needed options. The sort logic applied to `rdEntries` lives outside the component, so unused sort options are harmless.

### 6.4 VisibilityPill

**Import:**
```typescript
import { VisibilityPill } from '@/features/intelligence/components/controls/VisibilityPill';
import type { VisibilityState } from '@/features/intelligence/types';
```
**Prop adaptation:** VisibilityPill renders hardcoded labels (Brand Details, Like Count, View Count, Save Count). These do not match R&D columns. **Recommendation: do NOT reuse VisibilityPill directly. Build `RDVisibilityPill` using the exact same visual pattern (Eye icon trigger, toggle rows, same dropdown styles) but with R&D column labels: Model, Niche, Theme, Status, Source, Hook Score, Added.**

### 6.5 ScoreRing

**Import:**
```typescript
import { ScoreRing } from '@/features/intelligence/components/shared/ScoreRing';
```
**No adaptation needed.** Props: `score: number` (0–10), `size?: number` (default 56). Use `size={32}` in table cells, `size={56}` in detail/graph panels.

### 6.6 ImportedReferenceCard

**Import:**
```typescript
import { ImportedReferenceCard } from '@/features/content-gen/components/scenes/ImportedReferenceCard';
import type { Doc } from '@/convex/_generated/dataModel';
```
**Prop adaptation:** Component expects `{ scene: Doc<'scenes'> }`. Create `toSceneShape(entry: RDEntry)` adapter function in `RDRowDetailPanel.tsx` (see section 3.5). Only the source-data fields are used (`sourceHandle`, `sourceVerified`, `sourceNiche`, `sourceViews`, `sourceEngagementRate`, `sourceOutlierRatio`, `sourceHookLine`, `sourceEmotions`). Non-source fields (`_id`, `_creationTime`, `sceneNumber`, etc.) can be empty/zero — the component guards with `hasData` check.

### 6.7 PostCard (for Gallery view)

**Import:**
```typescript
import { PostCard } from '@/features/community/components/feed/PostCard';
```
**Prop adaptation:** PostCard expects community post shape. Wrap in a div with relative positioning and overlay `ApprovalStatusBadge` at `absolute bottom-2 left-2`. Map `entry.sourceUrl` → thumbnail if available, otherwise show a placeholder.

### 6.8 QuickAnnotate

**Import:**
```typescript
import { QuickAnnotate } from '@/features/hub-swipe/components/QuickAnnotate';
```
**Prop adaptation:** QuickAnnotate uses tag chip toggles. Pass tag categories relevant to R&D:
- theme chips (e.g. "GRWM", "Tutorial", "Day in life", "Unboxing")
- hook style chips (e.g. "Question hook", "Statement hook", "Shock hook")
- tone chips (e.g. "Educational", "Entertaining", "Inspirational")

Check actual QuickAnnotate props when implementing — adapt `onTagChange` to call `useMutation(api.rdEntries.updateTags)`.

---

## 7. File Creation Checklist

```
src/
  app/isso/editor/rd-table/
    page.tsx                         ← thin wrapper only

  features/editors-dashboard/
    components/
      RDTableFeaturePage.tsx         ← root component [NEW]
      index.ts                       ← exports
      rd-table/
        TableView.tsx                [NEW]
        RDTanStackTable.tsx          [NEW]
        RDRowDetailPanel.tsx         [NEW]
        ApprovalStatusBadge.tsx      [NEW]
        ApprovalActionRow.tsx        [NEW]
        BulkActionBar.tsx            [NEW]
        SundayBatchIndicator.tsx     [NEW]
        RDVisibilityPill.tsx         [NEW — clone VisibilityPill pattern]
        GraphView.tsx                [NEW]
        D3GraphCanvas.tsx            [NEW]
        GraphDetailPanel.tsx         [NEW]
        GalleryView.tsx              [NEW]
        AddRDEntryModal.tsx          [NEW]
        filterConfig.ts              [NEW]
    hooks/
      useRDEntries.ts                [NEW — wraps Convex query + client-side sort/filter]
    types.ts                         [NEW — RDEntry, ApprovalStatus, RDSortId, RDVisibilityState]

  convex/
    rdEntries.ts                     [NEW — Convex queries + mutations]
    schema.ts                        [MODIFY — add rdEntries table]
```

**Build verification command (run before marking complete):**
```bash
cd /Users/shaansisodia/SISO_Workspace/SISO_Agency/apps/isso-dashboard
npm run build
```
