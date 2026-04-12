# Swipe Deck Wireframe + Component Spec
# Route: /model/swipe
# Features: M31–M44
# Layout: MOBILE-FIRST (375px)
# Last updated: 2026-04-13

---

## 0. Context Summary

The model's daily content inspiration feed. Tinder-style card swipe deck. 10 curated content
ideas dropped daily from the agency's R&D pipeline and database. Swipe right = save to queue,
swipe up = record now, swipe left = skip (trains algorithm). Gamified: 10/day target with
celebration at completion. "Trending in your niche" badges on hot cards.
OFM accent: `linear-gradient(135deg, #ff0069, #833ab4)`.

Design philosophy: "Treat models like 5 year olds" — one card at a time, huge gesture target,
instant visual feedback, celebration explosion at 10.

---

## 1. ASCII WIREFRAME — MOBILE (375px)

### View A: SWIPE DECK (main state)

```
┌─────────────────────────────────────────┐  375px
│  ░░░ IssoSidebarShell (56px icon rail) ░│
│                                         │
│  ┌───────────────────────────────────┐  │
│  │ ContentPageShell                  │  │
│  │                                   │  │
│  │ ┌─ ROW 1 — Header ──────────────┐ │  │
│  │ │ [🃏] Swipe Deck  [★ 320 pts]  │ │  │
│  │ │              [Saved (3) 📋]   │ │  │
│  │ └───────────────────────────────┘ │  │
│  │                                   │  │
│  │ ┌─ ROW 2 — Sub-nav ─────────────┐ │  │
│  │ │ [Swipe ●] [Saved] [History]   │ │  │
│  │ │              Daily: [6/10 🔥] │ │  │
│  │ └───────────────────────────────┘ │  │
│  │                                   │  │
│  │ ┌─ ROW 3 — Content ─────────────┐ │  │
│  │ │                               │ │  │
│  │ │  Swipe right ──→ Save         │ │  │
│  │ │  ↑ Swipe up  ──→ Record now   │ │  │
│  │ │  ←── Swipe left  ──→ Skip     │ │  │
│  │ │                               │ │  │
│  │ │  ┌─ SwipeStack ──────────────┐│ │  │
│  │ │  │                           ││ │  │
│  │ │  │  [card 3 — peeking]       ││ │  │  z-index 1, scale 0.92
│  │ │  │  ┌─────────────────────┐  ││ │  │
│  │ │  │  │  [card 2 — behind]  │  ││ │  │  z-index 2, scale 0.96
│  │ │  │  │  ┌───────────────┐  │  ││ │  │
│  │ │  │  │  │               │  │  ││ │  │
│  │ │  │  │  │  FRONT CARD   │  │  ││ │  │  z-index 3, scale 1.0
│  │ │  │  │  │               │  │  ││ │  │
│  │ │  │  │  │ ┌───────────┐ │  │  ││ │  │
│  │ │  │  │  │ │[4:5 thumb]│ │  │  ││ │  │
│  │ │  │  │  │ └───────────┘ │  │  ││ │  │
│  │ │  │  │  │               │  │  ││ │  │
│  │ │  │  │  │ 🔥 TRENDING   │  │  ││ │  │  TrendingBadge
│  │ │  │  │  │               │  │  ││ │  │
│  │ │  │  │  │ Gym Morning   │  │  ││ │  │  title
│  │ │  │  │  │ Routine 💪    │  │  ││ │  │
│  │ │  │  │  │               │  │  ││ │  │
│  │ │  │  │  │ GFE · Fitness │  │  ││ │  │  tags
│  │ │  │  │  │               │  │  ││ │  │
│  │ │  │  │  │ 📊 Hook: 8.4  │  │  ││ │  │  hook score
│  │ │  │  │  │ 👁 Est: 12K   │  │  ││ │  │  est. reach
│  │ │  │  │  └───────────────┘  │  ││ │  │
│  │ │  │  └─────────────────────┘  ││ │  │
│  │ │  └───────────────────────────┘│ │  │
│  │ │                               │ │  │
│  │ │  ← skip    [●●●●●●●●○○] save →│ │  │
│  │ │                               │ │  │  gesture hint strip
│  │ │  ┌─ ActionButtons ───────────┐│ │  │
│  │ │  │  [✕ Skip] [▲ Record] [✓ Save]││   │  tap fallbacks for non-swipe
│  │ │  └───────────────────────────┘│ │  │
│  │ │                               │ │  │
│  │ └───────────────────────────────┘ │  │
│  └───────────────────────────────────┘  │
└─────────────────────────────────────────┘
```

### View B: SWIPE FEEDBACK OVERLAYS (while dragging)

```
  Dragging RIGHT → green tint + "SAVE ✓" stamp appears top-left
  Dragging LEFT  → red tint + "SKIP ✗" stamp appears top-right
  Dragging UP    → blue tint + "RECORD 🎬" stamp appears top-center
```

### View C: TARGET HIT CELEBRATION (at 10/10)

```
┌─────────────────────────────────────────┐
│                                         │
│         🎉 CONFETTI EXPLOSION 🎉        │
│                                         │
│   ╔═══════════════════════════════╗     │
│   ║                               ║     │
│   ║   Congratulations! 🏆        ║     │
│   ║   You hit 10 today!          ║     │
│   ║                               ║     │
│   ║   ⭐ +50 pts earned!          ║     │
│   ║                               ║     │
│   ║   [Keep Going] [View Saved]   ║     │
│   ╚═══════════════════════════════╝     │
│                                         │
└─────────────────────────────────────────┘
```

### View D: SAVED LIST tab

```
┌─────────────────────────────────────────┐
│  ┌─ Saved List ────────────────────────┐│
│  │                                     ││
│  │  ┌─ SavedCard ───────────────────┐  ││
│  │  │  ┌──────┐  Gym Morning Routine│  ││
│  │  │  │[thumb│  Saved 2h ago       │  ││
│  │  │  │     ]│  GFE · Fitness      │  ││
│  │  │  └──────┘                     │  ││
│  │  │  [▶ Make it now]  [✕ Remove]  │  ││
│  │  └───────────────────────────────┘  ││
│  │                                     ││
│  │  ┌─ SavedCard ───────────────────┐  ││
│  │  │  ┌──────┐  Dance Challenge    │  ││
│  │  │  │[thumb│  Saved yesterday    │  ││
│  │  │  └──────┘  Meme · Trending    │  ││
│  │  │  [▶ Make it now]  [✕ Remove]  │  ││
│  │  └───────────────────────────────┘  ││
│  │                                     ││
│  └─────────────────────────────────────┘│
└─────────────────────────────────────────┘
```

---

## 2. COMPONENT TREE

```
SwipeDeckFeaturePage                      ← default export
│
├── ContentPageShell
│   ├── [header slot]
│   │   ├── ProductIcon (cards icon)
│   │   ├── "Swipe Deck" title
│   │   ├── PointsStatPill
│   │   └── SavedCountBadge               ← taps to Saved tab
│   │
│   ├── [sub-nav slot]
│   │   ├── Tab: "Swipe" (active)
│   │   ├── Tab: "Saved"
│   │   ├── Tab: "History"
│   │   └── DailyTargetPill (6/10 🔥)    ← right slot
│   │
│   └── [content slot — AnimatePresence]
│       ├── SwipeView                     ← default tab
│       │   ├── GestureHintStrip          ← NEW (one-time, dismissable)
│       │   ├── SwipeStack                ← REUSE from hub-swipe
│       │   │   └── SwipeCard[]           ← ADAPT from hub-swipe
│       │   │       ├── CardThumbnail
│       │   │       ├── TrendingBadge     ← NEW (M39)
│       │   │       ├── CardTitle
│       │   │       ├── CardTags
│       │   │       ├── HookScoreChip
│       │   │       ├── EstReachChip
│       │   │       └── SwipeFeedbackOverlay ← NEW (directional stamp)
│       │   └── ActionButtonRow           ← NEW (tap fallback for skip/record/save)
│       │
│       ├── SavedView                     ← NEW (M41)
│       │   └── SavedCard[]               ← NEW
│       │       ├── ThumbnailSlot
│       │       ├── CardMeta
│       │       ├── MakeItNowButton       ← NEW (M41)
│       │       └── RemoveButton
│       │
│       └── HistoryView                   ← REUSE SwipeAuditLog from hub-swipe
│
├── DailyTargetPopup                      ← NEW (M37) — fires at 10/10
│   ├── ConfettiBurst (canvas-confetti)
│   ├── CongratsMessage
│   ├── PointsEarnedBurst
│   ├── KeepGoingButton
│   └── ViewSavedButton
│
└── WeeklyChallengeCard                   ← NEW (M43) — pinned above deck
```

---

## 3. PER-COMPONENT SPECS

---

### 3.1 SwipeCard (model variant)

**Adapted from:** `SwipeStack` in `@/features/hub-swipe/` — portable, drop-in.

**File:** `src/features/swipe-deck/components/SwipeCard.tsx`

```tsx
interface SwipeDeckItem {
  id: string;
  title: string;
  thumbnailUrl?: string;
  tags: string[];            // e.g. ['GFE', 'Fitness']
  hookScore?: number;        // 0–10, from R&D entry
  estimatedReach?: number;   // AI estimate
  trending?: boolean;        // M39 — "Trending in your niche"
  trendingLabel?: string;    // e.g. "🔥 Trending in Fitness"
  source: 'agency_db' | 'content_gen';
}

interface SwipeCardProps {
  item: SwipeDeckItem;
  onSwipe: (dir: 'left' | 'right' | 'up') => void;
  style?: React.CSSProperties;    // z-index, scale from parent stack
}
```

**Card layout:**
```tsx
<motion.div
  drag
  dragConstraints={{ top: 0, bottom: 0, left: 0, right: 0 }}
  dragElastic={0.9}
  onDragEnd={(_, info) => {
    if (info.offset.x > 100) onSwipe('right');
    else if (info.offset.x < -100) onSwipe('left');
    else if (info.offset.y < -80) onSwipe('up');
  }}
  style={{ x, y, rotate, ...style }}
  className="absolute inset-0 rounded-2xl overflow-hidden bg-white cursor-grab active:cursor-grabbing"
  style={{ boxShadow: '0 8px 32px rgba(0,0,0,0.12)', border: '1px solid rgba(0,0,0,0.06)' }}
>
  {/* Thumbnail — 4:5 aspect */}
  <div className="relative aspect-[4/5] bg-neutral-100">
    {item.thumbnailUrl
      ? <img src={item.thumbnailUrl} className="w-full h-full object-cover" />
      : <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-neutral-100 to-neutral-200">
          <Play size={32} className="text-neutral-300" />
        </div>
    }
    {/* Trending badge */}
    {item.trending && <TrendingBadge label={item.trendingLabel} />}

    {/* Swipe directional overlays */}
    <SwipeFeedbackOverlay x={x} y={y} />
  </div>

  {/* Card info */}
  <div className="px-4 py-3 space-y-1.5">
    <p className="text-base font-semibold text-neutral-900 leading-snug">{item.title}</p>
    <div className="flex items-center gap-1.5 flex-wrap">
      {item.tags.map(tag => (
        <span key={tag} className="px-2 py-0.5 rounded-md text-[11px] font-medium bg-neutral-100 text-neutral-600">
          {tag}
        </span>
      ))}
    </div>
    <div className="flex items-center gap-3">
      {item.hookScore !== undefined && (
        <span className="text-xs text-neutral-500 flex items-center gap-1">
          <Zap size={10} style={{ color: '#ff0069' }} />
          Hook: <strong className="text-neutral-700">{item.hookScore.toFixed(1)}</strong>
        </span>
      )}
      {item.estimatedReach !== undefined && (
        <span className="text-xs text-neutral-500 flex items-center gap-1">
          <Eye size={10} />
          Est: <strong className="text-neutral-700">
            {item.estimatedReach >= 1000 ? `${(item.estimatedReach/1000).toFixed(0)}K` : item.estimatedReach}
          </strong>
        </span>
      )}
    </div>
  </div>
</motion.div>
```

---

### 3.2 TrendingBadge

**File:** `src/features/swipe-deck/components/TrendingBadge.tsx`

```tsx
interface TrendingBadgeProps {
  label?: string;    // e.g. "🔥 Trending in Fitness"
}
```

```tsx
<div className="absolute top-3 left-3 flex items-center gap-1.5 px-2.5 py-1 rounded-full backdrop-blur-sm"
  style={{ background: 'rgba(255,107,0,0.85)', boxShadow: '0 2px 8px rgba(255,107,0,0.4)' }}
>
  <span className="text-sm">🔥</span>
  <span className="text-[11px] font-bold text-white">
    {label ?? 'Trending in your niche'}
  </span>
</div>
```

---

### 3.3 SwipeFeedbackOverlay

**File:** `src/features/swipe-deck/components/SwipeFeedbackOverlay.tsx`

Uses `useTransform` from Framer Motion to derive opacity from drag offset.

```tsx
interface SwipeFeedbackOverlayProps {
  x: MotionValue<number>;
  y: MotionValue<number>;
}

// Derived values
const rightOpacity = useTransform(x, [0, 100], [0, 1]);
const leftOpacity = useTransform(x, [0, -100], [0, 1]);
const upOpacity = useTransform(y, [0, -80], [0, 1]);
```

```tsx
<>
  {/* RIGHT — green SAVE */}
  <motion.div
    className="absolute inset-0 flex items-start justify-start p-4"
    style={{ opacity: rightOpacity, background: 'rgba(34,197,94,0.15)' }}
  >
    <div className="border-4 border-green-500 rounded-xl px-3 py-1 rotate-[-15deg]">
      <span className="text-green-500 text-xl font-black">SAVE ✓</span>
    </div>
  </motion.div>

  {/* LEFT — red SKIP */}
  <motion.div
    className="absolute inset-0 flex items-start justify-end p-4"
    style={{ opacity: leftOpacity, background: 'rgba(239,68,68,0.15)' }}
  >
    <div className="border-4 border-red-500 rounded-xl px-3 py-1 rotate-[15deg]">
      <span className="text-red-500 text-xl font-black">SKIP ✗</span>
    </div>
  </motion.div>

  {/* UP — blue RECORD */}
  <motion.div
    className="absolute inset-0 flex items-start justify-center p-4"
    style={{ opacity: upOpacity, background: 'rgba(37,99,235,0.15)' }}
  >
    <div className="border-4 border-blue-500 rounded-xl px-3 py-1">
      <span className="text-blue-500 text-xl font-black">RECORD 🎬</span>
    </div>
  </motion.div>
</>
```

---

### 3.4 ActionButtonRow (tap fallback)

**File:** `src/features/swipe-deck/components/ActionButtonRow.tsx`

For users who don't swipe (accessibility, preference).

```tsx
<div className="flex items-center justify-center gap-4 pt-2">
  {/* Skip */}
  <motion.button
    onClick={() => onAction('left')}
    className="w-14 h-14 rounded-full border-2 border-red-200 bg-white flex items-center justify-center"
    style={{ boxShadow: '0 4px 12px rgba(239,68,68,0.15)' }}
    whileTap={{ scale: 0.92 }}
  >
    <X size={22} className="text-red-400" />
  </motion.button>

  {/* Record now */}
  <motion.button
    onClick={() => onAction('up')}
    className="w-12 h-12 rounded-full border-2 border-blue-200 bg-white flex items-center justify-center"
    whileTap={{ scale: 0.92 }}
  >
    <Video size={18} className="text-blue-400" />
  </motion.button>

  {/* Save */}
  <motion.button
    onClick={() => onAction('right')}
    className="w-14 h-14 rounded-full border-2 border-green-200 bg-white flex items-center justify-center"
    style={{ boxShadow: '0 4px 12px rgba(34,197,94,0.15)' }}
    whileTap={{ scale: 0.92 }}
  >
    <Check size={22} className="text-green-500" />
  </motion.button>
</div>
```

---

### 3.5 DailyTargetPill (sub-nav slot)

```tsx
// 6/10 progress pill — right slot in sub-nav
<div className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg ml-auto"
  style={{ background: 'rgba(255,107,0,0.08)', border: '1px solid rgba(255,107,0,0.20)' }}
>
  <span className="text-sm">🔥</span>
  <span className="text-[11px] font-semibold" style={{ color: '#ff6b00' }}>
    {completed}/10 today
  </span>
</div>
```

---

### 3.6 DailyTargetPopup (M37 — 10/10 celebration)

**Reuses:** `CelebrationModal` pattern from gamification system. Fires when `completed === 10`.

```tsx
<AnimatePresence>
  {showCelebration && (
    <>
      {/* Backdrop */}
      <motion.div className="fixed inset-0 bg-black/50 z-50"
        initial={{ opacity: 0 }} animate={{ opacity: 1 }} />

      {/* Card */}
      <motion.div
        className="fixed inset-x-4 top-1/2 -translate-y-1/2 z-50 bg-white rounded-2xl p-6 text-center"
        style={{ boxShadow: '0 24px 60px rgba(0,0,0,0.25)' }}
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ type: 'spring', stiffness: 300, damping: 20 }}
      >
        <p className="text-3xl mb-3">🏆</p>
        <p className="text-xl font-bold text-neutral-900">Congratulations!</p>
        <p className="text-sm text-neutral-500 mt-1">You hit 10 today!</p>
        <PointsEarnedBurst points={50} />
        <div className="flex gap-3 mt-5">
          <button onClick={onKeepGoing}
            className="flex-1 py-2.5 rounded-xl text-sm font-medium text-neutral-600 border border-neutral-200"
          >
            Keep Going
          </button>
          <button onClick={onViewSaved}
            className="flex-1 py-2.5 rounded-xl text-sm font-semibold text-white"
            style={{ background: 'linear-gradient(135deg, #ff0069, #833ab4)' }}
          >
            View Saved
          </button>
        </div>
      </motion.div>
    </>
  )}
</AnimatePresence>
```

**canvas-confetti** fires on mount when `showCelebration` becomes true.

---

### 3.7 SavedCard (M41)

**File:** `src/features/swipe-deck/components/SavedCard.tsx`

```tsx
interface SavedCardProps {
  item: SwipeDeckItem;
  savedAt: number;
  onMakeNow: () => void;
  onRemove: () => void;
}
```

```tsx
<div className="rounded-xl bg-white p-3 flex gap-3"
  style={{ border: '1px solid rgba(0,0,0,0.07)' }}
>
  <div className="w-14 h-14 rounded-lg overflow-hidden flex-shrink-0 bg-neutral-100">
    {item.thumbnailUrl
      ? <img src={item.thumbnailUrl} className="w-full h-full object-cover" />
      : <div className="w-full h-full flex items-center justify-center">
          <Play size={18} className="text-neutral-300" />
        </div>
    }
  </div>

  <div className="flex-1 min-w-0">
    <p className="text-sm font-semibold text-neutral-900 truncate">{item.title}</p>
    <p className="text-xs text-neutral-400 mt-0.5">
      Saved {formatDistanceToNow(savedAt)} ago · {item.tags.join(' · ')}
    </p>
    <div className="flex items-center gap-2 mt-2">
      <button
        onClick={onMakeNow}
        className="flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-semibold text-white"
        style={{ background: 'linear-gradient(135deg, #ff0069, #833ab4)' }}
      >
        <Video size={10} />
        Make it now
      </button>
      <button
        onClick={onRemove}
        className="p-1 rounded-md text-neutral-300 hover:text-red-400 transition-colors"
      >
        <X size={14} />
      </button>
    </div>
  </div>
</div>
```

---

### 3.8 WeeklyChallengeCard (M43)

**File:** `src/features/swipe-deck/components/WeeklyChallengeCard.tsx`

```tsx
interface WeeklyChallengeCardProps {
  theme: string;         // e.g. "Songkran Week"
  description: string;  // e.g. "Make 3 water festival videos this week"
  bonusPoints: number;  // e.g. 150
  endsAt: number;       // Unix ms
  progress: number;     // 0–3
  target: number;       // e.g. 3
}
```

Pinned above the swipe stack as a collapsible banner.

```tsx
<motion.div
  className="rounded-xl p-3 mb-3 cursor-pointer"
  style={{ background: 'linear-gradient(135deg, rgba(255,0,105,0.08), rgba(131,58,180,0.08))', border: '1px solid rgba(255,0,105,0.20)' }}
  onClick={() => setExpanded(!expanded)}
  layout
>
  <div className="flex items-center gap-2">
    <span className="text-lg">🏅</span>
    <div className="flex-1">
      <p className="text-xs font-bold" style={{ color: '#ff0069' }}>Weekly Challenge</p>
      <p className="text-sm font-semibold text-neutral-900">{theme}</p>
    </div>
    <div className="flex items-center gap-1.5">
      <span className="text-[11px] font-semibold" style={{ color: '#ff6b00' }}>+{bonusPoints}pts</span>
      <ChevronDown size={14} className={cn('text-neutral-400 transition-transform', expanded && 'rotate-180')} />
    </div>
  </div>
  {expanded && (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="mt-2 space-y-2"
    >
      <p className="text-xs text-neutral-600">{description}</p>
      <div className="flex items-center gap-2">
        <div className="flex-1 h-1.5 rounded-full bg-white/60 overflow-hidden">
          <div
            className="h-full rounded-full"
            style={{
              width: `${(progress / target) * 100}%`,
              background: 'linear-gradient(135deg, #ff0069, #833ab4)',
            }}
          />
        </div>
        <span className="text-[11px] text-neutral-500">{progress}/{target} done</span>
      </div>
      <p className="text-[11px] text-neutral-400">Ends {format(endsAt, 'EEE MMM d')}</p>
    </motion.div>
  )}
</motion.div>
```

---

## 4. INTERACTION SPEC

### 4.1 Swipe right → Save (M32)
```
Drag offset x > 100px → release
  → SwipeCard flies off right (spring: x → 500, rotate → 20deg)
  → Next card animates to front (scale 0.96 → 1.0)
  → Convex mutation: add to model's savedItems
  → Toast: "Saved! Find it in your list."
  → savedCount + 1, dailyCompleted + 1
  → PointsStatPill +5 pts (M42)
```

### 4.2 Swipe up → Record now (M33)
```
Drag offset y < -80px → release
  → SwipeCard flies off top
  → Opens OneTapRecord flow (same as content-requests)
  → After record/upload: card marked as 'made', dailyCompleted + 1
  → PointsStatPill +10 pts
```

### 4.3 Swipe left → Skip (M34)
```
Drag offset x < -100px → release
  → SwipeCard flies off left
  → Convex mutation: log 'skipped' on item (trains algorithm)
  → dailyCompleted does NOT increment (skip doesn't count toward 10)
  → PointsStatPill +0 pts (intentional — no reward for skipping)
```

### 4.4 Hit 10/10 (M37)
```
dailyCompleted reaches 10
  → DailyTargetPopup fires
  → canvas-confetti burst
  → PointsEarnedBurst: +50 pts
  → DailyTargetPill updates: "10/10 ✓"
  → User can continue swiping (M38) — deck doesn't close
```

### 4.5 Saved → Make it now (M41)
```
User taps "Make it now" on SavedCard
  → Navigate to /model/requests with pre-filled context
  → OR open OneTapRecord modal in-place
```

### 4.6 Daily deck refresh (M40)
```
Convex scheduled function fires daily at midnight
  → Generates 10 new curated items for each model
  → Based on model's niche, past swipe history, agency R&D table
  → DailyTargetPill resets to "0/10"
  → Push notification: "Your daily 10 are ready! 🃏"
```

---

## 5. GAMIFICATION INTEGRATION

| Trigger | Points | Display |
|---------|--------|---------|
| Swipe right (save) | +5 pts | Card flies + pts flash |
| Swipe up (record) | +10 pts | Card flies + pts flash |
| Hit 10/10 daily target | +50 pts | DailyTargetPopup |
| Complete weekly challenge | +150 pts | WeeklyChallengeCard completion |
| 7-day swipe streak | +100 pts | StreakBadge in sub-nav |

---

## 6. REUSE INSTRUCTIONS

| Component | Source | Notes |
|-----------|--------|-------|
| `SwipeStack` | `@/features/hub-swipe/` | Reuse directly — portable drag deck |
| `SwipeAuditLog` | `@/features/hub-swipe/` | Reuse for History tab |
| `PointsEarnedBurst` | `@/features/content-requests/` | Reuse for DailyTargetPopup |
| `PointsStatPill` | `@/features/content-requests/` | Shared gamification |
| `OneTapRecord` | `@/features/content-requests/hooks/` | Reuse for "Record now" path |

---

## 7. FILE STRUCTURE

```
src/features/swipe-deck/
  components/
    SwipeDeckFeaturePage.tsx
    SwipeCard.tsx               ← adapted from hub-swipe
    TrendingBadge.tsx
    SwipeFeedbackOverlay.tsx
    ActionButtonRow.tsx
    DailyTargetPill.tsx
    DailyTargetPopup.tsx
    SavedCard.tsx
    WeeklyChallengeCard.tsx
    GestureHintStrip.tsx        ← one-time tutorial strip
    index.ts
  hooks/
    useSwipeDeck.ts             ← deck state, swipe handlers, Convex mutations
    useDailyTarget.ts           ← progress tracking
  types.ts

src/app/model/swipe/page.tsx   ← thin wrapper only
```

---

## 8. DESIGN TOKEN SUMMARY

| Token | Value | Use |
|-------|-------|-----|
| OFM gradient | `linear-gradient(135deg, #ff0069, #833ab4)` | CTAs, active elements, challenge banner |
| Save green | `rgba(34,197,94,...)` | Right-swipe overlay |
| Skip red | `rgba(239,68,68,...)` | Left-swipe overlay |
| Record blue | `rgba(37,99,235,...)` | Up-swipe overlay |
| Trending orange | `#ff6b00` | TrendingBadge |
| Card shadow | `0 8px 32px rgba(0,0,0,0.12)` | SwipeCard elevation |
| Stack shadow (rear cards) | `0 4px 16px rgba(0,0,0,0.08)` | Behind cards |
