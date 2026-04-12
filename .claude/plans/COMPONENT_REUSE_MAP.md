# Component Reuse Map — Pipeline Pages

*Maps existing content-gen components to the 5 pipeline pages we're building first*

---

## EXISTING COMPONENT BANK (what we have)

### From Hub-Swipe (`features/hub-swipe/`)
| Component | What It Does | Reusable For |
|-----------|-------------|-------------|
| `SwipeStack` | Framer Motion card deck with drag gestures | Model Swipe Deck |
| `SwipeTabContent` | 3-column layout (stack / AI panel / annotations) + view mode switcher | Editor Queue layout pattern |
| `AiAnalysisPanel` | Hook score bar, emotion chips, breakdown, suggestions | Ideas Lab, Finished Reels AI review |
| `QuickAnnotate` | Tag annotation with chip toggles | PTP Approval tagging, R&D Table categorization |
| `SendToModelModal` | 2x2 model picker + note textarea | Content Requests (send brief to model) |
| `SwipeSessionSummary` | Live counter strip (rated/passed/sent + timer) | PTP Approval session stats |
| `SwipeAuditLog` | Grouped-by-date decision history | PTP Status version history |
| `CriteriaChecklist` | Checklist with progress counter | Model pre-stream checklist, content review checklist |

### From Community/Vault (`features/community/`)
| Component | What It Does | Reusable For |
|-----------|-------------|-------------|
| `PostCard` | 4:5 content card with thumbnail, creator, actions | R&D Table entries, Content Requests brief preview |
| `SavedCard` | Extended card with pipeline state + CTA | Finished Reels card (approval status + actions) |
| `FilterBar` (shared) | Niche + type pill filters | ALL pages (model filter, niche filter, status filter) |
| `VaultFilterBar` | Niche + type + CTA button | R&D Table filters |
| `NicheGroup` | Section wrapper with label + count + PostCard grid | R&D Table grouped by niche |
| `LeaderboardSidebar` | Ranked list with avatars | Model gamification leaderboard |
| `VaultHealthBar` | Per-niche progress bars with thresholds | Pipeline health dashboard |
| `HubQuickActions` | 3-column action strip | Editor Queue quick actions |
| `LastSessionCard` | 3-col stat grid with approval rate | PTP Approval stats card |
| `SendToPipelineModal` | Full-screen form: model picker + description + provider + priority | Content Requests brief creator |
| `HubSwipeActivityFeed` | 3-section live sidebar (queue + gaps + activity) | PTP Approval sidebar feed |

### From Intelligence (`features/intelligence/`)
| Component | What It Does | Reusable For |
|-----------|-------------|-------------|
| `ScoreRing` | SVG ring arc, color-coded by score | Finished Reels virality score |
| `VideoLightbox` | Full-screen video player modal | PTP Approval video review, Ideas Lab |
| `KPIDeltaTile` | Icon + metric + delta badge + CTA | Agency Dashboard Home KPIs, Revenue page |
| `PipelineStatusStrip` | Horizontal stat strip with icon chips | R&D Table pipeline status, Editor Queue status |
| `AnalysisPipelineStrip` | 3-stage pipeline visualization | Content Pipeline stage tracker |
| `FormatChart` | Animated horizontal bar rows | Revenue analytics charts |
| `NicheLeaderboard` | Ranked bar chart | Social Analytics top niches |
| `HookScoreDistribution` | Animated bar chart with buckets | Finished Reels score distribution |
| `EmotionFrequency` | Horizontal bar rows | Ideas Lab emotion analysis |
| `SortPill` | Generic sort dropdown | ALL table/list pages |
| `VisibilityPill` | Toggle pill for showing/hiding columns | R&D Table, PTP Status |
| `SkeletonCard` | Loading placeholder | ALL pages |
| `InsightCards` | 5-col insight cards with color borders | Agency Dashboard summaries |
| `ActionQueue` | Gradient action buttons with motion | Editor Queue action bar |
| `OutlierRow` | Horizontal scrolling thumbnail strip | Social Analytics top posts |
| `LivePipelineCard` | Animated card with shimmer + progress | Content Pipeline live tracking |
| `ActivityFeed` | Scrollable event rows with accent rails | Agency Dashboard activity sidebar |
| `QualifyTableFilters` | Search + dropdown + pill tabs | Editor Search & Suggest filters |
| `AIChatPanel` | Streaming AI chat with suggested prompts | Ideas Lab AI assistant (future) |

### From Content-Gen (`features/content-gen/`)
| Component | What It Does | Reusable For |
|-----------|-------------|-------------|
| `QueueFeaturePage` | FilterChips + tab bar + bulk action bar + active/history views | PTP Approval page structure (exact pattern) |
| `ActiveJobCard` | Job card with status + retry/cancel | Finished Reels status card |
| `StatsStrip` | Job stats bar | PTP Approval stats |
| `HistorySection` | Completed jobs with outcome badges | PTP Status history |
| `NewJobModal` | Modal form for creating new items | Content Request brief creator |
| `GalleryFeaturePage` | 6-col filterable grid | R&D Table gallery view |
| `ScenesFeaturePage` | 4-section collapsible kanban (Needs You / Ready / In Flight / Done) | Editor Raw Content Queue (exact pattern) |
| `ImportedReferenceCard` | Source handle + metrics triad + hook line + emotion chips | R&D Table entry detail card |

### From Models (`features/models/`)
| Component | What It Does | Reusable For |
|-----------|-------------|-------------|
| `ModelCard` | Model avatar + name + niche + stats | Model Selector everywhere |
| `PanelForm` | Form fields with Field component + niche grid + handles + color picker | Content Request brief form |
| `ModelDetailPage` | 6-tab detail view | Agency Models Roster detail |

### From Approvals (`features/approvals/`)
| Component | What It Does | Reusable For |
|-----------|-------------|-------------|
| `ApprovalsFeaturePage` | Card grid + detail modal + approve/revise/publish tabs | PTP Approval (enhance, don't rebuild) |

---

## THE 5 PIPELINE PAGES — Component Shopping List

### Page 1: R&D Table (`/editor/rd-table`)
| Component Needed | Source | Action |
|-----------------|--------|--------|
| Table grid (Airtable-style) | **NEW** — use TanStack Table | Build |
| Graph view toggle | **NEW** — D3 force graph | Build |
| `FilterBar` | Community | Reuse |
| `NicheGroup` | Community | Reuse |
| `PostCard` | Community | Reuse (for gallery mode) |
| `PipelineStatusStrip` | Intelligence | Reuse |
| `SortPill` | Intelligence | Reuse |
| `VisibilityPill` | Intelligence | Reuse |
| `ImportedReferenceCard` | Content-Gen | Reuse (for entry detail) |
| `GalleryFeaturePage` pattern | Content-Gen | Adapt (for gallery view mode) |
| Sunday batch approval indicator | **NEW** | Build |

### Page 2: Content Requests — Send to Model (`/agency/content-requests`)
| Component Needed | Source | Action |
|-----------------|--------|--------|
| `SendToModelModal` | Hub-Swipe | Reuse (swap MODELS constant) |
| `SendToPipelineModal` pattern | Community | Adapt (brief form) |
| `PostCard` | Community | Reuse (brief preview) |
| `PanelForm` pattern | Models | Adapt (brief fields) |
| `VideoLightbox` | Intelligence | Reuse (reference video preview) |
| Deadline picker | **NEW** — shadcn DatePicker | Build |
| Tips/instructions editor | **NEW** — simple textarea | Build |

### Page 3: Raw Content Queue — Editor (`/editor`)
| Component Needed | Source | Action |
|-----------------|--------|--------|
| `ScenesFeaturePage` pattern | Content-Gen | Adapt (kanban columns: New / In Progress / Done) |
| Kanban drag-and-drop | **NEW** — dnd-kit | Build |
| `SavedCard` pattern | Community | Adapt (content card with status) |
| `FilterBar` | Community | Reuse |
| `HubQuickActions` | Community | Reuse (claim item, start editing) |
| `ActionQueue` | Intelligence | Reuse (gradient action buttons) |
| "Needs tweaking" flag | **NEW** — simple badge | Build |
| `SkeletonCard` | Intelligence | Reuse |

### Page 4: Finished Reels + PTP (`/editor/finished` + `/agency/ptp`)
| Component Needed | Source | Action |
|-----------------|--------|--------|
| `ApprovalsFeaturePage` | Approvals | Enhance (add version tracking, batch mode) |
| `QueueFeaturePage` pattern | Content-Gen | Reuse (FilterChips + bulk action bar) |
| `AiAnalysisPanel` | Hub-Swipe | Reuse (AI review display) |
| `ScoreRing` | Intelligence | Reuse (virality score) |
| `VideoLightbox` | Intelligence | Reuse (video review) |
| `SwipeAuditLog` pattern | Hub-Swipe | Adapt (version history V1/V2/V3) |
| `QuickAnnotate` | Hub-Swipe | Reuse (categorization tags) |
| `HubSwipeActivityFeed` pattern | Community | Adapt (PTP activity sidebar) |
| `LastSessionCard` pattern | Community | Adapt (approval stats) |
| Version comparison side-by-side | **NEW** | Build |
| Frame annotation tool | **NEW** | Build |
| Schedule date popup | **NEW** — shadcn Popover + DatePicker | Build |

### Page 5: Content Scheduler (`/agency/schedule`)
| Component Needed | Source | Action |
|-----------------|--------|--------|
| Calendar grid | **ENHANCE** existing `ScheduleFeaturePage` | Enhance |
| Model selector | **NEW** shared component | Build |
| Account selector | **NEW** | Build |
| Day detail panel | **NEW** | Build |
| Item detail drawer | **NEW** | Build |
| Meta drip queue indicator | **NEW** | Build |
| `KPIDeltaTile` | Intelligence | Reuse (scheduling stats) |
| `FilterBar` | Community | Reuse |
| Grid preview (IG feed) | **NEW** | Build |

---

## SCORE: BUILD vs REUSE

| Category | Count |
|----------|-------|
| **Reuse directly** (drop-in) | 22 components |
| **Adapt** (same pattern, swap data) | 11 components |
| **Enhance** (existing page, add features) | 2 pages |
| **Build new** | 14 components |
| **Total** | 49 component slots across 5 pages |

**71% reuse rate** — only 14 genuinely new components needed for the entire pipeline.

---

## WHAT TO BUILD NEW (the 14)

| # | Component | Page | Complexity |
|---|-----------|------|-----------|
| 1 | TanStack Table grid (Airtable-style) | R&D Table | High |
| 2 | D3 force graph view | R&D Table | High |
| 3 | Sunday batch approval indicator | R&D Table | Low |
| 4 | Deadline date picker | Content Requests | Low (shadcn) |
| 5 | Tips/instructions textarea | Content Requests | Low |
| 6 | Kanban board with dnd-kit | Editor Queue | Medium |
| 7 | "Needs tweaking" badge | Editor Queue | Low |
| 8 | Version comparison (side-by-side) | PTP Approval | Medium |
| 9 | Frame annotation tool | PTP Approval | High |
| 10 | Schedule date popup | PTP Approval | Low (shadcn) |
| 11 | Model selector (shared) | Scheduler + all | Medium |
| 12 | Account selector | Scheduler | Low |
| 13 | Day detail panel | Scheduler | Medium |
| 14 | IG grid preview | Scheduler | Medium |

**3 high, 4 medium, 7 low complexity = ~2-3 weeks of build time**
