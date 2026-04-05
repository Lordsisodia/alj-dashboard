# Community

## Scope
- **Category:** community
- **Primary routes:** `/partners/community`, `/partners/community/general`, `/partners/community/wins`, `/partners/community/announcements`, `/partners/community/all-channels`, `/partners/community/messages`, `/partners/community/all-partners`, `/partners/community/help`
- **Flow order:** `01-dashboard`, `02-general-chat`, `03-wins`, `04-announcements`, `05-all-channels`, `06-messages`, `07-all-partners`, `08-help-center`, plus `shared/`.
- **Core use cases:** campus announcements, chat/communications (mobile + desktop), help center collections, wins feed.

## Ownership
- **Squad / DRI:** Partnerships Experience
- **Dependencies:** Shared realtime providers (`shared/events`), settings notifications, nav adapter.

## Layer Overview
| Layer | Exists? | Notes |
|-------|---------|-------|
| domain | ⚠️ stub | Expand beyond README with real entities for channel metadata.
| application | ✅ populated | `community-service.ts` orchestrates realtime + fixtures.
| infrastructure | ⚠️ stub | Needs actual API clients once backend available.
| ui | ✅ populated | Numbered folders per route (`01-`..`08-`) plus shared components/shells.

## Legacy Docs
- Portal archive: `src/domains/partnerships/community/01-dashboard/docs/portal-archive.md`
- Additional specs: `docs/partners/architecture/portal-archive` (community section)

## Open Questions / TODOs
- [ ] Replace chat fixtures with realtime API once available.
- [ ] Flesh out `community/domain` with typed channel + partner entities.

## Testing Strategy
- Unit: `community/application/community-service.ts`
- Integration: pending once realtime APIs exist.
