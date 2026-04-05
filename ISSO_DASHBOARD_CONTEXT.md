# ISSO Dashboard — Build Context

> Read this before touching anything in `apps/isso-dashboard/`.
> Last updated: 2026-04-06

---

## What We're Building

A **Foreplay.co pixel-clone** — rebranded as **ISSO** — for OFM (OnlyFans Management) agencies.
Foreplay is an ad intelligence / content ops tool. We are cloning its UI shell exactly and filling it with ISSO-specific features (scheduling, competitor recon, AI agents, content briefs).

**Reference:** Keep `app.foreplay.co` open in a browser tab for visual comparison.
Dev server: `PATH="/opt/homebrew/bin:$PATH" npx next dev --port 3100` → `localhost:3100/isso`

---

## Visual Design System (locked — do not drift)

| Token | Value |
|---|---|
| Outer canvas | `bg-black`, `p-5` |
| Gap between sidebar and content card | `gap-5` |
| Content card background | `#ffffff`, `rounded-2xl` |
| Sidebar background | `#0e0e10` (near-black) |
| Primary accent | `linear-gradient(135deg, #ff0069, #833ab4)` |
| Active nav item | `rgba(255,255,255,0.10)` background |
| Hover on icons | `rgba(255,255,255,0.12)` background |
| Sidebar icon border-radius | `rounded-[10px]` |
| Content dividers | `rgba(0,0,0,0.07)` |
| Text primary | `text-neutral-900` |
| Text muted | `text-neutral-400` |
| Inner cards/surfaces | `#f5f5f4` |

---

## Layout Architecture

```
<div bg-black p-5 gap-5 flex>
  <IssoSidebarShell />          ← dark sidebar (collapsed: 64px, expanded: ~280px)
  <main #ffffff rounded-2xl>    ← white content card
    {children}                  ← ContentPageShell inside each page
  </main>
</div>
```

**Key files:**
- `src/app/isso/layout.tsx` — outer black canvas + gap-5 layout
- `src/shared/layout/isso-sidebar/IssoSidebarShell.tsx` — full sidebar
- `src/shared/layout/isso-sidebar/sidebar-config.tsx` — 5 product icons + persistent nav config
- `src/shared/layout/ContentPageShell.tsx` — universal page template (header + tabs + filters)
- `src/shared/layout/ProductIcon.tsx` — renders product sprite PNG at any size

---

## Nav Architecture (CONFIRMED — do not change without checking)

### Sidebar structure
```
[Logo + collapse toggle]
[5 product icons — horizontal row]
  Hub (⌘1) · Intelligence (⌘2) · Recon (⌘3) · Agents (⌘4) · Briefs (⌘5)
────────────────────────────────
Pages (persistent nav links — always visible)
  Schedule   → /isso/schedule
  Analytics  → /isso/analytics
  Models     → /isso/models
  Team       → /isso/team
────────────────────────────────
[Search bar]
[Plan CTA card]
[Avatar popup (bottom-left) — Settings lives here]
[Changelog button (bottom-right)]
```

### Product icons → ContentPageShell tabs
Clicking a product icon navigates to that product's route. The white card's ContentPageShell tabs ARE the sub-page pills for that product. No separate sub-nav component.

| Product | Route | ContentPageShell Tabs |
|---|---|---|
| Hub | `/isso` | Overview · Approvals · Content Feed |
| Intelligence | `/isso/intelligence` | Community Feed · Brands · Experts |
| Recon | `/isso/recon` | Competitors · Scraping Log |
| Agents | `/isso/agents` | Activity · Reports · Requests |
| Briefs | `/isso/ideas` or `/isso/content` | Ideas · Sent · Archived (on Ideas page) |

### Persistent pages (sidebar, always visible)
These are NOT inside any product. They are operational/shared tools.

| Page | Route | What it is |
|---|---|---|
| Schedule | `/isso/schedule` | Content calendar — post scheduling, drag-to-schedule |
| Analytics | `/isso/analytics` | Platform-wide analytics — follower growth, engagement, audience |
| Models | `/isso/models` | Per-model pipeline tracker — Draft → Sent → Filming → Complete |
| Team | `/isso/team` | Team members, roles, permissions matrix, activity log |

### Settings
Lives in the **avatar popup** (bottom-left of sidebar). Not a sidebar nav item.

---

## The 5 ISSO Products (from ISSO_FEATURE_LANDING_PAGE_MAPPING.md)

| # | Name | Landing Page Label | What It Is | Core Screens |
|---|---|---|---|---|
| 1 | **Hub** | Swipe File | Content library + approval workflow | Content grid, approval queue, content feed |
| 2 | **Intelligence** | Discovery | Trend detection, viral pattern analysis | Trend search, scored results grid, AI breakdown |
| 3 | **Recon** | Spyder | 24/7 automated competitor scraping | Competitor list, profiles, trend leaderboard, scraping log |
| 4 | **Agents** | Lens | Transparent AI agent team dashboard | Activity feed, performance reports, request submission |
| 5 | **Content Gen** | Briefs | AI video generation pipeline | Script generator, batch queue, generation gallery, publisher |

---

## ContentPageShell — Universal Template

**File:** `src/shared/layout/ContentPageShell.tsx`
**Import:** `@/isso/layout/ContentPageShell`

Every content page uses this. Three rows above scrollable content:

**Row 1 — Header bar (h-14)**
```
[icon] [Title] [stat pill]  |  [search ⌘K]  |  [+ Action ▾]
```

**Row 2 — Tabs (pills style, rounded-lg, gradient on active)**
- Active: `linear-gradient(135deg, #ff0069, #833ab4)`, white text
- Inactive: `text-neutral-400`, hover `text-neutral-600`

**Row 3 — Filter bar**
- Left: "≡ Add Filter"
- Right: filter chips + optional grid/list toggle

---

## Pages Built — Current State

### ✅ Fully built with real content

| Page | Route | File | Notes |
|---|---|---|---|
| Hub Dashboard | `/isso` | `src/features/dashboard/components/DashboardFeaturePage.tsx` | Welcome, KPIs, activity feed, quick actions, models strip |
| Hub Approvals | `/isso/approvals` | `src/features/approvals/components/ApprovalsFeaturePage.tsx` | Full card grid, detail modal, approve/revise/publish workflow |
| Hub Content Feed | `/isso/community` | `src/features/community/components/CommunityFeaturePage.tsx` | Instagram-style post grid + leaderboard sidebar |
| Analytics | `/isso/analytics` | `src/features/analytics/components/AnalyticsFeaturePage.tsx` | SVG bar chart, stat cards, top posts table, audience insights |
| Schedule | `/isso/schedule` | `src/features/schedule/components/ScheduleFeaturePage.tsx` | Full calendar grid + analytics view |
| Models | `/isso/models` | `src/features/models/components/ModelsFeaturePage.tsx` | Pipeline tracker, reel grids, 4 model accounts |
| Team | `/isso/team` | `src/features/team/components/TeamFeaturePage.tsx` | Member cards, permissions matrix, activity log, invite modal |
| Settings | `/isso/settings` | `src/features/settings/components/SettingsFeaturePage.tsx` | Profile, Drive OAuth, integrations, billing |
| Intelligence | `/isso/intelligence` | `src/features/intelligence/components/IntelligenceFeaturePage.tsx` | Foreplay-style ad card grid, boards view |
| Recon | `/isso/recon` | `src/features/recon/components/ReconFeaturePage.tsx` | Competitor cards with sparklines, scraping log |
| Agents | `/isso/agents` | `src/features/agents/components/AgentsFeaturePage.tsx` | Activity feed, reports, requests queue |
| Content (upload) | `/isso/content` | `src/features/content/components/ContentFeaturePage.tsx` | Upload dropzone, clip library, enhancement badges |
| Briefs / Ideas | `/isso/ideas` | `src/features/ideas/components/IdeasFeaturePage.tsx` | AI brief generator (Gemini), 3-panel layout |

### All pages use ContentPageShell ✓
### TypeScript: 0 errors across all pages ✓

---

## ALJ Reference Repo

Cloned at `/tmp/alj-explore/` (may need re-cloning between sessions).
Repo: `https://github.com/alj04ofm-svg/alj.git`

This is the IGINFULL app — a real OFM agency tool built by ALJ's team. Used as reference for:
- Data models (models, ideas, clips, pipeline statuses)
- Component logic (approval workflow, brief generation, video enhancement)
- Seed data (4 models: Tyler, Ren, Ella, Amam)
- API integrations (Gemini 2.0 Flash, Google Drive OAuth, FFmpeg WASM)

**Important:** ALJ is dark-themed. All components were ported and restyled for ISSO's light theme.

---

## What Still Needs Doing

### High priority
1. **Hub tabs navigation** — Hub Dashboard tabs (Overview/Approvals/Content Feed) should navigate between routes, not switch in-page content
2. **Intelligence content** — Ad card grid has seed data but needs real scraping pipeline eventually
3. **Recon content** — Competitor cards have seed data, needs real scraping backend
4. **Agents content** — Activity/reports/requests have seed data, needs real agent pipeline

### Medium priority
5. **Search functionality** — Search bar in ContentPageShell is UI only, no logic
6. **Action button handlers** — "+ New" buttons exist but no modal flows
7. **Briefs / Content Gen** — AI script generator, batch queue, generation gallery not yet built (IdeasFeaturePage has brief generation, but not the full video pipeline)

### Future / Phase 2
8. **Real Gemini integration** — Ideas page has the structure but needs API key wiring
9. **Google Drive OAuth** — Settings page has the UI, needs real OAuth flow
10. **Video generation pipeline** — Kling + Higgsfield + Replicate integration
11. **Mobile responsive** — All pages are desktop-first currently

---

## Common Gotchas

- **Node not in PATH:** `PATH="/opt/homebrew/bin:$PATH" npx next dev --port 3100`
- **Stale .next cache:** `rm -rf .next` then restart if you get module errors
- **Import alias:** Use `@/isso/*` for shared layout (maps to `./src/shared/*`)
  - ✅ `import { ContentPageShell } from '@/isso/layout/ContentPageShell'`
  - ❌ `import { ContentPageShell } from '@/shared/layout/ContentPageShell'`
- **Pre-existing build errors:** `next build` fails due to errors in `src/domains/`. Dev server works fine.
- **Framer Motion:** Available (`^12.23.24`), use it for card animations

---

## Path Alias Quick Reference

| Alias | Resolves to |
|---|---|
| `@/isso/*` | `src/shared/*` |
| `@/features/*` | `src/features/*` |
| `@/lib/*` | `src/lib/*` |
| `@/components/*` | `./components/*` (ROOT level, not src/) |

---

## Related Docs

| Doc | Path | What it is |
|---|---|---|
| Feature mapping | `SISO_Agency/ISSO_FEATURE_LANDING_PAGE_MAPPING.md` | 5 products → landing page sections → required screens |
| Positioning brief | `SISO_Agency/SISO_POSITIONING_BRIEF.md` | Brand, offer, OFM vertical |
| Nav architecture | `agents/clients-pm/memory/nav-architecture.md` | Confirmed nav decisions |
| Business plan | `SISO_Agency/business_plan/business_plan.md` | Full two-layer AI architecture |
| ALJ OFM workflow | `industries/model_management/clients/ALJ_OFM/alex-ofm/CONTEXT.md` | FLUX → Kling/Higgsfield → Drive pipeline |
