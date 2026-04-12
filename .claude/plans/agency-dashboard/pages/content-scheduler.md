---
page: Content Scheduler
route: /agency/schedule
dashboard: agency
features: A24, A25, A26, A27, A28, A29, A30, A31, A32, A33, A34
status: planned
---

# Content Scheduler

**Title:** Content Scheduler

## Features
- A24-A34: Full content scheduling suite

## Components

| Component | Notes |
|-----------|-------|
| `ModelSelector` | Shared |
| `AccountSelector` | Per-model account picker |
| `CalendarGrid` | Daily/weekly/monthly view (use FullCalendar or custom) |
| `DayDetailPanel` | Stories/posts/reels for selected day |
| `ItemDetailDrawer` | Caption, on-screen text, metadata per item |
| `MetaDripIndicator` | 25-slot queue status |
| `BestTimeRecommendation` | AI optimal posting time |
| `GridPreview` | Instagram feed preview |
| `BulkImportModal` | CSV import |

## Data Sources
- Convex `schedule`, `approvals`
- Meta API

## Actions
- Schedule posts
- Reschedule via drag
- Bulk import via CSV
- View queue status

## Role Visibility
- Owner: Full
- Manager: Full
- Worker: View only
