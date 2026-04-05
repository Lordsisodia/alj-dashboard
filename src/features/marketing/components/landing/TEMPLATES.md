# Section Templates

How to build new data-driven sections following existing patterns.

## Pattern: Simple data-driven section

For sections with repeating items (features, testimonials, cards), follow the FeatureSection structure:

```
NewSection/
├── index.tsx              # Main component (renders data loop)
├── data/
│   └── items.ts           # Data array export
├── ui/
│   └── ItemCard.tsx       # Reusable card component
└── README.md
```

### Example: Testimonials section

```ts
// data/testimonials.ts
export const testimonials = [
  {
    id: 'quote-1',
    text: 'Quote text...',
    author: 'Name',
    role: 'Title',
    image: '/avatar.jpg',
  },
  // ...
];

// ui/TestimonialCard.tsx
export function TestimonialCard({ quote }) {
  return <div>...</div>;
}

// index.tsx
import { testimonials } from './data/testimonials';
import { TestimonialCard } from './ui/TestimonialCard';

export default function TestimonialsSection() {
  return (
    <section>
      {testimonials.map(q => <TestimonialCard key={q.id} {...q} />)}
    </section>
  );
}
```

## Pattern: No separate data file

If section is simple (<10 items) and unlikely to change, hardcode in component:

```tsx
// SimpleSection.tsx
const items = [{ ... }, { ... }];

export default function SimpleSection() {
  return (
    <section>
      {items.map(item => ...)}
    </section>
  );
}
```

## Guidelines

- Data files: export as `const [name] = [...]`
- Card components: accept props, render UI, use inline styles
- Main component: maps over data, applies section styling
- Mobile: use media query in main component `<style>` tag
- Accent colors: define in data, pass to card via props

## Naming

- Data files: plural (testimonials.ts, features.ts, products.ts)
- Card components: singular (TestimonialCard.tsx, FeatureCard.tsx)
- Sections: descriptive (TestimonialsSection.tsx, FAQSection.tsx)
