# Partnerships Architecture BMAD Plan

## Build (Weeks 0–2)
- **Inventory & Alignment**
  - Map every `portal-architecture/<feature>` folder to its live counterpart under `src/domains/partnerships/<feature>`.
  - For each feature, log current state (ui-only, demo data, partially migrated) in a shared tracker.
- **Feature Skeleton Template**
  - Create a reusable stub (`domain/`, `application/`, `infrastructure/`, `ui/`, optional `data/fixtures/README.md`).
  - Drop the stub into every partnerships feature folder that lacks the structure (earnings, workspace, community, etc.).
- **Runtime Foundations**
  - Rebuild the shared providers stack (`QueryProvider`, `RealtimeProvider`, `AuthProvider`) under `src/app/providers/` based on the legacy `apps/partners` blueprint, then wrap `app/layout.tsx` with them.
- **Navigation Adapter**
  - Implement a single adapter that ingests `partner-nav-config.json` + settings registries and emits a normalized data model for the campus drawer, mobile shell tabs, and quick actions.

## Measure (Weeks 2–3)
- **Structure Compliance**
  - CI check: every `src/domains/partnerships/<feature>` contains `domain/`, `application/`, `infrastructure/`, `ui/` with non-empty README/placeholder files.
  - Manual spot check: 3 randomly chosen features per sprint must show business logic living outside UI folders.
- **Runtime Health**
  - Confirm provider bootstrap by running a smoke test page that hits Query + Realtime + Auth hooks without mock data.
- **Navigation Parity**
  - Snapshot the drawer + mobile shell nav before/after adapter rollout; verify route parity via automated tests (compare rendered links to JSON config entries).

## Automate (Weeks 3–4)
- **Scaffolding Script**
  - Add a CLI task (e.g., `pnpm generate:partner-feature`) that copies the skeleton template and injects feature metadata (name, description, routes) directly into the new folder.
- **Lint Rules**
  - Extend ESLint with a custom rule that blocks importing `@/domains/partnerships/portal-architecture/*` from runtime code.
  - Add a rule/test that prevents React components inside `ui/` from importing `infrastructure/` modules directly (enforces dependency direction).
- **Navigation Sync Bot**
  - Write a small script that fails CI when `partner-nav-config.json` contains entries not referenced by the adapter output (and vice versa).

## Deploy (Weeks 4–8)
- **Phase 1 – Core Feature Migration**
  - Migrate Earnings and Pipeline Ops first (highest traffic). Port real services into `domain/` + `application/`, update documentation to link to the live folders.
- **Phase 2 – Collaboration Surfaces**
  - Move Community/Messages and Workspace out of portal docs, wiring them to the nav adapter + shared providers.
- **Phase 3 – Partnership Hub Orchestration**
  - Create `domains/partnerships/partnership-hub/{domain,application,infrastructure,ui}` and compose widgets from the newly migrated feature services.
- **Phase 4 – Doc Cleanup & Enforcement**
  - Mark each portal-architecture section as “implemented” once its live code exists; archive redundant prototypes.
  - Keep the CI checks/lint rules optional for one sprint, then switch them to blocking once teams have fully migrated.
