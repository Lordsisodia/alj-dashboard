# BookDemo

Barrel export of demo booking page sub-components. Individual components handle hero, booking form, brand logos, social proof, and calendar widget.

| File | Purpose |
|------|---------|
| `OnboardingHero.tsx` | Page hero with headline, description, benefits list |
| `OnboardingForm.tsx` | Contact form (name, email, company, etc.) |
| `BrandStrip.tsx` | Logo strip of example client brands |
| `SocialProof.tsx` | Testimonials/reviews section (uses Senja widget) |
| `CalendarPopup.tsx` | Calendly/Senja calendar booking embed |

## Props & Data

Each sub-component is stateless or manages its own local state. Used as:
```tsx
import { OnboardingHero, OnboardingForm, ... } from '@/components/BookDemo';
```

## Where it's used

`app/book-demo/page.tsx` (imported individually)
