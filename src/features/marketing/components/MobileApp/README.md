# MobileApp

Full-page template for `/mobile-app` route. Renders hero section, feature list, bottom CTA, navbar, and footer.

| File | Purpose |
|------|---------|
| `index.tsx` | Root export; composes Hero, Features, CTA, Footer |
| `MobileAppHero.tsx` | Page header with headline, description, CTA |
| `MobileAppFeatures.tsx` | Feature cards grid with icons/descriptions |
| `MobileAppBottomCTA.tsx` | Bottom call-to-action section |
| `data/mobile-app.ts` | Data object with hero, features, bottomCta |

## Props & Data

No props. Uses `mobileAppData` imported from `data/mobile-app.ts`.

## Where it's used

`app/mobile-app/page.tsx`
