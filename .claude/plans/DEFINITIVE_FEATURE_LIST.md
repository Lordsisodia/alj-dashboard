# DEFINITIVE FEATURE LIST

*Compiled 2026-04-12 from Spec V2 + 20 approved enhancements + market research gaps*
*Excludes: Chatter view, Recruitment, Onboarding, Landing Page, General Admin (all deferred)*

---

## AGENCY DASHBOARD (Owner/Partner)

### Dashboard Home
A1. Quick KPI cards — revenue summary, model roster count, staff on shift
A2. Who's online panel — staff photos with online/offline status indicator
A3. Section summaries — quick summary widget from each major section
A4. Simple overview design — "view the agency from afar", not overwhelming

### Revenue & ROI Analytics
A5. Full P&L view — profit, revenue, spending breakdown
A6. Department breakdown — drill from department level to individual staff member
A7. Staff cost tracking — how much each member costs and what they're doing
A8. ROI per dimension — ROI per staff member, per service, per subscription
A9. CEO manual data entry — ability to manually fill financial data
A10. Google Sheets source — mock data from Sheets, migrate to Convex/Supabase later
A11. Trend lines with decline alerts — week-over-week + month-over-month trends, flag declining ROI for 3+ weeks [APPROVED ENHANCEMENT #2]
A12. Model earnings projection — actual vs projected earnings comparison [APPROVED ENHANCEMENT #4]
A13. Global date range selector — one picker updates every chart on the page [NEW FROM RESEARCH — TABLE STAKES]
A14. Exportable white-label reports — PDF/PPT export with agency branding [NEW FROM RESEARCH — TABLE STAKES]
A15. Competitor benchmarking — track rival accounts' posting frequency and engagement [NEW FROM RESEARCH — TABLE STAKES]

### Social Analytics (Instagram + Twitter + All Platforms)
A16. All model accounts overview — all models' social accounts on one page
A17. Platform tabs — click socials tab to see Instagram, Twitter, etc.
A18. Filter by model — model > accounts > platform drill-down
A19. Weekly/monthly stats — time-period social performance metrics
A20. Top performing content — top posts and reels across models
A21. Management tracking — see what works, replicate, auto-generate similar ideas
A22. Content gen link — link high-performing posts to content gen for AI replication
A23. Content performance tagging — auto-tag R&D entries with post performance data [APPROVED ENHANCEMENT #17]

### Content Scheduler
A24. Calendar per model per account — model > account calendar view
A25. Day detail view — click a day to see stories, posts, reels scheduled
A26. Item detail view — click each item for caption, on-screen text, all metadata
A27. Daily/weekly/monthly views — three calendar zoom levels
A28. Infinite internal queue — unlimited queue that drips to Meta's 25-slot limit
A29. Auto-schedule next — automatically schedules next item when Meta slot opens
A30. Stage timestamps + SLA tracking — track time across entire pipeline [APPROVED ENHANCEMENT #16]
A31. Best-time-to-post recommendations — AI-driven optimal posting times per model/account [NEW FROM RESEARCH — TABLE STAKES]
A32. Hashtag suggestions and grouping — auto-suggest and save hashtag groups [NEW FROM RESEARCH — TABLE STAKES]
A33. Bulk/CSV import for scheduling — import 350+ posts via CSV [NEW FROM RESEARCH — TABLE STAKES]
A34. Instagram grid preview — visual feed preview before publishing [NEW FROM RESEARCH — HIGH VALUE]

### PTP Approval
A35. View submitted reels — all reels by model/niche
A36. Approved / Not Approved sections — clear status separation
A37. Approve with schedule — approve > recommended date popup > one-click schedule
A38. Reject with notification — reject > editor notified > flagged "needs tweaking"
A39. Unlimited version tracking — V1, V2, V3... until approved
A40. Partner-only approval — Shaan, Alex, Scott, Raph as approvers
A41. Batch approval mode — grid view, swipe approve/reject, "approve all" for trusted editors [APPROVED ENHANCEMENT #18]
A42. V1/V2 side-by-side comparison — visual diff for approvers [APPROVED ENHANCEMENT #10]
A43. Approval delegation — owner designates which managers can approve for which models [APPROVED ENHANCEMENT #1]
A44. Frame-accurate video annotation — click on a frame, leave timestamped comment [NEW FROM RESEARCH — TABLE STAKES]
A45. Approval SLA tracking — time-in-queue per reviewer, bottleneck alerts [NEW FROM RESEARCH — HIGH VALUE]

### Webcam Stats (Owner View)
A46. All models' streaming stats — aggregate streaming performance view
A47. Streaming shift/schedule — who's streaming when
A48. Predicted go-live times — estimated next live times per model
A49. Earnings per stream — revenue breakdown by stream session
A50. Live view — watch model's stream if currently live (CRITICAL)

### Shift Tracker
A51. Employee tracking — on time / late / absent status per employee
A52. Payroll integration — lateness = automatic pay deductions
A53. Senior alerts — seniors notified when their reports are late
A54. Shift analytics — analytics on shifts by week/month
A55. Time button — existing tracker/time button code from Shaan
A56. Shift pattern detection — auto-detect "late every Tuesday" vs separate incidents [APPROVED ENHANCEMENT #3]

### Shift Schedule
A57. Who's working when — current and upcoming schedule view
A58. Who's online now — real-time staff online/set-to-work status
A59. Employee filter — filter by individual, see their schedule, days off, everything
A60. Weekly and monthly views — two schedule zoom levels
A61. Per-employee shift history — daily/weekly/monthly/yearly history
A62. Full historical data — complete shift archive
A63. Drag-and-drop schedule builder with real-time labor cost — drag-to-assign with cost-per-shift inline [NEW FROM RESEARCH — HIGH VALUE]
A64. Shift swap workflow — employee-initiated swap > coworker accepts > manager approves [NEW FROM RESEARCH — TABLE STAKES]

### Models Roster
A65. All models view — see every model in the agency
A66. Model detail page — click model for earnings, content schedule, all analytics
A67. Model utilization rate — booked hours / available hours as capacity metric [NEW FROM RESEARCH — MEDIUM VALUE]

### Billings
A68. Billings page — revenue and billing management (details tied to Google Sheets walkthrough)

### Settings
A69. Language setting — user language preference
A70. Time zone setting — user time zone preference
A71. General settings — other settings as appropriate

---

## MARKETING MANAGER VIEW

### (Same as Owner minus financials)
MM1. Instagram Analytics — all accounts, models, weekly/monthly, top posts (mirrors A16-A23)
MM2. Content Scheduler — posting schedule management (mirrors A24-A34)
MM3. PTP — approving and viewing approved content (mirrors A35-A45)
MM4. Social Analytics — full social analytics access without financial data

---

## EDITOR DASHBOARD

### Raw Content Queue
E1. Unedited content from models — content received based on suggestions sent
E2. PTP rejection queue — content flagged "needs tweaking" from PTP rejections
E3. Editing needs view — shows what needs editing with priority

### Ideas Lab
E4. Content input and analysis — input content, analyze reel/video frame-by-frame
E5. Toggles — who it's for, niche, rough idea selectors
E6. AI idea suggestions — system suggests 5-6 ideas with best hooks, on-screen text
E7. Theme section — Western/Asian, Easter, Songkran, trending topics
E8. Gemini video analysis — AI analyzes actual video (facial expressions, on-screen text, hooks)
E9. CapCut tips baked in — CapCut tips and tricks embedded in every suggestion
E10. CapCut template library by niche — templates organized by GFE, fitness, meme, etc. [APPROVED ENHANCEMENT #11]
E11. Real-time trend intelligence feed — trending hashtags, sounds, formats from TikTok Creative Center [NEW FROM RESEARCH — HIGH VALUE]

### Search & Suggest
E12. SISO database search — search by niche/theme/category
E13. Reference reel finder — find reference reels to edit from
E14. CapCut toolkit — CapCut tips always present in search context
E15. AI suggestion bot — future AI bot for advanced suggestions
E16. Duplicate detection — fuzzy-match against existing R&D entries [APPROVED ENHANCEMENT #12]

### Finished Reels / Edited Section
E17. Upload finished reel — upload and categorize by model, niche, category
E18. AI auto-review — auto-generates recommended caption from uploaded reel
E19. On-screen text extraction — copies on-screen text from reel automatically
E20. Auto title + description — AI generates title + 1-2 sentence description
E21. Edited reels gallery — all edited reels with metadata + approval status
E22. Auto PTP submission — finished reel auto-goes to PTP section
E23. Dual storage — stored in dashboard storage (editor tracking) + Google Drive
E24. Edit time tracking — timer per edit, average times, capacity planning [APPROVED ENHANCEMENT #9]
E25. Virality/quality score — AI-driven virality score (0-99) on finished clips [NEW FROM RESEARCH — TABLE STAKES]
E26. AI caption + hook generation — 3 hook variants, recommended hashtags, virality estimate at upload [NEW FROM RESEARCH — HIGH VALUE]

### PTP Status (Editor View)
E27. All reels by model/niche — editor's view of PTP pipeline
E28. Approved vs Not Approved — per-model approval status
E29. Rejection flow — rejected > notification > back to Raw Content Queue flagged "needs tweaking"
E30. Re-edit and resubmit — re-edit > re-upload as next version > back to PTP
E31. Version correlation — unlimited V1/V2/V3... version tracking with correlation
E32. Comment-to-task conversion — reviewer comments become actionable to-do items [NEW FROM RESEARCH — TABLE STAKES]

### Semantic Search (Future Enhancement)
E33. Semantic video search — search content library by meaning, not just tags ("find all outdoor shoots with good lighting") [NEW FROM RESEARCH — MEDIUM VALUE]

---

## MODEL DASHBOARD (Mobile-First, Gamified)

### Webcam (own sidebar icon, 3 sub-pages)
M1. Home / Go Live — last week stats across all platforms, streaming schedule, Go Live button
M2. Statistics — full historical streaming performance across 17 platforms
M3. Calendar — streaming schedule (daily/weekly/monthly)
M4. Thai translation — real-time translation for Thai-speaking models (live feature)
M5. Message filtering — harsh/moderate/safe filter levels for live chat
M6. Post-stream summary — earnings summary + viewer count auto-sent to manager
M7. Stream key management — per-platform stream keys for OBS input
M8. Pre-stream checklist — gamified checklist before going live [APPROVED ENHANCEMENT subset]
M9. Best time to stream recommendation — AI-driven optimal streaming time suggestion [APPROVED ENHANCEMENT subset]
M10. Post-stream screenshot card — shareable summary card after stream ends [APPROVED ENHANCEMENT subset]
M11. Streak counter — consecutive streaming day/session tracker [APPROVED ENHANCEMENT subset]

### Social Analytics (own icon)
M12. Simplified account view — simplified view of her Instagram accounts
M13. Top three posts pinned — three best posts pinned (not one)
M14. Top reels and performance — account-level performance overview
M15. Simple "how am I doing" design — no deep analysis, just quick health check
M16. Daily "your top post today" push — daily notification of best performing post [APPROVED ENHANCEMENT subset]
M17. Week-over-week arrows — up/down trend indicators [APPROVED ENHANCEMENT subset]
M18. "Your best post ever" pinned — all-time best post permanently visible [APPROVED ENHANCEMENT subset]

### Content Requests (own icon)
M19. Inbox of briefs — briefs from marketing with video clip + instructions + tips
M20. One-tap video recording — record directly in-app from the brief
M21. Upload back — upload recorded content from same screen
M22. Auto Google Drive sync — auto-uploads to Drive labeled content name + date in her folder
M23. Deadline + auto-reminder — 24h reminder if not uploaded before deadline [APPROVED ENHANCEMENT #5]
M24. Progress tracker — "3 of 7 done" visual progress indicator [APPROVED ENHANCEMENT subset]
M25. Points multiplier for early submissions — bonus points for submitting before deadline [APPROVED ENHANCEMENT subset]

### Earnings (own icon)
M26. Combined revenue view — OnlyFans + Fans.ly revenue in one place
M27. Breakdown by platform + content type — "GFE earned X, fitness earned Y" [APPROVED ENHANCEMENT #6]
M28. Weekly comparison — "up 12%" week-over-week change [APPROVED ENHANCEMENT subset]
M29. Goal tracker — set and track earnings targets [APPROVED ENHANCEMENT subset]
M30. Payday countdown — visual countdown to next payment date [APPROVED ENHANCEMENT subset]

### Swipe Deck (own icon)
M31. Big content feed — content from content gen pipeline + agency DB in her niche
M32. Swipe right to save — save to "content to make" list, goes straight to queue, no approval needed
M33. Swipe up to make now — opens camera, auto-upload
M34. Swipe left to discard — trains the algorithm on preferences
M35. One-tap video recording — in-app recording from swipe context
M36. 10 suggestions per day minimum — keeps suggesting until she finds 10 she likes
M37. Target hit celebration — "Congratulations!" popup + points at 10
M38. Continue past target — can keep going past 10 if she wants
M39. "Trending in your niche" badge — highlight trending content [APPROVED ENHANCEMENT subset]
M40. Daily drop — 10 curated suggestions dropped daily [APPROVED ENHANCEMENT subset]
M41. Saved list with "make it now" button — saved items with quick-action button [APPROVED ENHANCEMENT subset]
M42. Points for swiping — gamification points for engaging with daily content [APPROVED ENHANCEMENT subset]
M43. Weekly themed challenges — bonus point events tied to weekly themes [APPROVED ENHANCEMENT #7]
M44. Unified "My Week" calendar — webcam + content deadlines merged in one view [APPROVED ENHANCEMENT #8]

### Gamification System (cross-section)
M45. Points for every desired action — every action the business wants = points
M46. Weekly targets — 10 reels/suggestions per week minimum, 3 submissions/day
M47. Weekly/monthly leaderboard — competitive ranking among models
M48. Monthly rewards — nails, ring light, mystery gifts for top performers
M49. Challenge mode — weekly themed challenges with bonus point events [APPROVED ENHANCEMENT subset]
M50. Push notification with send-time optimization — AI-driven optimal notification timing [NEW FROM RESEARCH — TABLE STAKES]

---

## CONTENT PIPELINE (Cross-Role, 10-Step Loop)

### Pipeline Steps
P1. Analytics identification — identify what's working on Instagram
P2. R&D Table — editors fill on Sundays + marketing + model swipe-rights (Airtable-style table view)
P3. R&D Graph View — D3 force-directed graph of content idea relationships
P4. Senior approval gate — batched Sundays, only 100% confirmed content passes
P5. Content request to model — video clip + instructions + tips sent to model
P6. Model creates content — uploads in-dashboard from phone
P7. Google Drive auto-sync — raw content labeled + dated in model's folder
P8. Editor queue — kanban/list with CapCut tips and original reference
P9. Editor edits — uploads finished reel with AI metadata (caption, text, description)
P10. PTP approval — partners approve > recommended date > one-click schedule
P11. Scheduler to Meta — calendar > drip to Meta (25-slot limit) > posted
P12. Analytics feedback loop — performance feeds back, loop closes

### Pipeline Exception Flows
P13. PTP rejection flow — rejected > notification to editor > flagged "needs tweaking" > re-edit > resubmit as next version
P14. Model swipe-right shortcut — model saves from Swipe Deck > goes direct to her queue > no approval needed

### Pipeline Enhancements
P15. Content performance to R&D feedback loop — auto-update original R&D entry with post performance metrics [APPROVED ENHANCEMENT #17]
P16. Recurring post duplicate detection — prevent same content accidentally scheduled twice across models [NEW FROM RESEARCH — LOW VALUE]

---

## ROLES & PERMISSIONS

R1. 7 role types — Owner, Partner, Marketing Manager, Editor, Model, Chatter (deferred), Developer
R2. Permissions matrix — role x route x action access control
R3. Multiple roles per user — users can hold and switch between multiple roles
R4. Act in switched views — full action capability in any view the user has role access to
R5. Owner-only role assignment — only owner can assign/create new roles
R6. Developer role — everything + system config (only owner can assign)
R7. Role dropdown on signup — auto-shows the correct view based on selected role

---

## NOTIFICATIONS

N1. Three notification channels — in-app, push to phone, Telegram
N2. High severity (makes money) — all 3 channels (content request, editing task, PTP rejection)
N3. Medium severity — in-app + push (reels to approve, model uploaded, shift starting)
N4. Low severity — in-app only (5 min late/early, general updates)
N5. Priority = revenue — editing and content gen always high priority
N6. Digest mode — non-urgent batched into daily summary, real-time reserved for critical [APPROVED ENHANCEMENT #19]

---

## SHARED COMPONENTS

S1. IssoSidebarShell — page layout wrapper for all dashboard views
S2. ContentPageShell — content area wrapper component
S3. Pill navigation — sub-route navigation pattern
S4. Consistent isso-dashboard styling — match existing dashboard patterns throughout
S5. Desktop-optimized layout — all views except Model are desktop-first
S6. Mobile-optimized Model layout — Model view is mobile-first, simple, visual, low cognitive load
S7. Role-based view switching — UI for users to switch between their assigned dashboard views
S8. Google Sheets sync status dashboard — visual indicator of Sheets sync health [APPROVED ENHANCEMENT #20]

---

## INTEGRATIONS

I1. Google Sheets — financial source of truth (revenue, payroll, costs, model cuts), will migrate to Convex/Supabase
I2. Google Drive — file storage with shared agency drive and per-model folders
I3. Google Gemini — AI video analysis, hooks, captions, suggestions (confirmed)
I4. Meta API — Instagram scheduling with 25-slot drip queue
I5. 17 webcam platforms — streaming, earnings, stats (APIs TBD, docs from Shaan)
I6. OBS — streaming tool integration via stream keys
I7. Telegram — notification delivery channel
I8. Ayrshare SDK — multi-platform social posting (managed REST API)
I9. TikTok Creative Center — real-time trend intelligence (free) [NEW FROM RESEARCH]
I10. Opus Clip — virality scoring and auto-clip extraction [NEW FROM RESEARCH]

---

## SUMMARY COUNTS

| Section | Count |
|---------|-------|
| Agency Dashboard (Owner/Partner) | A1-A71 (71) |
| Marketing Manager View | MM1-MM4 (4, mirrors owner) |
| Editor Dashboard | E1-E33 (33) |
| Model Dashboard | M1-M50 (50) |
| Content Pipeline | P1-P16 (16) |
| Roles & Permissions | R1-R7 (7) |
| Notifications | N1-N6 (6) |
| Shared Components | S1-S8 (8) |
| Integrations | I1-I10 (10) |
| **TOTAL** | **205 features** |

### Tag Breakdown
| Tag | Count |
|-----|-------|
| From Spec (core) | ~160 |
| APPROVED ENHANCEMENT | ~20 |
| NEW FROM RESEARCH — TABLE STAKES | ~12 |
| NEW FROM RESEARCH — HIGH VALUE | ~6 |
| NEW FROM RESEARCH — MEDIUM VALUE | ~2 |
| NEW FROM RESEARCH — LOW VALUE | ~1 |
