# Deep Dive: sanidhyy/duolingo-clone

**Repository:** https://github.com/sanidhyy/duolingo-clone
**Stars:** 516 | **Forks:** 295 | **License:** MIT
**Live Demo:** lingo-clone.vercel.app

---

## Tech Stack

| Layer | Technology |
|-------|------------|
| Framework | Next.js 14+ (App Router) |
| Language | TypeScript |
| Styling | Tailwind CSS + shadcn/ui + Radix UI |
| State | Zustand |
| Database | PostgreSQL (Neon) |
| ORM | Drizzle ORM |
| Auth | Clerk |
| Payments | Stripe |
| Package Manager | Bun |
| Deploy | Vercel |

---

## Folder Structure

```
duolingo-clone/
├── actions/           # Server actions (challenge-progress, user-progress, subscriptions)
├── app/              # Next.js App Router routes
│   ├── auth/         # Clerk auth routes
│   ├── main/         # Main app shell
│   ├── marketing/    # Landing pages
│   ├── admin/        # Admin panel
│   ├── api/          # API routes (webhooks)
│   └── lesson/       # Lesson pages with [lessonId]
├── components/
│   ├── hearts/        # Hearts display & modals
│   ├── quests/       # Quest items & quest list
│   ├── modals/       # Practice modal, exit modal, hearts modal
│   ├── ui/           # shadcn/ui primitives
│   ├── banner.tsx    # Sticky top banner
│   ├── sidebar.tsx   # Navigation sidebar
│   └── user-progress.tsx
├── config/           # App config (links, constants)
├── db/
│   ├── schema.ts     # Drizzle table definitions
│   ├── queries.ts    # Database query functions
│   └── drizzle.ts    # DB client config
├── lib/
│   ├── admin.ts
│   ├── stripe.ts
│   └── utils.ts
├── store/            # Zustand stores
└── scripts/          # Seed/production scripts
```

---

## Zustand Store Patterns

All modal stores follow an identical lightweight pattern:

```typescript
import { create } from "zustand";

type ModalState = {
  isOpen: boolean;
  open: () => void;
  close: () => void;
};

export const useHeartsModal = create<ModalState>((set) => ({
  isOpen: false,
  open: () => set({ isOpen: true }),
  close: () => set({ isOpen: false }),
}));
```

### Store Inventory

| Store File | Purpose |
|------------|---------|
| `use-exit-modal.ts` | Confirm exit during lesson |
| `use-hearts-modal.ts` | Show when hearts depleted |
| `use-practice-modal.ts` | Practice prompt modal |

**Pattern notes:**
- Simple boolean state + open/close actions
- No middleware (persisted, devtools, etc.)
- Server components call `open()` via client action; client components subscribe with `useHeartsModal(state => state.isOpen)`
- No computed selectors or derived state

---

## Database Schema (Drizzle ORM)

### Core Tables

**userProgress**
```typescript
userId: text PRIMARY KEY
userName: text DEFAULT "User"
userImageSrc: text DEFAULT "/mascot.svg"
activeCourseId: text
hearts: integer DEFAULT 5        // MAX_HEARTS
points: integer DEFAULT 0
```

**courses**
```typescript
id: text PRIMARY KEY
title: text
imageSrc: text
```

**units**
```typescript
id: text PRIMARY KEY
title: text
description: text
courseId: text REFERENCES courses
```

**lessons**
```typescript
id: text PRIMARY KEY
title: text
unitId: text REFERENCES units
order: integer
```

**challenges**
```typescript
id: text PRIMARY KEY
lessonId: text REFERENCES lessons
type: text ENUM("SELECT", "ASSIST")
question: text
order: integer
```

**challengeOptions**
```typescript
id: text PRIMARY KEY
challengeId: text REFERENCES challenges
text: text
imageSrc: text
correct: boolean
```

**challengeProgress** (tracks per-user completion)
```typescript
id: text PRIMARY KEY
userId: text
challengeId: text REFERENCES challenges
completed: boolean
```

### Missing from Schema
- **No streaks table** — streaks not implemented in this schema
- **No quests table** — quests appear to be hardcoded/config-based, not DB-driven
- **No users table** — user data lives in userProgress (minimal schema)

---

## Gamification Components

### 1. UserProgress Component

Top-bar component showing current user's stats:

```tsx
type UserProgressProps = {
  activeCourse: typeof courses.$inferSelect;
  hearts: number;
  points: number;
  hasActiveSubscription: boolean;
};

// Layout: [Course Image] [Points Badge] [Hearts Badge]

// Points: orange text, "/points.svg" icon
// Hearts: rose text, "/heart.svg" icon
// Subscribers see <InfinityIcon /> instead of heart count
```

**Key patterns:**
- Flex layout with `justify-between`
- Links to `/shop` for points/hearts
- Conditional rendering: infinity icon for subscribers
- Uses `next/image` for optimized assets

### 2. Hearts System

**Frontend display:** `UserProgress` shows heart count with SVG icon

**Modal trigger:** `useHeartsModal` store opens modal when hearts hit 0

**Backend tracking:** `userProgress.hearts` column (default 5 = MAX_HEARTS)

**Subscription bypass:** Subscribers get unlimited hearts (`InfinityIcon`)

### 3. Points/XP System

**Frontend display:** `UserProgress` shows points with `/points.svg` icon, orange styling

**Backend tracking:** `userProgress.points` column (default 0, increments per lesson/challenge)

**Server action:** `upsertUserProgress` updates points atomically

### 4. Quests System

**Architecture:** Config-driven, NOT database-driven

**Components:**
- `components/quests/quest-item.tsx` — individual quest display
- Likely rendered in a quest list/sidebar panel

**Pattern:** Quests are defined in config, progress tracked in `userProgress` or separate tracking tables

### 5. Banner Component

Sticky top banner with scroll-detection:

```tsx
// Hides on scroll
// Dismissible with localStorage persistence ("hide-lingo-banner")
// Fixed positioning: z-50, full-width
```

---

## Components to Copy for Our Model Gamification

### High Priority (Directly Applicable)

1. **`UserProgress` component** (`components/user-progress.tsx`)
   - Compact horizontal stat bar
   - Points/hearts display with icons
   - Subscription-aware conditional rendering
   - Best pattern for agency dashboard stat pills

2. **Zustand modal pattern** (`store/*.ts`)
   - Copy the simple open/close store pattern
   - Create stores for: streak modal, achievement modal, XP milestone modal
   - Pattern is dead simple and highly reusable

3. **Hearts modal component** (`components/hearts/hearts-modal.tsx`)
   - When user runs out of a resource (time, credits, etc.)
   - Shows purchase/refill prompt
   - For agency: could show "credits exhausted" or "API quota reached"

4. **Quest display** (`components/quests/quest-item.tsx`)
   - Progress indicators, completion states
   - Could adapt for agency: "model milestones", "batch completion quests"

### Medium Priority

5. **`banner.tsx`** — scroll-aware sticky banner with localStorage dismiss

6. **Server action pattern** for progress updates (`actions/user-progress.ts`)
   - Atomic upsert for user stats
   - Could adapt for model usage tracking

---

## Drizzle Schema Patterns for Progress Tracking

### Recommended additional tables (not in this repo but would extend it)

```typescript
// Streaks tracking
streaks: {
  id: text PRIMARY KEY,
  userId: text REFERENCES users,
  currentStreak: integer DEFAULT 0,
  longestStreak: integer DEFAULT 0,
  lastActivityDate: date,
}

// Daily XP log
xpHistory: {
  id: text PRIMARY KEY,
  userId: text,
  date: date,
  xpEarned: integer,
  source: text, // "lesson", "quest", "challenge"
}

// Achievement unlocks
achievements: {
  id: text PRIMARY KEY,
  userId: text,
  achievementKey: text,
  unlockedAt: timestamp,
}
```

---

## shadcn/ui Components Used

- `Button` (variant: ghost, default)
- `Card` (likely for quest items)
- `Dialog/Modal` (base for hearts/practice modals)
- `Avatar` (likely for user images)
- `Progress` (quest progress bars)
- `Badge` (stat labels)

---

## Key Implementation Notes

1. **Server Components vs Client Components**
   - `UserProgress` is a Client Component (`"use client"`)
   - Stores accessed only in client components
   - Server actions handle all DB writes

2. **Optimistic Updates**
   - Lessons likely use optimistic UI for challenge responses
   - Hearts/points decrement immediately, sync to DB via server action

3. **Modals are purely client-side**
   - No URL state for modals
   - Zustand store controls visibility
   - Click-outside and escape key handled by shadcn Dialog

4. **No celebrations/confetti in this repo**
   - The repo does NOT include confetti animations or celebration components
   - This would need to be added separately (consider `canvas-confetti` or `@sp学姐/celebration`)

---

## Summary for Agency Dashboard

The duolingo-clone provides a solid **pattern library** for gamification rather than ready-to-copy components:

| What to Copy | How |
|--------------|-----|
| Stat pill UI (`UserProgress`) | Agency: models processed, revenue, active clients |
| Zustand modal pattern | Agency: achievement modals, milestone celebrations |
| Hearts → Credits metaphor | Agency: API credit system with modal on depletion |
| Points → Revenue metaphor | Agency: track "XP earned" = revenue generated |
| Quest → Milestones | Agency: batch completion, new client onboarding quests |

**Missing from this repo:** streak tracking schema, confetti/celebration components, leaderboard, achievement definitions.
