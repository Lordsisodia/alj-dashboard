# Architecture Alignment Cheatsheet

> Last updated: 2025-11-24

This page connects the visual/brand decisions we make in `docs/shared/brand-system/` with the architecture guardrails already defined under `docs/shared/architecture/monorepo/`.

## Current build scheme

| Area | Source | Notes |
| --- | --- | --- |
| Root app | `src/app` (Next.js App Router) | Hosts the unified shell + shared demo routes. Build via `npm run build` (Next 15 + Tailwind) and pulls global styles from `src/app/globals.css`. |
| Client experience | `apps/client` | Vite + React 18 + Tailwind + shadcn (`apps/client/README.md`). Ships the agency onboarding platform with Supabase auth. |
| Partnership portal | `apps/partners` | Vite + React 18 + Tailwind + shadcn (`apps/partners/README.md`). Focused on referral + commission workflows. |
| Shared styles | `src/domains/shared/styles/` | `color-system.css` + Tailwind animation helpers imported into both Next + domain code. |
| Component primitives | `components/ui/` & `src/domains/shared/components/` | Buttons, cards, glow dividers, background patterns, etc. Keep brand-approved components here before mirroring to `packages/ui` in the future. |
| Documentation | `docs/shared/architecture/monorepo/` | Contains `overview.md`, `structure-and-packages.md`, `monorepo-architecture-plan.md`, and ADRs. Any change to build targets or directory layout must be reflected there. |

## Key guardrails (pulled from `docs/shared/architecture/monorepo/structure-and-packages.md`)
- **Domain-first** – Apps are thin shells; domain logic migrates into future `packages/*` (UI, domain models, services). Design rules should anticipate that shared UI will eventually live in `packages/ui`.
- **Shared packages only via `packages/*`** – When we formalise a design token or component, plan to export it from a package instead of cross-importing app directories.
- **Docs co-located** – A brand rule that affects both apps belongs here (`docs/shared/brand-system`) with links back to architecture ADRs when build/layout decisions are required.

## How brand + architecture stay synced
1. **New palette / typography** – Update `color-system.md` + `src/domains/shared/styles/color-system.css`, then note any tooling impact (e.g., needing a `tailwind.config.ts` alias) in an ADR.
2. **Component promoted to shared** – Log it in `component-catalog.md`, move implementation under `components/ui` (short term) or `packages/ui` (when the package exists), and add an entry to the relevant architecture doc so engineers know the sanctioned API.
3. **Layout or build changes** – If a page review suggests altering container widths, breakpoints, or bundler outputs, sync with `docs/shared/architecture/monorepo/overview.md` so our build scheme + brand constraints never drift.

## Open questions to track
- Do we want a `docs/shared/brand-system/gallery/` that mirrors Storybook once `packages/ui` is active?
- When `packages/` fills up, do we split tokens into `@siso/tokens` or keep them inside `@siso/ui`?
- Which automated checks (lint, visual diff) should reference this folder to guarantee enforcement?

Log answers (or ADR links) below as we make decisions.
