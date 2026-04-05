# Shared Partnerships Layer

## Scope
- **Category:** shared
- **Purpose:** cross-cutting navigation adapters and shared UI tokens. (Contracts/events stubs removed.)

## Ownership
- **Squad / DRI:** Partnerships Architecture
- **Dependencies:** Consumed by every feature (nav adapter, contracts, events).

## Layer Overview
| Layer | Exists? | Notes |
|-------|---------|-------|
| domain | ⚠️ stub | Fill with normalized enums/types when needed.
| application | ⚠️ stub | Shared orchestrators (e.g., nav service) go here.
| infrastructure | ⚠️ stub | Shared API clients/helpers.
| ui | ✅ populated | Marketing patterns, shared widgets.

## Legacy Docs
- Portal archive collapsed into: `src/domains/partnerships/_shared/docs/full-link-pattern.md`
- Specs: `docs/partners/architecture/portal-archive/STANDARDS.md` (shared)

## Open Questions / TODOs
- [ ] Consolidate shared DTOs here (earnings↔hub, workspace↔notifications).
- [ ] Factor nav adapter types into shared domain folder.

## Testing Strategy
- Nav-data tests live in `shared/shell/nav-data/__tests__/adapter.test.ts`; expand as new shared modules land.
