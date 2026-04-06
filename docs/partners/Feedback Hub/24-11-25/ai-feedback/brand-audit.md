# AI Brand Feedback — 24 Nov 2025

Audit scope: every page+surface rendered under `src/app/partners/**` plus the domain components those routes import. Each finding ties back to the brand system (`docs/shared/brand-system/*`), so another AI can pick up the ticket and know exactly which spec to follow.

## Snapshot

| Area | Actionable items | Notes |
| --- | --- | --- |
| Academy (dashboard, spotlight, pitch kit, portfolio, mobile) | 6 | Hard-coded greys, inactive controls, non-standard buttons. |
| Pipeline Ops (dashboard, submit client, client notes, prospect tools) | 5 | Uses `bg-black/*` surfaces + non-token inputs. |
| Recruitment (dashboard, prospects, team, performance) | 5 | Same palette drift + missing CTA styles. |
| Earnings (dashboard, achievements, badges, challenges, leaderboard) | 6 | Literal `bg-black/*` + stacked cards missing the triple-grey tokens. |
| Community (dashboard, profile, help center) | 5 | Inner cards still `bg-black/30`; needs `siso` tokens + CTA updates. |
| Workspace (files hub, demo, storage, activity, calendar, tasks) | 7 | Buttons using white fills, stats not using brand greys, calendar still dark navy. |
| Tools / Tier / Misc (mobile shell, app plan, privacy, loading states) | 6 | App plan generator + tier utilities rely on ad-hoc colors/emoji icons + inconsistent skeletons. |

## Detailed Findings

### Academy
1. **Hex-coded inner surfaces** — Pitch Kit + Spotlight cards use `bg-[#1F1F1F]` / `bg-[#181818]` (`src/domains/partnerships/portal-architecture/academy/ui/pitch-kit/PitchKitScreen.tsx:49-109`, `training-spotlight/TrainingSpotlightScreen.tsx:82-176`). Swap to the stacked palette from `color-system.md` (“Surface stacking recipe”) so outer shell = `bg-siso-bg-secondary`, inner = `.siso-inner-card`, emphasis = `.siso-inner-card-strong`.
2. **Read-only filters** — Pitch Kit search (`PitchKitScreen.tsx:66-81`) renders a disabled text input; the brand spec calls for the settings dropdown(`component-presets.md → CustomDropdown`). Replace with the dropdown component and wire to dataset so the UI isn’t a dead control.
3. **Asset cards still have flat white outlines** — `PitchKitScreen.tsx:107-141` uses `border-white/0` + `bg-[#181818]`. Apply the double-callout: outer `SettingsGroupCallout`, inner `.siso-inner-card`, CTA uses the gradient button defined in `component-presets.md#pitchassetcard`.
4. **Training hub mobile hero uses bright white CTA** — `training-hub/components/TrainingHero.tsx:40-55` renders `bg-white/90 text-siso-bg-primary`, which clashes with the CTA pill spec. Swap to the gradient pill (`component-presets.md → Community CTA Button`) or the default `<Button variant="default">` styling.
5. **Portfolio filters still placeholders** — `PortfolioMobileScreen.tsx:51-90` shows stats cards but the dropdown/filter interaction is missing. Hook those to `CustomDropdown`/`FilterControls` so the filters behave like the rest of the brand scheme.
6. **Dataset labels hard-coded** — `portfolio/ui/pages/ClientDetail.tsx:148` uses `bg-white/5`. Ensure stacked cards (logo tiles, dataset badges) rely on the `.siso-inner-card` tokens for consistent shading.
7. ✅ **Tier carousel** — `src/app/partners/academy/my-progress/tiers-and-perks/TierCarousel.client.tsx:22-60` now uses the `.siso-inner-card` stack and pill tokens so the carousel matches the rest of My Progress (24 Nov 2025).
8. ✅ **Courses catalog filters/cards** — `CourseCatalogScreen.tsx` ships live `CustomDropdown` controls and `.siso-inner-card` course tiles instead of disabled placeholders.
9. ✅ **Saved docs search + cards** — `SavedDocsScreen.tsx` exposes a real search/filter UI, migrates cards to `.siso-inner-card`, and swaps CTAs for the gradient + ghost presets.
10. ✅ **XP breakdown feed** — `xp-breakdown/page.tsx` reuses the documented XPFeedItem + GradientProgressBar patterns, so the list now matches the My Progress stack.
11. ✅ **Certificates callouts** — `academy/certificates/page.tsx` applies the stacked palette + dotted panel spec to both sections.

### Pipeline Ops
1. ✅ **Dashboard inner cards** now sit on `.siso-inner-card`/`-strong` surfaces, so the pipeline CTA panels match the brand stack (`src/app/partners/pipeline-ops/page.tsx`).
2. ✅ **StageMix tokens** live in `color-system.css`/`color-system.md`, and the dashboard consumes them instead of literal Tailwind colors.
3. ✅ **Client Notes filters** use branded inputs, focus states, and `.siso-inner-card` backgrounds (`client-notes/ClientNotesBoard.client.tsx`).
4. ✅ **Submit Client CTA** is the gradient pill + ghost combo defined in the presets (`SubmitClientExperience.client.tsx`).
5. ✅ **Prospects/Active Deals shells** reuse the same Waves/FallingPattern background + stacked palette as the core dashboard.
6. ✅ **Prospect detail + cards** now mirror GhostStatCard + gradient CTA styling (`ProspectsWorkspace.tsx`, `ProspectCard.tsx`).
7. ✅ **Stage tokens in Prospects workspace** replaced all hard-coded `bg-amber/*` classes, and lifecycle/resources sit on `.siso-inner-card`.
8. ✅ **Prospect cards** swapped glassmorphism for the documented card + CTA preset.
9. ✅ **“Needs attention” alert** is a proper `SettingsGroupCallout` that uses StageMix tokens and section-label typography (`active-deals/ActiveDealsWorkspace.tsx`).

### Recruitment
1. ✅ **Dashboard widgets** — `src/app/partners/recruitment/DashboardContent.tsx:32-220` now keeps each tile inside `stackedPanelClass` shells and the pipeline progress bar pulls its fill colors from the StageMix tokens instead of `bg-white/5` layers.
2. ✅ **Stage chips** — The stage list in `DashboardContent.tsx:196-214` renders `nestedCardClass` rows with `var(--siso-stage-*)` dots, so the pipeline legend mirrors the GhostStatCard preset.
3. ✅ **Prospects/TM screens** — `recruitment/prospects/components/RecruitmentProspectCard.tsx`, `RecruitmentProspectCardGrid.tsx`, `RecruitmentProspectProfile.tsx`, and `team/components/TeamMemberProfile.tsx` all migrated to `stackedPanelClass`/`nestedCardClass` surfaces with the shared gradient + ghost CTA helpers (24 Nov 2025), so the roster grid, profile flyout, and team member view match the documented stacked palette.
4. ✅ **Team performance view** — `src/app/partners/recruitment/performance/PerformanceContent.tsx:128-203` wraps insights, channel mix, and metric tiles with `stackedPanelClass` and reuses StageMix/gradient bars for every stat so nothing floats on `bg-white/5`.
5. ✅ **Quick help cards** — `src/app/partners/recruitment/team/TeamContent.tsx:144-207` now adds a `.siso-inner-card` wrapper to the leaderboard, roster list, and quick-help stack so the cards inherit the three-layer palette and CTA chips stay on brand.
6. ✅ **Lifecycle chips** — `ProspectsContent.tsx` now reads stage colors from the new tokens, so the snapshot + pills stay on-brand.
7. **Segment filter buttons** — same file still renders CTA pills correctly; no change required if CustomDropdown stays the filter entry point.
8. ✅ **Resource links** — the quick resources block uses `.siso-inner-card` cards instead of floating divs.
9. ✅ **Recruitment performance cards** — `PerformanceContent.tsx:128-260` refreshes the chart legend, channel mix, and CTA badges with gradient fills + StageMix tokens, so the cards follow the documented typography and surface stack.
10. ✅ **Recruitment loading state** — `recruitment/loading.tsx` now shows GhostStatCard-style skeletons on `bg-siso-bg-primary`.

### Earnings
1. ✅ **Wallet/Tier/Achievements widgets** — `src/domains/partnerships/05-earnings/ui/dashboard/widgets.tsx:12-210` already wrap every nested panel with `stackedPanelClass`/`nestedCardClass`, so the dashboard cards now follow the charcoal → medium → light stack.
2. ✅ **Challenges page** — `earnings/ui/challenges/EarningsChallengesScreen.tsx:60-230` swaps the countdown chip + challenge cards to the documented presets (stacked panel + `siso-inner-card-strong` chips), eliminating the old `bg-black/40` fills.
3. ✅ **Leaderboard** — `earnings/ui/leaderboard/EarningsLeaderboardScreen.tsx:60-190` now relies on the shared card layers (outer callout uses `stackedPanelClass`, rows + highlights reuse `nestedCardClass`) and the badge filters use the CTA pill spec.
4. ✅ **Achievements screen double stacking** — `earnings/ui/achievements/EarningsAchievementsScreen.tsx:60-205` keeps a single callout layer with inner `.siso-inner-card` rows, so the trophy case/feed/no longer double-wrap cards.
5. ✅ **Badges page** — `earnings/ui/badges/EarningsBadgesScreen.tsx:55-210` migrates every badge row, CTA, and summary block to `stackedPanelClass`/`nestedCardClass` and reuses the gradient/ghost CTA buttons.
6. ✅ **Buttons** — Missions, challenge detail, and tier carousel controls now all call the shared CTA helpers (`earnings/ui/missions/EarningsMissionsScreen.tsx`, `earnings/ui/challenges/ChallengeDetailScreen.tsx`, `earnings/ui/tier-progression/EarningsTierProgressionBoard.client.tsx` on 24 Nov 2025), so there are no stray `bg-white text-black` or ad-hoc pills in the earnings module.

### Community
1. ✅ **Inner cards** — `src/app/partners/community/page.tsx:30-220` now keeps every room/dedicated widget in `SettingsGroupCallout` + `stackedPanelClass` wrappers; the links themselves use `nestedCardClass`, so the triple-grey stack replaces the old `bg-white/[0.04]` shells.
2. ✅ **Stat tiles** — the stat grids in `CommunityWidgetCard`, `MessagesWidgetCard`, and `PartnersWidgetCard` all reuse `StatTile` (which is `nestedCardClass` + section-label typography), removing the `bg-white/20`/`bg-black/30` mix.
3. ✅ **Partners widget** — `community/page.tsx:210-330` now renders stage meters + availability pills with the same gradient bars + `.siso-inner-card` chips (matching the Tier/XP preset) instead of plain white fills.
4. ✅ **Help center drill-down** — `src/domains/partnerships/06-community/ui/help/HelpCenterScreen.tsx:20-210` now wraps collection + article views with the same `SettingsGroupCallout` → `stackedPanelClass` flow, so drill-down pages inherit the shared fonts + surfaces.
5. **Profile view** — `community/profile/[profileId]/page.tsx:76-170` uses `bg-black/20` and `bg-white/5`. Swap to tokens + ensure CTA badges follow the `TierPill` spec.
6. ✅ **Help article highlight** — `HelpCenterScreen.tsx:108-150` swaps the hero highlight for the article detail with `nestedCardClass`, eliminating the glassmorphism block.
7. ✅ **Breadcrumb chips** — the breadcrumb bar uses `stackedPanelClass` and pill chips (`siso-inner-card-strong`), so navigation now follows the section-label typography.
8. ✅ **Profile hero CTA pair** — `community/profile/[profileId]/page.tsx` now uses the gradient pill + ghost CTA combo and the surrounding cards sit on the stacked palette.
9. ✅ **Profile stats/focus cards** — Snapshot, Focus Areas, Wins, and Availability all reuse `stackedPanelClass`/`nestedCardClass` instead of glass blocks.
10. ✅ **All Partners search & cards** — the directory adopts the documented search input, filter pills, `.siso-inner-card` roster tiles, and gradient/ghost CTAs.
11. ✅ **Profile loading skeleton** — `src/app/partners/community/profile/[profileId]/loading.tsx` ships a GhostStatCard-style fallback so the dynamic route doesn’t flash white during suspense.
12. ✅ **Channel drawers** — Highlights, Guidelines, Quick Links, and Pinned components use `stackedPanelClass`/`nestedCardClass` in the general/wins/announcements drawers.
13. ✅ **“Suggest a channel” form** — the form reuses the branded input controls and gradient CTA button.

### Workspace
1. ✅ **File segments + stats** — `workspace/files/FilesContent.tsx:20-120` wraps each card in `stackedPanelClass` and the primary CTA now uses the shared gradient pill (`primaryGradientButtonClass`), so there are no `bg-white text-black` buttons left.
2. ✅ **Storage health cards** — the storage grid (`FilesContent.tsx:70-100`) already uses `nestedCardClass` entries, so the stats follow the GhostStatCard styling.
3. ✅ **Recent activity** — the activity list (`FilesContent.tsx:105-135`) reuses `nestedCardClass`, removing the old `bg-white/5` surfaces.
4. ✅ **Workspace quick tools** — `workspace/page.tsx:18-45` now renders capsule buttons inside `stackedPanelClass`, reusing the gradient + ghost CTA presets instead of plain text links.
5. ✅ **Tasks workspace BG + buttons** — `TasksWorkspaceScreen.tsx:1-200` now runs on `bg-siso-bg-primary`, every filter/CTA uses `primaryGradientButtonClass` or `secondaryActionButtonClass`, and all task cards/container surfaces reuse `stackedPanelClass`/`nestedCardClass`.
6. ✅ **Automation rules switch list** — the automation/due-today/backlog sections (`TasksWorkspaceScreen.tsx:200-280`) share the same stack + inner cards, so there are no `bg-black/30` rows left.
7. ✅ **Delegation/Timeline cards** — Delegated tasks + activity timeline (`TasksWorkspaceScreen.tsx:280-380`) now sit on `stackedPanelClass` shells with the documented table/timeline tokens.
8. ✅ **Calendar board background** — `workspace/calendar/ui/CalendarWorkspaceBoard.client.tsx:1-420` now runs on `bg-siso-bg-primary`, the filters/insights/priority queue/office hours widgets use `stackedPanelClass` + `nestedCardClass`, and all CTAs use `primaryGradientButtonClass`, so the board mirrors the core palette.
9. ✅ **Calendar fallback + hydrator** — `workspace/calendar/CalendarWorkspaceHydrator.client.tsx:1-40` now renders a stacked-panel skeleton, so hydration matches the live board.
10. **Workspace demo client** — `domains/partnerships/07-workspace/ui/WorkspaceDemoClient.tsx:1-15` shows plain text on a bare background. Wrap in `SettingsGroupCallout` or at least apply the typography tokens (hero caps, section labels) so even placeholder content stays on brand.
11. **Workspace demo fallback** — `workspace/WorkspaceDemoHydrator.client.tsx:31-40` renders `bg-white/5 p-6 text-white/70`. Swap for `.siso-inner-card` so the fallback matches the spec.
12. ✅ **Webinars screen** — `portal-architecture/workspace/calendar/webinars/ui/WebinarsScreen.tsx:25-190` now inherits `stackedPanelClass`/`nestedCardClass` for every panel, and all CTAs use `primaryGradientButtonClass`/`secondaryActionButtonClass`, so the standalone page matches the calendar + tasks palette (24 Nov 2025). The office hours hero remains tracked under item 17.
13. **Workspace notes placeholder** — `src/app/partners/workspace/notes/my-notes/page.tsx` shows plain white text on a bare background. Even placeholders should sit inside `SettingsGroupCallout` with hero typography so the surface doesn’t feel unfinished.
14. **Workspace hydration fallbacks** — `WorkspaceDemoHydrator.client.tsx:31-40` and `CalendarWorkspaceHydrator.client.tsx:20-40` still render `bg-white/5 p-6 text-white/70` blocks. Wrap these fallbacks in `.siso-inner-card` callouts so there’s no palette flicker while dynamic screens load.
15. **Pipeline Ops skeletons** — `src/app/partners/pipeline-ops/loading.tsx:5-25` shows plain white bars on `bg-white/5`. Convert the skeletons to GhostStatCard components with the charcoal stack so loading states don’t break the palette.
16. **Calendar view controls ignore presets** — `workspace/calendar/ui/CalendarWorkspaceBoard.client.tsx:63-130` builds the week/day/month card with generic `<Card>` + `TabsList className="bg-white/10"` controls and inline RGBA gradients. Rebuild the header using `SettingsGroupCallout` + the Segmented Control preset (same chip styles as `FilterControls` in Academy) and move the Month/Week grids onto `.siso-inner-card` so the entire control bar reuses documented surfaces instead of `bg-white/5`.
17. **Office hours booking form uses raw inputs** — `portal-architecture/workspace/calendar/office-hours/ui/OfficeHoursScreen.tsx:149-262` leaves slot buttons, tabs, and the notes `<Textarea>` on `bg-black/20` with white buttons. Swap the slot + topic selectors for the CTA pill / Segmented Control presets, move the textarea + selected-slot card onto `.siso-inner-card`, and replace the `bg-white text-black` buttons with the gradient CTA + ghost CTA defined in `component-presets.md#community-cta-button` so the booking flow matches the rest of the workspace tools.

### Tools / Tier / Misc
_Workspace-*specific* items (nos. 4, 8, 9) remain deferred per 24 Nov request to pause workspace/app-plan work._
1. **App Plan Generator** — `src/app/partners/tools/app-plan-generator/page.tsx:38-98` uses emoji icons + `bg-black/30` surfaces and a `bg-white text-black` button. Swap emoji for lucide icons, adopt `.siso-inner-card`, and use CTA variant defined in presets.
2. **Tier Progress standalone route** — `src/app/partners/tier-progress` proxies to `EarningsTierProgressionBoard`, but check that the exported page uses the same `HighlightCard` + `.siso-inner-card` layering (if not, align with `component-presets.md#tierprogresscard`).
3. ✅ **Mobile shell** — `src/domains/partnerships/mobile/ui/LazyMobileShell.tsx:1-60` now renders the gradient Waves background + stacked-panel skeleton with the shared CTA typography, so the loading state matches the desktop brand spec (24 Nov 2025).
4. **Workspace demo fallback** — `WorkspaceDemoHydrator.client.tsx:31-46` leaves a `div` with `bg-white/5`; ensure fallback + loading states share the same `.siso-inner-card` spec so there’s no visual flicker when hydration occurs.
5. **Privacy-policy renderer** — `privacy-policy/page.tsx` delegates to `renderSettingsRouteBySlug`. Confirm the templates under `portal-architecture/settings/route-renderers` use the updated typography tokens; if they still reference older `text-gray-300` classes, mirror the updates from the brand docs.
6. **LazyMobileShell loading state** — `domains/partnerships/mobile/ui/LazyMobileShell.tsx:10-22` renders a `bg-black` screen with white spinner text. Replace with the gradient/falling-pattern background and typography tokens so even the skeleton matches desktop branding.
7. ✅ **Community page shell sidebar** — `domains/partnerships/06-community/ui/CommunityPageShell.tsx:40-90` swaps the desktop sidebar to `bg-siso-bg-secondary/80` so the navigation rail inherits the palette tokens instead of `bg-[#050505]` (24 Nov 2025).
8. **Client Notes experience shell** — `pipeline-ops/client-notes/ClientNotesBoard.client.tsx:150-200` sets `main` background to `bg-[#03040A]`. Replace with `bg-siso-bg-primary` and ensure every card uses `.siso-inner-card`.
9. **Mobile campus sidebar/drawer** — `domains/partnerships/_shared/ui/mobile/campus-sidebar/*.tsx` rely on `bg-[#050505]`. Swap to the brand tokens so the mobile shell mirrors desktop styling.
10. **Help center fallback** — `community/ui/help/HelpCenterScreen.tsx` wraps empty state copy in `bg-white/5` without outer shell. Align empty states with `component-presets.md#ghoststatcard`.
11. ✅ **Submit Partner fallback** — `partners/recruitment/submit-partner/page.tsx:42-90` now renders a stacked-panel skeleton with nested cards for the form preview, so the intake suspense state stays on-brand (24 Nov 2025).
12. ✅ **Active deals “Needs attention” card** — `pipeline-ops/active-deals/ActiveDealsWorkspace.tsx:45-120` now composes the warning list from `stackedPanelClass`/`nestedCardClass`, so the alert cards reuse the GhostStat palette instead of bespoke `bg-black/30` blocks (24 Nov 2025).

## Next Steps
1. **Token sweep** — search for `bg-black` / `bg-[#` across `src/app/partners` and `src/domains/partnerships` to replace with `var(--siso-*)` tokens. Track progress via checklist referencing this doc.
2. **CTA unification** — replace every `bg-white text-black` / `bg-siso-orange text-black` button with either the gradient CTA or the ghost CTA defined in `component-presets.md`.
3. **Control consistency** — ensure dropdowns/search inputs in Academy + Pitch Kit use `CustomDropdown` or documented input components so we never have read-only placeholders pretending to be controls.
4. **Documentation feedback loop** — after each fix, update the corresponding row in `component-catalog.md` with the ticket ID/commit so future audits can see that the issue is resolved.
