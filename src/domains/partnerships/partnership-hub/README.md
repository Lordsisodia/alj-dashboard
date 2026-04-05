# Partnership Hub

## Scope
- **Category:** partnership-hub
- **Primary routes:** `/partners` (hub overview) and embedded widgets elsewhere.
- **Core use cases:** aggregate KPIs across earnings, pipeline ops, workspace, community, and surface support entry points.

## Ownership
- **Squad / DRI:** Partnerships Architecture
- **Dependencies:** Consumes services from earnings, pipeline ops, workspace, community.

## Layer Overview
| Layer | Exists? | Notes |
|-------|---------|-------|
| domain | ✅ populated | Aggregation contracts/interfaces.
| application | ✅ populated | Hub orchestrators + support workflows.
| infrastructure | ⚠️ stub | Future data-fetchers once backend aggregator exists.
| ui | ✅ populated | `ui/{overview,support}` renders `/partners` root.

## Legacy Docs
- Portal archive: `src/domains/partnerships/partnership-hub/docs/portal-archive`
- Specs: `docs/partners/architecture/portal-archive/ARCHITECTURE_PLAN.md` (hub section)

## Open Questions / TODOs
- [ ] Replace placeholder metrics with live service calls.
- [ ] Expand support flows to use real CRM endpoints.

## Testing Strategy
- Add integration tests once backend aggregator is wired.
