# The Standard Pattern

Every nav icon follows the same shape:

```
[Dashboard pill] → [Step 1] → [Step 2] → [Step 3]
       ↑
   3 AI features live here
```

## Rules
1. **Every icon has a Dashboard pill** as the first sub-nav item.
2. **Every icon has exactly 3 step pages** after the dashboard.
3. **Every dashboard has 3 AI features** — small modules that surface AI insights or fire AI actions.
4. **Recon is the reference implementation.** When in doubt, mimic the Recon section's layout, spacing, components, and information density.

## Why this pattern
- Predictable nav for users — same shape across all 5 icons.
- Predictable scope for agents — every UI agent has the same 4-page workload.
- Forces AI thinking — every dashboard must justify 3 AI features, not 0.

## The 5 icons (pipeline order)
1. **Recon** — collect (scrape competitors, track creators)
2. **Intelligence** — analyze (find trends, score content)
3. **Hub** — curate (swipe & rate, train the system)
4. **Content Gen** — generate (FLUX → Replicate Kling → Drive)
5. **Agents** — monitor (background automation visibility)

## Visual / UI rules
- Components come from **21st.dev** when possible — no one-off rough UI.
- Card classes: `stackedPanelClass`, `nestedCardClass`.
- No raw `AnimatedWaves` — use `PartnershipsWaveBackdrop` only on partnerships pages.
- Page title: `text-2xl font-bold text-white`.
- Card label: `text-[11px] uppercase tracking-[0.35em] text-white/60`.

## Reference files
- Sidebar config: `src/shared/layout/isso-sidebar/sidebar-config.tsx`
- Page shell: `src/shared/layout/ContentPageShell.tsx`
- Recon implementation: `src/features/recon/`
