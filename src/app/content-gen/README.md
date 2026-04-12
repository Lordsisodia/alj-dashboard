# app/content-gen

> Content generation pipeline routes — the gold standard dashboard. DO NOT TOUCH without explicit instruction.
> Owner: content-gen domain
> Import alias: N/A

## ⚠️ Gold Standard — Do Not Modify

The content-gen dashboard is the most complete, production-ready dashboard in the codebase. It is the **reference implementation** for all other dashboards. Before building new pages elsewhere, study how content-gen pages are structured.

## Routes

| Route | Purpose |
|---|---|
| `/content-gen` | Dashboard home |
| `/content-gen/queue` | Generation job queue |
| `/content-gen/gallery` | Completed content gallery |
| `/content-gen/generate` | New generation form |
| `/content-gen/scenes` | Scene management (4-col kanban) |
| `/content-gen/approvals` | Content approval workflow |
| `/content-gen/models` | Model management |
| `/content-gen/model/[id]` | Individual model detail |
| `/content-gen/ideas` | AI brief generator |
| `/content-gen/intelligence` | Intelligence feed |
| `/content-gen/recon` | Competitor recon |
| `/content-gen/community` | Content feed |
| `/content-gen/analytics` | Analytics |
| `/content-gen/schedule` | Schedule |
| `/content-gen/team` | Team view |
| `/content-gen/settings` | Settings |
| `/content-gen/instagram` | IG-specific tools |
| `/content-gen/tiktok` | TikTok tools |
| `/content-gen/youtube` | YouTube tools |
| `/content-gen/x` | X/Twitter tools |
| `/content-gen/pinterest` | Pinterest tools |
| `/content-gen/chatter` | Chatter tools |
| `/content-gen/tools` | Utility tools |
| `/content-gen/agents` | Agent activity |
| `/content-gen/notifications` | Notifications |

## Layout

Uses `content-gen/layout.tsx` + `content-gen/sidebar-config.tsx`.

## Why It's Gold Standard

- All pages use `ContentPageShell` correctly
- All TypeScript errors resolved
- Full Framer Motion animations throughout
- Complete component coverage: queue, gallery, scenes, approvals
- Pattern to replicate in agency and model dashboards

## Import Rules

- All feature components live in `src/features/content-gen/`
- Do not import content-gen components into other dashboards without explicit reuse plan
- Never import marketing components here
