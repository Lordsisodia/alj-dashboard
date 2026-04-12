---
page: Webcam Calendar
route: /model/webcam/calendar
dashboard: model
features: M3
status: planned
---

# Webcam Calendar

**Title:** Stream Schedule

## Features
- M3: View upcoming streaming schedule

## Components

| Component | Notes |
|-----------|-------|
| `CalendarGrid` | Daily/weekly/monthly — reuse shared component, mobile-optimized |
| `StreamSlot` | Scheduled stream with platform icons |

## Data Sources
- Convex `webcamSchedule`

## Actions
- View schedule (read-only)
