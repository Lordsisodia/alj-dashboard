# Shared Components

*Components used across 2+ dashboards. Always prefer reuse over rebuild.*

---

## Layout Shells (Every Page)

| Component | Location | Used By |
|-----------|----------|---------|
| `IssoSidebarShell` | `@/shared/layout/isso-sidebar/` | Every dashboard |
| `ContentPageShell` | `@/isso/layout/ContentPageShell` | Every page |

---

## Shared UI Components

| Component | Used In | Source / Notes |
|-----------|---------|----------------|
| `ModelSelector` | Agency (6 pages), Editor (4 pages) | New (shared) |
| `NicheFilter` | Agency PTP, Editor Ideas/Search/Finished, Swipe Deck | New (shared) |
| `CalendarGrid` | Agency Scheduler, Agency Shift Schedule, Model Webcam Calendar, Model My Week | New (shared, mobile-responsive) |
| `KPIDeltaTile` | Agency Home, Agency Revenue, Model Earnings | Reuse from intelligence |
| `SwipeStack` | Model Swipe Deck | Reuse from hub-swipe — directly portable |
| `SwipeAuditLog` | Model Swipe Deck | Reuse from hub-swipe |
| `AiAnalysisPanel` | Editor Ideas Lab | Reuse from hub-swipe |
| `BatchApprovalBar` | Agency PTP | Reuse pattern from content-gen QueueFeaturePage |
| `PostCard` | Agency Social Analytics, Model Social Analytics | Reuse from community |
| `FilterBar` | Agency Social, Editor Search, Editor R&D | Reuse from community |
| `LeaderboardSidebar` | Model Gamification | Reuse from community |
| `ScoreRing` | Editor Finished Reels, Editor Ideas Lab | Reuse from intelligence |
| `VideoLightbox` | Agency PTP, Editor Ideas Lab | Reuse from intelligence |
| `PipelineStatusStrip` | Editor R&D, Agency Content Pipeline | Reuse from intelligence |
| `SkeletonCard` | All loading states | Reuse from intelligence |
| `OneTapRecorder` | Model Requests, Model Swipe Deck | New (shared, mobile) |
| `PointsDisplay` | Model (all pages) | New (shared) |

---

## Component Authorship Notes

- **New (shared):** Build once in `src/components/shared/` — do not duplicate per dashboard
- **Reuse from hub-swipe:** `SwipeStack` and `SwipeAuditLog` are directly portable — import, don't rewrite
- **Reuse from intelligence:** Already built in content-gen hub — import path TBD
- **Reuse from community:** Already built in content-gen hub — import path TBD
