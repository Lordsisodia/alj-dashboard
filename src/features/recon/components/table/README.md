# Table — Creator catalogue table & grid

The Creators tab. Owns the master list/grid view of every creator the system tracks: rows, cells, filters, bulk actions, view-mode toggles, and the table-level state hooks. It does NOT own the per-creator detail drawer (see `../detail/`) nor the kanban triage flow (see `../discovery/`).

---

## Component map

| File | Purpose |
|------|---------|
| `CreatorsTable.tsx` | Top-level orchestrator. Wires data, filters, view mode, selection, and renders list or grid. |
| `CreatorsTableListView.tsx` | List/table layout (rows + sticky header). |
| `CreatorsTableGridView.tsx` | Card grid layout. |
| `CreatorsTableHeader.tsx` | Title bar above the table with counts and view-mode toggle. |
| `TableHeader.tsx` | The sticky column header row used inside the list view. |
| `TableToolbar.tsx` | Toolbar with status dropdown, search, sort controls, etc. |
| `BulkActionBar.tsx` | Floating action bar shown when one or more rows are selected. |
| `tableUtils.ts` | Column geometry constants, formatters, visibility helpers shared by every cell. |

---

## Data flow

`CreatorsTable` consumes a `Competitor[]` from upstream (the recon feature page). Filtering, sorting, and pagination happen client-side via the hooks in `./hooks/`. Mutations (status toggle, favorite, enrich) flow through the parent's Convex mutations and are passed in as callbacks; this folder owns no Convex queries directly.

---

## Subfolder guide

| Folder | Contents |
|--------|---------|
| `rows/` | Row component (`CreatorRow`), the table-row wrapper (`CreatorTableRow`), the row renderer, and per-cell components (avatar, health, actions, meta). |
| `filters/` | Filter bar plus individual filter primitives: range filter, filter pill, column visibility pill, score column header, column filter header. |
| `cards/` | Grid-mode card components: `CreatorCard`, `CreatorCardRenderer`, and the `CreatorSpotlightCard` highlight tile. |
| `hooks/` | Table state and table actions hooks (`useTableState`, `useTableActions`). |
