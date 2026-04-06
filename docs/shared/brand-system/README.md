# SISO Brand System Track

This track keeps the cross-portal brand, color, and component specifications in one place so every new screen (client, partner, or shared) can be built “to spec” without re-reading scattered files.

## Why this folder
- **Single source of truth** for palettes, typography, layout primitives, and interaction patterns that currently live across `src/domains/shared/styles/` and `components/ui/`.
- **Review log** for when we walk through each page and capture the blocks, animations, or interactions worth standardising.
- **Bridge to architecture** so visual rules stay aligned with the monorepo guardrails that already live in `docs/shared/architecture/`.

## What’s here now
1. [`color-system.md`](./color-system.md) – canonical palette + tokens mapped to `src/domains/shared/styles/color-system.css`.
2. [`typography-and-spacing.md`](./typography-and-spacing.md) – font stacks, letter-spacing conventions, size tokens, chip/button shapes, and layout padding so an AI can recreate typography without hunting through components.
3. [`component-presets.md`](./component-presets.md) – quick API snippets (structure + class mix) for components like CommunityWidgetCard, TierProgressCard, StageMixBar, etc.
4. [`component-catalog.md`](./component-catalog.md) – a running list of reusable sections / blocks with space to note the screens you like plus links to their source files.
5. [`page-audit-template.md`](./page-audit-template.md) – short checklist for capturing feedback as we tour every page.
6. [`architecture-alignment.md`](./architecture-alignment.md) – quick reference that links the brand rules back to the existing monorepo layout, build scheme, and deployment guardrails.

As we collect more assets (logos, photography rules, motion), add more markdown files here and link them from this README.

## Working process
1. **Inventory** – Capture what already exists (tokens, fonts, gradients, behaviors) in the relevant doc so nothing gets duplicated.
2. **Page Reviews** – For every screen, clone the table in `component-catalog.md`, attach screenshots or Figma references, and log what you like inside the “Keeps” and “Future improvements” columns.
3. **Decide** – Once a section has recurring praise, freeze its API (props, color usage) via an ADR or checklist entry so both apps use the same implementation.
4. **Enforce** – When a rule hardens, update Tailwind tokens, shared components, or lint checks so we can’t drift.

## When to update this folder
- A new palette, typography pair, spacer scale, or animation is approved.
- A page review surfaces a component deviation worth standardising.
- Architecture guardrails shift (e.g., build target, package layout) and the brand rules need to reflect that reality.

For now everything is markdown + checklists to stay lightweight. If we later want live previews or Storybook docs, we can point to this folder as the authoritative copy and auto-generate UI from it.
