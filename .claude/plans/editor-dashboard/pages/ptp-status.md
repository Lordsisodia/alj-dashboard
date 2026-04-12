---
page: PTP Status
route: /editor/ptp
dashboard: editor
features: E27, E28, E29, E30, E31, E32
status: planned
---

# PTP Status

**Title:** PTP Status

## Features
- E27-E32: Track approval status of submitted reels

## Components

| Component | Notes |
|-----------|-------|
| `ReelStatusTable` | All submitted reels with approval status |
| `ModelNicheFilter` | Shared |
| `ApprovedSection` / `RejectedSection` | Split view |
| `RejectionDetail` | Reason + comment-to-task conversion |
| `VersionTimeline` | V1 → V2 → V3 correlation display |

## Data Sources
- Convex `reels`, `approvals`

## Actions
- View approval status
- Re-edit rejected items
- View version history
