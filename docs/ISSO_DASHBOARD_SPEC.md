---
name: ISSO Dashboard — Full Product Spec
description: Canonical spec for all 5 product icons, pills, routes, build status, and domain architecture. Source of truth for dashboard development.
type: project
---

> Last updated: 2026-04-06
> Status: Locked — do not change icon order, domain boundaries, or pill structure without updating this doc

---

## The Pipeline

```
Recon (scrape) → Intelligence (analyze) → Hub (rate/curate) → Content Gen (generate + approve) → Schedule (publish) → Analytics (monitor)
```

**What the product does:** Scrapes competitor reels from Instagram/TikTok/Reels, finds what's trending, AI-generates new reels (FLUX face transfer → Kling/Higgsfield), gets them approved, delivers to client, monitors performance. The client just posts and reviews.

---

## Layout: Two groups, not six

```
┌─────────────────────────────────────────────────────┐
│  5 PRODUCT ICONS (pipeline flow, left → right)      │
│  Recon · Intelligence · Hub · Content Gen · Agents  │
├─────────────────────────────────────────────────────┤
│  PERSISTENT NAV (always visible, sidebar links)     │
│  Home · Schedule · Analytics · Models · Team ·      │
│  Notifications                                       │
└─────────────────────────────────────────────────────┘
```

---

## Persistent Nav — full spec

| Page | Route | Feature file | Status | Notes |
|---|---|---|---|---|
| Home | `/isso` | `DashboardFeaturePage` | ✅ built | Has own tabs: Overview · Approvals · Pipeline · Analytics |
| Schedule | `/isso/schedule` | `ScheduleFeaturePage` | ✅ built | No changes needed |
| Analytics | `/isso/analytics` | `AnalyticsFeaturePage` | ✅ built | No changes needed |
| Models | `/isso/models` | `ModelsFeaturePage` | ✅ built | No changes needed |
| Team | `/isso/team` | `TeamFeaturePage` | ✅ built | No changes needed |
| Notifications | `/isso/notifications` | — | ❌ new build | Cross-cutting alerts: viral detected, generation done, approval needed, scrape failed, Drive delivered |
| Settings | avatar popup | `SettingsFeaturePage` | ✅ built | Not a sidebar nav item |

---

## 5 Product Icons — full spec

---

### 1. Recon ⌘1
**Domain:** `recon` | **Route:** `/isso/recon`
**What it is:** Data collection engine. Scrapes Instagram, TikTok, Reels from tracked creator accounts 24/7.

#### Pills

| # | Label | Route | Feature file | Tab | Status |
|---|---|---|---|---|---|
| 1 | **Creators** | `/isso/recon` | `ReconFeaturePage` | `competitors` tab | ✅ built — rename label only |
| 2 | **Feed** | `/isso/community` | `CommunityFeaturePage` | `feed` tab | ✅ built — move from wrong location |
| 3 | **Scraping Log** | `/isso/recon` | `ReconFeaturePage` | `log` tab | ✅ built — no changes |

**Note:** Creators are ranked by `outlier_ratio` (views ÷ followers). This IS the leaderboard — no separate leaderboard pill needed. Niches are a filter inside Feed, not their own pill.

**CommunityFeaturePage tab mapping:**
- Feed tab → Recon: Feed pill ✅
- Trending tab → Recon: Feed with trending filter (not a separate pill)
- Saved tab → Hub: Approved pill (content bookmarked from feed)

**To build (not yet done):**
- `outlier_ratio` column on Creators — views ÷ followers, sortable
- Top posts grid inside each creator card (click → top posts ranked by ratio)
- Viral velocity alert — configurable 5x/10x/20x threshold
- Scrape failure recovery — error reason inline + one-click retry

---

### 2. Intelligence ⌘2
**Domain:** `intelligence` | **Route:** `/isso/intelligence`
**What it is:** Analysis layer. Takes Recon's data and surfaces what's performing, why, and what to generate next.

#### Pills

| # | Label | Route | Feature file | Tab | Status |
|---|---|---|---|---|---|
| 1 | **Trends** | `/isso/intelligence` | `IntelligenceFeaturePage` | `brands` tab | ✅ built — rename + rebuild content |
| 2 | **Analysis** | `/isso/intelligence` | `IntelligenceFeaturePage` | `experts` tab | ✅ built — rename + rebuild content |
| 3 | **Pulse Report** | `/isso/intelligence` | — | new tab | ❌ new build |

**IntelligenceFeaturePage tab mapping:**
- Community Feed tab → **REMOVE** (duplicate of Recon Feed)
- Brands tab → Trends pill (rename)
- Experts tab → Analysis pill (rename)

**To build:**
- Hook leaderboard — best-performing first 3 seconds across all tracked creators
- Cross-account pattern detection
- One-click "Turn into Brief" from any card → Content Gen
- Pulse Report — async keyword job → structured AI report

---

### 3. Hub ⌘3
**Domain:** `hub` | **Route:** `/isso/hub` (new route)
**What it is:** Human curation layer. Managers and models rate scraped content to train the system.

#### Pills

| # | Label | Route | Feature file | Tab | Status |
|---|---|---|---|---|---|
| 1 | **Swipe & Rate** | `/isso/hub` | — | new page | ❌ new build |
| 2 | **Approved** | `/isso/hub/approved` | `CommunityFeaturePage` | `saved` tab | ⚠️ partial — Saved tab is the seed, needs proper page |

**To build:**
- Swipe & Rate — Tinder-style card swipe, good/bad rating, feeds back into Intelligence
- Swipe session history + audit log (who rated what, when)
- Structured WHY tags on each swipe (hook style, pacing, audio, format)
- Hard-negative training set — "never generate like this" explicit block

---

### 4. Content Gen ⌘4
**Domain:** `content-gen` | **Route:** `/isso/content-gen` (new route)
**What it is:** Full production pipeline. FLUX face transfer → Kling/Higgsfield video gen → human approval.

#### Pills

| # | Label | Route | Feature file | Tabs | Status |
|---|---|---|---|---|---|
| 1 | **Generate** | `/isso/ideas` | `IdeasFeaturePage` | Ideas · Sent · Archived | ✅ built — remap to new icon |
| 2 | **Queue** | `/isso/content` | `ContentFeaturePage` | Upload · Library · Delivered | ✅ built — remap + relabel |
| 3 | **Scenes** | `/isso/content-gen/scenes` | — | new page | ❌ new build |
| 4 | **Approvals** | `/isso/approvals` | `ApprovalsFeaturePage` | Pending · Approved · Published | ✅ built — move from wrong location |

**ContentFeaturePage tab mapping:**
- Upload tab → Generate pill (source material upload lives inside Generate)
- Library tab → Scenes pill (Scenes = all generated content library)
- Delivered tab → Approvals pill (Published/Delivered tab)

**IdeasFeaturePage tab mapping:**
- Ideas tab → Generate (main brief gen interface)
- Sent tab → Queue (triggered jobs)
- Archived tab → archived state within Generate

**To build:**
- Per-job ETA before and during generation (FLUX: ~45s, Kling: ~4min)
- Generation failure with specific reason + one-click retry
- Scenes page — visual pipeline grid: Qualified · Generating · Ready for review
- Prompt/Hook library — winning prompts auto-saved by niche
- Hard-negative training set

---

### 5. Agents ⌘5
**Domain:** `agents` | **Route:** `/isso/agents`
**What it is:** Automation visibility. See what's running in the background across all pipeline stages.

#### Pills

| # | Label | Route | Feature file | Status |
|---|---|---|---|---|
| 1 | **Activity** | `/isso/agents` | `AgentsFeaturePage` | ✅ built — no changes |
| 2 | **Reports** | `/isso/agents` | `AgentsFeaturePage` | ✅ built — no changes |
| 3 | **Requests** | `/isso/agents` | `AgentsFeaturePage` | ✅ built — no changes |

**Agents needs zero structural changes.**

---

## Build Status Summary

| | ✅ Built, correct | ⚠️ Built, needs move/rename | ❌ New build |
|---|---|---|---|
| **Recon** | Scraping Log | Creators (rename), Feed (move from `/community`) | outlier_ratio features, viral alerts |
| **Intelligence** | — | Trends (rename), Analysis (rename) | Pulse Report |
| **Hub** | — | Approved (from Community Saved) | Swipe & Rate |
| **Content Gen** | — | Generate (from `/ideas`), Queue (from `/content`), Approvals (from `/approvals`) | Scenes |
| **Agents** | Activity, Reports, Requests | — | — |
| **Persistent** | Home, Schedule, Analytics, Models, Team, Settings | — | Notifications |

---

## Reorganization Plan

### Phase 1 — Quick wins (renames + rewires, no new page builds)

| # | What | File | Change |
|---|---|---|---|
| 1 | Rename "Competitors" → "Creators" | `ReconFeaturePage.tsx` | Tab label + action label |
| 2 | Add Feed pill to Recon | `sidebar-config.tsx` | New nav item → `/isso/community` |
| 3 | Remove Community Feed tab from Intelligence | `IntelligenceFeaturePage.tsx` | Delete tab entry |
| 4 | Rename "Brands" → "Trends" | `IntelligenceFeaturePage.tsx` | Tab label |
| 5 | Rename "Experts" → "Analysis" | `IntelligenceFeaturePage.tsx` | Tab label |
| 6 | Wire Content Gen: Generate → `/isso/ideas` | `sidebar-config.tsx` | Already done |
| 7 | Wire Content Gen: Queue → `/isso/content` | `sidebar-config.tsx` | Already done |
| 8 | Wire Content Gen: Approvals → `/isso/approvals` | `sidebar-config.tsx` | Already done |
| 9 | Add Notifications to persistent nav | `sidebar-config.tsx` | New nav item |
| 10 | Fix Intelligence sidebar pills (Trends, Analysis, Pulse Report) | `sidebar-config.tsx` | Rename items |

### Phase 2 — New page builds (priority order)

| # | What | Complexity | Notes |
|---|---|---|---|
| 1 | Hub → Swipe & Rate | Medium | Card swipe UI, rating storage, feeds Intelligence |
| 2 | Hub → Approved | Low | Grid of rated/saved content from feed |
| 3 | Content Gen → Scenes | Medium | Pipeline status grid: Qualified · Generating · Ready |
| 4 | Intelligence → Pulse Report | High | Async keyword job, structured AI report output |
| 5 | Persistent → Notifications | Medium | Cross-cutting alert center |

---

## Every Existing Page → New Home

| Existing page | Old location | New home |
|---|---|---|
| `DashboardFeaturePage` | `/isso` | Persistent: Home ✅ |
| `CommunityFeaturePage` Feed tab | `/isso/community` | Recon: Feed pill |
| `CommunityFeaturePage` Trending tab | `/isso/community` | Recon: Feed (trending filter) |
| `CommunityFeaturePage` Saved tab | `/isso/community` | Hub: Approved pill |
| `IntelligenceFeaturePage` Community Feed tab | Intelligence icon | REMOVED |
| `IntelligenceFeaturePage` Brands tab | Intelligence icon | Intelligence: Trends |
| `IntelligenceFeaturePage` Experts tab | Intelligence icon | Intelligence: Analysis |
| `ReconFeaturePage` Competitors tab | Recon icon | Recon: Creators |
| `ReconFeaturePage` Scraping Log tab | Recon icon | Recon: Scraping Log ✅ |
| `IdeasFeaturePage` Ideas tab | `/isso/ideas` | Content Gen: Generate |
| `IdeasFeaturePage` Sent tab | `/isso/ideas` | Content Gen: Queue |
| `IdeasFeaturePage` Archived tab | `/isso/ideas` | Content Gen: Generate (archived state) |
| `ContentFeaturePage` Upload tab | `/isso/content` | Content Gen: Generate (source upload) |
| `ContentFeaturePage` Library tab | `/isso/content` | Content Gen: Scenes |
| `ContentFeaturePage` Delivered tab | `/isso/content` | Content Gen: Approvals (Published tab) |
| `ApprovalsFeaturePage` all tabs | `/isso/approvals` | Content Gen: Approvals |
| `AgentsFeaturePage` all tabs | `/isso/agents` | Agents ✅ |
| `AnalyticsFeaturePage` | `/isso/analytics` | Persistent: Analytics ✅ |
| `ScheduleFeaturePage` | `/isso/schedule` | Persistent: Schedule ✅ |
| `ModelsFeaturePage` | `/isso/models` | Persistent: Models ✅ |
| `TeamFeaturePage` | `/isso/team` | Persistent: Team ✅ |
| `SettingsFeaturePage` | `/isso/settings` | Avatar popup ✅ |

---

## Models Dashboard (separate — not part of this app)
Models get their own separate, simpler dashboard. Not this app.
- Simple interface, mobile-first
- Can swipe & rate reels (feeds Hub's training data)
- Basic content visibility
- Design separately — scope TBD

---

## Related Docs
| Doc | Path |
|---|---|
| Nav architecture | `memory/nav-architecture.md` |
| Competitive deep dives | `memory/competitive-deep-dives.md` |
| Feature gap research | `memory/feature-research-synthesis.md` |
| OFM tools reference | `memory/ofm-tools-reference.md` |
| Dashboard build context | `apps/isso-dashboard/ISSO_DASHBOARD_CONTEXT.md` |
| ALJ pipeline | `industries/model_management/clients/ALJ_OFM/alex-ofm/CONTEXT.md` |
