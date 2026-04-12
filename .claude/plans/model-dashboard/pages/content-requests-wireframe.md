# Content Requests — Wireframe + Component Spec
# Route: /model/requests
# Features: M19–M25
# Last updated: 2026-04-12

---

## 0. Context Summary

This is the MODEL's mobile-first inbox. Models receive content briefs from marketing, watch
reference clips, record content on-device, and upload back to Google Drive — all in one flow.
The page lives inside the model dashboard, uses the ISSO light-theme white card shell, and is
the primary daily-action screen for model-side users.

OFM accent: `linear-gradient(135deg, #ff0069, #833ab4)` throughout.

---

## 1. ASCII WIREFRAME — MOBILE FIRST (375px)

### View A: INBOX (list state)

```
┌─────────────────────────────────────────┐ 375px
│ ░░░░░░░░░░ IssoSidebarShell ░░░░░░░░░░ │ collapsed (56px icon rail)
│                                         │
│  ┌───────────────────────────────────┐  │
│  │ ContentPageShell                  │  │
│  │                                   │  │
│  │ ┌─ ROW 1 — Header ──────────────┐ │  │ h-14 px-3
│  │ │ [📋] Content Requests         │ │  │
│  │ │      ┌──────────────────────┐ │ │  │
│  │ │      │ 📍 240 pts           │ │ │  │ PointsStatPill
│  │ │      │ ████████░░ 3 of 7   │ │ │  │ ProgressTracker
│  │ │      └──────────────────────┘ │ │  │
│  │ │                               │ │  │ [FIXED] [+ New] button REMOVED — models do not create requests
│  │ │                               │ │  │ Header is read-only inbox view only
│  │ └───────────────────────────────┘ │  │
│  │                                   │  │
│  │ ┌─ ROW 2 — Sub-nav ─────────────┐ │  │ px-3 py-2
│  │ │ [All ▾] [Pending 4] [Done 3]  │ │  │ tab pills
│  │ │                  [↕ Deadline] │ │  │ SortPill
│  │ └───────────────────────────────┘ │  │
│  │                                   │  │
│  │ ┌─ ROW 3 — Content ─────────────┐ │  │ flex-1 overflow-y-auto
│  │ │                               │ │  │
│  │ │ ┌─ StatusStrip ─────────────┐ │ │  │
│  │ │ │ ● Active  4 pending  1 overdue │ │
│  │ │ └───────────────────────────┘ │ │  │
│  │ │                               │ │  │
│  │ │ ┌─ RequestCard ─────────────┐ │ │  │ nestedCard white
│  │ │ │ ┌──────┐  Summer Vlog    │ │ │  │
│  │ │ │ │ [16:9│  Marketing      │ │ │  │
│  │ │ │ │thumb]│  ⏰ 2d 4h left  │ │ │  │
│  │ │ │ └──────┘  🔥 2× bonus   │ │ │  │ EarlyMultiplier badge
│  │ │ │           [View Brief →] │ │ │  │
│  │ │ └───────────────────────────┘ │ │  │
│  │ │                               │ │  │
│  │ │ ┌─ RequestCard ─────────────┐ │ │  │
│  │ │ │ ┌──────┐  Dance Trend    │ │ │  │
│  │ │ │ │ [16:9│  Content Team   │ │ │  │
│  │ │ │ │thumb]│  ⏰ 5h left     │ │ │  │ RED — urgent
│  │ │ │ └──────┘  ⚠ Due soon    │ │ │  │
│  │ │ │           [View Brief →] │ │ │  │
│  │ │ └───────────────────────────┘ │ │  │
│  │ │                               │ │  │
│  │ │ ┌─ RequestCard (DONE) ──────┐ │ │  │ muted / completed
│  │ │ │ ┌──────┐  Gym Routine   ✓│ │ │  │
│  │ │ │ │ [grey│  +50 pts earned │ │ │  │
│  │ │ │ │thumb]│  Submitted 2d ago│ │ │  │
│  │ │ │ └──────┘                  │ │ │  │
│  │ │ └───────────────────────────┘ │ │  │
│  │ │                               │ │  │
│  │ └───────────────────────────────┘ │  │
│  └───────────────────────────────────┘  │
└─────────────────────────────────────────┘
```

---

### View B: BRIEF DETAIL (after tapping a card)

```
┌─────────────────────────────────────────┐ 375px
│  ┌───────────────────────────────────┐  │
│  │ ContentPageShell                  │  │
│  │                                   │  │
│  │ ┌─ ROW 1 — Header ──────────────┐ │  │
│  │ │ ← [Back]  "Summer Vlog"       │ │  │
│  │ │            ⏰ 2d 4h  🔥 2× pts│ │  │
│  │ └───────────────────────────────┘ │  │
│  │                                   │  │
│  │ ┌─ ROW 3 — Scrollable ──────────┐ │  │
│  │ │                               │ │  │
│  │ │ ┌─ Reference Video ─────────┐ │ │  │
│  │ │ │ ┌───────────────────────┐ │ │ │  │
│  │ │ │ │                       │ │ │ │  │
│  │ │ │ │   [▶ 16:9 video card] │ │ │ │  │
│  │ │ │ │   Tap to watch        │ │ │ │  │
│  │ │ │ └───────────────────────┘ │ │ │  │ VideoLightbox trigger
│  │ │ │ "Watch this before recording"│ │  │
│  │ │ └───────────────────────────┘ │ │  │
│  │ │                               │ │  │
│  │ │ ┌─ Instructions ────────────┐ │ │  │
│  │ │ │ 📝 What to do:            │ │ │  │
│  │ │ │  • Shoot in natural light │ │ │  │
│  │ │ │  • Include product CTA    │ │ │  │
│  │ │ │  • 30–60 seconds          │ │ │  │
│  │ │ └───────────────────────────┘ │ │  │
│  │ │                               │ │  │
│  │ │ ┌─ Tips ────────────────────┐ │ │  │
│  │ │ │ 💡 Tips from your editor: │ │ │  │
│  │ │ │  "Keep energy high in     │ │ │  │
│  │ │ │   the first 3 seconds."   │ │ │  │
│  │ │ └───────────────────────────┘ │ │  │
│  │ │                               │ │  │
│  │ │ ┌─ Points Preview ──────────┐ │ │  │
│  │ │ │ 50 pts base               │ │ │  │
│  │ │ │ 🔥 +50 early bonus (2× if │ │ │  │
│  │ │ │    submitted in 4h)        │ │ │  │
│  │ │ └───────────────────────────┘ │ │  │
│  │ │                               │ │  │
│  │ │ ┌─── STICKY BOTTOM CTA ─────┐ │ │  │
│  │ │ │  ╔═══════════════════════╗ │ │ │  │
│  │ │ │  ║  📹  Record Now        ║ │ │ │  │ OneTapRecorder button
│  │ │ │  ╚═══════════════════════╝ │ │ │  │ full-width, accentGradient
│  │ │ │     or  [📁 Upload File]   │ │ │  │ secondary ghost button
│  │ │ └───────────────────────────┘ │ │  │
│  │ └───────────────────────────────┘ │  │
│  └───────────────────────────────────┘  │
└─────────────────────────────────────────┘
```

---

### View C: UPLOAD CONFIRMATION (post-record/upload)

```
┌─────────────────────────────────────────┐ 375px
│  ┌───────────────────────────────────┐  │
│  │                                   │  │
│  │         UPLOAD STATE              │  │
│  │                                   │  │
│  │   ┌───────────────────────────┐   │  │
│  │   │  [spinner / progress bar] │   │  │
│  │   │  Uploading to Drive...    │   │  │
│  │   │  ████████░░░░  67%        │   │  │
│  │   └───────────────────────────┘   │  │
│  │                                   │  │
│  │   ────── SUCCESS STATE ──────     │  │
│  │                                   │  │
│  │         ╔═══════════╗             │  │
│  │         ║    ✓      ║             │  │ animated checkmark
│  │         ╚═══════════╝             │  │
│  │                                   │  │
│  │     "Summer Vlog submitted!"      │  │
│  │                                   │  │
│  │   ┌─ PointsEarnedBurst ────────┐  │  │
│  │   │   ⭐ +100 pts earned!      │  │  │ confetti / scale burst
│  │   │   (early bonus applied)    │  │  │
│  │   └───────────────────────────┘  │  │
│  │                                   │  │
│  │   ┌─ Progress Update ─────────┐  │  │
│  │   │  ████████████░░  4 of 7   │  │  │ animated fill
│  │   └───────────────────────────┘  │  │
│  │                                   │  │
│  │   [View All Requests]             │  │
│  │                                   │  │
│  └───────────────────────────────────┘  │
└─────────────────────────────────────────┘
```

---

## 2. COMPONENT TREE

```
ContentRequestsFeaturePage                   ← default export
│
├── ContentPageShell                         ← @/isso/layout/ContentPageShell
│   ├── [header slot]
│   │   ├── ProductIcon (size=32)
│   │   ├── "Content Requests" (text-sm font-semibold)
│   │   ├── PointsStatPill                   ← NEW
│   │   ├── ProgressTracker                  ← NEW
│   │   └── NewRequestButton (accentGradient) + ChevronDown
│   │
│   ├── [sub-nav slot]
│   │   ├── StatusFilterTabs                 ← adapted FilterChip pattern
│   │   └── SortPill (from @/features/intelligence/)  ← REUSE
│   │
│   └── [content slot]
│       ├── StatusStrip                      ← @/components/ui/status-strip REUSE
│       │
│       └── AnimatePresence (mode="wait")    ← tab view switcher
│           ├── RequestInboxView             ← NEW (renders when tab = "all"|"pending")
│           │   └── motion.div (staggerChildren)
│           │       └── RequestCard[]        ← NEW
│           │           ├── ThumbnailSlot
│           │           ├── BriefMeta
│           │           │   ├── title (text-sm font-semibold)
│           │           │   ├── sender (text-xs text-neutral-500)
│           │           │   └── DeadlineCountdown  ← NEW
│           │           ├── EarlyMultiplierBadge   ← NEW
│           │           └── "View Brief →" button
│           │
│           └── DoneView                     ← NEW (renders when tab = "done")
│               └── CompletedRequestCard[]   ← NEW (muted variant)
│                   └── PointsEarnedTag
│
├── BriefDetailDrawer (sheet/modal)          ← NEW (full-screen mobile sheet)
│   ├── BackButton + BriefTitle
│   ├── DeadlineCountdown (inline)
│   ├── EarlyMultiplierBadge (inline)
│   ├── ReferenceVideoCard                   ← ADAPT VideoLightbox trigger
│   ├── InstructionsList                     ← NEW (ul render)
│   ├── TipsCard                             ← NEW
│   ├── PointsPreviewCard                    ← NEW
│   └── StickyRecordBar                      ← NEW
│       ├── OneTapRecordButton               ← NEW (camera API trigger)
│       └── UploadFileButton                 ← NEW (file picker fallback)
│
└── UploadConfirmationOverlay                ← NEW (modal overlay)
    ├── UploadProgressBar                    ← NEW
    ├── SuccessCheckmark (Framer Motion)     ← NEW
    ├── PointsEarnedBurst                    ← NEW (confetti + scale)
    └── ProgressTracker (updated count)      ← NEW (shared instance)
```

---

## 3. PER-COMPONENT SPECS

---

### 3.1 ContentRequestsFeaturePage

**File:** `src/features/content-requests/components/ContentRequestsFeaturePage.tsx`

```tsx
// TypeScript props — this is the page root, no external props
// Internal state:
type View = 'inbox' | 'detail' | 'uploading' | 'success';

interface ContentRequestsPageState {
  activeTab: 'all' | 'pending' | 'done';
  sortBy: 'deadline' | 'points' | 'newest';
  selectedRequestId: Id<'contentRequests'> | null;
  view: View;
}
```

**Tailwind / layout:**
```tsx
// Thin wrapper — standard ISSO pattern
// src/app/model/requests/page.tsx
import { ContentRequestsFeaturePage } from '@/features/content-requests/components';
export default function ContentRequestsPage() {
  return <ContentRequestsFeaturePage />;
}
```

**Convex query:**
```ts
// convex/contentRequests.ts
export const listForModel = query({
  args: { modelId: v.id('models') },
  handler: async (ctx, { modelId }) => {
    return await ctx.db
      .query('contentRequests')
      .withIndex('by_model', q => q.eq('modelId', modelId))
      .filter(q => q.eq(q.field('deletedAt'), undefined))  // [FIXED] was neq — neq would return ONLY deleted records; eq(undefined) correctly excludes soft-deleted
      .order('asc')
      .collect();
  },
});
```

---

### 3.2 PointsStatPill

**File:** `src/features/content-requests/components/PointsStatPill.tsx`

```tsx
interface PointsStatPillProps {
  totalPoints: number;        // e.g. 240
  currency?: string;          // default "pts"
}
```

**Tailwind classes:**
```tsx
<div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg"
  style={{ border: '1px solid rgba(255,0,105,0.2)', background: 'rgba(255,0,105,0.06)' }}
>
  <Star size={11} style={{ color: '#ff0069' }} />
  <span className="text-[11px] font-semibold" style={{ color: '#ff0069' }}>
    {totalPoints} pts
  </span>
</div>
```

**Design tokens:** OFM pink `#ff0069`, soft pink bg `rgba(255,0,105,0.06)`.

---

### 3.3 ProgressTracker

**File:** `src/features/content-requests/components/ProgressTracker.tsx`

```tsx
interface ProgressTrackerProps {
  completed: number;          // e.g. 3
  total: number;              // e.g. 7
  accentGradient?: string;    // default OFM gradient
  animated?: boolean;         // default true — animates fill on mount
}
```

**Tailwind classes:**
```tsx
<div className="flex items-center gap-2">
  <div className="flex-1 h-1.5 rounded-full bg-neutral-100 overflow-hidden" style={{ minWidth: 64 }}>
    <motion.div
      className="h-full rounded-full"
      style={{ background: 'linear-gradient(135deg, #ff0069, #833ab4)' }}
      initial={{ width: 0 }}
      animate={{ width: `${(completed / total) * 100}%` }}
      transition={{ duration: 0.7, ease: [0.25, 0.1, 0.25, 1] }}
    />
  </div>
  <span className="text-[11px] font-medium text-neutral-500 whitespace-nowrap">
    {completed} of {total} done
  </span>
</div>
```

**Interaction:** When `completed` increments (after upload success), Framer Motion animates the
fill to the new width. Pair with `useEffect` watching the `completed` value.

---

### 3.4 RequestCard

**File:** `src/features/content-requests/components/RequestCard.tsx`

```tsx
interface RequestCardProps {
  request: ContentRequest;       // Convex doc
  onTap: (id: Id<'contentRequests'>) => void;
  variant?: 'pending' | 'urgent' | 'done';
}

interface ContentRequest {
  _id: Id<'contentRequests'>;
  title: string;
  senderLabel: string;            // e.g. "Marketing", "Content Team"
  thumbnailUrl?: string;
  deadlineAt: number;             // Unix ms
  basePoints: number;             // e.g. 50
  earlyBonusMultiplier?: number;  // e.g. 2 — only if deadline within earlyWindow
  earlyWindowHours?: number;      // e.g. 4
  status: 'pending' | 'in_progress' | 'submitted' | 'approved';
  submittedAt?: number;
  pointsEarned?: number;
}
```

**Tailwind classes:**
```tsx
// pending / urgent variant
<motion.div
  className="rounded-xl bg-white p-3 flex gap-3 items-start cursor-pointer active:scale-[0.98]"
  style={{ border: '1px solid rgba(0,0,0,0.07)', boxShadow: '0 1px 4px rgba(0,0,0,0.04)' }}
  whileHover={{ scale: 1.01, y: -1 }}
  transition={{ type: 'spring', stiffness: 400, damping: 25 }}
  onClick={() => onTap(request._id)}
>
  {/* Thumbnail */}
  <div className="w-16 h-12 rounded-lg overflow-hidden flex-shrink-0 bg-neutral-100">
    {thumbnailUrl
      ? <img src={thumbnailUrl} className="w-full h-full object-cover" />
      : <div className="w-full h-full flex items-center justify-center">
          <Video size={18} className="text-neutral-300" />
        </div>
    }
  </div>

  {/* Meta */}
  <div className="flex-1 min-w-0">
    <p className="text-sm font-semibold text-neutral-900 truncate">{title}</p>
    <p className="text-xs text-neutral-500 mt-0.5">{senderLabel}</p>
    <DeadlineCountdown deadlineAt={deadlineAt} className="mt-1" />
    {earlyBonusMultiplier && <EarlyMultiplierBadge multiplier={earlyBonusMultiplier} />}
  </div>

  <ArrowRight size={14} className="text-neutral-300 mt-1 flex-shrink-0" />
</motion.div>

// done variant — muted
<div className="rounded-xl bg-neutral-50 p-3 flex gap-3 items-start opacity-70"
  style={{ border: '1px solid rgba(0,0,0,0.05)' }}
>
  {/* greyscale thumbnail + checkmark overlay */}
  ...
  <p className="text-xs text-neutral-400">+{pointsEarned} pts earned</p>
</div>
```

**Urgency coloring:** When `hoursLeft < 6`, `DeadlineCountdown` renders in `text-red-500` and
card gets a left border: `border-l-2 border-red-400`.

---

### 3.5 DeadlineCountdown

**File:** `src/features/content-requests/components/DeadlineCountdown.tsx`

```tsx
interface DeadlineCountdownProps {
  deadlineAt: number;   // Unix ms
  className?: string;
}
```

**Logic:**
```ts
// Derives display string from now to deadlineAt
// > 24h   → "2d 4h left"      text-neutral-500
// 6–24h   → "14h left"        text-amber-500
// < 6h    → "4h 23m left"     text-red-500  + pulse dot
// overdue → "Overdue"         text-red-600 font-semibold
```

**Tailwind:**
```tsx
<span className={cn('inline-flex items-center gap-1 text-xs', colorClass)}>
  {isUrgent && <span className="w-1.5 h-1.5 rounded-full bg-current animate-pulse" />}
  <Clock size={10} />
  {displayString}
</span>
```

**Refresh interval:** Use `useInterval` hook (or `clearInterval` in `useEffect` cleanup return) — NOT raw `setInterval`. [FIXED] Raw setInterval leaks if component unmounts mid-interval.
```ts
// Correct pattern:
useEffect(() => {
  const id = setInterval(updateDisplay, 1000 * 60);
  return () => clearInterval(id); // cleanup on unmount
}, [deadlineAt]);
```

---

### 3.6 EarlyMultiplierBadge

**File:** `src/features/content-requests/components/EarlyMultiplierBadge.tsx`

```tsx
interface EarlyMultiplierBadgeProps {
  multiplier: number;          // e.g. 2
  windowHours: number;         // e.g. 4
  deadlineAt: number;
}
```

**Tailwind:**
```tsx
// Only renders if current time is within earlyWindow
<motion.span
  initial={{ scale: 0.8, opacity: 0 }}
  animate={{ scale: 1, opacity: 1 }}
  className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[11px] font-semibold mt-1"
  style={{ background: 'rgba(255,107,0,0.10)', color: '#ff6b00', border: '1px solid rgba(255,107,0,0.25)' }}
>
  <Flame size={10} />
  {multiplier}× bonus — submit in {windowHours}h
</motion.span>
```

**Design tokens:** Warm orange `#ff6b00` (distinct from OFM pink — this is an incentive signal).

---

### 3.7 BriefDetailDrawer

**File:** `src/features/content-requests/components/BriefDetailDrawer.tsx`

```tsx
interface BriefDetailDrawerProps {
  requestId: Id<'contentRequests'> | null;
  onClose: () => void;
  onRecordStart: (requestId: Id<'contentRequests'>) => void;
  onUploadFile: (requestId: Id<'contentRequests'>, file: File) => void;
}
```

**Convex query (inside drawer):**
```ts
const brief = useQuery(api.contentRequests.getById, { requestId });
// convex/contentRequests.ts
export const getById = query({
  args: { requestId: v.id('contentRequests') },
  handler: async (ctx, { requestId }) => ctx.db.get(requestId),
});
```

**Motion / sheet pattern:**
```tsx
// Full-screen mobile sheet — slides up from bottom
<AnimatePresence>
  {requestId && (
    <>
      {/* Backdrop */}
      <motion.div
        className="fixed inset-0 bg-black/40 z-40"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
      />
      {/* Sheet */}
      <motion.div
        className="fixed inset-x-0 bottom-0 z-50 bg-white rounded-t-2xl overflow-hidden"
        style={{ maxHeight: '92vh' }}
        initial={{ y: '100%' }}
        animate={{ y: 0 }}
        exit={{ y: '100%' }}
        transition={{ type: 'spring', stiffness: 400, damping: 35 }}
      >
        {/* drag handle */}
        <div className="flex justify-center pt-3 pb-1">
          <div className="w-9 h-1 rounded-full bg-neutral-200" />
        </div>
        {/* scrollable content */}
        <div className="overflow-y-auto pb-24" style={{ maxHeight: 'calc(92vh - 20px)' }}>
          {/* ... brief content sections ... */}
        </div>
        {/* sticky bottom bar */}
        <StickyRecordBar ... />
      </motion.div>
    </>
  )}
</AnimatePresence>
```

**Tailwind layout (sheet interior):**
```
px-5 pt-4 pb-6 flex flex-col gap-5
```

---

### 3.8 ReferenceVideoCard

**File:** `src/features/content-requests/components/ReferenceVideoCard.tsx`

```tsx
interface ReferenceVideoCardProps {
  videoUrl: string;
  thumbnailUrl?: string;
  caption?: string;        // e.g. "Watch this before recording"
}
```

**Reuses:** `VideoLightbox` from `@/features/intelligence/` — wraps it in a tap target.

```tsx
<div>
  <p className="text-[11px] uppercase tracking-[0.35em] text-neutral-400 mb-2">
    Reference Video
  </p>
  <div
    className="relative rounded-xl overflow-hidden bg-neutral-900 aspect-video cursor-pointer"
    onClick={() => setLightboxOpen(true)}
  >
    {thumbnailUrl && (
      <img src={thumbnailUrl} className="w-full h-full object-cover opacity-70" />
    )}
    <div className="absolute inset-0 flex items-center justify-center">
      <div className="w-12 h-12 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center">
        <Play size={20} className="text-white ml-0.5" fill="white" />
      </div>
    </div>
  </div>
  {caption && (
    <p className="text-xs text-neutral-500 mt-2">{caption}</p>
  )}
  <VideoLightbox
    open={lightboxOpen}
    videoUrl={videoUrl}
    onClose={() => setLightboxOpen(false)}
  />
</div>
```

**Import path:** `import { VideoLightbox } from '@/features/intelligence/components/VideoLightbox';`

---

### 3.9 InstructionsList

**File:** inline inside `BriefDetailDrawer` — not extracted unless reused.

```tsx
interface InstructionsListProps {
  instructions: string[];   // array of bullet strings
}
```

**Tailwind:**
```tsx
<div className="rounded-xl bg-neutral-50 p-4" style={{ border: '1px solid rgba(0,0,0,0.06)' }}>
  <div className="flex items-center gap-2 mb-3">
    <FileText size={13} className="text-neutral-400" />
    <p className="text-[11px] uppercase tracking-[0.35em] text-neutral-400">What to do</p>
  </div>
  <ul className="space-y-2">
    {instructions.map((item, i) => (
      <li key={i} className="flex items-start gap-2">
        <span className="w-1.5 h-1.5 rounded-full bg-pink-400 mt-1.5 flex-shrink-0" />
        <span className="text-sm text-neutral-700">{item}</span>
      </li>
    ))}
  </ul>
</div>
```

---

### 3.10 TipsCard

**File:** inline inside `BriefDetailDrawer`.

```tsx
interface TipsCardProps {
  editorName?: string;
  tips: string;             // freeform text from editor
}
```

**Tailwind:**
```tsx
<div className="rounded-xl p-4"
  style={{ background: 'rgba(255,0,105,0.04)', border: '1px solid rgba(255,0,105,0.12)' }}
>
  <div className="flex items-center gap-2 mb-2">
    <Lightbulb size={13} style={{ color: '#ff0069' }} />
    <p className="text-[11px] font-semibold" style={{ color: '#ff0069' }}>
      Tip{editorName ? ` from ${editorName}` : ''}
    </p>
  </div>
  <p className="text-sm text-neutral-700 leading-relaxed">"{tips}"</p>
</div>
```

---

### 3.11 PointsPreviewCard

**File:** `src/features/content-requests/components/PointsPreviewCard.tsx`

```tsx
interface PointsPreviewCardProps {
  basePoints: number;
  earlyBonusMultiplier?: number;
  earlyWindowHours?: number;
  deadlineAt: number;
}
```

**Logic:** Derives whether early bonus is still achievable based on current time.

**Tailwind:**
```tsx
<div className="rounded-xl bg-neutral-50 p-4" style={{ border: '1px solid rgba(0,0,0,0.06)' }}>
  <div className="flex items-center justify-between">
    <div className="flex items-center gap-2">
      <Star size={13} style={{ color: '#ff0069' }} />
      <span className="text-sm font-semibold text-neutral-900">{basePoints} pts</span>
      <span className="text-xs text-neutral-400">base reward</span>
    </div>
    {earlyBonusActive && (
      <EarlyMultiplierBadge
        multiplier={earlyBonusMultiplier!}
        windowHours={earlyWindowHours!}
        deadlineAt={deadlineAt}
      />
    )}
  </div>
  {earlyBonusActive && (
    <p className="text-xs text-neutral-500 mt-2">
      Submit in the next {earlyWindowHours}h to earn{' '}
      <span className="font-semibold text-neutral-700">
        {basePoints * earlyBonusMultiplier!} pts total
      </span>
    </p>
  )}
</div>
```

---

### 3.12 StickyRecordBar

**File:** `src/features/content-requests/components/StickyRecordBar.tsx`

```tsx
interface StickyRecordBarProps {
  requestId: Id<'contentRequests'>;
  onRecord: () => void;
  onUpload: (file: File) => void;
  isUploading?: boolean;
}
```

**Tailwind:**
```tsx
<div
  className="absolute bottom-0 inset-x-0 px-5 py-4 bg-white"
  style={{ borderTop: '1px solid rgba(0,0,0,0.07)', boxShadow: '0 -4px 16px rgba(0,0,0,0.06)' }}
>
  {/* Primary — record */}
  <button
    onClick={onRecord}
    className="w-full flex items-center justify-center gap-2 py-3.5 rounded-xl text-sm font-semibold text-white active:scale-[0.98] transition-all"
    style={{ background: 'linear-gradient(135deg, #ff0069, #833ab4)' }}
  >
    <Video size={16} />
    Record Now
  </button>

  {/* Secondary — upload */}
  <label className="mt-2 w-full flex items-center justify-center gap-2 py-2.5 rounded-xl text-sm font-medium text-neutral-500 cursor-pointer hover:bg-black/[0.04] transition-colors">
    <Upload size={14} />
    Upload File
    <input type="file" accept="video/*" className="sr-only" onChange={e => {
      const f = e.target.files?.[0];
      if (f) onUpload(f);
    }} />
  </label>
</div>
```

---

### 3.13 OneTapRecordButton (camera trigger logic)

**Not a standalone component** — the `onRecord` callback in `StickyRecordBar` calls:

```ts
// hooks/useOneTapRecord.ts
// [FIXED] iOS Safari priority order swapped — input capture is PRIMARY on mobile, getUserMedia is FALLBACK
export function useOneTapRecord(requestId: Id<'contentRequests'>) {
  const startRecording = useCallback(async () => {
    const isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent);
    if (isIOS) {
      // PRIMARY path on iOS Safari: <input type="file" capture="environment">
      // Programmatically click the hidden input (see StickyRecordBar hidden input ref)
      hiddenInputRef.current?.click();
      return;
    }
    // FALLBACK for desktop Chrome / non-iOS:
    const stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
    // Pass stream to upload handler
  }, [requestId]);

  return { startRecording };
}
```

> **[FIXED]** iOS Safari: `<input type="file" capture="environment">` is the PRIMARY path (not fallback). `getUserMedia` is the fallback for desktop Chrome. Original spec had this backwards.

---

### 3.14 UploadConfirmationOverlay

**File:** `src/features/content-requests/components/UploadConfirmationOverlay.tsx`

```tsx
interface UploadConfirmationOverlayProps {
  state: 'uploading' | 'success' | 'error';
  progress: number;              // 0–100
  requestTitle: string;
  pointsEarned?: number;
  earlyBonusApplied?: boolean;
  completed: number;
  total: number;
  onDone: () => void;
}
```

**Tailwind / animation:**
```tsx
// uploading state
<div className="fixed inset-0 z-50 bg-white flex flex-col items-center justify-center p-8 gap-6">
  <div className="w-full rounded-full h-2 bg-neutral-100 overflow-hidden">
    <motion.div
      className="h-full rounded-full"
      style={{ background: 'linear-gradient(135deg, #ff0069, #833ab4)' }}
      animate={{ width: `${progress}%` }}
    />
  </div>
  <p className="text-sm text-neutral-500">Uploading to Drive... {progress}%</p>
</div>

// error state — [FIXED] was missing from spec; must be implemented
// state === 'error': show red X, error message, retry button
<div className="fixed inset-0 z-50 bg-white flex flex-col items-center justify-center p-8 gap-6">
  <motion.div
    className="w-20 h-20 rounded-full flex items-center justify-center bg-red-100"
    initial={{ scale: 0 }}
    animate={{ scale: 1 }}
    transition={{ type: 'spring', stiffness: 300, damping: 20 }}
  >
    <X size={32} className="text-red-500" />
  </motion.div>
  <p className="text-lg font-semibold text-neutral-900">Upload failed</p>
  <p className="text-sm text-neutral-500">Something went wrong. Please try again.</p>
  <button
    onClick={onRetry}  // re-invokes useUploadToGoogleDrive
    className="px-6 py-2.5 rounded-xl text-sm font-semibold text-white"
    style={{ background: 'linear-gradient(135deg, #ff0069, #833ab4)' }}
  >
    Retry
  </button>
</div>

// success state — triggered when progress hits 100
<motion.div
  className="fixed inset-0 z-50 bg-white flex flex-col items-center justify-center p-8 gap-6"
  initial={{ opacity: 0 }}
  animate={{ opacity: 1 }}
>
  {/* Checkmark burst */}
  <motion.div
    className="w-20 h-20 rounded-full flex items-center justify-center"
    style={{ background: 'linear-gradient(135deg, #ff0069, #833ab4)' }}
    initial={{ scale: 0 }}
    animate={{ scale: 1 }}
    transition={{ type: 'spring', stiffness: 300, damping: 20, delay: 0.1 }}
  >
    <Check size={32} className="text-white" />
  </motion.div>

  <p className="text-lg font-semibold text-neutral-900">{requestTitle} submitted!</p>

  {/* PointsEarnedBurst */}
  <PointsEarnedBurst points={pointsEarned} earlyBonus={earlyBonusApplied} />

  {/* Updated progress */}
  <ProgressTracker completed={completed} total={total} animated />

  <button
    onClick={onDone}
    className="mt-4 px-6 py-2.5 rounded-xl text-sm font-medium text-neutral-500 hover:bg-black/[0.04]"
  >
    View All Requests
  </button>
</motion.div>
```

---

### 3.15 PointsEarnedBurst

**File:** `src/features/content-requests/components/PointsEarnedBurst.tsx`

```tsx
interface PointsEarnedBurstProps {
  points: number;
  earlyBonus?: boolean;
}
```

**Animation:**
```tsx
<motion.div
  initial={{ scale: 0.5, opacity: 0, y: 10 }}
  animate={{ scale: 1, opacity: 1, y: 0 }}
  transition={{ type: 'spring', stiffness: 400, damping: 20, delay: 0.3 }}
  className="flex flex-col items-center gap-1"
>
  <div
    className="flex items-center gap-2 px-5 py-3 rounded-2xl"
    style={{ background: 'rgba(255,0,105,0.08)', border: '1px solid rgba(255,0,105,0.20)' }}
  >
    <Star size={18} style={{ color: '#ff0069' }} fill="#ff0069" />
    <span className="text-2xl font-bold" style={{ color: '#ff0069' }}>+{points} pts</span>
  </div>
  {earlyBonus && (
    <p className="text-xs text-neutral-500">Early bonus applied!</p>
  )}
</motion.div>
```

**Particle confetti:** Use `canvas-confetti` package — fire burst on `earlyBonus === true`.
```ts
import confetti from 'canvas-confetti';
// In useEffect on mount:
confetti({ particleCount: 80, spread: 60, colors: ['#ff0069', '#833ab4', '#ff6b00'] });
```

---

## 4. INTERACTION SPEC

### 4.1 Tap Request Card → Detail View
```
User taps RequestCard
  → setSelectedRequestId(id)
  → BriefDetailDrawer animates up (spring, y: 100% → 0)
  → Convex query getById fires
  → Content renders with stagger animation (containerVariants)
  → Tab bar in ContentPageShell hides (isDetailOpen flag)
```

### 4.2 Tap Record Now → Camera Opens
```
User taps "Record Now" in StickyRecordBar
  → On iOS/Android: hidden <input capture="environment"> programmatically clicked
  → Native camera app opens
  → User records video, confirms
  → File returned to input's onChange handler
  → Triggers upload flow immediately (no extra confirm step)
  → BriefDetailDrawer transitions to UploadConfirmationOverlay
```

### 4.3 File Upload → Auto Google Drive
```
File received (from camera or file picker)
  → Convex action uploadToGoogleDrive fires:
      1. Generate signed upload URL via Google Drive API
      2. Upload file to Drive
      3. Store Drive fileId + driveUrl in contentRequests doc
      4. Update status → 'submitted'
      5. Credit points to model's account
  → Upload progress streamed via Convex action return value
  → UploadConfirmationOverlay progress bar updates every 500ms
  → On complete: success state triggers
```

**Convex action:**
```ts
// convex/contentRequests.ts
export const uploadToGoogleDrive = action({
  args: {
    requestId: v.id('contentRequests'),
    fileBlob: v.bytes(),
    fileName: v.string(),
    mimeType: v.string(),
  },
  handler: async (ctx, args) => {
    // 1. Upload to Drive using Drive API v3
    // 2. Return { driveFileId, driveUrl }
    // 3. Mutation: mark submitted, credit points
  },
});
```

### 4.4 Deadline Reminder
```
Client-side: DeadlineCountdown polls every 60s
  → When hoursLeft drops below 6: card urgency upgrades (amber → red)
  → When hoursLeft drops below 1: browser notification fires
       (if Notification permission granted on session start)
Server-side: Convex scheduled function checks deadlines hourly
  → Sends push notification via FCM / web push
```

**Notification permission request:**
```ts
// hooks/useDeadlineReminders.ts
// Request on first BriefDetailDrawer open, not on page load
if (Notification.permission === 'default') {
  Notification.requestPermission();
}
```

### 4.5 Points Earned Animation
```
Upload completes → Convex returns { pointsEarned, earlyBonusApplied }
  → UploadConfirmationOverlay success state renders
  → 300ms delay → PointsEarnedBurst spring-animates in
  → If earlyBonusApplied: canvas-confetti fires
  → ProgressTracker animates fill to new completed/total ratio
  → Header PointsStatPill number increments with count-up animation
     (use framer-motion useMotionValue + useTransform)
```

### 4.6 Back Navigation / Sheet Dismiss
```
User drags sheet down (velocity > 500px/s) OR taps backdrop
  → BriefDetailDrawer animates out (spring, y → 100%)
  → setSelectedRequestId(null)
  → Inbox list re-renders (no refetch needed — Convex reactive)
```

---

## 5. GAMIFICATION OVERLAY — V1 SCOPE NOTE

> **[FIXED — MAJOR] Gamification cut from v1.** The full gamification overlay (PointsStatPill, ProgressTracker, EarlyMultiplierBadge, PointsPreviewCard, PointsEarnedBurst, canvas-confetti) is deferred to v2. In v1, build the functional upload flow only:
> - `RequestCard` — no points display, no EarlyMultiplierBadge
> - `BriefDetailDrawer` — no PointsPreviewCard, no TipsCard gamification
> - `UploadConfirmationOverlay` — simple success state only (no confetti, no points burst)
> - `PointsEarnedBurst` — **remove `canvas-confetti` package dependency**. If/when points display is added in v2, use pure CSS/Framer Motion scale+opacity burst instead. [FIXED]
> - Schema fields `basePoints`, `earlyBonusMultiplier`, `earlyWindowHours` can be added to `CONVEX_SCHEMA_ADDITIONS.md` now but not rendered in v1 UI.

### 5.1 Points Display Integration

The `PointsStatPill` in the ContentPageShell header shows the model's **running total** for the
current period (week or month — configurable). It sits right of the page title, before the
progress tracker.

```
Header layout:
[📋 icon] [Content Requests title] [★ 240 pts pill] [████░ 3 of 7] ────── [+ New ▾]
```

On mobile at 375px, the header collapses:
- Title + PointsStatPill on line 1
- ProgressTracker on line 2 (stacks below in `flex-col gap-1`)

### 5.2 Progress Bar

`ProgressTracker` tracks request completion for the **current batch** (e.g. this week's briefs).
It renders in two places:
1. Header bar (compact, always visible)
2. UploadConfirmationOverlay (larger, animated, shown after submit)

The bar fills left-to-right with the OFM gradient. Milestone markers appear at 25%, 50%, 75%:
```
████████████░░░░░░░░░  3 of 7 done
        ↑   ↑     ↑
       25% 50%   75%  (small tick marks, neutral-200)
```

### 5.3 Early Submission Multiplier

Logic:
- Every brief has `earlyWindowHours` (default: 4h before deadline)
- Within that window, `EarlyMultiplierBadge` renders on the card AND in the brief detail
- `PointsPreviewCard` shows the math: "50 pts base → 100 pts if submitted now"
- After submission: `UploadConfirmationOverlay` shows whether bonus was captured

**State machine:**
```
now < (deadlineAt - earlyWindowHours * 3600000)  → no badge (plenty of time)
now >= (deadlineAt - earlyWindowHours * 3600000) → EarlyMultiplierBadge ACTIVE (fire orange)
now >= deadlineAt                                 → overdue, no bonus
```

### 5.4 Streak / Leaderboard Hook (future — noted for context)

The `LeaderboardSidebar` component from `@/features/community/` can be adapted for a model
leaderboard view on `/model/leaderboard`. Not built in this page — just noted so the
`ContentRequest.pointsEarned` field feeds the correct Convex table for future aggregation.

---

## 6. REUSE INSTRUCTIONS

### 6.1 VideoLightbox
```ts
import { VideoLightbox } from '@/features/intelligence/components/VideoLightbox';

// Usage in ReferenceVideoCard:
<VideoLightbox
  open={lightboxOpen}
  videoUrl={brief.referenceVideoUrl}
  onClose={() => setLightboxOpen(false)}
/>
```
No modification needed. Already handles fullscreen, controls, backdrop dismiss.

### 6.2 SortPill
```ts
import { SortPill } from '@/features/intelligence/components/SortPill';

// Usage in sub-nav slot:
<SortPill
  value={sortBy}
  options={[
    { value: 'deadline', label: 'Deadline' },
    { value: 'points', label: 'Points' },
    { value: 'newest', label: 'Newest' },
  ]}
  onChange={setSortBy}
/>
```

### 6.3 PostCard (brief preview in SendToModelModal context)
```ts
import { PostCard } from '@/features/community/components/PostCard';

// Used in the agency-side "Content Requests" page (/agency/content-requests)
// when the editor is previewing the brief before sending.
// NOT used in the model-side inbox (RequestCard serves that purpose here).
```

### 6.4 SendToModelModal (agency side — for completeness)
```ts
import { SendToModelModal } from '@/features/hub-swipe/components/SendToModelModal';

// Called from /agency/content-requests when manager hits "+ New Brief"
// Swap the MODELS constant to use Convex query:
const models = useQuery(api.models.listActive);
```

### 6.5 StatusStrip
```ts
import { StatusStrip } from '@/components/ui/status-strip';

<StatusStrip
  status={{ label: 'Active', active: true }}
  stats={[
    { icon: <Inbox size={10} />, value: pendingCount, label: 'pending' },
    { icon: <AlertCircle size={10} />, value: overdueCount, label: 'overdue' },
    { icon: <CheckCircle size={10} />, value: doneCount, label: 'done' },
  ]}
/>
```

### 6.6 FilterChip (tab pills)
```ts
// Adapted from the FilterChip pattern in DESIGN_SYSTEM_REFERENCE.md §7f
// Used for the "All / Pending / Done" tab pills in sub-nav Row 2
// activeFilter drives the inbox query filter
```

### 6.7 SkeletonCard
```ts
import { SkeletonCard } from '@/features/intelligence/components/SkeletonCard';

// Used as Suspense / loading fallback while Convex query loads:
const requests = useQuery(api.contentRequests.listForModel, { modelId });
if (!requests) return <div className="space-y-3 px-6 pt-6">{[...Array(3)].map((_, i) => <SkeletonCard key={i} />)}</div>;
```

---

## 7. FILE STRUCTURE

```
src/features/content-requests/
  components/
    ContentRequestsFeaturePage.tsx     ← page root
    RequestInboxView.tsx               ← list view
    RequestCard.tsx                    ← individual brief card
    DeadlineCountdown.tsx              ← timer display
    EarlyMultiplierBadge.tsx           ← bonus indicator
    ProgressTracker.tsx                ← "3 of 7 done" bar
    PointsStatPill.tsx                 ← header points display
    BriefDetailDrawer.tsx              ← full detail sheet
    ReferenceVideoCard.tsx             ← video preview + lightbox trigger
    PointsPreviewCard.tsx              ← points math display
    StickyRecordBar.tsx                ← record + upload CTAs
    UploadConfirmationOverlay.tsx      ← upload progress + success
    PointsEarnedBurst.tsx              ← animated points reward
    index.ts                           ← exports
  hooks/
    useOneTapRecord.ts                 ← camera / file capture
    useDeadlineReminders.ts            ← notification logic
    useUploadToGoogleDrive.ts          ← wraps Convex action
  types.ts                             ← ContentRequest, UploadState, etc.

src/app/model/requests/page.tsx        ← thin wrapper only
```

---

## 8. CONVEX SCHEMA ADDITIONS

> **[FIXED — BLOCKER] DO NOT create a new table definition here.** The canonical schema is `CONVEX_SCHEMA_ADDITIONS.md`. This section lists required ADDITIONS to that file only. Workers must reference `CONVEX_SCHEMA_ADDITIONS.md` exclusively.

> **[FIXED]** Key corrections vs original wireframe schema:
> - `senderLabel` → use canonical `sentBy: v.optional(v.string())` — derive `senderLabel` display at query time [FIXED]
> - `referenceVideoUrl` → use canonical `briefVideoUrl` field name [FIXED]
> - `driveFileId` → use canonical `googleDriveFileId` field name [FIXED]
> - `earlyBonusApplied` → use canonical `submittedEarly: v.optional(v.boolean())` [FIXED]
> - `status` enum → canonical: `draft | sent | acknowledged | in_progress | uploaded | overdue | cancelled` — map to model-facing display states via `getModelFacingStatus()` helper [FIXED]
> - `rdEntryId: v.optional(v.id('rdEntries'))` — add this FK to schema (was missing from wireframe) [FIXED]

**Required additions to `contentRequests` in `CONVEX_SCHEMA_ADDITIONS.md`:**
```ts
// Add these fields to the existing contentRequests table definition:
editorName:           v.optional(v.string()),             // for TipsCard display [FIXED — added]
basePoints:           v.optional(v.number()),             // points math [FIXED — added]
earlyBonusMultiplier: v.optional(v.number()),             // e.g. 2 [FIXED — added]
earlyWindowHours:     v.optional(v.number()),             // e.g. 4 [FIXED — added]
priority:             v.optional(v.union(                 // for editor queue [FIXED — added]
  v.literal('high'), v.literal('medium'), v.literal('low')
)),
needsTweaking:        v.optional(v.boolean()),            // for editor queue [FIXED — added]
```

**Model-facing status mapping** (`getModelFacingStatus()` helper — lives in component, NOT schema):
```ts
// [FIXED] Map canonical statuses to simplified model display states
function getModelFacingStatus(status: string): 'pending' | 'in_progress' | 'submitted' | 'urgent' {
  if (status === 'draft' || status === 'sent') return 'pending';
  if (status === 'acknowledged' || status === 'in_progress') return 'in_progress';
  if (status === 'uploaded') return 'submitted';
  if (status === 'overdue') return 'urgent';
  return 'pending'; // cancelled → hidden from model inbox
}
```

**Google Drive auth spike required before building `useUploadToGoogleDrive`:** [FIXED — SW-7]
Define auth strategy first: service account vs per-user OAuth, folder structure, token refresh handling.

---

## 9. DESIGN TOKEN SUMMARY

| Token | Value | Use |
|-------|-------|-----|
| OFM gradient | `linear-gradient(135deg, #ff0069, #833ab4)` | CTAs, active tabs, progress bars |
| OFM pink | `#ff0069` | Points, accent icons, pill borders |
| Early bonus orange | `#ff6b00` | Multiplier badge only |
| Urgent red | `text-red-500` / `#ef4444` | Deadline < 6h |
| Card border | `rgba(0,0,0,0.07)` | All white-surface cards |
| Card shadow | `0 1px 4px rgba(0,0,0,0.04)` | RequestCard |
| Backdrop blur | `bg-black/40` | BriefDetailDrawer backdrop |
| Sheet handle | `bg-neutral-200 w-9 h-1 rounded-full` | Sheet drag handle |
| confetti colors | `['#ff0069', '#833ab4', '#ff6b00']` | PointsEarnedBurst |

---

## 10. BUILD CHECKLIST

- [ ] `ContentRequest` Convex schema added + `npx convex dev --once`
- [ ] `ContentRequestsFeaturePage` renders inside `ContentPageShell`
- [ ] `RequestCard` renders with real Convex data
- [ ] `DeadlineCountdown` updates every 60s via interval
- [ ] `BriefDetailDrawer` opens/closes with spring animation
- [ ] `ReferenceVideoCard` triggers `VideoLightbox` correctly
- [ ] `StickyRecordBar` → camera capture works on iOS Safari (file input fallback)
- [ ] Upload flow: file → Convex action → Drive → status update
- [ ] `UploadConfirmationOverlay` progress bar tracks real upload
- [ ] `PointsEarnedBurst` fires confetti on early bonus
- [ ] `ProgressTracker` animates fill on completion
- [ ] `PointsStatPill` count-up animates after submit
- [ ] `npm run build` passes with no type errors
