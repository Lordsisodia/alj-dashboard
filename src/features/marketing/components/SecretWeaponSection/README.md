# SecretWeaponSection

"Before/After" comparison section showcasing content infrastructure benefits. Left card shows scattered process; right card (dark) shows ISSO pipeline with embedded video. Image in left card animates in on scroll.

| File | Purpose |
|------|---------|
| `index.tsx` | Root export; manages IntersectionObserver, GSAP animation |

## Props & Data

No props. Static content:
- Before: text + lazy-loaded image
- After: text + autoplay video (MP4/WebM from CDN)
- Responsive: stacks single-column on mobile

## Where it's used

`app/page.tsx` (home page)
