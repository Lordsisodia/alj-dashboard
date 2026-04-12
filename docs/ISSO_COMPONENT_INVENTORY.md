# ISSO Dashboard Component Inventory
**Generated:** 2026-04-06

---

## Summary

**Total Feature Modules:** 18  
**Total Components (feature-specific):** 370+  
**Total Shared UI Components:** 38  
**Total Layout Components:** 10

---

## Feature Modules & Components

### 1. Agents (12 components)
**Purpose:** Orchestrate agent workflows, view reports, and submit requests

- **AgentsFeaturePage.tsx** — Main feature container
- **ActivityCard.tsx** — Single activity card display
- **ActivityView.tsx** — Activity feed view
- **ReportCard.tsx** — Individual report card
- **ReportInsights.tsx** — Report insights summary
- **ReportsContent.tsx** — Reports container
- **ReportsSkeleton.tsx** — Loading skeleton for reports
- **ReportsView.tsx** — Reports list/grid view
- **FilterBar.tsx** — Filter controls for requests
- **RequestCard.tsx** — Individual request display
- **RequestForm.tsx** — Form to submit new requests
- **RequestsView.tsx** — Requests list view

---

### 2. Analytics (13 components)
**Purpose:** Dashboard metrics, audience insights, engagement charts

- **AnalyticsFeaturePage.tsx** — Main analytics container
- **EngagementBars.tsx** — Bar chart for engagement metrics
- **FollowerChart.tsx** — Follower growth visualization
- **ModelAccountHeader.tsx** — Header showing model account info
- **AgeRangeCard.tsx** — Audience age distribution card
- **AudienceInsights.tsx** — Comprehensive audience data view
- **GenderHoursCard.tsx** — Gender + posting hours card
- **LocationsCard.tsx** — Geographic distribution of audience
- **RevenuePlaceholder.tsx** — Revenue section placeholder
- **AnimatedNumber.tsx** — Animated counter component (reusable)
- **SectionCard.tsx** — Generic section card container
- **StatCard.tsx** — Single stat display card
- **TopPostsTable.tsx** — Table of top-performing posts

---

### 3. Approvals (8 components)
**Purpose:** Content approval workflow with rejection reasons

- **ApprovalsFeaturePage.tsx** — Main approvals container
- **ApprovalsTabContent.tsx** — Tab-based content switcher
- **ApprovalCard.tsx** — Individual approval item card
- **MiniStat.tsx** — Small stat indicator
- **DetailModal.tsx** — Detailed approval view in modal
- **PlatformPreviewPanel.tsx** — Platform-specific preview (Instagram/TikTok)
- **RejectionReasonPicker.tsx** — Dropdown for rejection reasons
- **EmptyState.tsx** — Placeholder when no approvals exist

---

### 4. Community (3 components)
**Purpose:** Community feed, leaderboards, social interaction

- **CommunityFeaturePage.tsx** — Main community container
- **PostCard.tsx** — Individual post card
- **LeaderboardSidebar.tsx** — Leaderboard rankings sidebar

---

### 5. Content (7 components)
**Purpose:** Content library, delivered clips, uploads

- **ContentFeaturePage.tsx** — Main content container
- **DeliveredView.tsx** — Delivered content view
- **ClipCard.tsx** — Video/clip card
- **ClipCardActions.tsx** — Action buttons for clips
- **EnhancementBadge.tsx** — Badge showing enhancement status
- **LibraryView.tsx** — Content library list/grid
- **UploadDropzone.tsx** — Drag-and-drop file upload area

---

### 6. Content Gen (30 components)
**Purpose:** AI video generation, modeling, job queue management

**Models Tab:**
- **ModelsFeaturePage.tsx** — Models selector/browser
- **ModelCard.tsx** — Individual model card
- **ModelGrid.tsx** — Grid of available models
- **ModelPanel.tsx** — Model detail/selection panel
- **AddModelDrawer.tsx** — Drawer to add new model

**Generator Tab:**
- **GenerateFeaturePage.tsx** — Main generation interface
- **BriefBuilder.tsx** — Form to build generation brief
- **FaceRefUpload.tsx** — Upload face reference image
- **GalleryCard.tsx** — Generated content card
- **GalleryTabContent.tsx** — Gallery view tab
- **GeneratorPills.tsx** — Quick-select generator options
- **JobCard.tsx** — Individual generation job card
- **TalentPicker.tsx** — Select talent/model for generation
- **StyleChips.tsx** — Style/aesthetic filters
- **NicheChip.tsx** — Niche/category filter

**Queue Tab:**
- **QueueFeaturePage.tsx** — Job queue container
- **QueueTabContent.tsx** — Queue view tab
- **ActiveJobCard.tsx** — Active/running job card
- **EtaCountdown.tsx** — Countdown timer for completion
- **HistorySection.tsx** — Past jobs history
- **StatsStrip.tsx** — Generation stats summary
- **RecentJobsPanel.tsx** — Recent jobs panel

**Shared/Utilities:**
- **PanelForm.tsx** — Reusable form in panel
- **PanelPreview.tsx** — Preview content in panel
- **PanelChecklist.tsx** — Checklist for generator steps
- **EmptyState.tsx** — Empty state placeholder
- **Field.tsx** — Form field component
- **CompletionBar.tsx** — Progress bar for jobs
- **SkeletonCard.tsx** — Loading skeleton
- **atoms.tsx** — Atomic UI elements (badge, pill, etc.)

---

### 7. Dashboard (9 components)
**Purpose:** Home/overview page with KPIs, activity, upcoming content

- **DashboardFeaturePage.tsx** — Main dashboard container
- **KpiCards.tsx** — Key performance indicator cards
- **ModelsOverview.tsx** — Models at-a-glance view
- **ModelPnLCard.tsx** — Profit/loss card per model
- **ActivityFeed.tsx** — Recent activity timeline
- **UpcomingPosts.tsx** — Scheduled content queue
- **QuickActions.tsx** — CTA buttons for common actions
- **ExpiringSubscriberQueue.tsx** — Expiring subscription alerts
- **PlaceholderContent.tsx** — Fallback/loading state

---

### 8. Hub Swipe (6 components)
**Purpose:** Swipe/voting interface for content curation

- **SwipeTabContent.tsx** — Main swipe interface
- **SwipeStack.tsx** — Card stack for swiping
- **SendToModelModal.tsx** — Modal to send content to model
- **SwipeSessionSummary.tsx** — Summary of swipe session
- **SwipeAuditLog.tsx** — Audit trail of swipes
- **WhyTagPanel.tsx** — Explanation panel for tags

---

### 9. Ideas (1 component)
**Purpose:** Content ideas/brainstorming

- **IdeasFeaturePage.tsx** — Main ideas container

---

### 10. Instagram (8 components)
**Purpose:** Instagram platform-specific dashboard

- **InstagramFeaturePage.tsx** — Main Instagram container
- **PlatformComingSoon.tsx** — Placeholder for upcoming platforms
- **AccountsTab.tsx** — Instagram accounts tab
- **AnalyticsTab.tsx** — Platform analytics view
- **ApprovalsTab.tsx** — Approvals for Instagram
- **OverviewTab.tsx** — Overview tab
- **QueueTab.tsx** — Queue tab
- **ScheduleTab.tsx** — Schedule/calendar tab

---

### 11. Intelligence (37 components)
**Purpose:** Content insights, AI analysis, trend detection

**Main Container:**
- **IntelligenceFeaturePage.tsx** — Main intelligence hub

**Analysis View:**
- **AnalysisView.tsx** — AI analysis display
- **AIAnalysisTab.tsx** — AI insights tab
- **DetailsTab.tsx** — Post details tab
- **TranscriptTab.tsx** — Video transcript display
- **DrawerMediaPanel.tsx** — Media display in drawer
- **DrawerRightPanel.tsx** — Right side panel for details
- **PostDetailDrawer.tsx** — Full post detail drawer

**Feed/Posts:**
- **FeedView.tsx** — Post feed view
- **PostCard.tsx** — Individual post card
- **PostListItem.tsx** — Post list item (table row)
- **SkeletonCard.tsx** — Loading skeleton
- **BoardPickerDropdown.tsx** — Board/board selection

**Insights Section:**
- **InsightsView.tsx** — Insights summary view
- **BarRow.tsx** — Bar chart row component
- **LearningSignal.tsx** — Engagement signal indicator
- **PreferenceChart.tsx** — Audience preference visualization
- **RatedCard.tsx** — User-rated post card
- **RaterActivity.tsx** — Activity of raters
- **RatingSummaryBar.tsx** — Rating distribution bar
- **TopRatedPosts.tsx** — Top posts by rating
- **WinningHooks.tsx** — Best-performing hooks/intros

**Trends Section:**
- **TrendsView.tsx** — Trends view container
- **AIChatPanel.tsx** — AI chat for trend analysis
- **FormatChart.tsx** — Format (Reel, Story, etc.) performance
- **HooksTable.tsx** — Table of trending hooks
- **NicheLeaderboard.tsx** — Niche ranking leaderboard
- **OutlierCard.tsx** — Anomaly/outlier detection card
- **OutlierFeed.tsx** — Feed of anomalies
- **PatternCard.tsx** — Pattern detection card
- **PatternInsights.tsx** — Pattern analysis view
- **StatsBar.tsx** — Stats summary bar
- **VideoLightbox.tsx** — Full-screen video viewer

**Controls:**
- **IntelligenceControls.tsx** — Filter/sort controls
- **SortPill.tsx** — Sort option pill
- **VisibilityPill.tsx** — Visibility toggle pill

**Experts View:**
- **ExpertsView.tsx** — Expert rankings/leaderboard

---

### 12. Marketing (138 components)
**Purpose:** Public-facing marketing website pages (not internal dashboard)

**Includes:**
- Agency Directory (5 components) — Search/filter agencies
- Blog (6 components) — Blog listing and post pages
- Book Demo (7 components) — Demo booking flows
- Pricing (multiple feature sections)
- Product Pages (multiple variants)
- Landing sections (Hero, Features, Testimonials, CTA, Footer)
- Platform-specific pages (Chrome Extension, University, Webinars, Mobile App, Lens)

**Key subsections:**
- Navigation/NavBar (8 components)
- Footer (10 components)
- Landing sections (15+ components)
- Product showcase (12+ components)

---

### 13. Models (20 components)
**Purpose:** Creator/model roster, onboarding, performance tracking

- **ModelsFeaturePage.tsx** — Main models container
- **ModelDetailPage.tsx** — Individual model profile

**Detail Tabs:**
- **AnalyticsTab.tsx** — Model performance metrics
- **ContentTab.tsx** — Model's content library
- **OverviewTab.tsx** — Overview/summary
- **PipelineTab.tsx** — Content pipeline status
- **ReferencesTab.tsx** — Model references/portfolio
- **SettingsTab.tsx** — Model settings

**Views:**
- **RosterView.tsx** — All models roster/grid
- **ModelRosterCard.tsx** — Individual roster card
- **OnboardingView.tsx** — Onboarding flow for new models
- **PerformanceView.tsx** — Performance dashboard
- **PipelineTracker.tsx** — Pipeline status visualization
- **ReelGrid.tsx** — Model's reel/video gallery
- **PortfolioStatsStrip.tsx** — Portfolio stats header

**Roster Card Bands (A/B/C/D):**
- **CardBandA.tsx** — Top tier model card
- **CardBandB.tsx** — Secondary tier card
- **CardBandC.tsx** — Tertiary tier card
- **CardBandD.tsx** — Entry tier card

---

### 14. Recon (47 components)
**Purpose:** Creator discovery, lead qualification, pipeline funnel

**Main Container:**
- **ReconFeaturePage.tsx** — Main recon hub

**Creators Table:**
- **CreatorsTable.tsx** — Main creator data table
- **CreatorTableRow.tsx** — Table row component
- **CreatorRow.tsx** — Creator roster row
- **CreatorCard.tsx** — Creator profile card
- **CreatorDetailView.tsx** — Full creator profile view
- **CreatorDetailSections.tsx** — Profile sections

**Filters & Controls:**
- **CreatorsFilterBar.tsx** — Filter controls
- **FilterPill.tsx** — Individual filter option
- **ColumnFilterHeader.tsx** — Column header with filter
- **ColumnVisibilityPill.tsx** — Column visibility toggle
- **TableToolbar.tsx** — Table top toolbar

**Stats & Visualization:**
- **StatCard.tsx** — Individual stat card
- **ScoreBadge.tsx** — Score indicator badge
- **ScoreColumnHeader.tsx** — Score column header
- **ProfileHealthBar.tsx** — Creator health/quality bar
- **Sparkline.tsx** — Inline chart sparkline
- **VolumeChart.tsx** — Content volume visualization
- **DashboardWidgets.tsx** — Widget collection

**Discovery/Funnel:**
- **DiscoveryTab.tsx** — Discovery funnel tab
- **DiscoveryFunnel.tsx** — Funnel visualization
- **DiscoveryHeader.tsx** — Discovery section header
- **CandidateRow.tsx** — Candidate profile row
- **DetailPanel.tsx** — Candidate detail panel
- **EmptyState.tsx** — Empty funnel state
- **InfoTooltip.tsx** — Inline help tooltip
- **MiniStat.tsx** — Small stat card
- **NicheDonut.tsx** — Niche breakdown donut chart
- **RatioBadge.tsx** — Ratio/percentage badge
- **SamplePostGrid.tsx** — Sample post gallery
- **ScrapingColumn.tsx** — Data scraping status column
- **StagePill.tsx** — Funnel stage indicator

**Activity & Feed:**
- **ActivityFeed.tsx** — Activity timeline
- **ReconFeedTab.tsx** — Activity feed tab

**Modals:**
- **ReconModals.tsx** — Modal collection
- **AddCandidateModal.tsx** — Add new candidate
- **BulkImportModal.tsx** — Bulk import candidates
- **TrackNicheModal.tsx** — Track/follow niche
- **TrackProfileModal.tsx** — Track/follow profile
- **AddActionModals.tsx** — Action modals (barrel export)
- **ModalShell.tsx** — Modal wrapper component

**Icons:**
- **IgIcon.tsx** — Instagram icon component

**Data:**
- **funnelData.tsx** — Funnel stage configuration

---

### 15. Schedule (4 components)
**Purpose:** Content calendar and scheduling

- **ScheduleFeaturePage.tsx** — Main schedule container
- **CalendarView.tsx** — Calendar grid view
- **AnalyticsView.tsx** — Scheduled content analytics
- **EngagementChart.tsx** — Engagement forecast chart

---

### 16. Settings (9 components)
**Purpose:** User/account configuration

- **SettingsFeaturePage.tsx** — Main settings container

**Tabs:**
- **ProfileTab.tsx** — User profile settings
- **BillingTab.tsx** — Billing/subscription settings
- **ConnectedAccountsTab.tsx** — Connected social accounts
- **ContentDefaultsTab.tsx** — Default content settings
- **IntegrationsTab.tsx** — Third-party integrations

**Controls:**
- **SettingsCard.tsx** — Settings group card
- **FieldRow.tsx** — Settings field row
- **AnimatedToggle.tsx** — Toggle switch component

---

### 17. Team (8 components)
**Purpose:** Team member management, permissions, roles

- **TeamFeaturePage.tsx** — Main team container
- **MemberCard.tsx** — Team member card
- **RoleBadge.tsx** — Role indicator badge
- **StatusDot.tsx** — Status indicator dot
- **PermissionsMatrix.tsx** — Permissions grid/table
- **InviteModal.tsx** — Invite new member modal
- **ActivityLog.tsx** — Team activity timeline
- **AccountPill.tsx** — Account/user pill component

---

### 18. Instagram (8 components)
*See section 10 above*

---

## Shared UI Components Library (`src/shared/ui/`)

### Form Controls (7 components)
- **button.tsx** — Primary button component
- **input.tsx** — Text input field
- **textarea.tsx** — Multi-line text input
- **select.tsx** — Dropdown select
- **label.tsx** — Form label
- **switch.tsx** — Toggle switch
- **slider.tsx** — Range slider

### Data Display (7 components)
- **badge.tsx** — Status/category badge
- **avatar.tsx** — User avatar
- **progress.tsx** — Progress bar
- **skeleton.tsx** — Loading skeleton
- **scroll-area.tsx** — Scrollable container
- **alert.tsx** — Alert/notification box
- **tooltip.tsx** — Hover tooltip

### Cards & Containers (6 components)
- **card.tsx** — Basic card container
- **card-5.tsx** — Enhanced card with gradient
- **card-5-static.tsx** — Static version of card-5
- **electric-card.tsx** — Electric/glowing card variant
- **electric-card-shell.tsx** — Card shell with effects
- **etheral-shadow.tsx** — Floating shadow effect

### Navigation & Layout (5 components)
- **tabs.tsx** — Tabbed interface
- **dropdown-menu.tsx** — Dropdown menu
- **modern-mobile-menu.tsx** — Mobile menu
- **limelight-nav.tsx** — Navigation bar variant
- **tubelight-navbar.tsx** — Another nav variant

### Text & Styling (3 components)
- **gradient-text.tsx** — Text with gradient
- **gradient-heading.tsx** — Heading with gradient

### Special Components (5 components)
- **animated-glowing-search-bar.tsx** — Search input with animation
- **liquid-toggle.tsx** — Liquid effect toggle
- **notifications-menu.tsx** — Notifications dropdown
- **stats-section.tsx** — Stats display section
- **wave-background.tsx** — Animated wave effect
- **waves-background.tsx** — Alternate wave effect

### Modals (2 components)
- **CreatePresetModal.tsx** — Preset creation modal
- **sign-in.tsx** — Sign-in form/modal

### Other Utilities (2 components)
- **DateRangePill.tsx** — Date range picker pill
- **FeedControls.tsx** — Feed control toolbar
- **index.ts** — Barrel exports

---

## Layout Components (`src/shared/layout/`)

### Main Shells
- **Shell.tsx** — Primary app shell/layout wrapper
- **ContentPageShell.tsx** — Content page wrapper
- **PageHeader.tsx** — Page header component

### Sidebar System
- **IssoSidebar.tsx** — Main sidebar component
- **IssoSidebarShell.tsx** — Sidebar + content shell
- **IssoDetailSidebar.tsx** — Detail/secondary sidebar
- **IssoIconNav.tsx** — Icon-only navigation rail
- **sidebar-config.tsx** — Sidebar configuration
- **navigation-store.tsx** — Navigation state management

### Icons
- **ProductIcon.tsx** — Product/feature icon

---

## Component Organization Patterns

### By Scope
1. **Feature Pages** — Top-level containers (`*FeaturePage.tsx`)
2. **Feature Sections** — Sub-views/tabs
3. **Reusable Cards** — Repeatable components
4. **Controls** — Buttons, filters, toggles
5. **Shared UI** — Generic components
6. **Layout** — Structural wrappers

### By Interaction
- **Data Display** — Read-only cards, tables
- **Modals** — Modal dialogs
- **Forms** — Input forms
- **Filters** — Search/filter controls
- **Navigation** — Menus, sidebars

### By Data Model
- **Models** — Creator/talent objects
- **Content** — Posts, clips, reels
- **Analytics** — Metrics, charts
- **Approvals** — Workflow states
- **Recon** — Lead qualification funnel

---

## Key Reusable Patterns

### Cards & Containers
```
CardBand[A-D]    → Tiered model roster cards
SectionCard      → Generic section wrapper
StatCard         → Metric display
*Card            → Feature-specific card types
```

### Tables & Lists
```
*Table           → Data table with columns
*Row             → Individual row component
*ListView        → List/grid view
```

### Modals & Drawers
```
*Modal           → Dialog component
*Drawer          → Slide-out panel
DetailPanel      → Inspector panel
```

### Forms & Controls
```
*Field           → Form input wrapper
*Tab             → Tab section
*Pill            → Compact badge/button
Filter*          → Filter control
```

### Analytics & Visualization
```
*Chart           → Chart/graph component
*Bar             → Bar chart row
Sparkline        → Inline mini-chart
StatsBar/Strip   → Stat summary
```

---

## Architecture Notes

### Feature Page Structure
Each feature typically follows this pattern:
```
Feature/
├── components/
│   ├── [Feature]FeaturePage.tsx    (main container)
│   ├── [SubView]/                  (feature sections)
│   │   ├── [Section]View.tsx
│   │   ├── [Card].tsx
│   │   └── index.ts
│   ├── modals/                     (modal components)
│   ├── index.ts                    (barrel export)
│   ├── types.ts
│   ├── constants.ts
│   ├── hooks/
│   └── utils.ts
```

### Component Naming
- `*FeaturePage` — Top-level feature containers
- `*View` — View/section containers
- `*Card` — Card display components
- `*Tab` — Tab panel contents
- `*Modal` — Modal dialogs
- `*Drawer` — Slide panels
- `*Chart` — Visualizations
- `*Bar` — Bar chart components
- `*Table` — Data tables
- `*Form` — Input forms
- `*Pill` — Compact badges/buttons
- `*Sidebar` — Side panels

---

## Component Count Summary

| Category | Count |
|----------|-------|
| Agents | 12 |
| Analytics | 13 |
| Approvals | 8 |
| Community | 3 |
| Content | 7 |
| Content Gen | 30 |
| Dashboard | 9 |
| Hub Swipe | 6 |
| Ideas | 1 |
| Instagram | 8 |
| Intelligence | 37 |
| Marketing | 138 |
| Models | 20 |
| Recon | 47 |
| Schedule | 4 |
| Settings | 9 |
| Team | 8 |
| **Subtotal** | **360** |
| **Shared UI** | **38** |
| **Layout** | **10** |
| **TOTAL** | **408** |

---

## Next Steps for Component Reuse Planning

### High Reuse Potential
- `AnimatedNumber` — Use across all metric displays
- `StatCard`/`SectionCard` — Base for analytics pages
- `*ModalShell` — Standardize modal layouts
- `FilterBar`/`*Pill` — Consistent filtering UX
- `Skeleton*` — Loading states
- `Chart` components — Visualization library

### Feature-Specific (Low Reuse)
- `CreatorCard` (Recon) — Too specific to discovery funnel
- `ClipCard` (Content) — Tied to content library structure
- `JobCard` (Content Gen) — Specific to generation queue

### Consider Consolidation
- Multiple `EmptyState` implementations → Single shared component
- Multiple tab implementations → Standardize on shared `Tabs`
- Multiple chart types → Unified chart library

