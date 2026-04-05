# Academy

## Scope
- **Category:** academy
- **Primary routes:** `/partners/academy`, `/partners/academy/my-progress`, `/partners/academy/courses`, `/partners/academy/training-spotlight`, `/partners/academy/portfolio`, `/partners/academy/pitch-kit`.
- **Core use cases:** partner education, proof assets, pitch resources, training spotlight, XP breakdown.
- **Folder order:** `01-dashboard`, `02-my-progress`, `03-courses`, `04-training-spotlight`, `06-pitch-kit`, `shared/`. (Archived: `../archive/academy/{getting-started,saved}`)

> Note: non-UI layers (`application/`, `domain/`, `infrastructure/`, `data/`, docs) now live under `shared/` to keep the root focused on page experiences.

## Ownership
- **Squad / DRI:** Partner Enablement
- **Dependencies:** Consumes portfolio UI directly from `src/domains/portfolio/`; surfaces metrics in `partnership-hub`.

## Layer Overview
| Layer | Exists? | Notes |
|-------|---------|-------|
| domain | ⚠️ stub | Build out industry/course entities.
| application | ✅ populated | Data loaders for dashboard/courses/pitch kit.
| infrastructure | ⚠️ stub | Waiting on CMS integration.
| ui | ✅ populated | Desktop + mobile screens for all academy sections.
| data | ✅ fixtures | Demo data powering mock content.

## Legacy Docs
- Portal archive: `src/domains/partnerships/academy/shared/docs/portal-archive`
- Specs: `docs/partners/architecture/portal-archive/PORTAL-README.md` (academy)

## Open Questions / TODOs
- [ ] Replace fixtures with live CMS powering courses/pitch kit.
- [ ] Move more shared assets into `portfolio`.

## Testing Strategy
- Add unit tests for course progression + XP calculations once services are implemented.
