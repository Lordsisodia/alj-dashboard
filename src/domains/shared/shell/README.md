# Unified Shell (formerly mobile)

## Scope
- **Category:** shared/shell
- **Primary routes:** `/partners/(mobile)/*` composables.
- **Core use cases:** responsive navigation shell (drawer + quick actions), layout primitives, and tab/quick-action routing.

## Ownership
- **Squad / DRI:** Partner Experience
- **Dependencies:** Imports nav adapter + settings routes, exports shells for community/workspace/etc.

## Layer Overview
| Layer | Exists? | Notes |
|-------|---------|-------|
| domain | ⚠️ stub | Add higher-level shell contracts if needed (e.g., pane descriptors).
| application | ✅ populated | Nav store, tab registry, quick-action routing, shell service.
| nav-data | ✅ populated | Partner nav config adapter + hooks (from `config/partner-nav-config`).
| ui | ✅ populated | Shell components, quick-actions UI, viewport primitives.

## Legacy Docs
- Portal archive: *(none — historically lived in shared portal shell)*
- Additional specs: `docs/partners/architecture/feature-index.md#Mobile`

## Open Questions / TODOs
- [ ] Define `MobilePane` types inside `domain/` for stronger nav mapping.
- [ ] Integrate device permissions + notifications infrastructure.

## Testing Strategy
- Unit: add tests for tab registry once data model stabilizes.
