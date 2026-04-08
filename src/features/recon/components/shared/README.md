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
| `EnrichDot.tsx` | Enrichment status dot indicator |
| `ScoreBadge.tsx` | Numeric score badge with colour tier |
| `Sparkline.tsx` | 7-day mini trend line |
| `ProfileHealthBar.tsx` | Segmented profile completeness bar |
| `StatCard.tsx` | Stat summary card with label and value |

---

## Barrel (`index.ts`)

```ts
export { RatioBadge }   from './RatioBadge';
export { MiniStat }     from './MiniStat';
export { SkeletonRow }  from './SkeletonRow';
export { EmptyState }  from './EmptyState';
// InfoTooltip is NOT re-exported — import directly from components/discovery/InfoTooltip
```
