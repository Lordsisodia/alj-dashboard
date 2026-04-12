# convex

> Convex backend — schema, queries, mutations, and actions for the ISSO Dashboard.
> Owner: all domains
> Import alias: N/A (imported via `convex/_generated/api`)

## Schema Overview

48 tables grouped by domain. Run `npx convex dev --once` after any schema change.

### Core Content Pipeline

| Table | Purpose |
|---|---|
| `models` | Talent/creator profiles — name, niche, handles, avatar, reference photos |
| `ideas` | AI-generated content briefs — hook, steps, camera, caption, hashtags |
| `content` | Uploaded clips + enhancement status — clips array, Drive URLs |
| `approvals` | Content approval workflow — status, feedback, scheduling |
| `schedule` | Planned posts — date, time, type (post/reel/story/carousel/video/ppv) |

### AI & Generation

| Table | Purpose |
|---|---|
| `contentGen` | Video generation jobs — Kling/Higgsfield/Replicate |
| `scenes` | Scene management for generation pipeline |
| `startingImage` | Starting frame images for video generation |
| `replicate` | Replicate.com job tracking |
| `creatorBriefs` | Extended brief data for creators |
| `analysisPrompts` | Saved AI analysis prompt templates |

### Intelligence & Recon

| Table | Purpose |
|---|---|
| `intelligence` | Ad intelligence entries — scraped ad data |
| `trackedAccounts` | Competitor accounts being monitored |
| `scraperImport` | Scraper job results and import log |
| `insights` | Aggregated trend insights |
| `insightsSeed` | Seed data for insights (dev only) |

### Agency Operations

| Table | Purpose |
|---|---|
| `team` | Team members — roles, permissions |
| `candidates` | Recruitment pipeline candidates |
| `analytics` | Platform analytics snapshots |
| `activity` | Activity feed events |
| `costs` | Cost tracking per model/job |
| `hub` | Hub dashboard aggregates |

### System & Meta

| Table | Purpose |
|---|---|
| `agents` | AI agent definitions and state |
| `agentReports` | Agent execution reports |
| `agentDebugLogs` | Agent debug output |
| `toolAnalyses` | Tool usage analysis logs |
| `routines` | Scheduled routines |
| `feedback` | User feedback submissions |
| `featureRequests` | Feature request submissions |
| `issues` | Bug/issue reports |
| `settings` | Per-user settings |
| `mediaUploads` | Media upload tracking |
| `backfill` | Data backfill job log |

## Mutation Naming Conventions

```ts
// Queries — read data
export const getModels = query(...)
export const getModelById = query(...)

// Mutations — write data
export const createModel = mutation(...)
export const updateModelStatus = mutation(...)

// Actions — external calls (Replicate, Drive, etc.)
export const generateVideo = action(...)
export const importFromScraper = action(...)
```

## Usage in Components

```ts
import { useQuery, useMutation } from 'convex/react';
import { api } from '@/../convex/_generated/api';

const models = useQuery(api.models.getModels);
const createIdea = useMutation(api.ideas.create);
```

## Key Files

- `schema.ts` — single source of truth for all 48 table definitions
- `models.ts` — talent CRUD + queries
- `ideas.ts` — brief generation and status management
- `contentGen.ts` — video generation job lifecycle
- `approvals.ts` — approval workflow state machine
- `intelligence.ts` / `intelligenceNode.ts` — ad scraping pipeline
- `trackedAccounts.ts` — competitor monitoring
- `backfill.ts` — one-time data migration scripts (do not re-run)

## Dev Commands

```bash
# Push schema changes + start live sync
npx convex dev

# Push once and exit (CI / one-shot)
npx convex dev --once
```
