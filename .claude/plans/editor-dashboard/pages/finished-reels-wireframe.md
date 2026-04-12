# Finished Reels — Detailed Wireframe + Component Spec

**Route:** `/editor/finished`
**Feature directory:** `src/features/editors-dashboard/`
**Page file:** `src/app/isso/editor/finished/page.tsx`
**Features:** E17–E26
**Status:** planned
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
│  │                  │  │  │  ContentPageShell                           │ ││
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
│  [Film 16px]  Finished Reels  [◉ 34 reels]                                 │
│                                                                             │
│                    ┌────────────────────────────────┐                      │
│                    │  🔍  Search reels...        ⌘K  │  w-80 bg-#f5f5f4   │
│                    └────────────────────────────────┘                      │
│                                                                   [↑ Upload Reel ▾]│
│                                                     gradient pill h-9 rounded-xl  │
└─────────────────────────────────────────────────────────────────────────────┘
```

- Icon: `Film` size 16, `text-neutral-500`
- Title: `text-sm font-semibold text-neutral-900`
- StatPill: `ml-3` — label "reels", value = `reels.length`
- Search: `absolute left-1/2 -translate-x-1/2 w-80 h-9 rounded-xl bg-#f5f5f4`
- Action button: `h-9 rounded-xl` with `accentGradient` — "↑ Upload Reel" with ChevronDown split

Action dropdown items:
```
┌────────────────────────┐
│  ↑  Upload new reel    │
│  📋  Bulk upload       │
│  ⏱  View edit timers   │
└────────────────────────┘
```

### 1c. ROW 2 — Sub-nav tabs + filter bar (px-3 py-2, border-bottom rgba(0,0,0,0.07))

```
┌─────────────────────────────────────────────────────────────────────────────┐
│ px-3 py-2 flex items-center justify-between                                 │
│                                                                             │
│  LEFT:                                                                      │
│  [▦ Gallery]  [≡ List]  [⏱ Edit Times]  │ > PTP Status                    │
│   active=pink  inactive=neutral                                             │
│                                                                             │
│  RIGHT:                                                                     │
│  [Model ▾]  [Status ▾]  [↑ Score ▾]  [⊞ Add Filter]  [≡▦ Toggle]          │
└─────────────────────────────────────────────────────────────────────────────┘
```

Tab details:
- Tab 1 "Gallery": `<LayoutGrid size={13} />`
- Tab 2 "List": `<List size={13} />`
- Tab 3 "Edit Times": `<Timer size={13} />`
- Next product: `→ PTP Status` links to `/editor/ptp-status`

Right-side controls (left to right):
1. Model filter pill (7b pattern)
2. Status filter pill — "All / Pending PTP / Approved / Rejected"
3. Score sort pill — "Highest / Lowest"
4. `AddFilterPill` (7a pattern)
5. `ViewToggle` — grid/list modes

### 1d. ROW 3 — Content area

#### GALLERY VIEW (default tab)

```
┌─────────────────────────────────────────────────────────────────────────────┐
│ flex-1 overflow-y-auto px-6 py-6                                            │
│                                                                             │
│  ┌──────────────────────────────────────────────────────────────────────┐  │
│  │  StatusStrip                                                         │  │
│  │  [● Auto-review active] [34 reels] [8 pending PTP] [avg score: 72]  │  │
│  │                                           [↻ Last upload: 4m ago]   │  │
│  └──────────────────────────────────────────────────────────────────────┘  │
│                                                                             │
│  ┌────────────┐ ┌────────────┐ ┌────────────┐ ┌────────────┐              │
│  │  [thumb]   │ │  [thumb]   │ │  [thumb]   │ │  [thumb]   │              │
│  │  9:16      │ │  9:16      │ │  9:16      │ │  9:16      │              │
│  │  ─────────  │ │  ─────────  │ │  ─────────  │ │  ─────────  │              │
│  │  Lexie M.  │ │  Maya R.   │ │  Zoe K.    │ │  Luna S.   │              │
│  │  [Fitness] │ │  [Lifestyle│ │  [Fashion] │ │  [Wellness]│              │
│  │  ──────── │ │  ──────── │ │  ──────── │ │  ──────── │              │
│  │  ◎ 84/99  │ │  ◎ 67/99  │ │  ◎ 91/99  │ │  ◎ 45/99  │              │
│  │  ● Pending│ │  ✓ Approved│ │  ◎ Review │ │  ✗ Rejected│              │
│  │  [Submit] │ │  [View]    │ │  [Review] │ │  [Re-edit] │              │
│  └────────────┘ └────────────┘ └────────────┘ └────────────┘              │
│                                                                             │
│  ┌────────────┐ ┌────────────┐ ┌────────────┐ ┌────────────┐              │
│  │  ...       │ │  ...       │ │  ...       │ │  ...       │              │
│  └────────────┘ └────────────┘ └────────────┘ └────────────┘              │
└─────────────────────────────────────────────────────────────────────────────┘
```

Grid: `grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4`

#### LIST VIEW (tab 2)

```
┌─────────────────────────────────────────────────────────────────────────────┐
│ flex-1 overflow-y-auto px-6 py-6                                            │
│                                                                             │
│  ┌──────────────────────────────────────────────────────────────────────┐  │
│  │ [thumb 80px sq] Lexie M. — "Morning Routine Reel"   [Fitness]        │  │
│  │                 V1 · 2:04 · Uploaded 2h ago                          │  │
│  │                 ◎ 84/99 virality  ● Pending PTP                      │  │
│  │  [Hook: "You won't believe..."]  [Caption ready]    [→ Submit PTP]   │  │
│  ├──────────────────────────────────────────────────────────────────────┤  │
│  │ [thumb 80px sq] Maya R. — "Day in My Life"          [Lifestyle]      │  │
│  │                 V2 · 1:18 · Uploaded 1d ago                          │  │
│  │                 ◎ 67/99 virality  ✓ PTP Approved                     │  │
│  │  [Hook: "This changed everything..."]  [Scheduled: Apr 16]  [View]   │  │
│  ├──────────────────────────────────────────────────────────────────────┤  │
│  │  ...                                                                  │  │
│  └──────────────────────────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────────────────────────┘
```

#### EDIT TIMES VIEW (tab 3)

```
┌─────────────────────────────────────────────────────────────────────────────┐
│ flex-1 overflow-y-auto px-6 py-6                                            │
│                                                                             │
│  ┌────────────────────────────────────┐  ┌──────────────────────────────┐  │
│  │  Edit Time Summary                 │  │  Capacity Planning            │  │
│  │  ─────────────────────             │  │  ─────────────────────        │  │
│  │  Avg edit time: 1h 24m             │  │  This week: 12 edits          │  │
│  │  Fastest: 0:38  Slowest: 3:12      │  │  Capacity used: 78%           │  │
│  │  Total this week: 16h 40m          │  │  Est. remaining: 4 edits      │  │
│  └────────────────────────────────────┘  └──────────────────────────────┘  │
│                                                                             │
│  ┌──────────────────────────────────────────────────────────────────────┐  │
│  │  Edit Time Log (this week)                                           │  │
│  │  ┌────────────────────────────────────────────────────────────────┐  │  │
│  │  │  Reel title          Model    Niche     Duration  Edit Time    │  │  │
│  │  ├────────────────────────────────────────────────────────────────┤  │  │
│  │  │  "Morning Routine"   Lexie M. Fitness   2:04      1h 12m      │  │  │
│  │  │  "Day in Life"       Maya R.  Lifestyle 1:18      0h 48m      │  │  │
│  │  │  "Outfit Unboxing"   Zoe K.   Fashion   0:58      1h 34m      │  │  │
│  │  │  ...                                                           │  │  │
│  │  └────────────────────────────────────────────────────────────────┘  │  │
│  └──────────────────────────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────────────────────────┘
```

---

#### UPLOAD FLOW — Full-screen modal (triggered by "Upload Reel" button)

```
┌─────────────────────────────────────────────────────────────────────────────┐
│  dialog overlay: bg-black/30 backdrop-blur-sm                               │
│                                                                             │
│  ┌──────────────────────────────────────────────────────┐                  │
│  │  motion.div — bg-white rounded-2xl w-[580px] p-6     │                  │
│  │                                                        │                  │
│  │  ← Step 1 of 3   Upload & Categorize        [X]      │                  │
│  │  ─────────────────────────────────────────────────    │                  │
│  │                                                        │                  │
│  │  ┌──────────────────────────────────────────────────┐ │                  │
│  │  │  Drag & drop reel here, or click to browse       │ │                  │
│  │  │  ┌──────────────────────────────────────────┐   │ │                  │
│  │  │  │    [upload icon]                         │   │ │                  │
│  │  │  │    Drop .mp4 / .mov here                 │   │ │                  │
│  │  │  │    Max 500MB                              │   │ │                  │
│  │  │  └──────────────────────────────────────────┘   │ │                  │
│  │  └──────────────────────────────────────────────────┘ │                  │
│  │                                                        │                  │
│  │  Model:     [Luna Srisuk ▾]                            │                  │
│  │  Niche:     [Fitness ▾]                                │                  │
│  │  Category:  [Hook Reel ▾]                              │                  │
│  │  Version:   [V1]  (auto-incremented if re-upload)      │                  │
│  │                                                        │                  │
│  │  ┌ Edit Time (optional) ──────────────────────────┐   │                  │
│  │  │  [⏱ Start Timer]  or manually enter: [__:__]   │   │                  │
│  │  └────────────────────────────────────────────────┘   │                  │
│  │                                                        │                  │
│  │  [Cancel]                        [Next: AI Review →]  │                  │
│  └──────────────────────────────────────────────────────┘                  │
└─────────────────────────────────────────────────────────────────────────────┘
```

**Step 2 — AI Review panel (after upload completes):**

```
┌──────────────────────────────────────────────────────┐
│  ← Step 2 of 3   AI Review                 [X]      │
│  ─────────────────────────────────────────────────    │
│                                                        │
│  [reel thumbnail 16:9, left]  [AI metadata, right]    │
│                                                        │
│  LEFT (w-48):                                          │
│  [video thumb]                                         │
│  2:04  ·  Fitness                                      │
│                                                        │
│  RIGHT (flex-1):                                       │
│  ◎  Virality Score:  84 / 99                           │
│     [ScoreRing 56px animated fill]                     │
│     "High virality potential — strong hook"            │
│                                                        │
│  On-screen text (extracted):                           │
│  "You won't believe what happened when I..."           │
│  [✎ Edit]                                              │
│                                                        │
│  Auto-title:                                           │
│  "Morning Routine Transformation 🌅"                   │
│  [✎ Edit]                                              │
│                                                        │
│  Auto-description:                                     │
│  "Lexie's 5am fitness routine..."                      │
│  [✎ Edit]                                              │
│                                                        │
│  AI Caption & Hook Variants:                           │
│  ┌───────────────────────────────────────────────┐    │
│  │  Hook 1 [◉ selected]:                          │    │
│  │  "I tried waking up at 5am for 30 days..."     │    │
│  │  #morningroutine #fitness #5amclub             │    │
│  ├───────────────────────────────────────────────┤    │
│  │  Hook 2:                                       │    │
│  │  "The workout routine that changed my life..." │    │
│  │  #gymlife #workout #transformation             │    │
│  ├───────────────────────────────────────────────┤    │
│  │  Hook 3:                                       │    │
│  │  "POV: You wake up before everyone else..."    │    │
│  │  #earlybird #fitness #motivation               │    │
│  └───────────────────────────────────────────────┘    │
│                                                        │
│  [← Back]               [Next: Submit to PTP →]       │
└──────────────────────────────────────────────────────┘
```

**Step 3 — Submit to PTP:**

```
┌──────────────────────────────────────────────────────┐
│  ← Step 3 of 3   Submit to PTP             [X]      │
│  ─────────────────────────────────────────────────    │
│                                                        │
│  [thumb 80px]  Lexie M. — "Morning Routine..."        │
│                Fitness · V1 · 2:04 · Score: 84        │
│                                                        │
│  Final caption: [selected hook text shown]            │
│  Hashtags:      [#morningroutine #fitness ...]        │
│                                                        │
│  [✓] Submit to PTP queue automatically                │
│  [✓] Sync to Google Drive                             │
│                                                        │
│  Notes for reviewer (optional):                        │
│  ┌──────────────────────────────────────────────┐    │
│  │                                               │    │
│  └──────────────────────────────────────────────┘    │
│                                                        │
│  [← Back]                      [Submit to PTP ✓]      │
└──────────────────────────────────────────────────────┘
```

---

## 2. Component Tree

```
FinishedReelsFeaturePage              src/features/editors-dashboard/components/FinishedReelsFeaturePage.tsx
└── ContentPageShell                  src/shared/layout/ContentPageShell.tsx
    │
    ├── [filterRightSlot]
    │   ├── ModelFilterPill           (7b pill pattern)  [REUSE]
    │   ├── StatusFilterPill          (7b pill pattern)  [REUSE]
    │   ├── ScoreSortPill             (SortPill adapted) [REUSE]
    │   ├── AddFilterPill             (7a pattern)       [REUSE]
    │   └── ViewToggle                                   [REUSE]
    │
    └── [children] AnimatePresence mode="wait"
        ├── [activeTab="gallery"] GalleryView
        │   ├── StatusStrip                              [REUSE from Intelligence]
        │   └── ReelCard (×n)                            [NEW — FinishedReelCard]
        │       ├── ViralityScoreBadge                   [NEW]
        │       ├── ApprovalStatusBadge                  [REUSE from rd-table]
        │       └── ReelCardActions                      [NEW]
        │
        ├── [activeTab="list"] ListView
        │   ├── StatusStrip                              [REUSE]
        │   └── ReelListRow (×n)                         [NEW]
        │       ├── ViralityScoreBadge                   [REUSE]
        │       ├── HookVariantPreview                   [NEW — inline chip]
        │       └── ApprovalStatusBadge                  [REUSE]
        │
        └── [activeTab="edit-times"] EditTimesView       [NEW]
            ├── EditTimeSummaryCard                      [NEW]
            ├── CapacityCard                             [NEW]
            └── EditTimeTable                            [NEW]

UploadReelModal                       src/features/editors-dashboard/components/finished-reels/UploadReelModal.tsx
├── Step1UploadCategorize             [NEW]
│   ├── FileDropzone                  [NEW]
│   └── VersionLabel                  [NEW — auto-increments]
├── Step2AIReview                     [NEW]
│   ├── ScoreRing                     [REUSE from Intelligence]
│   ├── HookVariantCards              [NEW — 3 selectable hook options]
│   └── EditableField                 [NEW — on-screen text, title, desc]
└── Step3Submit                       [NEW]
```

---

## 3. Per-Component Spec

### 3.1 FinishedReelsFeaturePage

**File:** `src/features/editors-dashboard/components/FinishedReelsFeaturePage.tsx`

```typescript
// No external props — owns all state

const [activeTab, setActiveTab]     = useState<'gallery' | 'list' | 'edit-times'>('gallery');
const [modelFilter, setModelFilter] = useState<string | null>(null);
const [statusFilter, setStatusFilter] = useState<PTPStatus | null>(null);
const [scoreSort, setScoreSort]     = useState<'highest' | 'lowest'>('highest');
const [uploadModalOpen, setUploadModalOpen] = useState(false);
const [searchQuery, setSearchQuery] = useState('');

const reels = useQuery(api.reels.listFinished, {
  model: modelFilter ?? undefined,
  ptpStatus: statusFilter ?? undefined,
}) ?? [];
```

**ContentPageShell props:**
```typescript
<ContentPageShell
  icon={<Film size={16} />}
  title="Finished Reels"
  stat={{ label: 'reels', value: reels.length }}
  searchPlaceholder="Search reels..."
  accentGradient="linear-gradient(135deg, #ff0069, #833ab4)"
  actionLabel="Upload Reel"
  actionIcon={<Upload size={14} />}
  onAction={() => setUploadModalOpen(true)}
  actionDropdownItems={[
    { id: 'upload',    label: 'Upload new reel',   icon: <Upload size={13} /> },
    { id: 'bulk',      label: 'Bulk upload',        icon: <Files size={13} /> },
    { id: 'timers',    label: 'View edit timers',   icon: <Timer size={13} /> },
  ]}
  tabs={[
    { id: 'gallery',    label: 'Gallery',     icon: <LayoutGrid size={13} /> },
    { id: 'list',       label: 'List',        icon: <List size={13} /> },
    { id: 'edit-times', label: 'Edit Times',  icon: <Timer size={13} /> },
  ]}
  activeTab={activeTab}
  onTabChange={id => setActiveTab(id as typeof activeTab)}
  nextProduct={{ label: 'PTP Status', icon: <CheckCircle size={12} />, href: '/editor/ptp-status' }}
  filterRightSlot={<FinishedReelsFilterBar ... />}
  searchValue={searchQuery}
  onSearch={setSearchQuery}
>
  {/* tab content */}
</ContentPageShell>
```

---

### 3.2 FinishedReelCard (Gallery card)

**File:** `src/features/editors-dashboard/components/finished-reels/FinishedReelCard.tsx`

```typescript
interface FinishedReelCardProps {
  reel: FinishedReel;
  onSelect: () => void;
}

interface FinishedReel {
  _id: string;
  modelName: string;
  modelAvatar?: string;
  niche: string;
  version: number;           // V1, V2, V3...
  durationSec: number;
  thumbnailUrl?: string;
  videoUrl?: string;
  viralityScore?: number;    // 0–99 (E25)
  ptpStatus: 'pending' | 'approved' | 'rejected' | 'under_review';
  caption?: string;
  selectedHookIndex?: number;
  uploadedAt: number;
  editTimeSec?: number;      // E24
}
```

**Classes:**
```tsx
<motion.div
  whileHover={{ scale: 1.02, y: -2 }}
  transition={{ type: 'spring', stiffness: 400, damping: 25 }}
  onClick={onSelect}
  className="rounded-xl bg-white overflow-hidden cursor-pointer"
  style={{ border: '1px solid rgba(0,0,0,0.07)', boxShadow: '0 1px 4px rgba(0,0,0,0.04)' }}
>
```

**Card layout:**
```
┌─────────────────────────────────┐
│ [thumbnail 9:16 aspect]         │  aspect-[9/16] object-cover bg-neutral-100
│  [V1 badge — top-left]          │  VersionLabel overlay
│  [◎ 84 — top-right]             │  ViralityScoreBadge overlay
├─────────────────────────────────┤
│ [Avatar 20px] Lexie M.          │  flex items-center gap-1.5
│ [Fitness badge]                 │  NicheBadge
│ ──────────────────────────────  │  border-t rgba(0,0,0,0.06)
│ ● Pending PTP                   │  ApprovalStatusBadge
│ [Submit to PTP]  (full-width)   │  ReelCardCTA — gradient or outline per status
└─────────────────────────────────┘
```

**ReelCardCTA variants by ptpStatus:**
- `pending` → `[Submit to PTP]` pink gradient button
- `under_review` → `[Under Review]` neutral outline
- `approved` → `[View Approved]` green outline
- `rejected` → `[Re-edit →]` amber outline + "Needs Tweaking" badge

---

### 3.3 ViralityScoreBadge

**File:** `src/features/editors-dashboard/components/finished-reels/ViralityScoreBadge.tsx`

```typescript
interface ViralityScoreBadgeProps {
  score: number;             // 0–99
  size?: 'sm' | 'md' | 'lg'; // sm=badge, md=inline, lg=ScoreRing
}
```

**Overlay badge (sm — for card thumbnail):**
```tsx
<span
  className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded-md text-[10px] font-bold"
  style={scoreStyle(score)}
>
  ◎ {score}
</span>
```

**Score color bands:**
```typescript
function scoreStyle(score: number) {
  if (score >= 80) return { background: '#dcfce7', color: '#14532d', border: '1px solid #bbf7d0' }; // green
  if (score >= 60) return { background: '#fef3c7', color: '#92400e', border: '1px solid #fde68a' }; // amber
  return { background: '#fee2e2', color: '#7f1d1d', border: '1px solid #fecaca' };                   // red
}
```

**Large ring (lg — for Step 2 AI review modal):**
Uses `ScoreRing` from Intelligence, `size={56}`, with label below:
```tsx
<div className="flex flex-col items-center gap-1">
  <ScoreRing score={score / 10} size={56} />
  <span className="text-[11px] font-semibold text-neutral-700">{score} / 99</span>
</div>
```

---

### 3.4 HookVariantCards

**File:** `src/features/editors-dashboard/components/finished-reels/HookVariantCards.tsx`

```typescript
interface HookVariantCardsProps {
  hooks: HookVariant[];
  selectedIndex: number;
  onSelect: (index: number) => void;
}

interface HookVariant {
  text: string;           // hook line
  hashtags: string[];     // recommended hashtags
  viralityEstimate?: number; // optional per-hook estimate
}
```

**Layout (3 selectable cards, stacked):**
```tsx
<div className="flex flex-col gap-2">
  {hooks.map((hook, i) => (
    <button
      key={i}
      onClick={() => onSelect(i)}
      className={cn(
        'w-full text-left rounded-xl px-4 py-3 transition-all',
        'border',
        selectedIndex === i
          ? 'border-[#ff0069]/40 bg-[#ff006908]'
          : 'border-[rgba(0,0,0,0.07)] hover:bg-black/[0.02]'
      )}
    >
      <div className="flex items-start justify-between gap-2">
        <span className="text-xs text-neutral-700 leading-relaxed">{hook.text}</span>
        {selectedIndex === i && (
          <span className="flex-shrink-0 w-4 h-4 rounded-full bg-[#ff0069] flex items-center justify-center">
            <Check size={9} className="text-white" />
          </span>
        )}
      </div>
      <p className="text-[10px] text-neutral-400 mt-1.5">
        {hook.hashtags.map(h => `#${h}`).join(' ')}
      </p>
    </button>
  ))}
</div>
```

---

### 3.5 VersionLabel

**File:** `src/features/editors-dashboard/components/finished-reels/VersionLabel.tsx`

```typescript
interface VersionLabelProps {
  version: number;           // 1, 2, 3...
  size?: 'sm' | 'md';
}
```

**Rendered as overlay badge (sm — thumbnail corner):**
```tsx
<span
  className="text-[9px] font-bold px-1.5 py-0.5 rounded"
  style={{ background: 'rgba(0,0,0,0.65)', color: '#fff' }}
>
  V{version}
</span>
```

**Rendered inline (md — list row or detail):**
```tsx
<span className="text-xs font-semibold text-neutral-500">V{version}</span>
```

---

### 3.6 UploadReelModal (3-step upload flow)

**File:** `src/features/editors-dashboard/components/finished-reels/UploadReelModal.tsx`

```typescript
interface UploadReelModalProps {
  open: boolean;
  onClose: () => void;
}

// Internal state machine
type UploadStep = 'categorize' | 'ai-review' | 'submit';

interface UploadDraft {
  file?: File;
  modelId?: string;
  niche?: string;
  category?: string;
  version: number;               // auto-derived or manual override
  editTimeSec?: number;
  // Populated after AI review:
  viralityScore?: number;
  onScreenText?: string;
  autoTitle?: string;
  autoDescription?: string;
  hookVariants?: HookVariant[];
  selectedHookIndex: number;
  notes?: string;
}
```

**Outer container:**
```tsx
<dialog open className="fixed inset-0 z-50 flex items-center justify-center"
  onClick={e => { if (e.target === e.currentTarget) onClose(); }}
>
  <div className="absolute inset-0 bg-black/30 backdrop-blur-sm" />
  <motion.div
    initial={{ opacity: 0, scale: 0.95 }}
    animate={{ opacity: 1, scale: 1 }}
    className="relative bg-white rounded-2xl shadow-2xl w-[580px] overflow-hidden"
  >
```

**Step progress indicator (3 dots, top of modal):**
```tsx
<div className="flex items-center gap-2 justify-center py-2">
  {(['categorize', 'ai-review', 'submit'] as UploadStep[]).map((s, i) => (
    <div
      key={s}
      className={cn(
        'h-1.5 rounded-full transition-all duration-300',
        step === s ? 'w-8 bg-[#ff0069]' : 'w-3 bg-neutral-200'
      )}
    />
  ))}
</div>
```

**Step 1 — FileDropzone:**
```tsx
<div
  onDragOver={...} onDrop={...}
  className="rounded-xl border-2 border-dashed border-neutral-200 flex flex-col items-center justify-center gap-3 py-12 cursor-pointer hover:border-[#ff0069]/50 hover:bg-[#ff006904] transition-all"
>
  <Upload size={24} className="text-neutral-300" />
  <div className="text-center">
    <p className="text-sm font-medium text-neutral-700">Drop reel here</p>
    <p className="text-xs text-neutral-400 mt-1">MP4 or MOV · max 500MB</p>
  </div>
  <button className="px-4 py-2 rounded-xl text-xs font-semibold text-white"
    style={{ background: 'linear-gradient(135deg, #ff0069, #833ab4)' }}>
    Browse files
  </button>
</div>
```

**EditTimeTracker (optional in Step 1):**
```tsx
<div className="flex items-center gap-3 px-4 py-3 rounded-xl"
     style={{ border: '1px solid rgba(0,0,0,0.07)', backgroundColor: '#fafafa' }}>
  <Timer size={14} className="text-neutral-400" />
  <span className="text-xs font-medium text-neutral-600">Edit time (optional)</span>
  <div className="flex-1" />
  <button onClick={toggleTimer}
    className="px-3 py-1 rounded-lg text-[11px] font-semibold text-white"
    style={{ background: timerRunning ? '#ef4444' : 'linear-gradient(135deg, #ff0069, #833ab4)' }}>
    {timerRunning ? `■ Stop (${formatTime(elapsed)})` : '▷ Start timer'}
  </button>
  <span className="text-xs text-neutral-400">or</span>
  <input type="text" placeholder="mm:ss" className="w-14 px-2 py-1 rounded-lg text-xs border border-neutral-200" />
</div>
```

---

### 3.7 EditTimesView

**File:** `src/features/editors-dashboard/components/finished-reels/EditTimesView.tsx`

```typescript
// No props — reads from useQuery(api.reels.editTimeStats)
```

**EditTimeSummaryCard:**
```tsx
<div className="rounded-xl p-4" style={{ border: '1px solid rgba(0,0,0,0.07)' }}>
  <p className="text-[11px] uppercase tracking-[0.35em] text-neutral-500 font-medium">Edit Time Summary</p>
  <div className="mt-3 grid grid-cols-2 gap-3">
    <div>
      <p className="text-2xl font-semibold text-neutral-900">{avgEditTime}</p>
      <p className="text-xs text-neutral-500 mt-0.5">Avg edit time</p>
    </div>
    <div>
      <p className="text-2xl font-semibold text-neutral-900">{totalHours}h</p>
      <p className="text-xs text-neutral-500 mt-0.5">Total this week</p>
    </div>
  </div>
  <div className="mt-3 flex items-center gap-4 text-xs text-neutral-500">
    <span>Fastest: <span className="font-semibold text-neutral-700">{fastest}</span></span>
    <span>Slowest: <span className="font-semibold text-neutral-700">{slowest}</span></span>
  </div>
</div>
```

**EditTimeTable (TanStack Table, simplified):**
```
Columns: Reel title (flex-1) | Model (120px) | Niche (110px) | Reel duration (90px) | Edit time (90px)
Header: bg-#fafafa, th: px-3 py-2.5 text-[11px] font-semibold text-neutral-400 uppercase
Row: h-11 border-bottom rgba(0,0,0,0.05) hover:bg-black/[0.02]
```

---

### 3.8 ReelListRow (List view)

**File:** `src/features/editors-dashboard/components/finished-reels/ReelListRow.tsx`

```tsx
<div className="flex items-start gap-4 px-4 py-3 hover:bg-black/[0.02] transition-colors cursor-pointer"
     style={{ borderBottom: '1px solid rgba(0,0,0,0.06)' }}>
  {/* Thumbnail */}
  <div className="w-20 h-[72px] rounded-lg overflow-hidden bg-neutral-100 flex-shrink-0 relative">
    {reel.thumbnailUrl
      ? <img src={reel.thumbnailUrl} className="w-full h-full object-cover" />
      : <Film size={20} className="text-neutral-300 absolute inset-0 m-auto" />}
    <span className="absolute top-1 left-1"><VersionLabel version={reel.version} size="sm" /></span>
  </div>

  {/* Meta */}
  <div className="flex flex-col flex-1 min-w-0 gap-1">
    <div className="flex items-center gap-2">
      <span className="text-sm font-semibold text-neutral-900 truncate">{reel.autoTitle || 'Untitled reel'}</span>
      <NicheBadge niche={reel.niche} />
    </div>
    <div className="flex items-center gap-3 text-xs text-neutral-500">
      <span>{reel.modelName}</span>
      <span>V{reel.version}</span>
      <span>{formatDuration(reel.durationSec)}</span>
      <span>{timeAgo(reel.uploadedAt)}</span>
    </div>
    {reel.caption && (
      <p className="text-xs text-neutral-400 truncate italic">"{reel.caption}"</p>
    )}
  </div>

  {/* Score + status */}
  <div className="flex flex-col items-end gap-2 flex-shrink-0">
    {reel.viralityScore !== undefined && (
      <ViralityScoreBadge score={reel.viralityScore} size="sm" />
    )}
    <ApprovalStatusBadge status={reel.ptpStatus} size="sm" />
  </div>
</div>
```

---

## 4. Interaction Spec

### 4.1 Upload flow (3-step modal)

```
Click "Upload Reel"
  → UploadReelModal opens (opacity/scale entrance)
  → Step 1: Drag file or browse
  → File dropped: video thumbnail preview appears, file name shown
  → Fill model/niche/category/version, optionally track edit time
  → Click "Next: AI Review"
  → Upload begins (progress bar)
  → Step 2: Gemini analysis runs (loading skeleton for score + text fields)
  → Results populate: viralityScore, onScreenText, autoTitle, description, 3 hook variants
  → Editor reviews/edits each field inline
  → Select preferred hook variant (clicking selects with pink highlight)
  → Click "Next: Submit to PTP"
  → Step 3: Summary review
  → Click "Submit to PTP ✓"
  → useMutation(api.reels.createFinished)(draft)
  → useMutation(api.ptpQueue.submit)({ reelId })
  → useMutation(api.googleDrive.sync)({ reelId })
  → Modal closes, new reel card appears at top of gallery with optimistic update
  → StatPill count increments
```

### 4.2 Click card in gallery → select / open video

```
Click FinishedReelCard
  → If clicking CTA button directly: trigger that button's action
  → If clicking thumbnail: opens VideoLightbox (fullscreen video player)
    → VideoLightbox from Intelligence [REUSE]
```

### 4.3 Submit to PTP

```
Click "Submit to PTP" on reel card (ptpStatus = 'pending')
  → useMutation(api.ptpQueue.submit)({ reelId })
  → Optimistic: ptpStatus → 'under_review'
  → Card CTA changes to "Under Review" neutral button
  → Toast: "Reel submitted to PTP review"
```

### 4.4 Tab transition

```
Click tab
  → AnimatePresence mode="wait" slide transition (6d pattern)
  → key=activeTab triggers enter/exit animations
```

### 4.5 Score sort

```
Change score sort → entries re-order by viralityScore client-side
  → AnimatePresence layout animation re-orders grid cards smoothly
```

---

## 5. Reuse Instructions

### 5.1 ScoreRing (Intelligence)
**Import:** `import { ScoreRing } from '@/features/intelligence/components/shared/ScoreRing'`
**Usage:** In Step 2 AI review modal — `<ScoreRing score={draft.viralityScore / 10} size={56} />`
Note: ScoreRing expects 0–10 scale; viralityScore is 0–99. Divide by 10.

### 5.2 VideoLightbox (Intelligence)
**Import:** `import { VideoLightbox } from '@/features/intelligence/components/shared/VideoLightbox'`
**Usage:** Clicking reel thumbnail opens fullscreen video player.
**Props:** `{ videoUrl: string, onClose: () => void }`

### 5.3 ApprovalStatusBadge (rd-table)
**Import:** `import { ApprovalStatusBadge } from '@/features/editors-dashboard/components/rd-table/ApprovalStatusBadge'`
**Usage:** Mapped ptpStatus → approval display. PTP status enum differs slightly:
```typescript
type PTPStatus = 'pending' | 'under_review' | 'approved' | 'rejected';
// Map to ApprovalStatusBadge variants: pending→proposed, under_review→in_production, approved→approved, rejected→rejected
```

### 5.4 StatusStrip (Intelligence)
**Import:** `import { StatusStrip } from '@/components/ui/status-strip'`
**Props:**
```typescript
<StatusStrip
  status={{ label: 'Auto-review active', active: true }}
  stats={[
    { icon: <Film size={10} />, value: reels.length, label: 'reels' },
    { icon: <Clock size={10} />, value: pendingPTPCount, label: 'pending PTP' },
    { icon: <TrendingUp size={10} />, value: avgScore, label: 'avg score' },
  ]}
  rightSlot={<>
    <Clock size={10} className="text-neutral-400" />
    <span className="text-[11px] text-neutral-500">Last upload: <span className="font-medium text-neutral-700">{timeAgo(lastUploadAt)}</span></span>
  </>}
/>
```

### 5.5 AiAnalysisPanel (Hub-Swipe)
**Import:** `import { AiAnalysisPanel } from '@/features/hub-swipe/components/AiAnalysisPanel'`
**Usage:** The Step 2 AI review panel is a custom layout (not AiAnalysisPanel directly), but
reference AiAnalysisPanel for the hook score bar, emotion chips, and suggestions display pattern.
Specifically reuse the emotion chip rendering and score breakdown breakdown visual.

---

## 6. Data Layer

### Convex queries needed
```typescript
// All in convex/reels.ts (add to CONVEX_SCHEMA_ADDITIONS.md first)

api.reels.listFinished        // list reels with ptpStatus + filters
api.reels.editTimeStats       // aggregate edit time data for EditTimesView
api.reels.createFinished      // create new reel record
api.ptpQueue.submit           // submit reel to PTP queue → sets ptpStatus='under_review'
api.googleDrive.sync          // trigger Drive sync
api.gemini.analyzeReel        // action: calls Gemini, returns viralityScore + text fields

// Key fields on 'reels' table (reference CONVEX_SCHEMA_ADDITIONS.md):
//   modelId, niche, category, version, durationSec, thumbnailUrl, videoUrl
//   viralityScore, onScreenText, autoTitle, autoDescription, hookVariants, selectedHookIndex
//   ptpStatus: 'pending' | 'under_review' | 'approved' | 'rejected'
//   editTimeSec, uploadedAt, submittedToPTPAt, caption, hashtags, notes
```

---

## 7. File Creation Checklist

```
src/
  app/isso/editor/finished/
    page.tsx                                    ← thin wrapper

  features/editors-dashboard/
    components/
      FinishedReelsFeaturePage.tsx              [NEW]
      finished-reels/
        FinishedReelCard.tsx                    [NEW]
        ReelListRow.tsx                         [NEW]
        EditTimesView.tsx                       [NEW]
        EditTimeSummaryCard.tsx                 [NEW]
        CapacityCard.tsx                        [NEW]
        EditTimeTable.tsx                       [NEW]
        ViralityScoreBadge.tsx                  [NEW]
        VersionLabel.tsx                        [NEW]
        HookVariantCards.tsx                    [NEW]
        UploadReelModal.tsx                     [NEW]
        FinishedReelsFilterBar.tsx              [NEW]
        ReelCardCTA.tsx                         [NEW]
    types.ts                                    [MODIFY — add FinishedReel, PTPStatus, HookVariant]

  convex/
    reels.ts                                    [NEW — queries + mutations for finished reels]
```

**Build verification:**
```bash
cd /Users/shaansisodia/SISO_Workspace/SISO_Agency/apps/isso-dashboard
npm run build
```
