# Portfolio

## Scope
- **Category:** portfolio
- **Primary routes:** exposed via `/partners/academy/portfolio` and hub cards.
- **Core use cases:** manage proof assets, case studies, pitch materials consumed by Academy + Hub.

## Ownership
- **Squad / DRI:** Partner Marketing
- **Dependencies:** Shared by Academy, Partnership Hub, and future Growth pages.

## Layer Overview
| Layer | Exists? | Notes |
|-------|---------|-------|
| domain | ⚠️ stub | Needs typed asset/category definitions.
| application | ⚠️ stub | Add selectors + filtering services.
| infrastructure | ⚠️ stub | Hook into CMS once available.
| ui | ✅ populated | Components powering Academy portfolio screens.

## Legacy Docs
- Portal archive: `src/domains/partnerships/portfolio/docs/portal-archive`
- Specs: `docs/partners/architecture/portal-archive/PORTAL-README.md` (portfolio)

## Open Questions / TODOs
- [ ] Define asset metadata + filtering rules under `domain/`.
- [ ] Move more UI logic out of `/app/partners/academy/portfolio` into this folder.
- [x] Note: pitch-kit can reuse portfolio proofs via `mapClientsToProofAssets` in `lib/proof-bridge` (avoids duplicate data).
- [x] Document proof-link helpers for pitch-kit reuse (`toProofLink`, `groupProofLinksByIndustry`) in `lib/proof-bridge`.

## Testing Strategy
- Unit tests to follow once asset services exist.
