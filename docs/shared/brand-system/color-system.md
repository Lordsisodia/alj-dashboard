# Color System (Source of Truth)

| Tier | Token | Value | Usage |
| --- | --- | --- | --- |
| Core Brand | `--siso-red` | `#FF5722` | Hero accents, CTA gradients (left side) |
|  | `--siso-orange` | `#FFA726` | CTA gradients (right side), focus rings, data highlights |
|  | `--siso-black` | `#000000` | Deep shadows, overlay contrast |
| Surfaces | `--siso-bg-primary` | `#121212` | Base page background, screen body |
|  | `--siso-bg-secondary` | `#1A1A1A` | Outer cards / first layer |
|  | `--siso-bg-tertiary` | `#242424` | Inner scrim (`.siso-inner-card`) when stacking |
|  | `--siso-bg-hover` | `#2A2A2A` | Deepest inner scrim (`.siso-inner-card-strong`) or hover state |
|  | `--siso-bg-active` | `#333333` | Active / pressed states |
| Text | `--siso-text-primary` | `#FFFFFF` | Headlines, key stats |
|  | `--siso-text-secondary` | `#F5F5F5` | Body text on dark backgrounds |
|  | `--siso-text-muted` | `#B8B8B8` | Labels, helper copy |
|  | `--siso-text-disabled` | `#757575` | Disabled controls |
| Borders | `--siso-border-primary` | `#2A2A2A` | Default card borders |
|  | `--siso-border-secondary` | `#3A3A3A` | Elevated dividers |
|  | `--siso-border-hover` | `#4A4A4A` | Hover/focus outlines |
|  | `--siso-border-active` | `#5A5A5A` | Selected state outlines |
| Status | `--siso-success` | `#4CAF50` | Positive banners, chips |
|  | `--siso-warning` | `#FF9800` | Warnings, upgrade nudges |
|  | `--siso-error` | `#F44336` | Errors, destructive actions |
|  | `--siso-info` | `#2196F3` | Information callouts |
| Stage mix | `--siso-stage-prospect` | `#FD9A5E` | Prospecting/early funnel chips + StageMixBar |
|  | `--siso-stage-qualified` | `#FEC260` | Qualified/needs discovery |
|  | `--siso-stage-proposal` | `#FFE083` | Proposal decks/threads |
|  | `--siso-stage-negotiation` | `#C8F46E` | Negotiation/closing prep |
|  | `--siso-stage-won` | `#6FE5B4` | Closed-won segments + CTA badges |
|  | `--siso-stage-lost` | `rgba(255,255,255,0.35)` | Lost/archived rows |
| Gradients | `--siso-gradient-primary` | `linear-gradient(135deg, #FF5722 0%, #FFA726 100%)` | CTA backgrounds, glowing dividers |
|  | `--siso-gradient-hover` | `linear-gradient(135deg, #FF5722 0%, #FFB038 100%)` | CTA hover state |
|  | `--siso-gradient-text` | `linear-gradient(90deg, #FF5722 0%, #FFA726 100%)` | Gradient text utilities (`.siso-gradient-text`) |
| Shadows | `--siso-shadow-sm` | `0 1px 2px 0 rgba(0,0,0,0.5)` | Small cards |
|  | `--siso-shadow-md` | `0 4px 6px -1px rgba(0,0,0,0.5), 0 2px 4px -1px rgba(0,0,0,0.3)` | Default depth (`shadow-siso`) |
|  | `--siso-shadow-lg` | `0 10px 15px -3px rgba(0,0,0,0.5), 0 4px 6px -2px rgba(0,0,0,0.3)` | Dialogs |
|  | `--siso-shadow-xl` | `0 20px 25px -5px rgba(0,0,0,0.5), 0 10px 10px -5px rgba(0,0,0,0.3)` | Spotlight elements |
| Glow | `--siso-glow-orange` | `0 0 20px rgba(255, 167, 38, 0.3)` | Animated dividers |
|  | `--siso-glow-red` | `0 0 20px rgba(255, 87, 34, 0.3)` | Alternating glow effect |

> **Source files:** `src/domains/shared/styles/color-system.css` feeds the CSS variables and gradient helpers. Tailwind classes map to them via `tailwind.config.ts` (see the `siso.*` color entries plus the `chart`, `primary`, `secondary`, etc. tokens). Keep both files in sync when updating values.

## Surface stacking recipe

Use these tokens whenever a layout nests cards inside each other (e.g., Settings callouts, Academy/Earnings stacks):

| Layer | Token / Class | Example (Academy dashboard) | Notes |
| --- | --- | --- | --- |
| Outer wrapper | `bg-siso-bg-secondary` + `border-white/10` (see `SettingsGroupCallout`) | `<SettingsGroupCallout>` container in `academy/dashboard/cards.tsx` | First panel sitting on the page background. |
| Inner card | `.siso-inner-card` → `background-color: var(--siso-bg-tertiary)` | `div` wrapping each widget: `className="... siso-inner-card p-4 border border-white/10 ..."` | Used for nested grids, XP cards, spotlight content. |
| Deep scrim / emphasis | `.siso-inner-card-strong` → `background-color: var(--siso-bg-hover)` | XP feed rows (`className="... siso-inner-card-strong ..."`) | Use sparingly for emphasized rows (XP feed items, nested lists). |

Every layer keeps the same semi-transparent border (`border border-white/10`) and uses the prescribed shadow (`shadow-[0_12px_28px_rgba(0,0,0,0.3)]` in Academy) so the light-to-dark stack matches what you see on `/partners/academy`. If a component needs an “active” feel inside the stack, use `bg-siso-bg-active` only for pressed states.

## Typography & Spacing

- **Fonts:** Default sans (Inter) via `tailwind.config.ts` `fontFamily.sans` and fallback `var(--font-sans, "Inter", sans-serif)` in `src/app/globals.css`. Display also uses Inter; add Geist / JetBrains tokens via CSS variables if a page needs a mono accent.
- **Radius:** `--radius: 0.8rem` with derived `md`/`sm` radii in Tailwind’s `borderRadius` extension. Keep CTA buttons / cards aligned with these tokens unless a spec explicitly overrides them.
- **Spacing scale:** Use Tailwind defaults + container padding `1.5rem` with max width `1400px` at `2xl`. Record any new spacing tokens here before adding ad-hoc values in components.

## Design Ops Checklist

1. When you approve a new color, add the CSS variable in `color-system.css`, extend tailwind tokens, and document it above.
2. If a page introduces a custom gradient or glow, copy the recipe into the Gradients / Glow section so we can evaluate whether it becomes a reusable helper.
3. For print-friendly overrides (see `src/app/globals.css`), make sure any new brand colors degrade gracefully (ink-friendly).
4. Link ADRs if a palette change coincides with a product or architecture decision.
