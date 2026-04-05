# How to Add New Sections

This guide covers common section types you may need to build.

## Type 1: Simple data-driven sections (testimonials, FAQs, cards)

Follow the FeatureSection pattern:

```
MySectionName/
├── index.tsx              # Main component, maps over data
├── data/
│   └── items.ts           # export const items = [{ ... }, ...]
├── ui/
│   └── ItemCard.tsx       # Card component
└── README.md
```

**Example: Testimonials**
- `testimonials/data/testimonials.ts` — Array of { id, text, author, role, image }
- `testimonials/ui/TestimonialCard.tsx` — Renders single card
- `testimonials/index.tsx` — Maps testimonials to cards in grid

See FeatureSection/README.md for the pattern.

## Type 2: Static sections (hero, CTA, dividers)

No data file needed. Hardcode content directly in component:

```tsx
// HeroSection.tsx
export default function HeroSection() {
  return (
    <section style={...}>
      <h1>Title</h1>
      <p>Subtitle</p>
      <button>CTA</button>
    </section>
  );
}
```

Examples: HeroSection.tsx, ReadyToShipCTA.tsx, EnterpriseSection.tsx

## Type 3: Product or Industry pages (future)

If you need to build `/products/hub`, `/products/agents`, `/industries/ecommerce`, etc., use this pattern:

```
products/
├── [product].tsx          # Dynamic route: /products/[product]
├── data/
│   ├── hub.ts             # Product-specific data
│   ├── agents.ts
│   └── intelligence.ts
└── layouts/
    └── ProductPageLayout.tsx  # Shared template wrapper

// data/hub.ts
export const HUB_DATA = {
  slug: 'hub',
  title: 'Hub',
  description: 'Your content library...',
  hero: { ... },
  features: [ ... ],
  cta: { ... },
};

// [product].tsx
import { HUB_DATA } from './data/hub';

export default function ProductPage({ params }) {
  const product = getProductData(params.product);
  return <ProductPageLayout {...product} />;
}
```

Similar pattern for `/industries/[industry]`.

## Type 4: Complex sections with subtabs or toggles

Example: PricingCards has FREE, PRO, BUSINESS tiers + slider toggle

```tsx
// PricingCards.tsx
export default function PricingCards() {
  const [plan, setPlan] = useState('pro');

  return (
    <section>
      <div className="toggle">
        {PLANS.map(p => (
          <button onClick={() => setPlan(p.id)}>{p.label}</button>
        ))}
      </div>
      {plan === 'free' && <FreeCard />}
      {plan === 'pro' && <ProCard />}
      {/* ... */}
    </section>
  );
}
```

Keep cards in separate functions for clarity.

## Styling guidelines

All sections use **inline CSS** (Webflow convention):

```tsx
const styles = {
  section: {
    background: 'rgba(2,3,8,0.94)',
    padding: '80px 24px',
  },
  heading: {
    fontSize: 'clamp(32px, 4vw, 48px)',
    fontWeight: 700,
    color: '#fff',
  },
};
```

Common tokens:
- Padding: 24px (horizontal), 40px/80px (vertical)
- Background: #121212 (lighter) or rgba(2,3,8,0.94) (default)
- Text: rgba(255,255,255,0.68) (muted), #fff (bright)
- Borders: rgba(255,255,255,0.06)

## Mobile responsive

Use media query in section `<style>` tag or CSS classes:

```tsx
return (
  <section>
    {/* ... */}
    <style>{`
      @media (max-width: 768px) {
        .grid { grid-template-columns: 1fr !important; }
        .text { font-size: 18px !important; }
      }
    `}</style>
  </section>
);
```

## Import and assemble

Add to `app/page.tsx`:

```tsx
import MySectionName from '@/components/landing/MySectionName';

export default function Home() {
  return (
    <>
      <HeroSection />
      <MySectionName />
      <Footer />
    </>
  );
}
```

Run `npm run build` after adding new sections to catch errors.
