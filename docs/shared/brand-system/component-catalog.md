# Component Catalog & Page Inspirations

Use this file while we walk page-by-page through both experiences. Each section logs what we like, what should change, and whether the element is a candidate for a shared package or stays app-specific.

## How to log feedback
1. Duplicate the “Page Review” table for every screen you audit.
2. Paste screenshots or Figma links in the `Reference` column (local paths or cloud URLs).
3. Summarise what needs to stay in `Keeps` and what to iterate on in `Future improvements`.
4. When we freeze a component, move it into the “Approved Library” table and link its implementation.

## Approved library (initial pass)

| Component / Pattern | Source File | Notes |
| --- | --- | --- |
| CTA Button | `components/ui/button.tsx` | Gradient-ready variants (`variant=default` uses `bg-siso-orange`), focus ring already matches brand |
| Card primitives | `components/ui/card.tsx` | Aligns with dark surfaces (`bg-siso-bg-secondary`) and supports outlines |
| Glow Divider | `src/domains/shared/ui/components/GlowDivider.tsx` | Animated gradient accent for section separators (`variant: orange \| cyan`) |
| Falling Pattern background | `src/domains/shared/components/falling-pattern/FallingPattern.tsx` | Motion background tied to `--primary`; configurable density for hero blocks |
| Menu chrome | `src/app/globals.css` `.menu*` rules | Defines nav pill styling + icon bounce; reuse for mobile navs |
| Highlight hero card | `components/ui/card-5-static.tsx` | `HighlightCard` with `color="orange"` drives hero sections across Academy/Earnings; radial dot grid + uppercase tracking props baked in |
| SettingsGroupCallout shell | `src/domains/partnerships/portal-architecture/settings/menu/SettingsGroupCallout.tsx` | Standard outer wrapper (`rounded-[26px]`, `border-white/10`, `bg-siso-bg-secondary`) for dashboard callouts; include icon pill + uppercase `[11px]` label |
| Custom dropdown | `src/domains/partnerships/portal-architecture/settings/general/ui/CustomDropdown.tsx` | Rounded-lg trigger, `border-siso-border/60`, description rows, search field with `Search` icon, active option border-l accent + `bg-siso-orange/10` |
| Training spotlight stack | `src/domains/partnerships/portal-architecture/academy/ui/training-spotlight/TrainingSpotlightScreen.tsx` | Waves bg + scrim cards (`border-white/5`, `bg-[#1F1F1F]`), uppercase chips (“Current priority”), gradient progress bars; candidate for reusable `SpotlightCard` |
| Pitch asset pills | `src/domains/partnerships/portal-architecture/academy/ui/pitch-kit/PitchKitScreen.tsx` | Orange text ghost pills for metadata (“Public”, “Partner”, tags); keep uppercase tracking 0.3em |
| Stage mix bar | `src/app/partners/pipeline-ops/page.tsx` | Multi-color segmented bar w/ legend for prospect stages; uses palette `bg-orange-300/amber/yellow/lime/emerald/white` over `bg-white/10` base |
| Tier/XP pills | `src/domains/partnerships/05-earnings/ui/tier-progression/EarningsTierProgressionBoard.client.tsx` | Chips for XP thresholds + commission; backgrounds `bg-white/10` or `bg-siso-orange/15` with uppercase text |
| Dotted panel | `src/domains/partnerships/05-earnings/ui/challenges/EarningsChallengesScreen.tsx` | `border-dashed border-white/20` block under “Rules & eligibility”; helpful texture to break solid stacks |
| Community widget card | `src/app/partners/community/page.tsx` (`CommunityWidgetCard`, `StatTile`) | Rounded-[26px] cards (`border-white/10` + `bg-white/[0.04]`), gradient progress strips, uppercase `[11px]` helper text; StatTile highlights key stats with optional `bg-white/20` |

Update this table once a component or style is ready for reuse across client + partner apps.

## Page review template

| Page / Route | Section / Block | Reference | Keeps (what we liked) | Future improvements | Next action | Owner |
| --- | --- | --- | --- | --- | --- | --- |
| `/partners/dashboard` | Revenue summary hero | _link to screenshot_ | Gradient cards feel on-brand; data badges stand out | Needs GlowDivider accent at base | Promote to shared component | — |

## Page review – `/partners/academy`

| Page / Route | Section / Block | Reference | Keeps (what we liked) | Future improvements | Next action | Owner |
| --- | --- | --- | --- | --- | --- | --- |
| `/partners/academy` | Hero HighlightCard (`color="orange"`) | `src/domains/partnerships/portal-architecture/academy/dashboard/cards.tsx:41` | Orange radial gradient card with uppercase tracking (0.35em) nails the hero tone. Corner icon hides to keep layout clean. | Need variant spec for other hubs (Pitch Kit, Courses) so color tokens stay consistent. | Document theme tokens in `color-system.md`; add reusable prop presets. | — |
| `/partners/academy` | “My Progress” callout (outer shell + widget) | `src/domains/partnerships/portal-architecture/academy/dashboard/cards.tsx:62` | Three-tone card stack: outer `SettingsGroupCallout` (`rounded-[26px] border border-white/10 bg-siso-bg-secondary`), inner `siso-inner-card` (`border-white/10 bg-white/5`), progress widget with gradient bar `from-orange-300 via-orange-400 to-orange-500`. Icon badge uses `Sparkles` in `h-8 w-8` circle (`bg-white/5`, `text-siso-orange`); title typography is `[11px] uppercase tracking-widest text-siso-text-primary`. | Capture border opacity (white/10) + text styles so future cards don’t deviate; decide if gradient bar should switch to tokenized `siso-orange` scale. | Promote this card layout to a named component (e.g., `AcademyStatCard`) and add spec to this catalog. | — |
| `/partners/academy/training-spotlight` | “Why now” + “Next steps” detail blocks | `src/domains/partnerships/portal-architecture/academy/ui/training-spotlight/TrainingSpotlightScreen.tsx:64` | Waves bg, scrim cards (`border-white/5`, `bg-[#1F1F1F]`), uppercase chips (“Current priority”), orange bullets, pill tags with orange text. | Abstract to `TrainingSpotlightCard` so content swaps don’t clone markup. | Spec typography + spacing; add to shared components backlog. | — |
| `/partners/academy/training-spotlight` | Outcome + proof pills | same file lines 90-140 | Rounded-full border-white/10 pills with `text-siso-text-muted` or `text-siso-orange`; consistent uppercase spacing. | Need tokenized pill variants (neutral + orange). | Document pill palette in `color-system.md`. | — |
| `/partners/academy/pitch-kit` | Asset cards + filter pills | `src/domains/partnerships/portal-architecture/academy/ui/pitch-kit/PitchKitScreen.tsx:19` | Hero highlight matches brand; asset cards use uppercase type labels + status pills (“Public”, “Partner”) and tag chips with orange text. | White borders look flat—switch to darker border tokens; ensure consistent padding. | Open issue to darken backgrounds; spec `PitchAssetCard`. | — |

## Page review – `/partners/community`

| Page / Route | Section / Block | Reference | Keeps (what we liked) | Future improvements | Next action | Owner |
| --- | --- | --- | --- | --- | --- | --- |
| `/partners/community` | Hero + Community Spaces grid | `src/app/partners/community/page.tsx:1` | Orange HighlightCard hero with Waves BG; CommunityWidgetCard delivers glass panels (`border-white/10 bg-white/[0.04]`), gradient progress bar, uppercase helper chips, CTA pill `bg-white/15`. | Componentize widget + StatTile so other surfaces stay consistent; capture orange gradient token. | Add `CommunityWidgetCard` spec + gradient entry in `color-system.md`. | — |
| `/partners/community` | Messages / Partners / Help variants | `src/app/partners/community/page.tsx:200` | Variant shells reuse same structure with stat tiles, bar charts, emerald availability gradient, queue pills. | Need palette tokens for emerald gradient + queue chips; ensure call-to-action buttons documented. | Extend spec with variant props + palette tokens. | — |

## Page review – `/partners/pipeline-ops`

| Page / Route | Section / Block | Reference | Keeps (what we liked) | Future improvements | Next action | Owner |
| --- | --- | --- | --- | --- | --- | --- |
| `/partners/pipeline-ops` | Form completion gradient bar | `src/app/partners/pipeline-ops/page.tsx:138` | Same gradient recipe as Academy progress (orange 300→500), uppercase label `Form completion`, rounded-full container `bg-white/10`. | Turn gradient into token/utility; confirm accessible contrast when exported to light themes. | Extract `GradientProgressBar` component + doc entry. | — |
| `/partners/pipeline-ops` | Stage mix segmented bar + legend | `src/app/partners/pipeline-ops/page.tsx:189` | Multi-color segments w/ matching legend chips; communicates pipeline health quickly. | Needs official palette and sizing token so other funnels match. | Document stage color assignments; consider CSS vars per stage. | — |

## Page review – `/partners/earnings`

| Page / Route | Section / Block | Reference | Keeps (what we liked) | Future improvements | Next action | Owner |
| --- | --- | --- | --- | --- | --- | --- |
| `/partners/earnings/achievements` | Hero + Trophy case | `src/domains/partnerships/05-earnings/ui/achievements/EarningsAchievementsScreen.tsx:19` | Reuses orange hero + Waves background; Trophy case uses bordered dark cards, progress bar, uppercase helper chips. | Align chip colors with `Badge` variants; consider reusing `ControlStat` everywhere. | Spec `ControlStat` + `CalloutCTA` components. | — |
| `/partners/earnings/achievements` | Orange CTA pills | same file lines 70-100 | Buttons with orange background + uppercase tracking provide secondary action style. | Document as `CTA pill` token; ensure accessible contrast on white backgrounds. | Add to component list once reused. | — |
| `/partners/earnings/challenges` | Rules & eligibility dotted block | `src/domains/partnerships/05-earnings/ui/challenges/EarningsChallengesScreen.tsx:150` | `border-dashed border-white/20` adds variety; countdown chip uses `Clock3` + uppercase copy. | Make `DottedPanel` utility; confirm dash color tokens exist. | Capture in color/tokens doc. | — |
| `/partners/earnings/challenges` | Challenge cards (progress + badges) | same file lines 200-320 | Mix of gradient progress, status badges (emerald/amber), and orange action pills; nice candidate for missions UI. | Need consistent badge palette + padding; ensure progress component reused. | Spec `ChallengeCard` + align with missions. | — |
| `/partners/earnings/tier-progression` | XP + commission pills | `src/domains/partnerships/05-earnings/ui/tier-progression/EarningsTierProgressionBoard.client.tsx:200` | Chips highlight XP thresholds, commission %, next tier; backgrounds `bg-white/10` or `bg-siso-orange/15`. | Document pill variants + spacing so other dashboards duplicate the look. | Promote to `TierPill` component spec. | — |

## Page review – `/partners/academy/my-progress`

| Page / Route | Section / Block | Reference | Keeps (what we liked) | Future improvements | Next action | Owner |
| --- | --- | --- | --- | --- | --- | --- |
| `/partners/academy/my-progress` | Hero highlight + Awards icon | `src/domains/partnerships/portal-architecture/academy/ui/getting-started/GettingStartedScreen.tsx:1` | Hero matches brand pattern with Awards badge icon, metric+label text. | Document Awards icon usage + color tokens. | Link hero preset in spec. | — |
| `/partners/academy/my-progress` | Tier progress block | same file lines 40-110 | `SettingsGroupCallout` + `siso-inner-card` layering, crest image overlay, orange progress bar, Info chip, ghost CTA. | Need tokens for inner-card colors/shadows + gradient overlay instructions. | Create `TierProgressCard` spec + add tokens to `color-system.md`. | — |
| `/partners/academy/my-progress` | XP feed + certificate stats | same file lines 100-160 | XP cards use `siso-inner-card-strong`, source pills, XP text `text-siso-orange`; certificate tiles are ghost stat cards (`border-white/10 bg-white/[0.03]`). | Document ghost stat card + pill variants; confirm XP text token. | Add `XPFeedItem` + `GhostStatCard` entries. | — |

Feel free to add additional columns (notes, status, due dates) as we learn what cadence works best. When a section moves into implementation, open an ADR or ticket and cross-link it here so we can track progress.
