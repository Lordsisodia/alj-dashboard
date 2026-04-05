# IndustryPage/

Reusable template for industry vertical pages: E-Commerce, B2B & SaaS, Agencies, etc.

## Structure

```
IndustryPage/
├── index.tsx           # Template component
├── data/
│   ├── ecommerce.ts
│   ├── b2b-saas.ts
│   ├── agencies.ts
│   ├── info-education.ts
│   ├── mobile-apps.ts
│   └── freelancers.ts
└── README.md
```

## Adding a new industry

1. Create `data/industry-name.ts` — copy shape from `ecommerce.ts`
2. Create `app/industry-name/page.tsx`:
```tsx
import IndustryPage from '@/src/components/react-rebuild/IndustryPage';
import { industryData } from '@/src/components/react-rebuild/IndustryPage/data/industry-name';
export default function Page() { return <IndustryPage {...industryData} />; }
```
3. Add to Solutions dropdown: `SOLUTIONS_COMING_SOON` in `components/layout/navbar/nav.data.ts`

## OFM vertical

`/ofm` is the primary active vertical (featured in the Solutions dropdown).
All others are currently "Coming Soon" — activate by moving from `SOLUTIONS_COMING_SOON` to `SOLUTION_FEATURED` once the page is built.
