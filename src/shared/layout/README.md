# shared/layout

> Core layout shells used by every dashboard page.
> Owner: shared (all dashboards)
> Import alias: `@/isso/layout/*`

## Key Components

| File | Import | What it does |
|---|---|---|
| `ContentPageShell.tsx` | `@/isso/layout/ContentPageShell` | Universal page template — header + tabs + filter bar + content area |
| `IssoSidebarShell.tsx` | via `isso-sidebar/` | Full sidebar: icon rail + detail panel + product icons + nav |
| `ProductIcon.tsx` | `@/isso/layout/ProductIcon` | Renders product sprite PNG at any size |
| `PageHeader.tsx` | `@/isso/layout/PageHeader` | Reusable page header bar |
| `Shell.tsx` | `@/isso/layout/Shell` | Base shell wrapper |
| `isso-sidebar/` | — | Sidebar implementation files |
| `two-level-sidebar/` | — | Two-level sidebar variant (legacy/partners) |

## ContentPageShell — The Universal Template

**Every single feature page uses this. No exceptions.**

```tsx
<ContentPageShell
  title="Models"
  icon={<ProductIcon name="models" size={32} />}
  statPill={{ label: '4 active', value: '4' }}
  tabs={[{ id: 'roster', label: 'Roster' }, { id: 'pipeline', label: 'Pipeline' }]}
  activeTab={activeTab}
  onTabChange={setActiveTab}
  actionLabel="+ New Model"
  accentGradient="linear-gradient(135deg, #ff0069, #833ab4)"
>
  <div className="flex-1 overflow-y-auto px-6 py-6">
    {/* tab content */}
  </div>
</ContentPageShell>
```

Three rows above scrollable content:
- **Row 1 (h-14):** Icon + Title + StatPill | Search | Action button
- **Row 2 (px-3 py-2):** Tab pills | Filter controls
- **Row 3:** Scrollable content area (`flex-1 overflow-y-auto px-6 py-6`)

## IssoSidebarShell — The Sidebar

Two-level system built on `CampusSidebar`:
- **Level 1 (icon rail, w-16):** 5 product icons + persistent nav items
- **Level 2 (detail panel):** Section title + nav links

Key files in `isso-sidebar/`:
- `IssoSidebarShell.tsx` — full sidebar component
- `sidebar-config.tsx` — product icons and persistent nav config
- `IssoIconNav.tsx` — icon rail component
- `IssoDetailSidebar.tsx` — detail panel component
- `navigation-store.tsx` — Zustand store for active product state

## ProductIcon

```tsx
<ProductIcon name="hub" size={32} />
<ProductIcon name="intelligence" size={20} />
```

Renders the product sprite PNG. Always use this — never raw images or emoji for product icons.

## Import Rules

- Import via `@/isso/layout/*` alias — not relative paths
- Do not modify `IssoSidebarShell` without verifying all 3 dashboards still work
- `ContentPageShell` accepts an `accentGradient` prop — pass the correct gradient per product
