---
page: Go Live
route: /model/webcam
dashboard: model
features: M1, M4, M5, M6, M7, M8, M9
status: planned
---

# Webcam — Go Live

**Title:** Webcam

## Features
- M1: Home / go live screen
- M4-M9: Pre-stream tools and recommendations

## Components

| Component | Notes |
|-----------|-------|
| `LastWeekStatsStrip` | Earnings + viewers across platforms |
| `StreamScheduleCard` | Next scheduled stream |
| `GoLiveButton` | Big gradient CTA |
| `PreStreamChecklist` | Gamified checklist (lighting, camera, audio) |
| `BestTimeRecommendation` | AI optimal streaming time |
| `StreamKeyManager` | Per-platform key input |

## Data Sources
- 17 webcam platform APIs
- Convex `webcamSessions`

## Actions
- Go live
- Complete pre-stream checklist
- View upcoming schedule
