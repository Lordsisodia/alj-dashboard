# OSS Frontend Components Research
**Date:** 2026-04-12
**Purpose:** Evaluate open-source frontend libraries for the isso-dashboard (Next.js App Router + Tailwind CSS)

---

## Evaluation Criteria
- GitHub stars (popularity signal)
- Last commit / maintenance status
- Bundle size (gzipped)
- Next.js App Router compatibility (`"use client"` required noted where applicable)
- Tailwind CSS support
- License

---

## 1. Calendar Components

### FullCalendar (`@fullcalendar/react`)
| Field | Value |
|---|---|
| GitHub Stars | ~19,000+ |
| Last Commit | Active (10+ years, 100+ contributors) |
| Bundle Size | Plugin-based — install only what you need (`@fullcalendar/core` + adapter + plugins) |
| Next.js App Router | Requires `"use client"` — depends on browser APIs |
| Tailwind Support | Community-supported via custom CSS overrides |
| License | Open-source core (MIT); Premium plugins require paid license |

**Notes:** The most feature-complete calendar option. Plugin architecture keeps bundle lean. Extensive config (~300 settings). Headless Tailwind alternatives may suit App Router better if full-page SSR matters.

---

### react-big-calendar (`jquense/react-big-calendar`)
| Field | Value |
|---|---|
| GitHub Stars | ~8,500+ |
| Last Commit | Active (community PRs; React 19 support in progress) |
| Bundle Size | Monolithic — no plugin splits; ~500KB weekly downloads on npm |
| Next.js App Router | Works but needs CSS import workarounds; known styling friction in Next.js |
| Tailwind Support | Ships SASS files; Tailwind requires manual overrides |
| License | MIT |

**Notes:** gcal/outlook-style calendar. No built-in drag-and-drop editor (must add separately). Documentation is Storybook-only with limited search. Simpler than FullCalendar but less polished. Known issues with Next.js 13.5+ SSR style loading.

---

## 2. Kanban / Drag-and-Drop Libraries

### dnd-kit (`clauderic/dnd-kit`)
| Field | Value |
|---|---|
| GitHub Stars | ~16,500 |
| Last Commit | January 18, 2026 (`@dnd-kit/react@0.2.3`) |
| Bundle Size | Lean by design; does NOT use HTML5 DnD API (avoids bloat from workarounds) |
| Next.js App Router | Fully compatible; widely used in production App Router Kanban boards |
| Tailwind Support | Headless — works with any CSS including Tailwind |
| License | MIT |

**Notes:** Current gold standard for drag-and-drop in React. Accessible by default (screen reader announcements, ARIA). Multiple production-grade Kanban starters with Next.js + Tailwind + dnd-kit exist on GitHub. Highly recommended for isso-dashboard.

---

### react-beautiful-dnd (`atlassian/react-beautiful-dnd`)
| Field | Value |
|---|---|
| GitHub Stars | ~34,000 (historical; repo archived) |
| Last Commit | **Archived August 18, 2025 — read-only** |
| Bundle Size | Monolithic |
| Next.js App Router | Broken — known SSR issues, deprecated on npm (October 2024) |
| Tailwind Support | Works but irrelevant given deprecation |
| License | Apache 2.0 |

**Notes:** DO NOT USE for new projects. Officially deprecated on npm with console warnings; repo archived. Community fork `@hello-pangea/dnd` (drop-in replacement, React 18 + Strict Mode support) is the migration path. For new work, prefer dnd-kit.

---

## 3. Chart Libraries

### Recharts (`recharts/recharts`)
| Field | Value |
|---|---|
| GitHub Stars | ~3M weekly npm downloads (de facto standard) |
| Last Commit | Active |
| Bundle Size | ~40KB gzipped; known issue with loading full index.js vs tree-shaking |
| Next.js App Router | Requires `"use client"`; SVG-based so SSR-safe for strings |
| Tailwind Support | Tailwind classes apply to wrapper/tooltip components directly |
| License | MIT |

**Notes:** De facto standard for React charting. Recharts 3 used by many 2026 admin dashboard templates (Apex, etc.) alongside TanStack Table + shadcn/ui. Tremor (see below) wraps Recharts. Good choice when already in the stack.

---

### Nivo (`plouc/nivo`)
| Field | Value |
|---|---|
| GitHub Stars | ~9,100+ |
| Last Commit | Active |
| Bundle Size | Scoped packages (`@nivo/core` + individual chart packages) — code-split, only install what you need |
| Next.js App Router | Supports SSR; community projects for server-side rendered Nivo + Next.js exist |
| Tailwind Support | Integrates well; used alongside shadcn/ui and Tailwind in community projects |
| License | MIT |

**Notes:** Built on D3, beautiful defaults, highly customizable. SSR support is a differentiator vs. canvas-based libraries. Supports motion/transitions out of the box. Good for data-heavy analytics dashboards.

---

### Tremor (`tremorlabs/tremor`)
| Field | Value |
|---|---|
| GitHub Stars | Active (tremorlabs org; check repo for live count) |
| Last Commit | Active; npm latest `@tremor/react` v3.18.7 |
| Bundle Size | ~50KB; built on Recharts + Radix UI + Tailwind v4 |
| Next.js App Router | Requires `"use client"`; headless/Tailwind-first = good App Router fit |
| Tailwind Support | Native Tailwind v4 — first-class support |
| License | Apache 2.0 |

**Notes:** Copy-paste model (like shadcn/ui) — you own the source code. 35+ components: KPI cards, line/bar/area/donut charts, data tables, filters. 250+ blocks/templates. Design philosophy: "show the data, hide the chrome." Best choice when already using Tailwind — charts + dashboard primitives in one package. Builds on Recharts internally.

---

## 4. Swipe Gesture Libraries

### react-tinder-card (`3DJakob/react-tinder-card`)
| Field | Value |
|---|---|
| GitHub Stars | ~403 (small but focused) |
| Last Commit | Last published 2 years ago (v1.6.4) — low activity |
| Bundle Size | Small; migrated to react-spring in v1.6.0 for performance |
| Next.js App Router | Works as client component; no known incompatibilities |
| Tailwind Support | Headless card shell — Tailwind styles applied to children |
| License | MIT |

**Notes:** Purpose-built Tinder-style swipe component. Supports left/right/up/down swipes, velocity and position-based throw, programmatic swipe, and undo/restore. Low maintenance cadence is a risk. For more control and animation fidelity, Framer Motion custom implementation is preferred.

---

### Framer Motion / Motion (`motiondotdev/motion`)
| Field | Value |
|---|---|
| GitHub Stars | ~30,200+ |
| Last Commit | Active; Motion 12.x (March 2026) |
| Bundle Size | 2.3KB mini / 4.6KB optimized (`LazyMotion`) / 34KB full; can cut to ~15KB with `LazyMotion + domAnimation` |
| Next.js App Router | Requires `"use client"`; tested against Next.js 16.x (March 2026) |
| Tailwind Support | Works alongside Tailwind — motion handles transforms/opacity, Tailwind handles layout/color |
| License | MIT |

**Notes:** Rebranded from `framer-motion` to `motion` — import from `motion/react`. Industry-standard animation library. Full gesture support: drag, swipe, hover, tap, scroll-linked effects, FLIP layout animations. For swipe cards: build with `drag` + `dragConstraints` + `onDragEnd` direction detection. More flexible than react-tinder-card. Widely used in production.

---

## 5. Data Tables

### TanStack Table v8 (`TanStack/table`)
| Field | Value |
|---|---|
| GitHub Stars | 112,660+ across TanStack ecosystem; TanStack table repo is the core |
| Last Commit | Active; latest v8.21.3 |
| Bundle Size | Small headless core; tree-shakable; import only hooks you need |
| Next.js App Router | Full compatibility; supports server-side pagination/sorting/filtering patterns; works with React 16.8–19 |
| Tailwind Support | Headless — apply Tailwind classes directly to `<table>`, `<th>`, `<td>` |
| License | MIT |

**Notes:** Gold standard headless table library. TypeScript-first (full rewrite in v8). Supports sorting, grouping, filtering, pagination, column pinning, aggregation. Widely adopted: 4B+ downloads across TanStack packages. Paired with shadcn/ui in nearly every serious 2026 Next.js dashboard stack. Zero opinion on markup or styles.

---

### AG Grid (`ag-grid/ag-grid`)
| Field | Value |
|---|---|
| GitHub Stars | One of the most widely used JS data grid libraries |
| Last Commit | Active |
| Bundle Size | ~140KB min+gzip (Community); ~200KB+ (Enterprise); modular `AllCommunityModule` registration available |
| Next.js App Router | Supported; `AgGridReact` must be in a Client Component (`"use client"`) |
| Tailwind Support | Custom theming via Theme Builder + CSS; requires 3–5 days effort to match Tailwind design system |
| License | Community: MIT (free forever); Enterprise: $999 USD/developer/year |

**Notes:** Extremely powerful for complex data grids. Community is free with core features (filtering, sorting, cell editing, pagination). Enterprise adds row grouping, pivot tables, server-side row models, dedicated support. Heavy bundle — evaluate against TanStack Table for most dashboard use cases. AG Grid Enterprise pricing is per-developer and perpetual.

**Community vs Enterprise quick guide:**
- Community: sorting, filtering, pagination, cell editing — free MIT
- Enterprise: row grouping, aggregation, pivot, server-side row model, integrated charts — $999/dev

---

## 6. Admin Templates / Design Systems

### Tremor (dashboard-focused)
*(See Charts section above — Tremor serves double duty as both chart library and admin template component system)*

---

### Refine (`refinedev/refine`)
| Field | Value |
|---|---|
| GitHub Stars | Active; widely referenced in 2026 admin template roundups |
| Last Commit | Active |
| Bundle Size | Framework-level; headless core with optional UI adapters |
| Next.js App Router | Full support; also supports Remix, React Native, Electron |
| Tailwind Support | First-class; also supports Ant Design, MUI, Mantine, Chakra |
| License | MIT |

**Notes:** React meta-framework for internal tools, admin panels, B2B apps. Provides auth, access control (RBAC), routing, networking, state management, i18n as headless hooks. Pairs with any UI layer. Recommended when the dashboard needs significant backend CRUD integration and will evolve over time. More opinionated than raw TanStack/shadcn but faster for data-heavy apps.

---

### shadcn/ui Dashboard Templates
| Template | Stars | Stack | License |
|---|---|---|---|
| `Kiranism/next-shadcn-dashboard-starter` | High (growing) | Next.js 16, shadcn/ui, TanStack Table, React Query, Tailwind | MIT |
| `arhamkhnz/next-shadcn-admin-dashboard` | Growing | Next.js 16 App Router, Tailwind v4, shadcn/ui | MIT |
| Taxonomy (shadcn reference) | ~19,200 | Next.js App Router, Prisma | MIT |
| next-forge (Turborepo) | ~6,900 | Next.js, shadcn/ui, Clerk, Stripe, Neon | MIT |
| Blazity Enterprise Boilerplate | ~7,400 | Next.js 15, Tailwind v4, Radix UI, Vitest, Playwright | MIT |

**Notes:** shadcn/ui's copy-paste model (components copied into your `src/`) gives full ownership with no package lock-in. All leading templates use the same 2026 core stack: Next.js 16 App Router + React 19 + TypeScript 5 + Tailwind CSS v4 + shadcn/ui + Recharts/Tremor + TanStack Table v8. All MIT licensed.

---

## Summary / Recommendations for isso-dashboard

| Category | Recommendation | Runner-up |
|---|---|---|
| Calendar | **FullCalendar** (most complete) | react-big-calendar (simpler) |
| Kanban DnD | **dnd-kit** (modern, maintained, MIT) | @hello-pangea/dnd (if migrating rbd) |
| Charts | **Tremor** (Tailwind-native, chart + UI kit) | Recharts (if already in stack) |
| Swipe Gestures | **Framer Motion / `motion`** (flexible, large ecosystem) | react-tinder-card (purpose-built but low maintenance) |
| Data Table | **TanStack Table v8** (headless, MIT, industry standard) | AG Grid Community (if heavy grid features needed) |
| Admin Template | **shadcn/ui + next-shadcn-dashboard-starter** (MIT, App Router native) | Refine (for heavy CRUD/backend-driven apps) |

**Key stack insight (2026):** The dominant isso-dashboard-compatible stack is Next.js 16 App Router + React 19 + Tailwind v4 + shadcn/ui + Tremor (charts) + TanStack Table v8 + dnd-kit (kanban) + Framer Motion (gestures). All MIT or Apache 2.0 licensed.
