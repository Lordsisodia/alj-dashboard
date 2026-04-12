# System Overview — ISSO Dashboard

*Generated from PAGE_COMPONENT_PLAN.md · 2026-04-13*

---

## Four Dashboards

### 1. Content-Gen Dashboard (`/hub`) — Already Built
The existing dashboard used by internal content generation staff. Includes the swipe deck, AI analysis pipeline (hub-swipe), community features, leaderboard, and intelligence/analytics pages. Acts as the upstream content engine that feeds the Editor and Agency dashboards.

### 2. Agency Dashboard (`/agency`)
The owner and manager view. Covers P&L, team management, model roster, billing, and the full content approval chain (PTP). Split into 4 sidebar icons: Overview (revenue/billings), Content (social, scheduler, PTP), Team (shifts, schedule, models), and Webcam (owner-only live stream stats).

### 3. Editor Dashboard (`/editor`)
The content production workspace for editors. Receives raw content from models, generates AI-assisted metadata via Gemini, submits finished reels through the PTP approval chain, and maintains the R&D idea pipeline. Sidebar: Content, Ideas, R&D.

### 4. Model Dashboard (`/model`) — Mobile-First
The model's personal app. Go-live for webcam, social analytics, content request inbox (with one-tap recorder), earnings tracking, swipe deck for inspiration, and a gamification layer across all pages. Uses a bottom tab bar instead of a sidebar.

---

## How They Connect

```
Content-Gen Hub (already built)
    │
    ├─► Editor Dashboard
    │       Raw content requests flow to editor queue
    │       Finished reels → PTP chain → approved to scheduler
    │
    ├─► Model Dashboard
    │       Content requests sent to model inbox
    │       Model recordings → Google Drive → editor queue
    │       Swipe deck pulls from hub content pipeline
    │
    └─► Agency Dashboard
            PTP final approval gate (owner/manager)
            Social scheduler publishes approved reels
            Revenue & ROI reads financial records
            Shift tracker covers all staff including editors
```

---

## Data Flows

| Flow | Source | Destination | Transport |
|------|--------|-------------|-----------|
| Content briefs | Agency/Editor creates `contentRequests` | Model inbox | Convex real-time |
| Model recordings | Model one-tap recorder → Google Drive | Editor raw queue | Drive + Convex URL |
| Finished reels | Editor uploads + AI review | PTP approval queue | Convex `reels` |
| PTP decisions | Agency approve/reject | Editor PTP status, Scheduler | Convex `approvals` |
| Scheduled posts | Agency Content Scheduler | Meta API / Ayrshare | API call on schedule |
| Social stats | Instagram API, Twitter API | Agency Social Analytics, Model Social | Scraped → `scrapedPosts` |
| Webcam earnings | 17 platform APIs | Model Earnings, Agency Webcam Stats | `webcamSessions` |
| Payroll/revenue | Google Sheets | Agency Revenue & ROI, Shift Tracker | Sheets sync |
| Notifications | Any event trigger | All dashboards | Convex `notifications` + Telegram |
| Gamification | Model actions (swipe, record, check-in) | Model all pages | `gamificationEvents` |

---

## Shared Infrastructure

- **Layout shells:** `IssoSidebarShell` + `ContentPageShell` across all dashboards
- **Shared components:** `ModelSelector`, `CalendarGrid`, `NicheFilter`, `KPIDeltaTile`, `OneTapRecorder`, `PointsDisplay` (see `shared/COMPONENTS.md`)
- **Database:** Convex (real-time) + Google Sheets (financial) + Google Drive (media)
- **Notifications:** In-app (`notifications` table) + Telegram bot for high-severity alerts
