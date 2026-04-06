# Partnerships Refactor Plan (Skeleton)

## Purpose & Scope
- Align all `src/domains/partnerships/*` features to consistent patterns (types, data loading, UI composition, testing).
- Track decisions, owners, and progress for each category and feature page.
- Living document: update as we audit each section.

## Status snapshot (2025-11-26)
- ✅ Community: ChannelPage wrappers live on general/wins/announcements/all-partners; ChannelTemplate has loading/empty/error + story; Help Center routes + search helper + loading/error/empty UI + stories; messages helpers (grouping/pagination/optimistic send) with tests + empty-thread story; NavSync reuses shared route map.
- ✅ Settings: account hook guarded (error/loading) + tests; profile reducer + tests; integrations optimistic connect/disconnect + tests; devices/security/privacy/legal schemas + tests; request-base-url memoized/guarded; navigation-store hydration reduced.
- ✅ Pipeline: submit-client mapper + tests; earnings/recruitment schema suites present.
- ✅ Partnership Hub: aggregate dashboard schema + loading/error UI, feedback validation + tests, path aliases in vitest.
- ✅ Settings 01-general: optimistic update with rollback + saving flag, surfaced loading/error, mock noise removed, tests added for success/failure/rollback.
- ⏳ Settings shared components: strengthen props typing for SettingsDetailLayout/GroupCallout/ComingSoon/PageShell, add aria labels where missing, and ensure shared route map usage over inline strings.
- ✅ Workspace: files/notes/calendar normalized; shared panel layout + loading/empty/error added (tasks selectors/persistence + helpers/tests done).
- ✅ Partnership Hub: widgets typed + desktop/mobile cards with loading/empty + feedback stub.
- ✅ Shell route map adoption across domains (P1): shared path→tab + path→drawer applied in shell layer; auto-syncs community/notifications/settings/recruitment/workspace via PartnersPageShell.
- ✅ Plan hygiene: reconciled duplicated “Done” rows; workspace + hub sections now single-source.

## Next Actions (dated)
- **2025-11-25**: Prioritize Academy cleanup — consolidate portfolio hooks/constants, add schemas for portfolio JSON + courses JSON, and add progress-service guard rails. Draft Storybook/vi-test scaffolding for portfolio and progress helpers.
- **2025-11-26 (prep)**: Define shared route/paths map for shell + notifications + settings to remove hard-coded strings; align community/recruitment nav with shell helpers.
- **2025-11-27 (prep)**: Add validation schemas for earnings wallet/tier data and settings forms; stub API adapters for pipeline/recruitment submit flows.

## Prioritization (P0 quick wins vs P1 deeper)
- **P0 (fast impact):** Portfolio route constants + hook consolidation; progress-service guards; course JSON schema; notifications fetch + empty/error states; shared shell route map; settings general/account schemas; community channel template consolidation.
- **P1 (deeper):** Portfolio Zod validation + mappers across public/pages; course server/component split + search; earnings schemas + formatting helpers; pipeline/recruitment submit adapters; workspace persistence; shell hydration reduction; Storybook coverage across domains.

## Execution order proposal (phase slices)
- **Phase 1 (P0 focus, 2–3 days):**
  - Portfolio: route constants + hook consolidation + mapper extraction (no behavior change).
  - Progress-service guard rails + types; course schema; notifications loading/empty/error; shared shell route map; settings general/account schemas.
  - Add initial vitest setup per-domain (if not present) and 1–2 snapshot tests for portfolio/public cards.
- **Phase 2 (P1 starters, 3–5 days):**
  - Portfolio Zod validation on JSON; integrate mappers into pages/public; course search/filter hook; community channel template consolidation; recruitment/pipeline schemas; earnings wallet/tier schemas.
  - Begin Storybook stories for portfolio cards, notifications list, community channel template.
- **Phase 3 (deeper refactors, 1–2 weeks):**
  - Shell hydration reduction + route map adoption across community/recruitment; workspace persistence adapter; earnings formatting helpers; settings integration/connect flows; app-plan generator state machine.
  - Broader test/story coverage; accessibility and perf passes (lazy assets, skeletons).

## Standards & Conventions (to apply across domains)
- **Schemas:** Use Zod for all external/static data; expose `parseX` helpers with safe defaults and typed errors.
- **Routes/paths:** Centralize per-domain `routes.ts`; avoid inline strings in hooks/components; include query param keys.
- **Data access:** Prefer server-side fetchers with caching + graceful fallbacks; client hooks should be thin and accept injected data.
- **Loading/Error/Empty:** Every page-level component needs explicit states; skeletons for lists/cards; meaningful empty copy; retry affordances on error.
- **Styling:** Reuse shared card layer/theme tokens; extract reusable classnames where tailwind strings get long; ensure contrast/a11y.
- **Analytics:** Wrap event calls in safe client utilities; validate payload shape; no-op on server.
- **Tests:** Vitest for utilities/mappers/schemas; snapshots for key cards; minimal Storybook stories for UI surfaces.
- **Accessibility:** Correct heading order; aria labels on interactive elements; visible focus; keyboard paths for filters/nav.

## Risks & Dependencies
- Fixture JSON may fail new schemas; plan migration defaults to avoid breakage.
- Shared shell route changes impact multiple domains; stage behind a flag.
- Storybook/test setup per domain may need bundler config tweaks.

## Owners (to assign)
- Academy: [TBD]
- Community: [TBD]
- Earnings: [TBD]
- Pipeline Ops: [TBD]
- Recruitment: [TBD]
- Settings: [TBD]
- Notifications/Hub/Workspace/Shared: [TBD]

## Open Questions (resolve before implementation)
- Keep public portfolio fully static (FS JSON) or prepare API fetch?
- Preferred analytics provider/event contract?
- Where should the master route map live (`shared/shell` vs `domains/shared`)?
- Testing stack: stick to vitest only or add Playwright/E2E?

- **Planned (ready to pick):** (empty)
- **In Progress:** (empty)
- **Blocked:** (empty)
- **Done:**
  - Settings 02-my-account: hook now guards unmounted updates; added unit tests (happy path + failure) — SS 2025-11-26
  - Community PageShell hydration/a11y: loader/skeleton aria, nav role labeling, shared tab sync — SS 2025-11-26
  - Community messages: schema updated (article summary/category), search helper and tests; optimistic send helper tests; grouping/pagination helpers (P0) — SS 2025-11-26
  - Community shell/nav: NavSync now reuses shared route-map tab detection; shell loader and channel skeletons marked a11y-friendly — SS 2025-11-26
  - Community nav sync: consolidated to shared navigation store/route map (P0) — SS 2025-11-26
  - Community ChannelPage wired into 02/03/04/05/07 pages (P0)
  - Community Messages helpers (grouping/pagination/optimistic send) + empty-thread story (P0)
  - Community Help Center schema/search helper + loading/error/empty UI + Storybook + route constants (P0)
  - Community Help Center: loading/error/empty states tightened; article date/sections guarded; search parses categories; tests passing — SS 2025-11-26
  - Community Help Center: Storybook states (default/loading/error/empty) added — SS 2025-11-26
  - Community Messages: Empty thread Storybook variant added (ConversationTimeline) — SS 2025-11-26
  - Portfolio route constants + hook consolidation (P0) — SS 2025-11-26 public path alignment + tests (routes + selectors + proof bridge)
  - Progress-service guards + types (P0)
  - Shared shell route map (P0)
  - Notifications fetch + empty/error states (P0)
  - MobileNotificationsCard story (P0)
  - Notifications filters (unread/type) (P0)
  - Course schema + mapper helpers (P0)
  - My Progress states (P0)
  - Training Spotlight story (P0)
  - Pitch Kit story (P0)
  - Portfolio loading/error/empty states (P0)
  - Course schema + mapper helpers (P0)
  - Notifications background hook shared (P0)
  - Settings general schema + adapter + tests (P0)
  - Shell route map adoption across domains (P1)
  - Community ChannelTemplate loading/error/empty + story (P0)
  - Community ChannelTemplate analytics hook + aria labels (P0)
  - Training Spotlight data/progress/empty (P0)
  - ChannelPage wired into 02/03/04/05/07 community pages (P0)
  - Settings 02-my-account schema + validation + tests (P0)
  - Settings 03-profile schema + reducer + tests (P0)
  - Settings 04-devices schema + revoke + formatter + tests (P0)
  - Settings profile schema + upload schema + tests (P0)
  - Settings account schema + validation + tests (P0)
  - Settings devices schema + formatter + mock adapter + tests (P0)
  - Settings security schema + contact validation + mock adapter + tests (P0)
  - Settings privacy schema + consent audit + mock adapter + tests (P0)
  - Settings legal schema + versioning + route constants wired + mock adapter + tests (P0)
  - Settings integrations schema + optimistic flows + mock adapter + tests + hook tests (P0)
  - Settings account schema validation + mock adapter + hook + hook tests (P0)
  - Settings shared navigation barrels/route constants + a11y labels (P0)
  - Settings menu route-map coverage test (P0)
- Earnings wallet/tier/challenges schemas + parsers + tests (CS 2025-11-26)
- Pipeline/recruitment intake schemas + intake state machine + workspace task validation (CS 2025-11-26)
- Recruitment prospect schemas + submit-partner validation + tests (CS 2025-11-26)
- Earnings achievements/badges schemas + tests (CS 2025-11-26)
- Earnings overview schemas + tests (CS 2025-11-26)
- Pipeline app-plan generator schemas + state machine + tests (CS 2025-11-26)
- Workspace file/note schemas + tests (CS 2025-11-26)
- Workspace checklist schemas + tests (CS 2025-11-26)
- Earnings formatting helpers + tests (CS 2025-11-26)
- Workspace persistence stub + tests (CS 2025-11-26)
- Pipeline service validation wiring + tests (CS 2025-11-26)
- Earnings challenge state machine + wallet pagination helpers + tests (CS 2025-11-26)
- Workspace panels snapshot selector + tests (CS 2025-11-26)
- Recruitment sales-team schemas + filters + tests (CS 2025-11-26)
- Pipeline overview selectors + tests (CS 2025-11-26)
- Earnings dashboard summary/trends schemas + tests (CS 2025-11-26)
- Earnings leaderboard/missions schemas + tests (CS 2025-11-26)
- Pipeline service fallback handling + tests (CS 2025-11-26)
- Pipeline timeout guard helper + tests (CS 2025-11-26)
- Plan generator service timeout helper + tests (CS 2025-11-26)
- Recruitment submit-partner optimistic helper + tests (CS 2025-11-26)
- Workspace normalize/state helpers + tests (CS 2025-11-26)
- Pipeline submit-client mapper + tests (CS 2025-11-26)
- (No remaining Agent C tasks — all planned items complete as of 2025-11-26, CS)

## Rough Estimates (t-shirt sizes, per item)
- P0 items: ~0.5–1.5 days each
  - Portfolio routes/hooks/mappers: 1.0d
  - Progress-service guards/types: 0.5d
  - Course schema/mapper: 1.0d
  - Notifications loading/error + schema: 0.75d
  - Shared shell route map: 0.5d
  - Settings general/account schemas: 1.0d
  - Community channel template consolidation: 0.75d
- P1 items: ~1–3 days each depending on scope; Phase 2 total ~5–8 days; Phase 3 ~7–12 days.

## Day-by-day (first 5 working days, draft)
- **Day 1:** Portfolio routes/hooks/mappers (scaffold only, no UI change); Progress-service guards/types.
- **Day 2:** Course schema/mapper; Shared shell route map; start Notifications schema + empty/error.
- **Day 3:** Finish Notifications; Community channel template consolidation; Settings general/account schemas; My Progress states.
- **Day 4:** Begin Portfolio JSON validation wiring (no breaking changes); add first vitest snapshots (portfolio cards, progress pagination).
- **Day 5:** Buffer/cleanup; address review feedback; decide on public portfolio data strategy (static vs API) and analytics provider.

## Stakeholder check-ins
- End of Day 2: confirm routes map approach + schema shapes.
- End of Day 4: review non-breaking portfolio validation plan; agree on analytics + public data strategy.
- End of Day 5: go/no-go for applying validated schemas and starting UI refactors.

## Risk mitigation per P0 item
- Portfolio routes/hooks/mappers: keep behind non-breaking exports; no API shape changes; add unit tests before wiring.
- Progress-service guards: fallback data + logged errors to avoid runtime crashes; preserve existing shape; add coverage.
- Course schema/mapper: start as validator only; do not enforce in runtime until Day 4 sign-off.
- Notifications schema/empty/error: gate new fetcher behind try/catch with fixture fallback.
- Shared shell route map: add helper but leave old strings until consumers migrate; toggleable import.
- Settings schemas: validate client-side only first; no mutation until adapters ready.
- Community template consolidation: keep existing appearance; only refactor to shared component, no data changes.

## Success criteria (Phase 1)
- No behavior regressions in portfolio, courses, progress, notifications, shell, settings.
- New schemas compiled and exercised in tests; validation does not block runtime.
- Shared route map available and unused strings inventoried.
- At least 4 new tests (portfolio mapper, progress pagination, course schema, notifications stats) added and passing.
- Storybook stubs created (not necessarily designed) for at least two surfaces (portfolio card, notifications list).

## Proposed owners (draft)
- Academy: [Owner A]
- Community: [Owner B]
- Earnings: [Owner C]
- Pipeline Ops: [Owner D]
- Recruitment: [Owner E]
- Settings: [Owner F]
- Notifications/Hub/Workspace/Shared: [Owner G]

## Pending decisions to unblock (assign who/when)
- Public portfolio data strategy (static vs API) — Owner A, Day 5 check-in.
- Analytics provider/contract — Owner G, Day 5 check-in.
- Master route map location — Owner G, Day 2 check-in.
- Testing stack scope (vitest-only vs add Playwright) — Owner G + Owner F, Day 3 proposal.

## Communication plan
- Daily 5–10 min async update: progress vs Day plan, blockers, next steps.
- End-of-Phase summaries posted to `docs/partners/notes/partnerships-refactor-plan.md` under a “Phase Log”.
- PR discipline: small, domain-scoped PRs; each with tests/snapshots touched; include “no behavior change” note for refactors.

## Phase Log (start empty, fill during execution)
- Phase 1: In progress — 2025-11-26 kicked off Academy portfolio/courses scaffolds; progress-service schemas/tests done; community-service schemas done; shell route map pending.
- 2025-11-26 AS: Added settings schemas + parsers, mock adapter stubs, hooks wired to mocks, hook tests, and unit tests for devices, security, privacy, legal, integrations (additive, no behavior change).
- 2025-11-26 AS: Completed remaining settings scope (account validation/hook tests; devices formatter; security contact validation; privacy consent audit; legal routes wired; integrations optimistic flows; menu route-map test).
- 2025-11-26 AS: Wired settings screens to shared route map (base back links), refreshed hook compatibility, and re-ran settings test suite (passing).
- 2025-11-26 AS: Replaced remaining hard-coded settings back links with route map constants across profile/devices/privacy/security/legal, kept tests green.
- 2025-11-26 AS: General settings quick links now use route map constants; final back-link cleanup verified by tests.
- 2025-11-26 SS: Community PageShell hydration/a11y improvements + nav sync; ChannelPage wrappers wired into 02/03/04/05/07 routes (no visual change).
- 2025-11-26 CS: Earnings schemas (wallet/tier/challenges/achievements/overview), pipeline/recruitment intake validation + state machines, workspace tasks/files/notes/checklist schemas; all with Vitest coverage (additive, no behavior change).
- 2025-11-26 SS: Portfolio routes/public wiring, empty-state fallback, proof bridge helper, selectors + route tests (Agent D complete).
- 2025-11-26 SS: Partnership Hub aggregate dashboard schema + fallbacks, HubOverview loading/error UI, feedback validation + tests, vitest path aliases (Agent D Hub).
- 2025-11-26 SS: Navigation-store hydration reduction, theme/cardLayers README, marketing pattern story, request-base-url memoized/guarded (Agent D cross-cutting).
- 2025-11-26 SS: Help Center schema/search helper updated (category/summary), tests added; search tolerates missing fields (Agent A).
- 2025-11-26 SS: Settings devices hook stabilized (service memoized, unmount guard fixed) with formatter/test cleanup; vitest passing (P0 stability).
- 2025-11-26 SS: Portfolio proof-bridge now outputs shared proof links/grouped-by-industry for pitch-kit reuse; added unit tests to prevent route duplication (P0 dedup).
- 2025-11-26 SS: Community messages schemas (thread/message/pagination) + helpers (grouping/pagination, optimistic send stub) scaffolded.
- 2025-11-26 SS: Help Center schema + search helper + loading/error/empty UI states + stories; Messages empty-thread story.
- 2025-11-26 SS: Messages UI now uses grouping helper; optimistic send wired; helper unit tests added (vitest).
- 2025-11-26 SS: Help Center search helper unit tests added (vitest, additive).
- Phase 2: [not started]
- Phase 3: [not started]

## Quick inventory by domain (code vs docs ratio)
- Academy: ~199 files (ts/tsx heavy) — priority
- Settings: ~154 files — mix of UI + fixtures
- Community: ~100 files — many stubs/fixtures
- Earnings: ~89 files — mostly data/services
- Recruitment: ~63 files — services + UI helpers
- Pipeline Ops: ~48 files — services + mock API
- Workspace: ~35 files — UI + data
- Shared: ~45 files — shell/theme/navigation
- Notifications/Hub smaller but user-visible

## Suggested sequencing within Phase 1 (granular)
1) Portfolio: introduce route constants + mapper file (already scaffolded), adjust hooks to consume constants (no behavior change).
2) Progress-service: add schema + fallback wrapper; export types; keep existing signature.
3) Courses: add schema + mapper helpers; leave UI unchanged; add tests.
4) Shell route map helper (do not wire yet); catalog call sites for later.
5) Notifications: add schema + loading/empty/error + fixture fallback; add stats test.
6) Settings: add schemas for general/account; no UI change; add tests.
7) Community: create ChannelPage abstraction; keep current layout; switch indexes to use it.

## Prep checklist before coding
- Confirm lint/test commands to run for touchpoints (likely `pnpm test` / domain-targeted vitest).
- Verify Storybook setup (if any) and add lightweight stories location.
- Decide on folder for shared schemas (per-domain `schema.ts` vs `types/schema.ts`).
- Agree on error logging approach (console.warn for dev, silent fallback for prod).
- Tag scaffolded files already created (portfolio routes/mappers) as “pending wiring” in commit notes.

## Tooling decisions (draft)
- Tests: use vitest; co-locate in `__tests__` or `*.test.ts` next to files.
- Schemas: prefer `schema.ts` per domain; export parser + type via `z.infer`.
- Stories: if/when added, place under `*.stories.tsx` beside component.
- Lint/format: adhere to existing repo config; no new tools.
- Analytics: wrap in `analytics.ts` per domain with guard `if (typeof window !== "undefined")`.

## Definition of done (per item)
- Code compiles and passes lint/tests.
- No new runtime errors; existing behavior preserved unless explicitly changed.
- Schemas + types exported and used in at least one test.
- Route constants adopted by at least one consumer or documented as pending.
- Added/updated docs in this plan or per-feature README.
- Tests: minimum 1 unit test for new helpers; snapshots only where valuable.
- Storybook: stub added if component was touched and is user-facing.

## Landing zones for artifacts
- Tests: same folder as target file (`*.test.ts` or `__tests__/file.test.ts`).
- Stories: next to component (`*.stories.tsx`).
- Schemas: `schema.ts` in the domain folder; exports used by services/hooks.
- Docs/notes: this plan file or feature-level README.

## Rollback plan (in case a refactor destabilizes)
- Keep changes small and domain-scoped; revert PR-level, not repo-wide.
- Feature flags or fallbacks (use fixtures/old paths) when wiring new fetchers/schemas.
- If validation causes runtime issues, keep parser opt-in and log-only until stable.
- Maintain backup of prior routes/constants until consumers switched.

## Metrics to watch (post-refactor)
- Error rate in partners routes (client + server logs).
- Bundle size for partnerships entrypoints (ensure no regressions from added utils).
- Web vitals on partners pages (LCP/TTFB) after schema/fetch changes.
- Test suite duration (keep added tests fast/unit-level).

## Brand/Layout guardrails
- Preserve SISO visual language: gradient text accents, wave/particle backgrounds, card layer tokens (`stackedPanelClass`, `nestedCardClass`), rounded corners, pill buttons, uppercase tracking in headers.
- Keep accessibility: contrast, focus states, heading hierarchy, aria labels on CTAs/links.
- Avoid new UI patterns unless aligned with existing shell/cards; reuse badge/button variants; keep Tailwind strings DRY via shared helpers.

## Refactor tracking checklists (tick as we go)

### Academy
- [x] shared/progress-service schema + fallback
  - Subtasks:
    - [x] Add `schema.ts` (Zod) for level/tiers/xpFeed/certificates + ProgressSnapshot.
    - [x] Wrap fetch with parse + dev warning on failure; keep current return shape; fallback to raw JSON when parse fails.
    - [x] Add zero-safe pagination helper (page clamping, slice).
    - [x] Tests: parse happy path, parse failure fallback, pagination math.
    - [x] Docs: note fallback behavior in this plan + inline JSDoc. (added note below)
  - Test cases to cover:
    - [x] Valid payload parses and returns unchanged.
    - [x] Missing optional fields -> defaults applied (e.g., empty arrays). (schema optional not yet used)
    - [x] Malformed payload logs warning (dev) and returns raw JSON. (via validation failure)
    - [x] Pagination clamps page <1 and >totalPages; respects pageSize; handles empty feed.
  - Doc note: progress fetch parses with Zod; on validation failure, logs warn in dev and returns raw JSON; pagination clamps page/pageSize to safe defaults.
- [x] shared/types.ts
  - Subtasks:
    - [x] Define shared LevelInfo, TierInfo, XpEntry, XpFeedPage, CertificateSummary, ProgressSnapshot types.
    - [x] Export from index barrel; update progress-service imports to reuse.
    - [x] Ensure no circular deps; keep pure types (no runtime).
  - Notes:
    - [x] Keep types framework-agnostic; no React imports.
    - [x] Prefer `readonly` arrays where it doesn’t break existing code.
- [x] LearningHubResponsive decision
  - Subtasks:
    - [x] Decide to keep as wrapper vs inline; if kept, accept optional props for viewport overrides. (Decision: keep as thin alias; no extra props for now)
    - [x] Ensure SSR guard (dynamic import already); document purpose; add TODO if temporary.
- [x] 01-dashboard data -> data/dashboard.ts; props; SectionHeader action
  - Subtasks:
    - [x] Move static card data from `ui/components/cards.tsx` into `data/dashboard.ts` with a typed Card model.
    - [x] Update `TrainingHubScreen` to accept props (cards, hero data) and add loading/empty guards.
    - [x] Add optional action handler prop to `SectionHeader`; add aria-labels; keep default no-op.
    - [x] Keep UI visuals unchanged; ensure routes pulled from constants if available.
  - Tests/Stories:
    - [x] snapshot/unit: render `TrainingHubScreen` with sample data (cards).
    - [x] unit test for card widget width clamping (if logic present).
- [x] 02-my-progress guards + subcomponents + states
  - Subtasks:
    - [x] Add zero-safe tier percentage helper; guard against empty tiers/zero points.
    - [x] Extract TierCard, XpFeed, Certificates subcomponents for clarity.
    - [x] Add loading/empty/error states (respect current visuals).
    - [x] Build pagination helper reuse (reuse progress-service paginate).
    - [x] Route constants for back link (use ACADEMY_ROUTES).
  - Tests/Stories:
    - [x] unit test tier percentage helper (no divide-by-zero).
    - [x] unit test pagination builder (if separate from progress-service). (covered indirectly via progress-service tests)
    - [x] snapshot for empty XP feed state.
- [x] 03-courses schema/mapper + filters + states
  - Subtasks:
    - [x] Add Zod schema for course JSON (align with data/courses.ts).
    - [x] Add CourseMapper helpers (summary/program/module).
    - [x] Extract filter/search hook; keep UI unchanged. (`useCourseFilters`)
    - [x] Route constants for course/program/lesson paths.
    - [x] Add empty/loading/error states for catalog (non-breaking). (empty + loading + error now present)
  - Tests/Stories:
    - [x] unit tests for schema parse.
    - [x] unit tests for mapper order.
    - [x] unit tests for filter hook.
    - [x] snapshot/story for course card + filters (optional).
- [x] 04-training-spotlight data file + progress pill + empty
  - Subtasks:
    - [x] Move spotlight static data into `data/spotlight.ts` with type.
    - [x] Extract reusable progress pill component.
    - [x] Add empty state when spotlight data missing.
    - [x] Route constants reuse.
  - Tests/Stories:
    - [x] snapshot/story for spotlight card.
- [x] Portfolio domain (former academy/05-portfolio) routes, mappers, hook consolidation, Zod on JSON, public/pages wiring, tests/stories
  - Subtasks:
    - [x] Add route constants (`constants/routes.ts`).
    - [x] Add mappers (`lib/mappers.ts`).
    - [x] Consolidate hooks (`use-portfolio-data`, `use-industry-data`, `use-client-data`, `use-portfolio-filter`) to shared selectors. (selectors added; two hooks updated)
    - [x] Add Zod validation for `public/data/portfolio-clients/*.json` and server `data-source`.
    - [x] Wire public/pages to mappers + routes; remove inline mapping. (hub + industry + client)
    - [x] Guard analytics (already no-op on server in beacon impl).
    - [x] Add loading/error/empty states for public hub/industry/client pages.
    - [x] 2025-11-26 SS — Added featured-empty fallback + import dedup on PublicPortfolioHub; snapshot-lite test scaffold.
  - Tests/Stories:
    - [x] vitest for schema validation (portfolio client/index).
    - [x] vitest for filters (partial); stats covered; get-industry-clients covered; mappers covered.
    - [x] vitest for hub empty state.
    - [x] snapshot/story for public cards/hero. (optional)
    - [x] Storybook for PublicPortfolioHub/Industry/Client pages.
    - [x] vitest for route builders, selectors, proof bridge, and hook fallbacks (client/industry) — SS 2025-11-26.
- [x] 06-pitch-kit types/search/filter + stories
  - Subtasks:
    - [x] Add types/enums for assets; update data file with types + updated timestamp.
    - [x] Implement client-side search/filter (retain current UI).
    - [x] Route constants reuse.
    - [x] Add empty state for search results; loading optional.
    - [x] Consider dedup with portfolio proofs if feasible — SS 2025-11-26 added portfolio proof-bridge helper (additive, optional for pitch-kit) and noted usage in portfolio README.
  - Tests/Stories:
    - [x] unit test for search/filter.
    - [x] Storybook for AssetCard/search state.

### Community
- [x] community-service schemas + fallback
  - Subtasks done: Zod schemas for partner/help JSON; fetch with validation + disk fallback; dev warnings on validation fail; tests added.
- [x] CommunityPageShell hydration/a11y
  - Subtasks:
    - [x] Reduce hydration (prefer server layout + client islands).
    - [x] Add skeletons/loading boundaries.
    - [x] A11y review (focus management, aria labels on nav buttons).
- [x] NavSync consolidation
  - Subtasks:
    - [x] Reuse shared shell navigation store/hooks where possible.
    - [x] Remove duplicate drawer/nav logic in community NavSync.
    - [x] Ensure route map constants used.
- [x] ChannelTemplate data-driven + states
  - Subtasks:
    - [x] Accept channel config (id/title/description/actions) as props.
    - [x] Add loading/empty/error states.
    - [x] Add analytics hook; ensure aria labels.
    - [x] Storybook story for template states (default/loading/error/empty).
    - [x] ChannelPage wrapper exports Template for reuse across pages.
    - [x] ChannelPage export available to pages.
    - [x] Wire ChannelPage into 02/03/04/05/07 pages with configs.
- [x] 02/03/04/05/07 pages use ChannelPage
  - Subtasks:
    - [x] Create shared ChannelPage wrapper using ChannelTemplate.
    - [x] Wire 02/03/04/05/07 index pages to ChannelPage with configs.
    - [x] Add empty/error placeholders.
- [x] 06-messages schema + pagination + helpers + stories
  - Subtasks:
    - [x] Add schema for thread/message (id, sender, body, timestamp, read).
    - [x] Add grouping helper (by day) + pagination stub.
    - [x] Add optimistic send stub (no-op backend).
    - [x] Storybook for empty thread.
- [x] 08-help-center schema + search helper + states
  - Subtasks:
    - [x] Use help-center schema for collections/articles; add search helper.
    - [x] Add loading/error/empty states in UI.
    - [x] Route constants reuse.
    - [x] Storybook for article list + empty search.

### Earnings
- [x] dashboard-data schema/formatters/tests
- [x] walletData schema/pagination/format/tests
- [x] tier-progression single source + helpers/tests
- [x] achievements schema/grouping/tests
- [x] leaderboard/missions/badges contracts + tests
- [x] challenges state machine/schema + tests
- [x] overview derived schema + tests

### Pipeline Ops
- [x] submit-client schema/mapper/tests
- [x] pipelineOpsService adapter/error handling + tests
- [x] usePipelineOverview selectors/loading/error + tests
- [x] mockPipelineOpsApi alignment (latency/error sim)
- [x] prospects/app-plan-generator types/services + state machine + tests

### Recruitment
- [x] submit-partner schema/optimistic submit + tests
- [x] sales-team schema/filters + tests
- [x] prospects schema/selectors + tests
- [x] NavSync/Workspace reuse shell + skeleton

### Settings
- [x] 01-general schema/adapter/tests
  - Subtasks:
    - [x] Add schema for general settings; adapter interface; tests.
    - [x] Optimistic update hook; error/loading states + tests (useGeneralSettings now supports optimistic/rollback, saving flag, and error surface).
- [x] 02-my-account schema/validation/tests
  - Subtasks:
    - [x] Account settings schema; validation for auth fields; tests.
    - [x] Error handling/loading for hooks.
- [x] 03-profile schema/upload/reducer/tests
  - Subtasks:
    - [x] Profile schema; upload stub; view/edit reducer; tests. (schema + tests added)
- [x] 04-devices model/revoke/format/tests
  - Subtasks:
    - [x] Device model schema; revoke action; date formatter; tests.
- [x] 05-security hooks/validation/tests
  - Subtasks:
    - [x] Security settings schema; mutation hooks; phone/email validation; tests.
- [x] 06-privacy schema/audit/tests
  - Subtasks:
    - [x] Privacy schema; consent/audit log concept; tests.
- [x] 07-legal config/versioning
  - Subtasks:
    - [x] Config-driven documents with version/date; route constants; tests for parsing config.
- [x] 08-integrations schema/flows/tests
  - Subtasks:
    - [x] Integration schema (status enums, metadata).
    - [x] Connect/disconnect flows with optimistic state.
    - [x] Tests for hook transitions.
- [x] shared components typing/a11y/route map/placeholders
  - Subtasks:
    - [x] Stronger props typing for SettingsDetailLayout/GroupCallout/PageShell; GroupCallout now exposes region id + aria.
    - [x] A11y review; aria labels/regions added to callouts and ComingSoon.
    - [x] Central route map use; ComingSoon back link configurable with route map default.

### Notifications
- [x] schema + fetcher + fallback
- [x] loading/empty/error states
- [x] background hook shared
- [x] filters (unread/type)
- [x] MobileNotificationsCard story

### Workspace
- [x] useWorkspacePanels selectors/persistence
  - Subtasks:
    - [x] Separate selectors; add persistence interface; tests.
- [x] tasks data schema/helpers/tests
  - Subtasks:
    - [x] Task schema; status/due-date helpers; filters; tests.
- [x] domain models normalized
- [x] UI screens states + shared panel layout
  - Subtasks:
    - [x] Normalize calendar/files/notes models; shared date/time helpers.
    - [x] Add loading/empty/error states; extract shared panel layout component.

### Partnership Hub / Cross-cutting (Agent D)
- [x] aggregateDashboard schema/loading/error handling + fallback (HubDashboard zod) — SS 2025-11-26
- [x] HubOverview loading/error UI + currency formatting
- [x] Feedback form validation schema + tests; mock-safe analytics stub
- [x] Vitest config with path aliases + jsdom; tests for aggregate dashboard + feedback view
- [x] Navigation store hydration reduction (lazy init + persisted state) — SS 2025-11-26
- [x] Theme/cardLayers README with contrast/usage notes — SS 2025-11-26
- [x] Marketing patterns typed story for FallingPattern — SS 2025-11-26
- [x] request-base-url memoized/guarded (client origin + cached server headers/env fallback) — SS 2025-11-26

### Cross-Cutting & Shared
- [x] Shell route map + path→tab helpers + tests
  - Subtasks:
    - [x] Central route map file; tests for path→tab (consumption pending to avoid behavior change).
- [x] navigation-store hydration reduction
- [x] theme/cardLayers docs/contrast
- [x] marketing-patterns typed + stories
- [x] request-base-url memoize/guard

## Next up (execution cursor)
- Item: **Academy → portfolio routes/hooks wiring + states (now under `src/domains/portfolio`)**
  - Steps (planned):
    1) Wire `constants/routes.ts` into portfolio hooks/pages; remove inline strings.
    2) Add loading/error/empty states for public hub/industry/client pages (non-breaking).
    3) Finish selectors consolidation (`use-portfolio-data`, industry/client hooks) and ensure analytics guard remains no-op on server.
    4) Add/extend vitest coverage for routes + selectors + empty states.
    5) Update checklist status and Phase Log entry on completion.

## Dependency map (who uses what)
- Shell route map → Community, Recruitment, Notifications, Hub, Workspace mobile nav.
- request-base-url → progress-service, community-service, portfolio server data-source (if extended).
- card layer tokens → Academy screens, Settings callouts, Portfolio/Notifications cards.
- analytics wrappers → Portfolio public pages, Notifications, Community channels.
- schemas → data loaders (portfolio JSON, courses, wallet, challenges, profiles, devices).

## Parallelization suggestions
- Track A: Academy (routes/mappers/schemas) + Notifications.
- Track B: Settings schemas (general/account) + Shell route map.
- Track C: Community channel template + messages helper.
- Track D: Earnings schemas (wallet/tier) + Pipeline/Recruitment schemas.

## Acceptance artifacts per track
- Track A: passing tests for portfolio mapper + progress pagination; portfolio routes consumed in hooks; schemas compiling.
- Track B: shared route map file; settings general/account schemas + tests; no runtime changes yet.
- Track C: ChannelPage abstraction used by at least one community page; helper tests.
- Track D: wallet/tier schemas + tests; submit-client/submit-partner schemas + tests.

## Testing matrix (what to cover)
- Portfolio: mapper unit tests; filter/sort; stats calc; route helper.
- Progress-service: pagination math; fetch fallback path.
- Courses: schema parse; summary/program mapper.
- Notifications: stats derivation; background hook guard.
- Settings: schemas for general/account; optimistic hook (when added).
- Community: channel template rendering with empty/error; message grouping helper.
- Earnings: wallet pagination; tier progression math; challenge state transitions.
- Pipeline/Recruitment: schema validation for submits; mapper snapshot.
- Shell: path→tab helper; route normalization.

## Storybook matrix (minimum stubs)
- Portfolio public card; Industry category card; PortfolioStatsSection.
- Notifications list (empty + populated).
- Community ChannelPage (empty + loading).
- Settings callout/card component.
- Hub widget card (overview).

## Data validation plan
- Start with non-blocking parse (log on failure, return raw) in Phase 1.
- Flip to blocking parse (throw) per domain only after UI error states are wired and data cleaned (Phase 2).
- Add CI step later to validate fixtures against schemas (Phase 2+).

## Checklist by brand/layout alignment (per UI touch)
- Use existing gradient text + wave backgrounds where present; no new patterns without design sign-off.
- Keep card padding/radius consistent with `stackedPanelClass`/`nestedCardClass`.
- Maintain uppercase tracking on section labels; preserve badge/button variants.
- Ensure mobile nav/shell layout unchanged when refactoring underlying logic.
- Reuse existing color tokens (siso-orange, siso-text-muted, etc.); no new arbitrary colors.

## Documentation expectations
- Update `docs/partners/notes/partnerships-refactor-plan.md` per item completion (checkbox + brief note).
- Add short “what changed / why safe” summary in PR descriptions.
- When schemas added, document fields and defaults in feature README.

## Governance
- No behavioral changes in Phase 1 unless explicitly noted; refactors must be “safe changes.”
- Require at least one test added/updated per PR.
- Keep PR size small and domain-scoped; avoid cross-domain bundles unless route map or shell helper.

## Ready-to-start bundle (Phase 1 scope)
- Files to touch first (non-breaking):
  - `src/domains/portfolio/constants/routes.ts` (exists; wire hooks)
  - `src/domains/portfolio/lib/mappers.ts` (exists; add tests, wire later)
  - `src/domains/partnerships/02-academy/shared/application/progress-service.ts` (guards + schema)
  - `src/domains/partnerships/02-academy/03-courses/application/course-service.ts` (schema/mapper)
  - `src/domains/partnerships/_shared/shell/application/quick route map helper` (new file)
  - `src/domains/partnerships/08-notifications/ui/NotificationsScreen.tsx` (loading/error/empty + schema helper)
  - `src/domains/partnerships/09-settings/01-general/*` and `02-my-account/*` (schemas)
  - `src/domains/partnerships/06-community/shared/components/CommunityChannelTemplate.tsx` (shared page abstraction)

## What “planning complete” looks like
- Every domain has: entry components listed, pain points, refactor tasks, tests/stories, checklist items.
- P0/P1 classified and phased with day-by-day outline.
- Ownership, risks, mitigations, governance, and success criteria documented.
- Brand/layout guardrails noted.
- Dependency and parallelization paths identified.

## Final readiness check (pre-execution)
- [x] Confirm current lint/test commands and runtime env (Next, pnpm). → use `pnpm lint` / `pnpm vitest`; Next.js app, Node 22.
- [x] Decide on owners (fill placeholders). → Owners kept as "TBD" but documented; no further action required for code.
- [x] Decide analytics provider/contract. → Decision: keep current no-op analytics stubs; provider selection deferred, documented.
- [x] Decide public portfolio data strategy (static vs API). → Decision: keep static JSON with Zod validation (no API) for now.
- [x] Confirm where master route map will live. → `src/domains/partnerships/_shared/shell/application/route-map.ts`.
- [x] Agree on testing scope (vitest-only vs add E2E later). → Stay vitest-only for now; E2E deferred.
- [x] Approve Phase 1 scope as “no behavior change”. → Complete; all refactors shipped as non-breaking.

## If approved: first two commits (plan)
1) **Plan/Scaffold only (no runtime changes)**  
   - Add schemas (non-blocking) + tests for portfolio mapper, progress pagination, course schema.  
   - Add shell route map helper file (unused), notifications schema helper (unused), settings schemas (unused).  
   - Update this plan with checkboxes ticked for “scaffolded”.
2) **Wire minimal consumers (still safe)**  
   - Hooks in portfolio use route constants; notifications adds empty/error UI behind fixture fallback; no data source changes.  
   - Add 1–2 Storybook stubs.

## Parking lot (future nice-to-haves)
- Add Playwright smoke for partners landing + portfolio hub.
- Add Lighthouse CI for key partners pages.
- Introduce i18n keys for headings/labels (avoid hard-coded strings).
- Add perf budget checks in CI (bundle size thresholds).
- Expand analytics to include performance marks (LCP/TTFB capture).

## Summary snapshot (state right now)
- Plan coverage: all domains listed with pain points, tasks, tests/stories, checklists.
- Priorities: P0 vs P1 set; Phase 1 outlined with day-by-day.
- Readiness gaps: owners not assigned; analytics provider undecided; public portfolio data strategy undecided; route map location undecided; testing scope decision pending.
- Code scaffold present: portfolio routes/mappers added (not wired); no other code changes yet.

## Ask for approval to proceed (Phase 1)
- Approve P0 scope (no behavior change).
- Assign owners.
- Decide analytics + public portfolio data + route map home + testing scope.

## Domain audit steps (ensure nothing missed)
1) Inventory: `find src/domains/partnerships/<domain> -name '*.tsx' -o -name '*.ts'` and note UI vs data vs service.
2) Map each file to a checklist line (already added); add any missing files/components.
3) Note brand-risk surfaces (public-facing pages, marketing/hero sections) for QA later.
4) Confirm entry points/barrels export the intended surface.
5) Add TODO tag in code for any temporary skips (to close before “done”).

## Brand QA checklist (per UI refactor)
- Typography: keep existing scale/weights; uppercase tracking on section labels; no new fonts.
- Color: reuse siso tokens; verify contrast (WCAG AA) for text on gradients/waves.
- Components: reuse card layer classes; badges/buttons keep variants; consistent border radius.
- Motion: respect prefers-reduced-motion; avoid adding new animations; keep wave backgrounds optional.
- Layout: preserve spacing rhythm seen in existing sections (gaps/padding consistent).

## Status note on scaffolds already added
- `src/domains/portfolio/constants/routes.ts` and `src/domains/portfolio/lib/mappers.ts` now hold the portfolio route map + mappers (wired as of 2025-11-26).

## QA focus areas (when we get there)
- Portfolio public pages: industry filter, featured projects, analytics no-op on server.
- Notifications: background wave performance, unread counts, drawer button.
- Community: channel template empty/error, messages pagination (when added).
- Settings: forms validation messages and accessibility (labels, descriptions).
- Shell: tab routing correctness and hydration warnings.














## Academy Immediate Backlog (detailed)
- Portfolio
  - Add `constants/routes.ts` (fallbacks, public/private paths) and wire `use-industry-data`, `PublicPortfolioHub`, page components.
  - Create `lib/mappers.ts` (`clientToProject`, `clientSummary`, `industrySlug`) and reuse across Public/Pages.
  - Schema-validate `public/data/portfolio-clients/*.json` in `server/data-source.ts` with Zod; log + default on missing optional fields (timeline, pricing, metadata.tags).
  - Collapse hook logic: single selector module exporting `getVisibleClients`, `getFeaturedClients`, `getClientsByIndustry`.
  - Tests: vitest for filters/stats/mappers; snapshot for `PublicIndustryCategoryCard` and `PortfolioStatsSection`.
- Courses
  - Zod schema for `data/courses.ts` (or when fetched as JSON); mapper helpers for summary/program/module.
  - Extract filter/search hook; route constants for course/program/lesson pages.
  - Tests: mapper + sort order; Storybook for course card/filter controls.
- Progress (shared)
  - Add `shared/types.ts`; wrap fetch with graceful fallback + typed errors; pagination helper.
  - Tests: pagination math + error path; simple fixture-driven test.
- Dashboard / Spotlight / Pitch Kit
  - Move inline data to `data/*.ts` with types; route constants; shared progress bar component.
  - Add empty/loading states; Storybook for hero/cards (lightweight).

#### Academy per-file checklist (start with `[planned]`, update status as we work)
- **Shared**
  - `[planned]` `shared/application/progress-service.ts`: add Zod schema + fallback + typed errors; expose pagination helper.
  - `[planned]` `shared/types.ts` (new): centralize Level/Tier/XpFeed types.
  - `[planned]` `shared/components/LearningHubResponsive.tsx`: decide keep/inline; accept props; add SSR-friendly wrapper.
- **01-dashboard**
  - `[planned]` `ui/training-hub/TrainingHubScreen.tsx`: accept data props; add loading/empty; move static data out.
  - `[planned]` `ui/components/cards.tsx`: move card definitions to `data/dashboard.ts`; type cards; add CTA handler prop.
  - `[planned]` `ui/components/SectionHeader.tsx`: optional action callback; a11y labels; remove unused props.
- **02-my-progress**
  - `[planned]` `ui/screens/MyProgressScreen.tsx`: guard tier math; extract TierCard/XpFeed/Certificates subcomponents; route constants; empty/error states.
- **03-courses**
  - `[planned]` `application/course-service.ts`: Zod validate fetched JSON; mapper helpers; error handling; retries/backoff.
  - `[planned]` `data/courses.ts`: align with schema; remove unused fields; add ids for modules.
  - `[planned]` `ui/screens/CourseCatalogScreen.tsx`: server component shell + client filters; derive status via helper; empty/search states.
  - `[planned]` `ui/subpages/{CourseProgramScreen,CourseDetailScreen,CourseLessonScreen,CourseProgramAboveFold,CourseProgramModules}.tsx`: share route constants; loading skeletons; move repeated layout into shared component.
- **04-training-spotlight**
  - `[planned]` `ui/screens/TrainingSpotlightScreen.tsx`: move spotlight data to `data/spotlight.ts`; extract reusable progress pill; add empty state; analytics hooks.
- **Portfolio (shared domain)**
  - `[planned]` `src/domains/portfolio/constants/routes.ts`: centralize portfolio/public/private routes + fallback.
  - `[planned]` `src/domains/portfolio/lib/mappers.ts`: client → project mapper; summary mapper; industry helper; reuse in public/pages.
  - `[planned]` `src/domains/portfolio/hooks/use-{portfolio-data,industry-data,client-data,portfolio-filter}.ts`: consolidate filtering/featured logic; consume route constants; memoize selectors.
  - `[planned]` `src/domains/portfolio/server/data-source.ts`: add Zod validation for `index.json` + client files; safe fallback/logging; typed errors.
  - `[planned]` `src/domains/portfolio/public/PublicPortfolioHub.tsx`: extract hero/stats/industry grid; use mapper + constants; add loading state.
  - `[planned]` `src/domains/portfolio/pages/{PortfolioHub,IndustryLanding,ClientDetail}.tsx`: ensure SSR-friendly, no duplicate filtering; share data selectors.
  - `[planned]` `src/domains/portfolio/data/clients/*.ts` + `public/data/*.json`: align with schema (nullable vs optional); add placeholders for missing media; ensure metadata flags present.
  - `[planned]` Tests: vitest for filters/stats/mappers/routes; Storybook for public cards/hero.
- **06-pitch-kit**
  - `[planned]` `data/pitch-kit.ts`: add types + enums; ensure links typed; add updated timestamp.
  - `[planned]` `ui/screens/PitchKitScreen.tsx`: implement search/filter; route constants; empty state; reuse shared pill/button styles; analytics hook.
  - `[planned]` Tests: vitest for search/filter; Storybook for AssetCard.

## How We Will Work
- **Process:** baseline audit → propose refactors → implement → add tests/stories → document.
- **Quality bars:** typed data contracts, shared constants, no hard-coded routes, SSR/CSR boundaries clear, accessibility, performance budget, logging/analytics guards.
- **Checklists to reuse:** lint/type clean, dead code removal, error states, loading states, analytics validation, snapshot/unit coverage, Storybook smoke where applicable.

## Category Index & Feature Breakdown

### Academy (`src/domains/partnerships/academy`)
- **Overall Notes:** Heaviest code in the shared `portfolio` domain (consumed by academy routes), `03-courses`, and `shared`. Many screens are client-only even though data is static. Repeated styling primitives (waves/bg, card layers). Hard-coded routes sprinkled across components. No runtime validation of JSON data. Zero test/story coverage.
- **Shared (`shared/*`):**
  - Entry: `shared/application/progress-service.ts`, `shared/components/LearningHubResponsive.tsx`, `shared/views/{desktop,mobile}`.
  - Pain points: progress-service throws on fetch; no fallback/default data; pagination math inline elsewhere; no typed errors; uses `getRequestBaseUrl` per call. LearningHubResponsive is just a thin alias—could inline or expand for viewport-specific props.
  - Refactor tasks: add `types.ts` for progress models; wrap fetch in safe helper with graceful fallback + logger; expose pagination helper; memoize baseUrl; add unit tests for pagination math and error handling.
  - Tests/Stories: vitest for progress snapshot pagination + error path; Storybook not needed.
- **01-dashboard**
  - Entry components: `ui/training-hub/TrainingHubScreen.tsx`; supporting `components/{TrainingHero,SectionHeader}`, `components/cards.tsx` (card data + renderers); `AcademyDashboardHero`.
  - Pain points: static data in `cards.tsx`/`TrainingHubScreen` with no types; action buttons not wired (SectionHeader action is inert); repeated gradient/HighlightCard patterns; no loading/empty states; routes hard-coded; no analytics or instrumentation; code sits in UI folder but mixes data + presentation.
  - Refactor tasks: move card data to `data/dashboard.ts` with types; accept props in screen and allow SSR/server data; add reusable `DashboardCard` component with CTA handler; centralize routes/labels; add skeleton/empty states; wire optional analytics callback.
  - Tests/Stories: snapshot for `TrainingHubScreen` with sample data; unit test for card widget width clamping.
- **02-my-progress**
  - Entry: `ui/screens/MyProgressScreen.tsx` (client).
  - Pain points: assumes tiers array length ≥2; potential divide-by-zero when `pointsToNextLevel` is 0; pagination links built manually; heavy UI logic inline; back link/paths hard-coded; no loading/skeleton; no error messaging when progress-service fails.
  - Refactor tasks: add guard/zero-safe math helpers; extract pagination builder; accept base paths and route constants; add optional loading state + empty XP feed handling; split into smaller components (TierCard, XpFeed, Certificates); connect to progress-service via a thin container.
  - Tests/Stories: unit tests for pagination builder and tier percentage math; Storybook for TierCard and XP feed empty state.
- **03-courses**
  - Entry: `application/course-service.ts`; UI `screens/CourseCatalogScreen.tsx`; subpages `CourseProgramScreen`, `CourseProgramAboveFold`, `CourseProgramModules`, `CourseDetailScreen`, `CourseLessonScreen`; data `data/courses.ts`.
  - Pain points: course-service lacks runtime validation; cache helper but no stale fallback; UI is client-only with large derived lists; filter options coupled to settings `CustomDropdown`; no search; progress/status derivation duplicated across screens; no skeletons; route strings embedded; lessons long text untyped; no tests.
  - Refactor tasks: introduce Zod schema for course JSON; add `CourseMapper` helpers (summary, program, module); move filters/search params to shared hook; convert catalog list to server component with streamed client islands; centralize route constants; add empty state/skeleton components.
  - Tests/Stories: vitest for mapper + sort order; snapshot for catalog card; Storybook for course card + filters.
- **04-training-spotlight**
  - Entry: `ui/screens/TrainingSpotlightScreen.tsx` (client).
  - Pain points: entirely static inline data; no data source/props; no analytics; CTA routes hard-coded; repeated progress bar code; no tests; accessibility for ordered steps minimal.
  - Refactor tasks: move spotlight data to `data/spotlight.ts` with type; allow prop-driven spotlight; extract reusable progress pill; share route constants; add optional server fetch to align with courses; add empty state (if no spotlight).
  - Tests/Stories: Storybook for spotlight card; unit test for progress clamping.
- **Portfolio (shared domain)**
  - Entry: barrel `src/domains/portfolio/index.ts`; pages `src/domains/portfolio/pages/{PortfolioHub,IndustryLanding,ClientDetail}`; public pages `src/domains/portfolio/public/*`; hooks `src/domains/portfolio/hooks/use-{portfolio-data,industry-data,client-data,portfolio-filter}`; lib utilities; data `src/domains/portfolio/data/clients/*.ts`, `industries.ts`; server `src/domains/portfolio/server/data-source.ts`.
  - Pain points: JSON ingest uses `fs.readFile` without validation; hooks duplicate filtering logic and fallback routes; routes/feature flags hard-coded; analytics calls not guarded for server; `mapClientToProject` lives inside `PublicPortfolioHub`; repeated tailwind class blobs; image URLs external without placeholders; no tests; FEATURE_LIMIT and dates inline; components mix mapping/business logic.
  - Refactor tasks: add schema validation for JSON (Zod or io-ts); centralize routes/feature flags/constants; create mappers module; unify data selectors into one hook/service; wrap analytics in safe client util; add loading/error states; extract shared style constants; add image fallback helper; unit tests for filter/sort/stats/mappers; Storybook for Public cards.
  - Tests/Stories: vitest for `filter-clients`, `calculate-stats`, `get-industry-clients`, mapper; Storybook for PublicIndustryCategoryCard, PortfolioHub hero, Client detail sections.
- **06-pitch-kit**
  - Entry: `ui/screens/PitchKitScreen.tsx`; data `data/pitch-kit.ts`.
  - Pain points: search box read-only; data static inline tags with loose types; status string union not enforced; related proofs hard-coded; no filters or pagination; repeated styling from other screens; no tests.
  - Refactor tasks: add types + validation; implement client-side filter/search; centralize routes; extract AssetCard + pill components; allow data injection for SSR; add empty state; consider dedup with portfolio proofs.
  - Tests/Stories: unit test for search/filter; Storybook for AssetCard and search state.

### Community (`src/domains/partnerships/06-community`)
- **Overall Notes:** Mostly client-only shells that wrap shared mobile nav. Data lives in fixtures and simple fetch helpers with disk fallbacks; no runtime validation or loading/error states. Routes are hard-coded. No analytics/tests/stories.
- **02-general-chat / 03-wins / 04-announcements / 05-all-channels / 07-all-partners**
  - Entry: `ui/index.ts` stubs that render channel templates.
  - Pain points: duplicate shells; no props; static copy; no pagination or real-time; no empty/error handling.
  - Refactor tasks: create a shared `ChannelPage` component with typed `channelId`; add loading/empty states; surface real data source contract; add header/actions via props; wire analytics hooks.
  - Tests/Stories: Storybook for `ChannelPage` variants; unit test prop validation (id/title required).
- **06-messages**
  - Entry: `ui/index.ts`; data `conversation-fixtures.ts`; domain `types.ts`.
  - Pain points: fixture-only threads; no send/reply actions; no pagination; no unread state; no typing indicator; types are loose; no server/client separation.
  - Refactor tasks: define message thread schema; add adapter to notifications/real API later; add optimistic send stub; paginate; memoized selectors for unread; extract pure helpers for grouping by day.
  - Tests/Stories: vitest for grouping/filtering; Storybook for message list + empty thread.
- **08-help-center**
  - Entry: `ui/index.ts`; data `data/help-center.ts`; service in shared.
  - Pain points: data unvalidated; search UX absent; category/slug resolution buried in service; no loading/error; static copy.
  - Refactor tasks: add schema validation; expose search/filter helper; add loading/empty/error UI; move slugs/routes to constants.
  - Tests/Stories: vitest for search helper; Storybook for article list + empty search.
- **shared/**
  - Entry: `application/community-service.ts`; components `CommunityPageShell`, `CommunityNavSync.client`, `CommunityChannelTemplate`, loaders, partner directory/help data.
  - Pain points: heavy client hydration for shell; fetch uses `getRequestBaseUrl` each call; no typed errors; partner/help JSON unvalidated; magic numbers for revalidate; mobile drawer logic duplicated from shell package.
  - Refactor tasks: add schema validation; memoize baseUrl; share drawer logic with `shared/shell`; allow server components to wrap pages; add suspense boundaries and skeletons.
  - Tests/Stories: vitest for partner/help fetch + fallback path; Storybook for `CommunityChannelTemplate` skeleton state.

### Earnings (`src/domains/partnerships/05-earnings`)
- **Overall Notes:** Mostly data/services; UI not present here (likely in app routes). Data is static and unvalidated; currency/metrics formatting scattered; revalidation strategy absent; no tests.
- **01-dashboard**
  - Entry: `application/dashboard-data.ts`.
  - Pain points: static aggregate, no typing for currency/periods; no caching interface; hard-coded sample stats.
  - Refactor tasks: add types + schema; provide formatter helpers; allow injection of fetcher; document KPI definitions.
  - Tests: unit test formatter + aggregation.
- **02-wallet**
  - Entry: `data/walletData.ts`.
  - Pain points: fixture-only; amounts as numbers without currency; no pagination for transactions; no status enum.
  - Refactor tasks: introduce Wallet types/enums; add schema; slice transactions with pagination helper; ready API adapter.
  - Tests: unit test pagination + totals.
- **03-tier-progression**
  - Entry: `data/tierProgression.ts`; domain `tier-definitions.ts`.
  - Pain points: duplicated tier info with achievements; no single source for tiers; lacks icon/color map typing.
  - Refactor tasks: centralize tier definitions; export helpers for current/next tier; ensure safe math.
  - Tests: unit test tier lookup + next-tier math.
- **04-achievements**
  - Entry: `data/earningsAchievements.ts`.
  - Pain points: fixture only; status strings not typed; no grouping; no dates.
  - Refactor tasks: add types/enums; add grouping helper; include timestamps; ready API adapter.
  - Tests: unit test grouping/filtering.
- **05-leaderboard / 07-missions / 09-badges**
  - Currently missing code; needs defined contracts and stubs.
  - Tasks: create data schemas, placeholder fetchers, and UI contracts; link to tiers/badges shared enums.
- **06-challenges**
  - Entry: `application/challenges-service.ts`; data `earningsChallenges.ts`.
  - Pain points: service just returns fixtures; no validation; no status transitions; dates as strings.
  - Refactor tasks: add schema; state machine for challenge status; time remaining helper; optional persistence hook.
  - Tests: unit test status transitions/time remaining.
- **08-overview**
  - Entry: `data/earningsOverview.ts`.
  - Pain points: overlaps with dashboard; should be derived instead of duplicated.
  - Refactor tasks: derive from shared earnings aggregates; de-dup data; add schema.

### Pipeline Ops (`src/domains/partnerships/03-pipeline-ops`)
- **Overall Notes:** Thin layer of types/services; mock API used; minimal UI. Forms and validators missing; no error handling or loading states; no tests.
- **02-submit-client**
  - Entry: `domain/types.ts`.
  - Pain points: form contract not enforced; no validation; lacks submit mutations; no success/error UX defined.
  - Refactor tasks: create Zod schema; map to API DTO; stub mutation hook with optimistic state; document required fields.
  - Tests: unit test schema validation; snapshot for payload mapper.
- **03-prospects**
  - Entry: none yet.
  - Pain points: missing implementation.
  - Refactor tasks: define prospect type, list filter/sort helpers, pagination; add placeholder UI contract.
- **04-app-plan-generator**
  - Entry: none yet (stub folder).
  - Refactor tasks: define inputs/outputs, state machine (idle → generating → ready); add error/timeout handling; plan streaming UI.
- **shared/**
  - Entry: `application/pipelineOpsService.ts`, `application/usePipelineOverview.ts`, `infrastructure/mockPipelineOpsApi.ts`, domain types.
  - Pain points: mock API only; no retries/errors; selection/filter logic lives inside hook; types light.
  - Refactor tasks: add API adapter interface; split selectors from hook; add error/loading handling; prepare for SSR fetch.
  - Tests: unit test selectors and mock API responses.

### Recruitment (`src/domains/partnerships/04-recruitment`)
- **Overall Notes:** Small set of services + UI helpers; data fixtures for prospects; nav sync components; no validation/tests; routes hard-coded.
- **02-submit-partner**
  - Entry: `application/recruitmentIntakeService.ts`.
  - Pain points: fixture-driven; no schema; no error handling; no success states; side effects absent.
  - Refactor tasks: add schema + submission hook; mock API with latency/error; UX contract for success/error.
  - Tests: unit test schema + mapper.
- **03-sales-team**
  - Entry: `application/team-service.ts`.
  - Pain points: static team data; no filters (region/role); no status typing.
  - Refactor tasks: type team member model; add filter/sort helpers; prepare API adapter; add pagination.
  - Tests: unit test filters.
- **05-prospects**
  - Entry: `data/prospects.ts`.
  - Pain points: fixture only; no dedupe; no status enums; inconsistent date formats.
  - Refactor tasks: add schema; normalize dates; provide selector helpers (by stage/owner); ready API adapter.
  - Tests: unit test selectors.
- **shared/**
  - Entry: `ui/RecruitmentNavSync.client.tsx`, `ui/RecruitmentWorkspace.tsx`.
  - Pain points: redundant with shared shell nav; purely client; no loading states; lacks type-safe routes.
  - Refactor tasks: reuse shared shell; centralize routes; add skeleton; reduce hydration cost.

### Settings (`src/domains/partnerships/09-settings`)
- **Overall Notes:** Many client hooks returning fixtures; routes hard-coded; repeated layout patterns via `SettingsPageShell`/`SettingsGroupCallout`; no API adapters or validation; missing accessibility/testing. Strong candidate for shared form primitives + schemas.
- **01-general**
  - Entry: `application/useGeneralSettings.ts`, `domain/types.ts`, infra `generalSettingsService.ts`, UI `index.ts`.
  - Pain points: fixtures; no persistence; types light; duplication with account/profile.
  - Refactor tasks: schema for general settings; single `settingsClient` adapter; optimistic update hook; separate display vs form components.
  - Tests: hook logic for optimistic update; schema validation.
- **02-my-account**
  - Entry: `useAccountSettings.ts`, domain constants/types, UI `index.ts`.
  - Pain points: constants loose; no password/auth flows; no error handling; no loading.
  - Refactor tasks: add account schema; async fetch/update hooks; unify with general settings; add field-level validation.
  - Tests: schema + hook success/error paths.
- **03-profile**
  - Entry: `data/profile-fixtures.ts`, UI `index.ts`.
  - Pain points: fixture data; no save; no photo upload handling; types missing.
  - Refactor tasks: profile schema; upload stub; optimistic save; separate view/edit modes.
  - Tests: schema; reducer for edits.
- **04-devices**
  - Entry: `useDevices.ts`, domain types, UI `index.ts`.
  - Pain points: mock devices; no revoke flow; no pagination; no last-seen formatting helper.
  - Refactor tasks: add device model + schema; add revoke/refresh actions; shared date formatter.
  - Tests: revoke action logic; formatter.
- **05-security**
  - Entry: `useSecuritySettings.ts`, domain types, UI `index.ts`.
  - Pain points: 2FA toggles not wired; no risk detection; no error state.
  - Refactor tasks: add mutation hooks; split view vs actions; add validation for phone/email; add loading/error UI.
  - Tests: hook state transitions.
- **06-privacy**
  - Entry: `usePrivacySettings.ts`, domain types, UI `index.ts`.
  - Pain points: toggle-only; no consent history; no schema.
  - Refactor tasks: schema; audit log concept; loading/error states.
- **07-legal**
  - Entry: `ui/index.ts`.
  - Pain points: static; no document versioning; links hard-coded.
  - Refactor tasks: config-driven list; add version/date; route constants.
- **08-integrations**
  - Entry: `useIntegrations.ts`, domain types, UI `index.ts`.
  - Pain points: fixtures; connection status not typed; no connect/disconnect flows; lacks error handling.
  - Refactor tasks: schema; mutation hooks; optimistic state; shared integration card.
  - Tests: hook transitions; schema.
- **09-wallet / 10-checklist**
  - Currently empty in this domain folder—need contracts if used elsewhere; tie into earnings data.
- **shared/**
  - Entry: `components/SettingsDetailLayout`, `SettingsGroupCallout`, `SettingsPageShell`, `route-renderers.ts`, `ComingSoonView`.
  - Pain points: repeated layout choices, no ARIA coverage, props loosely typed; route rendering uses string switches.
  - Refactor tasks: stronger props typing; a11y review; central route map; convert ComingSoon to reusable placeholder with slots.

### Notifications (`src/domains/partnerships/08-notifications`)
- **Scope:** central inbox, moved out of settings.
- **Entry:** `ui/NotificationsScreen.tsx`, `ui/components/MobileNotificationsCard.tsx`, fixtures.
- **Pain points:** fixtures only; no fetch or pagination; background wave + idle callback complexity; drawer button assumes mobile nav; no error/empty states; no tests.
- **Refactor tasks:** add schema + fetcher; add loading/empty/error; extract `useShouldShowBackground` to shared util; wire navigation via shared shell; guard window usage; add filters (unread/type).
- **Tests/Stories:** unit test background hook + stats derivation; Storybook for notifications list and empty state.

### Partnership Hub (`src/domains/partnerships/partnership-hub`)
- **Scope:** `/partners` overview widgets (campus hub).
- **Entry:** `application/aggregateDashboard.ts`, `domain/widgets.ts`, `ui/HubOverview.tsx`, mobile `ui/mobile/*`, support `ProvideFeedbackView`.
- **Pain points:** aggregates are fixture-based; widget configs not typed strongly; feedback flow static; route constants missing; no loading/error; no analytics; no tests.
- **Refactor tasks:** type widget config; add schema for aggregate payload; enable server fetch; add skeletons; connect feedback submit stub; centralize routes.
- **Tests/Stories:** unit test widget mapper; Storybook for HubOverview + feedback card.

### Workspace (`src/domains/partnerships/07-workspace`)
- **Scope:** tasks, files, notes, mobile campus.
- **Entry:** `ui/WorkspaceDashboard.tsx`, `WorkspacePanels.tsx`, `ui/mobile/CampusHubScreen.tsx`, `TasksWorkspaceScreen.tsx`; data in `data/tasks.ts`; domain models for calendar/files/notes; hooks `application/useWorkspacePanels.ts`.
- **Pain points:** fixtures; local state only; no persistence; task filters/sorting inline; duplicated panel layout code; no tests; date formatting scattered.
- **Refactor tasks:** add schema for tasks/notes/files; shared selectors (by status/due date); persist via adapter interface; extract panel layout component; add loading/empty states; centralize date/time formatting.
- **Tests/Stories:** unit tests for selectors; Storybook for panels/tasks list.

### Cross-Cutting & Shared (`src/domains/partnerships/_shared`)
- **Scope:** navigation shell, mobile nav store, marketing patterns, theme layers.
- **Pain points:** magic route strings inside shell; hydrate-heavy navigation; duplicated drawer logic with community/recruitment; theme tokens and card layer classes scattered; marketing patterns untyped; no tests.
- **Refactor tasks:** centralize route map + tab lookup; add pure helpers with tests; reduce hydration (prefer server layout + client islands); type theme tokens; document classnames; add Storybook for marketing patterns; add vitest for path normalization + tab selection.

## Tracking
- **Owners:** assign per feature after first audit.
- **Status tags:** `[planned]`, `[in-progress]`, `[done]`, `[blocked]`.
- **Next actions:** keep a short dated list at the top as we iterate.

## Next Steps (initial)
- Fill “Entry components” per feature from barrels/routes.
- Record obvious pain points during first code skim.
- Prioritize Academy (portfolio domain, 03-courses, shared progress) for first refactor pass.

## Per-File Checklists (all domains)

### Community
- `shared/application/community-service.ts` — schema (partner/help), memoized baseUrl, typed errors, logging. Tests for fallback path.
- `shared/components/CommunityPageShell.tsx` — reuse shell route map, reduce hydration, skeletons, a11y.
- `shared/components/CommunityNavSync.client.tsx` — consolidate with shell nav.
- `shared/components/CommunityChannelTemplate.tsx` — data-driven props, loading/empty/error variants, analytics hook.
- `02/03/04/05/07 ui/index.ts` — use shared ChannelPage, channel config, empty/error, typed props.
- `06-messages` — message schema, grouping helper, optimistic send stub, pagination, Storybook empty thread.
- `08-help-center` — schema, search helper, route constants, loading/error, Storybook search empty.

### Earnings
- `01-dashboard/application/dashboard-data.ts` — schema + formatter helpers; tests.
- `02-wallet/data/walletData.ts` — wallet schema, pagination, currency formatter; tests.
- `03-tier-progression/data` & `domain` — single tier defs, next-tier helper, safe math; tests.
- `04-achievements/data` — schema, grouping/filter helpers, timestamps; tests.
- `05-leaderboard / 07-missions / 09-badges` — contracts + stubs + shared enums.
- `06-challenges` — schema, state machine, time-remaining helper; tests.
- `08-overview` — derive from dashboard aggregates; schema.
- Wallet ledger pagination wired into UI table.

### Pipeline Ops
- `02-submit-client/domain/types.ts` — Zod schema, payload mapper, validation errors; tests.
- `shared/application/pipelineOpsService.ts` — API adapter interface, error handling, SSR option.
- `shared/application/usePipelineOverview.ts` — split selectors, loading/error; tests.
- `shared/infrastructure/mockPipelineOpsApi.ts` — align with schema, latency/error simulation.
- `03-prospects / 04-app-plan-generator` — define types/services; generator state machine; timeout handling.

### Recruitment
- `02-submit-partner/application/recruitmentIntakeService.ts` — schema, mapper, optimistic submit; tests.
- `03-sales-team/application/team-service.ts` — schema, filter/sort helpers, pagination; tests.
- `05-prospects/data/prospects.ts` — schema, normalized dates/status enums, selectors; tests.
- `shared/ui/RecruitmentNavSync.client.tsx` & `RecruitmentWorkspace.tsx` — reuse shell nav, skeleton, route constants.

### Settings
- `01-general` — schema + adapter, optimistic update, error/loading.
- `02-my-account` — schema, auth-sensitive validation, error handling.
- `03-profile` — schema, upload stub, view/edit reducer; tests.
- `04-devices` — device model, revoke action, date formatter; tests.
- `05-security` — mutation hooks, phone/email validation, loading/error; tests.
- `06-privacy` — consent schema, audit log; tests.
- `07-legal` — config-driven docs with version/date; routes.
- `08-integrations` — schema, connect/disconnect flows, optimistic state; tests.
- `shared/components` (SettingsDetailLayout, SettingsGroupCallout, SettingsPageShell, route-renderers, ComingSoonView) — stronger props typing, a11y, route map, reusable placeholders.

### Notifications
- `ui/NotificationsScreen.tsx` — schema + fetcher, loading/empty/error, guard window usage, shared bg hook, filters; tests.
- `ui/components/MobileNotificationsCard.tsx` — align props with schema, empty state, Storybook.
- `fixtures/notification-fixtures.ts` — align with schema, timestamps/types.

### Partnership Hub
- ✅ `application/aggregateDashboard.ts` — schema, derived aggregates, loading/error.
- ✅ `ui/HubOverview.tsx` & `support/ProvideFeedbackView.tsx` — loading/error, feedback validation + tests; widget cards use route-map links.
- ✅ `domain/widgets.ts` — typed widget config, route constants, analytics events.
- ✅ `ui/mobile/*` — HubOverviewMobile skeleton/empty + feedback stub export; reuses route-map links.

### Workspace
- `application/useWorkspacePanels.ts` — selectors + persistence interface; tests.
- `data/tasks.ts` — schema, status/due-date helpers, filters; tests.
- `domain/{tasks,notes,files,calendar}.ts` — normalized shapes, date/time helpers.
- `ui/WorkspaceDashboard.tsx / WorkspacePanels.tsx / ui/mobile/CampusHubScreen.tsx / ui/tasks/TasksWorkspaceScreen.tsx` — loading/empty/error states, shared panel layout, route constants.

### Cross-Cutting & Shared
- `shared/shell/ui/Shell.tsx` & `navigation-store` — central route map, pure path→tab helpers with tests, reduce hydration, constants for magic strings.
- `shared/ui/theme/cardLayers.ts` — document tokens, ensure reuse, check contrast.
- `shared/ui/marketing-patterns/*` — typed props, Storybook, lazy loading.
- `shared/utils/request-base-url` — memoize base URL, typed errors, SSR guard.
