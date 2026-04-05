# HeroSection

Landing page hero with sticky content, animated video scroll-in, logo grid, and scroll indicator. Uses GSAP for scroll-triggered fade/translate animations.

| File | Purpose |
|------|---------|
| `index.tsx` | Root export; manages refs, GSAP animations, layout |
| `logos/index.tsx` | Exports `LOGOS` array mapping brand names to SVG components |
| `logos/BrandName.tsx` | Individual brand logo SVG components (one per brand) |

## Props & Data

No props. Static content:
- Headline, subheading, CTA button (link to sign-up)
- Logo grid (7 cols x 2 rows) from `LOGOS` array
- Video poster/MP4/WebM from CDN (mp4 and webm sources)
- Scroll indicator animation (bounces up/down)

## Where it's used

`app/page.tsx` (home page)
