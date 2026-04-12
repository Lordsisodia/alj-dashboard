---
page: Earnings
route: /model/earnings
dashboard: model
features: M26, M27, M28, M29, M30
status: planned
---

# Earnings

**Title:** My Earnings

## Features
- M26-M30: Personal earnings tracking and breakdown

## Components

| Component | Notes |
|-----------|-------|
| `BigEarningsNumber` | Total this month, big font |
| `PlatformBreakdown` | OF vs Fans.ly pie/bar |
| `ContentTypeBreakdown` | GFE vs fitness vs meme earnings |
| `WeeklyComparison` | "Up 12%" badge |
| `GoalTracker` | Target progress bar |
| `PaydayCountdown` | Days until next payment |

## Data Sources
- Convex `earningsRecords`
- Google Sheets

## Actions
- View earnings (read-only)
