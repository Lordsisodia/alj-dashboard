# Recruitment

## Scope
- **Category:** recruitment
- **Primary routes:** `/partners/recruitment`, `/partners/recruitment/submit-partner`, `/partners/recruitment/team`, `/partners/recruitment/performance`, `/partners/recruitment/prospects`.
- **Flow order:** `01-dashboard` → `02-submit-partner` → `03-sales-team` → `04-team-performance` → `05-prospects` → `shared/`.
- **Core use cases:** manage affiliate prospects, team roster, partner submissions, performance dashboards.

## Ownership
- **Squad / DRI:** Partner Growth
- **Dependencies:** Consumes pipeline-ops submissions; feeds workspace + hub widgets.

## Layout
- `shared/` — application/domain/infrastructure/data/docs.
- `01-dashboard/` — dashboard screen.
- `02-submit-partner/` — invite/submit partner experience (reuses pipeline intake).
- `03-sales-team/` — team roster screens + components.
- `04-team-performance/` — performance/metrics view.
- `05-prospects/` — recruitment pipeline screens/components/types.

## Legacy Docs
- Portal archive: `src/domains/partnerships/recruitment/shared/docs/portal-archive`
- Specs: `docs/partners/architecture/portal-archive/PORTAL-README.md` (recruitment)

## Open Questions / TODOs
- [ ] Replace stub data with real backend.
- [ ] Align team/performance data with shared analytics service.

## Testing Strategy
- Integration tests planned once backend endpoints are ready.
