# ProductPage/

Reusable template for all 5 ISSO product pages: Hub, Intelligence, Recon, Agents, Content Gen.

## How it works

Each product is a single data file. The template renders everything from that data.

```
ProductPage/
├── index.tsx          # Template component — never edit per-product
├── data/
│   ├── swipe-file.ts  # Hub (→ /hub)
│   ├── discovery.ts   # Intelligence (→ /intelligence)
│   ├── spyder.ts      # Recon (→ /recon)
│   ├── lens.ts        # Agents (→ /agents)
│   └── briefs.ts      # Content Gen (→ /content-gen)
└── README.md
```

## Adding a new product page

1. Create `data/product-name.ts` — copy shape from an existing data file
2. Create `app/product-name/page.tsx`:
```tsx
import ProductPage from '@/src/components/react-rebuild/ProductPage';
import { productData } from '@/src/components/react-rebuild/ProductPage/data/product-name';
export default function Page() { return <ProductPage {...productData} />; }
```
3. Add the route to the navbar in `components/layout/navbar/nav.data.ts`

## Data shape

Each data file exports a typed object covering: hero content, feature tabs, screenshots, CTA copy, and pricing tier access. Match the TypeScript types exported from `index.tsx`.
