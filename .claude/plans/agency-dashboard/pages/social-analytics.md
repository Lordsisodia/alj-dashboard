---
page: Social Analytics
route: /agency/social
dashboard: agency
features: A16, A17, A18, A19, A20, A21, A22, A23
status: planned
---

# Social Analytics

**Title:** Social Analytics

## Features
- A16-A23: Agency-wide social media analytics

## Components

| Component | Notes |
|-----------|-------|
| `ModelSelector` | Shared — filter by model |
| `PlatformTabs` | Shared — Instagram, Twitter, etc. |
| `AccountStatsGrid` | Per-account follower/engagement cards |
| `TopPostsStrip` | Horizontal scroll of top posts (reuse OutlierRow pattern) |
| `WeeklyMonthlyToggle` | Time period selector |
| `PerformanceTagBadge` | Auto-tagged content performance |

## Data Sources
- Instagram API
- Twitter API
- Convex `scrapedPosts`, `postAnalyses`

## Actions
- Filter by model/platform/period
- Tag content
- Link to content gen

## Role Visibility
- Owner: Full
- Manager: Full
- Worker: Own accounts only
