# Earnings Wireframe + Component Spec
# Route: /model/earnings
# Features: M26, M27, M28, M29, M30
# Layout: MOBILE-FIRST (375px)
# Last updated: 2026-04-13

---

## 0. Context Summary

The model's personal earnings dashboard. Mobile-first, 375px. Big number first — immediately
satisfying. Platform + content-type breakdown below. Week-over-week comparison, goal tracker,
and payday countdown. Read-only — no input except setting the earnings goal.
OFM accent: `linear-gradient(135deg, #ff0069, #833ab4)`.

Design philosophy: "Treat models like 5 year olds" — one giant number, green arrows, a
progress bar that fills up towards goal, and a fun countdown to payday.

---

## 1. ASCII WIREFRAME — MOBILE (375px)

```
┌─────────────────────────────────────────┐  375px
│  ░░░ IssoSidebarShell (56px icon rail) ░│
│                                         │
│  ┌───────────────────────────────────┐  │
│  │ ContentPageShell                  │  │
│  │                                   │  │
│  │ ┌─ ROW 1 — Header ──────────────┐ │  │  h-14 px-3
│  │ │ [💰] My Earnings  [★ 920 pts] │ │  │
│  │ └───────────────────────────────┘ │  │
│  │                                   │  │
│  │ ┌─ ROW 2 — Sub-nav ─────────────┐ │  │  px-3 py-2
│  │ │ [This Month ●] [Last Month]   │ │  │
│  │ │                   [▲ +12% wk] │ │  │
│  │ └───────────────────────────────┘ │  │
│  │                                   │  │
│  │ ┌─ ROW 3 — Content ─────────────┐ │  │  overflow-y-auto px-4 py-4
│  │ │                               │ │  │
│  │ │ ┌─ BigEarningsNumber ───────┐ │ │  │
│  │ │ │                           │ │ │  │
│  │ │ │   THIS MONTH              │ │ │  │
│  │ │ │                           │ │ │  │
│  │ │ │        £4,820             │ │ │  │  text-5xl font-bold
│  │ │ │                           │ │ │  │
│  │ │ │   ▲ Up £580 from last wk  │ │ │  │
│  │ │ │   (▲ +12% vs last month)  │ │ │  │
│  │ │ │                           │ │ │  │
│  │ │ └───────────────────────────┘ │ │  │
│  │ │                               │ │  │
│  │ │ ┌─ PaydayCountdown ─────────┐ │ │  │
│  │ │ │  💰 PAYDAY IN             │ │ │  │
│  │ │ │                           │ │ │  │
│  │ │ │     ┌────┐ ┌────┐ ┌────┐  │ │ │  │
│  │ │ │     │ 04 │:│ 12 │:│ 38 │  │ │ │  │
│  │ │ │     │days│ │ hrs│ │ min│  │ │ │  │
│  │ │ │     └────┘ └────┘ └────┘  │ │ │  │
│  │ │ │  Next payout: April 20    │ │ │  │
│  │ │ └───────────────────────────┘ │ │  │
│  │ │                               │ │  │
│  │ │ ┌─ GoalTracker ─────────────┐ │ │  │
│  │ │ │  MONTHLY GOAL             │ │ │  │
│  │ │ │                           │ │ │  │
│  │ │ │  £4,820 / £6,000          │ │ │  │
│  │ │ │  ████████████░░░░  80%    │ │ │  │
│  │ │ │                           │ │ │  │
│  │ │ │  £1,180 to go!  [Edit]    │ │ │  │
│  │ │ └───────────────────────────┘ │ │  │
│  │ │                               │ │  │
│  │ │  BREAKDOWN                    │ │  │
│  │ │                               │ │  │
│  │ │ ┌─ PlatformBreakdown ───────┐ │ │  │
│  │ │ │  OnlyFans    £2,900  60%  │ │ │  │
│  │ │ │  ████████████████░░░░░    │ │ │  │
│  │ │ │                           │ │ │  │
│  │ │ │  Fans.ly     £1,920  40%  │ │ │  │
│  │ │ │  █████████████░░░░░░      │ │ │  │
│  │ │ └───────────────────────────┘ │ │  │
│  │ │                               │ │  │
│  │ │ ┌─ ContentTypeBreakdown ────┐ │ │  │
│  │ │ │  GFE      £2,100  44%    │ │ │  │
│  │ │ │  Fitness  £1,400  29%    │ │ │  │
│  │ │ │  Meme     £800    17%    │ │ │  │
│  │ │ │  Other    £520    10%    │ │ │  │
│  │ │ └───────────────────────────┘ │ │  │
│  │ │                               │ │  │
│  │ └───────────────────────────────┘ │  │
│  └───────────────────────────────────┘  │
└─────────────────────────────────────────┘
```

---

## 2. COMPONENT TREE

```
EarningsFeaturePage                     ← default export
│
├── ContentPageShell
│   ├── [header slot]
│   │   ├── ProductIcon (money/earnings icon)
│   │   ├── "My Earnings" title
│   │   └── PointsStatPill
│   │
│   ├── [sub-nav slot]
│   │   ├── PeriodTabs ("This Month" / "Last Month")
│   │   └── WeeklyDeltaBadge (▲ +12% wk)        ← inline right slot
│   │
│   └── [content slot]
│       └── motion.div (staggerChildren 0.08)
│           ├── BigEarningsNumber               ← NEW (M26)
│           ├── PaydayCountdown                 ← NEW (M30)
│           ├── GoalTracker                     ← NEW (M29)
│           └── section: "Breakdown"
│               ├── PlatformBreakdown           ← NEW (M26, M27)
│               └── ContentTypeBreakdown        ← NEW (M27)
```

---

## 3. PER-COMPONENT SPECS

---

### 3.1 BigEarningsNumber

**File:** `src/features/earnings/components/BigEarningsNumber.tsx`

```tsx
interface BigEarningsNumberProps {
  amount: number;          // e.g. 4820
  currency?: string;       // default "£"
  period: string;          // e.g. "This Month"
  weeklyDelta?: number;    // absolute £ change this week
  monthlyDeltaPct?: number; // % vs last month
}
```

**Tailwind:**
```tsx
<motion.div
  className="rounded-2xl p-5 text-center"
  style={{
    background: 'linear-gradient(135deg, rgba(255,0,105,0.06), rgba(131,58,180,0.06))',
    border: '1px solid rgba(255,0,105,0.15)',
  }}
  initial={{ opacity: 0, scale: 0.95 }}
  animate={{ opacity: 1, scale: 1 }}
  transition={{ duration: 0.5, ease: [0.25, 0.1, 0.25, 1] }}
>
  <p className="text-[11px] uppercase tracking-[0.35em] text-neutral-400 mb-2">
    {period}
  </p>

  {/* Big number with count-up animation */}
  <motion.p
    className="text-5xl font-bold tracking-tight"
    style={{ color: '#ff0069' }}
  >
    <CountUp
      from={0}
      to={amount}
      prefix={currency ?? '£'}
      duration={1.2}
      separator=","
    />
  </motion.p>

  {/* Deltas */}
  <div className="flex items-center justify-center gap-3 mt-3">
    {weeklyDelta !== undefined && (
      <span className={cn(
        'text-sm font-medium',
        weeklyDelta >= 0 ? 'text-green-600' : 'text-red-500'
      )}>
        {weeklyDelta >= 0 ? '▲' : '▼'} {currency ?? '£'}{Math.abs(weeklyDelta)} this week
      </span>
    )}
    {monthlyDeltaPct !== undefined && (
      <span className={cn(
        'text-xs px-2 py-0.5 rounded-full font-semibold',
        monthlyDeltaPct >= 0
          ? 'bg-green-50 text-green-700'
          : 'bg-red-50 text-red-600'
      )}>
        {monthlyDeltaPct >= 0 ? '▲' : '▼'} {Math.abs(monthlyDeltaPct)}% vs last month
      </span>
    )}
  </div>
</motion.div>
```

**CountUp:** Use `framer-motion` `useMotionValue` + `useTransform` for the count-up animation —
no external library needed.

---

### 3.2 PaydayCountdown

**File:** `src/features/earnings/components/PaydayCountdown.tsx`

```tsx
interface PaydayCountdownProps {
  nextPaydayAt: number;    // Unix ms — next scheduled payout date
  currency?: string;
}
```

**Tailwind:**
```tsx
<div className="rounded-xl bg-white p-4" style={{ border: '1px solid rgba(0,0,0,0.07)' }}>
  <div className="flex items-center gap-2 mb-3">
    <span className="text-lg">💰</span>
    <p className="text-[11px] uppercase tracking-[0.35em] text-neutral-400">Payday In</p>
  </div>

  {/* Countdown digits */}
  <div className="flex items-center justify-center gap-2">
    {[
      { value: days, label: 'days' },
      { value: hours, label: 'hrs' },
      { value: minutes, label: 'min' },
    ].map((unit, i) => (
      <div key={unit.label} className="flex items-center gap-2">
        <div className="flex flex-col items-center">
          <div className="w-14 h-14 rounded-xl flex items-center justify-center"
            style={{ background: 'linear-gradient(135deg, rgba(255,0,105,0.08), rgba(131,58,180,0.08))', border: '1px solid rgba(255,0,105,0.15)' }}
          >
            <span className="text-2xl font-bold" style={{ color: '#ff0069' }}>
              {String(unit.value).padStart(2, '0')}
            </span>
          </div>
          <span className="text-[10px] text-neutral-400 mt-1">{unit.label}</span>
        </div>
        {i < 2 && <span className="text-lg font-bold text-neutral-300 mb-4">:</span>}
      </div>
    ))}
  </div>

  <p className="text-xs text-neutral-500 text-center mt-3">
    Next payout: {format(nextPaydayAt, 'MMMM d')}
  </p>
</div>
```

**Update interval:** `setInterval` every 60 seconds (minute-level precision is sufficient).
Cleanup on unmount per DeadlineCountdown pattern.

---

### 3.3 GoalTracker

**File:** `src/features/earnings/components/GoalTracker.tsx`

```tsx
interface GoalTrackerProps {
  current: number;
  goal: number;
  currency?: string;
  onEditGoal: (newGoal: number) => void;
}
```

**Tailwind:**
```tsx
<div className="rounded-xl bg-white p-4" style={{ border: '1px solid rgba(0,0,0,0.07)' }}>
  <div className="flex items-center justify-between mb-3">
    <p className="text-[11px] uppercase tracking-[0.35em] text-neutral-400">Monthly Goal</p>
    <button
      onClick={() => setEditMode(true)}
      className="text-xs text-neutral-400 hover:text-neutral-600 flex items-center gap-1 transition-colors"
    >
      <Pencil size={10} />
      Edit
    </button>
  </div>

  <div className="flex items-baseline gap-1 mb-3">
    <span className="text-xl font-bold text-neutral-900">
      {currency ?? '£'}{current.toLocaleString()}
    </span>
    <span className="text-sm text-neutral-400">/ {currency ?? '£'}{goal.toLocaleString()}</span>
  </div>

  {/* Progress bar */}
  <div className="h-3 rounded-full bg-neutral-100 overflow-hidden relative">
    <motion.div
      className="h-full rounded-full"
      style={{ background: 'linear-gradient(135deg, #ff0069, #833ab4)' }}
      animate={{ width: `${Math.min((current / goal) * 100, 100)}%` }}
      transition={{ duration: 0.8, ease: [0.25, 0.1, 0.25, 1] }}
    />
    {/* Milestone ticks at 25%, 50%, 75% */}
    {[25, 50, 75].map(pct => (
      <div
        key={pct}
        className="absolute top-0 bottom-0 w-px bg-white/40"
        style={{ left: `${pct}%` }}
      />
    ))}
  </div>

  <p className="text-xs text-neutral-500 mt-2">
    {current >= goal
      ? '🎉 Goal reached!'
      : `${currency ?? '£'}${(goal - current).toLocaleString()} to go!`
    }
  </p>
</div>

{/* Edit goal modal */}
{editMode && (
  <GoalEditModal
    currentGoal={goal}
    currency={currency}
    onSave={newGoal => { onEditGoal(newGoal); setEditMode(false); }}
    onClose={() => setEditMode(false)}
  />
)}
```

**GoalEditModal:** Standard modal pattern from DESIGN_SYSTEM_REFERENCE §12. Simple number input.

---

### 3.4 PlatformBreakdown

**File:** `src/features/earnings/components/PlatformBreakdown.tsx`

```tsx
interface PlatformEarning {
  platform: string;   // e.g. 'onlyfans', 'fansly'
  amount: number;
  percentOfTotal: number;
}

interface PlatformBreakdownProps {
  platforms: PlatformEarning[];
  currency?: string;
}
```

**Tailwind:**
```tsx
<div className="rounded-xl bg-white p-4" style={{ border: '1px solid rgba(0,0,0,0.07)' }}>
  <p className="text-[11px] uppercase tracking-[0.35em] text-neutral-400 mb-3">By Platform</p>
  <div className="space-y-3">
    {platforms.map((p, i) => (
      <div key={p.platform}>
        <div className="flex items-center justify-between mb-1">
          <div className="flex items-center gap-2">
            <PlatformIcon platform={p.platform} size={14} />
            <span className="text-sm text-neutral-700 capitalize">{p.platform}</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-sm font-semibold text-neutral-900">
              {currency ?? '£'}{p.amount.toLocaleString()}
            </span>
            <span className="text-[11px] text-neutral-400">{p.percentOfTotal}%</span>
          </div>
        </div>
        <div className="h-1.5 rounded-full bg-neutral-100 overflow-hidden">
          <motion.div
            className="h-full rounded-full"
            style={{ background: i === 0
              ? 'linear-gradient(135deg, #ff0069, #833ab4)'
              : `rgba(255,0,105,${0.4 - i * 0.1})`
            }}
            animate={{ width: `${p.percentOfTotal}%` }}
            transition={{ duration: 0.7, delay: i * 0.1 }}
          />
        </div>
      </div>
    ))}
  </div>
</div>
```

---

### 3.5 ContentTypeBreakdown

**File:** `src/features/earnings/components/ContentTypeBreakdown.tsx`

```tsx
interface ContentTypeEarning {
  type: string;       // e.g. 'GFE', 'Fitness', 'Meme', 'Other'
  amount: number;
  percentOfTotal: number;
}

interface ContentTypeBreakdownProps {
  types: ContentTypeEarning[];
  currency?: string;
}
```

**Layout:** Same stacked bar pattern as PlatformBreakdown. Each bar uses a different shade
from the OFM gradient family.

**Color palette for content types:**
```ts
const contentTypeColors = {
  GFE:     '#ff0069',
  Fitness: '#833ab4',
  Meme:    '#2563eb',
  Other:   '#9ca3af',
};
```

---

## 4. INTERACTION SPEC

### 4.1 Period tab switch
```
User taps "This Month" / "Last Month"
  → AnimatePresence mode="wait" transitions content
  → Convex query refires with new date range
  → BigEarningsNumber count-up re-animates from 0
  → All breakdown bars re-animate
```

### 4.2 Edit goal
```
User taps [Edit] on GoalTracker
  → GoalEditModal opens (scale 0.95 → 1, spring)
  → Number input, pre-filled with current goal
  → On save: Convex mutation updates model's goal
  → GoalTracker bar re-animates with new denominator
  → Toast: "Goal updated to £X,XXX"
```

### 4.3 Goal reached
```
current >= goal
  → GoalTracker shows "🎉 Goal reached!" text
  → Bar shows full gradient (100%)
  → CelebrationModal fires (confetti burst, "+50 pts GOAL HIT!")
  → Only fires once per goal period (tracked in Convex)
```

### 4.4 Payday countdown hits 0
```
countdown reaches 0
  → PaydayCountdown shows "🎉 Payday today!"
  → Pulsing gradient border animation on the card
  → Push notification sent (server-side Convex scheduled fn)
```

---

## 5. GAMIFICATION INTEGRATION

| Trigger | Points | Display |
|---------|--------|---------|
| Visit earnings page | +5 pts | Silent |
| Hit monthly goal | +50 pts | CelebrationModal + confetti |
| Beat last month's earnings | +25 pts | WeeklyDeltaBadge glow |
| 3 months in a row above goal | +100 pts | Special badge unlocked |

PointsStatPill in header. GoalTracker is the primary gamification surface on this page.

---

## 6. REUSE INSTRUCTIONS

| Component | Source | Notes |
|-----------|--------|-------|
| `PointsStatPill` | `@/features/content-requests/` | Shared gamification |
| Modal pattern | Design system §12 | GoalEditModal uses standard modal |
| `CelebrationModal` | `@/features/gamification/` (shared) | Goal-hit celebration |

---

## 7. FILE STRUCTURE

```
src/features/earnings/
  components/
    EarningsFeaturePage.tsx
    BigEarningsNumber.tsx
    PaydayCountdown.tsx
    GoalTracker.tsx
    GoalEditModal.tsx
    PlatformBreakdown.tsx
    ContentTypeBreakdown.tsx
    index.ts
  hooks/
    useEarningsData.ts    ← Convex + Google Sheets sync
  types.ts

src/app/model/earnings/page.tsx    ← thin wrapper only
```

---

## 8. DESIGN TOKEN SUMMARY

| Token | Value | Use |
|-------|-------|-----|
| OFM gradient | `linear-gradient(135deg, #ff0069, #833ab4)` | BigEarningsNumber bg, progress bars, countdown boxes |
| OFM pink | `#ff0069` | Big number text, primary bar fill |
| Growth green | `text-green-600` | Positive deltas |
| Decline red | `text-red-500` | Negative deltas |
| Card border | `rgba(0,0,0,0.07)` | All white-surface cards |
| Hero card border | `rgba(255,0,105,0.15)` | BigEarningsNumber card |
