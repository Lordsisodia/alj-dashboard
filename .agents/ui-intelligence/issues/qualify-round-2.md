# Qualify Tab — Round 2 Feedback
**For:** ui.intelligence.qualify (surface:34)
**Date:** 2026-04-07
**Branch:** feat/qualify-ui-fixes
**Worktree:** /Users/shaansisodia/SISO_Workspace/SISO_Agency/apps/isso-dashboard-qualify-fixes

---

## Execution instructions

Execute each issue below as a **separate sub-agent task** in sequence. Do not batch them.

For each issue:
1. Spin up a sub-agent with a focused prompt for that single issue
2. Sub-agent works until the issue is fully done
3. Sub-agent sends `EVAL_REQUEST` to the INTELL evaluator (surface:104, workspace:13) with:
   - Worker: qualify-round2-ISSUE-N (surface:34)
   - Task: [issue name]
   - Spec: [requirements]
   - Files changed: [list]
4. Wait for `EVAL_RESULT: PASS` before moving to the next issue
5. After all issues pass eval, commit everything together

Evaluator is at **surface:104, workspace:13**. Include your surface number in every EVAL_REQUEST so it knows where to send the result back.

---

## QUALIFY-R2-1: Fix toolbar alignment

**Problem:** The table toolbar (search, band chips, days pills, toggle, Save button) is not aligned cleanly. It doesn't feel like an Airtable-style toolbar — elements are misaligned, spacing is inconsistent.

**Fix:**
- All toolbar items should be on a single baseline, vertically centered
- Consistent gap between groups (search | band chips | spacer | days | toggle | save)
- Each group separated by a thin vertical divider (`<div className="w-px h-4 bg-neutral-200">`)
- Toolbar height: fixed at 40px
- Background: `#fafafa`, bottom border `1px solid rgba(0,0,0,0.06)`

Reference: Look at how Airtable/Linear/Notion toolbars work — everything on one line, groups divided, nothing floating

---

## QUALIFY-R2-2: Band filter → dropdown

**Problem:** The `All | 2× | 5× | 10× | 20×` band filter chips are inline and take up too much horizontal space.

**Fix:**
- Replace inline chips with a single compact dropdown button showing the active filter
- Default label: `All bands`
- On click: dropdown with options: All, 2×+, 5×+, 10×+, 20×+
- Style: match the days pills style (bordered, small text)
- Use a simple `<select>` or a small popover — keep it minimal

---

## QUALIFY-R2-3: Remove "Save Top 10%" button

**Problem:** The "Save Top 10%" button adds complexity without clear value at this stage.

**Fix:**
- Remove the button entirely from the toolbar
- Remove the `onSaveTop` and `isSaving` props from `QualifyToolbar` if they become unused
- Do not remove the underlying save functionality — just remove the UI button

---

## QUALIFY-R2-4: Move Table/Kanban toggle to the tab bar

**Problem:** The Table/Kanban toggle should live on the same line as the tab navigation (Dashboard | Qualify | Analysis | Insights | Hub), positioned on the right side of that bar.

**Fix:**
- Remove the toggle from `QualifyToolbar` entirely
- In `IntelligenceFeaturePage.tsx`, when `activeTab === 'qualify'`, render the toggle in the `actionSlot` or right side of `ContentPageShell`'s tab bar
- Pass `view` and `onViewChange` up from `TrendsView` to `IntelligenceFeaturePage` via props or a callback
- Style: small pill toggle (Table | Kanban), same style as the existing toggle in the toolbar

**Files to check:**
- `src/app/isso/layout/ContentPageShell.tsx` — see how the tab bar renders, find where to inject the toggle
- `src/features/intelligence/components/IntelligenceFeaturePage.tsx` — pass view state down
- `src/features/intelligence/components/trends/TrendsView.tsx` — lift view state up

---

## QUALIFY-R2-5: Outlier Alert Feed — vertical scroll, box wrapper

**Problem:** The Outlier Alert Feed scrolls horizontally. Should scroll vertically. Also needs a proper card/box container.

**Fix:**
- Wrap `OutlierPanel` content in a proper card: `rounded-xl border border-black/[0.07] bg-white overflow-hidden`
- Change the inner layout from horizontal scroll to a vertical list
- Each outlier card stacks vertically, full width of the panel
- Panel itself scrolls vertically if there are more items than fit
- Remove `overflow-x-auto` — use `overflow-y-auto` instead

---

## QUALIFY-R2-6: Outlier Alert Feed header — divider style with signal count

**Problem:** The "Outlier Alert Feed" title needs a cleaner header treatment.

**Fix:**
- Header section: coloured background strip (use `bg-neutral-50` or a subtle pink tint)
- Bottom divider: `border-b border-black/[0.08]`
- Title on the left: `"Outlier Alert Feed"` in `text-[11px] font-semibold text-neutral-700`
- Signal count on the right: `"20 signals"` in `text-[10px] text-neutral-400` (use actual count from data)
- No pill — just text, all on one line, divider below

---

## Definition of done
- [ ] Toolbar is single-line, groups divided, Airtable-quality alignment
- [ ] Band filter is a dropdown (not inline chips)
- [ ] "Save Top 10%" button removed
- [ ] Table/Kanban toggle is in the tab bar (right side), not in the toolbar
- [ ] Outlier panel scrolls vertically, has card wrapper
- [ ] Outlier header has divider style + signal count
- [ ] tsc --noEmit clean on all changed files
- [ ] EVAL_RESULT: PASS received from surface:104 before commit

## Do NOT
- Don't touch the table columns or row data
- Don't touch StatsBar
- Don't touch the KPI stats at top
- Don't push to Convex or touch convex/ files
