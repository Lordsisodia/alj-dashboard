---
page: Settings
route: /agency/settings
dashboard: agency
features: A69, A70, A71
status: planned
---

# Settings

**Title:** Settings

## Features
- A69-A71: Agency-wide settings

## Components

| Component | Notes |
|-----------|-------|
| `LanguageSelector` | Language preference |
| `TimezoneSelector` | Timezone preference |
| `RoleManager` | Owner-only role assignment |
| `SheetsSync` | Google Sheets sync status indicator (S8) |

## Data Sources
- Convex `settings`, `users`

## Actions
- Update preferences
- Manage roles (owner only)
- Check sync status

## Role Visibility
- Owner: All settings
- Manager: Profile only
- Worker: Profile only
