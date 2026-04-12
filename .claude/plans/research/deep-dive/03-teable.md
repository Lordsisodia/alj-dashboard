# Deep-Dive: Teable (teableio/teable)

**Stars:** 21.1k | **Forks:** 1.2k | **Current:** v1.10.0

---

## TypeScript Stack

| Layer | Technology |
|-------|------------|
| Language | TypeScript (99.1%), JavaScript, CSS, PLpgSQL |
| Frontend | Next.js (apps/nextjs-app) |
| Backend | NestJS (apps/nestjs-backend) |
| ORM | Prisma (db-main-prisma package) |
| Package Manager | pnpm (monorepo) |

**Monorepo structure:**

```
apps/              (AGPL 3.0)
  nextjs-app/      — Frontend
  nestjs-backend/  — Backend
packages/          (MIT)
  core/            — Shared code & interfaces
  sdk/             — Extension SDK
  ui-lib/          — UI components
  db-main-prisma/  — Schema, migrations, Prisma client
  common-i18n/     — Internationalization
  eslint-config-bases/
plugins/           (AGPL 3.0)
  — Custom extensions system
```

---

## Postgres Data Model

- **Dev:** SQLite (via `make switch-db-mode`)
- **Production:** PostgreSQL
- **ORM:** Prisma with raw SQL access for power users
- **Scale claim:** Millions of rows
- **DB config:** Managed through `db-main-prisma` package

**Multi-db roadmap:** MySQL, MariaDB, TiDB marked "coming soon" in README.

---

## View System

| View | Status |
|------|--------|
| Grid View | Available |
| Form View | Available |
| Kanban View | Available |
| Gallery View | Available |
| Calendar View | Available |
| Gantt View | Available |
| Timeline View | Roadmap |

Views are first-class citizens in the schema — separate from the data layer.

---

## Field Types

Core field types supported:
- Text (single/multi-line)
- Number (int, float, currency)
- Date / DateTime
- Single Select / Multi Select
- Checkbox (Boolean)
- Rating
- Formula
- Rollup
- Count
- Attachment (file upload)
- Collaborator (user reference)
- Reference / Linked Records (cross-table links)
- URL
- Email
- Phone
- Auto Number
- Created Time / Last Modified Time

Formula fields support expressions. Rollup aggregates linked records. Reference fields establish bidirectional table links.

---

## Linked Records

- Implemented via **Reference field type** — creates cross-table relationships
- Supports bidirectional linking (record A links to B, B can show linked A)
- **Rollup fields** aggregate data across linked records (sum, count, average, etc.)
- **Count fields** count linked records without aggregation
- Linked records render as expandable record previews in grid view

---

## Real-Time Collaboration

- No page refresh required — updates propagate live
- Collaboration member invitation and management built-in
- Permission management from **table level down to column level**
- Changes sync via backend push (WebSocket assumed but not confirmed in docs)

---

## API Structure

- Token-based API authentication
- REST API documented at `help.teable.ai`
- SDK package (`packages/sdk`) for building extensions
- Extension/plugin system for custom integrations
- Import/export APIs for data portability

---

## License

| Component | License |
|-----------|---------|
| Community Edition (self-hosted) | **AGPL 3.0** |
| Shared packages (core, sdk, ui-lib, etc.) | **MIT** |
| Enterprise Edition | Proprietary — adds AI, automation, authority matrix, advanced admin |

Self-hosting is fully free under AGPL 3.0.

---

## What's Portable to Next.js + Tailwind + Convex

| Teable Feature | Portable to Next.js+Tailwind+Convex? | Notes |
|----------------|--------------------------------------|-------|
| TypeScript monorepo | YES | Standard NX/pnpm workspace pattern |
| Prisma + Postgres | YES (use Convex SQL adapters or native Postgres) | Convex has SQL adapters; Prisma drops in natively |
| View abstraction (grid/kanban/gallery/calendar) | PARTIAL | Implement custom; no off-the-shelf lib needed |
| Field type system | PARTIAL | Domain model is portable; UI components are custom |
| Linked records + rollup | YES | Convex relations + computed fields |
| Real-time collaboration | YES | Convex subscriptions handle live sync natively |
| Permission matrix (table→column) | YES | Convex auth + row-level security |
| Plugin/extension system | YES | Next.js server actions or API routes |
| Formula engine | YES | Custom expression evaluator needed |
| AGPL 3.0 | LICENSE NOTE | Required if forking; MIT packages are freely reusable |

**Convex-native advantages:**
- Real-time sync is built-in (Teable's hardest part — Convex solves it out of the box)
- Convex SQL adapters let you keep Postgres with Prisma-style schema
- Auth and permissions handled by Convex's built-in system
- No need for NestJS backend — Next.js API routes or server actions suffice

**Key takeaway:** The data model, field abstraction, and permission system from Teable are directly portable. The view layer (grid, kanban, etc.) and real-time engine are where Teable's complexity lives — Convex eliminates the latter; the former requires custom UI work.

---

## Sources

- [teableio/teable — GitHub](https://github.com/teableio/teable)
- [teable.ai — Official Site](https://teable.ai)
- [Teable Help Center](https://help.teable.ai)
- [Teable API Docs](https://help.teable.ai/en/api-doc/overview)
