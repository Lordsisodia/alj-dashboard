# ISSO Dashboard — UI Building Rules

> This is the locked spec. All screens must follow these rules exactly.
> Last updated: 2026-04-05

---

## 1. Navigation — Two-Level Sidebar

The sidebar is a two-panel system copied from the SISO partnership app (`CampusSidebar`).

### Level 1 — Icon Rail (64px, left)
Narrow vertical strip. Each icon represents a top-level feature section.
Clicking an icon activates that section and populates Level 2.

| # | Icon (lucide) | Label | Section ID |
|---|---|---|---|
| 1 | `LayoutDashboard` | Home | `home` |
| 2 | `Layers` | Hub | `hub` |
| 3 | `Sparkles` | Briefs | `briefs` |
| 4 | `TrendingUp` | Intelligence | `intelligence` |
| 5 | `Radar` | Recon | `recon` |
| 6 | `Bot` | Agents | `agents` |
| 7 | `Users` | Team | `team` |

**Active state:** SISO orange glow + `bg-siso-orange/14` + `border border-siso-orange/32`
**Base state:** `text-neutral-400`, `hover:bg-neutral-800`
**Width:** `w-16` (fixed, never collapses)
**Background:** `bg-siso-bg-secondary`
**Border:** `border-r border-neutral-800`
**Rounded:** `rounded-l-2xl`

### Level 2 — Detail Panel (flex-1, right of Level 1)
Expands to show section content. Each section has a title, optional search, and menu items.

**Background:** `bg-siso-bg-secondary`
**Padding:** `p-4`
**Rounded:** `rounded-r-2xl`
**Width:** fills remaining sidebar space (sidebar total ~260px desktop)

**Section → Pages mapping:**

| Section | Sub-pages (Level 2 items) | Routes |
|---|---|---|
| **Home** | Dashboard | `/isso` |
| **Hub** | Approvals, Schedule, Content Feed, Analytics | `/isso/approvals`, `/isso/schedule`, `/isso/community`, `/isso/analytics` |
| **Briefs** | Ideas, Upload Content, Models | `/isso/ideas`, `/isso/content`, `/isso/models` |
| **Intelligence** | Trends, Discovery | `/isso/intelligence` |
| **Recon** | Competitors, Scraping Log | `/isso/recon` |
| **Agents** | Activity, Reports, Requests | `/isso/agents` |
| **Team** | Team, Settings | `/isso/team`, `/isso/settings` |

**Menu item pattern:**
```tsx
// Active item
<div className="rounded-lg bg-neutral-800 flex items-center px-4 py-2 min-h-10">
  <Icon size={16} style={{ color: 'var(--siso-orange)' }} />
  <span className="ml-3 text-[14px] text-neutral-50 font-['Lexend:Regular'] truncate">
    {label}
  </span>
</div>

// Inactive item
<div className="rounded-lg hover:bg-neutral-800 transition-all duration-500 flex items-center px-4 py-2 min-h-10 cursor-pointer">
  <Icon size={16} className="text-neutral-400" />
  <span className="ml-3 text-[14px] text-neutral-50/70 truncate">{label}</span>
</div>
```

**Section title pattern:**
```tsx
<div className="text-[18px] font-semibold text-neutral-50 px-2 py-1">
  {sectionTitle}
</div>
<GlowDivider variant="orange" height={3} animated="pulse" />
```

---

## 2. Background

Every page uses `PartnershipsWaveBackdrop`. Never use raw `AnimatedWaves` directly.

**Component:** `src/domains/partnerships/_shared/ui/backgrounds/PartnershipsWaveBackdrop.tsx`

**Standard usage:**
```tsx
<div className="relative min-h-full bg-siso-bg-primary overflow-hidden">
  <PartnershipsWaveBackdrop position="absolute" className="inset-0" />
  <div className="relative z-10 p-6 md:p-8">
    {/* page content */}
  </div>
</div>
```

**Layer stack (bottom to top):**
1. Radial gradient wash — `radial-gradient(circle at top, #20140a, #050505)`
2. Blurred animated waves — `blur(6px)`, `opacity: 0.55`, stroke `#f8a75c`
3. Dark overlay — `bg-gradient-to-b from-black/35 via-black/55 to-black/80`, `backdrop-blur(2px)`

**OFM variant** (pink instead of orange waves):
```tsx
<PartnershipsWaveBackdrop
  strokeColor="#ff0069"
  radialTop="#1a0008"
  radialBase="#050505"
  waveOpacity={0.45}
/>
```
Use this for the ISSO dashboard (pink brand colour).

---

## 3. Cards

Two classes control all cards. Import from `src/domains/partnerships/_shared/ui/theme/cardLayers.ts`.

```ts
import { stackedPanelClass, nestedCardClass } from '@/shared/ui/theme/cardLayers';
```

### stackedPanelClass — Outer shell
```
rounded-[22px] border border-white/10 siso-inner-card shadow-[0_12px_28px_rgba(0,0,0,0.35)]
```
Use for: stat cards, feature cards, widget shells, any top-level card.

### nestedCardClass — Inner items
```
rounded-2xl border border-white/10 siso-inner-card-strong shadow-[0_10px_24px_rgba(0,0,0,0.35)]
```
Use for: items inside a card (list rows, nested stats, inner panels).

### Standard card content pattern
```tsx
<div className={`${stackedPanelClass} p-5 text-white`}>
  {/* Label */}
  <p className="text-[11px] uppercase tracking-[0.35em] text-white/60">
    {label}
  </p>
  {/* Primary value */}
  <p className="text-2xl font-semibold text-white mt-1">{value}</p>
  {/* Secondary meta */}
  <p className="text-xs text-white/70 mt-0.5">{meta}</p>

  {/* Nested items */}
  <div className="mt-4 space-y-2">
    <div className={`${nestedCardClass} px-4 py-3 flex items-center justify-between`}>
      <span className="text-sm text-white/80">{itemLabel}</span>
      <span className="text-sm font-semibold text-white">{itemValue}</span>
    </div>
  </div>
</div>
```

### Icon card pattern (feature cards with icon + text + subtext)
```tsx
<div className={`${stackedPanelClass} p-5`}>
  <div className="flex items-start gap-3">
    {/* Icon container */}
    <span className="inline-flex rounded-2xl border border-siso-orange/35 bg-siso-orange/10 p-2 text-siso-orange flex-shrink-0">
      <Icon size={18} />
    </span>
    {/* Text */}
    <div className="flex-1 min-w-0">
      <p className="text-[11px] uppercase tracking-[0.35em] text-white/60">{label}</p>
      <p className="text-sm font-semibold text-white mt-0.5">{title}</p>
      <p className="text-xs text-white/70 mt-0.5">{subtext}</p>
    </div>
    {/* Optional chevron/action */}
    <ArrowRight className="h-4 w-4 text-white/40 mt-1 flex-shrink-0" />
  </div>
</div>
```

### Action buttons
```tsx
// Primary (gradient)
<button className="rounded-2xl bg-gradient-to-r from-[#FF5722] to-[#FFA726] text-siso-bg-primary shadow-[0_20px_45px_rgba(0,0,0,0.35)] px-5 py-2.5 text-sm font-semibold">
  Action
</button>

// Secondary (outline)
<button className="rounded-2xl border border-white/15 siso-inner-card-strong text-white/90 px-5 py-2.5 text-sm hover:text-white">
  Action
</button>
```

---

## 4. Colour Tokens

| Token | Value | Use |
|---|---|---|
| `bg-siso-bg-primary` | `#0d0d0d` approx | Page background |
| `bg-siso-bg-secondary` | `#111111` approx | Sidebar, cards |
| `var(--siso-orange)` | `#FFA726` | Primary accent (partnership brand) |
| `#ff0069` | — | ISSO/OFM pink accent (override on OFM screens) |
| `#833ab4` | — | Purple secondary (OFM) |
| `text-white/60` | — | Labels, caps text |
| `text-white/70` | — | Secondary body |
| `text-white/80` | — | Primary body |
| `border-white/10` | — | Card borders |
| `border-white/15` | — | Button/badge borders |

**OFM colour override rule:** On all ISSO dashboard screens, replace `var(--siso-orange)` accent with `#ff0069` (pink). The sidebar icons use orange (SISO system), but feature CTAs and active states use pink.

---

## 5. Typography

| Use | Classes |
|---|---|
| Page title | `text-2xl font-bold text-white tracking-tight` |
| Section title | `text-lg font-semibold text-white` |
| Card label | `text-[11px] uppercase tracking-[0.35em] text-white/60` |
| Card value | `text-2xl font-semibold text-white` |
| Body text | `text-sm text-white/80` |
| Meta / timestamp | `text-xs text-white/60` |
| Pill / badge | `text-[11px] font-semibold uppercase tracking-[0.2em]` |

---

## 6. Animation Standards

All animations use Framer Motion. Standard variants:

```ts
// Page container — stagger children
export const containerVariants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.08 } },
};

// Individual section/card
export const fadeUp = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1, y: 0,
    transition: { duration: 0.5, ease: [0.25, 0.1, 0.25, 1] },
  },
};

// Card hover
whileHover={{ scale: 1.02, y: -2 }}
transition={{ type: 'spring', stiffness: 400, damping: 25 }}
```

Tab/section switches: `AnimatePresence mode="wait"` + fade.
Active indicators: `layoutId` for animated underlines/borders.

---

## 7. File Structure Convention

Each page lives in its feature folder:
```
src/features/{name}/
  components/
    {Name}FeaturePage.tsx   ← the page (default export)
    index.ts                ← re-exports the page
  hooks/
    index.ts
  types.ts
```

Page route at `src/app/isso/{name}/page.tsx` is a thin wrapper:
```tsx
import { NameFeaturePage } from '@/features/name/components';
export default function NamePage() { return <NameFeaturePage />; }
```

Import alias for shared ISSO files: `@/isso/` → `src/shared/`
Import alias for partnership shared: `@/shared/` → `src/domains/partnerships/_shared/`

---

## 8. DO NOT

- Do not use raw `AnimatedWaves` — always use `PartnershipsWaveBackdrop`
- Do not use the ALJ reference sidebar (`IssoSidebar.tsx`) — replace with two-level `CampusSidebar` pattern
- Do not hardcode `bg-[#111111]` — use `bg-siso-bg-secondary` tokens
- Do not create one-off card styles — use `stackedPanelClass` / `nestedCardClass`
- Do not use chart libraries — all charts are custom Framer Motion bars
- Do not add comments unless logic is non-obvious
