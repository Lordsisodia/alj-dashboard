# Blog

Blog index page for `/blog` route. Renders hero, list of blog post cards, and bottom CTA section.

| File | Purpose |
|------|---------|
| `index.tsx` | Root export; composes Hero, List, CTA, Footer |
| `BlogHero.tsx` | Page header with title and description |
| `BlogList.tsx` | Grid of blog post cards with images, excerpts, read time |
| `BlogCTA.tsx` | Call-to-action section to subscribe/explore more |

## Props & Data

No props (data imported from `./data/blog.ts`). Renders:
- Hero section with centered headline
- Post grid with pagination
- Bottom newsletter/CTA section

## Where it's used

`app/blog/page.tsx`
