---
page: Gamification Overlay
route: all /model/* pages
dashboard: model
features: M45, M46, M47, M48, M49, M50
status: planned
---

# Gamification Overlay

**Title:** Gamification System (persistent overlay)

## Features
- M45-M50: Points, streaks, leaderboard, and rewards across all model pages

## Components

| Component | Notes |
|-----------|-------|
| `PointsCounter` | Persistent points display (header or floating) |
| `LeaderboardWidget` | Reuse LeaderboardSidebar from community |
| `StreakIndicator` | Consecutive day streak |
| `DailyCheckInButton` | Tap to check in, earn points |
| `LevelProgressBar` | Current level + XP to next |
| `RewardPreview` | Monthly prize preview |
| `CelebrationModal` | Confetti + congratulations (Duolingo-style) |

## Data Sources
- Convex `gamificationEvents`

## Actions
- Daily check-in
- View leaderboard
- View rewards

## Notes
- This overlay renders on ALL model dashboard pages
- Not a standalone route — injected via layout wrapper
