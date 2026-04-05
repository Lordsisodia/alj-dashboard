# CollaborationSection

White card with rainbow testimonial illustration and sharing tabs.

## Structure

```
CollaborationSection/
├── index.tsx                    # Main component (49 lines)
├── data/
│   ├── testimonials.ts          # 7 testimonials (4 ray 1, 3 ray 2)
│   └── sharing-tabs.tsx         # Tab data with icons
├── ui/
│   ├── TestimonialTooltip.tsx   # Avatar hover tooltip
│   ├── RainbowIllustration.tsx   # Animated rainbow + rays
│   └── SharingPanel.tsx         # Tab switcher + CTA + image
└── README.md
```

## Layout

- Black section with 8px padding containing white card (36px radius)
- **White card extends full-width** — not constrained to 1216px
- Inner containers use `maxWidth: 1216px` to constrain content
- Header centered in first container
- Rainbow illustration full-width within white card
- Second container holds SharingPanel

## Key Features

- **7 testimonials** (4 on left ray, 3 on right ray)
- Testimonial tooltips: hover avatars to see quotes
- Tab switching: 3 tabs (Inspiration, Reports, Briefs) with live preview
- Animated rainbow: SVG with animated gradient position
- Image positioning: uses negative margins for Webflow-style layout

## Mobile

This component is desktop-focused. No mobile breakpoints present.

## Original Webflow CSS Values

### Image Sizing (.home-mockup)
```css
.home-mockup{width:auto;height:320px}
/* Original: width:auto (not 100%), height:320px (fixed) */
```

### Grid Alignment (.home-sharing)
```css
.home-sharing{align-items:center;display:flex}
/* Original: align-items:center (not stretch) */
```

### Tab Pane Container (.home-sharing-tab-pane-2)
```css
.home-sharing-tab-pane-2{height:320px}
.home-sharing-tab-pane-2.is-active{justify-content:center;align-items:center;display:flex}
```

### Padding on Grid (.home-sharing)
```css
.home-sharing{padding-top:96px}   /* First instance */
.home-sharing{padding-top:80px}   /* Later instance - final value */
```

## Key Spacing Findings

### Padding Stack Below Image (FIXED)
1. Parent container: `padding: 0 24px 80px` → **removed bottom 80px**
2. Grid container: `padding: 80px 80px 80px` → **changed to `padding: 80px 80px 0`**
3. **Result**: Zero padding below image, image now flush with bottom

### Image Size Issue
- Original: `width:auto, height:320px` (maintains aspect ratio)
- Our current: `width:100%, height:auto` (distorts proportions)
- **FIX NEEDED**: Change image to `width:auto, height:320px`

### Grid Alignment Issue
- Original: `align-items:center` (vertical center)
- Our current: `align-items:stretch` (makes columns equal height)
- **FIX NEEDED**: Change to `align-items:center`

## Changes Made

1. White card now extends full-width (was constrained to 1216px)
2. Added Christina Bell (Growth Lead @ Webtopia) to testimonials
3. Inner content constrained to 1216px via maxWidth on containers
4. Removed bottom 80px padding from parent container (index.tsx)
5. Removed bottom 80px padding from grid (SharingPanel.tsx)

## TODO

- [ ] Fix image sizing: `width:auto, height:320px` instead of `width:100%, height:auto`
- [ ] Fix grid alignment: `align-items:center` instead of `align-items:stretch`
- [ ] Verify image positions match original (message overlay positions)
