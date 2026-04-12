---
page: Models Roster
route: /agency/models
dashboard: agency
features: A65, A66, A67
status: planned
---

# Models Roster

**Title:** Models

## Features
- A65-A67: Model management and roster

## Components

| Component | Notes |
|-----------|-------|
| `ModelCard` | Photo, name, niches, status, utilization rate |
| `ModelDetailPage` | Earnings, next content due, all analytics |
| `AddModelDrawer` | Reuse from existing implementation |
| `UtilizationBar` | Booked hours / available hours |

## Data Sources
- Convex `models`, `earningsRecords`, `contentRequests`

## Actions
- View model detail
- Add model
- Edit model

## Role Visibility
- Owner: Full CRUD
- Manager: View + click-through
- Worker: Hidden
