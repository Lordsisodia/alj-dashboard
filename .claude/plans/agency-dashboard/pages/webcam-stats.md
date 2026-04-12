---
page: Webcam Stats
route: /agency/webcam
dashboard: agency
features: A46, A47, A48, A49, A50
status: planned
---

# Webcam Stats (Agency)

**Title:** Webcam Statistics

## Features
- A46-A50: Agency-level webcam monitoring

## Components

| Component | Notes |
|-----------|-------|
| `ModelSelector` | Shared |
| `StreamingScheduleStrip` | Who's streaming when |
| `PredictedGoLiveCard` | Next estimated live times |
| `EarningsPerStreamTable` | Revenue by session |
| `LiveStreamEmbed` | Watch model's current stream (CRITICAL) |

## Data Sources
- 17 webcam platform APIs (TBD)
- Convex `webcamSessions`

## Actions
- Watch live stream
- View stats
- Filter by model

## Role Visibility
- Owner: Full + live view
- Manager: Hidden
- Worker: Hidden

## Notes
- Owner-only icon in sidebar
- Live stream embed is a critical must-have feature
