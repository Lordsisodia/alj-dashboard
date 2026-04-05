# Workspace

## Scope
- **Category:** workspace
- **Primary routes:** `/partners/workspace`, `/partners/workspace/tasks`, `/partners/workspace/files`, `/partners/workspace/checklist`.
- **Core use cases:** manage partner tasks, checklist, files, and notes.

## Ownership
- **Squad / DRI:** Partner Success
- **Dependencies:** Consumes shared storage adapters, exports checklist to mobile quick actions.

## Layer Overview
| Layer | Exists? | Notes |
|-------|---------|-------|
| domain | ✅ populated | Task + checklist models.
| application | ✅ populated | Hydrators + checklist application services.
| infrastructure | ⚠️ stub | Needs backing services for tasks/files.
| ui | ✅ populated | Mobile + desktop panels, checklist components.

## Legacy Docs
- Portal archive: `src/domains/partnerships/workspace/docs/portal-archive`
- Specs: `docs/partners/architecture/portal-archive/PORTAL-README.md` (workspace)

## Open Questions / TODOs
- [ ] Replace placeholder data with workspace API.
- [ ] Finish migrating files + notes UI into this folder.

## Testing Strategy
- Checklist-specific tests to add once API/hydrators finalize.
