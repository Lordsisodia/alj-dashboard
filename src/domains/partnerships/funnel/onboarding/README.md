# Onboarding

## Scope
- **Category:** onboarding
- **Primary routes:** `/partners/onboarding` (placeholder while UI is stubbed).
- **Core use cases:** guide new partners through activation milestones, connect checklist + settings profile data.

## Ownership
- **Squad / DRI:** Partner Success
- **Dependencies:** Will consume workspace checklist + settings profile once live.

## Layer Overview
| Layer | Exists? | Notes |
|-------|---------|-------|
| domain | ⚠️ stub (adding journey models next) |
| application | ⚠️ stub | Needs orchestrators that stitch checklist + provider data.
| infrastructure | ⚠️ stub | Awaiting onboarding API endpoints.
| ui | ⚠️ stub | Placeholder screens only.

## Legacy Docs
- Portal archive: *(none yet — onboarding never shipped in portal)*
- Specs: `docs/partners/PARTNERSHIP-PAGES-PLAN.md` (Onboarding section)

## Open Questions / TODOs
- [ ] Define onboarding journeys + states in `domain/`.
- [ ] Hydrate UI with workspace checklist + settings data once APIs ready.

## Testing Strategy
- To be defined alongside first implementation slice.
