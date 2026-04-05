# Partnerships Domains Overview

This directory stays intentionally flat so runtime imports remain short and predictable (e.g., `@/domains/partnerships/earnings/...`). Use the table below to understand how each folder maps to the larger product areas.

| Folder | Category | Notes |
|--------|----------|-------|
| `00-onboarding/` | Onboarding | Partner activation flow (currently UI stubs + placeholder data). |
| `01-partnership-hub/` | Partnership Hub | `/partners` overview widgets. |
| `02-academy/` | Academy | Numbered sections: `01-dashboard`, `02-my-progress`, `03-courses`, `04-training-spotlight`, `06-pitch-kit`, plus `_shared/`. Portfolio now lives in the top-level `src/domains/portfolio/` domain and is consumed directly from there. Docs in `academy/_shared/docs/portal-archive`. |
| `03-pipeline-ops/` | Pipeline Ops | Numbered sections: `01-dashboard`, `02-submit-client`, `03-prospects`, `04-app-plan-generator` (stub), plus `_shared/`. |
| `04-recruitment/` | Recruitment | Numbered sections: `01-dashboard`, `02-submit-partner`, `03-sales-team`, `04-team-performance`, `05-prospects`, plus `_shared/`. |
| `05-earnings/` | Earnings & Growth | Numbered sections: `01-dashboard`, `02-wallet`, `03-tier-progression`, `04-achievements`, `05-leaderboard`, `06-challenges`, plus supporting `07-missions`, `08-overview`, `09-badges`, and `_shared/`. |
| `06-community/` | Community | Numbered sections: `01-dashboard`, `02-general-chat`, `03-wins`, `04-announcements`, `05-all-channels`, `06-messages`, `07-all-partners`, `08-help-center`, plus `_shared/`. |
| `07-workspace/` | Workspace | Tasks, files, checklist. |
| `08-notifications/` | Notifications | Centralized notifications (moved out of settings). |
| `09-settings/` | Settings | Numbered sections: `01-general`, `02-my-account`, `03-profile`, `04-devices`, `05-security`, `06-privacy`, `07-legal`, `08-integrations`, `09-wallet`, `10-checklist`, plus `_shared/`. Notifications moved to `08-notifications/`. |
| `_archive/` | Archived | Legacy feature folders (e.g., Academy saved + getting-started). Keep for reference only. |
| `_shared/` | Shared | Navigation adapters, shared UI tokens, and unified shell (formerly `shared/mobile/`; now `shared/shell/`). |

For deeper context (routes, owners, dependencies), see:
- `docs/partners/architecture/category-dashboards.md`
- `docs/partners/architecture/feature-index.md`
- `docs/partners/templates/feature-readme.md` for the per-feature README template.
