---
page: Webcam Stats
route: /model/webcam/stats
dashboard: model
features: M2, M10, M11
status: planned
---

# Webcam Stats (Model)

**Title:** Streaming Stats

## Features
- M2: Personal streaming stats
- M10: Post-stream summary
- M11: Streak tracking

## Components

| Component | Notes |
|-----------|-------|
| `PlatformEarningsGrid` | Earnings per platform |
| `ViewerTrendChart` | Viewer count over time |
| `PostStreamCard` | Shareable screenshot summary card |
| `StreakCounter` | Consecutive streaming days with flame icon |

## Data Sources
- Webcam platform APIs

## Actions
- View stats (read-only)
- Share post-stream summary card
