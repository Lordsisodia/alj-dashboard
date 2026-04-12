# ISSO Dashboard — Design System Reference

> Extracted from source truth: `ISSO_UI_RULES.md`, `ISSO_DASHBOARD_CONTEXT.md`, and live feature pages.
> Last updated: 2026-04-12
> **This is the locked style guide. No deviation. No one-off classes.**

---

## 1. Page Layout Pattern

Every page follows this exact structure:

```
<outer canvas>                          bg-black p-5 gap-5 flex
  <IssoSidebarShell />                  dark sidebar, 64px collapsed / ~280px expanded
  <main bg-white rounded-2xl>           white content card, flex-1
    <ContentPageShell>                  universal template — owns header + tabs + filter bar
      <div className="flex-1 overflow-y-auto px-6 py-6">
        {tab content}
      </div>
    </ContentPageShell>
  </main>
</outer canvas>
```

### ContentPageShell internal structure (3 rows, then content)

**Row 1 — Header bar (`h-14`, `px-3`)**
```
borderBottom: '1px solid rgba(0,0,0,0.07)'

Left:   [ProductIcon size={32}]  [text-sm font-semibold text-neutral-900]  [StatPill]
Center: absolute left-1/2 -translate-x-1/2 w-80 — search input or searchBarComponent
Right:  action button (gradient pill) + optional ChevronDown dropdown
```

**Row 2 — Sub-nav + filter bar (`px-3 py-2`, single row)**
```
borderBottom: '1px solid rgba(0,0,0,0.07)'

Left:  tab pills (inline-flex gap-1.5)
       → nextProduct arrow link (after last tab)
Right: filterRightSlot + AddFilterPill + ViewToggle
```

**Row 3 — Content area (`flex-1 overflow-hidden flex flex-col min-h-0`)**
```
children rendered here — each page manages its own scroll wrapper
standard: <div className="flex-1 overflow-y-auto px-6 py-6">
```

### File convention
```
src/features/{name}/
  components/
    {Name}FeaturePage.tsx   ← default export, the full page
    index.ts
  hooks/
  types.ts

src/app/isso/{name}/page.tsx  ← thin wrapper only:
  import { NameFeaturePage } from '@/features/name/components';
  export default function NamePage() { return <NameFeaturePage />; }
```

### Import aliases
```ts
'@/isso/*'      → src/shared/*        // ISSO shared layout, UI
'@/features/*'  → src/features/*
'@/lib/*'       → src/lib/*
'@/components/*'→ ./components/*      // root level, not src/
```

---

## 2. Card Patterns

Import from: `@/shared/ui/theme/cardLayers` (alias resolves to `src/domains/partnerships/_shared/ui/theme/cardLayers.ts`)

```ts
import { stackedPanelClass, nestedCardClass } from '@/shared/ui/theme/cardLayers';
```

### 2a. stackedPanelClass — Outer card shell
```
rounded-[22px] border border-white/10 siso-inner-card shadow-[0_12px_28px_rgba(0,0,0,0.35)]
```
Use for: stat cards, feature cards, widget shells, any top-level card.

### 2b. nestedCardClass — Inner item / nested row
```
rounded-2xl border border-white/10 siso-inner-card-strong shadow-[0_10px_24px_rgba(0,0,0,0.35)]
```
Use for: rows inside a card, nested stats, inner panels.

### 2c. Stat card (label + value + meta)
```tsx
<div className={`${stackedPanelClass} p-5 text-white`}>
  <p className="text-[11px] uppercase tracking-[0.35em] text-white/60">{label}</p>
  <p className="text-2xl font-semibold text-white mt-1">{value}</p>
  <p className="text-xs text-white/70 mt-0.5">{meta}</p>

  <div className="mt-4 space-y-2">
    <div className={`${nestedCardClass} px-4 py-3 flex items-center justify-between`}>
      <span className="text-sm text-white/80">{itemLabel}</span>
      <span className="text-sm font-semibold text-white">{itemValue}</span>
    </div>
  </div>
</div>
```

### 2d. Icon card (feature card with icon + title + subtext)
```tsx
<div className={`${stackedPanelClass} p-5`}>
  <div className="flex items-start gap-3">
    <span className="inline-flex rounded-2xl border border-siso-orange/35 bg-siso-orange/10 p-2 text-siso-orange flex-shrink-0">
      <Icon size={18} />
    </span>
    <div className="flex-1 min-w-0">
      <p className="text-[11px] uppercase tracking-[0.35em] text-white/60">{label}</p>
      <p className="text-sm font-semibold text-white mt-0.5">{title}</p>
      <p className="text-xs text-white/70 mt-0.5">{subtext}</p>
    </div>
    <ArrowRight className="h-4 w-4 text-white/40 mt-1 flex-shrink-0" />
  </div>
</div>
```

### 2e. White surface card (light theme — used inside the white content card)
These pages use the light-theme card pattern (bg-white, neutral text):
```tsx
<div
  className="rounded-xl bg-white"
  style={{ border: '1px solid rgba(0,0,0,0.07)', boxShadow: '0 1px 4px rgba(0,0,0,0.04)' }}
>
  {/* content */}
</div>
```

### 2f. Action buttons (dark theme / partnership layer)
```tsx
// Primary gradient button
<button className="rounded-2xl bg-gradient-to-r from-[#FF5722] to-[#FFA726] text-siso-bg-primary shadow-[0_20px_45px_rgba(0,0,0,0.35)] px-5 py-2.5 text-sm font-semibold">
  Action
</button>

// Secondary outline button
<button className="rounded-2xl border border-white/15 siso-inner-card-strong text-white/90 px-5 py-2.5 text-sm hover:text-white">
  Action
</button>
```

### 2g. Action buttons (light theme — ContentPageShell, inside white card)
```tsx
// Primary — uses accentGradient prop (per-product colour)
<div className="flex items-center h-9 rounded-xl overflow-hidden" style={{ background: accentGradient }}>
  <button className="flex items-center gap-1.5 px-4 h-full text-sm font-semibold text-white hover:brightness-105 transition-all active:scale-95">
    {actionIcon}
    {actionLabel}
  </button>
  {/* optional chevron dropdown split */}
  <div className="w-px h-5 bg-white/25" />
  <button className="flex items-center justify-center w-8 h-full text-white">
    <ChevronDown size={13} />
  </button>
</div>

// Dropdown panel
<div
  className="absolute right-0 top-11 w-48 rounded-xl py-1 z-50"
  style={{ backgroundColor: '#ffffff', border: '1px solid rgba(0,0,0,0.09)', boxShadow: '0 8px 32px rgba(0,0,0,0.12)' }}
>
  <button className="w-full flex items-center gap-2.5 px-3 py-2.5 text-sm text-neutral-700 hover:bg-black/[0.04] transition-colors text-left">
    {icon}
    {label}
  </button>
</div>
```

---

## 3. Color System

### Dark theme (partnership layer / dark-background screens)

| Token | Value | Use |
|---|---|---|
| `bg-siso-bg-primary` | `#0d0d0d` approx | Page background |
| `bg-siso-bg-secondary` | `#111111` approx | Sidebar, card backgrounds |
| `var(--siso-orange)` / `#FFA726` | `#FFA726` | Partnership accent (sidebar icons) |
| `text-white/60` | — | Labels, uppercase caps |
| `text-white/70` | — | Secondary body text |
| `text-white/80` | — | Primary body text |
| `border-white/10` | — | Card borders |
| `border-white/15` | — | Button/badge borders |
| Radial top | `#20140a` | Background radial gradient top |
| Radial base | `#050505` | Background radial gradient base |

### Light theme (ISSO dashboard — white content card)

| Token / Value | Use |
|---|---|
| `#ffffff` | Main content card background, modal backgrounds |
| `#f5f5f4` | Search input background, inner surfaces |
| `#0e0e10` | Sidebar background |
| `bg-black` | Outer canvas |
| `text-neutral-900` | Primary text |
| `text-neutral-600` | Body text |
| `text-neutral-500` | Muted text, labels |
| `text-neutral-400` | Placeholder, inactive icons |
| `rgba(0,0,0,0.07)` | Dividers, card borders |
| `rgba(0,0,0,0.09)` | Button/control borders |
| `rgba(0,0,0,0.04)` | Hover state background |
| `#efefef` | ViewToggle container background |

### Accent gradients (per product — `accentGradient` prop)

| Product | Gradient |
|---|---|
| Default / Recon | `linear-gradient(135deg, #dc2626, #991b1b)` |
| ISSO / OFM (pink) | `linear-gradient(135deg, #ff0069, #833ab4)` |
| Intelligence | `linear-gradient(135deg, #6d28d9, #4c1d95)` |
| Hub | `linear-gradient(135deg, #2563eb, #7c3aed)` |
| Qualify/pipeline | `linear-gradient(135deg, #6366f1, #8b5cf6)` |
| Saved Filters CTA | `linear-gradient(135deg, #dc2626, #991b1b)` |

**OFM accent override rule:** On ISSO dashboard feature screens, replace `var(--siso-orange)` with `#ff0069` for CTAs and active states. Sidebar icons remain orange (SISO system level).

---

## 4. Typography Scale

All fonts are within the light-theme content card unless noted.

| Use | Classes |
|---|---|
| Page title (dark theme) | `text-2xl font-bold text-white tracking-tight` |
| Section title (dark theme) | `text-lg font-semibold text-white` |
| Card label (dark, uppercase) | `text-[11px] uppercase tracking-[0.35em] text-white/60` |
| Card value (dark) | `text-2xl font-semibold text-white` |
| Body (dark) | `text-sm text-white/80` |
| Meta / timestamp (dark) | `text-xs text-white/60` |
| Pill / badge (dark) | `text-[11px] font-semibold uppercase tracking-[0.2em]` |
| ContentPageShell title | `text-sm font-semibold text-neutral-900` |
| ContentPageShell tab (active) | `text-sm font-medium text-white` |
| ContentPageShell tab (inactive) | `text-sm font-medium text-neutral-400` |
| Filter button label | `text-xs font-medium text-neutral-600` |
| Dropdown item | `text-sm text-neutral-700` |
| Dropdown sub-item / small | `text-xs text-neutral-700` |
| StatPill label | `text-[11px] text-neutral-500 font-medium` |
| StatPill value | `text-[11px] font-semibold text-neutral-700` |
| StatusStrip stats | `text-[11px] text-neutral-500` (value: `font-semibold color:#171717`) |
| StatusStrip status label | `text-[11px] font-semibold` (green: `#22c55e`, amber: `#f59e0b`) |
| Step number badge | `text-[9px] font-bold` inside `w-3.5 h-3.5 rounded-full border border-current` |
| Tab step counter pill | `text-[9px] font-semibold` inside `w-4 h-4 rounded-[4px]` `bg-black/[0.08]` |
| Meta smallest | `text-[9px]` — used for inline numbering only |
| Form label | `text-[11px] font-medium text-neutral-500` |
| Form input | `text-sm` |
| Sidebar section title | `text-[18px] font-semibold text-neutral-50 px-2 py-1` |
| Sidebar menu item (active) | `text-[14px] text-neutral-50 font-['Lexend:Regular']` |
| Sidebar menu item (inactive) | `text-[14px] text-neutral-50/70` |

---

## 5. Spacing Patterns

### Outer layout
- Outer canvas: `p-5` padding, `gap-5` between sidebar and content card
- Content card: `rounded-2xl` on the outer white container

### ContentPageShell
- Header bar: `h-14 px-3`
- Tab/filter row: `px-3 py-2`
- Content scroll area: `px-6 py-6` (standard), `px-6 pt-6` (fixed-height tabs like analysis)
- Dividers: `border-bottom: 1px solid rgba(0,0,0,0.07)`

### Cards (dark theme)
- Outer card padding: `p-5`
- Nested item padding: `px-4 py-3`
- Nested items gap: `space-y-2` or `mt-4 space-y-2`
- Icon container padding: `p-2`
- Icon gap to text: `gap-3`

### Cards (light theme)
- Standard padding: `p-4` or `px-4 py-4`
- Status strip: `px-4 py-3 rounded-xl gap-4`
- Modal padding: `p-6 gap-4`

### Buttons and controls
- Primary action button: `px-4 h-9` (inside `h-9 rounded-xl`)
- Filter/control pills: `px-3 py-1.5 rounded-lg text-xs`
- Filter chips: `px-3 py-1 rounded-lg text-xs`
- Sidebar menu item: `px-4 py-2 min-h-10`
- ViewToggle outer: `p-0.5 rounded-lg gap-0.5`
- ViewToggle button (sm): `p-1.5 rounded-md`
- ViewToggle button (md): `p-2 rounded-md`

### Modals
- Width: `w-80` (standard), wider for complex modals
- Padding: `p-6`
- Input: `px-3 py-2 rounded-xl`

---

## 6. Animation Patterns

All animations use Framer Motion. The four standard patterns:

### 6a. Page container stagger
```ts
export const containerVariants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.08 } },
};
```

### 6b. fadeUp — individual sections/cards
```ts
export const fadeUp = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1, y: 0,
    transition: { duration: 0.5, ease: [0.25, 0.1, 0.25, 1] },
  },
};
```

### 6c. Card hover
```tsx
whileHover={{ scale: 1.02, y: -2 }}
transition={{ type: 'spring', stiffness: 400, damping: 25 }}
```

### 6d. Tab/view transition (AnimatePresence + slide)
```tsx
<AnimatePresence mode="wait">
  <motion.div
    key={activeTab}
    initial={{ opacity: 0, x: 10 }}
    animate={{ opacity: 1, x: 0 }}
    exit={{ opacity: 0, x: -10 }}
    transition={{ duration: 0.22, ease: [0.25, 0.1, 0.25, 1] }}
  >
    {content}
  </motion.div>
</AnimatePresence>
```

### 6e. Modal entrance
```tsx
<motion.div
  initial={{ opacity: 0, scale: 0.95 }}
  animate={{ opacity: 1, scale: 1 }}
>
```

### 6f. Flyout panel (LiveActivityButton, dropdowns)
```tsx
initial={{ opacity: 0, y: -6, scale: 0.97 }}
animate={{ opacity: 1, y: 0, scale: 1 }}
exit={{ opacity: 0, y: -4, scale: 0.97 }}
transition={{ duration: 0.18, ease: [0.25, 0.1, 0.25, 1] }}
```

### 6g. StatusStrip entrance
```tsx
initial={{ opacity: 0, y: -4 }}
animate={{ opacity: 1, y: 0 }}
```

### Active tab indicator
Use `layoutId` for animated underlines/borders. `AnimatePresence mode="wait"` for tab content switches.

---

## 7. Filter and Control Patterns

### 7a. AddFilter pill (drives nested dropdown)
```tsx
<button
  className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-colors"
  style={{ border: '1px solid rgba(0,0,0,0.09)' }}
  // active state adds: bg-black/[0.07] text-neutral-800
  // inactive: text-neutral-500 hover:text-neutral-700 hover:bg-black/[0.04]
>
  <SlidersHorizontal size={12} />
  Add Filter
</button>
```
Dropdown panel: `w-56 rounded-xl`, `bg-#ffffff`, `border rgba(0,0,0,0.09)`, `boxShadow 0 8px 32px rgba(0,0,0,0.12)`.

### 7b. Generic filter/control pill (analytics toggle, schedule picker, etc.)
```tsx
<button
  className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium text-neutral-600 hover:bg-black/[0.04] transition-colors"
  style={{ border: '1px solid rgba(0,0,0,0.09)' }}
>
  <BarChart2 size={12} style={{ color: '#2563eb' }} />   {/* accent color per product */}
  Show analytics
  <ChevronDown size={10} className="transition-transform duration-150" />
</button>
```
Chevron rotates 180° when open: `className={showOpen ? 'rotate-180' : ''}`.

### 7c. ViewToggle
```tsx
import { ViewToggle } from '@/components/ui/view-toggle';

<ViewToggle
  value={viewMode}
  onChange={setViewMode}
  options={[
    { value: 'list', icon: <List size={11} />, label: 'List' },
    { value: 'grid', icon: <LayoutGrid size={11} />, label: 'Grid' },
  ]}
  size="md"   // 'sm' = icon only tight, 'md' = more padding (use when label shown)
/>
```
Container: `bg-#efefef rounded-lg p-0.5`.
Active button: `bg-#fff boxShadow 0 1px 3px rgba(0,0,0,0.10) rounded-md`.
Inactive button: `color: #9ca3af`.

### 7d. Day-range toggle (inline, no library)
```tsx
<div className="flex items-center rounded-lg overflow-hidden" style={{ border: '1px solid rgba(0,0,0,0.08)' }}>
  {[{ label: '7d', value: 7 }, { label: '30d', value: 30 }, { label: '90d', value: 90 }].map(d => (
    <button
      key={d.value}
      onClick={() => setDays(d.value)}
      className="px-2.5 py-1 text-[10px] font-semibold transition-all"
      style={days === d.value
        ? { background: 'linear-gradient(135deg,#6366f1,#8b5cf6)', color: '#fff' }
        : { color: '#9ca3af' }
      }
    >
      {d.label}
    </button>
  ))}
</div>
```

### 7e. LiveActivityButton
```tsx
import { LiveActivityButton } from '@/components/ui/live-activity-button';

<LiveActivityButton accentColor="#7c3aed" />   // default: #dc2626
```
- 7×7 rounded-lg button, `Activity` icon size 12
- Active: solid accentColor bg, glow ring `0 0 0 3px ${accentColor}33, 0 0 14px ${accentColor}73`
- Inactive: `bg-#fff border rgba(0,0,0,0.09) color #737373`
- Panel: 284×420px, `borderRadius: 18`, fixed positioned below button

### 7f. FilterChip (sort chips in filter bar right slot)
```tsx
<button
  onClick={() => onFilterChange?.(chip.id)}
  className={cn(
    'px-3 py-1 rounded-lg text-xs font-medium transition-colors',
    activeFilter === chip.id
      ? 'text-neutral-900 bg-black/[0.07]'
      : 'text-neutral-400 hover:text-neutral-600 hover:bg-black/[0.04]'
  )}
>
  {chip.label}
</button>
```

---

## 8. Sub-nav Tab Pattern

Tabs live in ContentPageShell Row 2. They are flat pill buttons, not underlines.

```tsx
// Active tab
<button
  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-medium text-white whitespace-nowrap"
  style={{ background: accentGradient }}
>
  {tab.icon}
  {tab.label}
</button>

// Inactive tab
<button className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-medium text-neutral-400 hover:text-neutral-600 hover:bg-black/[0.04] whitespace-nowrap transition-colors">
  {tab.icon}
  {tab.label}
</button>
```

### Tab icons
- Dashboard tab: `<LayoutDashboard size={13} />`
- Numbered workflow tabs: `<StepNum n={1} />` — `w-3.5 h-3.5 rounded-full border border-current text-[9px] font-bold`
- Tab counter badge (e.g. "2 pending"): `w-4 h-4 rounded-[4px] text-[9px] font-semibold bg-black/[0.08]`

### Next product link (after last tab)
```tsx
<>
  <div className="w-px h-4 mx-1 flex-shrink-0" style={{ backgroundColor: 'rgba(0,0,0,0.10)' }} />
  <ChevronRight size={13} className="text-neutral-300 flex-shrink-0" />
  <a
    href={href}
    className="inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-medium text-neutral-400 hover:text-neutral-600 hover:bg-black/[0.04] transition-colors"
  >
    <span className="flex-shrink-0 opacity-70">{productIcon}</span>
    <span>{label}</span>
  </a>
</>
```

---

## 9. StatusStrip Pattern

A compact info bar used at the top of data-heavy tab content areas (Creators, Qualify tabs in Recon).

```tsx
import { StatusStrip, timeAgo } from '@/components/ui/status-strip';

<StatusStrip
  // optional left pulsing dot
  status={{ label: 'Scraping active', active: true }}   // active=green, false=amber
  stats={[
    { icon: <Users size={10} />, value: totalCount, label: 'tracked' },
    { icon: <Eye size={10} />, value: '12,400', label: 'avg views' },
    { icon: <TrendingUp size={10} />, value: '4.2%', label: 'avg ER' },
  ]}
  rightSlot={
    <>
      <ViewToggle ... />
      <Clock size={10} className="text-red-600" />
      <span>Last scrape: <span className="font-medium text-neutral-700">{timeAgo(ts)}</span></span>
    </>
  }
/>
```

Container: `bg-#fff border rgba(0,0,0,0.07) rounded-xl px-4 py-3 gap-4`
Stat text: `text-[11px] text-neutral-500` — value is `font-semibold color:#171717`
Divider between stats: `text-neutral-200` pipe character
Status dot: `h-2 w-2 rounded-full` with `animate-ping` outer ring
Icon color default: `text-red-600` (override with `iconColor` prop)
Entrance animation: `initial={{ opacity: 0, y: -4 }} animate={{ opacity: 1, y: 0 }}`

---

## 10. Status and Badge Patterns

### Status pill in filter bar (StatusDropdown)
Compact pill that cycles through status views (all / raw / enriched / scraped / failed).
```tsx
<StatusDropdown
  value={statusView}
  onChange={setStatusView}
  counts={statusCounts}   // Record<StatusView, number>
/>
```

### Favorites toggle
```tsx
<button
  className={cn(
    'flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-[11px] font-medium transition-all border',
    showFavorites
      ? 'text-[#ff0069] border-[#ff006930] bg-[#ff006908]'
      : 'text-neutral-500 border-transparent hover:border-neutral-200 hover:bg-white'
  )}
>
  <Heart size={11} fill={showFavorites ? '#ff0069' : 'none'} />
  Favorites
</button>
```

### Generic badge (BadgeTag)
```tsx
import { BadgeTag } from '@/components/ui/badge-tag';
```

### Option badge (inside filter dropdown)
```tsx
<span
  className="text-[10px] font-medium px-1.5 py-0.5 rounded"
  style={{ backgroundColor: '#e8f0fe', color: '#1a73e8' }}
>
  Meta Only
</span>
```

---

## 11. Empty State Pattern

Used inside SavedFiltersPanel and similar zero-data states.

```tsx
<div className="flex flex-col items-center justify-center px-4 py-6 gap-3 text-center">
  <div
    className="w-10 h-10 rounded-xl flex items-center justify-center"
    style={{ backgroundColor: '#f3f4f6' }}
  >
    <SlidersHorizontal size={18} className="text-neutral-400" />
  </div>
  <div>
    <p className="text-xs font-semibold text-neutral-800">{headline}</p>
    <p className="text-[11px] text-neutral-400 mt-1 leading-relaxed">
      {description}
    </p>
  </div>
  {/* optional CTA */}
  <button
    className="w-full flex items-center justify-center gap-1.5 py-2.5 rounded-xl text-xs font-semibold text-white hover:brightness-105 active:scale-[0.98]"
    style={{ background: accentGradient }}
  >
    <Plus size={13} />
    {ctaLabel}
  </button>
</div>
```

---

## 12. Modal Pattern

Used for add/edit actions (e.g. AddLeadModal, CreatePresetModal).

```tsx
<dialog open className="fixed inset-0 z-50 flex items-center justify-center"
  onClick={e => { if (e.target === e.currentTarget) onClose(); }}
>
  <div className="absolute inset-0 bg-black/30 backdrop-blur-sm" />
  <motion.div
    initial={{ opacity: 0, scale: 0.95 }}
    animate={{ opacity: 1, scale: 1 }}
    className="relative bg-white rounded-2xl shadow-2xl w-80 overflow-hidden"
  >
    <form className="flex flex-col gap-4 p-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-semibold text-neutral-900">{title}</h3>
        <button type="button" onClick={onClose} className="text-neutral-400 hover:text-neutral-600 text-lg leading-none">x</button>
      </div>

      {/* Field */}
      <div>
        <label className="text-[11px] font-medium text-neutral-500 mb-1.5 block">{label}</label>
        <input
          className="w-full px-3 py-2 rounded-xl text-sm border border-neutral-200 focus:outline-none focus:border-pink-400 focus:ring-2 focus:ring-pink-100"
        />
      </div>

      {/* Submit */}
      <button
        type="submit"
        className="w-full py-2.5 rounded-xl text-sm font-semibold text-white hover:brightness-105 active:scale-[0.98] disabled:opacity-60"
        style={{ background: 'linear-gradient(135deg, #ff0069, #833ab4)' }}
      >
        {label}
      </button>
    </form>
  </motion.div>
</dialog>
```

---

## 13. Loading / Skeleton Pattern

Dynamic imports use `TabSkeleton` or `TrendsLoadingSkeleton` as loading fallbacks.

```tsx
const MyTab = dynamic(
  () => import('./MyTab').then(m => ({ default: m.MyTab })),
  { ssr: false, loading: () => <TabSkeleton /> }
);
```

---

## 14. Background Pattern (dark theme only)

Every dark-theme page uses `PartnershipsWaveBackdrop`. Never use raw `AnimatedWaves`.

```tsx
import { PartnershipsWaveBackdrop } from '@/shared/ui/backgrounds/PartnershipsWaveBackdrop';

<div className="relative min-h-full bg-siso-bg-primary overflow-hidden">
  <PartnershipsWaveBackdrop position="absolute" className="inset-0" />
  <div className="relative z-10 p-6 md:p-8">
    {/* page content */}
  </div>
</div>

// OFM / ISSO pink variant
<PartnershipsWaveBackdrop
  strokeColor="#ff0069"
  radialTop="#1a0008"
  radialBase="#050505"
  waveOpacity={0.45}
/>
```

Layer stack (bottom to top):
1. `radial-gradient(circle at top, #20140a, #050505)`
2. Blurred animated waves — `blur(6px) opacity:0.55 stroke:#f8a75c`
3. `bg-gradient-to-b from-black/35 via-black/55 to-black/80 backdrop-blur(2px)`

**Note:** The ISSO dashboard content card is light-theme (white). The background is only used on full-dark pages outside the white card shell.

---

## 15. Sidebar Pattern (reference only — do not rebuild)

The sidebar is `IssoSidebarShell` — a two-level system based on `CampusSidebar`.

```
Level 1 — Icon rail (w-16 fixed)
  bg-siso-bg-secondary
  border-r border-neutral-800
  rounded-l-2xl

  Active icon: bg-siso-orange/14 border border-siso-orange/32 (orange glow)
  Base icon:   text-neutral-400 hover:bg-neutral-800

Level 2 — Detail panel (flex-1, right of Level 1)
  bg-siso-bg-secondary
  p-4
  rounded-r-2xl

  Section title: text-[18px] font-semibold text-neutral-50 px-2 py-1
  + GlowDivider variant="orange" height={3} animated="pulse"

  Active menu item: rounded-lg bg-neutral-800 px-4 py-2 min-h-10
    icon: color var(--siso-orange) size={16}
    label: text-[14px] text-neutral-50 font-['Lexend:Regular']

  Inactive menu item: rounded-lg hover:bg-neutral-800 transition-all duration-500 px-4 py-2 min-h-10
    icon: text-neutral-400 size={16}
    label: text-[14px] text-neutral-50/70
```

**Key files:**
- `src/app/isso/layout.tsx` — outer black canvas + gap-5
- `src/shared/layout/isso-sidebar/IssoSidebarShell.tsx` — full sidebar
- `src/shared/layout/isso-sidebar/sidebar-config.tsx` — product icons + nav config
- `src/shared/layout/ContentPageShell.tsx` — universal page template
- `src/shared/layout/ProductIcon.tsx` — product sprite PNG renderer

---

## 16. Hard Rules — Do Not Break

1. **Never use raw `AnimatedWaves`** — always `PartnershipsWaveBackdrop`
2. **Never hardcode `bg-[#111111]`** — use `bg-siso-bg-secondary`
3. **Never create one-off card styles** — use `stackedPanelClass` / `nestedCardClass`
4. **Never use chart libraries** — all charts are custom Framer Motion bars
5. **Never add comments** unless logic is non-obvious
6. **Always use `ContentPageShell`** for every feature page — no exceptions
7. **Always wrap tab content in `AnimatePresence mode="wait"`** with the slide transition
8. **Always use `ProductIcon` component** for product icons — not raw images or emoji
9. **Never import marketing components from dashboard features** — they are isolated
10. **Never use `@/shared/*` alias directly** — use `@/isso/*` for shared layout
11. **Run `npm run build` before marking any frontend task complete**
