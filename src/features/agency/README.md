# features/agency

> Agency domain feature modules — business logic for the owner/manager dashboard.
> Owner: `agency.agency-dash` agent
> Import alias: `@/features/agency/*`

## Sub-directories

| Directory | Route | What it builds |
|---|---|---|
| `analytics/` | `/agency/analytics` | Business analytics, revenue charts, KPI trends |
| `billings/` | `/agency/billings` | Billing management, revenue tracking, invoices |
| `comms/` | `/agency/comms` | Internal communications, messaging |
| `models/` | `/agency/models` | Model roster — talent profiles, stats, pipeline status |
| `recruitment/` | `/agency/recruitment` | Recruitment pipeline — candidates, applications |
| `staff/` | `/agency/staff` | Staff directory, roles, HR data |
| `staff-tasks/` | `/agency/staff` | Task management for staff members |

## Also Used by Agency Dashboard

These features live outside `features/agency/` but serve agency routes:

| Feature | Route | Notes |
|---|---|---|
| `features/owners-dashboard/` | `/agency/dashboard` | Agency home — P&L overview, KPIs |
| `features/schedule/` | `/agency/schedule` | Shared with ISSO schedule |
| `features/team/` | `/agency/team` | Shared with ISSO team |
| `features/ideas/` | `/agency/ideas` | Shared with ISSO ideas |
| `features/settings/` | `/agency/settings` | Shared with ISSO settings |

## Reference Project

`/Users/shaansisodia/Desktop/agency-dashboard-full/` has fully built versions of:
- Models roster
- Staff management
- Recruitment pipeline
- Social hub

Use for **patterns and ideas only** — do not copy code directly. Restyle for ISSO's light theme.

## UI Rules

- All pages use `IssoSidebarShell` + `ContentPageShell` — no exceptions
- Agency accent: `linear-gradient(135deg, #ff0069, #833ab4)` (ISSO/OFM pink)
- Light theme inside the white content card
- Match content-gen dashboard patterns — study `features/content-gen/` first

## Naming Conventions

- Main component: `{Name}FeaturePage.tsx` (e.g. `ModelsFeaturePage.tsx`)
- Sub-components: descriptive PascalCase (`ModelRosterCard.tsx`, `RevenueChart.tsx`)
- Hooks: `use{Domain}{Thing}.ts` (`useAgencyModels.ts`)
