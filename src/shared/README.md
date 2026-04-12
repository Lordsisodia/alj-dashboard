# shared

> Cross-domain primitives — layout shells, UI components, hooks shared across all dashboards.
> Owner: all dashboards (zero-dependency layer)
> Import alias: `@/isso/*` (NOT `@/shared/*`)

## ⚠️ Critical Import Rule

```ts
// CORRECT
import { ContentPageShell } from '@/isso/layout/ContentPageShell';
import { Button } from '@/isso/ui/button';

// WRONG — will break
import { ContentPageShell } from '@/shared/layout/ContentPageShell';
```

The alias is `@/isso`, not `@/shared`. Always use `@/isso/*`.

## What Lives Here

| Directory | Contents |
|---|---|
| `layout/` | Page shells: `IssoSidebarShell`, `ContentPageShell`, `ProductIcon` |
| `ui/` | UI primitives: shadcn components + ISSO-specific extensions |
| `hooks/` | Cross-domain hooks (e.g. `useDebounce`, `useLocalStorage`) |
| `styles/` | Global CSS, Tailwind extensions |
| `docs/` | Architecture docs scoped to the shared layer |

## The Zero-Dependency Rule

`src/shared/` **cannot import from**:
- `src/features/*` — any feature module
- `src/domains/*` — legacy domain modules
- `src/app/*` — route layer

It can only import from:
- Other files within `src/shared/`
- External npm packages
- `src/lib/*` utilities

Violating this creates circular dependencies that break the build.

## Naming Conventions

- Layout components: PascalCase, descriptive (`IssoSidebarShell.tsx`, `ContentPageShell.tsx`)
- UI primitives: lowercase kebab-case matching shadcn convention (`button.tsx`, `card.tsx`)
- ISSO extensions: PascalCase (`DateRangePill.tsx`, `FeedbackModal.tsx`)
- Hooks: `use` prefix camelCase (`useMediaQuery.ts`)
- Index files: `index.ts` re-exports all public components from a directory
