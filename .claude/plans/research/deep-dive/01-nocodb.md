# Deep-Dive: NocoDB (62.7k Stars)

**Repository:** https://github.com/nocodb/nocodb
**Last Updated:** 2026-04-12
**License:** Sustainable Use License (custom, see below)

---

## Overview

NocoDB is a free, self-hostable Airtable alternative that provides a spreadsheet interface on top of any database. It auto-generates REST APIs and a UI from an existing database schema.

**Key Tagline:** "The fastest and easiest way to build databases online"

---

## Tech Stack

### Backend (`packages/nocodb`)
- **Runtime:** Node.js >= 22
- **Framework:** NestJS (full-stack)
- **Supported Databases:**
  - PostgreSQL (primary)
  - MySQL/MariaDB
  - SQLite
  - ClickHouse
  - Databricks
- **Key Dependencies:**
  - NestJS 10.x
  - WebSockets (Socket.io) for real-time
  - Redis (throttling, caching)
  - AWS SDK (S3, SES, SNS)
  - AI SDK (OpenAI, Anthropic, Google, Azure, DeepSeek, Amazon Bedrock)
  - Various database drivers (@clickhouse/client, @databricks/sql)

### Frontend (`packages/nc-gui`)
- **Framework:** Nuxt 3 (Vue 3 based)
- **Runtime:** Node.js >= 18
- **State Management:** Pinia
- **Key Dependencies:**
  - TipTap (rich text editor)
  - Vue Flow (node-based UI for ERD)
  - Dagre (graph layout)
  - Vuelidate (form validation)
  - Ant Design Vue (UI components)
  - Monaco Editor (formula/code editing)

### SDK (`packages/nocodb-sdk`, `packages/nocodb-sdk-v2`)
- Auto-generated TypeScript SDK
- REST API client with full type safety

---

## Architecture

### Monorepo Structure
```
packages/
├── nc-gui/           # Frontend (Nuxt 3)
├── nocodb/           # Backend (NestJS)
├── nocodb-sdk/       # TypeScript SDK v1
├── nocodb-sdk-v2/    # TypeScript SDK v2
├── nc-lib-gui/       # Shared GUI utilities
├── nc-mail-assets/   # Email templates
├── nc-secret-mgr/    # Secrets management
└── noco-integrations/ # Integration plugins
```

### Backend Modules (`src/`)
```
src/
├── controllers/      # API endpoints
├── models/           # Data models (70+ TypeScript classes)
├── services/        # Business logic
├── modules/         # NestJS modules
├── db/             # Database adapters
├── meta/            # Metadata handling
├── plugins/         # Plugin system
├── socket/          # WebSocket handlers
└── mcp/            # Model Context Protocol
```

---

## Field Types (Column Types)

NocoDB supports 30+ field types organized into categories:

### Text Fields
- **SingleLineText** - Short text input
- **LongText** - Multi-line textarea
- **Email** - Email with validation
- **PhoneNumber** - Phone with formatting
- **URL** - Web link with validation
- **RichText** - Full rich text editor (TipTap)
- **UUID** - Auto-generated UUID

### Number Fields
- **Integer** - Whole numbers
- **Decimal** - Decimal numbers
- **Float** - Floating point
- **Currency** - Money with symbol
- **Percent** - Percentage values
- **Rating** - Star ratings (1-5, 1-10)

### Date/Time Fields
- **Date** - Date picker
- **DateTime** - Date + time
- **Time** - Time only
- **Year** - Year only

### Selection Fields
- **SingleSelect** - Dropdown (one option)
- **MultiSelect** - Multi-select checkboxes

### Special Fields
- **Checkbox** - Boolean toggle
- **Attachment** - File uploads (S3, GCS, Minio, local)
- **Rating** - Visual rating
- **GeoData** - Geographic coordinates
- **Duration** - Time duration
- **Json** - JSON data
- **Barcode** - Barcode generation
- **QrCode** - QR code generation
- **User** - User reference
- **Button** - Action button

### Computed Fields (Read-only)
- **Formula** - Calculated expressions
- **Rollup** - Aggregate from linked records
- **Lookup** - Lookup from linked records
- **Links** - Display linked records count
- **LinkToAnotherRecord** - Foreign key relationship

### AI Fields
- **AI** - AI-generated content

---

## View System

### Supported View Types

1. **Grid View** (default)
   - Spreadsheet-like interface
   - Sortable, filterable columns
   - Column resizing, reordering
   - Row expansion for details
   - Virtual scrolling for performance

2. **Gallery View**
   - Card-based layout
   - Configurable cover image field
   - Thumbnail previews

3. **Kanban View**
   - Drag-and-drop cards
   - Group by single-select field
   - Stack/swimlane layout
   - Optimized rendering for large datasets

4. **Form View**
   - Data entry forms
   - Field visibility/ordering
   - Validation rules
   - Submit actions

5. **Calendar View**
   - Date-based calendar
   - Configurable date fields (start, end)
   - Month/week/day views

6. **Map View**
   - Geographic visualization
   - GeoData field integration

7. **Timeline View**
   - Gantt-like timeline
   - Date range visualization

### View Features
- **Collaborative Views** - Real-time collaboration
- **Locked Views** - Prevent modifications
- **Shared Views** - Public/private sharing with password protection
- **View-specific Columns** - Different column visibility per view
- **Row Colors** - Conditional coloring (conditions or single color)

### View Models (in `src/models/`)
- `GridView.ts`, `GridViewColumn.ts`
- `GalleryView.ts`, `GalleryViewColumn.ts`
- `KanbanView.ts`, `KanbanViewColumn.ts`
- `FormView.ts`, `FormViewColumn.ts`
- `CalendarView.ts`, `CalendarViewColumn.ts`
- `MapView.ts`, `MapViewColumn.ts`
- `TimelineView.ts`, `TimelineViewColumn.ts`

---

## Data Model Architecture

### Core Models

#### Tables/Models
- `Model.ts` - Base table model (extends Base)
- `Base.ts` - Database/project container

#### Columns
- `Column.ts` - Base column model (71KB, comprehensive)
  - Properties: id, name, uidt (UI data type), dt (data type), np, ns, clno, cno, db_algo, pv, tn, un, p, rqd, cms, cda, cc, cs, dtxp, dtxs, ct, st, oid, oe, oa, rbd, res
  - Methods: getColType(), isVirtualCol(), getDataFromSQL(), getDataToPost()

#### Views
- `View.ts` - Base view model
  - Properties: type, is_default, locked, share_id, password

#### Records/Rows
- Handled through API, stored in underlying database

### Linked Records

**LinkToAnotherRecordColumn.ts** (8.6KB)
- Implements LTAR (Link To Another Record)
- Supports: Has Many, Belongs To, Many-to-Many
- Uses junction tables for M:N relationships

**LinksColumn.ts**
- Virtual column displaying linked record count

### Filter System
- `Filter.ts` - Filter model
- Supports nested filter groups (AND/OR logic)
- Filter types per column type

### Sort System
- `Sort.ts` - Sort model
- Multi-column sorting
- ASC/DESC ordering

---

## API Structure

### API Versioning
- **v1:** Legacy API (`/api/v1/db/meta/*`, `/api/v1/db/internal/*`)
- **v2:** Current API (`/api/v2/*`)

### Key API Endpoints

#### Tables
```
GET    /api/v1/db/meta/tables/{tableId}
POST   /api/v1/db/meta/tables/{tableId}/columns
PUT    /api/v1/db/meta/columns/{columnId}
DELETE /api/v1/db/meta/columns/{columnId}
POST   /api/v1/db/meta/tables/{tableId}/reorder
```

#### Records (v2)
```
GET    /api/v2/tables/{tableId}/records
POST   /api/v2/tables/{tableId}/records
GET    /api/v2/tables/{tableId}/records/{rowId}
PATCH  /api/v2/tables/{tableId}/records/{rowId}
DELETE /api/v2/tables/{tableId}/records/{rowId}
POST   /api/v2/tables/{tableId}/bulk/dataList
GET    /api/v2/tables/{tableId}/records/count
```

#### Views
```
GET    /api/v1/db/meta/tables/{tableId}/views
POST   /api/v1/db/meta/tables/{tableId}/grids
POST   /api/v1/db/meta/tables/{tableId}/forms
POST   /api/v1/db/meta/tables/{tableId}/galleries
POST   /api/v1/db/meta/tables/{tableId}/kanbans
GET    /api/v1/db/meta/grids/{viewId}
GET    /api/v1/db/meta/forms/{formViewId}
```

#### Filters & Sorts
```
GET    /api/v1/db/meta/views/{viewId}/filters
POST   /api/v1/db/meta/views/{viewId}/filters
GET    /api/v1/db/meta/views/{viewId}/sorts
POST   /api/v1/db/meta/views/{viewId}/sorts
```

#### Comments
```
GET    /api/v1/db/meta/comments
POST   /api/v1/db/meta/comments
DELETE /api/v1/db/meta/comment/{commentId}
```

#### Sharing
```
POST   /api/v1/db/meta/views/{viewId}/share
GET    /api/v1/db/public/shared-view/{sharedViewUuid}/rows
```

#### Webhooks/Hooks
```
POST   /api/v1/db/meta/tables/{tableId}/hooks
GET    /api/v1/db/meta/hooks/{hookId}/logs
POST   /api/v1/db/meta/tables/{tableId}/hooks/test
```

#### AI Features
```
POST   /api/v2/ai/tables/{modelId}/rows/generate
POST   /api/v2/ai/tables/{modelId}/rows/fill
POST   /api/v2/ai/tables/{modelId}/extract
```

#### Export
```
GET    /api/v2/export/{viewId}/{exportAs}  # csv, xlsx, pdf
```

---

## Permissions & Access Control

### Roles (from `models/`)
- `Owner` - Full access
- `Creator` - Can create/edit
- `Editor` - Can edit records
- `Viewer` - Read-only
- `Commenter` - Can comment only
- `None` - No access

### Permission Levels
1. **Workspace level** - Overall workspace access
2. **Base level** - Project/database access
3. **Table level** - Individual table access
4. **Column level** - Column-specific permissions
5. **View level** - View-specific access

### Sharing Options
- Public (anyone with link)
- Private (invite only)
- Password protected
- Role-based access

---

## Frontend Component Architecture

### Key Component Directories
```
components/
├── smartsheet/          # View components
│   ├── grid/           # Grid view
│   ├── kanban/          # Kanban view
│   ├── gallery/         # Gallery view
│   ├── form/            # Form view
│   ├── calendar/        # Calendar view
│   ├── header/          # Column headers
│   └── toolbar/         # Filter/sort toolbar
├── cell/               # Cell type renderers
│   ├── Text/            # Single line text
│   ├── LongText/        # Multi-line
│   ├── Email/           # Email
│   ├── Url/             # URL
│   ├── Number/          # Integer, Decimal, Float
│   ├── Currency/        # Currency
│   ├── Percent/          # Percentage
│   ├── Rating/          # Star rating
│   ├── Date/            # Date picker
│   ├── DateTime/        # DateTime picker
│   ├── Checkbox/        # Boolean
│   ├── SingleSelect/    # Dropdown
│   ├── MultiSelect/     # Multi-select
│   ├── User/            # User picker
│   ├── Attachment/      # File upload
│   ├── RichText/        # TipTap editor
│   └── ...
├── dlg/                # Dialogs/modals
├── dashboard/          # Dashboard widgets
└── virtual-cell/       # Computed cell renderers
```

### Cell Component Pattern
Each field type has a dedicated Vue component:
- `Cell.vue` - Base cell wrapper
- `PlainCell.vue` - Display mode
- `VirtualCell.vue` - Computed fields
- Type-specific components (`Text/`, `Checkbox/`, `Date/`, etc.)

---

## Patterns for Airtable-Style R&D Table

### 1. **View Abstraction Layer**
```
View (base) → GridView | GalleryView | KanbanView | FormView
ViewColumn (per-view column config)
```
Pattern: Different rendering strategies for same data

### 2. **Column Type System**
```
Column.ts (base) → Specializes by uidt (UI data type)
Each type has:
  - Database mapping (dt)
  - Validation rules
  - Cell component
  - API serialization
```

### 3. **Virtual Columns (Computed)**
- Formula: Expression evaluation
- Lookup: Cross-reference fetch
- Rollup: Aggregate functions (COUNT, SUM, AVG, etc.)
- Links: Count of related records

### 4. **Filter Tree Structure**
```typescript
interface Filter {
  id: string
  comparison_op: 'eq' | 'neq' | 'gt' | 'lt' | 'contains' | ...
  value: any
  children?: Filter[]  // Nested AND/OR groups
}
```

### 5. **Real-time Updates**
- WebSocket connection for live collaboration
- Optimistic UI updates
- Conflict resolution

### 6. **Batch Operations**
```
POST /api/v2/tables/{id}/bulk/dataList
  - Create/update multiple records
  - Single transaction
```

### 7. **Lazy Loading**
- Virtual scrolling for large datasets
- Pagination built into API
- Infinite scroll pattern

### 8. **Form/View Separation**
- FormViewColumn: Controls form field visibility/order
- GridViewColumn: Controls grid column config
- Independent per-view settings

---

## SDK Usage Pattern

```typescript
import { Noco } from 'nocodb-sdk';

const nc = new Noco('http://localhost:8080', {
  token: 'your-token'
});

// Tables
await nc.meta.tableList(projectId, baseId);
await nc.meta.tableUpdate(projectId, baseId, tableId, { title: 'New Name' });

// Records
await nc.dbTableRow.list('noco', projectId, tableId, { limit: 25 });
await nc.dbTableRow.bulkDataList('noco', projectId, tableId, { data: [...] });

// Views
await nc.meta.viewList(projectId, baseId, tableId);
await nc.meta.gridViewCreate(projectId, baseId, tableId, { title: 'Grid' });

// Columns
await nc.meta.columnList(projectId, baseId, tableId);
await nc.meta.columnAdd(projectId, baseId, tableId, { ... });
```

---

## License: Sustainable Use License

**Key Restrictions:**
- Internal business use only (free)
- Non-commercial/personal use (free)
- Distribution only if free and non-commercial
- Cannot remove licensing notices

**Commercial Use:** Requires separate commercial license from NocoDB Inc.

---

## Implementation Insights for Next.js + Tailwind

1. **Separate View Components** - Each view type as isolated component with shared data interface

2. **Column Type Registry** - Map uidt to cell component for dynamic rendering

3. **Optimistic Updates** - Update UI immediately, rollback on API failure

4. **Virtual Scrolling** - Essential for performance with large datasets

5. **Drag-and-Drop** - Use dnd-kit or similar for Kanban reordering

6. **Form State Machine** - Separate create/edit/delete states

7. **Undo/Redo Stack** - Track mutations for Cmd+Z support

8. **Multi-select** - Shift+click for range selection (like spreadsheets)

---

## Resources

- **Docs:** https://docs.nocodb.com/
- **Community:** https://community.nocodb.com/
- **Discord:** https://discord.gg/c7GEYrvFtT
- **API Spec:** `/APIs.json` in repo
