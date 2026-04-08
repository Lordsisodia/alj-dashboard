# Detail — Creator detail drawer & sections

The right-side drawer that opens when a row in the Creators table is selected. Owns the long-form view of a single creator: brief, scores, status grid, and side widgets. It does NOT own the discovery candidate detail panel (see `../discovery/detail/`).

---

## Component map

| File | Purpose |
|------|---------|
| `CreatorDetailView.tsx` | Top-level drawer container. Handles open/close, layout, and data threading. |
| `CreatorDetailSections.tsx` | Vertical stack of sections (brief, scores, widgets). |
| `CreatorBriefSection.tsx` | Brief section wrapper: header, content, scores grouped together. |
| `CreatorBriefContent.tsx` | The free-text "what this creator is about" content block. |
| `CreatorBriefScores.tsx` | Score chips inside the brief section. |

---

## Data flow

`CreatorDetailView` receives a selected `Competitor` from the parent. Widgets read derived numbers (engagement benchmarks, viral alerts, weekly digest, activity feed) from props passed by the parent — no Convex queries are issued from this folder.

---

## Subfolder guide

| Folder | Contents |
|--------|---------|
| `widgets/` | Side widgets shown alongside the brief: `CreatorStatusGrid`, `WeeklyDigestCard`, `EngagementBenchmarkCard`, `ViralAlertCard`, `ActivityFeed`. |
