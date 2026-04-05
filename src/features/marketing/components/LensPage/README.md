# LensPage

Full-page template for `/lens` route. Multi-section page with hero, solution section, integrations tabs, gamification, benchmarking, enrichment tools, security cards, and embedded CTA.

| File | Purpose |
|------|---------|
| `index.tsx` | Root export; composes all sub-sections with data |
| `LensHero.tsx` | Page header with hero content |
| `LensSolutionSection.tsx` | Icons + graph cards + testimonials |
| `LensIntegrations.tsx` | Tabbed section showing platform integrations |
| `LensGamificationSection.tsx` | Gamification and benchmark features |
| `LensBenchmarking.tsx` | Carousel/segments view of benchmark data |
| `LensEnrichment.tsx` | Tools/features grid |
| `LensSecurity.tsx` | Security cards grid |
| `LensEmbeddedCTA.tsx` | Mid-page call-to-action |
| `data/lens.ts` | Centralized data object |

## Props & Data

No props. Uses `lensData` imported from `data/lens.ts` which contains all sections.

## Where it's used

`app/lens/page.tsx`
