---
page: Raw Content Queue
route: /editor
dashboard: editor
features: E1, E2, E3
status: planned
---

# Raw Content Queue

**Title:** Content Queue

## Features
- E1: Unedited content inbox
- E2: PTP rejections re-queue
- E3: Priority view

## Components

| Component | Notes |
|-----------|-------|
| `KanbanBoard` | Use dnd-kit — columns: New / In Progress / Done |
| `ContentCard` | Thumbnail + model + niche + "needs tweaking" flag |
| `PriorityBadge` | High/medium/low |
| `ModelFilter` | Shared |

## Data Sources
- Convex `contentRequests`
- Convex `reels` (rejected items)

## Actions
- Claim item
- Start editing
- Filter by model/priority
