# AffiliatesPage

Full-page template for `/affiliates` route. Assembles hero section with canvas background, 3-step "how it works" grid, FAQ accordion with toggleable items, and footer.

| File | Purpose |
|------|---------|
| `index.tsx` | Root export; composes Hero, Steps, FAQ, Footer |
| `data/affiliates.ts` | Typed data structure for hero, steps, faq content |

## Props & Data

Accepts `{ data: AffiliatesPageData }` where:
- `hero`: headline, subheading, CTA link
- `steps.cards`: 3-card grid with image, title, body
- `faq.items`: accordion items with question/answer pairs (HTML allowed in answers)

## Where it's used

`app/affiliates/page.tsx`
