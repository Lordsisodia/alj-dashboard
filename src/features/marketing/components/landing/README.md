# landing/

Page sections. Assembled by `app/` routes to build each page.

## Active sections

| Component | Used by | How to extend |
|-----------|---------|---------------|
| `ComparisonTable.tsx` | `/pricing` | Add rows to `COMPARISON_ROWS` array inside the file |
| `PricingCards.tsx` | `/pricing` | Edit plan data in the `PLANS` constant |
| `PricingHeader.tsx` | `/pricing` | Edit headline/subheadline directly |
| `EnterpriseSection.tsx` | `/pricing` | Edit `ENTERPRISE_EXTRAS` array for feature bullets |
| `FAQSection.tsx` | `/pricing` | Add to `FAQ_ITEMS` array: `{ q: '...', a: '...' }` |
| `ReadyToShipCTA.tsx` | `/pricing` | Edit CTA copy directly |

## Data-driven subfolders

| Folder | Purpose |
|--------|---------|
| `FeatureSection/` | Alternating feature rows. Add features in `data/features.ts`. |

## Adding a new section

Simple (≤8 items hardcoded): single file `NewSection.tsx`

Data-driven:
```
NewSection/
├── index.tsx          # Component — maps over data
├── data/items.ts      # export const items = [{ id, ... }, ...]
└── ui/Card.tsx        # Renders one item
```

## Styling tokens

```
bg:         #020308  /  rgba(2,3,8,0.94)
text muted: rgba(255,255,255,0.45)
border:     rgba(255,255,255,0.06)
red accent: #E31B23
mobile:     768px breakpoint via <style> tag
```
