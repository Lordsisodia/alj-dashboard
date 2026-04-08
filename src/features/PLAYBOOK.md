---

# ISSO Feature Section Playbook

> **Scope:** Every tab-based feature section under `src/features/*`. The **recon** feature is the reference implementation. INTELL, HUB, CONTENT GEN, AGENTS follow this exactly.
> **Rule zero:** If the recon tree and this document disagree, this document wins and recon gets fixed.

---

## 1. Canonical folder template

Replace `{section}` with the lowercase feature slug (`intelligence`, `hub`, `content-gen`, `agents`). Replace `{Section}` with the PascalCase name. Replace `{tab}` with each tab slug.

```
src/features/{section}/
├── README.md                    ← feature overview (Section 3a)
├── ANIMATIONS.md                ← optional, only if >3 custom animation systems
├── types.ts                     ← core domain types (used everywhere)
├── types/                       ← optional: tab-scoped types that bloat types.ts
│   ├── index.ts                 ← barrel re-exporting from ../types.ts + local files
│   └── {tab}.ts                 ← one file per tab with tab-only types
├── constants.ts                 ← animation variants, enums, seed lists
├── {section}Data.ts             ← seed data + computed helpers (optional)
├── hooks/                       ← FEATURE-LEVEL hooks only
│   ├── index.ts                 ← REQUIRED barrel
│   ├── use{Tab1}Tab.ts          ← one per tab, holds that tab's UI state
│   ├── use{Tab2}Tab.ts
│   └── use{SharedConcern}.ts    ← cross-tab hooks (e.g. useEnrich)
└── components/
    ├── {Section}FeaturePage.tsx ← root shell: tab routing + modal state ONLY
    ├── {Section}Modals.tsx      ← modal state bridge
    ├── shared/                  ← cross-tab primitives, NO domain logic
    │   ├── README.md            ← REQUIRED
    │   ├── index.ts             ← REQUIRED barrel
    │   └── *.tsx
    ├── modals/                  ← all modals for this feature
    │   ├── ModalShell.tsx
    │   ├── modalHelpers.ts
    │   └── *Modal.tsx
    ├── icons/                   ← feature-specific icons (optional)
    ├── {tab1}/                  ← one subfolder per tab
    │   ├── README.md            ← REQUIRED
    │   ├── {Tab1}Tab.tsx        ← the tab orchestrator
    │   ├── index.ts             ← barrel IF imported from >1 site
    │   ├── rows/
    │   ├── cards/
    │   ├── detail/
    │   ├── charts/
    │   ├── filters/
    │   ├── hooks/               ← tab-level action & state hooks
    │   ├── {tab1}Utils.ts
    │   └── data.ts
    └── {tab2}/
        └── ...
```

### Hard rules

1. **One tab = exactly one subfolder** under `components/`. Name matches the URL query param.
2. **The root shell** does three things only: `useState<Tab>`, modal/drawer state, render with tab-routed children. Nothing else.
3. **Shared primitives** in `components/shared/` must not import from any tab folder.
4. **Cross-tab imports are banned.** If two tabs need the same thing, it moves to `shared/`.
5. **Every subfolder under `components/` gets a `README.md`**. No exceptions for tabs or `shared/`.
6. **Barrel discipline:** `shared/index.ts` and `hooks/index.ts` are required. Tab `index.ts` only if the tab exports items consumed from outside. Tabs loaded only via `dynamic()` from root shell do not need a barrel.

---

## 2. Size budget

| File type | Soft | Hard | Action at hard |
|---|---|---|---|
| Tab orchestrator (`{Tab}Tab.tsx`, `{Tab}View.tsx`, `{Tab}Dashboard.tsx`) | 250 | 350 | Extract sub-orchestrator |
| Regular component (rows, cards, panels, sections) | 150 | 250 | Split by role |
| Hook (`use*.ts`) | 80 | 150 | Split by concern |
| Util / data / transform file | 150 | 250 | Split by domain |
| Root shell (`{Section}FeaturePage.tsx`) | 220 | 280 | Move tab wiring into tab hook |
| README.md | — | 120 | Prune — keep component map + data flow only |

---

## 3. README templates

### 3a. Feature-root README (100 lines max)

```markdown
# {Section} — {one-line product description}

{2–3 sentence paragraph.}

---

## Pipeline

```
{Tab1}  →  {Tab2}  →  {Tab3}  →  {Tab4}
```

---

## Structure

{Paste exact output of `tree -L 3` — keep current, not idealised}

---

## The {N} Tabs

### ① {Tab1} — {one-line purpose}
**Route:** `/isso/{section}` (default)
{2–3 sentences.}
**Orchestrator:** `components/{tab1}/{Tab1}Tab.tsx`

---

## Key types

```ts
{Type1}    — {one-line meaning}
```

---

## Feature-level hooks

| Hook | Owns |
|---|---|
| `use{Tab1}Tab` | {tab1}'s UI state |
```

### 3b. Per-tab README (60 lines max)

```markdown
# {Tab} — {one-line purpose}

{2–3 sentences: what this tab owns and what it does NOT own.}

---

## Component map

| File | Purpose |
|------|---------|
| `{Tab}Tab.tsx` | Orchestrator. Wires {sources}, renders {layout}. |

---

## Data flow

{Where data comes from, where mutations go.}

---

## Subfolder guide

| Folder | Contents |
|--------|---------|
| `rows/` | ... |
```

### 3c. `shared/README.md` (40 lines max)

Table of primitives only. **Bold rule: no domain logic.**

### 3d. `components/README.md` (OPTIONAL)

Only if >6 top-level folders and a newcomer can't orient from the feature-root tree.

---

## 4. Naming conventions

### Component role vocabulary (prescriptive)

| Suffix | Meaning |
|---|---|
| `{X}Tab` | Tab orchestrator. Exactly one per tab folder. |
| `{X}View` | Full-pane detail takeover. Owned by a tab. |
| `{X}Dashboard` | Read-only / analytics-first tab orchestrator. |
| `{X}Panel` | Right-side or side-docked drawer. |
| `{X}Section` | Vertical subdivision inside a View or Panel. |
| `{X}Row` | One item in a list view. Horizontal layout. |
| `{X}Card` | One item in a grid view. Vertical layout. |
| `{X}Cell` | A single field inside a Row. |
| `{X}Column` | Vertical kanban column containing Rows/Cards. |
| `{X}Header` | Sticky top strip of a Tab, View, or Panel. |
| `{X}Toolbar` | Action strip (search + buttons) for a Tab. |
| `{X}Widget` | Standalone visual block, usually in a sidebar. |
| `{X}Chart` | Data visualisation. Always inside `{tab}/charts/`. |
| `{X}Modal` | Dialog. Always inside `components/modals/`. |

**Banned:** `Container`, `Wrapper`, `Box`, `Helper`, `Stuff`, `Misc`, `Common`.

### File naming

| Kind | Case | Example |
|---|---|---|
| React component | `PascalCase.tsx` | `CandidateRow.tsx` |
| Hook | `camelCase.ts` starting with `use` | `useDiscoveryActions.ts` |
| Util | `camelCase.ts` ending in `Utils` | `tableUtils.ts` |
| Data | `camelCase.ts` named `data.ts` or `{domain}Data.ts` | `creatorData.ts` |
| Types | `camelCase.ts` named `types.ts` or `{tab}.ts` in `types/` | `feed.ts` |
| Barrel | `index.ts` | `index.ts` |

### Hook naming

Feature-level (`src/features/{section}/hooks/`):
- `use{Tab}Tab()` — one per tab — pure `useState` for that tab's UI state. No Convex queries.
- `use{Concern}()` — cross-tab hooks. May call Convex.

Tab-level (`components/{tab}/hooks/`):
- `use{Action}()` — action bundles. Take dependencies via a single `deps` object.
- `use{Tab}State()` — local table/grid state.

---

## 5. Import discipline

**Allowed:**

```
root shell  →  {tab}/                (orchestrator only, via dynamic())
root shell  →  hooks/                (feature-level hooks)
{tab}       →  {tab}/subfolders/     (own subfolders only)
{tab}       →  shared/              (UI primitives)
{tab}       →  hooks/ (feature)     (own tab's use{Tab}Tab hook only)
{tab}       →  ../../types          (feature types)
{tab}       →  ../../constants      (feature constants)
shared      →  nothing              (pure presentation)
```

**Banned:**

```
{tab-a}  ✗  {tab-b}          (cross-tab import)
shared   ✗  {tab}/           (shared cannot know tabs)
shared   ✗  ../../hooks      (shared has no state)
{tab}    ✗  another feature  (features are isolated)
```

Use `@/features/{section}/...` path aliases for anything crossing two directory levels.

Dynamic imports for tabs are required at the root shell:

```ts
const {Tab}Tab = dynamic(
  () => import('./{tab}/{Tab}Tab').then(m => ({ default: m.{Tab}Tab })),
  { ssr: false }
);
```

---

## 6. Build order for a new section

### Phase 1 — Scaffold (30 min)
- [ ] Create `src/features/{section}/` with `README.md`, `types.ts`, `constants.ts`
- [ ] Create `components/{Section}FeaturePage.tsx` — tab state + stub shell only
- [ ] Create `hooks/index.ts` (empty) and `components/shared/index.ts` (empty)
- [ ] Wire into `src/app/isso/{section}/page.tsx`
- [ ] Add to sidebar nav
- [ ] Verify empty shell renders without errors

### Phase 2 — Types + shared primitives (1 h)
- [ ] Populate `types.ts` with domain types
- [ ] Create `components/shared/` primitives (copy from recon if semantics match)
- [ ] Write `components/shared/README.md`
- [ ] Export everything from `components/shared/index.ts`

### Phase 3 — Build one tab end-to-end (2–4 h per tab)
- [ ] Create `components/{tab}/` folder
- [ ] Stub `{Tab}Tab.tsx` orchestrator
- [ ] Create `hooks/use{Tab}Tab.ts` for UI state
- [ ] Wire into root shell via `dynamic()`
- [ ] Build rows/cards/filters/charts in their subfolders
- [ ] Add `components/{tab}/hooks/` when orchestrator passes 200 lines
- [ ] Write `components/{tab}/README.md`
- [ ] Run size budget audit on every file

### Phase 4 — Modals + icons (1 h)
- [ ] Create `components/modals/` with `ModalShell.tsx` + `modalHelpers.ts`
- [ ] Create `components/{Section}Modals.tsx` modal state bridge
- [ ] Create `components/icons/` if needed

### Phase 5 — Repeat Phase 3 for each remaining tab

### Phase 6 — Audit gate (mandatory before merge)
- [ ] Every subfolder under `components/` has a `README.md`
- [ ] Every subfolder with >1 external consumer has an `index.ts` barrel
- [ ] No file exceeds hard size budget
- [ ] Zero cross-tab imports (grep check)
- [ ] Zero imports from `shared/` inside `shared/` itself
- [ ] Root shell has no business logic
- [ ] Feature-root `README.md` tree matches real tree (`tree -L 3`)
- [ ] Tab READMEs list every file in that folder, nothing that isn't there
- [ ] No banned component name suffixes (`Container`, `Wrapper`, `Box`, etc.)
- [ ] `pnpm build` passes

---

## 7. Recon — reference implementation grade

| Criterion | Grade | Notes |
|---|---|---|
| Canonical folder template | A | All six tab/shared/modals folders present |
| Root shell purity | A− | 222 lines, tab+modal state only, but `SchedulePicker` is inlined (should move to `discovery/`) |
| One tab = one subfolder | A | `discovery`, `table`, `detail`, `pipeline`, `feed` cleanly separated |
| Shared primitives | B | Good set, but `shared/README.md` was stale (now fixed) |
| Per-tab READMEs | A | All five present, consistent shape |
| Feature-root README | C→A | Was stale (described old `components/creators/`), now fixed |
| Size budget | B− | Four orchestrators above soft ceiling, all under hard ceiling |
| Component role vocabulary | A | Consistent use throughout |
| Import discipline | A | Dynamic imports used, no cross-tab imports |
| Feature-level hook split | A | Feature hooks = pure useState, tab hooks = action bundles |

**Overall: B+ / A−** — the correct reference implementation.

---

## 8. Recommended next actions

1. **Run Phase 6 audit against `intelligence/`** before adding any more work — it already has `insightsTypes.ts`, `trendsTypes.ts`, `filterConfig.tsx` at root (the pre-refactor smell).
2. **Add a pre-commit hook** that fails on any `.tsx` file in `src/features/*/components/` over 350 lines.
3. **Add a scaffold script** `scripts/new-feature.ts` that creates the Phase 1 skeleton in 30 seconds.

---

*Reference implementation: `src/features/recon/`. Last updated: 2026-04-08.*
