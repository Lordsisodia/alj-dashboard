# FeaturesSection

3-column feature grid with "Miles beyond the status quo" headline.

## Structure

```
FeaturesSection/
├── index.tsx          # Main component (44 lines)
├── data/
│   ├── features.ts    # Feature data (titles, descriptions, images, hrefs)
│   └── icons.tsx      # SVG icon map by feature id
├── ui/
│   └── FeatureCard.tsx  # Card component with icon, image, link
└── README.md
```

## Layout

- 3-column grid on desktop, single column on mobile
- Middle card has slightly different border color (`#171920` vs `rgba(255,255,255,0.06)`)
- Responsive breakpoint: 768px

## Adding a Feature

1. Add entry to `data/features.ts`:
```ts
{
  id: 'new-feature',
  title: 'New Feature',
  description: 'Description here.',
  image: 'https://...',
  buttonText: 'Learn More',
  href: '/new-feature',
}
```

2. Add icon to `data/icons.tsx`:
```ts
'new-feature': <svg ... />,
```

## Styling

Inline styles (Webflow convention). Key values:
- Section padding: 120px top/bottom (64px mobile)
- Card padding: 32px
- Card radius: 24px
- Grid gap: 24px
