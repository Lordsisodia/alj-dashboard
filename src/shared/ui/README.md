# shared/ui

> UI primitives — shadcn/ui base components plus ISSO-specific extensions.
> Owner: shared (all dashboards)
> Import alias: `@/isso/ui/*`

## Two Categories of Components

### 1. shadcn/ui base components (lowercase filenames)
Generated from shadcn CLI. Do not edit directly — re-generate if you need to update.

| File | Component | Use |
|---|---|---|
| `button.tsx` | `Button` | Base button |
| `card.tsx` | `Card`, `CardContent`, etc. | Card primitives |
| `input.tsx` | `Input` | Text input |
| `textarea.tsx` | `Textarea` | Multi-line input |
| `select.tsx` | `Select` | Dropdown select |
| `badge.tsx` | `Badge` | Status badges |
| `skeleton.tsx` | `Skeleton` | Loading placeholders |
| `tabs.tsx` | `Tabs` | Tab primitives |
| `tooltip.tsx` | `Tooltip` | Tooltip wrapper |
| `progress.tsx` | `Progress` | Progress bar |
| `switch.tsx` | `Switch` | Toggle switch |
| `slider.tsx` | `Slider` | Range slider |
| `scroll-area.tsx` | `ScrollArea` | Custom scrollbar |
| `calendar.tsx` | `Calendar` | Date picker calendar |
| `dropdown-menu.tsx` | `DropdownMenu` | Context/dropdown menus |
| `label.tsx` | `Label` | Form label |
| `alert.tsx` | `Alert` | Alert box |

### 2. ISSO-specific extensions (PascalCase filenames)
Custom components built for this codebase.

| File | Component | Use |
|---|---|---|
| `DateRangePill.tsx` | `DateRangePill` | Date range selector pill |
| `CreatePresetModal.tsx` | `CreatePresetModal` | Save filter preset modal |
| `FeedbackModal.tsx` | `FeedbackModal` | User feedback collection |
| `FeedbackLog.tsx` | `FeedbackLog` | Feedback history display |
| `FeedControls.tsx` | `FeedControls` | Content feed control bar |
| `gradient-heading.tsx` | `GradientHeading` | Gradient text heading |
| `gradient-text.tsx` | `GradientText` | Inline gradient text |
| `stats-section.tsx` | `StatsSection` | Stats display block |
| `wave-background/` | `WaveBackground` | Animated wave backdrop |
| `avatar.tsx` | `Avatar` | User avatar with fallback |
| `notifications-menu.tsx` | `NotificationsMenu` | Notification dropdown |

## Naming Conventions

- **shadcn base:** lowercase kebab-case (`button.tsx`, `card.tsx`)
- **ISSO extensions:** PascalCase (`DateRangePill.tsx`, `FeedbackModal.tsx`)
- **Variants/subcomponents:** co-located in same file, exported as named exports
- **Index:** `index.ts` re-exports everything for clean imports

## Import Rules

- Import via `@/isso/ui/*` — not `@/shared/ui/*`
- For card styling in dark theme: use `stackedPanelClass` / `nestedCardClass` from `@/shared/ui/theme/cardLayers`
- Never install new chart libraries — all charts are custom Framer Motion bars
- Never create one-off card styles — use the card layer tokens

## ⚠️ Note on `@/components/ui/*`

Some components live at the **root** `components/ui/` (not `src/shared/ui/`), accessed via `@/components/ui/*`:
- `view-toggle.tsx` → `ViewToggle`
- `live-activity-button.tsx` → `LiveActivityButton`
- `status-strip.tsx` → `StatusStrip`
- `badge-tag.tsx` → `BadgeTag`

Check both locations before creating a new component.
