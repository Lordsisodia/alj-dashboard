---
page: Shift Schedule
route: /agency/schedule-shifts
dashboard: agency
features: A57, A58, A59, A60, A61, A62, A63, A64
status: planned
---

# Shift Schedule

**Title:** Shift Schedule

## Features
- A57-A64: Shift scheduling and management

## Components

| Component | Notes |
|-----------|-------|
| `ScheduleCalendar` | Weekly/monthly view with employee rows |
| `EmployeeFilter` | Filter by individual |
| `DayOffIndicator` | Visual day-off markers |
| `DragDropAssigner` | Drag to assign shifts with cost display |
| `ShiftSwapModal` | Employee request → coworker accept → manager approve |
| `HistoryDrawer` | Per-employee shift history |

## Data Sources
- Convex `shiftSchedule`, `users`

## Actions
- Assign shifts via drag
- Approve shift swaps
- Filter by employee
- View shift history

## Role Visibility
- Owner: All employees
- Manager: Own department
- Worker: Own schedule
