# ISSO Dashboard — Template Spec
**Date:** 2026-04-12
**Status:** Requirements gathered, ready for Opus planning

---

## Context

What exists today is the **ContentGen Dashboard** — a complete working dashboard with sidebar, nav, pills, and content pages. The goal is to extract a reusable template from it so 3 more dashboards can be scaffolded quickly and worked on independently by separate agents.

---

## The 4 Dashboards

| Dashboard | Route prefix | Who uses it |
|-----------|-------------|-------------|
| ContentGen Dashboard | `/isso` | Current build — agency team using the content gen pipeline |
| Agency Dashboard | `/isso/agency` (TBD) | Agency-level view |
| Model Dashboard | `/isso/model` (TBD) | The models (Ella, Ren, Tyler, Amam) |
| Chatter Dashboard | `/isso/chatter` (TBD) | VAs (Yssa, Mikeee) managing DMs |

Auth: single login, user type determines which dashboard they see. Role routing not needed yet — all 4 accessible via separate routes for now.

---

## Shell Components — FIXED across all dashboards

These components stay identical in structure. Only their content/config props change.

### 1. Sidebar (`IssoSidebarShell`)
- Logo icon + dashboard name at top (e.g. "ContentGen Dashboard", "Agency Dashboard")
- Collapse button
- 5 product icon sprites row — **icons swap per dashboard**
- Persistent pages section (Schedule, Analytics, Models, Team, Notifications, Settings, Tools) — **placeholder for now, will be customised per dashboard later**
- Platforms section (Instagram, TikTok, YouTube, X, Pinterest) — keep as-is for now
- Avatar + changelog button at bottom

### 2. Top Bar
- Product icon + product name
- Badge (e.g. "Approved 4")
- Search bar
- Primary action button (e.g. "+ New Post")

### 3. Stats Strip
- Horizontal row of quick stats below the pills
- Content changes per product section

### 4. Pill Flow Navigation
- Horizontal pills that flow the user through a product's steps
- e.g. Dashboard → Approve → Vault → Saved → Content Gen
- Active pill styling (blue gradient) stays the same
- Pill labels + count change per dashboard/product

---

## What Changes Per Dashboard

| Element | Changes to |
|---------|-----------|
| Dashboard name | "ContentGen Dashboard" / "Agency Dashboard" / "Model Dashboard" / "Chatter Dashboard" |
| 5 product icons | Different sprites + destinations per dashboard |
| Pill labels + steps | Different flow per product |
| Page content | Built out independently per dashboard |
| Persistent pages | TBD per dashboard — placeholders kept for now |

---

## Build Strategy

1. Extract the shell into a true template (config-driven, no hardcoded ContentGen content)
2. Scaffold all 4 dashboards with their own route groups, sidebar configs, and placeholder pages
3. Each dashboard gets its own agent to build out the actual content
4. Pages/content built on demand — don't fill out until the template is locked

---

## Current File Structure (ContentGen as reference)

```
src/app/isso/(agency)/          ← ContentGen dashboard routes
  layout.tsx                    ← renders IssoSidebarShell with AGENCY_NAV_CONFIG
  sidebar-config.tsx            ← defines the 5 icons + nav for this dashboard
  page.tsx                      ← Hub/overview page
  approvals/page.tsx
  recon/page.tsx
  ...

src/shared/layout/isso-sidebar/
  IssoSidebarShell.tsx          ← the sidebar shell component
  sidebar-config.tsx            ← default ISSO_NAV_CONFIG (5 icons, persistent nav, platforms)

src/features/community/         ← Hub feature (Dashboard, Approve, Vault, Saved tabs)
src/features/content-gen/       ← ContentGen feature
src/features/intelligence/      ← Intelligence feature
src/features/recon/             ← Recon feature
```

---

## Notes / Open Questions

- Persistent pages per dashboard: keep all as placeholders, customise later
- The `(chatter)`, `(editors)`, `(owners)` route groups already exist but are mostly empty stubs
- Dashboard name in sidebar currently shows "Agency" — needs to be updated to reflect actual dashboard
- Role-based routing (show dashboard based on user type) is a future concern, not now
