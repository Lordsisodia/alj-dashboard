# HomeCTA Component

## Structure

```
HomeCTA/
└── index.tsx    # Main component (84 lines)
```

## Purpose

Final CTA section before footer with headline, subtext, two buttons, and a large dashboard image.

## Layout

```
<section>                    # black background, overflow hidden
  <div.home-cta>           # max-width 1216px, centered, padding-top 108px
    <div.section-head>     # headline wrapper, z-index 2
      <h2>                 # "Ready to ship more winning ads?"
      <p>                  # "Unlock the power..."
    <div.main-cta-buttons> # buttons wrapper, z-index 2, gap 12px
      <a.button-primary>    # white bg, "Start free trial"
      <a.button-secondary>  # transparent, border, "View Pricing"
    <div.home-cta-image-wrapper>  # margin: 0 -80px -20%
      <img>                # dashboard screenshot
```

## Styling

### Extracted Constants
- `HEADLINE_STYLE` - h2 typography
- `PARAGRAPH_STYLE` - paragraph typography
- `ChevronIcon` - arrow SVG component

### Key CSS Values
| Element | Property | Value |
|---------|----------|-------|
| Container | padding-top | 108px |
| Container | gap | 36px |
| Headline | font-size | clamp(2rem, 4vw, 2.75rem) |
| Headline | font-weight | 600 |
| Headline | line-height | 54px |
| Paragraph | font-size | 18px |
| Paragraph | color | rgba(255,255,255,0.36) |
| Paragraph | max-width | 640px |
| Buttons | gap | 12px |
| Image wrapper | margin | 0 -80px -20% |

## Making Changes

### Change headline text
Edit lines 46-47 in index.tsx

### Change subtext
Edit lines 49-50 in index.tsx

### Change button text
Edit button text in the `<span>` elements (lines 59 and 68)

### Change button links
Edit `href` values in the `<a>` elements:
- Primary: line 56
- Secondary: line 66

### Adjust image positioning
The image wrapper has `margin: '0 -80px -20%'` which:
- `0` = no top/bottom margin
- `-80px` = extends 80px past left/right edges
- `-20%` = pulls image up 20% of its height

### Change image
Edit the `src` attribute on line 74

## Classes for Reference

| Class | Applied To |
|-------|------------|
| `home-cta` | Main container div |
| `section-head is-large` | Headline wrapper |
| `home-cta-headline` | h2 element |
| `home-cta-headline-p` | paragraph element |
| `main-cta-buttons` | Buttons wrapper |
| `home-cta-image-wrapper` | Image wrapper div |
| `home-cta-image` | Image element |
