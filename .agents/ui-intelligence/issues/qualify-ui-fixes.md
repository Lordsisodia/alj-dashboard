# Qualify Tab — UI Fix Issues
**For:** ui.intelligence.qualify (surface:34)
**Date:** 2026-04-07
**Status:** Ready to implement

---

## QUALIFY-1: Remove duplicate controls from page-level top bar

**Problem:** `MetricPill` (Eng Rate / Views), `TimePill` (7d / 30d / 90d), and the "Add Filter" dropdown (Niche / Platform) all appear in `ContentPageShell`'s top-right header bar. These same controls already live inside `QualifyTableView`'s own toolbar — they're duplicated and shouldn't be at page level.

**Root cause:** `IntelligenceFeaturePage.tsx:46–51` sets `filterRightSlot` and `filterCategories` when `activeTab === 'qualify'`.

**Fix:**
- In `IntelligenceFeaturePage.tsx`, remove `filterRightSlot` entirely (set to `undefined`)
- Set `filterCategories` to `undefined` for qualify tab (remove `QUALIFY_FILTERS` from the page shell)
- Move niche + platform state management down into `QualifyTableView` (add local `niche` / `platform` state, render niche/platform filter chips in the table toolbar alongside days/metric/view toggle)
- Remove `niche` and `platform` props from `QualifyView` / `TrendsView` → `QualifyTableView` chain (they're no longer needed at page level)

**Files:**
- `src/features/intelligence/components/IntelligenceFeaturePage.tsx` — remove filterRightSlot + filterCategories for qualify
- `src/features/intelligence/components/trends/TrendsView.tsx` — remove niche/platform props
- `src/features/intelligence/components/qualify/QualifyTableView.tsx` — add local niche/platform state + chips in toolbar

---

## QUALIFY-2: Outlier panel — remove duplicate "Outlier Alerts 20" title

**Problem:** The outlier panel has two stacked titles:
1. `"Outlier Alerts [20]"` — outer panel header (has the badge count)
2. `"Outlier Alert Feed / Posts massively outperforming their baseline"` — inner section header

The outer `"Outlier Alerts [20]"` is redundant and noisy. Remove it.

**Fix:**
- In `OutlierPanel.tsx`, remove the outer header row that renders `"Outlier Alerts"` + the badge count `[20]`
- Keep `"Outlier Alert Feed"` as the primary title inside the panel

**Files:**
- `src/features/intelligence/components/qualify/OutlierPanel.tsx`

---

## QUALIFY-3: Outlier panel — remove filter chips row

**Problem:** Filter chips `All | Competitors | Own | 1× | 2× | 5×` appear below the panel header. These add complexity without clear value and clutter the panel.

**Fix:**
- Remove the filter chips row (`All`, `Competitors`, `Own`, `1×`, `2×`, `5×`) from `OutlierPanel.tsx`
- Show all outlier posts unfiltered (or keep only the default `All` behaviour with no visible chips)

**Files:**
- `src/features/intelligence/components/qualify/OutlierPanel.tsx`

---

## QUALIFY-4: Column names + padding/spacing — align with Recon Creators table

**Problem:** Column names are unclear and the header/row padding doesn't match the Recon Creators table standard.

**Current columns:** `#` | `SAVED` | `ACCOUNT` | `NICHE` | `VIEWS` | `LIKES` | `COMMENTS` | `BASELINE`

**Reference:** `src/features/recon/components/creators/CreatorsTable.tsx` — use this as the visual standard.

**Fixes:**
1. Rename columns to be cleaner:
   - `ACCOUNT` → `Creator` (match Recon)
   - `BASELINE` → `Baseline ×` (make clear it's a multiplier, not a raw score)
   - `SAVED` header → use a bookmark/save icon instead of text (match Recon's Heart icon pattern)
   - Consider adding `Type` column (reel / post / carousel) — small pill, low width
2. Header row height: match Recon's `height: 36` with `backgroundColor: '#f9f9f9'` and `borderBottom: '1px solid rgba(0,0,0,0.10)'`
3. Row height: match Recon's `estimateSize: () => 48`
4. Column header text: match Recon's `text-[10px] font-semibold uppercase tracking-[0.12em] text-neutral-400`
5. Add consistent `borderRight` dividers between columns (Recon uses `COL_BORDER` constant)

**Files:**
- `src/features/intelligence/components/qualify/QualifyTableView.tsx`

---

## QUALIFY-5: "New Board" button → "Add Lead" dropdown

**Problem:** The `+ New Board` action button in the top-right of the page shell doesn't belong on the Qualify tab. The right action here is adding a lead (a creator/account) to the database.

**Fix:**
- Change the button label from `"New Board"` to `"Add Lead"`
- Make it a dropdown (small caret) with one option for now: `"Add creator handle"` — opens a simple modal with a text input for an Instagram/TikTok handle and a Niche selector, then calls the existing `api.recon.addTrackedAccount` mutation (or equivalent)
- Keep the pink gradient style

**Files:**
- `src/features/intelligence/components/IntelligenceFeaturePage.tsx` — change `actionLabel` + `actionIcon`, wire up dropdown/modal
- New small modal component if needed (keep it inline or a simple `<dialog>`)

---

## QUALIFY-6: "Posts indexed" — merge count into single pill

**Problem:** The header shows two separate elements: `"Intelligence"` title + a standalone `"Posts indexed 751"` pill badge. This creates visual clutter with an unnecessary secondary pill.

**Current:** `[Intelligence]  [Posts indexed] [751]`
**Target:** `[Intelligence]  [Posts indexed | 751]` — one pill, vertical divider between label and number

**Fix:**
- In `ContentPageShell` (or `IntelligenceFeaturePage.tsx`), update the `stat` prop rendering so the label and value appear in a **single pill** separated by a thin vertical divider (`|` or a `<div className="w-px h-3 bg-neutral-300">`)
- Remove the secondary standalone count pill

**Files:**
- `src/app/isso/layout/ContentPageShell.tsx` — update stat pill rendering (check how it renders `stat.label` + `stat.value`)
- If ContentPageShell is shared across other products, make the change backwards-compatible (single pill should work for all)

---

## Definition of done
- [ ] Top bar: no MetricPill, no TimePill, no Add Filter on qualify tab
- [ ] Niche/platform filtering works inside QualifyTableView toolbar
- [ ] Outlier panel: single title ("Outlier Alert Feed"), no filter chips
- [ ] Column headers renamed + styled to match Recon standard
- [ ] Row/header padding matches Recon (36px header, 48px rows)
- [ ] "New Board" → "Add Lead" dropdown with handle+niche input modal
- [ ] Posts indexed stat: single pill with vertical divider (label | count)
- [ ] `pnpm build` passes — zero TypeScript errors
