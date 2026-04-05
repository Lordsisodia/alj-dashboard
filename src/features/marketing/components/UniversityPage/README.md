# UniversityPage

Full-page template for `/university` route. Renders hero, campus section with professor feature, bottom CTA, navbar, and footer.

| File | Purpose |
|------|---------|
| `index.tsx` | Root export; composes Hero, Campus, CTA, Footer |
| `UniversityHero.tsx` | Page header with headline and description |
| `UniversityCampusSection.tsx` | Campus info + professor bio/photo |
| `UniversityBottomCTA.tsx` | Bottom call-to-action section |
| `data/university.ts` | Data object with hero, campus, professor, bottomCta |

## Props & Data

No props. Uses `universityData` imported from `data/university.ts`.

## Where it's used

`app/university/page.tsx`
