# app/agency

> Agency dashboard routes — owner and manager view of the business.
> Owner: agency domain (`agency.agency-dash` agent)
> Import alias: N/A

## Routes

| Route | Page | Feature Component |
|---|---|---|
| `/agency` | Main dashboard | `features/agency/` (owners-dashboard) |
| `/agency/dashboard` | Dashboard home | `features/owners-dashboard/` |
| `/agency/models` | Model roster | `features/agency/models/` |
| `/agency/analytics` | Business analytics | `features/agency/analytics/` |
| `/agency/billings` | Billing & revenue | `features/agency/billings/` |
| `/agency/schedule` | Team schedule | `features/schedule/` |
| `/agency/staff` | Staff management | `features/agency/staff/` |
| `/agency/team` | Team management | `features/team/` |
| `/agency/recruitment` | Recruitment pipeline | `features/agency/recruitment/` |
| `/agency/comms` | Communications | `features/agency/comms/` |
| `/agency/ideas` | Ideas board | `features/ideas/` |
| `/agency/reports` | Business reports | stub |
| `/agency/settings` | Agency settings | `features/settings/` |

## Layout

Uses `agency/layout.tsx` + `agency/sidebar-config.tsx`. The sidebar config defines the agency-specific nav items.

## Who Uses This Dashboard

| Role | Access | Key pages |
|---|---|---|
| Owner (Alex) | Full access | Dashboard, Billings, Analytics |
| Manager | Operational | Models, Schedule, Staff, Team |

## Import Rules

- Pages import from `@/features/agency/*` or `@/features/{name}/components`
- Never import from `src/app/content-gen/` — those are separate dashboards
- Never import marketing components

## Key Files

- `layout.tsx` — agency shell layout with sidebar
- `sidebar-config.tsx` — agency sidebar navigation config
- `page.tsx` — redirects to `/agency/dashboard`
