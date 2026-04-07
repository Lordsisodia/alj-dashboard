# Shared — Cross-cutting primitives

Reusable UI primitives used across Discovery, Creators, and Pipeline tabs. No domain logic here.

---

## Components

| File | Purpose |
|---|---|
| `RatioBadge.tsx` | Colour-coded outlier ratio pill (pink ≥2×, amber ≥1.5×, green ≥1×) |
| `MiniStat.tsx` | Labelled metric card (label + bold value + optional trend) |
| `SkeletonRow.tsx` | Loading placeholder for table rows |
| `EmptyState.tsx` | Empty queue placeholder with CTA |
| `InfoTooltip.tsx` | Dark popover tooltip triggered by `i` button — takes `text` prop only |

---

## Barrel (`index.ts`)

```ts
export { RatioBadge }   from './RatioBadge';
export { MiniStat }     from './MiniStat';
export { SkeletonRow }  from './SkeletonRow';
export { EmptyState }  from './EmptyState';
// InfoTooltip is NOT re-exported — import directly from creators/discovery/InfoTooltip
```
