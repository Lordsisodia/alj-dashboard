---
page: Shift Tracker
route: /agency/shifts
dashboard: agency
features: A51, A52, A53, A54, A55, A56
status: planned
---

# Shift Tracker

**Title:** Shift Tracker

## Features
- A51-A56: Staff attendance and lateness tracking

## Components

| Component | Notes |
|-----------|-------|
| `EmployeeStatusGrid` | On time / late / absent per person |
| `TimeButton` | Shaan's existing clock-in/out code |
| `PayrollDeductionBadge` | Deduction calculated from lateness |
| `SeniorAlertBanner` | Alert when report is late |
| `ShiftAnalyticsChart` | Weekly/monthly lateness trends |
| `PatternDetectionCard` | "Late every Tuesday" auto-detection |

## Data Sources
- Convex `shifts`, `users`
- Google Sheets (payroll rules)

## Actions
- Clock in/out
- View deductions
- Acknowledge alerts

## Role Visibility
- Owner: All employees
- Manager: Own department
- Worker: Own shifts
