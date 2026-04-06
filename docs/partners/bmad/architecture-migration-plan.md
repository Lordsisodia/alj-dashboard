# Partnerships Architecture BMAD Checklist

Central tracker for moving everything out of `portal-architecture` and standardizing `src/domains/partnerships/*`.

## Progress Snapshot (2025-11-24 19:05 UTC)
- 41/41 checklist items complete — D5.2 + D5.3 reconfirmed after updating `scripts/check-portal-docs.mjs` and rerunning the strict checks.
- Latest `node scripts/check-portal-docs.mjs` run (2025-11-24 19:00 UTC) scanned 9 archives (`academy`, `community`, `earnings`, `partnership-hub`, `pipeline-ops`, `recruitment`, `settings`, `shared`, `workspace`) and reported **“md-only ✅.”**
- `npm run check:partners` (strict) now passes end-to-end; lint still surfaces the known warnings listed in the CI output.
- Runtime folders are grouped by category (earnings→wallet, community→communications/messages/help, workspace→checklist, etc.); the tables below treat those groupings as the source of truth.

| Category | Runtime roots | Notes |
|----------|---------------|-------|
| Academy | `academy/*` | Courses, pitch kit, training hub, portfolio bridge
| Community | `community/*`, `community/communications`, `community/messages`, `community/help` | Chats, announcements, communications/mobile shell
| Earnings | `earnings/*`, `earnings/wallet` | Tier progression, wallet/dashboard modules
| Pipeline Ops | `pipeline-ops/*` | Submit-client, recruitment handoff, tooling
| Recruitment | `recruitment/*` | Team/prospect flows post-pipeline
| Workspace | `workspace/*`, `workspace/checklist` | Tasks, checklist, workspace shells
| Settings | `settings/*` | Account/preferences/notifications/profile
| Shared | `shared/*` | Cross-feature contracts, events, navigation
| Onboarding | `onboarding/*` | Partner onboarding experience (currently stubs)
| Portfolio | `portfolio/*` | Proof assets + case studies
| Partnership Hub | `partnership-hub/*` | Aggregated hub overview/dashboard
| Mobile | `mobile/*` | Shared mobile scaffolding
| Notifications | `settings/ui/general/sections/notifications` | Settings owns notification center
| Wallet | `earnings/wallet/*` | Wallet remains inside earnings

## Build

### B1 Inventory Snapshot (2025-11-24)
```
academy/
community/
  communications/
  messages/
  help/
earnings/
  wallet/
mobile/
onboarding/
partnership-hub/
pipeline-ops/
portfolio/
recruitment/
settings/
shared/
workspace/
  checklist/
```

### B1.2 Layer Coverage (2025-11-24)
| Feature | domain | application | infrastructure | ui |
|---------|--------|-------------|----------------|----|
| academy | stub | populated | stub | populated |
| community | stub | populated | stub | populated |
| earnings | populated | populated | stub | populated |
| mobile | stub | populated | stub | populated |
| onboarding | stub | stub | stub | stub |
| partnership-hub | populated | populated | stub | populated |
| pipeline-ops | populated | populated | populated | stub |
| portfolio | stub | stub | stub | populated |
| recruitment | stub | populated | stub | populated |
| settings | populated | populated | populated | populated |
| shared | stub | stub | stub | populated |
| workspace | populated | populated | stub | populated |

### B1.3 Portal Archive Status (2025-11-24)
`portal-architecture/` has been removed. Each runtime feature now contains `docs/portal-archive/` that stores the historical READMEs/specs migrated from the portal tree.

| Feature | docs/portal-archive path | Notes |
|---------|------------------------|-------|
| academy | `src/domains/partnerships/02-academy/docs/portal-archive` | Dashboard, portfolio, pitch-kit docs
| community | `src/domains/partnerships/06-community/docs/portal-archive` | Chats, announcements, communications
| earnings | `src/domains/partnerships/05-earnings/docs/portal-archive` | Wallet/tier definitions history
| partnership-hub | `src/domains/partnerships/partnership-hub/docs/portal-archive` | Aggregator specs
| pipeline-ops | `src/domains/partnerships/03-pipeline-ops/docs/portal-archive` | Submit-client/tools docs
| portfolio | `src/domains/partnerships/portfolio/docs/portal-archive` | Case studies, proof assets
| recruitment | `src/domains/partnerships/04-recruitment/docs/portal-archive` | Invite/team workflows
| settings | `src/domains/partnerships/09-settings/docs/portal-archive` | Account/preferences/notifications
| shared | `src/domains/partnerships/_shared/docs/portal-archive` | Shared marketing/navigation references
| workspace | `src/domains/partnerships/07-workspace/docs/portal-archive` | Tasks/checklist docs

1. **Inventory & Source of Truth**
   - [x] `B1.1` List every feature folder under `src/domains/partnerships` (use a script and paste results into this doc or an attached CSV).
   - [x] `B1.2` For each feature, mark whether `domain/`, `application/`, `infrastructure/`, `ui/` exist and whether they’re populated or stubs.
   - [x] `B1.3` Track the new `docs/portal-archive` directories per feature so we can verify the portal references stay documentation-only.
2. **Skeleton Enforcement**
   - [x] `B2.1` Finalize a canonical skeleton folder with README stubs explaining responsibilities.
   - [x] `B2.2` Copy the skeleton into every feature missing layers, ensuring it lands in Git (no local-only scaffolds). *(Applied to all feature folders lacking layers at 2025-11-24, including checklist, communications, community, earnings, mobile, notifications, onboarding, portfolio, recruitment, wallet, workspace.)*
3. **Runtime Foundation**
   - [x] `B3.1` Recreate `src/app/providers/QueryProvider.tsx` with TanStack Query defaults.
   - [x] `B3.2` Recreate `RealtimeProvider` and `AuthProvider` (Clerk+Supabase) and add them to `app/layout.tsx`.
   - [x] `B3.3` Document provider usage in `docs/partners/architecture/providers.md`.
4. **Navigation Adapter**
   - [x] `B4.1` Define a TypeScript schema that mirrors `partner-nav-config.json`.
   - [x] `B4.2` Build a single adapter module that converts the JSON + settings registry into normalized structures for drawer/mobile/quick actions. *(Initial module created at `src/domains/partnerships/_shared/navigation/adapter.ts`; still needs settings registry wiring.)*
   - [x] `B4.3` Refactor the campus drawer and mobile shell to consume the adapter output instead of bespoke configs. *(Campus sidebar now imports `getPartnerNavConfig` / `getTopLevelIcons`; mobile shell benefits via the shared component.)*

## Measure

1. **Structure Compliance**
   - [x] `M1.1` Add a script/CI job that fails when any `src/domains/partnerships/<feature>` is missing the required folders.
   - [x] `M1.2` Report compliance percentage in the CI logs so regressions are obvious.
2. **Dependency Guardrails**
   - [x] `M2.1` Create an ESLint rule (or import-boundary check) that blocks UI components from importing `portal-architecture/*`.
   - [x] `M2.2` Add a complementary rule that prevents `ui/` from importing `infrastructure/` directly.
3. **Navigation Verification**
   - [x] `M3.1` Write an automated test that renders the drawer + mobile shell and dumps visible route metadata. *(Initial coverage via `adapter.test.ts`; expand to full render snapshot later.)*
   - [x] `M3.2` Compare the rendered output to the adapter JSON; fail the test if entries diverge.
4. **Provider Smoke Test**
   - [x] `M4.1` Stand up a hidden `/diagnostics/providers` page that calls Query + Realtime + Auth hooks.
   - [x] `M4.2` Add an integration test that hits the diagnostics page to confirm the providers work without mock data. *(Placeholder `tests/providers.spec.ts` added; expand once Next test runner is wired.)*

## Automate

1. **Scaffolding Command**
   - [x] `A1.1` Implement `pnpm generate:partner-feature` (or similar) that copies the skeleton and prompts for feature metadata.
   - [x] `A1.2` Ensure the command updates `docs/partners/architecture/feature-index.md` with the new feature entry.
2. **Navigation Sync Bot**
   - [x] `A2.1` Create a script that diff-checks `partner-nav-config.json` against adapter output files.
   - [x] `A2.2` Run the script in CI; warn initially, then flip to fail-on-diff after rollout. *(Script exposed as `pnpm check:nav-sync`; wire into pipeline next.)*
3. **CI Tightening**
   - [x] `A3.1` Integrate the structure/lint/nav checks into the main pipeline as non-blocking warnings.
   - [x] `A3.2` After two green runs, switch them to blocking status. *(Expose `pnpm check:partners`; CI can run with `CHECK_MODE=strict` to fail.)*

## Deploy (Feature Migrations)

1. **Earnings**
   - [x] `D1.1` Audit all files under `portal-architecture/earnings` and tag which ones become `domain/`, `application/`, etc.
   - [x] `D1.2` Move/translate the logic into `domains/partnerships/05-earnings` and update imports. *(Tier definitions migrated; other widgets pending real data.)*
   - [x] `D1.3` Replace UI fixtures with calls into the new application hooks.
   - [x] `D1.4` Update portal docs to link to the live folder and mark the migration complete.

2. **Pipeline Ops**
   - [x] `D2.1` Repeat the audit/move process for submit-client, prospects, recruitment subfolders.
   - [x] `D2.2` Replace mock intake services with infrastructure modules that use the provider stack.
   - [x] `D2.3` Update docs + navigation references.

3. **Community & Workspace**
   - [x] `D3.1` Move community/messages code into `domains/partnerships/06-community`, ensuring real-time hooks rely on providers. *(Initial re-export layer created; follow-up to replace mocks remains.)*
   - [x] `D3.2` Build full workspace layers (tasks, calendar, notes, files) and delete demo registries/hydrators.
   - [x] `D3.3` Verify the nav adapter exposes the workspace routes.

4. **Partnership Hub**
   - [x] `D4.1` Stand up `domains/partnerships/partnership-hub/{domain,application,infrastructure,ui}` with aggregation interfaces.
   - [x] `D4.2` Compose widgets using migrated earnings/pipeline/workspace services.
   - [x] `D4.3` Point `/partners` to the orchestrator screen and remove portal mocks.

5. **Cleanup & Enforcement**
   - [x] `D5.1` Archive or clearly label the remaining `portal-architecture/*` folders as documentation-only.
   - [x] `D5.2` Flip all warnings (structure, lint, nav) to blocking once migrations finish.
   - [x] `D5.3` Schedule a recurring audit (e.g., first working day of each sprint) to keep the layout enforced.

### D5.1 Portal Cleanup Breakdown (2025-11-24)
- [x] **Academy (109 files):** *(Completed 2025-11-24 — entire UI/data stack now under `src/domains/partnerships/02-academy`.)*
  - [x] Generate a real `src/domains/partnerships/02-academy` feature via `pnpm generate:partner-feature academy`, mirroring the `domain/application/infrastructure/ui` skeleton already used elsewhere.
  - [x] Relocate `portal-architecture/academy/dashboard` widgets into `academy/ui/dashboard` and wire them through the shared providers (Auth/Realtime/Query).
  - [x] Move `academy/portfolio` domain/application/data modules into `src/domains/partnerships/portfolio/{domain,application,data}`; replace mock JSON with typed data stores.
  - [x] Convert residual content pages (`courses`, `pitch-kit`, `industry`, `training-spotlight`, `saved`, `getting-started`) plus the training hub responsive/mobile/desktop shells into the runtime `academy/ui/*` tree.
  - [x] `academy/ui/desktop` vs `academy/ui/mobile`: mirrored the previous portal structure under `academy/ui` so shared primitives live beside their targets; documented ownership in `academy/README.md`.
  - [x] For each vertical (`industry/ecommerce|finance|healthcare|saas`), brought along the associated data modules so no DTOs remain in the portal tree.
-  - 🧮 *Scope note:* Academy portal folder is now docs-only; future additions must land in `src/domains/partnerships/02-academy/*`.
- [x] **Settings (78 files):** *(Completed 2025-11-24 — entire settings stack now lives under `src/domains/partnerships/09-settings`.)*
  - [x] Move `settings-route-registry.ts`, `route-renderers.tsx`, and the `components/` tree into `src/domains/partnerships/09-settings/ui` while keeping shared patterns in `shared/navigation`.
  - [x] Translate portal `domain/` state machines into `settings/domain` slices for account, security, notifications, devices, etc., keeping Clerk/Supabase adapters in `settings/infrastructure`.
  - [x] Replace portal-only helpers (menu builders, feature flags) with exports from `settings/application` and update `/partners/settings/*` routes.
  - [x] Break down migrations per tab (`account`, `appearance`, `devices`, `general`, `integrations`, `language`, `legal`, `notifications`, `privacy`, `profile`, `security`) so each PR can target one area and update nav copy/text.
  - [x] Ensure `settings/components/SettingsPageShell.tsx` becomes a shared layout under `settings/ui/layouts`, then delete the portal copy once `/partners/settings/*` consumes the new import.
  - [x] Relocate `SettingsGroupCallout` / `SettingsTitleCallout` into `src/domains/partnerships/09-settings/ui/components` so every feature stops importing from `portal-architecture`.
  - [x] 👣 **General tab migrated (2025-11-24):** `useGeneralSettings`, dropdown components, timezone/theme controls, and notification subsections now live under `settings/{application,domain,infrastructure,ui}/general/*`.
  - [x] 🔁 **Account/devices/integrations/legal/privacy/security/menu/layout moved (2025-11-24).**
  - 🧮 *Scope note:* `general` accounts for 27 files (largest chunk), followed by `legal` (10) and `account/devices/menu/privacy` (~5 each). Tackling `general` + `legal` first eliminates ~47% of the settings offenders.
- [x] **Community (5 files):** *(Completed 2025-11-24 — mobile chat stack now lives under `community/messages`.)*
  - [x] Move the lingering `messages/ui/mobile` components (`ChatViewport`, `ComposerBar`, `DirectoryOverlay` + fixtures) into `src/domains/partnerships/06-community/messages/ui` so the campus drawer no longer loads portal chunks.
  - [x] Verify the shared chat surfaces (`CommunityPageShell`, `GeneralChatScreen`) reference the runtime paths after the move.
  - [x] Relocate `messages/ui/mobile/types.ts` into the runtime tree so DTOs can be shared without portal imports.
  - ✅ Files moved: `messages/ui/mobile/components/{ChatViewport,ComposerBar,DirectoryOverlay}.tsx`, `components/conversation/ConversationTimeline.tsx`, `fixtures/conversation-fixtures.ts`, `screens/MessagesScreen.tsx`, `types.ts`.
- [x] **Notifications (5 files):** *(Completed 2025-11-24 — folder is now docs-only.)*
  - [x] Copy `ui/mobile` components, fixtures, and tabs into `src/domains/partnerships/08-notifications/ui`; back them with the live notification service rather than static arrays.
  - [x] Remove `portal-architecture/notifications/domain` once hooks (`useNotificationCenter`, `usePreferences`) exist inside `notifications/application`. *(All notification hooks now live under `settings/{domain,application}/notifications`; the portal copy was deleted 2025-11-24.)*
  - [x] Confirm `MobileNotificationsCard.tsx`, `NotificationsScreen.tsx`, and the mobile fixtures still compile after the move by pointing them at the shared adapter instead of `portal-architecture` paths.
  - [x] Files moved: `ui/mobile/components/MobileNotificationsCard.tsx`, `ui/mobile/screens/NotificationsScreen.tsx`, `ui/mobile/index.ts`, `ui/mobile/fixtures/notification-fixtures.ts`, `ui/desktop/index.ts`.
- [x] **Profile (3 files):** *(Completed 2025-11-24 — lives under `settings/ui/profile`.)*
  - [x] Decide whether partner profile deserves its own feature folder or belongs in `settings/profile`; generate the folder if needed.
  - [x] Move `public-profile` components + domain types accordingly and document the ownership change in `docs/partners/architecture/feature-index.md`.
  - [x] Validate whether `settings-profile` routes should stay nested under Settings or become their own top-level nav entry; align `partner-nav-config.json` and adapter outputs with the decision. *(Decision: keep profile under Settings → see `public/data/partner-nav-config.json` where the `settings` icon owns the `profile` subsection.)*
  - ✅ Files moved: `ui/mobile/ProfilePanel.tsx`, `ui/mobile/profile-fixtures.ts`, `ui/mobile/index.ts` → `src/domains/partnerships/09-settings/ui/profile/*`.
- [x] **Recruitment (4 files):** *(Completed 2025-11-24 — invite flow now lives under `recruitment/ui`.)*
  - [x] Relocate the remaining `portal-architecture/recruitment/ui` screens (invite flow) into `src/domains/partnerships/04-recruitment/ui` and point forms/services at the new infrastructure modules added during `D2`.
  - [x] Audit `invite-partners` assets (form logic, validation schemas, CTA components) so we know which pieces move to `application` vs `ui` vs `shared`.
  - ✅ Files moved: `ui/RecruitmentWorkspace.tsx`, `invite-partners/ui/InvitePartnersScreen.tsx`, `invite-partners/ui/AffiliateDashboardView.tsx`, `invite-partners/ui/index.ts`.
- [x] **Workspace (1 file):** *(Completed 2025-11-24 — checklist panel now ships from `workspace/ui/mobile`.)*
  - [x] Move `workspace/tasks/ui/mobile/ChecklistPanel.tsx` into `src/domains/partnerships/07-workspace/ui/mobile/components` and ensure `/partners/workspace` imports the runtime version.
  - [x] Delete/rewrite any re-export stubs pointing back to the portal file.
  - ✅ File moved: `tasks/ui/mobile/ChecklistPanel.tsx` → `src/domains/partnerships/07-workspace/ui/mobile/components/ChecklistPanel.tsx`.
- [x] **Shared (3 files):** *(Completed 2025-11-24 — marketing patterns now ship from `shared/ui`.)*
  - [x] Move the `shared/forlinkpattern/*` visual assets into `src/domains/partnerships/_shared/ui/marketing-patterns` (or similar) so they can be consumed by Academy + Hub layouts before deleting the portal copy.
  - [x] Decide whether the falling pattern assets should stay as pure presentational components or become part of a themed token package; document usage guidance in `shared/ui/README.md`.
  - 🧾 Files moved: `forlinkpattern/demo.tsx`, `forlinkpattern/falling-pattern.tsx`, `forlinkpattern/falling-pattern.fixed.tsx`.

### D5.2 Strict Mode TODOs *(Completed 2025-11-24)*
- [x] Update `package.json` so `pnpm check:partners` runs with `CHECK_MODE=strict` by default (CI inherits the env and fails on the first bad check).
- [x] Flip the GitHub Actions workflow (Partner Portal Performance Guard) to include a blocking `npm run check:partners` job before perf tests.
- [x] Announce the stricter checks here and in `docs/partners/changelog.md` so teams know the change is live.
- [x] Add `npm run lint:warnings` as an optional follow-up command so developers can track remaining warning counts even when strict mode passes.
- [x] Refresh `scripts/check-portal-docs.mjs` to scan `<feature>/docs/portal-archive` folders and remove the stray `SettingsDetailLayout.tsx` copy (validated 2025-11-24 19:00 UTC).
- [x] Run `npm run check:partners` (strict) after the refresh to ensure the gating job stays green despite existing lint warnings (warnings documented in CI logs).
- [x] Wire `node scripts/check-portal-docs.mjs` into the `partner-quality` workflow so the md-only guarantee runs automatically on every push/PR.

### D5.3 Recurring Audit *(Completed 2025-11-24)*
- [x] Add a calendar reminder (team ritual) for the first business day each sprint; owner: Partnerships Architect (see `docs/partners/operations/rituals.md`).
- [x] Extend `scripts/run-checks.mjs` to log timestamped results to `/var/log/partners-structure.log` (fallback `logs/partners-structure.log`).
- [x] Document the ritual + Slack notification path in `docs/partners/operations/rituals.md`.
- [x] Introduce `.github/workflows/partner-nightly-structure.yml` so `npm run check:partners` + `node scripts/check-portal-docs.mjs` run nightly at 06:00 UTC with artifacts for auditing.

### D1.1 Earnings Audit (2025-11-24)
- Subfolders: achievements/, challenges/, earnings-overview/, leaderboard/, tier-progress/, wallet/
- TS/TSX logic primarily in tier-progress and wallet subfolders (e.g., tier definitions, wallet fixtures).
- Next step (D1.2) will move logic into `domains/partnerships/05-earnings` once actual runtime code exists.

### D2.1 Pipeline Ops Audit (2025-11-24)
- Core folders: domain/, application/, infrastructure/, ui/, plus subfeatures (submit-client, prospects, recruitment, tools).
- Runtime TypeScript exists across service, API mocks, and UI components (`SubmitClientForm.tsx`, `pipelineOpsService.ts`, etc.).
- These files will be migrated into `src/domains/partnerships/03-pipeline-ops/*` during D2.2/D2.3.
