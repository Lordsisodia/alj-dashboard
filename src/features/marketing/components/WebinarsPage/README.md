# WebinarsPage

Full-page template for `/webinars` route. Renders hero with webinar replay list, "Why Attend" section, bottom CTA, and footer. Accepts both page data and replay array.

| File | Purpose |
|------|---------|
| `index.tsx` | Root export; composes Hero, WhyAttend, CTA, Footer |
| `WebinarsHero.tsx` | Page header + replay carousel |
| `WebinarsReplayList.tsx` | Carousel of past webinar recordings |
| `WebinarsWhyAttend.tsx` | Benefits/features of attending |
| `WebinarsBottomCTA.tsx` | Bottom call-to-action to register |
| `WebinarsSpeakerCTA.tsx` | "Become a speaker" form section |
| `data/webinars.ts` | Data types and sample webinar content |

## Props & Data

Accepts `{ data: WebinarsPageData; replays: WebinarReplay[] }` where:
- `data.hero`: title, description
- `data.whyAttend`: benefits cards
- `replays`: array of past webinar recordings

## Where it's used

`app/webinars/page.tsx`
