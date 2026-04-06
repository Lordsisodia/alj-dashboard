# SharingSection

Two-column "Sharing & Presenting" section with tabbed features (Inspiration, Reports, Briefs). Left side has tabs + CTA box; right side has main image + overlaid message preview. Tabs control which feature content and images display.

| File | Purpose |
|------|---------|
| `index.tsx` | Root export; manages active tab state, renders layout |

## Props & Data

No props. Static `TABS` array with:
- id, label, icon, ctaLabel, ctaText, image, messageImage
- Button links to sign-up page

## Where it's used

Appears to be unused in main routing. Likely used in legacy sections or ProductPage.
