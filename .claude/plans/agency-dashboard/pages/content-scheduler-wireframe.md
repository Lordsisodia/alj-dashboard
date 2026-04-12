# Content Scheduler — Wireframe + Component Spec

**Route:** `/agency/schedule`
**File:** `src/features/schedule/components/ScheduleFeaturePage.tsx` (ENHANCE, do not replace)
**Status:** Draft — 2026-04-12 | Critic fixes applied 2026-04-12
**Features:** A24–A34

> **[FIXED — MAJOR] P1 scope cuts:**
> - **Daily view (`DailyColumn`) cut from P1.** Duplicates DayDetailPanel. Keep toggle UI but disable the daily option with a "coming soon" tooltip.
> - **Drag-to-reschedule cut from P1 (phases 8–9).** `onItemDrop` is a no-op stub in P1 — show "Drag to reschedule — coming soon" toast. `WeeklyGrid` built without drag in P1.
> - **Right-click context menu removed.** Not in ISSO design system. `···` dropdown on `DayDetailItem` covers same actions.
> - **`ModelSelector` post count badge removed.** No `postCount` on `models` — requires Convex aggregate. Show avatar + handle + niche tag only in P1.

> **[FIXED — MAJOR] Layout change: MetaDripQueue 5×5 grid replaced.** The 25-cell 5×5 grid is removed from `MetaDripQueue`. Replace with slot data from `api.scheduledPosts.listSlots({ accountHandle })` rendered as a progress bar + count only in P1. Grid cells were visually expensive and the slot mapping was underspecified.

> **[FIXED — MAJOR] ItemDetailDrawer merged into sidebar swap.** Instead of a separate slide-over `ItemDetailDrawer` overlaying the calendar, clicking an item swaps the right sidebar content (replacing MetaDripQueue/IGGridPreview with item detail). This avoids the fixed-position overlay conflict with IssoSidebarShell. `ItemDetailDrawer` → `ItemDetailSidebar` (renders in the w-72 right panel slot).

---

## 1. ASCII WIREFRAME — Desktop Layout

```
┌─────────────────────────────────────────────────────────────────────────────────────────────────────┐
│ bg-black p-5 gap-5 flex                                                                             │
│ ┌──────┐  ┌──────────────────────────────────────────────────────────────────────────────────────┐  │
│ │Sidebar│  │ ContentPageShell (bg-white rounded-2xl flex-1)                                       │  │
│ │      │  │                                                                                      │  │
│ │ Icon │  │ ── ROW 1: Header bar (h-14 px-3) ──────────────────────────────────────────────────  │  │
│ │ rail │  │  [ProductIcon/hub]  Schedule  [20 scheduled ▾]      [Search posts, models…]     [+ Schedule Post ▾]  │  │
│ │      │  │                                                                                      │  │
│ │      │  │ ── ROW 2: Sub-nav + filter bar (px-3 py-2) ────────────────────────────────────────  │  │
│ │      │  │  [Calendar ●] [Analytics]  |>  [IG Queue]          [ModelSelector ▾] [AccountSelector ▾]  [Daily|Weekly|Monthly]  [Add Filter ▾]  │  │
│ │      │  │                                                                                      │  │
│ │      │  │ ── ROW 3: Content area (flex-1 overflow-y-auto px-6 py-6) ─────────────────────────  │  │
│ │      │  │                                                                                      │  │
│ │      │  │  ┌─ StatusStrip ────────────────────────────────────────────────────────────────┐   │  │
│ │      │  │  │ ● Sync active │ 20 scheduled │ 3 models │ 5 accounts │  [MetaDripIndicator]  │   │  │
│ │      │  │  └──────────────────────────────────────────────────────────────────────────────┘   │  │
│ │      │  │                                                                                      │  │
│ │      │  │  ┌─ main content: flex gap-5 ──────────────────────────────────────────────────┐   │  │
│ │      │  │  │                                                                             │   │  │
│ │      │  │  │  ┌─ Calendar Panel (flex-1) ───────────────────────────────────────────┐   │   │  │
│ │      │  │  │  │  [< Apr 2026 >]                               [today button]        │   │   │  │
│ │      │  │  │  │                                                                     │   │   │  │
│ │      │  │  │  │  Sun   Mon   Tue   Wed   Thu   Fri   Sat                            │   │   │  │
│ │      │  │  │  │  ────────────────────────────────────────                          │   │   │  │
│ │      │  │  │  │        1     2    [3]    4     5     6                              │   │   │  │
│ │      │  │  │  │               ┌──────┐                                             │   │   │  │
│ │      │  │  │  │               │ 3    │                                             │   │   │  │
│ │      │  │  │  │               │ ●reel│  ← content dots with model avatar ring      │   │   │  │
│ │      │  │  │  │               │ ●post│                                             │   │   │  │
│ │      │  │  │  │               └──────┘                                             │   │   │  │
│ │      │  │  │  │                                                                     │   │   │  │
│ │      │  │  │  │   7     8     9    10    11   [12●]  13                             │   │   │  │
│ │      │  │  │  │  [click day → DayDetailPanel slides in below OR right panel]        │   │   │  │
│ │      │  │  │  └────────────────────────────────────────────────────────────────────┘   │   │  │
│ │      │  │  │                                                                             │   │  │
│ │      │  │  │  ┌─ Right Sidebar (w-72, collapsible) ─────────────────────────────────┐  │   │  │
│ │      │  │  │  │                                                                     │  │   │  │
│ │      │  │  │  │  ┌─ MetaDripQueue ───────────────────────────────────────────────┐ │  │   │  │
│ │      │  │  │  │  │  Meta Drip Queue        [●] Active     [Pause]               │ │  │   │  │
│ │      │  │  │  │  │  ████████████████████░░░░░░░░░░░░░░░░░░░░░░░░░░░░ 13/25     │ │  │   │  │
│ │      │  │  │  │  │  Next drip: 2h 40m  · Cooldown: 4h between posts            │ │  │   │  │
│ │      │  │  │  │  │  Slots: ■■■■■■■■■■■■■░░░░░░░░░░░░   13 used · 12 free       │ │  │   │  │
│ │      │  │  │  │  └──────────────────────────────────────────────────────────────┘ │  │   │  │
│ │      │  │  │  │                                                                     │  │   │  │
│ │      │  │  │  │  ┌─ IGGridPreview ────────────────────────────────────────────────┐ │  │   │  │
│ │      │  │  │  │  │  @abg.ricebunny [toggle: show grid]                           │ │  │   │  │
│ │      │  │  │  │  │  ┌───┬───┬───┐                                                │ │  │   │  │
│ │      │  │  │  │  │  │ P │ P │ P │  ← last 3 published posts                     │ │  │   │  │
│ │      │  │  │  │  │  ├───┼───┼───┤                                                │ │  │   │  │
│ │      │  │  │  │  │  │ P │ P │[S]│  ← [S] = scheduled slot (pink ring)           │ │  │   │  │
│ │      │  │  │  │  │  ├───┼───┼───┤                                                │ │  │   │  │
│ │      │  │  │  │  │  │[S]│ P │ P │                                                │ │  │   │  │
│ │      │  │  │  │  │  └───┴───┴───┘                                                │ │  │   │  │
│ │      │  │  │  │  └──────────────────────────────────────────────────────────────┘ │  │   │  │
│ │      │  │  │  └─────────────────────────────────────────────────────────────────┘  │   │  │
│ │      │  │  │                                                                             │   │  │
│ │      │  │  └─────────────────────────────────────────────────────────────────────────────┘   │  │
│ │      │  │                                                                                      │  │
│ │      │  └──────────────────────────────────────────────────────────────────────────────────────┘  │
│ └──────┘                                                                                             │
└─────────────────────────────────────────────────────────────────────────────────────────────────────┘
```

### Click-Day: DayDetailPanel expands inline below the calendar row

```
┌─ DayDetailPanel (slides down, AnimatePresence) ──────────────────────────────────────────────────────┐
│  Thursday April 3  ·  3 items                                                   [×]                  │
│  ──────────────────────────────────────────────────────────────────────────────────                  │
│  ┌─ item ─────────────────────────────────────────────────────────────────────────┐                  │
│  │  [thumb]  @abg.ricebunny  ·  Reel  ·  12:00 PM  ·  [●SCHEDULED]  [Edit][···]  │                  │
│  │           Hook: "POV: you're living rent-free in my head…"                    │                  │
│  └────────────────────────────────────────────────────────────────────────────────┘                  │
│  ┌─ item ─────────────────────────────────────────────────────────────────────────┐                  │
│  │  [thumb]  @rhinxrenx  ·  Post  ·  6:00 PM  ·  [●SCHEDULED]  [Edit][···]       │                  │
│  └────────────────────────────────────────────────────────────────────────────────┘                  │
│  [+ Add item for this day]                                                                            │
└──────────────────────────────────────────────────────────────────────────────────────────────────────┘
```

### Click-Item: ItemDetailDrawer slides in from right (over main content)

```
┌─ ItemDetailDrawer (right drawer, w-96, slides from right) ────────────────────────────┐
│  [Reel badge]  @abg.ricebunny  ·  Apr 3 · 12:00 PM                          [×]      │
│  ────────────────────────────────────────────────────────────────────────────────     │
│  [Thumbnail / Video preview 16:9]                                                     │
│                                                                                       │
│  Caption                                                                              │
│  "POV: you're living rent-free in my head…                                           │
│   #fyp #viral #trending"                                                              │
│                                                                                       │
│  On-screen text                                                                       │
│  "rent free 💸"                                                                       │
│                                                                                       │
│  Metadata                                                                             │
│  ┌──────────────┬────────────────┐                                                   │
│  │ Best time    │ 12:00 PM Thu   │                                                   │
│  │ AI score     │ 87/100         │                                                   │
│  │ Approved by  │ Alex · Apr 2   │                                                   │
│  │ Meta status  │ ● Drip slot 4  │                                                   │
│  └──────────────┴────────────────┘                                                   │
│                                                                                       │
│  [Reschedule]   [Edit Caption]   [Remove from Queue]   [Publish Now]                 │
└───────────────────────────────────────────────────────────────────────────────────────┘
```

### Weekly View

```
┌─ WeeklyCalendar ─────────────────────────────────────────────────────────────────────────────────────┐
│  Week Apr 7 – 13   [< >]                                                                             │
│                                                                                                       │
│  Time  │  Sun 7    │  Mon 8    │  Tue 9   │  Wed 10  │  Thu 11  │  Fri 12  │  Sat 13               │
│  ──────┼───────────┼───────────┼──────────┼──────────┼──────────┼──────────┼────────               │
│  9 AM  │           │           │          │  [Reel]  │          │          │                        │
│  12 PM │           │  [Post]   │          │          │          │  [Video] │                        │
│  3 PM  │           │           │  [Story] │          │          │          │                        │
│  6 PM  │  [Reel]   │           │          │          │  [Post]  │          │  [Carousel]            │
│  ──────┴───────────┴───────────┴──────────┴──────────┴──────────┴──────────┴────────               │
│  [content items are drag handles — drag vertically to reschedule time, drag horizontally for day]    │
└──────────────────────────────────────────────────────────────────────────────────────────────────────┘
```

---

## 2. COMPONENT TREE

```
ScheduleFeaturePage                              ← EXISTING — add props
  ContentPageShell                               ← EXISTING — no changes to shell
    filterRightSlot:
      ModelSelector                              ← NEW shared component
      AccountSelector                            ← NEW (depends on selected model)
      CalendarViewToggle                         ← NEW (Daily | Weekly | Monthly)
      AddFilterPill                              ← EXISTING pattern

    [activeTab === 'calendar']
      CalendarView                               ← EXISTING — ENHANCE
        CalendarHeader                           ← EXISTING inline — extract to component
        MonthGrid                                ← EXISTING inline — extract + enhance
          CalendarDayCell                        ← NEW — replaces current inline cell
            ContentDotStack                      ← NEW (dots → richer thumbnails)
        DayDetailPanel                           ← NEW — inline expand below row
          DayDetailItem                          ← NEW — single item row in panel
        WeeklyGrid                               ← NEW — view mode
        DailyColumn                              ← NEW — view mode

    [activeTab === 'analytics']
      AnalyticsView                              ← EXISTING — unchanged

    Right sidebar (always visible on Calendar tab) — swappable content: [FIXED]
      // Default view: MetaDripQueue + IGGridPreview
      // When item selected: swap to ItemDetailSidebar (replaces both widgets)
      MetaDripQueue                              ← NEW (simplified — no 5×5 grid in P1) [FIXED]
      IGGridPreview                              ← NEW
      ReadyToScheduleMiniQueue                   ← NEW [FIXED — added missing queue]
        // Shows approved PTP items not yet scheduled
        // "Content Ready" mini-list at bottom of sidebar
        // Query: api.reels.listApprovedUnscheduled({ modelId })

    // [FIXED] ItemDetailDrawer → ItemDetailSidebar (sidebar swap, not slide-over overlay)
    ItemDetailSidebar                            ← NEW (replaces MetaDripQueue+IGGrid in sidebar when item selected)
      BestTimeRecommendation                     ← NEW (constants-based for MVP) [FIXED — not API-based]
    BulkImportModal                              ← NEW (triggered from header dropdown)
    SchedulePostModal                            ← NEW (triggered from header CTA or DayDetailPanel onAddItem) [FIXED — wire onAddItem prop]
```

---

## 3. PER-COMPONENT SPEC

### 3a. ScheduleFeaturePage (ENHANCE existing)

**File:** `src/features/schedule/components/ScheduleFeaturePage.tsx`

**What to ADD:**
- Import and wire `ModelSelector`, `AccountSelector`, `CalendarViewToggle` into `filterRightSlot` prop of `ContentPageShell`
- Add state: `selectedModel`, `selectedAccount`, `calendarView: 'daily' | 'weekly' | 'monthly'`
- Add state: `selectedDay: number | null`, `selectedItem: ScheduledPost | null`
- Pass `selectedModel`, `selectedAccount`, `calendarView`, `onDaySelect`, `onItemSelect` down to `CalendarView`
- Add `rightSidebarSlot` (or render alongside) holding `MetaDripQueue` + `IGGridPreview`
- Change layout of content area from `max-w-5xl mx-auto` to `flex gap-5` to accommodate right sidebar
- Add `BulkImportModal` + `SchedulePostModal` triggered from header dropdown items

**State shape to add:**
```ts
const [selectedModel, setSelectedModel] = useState<string | null>(null);   // model ID
const [selectedAccount, setSelectedAccount] = useState<string | null>(null); // IG handle
const [calendarView, setCalendarView] = useState<CalendarViewMode>('monthly');
const [selectedDay, setSelectedDay] = useState<number | null>(null);
const [selectedItem, setSelectedItem] = useState<ScheduledPost | null>(null);
const [showBulkImport, setShowBulkImport] = useState(false);
const [showIGGrid, setShowIGGrid] = useState(true);
```

---

### 3b. ModelSelector (NEW)

**File:** `src/features/schedule/components/controls/ModelSelector.tsx`

**Pattern:** Generic filter pill (section 7b of DESIGN_SYSTEM_REFERENCE)

**Props:**
```ts
interface ModelSelectorProps {
  value: string | null;
  onChange: (modelId: string | null) => void;
  models: { id: string; handle: string; avatarUrl: string; color: string }[];
}
```

**Render:**
- Pill button: `[avatar ring] @handle ▾` — 24px avatar with model accent color ring
- When `value === null`: label = "All Models"
- Dropdown: list of models with avatar + handle + niche tag + post count badge
- "All Models" option at top with a grid icon
- Width: `w-52`
- Active state: gradient background using OFM accent `linear-gradient(135deg, #ff0069, #833ab4)`

---

### 3c. AccountSelector (NEW)

**File:** `src/features/schedule/components/controls/AccountSelector.tsx`

**Props:**
```ts
interface AccountSelectorProps {
  modelId: string | null;         // filters accounts to selected model
  value: string | null;           // selected IG handle
  onChange: (handle: string | null) => void;
}
```

**Render:**
- Pill button: `[IG icon] @handle ▾`
- Disabled/greyed when no model is selected (shows "Select model first")
- Dropdown lists accounts scoped to selected model
- Each row: handle + follower count + platform badge (IG icon)
- Width: `w-44`

---

### 3d. CalendarViewToggle (NEW)

**File:** `src/features/schedule/components/controls/CalendarViewToggle.tsx`

**Pattern:** Existing ViewToggle component (`@/components/ui/view-toggle`) — use directly.

```tsx
<ViewToggle
  value={calendarView}
  onChange={setCalendarView}
  options={[
    { value: 'daily',   icon: <AlignJustify size={11} />,  label: 'Daily' },
    { value: 'weekly',  icon: <Columns size={11} />,       label: 'Weekly' },
    { value: 'monthly', icon: <LayoutGrid size={11} />,    label: 'Monthly' },
  ]}
  size="md"
/>
```

No new component needed — wire ViewToggle directly in ScheduleFeaturePage's filterRightSlot.

---

### 3e. CalendarView (ENHANCE existing)

**File:** `src/features/schedule/components/calendar/CalendarView.tsx`

**What to ADD:**

Props to extend:
```ts
interface CalendarViewProps {
  filter: FilterType;
  // NEW:
  selectedModel: string | null;
  selectedAccount: string | null;
  calendarView: 'daily' | 'weekly' | 'monthly';
  selectedDay: number | null;
  onDaySelect: (day: number | null) => void;
  onItemSelect: (item: ScheduledPost) => void;
}
```

- Add view-mode branching: `if (calendarView === 'weekly') return <WeeklyGrid ...>`
- Add `if (calendarView === 'daily') return <DailyColumn ...>`
// [FIXED] Replace static SCHEDULED_POSTS constants filter with live Convex query:
// useQuery(api.scheduledPosts.listByMonth, { modelId: selectedModel, accountHandle: selectedAccount, month: currentMonth })
// SCHEDULED_POSTS constants file is for development seed data only — not used in production
- Filter live Convex data by `selectedModel` and `selectedAccount` (when not null)
- Replace current dot-only cells with `CalendarDayCell` component
- After monthly grid render: if `selectedDay !== null`, render `DayDetailPanel` for that day (inserted between week rows — see interaction spec)

---

### 3f. CalendarDayCell (NEW)

**File:** `src/features/schedule/components/calendar/CalendarDayCell.tsx`

**What it replaces:** The current `<div key={di} className="relative p-2 min-h-[80px] ...">` inline cell.

**Props:**
```ts
interface CalendarDayCellProps {
  day: number | null;
  isToday: boolean;
  isSelected: boolean;
  posts: ScheduledPost[];
  onSelect: (day: number) => void;
  onItemClick: (item: ScheduledPost) => void;
}
```

**Render (monthly view):**
- `min-h-[88px]` cells — slightly taller than current 80px
- Day number: existing today-ring behaviour kept; add `isSelected` state — selected day gets `bg-[#fff0f6]` cell background + `border-[#ff0069]/20` border
- Content items (up to 3 visible):
  - **Mini content chip** (not just a dot): `w-full flex items-center gap-1 px-1.5 py-0.5 rounded-md text-[9px] font-medium`
  - Background: `TYPE_COLOR[post.type]` at 15% opacity, text at `TYPE_COLOR` full
  - Shows: type icon (8px) + truncated handle (8 chars max)
  - On hover: scale 1.02, show time tooltip
- Overflow: `+N` chip using existing pattern but styled as `rounded text-[9px] text-neutral-400`
- Click anywhere in cell: `onSelect(day)`
- Click a chip: `e.stopPropagation(); onItemClick(post)`

---

### 3g. DayDetailPanel (NEW)

**File:** `src/features/schedule/components/calendar/DayDetailPanel.tsx`

**Render location:** Injected between calendar week rows (the row containing the selected day) using a conditional row insertion in MonthGrid.

**Props:**
```ts
interface DayDetailPanelProps {
  day: number;
  month: string;       // "April 2026"
  posts: ScheduledPost[];
  onClose: () => void;
  onItemClick: (item: ScheduledPost) => void;
  onAddItem: (day: number) => void;
  // [FIXED] onAddItem wiring: ScheduleFeaturePage must pass:
  // onAddItem={(day) => { setScheduleModalDay(day); setShowScheduleModal(true); }}
  // Thread through CalendarView → DayDetailPanel
}
```

**Animation:** `AnimatePresence` + `motion.div initial={{ opacity:0, height:0 }} animate={{ opacity:1, height:'auto' }}` — accordion expand.

**Layout:**
```
┌─ DayDetailPanel ─────────────────────────────────────────────────────────────┐
│  bg-[#fafafa] border-t border-b rgba(0,0,0,0.06) px-4 py-3                  │
│                                                                               │
│  [day label text-sm font-semibold] · [N items text-xs text-neutral-400]  [×] │
│                                                                               │
│  {posts.map → DayDetailItem}                                                  │
│                                                                               │
│  [+ Add item for this day]  ← text-xs text-[#ff0069] hover:underline         │
└───────────────────────────────────────────────────────────────────────────────┘
```

**DayDetailItem layout:**
```
[thumb 40x40 rounded-lg]  [type badge]  [handle @text-sm]  [time text-xs]  [status pill]  [Edit] [···]
```
- Thumbnail: `rounded-lg object-cover bg-gradient-to-br` using TYPE_COLOR as placeholder
- Type badge: `text-[10px] font-semibold px-1.5 py-0.5 rounded` in TYPE_COLOR
- Status pill: SCHEDULED (green), PENDING (amber), FAILED (red) — using StatusStrip colour tokens
- Edit: `text-xs text-neutral-500 hover:text-neutral-800 transition-colors`
- `···`: `DropdownMenu` with: Edit, Reschedule, Duplicate, Remove

---

### 3h. ItemDetailDrawer (NEW)

**File:** `src/features/schedule/components/drawers/ItemDetailDrawer.tsx`

**Render location:** Fixed right-side slide-over, rendered at `ScheduleFeaturePage` level (not inside CalendarView).

**Props:**
```ts
interface ItemDetailDrawerProps {
  item: ScheduledPost | null;
  onClose: () => void;
  onReschedule: (item: ScheduledPost, newDay: number, newTime: string) => void;
  onEditCaption: (item: ScheduledPost) => void;
  onPublishNow: (item: ScheduledPost) => void;
  onRemove: (item: ScheduledPost) => void;
}
```

**Animation:** `AnimatePresence` + `motion.div initial={{ x: '100%' }} animate={{ x: 0 }} exit={{ x: '100%' }} transition={{ type: 'spring', stiffness: 300, damping: 30 }}`

**Width:** `w-96` (384px) — fixed right, overlays main content area (does NOT push calendar)

**Layout sections (top to bottom):**

1. **Drawer header** (`h-14 px-5 flex items-center justify-between border-b rgba(0,0,0,0.07)`)
   - Left: `[type badge]  @handle  ·  Apr 3  ·  12:00 PM`
   - Right: `[×]` close button

2. **Media preview** (`px-5 pt-4`)
   - 16:9 rounded-xl container: `aspect-video rounded-xl overflow-hidden`
   - Shows thumbnail or video still; plays on hover
   - Bottom-left overlay: type badge + duration (for reels/video)

3. **Caption section** (`px-5 pt-4`)
   - Label: `text-[11px] font-medium text-neutral-500 uppercase tracking-[0.25em]`
   - Text: `text-sm text-neutral-700 leading-relaxed`
   - `[Edit]` inline link

4. **On-screen text** (`px-5 pt-3`) — same pattern as caption

5. **Metadata table** (`px-5 pt-3`)
   - White surface card (section 2e of DESIGN_SYSTEM_REFERENCE)
   - 4 rows: Best time | AI score | Approved by | Meta drip status

6. **BestTimeRecommendation inline widget** (`px-5 pt-3`)
   - Small card: AI-recommended posting times for this account/day combo
   - Shows: `Optimal: 12:00 PM Thu (+23% reach)` with a small bar indicator
   - Pattern: `nestedCardClass` from design system
   - **[FIXED] Data source for MVP: constants file** `src/features/schedule/constants/bestTimes.ts` — per-niche per-day-of-week recommendation table. NOT a live API call in P1. Example:
     ```ts
     // bestTimes.ts
     export const BEST_TIMES: Record<string, Record<string, string>> = {
       fitness:   { Mon: '6:00 AM', Wed: '12:00 PM', Fri: '5:00 PM' },
       lifestyle: { Tue: '11:00 AM', Thu: '8:00 PM', Sat: '10:00 AM' },
       // ...
     };
     ```
   - Future (P3+): `api.schedule.getOptimalPostDate({ modelId, niche })` using historical `scheduledPosts` engagement data (requires `engagementRate` field added to `scheduledPosts`)

7. **Action bar** (`px-5 py-4 border-t rgba(0,0,0,0.07) flex gap-2 flex-wrap mt-auto`)
   - `[Reschedule]` — outline pill → opens date/time picker popover
   - `[Edit Caption]` — outline pill
   - `[Remove]` — outline pill, red text on hover
   - `[Publish Now]` — gradient pill (OFM accent)

---

### 3i. MetaDripQueue (NEW)

**File:** `src/features/schedule/components/sidebar/MetaDripQueue.tsx`

> **[FIXED]** 5×5 slot grid removed from P1. Replace with progress bar + count summary only. Grid can be added in P2 once slot data source is confirmed.
> **[FIXED]** Data source specified: `useQuery(api.scheduledPosts.getDripStatus, { accountHandle })` returning: `{ used, total, nextDripAt, isPaused, cooldownHours }`. Add `isDripPaused: v.optional(v.boolean())` and `dripCooldownHours: v.optional(v.number())` to account settings in `CONVEX_SCHEMA_ADDITIONS.md`.

**Props:**
```ts
interface MetaDripQueueProps {
  used: number;          // 0–25 (filled slots)
  total: number;         // always 25
  nextDripIn: string;    // "2h 40m"
  cooldownHours: number; // 4
  isActive: boolean;
  isPaused: boolean;     // [FIXED] added — was missing
  onPause: () => void;
  onResume: () => void;
}
```

**Layout** (white surface card, section 2e):
```
Header row:
  "Meta Drip Queue"  text-sm font-semibold text-neutral-900
  [● Active | ○ Paused]  status dot (green/amber)
  [Pause / Resume]  text-xs button

Progress bar:
  Full-width rounded-full h-2 bg-neutral-100
  Fill: linear-gradient(90deg, #ff0069, #833ab4) — width = (used/total)*100%
  Label right-aligned: "13 / 25 slots"  text-xs text-neutral-500

// [FIXED] 5×5 slot grid REMOVED from P1 — replaced with count summary:
Slot count row:
  "13 used · 12 free"  text-xs text-neutral-500

Footer:
  "Next drip: 2h 40m"  text-xs text-neutral-500
  "·"  separator
  "4h cooldown between posts"  text-xs text-neutral-400
```

> **[FIXED] ReadyToScheduleMiniQueue:** Add below MetaDripQueue in sidebar. Shows approved PTP items not yet scheduled. Query: `api.reels.listApprovedUnscheduled({ modelId: selectedModel })`. Each item shows thumbnail + handle + "Schedule →" button that opens `SchedulePostModal` pre-filled.

---

### 3j. IGGridPreview (NEW)

**File:** `src/features/schedule/components/sidebar/IGGridPreview.tsx`

> **[FIXED]** Data source specified: `useQuery(api.scheduledPosts.getIGGridPosts, { accountHandle, limit: 12 })` returning last 9 `published` records + next 3 `scheduled_meta` records ordered by `scheduledAt`.
> **[FIXED]** `IGGridPost.gradient` removed from interface — generate deterministic CSS gradient from post `id` hash inside the component when `thumbnailUrl` is null. Do not store gradient in DB.
> **[FIXED]** Caption updated: "Next 3 scheduled posts" (not "shown in feed order" — feed position depends on exact publish time, not scheduledAt order).
> **[FIXED]** `AccountSelector` disabled state: show greyed-out pill with label "Account" and no dropdown (not an error-style "Select model first" message) when no model is selected.

**Props:**
```ts
interface IGGridPreviewProps {
  account: string;       // "@abg.ricebunny"
  posts: IGGridPost[];   // published + scheduled (up to 12 cells)
  isVisible: boolean;
  onToggle: () => void;
}

interface IGGridPost {
  id: string;
  thumbnailUrl?: string;
  // [FIXED] gradient removed — generated internally from id hash when thumbnailUrl is null
  isScheduled: boolean;
  scheduledDay?: number;
  type: ContentType;
}
```

**Layout** (white surface card):
```
Header row:
  [IG icon 12px] @handle  text-sm font-semibold text-neutral-900
  [Show Grid / Hide Grid]  toggle — text-xs text-neutral-400 hover:text-neutral-600

When visible:
  3-column CSS grid gap-0.5
  12 cells (3 rows × 3 cols = last 9 published + next 3 scheduled)
  Each cell: aspect-square rounded-sm overflow-hidden
    Published: thumbnail or gradient placeholder
    Scheduled: thumbnail/placeholder + pink ring (ring-2 ring-[#ff0069]/60)
               + small badge bottom-right: type icon + "Scheduled" text-[8px]
  On hover: slight scale-105 overlay showing date

Caption below grid:
  "Next 3 posts shown in feed order"  text-[10px] text-neutral-400 mt-2
```

---

### 3k. WeeklyGrid (NEW)

**File:** `src/features/schedule/components/calendar/WeeklyGrid.tsx`

> **[FIXED]** Built in P1 WITHOUT drag. Items are click-only in P1. `onItemDrop` prop exists but is a no-op stub that shows "Drag to reschedule — coming soon" toast. Drag enabled in P2.

**Props:**
```ts
interface WeeklyGridProps {
  weekStart: Date;
  posts: ScheduledPostView[];  // [FIXED] use ScheduledPostView not ScheduledPost
  onItemClick: (item: ScheduledPostView) => void;
  onItemDrop: (item: ScheduledPostView, newDay: number, newHour: number) => void;
  // [FIXED] onItemDrop is no-op stub in P1 — shows "coming soon" toast
}
```

**Layout:**
- 7-column time-grid: header row (day labels) + 24 time rows (but display 8 AM – 11 PM = 15 visible rows, scrollable)
- Time labels: left column `w-12`, `text-[10px] text-neutral-300`
- Content items rendered as positioned cards inside their time slot:
  - `rounded-md px-2 py-1 text-[10px] font-medium`
  - Background: TYPE_COLOR at 20% opacity with TYPE_COLOR left border `border-l-2`
  - Text: handle + type
- **No drag in P1** [FIXED] — items are click-only, onItemDrop is stub
- Current time indicator: horizontal red line across all columns

---

### 3l. DailyColumn — DEFERRED TO P2 [FIXED]

> **[FIXED]** `DailyColumn` cut from P1 scope. Duplicates `DayDetailPanel` functionality. Keep the daily option in `CalendarViewToggle` UI but disable it with a tooltip "Daily view — coming soon". Do not build `DailyColumn.tsx` in P1.

**File:** `src/features/schedule/components/calendar/DailyColumn.tsx` — P2 only

**Props:**
```ts
interface DailyColumnProps {
  date: Date;
  posts: ScheduledPost[];
  onItemClick: (item: ScheduledPost) => void;
}
```

**Layout:**
- Single column, time-labelled (8 AM – 11 PM)
- Items rendered like WeeklyGrid but expanded: full handle + caption preview + thumbnail
- Right sidebar remains visible with MetaDripQueue and IGGridPreview

---

### 3m. BulkImportModal (NEW)

**File:** `src/features/schedule/components/modals/BulkImportModal.tsx`

**Trigger:** "Bulk Import" option in header action dropdown.

**Pattern:** Standard modal (section 12 of DESIGN_SYSTEM_REFERENCE), but `w-[480px]` wider.

**Layout:**
- Header: "Bulk Import Content Schedule"
- Dropzone area: `border-dashed border-2 border-neutral-200 rounded-xl p-8 text-center`
  - `Upload CSV` primary option
  - "or drag & drop"
  - Link: "Download template"
- CSV format preview (collapsible): shows expected columns
- Submit: gradient button "Import Schedule"

---

### 3n. SchedulePostModal (NEW)

**File:** `src/features/schedule/components/modals/SchedulePostModal.tsx`

**Trigger:** Header "+ Schedule Post" CTA or "Add item for this day" in DayDetailPanel.

**Pattern:** Standard modal, `w-[420px]`.

**Layout:**
- Model picker: horizontal row of model avatar pills (select one)
- Account picker: appears after model selected
- Content type: icon button row (Reel / Post / Story / Carousel / Video)
- Date + time: shadcn DatePicker + time input
- Caption textarea
- On-screen text input
- "Add to Meta Drip Queue" toggle
- Submit: "Schedule Post"

---

## 4. INTERACTION SPEC

### 4a. Click Day → DayDetailPanel

1. User clicks a `CalendarDayCell` (the cell div, not a content chip)
2. `onDaySelect(day)` fires → `selectedDay` state updates in `ScheduleFeaturePage`
3. CalendarView receives new `selectedDay` prop → identifies which week row contains that day
4. Inserts `<DayDetailPanel>` as an extra row immediately after the week row containing that day
5. `AnimatePresence` + `height: 0 → auto` accordion animation (200ms, ease)
6. Clicking the same day again: `onDaySelect(null)` → panel collapses
7. Clicking a different day: previous panel collapses, new one opens (no simultaneous panels)
8. Panel does NOT close when clicking inside it

### 4b. Click Item → ItemDetailSidebar [FIXED — was ItemDetailDrawer]

> **[FIXED]** Drawer pattern replaced with sidebar swap. Clicking an item swaps the right sidebar content instead of opening a separate fixed overlay. This avoids IssoSidebarShell z-index/position conflicts.

1. User clicks a content chip in `CalendarDayCell` OR a `DayDetailItem` row
2. `e.stopPropagation()` prevents day-select from firing
3. `onItemSelect(item)` fires → `selectedItem` updates in `ScheduleFeaturePage`
4. Right sidebar content swaps: MetaDripQueue+IGGrid → `ItemDetailSidebar` (AnimatePresence swap)
5. Calendar area does NOT compress — sidebar width stays the same, content just swaps
6. Clicking `[×]` in `ItemDetailSidebar` or pressing Escape → `selectedItem = null` → sidebar reverts to MetaDripQueue+IGGrid
7. DayDetailPanel stays open when sidebar swaps (two things can be open simultaneously)

### 4c. Drag to Reschedule — DEFERRED TO P2 [FIXED]

> **[FIXED]** Drag-to-reschedule cut from P1 MVP scope. Highest-complexity item in the build.
> In P1: `onItemDrop` is a no-op stub. Dropping shows a toast: "Drag to reschedule — coming soon".
> In P2: implement with `@dnd-kit/core` as described below.

**Monthly view (P2):**
- Drag a content chip in a cell to a different day cell
- Uses `@dnd-kit/core`: `DndContext` wraps CalendarView; each chip is `Draggable`, each cell is `Droppable`
- On drop: `onItemDrop(item, targetDay)` → optimistic UI update + Convex mutation
- Invalid drop (outside cells, past dates): returns to origin with spring bounce animation

**Weekly view (P2):**
- Drag item to new column (day) and/or new row (time slot)
- `onItemDrop(item, newDay, newHour)` → Convex mutation

### 4d. Approve from PTP → Auto-appear in Calendar

1. When an item is approved in `/agency/ptp` (Approvals page), Convex triggers a real-time update
2. `ScheduleFeaturePage` subscribes to `useQuery(api.schedule.getScheduledPosts, { modelId, accountHandle })`
3. New approved item appears in calendar on its scheduled date — no refresh needed
4. Cell shows new content chip with `AnimatePresence` `initial={{ scale: 0.8, opacity: 0 }} animate={{ scale: 1, opacity: 1 }}`

### 4e. Meta Queue Status Updates

1. `MetaDripQueue` component subscribes to `useQuery(api.meta.getDripQueueStatus, { accountHandle })`
2. On each post drip: `used` increments, slot grid updates, `nextDripIn` countdown refreshes
3. When all 25 slots filled: progress bar pulses amber, "Queue full — next available in Xh" message
4. When queue paused: progress bar goes grey, pause button toggles to Resume
5. `StatusStrip` at top also reflects drip queue state (rightSlot shows mini indicator)

### 4f. IGGridPreview Toggle

1. Toggle button in IGGridPreview header: show/hide grid panel
2. `showIGGrid` state in ScheduleFeaturePage controls visibility
3. Hide → right sidebar collapses to just MetaDripQueue (smoother on smaller screens)
4. Grid cells that are scheduled items: clicking them opens the `ItemDetailDrawer` for that item

---

## 5. DATA LAYER ADDITIONS

### New types to add to `types.ts`

```ts
export type CalendarViewMode = 'daily' | 'weekly' | 'monthly';

export interface Model {
  id: string;
  handle: string;          // "@abg.ricebunny"
  displayName: string;
  avatarUrl?: string;
  accentColor: string;     // per-model brand color
  accounts: IGAccount[];
}

export interface IGAccount {
  handle: string;
  platform: 'instagram' | 'tiktok';
  followerCount: number;
  thumbnailUrl?: string;
}

// [FIXED — BLOCKER] ScheduledPost type conflicts with canonical scheduledPosts schema
// ScheduledPost in types.ts must be Doc<'scheduledPosts'>
// Derived/joined fields go in a separate ScheduledPostView type

// Use canonical Doc<'scheduledPosts'> directly:
export type ScheduledPost = Doc<'scheduledPosts'>;

// Derived view type for UI display (assembled at query time):
export interface ScheduledPostView {
  // From scheduledPosts table (canonical):
  _id: Id<'scheduledPosts'>;
  scheduledAt: number;      // [FIXED] was day+hour+minute — use Unix ms, derive day/hour/minute with date utils
  modelId: Id<'models'>;    // [FIXED] was modelId: string
  platform: string;
  metaSlotPosition?: number; // [FIXED] was metaDripSlot
  status: string;            // canonical 7-value enum: queued|slot_assigned|uploading_to_meta|scheduled_meta|published|failed|cancelled
                             // [FIXED] was 4-value enum — map canonical → display at component level
  type: ContentType;
  caption?: string;
  onScreenText?: string;
  thumbnailUrl?: string;
  bestTimeScore?: number;    // [FIXED] was aiScore — canonical field name is bestTimeScore

  // Joined from reels (fetch via join, NOT stored on scheduledPosts):
  approvedBy?: string;       // [FIXED] lives on reels record, not scheduledPosts
  approvedAt?: string;       // [FIXED] lives on reels record, not scheduledPosts

  // Derived (compute from scheduledAt, not stored):
  day: number;               // derive: new Date(scheduledAt).getDate()
  hour: number;              // derive: new Date(scheduledAt).getHours()
  minute: number;            // derive: new Date(scheduledAt).getMinutes()
  handle: string;            // derive: joined from models table
}

export interface MetaDripStatus {
  used: number;            // 0-25
  total: 25;
  slots: Array<{ slot: number; postId?: string; status: 'filled' | 'queued' | 'empty' }>;
  nextDripAt?: string;     // ISO timestamp
  cooldownHours: number;
  isPaused: boolean;
}

export interface IGGridPost {
  id: string;
  thumbnailUrl?: string;
  gradient?: { from: string; to: string };
  isScheduled: boolean;
  scheduledDay?: number;
  type: ContentType;
}
```

---

## 6. COMPETITOR REFERENCE — Patterns to Steal from Later.com

| Later Pattern | Adaptation for ISSO |
|---------------|---------------------|
| **Visual grid planner** — drag content thumbnails directly onto IG grid preview to see how feed looks | IGGridPreview panel: same concept, but show thumbnails of scheduled posts in correct feed position |
| **Best time labels** on calendar cells — colour-coded time slots showing "Best", "Good", "OK" based on historical engagement | CalendarDayCell: show a faint coloured dot or glow on the best time slot row in weekly view |
| **Queue drip mode** — Later's "Auto Publish" queue fills time slots automatically | MetaDripQueue: the 25-slot bar is the visual equivalent. Auto-slot button: "Fill next available slot" |
| **Week/month view toggle** with time-blocked events (not just dots) | WeeklyGrid: time-blocked events with TYPE_COLOR left border — stolen directly from Later weekly view |
| **Caption preview** on calendar hover | CalendarDayCell hover: tooltip shows first 40 chars of caption (not on mobile) |
| **Label/category system** — Later lets you colour-label posts for campaigns | Map to our ContentType colours — already done. Future: add campaign label as a second colour ring |
| **Starred/best time slots** — Later highlights recommended times with stars | BestTimeRecommendation in ItemDetailDrawer: show "+23% reach" annotation on recommended times |
| **Media library panel** — Later has a right panel to drag-drop from asset library | Future: right sidebar could include a "Content Ready" mini queue (approved PTP items not yet scheduled) |
| **Stories preview** — separate preview mode for stories (vertical 9:16) | ItemDetailDrawer: if type === 'story', show preview in 9:16 aspect ratio (not 16:9) |
| **Bulk scheduling** — CSV import with auto-assign to available time slots | BulkImportModal handles this. Also add "Auto-schedule all" button that fills empty optimal slots |

### Later.com Key UX Patterns (direct steal list)

1. **Calendar cell density**: Later shows thumbnail images inside cells (not just dots). For ISSO: show mini chips with gradient thumbnail placeholder + type icon. Full thumbnails only in weekly/daily view.
2. **Publish status colour coding**: Later uses green (published), blue (scheduled), orange (draft), red (failed) consistently across all views. Mirror with ISSO's `#22c55e / #ff0069 / #f59e0b / #ef4444`.
3. **Drag ghost**: Later's drag ghost shows a semi-transparent copy of the content item. Use dnd-kit's `DragOverlay` with the chip at 80% opacity + slight rotation.
4. **"Best time" marker**: Later shows a small ⚡ icon on time slots with highest historical engagement. In weekly view, show a faint `bg-[#ff0069]/5` background on best-time rows.
5. **Right-click context menu**: Later has right-click on items → reschedule / duplicate / delete. Add this as an alternative to the `···` dropdown on `DayDetailItem`.

---

## 7. FILE CREATION PLAN

All new files go under `src/features/schedule/`:

```
components/
  controls/
    ModelSelector.tsx           NEW
    AccountSelector.tsx         NEW
    index.ts                    NEW
  calendar/
    CalendarView.tsx            ENHANCE (existing)
    CalendarDayCell.tsx         NEW
    DayDetailPanel.tsx          NEW
    DayDetailItem.tsx           NEW
    WeeklyGrid.tsx              NEW
    DailyColumn.tsx             NEW
    index.ts                    UPDATE
  sidebar/
    MetaDripQueue.tsx           NEW
    IGGridPreview.tsx           NEW
    index.ts                    NEW
  drawers/
    ItemDetailDrawer.tsx        NEW
    BestTimeRecommendation.tsx  NEW
    index.ts                    NEW
  modals/
    BulkImportModal.tsx         NEW
    SchedulePostModal.tsx       NEW
    index.ts                    NEW
  ScheduleFeaturePage.tsx       ENHANCE (existing)
  index.ts                      UPDATE
types.ts                        EXTEND (add new interfaces)
constants.tsx                   EXTEND (add MODELS, TIME_SLOTS, DRIP_QUEUE mock data)
```

**Total: 13 new files, 4 files enhanced.**

---

## 8. BUILD ORDER (phased, dependency-safe)

| Phase | Work | Files | Complexity |
|-------|------|-------|-----------|
| 1 | Types + constants extension | `types.ts`, `constants.tsx` | Low |
| 2 | Controls: ModelSelector, AccountSelector | 2 new files | Low |
| 3 | Enhanced CalendarDayCell + wire into CalendarView | 1 new + 1 enhanced | Medium |
| 4 | DayDetailPanel + DayDetailItem | 2 new files | Medium |
| 5 | ItemDetailDrawer + BestTimeRecommendation | 2 new files | Medium |
| 6 | MetaDripQueue + IGGridPreview sidebar | 2 new files | Medium |
| 7 | ScheduleFeaturePage layout wiring (all controls + sidebar) | 1 enhanced | Medium |
| 8 | WeeklyGrid + DailyColumn + CalendarViewToggle | 2 new + wire toggle | High |
| 9 | Drag-to-reschedule (dnd-kit) | CalendarView + WeeklyGrid | High |
| 10 | BulkImportModal + SchedulePostModal | 2 new files | Low–Medium |

**Phases 1–7 = MVP (static data, click interactions). Phases 8–10 = Full feature.**
