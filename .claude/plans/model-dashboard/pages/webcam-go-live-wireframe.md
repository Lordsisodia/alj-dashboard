# Webcam — Go Live Wireframe + Component Spec
# Route: /model/webcam
# Features: M1, M4, M5, M6, M7, M8, M9
# Layout: LAPTOP (desktop-first — streaming is done on laptop)
# Last updated: 2026-04-13

---

## 0. Context Summary

The Go Live page is the model's command center for webcam streaming. Unlike other model pages
(mobile-first), webcam pages are **LAPTOP layout** — models set up streams on their laptop.
This page shows last-week stats, the upcoming schedule slot, a big Go Live CTA, and a
pre-stream gamified checklist. OFM accent: `linear-gradient(135deg, #ff0069, #833ab4)`.

---

## 1. ASCII WIREFRAME — LAPTOP (1280px desktop layout)

```
┌────────────────────────────────────────────────────────────────────────────────────────────┐
│  IssoSidebarShell (collapsed icon rail 64px + expanded panel ~280px)                       │
│                                                                                            │
│  ┌─────────────────────────────────────────────────────────────────────────────────────┐   │
│  │ ContentPageShell                                                                    │   │
│  │                                                                                     │   │
│  │ ┌─ ROW 1 — Header ─────────────────────────────────────────────────────────────┐   │   │
│  │ │  [📹 icon]  Webcam              [★ 1,240 pts]  ────────────  [🔴 Go Live ▾]  │   │   │
│  │ └──────────────────────────────────────────────────────────────────────────────┘   │   │
│  │                                                                                     │   │
│  │ ┌─ ROW 2 — Sub-nav ────────────────────────────────────────────────────────────┐   │   │
│  │ │  [🏠 Home ●]  [📊 Stats]  [📅 Calendar]          [🔥 3-day streak]          │   │   │
│  │ └──────────────────────────────────────────────────────────────────────────────┘   │   │
│  │                                                                                     │   │
│  │ ┌─ ROW 3 — Content (2-column layout) ──────────────────────────────────────────┐   │   │
│  │ │                                                                              │   │   │
│  │ │  LEFT COLUMN (flex-1)                    RIGHT COLUMN (w-80)                 │   │   │
│  │ │  ─────────────────────────────────       ─────────────────────────────────   │   │   │
│  │ │                                                                              │   │   │
│  │ │  ┌─ LastWeekStatsStrip ──────────┐       ┌─ StreamScheduleCard ───────────┐  │   │   │
│  │ │  │ LAST WEEK                     │       │ NEXT STREAM                    │  │   │   │
│  │ │  │                               │       │                                │  │   │   │
│  │ │  │  ┌──────────┐ ┌──────────┐   │       │ Today  8:00 PM – 11:00 PM      │  │   │   │
│  │ │  │  │  £2,340  │ │  4,820   │   │       │                                │  │   │   │
│  │ │  │  │ Earnings │ │ Viewers  │   │       │ Platforms:                     │  │   │   │
│  │ │  │  └──────────┘ └──────────┘   │       │ [OF] [Fansly] [Chaturbate]     │  │   │   │
│  │ │  │                               │       │                                │  │   │   │
│  │ │  │  ┌──────────┐ ┌──────────┐   │       │ ⏰ Starts in 2h 14m            │  │   │   │
│  │ │  │  │   12     │ │  94 min  │   │       │                                │  │   │   │
│  │ │  │  │ Sessions │ │ Avg dur. │   │       │ [View Full Schedule →]         │  │   │   │
│  │ │  │  └──────────┘ └──────────┘   │       └────────────────────────────────┘  │   │   │
│  │ │  └───────────────────────────────┘                                           │   │   │
│  │ │                                           ┌─ BestTimeRecommendation ───────┐  │   │   │
│  │ │  ┌─ GoLiveButton ────────────────┐        │ 🤖 Best time to stream:        │  │   │   │
│  │ │  │                               │        │                                │  │   │   │
│  │ │  │  ╔═══════════════════════════╗ │        │  Tonight 8–10 PM              │  │   │   │
│  │ │  │  ║                           ║ │        │  "Your peak viewers are       │  │   │   │
│  │ │  │  ║    🔴  GO LIVE NOW        ║ │        │   usually online then."        │  │   │   │
│  │ │  │  ║                           ║ │        │                                │  │   │   │
│  │ │  │  ╚═══════════════════════════╝ │        │  [Why?] ↗                     │  │   │   │
│  │ │  │  Full-width gradient button   │        └────────────────────────────────┘  │   │   │
│  │ │  └───────────────────────────────┘                                           │   │   │
│  │ │                                           ┌─ StreamKeyManager ─────────────┐  │   │   │
│  │ │  ┌─ PreStreamChecklist ──────────┐        │ STREAM KEYS                    │  │   │   │
│  │ │  │                               │        │                                │  │   │   │
│  │ │  │  GET READY TO GO LIVE         │        │ OnlyFans   [•••••••••] [copy]  │  │   │   │
│  │ │  │  ─────────────────────        │        │ Fansly     [•••••••••] [copy]  │  │   │   │
│  │ │  │                               │        │ Chaturbate [•••••••••] [copy]  │  │   │   │
│  │ │  │  ☑ Lighting set up            │        │ Stripchat  [•••••••••] [copy]  │  │   │   │
│  │ │  │  ☑ Camera angle checked       │        │                                │  │   │   │
│  │ │  │  ☐ Audio tested               │        │ [+ Add platform]               │  │   │   │
│  │ │  │  ☐ OBS connected              │        └────────────────────────────────┘  │   │   │
│  │ │  │  ☐ Chat filter set            │                                           │   │   │
│  │ │  │  ☐ Title updated              │                                           │   │   │
│  │ │  │                               │                                           │   │   │
│  │ │  │  ████████░░░░  2 of 6 done    │                                           │   │   │
│  │ │  │                               │                                           │   │   │
│  │ │  │  [Go Live is locked until 4/6]│                                           │   │   │
│  │ │  └───────────────────────────────┘                                           │   │   │
│  │ │                                                                              │   │   │
│  │ │  ┌─ MessageFilterCard ───────────┐                                           │   │   │
│  │ │  │ CHAT FILTER         [Moderate]│                                           │   │   │
│  │ │  │ ○ Safe  ● Moderate  ○ Harsh   │                                           │   │   │
│  │ │  └───────────────────────────────┘                                           │   │   │
│  │ │                                                                              │   │   │
│  │ └──────────────────────────────────────────────────────────────────────────────┘   │   │
│  └─────────────────────────────────────────────────────────────────────────────────────┘   │
└────────────────────────────────────────────────────────────────────────────────────────────┘
```

---

## 2. COMPONENT TREE

```
WebcamGoLiveFeaturePage                     ← default export
│
├── ContentPageShell
│   ├── [header slot]
│   │   ├── ProductIcon (size=32, webcam icon)
│   │   ├── "Webcam" (text-sm font-semibold)
│   │   ├── PointsStatPill (★ 1,240 pts)    ← shared gamification component
│   │   └── GoLiveHeaderButton              ← red pill CTA (mirror of main button)
│   │
│   ├── [sub-nav slot]
│   │   ├── Tab: "Home" (active)
│   │   ├── Tab: "Stats" → /model/webcam/stats
│   │   ├── Tab: "Calendar" → /model/webcam/calendar
│   │   └── StreakBadge                     ← 🔥 N-day streak pill
│   │
│   └── [content slot]
│       └── div.flex.gap-6 (2-column layout)
│           │
│           ├── LEFT — flex-1
│           │   ├── LastWeekStatsStrip      ← NEW
│           │   ├── GoLiveButton            ← NEW (big gradient CTA)
│           │   ├── PreStreamChecklist      ← ADAPT from CriteriaChecklist (hub-swipe)
│           │   └── MessageFilterCard       ← NEW (M5 chat filter)
│           │
│           └── RIGHT — w-80 space-y-4
│               ├── StreamScheduleCard      ← NEW
│               ├── BestTimeRecommendation  ← NEW (M9)
│               └── StreamKeyManager       ← NEW (M7)
```

---

## 3. PER-COMPONENT SPECS

---

### 3.1 LastWeekStatsStrip

**File:** `src/features/webcam/components/LastWeekStatsStrip.tsx`

```tsx
interface LastWeekStatsStripProps {
  earnings: number;       // e.g. 2340
  viewers: number;        // e.g. 4820
  sessions: number;       // e.g. 12
  avgDurationMin: number; // e.g. 94
  currency?: string;      // default "£"
}
```

**Tailwind layout:**
```tsx
<div className="rounded-xl bg-white p-5" style={{ border: '1px solid rgba(0,0,0,0.07)' }}>
  <p className="text-[11px] uppercase tracking-[0.35em] text-neutral-400 mb-4">Last Week</p>
  <div className="grid grid-cols-2 gap-3">
    {[
      { label: 'Earnings', value: `£${earnings.toLocaleString()}`, icon: <DollarSign /> },
      { label: 'Viewers', value: viewers.toLocaleString(), icon: <Users /> },
      { label: 'Sessions', value: sessions, icon: <Radio /> },
      { label: 'Avg Duration', value: `${avgDurationMin}m`, icon: <Clock /> },
    ].map(stat => (
      <div key={stat.label} className="rounded-lg bg-neutral-50 px-4 py-3"
        style={{ border: '1px solid rgba(0,0,0,0.05)' }}>
        <p className="text-xs text-neutral-400">{stat.label}</p>
        <p className="text-xl font-semibold text-neutral-900 mt-0.5">{stat.value}</p>
      </div>
    ))}
  </div>
</div>
```

---

### 3.2 GoLiveButton

**File:** `src/features/webcam/components/GoLiveButton.tsx`

```tsx
interface GoLiveButtonProps {
  locked?: boolean;          // true when checklist not complete
  checklistProgress: number; // 0-1
  onGoLive: () => void;
}
```

**Tailwind:**
```tsx
<motion.button
  onClick={!locked ? onGoLive : undefined}
  className="w-full py-5 rounded-2xl text-lg font-bold text-white flex items-center justify-center gap-3"
  style={{
    background: locked
      ? 'linear-gradient(135deg, #9ca3af, #6b7280)'
      : 'linear-gradient(135deg, #ff0069, #833ab4)',
    boxShadow: locked ? 'none' : '0 8px 32px rgba(255,0,105,0.35)',
  }}
  whileHover={!locked ? { scale: 1.02, y: -2 } : {}}
  whileTap={!locked ? { scale: 0.98 } : {}}
  transition={{ type: 'spring', stiffness: 400, damping: 25 }}
>
  <div className={cn('w-3 h-3 rounded-full', locked ? 'bg-white/40' : 'bg-white animate-pulse')} />
  {locked ? 'Complete checklist to go live' : 'GO LIVE NOW'}
</motion.button>
```

**Lock logic:** Button locked until `checklistProgress >= 4/6` (4 of 6 checklist items done).
Gradient transitions from grey to pink/purple as items complete.

---

### 3.3 PreStreamChecklist

**Adapted from:** `CriteriaChecklist` in `@/features/hub-swipe/`

**File:** `src/features/webcam/components/PreStreamChecklist.tsx`

```tsx
interface ChecklistItem {
  id: string;
  label: string;
  points: number;   // pts earned per completion
  required: boolean;
}

interface PreStreamChecklistProps {
  items: ChecklistItem[];
  checked: Record<string, boolean>;
  onToggle: (id: string) => void;
}
```

Default items (M8):
```ts
const DEFAULT_CHECKLIST: ChecklistItem[] = [
  { id: 'lighting', label: 'Lighting set up', points: 10, required: true },
  { id: 'camera', label: 'Camera angle checked', points: 10, required: true },
  { id: 'audio', label: 'Audio tested', points: 10, required: true },
  { id: 'obs', label: 'OBS connected', points: 15, required: true },
  { id: 'filter', label: 'Chat filter set', points: 5, required: false },
  { id: 'title', label: 'Stream title updated', points: 5, required: false },
];
```

**Tailwind:**
```tsx
<div className="rounded-xl bg-white p-5" style={{ border: '1px solid rgba(0,0,0,0.07)' }}>
  <div className="flex items-center justify-between mb-4">
    <p className="text-[11px] uppercase tracking-[0.35em] text-neutral-400">Get Ready</p>
    <span className="text-xs text-neutral-500">{doneCount} of {items.length} done</span>
  </div>

  <div className="space-y-2">
    {items.map(item => (
      <motion.button
        key={item.id}
        onClick={() => onToggle(item.id)}
        className="w-full flex items-center gap-3 px-4 py-3 rounded-lg text-left transition-colors"
        style={checked[item.id]
          ? { background: 'rgba(255,0,105,0.04)', border: '1px solid rgba(255,0,105,0.15)' }
          : { background: 'rgba(0,0,0,0.02)', border: '1px solid rgba(0,0,0,0.06)' }
        }
        whileTap={{ scale: 0.98 }}
      >
        <div className={cn(
          'w-5 h-5 rounded-full border-2 flex items-center justify-center flex-shrink-0 transition-all',
          checked[item.id]
            ? 'border-[#ff0069] bg-[#ff0069]'
            : 'border-neutral-300'
        )}>
          {checked[item.id] && <Check size={10} className="text-white" />}
        </div>
        <span className={cn(
          'text-sm flex-1',
          checked[item.id] ? 'text-neutral-400 line-through' : 'text-neutral-700'
        )}>
          {item.label}
        </span>
        {!checked[item.id] && (
          <span className="text-[11px] text-neutral-400">+{item.points}pts</span>
        )}
      </motion.button>
    ))}
  </div>

  {/* Progress bar */}
  <div className="mt-4">
    <div className="h-1.5 rounded-full bg-neutral-100 overflow-hidden">
      <motion.div
        className="h-full rounded-full"
        style={{ background: 'linear-gradient(135deg, #ff0069, #833ab4)' }}
        animate={{ width: `${(doneCount / items.length) * 100}%` }}
        transition={{ duration: 0.5, ease: [0.25, 0.1, 0.25, 1] }}
      />
    </div>
    {doneCount < 4 && (
      <p className="text-[11px] text-neutral-400 mt-1.5">
        Complete {4 - doneCount} more to unlock Go Live
      </p>
    )}
  </div>
</div>
```

---

### 3.4 StreamScheduleCard

**File:** `src/features/webcam/components/StreamScheduleCard.tsx`

```tsx
interface StreamScheduleCardProps {
  nextStream: {
    startAt: number;   // Unix ms
    endAt: number;
    platforms: string[]; // e.g. ['onlyfans', 'fansly', 'chaturbate']
  } | null;
  onViewSchedule: () => void;
}
```

**Tailwind:**
```tsx
<div className="rounded-xl bg-white p-5 space-y-4" style={{ border: '1px solid rgba(0,0,0,0.07)' }}>
  <p className="text-[11px] uppercase tracking-[0.35em] text-neutral-400">Next Stream</p>
  {nextStream ? (
    <>
      <div>
        <p className="text-base font-semibold text-neutral-900">
          {formatDate(nextStream.startAt)} — {formatTime(nextStream.startAt)}–{formatTime(nextStream.endAt)}
        </p>
        <div className="flex items-center gap-1.5 mt-2 flex-wrap">
          {nextStream.platforms.map(p => (
            <PlatformIcon key={p} platform={p} size={20} />
          ))}
        </div>
      </div>
      <CountdownTimer targetAt={nextStream.startAt} />
      <button
        onClick={onViewSchedule}
        className="w-full text-xs text-neutral-500 hover:text-neutral-700 flex items-center justify-center gap-1"
      >
        View Full Schedule <ArrowRight size={12} />
      </button>
    </>
  ) : (
    <p className="text-sm text-neutral-400">No stream scheduled today</p>
  )}
</div>
```

**`CountdownTimer`:** Inline sub-component, updates every second. Renders:
```
⏰ Starts in  2h 14m
```
Red when < 30min. Green when within the scheduled window (live now).

---

### 3.5 BestTimeRecommendation

**File:** `src/features/webcam/components/BestTimeRecommendation.tsx`

```tsx
interface BestTimeRecommendationProps {
  recommendedSlot: string;   // e.g. "Tonight 8–10 PM"
  reason: string;            // e.g. "Your peak viewers are usually online then."
}
```

**Tailwind:**
```tsx
<div className="rounded-xl p-4 space-y-2"
  style={{ background: 'rgba(255,0,105,0.03)', border: '1px solid rgba(255,0,105,0.10)' }}
>
  <div className="flex items-center gap-2">
    <Sparkles size={13} style={{ color: '#ff0069' }} />
    <p className="text-[11px] font-semibold" style={{ color: '#ff0069' }}>Best time to stream</p>
  </div>
  <p className="text-sm font-semibold text-neutral-900">{recommendedSlot}</p>
  <p className="text-xs text-neutral-500 leading-relaxed">"{reason}"</p>
</div>
```

---

### 3.6 StreamKeyManager

**File:** `src/features/webcam/components/StreamKeyManager.tsx`

```tsx
interface StreamKey {
  platform: string;
  key: string;        // masked on render — show dots
}

interface StreamKeyManagerProps {
  keys: StreamKey[];
  onCopy: (platform: string) => void;
}
```

**Tailwind:**
```tsx
<div className="rounded-xl bg-white p-5" style={{ border: '1px solid rgba(0,0,0,0.07)' }}>
  <p className="text-[11px] uppercase tracking-[0.35em] text-neutral-400 mb-3">Stream Keys</p>
  <div className="space-y-2">
    {keys.map(k => (
      <div key={k.platform} className="flex items-center gap-3">
        <PlatformIcon platform={k.platform} size={16} />
        <span className="text-sm text-neutral-700 flex-1 capitalize">{k.platform}</span>
        <span className="text-xs font-mono text-neutral-400 tracking-widest">••••••••</span>
        <button
          onClick={() => onCopy(k.platform)}
          className="p-1.5 rounded-md hover:bg-neutral-100 transition-colors"
        >
          <Copy size={12} className="text-neutral-400" />
        </button>
      </div>
    ))}
  </div>
  <button className="mt-3 w-full text-xs text-neutral-400 hover:text-neutral-600 flex items-center justify-center gap-1 py-2 rounded-lg hover:bg-neutral-50 transition-colors">
    <Plus size={11} />
    Add platform
  </button>
</div>
```

---

### 3.7 MessageFilterCard

**File:** `src/features/webcam/components/MessageFilterCard.tsx`

```tsx
type FilterLevel = 'safe' | 'moderate' | 'harsh';

interface MessageFilterCardProps {
  level: FilterLevel;
  onChange: (level: FilterLevel) => void;
}
```

**Tailwind:**
```tsx
<div className="rounded-xl bg-white px-5 py-4 flex items-center justify-between"
  style={{ border: '1px solid rgba(0,0,0,0.07)' }}
>
  <div className="flex items-center gap-2">
    <Shield size={14} className="text-neutral-400" />
    <span className="text-sm font-medium text-neutral-700">Chat Filter</span>
  </div>
  <div className="flex items-center rounded-lg overflow-hidden" style={{ border: '1px solid rgba(0,0,0,0.08)' }}>
    {(['safe', 'moderate', 'harsh'] as FilterLevel[]).map(l => (
      <button
        key={l}
        onClick={() => onChange(l)}
        className="px-3 py-1.5 text-xs font-medium capitalize transition-all"
        style={level === l
          ? { background: 'linear-gradient(135deg, #ff0069, #833ab4)', color: '#fff' }
          : { color: '#9ca3af' }
        }
      >
        {l}
      </button>
    ))}
  </div>
</div>
```

---

### 3.8 StreakBadge (sub-nav pill)

**Inline in sub-nav slot:**
```tsx
<div className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg ml-auto"
  style={{ background: 'rgba(255,107,0,0.08)', border: '1px solid rgba(255,107,0,0.20)' }}
>
  <span className="text-sm">🔥</span>
  <span className="text-[11px] font-semibold" style={{ color: '#ff6b00' }}>
    {streakDays}-day streak
  </span>
</div>
```

---

## 4. INTERACTION SPEC

### 4.1 Checklist → GoLive unlock
```
User taps checklist item
  → Framer Motion spring tick animation (scale 0 → 1)
  → Progress bar animates to new width
  → Points awarded instantly (optimistic update)
  → When 4/6 done: GoLiveButton gradient transitions grey → pink
  → CelebrationModal fires at 6/6 (all done)
```

### 4.2 Go Live → Stream starts
```
User taps GO LIVE NOW
  → Confirm modal: "Starting stream on OF, Fansly, Chaturbate. Ready?"
  → On confirm: POST to webcam platforms API (OBS webhook or direct)
  → Button transitions to "🔴 LIVE NOW" pulsing state
  → Post-stream summary (M6) sent to manager at session end
```

### 4.3 Stream Key copy
```
User taps [copy] on a platform key
  → navigator.clipboard.writeText(key)
  → Copy button flashes green checkmark for 1.5s
  → Toast: "Copied OnlyFans stream key"
```

### 4.4 Chat filter change
```
User selects filter level
  → Optimistic update (immediate pill highlight)
  → Convex mutation saves preference
  → Visible next stream when OBS connects
```

---

## 5. GAMIFICATION INTEGRATION

| Trigger | Points | Display |
|---------|--------|---------|
| Complete pre-stream checklist item | +10 pts each | Item tick + points flash |
| Complete full checklist | +25 bonus pts | CelebrationModal |
| Go live (session starts) | +50 pts | Header PointsStatPill count-up |
| Stream > 60 min | +30 pts | Post-stream summary card |
| Maintain 3+ day streak | Streak badge in sub-nav | StreakBadge updates |

**Gamification overlay:** `PointsStatPill` in header. `StreakBadge` in sub-nav. No floating overlay
on laptop layout — points integrated into UI elements.

---

## 6. REUSE INSTRUCTIONS

| Component | Source | Notes |
|-----------|--------|-------|
| `CriteriaChecklist` | `@/features/hub-swipe/` | Adapt: add points per item, lock GoLive logic |
| `PointsStatPill` | `@/features/content-requests/` | Reuse directly — shared gamification |
| `VideoLightbox` | `@/features/intelligence/` | Not needed here — webcam is live |
| `StatusStrip` | `@/components/ui/status-strip` | Not used — stats are in dedicated LastWeekStatsStrip |

---

## 7. FILE STRUCTURE

```
src/features/webcam/
  components/
    WebcamGoLiveFeaturePage.tsx    ← page root
    LastWeekStatsStrip.tsx
    GoLiveButton.tsx
    PreStreamChecklist.tsx         ← adapted from CriteriaChecklist
    StreamScheduleCard.tsx
    BestTimeRecommendation.tsx
    StreamKeyManager.tsx
    MessageFilterCard.tsx
    StreakBadge.tsx
    index.ts
  hooks/
    useWebcamSession.ts            ← platform API integration
    usePreStreamState.ts           ← checklist state + lock logic
  types.ts

src/app/model/webcam/page.tsx     ← thin wrapper only
```

---

## 8. DESIGN TOKEN SUMMARY

| Token | Value | Use |
|-------|-------|-----|
| OFM gradient | `linear-gradient(135deg, #ff0069, #833ab4)` | GoLive CTA, active checklist items, progress bars |
| Locked grey | `linear-gradient(135deg, #9ca3af, #6b7280)` | GoLive button when locked |
| Streak orange | `#ff6b00` | StreakBadge |
| Live red | `#dc2626` + pulse | Live indicator dot |
| Card border | `rgba(0,0,0,0.07)` | All white-surface cards |
| GoLive glow | `0 8px 32px rgba(255,0,105,0.35)` | GoLiveButton shadow |
