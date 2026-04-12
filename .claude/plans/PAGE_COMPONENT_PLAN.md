# Page + Component Plan — All Dashboards

*Built from: DEFINITIVE_FEATURE_LIST.md + ARCHITECTURE_BREAKDOWN.md + AGENCY_DASHBOARD_SPEC_V2.md*
*Date: 2026-04-13*

---

## A. AGENCY DASHBOARD (`/agency`)

### Sidebar Config (3 icons + persistent nav)

**Icon 1: OVERVIEW** (LayoutDashboard)
| Sub-page | Route | Features |
|----------|-------|----------|
| Dashboard Home | `/agency` | A1-A4 |
| Revenue & ROI | `/agency/analytics` | A5-A15 |
| Billings | `/agency/billings` | A68 |

**Icon 2: CONTENT** (Sparkles)
| Sub-page | Route | Features | MM Access |
|----------|-------|----------|-----------|
| Social Analytics | `/agency/social` | A16-A23 | Full |
| Content Scheduler | `/agency/schedule` | A24-A34 | Full |
| PTP Approval | `/agency/ptp` | A35-A45 | Approve (delegated) |
| R&D Table | `/editor/rd-table` | P2-P4 | Read + filter [FIXED — added MM access] |

**Icon 3: TEAM** (Users2)
| Sub-page | Route | Features | MM Access |
|----------|-------|----------|-----------|
| Shift Tracker | `/agency/shifts` | A51-A56 | Own department [FIXED — added] |
| Shift Schedule | `/agency/schedule-shifts` | A57-A64 | Own department [FIXED — added] |
| Models Roster | `/agency/models` | A65-A67 | View + click-through [FIXED — added] |

**Icon 4: WEBCAM** (Video) — Owner only
| Sub-page | Route | Features |
|----------|-------|----------|
| Webcam Stats | `/agency/webcam` | A46-A50 |

**Persistent Nav:**
- Settings (`/agency/settings`) — A69-A71
- Notifications — N1-N6

---

### Role Visibility Matrix

> **[FIXED]** Role matrix expanded to match Role Matrix doc (which is more generous and correct). MM (Marketing Manager) scope was too narrow — Alex said "everything minus financials." Added shifts, models roster, webcam stats (non-financial) access.

| Page | Owner | Marketing Manager | Worker |
|------|-------|---------|--------|
| Dashboard Home | Full KPIs | Limited KPIs (no revenue) [FIXED] | Own stats only |
| Revenue & ROI | Full | Hidden | Hidden |
| Billings | Full | Hidden | Hidden |
| Social Analytics | Full | Full [FIXED] | Own accounts only |
| Content Scheduler | Full | Full [FIXED] | View only |
| PTP Approval | Approve/reject | Approve (delegated) [FIXED] | View only |
| Shift Tracker | All employees | Own department [FIXED — added] | Own shifts |
| Shift Schedule | All employees | Own department [FIXED — added] | Own schedule |
| Models Roster | Full CRUD | View + click-through [FIXED — added] | Hidden |
| Webcam Stats | Full + live view | Non-financial stats only [FIXED — added; financial revenue hidden] | Hidden |
| R&D Table | Full | Full read + category filter [FIXED — added; spec says editors + marketing + models all have access] | Hidden |
| Settings | All settings | Profile only | Profile only |

---

### Page Specs

#### A-1: Dashboard Home (`/agency`)
- **Title:** Agency Dashboard
- **Features:** A1 (KPI cards), A2 (who's online), A3 (section summaries), A4 (simple design)
- **Components:**
  - `KPIDeltaTile` (reuse from intelligence) — revenue, model count, staff on shift
  - `StaffOnlineStrip` — photos + online/offline dots
  - `SectionSummaryCards` — mini card per section (revenue, content, team)
  - `QuickActionBar` — links to most-used pages
- **Data:** Google Sheets (revenue), Convex `models`, `shifts`, `users`
- **Actions:** Navigate to sub-pages

#### A-2: Revenue & ROI (`/agency/analytics`)
- **Title:** Revenue & ROI Analytics
- **Features:** A5-A15
- **Components:**
  - `PLSummaryCard` — profit, revenue, spending totals
  - `DepartmentBreakdownTable` — drill department → staff member
  - `StaffROIRow` — per-staff cost + output + ROI
  - `TrendLineChart` (reuse FormatChart pattern) — WoW/MoM trends
  - `DeclineAlert` — flag 3+ weeks declining ROI
  - `DateRangeSelector` — global date picker
  - `ExportButton` — PDF/PPT export
- **Data:** Google Sheets (financial), Convex `users`, `shifts`
- **Actions:** Filter by department/staff, export report, set date range

#### A-3: Social Analytics (`/agency/social`)
- **Title:** Social Analytics
- **Features:** A16-A23
- **Components:**
  - `ModelSelector` (shared) — filter by model
  - `PlatformTabs` (shared) — Instagram, Twitter, etc.
  - `AccountStatsGrid` — per-account follower/engagement cards
  - `TopPostsStrip` — horizontal scroll of top posts (reuse OutlierRow pattern)
  - `WeeklyMonthlyToggle` — time period selector
  - `PerformanceTagBadge` — auto-tagged content performance
- **Data:** Instagram API, Twitter API, Convex `scrapedPosts`, `postAnalyses`
- **Actions:** Filter by model/platform/period, tag content, link to content gen

#### A-4: Content Scheduler (`/agency/schedule`)
- **Title:** Content Scheduler
- **Features:** A24-A34
- **Components:**
  - `ModelSelector` (shared)
  - `AccountSelector` — per-model account picker
  - `CalendarGrid` — daily/weekly/monthly view (use FullCalendar or custom)
  - `DayDetailPanel` — stories/posts/reels for selected day
  - `ItemDetailDrawer` — caption, on-screen text, metadata per item
  - `MetaDripIndicator` — 25-slot queue status
  - `BestTimeRecommendation` — AI optimal posting time
  - `GridPreview` — Instagram feed preview
  - `BulkImportModal` — CSV import
- **Data:** Convex `schedule`, `approvals`, Meta API
- **Actions:** Schedule, reschedule (drag), bulk import, view queue status

#### A-5: PTP Approval (`/agency/ptp`)
- **Title:** Post-to-Publish Approval
- **Features:** A35-A45
- **Components:**
  - `ModelSelector` (shared)
  - `NicheFilter` (shared) — filter by niche
  - `ReelApprovalCard` — thumbnail + metadata + approve/reject buttons
  - `VersionComparison` — V1/V2 side-by-side viewer
  - `BatchApprovalBar` — floating bar for bulk approve/reject (reuse from content-gen QueueFeaturePage)
  - `ScheduleDatePopup` — recommended date on approve
  - `FrameAnnotation` — click-on-frame comment tool
  - `ApprovalSLAIndicator` — time-in-queue display
  - `DelegationSettings` — owner assigns approval rights to managers
- **Data:** Convex `reels`, `approvals`
- **Actions:** Approve, reject, annotate, batch approve, delegate, schedule

#### A-6: Webcam Stats (`/agency/webcam`)
- **Title:** Webcam Statistics
- **Features:** A46-A50
- **Components:**
  - `ModelSelector` (shared)
  - `StreamingScheduleStrip` — who's streaming when
  - `PredictedGoLiveCard` — next estimated live times
  - `EarningsPerStreamTable` — revenue by session
  - `LiveStreamEmbed` — watch model's current stream (CRITICAL)
- **Data:** 17 webcam platform APIs (TBD), Convex `webcamSessions`
- **Actions:** Watch live stream, view stats, filter by model

#### A-7: Shift Tracker (`/agency/shifts`)
- **Title:** Shift Tracker
- **Features:** A51-A56
- **Components:**
  - `EmployeeStatusGrid` — on time / late / absent per person
  - `TimeButton` — Shaan's existing clock-in/out code
  - `PayrollDeductionBadge` — deduction calculated from lateness
  - `SeniorAlertBanner` — alert when report is late
  - `ShiftAnalyticsChart` — weekly/monthly lateness trends
  - `PatternDetectionCard` — "late every Tuesday" auto-detection
- **Data:** Convex `shifts`, `users`, Google Sheets (payroll rules)
- **Actions:** Clock in/out, view deductions, acknowledge alerts

#### A-8: Shift Schedule (`/agency/schedule-shifts`)
- **Title:** Shift Schedule
- **Features:** A57-A64
- **Components:**
  - `ScheduleCalendar` — weekly/monthly view with employee rows
  - `EmployeeFilter` — filter by individual
  - `DayOffIndicator` — visual day-off markers
  - `DragDropAssigner` — drag to assign shifts with cost display
  - `ShiftSwapModal` — employee request → coworker accept → manager approve
  - `HistoryDrawer` — per-employee shift history
- **Data:** Convex `shiftSchedule`, `users`
- **Actions:** Assign shifts (drag), approve swaps, filter by employee, view history

#### A-9: Models Roster (`/agency/models`)
- **Title:** Models
- **Features:** A65-A67
- **Components:**
  - `ModelCard` — photo, name, niches, status, utilization rate
  - `ModelDetailPage` — earnings, next content due, all analytics
  - `AddModelDrawer` (reuse from existing)
  - `UtilizationBar` — booked hours / available hours
- **Data:** Convex `models`, `earningsRecords`, `contentRequests`
- **Actions:** View model detail, add model, edit model

#### A-10: Settings (`/agency/settings`)
- **Title:** Settings
- **Features:** A69-A71
- **Components:**
  - `LanguageSelector`
  - `TimezoneSelector`
  - `RoleManager` — owner-only role assignment
  - `SheetsSync` — Google Sheets sync status indicator (S8)
- **Data:** Convex `settings`, `users`
- **Actions:** Update preferences, manage roles, check sync status

---

## B. EDITOR DASHBOARD (`/editor`)

### Sidebar Config (3 icons + persistent nav)

**Icon 1: CONTENT** (Layers)
| Sub-page | Route | Features |
|----------|-------|----------|
| Raw Content Queue | `/editor` | E1-E3 |
| Finished Reels | `/editor/finished` | E17-E26 |
| PTP Status | `/editor/ptp` | E27-E32 |

**Icon 2: IDEAS** (Lightbulb)
| Sub-page | Route | Features |
|----------|-------|----------|
| Ideas Lab | `/editor/ideas` | E4-E11 |
| Search & Suggest | `/editor/search` | E12-E16 |

**Icon 3: R&D** (TrendingUp)
| Sub-page | Route | Features |
|----------|-------|----------|
| R&D Table | `/editor/rd-table` | P2-P4 |

**Persistent Nav:**
- Schedule (view only) — `/editor/schedule`
- Notifications — N1-N6

---

### Page Specs

#### E-1: Raw Content Queue (`/editor`)
- **Title:** Content Queue
- **Features:** E1 (unedited content), E2 (PTP rejections), E3 (priority view)
- **Components:**
  - `KanbanBoard` (use dnd-kit) — columns: New / In Progress / Done
  - `ContentCard` — thumbnail + model + niche + "needs tweaking" flag
  - `PriorityBadge` — high/medium/low
  - `ModelFilter` (shared)
- **Data:** Convex `contentRequests`, `reels` (rejected)
- **Actions:** Claim item, start editing, filter by model/priority

#### E-2: Ideas Lab (`/editor/ideas`)
- **Title:** Ideas Lab
- **Features:** E4-E11
- **Components:**
  - `VideoUploader` — drag-and-drop video input
  - `ModelNicheSelector` — who + niche + theme toggles
  - `GeminiAnalysisPanel` — frame-by-frame AI breakdown (reuse AiAnalysisPanel pattern)
  - `IdeaSuggestionCards` — 5-6 AI-generated ideas with hooks
  - `ThemePicker` — Western/Asian, Easter, Songkran, trending
  - `CapCutTipsPanel` — contextual editing tips
  - `CapCutTemplateLibrary` — templates by niche
  - `TrendFeed` — real-time TikTok Creative Center trends
- **Data:** Google Gemini API, TikTok Creative Center, Convex `toolAnalyses`
- **Actions:** Upload video, analyze, pick suggestions, save to R&D

#### E-3: Search & Suggest (`/editor/search`)
- **Title:** Search & Suggest
- **Features:** E12-E16
- **Components:**
  - `SearchBar` — keyword search against SISO database
  - `NicheThemeFilter` — niche + theme + category filters
  - `ReelGrid` — results grid with thumbnails
  - `CapCutToolkit` — always-present tips panel
  - `DuplicateWarning` — fuzzy-match alert for existing R&D entries
- **Data:** Convex `scrapedPosts` (search index)
- **Actions:** Search, filter, save to R&D, flag duplicates

#### E-4: Finished Reels (`/editor/finished`)
- **Title:** Finished Reels
- **Features:** E17-E26
- **Components:**
  - `ReelUploader` — upload + categorize (model, niche, category)
  - `AIReviewPanel` — auto-generated caption, on-screen text extraction, title + description
  - `EditedReelCard` — thumbnail + metadata + approval status badge
  - `EditTimeTracker` — timer per edit
  - `ViralityScoreBadge` — AI-driven 0-99 score
  - `HookVariantCards` — 3 hook variants with hashtags
  - `VersionLabel` — V1/V2/V3 indicator
- **Data:** Convex `reels`, Google Gemini (AI review), Google Drive
- **Actions:** Upload, categorize, review AI metadata, submit to PTP

#### E-5: PTP Status (`/editor/ptp`)
- **Title:** PTP Status
- **Features:** E27-E32
- **Components:**
  - `ReelStatusTable` — all submitted reels with approval status
  - `ModelNicheFilter` (shared)
  - `ApprovedSection` / `RejectedSection` — split view
  - `RejectionDetail` — reason + comment-to-task conversion
  - `VersionTimeline` — V1 → V2 → V3 correlation display
- **Data:** Convex `reels`, `approvals`
- **Actions:** View status, re-edit rejected items, view version history

#### E-6: R&D Table (`/editor/rd-table`)
- **Title:** R&D Content Pipeline
- **Features:** P2 (table view), P3 (graph view), P4 (approval gate)
- **Access:** Editor dashboard primary; also accessible to Marketing Manager (read + filter) [FIXED — was editor-only]
- **Components:**
  - `AirtableGrid` — table view with custom field types (use TanStack Table)
  - `GraphView` — D3 force-directed graph of content relationships
  - `ViewToggle` — table / graph toggle
  - `ApprovalStatusColumn` — proposed/approved/assigned/in_production/completed/rejected [FIXED — canonical enum]
  - `SundayBatchIndicator` — batch approval scheduled on Sundays
- **Data:** Convex `rdEntries`
- **Actions:** Add entries, filter, approve (Owner/Partner role only), switch views [FIXED — 'senior' role invalid]

---

## C. MODEL DASHBOARD (`/model`) — Mobile-First

> **[FIXED] Design constraints for ALL model dashboard pages:**
> - **"Treat models like 5 year olds"** — max 3-4 components visible at once on any model page. No dense layouts. Large touch targets. Simple language.
> - **Model webcam pages (Go Live, Webcam Stats, Webcam Calendar) are LAPTOP-BASED**, not mobile-first — despite the overall dashboard being mobile-first. These pages can use desktop layouts. [FIXED — spec says laptop context for webcam pages]
> - **Gamification on every interaction** — document which specific actions on each page earn points before building UI. Do not add gamification chrome without a points-earning action behind it.
> - **"Only 100% confirmed content, no faff"** — add confirmation gates on R&D approvals and content submissions. No speculative UI.

### Sidebar Config (5 icons, no persistent nav — mobile bottom tab bar instead)

> **[FIXED] 4-icon sidebar constraint:** The spec specifies max 4 icons per sidebar. Model dashboard currently has 5 icons. Review with Shaan before build — either consolidate SOCIAL + SWIPE into one icon, or confirm 5 is acceptable for model dashboard specifically.

**Icon 1: WEBCAM** (Video) — 3 sub-pages
| Sub-page | Route | Features |
|----------|-------|----------|
| Go Live | `/model/webcam` | M1, M4-M9 |
| Statistics | `/model/webcam/stats` | M2, M10, M11 |
| Calendar | `/model/webcam/calendar` | M3 |

**Icon 2: SOCIAL** (BarChart2)
| Sub-page | Route | Features |
|----------|-------|----------|
| My Analytics | `/model/social` | M12-M18 |

**Icon 3: REQUESTS** (Inbox)
| Sub-page | Route | Features |
|----------|-------|----------|
| Content Requests | `/model/requests` | M19-M25 |

**Icon 4: EARNINGS** (DollarSign)
| Sub-page | Route | Features |
|----------|-------|----------|
| My Earnings | `/model/earnings` | M26-M30 |

**Icon 5: SWIPE** (Heart)
| Sub-page | Route | Features |
|----------|-------|----------|
| Swipe Deck | `/model/swipe` | M31-M44 |
| My Week | `/model/week` | M44 |

**Gamification overlay on ALL pages:** M45-M50

---

### Page Specs

#### M-1: Go Live (`/model/webcam`)
- **Title:** Webcam
- **Features:** M1 (home/go live), M4-M9
- **Layout:** LAPTOP-BASED (not mobile-first) [FIXED]
- **Design constraint:** Max 3-4 components visible at once [FIXED]
- **Components:**
  - `LastWeekStatsStrip` — earnings + viewers across platforms
  - `StreamScheduleCard` — next scheduled stream
  - `GoLiveButton` — big gradient CTA
  - `PreStreamChecklist` — gamified checklist (lighting, camera, audio)
  - `BestTimeRecommendation` — AI optimal streaming time
  - `StreamKeyManager` — per-platform key input
- **Data:** 17 webcam platform APIs, Convex `webcamSessions`
- **Actions:** Go live, complete checklist, view schedule

#### M-2: Webcam Stats (`/model/webcam/stats`)
- **Title:** Streaming Stats
- **Features:** M2, M10, M11
- **Layout:** LAPTOP-BASED (not mobile-first) [FIXED]
- **Design constraint:** Max 3-4 components visible at once [FIXED]
- **Components:**
  - `PlatformEarningsGrid` — earnings per platform
  - `ViewerTrendChart` — viewer count over time
  - `PostStreamCard` — shareable screenshot summary card
  - `StreakCounter` — consecutive streaming days with flame icon
- **Data:** Webcam platform APIs
- **Actions:** View stats, share post-stream card

#### M-3: Webcam Calendar (`/model/webcam/calendar`)
- **Title:** Stream Schedule
- **Features:** M3
- **Layout:** LAPTOP-BASED (not mobile-first) [FIXED]
- **Components:**
  - `CalendarGrid` — daily/weekly/monthly (reuse, mobile-optimized)
  - `StreamSlot` — scheduled stream with platform icons
- **Data:** Convex `webcamSchedule`
- **Actions:** View schedule

#### M-4: Social Analytics (`/model/social`)
- **Title:** My Socials
- **Features:** M12-M18
- **Design constraint:** Max 3-4 components visible at once. Mobile-first. [FIXED]
- **Components:**
  - `TopThreePostsPinned` — 3 best posts always visible
  - `AccountHealthCard` — simplified follower/engagement view
  - `WeekComparisonArrows` — up/down trend indicators
  - `BestPostEverCard` — all-time best pinned
  - `DailyTopPostPush` — triggered notification
- **Data:** Instagram API (simplified), Convex `scrapedPosts`
- **Actions:** View stats (read-only)

#### M-5: Content Requests (`/model/requests`)
- **Title:** Content Requests
- **Features:** M19-M25
- **Design constraint:** Max 3-4 components visible at once. Mobile-first (375px). [FIXED]
- **Components:**
  - `RequestInbox` — list of briefs with thumbnails
  - `BriefDetail` — video clip + instructions + tips
  - `OneTapRecorder` — opens camera, records, uploads
  - `DeadlineCountdown` — timer with auto-reminder
  - `ProgressTracker` — "3 of 7 done" bar
  - `PointsMultiplier` — bonus display for early submission
- **Data:** Convex `contentRequests`, Google Drive
- **Actions:** View brief, record video, upload, earn points

#### M-6: Earnings (`/model/earnings`)
- **Title:** My Earnings
- **Features:** M26-M30
- **Design constraint:** Max 3-4 components visible at once. Mobile-first. [FIXED]
- **Components:**
  - `BigEarningsNumber` — total this month, big font
  - `PlatformBreakdown` — OF vs Fans.ly pie/bar
  - `ContentTypeBreakdown` — GFE vs fitness vs meme earnings
  - `WeeklyComparison` — "up 12%" badge
  - `GoalTracker` — target progress bar
  - `PaydayCountdown` — days until next payment
- **Data:** Convex `earningsRecords`, Google Sheets
- **Actions:** View earnings (read-only)

#### M-7: Swipe Deck (`/model/swipe`)
- **Title:** Daily Inspiration
- **Features:** M31-M44
- **Design constraint:** Max 3-4 components visible at once. Mobile-first. Swipe stack is full-screen by design. [FIXED]
- **Components:**
  - `SwipeStack` (REUSE from hub-swipe — directly portable)
  - `OneTapRecorder` (reuse from requests)
  - `DailyTargetPopup` — "Congrats! 10/10 done" celebration
  - `TrendingBadge` — "trending in your niche" indicator
  - `SavedList` — saved items with "make it now" button
  - `PointsDisplay` — gamification points for swiping
  - `WeeklyChallengeCard` — themed weekly challenge
  - `SwipeAuditLog` (REUSE from hub-swipe)
- **Data:** Convex content pipeline + agency DB, `swipeDeckItems`
- **Actions:** Swipe right/up/left, record, view saved list

#### M-8: My Week (`/model/week`)
- **Title:** My Week
- **Features:** M44
- **Components:**
  - `UnifiedCalendar` — webcam schedule + content deadlines merged
  - `DeadlineCard` — content request deadlines
  - `StreamSlot` — scheduled streams
- **Data:** Convex `webcamSchedule`, `contentRequests`
- **Actions:** View combined schedule

#### M-GAMIFICATION: Overlay on all pages
- **Features:** M45-M50
- **Components:**
  - `PointsCounter` — persistent points display (header or floating)
  - `LeaderboardWidget` (reuse LeaderboardSidebar from community)
  - `StreakIndicator` — consecutive day streak
  - `DailyCheckInButton` — tap to check in, earn points
  - `LevelProgressBar` — current level + XP to next
  - `RewardPreview` — monthly prize preview
  - `CelebrationModal` — confetti + congratulations (Duolingo-style)

---

## D. SHARED COMPONENTS

| Component | Used In | Source |
|-----------|---------|-------|
| `ModelSelector` | Agency (6 pages), Editor (4 pages) | New (shared) |
| `NicheFilter` | Agency PTP, Editor Ideas/Search/Finished, Swipe Deck | New (shared) |
| `CalendarGrid` | Agency Scheduler, Agency Shift Schedule, Model Webcam Calendar, Model My Week | New (shared, mobile-responsive) |
| `KPIDeltaTile` | Agency Home, Agency Revenue, Model Earnings | Reuse from intelligence |
| `SwipeStack` | Model Swipe Deck | Reuse from hub-swipe |
| `SwipeAuditLog` | Model Swipe Deck | Reuse from hub-swipe |
| `AiAnalysisPanel` | Editor Ideas Lab | Reuse from hub-swipe |
| `BatchApprovalBar` | Agency PTP | Reuse pattern from content-gen QueueFeaturePage |
| `PostCard` | Agency Social Analytics, Model Social Analytics | Reuse from community |
| `FilterBar` | Agency Social, Editor Search, Editor R&D | Reuse from community |
| `LeaderboardSidebar` | Model Gamification | Reuse from community |
| `ScoreRing` | Editor Finished Reels, Editor Ideas Lab | Reuse from intelligence |
| `VideoLightbox` | Agency PTP, Editor Ideas Lab | Reuse from intelligence |
| `PipelineStatusStrip` | Editor R&D, Agency Content Pipeline | Reuse from intelligence |
| `SkeletonCard` | All loading states | Reuse from intelligence |
| `OneTapRecorder` | Model Requests, Model Swipe Deck | New (shared, mobile) |
| `PointsDisplay` | Model (all pages) | New (shared) |
| `ContentPageShell` | Every page | Existing (`@/isso/layout/ContentPageShell`) |
| `IssoSidebarShell` | Every dashboard | Existing (`@/shared/layout/isso-sidebar/`) |

---

## E. DATA ENTITIES (New Convex Tables Needed)

| Entity | Used By | Key Fields |
|--------|---------|------------|
| `rdEntries` | Editor R&D Table, Pipeline | modelId, niche, theme, description, referenceUrl, status, approvedBy |
| `contentRequests` | Model Requests, Editor Queue | modelId, briefVideoUrl, instructions, deadline, status, uploadUrl |
| `reels` | Editor Finished, PTP, Scheduler | modelId, editorId, niche, title, captionAI, version, ptpStatus, mediaUrl |
| `shiftRecords` | Agency Shifts | userId, scheduledStart, actualStart, latenessMinutes, deduction |
| `shiftSchedules` | Agency Schedule | userId, date, startTime, endTime, isDayOff |
| `webcamSessions` | Model Webcam, Agency Webcam | modelId, platform, startedAt, earnings, viewerCount |
| `gamificationEvents` | Model Gamification | modelId, action, points, createdAt |
| `notifications` | All dashboards | recipientId, type, severity, channel, title, body, isRead |
| `financialRecords` | Agency Revenue | category, department, staffUserId, amount, source |
| `swipeDeckItems` | Model Swipe Deck | modelId, contentUrl, niche, action, savedAt |

---

## F. INTEGRATIONS MAP

| Integration | Pages That Use It | Status |
|-------------|-------------------|--------|
| Google Sheets | Revenue & ROI, Billings, Shift Tracker (payroll) | Pending — Shaan to provide access |
| Google Drive | Content Requests (auto-upload), Finished Reels (storage) | Pending — folder structure needed |
| Google Gemini | Ideas Lab (video analysis), Finished Reels (AI review) | API key needed |
| Meta API | Content Scheduler (25-slot drip) | Need to research cheap approach |
| Ayrshare | Content Scheduler (multi-platform posting) | Buy decision |
| 17 Webcam Platforms | Model Webcam, Agency Webcam Stats | Pending — docs from Shaan |
| TikTok Creative Center | Ideas Lab (trend feed) | Free, can integrate now |
| Telegram | Notifications (high severity) | Bot token needed |

---

*Next step: Split this into individual page docs in `memory/plans/` folder structure.*
