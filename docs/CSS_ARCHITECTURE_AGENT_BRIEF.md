# CSS Architecture Deep Dive — Agent Brief

## Context: What was already fixed this session

The isso-dashboard (`/Users/shaansisodia/SISO_Workspace/SISO_Agency/apps/isso-dashboard`) had a full stability audit done. 7 critical issues were resolved:

1. `--primary` CSS token was stored as hex (`#ffa726`) — Tailwind uses `hsl(var(--primary))` so it was invalid CSS. Fixed to `36 100% 57%` (HSL triplet).
2. `html body { background: #000 !important }` killed token-based theming. Removed `!important`.
3. `ConvexProvider` had a bang assertion (`!`) on the env URL — crashes entire app if env missing. Fixed with guard.
4. Middleware auth bypass used spoofable `Host` header — replaced with `NODE_ENV === 'development'`.
5. Two `components/ui/` directories (root + `src/`) — consolidated into `src/components/ui/` only.
6. 63 files used fragile relative `../../convex/_generated/api` imports — all converted to `@/convex/_generated/api`.
7. `typescript: { ignoreBuildErrors: true }` silenced all type errors — now set to `false`. `tsc --noEmit` exits clean.
8. Inter font was declared in Tailwind/CSS but never loaded. Added `next/font/google` Inter to root layout.

**Current state: `tsc --noEmit` → exit 0. `convex dev --once` → exit 0. `npm run build` (with `ALLOW_NODE_ANY=1`) → exit 0.**

---

## The One Remaining Problem: CSS Architecture

### What exists today

`src/app/globals.css` is **1,693 lines** and is imported by the **root layout** (`src/app/layout.tsx`), meaning every single route in the app — dashboard, partners mobile, sign-in, marketing pages — ships the entire file.

The file currently contains:

| Lines | Content | Should be where |
|---|---|---|
| 1–5 | `@import` of `color-system.css` + `tw-animate.css` | Root (correct) |
| 3–5 | `@tailwind base/components/utilities` | Root (correct) |
| 7–300 | Dashboard/app CSS (menu, scrollbars, component vars, HU vars, shadcn tokens) | Root (correct) |
| 302–1693 | **Marketing/landing page CSS** migrated from `agency-landing` | Should be marketing-only |

The comment at line 302 says:
```
MARKETING / LANDING PAGE STYLES
Migrated from agency-landing — do not edit these in dashboard features.
Source: apps/agency-landing/frontend/app/globals.css
```

### What's in the marketing block (lines 302–1693)

- `@font-face` declarations for Circular (7 weights) and Inter Display
- `.hero-main-grid`, `.hero-logo-grid`, `.hero-mockup-wrapper` — hero section
- `.secret-weapon-grid` — SecretWeapon section
- `.features-section`, `.features-title`, `.features-container` — Features section
- `.pricing-card-*`, `.comparison-td`, `.comparison-th` — Pricing section
- `.glass-card`, `.dark-card` — card variants
- `.btn-primary`, `.btn-secondary`, `.btn-icon` — button overrides
- `.section-divider`, `.tag-pill`, `.pulse-dot` — misc utility
- `.footer-label`, `.footer-link`, `.footer-count` — footer
- `@layer base { html body { background: #000; } }` — base reset
- `@layer base { * { box-sizing: border-box; } }` — box model reset
- `@layer components { ... }` — all the above inside Tailwind layers
- `--_lens---*` variables — a full lens/neutral palette (opacity scale)
- `.mobile-only`, `.desktop-only` with `!important` — responsive visibility utilities

### The marketing routes

All marketing pages live under `src/app/(marketing)/`. The layout is:

```tsx
// src/app/(marketing)/layout.tsx
'use client';
export default function MarketingLayout({ children }) {
  return (
    <div style={{ background: '#000', position: 'relative', zIndex: 1, minHeight: '100vh' }}>
      <link rel="stylesheet" href="/marketing-css/foreplay.css" />  {/* Webflow CSS via <link> in body */}
      <MarketingNavBar />
      <main>{children}</main>
      <ChatBotIcon />
    </div>
  );
}
```

Note: `foreplay.css` (Webflow-generated, 230KB) is loaded via a `<link>` tag inside JSX — not via `import`. This is an anti-pattern.

### The dashboard routes

Dashboard lives under `src/app/isso/` (and partners under `src/app/partners/`). These use their own layout shells. They currently receive ALL 1,693 lines of CSS including pricing-card, hero-grid, and footer classes they will never use.

---

## The Question for This Agent

**Should the marketing CSS be separated from the app CSS, and if so, how?**

### Option A — Extract to a marketing CSS file, import only in marketing layout

1. Create `src/app/(marketing)/marketing.css` (or `src/domains/marketing/styles/marketing.css`)
2. Move lines 302–1693 from `globals.css` into it
3. Import it in `(marketing)/layout.tsx` — either via `import './marketing.css'` (convert layout to a server component) or keep client + import via a wrapper
4. Convert the `<link rel="stylesheet" href="/marketing-css/foreplay.css" />` in `(marketing)/layout.tsx` to a proper CSS import
5. `globals.css` becomes ~300 lines of shared app/dashboard CSS only

**Tradeoff:** Dashboard routes stop shipping 1,400 lines of hero/pricing CSS. Marketing pages still get everything they need. Fewer class-name collision risks (`.btn-primary`, `.glass-card` etc. are generic names).

### Option B — Keep globals.css as-is, just clean it up

Audit the marketing block for:
- Unused classes (anything not referenced in `src/app/(marketing)/` components)
- Duplicate declarations
- Remove `.mobile-only` / `.desktop-only` `!important` utilities and replace with Tailwind responsive classes where used

**Tradeoff:** Simpler change. Still ships marketing CSS to dashboard routes, but at least it's leaner.

### Option C — Move marketing to a standalone CSS bundle in `/public`

Move all marketing CSS to `/public/marketing-css/marketing.css` alongside the existing `foreplay.css`. Load both via `<link>` only on marketing pages. The `(marketing)/layout.tsx` becomes the single place where both are loaded.

**Tradeoff:** Keeps app bundle clean. Risk: stylesheet ordering is harder to control with `<link>` tags vs `@import` chains.

---

## Files to Read Before Deciding

| File | Why |
|---|---|
| `src/app/globals.css` | Full 1,693 lines — understand what's in each section |
| `src/app/(marketing)/layout.tsx` | Current marketing layout, `<link>` anti-pattern |
| `src/domains/partnerships/_shared/styles/color-system.css` | Shared SISO tokens — must stay in root |
| `src/domains/partnerships/_shared/styles/tw-animate.css` | Animate classes — check if marketing-only or shared |
| `tailwind.config.ts` | Content globs, plugin list |
| `src/app/layout.tsx` | Root layout — what globals.css feeds |
| `src/app/(marketing)/` | All marketing pages — understand which CSS classes are actually used |

---

## Constraints

- `tsc --noEmit` must exit 0 after any changes
- `ALLOW_NODE_ANY=1 npm run build` must succeed after changes
- Do not touch `color-system.css` or `tw-animate.css` — those are shared tokens used by both dashboard and marketing
- The marketing pages must still look identical after the refactor
- Do not move the shadcn/component-var CSS out of globals.css — that's needed app-wide

---

## Output Contract

```
===TASK_COMPLETE===
status: complete|blocked|failed
approach_chosen: A|B|C
files_changed: [list]
lines_removed_from_globals: N
build_result: tsc exit 0, build exit 0
next_steps: [anything needing review]
===END_TASK===
```
