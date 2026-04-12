# Data Entities — New Convex Tables

*All tables below are net-new additions to the Convex schema. Existing tables (models, users, etc.) are not listed.*

---

## New Tables

| Entity | Used By | Key Fields |
|--------|---------|------------|
| `rdEntries` | Editor R&D Table, Pipeline | `modelId`, `niche`, `theme`, `description`, `referenceUrl`, `status`, `approvedBy` |
| `contentRequests` | Model Requests, Editor Queue | `modelId`, `briefVideoUrl`, `instructions`, `deadline`, `status`, `uploadUrl` |
| `reels` | Editor Finished, PTP, Scheduler | `modelId`, `editorId`, `niche`, `title`, `captionAI`, `version`, `ptpStatus`, `mediaUrl` |
| `shiftRecords` | Agency Shifts | `userId`, `scheduledStart`, `actualStart`, `latenessMinutes`, `deduction` |
| `shiftSchedules` | Agency Schedule | `userId`, `date`, `startTime`, `endTime`, `isDayOff` |
| `webcamSessions` | Model Webcam, Agency Webcam | `modelId`, `platform`, `startedAt`, `earnings`, `viewerCount` |
| `gamificationEvents` | Model Gamification | `modelId`, `action`, `points`, `createdAt` |
| `notifications` | All dashboards | `recipientId`, `type`, `severity`, `channel`, `title`, `body`, `isRead` |
| `financialRecords` | Agency Revenue | `category`, `department`, `staffUserId`, `amount`, `source` |
| `swipeDeckItems` | Model Swipe Deck | `modelId`, `contentUrl`, `niche`, `action`, `savedAt` |

---

## Schema Design Notes

- **`reels.version`** — integer (1, 2, 3) tracking V1/V2/V3 edit history
- **`reels.ptpStatus`** — enum: `pending` | `approved` | `rejected`
- **`notifications.severity`** — enum: `low` | `medium` | `high` — high severity also triggers Telegram
- **`notifications.channel`** — enum: `in_app` | `telegram` | `both`
- **`shiftRecords`** — `deduction` is calculated server-side from payroll rules in Google Sheets
- **`gamificationEvents.action`** — enum: `swipe` | `record` | `checkin` | `deadline_early` | `streak`
- **`webcamSchedule`** — separate from `webcamSessions` (schedule = planned, sessions = completed)

---

## Tables Referenced But Already Existing

- `models` — model roster
- `users` — all staff/users
- `shifts` — existing shift records (check overlap with `shiftRecords`)
- `scrapedPosts` — social media scraped content
- `postAnalyses` — AI analysis of posts
- `approvals` — PTP approval decisions
- `toolAnalyses` — AI tool outputs
- `earningsRecords` — model earnings
- `settings` — app settings
