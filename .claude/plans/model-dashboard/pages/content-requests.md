---
page: Content Requests
route: /model/requests
dashboard: model
features: M19, M20, M21, M22, M23, M24, M25
status: planned
---

# Content Requests

**Title:** Content Requests

## Features
- M19-M25: Receive and fulfill content briefs

## Components

| Component | Notes |
|-----------|-------|
| `RequestInbox` | List of briefs with thumbnails |
| `BriefDetail` | Video clip + instructions + tips |
| `OneTapRecorder` | Opens camera, records, uploads (shared, mobile) |
| `DeadlineCountdown` | Timer with auto-reminder |
| `ProgressTracker` | "3 of 7 done" bar |
| `PointsMultiplier` | Bonus display for early submission |

## Data Sources
- Convex `contentRequests`
- Google Drive (upload destination)

## Actions
- View brief
- Record video via one-tap
- Upload recording
- Earn points for completion
