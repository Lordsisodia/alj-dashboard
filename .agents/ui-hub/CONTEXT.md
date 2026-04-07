---
agent: ui.hub
icon: ⌘3
status: priority-today
---

# UI Agent — Hub

## What you own
The **Hub** nav icon (⌘3) — curate phase. Swipe & rate content to train the system.

## Pattern
Follows the standard: `ContentPageShell` + internal `useState<Tab>` + `AnimatePresence`.

## Routes
- `/isso/community` → `src/app/isso/community/page.tsx` → renders `<CommunityFeaturePage />`
- No `/isso/hub/` route exists — Hub lives under the `community` path

## Main orchestrator
`src/features/community/components/CommunityFeaturePage.tsx`
- 4 internal tabs: `dashboard`, `vault`, `approve`, `saved`
- Default tab: `dashboard`
- **Sidebar only exposes 1 item** ("Swipe & Rate" → `/isso/community`) — the other 3 tabs are hidden from nav

## Tab → component map
| Tab id | Label | Component | Data |
|--------|-------|-----------|------|
| `dashboard` | Dashboard | `components/dashboard/HubDashboardTab.tsx` | All hardcoded mock (`MOCK_LAST_SESSION`, `MOCK_SWIPE_ACTIVITY`) |
| `vault` | Vault ① | `components/vault/VaultTabContent.tsx` | Static `POSTS` constant (10 items) |
| `approve` | Approve ② | `src/features/hub-swipe/components/SwipeTabContent.tsx` | Static `SEED_REELS` (8 items) |
| `saved` | Saved ③ | `components/saved/SavedTabContent.tsx` | Static `POSTS` constant |

## Dashboard pill components (`components/dashboard/`)
`HubDashboardTab.tsx` — 4-KPI row + `LastSessionCard` + `VaultHealthBar` + `HubSwipeActivityFeed` + `HubQuickActions`
- `HubSwipeActivityFeed.tsx` — shows `MOCK_SWIPE_ACTIVITY` (fake timestamps)
- `HubQuickActions.tsx` — Start Session / Browse Vault / View Saved CTAs
- `LastSessionCard.tsx` — hardcoded from `MOCK_LAST_SESSION`
- `VaultHealthBar.tsx` — derived from static `POSTS` array

## Swipe engine (separate feature folder!)
**`src/features/hub-swipe/`** — NOT under `community/`
- `components/SwipeStack.tsx` — Framer Motion drag, keyboard ←/→, left/right swipe detection, like/pass overlays, queue counter
- `components/SwipeTabContent.tsx` — 3 view modes (swipe/grid/log), session summary, audit log
- `components/WhyTagPanel.tsx` — tag gating (must tag before Like is enabled): Hook/Pacing/Visual/Audio/Format/Tone
- `components/SwipeSessionSummary.tsx` — live session counter
- `components/SwipeAuditLog.tsx` — full decision history
- `components/SendToModelModal.tsx` — assign reel to a model with note
- `constants.ts` — `SEED_REELS` (8 mock reels), `TAG_CATEGORIES`, `MODELS` (4 entries)

## Critical bug: swipe is a no-op
`SwipeStack.tsx onDragEnd` calls `triggerLike/triggerPass` → `appendRecord()` in `SwipeTabContent.tsx` → **pure `useState` local state only**.
Zero Convex mutations called. `swipeRatings` table exists in `convex/schema.ts` but nothing writes to it.

## Convex files
- `convex/schema.ts` — `swipeRatings` table defined: `rating` (up/down/save) — **schema ready, just not used**
- `convex/approvals.ts` — `getApprovals` query only, no mutations, no swipe connection
- No dedicated Hub convex file exists

## Sidebar gap
`sidebar-config.tsx` Hub section only has:
```
{ label: 'Swipe & Rate', href: '/isso/community' }
```
Should expose: Dashboard, Vault ①, Approve ②, Saved ③

## AI features (0/3)
None. All data is mock/seed.
Suggestions:
1. Auto-tag content type on swipe (Gemini) — hook/transition/CTA/lifestyle
2. Quality score aggregated from ratings
3. Training feedback loop → pipe to Intelligence scoring

## Component quality
- **Polished:** `SwipeStack`, `WhyTagPanel`, `SwipeTabContent`, `HubDashboardTab`, `VaultTabContent`
- **Rough:** All data is hardcoded mock. `HubSwipeActivityFeed` shows fake timestamps. `LastSessionCard` is static.
- **21st.dev:** None

## Pattern compliance
- [x] `ContentPageShell` wrapping
- [x] Dashboard pill (tab `dashboard`)
- [x] 3 step pages built (Vault, Approve, Saved) — hidden from sidebar
- [ ] Expose 3 step pages in `sidebar-config.tsx`
- [ ] Fix swipe → write to `swipeRatings` Convex table
- [ ] Replace all mock data with real Convex queries
- [ ] 3 AI features (0/3)
