# Theme / Card Layers

Quick references for shared surface tokens used across partnerships UIs.

- `stackedPanelClass`: primary card layer with soft border/blurred shadow. Use for container panels and scrollable cards.
- `nestedCardClass`: second-level cards inside panels; slightly stronger border/shadow.
- `secondaryActionButtonClass`: neutral action buttons on dark backgrounds; maintains legible contrast.
- `primaryGradientButtonClass`: hero/CTA gradient; includes focus-visible outline for accessibility.

Guidelines
- Keep foreground text at least WCAG AA against the chosen background (these classes assume dark backgrounds).
- Prefer reusing these classes instead of duplicating long Tailwind strings; compose with `cn()` for layout-only tweaks.
- Avoid stacking multiple gradient surfaces; pair gradient buttons with solid/blurred cards to reduce visual noise.
- Mobile: allow cards to span full width; avoid nesting more than two layers deep.

Design tokens are intentionally minimal; extend locally only if a new token is justified and reused in ≥2 places.***
