# Hub Page — Community Build Plan

**Route:** `/isso/community` · **Product:** Hub ⌘3 · **Next:** Content Gen (`/isso/ideas`)

---

## Tab Structure

```
[ 📊 Dashboard ]  [ ① Vault ]  [ ② Approve ]  [ ③ Saved ]  |→  Content Gen
```

- `Dashboard` pill: 📊 emoji icon, no number, gradient fill when active
- `①②③` pills: small filled circle with white number inside
- `→ Content Gen` arrow: nextProduct prop on ContentPageShell

---

## Tab 1 — Dashboard 📊

**Purpose:** Hub command centre — vault health, approval rates, last session, recent decisions.

### Layout
```
┌─ KPI Row ─────────────────────────────────────────────────────┐
│  [Vault Size]  [Approved]  [Passed]  [Approval Rate]          │
└───────────────────────────────────────────────────────────────┘

┌─ Last Session ───────────────────────┐  ┌─ Vault Health ──────┐
│  ❤ 5 rated  ✕ 3 passed  ↑ 2 sent    │  │  Fitness    ████ 40%│
│  Duration: 4m 12s  · Apr 6           │  │  Lifestyle  ███  30%│
│  [▶ Start New Session]               │  │  Fashion    ██   20%│
└──────────────────────────────────────┘  │  Wellness   █    10%│
                                          └────────────────────┘

┌─ Recent Swipe Decisions ──────────────────────────────────────┐
│  [thumb] ❤ Rated   @rhinxrenx · "Vibes only..." · 2m ago      │
│  [thumb] ✕ Passed  @abg.rice  · "Monday grind" · 5m ago       │
│  [thumb] ↑ Sent→T  @ellamira  · "Transformation" · 8m ago     │
└───────────────────────────────────────────────────────────────┘

┌─ Quick Actions ───────────────────────────────────────────────┐
│  [▶ Start Swipe Session]  [📦 Browse Vault]  [📌 View Saved]  │
└───────────────────────────────────────────────────────────────┘
```

### Components
| Component | Status | Notes |
|-----------|--------|-------|
| `HubDashboardTab` | NEW | Wrapper, composes everything |
| `StatCard` | REUSE | From `analytics/stats` |
| `AnimatedNumber` | REUSE | From `analytics/stats` |
| `SectionCard` | REUSE | From `analytics/stats` |
| `LastSessionCard` | NEW | Swipe session summary + CTA |
| `VaultHealthBar` | NEW | Niche breakdown bars |
| `HubSwipeActivityFeed` | NEW | Recent decisions feed |
| `HubQuickActions` | NEW | 3 action buttons |

---

## Tab 2 — ① Vault

**Purpose:** Full content library. Browse, filter by niche/type, enter swipe session.

### Layout
```
┌─ Toolbar ─────────────────────────────────────────────────────────┐
│  Niche: [All][Fitness][Lifestyle][Fashion][Wellness]               │
│  Type:  [All][Reels][Posts][Carousels]    [🔀 Start Swipe Session]│
└───────────────────────────────────────────────────────────────────┘
┌─ Stats Bar ───────────────────────────────────────────────────────┐
│  47 total · 12 reels · 8 posts · 7 carousels · 14 approved        │
└───────────────────────────────────────────────────────────────────┘
┌─ 4-col Grid ──────────────────────┐ ┌─ LeaderboardSidebar ───────┐
│  [PostCard][PostCard][PostCard]    │ │  Top creators by eng.      │
│  [PostCard][PostCard][PostCard]    │ └────────────────────────────┘
└───────────────────────────────────┘
```

### Components
| Component | Status | Notes |
|-----------|--------|-------|
| `VaultTabContent` | NEW | Wrapper with filters |
| `PostCard` | REUSE AS-IS | `community/feed/PostCard` |
| `LeaderboardSidebar` | REUSE AS-IS | Right panel |
| Niche chips | NEW inline | All/Fitness/Lifestyle/Fashion/Wellness |
| Start Swipe CTA | NEW inline | Gradient button → switches to approve tab |

**Data:** Add `niche` + `approved` fields to Post type + seed data.

---

## Tab 3 — ② Approve

**Purpose:** Swipe/rate session. Drag right = approve, left = pass, up = send to model.

### Layout
```
┌─ SwipeSessionSummary ─────────────────────────────────────────────┐
│  ❤ 5  ✕ 3  ↑ 2  · 4m 12s  [Swipe][Grid][History 10]  [■ End]    │
└───────────────────────────────────────────────────────────────────┘
┌─ SwipeStack (220×360) ─────┐  ┌─ WhyTagPanel ───────────────────┐
│  [Card with drag physics]   │  │  HOOK    [Strong][Weak][No]     │
│  Green overlay → approve    │  │  PACING  [Fast][Medium][Slow]   │
│  Red overlay ← pass         │  │  VISUAL  [Clean][Busy]...       │
│  [✕] [↑] [❤]               │  │  AUDIO   [Trending][Original]   │
│  5 of 8 · 3 remaining       │  │  FORMAT  [Talking head]...      │
└────────────────────────────┘  │  TONE    [Playful][Sensual]...  │
                                 │  [✓ Ready to rate]              │
                                 └────────────────────────────────┘
```

### Components (ALL ALREADY BUILT — zero new work)
| Component | Status | Notes |
|-----------|--------|-------|
| `SwipeTabContent` | REUSE AS-IS | Drop in directly |
| `SwipeStack` | REUSE AS-IS | Full drag physics + keyboard shortcuts |
| `WhyTagPanel` | REUSE AS-IS | 6 tag categories |
| `SwipeSessionSummary` | REUSE AS-IS | Rated/passed/sent + live timer |
| `SwipeAuditLog` | REUSE AS-IS | Grouped by date |
| `SendToModelModal` | REUSE AS-IS | 4-model picker + note |

---

## Tab 4 — ③ Saved

**Purpose:** Bookmarked content. Reference library for briefs and ideas.

### Layout
```
┌─ Filters ─────────────────────────────────────────────────────────┐
│  Niche: [All][Fitness][Lifestyle][Fashion][Wellness]               │
└───────────────────────────────────────────────────────────────────┘
📌 Fitness (3)
[PostCard][PostCard][PostCard]

📌 Lifestyle (2)
[PostCard][PostCard]

── Empty state ──────────────────────────────────────────────────────
│  [bookmark icon]  Nothing saved yet                               │
│  Browse the Vault to save content →                               │
────────────────────────────────────────────────────────────────────
```

### Components
| Component | Status | Notes |
|-----------|--------|-------|
| `SavedTabContent` | NEW | Wrapper with niche grouping |
| `PostCard` | REUSE AS-IS | Pre-filled bookmark state |
| Niche chips | REUSE | Same as Vault |
| Empty state | REUSE inline | Bookmark icon + CTA |

---

## Complete Component Register

### REUSE AS-IS
- `SwipeStack`, `WhyTagPanel`, `SwipeSessionSummary`, `SwipeAuditLog`, `SendToModelModal`, `SwipeTabContent` — hub-swipe
- `PostCard`, `LeaderboardSidebar` — community
- `StatCard`, `AnimatedNumber`, `SectionCard` — analytics/stats

### NOT TOUCHED
- All hub-swipe internals
- All analytics internals
- All other features

### NEW FILES
| # | File | Purpose |
|---|------|---------|
| 1 | `community/components/dashboard/HubDashboardTab.tsx` | Dashboard tab wrapper |
| 2 | `community/components/dashboard/LastSessionCard.tsx` | Last session + CTA |
| 3 | `community/components/dashboard/VaultHealthBar.tsx` | Niche breakdown |
| 4 | `community/components/dashboard/HubSwipeActivityFeed.tsx` | Recent decisions |
| 5 | `community/components/dashboard/HubQuickActions.tsx` | 3 action buttons |
| 6 | `community/components/vault/VaultTabContent.tsx` | Vault tab wrapper |
| 7 | `community/components/saved/SavedTabContent.tsx` | Saved tab wrapper |

### EDITED FILES
| # | File | Change |
|---|------|--------|
| 1 | `community/types.ts` | Tab type, add niche + approved to Post |
| 2 | `community/constants.ts` | Tag posts with niche + approved |
| 3 | `community/components/CommunityFeaturePage.tsx` | Title, 4 tabs, nextProduct, wire content |

---

## Build Order
1. types.ts + constants.ts (data layer)
2. Dashboard tab components
3. VaultTabContent
4. SavedTabContent
5. CommunityFeaturePage (wire everything)
