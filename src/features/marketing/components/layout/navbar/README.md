# navbar/

Sticky navigation bar with three mega-dropdowns.

## Files

| File | Purpose |
|------|---------|
| `NavBar.tsx` | Root component — composes dropdowns, mobile menu |
| `ProductDropdown.tsx` | Products menu (Hub, Intelligence, Recon, Agents, Content Gen) |
| `SolutionsDropdown.tsx` | Solutions menu — OFM featured card + coming-soon verticals |
| `ResourcesDropdown.tsx` | Resources menu — Learn + Earn sections |
| `DropdownContainer.tsx` | Shared dropdown wrapper (positioning, backdrop) |
| `nav.data.ts` | **All nav content** — every link, label, href, description |
| `nav.icons.tsx` | All SVG icons for dropdowns |
| `nav.constants.ts` | Shared constants (hover delay) |
| `SpriteIcon.tsx` | Animated sprite renderer for product hover icons |

## Adding a nav item

**New product** (Products dropdown):
1. Add to `RESEARCH` or `ANALYTICS` in `nav.data.ts`
2. Add icon to `nav.icons.tsx` + sprite entry if animated

**New solution vertical:**
1. Add to `SOLUTIONS_COMING_SOON` in `nav.data.ts` — auto-renders with "Soon" badge
2. To activate: promote to `SOLUTION_FEATURED`, update `SolutionsDropdown.tsx`

**New resource link:**
1. Add to `RESOURCES_LEARN` or `RESOURCES_EARN` in `nav.data.ts`
2. Add icon to the matching `RESOURCES_LEARN_ICONS` / `RESOURCES_EARN_ICONS` record in `nav.icons.tsx`

## Sprites

Self-hosted in `public/sprites/`. Format: `nav-spritesheet-160x160-{name}.png`.
Replace with ISSO-branded assets when ready — just swap the files, no code changes needed.

## Mobile

Hamburger at 991px. State: `mobileOpen` boolean in `NavBar.tsx`.
