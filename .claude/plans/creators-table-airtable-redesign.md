# Creators Table — Airtable-Style Redesign

> Plan created: 2026-04-06
> Status: Awaiting confirmation
> Scope: `src/features/recon/components/creators/CreatorsTable.tsx` + supporting components
> Complexity: MEDIUM (single component, no data model changes)

---

## Context

The Creators table at `/isso/recon` (creators tab) currently uses a CSS Grid layout with fixed-width columns that leave dead space, no column dividers, and weak header separation. The goal is to make it look and feel like Airtable: data-dense, well-spaced, professional, with clear visual hierarchy.

**File being redesigned:** `src/features/recon/components/creators/CreatorsTable.tsx`
**Supporting files touched:** `ScoreBadge.tsx`, `ProfileHealthBar.tsx`, `ScoreColumnHeader.tsx`
**Data model:** `Competitor` type in `src/features/recon/types.ts` — no changes needed

---

## Visual Style Decisions

| Decision | Choice | Rationale |
|---|---|---|
| **First column sticky?** | YES — Creator column sticky left with `position: sticky; left: 0; z-index: 10` | Creator identity must always be visible when horizontal scroll occurs on smaller screens |
| **Row numbers?** | YES — `#` column, 40px, muted `text-neutral-300`, `text-[11px]` | Airtable convention; gives spatial anchor when scanning rows |
| **Checkboxes?** | Show on hover + always show when any row is selected. When >= 1 row selected, header checkbox appears for select-all | Avoids visual clutter at rest while enabling bulk actions |
| **Border style?** | Vertical column dividers (`1px solid rgba(0,0,0,0.08)`) on every cell + horizontal row borders | Full Airtable grid look. Not full cell borders (too heavy) — vertical dividers between columns, horizontal between rows |
| **Empty cells (`--`)?** | Render as `--` in `text-neutral-300` italic, right-aligned to match number columns | Consistent with Airtable's empty cell treatment; avoids layout shift |
| **Column resize handles?** | OUT OF SCOPE for this pass | Noted for Phase 2 |
| **Row height** | 48px (`py-3` stays, but row min-height enforced) | Airtable standard; gives breathing room to badges and sparklines |
| **Hover state** | `bg-blue-50/40` (subtle blue tint, not grey) | Matches Airtable's selection-hint hover |
| **Header** | `bg-neutral-50` with stronger bottom border `rgba(0,0,0,0.12)`, sticky top | Clearer separation from data rows |

---

## Column Specification

Total columns: 11 (was 9). New: `#` row number, checkbox. Reordered per brief.

| # | Column | Min Width | Behavior | Alignment | Notes |
|---|---|---|---|---|---|
| 0 | Checkbox | 36px | Fixed | Center | Custom checkbox, 16x16. Hidden at rest, visible on row hover or when any row selected |
| 1 | # | 40px | Fixed | Center | Row number, `text-[11px] text-neutral-300 font-mono` |
| 2 | Creator | 220px min, `2fr` | Flex grow | Left | Avatar 36px circle (up from 9x9/36px — keep), name **bold** 13px, handle muted 11px below. Sticky left. Left border of cell acts as niche-color accent on hover (keep existing) |
| 3 | Niche | 100px | Fixed | Left | Pill badge: `rounded-full` (not `rounded-md`), `px-2.5 py-0.5`, `text-[11px]`. Sized to fill cell width minus 12px padding |
| 4 | Followers | 110px | Fixed | Right | `tabular-nums font-medium text-[13px]`. Format: `125K` / `1.2M`. Right-aligned with `pr-3` |
| 5 | Eng. Rate | 100px | Fixed | Right | Same numeric style. Show `%` suffix |
| 6 | Score | 90px | Fixed | Center | `ScoreBadge` + mini bar below (keep existing pattern) |
| 7 | Profile Health | 110px | Fixed | Left | `%` label + progress bar (keep `ProfileHealthBar`) |
| 8 | Trend | 100px | Fixed | Center | Sparkline (keep existing `Sparkline` component, widen to 80px) |
| 9 | Actions | 160px | Fixed | Right | Contains: Heart (always visible), Enrich, Pause/Play, External link. Non-heart actions: `opacity-0 group-hover:opacity-100` |

**New grid template:**
```
gridTemplateColumns: '36px 40px minmax(220px, 2fr) 100px 110px 100px 90px 110px 100px 160px'
```

This ensures the Creator column absorbs extra width (via `2fr`) instead of leaving dead space.

---

## Task Flow

### Step 1: Layout and Grid Restructure
**What:** Replace the current `TABLE_COLS` constant with the new 10-column grid. Add the `#` and checkbox columns. Make Creator column use `minmax(220px, 2fr)` so it absorbs available width.

**Acceptance criteria:**
- New grid template applied to both header and row
- Row number column renders 1-based index, styled `text-[11px] text-neutral-300 font-mono`
- Checkbox column renders a 16x16 custom checkbox (can be a simple `<input type="checkbox">` styled with Tailwind for now)
- Creator column stretches to fill — no dead horizontal space at any viewport width >= 1024px
- All existing data still renders in the correct columns

### Step 2: Borders, Dividers, and Header Treatment
**What:** Add vertical column dividers and strengthen the header.

**Acceptance criteria:**
- Every cell has a right border: `border-r border-[rgba(0,0,0,0.08)]` (last cell excluded)
- Header row: `bg-neutral-50`, bottom border `border-b-2 border-[rgba(0,0,0,0.12)]`, `sticky top-0 z-20`
- Header labels unchanged in style (`text-[10px] font-semibold uppercase tracking-[0.12em] text-neutral-400`) but now each sits inside a cell with the same right-border divider
- Row borders remain as `border-b border-[rgba(0,0,0,0.06)]`

### Step 3: Sticky Creator Column
**What:** Make the Creator column (and its preceding checkbox + row# columns) sticky on horizontal scroll.

**Acceptance criteria:**
- Columns 0-2 (checkbox, #, Creator) have `position: sticky; left: 0/36px/76px; z-index: 10`
- Background color set explicitly on sticky cells (so content behind doesn't bleed through): `bg-white` default, `bg-blue-50/40` on hover
- A subtle right shadow on the Creator column edge when scroll position > 0 (CSS `box-shadow: 2px 0 4px rgba(0,0,0,0.04)`) — can use an `IntersectionObserver` sentinel or just always-on shadow

### Step 4: Hover, Selection, and Checkbox Behavior
**What:** Implement Airtable-style hover and selection states.

**Acceptance criteria:**
- Row hover: `bg-blue-50/40` (replaces current `hover:bg-neutral-50/80`)
- Checkbox visibility: hidden by default (`opacity-0`), visible on row hover (`group-hover:opacity-100`), always visible when checked
- When >= 1 checkbox is checked: header checkbox appears (for select-all/deselect-all)
- Selection state stored in component state (`Set<number>` of selected IDs)
- Selected rows have a persistent `bg-blue-50/60` background
- Niche-color left accent on hover: KEEP (existing behavior, column 0 left edge)

### Step 5: Cell Content Polish
**What:** Refine individual cell rendering to match the Airtable density standard.

**Acceptance criteria:**
- Niche badge: `rounded-full` pill (not `rounded-md`), `text-[11px]`, proper horizontal padding so it doesn't look cramped
- Followers/Eng. Rate: `text-[13px] tabular-nums font-medium`, right-aligned, monospace-friendly
- Empty cells render `--` in `text-neutral-300 italic text-[12px]`, right-aligned for numeric columns
- Sparkline: width increased from 64px to 80px, height stays 24px
- Actions column: Heart always visible (keep), Enrich/Pause/External grouped, hover-only (keep existing pattern but ensure 160px gives them room without overlap)
- Score and Profile Health: no visual changes, just verify they fit the new cell widths

### Step 6: Row Height and Vertical Rhythm
**What:** Enforce consistent 48px row height and verify vertical centering.

**Acceptance criteria:**
- Each row has `min-h-[48px]` (or equivalent via padding)
- All cell content vertically centered (`items-center` on grid row — already present, verify)
- Header row can be slightly shorter: 40px
- No cell content clips or overflows at 48px height

---

## Files Changed Summary

| File | Change |
|---|---|
| `CreatorsTable.tsx` | Full layout restructure: new grid, new columns, borders, hover/selection, sticky |
| `ScoreBadge.tsx` | No changes expected (verify fit at 90px width) |
| `ProfileHealthBar.tsx` | No changes expected (verify fit at 110px width) |
| `ScoreColumnHeader.tsx` | May need border-right styling if it custom-renders the header cell |
| `types.ts` | No changes |
| `constants.ts` | No changes |

---

## Out of Scope

- Column resize handles (drag to resize) — Phase 2
- Column reordering (drag to reorder) — Phase 2
- Virtualized rendering (react-window / tanstack-virtual) — only needed at 100+ rows
- Bulk action toolbar (what happens after selecting rows) — separate plan
- Sort by column click — separate plan (but header cells should be designed to accept a sort icon later)
- Keyboard navigation (arrow keys between cells) — Phase 2

---

## Implementation Notes for Developer

1. **Do not switch to `<table>` HTML.** Keep CSS Grid — it handles sticky columns and mixed fixed/flex widths better than `<table>`.

2. **Sticky column shadow trick:** Use a pseudo-element on the Creator cell (`after:absolute after:right-0 after:top-0 after:bottom-0 after:w-1 after:shadow-[2px_0_4px_rgba(0,0,0,0.04)]`) that is always present. This avoids JS scroll listeners.

3. **Checkbox state:** Add `const [selected, setSelected] = useState<Set<number>>(new Set())` to `CreatorsTable`. Toggle on click, propagate to header for select-all.

4. **Preserve existing motion variants.** The `containerVariants` and `fadeUp` animations should continue to work — just verify the new grid doesn't break stagger timing.

5. **Test at 1024px, 1280px, and 1440px widths.** The `2fr` Creator column should absorb space gracefully at all three.

6. **Color tokens:** Use Tailwind classes where possible. The `rgba()` border colors are intentional (Foreplay-clone style) — keep inline styles for those.
