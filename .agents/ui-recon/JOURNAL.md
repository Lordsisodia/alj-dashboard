# Journal — ui.recon

## 2026-04-07 — Folder created
**Did:** Initialized agent workspace. Status synced from clients-pm.
**State:** Reference implementation. Dashboard ✅, 3 step pages ✅, 1/3 AI features ✅.
**Next:** Add 2 more AI features to dashboard. Finish Airtable creators redesign.

---

## 2026-04-07 — Quality Audit

### Static Data Audit

**Finding: Mixed — not as broken as ORGANISER suggests, but 2 components still purely static.**

#### `CreatorsTable.tsx` — HYBRID (acceptable pattern)
- Line 29: Initializes from static `COMPETITORS` seed
- Line 62: Overlays real Convex `api.intelligence.getCreatorStats` onto every row
- Pattern: static seeds → Convex live overrides. Acceptable fallback. No action needed.
- **Verdict:** OK. Not a bug.

#### `DashboardWidgets.tsx` — STATIC (needs fixing)
Two purely static reads, no Convex fallback:

1. `ViralAlertBanner` (line 11): `SEED_CANDIDATES.filter(c => c.outlierRatio >= 2.0)` — hardcoded seed data
2. `TopPerformerCard` (line 36): `[...COMPETITORS].sort(...)` — hardcoded `COMPETITORS` array

Both need real Convex queries. `ViralAlertBanner` should read from `api.candidates.list` with outlier filter. `TopPerformerCard` should read from `api.intelligence.getCreatorStats` sorted by postsToday.

**Verdict:** 2 widgets need Convex wiring. Not blocked — can be done incrementally.

#### `LogDashboard.tsx` — PROPER FALLBACK ✓
- Lines 58-65: Real `dbStats` from `api.intelligence.getReconDashboardStats` used as primary; `COMPETITORS` static used only as fallback
- `DAILY_VOLUME` (static) used only for chart when `dbStats` unavailable — acceptable
- **Verdict:** Correctly implemented.

### Pattern Compliance (2/3 AI features)
- ✅ Weekly Intel Digest (streaming SSE)
- ✅ AI Verdict scoring (OpenRouter → Convex write)
- ❌ Missing: viral velocity alert (>5x engagement spike on tracked accounts)

### 21st.dev Integration
- None implemented. ORGANISER suggests: `DiscoveryTab` headers + `LogDashboard` metric cards as first targets.

### Code Quality Notes
- `creatorData.ts` and `constants.tsx` re-export the same data — consolidation opportunity
- `SEED_CANDIDATES` (25 entries) and `COMPETITORS` (8 entries) share some handles (e.g. `@minaxash`) — potential data divergence
- `CreatorsTable` virtualizes with `@tanstack/react-virtual` — good for performance
- `LogDashboard` sidebar (`ActivityFeed`) is sticky but uses plain scroll, not virtualized — may lag on long feeds

### Priority Fixes
1. **High:** Wire `ViralAlertBanner` → `api.candidates.list` (outlierRatio filter)
2. **High:** Wire `TopPerformerCard` → `api.intelligence.getCreatorStats` (top by postsToday)
3. **Medium:** Add 3rd AI feature — viral velocity alert
4. **Low:** 21st.dev on DiscoveryTab / LogDashboard metric cards
5. **Low:** Deduplicate `creatorData.ts` / `constants.tsx` re-exports
