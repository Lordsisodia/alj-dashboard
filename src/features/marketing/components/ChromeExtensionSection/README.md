# ChromeExtensionSection

Product feature section showcasing the Chrome extension. Contains card layout with logo, stats, and CTA. Responsive: logo floats right on desktop, stacks on mobile.

| File | Purpose |
|------|---------|
| `index.tsx` | Root export; wraps section styling and responsive CSS |
| `ui/ChromeExtensionCard.tsx` | Card content: logo, features, stats, CTA link |

## Props & Data

No props. Static content: extension name, description, install link, badge stats.

## Where it's used

`ProductSection` component (included via import in ProductPage)
