# Skill: UI First Principles Improvement Loop
**Version:** 1.1
**Use after:** completing any UI build task
**Iterations:** Run 2-3 times until no further improvements surface

---

## What this skill does

Forces you to step back from implementation details, understand what you actually built and why, then systematically improve it for elegance and utility. Not about adding features — about making what exists better.

---

## Pre-loop: Wiring & Integration Checks

Run this first — it runs all 5 checks automatically:
```bash
bash /Users/shaansisodia/SISO_Workspace/SISO_Agency/apps/isso-dashboard/scripts/verify-worktree.sh <branch-suffix> <port>
```
If it fails, fix the issues before proceeding with the loop.

Also sync shared components from main before starting:
```bash
bash /Users/shaansisodia/SISO_Workspace/SISO_Agency/apps/isso-dashboard/scripts/sync-worktree.sh <branch-suffix>
```

The individual checks the script runs:

### Check 1 — Component reachability
For every new component file you created, verify it is actually imported by a parent view:
```bash
# Replace ComponentName with each new component
grep -r "ComponentName" src/ | grep -v "ComponentName.tsx"
# If this returns nothing → it's dead code, wire it in first
```

### Check 2 — Entry point trace
Start from the page entry point and trace the import chain down to your new component. If you cannot draw an unbroken line from page → feature → view → component, it's not rendered.

### Check 3 — TypeScript compilation
```bash
./node_modules/.bin/tsc --noEmit 2>&1 | grep "src/features/[your-section]"
```
Fix all errors in your section before proceeding. Pre-existing errors in other sections can be ignored.

### Check 4 — No orphaned state
If you added new `useState` hooks or props, verify every piece of state is actually used in the render output. Dead state is a sign the component was planned but not fully connected.

### Check 5 — Props contract
For every component you built that accepts props from a parent: confirm the parent is passing all required props. If the parent doesn't exist yet, that component is dead code.

---

## The Loop (run this 2-3 times)

### Step 1 — Understand the utility (5 minutes of reading)

Before touching any code, re-read every component you built or modified — **including parent views that import your components**. Then answer:

1. **Who uses this?** What kind of person, in what context, at what moment?
2. **What decision does it support?** What does the user learn, decide, or do because of this UI?
3. **What's the primary action?** If there's one thing the user should do here, what is it?
4. **What's the primary piece of information?** If they read nothing else, what must they see?

Write these answers down (a comment in code or just in your reasoning). If you can't answer them clearly, the UI is probably not clear either.

---

### Step 2 — Audit your core assumptions

List the 5 assumptions you made while building. For each one, ask: is this actually true?

Common assumptions to challenge:
- "The user will understand this label without explanation" — will they?
- "This component needs this much space" — does it really?
- "Showing all this data is helpful" — or is it noise?
- "The user will click this button" — is it obvious enough?
- "This interaction makes sense" — or did I just build what was easy?

---

### Step 3 — Simplicity test

Ask: **what could I remove without losing core value?**

- Any label that restates what the data already shows → remove
- Any section that answers a question no one is asking → remove or collapse
- Any padding/margin that exists "just to feel safe" → tighten
- Any component that shows data the user will never act on → remove or defer to a "see all" view

---

### Step 4 — Elegance audit (think like a senior designer)

Look at each component and ask:
- **First glance test:** Can I understand what this is for in under 2 seconds?
- **Empty state:** What does this look like with 0 data? Is it helpful or broken?
- **Loading state:** Is there a skeleton/spinner while data loads, or does it just jump in?
- **Hover/active states:** Is every interactive element styled on hover? Does it feel responsive?
- **Typography hierarchy:** Is there a clear visual weight difference between primary info, secondary info, and metadata?
- **Colour usage:** Am I using colour to communicate something, or just decorating?
- **Spacing rhythm:** Does the spacing feel consistent, or are some gaps random?

---

### Step 5 — Implement the top improvements

Pick the 3-5 highest-impact changes from Steps 2-4. Implement them.

Priority order:
1. Empty states (broken UI > ugly UI)
2. Loading states (jarring jumps hurt trust)
3. Hover/interaction states (dead UI feels broken)
4. Spacing + hierarchy (first impression)
5. Simplification (removing noise is free value)

---

### Step 6 — Repeat

Run Steps 1-5 again. On the second pass you'll catch things you normalised on the first pass.
Stop when you can honestly say: "A senior designer would not immediately see something to fix."

---

## After the loop

Run the full verification before committing:
```bash
bash /Users/shaansisodia/SISO_Workspace/SISO_Agency/apps/isso-dashboard/scripts/verify-worktree.sh <branch-suffix> <port>
```
All checks must pass. Then commit:
```
refine([scope]): first-principles loop pass N — [what changed]
```

---

## What this skill is NOT for

- Adding new features
- Rebuilding things that work
- Bikeshedding colours
- Changing things because you got bored

The test: does this change make the UI more useful, more honest about its purpose, or easier to understand? If no → don't do it.
