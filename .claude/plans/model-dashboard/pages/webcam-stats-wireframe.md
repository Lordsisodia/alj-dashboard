# Webcam Stats Wireframe + Component Spec
# Route: /model/webcam/stats
# Features: M2, M10, M11
# Layout: LAPTOP (desktop-first — streaming is done on laptop)
# Last updated: 2026-04-13

---

## 0. Context Summary

The Streaming Stats page is the model's historical performance view. Desktop layout (laptop).
Shows platform earnings grid, viewer trends over time, streak counter, and a shareable
post-stream summary card. Read-only — no actions except "Share" on the post-stream card.
OFM accent: `linear-gradient(135deg, #ff0069, #833ab4)`.

---

## 1. ASCII WIREFRAME — LAPTOP (1280px)

```
┌────────────────────────────────────────────────────────────────────────────────────────────┐
│  IssoSidebarShell                                                                          │
│                                                                                            │
│  ┌─────────────────────────────────────────────────────────────────────────────────────┐   │
│  │ ContentPageShell                                                                    │   │
│  │                                                                                     │   │
│  │ ┌─ ROW 1 — Header ─────────────────────────────────────────────────────────────┐   │   │
│  │ │  [📹 icon]  Webcam              [★ 1,240 pts]         [7d ▾] range toggle    │   │   │
│  │ └──────────────────────────────────────────────────────────────────────────────┘   │   │
│  │                                                                                     │   │
│  │ ┌─ ROW 2 — Sub-nav ────────────────────────────────────────────────────────────┐   │   │
│  │ │  [🏠 Home]  [📊 Stats ●]  [📅 Calendar]           [🔥 3-day streak]          │   │   │
│  │ └──────────────────────────────────────────────────────────────────────────────┘   │   │
│  │                                                                                     │   │
│  │ ┌─ ROW 3 — Content ────────────────────────────────────────────────────────────┐   │   │
│  │ │                                                                              │   │   │
│  │ │  ┌─ StreakCounter ───────────────────────────────────────────────────────┐   │   │   │
│  │ │  │  🔥 3-Day Streaming Streak!   [████████░░░░░░░  Day 3 of 7 weekly goal] │   │   │
│  │ │  │  "Keep going — 4 more days for the weekly badge!"      [+150 pts 🎁]   │   │   │
│  │ │  └──────────────────────────────────────────────────────────────────────┘   │   │   │
│  │ │                                                                              │   │   │
│  │ │  ┌─ PlatformEarningsGrid ────────────────────────────────────────────────┐  │   │   │
│  │ │  │  EARNINGS BY PLATFORM — Last 7 days              Total: £2,340        │  │   │   │
│  │ │  │                                                                       │  │   │   │
│  │ │  │  ┌────────────┐ ┌────────────┐ ┌────────────┐ ┌────────────┐        │  │   │   │
│  │ │  │  │ OnlyFans   │ │  Fansly    │ │ Chaturbate │ │ Stripchat  │        │  │   │   │
│  │ │  │  │  £1,200    │ │   £680     │ │   £320     │ │   £140     │        │  │   │   │
│  │ │  │  │  ████████  │ │  ████░░    │ │  ██░░░░    │ │  █░░░░░    │        │  │   │   │
│  │ │  │  │  51%       │ │  29%       │ │  14%       │ │  6%        │        │  │   │   │
│  │ │  │  │  ▲ +8%     │ │  ▲ +3%    │ │  ▼ -2%     │ │  ─ 0%     │        │  │   │   │
│  │ │  │  └────────────┘ └────────────┘ └────────────┘ └────────────┘        │  │   │   │
│  │ │  │                                                                       │  │   │   │
│  │ │  │  + 13 more platforms...  [Show all]                                   │  │   │   │
│  │ │  └───────────────────────────────────────────────────────────────────────┘  │   │   │
│  │ │                                                                              │   │   │
│  │ │  ┌─ ViewerTrendChart ──────────────────────┐  ┌─ PostStreamCard ──────────┐ │   │   │
│  │ │  │  VIEWER TREND                           │  │  LAST STREAM SUMMARY      │ │   │   │
│  │ │  │                                         │  │                           │ │   │   │
│  │ │  │  Peak: 412                              │  │  Mon Apr 7, 8:00–10:42 PM │ │   │   │
│  │ │  │  400 ┤ ╭──╮                             │  │                           │ │   │   │
│  │ │  │  300 ┤╭╯  ╰──╮    ╭──╮                 │  │  👁 Peak viewers: 412     │ │   │   │
│  │ │  │  200 ┤╯       ╰──╯   ╰──               │  │  ⏱ Duration: 2h 42m      │ │   │   │
│  │ │  │  100 ┤                                  │  │  💰 Earned: £287          │ │   │   │
│  │ │  │    0 ┼──┬──┬──┬──┬──┬──┬──             │  │  🔥 Streak: Day 3         │ │   │   │
│  │ │  │       Mon Tue Wed Thu Fri Sat Sun       │  │                           │ │   │   │
│  │ │  │                                         │  │  ╔═══════════════════════╗ │ │   │   │
│  │ │  │  Avg viewers: 284   Peak: 412           │  │  ║  📤 Share Summary     ║ │ │   │   │
│  │ │  └─────────────────────────────────────────┘  │  ╚═══════════════════════╝ │ │   │   │
│  │ │                                               └───────────────────────────┘ │   │   │
│  │ │                                                                              │   │   │
│  │ └──────────────────────────────────────────────────────────────────────────────┘   │   │
│  └─────────────────────────────────────────────────────────────────────────────────────┘   │
└────────────────────────────────────────────────────────────────────────────────────────────┘
```

---

## 2. COMPONENT TREE

```
WebcamStatsFeaturePage                      ← default export
│
├── ContentPageShell
│   ├── [header slot]
│   │   ├── ProductIcon (webcam)
│   │   ├── "Webcam" title
│   │   ├── PointsStatPill
│   │   └── DayRangeToggle (7d / 30d / 90d)  ← REUSE from §7d design system
│   │
│   ├── [sub-nav slot]
│   │   ├── Tab: "Home" → /model/webcam
│   │   ├── Tab: "Stats" (active)
│   │   ├── Tab: "Calendar" → /model/webcam/calendar
│   │   └── StreakBadge (shared with go-live)
│   │
│   └── [content slot]
│       ├── StreakCounter                    ← NEW (M11)
│       ├── PlatformEarningsGrid            ← NEW (M2)
│       └── div.flex.gap-6
│           ├── ViewerTrendChart (flex-1)   ← NEW (M2)
│           └── PostStreamCard (w-80)       ← NEW (M10)
```

---

## 3. PER-COMPONENT SPECS

---

### 3.1 StreakCounter

**File:** `src/features/webcam/components/StreakCounter.tsx`

```tsx
interface StreakCounterProps {
  currentStreak: number;    // e.g. 3
  weeklyGoal: number;       // e.g. 7
  bonusPointsAvailable: number; // e.g. 150
}
```

**Tailwind:**
```tsx
<motion.div
  className="rounded-xl px-5 py-4 flex items-center gap-4"
  style={{ background: 'rgba(255,107,0,0.06)', border: '1px solid rgba(255,107,0,0.20)' }}
  initial={{ opacity: 0, y: -8 }}
  animate={{ opacity: 1, y: 0 }}
>
  <span className="text-3xl">🔥</span>
  <div className="flex-1">
    <p className="text-sm font-semibold text-neutral-900">
      {currentStreak}-Day Streaming Streak!
    </p>
    <div className="flex items-center gap-3 mt-1.5">
      <div className="flex-1 h-1.5 rounded-full bg-orange-100 overflow-hidden">
        <motion.div
          className="h-full rounded-full bg-gradient-to-r from-[#ff6b00] to-[#ffa726]"
          animate={{ width: `${(currentStreak / weeklyGoal) * 100}%` }}
          transition={{ duration: 0.7, ease: [0.25, 0.1, 0.25, 1] }}
        />
      </div>
      <span className="text-xs text-neutral-500 whitespace-nowrap">
        Day {currentStreak} of {weeklyGoal} weekly goal
      </span>
    </div>
    <p className="text-xs text-neutral-500 mt-1">
      Keep going — {weeklyGoal - currentStreak} more days for the weekly badge!
    </p>
  </div>
  <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg"
    style={{ background: 'rgba(255,107,0,0.10)', border: '1px solid rgba(255,107,0,0.25)' }}
  >
    <span className="text-sm">🎁</span>
    <span className="text-xs font-semibold" style={{ color: '#ff6b00' }}>
      +{bonusPointsAvailable} pts
    </span>
  </div>
</motion.div>
```

---

### 3.2 PlatformEarningsGrid

**File:** `src/features/webcam/components/PlatformEarningsGrid.tsx`

```tsx
interface PlatformEarning {
  platform: string;
  amount: number;
  percentOfTotal: number;
  weekOverWeekDelta: number;  // e.g. 8 means +8%, -2 means -2%
}

interface PlatformEarningsGridProps {
  earnings: PlatformEarning[];
  totalEarnings: number;
  currency?: string;
  days: 7 | 30 | 90;
}
```

**Layout:** Show top 4 platforms in a 4-column grid. "Show all" expands to full list.

**Tailwind:**
```tsx
<div className="rounded-xl bg-white p-5" style={{ border: '1px solid rgba(0,0,0,0.07)' }}>
  <div className="flex items-center justify-between mb-4">
    <p className="text-[11px] uppercase tracking-[0.35em] text-neutral-400">
      Earnings by Platform — Last {days} days
    </p>
    <p className="text-sm font-semibold text-neutral-900">
      Total: {currency}{totalEarnings.toLocaleString()}
    </p>
  </div>

  <div className="grid grid-cols-4 gap-3">
    {topFour.map(p => (
      <div key={p.platform} className="rounded-lg bg-neutral-50 px-4 py-3 space-y-2"
        style={{ border: '1px solid rgba(0,0,0,0.05)' }}
      >
        <div className="flex items-center gap-2">
          <PlatformIcon platform={p.platform} size={16} />
          <span className="text-xs font-medium text-neutral-600 capitalize">{p.platform}</span>
        </div>
        <p className="text-lg font-semibold text-neutral-900">
          {currency}{p.amount.toLocaleString()}
        </p>
        {/* animated bar fill proportional to percentOfTotal */}
        <div className="h-1 rounded-full bg-neutral-200 overflow-hidden">
          <motion.div
            className="h-full rounded-full"
            style={{ background: 'linear-gradient(135deg, #ff0069, #833ab4)' }}
            animate={{ width: `${p.percentOfTotal}%` }}
            transition={{ duration: 0.7, delay: 0.1 * index }}
          />
        </div>
        <div className="flex items-center justify-between">
          <span className="text-[11px] text-neutral-400">{p.percentOfTotal}%</span>
          <span className={cn(
            'text-[11px] font-semibold',
            p.weekOverWeekDelta > 0 ? 'text-green-600' :
            p.weekOverWeekDelta < 0 ? 'text-red-500' : 'text-neutral-400'
          )}>
            {p.weekOverWeekDelta > 0 ? '▲' : p.weekOverWeekDelta < 0 ? '▼' : '─'}
            {' '}{Math.abs(p.weekOverWeekDelta)}%
          </span>
        </div>
      </div>
    ))}
  </div>

  {earnings.length > 4 && (
    <button
      onClick={() => setShowAll(!showAll)}
      className="mt-3 w-full text-xs text-neutral-400 hover:text-neutral-600 py-2 transition-colors"
    >
      {showAll ? 'Show less ↑' : `+ ${earnings.length - 4} more platforms... Show all`}
    </button>
  )}
</div>
```

---

### 3.3 ViewerTrendChart

**File:** `src/features/webcam/components/ViewerTrendChart.tsx`

```tsx
interface ViewerDataPoint {
  date: string;       // e.g. "Mon"
  viewers: number;
  peakViewers: number;
}

interface ViewerTrendChartProps {
  data: ViewerDataPoint[];
  avgViewers: number;
  peakViewers: number;
}
```

**Chart implementation:** Custom Framer Motion bars (per design system rule §16 item 4 —
**no chart libraries**). Render as animated vertical bars with a smooth line overlay using
SVG `<polyline>`.

```tsx
<div className="rounded-xl bg-white p-5 flex-1" style={{ border: '1px solid rgba(0,0,0,0.07)' }}>
  <div className="flex items-center justify-between mb-4">
    <p className="text-[11px] uppercase tracking-[0.35em] text-neutral-400">Viewer Trend</p>
    <div className="flex items-center gap-4">
      <span className="text-xs text-neutral-500">Avg: {avgViewers}</span>
      <span className="text-xs font-semibold text-neutral-900">Peak: {peakViewers}</span>
    </div>
  </div>

  {/* SVG bar chart + polyline */}
  <div className="relative h-32">
    <svg className="w-full h-full">
      {/* bars */}
      {data.map((d, i) => (
        <motion.rect
          key={d.date}
          x={`${(i / data.length) * 100 + 1}%`}
          width={`${(1 / data.length) * 100 - 2}%`}
          y={`${100 - (d.viewers / maxViewers) * 100}%`}
          height={`${(d.viewers / maxViewers) * 100}%`}
          rx={3}
          fill="rgba(255,0,105,0.12)"
          initial={{ scaleY: 0 }}
          animate={{ scaleY: 1 }}
          style={{ transformOrigin: 'bottom' }}
          transition={{ duration: 0.5, delay: i * 0.05 }}
        />
      ))}
      {/* polyline connecting peaks */}
      <motion.polyline
        points={data.map((d, i) =>
          `${(i / (data.length - 1)) * 100}%,${100 - (d.viewers / maxViewers) * 100}%`
        ).join(' ')}
        fill="none"
        stroke="#ff0069"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        initial={{ pathLength: 0 }}
        animate={{ pathLength: 1 }}
        transition={{ duration: 1, ease: 'easeOut' }}
      />
    </svg>
  </div>

  {/* x-axis labels */}
  <div className="flex justify-between mt-2">
    {data.map(d => (
      <span key={d.date} className="text-[10px] text-neutral-400">{d.date}</span>
    ))}
  </div>
</div>
```

---

### 3.4 PostStreamCard

**File:** `src/features/webcam/components/PostStreamCard.tsx`

```tsx
interface PostStreamSummary {
  date: string;          // e.g. "Mon Apr 7"
  startTime: string;     // e.g. "8:00 PM"
  endTime: string;       // e.g. "10:42 PM"
  peakViewers: number;
  durationMin: number;
  earnings: number;
  streakDay: number;
  currency?: string;
}

interface PostStreamCardProps {
  summary: PostStreamSummary | null;
  onShare: () => void;
}
```

**Tailwind:**
```tsx
<div className="rounded-xl bg-white p-5 w-80 space-y-3" style={{ border: '1px solid rgba(0,0,0,0.07)' }}>
  <p className="text-[11px] uppercase tracking-[0.35em] text-neutral-400">Last Stream</p>

  {summary ? (
    <>
      <p className="text-xs font-medium text-neutral-600">
        {summary.date}, {summary.startTime}–{summary.endTime}
      </p>

      <div className="space-y-2">
        {[
          { icon: '👁', label: `Peak viewers: ${summary.peakViewers}` },
          { icon: '⏱', label: `Duration: ${Math.floor(summary.durationMin / 60)}h ${summary.durationMin % 60}m` },
          { icon: '💰', label: `Earned: ${summary.currency ?? '£'}${summary.earnings}` },
          { icon: '🔥', label: `Streak: Day ${summary.streakDay}` },
        ].map(row => (
          <div key={row.label} className="flex items-center gap-2">
            <span className="text-sm">{row.icon}</span>
            <span className="text-sm text-neutral-700">{row.label}</span>
          </div>
        ))}
      </div>

      <button
        onClick={onShare}
        className="w-full flex items-center justify-center gap-2 py-2.5 rounded-xl text-sm font-semibold text-white"
        style={{ background: 'linear-gradient(135deg, #ff0069, #833ab4)' }}
      >
        <Share2 size={14} />
        Share Summary
      </button>
    </>
  ) : (
    <p className="text-sm text-neutral-400">No recent stream data</p>
  )}
</div>
```

**Share action (M10):** Generates a shareable image card (canvas screenshot of the summary
block). Opens native share sheet on mobile via `navigator.share()`, or copies link on desktop.

---

## 4. INTERACTION SPEC

### 4.1 Day range toggle → data refresh
```
User clicks 7d / 30d / 90d toggle
  → DayRangeToggle updates `days` state
  → Convex query re-fires with new date range
  → PlatformEarningsGrid bars re-animate (staggered)
  → ViewerTrendChart line redraws (pathLength 0 → 1)
```

### 4.2 Share post-stream summary
```
User taps "Share Summary"
  → html2canvas renders PostStreamCard snapshot
  → if navigator.share available (mobile): opens native share sheet
  → else: downloads PNG / copies to clipboard
  → Toast: "Summary copied!"
```

### 4.3 Streak banner
```
StreakCounter mounts
  → Framer Motion fadeDown entrance (y: -8 → 0)
  → Progress bar animates fill
  → On streak milestone (7, 14, 30): CelebrationModal fires
```

---

## 5. GAMIFICATION INTEGRATION

| Trigger | Display | Points |
|---------|---------|--------|
| Streak counter in header bar | StreakBadge in sub-nav | +150 pts at 7-day milestone |
| Sharing post-stream summary | Share button glow pulse after | +20 pts |
| Weekly streak goal complete | CelebrationModal on Stats page load | +150 pts |

---

## 6. REUSE INSTRUCTIONS

| Component | Source | Notes |
|-----------|--------|-------|
| `DayRangeToggle` | Design system §7d | Direct reuse — 7d/30d/90d picker |
| `PointsStatPill` | `@/features/content-requests/` | Shared gamification |
| `StreakBadge` | `@/features/webcam/` (from go-live page) | Shared between all webcam sub-pages |
| `FormatChart` | `@/features/intelligence/` | NOT used — custom SVG bars per design rules |

---

## 7. FILE ADDITIONS TO `src/features/webcam/`

```
components/
  WebcamStatsFeaturePage.tsx
  StreakCounter.tsx
  PlatformEarningsGrid.tsx
  ViewerTrendChart.tsx
  PostStreamCard.tsx

src/app/model/webcam/stats/page.tsx   ← thin wrapper only
```
