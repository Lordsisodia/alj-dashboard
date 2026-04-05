# WorkWithBrands

Barrel export of "Work With Brands" page sub-components. Individual components handle hero, features, social proof, and call-to-action sections.

| File | Purpose |
|------|---------|
| `WorkWithBrandsHero.tsx` | Page hero with headline, description, CTA |
| `WorkWithBrandsBest.tsx` | Feature highlights or best practices grid |
| `WorkWithBrandsSocialProof.tsx` | Client testimonials or case studies |
| `WorkWithBrandsCTA.tsx` | Bottom call-to-action section |
| `data/work-with-brands.ts` | Data object exported as `workWithBrandsData` |

## Props & Data

Each sub-component is stateless. Imported individually:
```tsx
import { WorkWithBrandsHero, WorkWithBrandsBest, ... } from '@/components/WorkWithBrands';
```

## Where it's used

`app/work-with-brands/page.tsx` (imported individually)
