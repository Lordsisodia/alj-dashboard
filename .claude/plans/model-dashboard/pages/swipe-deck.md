---
page: Swipe Deck
route: /model/swipe
dashboard: model
features: M31, M32, M33, M34, M35, M36, M37, M38, M39, M40, M41, M42, M43, M44
status: planned
---

# Swipe Deck

**Title:** Daily Inspiration

## Features
- M31-M44: Tinder-style content inspiration and recording workflow

## Components

| Component | Notes |
|-----------|-------|
| `SwipeStack` | REUSE directly from hub-swipe — portable |
| `OneTapRecorder` | Reuse from requests |
| `DailyTargetPopup` | "Congrats! 10/10 done" celebration |
| `TrendingBadge` | "Trending in your niche" indicator |
| `SavedList` | Saved items with "make it now" button |
| `PointsDisplay` | Gamification points for swiping |
| `WeeklyChallengeCard` | Themed weekly challenge |
| `SwipeAuditLog` | REUSE from hub-swipe |

## Data Sources
- Convex content pipeline + agency DB
- Convex `swipeDeckItems`

## Actions
- Swipe right (save) / up (record now) / left (skip)
- Record content directly
- View saved list
