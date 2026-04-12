# Agency Dashboard — Full Product Spec v2

*Source: Verbal spec session 2026-04-12 with Alex (owner) + Shaan (partner, marketing lead)*
*Verbatim transcript: `memory/conversations/2026-04-12.md` (4,675 words)*

---

## 1. PRODUCT OVERVIEW

Multi-role agency SaaS dashboard for an OFM (OnlyFans Management) agency.
Marketing-focused build first. Chatter side deferred (releasing in a few months).

**Responsive web app** (not native). Model view = mobile-optimized. All other views = desktop-optimized.

### Product Architecture (5 Dashboards)
This is NOT one monolithic app — it's 5 distinct top-level dashboards:
1. **Agency Dashboard** (owner/partner view — this spec)
2. **Content Gen Dashboard** (content creation pipeline — separate product)
3. **Model Dashboard** (model-facing mobile view)
4. **Chat Dashboard** (chatter-facing — deferred)
5. *(5th TBD)*

Data is intertwined between dashboards (e.g., content gen pipeline feeds agency R&D table).

### Current Team Composition
| Role | Count | Specifics |
|------|-------|-----------|
| Chatters | 4-5 | OnlyFans/Fans.ly DM management |
| IG Editors/Managers | 2 | Post and manage Instagram accounts |
| OF Editor | 1 | Edits OnlyFans-specific content only |
| Chat Manager | 1 | Manages chatters |
| Admin Manager | 1 | General admin/office management |
| Twitter/Admin Manager | 1 | Twitter management + general admin |
| Partners | 4 | Raph (owner), Shaan (marketing), Alex, Scott (processes) |

### Roles (7 total)
| Role | Access | Notes |
|------|--------|-------|
| **Owner** | Everything | Raph = owner |
| **Partner** | Everything (can approve PTP) | Shaan (marketing), Alex, Scott (processes) |
| **Marketing Manager** | Same as owner minus financials | Analytics, schedule, PTP |
| **Editor** | Content production pipeline only | 5 sections defined |
| **Model** | Their own content/earnings/webcam | Mobile-first, gamified |
| **Chatter** | DEFERRED | Shift, earnings, DMs — built later |
| **General Admin** | DEFERRED | Office management, basic tasks |
| **Developer** | Everything + system config | People who built the app |

### Role Mechanics
- Permissions matrix (role x route x action)
- Users can hold multiple roles and switch between views
- Can ACT in views they switch to, IF those roles are designated to them
- Only owner can assign/create new roles (and developer role)
- On signup: role dropdown → auto-shows their view

---

## 2. PUBLIC LANDING PAGE (deferred build)

- Agency showcase: stats, achievements, model count, revenue
- Appeals to models, chatters, admin/staff
- "Join Sales" + "Join Marketing" CTAs → onboarding forms → book a call
- Models section too ("join us" for models)
- "Dashboard" button top-right → login → dashboard
- All applicant data flows into recruitment review page

---

## 3. OWNER'S VIEW

### 3.1 Dashboard Home
- Quick KPIs: revenue summary, model roster count, staff on shift
- Who's online — staff photos with online/offline status
- Quick summary from each section
- **Design: simple, not overwhelming. "View the agency from afar."**

### 3.2 Revenue & ROI Analytics
- Full P&L: profit, revenue, spending
- Breakdown by department → by staff member
- How much each member costs, what they're doing
- ROI per staff member, per service, per subscription
- CEO manually fills some data
- Source: Google Sheets (mock for now, migrate to Convex/Supabase later)
- **Enhancement: week-over-week + month-over-month trend lines. Flag declining ROI for 3+ weeks.**

### 3.3 Social Analytics (Instagram + Twitter + All Platforms)
- All model accounts in one page view — **NOT just Instagram, includes Twitter and all socials the agency manages**
- Click socials tab → see Instagram, Twitter, etc.
- Filter by model → model accounts → platform
- Weekly/monthly stats
- Top performing posts, reels
- Use as management tracking: see what works → replicate → auto-generate similar ideas
- Link to content gen if post performed well → auto-replicate with AI
- **Enhancement: content performance tagging — auto-tag R&D entries with post performance data**

### 3.4 Content Scheduler
- Calendar per model → per account
- Click a day → see stories, posts, reels scheduled
- Click each item → caption, on-screen text, everything needed
- Daily/weekly/monthly views
- Infinite internal queue → drip to Meta (25-slot limit per account)
- Automatically schedules next item when slot opens
- **Research Later.com and competitors for UI/flow/technical approach**
- **Enhancement: stage timestamps + SLA tracking across entire pipeline**

### 3.5 PTP Approval
- View all submitted reels by model/niche
- Approved / Not Approved sections
- Approve → recommended schedule date popup → one-click schedule
- Reject → notification to editor → flagged "needs tweaking"
- Unlimited version tracking (V1, V2, V3... until approved)
- Approvers: Shaan, Alex, Scott, Raph (partners only)
- **Enhancement: batch approval mode — grid view, swipe approve/reject, "approve all" for trusted editors**
- **Enhancement: V1/V2 side-by-side comparison for approver**
- **Enhancement: approval delegation — owner designates which managers can approve for which models**

### 3.6 Webcam Stats (Owner's perspective)
- All models' streaming stats
- Streaming shift/schedule
- Predicted go-live times
- Earnings per stream
- **LIVE VIEW: watch model's stream if she's currently live — VERY IMPORTANT**
- Webcam done on laptop, not mobile

### 3.7 Shift Tracker
- All employees tracked (on time / late / absent)
- Payroll integration: lateness = pay deductions
- Seniors alerted when their reports are late
- Analytics on shifts by week/month
- Shaan has existing tracker/time button code to provide
- **Enhancement: shift pattern detection — auto-detect "late every Tuesday" vs 4 separate incidents**

### 3.8 Shift Schedule
- Who's working when
- Who's online right now, who's set to work today
- Filter by individual employee → see their schedule, days off, everything
- Weekly view, monthly view
- Per-employee shift history (daily/weekly/monthly/yearly)
- Full historical data

### 3.9 Models Roster
- View all models in the agency
- Click a model → see: their earnings, when they're next due to make content, all analytics we have on the model
- Model detail page with everything about that model

### 3.10 Billings (details TBD — tied to Google Sheets)

### 3.11 Recruitment (deferred)

### 3.12 Settings
- Language, time zone, whatever makes sense — figure it out

---

## 4. MARKETING MANAGER VIEW

- Instagram Analytics (same as owner — all accounts, models, weekly/monthly, top posts, everything)
- Content Scheduler / posting schedule
- PTP (approving, viewing what's been approved)
- Same as owner minus financials

---

## 5. EDITOR VIEW

### 5.1 Raw Content Queue
- Unedited content from models (based on suggestions sent)
- Content flagged "needs tweaking" (PTP rejections)
- Shows what needs editing

### 5.2 Ideas Lab
- Input content, analyze reel/video frame-by-frame
- Toggles: who it's for, niche, rough idea
- System suggests 5-6 ideas: best hooks, on-screen text
- Theme section: Western/Asian, Easter, Songkran, trending topics
- **AI: Google Gemini — must analyze actual video (facial expressions, on-screen text, hooks, everything)**
- CapCut tips & tricks baked into EVERY suggestion
- **Enhancement: CapCut template library by niche (GFE, fitness, meme)**

### 5.3 Search & Suggest
- Search SISO database by niche/theme/category
- Find reference reels to edit from
- Toolkit: CapCut tips always present
- Future: AI bot for advanced suggestions
- **Enhancement: duplicate detection — fuzzy-match against existing R&D entries**

### 5.4 Finished Reels / Edited Section
- Upload finished reel → categorize: model, niche, category
- AI auto-reviews uploaded reel:
  - Auto-generates recommended caption
  - Copies on-screen text from reel
  - Title + 1-2 sentence description
- Shows all edited reels with metadata + approval status
- Auto-goes to PTP section
- Stored in dashboard storage (track what each editor produced) + Google Drive
- **Enhancement: edit time tracking — timer per edit, average times, capacity planning**

### 5.5 PTP Status (Editor's perspective)
- All reels by model/niche
- Approved vs Not Approved per model
- Rejected → notification → back to Raw Content Queue flagged "needs tweaking"
- Re-edit → re-upload as next version → back to PTP
- Unlimited version tracking with V1/V2/V3... correlation

**Editor Flow:** Raw Content → Ideas/Search → Edit → Upload (AI metadata) → PTP → Approved → Schedule. Rejected → notification → re-edit → resubmit.

---

## 6. MODEL VIEW (Mobile-First, Gamified)

**Design philosophy:** Mobile-optimized FIRST. Simple, visual, low cognitive load. "Treat them like 5-year-olds." Every interaction = points. Desktop = nice to have.

### 6.1 WEBCAM (own sidebar icon, 3 sub-pages)
- **Home / Go Live:** last week stats across all platforms, streaming schedule, Go Live button
- **Statistics:** full historical streaming performance across 17 platforms
- **Calendar:** streaming schedule (daily/weekly/monthly)
- **Live features:** Thai translation (must work — she's Thai, can't speak English), message filtering (harsh/moderate/safe)
- **Post-stream:** earnings summary, viewer count → auto-sent to manager
- Stream keys from each platform → model inputs into OBS
- Targeting adult streaming sites: Chatterbay + Asian platforms with Western/UK fanbase
- Webcam documentation to be provided by Shaan separately
- **Enhancement: pre-stream checklist (gamified), "best time to stream" recommendation, post-stream screenshot card, streak counter**

### 6.2 SOCIAL ANALYTICS (own icon)
- Simplified view of her Instagram accounts
- Top THREE posts pinned (not one)
- Top reels, account performance
- No deep analysis — just "how am I doing"
- Same data as owner view but simplified
- **Enhancement: daily "your top post today" push, week-over-week arrows (up/down), "your best post ever" pinned**

### 6.3 CONTENT REQUESTS (own icon)
- Inbox of briefs from marketing (video clip + instructions + tips)
- One-tap video recording directly in-app
- She makes content, uploads back
- Auto-goes to Google Drive (labeled: content name + date, in her folder)
- **Enhancement: deadline + auto-reminder (24h before if not uploaded), progress tracker ("3 of 7 done"), points multiplier for early submissions**

### 6.4 EARNINGS (own icon)
- Revenue from OnlyFans + Fans.ly (combined)
- **Enhancement: breakdown by platform + content type ("GFE earned X, fitness earned Y"), weekly comparison ("up 12%"), goal tracker, payday countdown**

### 6.5 SWIPE DECK (own icon)
- Big feed of content in her niche (from content gen pipeline + agency DB)
- **Swipe right** → save to "content to make" list. Goes straight to her queue. NO approval needed (only VA swipes need approval)
- **Swipe up** → make it now, opens camera, auto-upload
- **Swipe left** → discard, trains the algorithm
- One-tap video recording added here too
- 10 new reel suggestions per day minimum target
- Keeps suggesting until she finds 10 she likes
- Hit 10 → "Congratulations, you've hit your target for today!" popup + points
- Can keep going past 10 if she wants
- **Enhancement: "trending in your niche" badge, daily drop (10 curated), saved list with "make it now" button, points for swiping through daily content, weekly themed challenges with bonus points**

### GAMIFICATION SYSTEM (cross-section)
- Every action the business wants models to do = points
- Targets: 10 reels/suggestions per week minimum, 3 submissions/day
- Weekly/monthly leaderboard
- Monthly rewards: nails, ring light, mystery gifts for top performers
- Full gamification details TBD — Shaan will discuss best point/tracking/metrics system later
- **Enhancement: challenge mode — weekly themed challenges, bonus point events**

---

## 7. FULL CONTENT PIPELINE (8-step loop)

```
1. ANALYTICS → identify what's working on Instagram
      ↓
2. R&D TABLE → editors fill on Sundays + marketing + model swipe-rights
   (Airtable-style table view + Graph View, only 100% confirmed content, no faff)
      ↓ (senior approval — batched Sundays)
3. CONTENT REQUEST → sent to model (video clip + instructions + tips)
      ↓
4. MODEL MAKES IT → uploads in-dashboard from phone
      ↓ (auto)
5. GOOGLE DRIVE → raw content, labeled + dated, model's folder
      ↓ (notification to editor)
6. EDITOR QUEUE → kanban/list, CapCut tips, original reference
      ↓
7. EDITOR EDITS → uploads finished reel (AI: caption, text, description)
      ↓
8. PTP → partners approve → recommended date → one-click schedule
      ↓
9. SCHEDULER → calendar → drip to Meta (25-slot limit) → posted
      ↓
10. ANALYTICS → performance feeds back → loop closes
```

**Exception flow:** PTP rejected → notification to editor → flagged "needs tweaking" → re-edit → resubmit as next version → PTP again.

**Model swipe-right shortcut:** model saves from Swipe Deck → goes direct to her "needs to make" queue → no approval needed.

---

## 8. INTEGRATIONS

| System | Role | Status |
|--------|------|--------|
| **Google Sheets** | Financial source of truth (revenue, payroll, costs, model cuts) | Current, will migrate to Convex/Supabase |
| **Google Drive** | File storage (shared agency drive, per-model folders) | Folder structure walkthrough pending |
| **Google Gemini** | AI for video analysis, hooks, captions, suggestions | Confirmed |
| **Meta API** | Instagram scheduling (25-slot drip queue) | Need cheap/reliable approach |
| **17 webcam platforms** | Streaming, earnings, stats | APIs TBD, docs coming from Shaan |
| **OBS** | Streaming tool (model inputs stream keys) | Integration via stream keys |

### Being Replaced
- Content Snare → content request system
- Instrac → replaced by dashboard tooling
- Inflow → deferred (no API, chatter metrics)
- Airtable → R&D table in dashboard

---

## 9. NOTIFICATIONS

3 channels: in-app, push to phone, Telegram.

| Severity | Channel | Examples |
|----------|---------|----------|
| **High** (makes money) | All 3 (in-app + push + Telegram) | Content request to model, editing task ready, PTP rejection |
| **Medium** | In-app + push | New reels to approve, model uploaded content, shift starting |
| **Low** | In-app only | 5 min late/early, general updates |

Priority = whatever makes money. Editing and content gen = high priority.
**Enhancement: digest mode — non-urgent batched into daily summary, real-time reserved for critical items.**

---

## 10. APPROVED FEATURE ENHANCEMENTS (all 20)

### Owner
1. Approval delegation (designate managers per model)
2. Department P&L trend lines (week/month, flag 3+ weeks declining)
3. Shift pattern detection (auto-detect recurring lateness)
4. Model earnings projection (actual vs projected)

### Model
5. Content request deadlines + auto-reminders (24h before)
6. Earnings breakdown by platform + content type
7. Swipe Deck weekly challenges with bonus points
8. Unified "My Week" calendar (webcam + content deadlines merged)

### Editor
9. Edit time tracking (timer per edit, capacity planning)
10. V1/V2 side-by-side comparison for approver
11. CapCut template library by niche
12. Duplicate detection in R&D table

### Chatter (deferred)
13. Model quick-reference cards
14. Revenue per conversation metric
15. Canned response library + AI suggestions

### Pipeline (cross-role)
16. Stage timestamps + SLA tracking
17. Content performance tagging (analytics → R&D loop)
18. Batch PTP approval mode

### Notifications
19. Digest mode for non-urgent notifications

### Integrations
20. Google Sheets sync status dashboard

---

## 11. WHAT'S STILL PENDING (from Shaan)

| Item | Status |
|------|--------|
| Webcam documentation (platforms, APIs, OBS, stream keys) | Shaan providing |
| Google Sheets access + schema walkthrough | Shaan providing later |
| Google Drive folder structure | Shaan providing later |
| Shift tracker code (existing time button) | Shaan providing |
| Gamification point values + reward tiers | To discuss |
| Models roster page details | TBD |
| Billings page details | Tied to Sheets walkthrough |
| Recruitment page | Deferred |
| Onboarding forms | Deferred (separate thing) |
| Chatter view | Deferred (months away) |
| General Admin view | Deferred |

---

## 12. CURRENT MODELS

| Name | Status |
|------|--------|
| Ella | Active |
| Amam | Active |
| Ren | Active |
| Tyler | Active |
| Kiroko | Testing content |

Each model has multiple niches (fitness, GFE, meme, etc.) and multiple Instagram accounts.

---

## 13. KEY PEOPLE

| Name | Role |
|------|------|
| Raph | Owner |
| Alex | Partner |
| Shaan | Partner, marketing department lead |
| Scott | Partner, processes |

All four = PTP approval authority.
