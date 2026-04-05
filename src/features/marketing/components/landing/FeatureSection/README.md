# FeatureSection

Three-row feature showcase with alternating layout and accent colors (orange/amber).

## Structure

```
FeatureSection/
├── index.tsx              # Main component (72 lines)
├── data/
│   └── features.ts        # Feature data array (3 items: research, analytics, collaboration)
├── ui/
│   └── FeatureCard.tsx    # Visual card with accent gradient
└── README.md
```

## Layout

- 2-column grid: text (left) + card (right)
- Flip pattern: odd rows flip order with `order: 2/1` CSS
- Row borders (bottom) on flipped rows; 80px spacing
- Responsive: stacks to single column below 768px

## Adding a Feature

1. Add entry to `data/features.ts`:
```ts
{
  id: 'feature-id',
  label: 'Section Label',                // Small uppercase label
  heading: 'Main Headline',              // Large (clamp 24-36px)
  subtext: 'Description text',           // 16px, 60% opacity
  bullets: ['Bullet 1', 'Bullet 2'],     // Orange dot + text
  visual: { label: 'LABEL', value: '94%', sub: 'metric', accent: '#FF5722' },
  flip: false,  // true = visual on left
}
```

2. FeatureCard renders: accent circle gradient + label + large value + subtext. Customize the rendered value in FeatureCard.tsx if needed.

## Styling

Inline CSS. Accent color from `visual.accent` passed to FeatureCard as border/gradient tint. Label color: #FF5722 (orange).

## Responsive

Below 768px: grid becomes single column with 80px gaps between rows.
