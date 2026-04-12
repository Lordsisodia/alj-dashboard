---
page: Dashboard Home
route: /agency
dashboard: agency
features: A1, A2, A3, A4
status: planned
---

# Dashboard Home

**Title:** Agency Dashboard

## Features
- A1: KPI cards
- A2: Who's online
- A3: Section summaries
- A4: Simple design

## Components

| Component | Notes |
|-----------|-------|
| `KPIDeltaTile` | Reuse from intelligence — revenue, model count, staff on shift |
| `StaffOnlineStrip` | Photos + online/offline dots |
| `SectionSummaryCards` | Mini card per section (revenue, content, team) |
| `QuickActionBar` | Links to most-used pages |

## Data Sources
- Google Sheets (revenue)
- Convex `models`, `shifts`, `users`

## Actions
- Navigate to sub-pages
