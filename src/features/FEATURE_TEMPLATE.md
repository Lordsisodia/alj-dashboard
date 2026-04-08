# Feature Template

## Canonical Structure

Every new feature lives at `src/features/<name>/` with this structure:

```
src/features/<name>/
├── README.md              — Purpose, tab model, key decisions
├── types.ts              — Domain types only (no utils)
├── constants.ts          — Colors, thresholds, seed data
├── components/
│   ├── index.ts           — REQUIRED: barrel all public components
│   ├── shared/            — Feature-internal reusable primitives
│   │   └── index.ts
│   ├── detail/            — Detail panel (if feature has drill-down)
│   └── *.tsx              — Flat if ≤5 files
├── hooks/
│   ├── index.ts           — REQUIRED: barrel all hooks
│   └── *.ts               — One hook per file, max 80 lines
└── utils/
    └── index.ts
```

## Rules

| Rule | Threshold |
|------|-----------|
| Max lines per file | 150 (soft) / 200 (hard) |
| Max components per flat dir | 5 → create subdirectory |
| Reused stateful logic | Extract to hook |
| Directory with 3+ files | Must have `index.ts` barrel |

## Adding a Tab

1. Create `components/<TabName>Tab.tsx`
2. Add tab to parent page's `useState` + render logic
3. Export from `components/index.ts` barrel
4. Document tab in `README.md`

## Creating a New Feature

1. Run `cp -r src/features/_template/ src/features/<new-feature>/`
2. Update `README.md` with feature purpose
3. Replace `types.ts`, `constants.ts` with domain specifics
4. Build components, export through barrels
5. Register route in `src/app/isso/<name>/page.tsx`
6. Add nav item to sidebar config

## File Naming

- Page components: `<Name>Page.tsx` or `<Name>Tab.tsx`
- Sub-components: `<Parent><Child>.tsx` (e.g., `CreatorRowAvatarCell.tsx`)
- Hooks: `use<Name>.ts`
- Utilities: `use<Name>Utils.ts` or `<domain>Utils.ts`

## Imports

- Always use `@/features/<name>/` aliases, never relative deep imports across feature boundaries
- Barrel imports: `import { Foo } from '@/features/recon/components'`
- Hook imports: `import { useFoo } from '@/features/recon/hooks'`
