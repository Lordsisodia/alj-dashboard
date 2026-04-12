---
page: My Week
route: /model/week
dashboard: model
features: M44
status: planned
---

# My Week

**Title:** My Week

## Features
- M44: Unified weekly view of all commitments

## Components

| Component | Notes |
|-----------|-------|
| `UnifiedCalendar` | Webcam schedule + content deadlines merged |
| `DeadlineCard` | Content request deadlines |
| `StreamSlot` | Scheduled streams |

## Data Sources
- Convex `webcamSchedule`
- Convex `contentRequests`

## Actions
- View combined schedule (read-only)
