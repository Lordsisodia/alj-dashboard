# Partnerships Category Dashboards

Quick reference for every runtime bucket inside `src/domains/partnerships`. Use this when deciding where a new feature lives or when auditing coverage.

## Academy
- **Scope:** Courses, pitch kit, portfolio/saved assets, training spotlight, XP breakdown.
- **Primary routes:** `/partners/academy`, `/partners/academy/courses`, `/partners/academy/pitch-kit`, `/partners/academy/portfolio`.
- **Key folders:** `academy/application`, `academy/domain`, `academy/ui/{dashboard,courses,portfolio,pitch-kit,training-spotlight}`.
- **Dependencies:** Pulls proof assets from `portfolio`, shared nav tokens from `shared/navigation`.

## Community
- **Scope:** Campus feed, communications/mobile shell, announcements, wins, help center.
- **Primary routes:** `/partners/community`, `/partners/community/messages`, `/partners/community/wins`, `/partners/community/help`.
- **Key folders:** `community/communications`, `community/messages`, `community/help`, shared `CommunityPageShell` layouts.
- **Dependencies:** Real-time stack via `shared/events`, notifications surfaced in `settings/ui/general/notifications`.

## Earnings (Growth)
- **Scope:** Wallet, leaderboard, challenges, tier progression, mission dashboards.
- **Primary routes:** `/partners/earnings`, `/partners/earnings/wallet`, hub widgets embedded on `/partners`.
- **Key folders:** `earnings/{domain,application}`, `earnings/ui/{dashboard,wallet,tier-progression}`.
- **Dependencies:** Supplies KPIs to `partnership-hub`, wallet UI exported to mobile shell.

## Pipeline Ops
- **Scope:** Submit-client intake, active deals, client notes, tooling before recruitment handoff.
- **Primary routes:** `/partners/pipeline-ops`, `/partners/pipeline-ops/submit-client`, `/partners/pipeline-ops/active-deals`.
- **Key folders:** `pipeline-ops/{domain,application,infrastructure}`, UI ready for ActiveDeals/Prospects screens.
- **Dependencies:** Shares validation schemas with `recruitment`, imports shared providers.

## Recruitment
- **Scope:** Partner prospects, team roster, performance, submit-partner flows.
- **Primary routes:** `/partners/recruitment`, `/partners/recruitment/prospects`, `/partners/recruitment/team`.
- **Key folders:** `recruitment/prospects`, `recruitment/team`, `recruitment/ui`.
- **Dependencies:** Pulls pipeline data from `pipeline-ops`, surfaces achievements from `earnings`.

## Workspace
- **Scope:** Tasks, calendar, files, notes, workspace checklist.
- **Primary routes:** `/partners/workspace`, `/partners/workspace/tasks`, `/partners/workspace/files`.
- **Key folders:** `workspace/checklist`, `workspace/ui/{tasks,calendar,files}`.
- **Dependencies:** Checklist exports to mobile quick actions; relies on shared storage adapters.

## Settings (incl. Notifications & Profile)
- **Scope:** Account, security, privacy, legal, notifications, profile.
- **Primary routes:** `/partners/settings/*` (general, security, privacy, legal, notifications, profile).
- **Key folders:** `settings/ui/{account,general,notifications,profile}`, `settings/domain`, `settings/application`.
- **Dependencies:** Only source of truth for notification hooks (`settings/application/notifications`).

## Partnership Hub
- **Scope:** `/partners` overview, quick actions, support/feedback modules.
- **Primary routes:** `/partners` root (hub overview).
- **Key folders:** `partnership-hub/ui/{overview,support}`, aggregator services under `partnership-hub/application`.
- **Dependencies:** Consumes signals from earnings, pipeline ops, workspace to build cards.

## Portfolio
- **Scope:** Proof assets, case studies, pitch materials consumed by Academy/Hub.
- **Primary routes:** `/partners/academy/portfolio` (exposed through Academy).
- **Key folders:** `portfolio/{components,data,ui}`.
- **Dependencies:** Drives Academy portfolio widgets, shareable by hub cards.

## Onboarding
- **Scope:** Partner onboarding journeys (currently stubs waiting for implementation).
- **Primary routes:** `/partners/onboarding` (placeholder).
- **Key folders:** `onboarding/{domain,application,infrastructure,ui}` (scaffold only).
- **Dependencies:** Will consume workspace checklist + settings profile data when built.

## Shared & Mobile Infrastructure
- **Shared:** Contracts, navigation adapter, events, data utilities that every feature consumes.
- **Mobile / Tablet / Desktop shells:** Located under `shared/mobile`, `shared/tablet`, `shared/desktop`. Mobile already contains the runtime shell used by `/partners/(mobile)`; tablet/desktop are stub folders so we can expand platform-specific shared components later.

Keep this file updated whenever a category grows new routes, gets a dedicated owner, or exports new shared contracts.
