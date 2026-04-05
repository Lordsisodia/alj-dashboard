# Pipeline Ops

## Scope
- **Category:** pipeline-ops
- **Primary routes:** `/partners/pipeline-ops`, `/partners/pipeline-ops/submit-client`, `/partners/pipeline-ops/prospects`, `/partners/pipeline-ops/active-deals` (supporting), `/partners/pipeline-ops/app-plan-generator` (TBD).
- **Flow order:** `01-dashboard` → `02-submit-client` → `03-prospects` → `04-app-plan-generator` → `shared/`.

## Ownership
- **Squad / DRI:** Pipeline Engineering
- **Dependencies:** Shares schemas with Recruitment; feeds Hub + Workspace widgets.

## Layout
- `01-dashboard/` — dashboard screen + widgets.
- `02-submit-client/` — intake experience and config.
- `03-prospects/` — prospects grid, detail, active deals, client notes.
- `04-app-plan-generator/` — reserved stub.
- `shared/` — application/domain/infrastructure/data/docs.

## Legacy Docs
- Portal archive (single file): `src/domains/partnerships/pipeline-ops/shared/docs/portal-archive.md`
- Specs: `docs/partners/architecture/portal-archive/PARTNERSHIP-PAGES-PLAN.md` (pipeline section)

## Open Questions / TODOs
- [ ] Replace mocks with real API clients in `shared/infrastructure`.
- [ ] Add unit tests for submit-client and pipeline overview services.

## Testing Strategy
- Unit: `pipeline-ops/shared/application` service tests (todo).
- Integration: future Playwright coverage once UI is finalized.
