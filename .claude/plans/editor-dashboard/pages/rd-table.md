---
page: R&D Table
route: /editor/rd-table
dashboard: editor
features: P2, P3, P4
status: planned
---

# R&D Table

**Title:** R&D Content Pipeline

## Features
- P2: Table view
- P3: Graph view
- P4: Approval gate

## Components

| Component | Notes |
|-----------|-------|
| `AirtableGrid` | Table view with custom field types (use TanStack Table) |
| `GraphView` | D3 force-directed graph of content relationships |
| `ViewToggle` | Table / graph toggle |
| `ApprovalStatusColumn` | Pending/approved/rejected |
| `SundayBatchIndicator` | Batch approval scheduled on Sundays |

## Data Sources
- Convex `rdEntries`

## Actions
- Add entries
- Filter entries
- Approve entries (senior only)
- Switch between table and graph views

## Notes
- Sunday batch approval is a scheduled workflow
- Graph view requires D3 force-directed layout
