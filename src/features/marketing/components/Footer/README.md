# Footer Component

## Structure

```
Footer/
├── index.tsx              # Main container - composes all parts
├── Products.tsx           # Product badges row (5 products with icons)
├── Company.tsx            # Logo + review ratings (Chrome Web Store, G2)
├── Links.tsx              # 5-column link grid + AdCount
├── Social.tsx             # Social media icons row
├── AdCount.tsx            # "54,683,980 ads" display with sparkline
├── AskAI.tsx              # "Ask AI about Foreplay.co" + chat buttons
└── ui/
    ├── CategorySection.tsx # Reusable category (label + link list)
    └── FooterLink.tsx     # Reusable individual link
```

## Layout Order (top to bottom)

1. **Products row** - Horizontal flex with 5 product badges
2. **Divider** - 1px white/16% opacity line
3. **Company row** - Logo + 2 review badges
4. **Divider**
5. **Links grid** - 5 columns on desktop, 2 on mobile
   - Product | Resources | Solutions | Company+Community (stacked) | Ad Count
6. **Ask AI** - Full width, centered
7. **Divider**
8. **Copyright** - Legal links + social icons

## Responsive Breakpoints

| Breakpoint | Columns |
|------------|---------|
| < 768px   | 2 cols  |
| >= 768px  | 5 cols  |

## Key CSS Classes (Tailwind)

- `max-w-[1216px]` - Container max width
- `gap-9` / `gap-4` - Section spacing
- `grid-cols-5` - 5-column layout on desktop
- `border-white/[0.06]` - Subtle borders

## Adding New Link Categories

Edit `Links.tsx` - add to `LINK_CATEGORIES` array:

```typescript
{
  label: 'Category Name',
  links: [
    { href: '/path', children: 'Link Text' },
    { href: 'https://external.com', children: 'External', external: true },
  ],
},
```

## Adding New Social Icons

Edit `Social.tsx` - add to `SOCIAL_LINKS` array:

```typescript
{
  label: 'platform-name',
  href: 'https://url.com',
  icon: <SvgComponent />,
},
```

## Data Flow

- All link data is defined inline in `Links.tsx`
- Product data is inline in `Products.tsx`
- Social links are inline in `Social.tsx`
- No external data fetching - fully static

## Styling Notes

- Uses `Inter` font via inline styles
- Colors: `rgba(255,255,255,0.68)` for muted text
- Footer uses `bg-black` background
- White card sections use `bg-white` with rounded corners
