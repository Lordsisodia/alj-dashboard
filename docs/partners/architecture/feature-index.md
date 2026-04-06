# Partnership Feature Index

Tracks every runtime feature folder under `src/domains/partnerships`. Update via `pnpm generate:partner-feature <name>`.

> 📝 **Template reminder:** use `docs/partners/templates/feature-readme.md` when refreshing a feature README so ownership, routes, and portal-archive links stay consistent.

> 📁 **Layout note:** `src/domains/partnerships/*` stays flat by design so imports remain short (e.g., `@/domains/partnerships/05-earnings/...`). Use this index + the category dashboards to understand which folders roll up into which product areas. Shared platform shells now live under `shared/mobile`, `shared/tablet`, and `shared/desktop` (mobile was relocated there from the root).

## Category Map (2025-11-24)
| Category | Primary folder | Nested feature folders | Ownership notes |
|----------|----------------|------------------------|-----------------|
| Academy | `src/domains/partnerships/02-academy` | `ui/{dashboard,courses,portfolio,pitch-kit,training-spotlight}` | Training + enablement hub (docs archived under `docs/portal-archive`)
| Community | `src/domains/partnerships/06-community` | `communications/`, `messages/`, `help/` | Campus chat, announcements, help desk; comms/mobile exports live here
| Earnings | `src/domains/partnerships/05-earnings` | `wallet/`, `ui/{dashboard,tier-progression}` | Revenue intel + wallet; wallet stays inside earnings
| Workspace | `src/domains/partnerships/07-workspace` | `checklist/`, `ui/{tasks,calendar}` | Partner tasks + checklist experience
| Settings | `src/domains/partnerships/09-settings` | `menu/`, `notifications/`, `profile-docs/`, `ui/{account,general,...}` | Account, notifications, profile, integrations, etc.
| Pipeline Ops | `src/domains/partnerships/03-pipeline-ops` | `ui`, `application`, `domain`, `infrastructure` | Submit-client + tooling pre-handoff
| Recruitment | `src/domains/partnerships/04-recruitment` | `prospects/`, `team/` | Affiliate recruiting + team mgmt flows
| Partnership Hub | `src/domains/partnerships/partnership-hub` | `ui/{overview,support}` | `/partners` overview & hub widgets
| Portfolio | `src/domains/partnerships/portfolio` | `components/`, `hooks/`, `pages/`, etc. | Proof assets + case studies powering Academy/Hub
| Onboarding | `src/domains/partnerships/onboarding` | (skeleton only) | Partner onboarding journey (stubs awaiting build)
| Shared | `src/domains/partnerships/_shared` | `navigation/`, `contracts/`, `events/`, `mobile/`, `tablet/`, `desktop/` | Cross-cutting utilities + adapters + shared platform shells
