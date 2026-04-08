# Animations — Recon

All animations use **Framer Motion** unless noted. This is the canonical reference.

---

## System 1 — Card Entrance Stagger

**Used in:** `CandidateCard`, `ApprovedCard`, `ScrapedCard`, Kanban board columns
**File:** kanban/KanbanBoard.tsx (column entrance)

```tsx
<motion.div
  initial={{ opacity: 0, y: 18 }}
  animate={{ opacity: 1, y: 0 }}
  transition={{ delay: Math.min(index * 0.04, 0.4), duration: 0.38, ease: [0.25, 0.1, 0.25, 1] }}
/>
```

Each card in a column staggers by `index * 0.04s`, capped at `0.4s`. The column itself has a base delay offset per column: col 1 = 0s, col 2 = 0.09s, col 3 = 0.18s, col 4 = 0.27s.

---

## System 2 — 3D Tilt on Mouse Move

**Used in:** `CandidateCard`, `ApprovedCard`

```tsx
const [tilt, setTilt] = useState({ rotateX: 0, rotateY: 0 });
const spring = { stiffness: 300, damping: 30 };

function handleMouseMove(e: React.MouseEvent) {
  const rect = cardRef.current?.getBoundingClientRect();
  if (!rect) return;
  const cx = rect.left + rect.width / 2;
  const cy = rect.top + rect.height / 2;
  const dx = (e.clientX - cx) / (rect.width / 2);
  const dy = (e.clientY - cy) / (rect.height / 2);
  setTilt({ rotateX: -dy * 5, rotateY: dx * 5 });
}
function handleMouseLeave() { setTilt({ rotateX: 0, rotateY: 0 }); }
```

Applied via `animate={{ rotateX: tilt.rotateX, rotateY: tilt.rotateY }}` with `transition={{ rotateX: spring, rotateY: spring }}`.

---

## System 3 — Swipe to Decide

**Used in:** `CandidateCard` only

```tsx
const SWIPE_THRESHOLD = 80;

<motion.div
  drag="x"
  dragConstraints={{ left: 0, right: 0 }}
  dragElastic={0.6}
  onDragEnd={(_, info) => {
    if (info.offset.x > SWIPE_THRESHOLD) handleApprove();
    else if (info.offset.x < -SWIPE_THRESHOLD) handleReject();
  }}
/>
```

Swipe right = approve (green), swipe left = reject (red). Hint arrows appear when `tilt.rotateY > 2` (right) or `< -2` (left).

---

## System 4 — Confetti Burst

**Used in:** `CandidateCard` — on approve/reject decision

```tsx
function Confetti({ x, y, color }: { x: number; y: number; color: string }) {
  const particles = Array.from({ length: 14 }, (_, i) => {
    const angle = (i / 14) * Math.PI * 2;
    const velocity = 40 + Math.random() * 50;
    const dx = Math.cos(angle) * velocity;
    const dy = Math.sin(angle) * velocity;
    return (
      <motion.div
        key={i}
        initial={{ x, y, scale: 0, opacity: 1 }}
        animate={{ x: x + dx, y: y + dy, scale: [0, 1, 0.6], opacity: [1, 1, 0] }}
        transition={{ duration: 0.7 + Math.random() * 0.4, ease: 'easeOut' }}
        className="absolute w-1.5 h-1.5 rounded-full pointer-events-none"
        style={{ backgroundColor: color, boxShadow: \`0 0 6px \${color}\` }}
      />
    );
  });
  return <>{particles}</>;
}
```

Colors: green `#16a34a` (approve), red `#dc2626` (reject). Triggered from card center via `cardRef.current?.getBoundingClientRect()`.

---

## System 5 — Column Glow Pulse

**Used in:** `KanbanColumn`, `ScrapingColumn`

`glowKey` prop (a number) is incremented in parent state on relevant action — changing the `motion.div` key triggers a new animation cycle:

```tsx
<motion.div
  key={glowKey}
  initial={{ boxShadow: \`0 0 0 0 \${accentColor}00\` }}
  animate={{ boxShadow: [
    \`0 0 0 0 \${accentColor}00\`,
    \`0 0 14px 3px \${accentColor}66\`,
    \`0 0 0 0 \${accentColor}00\`,
  ]}}
  transition={{ duration: 0.9, ease: 'easeOut' }}
/>
```

`accentColor` is passed per column: `#dc2626` (Unapproved), `#991b1b` (Approved), `#7f1d1d` (Scraped).

---

## System 6 — Card Flip (Back Face)

**Used in:** `CandidateCard` — double-click to reveal enriched data on back

```tsx
<motion.div
  animate={{ rotateY: isFlipped ? 180 : 0 }}
  transition={{ duration: 0.45, ease: [0.25, 0.1, 0.25, 1] }}
>
  {/* Front face */}
  <motion.div style={{ backfaceVisibility: 'hidden' }} />
  {/* Back face */}
  <motion.div style={{ backfaceVisibility: 'hidden', rotateY: 180 }} />
</motion.div>
```

`backfaceVisibility: 'hidden'` on both faces ensures the back is invisible through the front.

---

## System 7 — Skeleton Shimmer

**Used in:** Loading states in all card types, `SkeletonRow` component

```tsx
<motion.div
  animate={{ opacity: [0.3, 0.5, 0.3] }}
  transition={{ duration: 1.4, repeat: Infinity, ease: 'easeInOut' }}
/>
// Staggered via delay: index * 0.1
```

Each bar in the skeleton has a slightly different base opacity (0.3, 0.45, 0.2, 0.5) and delay (0, 0.1, 0.2, 0.3s).

---

## System 8 — Drag Ghost

**Used in:** `KanbanBoard` via `@dnd-kit` `DragOverlay`

dnd-kit's `DragOverlay` renders a fixed-position clone of the dragged card that follows the pointer. The ghost is a plain div (not Framer Motion):

```tsx
import { DragOverlay } from '@dnd-kit/core';

<DragOverlay dropAnimation={{ duration: 180, easing: 'ease' }}>
  {activeCandidate ? <DragGhost c={activeCandidate} /> : null}
</DragOverlay>
```

`DragGhost` is a fixed-width (180px) card that uses absolute positioning via the dnd-kit drag offset.

---

## System 9 — Scrape Progress Bar

**Used in:** `ScrapingColumn`

```tsx
// Progress fill
<motion.div
  initial={{ width: \`\${initialPct}%\` }}
  animate={{ width: '100%' }}
  transition={{ duration: remaining, ease: [0.1, 0.2, 0.5, 1] }}
/>
// Shimmer sweep
<motion.div
  animate={{ x: ['-100%', '200%'] }}
  transition={{ duration: 1.8, repeat: Infinity, ease: 'easeInOut', repeatDelay: 0.8 }}
/>
```

The progress runs for 8 seconds. A shimmer sweep runs every 2.6s (1.8s duration + 0.8s delay). Pulsing red dot next to handle.

---

## System 10 — Rejected Panel Expand/Collapse

**Used in:** `RejectedPanel`

```tsx
<AnimatePresence>
  {isOpen && (
    <motion.div
      initial={{ height: 0, opacity: 0 }}
      animate={{ height: 'auto', opacity: 1 }}
      exit={{ height: 0, opacity: 0 }}
      transition={{ duration: 0.2 }}
      className="overflow-hidden"
    />
  )}
</AnimatePresence>
```

Chevron rotates 180° via `className={isOpen ? 'rotate-180' : ''}` with `transition-transform duration-200`.

---

## System 11 — Detail Panel Slide-In

**Used in:** `DetailPanel`

```tsx
<motion.div
  initial={{ x: '100%' }}
  animate={{ x: 0 }}
  exit={{ x: '100%' }}
  transition={{ type: 'spring', stiffness: 380, damping: 38 }}
/>
```

Rendered via `createPortal` to `document.body` to escape stacking context. Backdrop is a fixed overlay with `backdropFilter: blur(2px)`.

---

## Quick Reference

| System | File | Key lib |
|--------|------|--------|
| 1. Entrance stagger | KanbanBoard | framer-motion |
| 2. 3D tilt | CandidateCard, ApprovedCard | framer-motion |
| 3. Swipe decide | CandidateCard | framer-motion |
| 4. Confetti | CandidateCard | framer-motion |
| 5. Glow pulse | KanbanColumn, ScrapingColumn | framer-motion |
| 6. Card flip | CandidateCard | framer-motion |
| 7. Shimmer | SkeletonRow | framer-motion |
| 8. Drag ghost | KanbanBoard | @dnd-kit |
| 9. Scrape bar | ScrapingColumn | framer-motion |
| 10. Panel expand | RejectedPanel | framer-motion |
| 11. Slide panel | DetailPanel | framer-motion + portal |
