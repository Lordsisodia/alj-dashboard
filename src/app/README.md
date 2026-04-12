# app

> Next.js App Router route layer — thin wrappers only, no business logic.
> Owner: all domains (routes delegate to features/)
> Import alias: N/A (app layer imports from @/features/*)

## The Thin Wrapper Pattern

Every `page.tsx` follows this exact pattern:

```tsx
// src/app/isso/models/page.tsx
import { ModelsFeaturePage } from '@/features/models/components';
export default function ModelsPage() { return <ModelsFeaturePage />; }
```

**Never** put component logic, data fetching, or state in `page.tsx`. It is a 3-line file.

## Route Groups

| Directory | Domain | Protection | Notes |
|---|---|---|---|
| `(marketing)/` | Marketing | Public | ofmsaas.com — landing, blog, product pages |
| `isso/` | ISSO Dashboard | Clerk auth | app.ofmsaas.com — the product |
| `agency/` | Agency Dashboard | Clerk auth | Owner/manager view |
| `content-gen/` | Content Gen Pipeline | Clerk auth | Gold standard — do not touch |
| `chatters/` | Chatters Dashboard | Clerk auth | Chatter management |
| `models/` | Models View | Clerk auth | Per-model view |
| `partners/` | Partner Portal | Clerk auth | Partner-facing |
| `api/` | Route Handlers | Varies | Next.js API routes |

## Dashboards Built

| Dashboard | Layout file | Sidebar config |
|---|---|---|
| ISSO | `isso/layout.tsx` | via `IssoSidebarShell` + `sidebar-config.tsx` |
| Agency | `agency/layout.tsx` | `agency/sidebar-config.tsx` |
| Content Gen | `content-gen/layout.tsx` | `content-gen/sidebar-config.tsx` |

## Auth

- `ClerkProvider` is in root `layout.tsx`
- `/isso/*` routes protected via `src/middleware.ts`
- After sign-in redirect → `/isso` (not `/`)

## Naming Conventions

- Route directories: lowercase kebab-case (`content-gen/`, `hub-swipe/`)
- Dynamic segments: `[param]` (e.g. `[industry]/`)
- Route groups: `(group-name)` — does not affect URL
- Every route directory needs: `page.tsx` and optionally `layout.tsx`
