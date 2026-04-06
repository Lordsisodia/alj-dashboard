# Typography, Spacing, and UI Geometry

> Use this file as the machine-readable reference for fonts, letter spacing, chip/button sizing, and layout geometry. When another AI needs to restyle a block, point it here plus the component catalog row for the visual.

## Font stacks

| Token | CSS / Tailwind source | Notes |
| --- | --- | --- |
| `font-sans` | `tailwind.config.ts → fontFamily.sans = ["Inter","sans-serif"]` | Default for all body + UI copy (`var(--font-sans, "Inter", sans-serif)` in `globals.css`). |
| `font-display` | same as sans | We keep displays uppercase instead of changing the font. |
| Mono / specialty | `--hu-font-jetbrains`, `--hu-font-geist` in `globals.css` | Only used for code/preview tiles; note explicitly if a block needs them. |

## Type scale & caps rhythm

| Token | Utility classes | Usage |
| --- | --- | --- |
| `hero-caps` | `text-2xl md:text-[28px] uppercase tracking-[0.35em] text-white` | HighlightCard titles, hero headings (Academy, Earnings, Community). |
| `hero-label` | `text-xs uppercase tracking-[0.3em] text-siso-text-muted` | Hero metrics / subtitles (e.g., “Tier • Level 2”). |
| `section-label` | `text-[11px] uppercase tracking-[0.3em] text-siso-text-muted` | Labels above cards (“Tier progress”, “Availability”, “Form completion”). |
| `micro-label` | `text-[10px] uppercase tracking-[0.25–0.3em] text-white/60` | Stats, progress helpers, pill badges, CTA helper text. |
| `body-primary` | `text-sm text-siso-text-secondary` | Card descriptions, detail text. |
| `body-muted` | `text-xs text-siso-text-muted` | Helper copy, timestamps, meta text (XP feed, partner entries). |
| `stat-value` | `text-3xl–4xl font-bold text-white` | Large counters (certificates, partner counts). |
| `pill-tag` | `text-[11px] uppercase tracking-[0.08em] text-white/70` | Source tags (“Course”, “Engagement”) inside XP feed cards. |

### Letter-spacing conventions

- `tracking-[0.35em]` → hero headings, hero descriptions, CTA headings.
- `tracking-[0.3em]` → CTA buttons, pills, stat labels, progress badges.
- `tracking-[0.25em]` → smaller progress labels (stage mix, availability, “Form completion”).
- `tracking-[0.08em]` → pill tags inside XP feed (`source` chips).

### Icon sizing

- Section icons inside `SettingsGroupCallout`: `h-4 w-4`.
- Hero icons (HighlightCard, Awards badge): `h-5 w-5`.
- Stat glyphs (Info, Clock3): `h-3.5 w-3.5`.

## Buttons, pills, and chips

| Component | Utility mix | Notes |
| --- | --- | --- |
| CTA button (hero/card) | `rounded-full px-4 py-3 text-xs font-semibold uppercase tracking-[0.3em] bg-white/20 text-white hover:bg-white/30` | Used for Academy cards, Community CTAs (`CalloutButton`). |
| Ghost CTA | `variant="ghost"` with `border border-white/15 rounded-2xl px-4 py-2 text-white` | Used in tier progress and pitch cards. |
| Status pill (neutral) | `rounded-full border border-white/10 px-3 py-1 text-[11px] text-siso-text-muted` | Default for tags, proof pills, queue chips. |
| Status pill (orange) | Add `text-siso-orange` and optionally `bg-white/10` to highlight (“Current priority”, XP gains). |
| Stage/XP pills | `rounded-full bg-siso-orange/15 text-siso-orange px-2.5 py-1` or `bg-white/10 text-white` per tier state. |

## Progress & bar geometry

| Pattern | Height | Colors |
| --- | --- | --- |
| Gradient progress bar | `h-2` (Academy) or `h-1.5` (Community room cards) with `rounded-full bg-white/10` base | Foreground gradient `from-orange-300 via-orange-400 to-orange-500`; document as `--siso-progress-gradient`. |
| Stage mix bar | `h-2.5` segmented flex container | Colors: `bg-orange-300`, `bg-amber-300`, `bg-yellow-300`, `bg-lime-300`, `bg-emerald-300`, `bg-white/30`. |
| Availability bar (partners widget) | `bg-gradient-to-r from-emerald-200 via-emerald-300 to-emerald-400` inside `h-1.5` base. |

## Card geometry & shadows

| Token | Value | Usage |
| --- | --- | --- |
| `card-radius-main` | `rounded-[26px]` | SettingsGroupCallout outer shell, Community widgets. |
| `inner-card` | `.siso-inner-card` in `globals.css` → `background-color: var(--siso-bg-tertiary)` | Nested scrims for Academy/Earnings cards. |
| `inner-card-strong` | `.siso-inner-card-strong` → `background-color: var(--siso-bg-hover)` | XP feed rows, highlight tiles. |
| `glass-shadow` | `shadow-[0_18px_35px_rgba(0,0,0,0.45)]` | Community widgets, Help Center cards. |
| `accent-shadow` | `shadow-[0_12px_28px_rgba(0,0,0,0.3)]` or `var(--siso-shadow-md)` | Standard card depth. |

## Layout spacing

- Containers: `px-4` on mobile, `px-8` on large screens, max widths `max-w-5xl` (Community, Spotlight) or `max-w-6xl` (My Progress).
- Vertical rhythm: hero block + `space-y-6` between sections. Keep section padding inside `SettingsGroupCallout` at `px-4 py-4`.
- Image cards: overlay gradient `bg-gradient-to-b from-black/45 via-black/25 to-transparent` to maintain legibility.

## Usage guidance for automation

1. **Typography first:** choose the token from the tables above (hero-caps, section-label, micro-label) instead of inventing new `tracking` or `font-size` values.
2. **Match geometry:** cards that look like existing callouts must use the `card-radius-main` + `glass-shadow` combination and the same `border-white/10`. Pills/buttons should use the shapes listed above.
3. **Progress bars:** when you see a gradient bar in mocks, use the `Gradient progress bar` row and update only the width/percentage, not the colors.
4. **Document deviations:** if a new design requires different fonts or spacing, add it here first so future automations stay aligned.
