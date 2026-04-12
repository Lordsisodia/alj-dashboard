# Raw Content Queue — Wireframe + Component Spec
**Route:** `/editor`
**Features:** E1 (Unedited content inbox), E2 (PTP rejections re-queue), E3 (Priority view)
**Pattern:** Priority-sorted list (NOT dnd-kit kanban — see BLOCKER fix below) [FIXED]
**Last updated:** 2026-04-12

> **[FIXED — BLOCKER] Layout change: Kanban → Priority-sorted list.**
> The kanban layout with dnd-kit was cut. Replace with a priority-sorted flat list:
> - Items sorted by priority (HIGH first), then deadline proximity
> - Status shown as a badge on each card (not a column)
> - No `DndContext`, `SortableContext`, or `useSortable` — remove all dnd-kit references
> - Auto status transitions: claiming an item → status auto-advances to `in_progress`; uploading → auto-advances to `uploaded`
> - Status changes happen via Convex mutations, not drag events
> - `EditorKanbanBoard` → rename to `EditorQueueList`; `KanbanColumn` → removed; `KanbanState` type → replaced with flat `ContentItem[]`

---

## 1. ASCII WIREFRAME — Desktop Layout

```
┌─────────────────────────────────────────────────────────────────────────────────────────┐
│ bg-black p-5 gap-5 flex                                                                 │
│ ┌──────────────────┐ ┌─────────────────────────────────────────────────────────────────┐│
│ │ IssoSidebarShell │ │ bg-white rounded-2xl flex-1                                     ││
│ │                  │ │                                                                  ││
│ │  [ISSO icon]     │ │  ┌────────────────────────────────────────────────────────────┐ ││
│ │  ─────────────   │ │  │ ContentPageShell                                           │ ││
│ │  [editor icon]   │ │  │                                                            │ ││
│ │  (active, pink)  │ │  │ ROW 1 — Header bar h-14 px-3                              │ ││
│ │                  │ │  │ border-b rgba(0,0,0,0.07)                                  │ ││
│ │  [agency icon]   │ │  │ ┌──────────────────────────────────────────────────────┐  │ ││
│ │  [models icon]   │ │  │ │ [EditorIcon 32px] "Content Queue" [StatPill 12 items]│  │ ││
│ │  [recon icon]    │ │  │ │            [🔍 Search clips...]                       │  │ ││
│ │  [hub icon]      │ │  │ │                              [+ Claim Item ▾]         │  │ ││
│ │                  │ │  │ └──────────────────────────────────────────────────────┘  │ ││
│ │                  │ │  │                                                            │ ││
│ │                  │ │  │ ROW 2 — Sub-nav + filter bar px-3 py-2                    │ ││
│ │                  │ │  │ border-b rgba(0,0,0,0.07)                                  │ ││
│ │                  │ │  │ ┌──────────────────────────────────────────────────────┐  │ ││
│ │                  │ │  │ │ [Queue] [My Items] [All Models] > Ideas Lab          │  │ ││
│ │                  │ │  │ │                   [⊞ Model▾] [↑ Priority▾] [⚑ Tweak]│  │ ││
│ │                  │ │  │ └──────────────────────────────────────────────────────┘  │ ││
│ │                  │ │  │                                                            │ ││
│ │                  │ │  │ ROW 3 — Content area flex-1 overflow-hidden                │ ││
│ │                  │ │  │                                                            │ ││
│ └──────────────────┘ │  │  ┌──────────────────────────────────────────────────────┐  │ ││
│                       │  │  │ StatusStrip: ● Queue active | 12 items | 3 high pri  │  │ ││
│                       │  │  │             | Last sync: 2m ago          [List|Grid] │  │ ││
│                       │  │  └──────────────────────────────────────────────────────┘  │ ││
│                       │  │                                                            │ ││
│                       │  │  ┌────────────────────────────────────────────────────┐   │ ││
│                       │  │  │  KANBAN BOARD — flex flex-row gap-4 overflow-x-auto │   │ ││
│                       │  │  │                                                      │   │ ││
│                       │  │  │  ┌──────────────┐ ┌──────────────┐ ┌─────────────┐ │   │ ││
│                       │  │  │  │  NEW (5)      │ │ IN PROGRESS  │ │  DONE (3)   │ │   │ ││
│                       │  │  │  │  ───────────  │ │   (4)        │ │  ─────────  │ │   │ ││
│                       │  │  │  │              │ │  ──────────── │ │             │ │   │ ││
│                       │  │  │  │ ┌──────────┐ │ │ ┌──────────┐ │ │ ┌─────────┐ │ │   │ ││
│                       │  │  │  │ │ [thumb]  │ │ │ │ [thumb]  │ │ │ │ [thumb] │ │ │   │ ││
│                       │  │  │  │ │ Lexie M. │ │ │ │ Maya R.  │ │ │ │ Zoe K.  │ │ │   │ ││
│                       │  │  │  │ │ [Fitness]│ │ │ │ [Lifestyle│ │ │ │[Fashion]│ │ │   │ ││
│                       │  │  │  │ │ ⚑ Tweak  │ │ │ │          │ │ │ │ ✓ Done  │ │ │   │ ││
│                       │  │  │  │ │ ● HIGH   │ │ │ │ ● MED    │ │ │ │ ● LOW   │ │ │   │ ││
│                       │  │  │  │ │ 2:34 raw │ │ │ │ 1:18 raw │ │ │ │ 0:58 raw│ │ │   │ ││
│                       │  │  │  │ └──────────┘ │ │ └──────────┘ │ │ └─────────┘ │ │   │ ││
│                       │  │  │  │              │ │              │ │             │ │   │ ││
│                       │  │  │  │ ┌──────────┐ │ │ ┌──────────┐ │ │ ┌─────────┐ │ │   │ ││
│                       │  │  │  │ │ [thumb]  │ │ │ │ [thumb]  │ │ │ │ [thumb] │ │ │   │ ││
│                       │  │  │  │ │  ...     │ │ │ │  ...     │ │ │ │  ...    │ │ │   │ ││
│                       │  │  │  │ └──────────┘ │ │ └──────────┘ │ │ └─────────┘ │ │   │ ││
│                       │  │  │  │              │ │              │ │             │ │   │ ││
│                       │  │  │  │ [+ Add Item] │ │              │ │             │ │   │ ││
│                       │  │  │  └──────────────┘ └──────────────┘ └─────────────┘ │   │ ││
│                       │  │  └────────────────────────────────────────────────────┘   │ ││
│                       │  │                                                            │ ││
│                       │  └────────────────────────────────────────────────────────────┘ ││
│                       └─────────────────────────────────────────────────────────────────┘│
└─────────────────────────────────────────────────────────────────────────────────────────┘
```

### Detail Panel — Right Sidebar (when card selected)

```
┌─────────────────────────────────────────────────────────────────────────────────────────┐
│  MAIN KANBAN (flex-1)          │  DETAIL PANEL (w-80, border-l rgba(0,0,0,0.07))        │
│  [columns as above, shrunk]    │                                                          │
│                                │  ┌──────────────────────────────────────────────────┐  │
│                                │  │ [X close]  Content Detail                         │  │
│                                │  │ ─────────────────────────────────────────────── │  │
│                                │  │                                                    │  │
│                                │  │  [Video thumbnail 16:9, full width]               │  │
│                                │  │  ▷ Play  0:00 / 2:34                              │  │
│                                │  │                                                    │  │
│                                │  │  Lexie M.    [Fitness]    ● HIGH                  │  │
│                                │  │  ⚑ Needs Tweaking                                 │  │
│                                │  │                                                    │  │
│                                │  │  ─── Reference Video ─────────────────────────   │  │
│                                │  │  [Reference thumb 16:9]                            │  │
│                                │  │  Source: @fitnesscreator   2.1M views              │  │
│                                │  │  Hook: "I tried the 75 Hard..."                    │  │
│                                │  │  [Emotion: Motivational] [Hook: Challenge]         │  │
│                                │  │                                                    │  │
│                                │  │  ─── CapCut Tips ──────────────────────────────  │  │
│                                │  │  [scissors icon]  3 tips for this niche            │  │
│                                │  │  ┌──────────────────────────────────────────────┐ │  │
│                                │  │  │ 1. Use jump cuts every 2-3s for Fitness      │ │  │
│                                │  │  │ 2. Add beat sync on transition at 0:12       │ │  │
│                                │  │  │ 3. Text reveal on hook line, not static      │ │  │
│                                │  │  └──────────────────────────────────────────────┘ │  │
│                                │  │                                                    │  │
│                                │  │  ─── Actions ──────────────────────────────────  │  │
│                                │  │  [Claim & Start Editing]  (pink gradient, full w) │  │
│                                │  │  [Mark Needs Tweaking]    (outline)               │  │
│                                │  │                                                    │  │
│                                │  └──────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────────────────────────────────────┘
```

---

## 2. COMPONENT TREE

```
EditorQueueFeaturePage                          ← ScenesFeaturePage adaptation
  ContentPageShell                              ← reuse, accentGradient = pink/OFM
    [headerSlot]
      ProductIcon size={32}                     ← reuse
      "Content Queue" text-sm font-semibold
      StatPill                                  ← reuse, shows total item count
      [center] SearchInput                      ← reuse pattern from ContentPageShell
      [right] ClaimItemButton                   ← gradient pill (2g button pattern)
        ChevronDown split
        ClaimItemDropdown                       ← flyout panel (6f pattern)
          [Unclaimed items list]
    [tabsSlot]
      QueueTab (active: "Queue")
      MyItemsTab
      AllModelsTab
      [nextProduct arrow] → Ideas Lab
    [filterRightSlot]
      ModelFilterPill                           ← FilterBar from Community, adapted
      PriorityFilterPill                        ← FilterChip (7f pattern)
      NeedsTweakingToggle                       ← Favorites toggle pattern (10)
      AddFilterPill                             ← 7a pattern
    [content area]
      StatusStrip                               ← reuse from Intelligence
      EditorQueueList                           ← NEW (priority-sorted flat list) [FIXED — was EditorKanbanBoard with dnd-kit]
        // [FIXED] No DndContext, SortableContext, KanbanColumn, useSortable, KanbanDropZone
        // Items sorted: HIGH priority first, then by deadline proximity
        // Status badge shown on each card (not column headers)
        ContentQueueCard[]                    ← SavedCard adaptation (no drag handles)
          EmptyState                          ← EmptyState pattern (11)
      ContentDetailPanel                        ← right sidebar, conditionally rendered
        VideoThumbnailPlayer                    ← inline video player
        ReferenceVideoCard                      ← ImportedReferenceCard adaptation
        CapCutTipsPanel                         ← NEW
          CapCutTipRow[]
        DetailActionBar
          ClaimButton (gradient)
          NeedsTweakingButton (outline)
```

---

## 3. PER-COMPONENT SPEC

---

### 3.1 `EditorQueueFeaturePage`

**File:** `src/features/editor-queue/components/EditorQueueFeaturePage.tsx`

**Props:** none (top-level page, owns all state)

**State:**
```ts
const [activeTab, setActiveTab] = useState<'queue' | 'my-items' | 'all-models'>('queue')
const [modelFilter, setModelFilter] = useState<string | null>(null)
const [priorityFilter, setPriorityFilter] = useState<'high' | 'medium' | 'low' | null>(null)
const [showNeedsTweaking, setShowNeedsTweaking] = useState(false)
const [selectedCardId, setSelectedCardId] = useState<string | null>(null)
const [columns, setColumns] = useState<KanbanState>(initialColumns)
```

**Queries:**
```ts
const contentRequests = useQuery(api.contentRequests.list, {
  model: modelFilter ?? undefined,
  priority: priorityFilter ?? undefined,
  needsTweaking: showNeedsTweaking || undefined,
})
const rejectedReels = useQuery(api.reels.listRejected)
```

**Classes:**
```tsx
<ContentPageShell
  title="Content Queue"
  accentGradient="linear-gradient(135deg, #ff0069, #833ab4)"
  productIcon={<ProductIcon product="editor" size={32} />}
  statPill={<StatPill label="items" value={totalCount} />}
  searchBarComponent={<SearchInput ... />}
  actionLabel="Claim Item"
  actionIcon={<Inbox size={13} />}
  tabs={tabs}
  filterRightSlot={<EditorFilterBar ... />}
>
```

---

### 3.2 `EditorQueueList` [FIXED — was EditorKanbanBoard]

**File:** `src/features/editor-queue/components/EditorQueueList.tsx`

> **[FIXED]** Kanban replaced with priority-sorted list. No dnd-kit. No column state. Auto status transitions via Convex mutations only.

**Props:**
```ts
interface EditorQueueListProps {
  items: ContentItem[]                          // [FIXED] flat list, not KanbanState columns
  onItemStatusChange: (id: string, newStatus: ContentItemStatus) => void
  selectedCardId: string | null
  onCardSelect: (id: string | null) => void
}
```

**Implementation note:** Items sorted client-side: HIGH priority first, then by `createdAt` (oldest first within same priority). Status transitions are automatic — claiming sets `in_progress`, editor completing sets `uploaded`. No drag-and-drop.

**Classes:**
```tsx
<div className="flex flex-col gap-3 px-6 pb-6 min-h-0 flex-1 overflow-y-auto">
  {/* sorted ContentQueueCard list */}
</div>
```

**Auto status transitions:** [FIXED]
- Claim item → `useMutation(api.contentRequests.claim)` → status auto-sets to `in_progress`
- Mark done → `useMutation(api.contentRequests.updateStatus, { status: 'uploaded' })` → auto-advances
- No manual drag between columns needed

---

### 3.3 `KanbanColumn`

**File:** `src/features/editor-queue/components/KanbanColumn.tsx`

**Props:**
```ts
interface KanbanColumnProps {
  id: 'new' | 'in-progress' | 'done'
  label: string
  items: ContentItem[]
  selectedCardId: string | null
  onCardSelect: (id: string) => void
}
```

**Column config:**

| id | label | header color dot | show "Add Item" footer |
|----|-------|-----------------|------------------------|
| `new` | New | `bg-neutral-400` | yes |
| `in-progress` | In Progress | `bg-amber-400` | no |
| `done` | Done | `bg-green-500` | no |

**Classes:**
```tsx
<div
  className="flex flex-col rounded-xl flex-shrink-0 w-72"
  style={{ border: '1px solid rgba(0,0,0,0.07)', backgroundColor: '#f9f9f9' }}
>
  <KanbanColumnHeader label={label} count={items.length} colorDot={colorDot} />
  <SortableContext items={items.map(i => i.id)} strategy={verticalListSortingStrategy}>
    <div className="flex flex-col gap-2 p-2 flex-1 min-h-[120px]">
      {items.length === 0 ? <EmptyColumnState /> : items.map(item => (
        <ContentQueueCard key={item.id} item={item} ... />
      ))}
    </div>
  </SortableContext>
  {id === 'new' && <KanbanColumnFooter />}
</div>
```

---

### 3.4 `KanbanColumnHeader`

**Props:** `{ label: string; count: number; colorDot: string }`

**Classes:**
```tsx
<div className="flex items-center justify-between px-3 py-2.5"
     style={{ borderBottom: '1px solid rgba(0,0,0,0.07)' }}>
  <div className="flex items-center gap-2">
    <span className={`w-2 h-2 rounded-full ${colorDot}`} />
    <span className="text-xs font-semibold text-neutral-700">{label}</span>
  </div>
  <span className="text-[10px] font-semibold text-neutral-400
                   bg-black/[0.06] rounded-[4px] px-1.5 py-0.5">
    {count}
  </span>
</div>
```

---

### 3.5 `ContentQueueCard`

**File:** `src/features/editor-queue/components/ContentQueueCard.tsx`

**Pattern source:** `SavedCard` from `features/community/` — adapted for content pipeline state.

**Props:**
```ts
interface ContentQueueCardProps {
  item: ContentItem
  isSelected: boolean
  onSelect: () => void
  isDragging?: boolean               // injected by useSortable
}

interface ContentItem {
  id: string
  modelName: string
  modelAvatar?: string
  niche: string
  priority: 'high' | 'medium' | 'low'
  needsTweaking: boolean
  durationSec: number
  thumbnailUrl?: string
  status: 'new' | 'in-progress' | 'done'
  source: 'content-request' | 'ptp-rejection'
  referenceVideoId?: string
  createdAt: number
}
```

**Classes:**
```tsx
<motion.div
  ref={setNodeRef}
  style={{ transform: CSS.Transform.toString(transform), transition }}
  {...attributes} {...listeners}
  whileHover={{ scale: 1.02, y: -2 }}
  transition={{ type: 'spring', stiffness: 400, damping: 25 }}
  onClick={onSelect}
  className={cn(
    'rounded-xl bg-white cursor-grab active:cursor-grabbing',
    'flex flex-col overflow-hidden',
    isSelected && 'ring-2 ring-[#ff0069]/40',
    isDragging && 'opacity-50',
  )}
  style={{ border: '1px solid rgba(0,0,0,0.07)', boxShadow: '0 1px 4px rgba(0,0,0,0.04)' }}
>
```

**Card layout (inside):**
```
┌─────────────────────────────┐
│ [thumbnail 16:9 aspect]     │  aspect-video object-cover bg-neutral-100
│                             │  + source badge overlay (bottom-left): "PTP Rejection"
├─────────────────────────────┤
│ [ModelAvatar 20px] Lexie M. │  flex items-center gap-1.5
│ [Fitness badge]             │  NicheBadge component
│ ─────────────────────────── │
│ ⚑ Needs Tweaking            │  NeedsTweakingFlag (conditional)
│ ● HIGH  ·  2:34             │  PriorityBadge + duration
└─────────────────────────────┘
```

**Sub-components:**
- `NicheBadge` — `text-[10px] font-medium px-1.5 py-0.5 rounded` with niche color map (Fitness: blue, Lifestyle: purple, Fashion: pink, Beauty: rose)
- `PriorityBadge` — colored dot + label: HIGH=`#ef4444`, MED=`#f59e0b`, LOW=`#22c55e`
- `NeedsTweakingFlag` — `text-[10px] font-semibold text-amber-600 bg-amber-50 rounded px-1.5 py-0.5 border border-amber-200` with `⚑` icon
- `SourceBadge` — overlay on thumbnail, only shown for `ptp-rejection` source: `text-[9px] font-bold text-white bg-black/60 rounded px-1.5 py-0.5`

---

### 3.6 `ContentDetailPanel`

**File:** `src/features/editor-queue/components/ContentDetailPanel.tsx`

**Props:**
```ts
interface ContentDetailPanelProps {
  item: ContentItem
  onClose: () => void
}
```

**Layout:**
```tsx
<motion.div
  initial={{ opacity: 0, x: 16 }}
  animate={{ opacity: 1, x: 0 }}
  exit={{ opacity: 0, x: 16 }}
  transition={{ duration: 0.22, ease: [0.25, 0.1, 0.25, 1] }}
  className="w-80 flex-shrink-0 flex flex-col overflow-y-auto"
  style={{ borderLeft: '1px solid rgba(0,0,0,0.07)' }}
>
```

**Sections (top to bottom):**

1. **Panel header** — `"Content Detail"` `text-sm font-semibold text-neutral-900` + X close button `text-neutral-400 hover:text-neutral-600`
2. **Video player area** — `aspect-video bg-neutral-100 rounded-xl overflow-hidden` with inline `<video>` or thumbnail + play overlay. Duration stamp bottom-right.
3. **Item metadata strip** — model avatar + name + niche badge + priority badge + needs-tweaking flag. Horizontal flex, `px-4 py-3`, border-bottom.
4. **Reference video section** — `ReferenceVideoCard` (ImportedReferenceCard adaptation): source handle, 3 metrics (views, likes, comments), hook line text, emotion chips.
5. **CapCut tips section** — `CapCutTipsPanel` with niche-specific tips list.
6. **Action bar** — `ClaimAndStartButton` (full-width gradient) + `NeedsTweakingButton` (full-width outline).

**Query:**
```ts
// [FIXED] api.rdTable.getById → api.rdEntries.getById (no 'rdTable' module exists)
const reference = useQuery(api.rdEntries.getById, { id: item.referenceVideoId ?? '' })
// [FIXED] api.capCutTips.forNiche → api.capCutTemplates.forNiche (table is capCutTemplates not capCutTips)
const capCutTips = useQuery(api.capCutTemplates.forNiche, { niche: item.niche })
```

---

### 3.7 `CapCutTipsPanel`

**File:** `src/features/editor-queue/components/CapCutTipsPanel.tsx`

**Props:**
```ts
interface CapCutTipsPanelProps {
  niche: string
  tips: CapCutTip[]
}

interface CapCutTip {
  id: string
  text: string
  category: 'cut' | 'transition' | 'text' | 'audio' | 'effect'
}
```

**Classes:**
```tsx
<div className="px-4 py-3 flex flex-col gap-2">
  <div className="flex items-center gap-1.5">
    <Scissors size={12} className="text-neutral-400" />
    <span className="text-[11px] font-semibold text-neutral-500 uppercase tracking-[0.2em]">
      CapCut Tips — {niche}
    </span>
  </div>
  {tips.map((tip, i) => (
    <div key={tip.id}
      className="rounded-lg px-3 py-2 flex items-start gap-2"
      style={{ backgroundColor: '#f5f5f4', border: '1px solid rgba(0,0,0,0.05)' }}
    >
      <span className="text-[9px] font-bold text-neutral-400 mt-0.5 w-3.5 h-3.5
                       rounded-full border border-neutral-300 flex items-center justify-center flex-shrink-0">
        {i + 1}
      </span>
      <span className="text-xs text-neutral-600 leading-relaxed">{tip.text}</span>
    </div>
  ))}
</div>
```

---

### 3.8 `EditorFilterBar` (filter right slot)

**File:** `src/features/editor-queue/components/EditorFilterBar.tsx`

**Props:**
```ts
interface EditorFilterBarProps {
  modelFilter: string | null
  onModelChange: (model: string | null) => void
  priorityFilter: 'high' | 'medium' | 'low' | null
  onPriorityChange: (p: 'high' | 'medium' | 'low' | null) => void
  showNeedsTweaking: boolean
  onNeedsTweakingToggle: () => void
}
```

**Renders (left to right):**

1. **ModelFilterPill** — generic filter pill (7b pattern), icon: `<Users size={12} />` with pink accent. Dropdown lists all models with avatar + name. Active state shows selected model name.

2. **PriorityFilterPill** — FilterChip group (7f pattern), 3 chips: "High" `text-red-500`, "Med" `text-amber-500`, "Low" `text-green-500`. Only one active at a time; clicking active chip deselects.

3. **NeedsTweakingToggle** — Favorites toggle adaptation (section 10):
```tsx
<button
  className={cn(
    'flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-[11px] font-medium transition-all border',
    showNeedsTweaking
      ? 'text-amber-600 border-amber-200 bg-amber-50'
      : 'text-neutral-500 border-transparent hover:border-neutral-200 hover:bg-white'
  )}
>
  <Flag size={11} fill={showNeedsTweaking ? 'currentColor' : 'none'} />
  Needs Tweaking
</button>
```

4. **AddFilterPill** — standard AddFilter pill (7a pattern).

---

### 3.9 `KanbanColumnFooter`

**Props:** `{ onAdd: () => void }`

**Classes:**
```tsx
<button
  onClick={onAdd}
  className="flex items-center justify-center gap-1.5 m-2 py-2 rounded-lg
             text-xs font-medium text-neutral-400 hover:text-neutral-600
             hover:bg-black/[0.04] transition-colors"
  style={{ border: '1px solid rgba(0,0,0,0.07)' }}
>
  <Plus size={12} />
  Add Item
</button>
```

---

### 3.10 `EmptyColumnState`

Uses section 11 EmptyState pattern.

```tsx
<div className="flex flex-col items-center justify-center py-8 gap-2 text-center">
  <div className="w-8 h-8 rounded-xl flex items-center justify-center bg-neutral-100">
    <Inbox size={14} className="text-neutral-400" />
  </div>
  <p className="text-[11px] text-neutral-400">No items here</p>
</div>
```

---

## 4. INTERACTION SPEC

### 4.1 ~~Drag Card Between Columns~~ — REMOVED [FIXED]

> **[FIXED]** Drag-and-drop between columns removed. Status advances automatically via mutations.
> Rollback pattern (for reference if ever re-added): store pre-action `items` snapshot in `useRef`, restore `setItems(previousSnapshot)` on Convex mutation error + show error toast.

**Status change flow (replaces drag):**
```
User clicks "Claim & Start Editing"
  → useMutation(api.contentRequests.claim) fires
  → Optimistic: card immediately shows status badge → "In Progress"
  → On Convex error: restore previous status, show error toast

User clicks "Mark Done"
  → useMutation(api.contentRequests.updateStatus, { status: 'uploaded' })
  → Card moves to done visual state
  → AnimatePresence layout animation re-orders list
```

---

### 4.2 Click Card → Detail Panel

```
User clicks ContentQueueCard
  → setSelectedCardId(item.id)
  → ContentDetailPanel mounts with AnimatePresence slide-in from right
  → Main kanban board shrinks: flex-1 → auto-shrinks as panel takes w-80
  → No route change — panel is in-page state only

User clicks X (close) or clicks same card
  → setSelectedCardId(null)
  → Panel unmounts with slide-out exit animation
```

**AnimatePresence wrapper:**
```tsx
<div className="flex flex-1 overflow-hidden">
  <div className="flex-1 overflow-hidden">
    <EditorKanbanBoard ... />
  </div>
  <AnimatePresence>
    {selectedCardId && (
      <ContentDetailPanel
        key={selectedCardId}
        item={selectedItem}
        onClose={() => setSelectedCardId(null)}
      />
    )}
  </AnimatePresence>
</div>
```

---

### 4.3 Claim Item

```
Two entry points:
  A. "Claim Item" button in header bar → opens ClaimItemDropdown
     → Lists unclaimed items (status=new, no assignee)
     → Clicking item: useMutation(api.contentRequests.claim) → moves to In Progress

  B. "Claim & Start Editing" in ContentDetailPanel
     → Direct claim for selected item
     → On success: updates column state, shows success feedback on card
     → Moves card from New → In Progress via the same onColumnChange handler
```

---

### 4.4 Filter by Model/Priority

```
ModelFilterPill click
  → Opens dropdown flyout (6f animation pattern)
  → Lists models from useQuery(api.models.list)
  → Selecting model: setModelFilter(modelId)
  → FilterBar pill shows model name + X clear chip
  → Kanban re-queries: columns re-derive from filtered contentRequests

PriorityFilterPill chip click
  → Toggle: if same chip active → setPriorityFilter(null)
                  else → setPriorityFilter(chip.value)
  → Chips use FilterChip style (7f) with priority-specific active colours

NeedsTweakingToggle click
  → setShowNeedsTweaking(!showNeedsTweaking)
  → Filters kanban to only show needsTweaking=true items
  → Toggle uses amber accent when active (not pink)
```

---

### 4.5 "Needs Tweaking" Flag Toggle on Card

```
Long-press card OR right-click context menu → "Flag as Needs Tweaking"
  → useMutation(api.contentRequests.setNeedsTweaking, { id, value: true })
  → Card immediately shows NeedsTweakingFlag badge
  → If NeedsTweaking filter active, card stays visible (optimistic, matches filter)
```

---

### 4.6 Tab Switching (Queue / My Items / All Models)

```
Tab click → setActiveTab(tab)
  → AnimatePresence mode="wait" with slide transition (6d pattern)
  → "My Items" tab: filters to items claimed by current session user
  → "All Models" tab: groups cards by model, shows model section headers
    (NicheGroup pattern from Community adapted as ModelGroup)
```

---

### 4.7 Video Playback in Detail Panel

```
Clicking thumbnail in ContentDetailPanel
  → Inline <video> src={item.rawVideoUrl} shows, autoplay
  → Or fallback: VideoLightbox from Intelligence opens fullscreen
  → Reference video thumbnail → VideoLightbox (always fullscreen, read-only)
```

---

## 5. REUSE INSTRUCTIONS

### 5.1 ScenesFeaturePage Pattern Adaptation

`ScenesFeaturePage` in `features/content-gen/` uses 4 collapsible sections (Needs You / Ready / In Flight / Done). The Raw Content Queue adapts this to 3 horizontal kanban columns with drag-and-drop instead of vertical accordions.

**What to take from ScenesFeaturePage:**
- Column state management shape: `{ [columnId]: Item[] }`
- Column header with count badge
- Empty state per column
- "Add item" footer on the first column

**What to change:**
- Replace vertical accordion → horizontal flex columns
- Replace click-to-move → dnd-kit drag handles
- Add `DndContext` / `SortableContext` wrapping
- Replace "Needs You" language with "New" (editor vocabulary)
- 4 columns → 3 columns (merge "Ready" + "In Flight" into "In Progress")

**Migration checklist:**
```
[ ] Copy KanbanState type shape from ScenesFeaturePage
[ ] Replace collapsible panel with flex column container
[ ] Install @dnd-kit/core @dnd-kit/sortable @dnd-kit/utilities
[ ] Wrap column items in useSortable
[ ] Add DragOverlay at EditorKanbanBoard root
[ ] Add useDroppable to each KanbanColumn
```

---

### 5.2 SavedCard Adaptation → ContentQueueCard

`SavedCard` in `features/community/` shows pipeline state + CTA for saved content.

**Reuse:**
- Card shell: `rounded-xl bg-white border-[rgba(0,0,0,0.07)] shadow` matches section 2e
- Thumbnail aspect ratio + object-cover pattern
- Bottom metadata row (creator name + stats)
- Hover animation: `whileHover={{ scale: 1.02, y: -2 }}`

**Add/change:**
- Add `useSortable` drag handles
- Replace pipeline CTA row with PriorityBadge + duration + NeedsTweakingFlag
- Add source overlay badge (`ptp-rejection` only)
- Add selection ring (`ring-2 ring-[#ff0069]/40` when `isSelected`)
- Remove "Save" / bookmark actions — not relevant here

---

### 5.3 ~~HubQuickActions Reuse~~ — REMOVED [FIXED]

> **[FIXED]** Do NOT reuse `HubQuickActions` for the `ClaimItemDropdown`. `HubQuickActions` is a 3-column action strip designed for the community hub — using it for a flyout dropdown creates a visual mismatch. The claim dropdown is a flyout list, not a grid.
>
> **Use instead:** A simple `<ul>` dropdown list for `ClaimItemDropdown`:
> ```tsx
> <ul className="w-56 rounded-xl overflow-hidden bg-white shadow-lg border border-black/[0.07]">
>   {unclaimedItems.map(item => (
>     <li key={item.id}>
>       <button onClick={() => handleClaim(item.id)} className="w-full text-left px-4 py-2.5 text-sm hover:bg-black/[0.04]">
>         {item.modelName} · {item.niche}
>       </button>
>     </li>
>   ))}
> </ul>
> ```

---

### 5.4 ActionQueue Reuse

`ActionQueue` in `features/intelligence/` renders gradient action buttons with Framer Motion.

**Use for:** The main "Claim Item" button in ContentPageShell header (section 2g split button pattern), and the `DetailActionBar` primary button.

**Adaptation:** Swap gradient to OFM pink: `linear-gradient(135deg, #ff0069, #833ab4)`.

---

### 5.5 ImportedReferenceCard Adaptation → ReferenceVideoCard

`ImportedReferenceCard` in `features/content-gen/` shows: source handle + metrics triad (views/likes/comments) + hook line + emotion chips.

**Use as-is for:** The reference video section inside `ContentDetailPanel`.

**Only change:** Truncate to compact height for the panel context — reduce padding from default `p-4` to `p-3`, cap metrics at 2 (views + likes only).

---

### 5.6 FilterBar Reuse

`FilterBar` from `features/community/` is already a shared, data-agnostic pill filter bar.

**Pass in:**
```tsx
<FilterBar
  filters={[
    { id: 'model', label: 'Model', options: modelOptions },
    { id: 'niche', label: 'Niche', options: nicheOptions },
  ]}
  activeFilters={activeFilters}
  onChange={setActiveFilters}
/>
```

This covers the `ModelFilterPill` requirement — wire its `onChange` to `setModelFilter` in `EditorQueueFeaturePage`.

---

## 6. TYPE DEFINITIONS

```ts
// src/features/editor-queue/types.ts

export type ColumnId = 'new' | 'in-progress' | 'done'
export type Priority = 'high' | 'medium' | 'low'
export type ContentSource = 'content-request' | 'ptp-rejection'

export interface ContentItem {
  id: string
  modelId: string
  modelName: string
  modelAvatar?: string
  niche: string
  priority: Priority
  needsTweaking: boolean
  durationSec: number
  thumbnailUrl?: string
  rawVideoUrl?: string
  status: ColumnId
  source: ContentSource
  referenceVideoId?: string
  assignedTo?: string
  createdAt: number
  updatedAt: number
}

export interface KanbanState {
  new: ContentItem[]
  'in-progress': ContentItem[]
  done: ContentItem[]
}

export interface CapCutTip {
  id: string
  niche: string
  text: string
  category: 'cut' | 'transition' | 'text' | 'audio' | 'effect'
}
```

---

## 7. FILE STRUCTURE

```
src/features/editor-queue/
  components/
    EditorQueueFeaturePage.tsx      ← default export
    EditorKanbanBoard.tsx
    KanbanColumn.tsx
    KanbanColumnHeader.tsx
    KanbanColumnFooter.tsx
    ContentQueueCard.tsx
    ContentDetailPanel.tsx
    CapCutTipsPanel.tsx
    EditorFilterBar.tsx
    EmptyColumnState.tsx
    index.ts                        ← re-exports EditorQueueFeaturePage
  hooks/
    // useKanbanDnd.ts — REMOVED [FIXED] no drag-and-drop in v1
    useEditorFilters.ts             ← modelFilter, priorityFilter, needsTweaking state
    // [FIXED] URL sync removed from useEditorFilters scope in v1 — useSearchParams/useRouter
    // pattern in Next.js App Router is non-trivial. Defer URL sync to v2 or document
    // the useSearchParams pattern explicitly before adding it.
  types.ts

src/app/editor/page.tsx             ← thin wrapper only
```

---

## 8. CONVEX SCHEMA NOTES

> **[FIXED — BLOCKER] DO NOT define table schemas here.** Canonical schema is `CONVEX_SCHEMA_ADDITIONS.md`. Reference that file only.

**Existing table:** `contentRequests` — add these fields to `CONVEX_SCHEMA_ADDITIONS.md` before building:
- `priority: v.optional(v.union(v.literal('high'), v.literal('medium'), v.literal('low')))` [FIXED — add to canonical schema]
- `needsTweaking: v.optional(v.boolean())` [FIXED — add to canonical schema]
- `assignedTo: v.optional(v.id('teamMembers'))` [FIXED — use v.id('teamMembers') not v.string()]
- Status mapping: canonical statuses `draft | sent | acknowledged | in_progress | uploaded | overdue | cancelled` — map to display states at component level, do NOT redefine the enum [FIXED]

**`ContentItem.priority` derivation:** [FIXED] `contentRequests` has no `priority` field in canonical schema. Derive from deadline proximity:
- `overdue` status → HIGH
- deadline < 24h → MED  
- else → LOW
(Or add `priority` field to canonical schema — document chosen approach before building.)

**`ContentItem.source` derivation:** [FIXED] Do NOT add a `source` field to `reels`. Derive: `ptpStatus === 'revision'` → display "PTP Rejection". Source badge logic lives in the component only.

**PTP rejections data merge:** [FIXED] The queue must fetch from TWO sources and merge:
1. `useQuery(api.contentRequests.list, ...)` — new content
2. `useQuery(api.reels.listRejected)` — reels with `ptpStatus='revision'`
Normalize both into `ContentItem[]` before rendering. A single query will miss PTP rejections.

**`assignedTo` for "My Items" tab:** [FIXED] Add filter: `.filter(q => q.eq(q.field('assignedTo'), currentUserId))` for `my-items` tab. Without this, "My Items" shows all items.

**New query needed:** `api.capCutTemplates.forNiche` — [FIXED] was `api.capCutTips.forNiche` — table is `capCutTemplates` not `capCutTips`. Returns tips array for a given niche string. Static seed data acceptable for MVP.

**`api.contentRequests.claim` mutation:** [FIXED] `assignedTo` parameter must be `assignedEditorId: Id<'teamMembers'>`, not a plain string.

**Mutation needed:** `api.contentRequests.updateStatus` — updates `status` and `updatedAt`.
**Mutation needed:** `api.contentRequests.claim` — sets `assignedTo` and moves to `in-progress`.
**Mutation needed:** `api.contentRequests.setNeedsTweaking` — toggles flag.

---

## 9. ACCENT COLOUR SUMMARY

This page uses the OFM/ISSO pink accent throughout:
- `accentGradient`: `linear-gradient(135deg, #ff0069, #833ab4)`
- Active tabs: pink gradient bg
- Primary buttons: pink gradient
- Card selection ring: `ring-[#ff0069]/40`
- Drop zone highlight: `ring-[#ff006930]` / `bg-[#ff006908]`
- NeedsTweaking toggle active: amber (`#f59e0b`) — intentionally different to differentiate from CTA pink
- Priority HIGH dot: `#ef4444` (red, semantic)
- Priority MED dot: `#f59e0b` (amber, semantic)
- Priority LOW dot: `#22c55e` (green, semantic)
