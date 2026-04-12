# Schema Coverage Audit — 205 Features × 37 Tables

*Generated 2026-04-12. Cross-references all 205 features against 28 existing Convex tables + 9 new tables (37 total).*

---

## Table Inventory Reference

### Existing 28 Tables
| # | Table | Purpose |
|---|-------|---------|
| 1 | `models` | Creator/talent roster |
| 2 | `ideas` | AI-generated content briefs |
| 3 | `content` | Uploaded raw clips + enhancement |
| 4 | `schedule` | Planned posts calendar view |
| 5 | `approvals` | PTP approval decisions |
| 6 | `analytics` | Per-model performance stats |
| 7 | `teamMembers` | Staff records |
| 8 | `activity` | Action audit log |
| 9 | `trackedAccounts` | Competitor + own IG/TikTok accounts |
| 10 | `scrapedPosts` | Scraped social content feed |
| 11 | `swipeRatings` | Staff swipe-left/right on scraped posts |
| 12 | `agentReports` | AI-generated intelligence reports |
| 13 | `contentGenJobs` | FLUX/Kling/Higgsfield generation pipeline |
| 14 | `scenes` | Approved video ideas waiting for generation |
| 15 | `featureRequests` | Feature request tracker |
| 16 | `agentRuns` | Agent task execution log |
| 17 | `creatorCandidates` | Recon discovery pipeline candidates |
| 18 | `blockedHandles` | Rejected handles |
| 19 | `toolAnalyses` | Gemini/AI video analysis runs |
| 20 | `routines` | Recurring agent tasks |
| 21 | `issues` | Agent task tracker |
| 22 | `costs` | AI model spend tracking |
| 23 | `mediaUploads` | R2 upload history |
| 24 | `agentDebugLogs` | AI call tracing |
| 25 | `settings` | Workspace settings |
| 26 | `analysisPrompts` | Versioned system prompts |
| 27 | `postAnalyses` | Structured feature vector per video |
| 28 | `creatorBriefs` | AI-generated creator profiles |

### New 9 Tables (CONVEX_SCHEMA_ADDITIONS.md)
| # | Table | Purpose |
|---|-------|---------|
| 29 | `rdEntries` | Human-curated R&D content idea backlog |
| 30 | `contentRequests` | Briefs sent from marketing to models |
| 31 | `reels` | Master record per edited reel |
| 32 | `reelVersions` | V1/V2/V3 immutable version snapshots |
| 33 | `scheduledPosts` | Execution-level Meta API queue |
| 34 | `notifications` | 3-channel notification system |
| 35 | `gamificationEvents` | Model points ledger |
| 36 | `shiftRecords` | Clock-in/out tracking |
| 37 | `shiftSchedules` | Who works when |

### Missing from CONVEX_SCHEMA_ADDITIONS.md (identified in DATA_ENTITIES.md but not designed)
- `webcamSessions` — mentioned in DATA_ENTITIES.md, not in CONVEX_SCHEMA_ADDITIONS.md
- `financialRecords` — mentioned in DATA_ENTITIES.md, not designed
- `swipeDeckItems` — mentioned in DATA_ENTITIES.md, not designed

---

## Part 1 — Full Feature-to-Table Mapping (205 features)

### AGENCY DASHBOARD (A1–A71)

| Feature ID | Feature | Serving Table(s) | Notes |
|------------|---------|-----------------|-------|
| A1 | Quick KPI cards — revenue, model count, staff on shift | `models`, `shiftRecords`, `shiftSchedules`, `financialRecords`* | `financialRecords` not yet designed |
| A2 | Who's online panel — staff photos + online/offline | `teamMembers` | `status` field covers online/offline |
| A3 | Section summaries — widget from each major section | Multiple tables (aggregate reads) | No dedicated table needed; computed |
| A4 | Simple overview design | UI only | No table needed |
| A5 | Full P&L view — profit, revenue, spending | `financialRecords`* | NOT YET DESIGNED |
| A6 | Department breakdown — drill to individual staff | `financialRecords`*, `teamMembers` | `financialRecords` needs `department` field |
| A7 | Staff cost tracking — cost per member | `financialRecords`*, `teamMembers` | `financialRecords` needs `staffUserId` |
| A8 | ROI per dimension — per staff, per service, per subscription | `financialRecords`* | NOT YET DESIGNED |
| A9 | CEO manual data entry — fill financial data | `financialRecords`* | NOT YET DESIGNED |
| A10 | Google Sheets source — mock data, migrate later | `financialRecords`* | `source` field needed (sheets_sync/manual) |
| A11 | Trend lines with decline alerts — WoW/MoM trends | `financialRecords`*, `analytics` | `financialRecords` needs time-series; `analytics` has `weeklyEngagement` |
| A12 | Model earnings projection — actual vs projected | `financialRecords`*, `analytics` | Projection needs separate field or table |
| A13 | Global date range selector | UI only | No table needed |
| A14 | Exportable white-label reports | `agentReports` (partial) | `agentReports` handles reports but lacks PDF export metadata |
| A15 | Competitor benchmarking — rival posting frequency + engagement | `trackedAccounts`, `scrapedPosts`, `postAnalyses` | Fully covered |
| A16 | All model accounts overview | `trackedAccounts`, `scrapedPosts` | `trackedAccounts.isOwn=true` filters own accounts |
| A17 | Platform tabs — Instagram, Twitter, etc. | `trackedAccounts` | `platform` field; Twitter not in enum yet |
| A18 | Filter by model — model > accounts > platform drill-down | `trackedAccounts`, `models` | `trackedAccounts` needs `modelId` link (GAP — see Part 4) |
| A19 | Weekly/monthly stats — time-period social performance | `analytics`, `scrapedPosts` | `analytics.weeklyEngagement` covers this |
| A20 | Top performing content — top posts + reels | `scrapedPosts`, `postAnalyses`, `analytics` | `analytics.topPosts` covers this |
| A21 | Management tracking — see what works, replicate | `postAnalyses`, `rdEntries` | `postAnalyses` feature vectors + `rdEntries` link |
| A22 | Content gen link — link high-performing posts to content gen | `scrapedPosts.savedForPipeline`, `rdEntries.referencePostId` | Covered by existing `savedForPipeline` + new `rdEntries` |
| A23 | Content performance tagging — auto-tag R&D with post performance | `rdEntries.performanceTags`, `rdEntries.linkedPostAnalysisId` | Covered in `rdEntries` |
| A24 | Calendar per model per account | `scheduledPosts`, `schedule` | Both tables serve this |
| A25 | Day detail view — stories, posts, reels scheduled | `scheduledPosts`, `schedule` | Covered |
| A26 | Item detail view — caption, on-screen text, all metadata | `scheduledPosts`, `reels` | Covered |
| A27 | Daily/weekly/monthly calendar views | `scheduledPosts` | UI zoom levels; data in `scheduledPosts.scheduledAt` |
| A28 | Infinite internal queue — drips to Meta's 25-slot limit | `scheduledPosts` | `metaSlotPosition` null = in internal queue |
| A29 | Auto-schedule next — when Meta slot opens | `scheduledPosts` | Status workflow covers this |
| A30 | Stage timestamps + SLA tracking | `scheduledPosts` | `enteredQueueAt`, `slotAssignedAt`, `publishedAt` |
| A31 | Best-time-to-post recommendations | `scheduledPosts.bestTimeScore` | Field exists; AI logic is application layer |
| A32 | Hashtag suggestions and grouping | `reels.suggestedHashtags`, `scheduledPosts.hashtags` | Covered; no dedicated hashtag-group table |
| A33 | Bulk/CSV import for scheduling | `scheduledPosts` | Table supports it; bulk import is application logic |
| A34 | Instagram grid preview | `scheduledPosts`, `reels` | `mediaUrl` + `thumbnailUrl` present; grid preview is UI |
| A35 | View submitted reels — all reels by model/niche | `reels` | `by_model_ptp` index covers this |
| A36 | Approved / Not Approved sections | `reels.ptpStatus` | Enum covers `approved`/`revision`/`submitted` |
| A37 | Approve with schedule — approve > recommended date > schedule | `reels`, `scheduledPosts`, `approvals` | `reels.scheduledDate` + `scheduledPosts` covers this |
| A38 | Reject with notification | `reels`, `notifications` | `ptpStatus="revision"` + notification type `ptp_rejection` |
| A39 | Unlimited version tracking — V1, V2, V3... | `reelVersions` | Fully covered |
| A40 | Partner-only approval | `teamMembers.permissions.approve` | Existing `approve` permission flag |
| A41 | Batch approval mode — grid view, swipe approve/reject | `reels`, `approvals` | No batch-specific table needed; UI feature |
| A42 | V1/V2 side-by-side comparison | `reelVersions` | `by_reel_version` index supports fetching any two versions |
| A43 | Approval delegation — owner designates approvers per model | `teamMembers`, `approvals` | **GAP** — no `approvalDelegations` table; `teamMembers.permissions.approve` is global not per-model |
| A44 | Frame-accurate video annotation | `reelVersions.annotations` | Embedded array in `reelVersions` |
| A45 | Approval SLA tracking — time-in-queue per reviewer | `reels`, `reelVersions` | `reelVersions.reviewedAt` - `createdAt` computable; no dedicated SLA table |
| A46 | All models' streaming stats — aggregate webcam view | `webcamSessions`* | NOT YET DESIGNED |
| A47 | Streaming shift/schedule — who's streaming when | `webcamSessions`*, `shiftSchedules` | `webcamSessions` not designed |
| A48 | Predicted go-live times | `webcamSessions`* | NOT YET DESIGNED |
| A49 | Earnings per stream | `webcamSessions`* | NOT YET DESIGNED |
| A50 | Live view — watch model's stream if live (CRITICAL) | `webcamSessions`* | NOT YET DESIGNED |
| A51 | Employee tracking — on time / late / absent | `shiftRecords` | `status` enum covers on_time/late/absent |
| A52 | Payroll integration — lateness = pay deductions | `shiftRecords.deductionAmount` | Covered |
| A53 | Senior alerts — notified when reports are late | `shiftRecords.seniorAlertSent`, `notifications` | Covered |
| A54 | Shift analytics — by week/month | `shiftRecords` | Aggregatable from `shiftRecords.date` |
| A55 | Time button — existing tracker code | `shiftRecords` | Clock-in/out covered by `actualStart`/`actualEnd` |
| A56 | Shift pattern detection — "late every Tuesday" | `shiftRecords` | Application logic over `shiftRecords`; no dedicated table needed |
| A57 | Who's working when — current and upcoming schedule | `shiftSchedules` | Covered |
| A58 | Who's online now — real-time staff online status | `teamMembers.status` | `Online`/`Away`/`Offline` enum |
| A59 | Employee filter — individual schedule, days off | `shiftSchedules` | `by_user_date` index covers this |
| A60 | Weekly and monthly schedule views | `shiftSchedules` | UI zoom; data is in `date`/`startTime`/`endTime` |
| A61 | Per-employee shift history | `shiftRecords` | `by_user_date` index covers this |
| A62 | Full historical shift data | `shiftRecords` | All records are retained |
| A63 | Drag-and-drop schedule builder with real-time labor cost | `shiftSchedules.estimatedCost` | Cost stub field present |
| A64 | Shift swap workflow | `shiftSchedules.swapRequestedWith`, `shiftSchedules.swapStatus` | Covered |
| A65 | All models view | `models` | Covered |
| A66 | Model detail page — earnings, content schedule, analytics | `models`, `analytics`, `scheduledPosts`, `reels` | Covered across tables |
| A67 | Model utilization rate — booked hours / available hours | `shiftSchedules`, `shiftRecords` | Computable; no dedicated field needed |
| A68 | Billings page — revenue and billing management | `financialRecords`* | NOT YET DESIGNED |
| A69 | Language setting | `settings` | Partially — `settings` has `displayName`/`timezone` but no per-user `language` field |
| A70 | Time zone setting | `settings` | `settings.timezone` exists; but per-user not per-workspace |
| A71 | General settings | `settings` | Covered |

---

### MARKETING MANAGER VIEW (MM1–MM4)

| Feature ID | Feature | Serving Table(s) | Notes |
|------------|---------|-----------------|-------|
| MM1 | Instagram Analytics — all accounts, weekly/monthly, top posts | `trackedAccounts`, `scrapedPosts`, `postAnalyses`, `analytics` | Mirrors A16-A23; same tables |
| MM2 | Content Scheduler | `scheduledPosts`, `schedule`, `reels` | Mirrors A24-A34 |
| MM3 | PTP — approving and viewing content | `reels`, `reelVersions`, `approvals` | Mirrors A35-A45 |
| MM4 | Social Analytics — full social access without financial data | `trackedAccounts`, `scrapedPosts`, `analytics` | Same tables; financial filtered at application layer |

---

### EDITOR DASHBOARD (E1–E33)

| Feature ID | Feature | Serving Table(s) | Notes |
|------------|---------|-----------------|-------|
| E1 | Unedited content from models | `contentRequests` | `status="uploaded"` = raw content ready to edit |
| E2 | PTP rejection queue — flagged "needs tweaking" | `reels` | `ptpStatus="revision"` |
| E3 | Editing needs view — priority queue | `reels`, `contentRequests` | `reels.ptpStatus` + `contentRequests.status` |
| E4 | Content input and analysis — frame-by-frame | `toolAnalyses` | Existing `toolAnalyses` table covers Gemini analysis |
| E5 | Toggles — who it's for, niche, rough idea selectors | `rdEntries` | `modelId`, `niche`, `theme` fields |
| E6 | AI idea suggestions — 5-6 ideas with hooks | `ideas` | Existing `ideas` table (AI-generated briefs) |
| E7 | Theme section — Western/Asian, Easter, Songkran, trending | `rdEntries.theme` | `theme` field in `rdEntries` |
| E8 | Gemini video analysis | `toolAnalyses` | Fully covered |
| E9 | CapCut tips baked in | UI/static content | No table needed |
| E10 | CapCut template library by niche | **GAP** | No table for CapCut templates |
| E11 | Real-time trend intelligence feed | **GAP** | No table for external trend data (TikTok Creative Center) |
| E12 | SISO database search | `scrapedPosts`, `rdEntries` | `search_rd` search index + `search_caption` on scrapedPosts |
| E13 | Reference reel finder | `scrapedPosts`, `rdEntries.referenceReelUrl` | Covered |
| E14 | CapCut toolkit — tips always present | UI/static | No table needed |
| E15 | AI suggestion bot — future AI bot | `ideas` (partial) | Future feature; `ideas` table can be extended |
| E16 | Duplicate detection — fuzzy-match | `rdEntries.contentHash` | Hash field present in `rdEntries` |
| E17 | Upload finished reel | `reels`, `reelVersions`, `mediaUploads` | Covered |
| E18 | AI auto-review — recommended caption | `reels.captionAI` | Covered |
| E19 | On-screen text extraction | `reels.onScreenTextAI` | Covered |
| E20 | Auto title + description | `reels.title`, `reels.description` | Covered |
| E21 | Edited reels gallery — metadata + approval status | `reels` | All metadata present |
| E22 | Auto PTP submission — finished reel auto-goes to PTP | `reels.ptpStatus` | Set to `submitted` on upload |
| E23 | Dual storage — dashboard + Google Drive | `reels.googleDriveUrl`, `mediaUploads` | Covered |
| E24 | Edit time tracking — timer per edit, averages | `reels.totalEditTimeSeconds`, `reelVersions.editTimeSeconds` | Covered |
| E25 | Virality/quality score — 0-99 AI score | `reels.viralityScore`, `reelVersions.viralityScore` | Covered |
| E26 | AI caption + hook generation — 3 variants + hashtags | `reels.hookVariants`, `reels.suggestedHashtags` | Covered |
| E27 | All reels by model/niche (editor PTP view) | `reels` | `by_model_ptp` index |
| E28 | Approved vs Not Approved per model | `reels.ptpStatus` | Covered |
| E29 | Rejection flow — rejected > notification > back to queue | `reels`, `notifications` | Covered |
| E30 | Re-edit and resubmit | `reelVersions`, `reels.ptpStatus` | New version bumps `currentVersion` |
| E31 | Version correlation — V1/V2/V3 tracking | `reelVersions` | Fully covered |
| E32 | Comment-to-task conversion — reviewer comments → to-do items | **GAP** | `reelVersions.annotations` has comments but no task-conversion mechanism; no `reelTasks` table |
| E33 | Semantic video search | **GAP** | No vector embedding / semantic search table |

---

### MODEL DASHBOARD (M1–M50)

| Feature ID | Feature | Serving Table(s) | Notes |
|------------|---------|-----------------|-------|
| M1 | Home / Go Live — last week stats, schedule, Go Live button | `webcamSessions`* | NOT YET DESIGNED |
| M2 | Statistics — full historical streaming across 17 platforms | `webcamSessions`* | NOT YET DESIGNED |
| M3 | Calendar — streaming schedule | `webcamSessions`*, `shiftSchedules` | `webcamSessions` not designed |
| M4 | Thai translation | UI/i18n layer | No table needed |
| M5 | Message filtering — harsh/moderate/safe filter levels | **GAP** | No table for live chat filter settings |
| M6 | Post-stream summary — earnings + viewer count to manager | `webcamSessions`*, `notifications` | `webcamSessions` not designed |
| M7 | Stream key management — per-platform stream keys | **GAP** | No table for stream keys |
| M8 | Pre-stream checklist | `gamificationEvents` (action: `pre_stream_checklist`) | Points tracked; checklist items need a table |
| M9 | Best time to stream recommendation | `webcamSessions`* | Pattern analysis over sessions |
| M10 | Post-stream screenshot card | `webcamSessions`* | NOT YET DESIGNED |
| M11 | Streak counter — consecutive streaming days | `gamificationEvents` (action: `streak_day`) | Points tracked; streak count computable |
| M12 | Simplified Instagram account view | `trackedAccounts`, `scrapedPosts`, `analytics` | Filtered view of existing data |
| M13 | Top three posts pinned | `scrapedPosts`, `analytics.topPosts` | `topPosts` array in `analytics` |
| M14 | Top reels and performance | `scrapedPosts`, `postAnalyses` | Covered |
| M15 | Simple "how am I doing" design | `analytics` | Summary stats present |
| M16 | Daily "your top post today" push | `notifications`, `scrapedPosts` | `notifications` covers push; scheduler triggers it |
| M17 | Week-over-week arrows — trend indicators | `analytics.weeklyEngagement` | Covered |
| M18 | "Your best post ever" pinned | `scrapedPosts`, `analytics.topPosts` | Covered; application logic picks all-time best |
| M19 | Inbox of briefs — briefs from marketing | `contentRequests` | `status="sent"` = model's inbox |
| M20 | One-tap video recording | `contentRequests` | Upload destination; recording is device-side |
| M21 | Upload back — upload from same screen | `contentRequests.uploadedClipUrl` | Covered |
| M22 | Auto Google Drive sync | `contentRequests.googleDriveFileId` | Covered |
| M23 | Deadline + auto-reminder | `contentRequests.deadline`, `contentRequests.reminderSentAt`, `notifications` | Covered |
| M24 | Progress tracker — "3 of 7 done" | `contentRequests` | Count `status="uploaded"` / total; UI computation |
| M25 | Points multiplier for early submissions | `contentRequests.submittedEarly`, `gamificationEvents.multiplier` | Covered |
| M26 | Combined revenue view — OF + Fans.ly | **GAP** | No `earningsRecords` table; mentioned in DATA_ENTITIES.md but not in schema |
| M27 | Breakdown by platform + content type | **GAP** | Same — `earningsRecords` not designed |
| M28 | Weekly comparison earnings | **GAP** | Same |
| M29 | Goal tracker — set and track earnings targets | **GAP** | No `modelGoals` or goal-tracking table |
| M30 | Payday countdown | **GAP** | No payment schedule table |
| M31 | Big content feed — content gen + agency DB | `scrapedPosts`, `rdEntries` | Swipe deck content pool |
| M32 | Swipe right to save — to "content to make" list | `swipeDeckItems`* | NOT YET DESIGNED |
| M33 | Swipe up to make now — opens camera, auto-upload | `swipeDeckItems`*, `contentRequests` | `swipeDeckItems` not designed |
| M34 | Swipe left to discard — trains algorithm | `swipeDeckItems`* | NOT YET DESIGNED |
| M35 | One-tap video recording in swipe context | `contentRequests` | Same as M20 |
| M36 | 10 suggestions per day minimum | `swipeDeckItems`*, `gamificationEvents` | NOT YET DESIGNED |
| M37 | Target hit celebration | `gamificationEvents` (action: `daily_target_hit`) | Points tracked; celebration is UI |
| M38 | Continue past target | `swipeDeckItems`* | State management; `swipeDeckItems` not designed |
| M39 | "Trending in your niche" badge | `scrapedPosts`, `postAnalyses` | Trend signal derivable from `outlierRatio` |
| M40 | Daily drop — 10 curated suggestions | `swipeDeckItems`* | NOT YET DESIGNED |
| M41 | Saved list with "make it now" button | `swipeDeckItems`* | NOT YET DESIGNED |
| M42 | Points for swiping | `gamificationEvents` (action: `swipe_right`/`swipe_discard`) | Covered |
| M43 | Weekly themed challenges | `gamificationEvents.challengeId`, `gamificationEvents.challengeWeek` | Points tracked; challenge definitions need table |
| M44 | Unified "My Week" calendar — webcam + content | `shiftSchedules`, `contentRequests`, `webcamSessions`* | Partially covered; `webcamSessions` missing |
| M45 | Points for every desired action | `gamificationEvents` | Covered |
| M46 | Weekly targets — 10 reels/suggestions, 3 submissions/day | `gamificationEvents` | Targets are configuration; events are tracked |
| M47 | Weekly/monthly leaderboard | `gamificationEvents` | Aggregatable; no dedicated leaderboard snapshot table |
| M48 | Monthly rewards | **GAP** | No `rewards` or `rewardRedemptions` table |
| M49 | Challenge mode — weekly themed challenges | `gamificationEvents.challengeId` | Points tracked; **GAP** — no `challenges` table for challenge definitions |
| M50 | Push notification with send-time optimization | `notifications` | `notifications` table covers this; AI timing = application logic |

---

### CONTENT PIPELINE (P1–P16)

| Feature ID | Feature | Serving Table(s) | Notes |
|------------|---------|-----------------|-------|
| P1 | Analytics identification — what's working on Instagram | `scrapedPosts`, `postAnalyses`, `trackedAccounts` | Covered |
| P2 | R&D Table — Airtable-style table view | `rdEntries` | Fully covered |
| P3 | R&D Graph View — D3 force-directed graph | `rdEntries` | Data in `rdEntries`; graph is frontend rendering |
| P4 | Senior approval gate | `rdEntries.status="approved"`, `rdEntries.approvedBy` | Covered |
| P5 | Content request to model | `contentRequests` | Covered |
| P6 | Model creates content | `contentRequests.uploadedClipUrl` | Covered |
| P7 | Google Drive auto-sync | `contentRequests.googleDriveFileId` | Covered |
| P8 | Editor queue — kanban with CapCut tips | `contentRequests`, `reels` | Covered |
| P9 | Editor edits — uploads with AI metadata | `reels`, `reelVersions` | Covered |
| P10 | PTP approval — approve > date > schedule | `reels`, `approvals`, `scheduledPosts` | Covered |
| P11 | Scheduler to Meta — drip to 25-slot limit | `scheduledPosts` | Fully covered |
| P12 | Analytics feedback loop — performance feeds back | `postAnalyses`, `rdEntries.linkedPostAnalysisId` | Covered |
| P13 | PTP rejection flow | `reels.ptpStatus="revision"`, `notifications` | Covered |
| P14 | Model swipe-right shortcut — direct to queue | `swipeDeckItems`*, `contentRequests` | `swipeDeckItems` not designed |
| P15 | Content performance to R&D feedback loop | `rdEntries.performanceTags`, `rdEntries.linkedPostAnalysisId` | Covered |
| P16 | Recurring post duplicate detection | `scheduledPosts`, `reels` | **GAP** — no dedup field/index; would need `contentHash` on `scheduledPosts` |

---

### ROLES & PERMISSIONS (R1–R7)

| Feature ID | Feature | Serving Table(s) | Notes |
|------------|---------|-----------------|-------|
| R1 | 7 role types | `teamMembers.role` | **GAP** — current enum is `Admin`/`VA`/`Editor` only; missing Owner, Partner, Marketing Manager, Model, Developer |
| R2 | Permissions matrix — role × route × action | `teamMembers.permissions` | **GAP** — current permissions object is 6 boolean flags; no granular route-level ACL |
| R3 | Multiple roles per user | `teamMembers.role` | **GAP** — `role` is a single string, not an array |
| R4 | Act in switched views | Application layer | Depends on R3 fix |
| R5 | Owner-only role assignment | Application layer + permissions | **GAP** — no `canAssignRoles` permission flag |
| R6 | Developer role | `teamMembers.role` | **GAP** — not in enum |
| R7 | Role dropdown on signup | `teamMembers` | Application layer; data model needs R1/R3 fixes first |

---

### NOTIFICATIONS (N1–N6)

| Feature ID | Feature | Serving Table(s) | Notes |
|------------|---------|-----------------|-------|
| N1 | Three notification channels — in-app, push, Telegram | `notifications.channels` | Covered |
| N2 | High severity — all 3 channels | `notifications.severity="high"` | Covered |
| N3 | Medium severity — in-app + push | `notifications.severity="medium"` | Covered |
| N4 | Low severity — in-app only | `notifications.severity="low"` | Covered |
| N5 | Priority = revenue — editing + content gen highest | `notifications.type` + `notifications.severity` | Covered by type classification |
| N6 | Digest mode — batch non-urgent into daily summary | `notifications.type="digest"` | Covered |

---

### SHARED COMPONENTS (S1–S8)

| Feature ID | Feature | Serving Table(s) | Notes |
|------------|---------|-----------------|-------|
| S1 | IssoSidebarShell | UI component only | No table needed |
| S2 | ContentPageShell | UI component only | No table needed |
| S3 | Pill navigation | UI component only | No table needed |
| S4 | Consistent isso-dashboard styling | UI only | No table needed |
| S5 | Desktop-optimized layout | UI only | No table needed |
| S6 | Mobile-optimized Model layout | UI only | No table needed |
| S7 | Role-based view switching | `teamMembers.role` | Depends on R1/R3 fixes |
| S8 | Google Sheets sync status dashboard | `settings.integrations` | Partial — `settings` has `googleDrive.connected`/`lastSynced` but no sync health detail |

---

### INTEGRATIONS (I1–I10)

| Feature ID | Feature | Serving Table(s) | Notes |
|------------|---------|-----------------|-------|
| I1 | Google Sheets | `financialRecords`*, `settings.integrations` | `financialRecords` not designed |
| I2 | Google Drive | `contentRequests.googleDriveFileId`, `reels.googleDriveUrl`, `settings.integrations.googleDrive` | Covered |
| I3 | Google Gemini | `toolAnalyses` | Covered |
| I4 | Meta API — 25-slot drip queue | `scheduledPosts` | Covered |
| I5 | 17 webcam platforms | `webcamSessions`* | NOT YET DESIGNED |
| I6 | OBS — stream keys | **GAP** | No stream key table |
| I7 | Telegram | `notifications.channels.telegram`, `settings.integrations.telegram` | Covered |
| I8 | Ayrshare SDK | `scheduledPosts` | Platform posting covered by table; SDK is application layer |
| I9 | TikTok Creative Center | **GAP** | No trend data table |
| I10 | Opus Clip | **GAP** | No virality scoring integration table |

---

## Part 2 — Features with NO Table Serving Them (Gaps)

These features currently have zero table coverage and will fail to persist data:

| Feature ID | Feature | Gap Description |
|------------|---------|----------------|
| A5–A9, A11–A12, A68, I1 | Full P&L, ROI, staff cost, billings, financial analytics | `financialRecords` table entirely missing |
| A43 | Approval delegation per model | No `approvalDelegations` table; current permissions are global |
| A46–A50, M1–M3, M6, M9–M10, I5 | All webcam stats, streaming sessions, go-live, earnings | `webcamSessions` table entirely missing |
| M5 | Message filtering levels (harsh/moderate/safe) | No table for per-model live chat settings |
| M7, I6 | Stream key management | No `streamKeys` table |
| M8 | Pre-stream checklist items | `gamificationEvents` tracks points but checklist items need a list/table |
| M26–M30 | Model earnings (OF + Fans.ly), goal tracker, payday countdown | `earningsRecords` table entirely missing |
| M32–M34, M36, M38, M40–M41, P14 | Swipe Deck — save/discard/make-now, daily drop queue | `swipeDeckItems` table entirely missing |
| M43, M49 | Weekly challenge definitions and tracking | No `challenges` table; only point events tracked |
| M48 | Monthly rewards program | No `rewards` or `rewardRedemptions` table |
| E10 | CapCut template library by niche | No template table |
| E11, I9 | Real-time trend intelligence feed | No trend data / external feed table |
| E32 | Comment-to-task conversion | No `reelTasks` or annotation-to-task mechanism |
| E33 | Semantic video search | No vector embedding table |
| P16 | Recurring post duplicate detection | No dedup hash field on `scheduledPosts` |
| R1, R3, R5, R6 | 7 role types, multiple roles per user, owner-only assignment, Developer role | `teamMembers.role` enum too narrow; single not array |
| R2 | Granular permissions matrix (route × action ACL) | Current `permissions` object is 6 booleans; needs route-level ACL |
| I10 | Opus Clip virality scoring integration | No integration metadata table |
| A17 (partial) | Twitter platform tab | `trackedAccounts.platform` enum missing `twitter` |
| A18 (partial) | Filter by model → accounts | `trackedAccounts` missing `modelId` foreign key |
| A69–A70 (partial) | Per-user language and timezone | `settings` is workspace-level; no per-user preferences |

---

## Part 3 — Additional Tables Still Needed to Design

### CRITICAL (blocks major features)

#### `financialRecords`
Blocks: A5, A6, A7, A8, A9, A10, A11, A12, A68, I1
```typescript
financialRecords: {
  category: "revenue" | "cost" | "payroll" | "model_cut" | "subscription",
  department: optional string,        // e.g. "editing", "marketing", "management"
  staffUserId: optional id("teamMembers"),
  modelId: optional id("models"),
  amount: number,                     // in base currency
  currency: string,                   // e.g. "THB", "GBP"
  period: string,                     // YYYY-MM or YYYY-WW
  source: "sheets_sync" | "manual",
  description: optional string,
  syncedAt: optional number,
  createdAt: number,
}
```

#### `webcamSessions`
Blocks: A46, A47, A48, A49, A50, M1, M2, M3, M6, M9, M10, M44, I5
```typescript
webcamSessions: {
  modelId: id("models"),
  platform: string,                   // e.g. "chaturbate", "stripchat", ...
  startedAt: number,
  endedAt: optional number,
  durationSeconds: optional number,
  viewerCount: optional number,
  peakViewers: optional number,
  earnings: optional number,
  earningsCurrency: optional string,
  streamKeyId: optional id("streamKeys"),
  postStreamSummaryUrl: optional string,   // M10 — shareable card
  postStreamSentAt: optional number,       // M6 — when summary sent to manager
  createdAt: number,
}
```

#### `earningsRecords`
Blocks: M26, M27, M28, M29, M30
```typescript
earningsRecords: {
  modelId: id("models"),
  platform: "onlyfans" | "fansly" | "webcam" | "tips" | "ppv" | "subscription",
  contentType: optional string,       // e.g. "GFE", "fitness", "general"
  amount: number,
  currency: string,
  period: string,                     // YYYY-MM-DD or YYYY-WW
  source: "api_sync" | "manual" | "sheets_sync",
  recordedAt: number,
}
```

#### `swipeDeckItems`
Blocks: M32, M33, M34, M36, M38, M40, M41, P14
```typescript
swipeDeckItems: {
  modelId: id("models"),
  sourceType: "scraped_post" | "rd_entry" | "ai_suggestion",
  sourceId: string,                   // _id of source record
  contentUrl: string,
  thumbnailUrl: optional string,
  niche: string,
  theme: optional string,
  action: "pending" | "saved" | "make_now" | "discarded",
  savedAt: optional number,
  droppedDate: string,                // YYYY-MM-DD — which daily drop this belongs to
  isTrending: optional boolean,       // M39 — "trending in your niche" badge
  createdAt: number,
}
```

#### `streamKeys`
Blocks: M7, I6
```typescript
streamKeys: {
  modelId: id("models"),
  platform: string,
  keyValue: string,                   // encrypted at rest
  label: optional string,
  isActive: boolean,
  lastUsedAt: optional number,
  createdAt: number,
}
```

### HIGH VALUE (blocks significant features)

#### `userPreferences`
Blocks: A69, A70, R3, R7 (per-user settings)
```typescript
userPreferences: {
  userId: id("teamMembers"),           // or modelId — consider union
  language: string,                    // e.g. "en", "th"
  timezone: string,                    // e.g. "Asia/Bangkok"
  notificationPrefs: {
    digestMode: boolean,
    pushEnabled: boolean,
    telegramEnabled: boolean,
  },
  createdAt: number,
  updatedAt: number,
}
```

#### `challenges`
Blocks: M43, M49
```typescript
challenges: {
  title: string,
  description: string,
  week: string,                        // YYYY-WW
  targetAction: string,                // action type from gamificationEvents
  targetCount: number,
  bonusPoints: number,
  isActive: boolean,
  createdAt: number,
  expiresAt: number,
}
```

#### `approvalDelegations`
Blocks: A43
```typescript
approvalDelegations: {
  ownerId: id("teamMembers"),          // who delegated
  delegateeId: id("teamMembers"),      // who can approve
  modelId: optional id("models"),      // null = all models
  expiresAt: optional number,
  createdAt: number,
}
```

#### `rewards`
Blocks: M48
```typescript
rewards: {
  modelId: id("models"),
  title: string,                       // e.g. "Nail treatment", "Ring light"
  month: string,                       // YYYY-MM
  pointsRequired: number,
  status: "pending" | "awarded" | "redeemed",
  awardedAt: optional number,
  redeemedAt: optional number,
  notes: optional string,
  createdAt: number,
}
```

### MEDIUM VALUE (blocks moderate features)

#### `capCutTemplates`
Blocks: E10
```typescript
capCutTemplates: {
  name: string,
  niche: string,
  category: string,                    // "GFE", "fitness", "meme", etc.
  templateUrl: string,
  previewUrl: optional string,
  tags: array string,
  addedBy: optional string,
  createdAt: number,
}
```

#### `trendFeedItems`
Blocks: E11, I9
```typescript
trendFeedItems: {
  platform: "tiktok" | "instagram" | "youtube",
  type: "hashtag" | "sound" | "format" | "topic",
  label: string,                       // e.g. "#summerbody", "Trending sound: ..."
  niche: optional string,
  viewCount: optional number,
  growthRate: optional number,
  fetchedAt: number,
  expiresAt: number,                   // trend data is ephemeral
}
```

#### Extend `teamMembers` — role as array + expanded enum
Blocks: R1, R2, R3, R5, R6
- Change `role` from single string to `roles: array(union(literals))`
- Add roles: `"Owner"`, `"Partner"`, `"MarketingManager"`, `"Model"`, `"Developer"`, `"Chatter"`
- Add `permissions.canAssignRoles: boolean`
- Add route-level ACL or a separate `rolePermissions` table

#### Extend `trackedAccounts`
Blocks: A17, A18
- Add `twitter` to `platform` enum
- Add `modelId: optional id("models")` — links own accounts to model records

#### Extend `scheduledPosts`
Blocks: P16
- Add `contentHash: optional string` — SHA/fuzzy hash for duplicate detection

---

## Part 4 — Missing Fields on the 9 New Tables

| Table | Missing Field | Needed For | Recommendation |
|-------|--------------|------------|----------------|
| `reels` | `taskItems: optional array(object)` | E32 — comment-to-task conversion | Add lightweight `reelTasks` sub-table OR embed in `reelVersions.annotations` with a `convertedToTask` flag |
| `scheduledPosts` | `contentHash: optional string` | P16 — duplicate detection | Add field for fuzzy dedup |
| `scheduledPosts` | `ayrshareJobId: optional string` | I8 — Ayrshare SDK tracking | Add for external job correlation |
| `gamificationEvents` | No `weeklyTargetConfig` | M46 — target definitions are hardcoded | Consider a `gamificationConfig` settings doc or table |
| `notifications` | `sendTimeOptimizationScore: optional number` | M50 — AI-driven send time | Add score field from ML model |
| `shiftRecords` | `breakMinutes: optional number` | A54 — shift analytics accuracy | Useful for payroll calculations |
| `shiftSchedules` | `recurrenceRule: optional string` | A57 — recurring weekly shifts (RRULE) | Enables template-based scheduling |
| `rdEntries` | `capCutTemplateId: optional id("capCutTemplates")` | E10 — link ideas to CapCut templates | Add after `capCutTemplates` table is created |
| `contentRequests` | `niche: optional string` | E3 — editor queue needs niche filter | Denormalize from `rdEntries.niche` |

---

## Summary Counts

| Category | Count |
|----------|-------|
| Features fully covered by existing + new tables | 108 |
| Features partially covered (some fields/tables missing) | 47 |
| Features with zero table coverage (pure gaps) | 50 |
| UI-only features (no table needed) | 14 |
| **Total features** | **205** (some features overlap categories) |

### New Tables Required Beyond the 9 Already Designed

| Table | Priority | Blocks |
|-------|----------|--------|
| `financialRecords` | CRITICAL | A5–A12, A68, I1 (8+ features) |
| `webcamSessions` | CRITICAL | A46–A50, M1–M3, M6, M9–M10, I5 (11 features) |
| `earningsRecords` | CRITICAL | M26–M30 (5 features) |
| `swipeDeckItems` | CRITICAL | M32–M41, P14 (9 features) |
| `streamKeys` | HIGH | M7, I6 (2 features) |
| `userPreferences` | HIGH | A69, A70, R3 (3 features) |
| `challenges` | HIGH | M43, M49 (2 features) |
| `approvalDelegations` | HIGH | A43 (1 feature) |
| `rewards` | MEDIUM | M48 (1 feature) |
| `capCutTemplates` | MEDIUM | E10 (1 feature) |
| `trendFeedItems` | MEDIUM | E11, I9 (2 features) |

**Total additional tables needed: 11**

Bringing the final schema to **48 tables** (28 existing + 9 designed + 11 still to design).

---

*End of audit.*
