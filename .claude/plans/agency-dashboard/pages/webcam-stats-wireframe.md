# Wireframe: Webcam Stats (`/agency/webcam`)

**Features:** A46–A50
**Accent:** `linear-gradient(135deg, #ff0069, #833ab4)`
**Role:** Owner-only (sidebar icon not shown to others)

---

## ASCII Wireframe (Desktop, 1440px)

```
┌─────────────────────────────────────────────────────────────────────────────────┐
│ OUTER CANVAS                                                                    │
│  ┌──────────┐  ┌──────────────────────────────────────────────────────────────┐ │
│  │ SIDEBAR  │  │ CONTENT CARD                                                  │ │
│  │          │  │ ┌──────────────────────────────────────────────────────────┐ │ │
│  │          │  │ │ HEADER: [📹] Webcam Stats  [● 3 Live Now]   [Search]     │ │ │
│  │          │  │ │                             [Model: All ▾]  [Refresh]     │ │ │
│  │          │  │ └──────────────────────────────────────────────────────────┘ │ │
│  │          │  │ ┌──────────────────────────────────────────────────────────┐ │ │
│  │          │  │ │ TABS: [● Overview] [Live View] [Earnings] [Schedule]     │ │ │
│  │          │  │ │                                              [7d][30d][90d]│ │ │
│  │          │  │ └──────────────────────────────────────────────────────────┘ │ │
│  │          │  │ ┌──────────────────────────────────────────────────────────┐ │ │
│  │          │  │ │ STATUS STRIP: ● 3 models live │ £1,240 earned today │ 17 platforms│ │ │
│  │          │  │ └──────────────────────────────────────────────────────────┘ │ │
│  │          │  │                                                               │ │
│  │          │  │ TAB: Overview                                                 │ │
│  │          │  │ ── LIVE NOW (A50) ───────────────────────────────────────── │ │
│  │          │  │ ┌─────────────────────────────────────────────────────────┐  │ │
│  │          │  │ │ ┌──────────────────┐ ┌──────────────────┐              │  │ │
│  │          │  │ │ │ [● LIVE]         │ │ [● LIVE]         │  + 1 more    │  │ │
│  │          │  │ │ │ Ana Russo        │ │ Belle Chen       │              │  │ │
│  │          │  │ │ │ Stripchat        │ │ Chaturbate       │              │  │ │
│  │          │  │ │ │ 284 viewers      │ │ 142 viewers      │              │  │ │
│  │          │  │ │ │ 2h 14m           │ │ 47m              │              │  │ │
│  │          │  │ │ │ [Watch Live →]   │ │ [Watch Live →]   │              │  │ │
│  │          │  │ │ └──────────────────┘ └──────────────────┘              │  │ │
│  │          │  │ └─────────────────────────────────────────────────────────┘  │ │
│  │          │  │                                                               │ │
│  │          │  │ ── ALL MODELS STREAMING STATS (A46) ──────────────────────── │ │
│  │          │  │ Model       Platform    Sessions  Avg Duration  Earnings  ER  │ │
│  │          │  │ ─────────── ─────────  ────────  ────────────  ────────  ── │ │
│  │          │  │ Ana Russo   Stripchat      12        2h 18m     £420     ↑   │ │
│  │          │  │ Belle Chen  Chaturbate      8        1h 52m     £290     ↑   │ │
│  │          │  │ Cam Lee     BONGACAMS       5        3h 10m     £380     →   │ │
│  │          │  │                                                               │ │
│  │          │  │ ── PREDICTED GO-LIVE TIMES (A48) ─────────────────────────── │ │
│  │          │  │ ┌──────────┐ ┌──────────┐ ┌──────────┐                      │ │
│  │          │  │ │ Ana      │ │ Dan      │ │ Eve      │                      │ │
│  │          │  │ │ ~6:00 PM │ │ ~8:00 PM │ │ ~9:30 PM │                      │ │
│  │          │  │ │ Stripchat│ │ CB       │ │ Bonga    │                      │ │
│  │          │  │ └──────────┘ └──────────┘ └──────────┘                      │ │
│  └──────────┘  └──────────────────────────────────────────────────────────────┘ │
└─────────────────────────────────────────────────────────────────────────────────┘
```

### Tab: Live View (A50)

```
┌──────────────────────────────────────────────────────────────┐
│ MODEL SELECTOR  [Ana Russo ▾]   PLATFORM [Stripchat ▾]      │
│                                                              │
│ ┌────────────────────────────────────────────────────────┐  │
│ │                                                        │  │
│ │         LIVE STREAM EMBED (iframe / player)            │  │
│ │                 16:9 aspect ratio                      │  │
│ │                                                        │  │
│ └────────────────────────────────────────────────────────┘  │
│                                                              │
│  ● LIVE  |  284 viewers  |  2h 14m elapsed  |  £42 earned  │
└──────────────────────────────────────────────────────────────┘
```

---

## Component Tree

```
WebcamStatsFeaturePage
├── ContentPageShell
│   ├── header
│   │   ├── ProductIcon "webcam"
│   │   ├── "Webcam Stats"
│   │   ├── StatPill "● 3 Live Now" (pulsing green dot)
│   │   ├── ModelFilterPill
│   │   └── ActionButton "Refresh" (icon only)
│   ├── tabBar
│   │   ├── Tab "Overview" (active)
│   │   ├── Tab "Live View"
│   │   ├── Tab "Earnings"
│   │   └── Tab "Schedule"
│   │   └── DayRangeToggle [7d][30d][90d]
│   └── content
│       ├── StatusStrip
│       └── AnimatePresence
│           ├── OverviewTab
│           │   ├── LiveNowSection (A50)
│           │   │   └── LiveModelCard × liveCount
│           │   ├── StreamingStatsTable (A46)
│           │   │   └── ModelStreamRow × N
│           │   └── PredictedGoLiveRow (A48)
│           │       └── GoLiveCard × N
│           ├── LiveViewTab (A50)
│           │   ├── ModelPlatformSelector
│           │   ├── LiveStreamEmbed
│           │   └── LiveSessionBar
│           ├── EarningsTab (A49)
│           │   └── EarningsPerStreamTable
│           └── ScheduleTab (A47)
│               └── StreamingScheduleGrid
```

---

## Key Components

### LiveModelCard (A50 preview)
```tsx
<div
  className="rounded-xl bg-white p-4 cursor-pointer hover:bg-black/[0.02] transition-colors"
  style={{ border: '1px solid rgba(0,0,0,0.07)' }}
  onClick={() => { setActiveTab('live'); setSelectedModel(model); }}
>
  <div className="flex items-center gap-2 mb-3">
    <span className="flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold text-white bg-red-500">
      <span className="w-1.5 h-1.5 rounded-full bg-white animate-pulse" />
      LIVE
    </span>
    <p className="text-sm font-semibold text-neutral-900">{model.name}</p>
  </div>
  <p className="text-xs text-neutral-500">{model.platform}</p>
  <div className="flex items-center gap-4 mt-2">
    <StatMini icon={<Eye size={11} />} value={model.viewers} />
    <StatMini icon={<Clock size={11} />} value={model.duration} />
  </div>
  <button className="mt-3 w-full py-1.5 rounded-lg text-xs font-semibold text-white"
          style={{ background: 'linear-gradient(135deg, #ff0069, #833ab4)' }}>
    Watch Live →
  </button>
</div>
```

### LiveStreamEmbed (A50 — CRITICAL)
```tsx
<div className="rounded-xl overflow-hidden bg-black" style={{ aspectRatio: '16/9' }}>
  {embedUrl ? (
    <iframe
      src={embedUrl}
      className="w-full h-full"
      allowFullScreen
      allow="autoplay; fullscreen"
    />
  ) : (
    <div className="w-full h-full flex items-center justify-center">
      <p className="text-white/50 text-sm">Select a model and platform to watch</p>
    </div>
  )}
</div>
// embedUrl built from platform streaming embed APIs
// Stripchat: https://stripchat.com/embed/{username}
// Chaturbate: https://chaturbate.com/embed/{username}/?...
```

### StreamingStatsTable (A46)
```tsx
<table className="w-full mt-6">
  <thead>
    <tr className="text-[11px] font-medium text-neutral-500 border-b border-neutral-100">
      <th className="text-left py-2">Model</th>
      <th>Platform</th>
      <th className="text-right">Sessions</th>
      <th className="text-right">Avg Duration</th>
      <th className="text-right">Earnings</th>
      <th className="text-center">Trend</th>
    </tr>
  </thead>
  <tbody>
    {models.map(m => <ModelStreamRow key={m.id} model={m} />)}
  </tbody>
</table>
```

### PredictedGoLiveCard (A48)
```tsx
<div className="rounded-xl bg-white p-3 text-center" style={{ border: '1px solid rgba(0,0,0,0.07)' }}>
  <img src={model.avatar} className="w-8 h-8 rounded-full mx-auto mb-2" />
  <p className="text-xs font-semibold text-neutral-800">{model.name}</p>
  <p className="text-lg font-semibold text-[#ff0069] mt-1">{predictedTime}</p>
  <p className="text-[10px] text-neutral-400">{platform}</p>
</div>
```

### EarningsPerStreamTable (A49)
Columns: Date | Model | Platform | Duration | Viewers Peak | Earnings
- Sortable by earnings desc by default
- Color-coded earnings: >£100 green, £50-100 amber, <£50 neutral

### StreamingScheduleGrid (A47)
7-column week grid. Each cell shows scheduled model + platform.
```
       Mon    Tue    Wed    Thu    Fri    Sat    Sun
6PM    Ana    —      Ana    —      Belle  Ana    Ana
8PM    Belle  Cam    —      Belle  Ana    Cam    —
10PM   —      Belle  Cam    Cam    —      Belle  Cam
```

---

## Interaction Spec

| Interaction | Behaviour |
|-------------|-----------|
| "Watch Live →" on LiveModelCard | Switch to Live View tab, auto-select that model |
| Live View model selector | Changes embed URL to selected model's stream |
| Live View platform selector | Updates embed URL to selected platform |
| Row click (StreamingStatsTable) | Expands inline: per-platform breakdown for that model |
| PredictedGoLiveCard | Click → opens notification modal: "Remind me when Ana goes live" |
| Earnings tab sort | Click column header to sort |
| Refresh button | Triggers API re-fetch, updates live counts + stats |
| StatPill "3 Live Now" | Always shows real-time live count (polls every 60s) |

---

## Reuse Instructions

- `ModelFilterPill` — shared (built for social-analytics, reuse here)
- `StatusStrip` — design system §9
- `DayRangeToggle` — design system §7d

**NEW components needed:**
- `LiveModelCard` — new, ~50 lines
- `LiveStreamEmbed` — new, ~30 lines (CRITICAL: must handle embed failures gracefully)
- `PredictedGoLiveCard` — new, ~25 lines
- `StreamingScheduleGrid` — new, ~60 lines

**Platform embed notes:** Not all platforms support iframes. Fallback: open stream in new tab with `<ExternalLink>` button. Build embed URL factory per platform.
