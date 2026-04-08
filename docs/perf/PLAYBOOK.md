# ISSO Dashboard — Performance Playbook

> **Scope:** Every page and feature section in this app. Any agent touching rendering, data-fetching, or bundle shape must read this first.
> **Rule zero:** Ship no change that moves a Green metric to Yellow or a Yellow metric to Red without explicit sign-off.

---

## 1. Metric budgets

| Metric | Green | Yellow | Red | Tool |
|--------|-------|--------|-----|------|
| FCP (First Contentful Paint) | < 800 ms | 800–1 500 ms | > 1 500 ms | `perf:tti` |
| TTI / Load | < 1 200 ms | 1 200–2 000 ms | > 2 000 ms | `perf:tti` |
| LCP (Largest Contentful Paint) | < 1 200 ms | 1 200–2 500 ms | > 2 500 ms | Lighthouse |
| CLS (Cumulative Layout Shift) | < 0.05 | 0.05–0.10 | > 0.10 | Lighthouse |
| INP / FID | < 100 ms | 100–200 ms | > 200 ms | Lighthouse |
| Route chunk (parsed JS) | < 80 KB | 80–120 KB | > 120 KB | `perf:budgets` |
| JSON data feed | — | — | > 200 KB | `perf:budgets` |
| Hero image (above fold) | < 150 KB | 150–300 KB | > 300 KB | `perf:media` |

These budgets are enforced as hard failures on the values in the Red column.

---

## 2. Tooling map

All commands run from the project root with `pnpm`.

### 2a. Full-stack benchmark (primary)

```bash
# Requires dev server on :3000
node scripts/perf/benchmark-all-pages.mjs
```

- Runs Puppeteer against every isso + marketing + partners page
- 2 runs per page, averaged; throttled to mid-range Android (4× CPU, 10 Mbps)
- Outputs console table + `docs/perf/benchmarks/{date}.json`
- Ratings: 🟢 < 800 ms · 🟡 800–1 500 ms · 🟠 1 500–3 000 ms · 🔴 > 3 000 ms

Env overrides:
```
BENCH_RUNS=3          # more runs for stable averages
BENCH_THROTTLE=false  # no device throttle (laptop speeds)
BENCHMARK_URL=https://staging.alj.app  # hit staging instead of localhost
```

### 2b. Bundle analysis

```bash
ANALYZE=true pnpm build
open .next/analyze/client.html   # interactive treemap
pnpm perf:budgets                 # enforce 80 KB / 120 KB hard limits
```

Run after any new `import` or `dynamic()` change to a route-level component.

### 2c. TTI / FCP budget check

```bash
pnpm perf:tti
# Reads docs/partners/perf/baselines/ or lighthouse/ JSON
# FCP budget: 1 500 ms · TTI budget: 2 000 ms
```

### 2d. Hydration audit

```bash
pnpm perf:hydration
# Flags partners/ files using 'use client' without .client.tsx convention
```

Rule: only mark a component `'use client'` if it uses browser APIs, hooks, or event handlers. Everything else stays server by default.

### 2e. Hero media audit

```bash
pnpm perf:media
# Checks above-fold images for oversized source files
```

### 2f. Lighthouse budgets

```bash
pnpm perf:lighthouse-budgets
# Reads lighthouse/*.json — run `npx lighthouse <url> --output json` first
```

### 2g. Baseline capture (partners)

```bash
pnpm perf:baseline
# Starts dev server, captures Puppeteer traces, writes to docs/partners/perf/baselines/
```

### 2h. Route inventory

```bash
node scripts/perf/generate-route-inventory.mjs
# Outputs full list of app routes — use to scope benchmark coverage
```

---

## 3. When to run benchmarks

| Trigger | Required checks |
|---------|-----------------|
| New page / route added | `benchmark-all-pages` + `perf:budgets` |
| New `import` in a page component | `perf:budgets` |
| New image or hero media | `perf:media` |
| Added `'use client'` directive | `perf:hydration` |
| Convex query shape changed | `benchmark-all-pages` (Recon + Intelligence pages) |
| Pre-PR on any feature section | All of section 2a–2e |

---

## 4. Improvement patterns

Work through these in order — highest ROI first.

### 4a. Dynamic imports (biggest wins)

Replace static imports of heavy tab content with `dynamic()`:

```ts
// BEFORE
import { DiscoveryTab } from './discovery/DiscoveryTab';

// AFTER
const DiscoveryTab = dynamic(() => import('./discovery/DiscoveryTab'), {
  loading: () => <TabSkeleton />,
});
```

- Every tab component in a feature page should be `dynamic()`
- Target: only the active tab's JS ships on first paint
- Check: bundle treemap should show each tab as a separate chunk

### 4b. React Server Components — push down 'use client'

The isso pages under `src/app/isso/` are all client-rendered by default. To improve:

1. Keep `page.tsx` as a server component (no `'use client'`)
2. Only the interactive shell (`*FeaturePage.tsx`) needs `'use client'`
3. Static layout, header, sidebar → server components

Pattern:
```
page.tsx               ← Server: fetch initial data, pass as props
└── ReconFeaturePage   ← 'use client': tab state only
    └── DiscoveryTab   ← dynamic() loaded on demand
```

### 4c. Suspense boundaries

Wrap every async data region in `<Suspense>`:

```tsx
<Suspense fallback={<TableSkeleton />}>
  <CreatorsTable />
</Suspense>
```

- Prevents the whole page blocking on one slow Convex query
- Each tab should have its own Suspense boundary
- Skeleton components live in `components/{tab}/` alongside the real component

### 4d. Convex query optimisation

- Use `useQuery` with narrow field projections — avoid `select *` on large tables
- Paginate with `usePaginatedQuery` for `trackedAccounts` and `creatorCandidates`; never load all rows
- Batch related queries into a single `useQuery` call when possible
- Long-poll subscriptions (Convex real-time) don't cost a re-render if data hasn't changed — but do check `isLoading` guards to prevent empty-state flash

### 4e. Image optimisation

All creator avatars and media must go through `next/image`:

```tsx
<Image
  src={avatarUrl}
  width={48}
  height={48}
  alt={handle}
  placeholder="blur"
  blurDataURL={TINY_BLUR_DATA_URL}
/>
```

- R2 CDN URLs are already whitelisted in `next.config.js`
- Never use `<img>` for above-fold content
- Avatar images should be ≤ 100 KB at their display size

### 4f. Bundle splitting checklist

Investigate a chunk if it exceeds 80 KB parsed:

1. Open `.next/analyze/client.html`
2. Find the oversized chunk
3. Common culprits and fixes:

| Culprit | Fix |
|---------|-----|
| `recharts` or chart libs | `dynamic()` wrap the chart component |
| `@dnd-kit/*` | Already in recon — confirm it's in a dynamic chunk |
| Large icon libraries | Import icons individually, not the whole set |
| Lodash full bundle | `import debounce from 'lodash/debounce'` not `from 'lodash'` |
| Moment.js | Replace with `date-fns` (tree-shakeable) |

### 4g. Font and CSS

- All fonts use `next/font` — already configured; don't add raw `@import` font URLs
- Tailwind purges unused classes at build — don't add arbitrary CSS files unless necessary
- Animate with `transform`/`opacity` only — no `height` or `top` animations (force layout)

---

## 5. Isso dashboard — current state

> Last audited: April 2026

| Page | Status | Notes |
|------|--------|-------|
| `/isso/recon` | 🟡 Yellow | Heavy — dnd-kit + recharts load synchronously; needs dynamic() on all tabs |
| `/isso/intelligence` | 🟡 Yellow | Feed renders 50+ cards at once; needs virtualisation |
| `/isso/analytics` | 🟠 Slow | Not yet built out; baseline TBD |
| `/isso` (hub) | 🟢 Green | Lightweight shell |
| `/isso/models` | 🟡 Yellow | Avatar-heavy grid; needs pagination |
| Marketing home `/` | 🟢 Green | Fast reference |

### Recon — priority fixes

1. Wrap `DiscoveryTab`, `CreatorsTable`, `ReconFeedTab`, pipeline tab in `dynamic()`
2. Add `<Suspense>` boundary per tab in `ReconFeaturePage.tsx`
3. Paginate `trackedAccounts` query (currently loads all)
4. Move dnd-kit into a `dynamic()` boundary so it only loads when Discovery tab is active

### Intelligence — priority fixes

1. Virtualise the `PostCard` feed with `@tanstack/virtual` or `react-window`
2. Lazy-load images below the fold

---

## 6. Pre-PR perf checklist

Before marking any PR ready for review that touches rendering or data:

- [ ] `node scripts/perf/benchmark-all-pages.mjs` — no new Red pages, no Yellow → Red regressions
- [ ] `ANALYZE=true pnpm build && pnpm perf:budgets` — all route chunks within budget
- [ ] `pnpm perf:hydration` — no new `'use client'` violations
- [ ] `pnpm perf:media` — no oversized hero images
- [ ] New tab components wrapped in `dynamic()`
- [ ] New Convex queries paginated or field-projected
- [ ] No `<img>` tags for creator/media images (use `next/image`)

---

## 7. Adding a new page — perf requirements

1. Add the route to `PAGES` array in `scripts/perf/benchmark-all-pages.mjs`
2. Server component by default (`page.tsx` — no `'use client'`)
3. All tab/section components loaded via `dynamic()`
4. Each async data section wrapped in `<Suspense>`
5. Skeleton component created before the real component (skeleton ships in the initial bundle)
6. Run full benchmark before first merge

---

## 8. Benchmark output format

Reports write to `docs/perf/benchmarks/{date}.json`:

```json
{
  "timestamp": "2026-04-08T10:00:00Z",
  "throttled": true,
  "pages": [
    {
      "label": "ISSO Recon",
      "path": "/isso/recon",
      "group": "isso",
      "avgFcp": 1240,
      "avgLoad": 1890,
      "rating": "🟡 OK"
    }
  ]
}
```

Compare against previous report to detect regressions:
```bash
diff <(jq '.pages[] | {label, avgFcp, avgLoad}' docs/perf/benchmarks/2026-04-07.json) \
     <(jq '.pages[] | {label, avgFcp, avgLoad}' docs/perf/benchmarks/2026-04-08.json)
```
