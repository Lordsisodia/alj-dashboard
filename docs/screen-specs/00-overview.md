# ISSO Client Dashboard — Screen Overview

**Source reference:** `apps/isso-dashboard-ref/` (ALJ/IGINFULL clone)  
**Target:** `apps/isso-dashboard/` (ISSO-branded OFM client dashboard)  
**Backend:** Convex only (no Supabase)  
**Stack:** Next.js 15, TypeScript, Tailwind, Framer Motion, Convex, Lucide

---

## What this app is

A day-to-day operations dashboard for OFM (OnlyFans Management) agencies. The agency owner and their team use this to manage content creation, approval, scheduling, model performance, and team coordination across multiple creator accounts.

---

## The 10 Screens

| # | Route | Screen | Core Job |
|---|-------|---------|----------|
| 1 | `/` | Dashboard / Home | Daily at-a-glance across all models |
| 2 | `/schedule` | Schedule | Content calendar + per-account analytics |
| 3 | `/content` | Content Pipeline | Upload raw clips → AI enhance → send to editing pipeline |
| 4 | `/ideas` | Idea Generation | AI-generated content briefs → assign to model |
| 5 | `/models` | Model Dashboard | Track filming progress per model |
| 6 | `/analytics` | Analytics | Deep performance data per creator account |
| 7 | `/community` | Community Feed | Internal feed of all posted content |
| 8 | `/approvals` | Approvals | Review queue — approve/reject/revise before publish |
| 9 | `/team` | Team | Manage VA/editor access, permissions, activity |
| 10 | `/settings` | Settings | Profile, connected accounts, integrations, billing |

---

## Key Concepts (OFM context)

| Term | Meaning |
|------|---------|
| **Model** | The creator/talent (e.g. Tyler, Ren, Ella) — they film content but don't use the dashboard |
| **VA** | Virtual Assistant — handles scheduling, approvals, community |
| **Editor** | Video editor — receives clips from Content Pipeline |
| **Admin** | Agency owner — full access |
| **Brief** | AI-generated filming instructions sent to a model |
| **Campaign** | A batch of content for a time period (e.g. "April 2026") |
| **Niche** | Content style: GFE, Fitness, Meme, Thirst Trap, Lifestyle |

---

## Sidebar Nav (permanent)

- Logo + brand
- Account switcher (switch between model profiles)
- Nav: Schedule, Content, Ideas, Models, Analytics, Community, Approvals, Team
- Settings (bottom)
- User profile + online status (bottom)
- Collapse toggle

---

## Convex Data Model (to build)

### Tables needed
- `models` — creator profiles (name, niche, igHandle, etc.)
- `ideas` — generated briefs (hook, steps, camera, caption, hashtags, status, modelId)
- `content` — uploaded clips (clipId, modelId, status, enhancementResult, driveUrl)
- `schedule` — scheduled posts (date, time, type, modelId, contentId, status)
- `analytics` — per-account metrics (followers, engagement, topPosts, audienceData)
- `approvals` — content approval items (caption, hashtags, status, submittedBy, contentId)
- `team` — team members (name, email, role, accountAccess, permissions)
- `activity` — audit log (actor, action, target, timestamp)

---

## What changes from the reference app

| Reference (IGINFULL/ALJ) | ISSO version |
|---|---|
| Instagram-first (IG posts, reels, stories) | OnlyFans-first (video clips, photos) |
| `#ff0069` pink IG gradient | ISSO brand colours (TBD — suggest keeping pink/dark) |
| "IGINFULL" branding | ISSO branding |
| Hardcoded seed data | Convex real-time data |
| Gemini AI for ideas | Claude AI for ideas (or keep Gemini — TBD) |
| Community = IG feed viewer | Community = internal content feed / fan message digest |
| $19/mo billing | ISSO pricing (from business plan) |
| Supabase references | Remove entirely — Convex only |
