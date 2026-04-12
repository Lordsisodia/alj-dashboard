---
page: Search & Suggest
route: /editor/search
dashboard: editor
features: E12, E13, E14, E15, E16
status: planned
---

# Search & Suggest

**Title:** Search & Suggest

## Features
- E12-E16: Search the content database for inspiration

## Components

| Component | Notes |
|-----------|-------|
| `SearchBar` | Keyword search against SISO database |
| `NicheThemeFilter` | Niche + theme + category filters |
| `ReelGrid` | Results grid with thumbnails |
| `CapCutToolkit` | Always-present tips panel |
| `DuplicateWarning` | Fuzzy-match alert for existing R&D entries |

## Data Sources
- Convex `scrapedPosts` (search index)

## Actions
- Search by keyword
- Filter by niche/theme/category
- Save to R&D
- Flag duplicates
