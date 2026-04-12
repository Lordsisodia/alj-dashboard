# OSS Backend & Infrastructure Tools — Agency SaaS Research

**Date:** 2026-04-12
**Purpose:** Evaluate open-source backend and infrastructure tools for the agency SaaS platform (isso-dashboard). Covers social API aggregation, video processing, streaming relay, scheduling, Google API sync, and approval workflow engines.

---

## 1. Social API Aggregators

### Ayrshare `social-media-api` SDK
- **Repo:** [ayrshare/social-media-api](https://github.com/ayrshare/social-media-api)
- **Stars:** Not a standalone OSS project — Node.js wrapper SDK around Ayrshare's managed API
- **License:** Proprietary (managed service); SDK wrapper is open-source MIT
- **Language:** TypeScript / Node.js
- **Platforms:** Instagram, TikTok, YouTube, Facebook, LinkedIn, Reddit, Pinterest, Telegram, X/Twitter, Google Business
- **Convex/Next.js compat:** Full — REST-based SDK, works from any Node/edge runtime
- **Self-hosted vs managed:** Managed (Ayrshare handles OAuth, token refresh, platform maintenance)
- **Notes:** Best option if you want rapid multi-platform coverage without maintaining individual platform OAuth flows. Paid service — pricing per connected social profile. TikTok API production access requires app approval review.

### influence-hub (OSS analytics aggregator)
- **Repo:** [reforia/influence-hub](https://github.com/reforia/influence-hub)
- **Stars:** Low (early-stage project)
- **License:** Open source
- **Language:** Not specified (likely Python/Node)
- **Platforms:** Facebook, YouTube, Twitter, Reddit, TikTok, Instagram, Discord
- **Convex/Next.js compat:** Unknown — check for REST output
- **Self-hosted vs managed:** Self-hosted
- **Notes:** AI-powered analytics aggregator. Useful for inspiration/reference; not production-ready for agency use at scale.

### unified-social-aggregator
- **Repo:** [Ali-Kabbadj/unified-social-aggregator](https://github.com/Ali-Kabbadj/unified-social-aggregator)
- **Stars:** Low (hobby project)
- **License:** Open source
- **Language:** Next.js / React
- **Platforms:** YouTube, Reddit, Facebook, TikTok
- **Convex/Next.js compat:** Native Next.js
- **Self-hosted vs managed:** Self-hosted
- **Notes:** Reference architecture only. Not production-quality.

### node-social-feed-api
- **Repo:** [sourcetoad/node-social-feed-api](https://github.com/sourcetoad/node-social-feed-api)
- **Stars:** Low
- **License:** MIT
- **Language:** Node.js
- **Platforms:** Instagram, Facebook, Google, Twitter
- **Convex/Next.js compat:** Compatible (Node.js REST output)
- **Self-hosted vs managed:** Self-hosted
- **Notes:** Aggregates feeds into a unified API. Minimal maintenance, no analytics.

### Recommendation
Use **Ayrshare** for managed multi-platform posting/analytics (fast path). For fully self-hosted analytics, combine individual platform SDKs (instagram-private-api, youtube-data-api) with BullMQ for polling jobs.

---

## 2. Video Processing

### FFmpeg
- **Repo:** [FFmpeg/FFmpeg](https://github.com/ffmpeg/ffmpeg)
- **Stars:** ~71.6k
- **License:** LGPL 2.1+ (core); GPL 2.0+ (optional components)
- **Language:** C
- **Convex/Next.js compat:** Used server-side (spawned as child process from Node.js); not callable from Convex functions directly — needs a dedicated worker service or Next.js API route with long timeout
- **Self-hosted vs managed:** Self-hosted binary; managed via Cloudflare Stream / Mux if preferred
- **Notes:** Industry standard. Powers YouTube, VLC, Remotion. Use `fluent-ffmpeg` (Node.js wrapper) for programmatic control. Required for transcoding, thumbnail extraction, HLS segmenting.

### Remotion
- **Repo:** [remotion-dev/remotion](https://github.com/remotion-dev/remotion)
- **Stars:** ~43k
- **License:** Source-available (Remotion License) — free for solo devs / companies ≤3 employees; $100/month minimum for company license (4 seats)
- **Language:** TypeScript / React
- **Convex/Next.js compat:** Excellent — designed for Next.js; renders via Node.js or AWS Lambda (`@remotion/lambda`). Convex can trigger renders via HTTP actions.
- **Self-hosted vs managed:** Self-hosted render farm OR managed via Remotion Lambda (serverless)
- **Notes:** Renders React components to video using headless browser + FFmpeg under the hood. Ideal for programmatic video generation (reels, reports, highlight clips). NOT free for commercial agency use — budget $100+/month. Strong choice for templated video output.

### BullMQ (video job queue)
- **Repo:** [taskforcesh/bullmq](https://github.com/taskforcesh/bullmq)
- **Stars:** ~8.6k
- **License:** MIT (core); BullMQ Pro add-on $1,395/year for orgs <100 employees
- **Language:** TypeScript / Node.js
- **Convex/Next.js compat:** Not directly compatible with Convex (Convex is serverless; BullMQ needs persistent Redis). Use from a separate Node.js worker service called by Convex HTTP actions.
- **Self-hosted vs managed:** Self-hosted (requires Redis); managed via Upstash Redis + BullMQ
- **Notes:** The standard for video transcoding pipelines, AI job queues, payment processing. 10M+ npm downloads/month. SOC 2 Type II certified (Jan 2026). Successor to Bull (now EOL for new features). Pair with FFmpeg workers for async video processing.

---

## 3. Streaming Relay Servers

### nginx-rtmp-module
- **Repo:** [arut/nginx-rtmp-module](https://github.com/arut/nginx-rtmp-module)
- **Stars:** ~14k
- **License:** MIT
- **Language:** C (nginx module)
- **Convex/Next.js compat:** No direct integration — standalone server; stream ingested via RTMP, output via HLS/RTMP/MPEG-DASH consumed by frontend player
- **Self-hosted vs managed:** Self-hosted (nginx binary + module)
- **Notes:** Original RTMP module. Last updated Dec 2024 — largely unmaintained. Use the actively maintained fork `sergey-dryabzhinsky/nginx-rtmp-module` or `nginx-http-flv-module` (2.9k stars, updated Jan 2026). Docker images available. Good for simple relay; limited scalability.

### SRS (Simple Realtime Server)
- **Repo:** [ossrs/srs](https://github.com/ossrs/srs)
- **Stars:** ~28.7k
- **License:** MIT
- **Language:** C++
- **Convex/Next.js compat:** Standalone server; frontend consumes HLS/WebRTC/FLV streams; no direct Convex integration needed
- **Self-hosted vs managed:** Self-hosted (Docker/K8s); SRS Cloud also available
- **Protocols:** RTMP, WebRTC, HLS, HTTP-FLV, SRT, MPEG-DASH, GB28181
- **Codecs:** H.264, H.265, AV1, VP9, AAC, Opus, G.711
- **Notes:** Most capable open-source media server. 28.7k stars. Latest stable: v6.0-r0 (Dec 2025) with HEVC/H.265 over RTMP. AI-assisted development pushed unit test coverage from 40% to 88%. Strong recommendation over nginx-rtmp for new builds.

### Ant Media Server
- **Repo:** [ant-media/Ant-Media-Server](https://github.com/ant-media/Ant-Media-Server)
- **Stars:** ~4.7k
- **License:** Community (free) + Enterprise (paid, requires license validation + internet access)
- **Language:** Java
- **Convex/Next.js compat:** REST API for stream management; frontend uses provided JS SDK or WebRTC; can integrate with Next.js via REST
- **Self-hosted vs managed:** Self-hosted (on-prem or cloud); AWS/Azure/DigitalOcean 1-click deploys
- **Protocols:** WebRTC (~0.5s latency), RTMP, RTSP, SRT, HLS, CMAF, LL-HLS
- **Notes:** Ultra-low latency WebRTC focus. Community Edition is free but limited. Enterprise requires active internet license validation — problematic for air-gapped or strict self-hosted deployments. Best for live shopping/interactive streams.

### Recommendation
**SRS** for self-hosted streaming relay (best OSS option, most protocols, active maintenance). Ant Media for WebRTC ultra-low latency if needed. Avoid nginx-rtmp for new projects.

---

## 4. Scheduling Engines

### Agenda.js
- **Repo:** [agenda/agenda](https://github.com/agenda/agenda)
- **Stars:** ~8.9k
- **License:** MIT
- **Language:** TypeScript / Node.js
- **Convex/Next.js compat:** Not directly compatible with Convex (requires MongoDB). From Next.js API routes or a standalone Node.js process, fully compatible.
- **Self-hosted vs managed:** Self-hosted (MongoDB required)
- **Notes:** MongoDB-backed, cron + human-readable scheduling syntax. Last updated Feb 2026. Agendash web UI available. Mature project, 96k weekly npm downloads. Best choice if you already run MongoDB. The `hokify/agenda` fork adds TypeScript improvements.

### Inngest
- **Repo:** [inngest/inngest](https://github.com/inngest/inngest)
- **Stars:** ~10k+ (inngest-js SDK: 906 stars)
- **License:** Server: Sustainable Use License / DOSP Apache 2.0; SDKs: Apache 2.0
- **Language:** Go (server), TypeScript SDK
- **Convex/Next.js compat:** Excellent native Next.js integration — functions run as Next.js API routes; Convex can trigger Inngest via HTTP. First-class Vercel/serverless support.
- **Self-hosted vs managed:** Both — managed cloud (free tier + paid) OR self-hosted open-source server
- **Notes:** Event-driven durable execution. Steps are individually retriable. Handles concurrency, rate-limiting, debouncing, idempotency. 100M+ daily runs. Used by tens of thousands of developers. Strong fit for the isso-dashboard given Next.js-first architecture. SDKs for Go, TypeScript, Python, .NET, Ruby, PHP.

### Temporal
- **Repo:** [temporalio/temporal](https://github.com/temporalio/temporal)
- **Stars:** ~19.5k
- **License:** Apache 2.0 (server); MIT (SDKs)
- **Language:** Go (server); SDKs in Go, Java, TypeScript, Python, .NET, PHP
- **Convex/Next.js compat:** Temporal workers run as separate Node.js services; Next.js can trigger workflows via Temporal client. Convex HTTP actions can call Temporal API. More complex setup than Inngest.
- **Self-hosted vs managed:** Both — self-hosted (Docker/K8s) or Temporal Cloud (managed, usage-based pricing)
- **Notes:** Enterprise-grade durable workflow execution. Best for complex, long-running multi-step processes (e.g., model onboarding pipelines, billing reconciliation). Overkill for simple background jobs. Temporal Cloud removes operational overhead but adds cost.

### Recommendation
**Inngest** for the isso-dashboard (Next.js-native, serverless-first, lowest ops overhead). Use **Agenda.js** if you need a lightweight MongoDB-backed scheduler without a separate service. Reserve **Temporal** for complex enterprise workflows if the platform scales to need it.

---

## 5. Google Sheets API Sync

### `googleapis` (official Node.js client)
- **Repo:** [googleapis/google-api-nodejs-client](https://github.com/googleapis/google-api-nodejs-client)
- **Stars:** ~9k+
- **License:** Apache 2.0
- **Language:** TypeScript / Node.js
- **Convex/Next.js compat:** Works from Next.js API routes and server actions. Cannot run inside Convex functions (requires Google Auth credentials/service accounts — use Convex HTTP actions to proxy). Submodule `@googleapis/sheets` (v12.0.0) is leaner for startup.
- **Self-hosted vs managed:** Self-hosted (your credentials, your server)
- **Notes:** Official Google library. Use service account JWT for server-side sync (no user interaction). Full Sheets v4 API access: read, write, batch update, formatting.

### `google-spreadsheet` (community wrapper)
- **Repo:** [theoephraim/node-google-spreadsheet](https://github.com/theoephraim/node-google-spreadsheet)
- **Stars:** ~4k
- **License:** MIT
- **Language:** TypeScript / Node.js
- **Convex/Next.js compat:** Same constraints as `googleapis` — use from Next.js API routes or server actions
- **Self-hosted vs managed:** Self-hosted
- **Notes:** Much cleaner developer experience than raw `googleapis`. Trade-off: doesn't support every API edge case, slightly less performant for bulk parallel operations. Recommended for simple read/write sync use cases (e.g., syncing model roster from a Google Sheet).

### Recommendation
Use **`google-spreadsheet`** for simple sync workflows (model data, schedule imports). Use raw **`@googleapis/sheets`** when you need batch parallelism or advanced features. Both require service account credentials stored as environment variables.

---

## 6. Google Drive API

### `googleapis` / `@googleapis/drive`
- **Repo:** [googleapis/google-api-nodejs-client](https://github.com/googleapis/google-api-nodejs-client)
- **Stars:** ~9k+
- **License:** Apache 2.0
- **Language:** TypeScript / Node.js
- **Convex/Next.js compat:** Next.js API routes / server actions only (not Convex functions directly). Use `@googleapis/drive` (submodule) for leaner bundle. Drive v3 API fully supported including resumable uploads for large files.
- **Self-hosted vs managed:** Self-hosted credentials (Google Cloud project, service account)
- **Notes:** Handles file upload/download, folder management, permissions, sharing. For large file uploads (video assets) use the resumable upload stream API. Use service account for server-side automation; OAuth 2.0 for user-specific Drive access.

### Recommendation
Use **`@googleapis/drive`** (official submodule) for all Drive operations. Pair with BullMQ for async upload jobs.

---

## 7. Approval Workflow Engines

### n8n
- **Repo:** [n8n-io/n8n](https://github.com/n8n-io/n8n)
- **Stars:** ~183k (top 50 on GitHub)
- **License:** Fair-code (Sustainable Use License for community; n8n Enterprise License for `.ee.` files)
- **Language:** TypeScript / Node.js
- **Convex/Next.js compat:** n8n runs as a standalone service; triggers via webhooks from Next.js/Convex. Webhooks, HTTP Request nodes, and custom code nodes available. Not embedded in Next.js.
- **Self-hosted vs managed:** Both — self-hosted (Docker, unlimited executions free) or n8n Cloud (paid SaaS)
- **Notes:** 183k+ GitHub stars, 200k+ community, 400+ integrations, 100M+ Docker pulls. n8n 2.0 released Dec 2025 — enterprise-grade security, improved AI Agent node. Ideal for visual approval workflows, multi-platform social posting automations, webhook-driven pipelines. Self-hosted is fully free for unlimited executions. Strong fit for agency ops (approval queues, content review pipelines).

### Temporal (see Section 4)
- Also applicable as an approval workflow engine for code-defined workflows requiring audit trails, retries, and long-running human approval steps. More complex to operate than n8n.

### Recommendation
**n8n** for visual approval workflows, agency-facing automations, and integration glue (183k stars, free self-hosted). Use **Temporal** only if approval workflows need to be deeply embedded in application code with programmatic durable execution.

---

## Summary Matrix

| Tool | Category | Stars | License | Language | Convex Compat | Self-hosted |
|---|---|---|---|---|---|---|
| Ayrshare SDK | Social API | — | MIT (SDK) / Managed | TypeScript | Yes (REST) | Managed |
| FFmpeg | Video processing | 71.6k | LGPL 2.1+ / GPL | C | Via worker service | Yes |
| Remotion | Video rendering | 43k | Source-available (paid commercial) | TypeScript/React | Via HTTP action | Yes / Lambda |
| BullMQ | Job queue | 8.6k | MIT | TypeScript | Via HTTP action | Yes (Redis) |
| nginx-rtmp-module | Streaming relay | 14k | MIT | C | No (standalone) | Yes |
| SRS | Streaming relay | 28.7k | MIT | C++ | No (standalone) | Yes |
| Ant Media Server | Streaming relay | 4.7k | Community free / Enterprise paid | Java | Via REST | Yes |
| Agenda.js | Scheduler | 8.9k | MIT | TypeScript | No (MongoDB dep) | Yes (MongoDB) |
| Inngest | Workflow/scheduler | ~10k+ | Apache 2.0 (SDK) / SUL (server) | Go + TS | Yes (Next.js native) | Both |
| Temporal | Workflow engine | 19.5k | Apache 2.0 | Go | Via HTTP action | Both |
| googleapis/sheets | Google Sheets sync | 9k+ | Apache 2.0 | TypeScript | Via Next.js API route | Yes (credentials) |
| google-spreadsheet | Google Sheets sync | 4k | MIT | TypeScript | Via Next.js API route | Yes (credentials) |
| googleapis/drive | Google Drive | 9k+ | Apache 2.0 | TypeScript | Via Next.js API route | Yes (credentials) |
| n8n | Approval workflows | 183k | Fair-code / SUL | TypeScript | Via webhook | Both |
| Temporal | Approval workflows | 19.5k | Apache 2.0 | Go | Via HTTP action | Both |

---

## Architecture Notes for isso-dashboard

1. **Job queue backbone:** BullMQ + Redis (Upstash for managed Redis) — handles video processing, social API polling, sheet sync jobs. Convex HTTP actions trigger BullMQ producers.
2. **Scheduling:** Inngest for Next.js-native cron/event-driven jobs (approval notifications, scheduled posts, daily sync). No separate infra needed.
3. **Video pipeline:** FFmpeg (transcoding) + BullMQ (job queue) + Remotion (templated video generation, budget permitting).
4. **Streaming:** SRS for self-hosted RTMP/WebRTC relay; Ant Media if sub-second WebRTC latency is critical.
5. **Google Workspace sync:** `google-spreadsheet` (simple) or `@googleapis/sheets` (bulk) + `@googleapis/drive` for file management. Service account auth stored in env vars.
6. **Approval workflows:** n8n self-hosted via Docker for visual agency approval pipelines. Webhook from Convex/Next.js into n8n triggers review flows.
7. **Social posting:** Ayrshare SDK (managed, fastest path to multi-platform) or build custom per-platform integrations if budget is a concern.
