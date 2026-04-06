# Component Presets (Quick Specs)

> Use these snippets when another AI needs to recreate a component without digging through code. Each preset lists the source file, expected props/structure, and the class/utility mix that enforces the brand look.

## 1. SettingsGroupCallout
- **Source:** `src/domains/partnerships/portal-architecture/settings/menu/SettingsGroupCallout.tsx`
- **Structure:** outer `<section>` → `.rounded-[26px] border border-white/10 bg-siso-bg-secondary shadow-[0_12px_30px_rgba(0,0,0,0.35)]`.
- **Header:** icon pill (`h-8 w-8 bg-white/5 text-siso-orange`), title `text-[11px] uppercase tracking-[0.3em]`, subtitle `text-xs text-siso-text-muted`.
- **Inner content:** wrap child blocks with `.px-3 pb-3` (or `.siso-inner-card` if stacking).

## 2. CommunityWidgetCard
- **Source:** `src/app/partners/community/page.tsx` (`CommunityWidgetCard`, `StatTile`).
- **Structure:** `<Link>` with `rounded-[26px] border border-white/10 bg-white/[0.04] p-4 shadow-[0_18px_35px_rgba(0,0,0,0.45)]`.
- **Progress bar:** `h-1.5 rounded-full bg-white/10` + foreground `bg-gradient-to-r from-orange-200 via-orange-300 to-orange-400`.
- **Entries:** rows with `rounded-2xl border border-white/10 bg-black/30 px-3 py-2`.
- **CTA footer:** `text-[11px] uppercase tracking-[0.3em] text-white/70`.
- **StatTile variant:** `rounded-2xl border border-white/10 px-3 py-2` + highlight state `bg-white/20` for emphasize, default `bg-black/30`.

## 3. TierProgressCard (My Progress)
- **Source:** `src/domains/partnerships/portal-architecture/academy/ui/getting-started/GettingStartedScreen.tsx`
- **Structure:** inner `.siso-inner-card` inside SettingsGroupCallout. Include crest image (`Image` + overlay `bg-gradient-to-b from-black/45`), label `text-[11px] uppercase tracking-[0.25em] text-white/70`.
- **Progress bar:** `h-3 rounded-full bg-white/5` with foreground `bg-siso-orange` width `tierPct%`.
- **Info chip:** `flex items-center gap-2 text-xs text-siso-text-muted` with `Info` icon `text-siso-orange`.
- **CTA:** `Button variant="ghost"` `className="w-full max-w-xs border border-white/15 rounded-2xl"` linking to tiers page.

## 4. GradientProgressBar
- **Source:** `academy/dashboard/cards.tsx` + `pipeline-ops/page.tsx`.
- **Base:** `div.h-2.w-full.rounded-full.bg-white/10`.
- **Fill:** child `div.h-full.rounded-full.bg-gradient-to-r.from-orange-300.via-orange-400.to-orange-500` with inline width `%`.
- **Label:** `text-[11px] uppercase tracking-[0.3em] text-white/60`.

## 5. StageMixBar
- **Source:** `src/app/partners/pipeline-ops/page.tsx`.
- **Structure:** `flex h-2.5 w-full overflow-hidden rounded-full bg-white/10`.
- **Segments:** child divs with stage color classes `{bg-orange-300, bg-amber-300, bg-yellow-300, bg-lime-300, bg-emerald-300, bg-white/30}` + inline width `(stage.count / total)*100`.
- **Legend chips:** `flex items-center gap-1.5 rounded-xl border border-white/10 bg-black/10 px-2.5 py-1.5 text-[9px] uppercase tracking-[0.25em] text-white/60`.

## 6. PitchAssetCard
- **Source:** `src/domains/partnerships/portal-architecture/academy/ui/pitch-kit/PitchKitScreen.tsx`.
- **Card:** `rounded-3xl border border-white/0 bg-[#181818] p-4 shadow-[0_18px_48px_rgba(0,0,0,0.32)]`.
- **Header:** type label `text-xs uppercase tracking-[0.35em] text-siso-text-muted`, title `text-lg font-semibold text-white`, status pill `rounded-full border px-3 py-0.5 text-[11px] uppercase tracking-[0.3em]` (emerald for public, amber for partner).
- **Tag pills:** `rounded-full border border-white/10 px-3 py-1 text-[11px] text-siso-text-muted`.
- **Links:** `Button size="sm"` with `border border-white/10 bg-white/5 text-white/90`. Related proof links use `border-white/10 text-siso-orange`.
- **TODO:** swap border color to `border-white/10` on outer card if we want less pure-white lines (see catalog note).

## 7. ChallengeCard (Earnings)
- **Source:** `src/domains/partnerships/05-earnings/ui/challenges/EarningsChallengesScreen.tsx`.
- **Shell:** `rounded-[24px] border border-white/10 bg-white/5 p-4 shadow-[0_20px_50px_rgba(0,0,0,0.35)]`.
- **Title row:** `text-base font-semibold text-white` + reward badge `Badge className="bg-siso-orange/20 text-siso-orange"`.
- **Progress:** reuse GradientProgressBar (height `h-2`). Completion label `text-[11px] uppercase tracking-[0.3em] text-white/60`.
- **Action rows:** `rounded-2xl border border-white/10 bg-black/20 px-3 py-2 text-sm`. Completed state adds `border-emerald-400/40 bg-emerald-400/10 text-emerald-100`.
- **Buttons:** primary `Button size="sm" className="rounded-2xl"`; optional team badge `Badge className="bg-white/10 text-white/80"`.

## 8. XPFeedItem
- **Source:** `GettingStartedScreen.tsx` (XP activity).
- **Card:** `flex items-center justify-between rounded-xl siso-inner-card-strong px-3 py-2`.
- **Left column:** title `font-semibold`, meta row `text-[11px] text-siso-text-muted` with source pill `rounded-full bg-white/[0.08] px-2 py-[2px] uppercase tracking-[0.08em]`.
- **Right column:** `text-sm font-bold text-siso-orange` (`+120 XP`).

## 9. Community CTA Button
- **Source:** `CalloutButton` in `src/app/partners/community/page.tsx`.
- **Styles:** `Button asChild className="mt-4 w-full rounded-full bg-white/15 px-4 py-3 text-xs font-semibold uppercase tracking-[0.3em] text-white hover:bg-white/25"`.
- Use this for secondary CTAs on dark backgrounds.

Add more presets as we formalise new patterns. Keep each snippet tied to a source file so automation agents can cross-check the live implementation.
