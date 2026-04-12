# src

> Top-level source directory for the ISSO Dashboard unified app.
> Owner: all domains
> Import alias: see table below

## Layer Diagram

```
src/
├── app/               ← Next.js App Router — routes only, thin wrappers
│   ├── (marketing)/   ← ofmsaas.com — landing pages, blog, product pages
│   ├── isso/          ← app.ofmsaas.com — Clerk-protected dashboard
│   ├── agency/        ← Agency owner/manager view (Alex + managers)
│   ├── content-gen/   ← Content generation pipeline (gold standard — do not touch)
│   └── api/           ← Next.js route handlers
├── features/          ← Domain feature modules — all business logic lives here
├── shared/            ← Cross-domain primitives (layout, ui, hooks)
├── domains/           ← Legacy domain modules (partnerships, portfolio, client-base)
├── components/        ← Root-level component overrides (NOT src/components)
├── lib/               ← Utility functions, API clients
├── hooks/             ← Global hooks not tied to a domain
├── types/             ← Global TypeScript types
└── assets/            ← Static assets (images, fonts)
```

## Path Aliases

| Alias | Resolves to | Use for |
|-------|-------------|---------|
| `@/isso/*` | `src/shared/*` | Layout shells, UI primitives |
| `@/features/*` | `src/features/*` | Feature components, hooks |
| `@/lib/*` | `src/lib/*` | Utilities, API helpers |
| `@/components/*` | `./components/*` | Root-level components (NOT src/) |

## Key Rules

- **App layer is thin** — pages import one `*FeaturePage` component and return it. No logic in `page.tsx`.
- **Features own logic** — components, hooks, types all live in `src/features/{domain}/`.
- **Shared cannot import features** — `src/shared/` is a zero-dependency layer.
- **Marketing is isolated** — never import `src/features/marketing/` from dashboard features.
- **Use `@/isso/*` not `@/shared/*`** — the alias is `@/isso`, not `@/shared`.
- **`src/domains/` is legacy** — do not add new code here; use `src/features/` instead.

## Quick Reference — Which Dashboard is Which?

| Route prefix | Dashboard | Users |
|---|---|---|
| `/isso/*` | ISSO product dashboard | Models, editors, team |
| `/agency/*` | Agency owner/manager view | Alex, managers |
| `/content-gen/*` | Content gen pipeline | Editors (gold standard) |
| `/(marketing)/*` | Public marketing site | Visitors |
| `/partners/*` | Partner portal | Partners |
