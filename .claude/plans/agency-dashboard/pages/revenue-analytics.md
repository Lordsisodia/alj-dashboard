---
page: Revenue & ROI Analytics
route: /agency/analytics
dashboard: agency
features: A5, A6, A7, A8, A9, A10, A11, A12, A13, A14, A15
status: planned
---

# Revenue & ROI Analytics

**Title:** Revenue & ROI Analytics

## Features
- A5-A15: Full revenue and ROI analytics suite

## Components

| Component | Notes |
|-----------|-------|
| `PLSummaryCard` | Profit, revenue, spending totals |
| `DepartmentBreakdownTable` | Drill department → staff member |
| `StaffROIRow` | Per-staff cost + output + ROI |
| `TrendLineChart` | Reuse FormatChart pattern — WoW/MoM trends |
| `DeclineAlert` | Flag 3+ weeks declining ROI |
| `DateRangeSelector` | Global date picker |
| `ExportButton` | PDF/PPT export |

## Data Sources
- Google Sheets (financial)
- Convex `users`, `shifts`

## Actions
- Filter by department/staff
- Export report
- Set date range

## Role Visibility
- Owner: Full access
- Manager: Hidden
- Worker: Hidden
