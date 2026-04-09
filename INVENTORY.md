# ISSO Dashboard — Full Inventory

> Documented: 2026-04-09
> Context: extraction of all OFM/agency dashboard components from isso-dashboard
> Cross-reference: compared against /tmp/ad-extract (his original NVA app) to separate his work from our rebuild

---

## Architecture

Two-layer Next.js 15 app sharing one codebase:

| Layer | Route Group | Domain | Purpose |
|---|---|---|---|
| **Marketing** | `src/app/(marketing)/` | `ofmsaas.com` | Landing pages, pricing, blog |
| **Dashboard** | `src/app/isso/` | `app.ofmsaas.com` | OFM agency product (Clerk-protected) |
| **Auth** | `src/app/sign-in/`, `src/app/sign-up/` | Both | Clerk authentication |

---

## Dashboard Pages (`/isso/*`)

| Route | Page |
|---|---|
| `/isso` | Hub Dashboard |
| `/isso/agency` | Agency view |
| `/isso/agents` | AI agent transparency |
| `/isso/analytics` | Platform analytics |
| `/isso/approvals` | Content approval queue |
| `/isso/chatter` | Internal chat |
| `/isso/community` | Hub content feed |
| `/isso/content` | Content upload/library |
| `/isso/content-gen` | AI content generation |
| `/isso/ideas` | AI brief generator |
| `/isso/intelligence` | Viral content discovery |
| `/isso/model` | Single model view |
| `/isso/models` | Models pipeline |
| `/isso/models/[id]` | Model detail |
| `/isso/recon` | Competitor monitoring |
| `/isso/schedule` | Content calendar |
| `/isso/settings` | User settings |
| `/isso/team` | Team management |
| `/isso/tools` | Tools |
| `/isso/instagram` | Instagram platform view |
| `/isso/pinterest` | Pinterest platform view |
| `/isso/tiktok` | TikTok platform view |
| `/isso/x` | X/Twitter platform view |
| `/isso/youtube` | YouTube platform view |

---

## 5-Product Feature System

| Product | Hotkey | Route | Purpose |
|---|---|---|---|
| **Hub** | `Cmd+1` | `/isso` | Day-to-day ops: approvals, schedule, analytics, community |
| **Intelligence** | `Cmd+2` | `/isso/intelligence` | Viral content discovery — browse, save, organize to boards |
| **Recon** | `Cmd+3` | `/isso/recon` | Competitor monitoring — scraping log, creator table, community feed |
| **Agents** | `Cmd+4` | `/isso/agents` | AI agent transparency — activity feed, reports, custom requests |
| **Briefs** | `Cmd+5` | `/isso/ideas` | Content factory — AI briefs, video enhancement, model pipeline |

Persistent sidebar items: **Team** (`/isso/team`), **Settings** (`/isso/settings`)

---

## Components by Feature

### `src/features/agency/` (1 file)
- `sidebar-config.tsx`

### `src/features/agents/` (24 components)
- `AgentsFeaturePage.tsx`
- `activity/` — `ActivityCard.tsx`, `ActivityView.tsx`
- `costs/` — `CostsView.tsx`
- `inbox/` — `InboxView.tsx`
- `issues/` — `IssueCreateModal.tsx`, `IssueRow.tsx`, `IssuesView.tsx`
- `log/` — `ActivityLogList.tsx`, `ActivityLogView.tsx`
- `orgchart/` — `OrgChartView.tsx`
- `overview/` — `OverviewView.tsx`
- `reports/` — `ReportCard.tsx`, `ReportInsights.tsx`, `ReportsContent.tsx`, `ReportsSkeleton.tsx`, `ReportsView.tsx`
- `requests/` — `FilterBar.tsx`, `RequestCard.tsx`, `RequestForm.tsx`, `RequestsView.tsx`
- `routines/` — `RoutineCreateModal.tsx`, `RoutinesView.tsx`

### `src/features/analytics/` (13 components)
- `AnalyticsFeaturePage.tsx`
- `charts/` — `EngagementBars.tsx`, `FollowerChart.tsx`
- `header/` — `ModelAccountHeader.tsx`
- `insights/` — `AgeRangeCard.tsx`, `AudienceInsights.tsx`, `GenderHoursCard.tsx`, `LocationsCard.tsx`
- `placeholders/` — `RevenuePlaceholder.tsx`
- `stats/` — `AnimatedNumber.tsx`, `SectionCard.tsx`, `StatCard.tsx`
- `tables/` — `TopPostsTable.tsx`

### `src/features/approvals/` (11 components)
- `ApprovalsFeaturePage.tsx`, `ApprovalsTabContent.tsx`
- `cards/` — `ApprovalCard.tsx`, `MiniStat.tsx`
- `modals/` — `DetailModal.tsx`, `PlatformPreviewPanel.tsx`, `RejectionReasonPicker.tsx`
- `states/` — `EmptyState.tsx`
- `constants.tsx`

### `src/features/chatter/` — chat feature (dir exists, full listing not enumerated)

### `src/features/community/` (14 components)
- `CommunityFeaturePage.tsx`
- `approve/` — `ApproveTabContent.tsx`
- `dashboard/` — `HubDashboardTab.tsx`, `HubQuickActions.tsx`, `HubSwipeActivityFeed.tsx`, `LastSessionCard.tsx`, `VaultHealthBar.tsx`
- `feed/` — `PostCard.tsx`
- `saved/` — `NicheGroup.tsx`, `SavedTabContent.tsx`
- `shared/` — `FilterBar.tsx`
- `sidebar/` — `LeaderboardSidebar.tsx`
- `vault/` — `VaultFilterBar.tsx`, `VaultTabContent.tsx`

### `src/features/content-gen/` (42 components)
- `ContentGenFeaturePage.tsx`, `CompletionBar.tsx`, `EmptyState.tsx`, `Field.tsx`, `GenerateFeaturePage.tsx`, `ModelCard.tsx`, `ModelGrid.tsx`, `ModelPanel.tsx`, `ModelsFeaturePage.tsx`, `NicheChip.tsx`, `PanelChecklist.tsx`, `PanelForm.tsx`, `PanelPreview.tsx`, `QueueFeaturePage.tsx`, `SkeletonCard.tsx`
- `dashboard/` — `ActivityFeed.tsx`, `DashboardFeaturePage.tsx`, `ModelSummaryCard.tsx`
- `gallery/` — `GalleryCard.tsx`, `GalleryFeaturePage.tsx`
- `generate/` — `BriefBuilder.tsx`, `FaceRefUpload.tsx`, `GalleryCard.tsx`, `GalleryTabContent.tsx`, `GeneratorPills.tsx`, `JobCard.tsx`, `LivePipelinePage.tsx`, `QueueTabContent.tsx`, `RecentJobsPanel.tsx`, `StyleChips.tsx`, `TalentPicker.tsx`, `types.tsx`
- `queue/` — `ActiveJobCard.tsx`, `atoms.tsx`, `EtaCountdown.tsx`, `HistorySection.tsx`, `JobList.tsx`, `LiveJobCard.tsx`, `StatsStrip.tsx`
- `scenes/` — `SceneCard.tsx`, `ScenePipelineStrip.tsx`, `ScenesFeaturePage.tsx`

### `src/features/content/` (9 components)
- `ContentFeaturePage.tsx`
- `delivered/` — `DeliveredView.tsx`
- `library/` — `ClipCard.tsx`, `ClipCardActions.tsx`, `EnhancementBadge.tsx`, `LibraryView.tsx`
- `upload/` — `UploadDropzone.tsx`

### `src/features/dashboard/` (11 components)
- `DashboardFeaturePage.tsx`
- `overview/` — `ActivityFeed.tsx`, `ExpiringSubscriberQueue.tsx`, `KpiCards.tsx`, `ModelPnLCard.tsx`, `ModelsOverview.tsx`, `QuickActions.tsx`, `UpcomingPosts.tsx`
- `placeholders/` — `PlaceholderContent.tsx`
- `constants.tsx`

### `src/features/hub-swipe/` (10 components)
- `AiAnalysisPanel.tsx`, `CriteriaChecklist.tsx`, `QuickAnnotate.tsx`, `SendToModelModal.tsx`, `SwipeAuditLog.tsx`, `SwipeSessionSummary.tsx`, `SwipeStack.tsx`, `SwipeTabContent.tsx`, `WhyTagPanel.tsx`

### `src/features/ideas/` (1 component)
- `IdeasFeaturePage.tsx`

### `src/features/intelligence/` (88 components)
- `IntelligenceFeaturePage.tsx`, `IntelligenceControls.tsx`, `filterConfig.tsx`
- `analysis/` — `ActivityFeed.tsx`, `AllActivityView.tsx`, `AllPostsView.tsx`, `AllQueueView.tsx`, `AnalysedPostCard.tsx`, `AnalysedPostGrid.tsx`, `AnalysedPostRowItem.tsx`, `AnalysedPostsTimeline.tsx`, `AnalysisBreadcrumb.tsx`, `AnalysisCard.tsx`, `AnalysisDetailPanel.tsx`, `AnalysisKanbanView.tsx`, `AnalysisPageView.tsx`, `AnalysisPipelineStrip.tsx`, `AnalysisQueue.tsx`, `AnalysisView.tsx`, `EmotionFrequency.tsx`, `HookLineGallery.tsx`, `HookScoreDistribution.tsx`, `LivePipelineCard.tsx`, `RuleCards.tsx`, `SystemPromptPanel.tsx`
- `controls/` — `SortPill.tsx`, `VisibilityPill.tsx`
- `dashboard/` — `ActionQueue.tsx`, `DashboardView.tsx`, `IntelligenceActivityFeed.tsx`, `IntelligenceBrief.tsx`, `KPIDeltaTile.tsx`, `OutlierRow.tsx`, `OutlierSpotlight.tsx`, `PipelineStatusStrip.tsx`, `PulseReportCard.tsx`
- `drawer/` — `AIAnalysisTab.tsx`, `DetailsTab.tsx`, `DrawerMediaPanel.tsx`, `DrawerRightPanel.tsx`, `PostDetailDrawer.tsx`, `TranscriptTab.tsx`
- `experts/` — `ExpertsView.tsx`
- `feed/` — `BoardPickerDropdown.tsx`, `CommunityFeedTab.tsx`, `FeedFilterDropdown.tsx`, `FeedView.tsx`, `PostCard.tsx`, `PostListItem.tsx`, `SkeletonCard.tsx`
- `insights/` — `AnalysisInsights.tsx`, `BarRow.tsx`, `InsightCards.tsx`, `InsightsChatSection.tsx`, `InsightsView.tsx`, `LearningSignal.tsx`, `PreferenceChart.tsx`, `RatedCard.tsx`, `RaterActivity.tsx`, `RatingSummaryBar.tsx`, `TopRatedPosts.tsx`, `TopRatedSection.tsx`, `WinningHooks.tsx`, `WinningHooksSection.tsx`
- `qualify/` — `OutlierPanel.tsx`, `QualifyKanbanView.tsx`, `QualifyTableBody.tsx`, `QualifyTableFilters.tsx`, `QualifyTableHeader.tsx`, `QualifyTableRow.tsx`, `QualifyTableSkeleton.tsx`, `QualifyTableView.tsx`, `QualifyToolbar.tsx`
- `shared/` — `ScoreRing.tsx`, `VideoLightbox.tsx`
- `trends/` — `AIChatPanel.tsx`, `FormatChart.tsx`, `HashtagCorrelation.tsx`, `HooksTable.tsx`, `NicheLeaderboard.tsx`, `OutlierCard.tsx`, `OutlierFeed.tsx`, `PatternCard.tsx`, `PatternInsights.tsx`, `StatsBar.tsx`, `TrendsLoadingSkeleton.tsx`, `TrendsView.tsx`

### `src/features/models/` (19 components)
- `AddModelDrawer.tsx`, `ModelsFeaturePage.tsx`
- `detail/` — `ModelDetailPage.tsx`, `tabs/` — `AnalyticsTab.tsx`, `ContentTab.tsx`, `OverviewTab.tsx`, `PipelineTab.tsx`, `ReferencesTab.tsx`, `SettingsTab.tsx`
- `onboarding/` — `OnboardingView.tsx`
- `performance/` — `PerformanceView.tsx`
- `pipeline/` — `PipelineTracker.tsx`, `ReelGrid.tsx`
- `roster/` — `CardBandA.tsx`, `CardBandB.tsx`, `CardBandC.tsx`, `CardBandD.tsx`, `ModelRosterCard.tsx`, `PortfolioStatsStrip.tsx`, `RosterView.tsx`

### `src/features/recon/` (83 components)
- `ReconFeaturePage.tsx`, `ReconModals.tsx`
- `detail/` — `CreatorBriefContent.tsx`, `CreatorBriefScores.tsx`, `CreatorBriefSection.tsx`, `CreatorDetailSections.tsx`, `CreatorDetailView.tsx`, `widgets/` — `ActivityFeed.tsx`, `CreatorStatusGrid.tsx`, `EngagementBenchmarkCard.tsx`, `ViralAlertCard.tsx`, `WeeklyDigestCard.tsx`
- `discovery/` — `ApprovalRatioWidget.tsx`, `DiscoveryFunnel.tsx`, `DiscoveryHeader.tsx`, `DiscoveryPipeline.tsx`, `DiscoveryStats.tsx`, `DiscoveryTab.tsx`, `InfoTooltip.tsx`, `PipelineColumn.tsx`, `PipelineStats.tsx`, `ScrapingColumn.tsx`, `charts/` — `EngagementChart.tsx`, `FollowerScaleChart.tsx`, `NicheBreakdownChart.tsx`, `NicheDonut.tsx`, `OutlierCard.tsx`, `OutlierRatioChart.tsx`, `SourceChart.tsx`, `detail/` — `DetailActions.tsx`, `DetailHeader.tsx`, `DetailPanel.tsx`, `DetailStats.tsx`, `VerdictSection.tsx`, `dnd.tsx`, `rows/` — `ApprovedRow.tsx`, `CandidateRow.tsx`, `RejectedPanel.tsx`, `ScrapedRow.tsx`
- `feed/` — `ReconFeedTab.tsx`
- `icons/` — `IgIcon.tsx`
- `modals/` — `AddActionModals.tsx`, `AddCandidateModal.tsx`, `BulkImportModal.tsx`, `ModalShell.tsx`, `TrackNicheModal.tsx`, `TrackProfileModal.tsx`
- `pipeline/` — `CreatorPipelineRow.tsx`, `LogDashboard.tsx`, `PipelineFunnel.tsx`, `PostsScrapedBarChart.tsx`, `PostsScrapedChart.tsx`, `VolumeChart.tsx`, `funnel/` — `StagePill.tsx`, `funnelData.tsx`
- `shared/` — `EmptyState.tsx`, `EnrichDot.tsx`, `MiniStat.tsx`, `ProfileHealthBar.tsx`, `RatioBadge.tsx`, `ScoreBadge.tsx`, `SkeletonRow.tsx`, `Sparkline.tsx`, `StatCard.tsx`, `TabSkeleton.tsx`
- `table/` — `BulkActionBar.tsx`, `CreatorScoreWeightsPanel.tsx`, `CreatorsTable.tsx`, `ScrapeProgressPanel.tsx`, `TableHeader.tsx`, `TableToolbar.tsx`, `cards/` — `CreatorCard.tsx`, `CreatorCardRenderer.tsx`, `CreatorSpotlightCard.tsx`, `filters/` — `ColumnFilterHeader.tsx`, `ColumnVisibilityPill.tsx`, `CreatorsFilterBar.tsx`, `FilterPill.tsx`, `RangeFilter.tsx`, `RangeFilterHeader.tsx`, `ScoreColumnHeader.tsx`, `rows/` — `CreatorRow.tsx`, `CreatorRowActionsCell.tsx`, `CreatorRowActionsMenu.tsx`, `CreatorRowAvatarCell.tsx`, `CreatorRowCells.tsx`, `CreatorRowHealthCell.tsx`, `CreatorRowMetaCells.tsx`, `CreatorRowRenderer.tsx`, `CreatorTableRow.tsx`, `shared/` — `SelectCheckbox.tsx`, `TableCard.tsx`

### `src/features/schedule/` (6 components)
- `ScheduleFeaturePage.tsx`
- `analytics/` — `AnalyticsView.tsx`
- `calendar/` — `CalendarView.tsx`
- `charts/` — `EngagementChart.tsx`
- `constants.tsx`

### `src/features/settings/` (12 components)
- `SettingsFeaturePage.tsx`
- `controls/` — `AnimatedToggle.tsx`, `FieldRow.tsx`, `SettingsCard.tsx`
- `tabs/` — `BillingTab.tsx`, `ConnectedAccountsTab.tsx`, `ContentDefaultsTab.tsx`, `IntegrationsTab.tsx`, `ProfileTab.tsx`
- `constants.tsx`

### `src/features/team/` (11 components)
- `TeamFeaturePage.tsx`
- `activity/` — `ActivityLog.tsx`
- `badges/` — `RoleBadge.tsx`, `StatusDot.tsx`
- `members/` — `MemberCard.tsx`, `PermissionsMatrix.tsx`
- `modals/` — `InviteModal.tsx`
- `pills/` — `AccountPill.tsx`

### `src/features/tools/` (2 components)
- `AnalyserTab.tsx`, `ToolsPage.tsx`

### `src/features/instagram/` (8 components)
- `InstagramFeaturePage.tsx`, `PlatformComingSoon.tsx`
- `tabs/` — `AccountsTab.tsx`, `AnalyticsTab.tsx`, `ApprovalsTab.tsx`, `OverviewTab.tsx`, `QueueTab.tsx`, `ScheduleTab.tsx`

### `src/features/tiktok/`, `src/features/pinterest/`, `src/features/x/`, `src/features/youtube/` — platform views (dirs exist)

---

## Shared / Layout

### `src/shared/layout/` (11 files)
- `ContentPageShell.tsx` — universal page wrapper
- `IssoSidebar.tsx`, `IssoSidebarShell.tsx` — 5-product icon column + persistent nav
- `PageHeader.tsx`, `ProductIcon.tsx`, `Shell.tsx`
- `isso-sidebar/` — `IssoDetailSidebar.tsx`, `IssoIconNav.tsx`, `IssoSidebarShell.tsx`, `navigation-store.tsx`, `sidebar-config.tsx`
- `two-level-sidebar/` — `sidebar-component.tsx`

### `src/shared/ui/` (~41 files)
Shared primitives: alert, avatar, badge, button, calendar, card, dropdown, input, notifications-menu, progress, select, skeleton, tabs, textarea, tooltip, wave-background, etc.

---

## Root UI Kit (`src/components/ui/` — 84 components)

Charts/visualizations: `bar-chart.tsx`, `bar-chart-recharts.tsx`, `funnel-chart.tsx`, `heat-map-xl.tsx`, `pie-chart.tsx`
Feeds: `activity-feed.tsx`, `modern-timeline.tsx`, `timeline.tsx`
Search: `animated-glowing-search-bar.tsx`, `search-bar.tsx`, `suggestive-search.tsx`
Status: `status-strip.tsx`, `view-toggle.tsx`, `notifications-menu.tsx`
Dashboard: `dashboard-overview.tsx`, `electric-card.tsx`
AI: `ai-assistant-interface.tsx`, `agent-plan.tsx`
Misc: `scraping-report.tsx`, `download-pdf-button.tsx`
Icons: 13 files under `icons/` (ClaudeAI, Nextjs, OpenAI, Supabase, Stripe, etc.)

---

## Marketing Components (`src/features/marketing/` — 138 files)

31 sub-directories: `HeroSection/`, `ProductSection/`, `FeaturesSection/`, `Footer/`, `Navbar/`, `Blog/`, `BlogPost/`, `BookDemo/`, `IndustryPage/`, `ProductPage/`, `AffiliatesPage/`, `AgencyDirectory/`, `WebinarsPage/`, `landing/` (Pricing, FAQ, CTA), `MobileApp/`, `LensPage/`, `ChromeExtensionSection/`, `Testimonials/`, `CollaborationSection/`, `SecretWeaponSection/`, `SharingSection/`, `UniversityPage/`, `WorkWithBrands/`, `layout/navbar/`

---

## Legacy Domains (NOT ISSO — generic SISO app)

### `src/domains/client-base/` (~74 files)
Landing page factory system — 33 industry-specific landing pages (Accounting, Agency, AutoRepair, Barbershop, Beauty, Cleaning, Construction, Consulting, DigitalMarketing, Ecommerce, Education, Energy, EventPlanning, FinancialServices, Fitness, FoodServices, Healthcare, HomeServices, LawFirm, Logistics, Manufacturing, Nonprofit, PetServices, Photography, ProfessionalServices, RealEstate, Restaurant, Retail, Technology, Travel, VideoProduction).
Sections: Hero, Features, Pricing, Testimonials, FAQ, Portfolio, Process, WhyChoose, CaseStudies, CTA.
**Not OFM-specific — generic client base template system.**

### `src/domains/partnerships/` (~386 files)
Full partner ecosystem: Academy (courses, certifications, training hub), Community (channels, chat, announcements), Earnings (wallet, tier progression, achievements, leaderboard, challenges, missions, badges), Funnel (partner onboarding, landing pages), Notifications, Partnership Hub, Pipeline Ops (submit client, prospects, active deals, client notes), Recruitment (submit partner, sales team, team performance, prospects), Settings (general, account, profile, devices, security, privacy, legal, integrations), Workspace.

### `src/domains/portfolio/` (~28 files)
Public client/portfolio showcase pages.

### `src/domains/shared/` (~26 files)
Shared shell, ui, backgrounds, marketing patterns, mobile sidebar, settings components.

---

## Totals

| Category | Count |
|---|---|
| Dashboard pages | 23 |
| Feature modules | 20 |
| Feature components (features/) | ~500 |
| Shared/layout components | ~52 |
| Root UI kit | ~84 |
| Marketing components | ~138 |
| **ISSO dashboard components** | **~770** |
| Legacy domain components (client-base, partnerships, portfolio, shared) | ~514 |
| **Grand total** | **~1,150+ .tsx files** |

---

## Key Files

- `ISSO_DASHBOARD_CONTEXT.md` — full build context, nav architecture, feature map
- `src/features/README.md` — 5-product architecture, domain-based pattern
- `docs/features/feature-rollout.md` — feature rollout system
- `src/domains/client-base/README.md` — client-base domain docs

---

## Cross-Reference: His (AD) vs Ours (ISSO)

Source: `/tmp/ad-extract/` = his original NVA app (Cam's live OFM agency)
Source: `isso-dashboard/src/` = our rebuild

### What he built that we kept

| His (AD) | Ours (ISSO) | Status |
|---|---|---|
| `models-nva` | `models` | Renamed and improved |
| `swipe-deck` | `chatter` | Merged/renamed |
| All `isso/*` page shells | All `isso/*` page shells | Identical routing |
| Core features (agents, analytics, approvals, community, content, content-gen, ideas, instagram, intelligence, recon, schedule, settings, team, tools) | Same | Kept |

### His unique NVA features (dropped from our rebuild)

These are Cam's **live OnlyFans agency operations** — NOT IGINFULL SaaS:

| Feature | Description |
|---|---|
| `staff` | Telegram-linked shift tracking, late escalations, staff status |
| `staff-tasks` | Department task board (Chatters/Social Media/Editing/Management) |
| `billings` | Payroll by role (chatter/model/manager/owner), earnings, Google Sheets |
| `agency-comms` | Discord-style internal comms (text + voice + video channels) |
| `social` | Per-model PTP approval and posting schedule |
| `swipe-deck` | Content swipe review per model |
| `livestream` | Streaming views for agency + models |
| `content-pipeline` | Content flow management |
| `showroom` | (unclear purpose) |
| `recruitment` | (unclear purpose) |
| `campaigns` | (unclear purpose) |
| `notifications` | (unclear purpose) |
| `help` | (unclear purpose) |
| `toast` | (unclear purpose) |

### What we added that's new (not in his app)

- `chatter` — merges swipe-deck with inbox/chat features
- All `(marketing)/` landing pages — IGINFULL SaaS marketing site
- `/app/partners/` — onboarding, academy, community, earnings, pipeline-ops, recruitment (partner ecosystem)
- `domains/client-base/`, `domains/partnerships/`, `domains/portfolio/` — full SISO generic agency template system

### The 5-Product system is shared (both have it)

Both his AD and our ISSO have: **Hub**, **Intelligence**, **Recon**, **Agents**, **Briefs**
The ISSO 5-product branding with Cmd+1 through Cmd+5 hotkeys is ours — he had the features but not this branding/layer.

---

---

## CRITICAL FINDINGS — Things I Missed First Pass

### 1. `shift_tracker/` — His Python Telegram Bot (@NVTIMEBOT)
**Location:** `/tmp/ad-extract/shift_tracker/` (separate project, 4.5MB)

This is a **completely separate Python project** — not part of the Next.js app. A Telegram bot for his live OFM agency ops:

- `@NVTIMEBOT` — shift tracking for staff (Yssa, Mikeee, Sofia, Kristine, Macy, Dhene, Jack, Aria, Alex, Scott, Raph)
- Google Sheets integration — payroll, calendar, daily reports
- Late escalation system (3-min grace, 15-min late → escalation group)
- Airtable reporting (reel count, content checklist)
- Instagram analytics sync
- Local web dashboard at localhost:3001
- Easter egg: `easter_captions_mikeee.md`, `easter_captions_yssa.md`, `easter_captions_ren.md`

**Files:** `run_tracker.py`, `config.py`, `employee_profiles.json`, `shift_state.json`, `sheets.py`, `daily_report.py`, `build_payroll.py`, `dashboard.py`, `airtable_report.py`, `instagram_analytics_sync.py`, `NVTIMEBOT_FULL_RUNDOWN.md`, `SYSTEM_OVERVIEW.md`

### 2. `nva-agency-dashboard/` — IGINFULL SaaS Product (separate Next.js/Convex app)
**Location:** `/tmp/ad-extract/nva-agency-dashboard/` (46MB)

This is a **completely separate repo** — the actual IGINFULL SaaS product. Full Next.js + Convex project with:
- `docs/IGINFULL-BUILD-PLAN.md` — Priority build plan with 10 pages detailed
- `docs/research/INSPECTION_GUIDE.md`
- Agent skills for Convex setup/migration/component creation
- `.cursor/rules`, `.continue/rules`, `.windsurf/workflows` — AI coding tool configs
- `.env.local`, `Dockerfile`, built `.next/` folder
- `.claude/memory/iginfull_website_full_build.md`

### 3. 14 Context Documents — His Full OFM Operations Bible
**Location:** `/tmp/ad-extract/context/context/`

| Document | Lines | Contents |
|---|---|---|
| `creator_reels_playbook.md` | ~1,273 | **Master playbook** — 10 hook types, retention factors, OF niche strategy, GFE/Fitness/Food specifics, TTS vs onscreen text, viral trends 2025-2026 |
| `SAAS_PRODUCT_RESEARCH.md` | ~757 | IGINFULL full research — Supabase schema, competitor pricing, Meta Graph API guide, build timeline |
| `IGINFULL_PRODUCT_BRIEF.md` | ~? | Product brief v1 — personas, pricing tiers ($19-$999+/mo), feature breakdown |
| `reels_system.md` | ~? | Airtable workflow — 4 models, 2 VAs, batch 001 status |
| `content_niches.md` | ~? | 3 niches: GFE/Fitness/Food with structure rules |
| `user_profile.md` | ~? | Cam/ALJ profile — models ELLA/REN/TYLER/AMAM, VAs MIKEE/YSSA |
| `META_APP_SETUP.md` | ~? | Instagram Graph API setup for 9 accounts |
| `TODO.md` | ~? | Shift tracker status — Telegram bot done, pending Telegram IDs |
| `Drive_File_IDs.md` | ~? | Google Drive folder IDs + Airtable record IDs |
| `DAILY_LOG_TEMPLATE_TELEGRAM.md` | ~? | Shift log template |
| `VA_REEL_LINK_INSTRUCTIONS.md` | ~? | How to copy reel links from IG app → Airtable |
| `VA_LINK_INSTRUCTIONS_CHAT.md` | ~? | Updated link tracking instructions |
| `VA_EDITING_FEEDBACK.md` | ~? | Yssa praised, Mikeee reprimanded |
| `TELEGRAM_VA_MESSAGE.md` | ~? | VA onboarding message |

### 4. More pages I missed in the isso/ app
- `/isso/campaigns` — Full campaign brief generator (clip builder, format configs, caption generator, auto posting schedule)
- `/isso/recruitment` + `/isso/recruitment/applicants` — Full recruitment hub with applicant management
- `/isso/social/ptp` — PTP approval queue
- `/isso/staff/[id]` — Individual employee profile pages
- `/isso/staff/calendar` — Staff calendar with shift tracking
- `/isso/staff/shifts` — Full shift tracker interface
- `/isso/swipe-deck/[modelId]` — Per-model swipe deck

### 5. `appzip/` — Full Next.js app routes I didn't explore
Contains full `(marketing)/` site with all the landing pages, plus the complete isso routing structure.

---

## What the AD Folder Actually Contains

The AD folder is NOT just the isso-dashboard. It's **3 separate projects mixed together**:

| Project | Size | Description |
|---|---|---|
| **Isso dashboard** (his version) | ~medium | The agency dashboard — pages, features, components, shared |
| **nva-agency-dashboard** | 46MB | The IGINFULL SaaS product — separate Next.js/Convex repo |
| **shift_tracker** | 4.5MB | Python Telegram bot — @NVTIMEBOT shift tracking, payroll, Sheets |
| **Context docs** | ~? | 14 operational docs — his full OFM playbook |

---

---

## Deep Dive Findings — OFM Dashboard Features

### SHIFT TRACKER — @NVTIMEBOT (Python Telegram Bot)

**Status: Production-ready, running on Alex's Mac mini**

A complete Telegram bot managing Yssa and Mikeee's shifts. Key features:

| Feature | What it does |
|---|---|
| Clock-in/out | Logs to Google Sheets, posts to Telegram group |
| Break tracking | ☕ Start Break / ☑ End Break inline buttons |
| Late escalation | 3min nudge DM → 15min alert to Alex → 3x/month alert → 5x/month critical |
| Leave/swap requests | `/leave`, `/swap` with ✅/❌ approve flow |
| Pre-shift DM | Motivational messages 5min before shift |
| Daily EOD report | 8pm PHT — reel count from Airtable, IG checklist status |
| Weekly Sunday report | Punctuality, streaks, reel output vs target (48/wk), performance rating |
| Google Sheets | Shift Log, Leave Log, Summary, Dashboard, Calendar, Payroll tabs |
| Proof checker | Scrapes reel links → verifies live → syncs to Airtable |
| Field tracker | Monitors IG checklist changes every 5min |

**Stack:** Python, Telegram Bot API, Google Sheets API, Airtable REST API  
**Employees tracked:** Yssa (Social Media VA), Mikeee (Social Media VA)  
**Worth extracting:** Yes — complete, tested, directly monetizable for OFM agencies

---

### LIVESTREAM — Full Streaming Studio

**Status: Substantially functional (working camera, real browser APIs)**

Two modes:

**Agency View:** Live session cards with animated viewer/tip counters, 7-day earnings chart, platform breakdown (Chaturbate/BongaCams/Stripchat/Fanvue), live tips ticker, session history.

**Model Studio:** Camera preview (getUserMedia), countdown overlay, device selectors, audio level meter, per-platform streaming status, live chat simulator, AI prompts panel (bilingual EN/TH), stream health bars (bitrate/FPS/latency), OBS connection stub, session recap modal.

**Most impressive piece of all the AD code.** Closest to shippable.

---

### NOTIFICATIONS — Full React Notification System

**Status: Architecturally complete, ready to wire up**

- `NotificationContext` + `NotificationProvider` — add, mark-read, dismiss
- `NotificationBell` — unread count badge, pulse animation, dropdown
- `NotificationCenter` — filter tabs (All/Shift/Content/Approvals/System), grouped by date
- 9 trigger events documented (shift lateness, PTP approval, new applicants, etc.)
- Bilingual seed data

---

### BILLINGS — Role-Aware Payroll Dashboard

**Status: Display-only demo, data model is solid**

Four views (Chatter/Model/Manager/Owner) with:
- Base + commission + bonuses - deductions
- Google Sheets integration placeholders
- Role-specific dashboards

---

### SOCIAL — OFM Content Operations Hub

**Status: Working UI, localStorage-backed**

- `/social` — hub with per-model stats, platform breakdown
- `/social/ptp` — Post-to-Platform approval queue (approve → auto-schedule, reject → revision)
- `/social/schedule` — weekly content calendar across all models/platforms
- `/social/instagram` — IG analytics dashboard (stub chart data, "connect IG" messaging)
- `/social/[id]` — per-model page with chatter assignments per platform

---

### STAFF — Shift Tracking + HR Management

**Status: UI complete, Telegram backend infrastructure ready (endpoint missing)**

- `/staff` — department tables, live PHT clock, late counts, Telegram status
- `/staff/shifts` — TelegramShiftInterface with clock-in/break/finish controls, LateEscalationDisplay
- `/staff/calendar` — week/month calendar view with attendance grid
- `/staff/[id]` — employee profile with PTO balance, Telegram connection status
- `/staff/tasks` — Kanban task board with department filters

---

### CAMPAIGNS — Campaign Brief Generator

**Status: Polished stub (form complete, no backend)**

Full brief builder: model selector, content format (Western/Asian/POV/Day in the Life/etc.), camera angles, hook input, caption generator, auto posting schedule. localStorage only.

---

### RECRUITMENT — Applicant Tracking System

**Status: Polished stub**

Recruitment Hub + Applicant Management table with approve/reject/move-to-onboarding actions (all console.log). Feeds from `AgencyFrontEnd` onboarding wizard.

---

### AGENCY COMMS — Discord-Style Chat

**Status: Demo (local state only)**

Text channels + voice/video overlay with speaking indicators. Channel groups mirror OFM agency structure.

---

### SWIPE DECK — Content Pipeline Tracker

**Status: Partially functional**

Pipeline: pending → assigned → filmed → delivered → posted. Card removal works, status advancement works, reassign is a stub.

---

## What Belongs to Cam's OFM Agency (NVA)

These are the operational systems for his live agency with 4 models (ELLA, REN, TYLER, AMAM), 2 VAs (Yssa, Mikeee), chatters, and management:

| System | Purpose |
|---|---|
| `@NVTIMEBOT` | Shift tracking, payroll, Telegram-as-CMS |
| Livestream studio | Multi-platform streaming command center |
| Staff/Staff-tasks | VA scheduling, task management |
| Billings | Payroll by role (chatter/model/manager/owner) |
| Social/PTP | Content approval before posting |
| Agency Comms | Internal team chat |
| Swipe Deck | Content pipeline tracker |
| Notifications | 9-type alert system wired to OFM events |

**His 4 models:** ELLA (Asian/fit GFE), REN (Asian), TYLER (gay bear), AMAM (Asian, often paired with Ella)  
**His 2 VAs:** Mikeee (funny/humor reels), Yssa (GFE specialist)  
**VA editing target:** 5-10 min per reel  
**Content workflow:** Cam generates ideas → VAs assemble (no creative decisions) → Cam approves → posted

---

## IGINFULL — His SaaS Product (Separate Repo)

**Location:** `/tmp/ad-extract/nva-agency-dashboard/` (46MB, separate Next.js/Convex repo)

**Product:** Full Instagram content agency management platform. "AI does everything — generates content, edits it, schedules it, manages community, grows account."

**Target users:** Solo creators → content agencies → e-commerce brands  
**Pricing:** $19-149/mo (platform) → $999+/mo (full management)  
**Competitors:** Later, Buffer, Sprout Social, Fiverr/Upwork

**Built pages:** `/` (landing), `/ideas`, `/models`, `/content` (FFmpeg WASM enhance), `/approvals`, `/schedule`, `/community`, `/analytics`, `/team`, `/settings`

**Status:** UI-complete prototype. Cross-page flows use localStorage as fragile bridge. Convex backend scaffolded but not wired. Real Meta API posting not implemented.

### `models-nva/` (kept as `models/` in ours)
- Per-model social accounts (IG, Twitter, Fansly, OF)
- Chatter assignments per model
- Revenue/earnings tracking
- PTP (Permission to Post) approval queue
- Content task list per model
- Google Drive folder per model

### `staff/` (dropped)
- TelegramShiftInterface — links @NVTIMEBOT to shift status
- ShiftControlPanel, ShiftStatusBanner
- StaffContext React context
- Employee roster with Telegram IDs and departments

### `staff-tasks/` (dropped)
- TasksHub with Board/List/Table views
- Department filters (Chatters, Social Media, Editing, Management)
- "Send to Team" broadcast via Telegram

### `billings/` (dropped)
- Chatter/model/manager/owner pay views
- Google Sheets integrations for earnings/payroll

### `agency-comms/` (dropped)
- Discord-style channels (text + voice + video)
- Department groups (Chatters, Managers, Departments)
- Role colors and voice member status
