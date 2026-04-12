# Content Production Pipeline Tools Research
**Date:** 2026-04-12
**Purpose:** R&D for an Airtable-style content pipeline table + graph view in the agency dashboard.
**Tools Covered:** Airtable, Notion, Linear, Frame.io

---

## 1. Airtable

### Kanban Board Implementation
- Kanban is a named view type applied to any table — grouped by a Single Select or Status field.
- Column order mirrors the field option order; dragging a card updates the field value in real time across all views.
- Cards are fully customizable: choose which fields surface on the card face (title, deadline, assignee, linked topic, etc.).
- Filter conditions apply to the Kanban view independently of other views — common pattern is hiding "Published" cards to keep focus on active work.
- The free plan supports custom card layouts (one custom field per card); paid plans remove this cap.

### Custom Field Types
| Field Type | Notes |
|---|---|
| Single Line Text | Writer/assignee names for external collaborators |
| Long Text | Brief body, notes |
| Single Select | Status, Content Type, Platform |
| Multi-Select | Tags, Topics, Channels |
| Date | Deadline, Publish Date, Last Published |
| Linked Record | Relational link to Topics, Platforms, Clients tables |
| Lookup | Pull related data (e.g. client name) from linked table |
| Rollup | Count/sum over linked records (e.g. post count per topic) |
| Formula | Computed fields — days until deadline, status flags |
| Attachment | Drafts, images, briefs as file uploads |
| Checkbox | Approved, Published, Reviewed |
| Number | Word count, SEO score |
| URL | Published link, brief link |
| AI-Generated | Field summaries auto-generated from other fields (paid plans) |
| Rating | Priority or quality score |
| Duration | Video/audio length |

### Content Brief Template Fields
A standard Airtable content brief record typically includes:
- Title (Single Line Text)
- Status (Single Select: Idea / Briefed / In Progress / Review / Approved / Published)
- Content Type (Single Select: Blog / Video / Social / Email)
- Platform (Linked Record → Platforms table)
- Topic (Linked Record → Topics table)
- Target Keyword (Single Line Text)
- Word Count Target (Number)
- Assigned Writer (Single Line Text or Collaborator)
- Editor (Collaborator)
- Draft Due Date (Date)
- Publish Date (Date)
- Brief URL (URL)
- Notes (Long Text)
- Attachments (Attachment)
- Published URL (URL)
- SEO Score (Number)
- AI Summary (AI-Generated field)

### Asset Handoff Flows
- Status field drives visibility: each role (writer, editor, reviewer, publisher) operates in a personal or locked view filtered to their stage.
- Automation: when Status changes to "Review", send email/Slack to editor with record link.
- Automation: when Status changes to "Published", timestamp the "Last Published" date on the linked Topics record.
- Automation: when deadline is within 3 days and Status != "Published", send a reminder notification.
- Locked views prevent reviewers from accidentally changing other fields while on their stage.

### View Types
| View | Best For |
|---|---|
| Grid (Table) | Data entry, bulk edits, spreadsheet-style overview |
| Kanban | Status pipeline, drag-to-advance workflow |
| Calendar | Deadline and publish date visibility |
| Gallery | Visual asset library, mood boards, image-heavy content |
| Timeline (Gantt) | Overlapping deadlines, resource planning (Team+ plan) |
| Form | Intake submissions from writers or clients |
| List | Minimal, dense list scanning |

### Filtering, Grouping, Sorting UX
- **Filtering:** Per-view; supports complex conditions (AND/OR groups), field-specific operators (is/is not, contains, before/after date, is empty). Views can be scoped to a saved filter so each role sees only relevant records.
- **Grouping:** Grid and Kanban group by any Single Select, Multi-Select, Collaborator, or Linked Record field. Groups are collapsible. Gallery view does NOT support grouping natively.
- **Sorting:** Multi-field sort (primary + secondary+). "Keep sorted" toggle prevents manual drag reordering. Sorts are view-local.
- **View permissions:** Collaborative (shared), Personal (private), Locked (read-only for non-owners).

### Status Automations and Triggers
| Trigger | Common Action |
|---|---|
| Record created | Set default Status = "Idea", stamp Date Added |
| Field updated (Status) | Send Slack/email notification to next-stage owner |
| Field updated (Status = "In Review") | Create subtasks for editor checklist |
| Field updated (Status = "Published") | Update rollup in Topics table, log to analytics base |
| Scheduled (daily) | Check if deadline < 3 days and Status != Published → send reminder |
| Form submitted | Create record, assign default status, notify PM |
- Free plan: 100 automation runs/month.
- Team plan: 25,000 runs/month.
- Business plan: 100,000 runs/month.
- No option to purchase additional runs mid-cycle; automation pauses when limit is hit.
- Conditional logic within a single automation (branch on field value) is supported.

### Raw Content Queue Patterns
- **Inbox-style:** A Form view acts as the intake channel. Submissions land in a "Backlog" status group. PM triages by assigning Status, Type, and Writer.
- **Table-style:** Grid view filtered to Status = "Idea" or "Briefed" serves as the actionable queue. Sorted by Deadline ascending to surface most urgent.
- Common agency pattern: three linked tables — Content Items (primary queue), Topics (evergreen strategy), Platforms (distribution channels).

### Pricing (2026)
| Plan | Price (annual) | Records/base | Automation Runs/mo | Attachments/base |
|---|---|---|---|---|
| Free | $0 | 1,000 | 100 | 1 GB |
| Team | $20/seat/mo | 50,000 | 25,000 | 20 GB |
| Business | $45/seat/mo | 125,000 | 100,000 | 100 GB |
| Enterprise | Custom | Unlimited | Unlimited | Unlimited |
- AI add-on: +$6/seat/month on Team and Business.
- Portals (external client access): $120–150/month for 15 guests.
- Commenters are billable on Team; free on Business.
- No mid-cycle refund for removed seats; automatic true-up for added seats.

---

## 2. Notion

### Kanban Board Implementation
- Called "Board view" — groups database pages by any Select, Multi-Select, or Person property.
- Drag-and-drop between columns updates the grouping property value automatically.
- Columns can be added by adding new options to the grouping property.
- WIP limits are visible on some plans but not enforced (no hard block when exceeded).
- Cards show configurable properties; color labels visible at a glance.
- Same database can be viewed in Board, Table, Calendar, Gallery, Timeline, List, or Chart view simultaneously — switch without data loss.

### Custom Field Types (Properties)
| Property Type | Notes |
|---|---|
| Text | Body copy, brief text |
| Number | Word count, score |
| Select | Status, Type, Priority |
| Multi-select | Tags, Channels |
| Date | Deadlines, publish dates |
| Person | Assignee, reviewer |
| File & Media | Attachments, images |
| Checkbox | Boolean flags |
| URL | Published links |
| Email | Contact fields |
| Phone | Contact fields |
| Relation | Link to another database (analogous to Linked Record) |
| Rollup | Aggregate over related database |
| Formula | Computed values |
| Created/Last edited time | Auto-stamps |
| AI Summary | Auto-summarize page content (Business plan) |
- Notion databases are collections of pages — each record is a full editable document, not just a row. This is the key structural difference vs. Airtable.

### Content Brief Template
Notion offers native repeating templates per database. A content brief template typically includes:
- Title
- Status (Select: Idea / Briefed / Writing / Review / Approved / Published)
- Content Type
- Platform (Relation → Platforms DB)
- Topic (Relation → Topics DB)
- Assignee (Person)
- Reviewer (Person)
- Due Date (Date)
- Publish Date (Date)
- Brief body (embedded in the page itself — full rich text, embeds, tables)
- Attached files (inline media)
- SEO notes section
- Checklist (native checkbox blocks inside the page)
- Comments/feedback thread (inline comments)

### Asset Handoff Flows
- Status-change automation: when Status → "In Review", notify reviewer via Slack/email integration.
- Approval Workflow Tracker template available in Notion Marketplace.
- Native automation: trigger on property edit → update another property or notify via integration.
- For richer branching logic (if/else), external tools like Activepieces, Zapier, or n8n are required.
- Feature Handoff Doc template provides a structured handoff framework for launch moments.
- Restricted page permissions control which collaborators see which stages.

### View Types
| View | Best For |
|---|---|
| Table (Database) | Spreadsheet-style, all properties visible |
| Board (Kanban) | Status pipeline, drag-to-advance |
| Calendar | Date-based scheduling |
| Gallery | Visual card library (image-heavy content) |
| Timeline (Gantt) | Project scheduling with date ranges |
| List | Dense, minimal scrollable list |
| Chart | Bar/line/donut visualization of database fields |

### Filtering, Grouping, Sorting UX
- **Filtering:** Per-view filters with AND/OR logic; filter by any property type. Filters can be saved as view defaults.
- **Grouping:** Board and Table views support grouping by Select, Multi-select, Person, Date, or Relation properties.
- **Sorting:** Multi-field sort; drag to reorder manually when sort is not active.
- **Linked databases:** The same database can be embedded multiple times across the workspace with independent view/filter configurations — useful for showing only "My Tasks" in a personal workspace while the canonical table exists elsewhere.

### Status Automations and Triggers
- Native automation trigger: "When property edited" or "When page added".
- Native actions: edit a property, add a page, notify via connected app.
- Repeating templates: automatically create pages on a schedule (daily standups, weekly content reviews).
- Button blocks: one-click multi-step actions within a page.
- Branching/conditional automation: requires external integration (Zapier, n8n, Activepieces).
- API rate limit: 3 requests/second per integration — can bottleneck heavy sync pipelines.
- AI Agents (custom workflow agents) available on Business plan as of Notion 3.3 (Feb 2026).

### Raw Content Queue Patterns
- **Inbox-style:** A "Content Inbox" database with default status "New" + Notion form intake. PM triages in the Board view.
- **Table-style:** Table view filtered to active statuses, sorted by due date. Writers see a filtered linked database view scoped to their Person property.
- Because each record is a full page, the brief and the task live in the same record — reduces context switching vs. Airtable where the brief is a linked attachment.

### Pricing (2026)
| Plan | Price (annual) | Guests | AI Access |
|---|---|---|---|
| Free | $0 | 10 | 20-response trial only |
| Plus | $8/member/mo | 100 | 20-response trial only |
| Business | $15/member/mo | 250 | Full (AI Agents, Ask Notion) |
| Enterprise | Custom | Unlimited | Full + governance |
- AI was previously a $10/seat add-on; as of 2025 it is bundled into Business tier only.
- Adding members mid-cycle is charged immediately (prorated); removing members does NOT refund until renewal.
- No viewer/read-only tier on paid plans — every collaborator with edit access pays full seat price.
- Notion API is free with no per-call charges; rate-limited at 3 req/s per integration.

---

## 3. Linear

### Kanban Board Implementation
- Nearly every view in Linear can be toggled to Board layout or List layout.
- Columns correspond to workflow statuses defined per team (e.g. Backlog / Todo / In Progress / In Review / Done / Cancelled).
- Drag between columns updates status instantly.
- Designed primarily for engineering sprint workflows; content teams can adapt by mapping statuses to editorial stages.
- No WIP limit enforcement natively (counts visible, not enforced).
- Board views are fast and keyboard-navigable — Linear's core design principle is speed.

### Custom Field Types (Issue Properties)
Linear uses a more constrained property model than Airtable/Notion:
| Property | Notes |
|---|---|
| Title | Required |
| Status | Required; per-team workflow states |
| Priority | Urgent / High / Medium / Low / No Priority |
| Assignee | Team member |
| Labels | Multi-tag classification |
| Due Date | Date |
| Estimate | Story points or time |
| Cycle | Sprint assignment |
| Project | Project grouping |
| Sub-issues | Parent-child issue relations |
| Blocked by / Blocking | Issue relations |
| Template | Which form template created it |
| Custom Fields | Text, Number, Select, Multi-select (via custom field creation) — available on paid plans |
- Form templates (2025): support generic fields (text, dropdown, checkbox) + issue properties; useful for structured content intake, editorial requests, or campaign briefs.
- Team-scoped templates enforce consistent issue creation per team.

### Content Brief Templates (via Issue Templates)
- Linear issue templates pre-fill fields including status, labels, assignee, and custom fields.
- Form templates allow submitters to fill in structured details before an issue is created (maps well to a "content request" intake form for non-Linear users).
- Templates are filterable — all issues created from "Content Brief" template can be queried as a custom view.
- Triage routing: new submissions via Asks integration can be auto-routed to correct team/assignee based on field values.

### Asset Handoff Flows
- Linear does NOT have native file review/annotation — it is not a media tool.
- Handoff workflow is issue-status-based: editor → reviewer → publisher maps to status transitions.
- GitHub/GitLab integrations auto-advance status based on branch/PR state (less relevant for content).
- Slack integration: notify channel or DM when issue status changes.
- Webhook/API: trigger external actions (e.g. notify Frame.io, update Airtable) on status change.
- No native approval gate — a reviewer "approves" by moving the issue to the next status.

### View Types
| View | Notes |
|---|---|
| List | Default issue list, dense, filterable |
| Board (Kanban) | Status-column drag-and-drop |
| Timeline | Project-level Gantt-style (not available on Free) |
| Custom Views | Saved filtered views of any issue set, shareable |
- No Gallery view (no visual/card layout for media assets).
- No Calendar view natively.
- No form/intake view (handled by Asks integration or external forms).

### Filtering, Grouping, Sorting UX
- **Filtering:** Dynamic — views ARE filters. Any combination of status, priority, assignee, label, project, cycle, due date, template, creator can be a saved view.
- **Grouping:** Board groups by status; list can group by project, assignee, priority, label, cycle.
- **Sorting:** By priority, due date, created date, updated date, estimate.
- Views are live — issues auto-enter/exit a view when they match/stop matching its filters.
- Favorite views persist in sidebar; shareable across workspace.
- SteelSync integration adds external stakeholder view (public roadmaps, client request portals).

### Status Automations and Triggers
- Cycles: sprint-like periods with automated rollover of incomplete issues.
- GitHub/GitLab: auto-transitions (In Progress on branch copy, Done on merge).
- Triage routing: auto-assign issues to team/member based on field rules.
- Scheduled issue creation: recurring tasks (weekly standups, monthly reports) via templates.
- Webhooks + API: external automation (Linear does not have a native "if-this-then-that" builder).
- Community feedback: "automations are quite limited" compared to Airtable/Notion — complex workflows require API or Zapier/n8n.

### Raw Content Queue Patterns
- Triage view acts as the "raw inbox" — new issues land here before assignment.
- Content teams typically create a "Content Requests" team with a Triage inbox.
- PM moves issues from Triage → Backlog → active cycle.
- Linear is best suited as the task/ticket layer in a larger stack rather than the content brief/document layer.

### Pricing (2026)
| Plan | Price (annual) | Issue Limit | Notes |
|---|---|---|---|
| Free | $0 | 250 active | 2 teams, unlimited members |
| Basic/Standard | ~$8–10/user/mo | Unlimited | Core features, workflow automation |
| Business/Plus | ~$14–16/user/mo | Unlimited | Advanced permissions, Asks, analytics |
| Enterprise | Custom | Unlimited | SAML/SCIM, dedicated support |
- No viewer/read-only tier — all active members pay full seat price.
- AI features (auto-categorization, sprint suggestions, release notes) included on all plans.
- SAML/SCIM requires Enterprise (estimated $250–350/user/year for ~100-user orgs).
- 20% discount on annual commitment; 15–30% additional discount on 2–3 year terms.
- Education: 100% off for full-time students (1 year), 75% off for university staff.

---

## 4. Frame.io

### Kanban Board Implementation
- Frame.io has NO kanban board. It is a media review and approval platform, not a project management tool.
- Workflow "stages" are approximated through folder structure, Collections (smart folders), and review status on assets.
- Collections auto-update based on metadata tags (star rating, assignee, media type, social platform, release date).
- The closest analog to a pipeline view is a multi-stage review Collection filtered by approval status.

### Custom Field Types
Frame.io uses a metadata model rather than spreadsheet-style custom fields:
| Field / Feature | Notes |
|---|---|
| Star Rating | 1–5 quality/priority rating on any asset |
| Assignee | Tag an asset to a team member |
| Due Date | Deadline metadata |
| Media Type | Auto-detected or manual (video, image, audio, document) |
| Social Platform | Tag for distribution channel |
| Release Date | Publication date metadata |
| Custom Metadata | Enterprise: define custom metadata schemas |
| Keywords/Hashtags | Tagging for search and Collections |
| Comments (timestamped) | Point-and-click annotations, emoji reactions, @mentions, attachments |
| Versions | Multi-version history per asset |
| Watermarks | Visible/invisible, session-based (Enterprise) |

### Content Brief Templates
- Frame.io does not have content brief templates. Briefs typically live in Notion or Airtable and are linked to Frame.io assets via URL or the Workfront integration.
- The closest feature is Custom Actions (beta): trigger external logic (e.g. push a brief template to a connected tool) based on asset activity.

### Asset Handoff Flows
Frame.io is purpose-built for media handoff:

**Editor → Reviewer:**
- Editor uploads cut/asset to Frame.io project.
- Reviewer receives notification, views in the Frame.io player (web, iOS, iPadOS).
- Reviewer leaves timestamped comments, point-and-click annotations, emoji reactions, @mentions.
- Premiere Pro 25.2+ has Frame.io Comments Panel natively embedded in the Review workspace — editors see feedback without leaving their timeline.

**Reviewer → Publisher:**
- Approval status set on asset (Approved / Needs Revision / Rejected).
- Restricted Folders control access: publisher-only delivery folders isolate final assets from WIP.
- Quick Share: generate share link from on-page modal without navigating away.
- Custom Actions (beta): on approval, trigger downstream logic — push to MAM, notify Slack, generate social variants.
- Enterprise: Forensic Watermarking, DRM, session-based watermarking for secure distribution.

**Camera to Cloud (C2C):**
- RAW/proxy files upload from camera directly to Frame.io seconds after each take.
- Post-production team accesses footage in real time while production is still shooting.
- Removes physical media shuttle step entirely.

**Integrations:**
- Workfront: unified folder/user/asset/status sync between Workfront (PM) and Frame.io (media review).
- Slack, Trello, Monday.com, YouTube: via Zapier, Make, or Adobe Workfront Fusion (low/no-code).
- Premiere Pro, After Effects, DaVinci Resolve: direct panel integrations.

### View Types
| View | Notes |
|---|---|
| Project/Folder tree | Primary navigation — hierarchical asset organization |
| Asset grid | Thumbnail grid of assets in a folder |
| Asset list | File-browser-style list with metadata columns |
| Player view | Immersive single-asset review with comments |
| Comparison viewer | Side-by-side version comparison |
| Collections view | Smart folder of assets matching metadata criteria |
- No table/spreadsheet view.
- No kanban/board view.
- No calendar view.
- No timeline/Gantt view.

### Filtering, Grouping, Sorting UX
- **Filtering:** By media type, keywords, assignee, star rating, approval status, due date, social platform. Paid plans support natural language search ("show me all approved vertical videos for Instagram from last week").
- **Grouping:** Collections group assets by metadata rules. Folder structure serves as manual grouping.
- **Sorting:** By name, date uploaded, file size, duration; within folders and search results.
- AI-powered search (Teams/Enterprise): visual search — analyze footage content, not just metadata. Can query by intent ("find the interview shot where the subject is laughing").

### Status Automations and Triggers
- Custom Actions (beta): trigger on asset activity (upload, approval status change, comment) → push to external system.
- Workfront Fusion / Zapier / Make: connect approval events to notifications, task creation, publishing workflows in other tools.
- Camera to Cloud: automatic upload trigger from hardware → Frame.io.
- No native "if-this-then-that" automation builder.
- No deadline-based automation triggers natively.

### Raw Content Queue Patterns
- Not applicable in the traditional sense. Frame.io is the destination for finished/near-finished media assets, not the front-end intake.
- The "raw queue" equivalent is the Camera to Cloud ingestion flow: footage arrives automatically, organized by production date/take number.
- Teams use metadata + Collections to create a "Ready for Review" smart queue.

### Pricing (2026)
| Plan | Price | Members | Storage |
|---|---|---|---|
| Free | $0 | 2 | 2 GB |
| Pro | ~$15/member/mo | 5 | 2 TB |
| Team | varies | Up to 15 | 3 TB + 2 TB/additional member |
| Enterprise | Custom | Unlimited | Custom |
- Annual plan ~13% cheaper than monthly equivalent.
- Volume discounts negotiable for larger teams.
- Exceeding storage limits can suspend account and break all shared links — plan storage carefully.
- Historical content indexing (AI search for assets older than 30 days) requires Enterprise plan.
- Forensic watermarking, DRM, Asset Lifecycle Management: Enterprise only.

---

## 5. Feature Comparison Matrix

| Feature | Airtable | Notion | Linear | Frame.io |
|---|---|---|---|---|
| **Kanban board** | Yes (named view) | Yes (Board view) | Yes (Board layout) | No |
| **Table/grid view** | Yes (Grid — primary) | Yes (Table view) | Yes (List view) | No |
| **Gallery view** | Yes (attachment cover) | Yes | No | Yes (asset grid) |
| **Timeline/Gantt view** | Yes (Team+) | Yes | Yes (Business+) | No |
| **Calendar view** | Yes | Yes | No | No |
| **Chart/reporting view** | Via extensions | Yes (native chart) | Limited | No |
| **Linked/relational records** | Yes (first-class) | Yes (Relation property) | Partial (issue relations) | No |
| **Formula fields** | Yes | Yes | No | No |
| **Rollup fields** | Yes | Yes | No | No |
| **Custom field types** | 20+ types | 20+ types | ~10 types | Metadata only |
| **Content brief as record** | Attachment/URL only | Record IS a full page | Issue + template fields | No |
| **Media annotation** | No | No | No | Yes (first-class) |
| **File versioning** | Basic (attachments) | No | No | Yes (multi-version) |
| **Status automation triggers** | Yes (robust, GUI) | Yes (basic, GUI) | Partial (webhooks/API) | Partial (Custom Actions beta) |
| **Scheduled automations** | Yes | Yes (repeating templates) | Yes (recurring issues) | No |
| **Native approval flow** | Via status + automation | Via status + automation | Via status transition | Yes (Approved/Needs Revision) |
| **Role-based view permissions** | Yes (locked/personal/collaborative views) | Yes (page/teamspace permissions) | Yes (team scoping) | Yes (granular per folder) |
| **External client sharing** | Via Portals ($) | Via public pages / guests | Via SteelSync integration | Yes (Quick Share, Restricted Folders) |
| **Free plan automation runs** | 100/mo | Limited (20 AI responses) | Webhook/API only | No native automation |
| **AI features** | Paid add-on (+$6/seat) | Business plan only | All plans (issue categorization) | Enterprise (visual search) |
| **API / webhooks** | Yes | Yes (3 req/s limit) | Yes | Yes |
| **Camera-to-cloud ingest** | No | No | No | Yes |
| **Video/media playback** | No | Basic embeds | No | Yes (full player) |
| **Pricing entry point** | $20/seat/mo (Team) | $8/seat/mo (Plus) | $8–10/seat/mo (Standard) | ~$15/member/mo (Pro) |

---

## 6. Feature Gaps — Agency Airtable-Style R&D Table + Graph View

The goal is an **Airtable-style table for managing content ideas**, with a **graph view for visualizing relationships** between ideas, topics, formats, and statuses — designed for an agency owner/manager.

### What the Existing Tools Don't Solve Together

**Gap 1: No tool combines structured table + native graph/network visualization**
- Airtable: excellent relational table; no graph view. Extensions exist (e.g. network diagram via custom block) but are third-party.
- Notion: no graph view. The "SISO Library" knowledge graph pattern (using graphify/D3) exists in the workspace but is not embedded in Notion.
- Linear: no graph view. Dependency diagrams exist for issue relations but are not a first-class content ideation tool.
- Frame.io: no graph view, no table.
- **The gap:** A D3-style or force-directed graph showing how content ideas cluster by topic, format, status, or channel is absent from all four tools natively.

**Gap 2: Content brief + media review in the same record**
- Airtable holds the brief/metadata but cannot review/annotate video.
- Frame.io handles media review but has no brief/task management.
- The two tools must be connected via Zapier/Workfront; no unified record exists.
- **The gap:** A single record that contains structured metadata fields (Airtable-style) AND an embedded media player with annotation (Frame.io-style) does not exist.

**Gap 3: No "idea scoring" or weighted ranking built into kanban**
- None of the four tools has a native scoring model (e.g. ICE score, effort/impact matrix) that auto-sorts the backlog.
- Airtable can approximate this with formula fields, but the visualization is a sorted grid — not a 2x2 matrix or priority graph.
- **The gap:** An idea R&D table with built-in priority scoring that maps visually to a 2x2 impact/effort canvas.

**Gap 4: Linear's automation is too shallow for non-engineering content workflows**
- Linear's automation relies on GitHub/GitLab integrations or webhooks/API — no GUI rule builder.
- Content teams need status-to-notification automations without writing code.
- **The gap:** Linear as a content pipeline tool requires engineering support to automate handoffs. Airtable and Notion are significantly more accessible for non-technical teams.

**Gap 5: Airtable gallery view lacks grouping**
- Gallery view cannot natively group cards (e.g. by content type or status) — a major UX limitation for visual content idea boards.
- **The gap:** A gallery/card view that supports grouped columns (like a visual kanban with image covers) does not exist in Airtable.

**Gap 6: Pricing cliff at scale**
- Airtable's Team → Business jump ($20 → $45/seat) is a 125% price increase triggered by crossing 25,000 automation runs or 50,000 records.
- For an agency managing many clients and content streams, this ceiling arrives quickly.
- Notion is more economical ($8 → $15) but automation depth requires Business tier for full AI.
- **The gap:** No tool offers a mid-tier plan that combines relational depth (Airtable) + automation (Airtable Business) + document briefs (Notion) at a predictable cost.

**Gap 7: No "content graph" — topic/idea relationship visualization**
- The agency dashboard needs a way to see content clusters: which topics have been covered, which are underserved, how ideas relate to each other.
- This is a knowledge-graph problem, not a task-management problem.
- **Build target:** A D3 force-directed graph rendering nodes (ideas/topics/formats) and edges (relationships: "builds on", "part of series", "same audience") from the content table, displayed as a second view alongside the Airtable-style R&D table.

### Recommended Build Stack for Agency R&D Table + Graph View

| Layer | Tool / Approach |
|---|---|
| **Data model** | Airtable-style relational table (ideas linked to topics, formats, statuses, clients) |
| **Table view** | Grid with status, assignee, scoring fields, custom field types |
| **Kanban view** | Group by Status (Idea / Briefed / In Production / Review / Published) |
| **Graph view** | D3 force-directed graph, nodes = ideas, edges = topic/format/client relationships |
| **Scoring** | Formula field: ICE or custom weight (Impact × Confidence ÷ Effort) auto-sorts backlog |
| **Brief record** | Each idea record contains full brief inline (like Notion pages) + attachment for media |
| **Status automation** | On status change → notify assignee, stamp timestamp, trigger next-stage action |
| **Intake queue** | Form view (or dedicated inbox table) → triage by PM → promotes to active pipeline |
| **Media handoff** | Link to Frame.io review URL in a URL field on the record |

---

## Sources
- [Airtable Content Calendar: Database-Driven Workflows (2026)](https://draft.dev/learn/airtable-content-calendar)
- [How to create a custom Kanban board in Airtable](https://www.softr.io/blog/airtable-kanban-board)
- [What is Airtable and how does it work? (2026)](https://www.softr.io/blog/what-is-airtable)
- [Getting started with Airtable automations](https://support.airtable.com/docs/getting-started-with-airtable-automations)
- [Airtable automation trigger: When record updated](https://support.airtable.com/docs/when-record-is-updated-trigger)
- [Airtable Triggers](https://support.airtable.com/docs/airtable-triggers)
- [Getting started with Airtable views](https://support.airtable.com/docs/getting-started-with-airtable-views)
- [Getting started with Airtable Gallery Views](https://support.airtable.com/docs/getting-started-with-airtable-gallery-views)
- [Airtable Views: Filtering, Sorting, and Grouping](https://jakemgibson.com/airtable-dh/filter_sort_group/)
- [Airtable Pricing | Compare Plans, Features & Costs](https://airtable.com/pricing)
- [Complete Guide to Airtable Plans and Pricing in 2026](https://www.softr.io/blog/airtable-pricing)
- [Board view – Notion Help Center](https://www.notion.com/help/boards)
- [Views, filters, sorts & groups – Notion Help Center](https://www.notion.com/help/views-filters-and-sorts)
- [How to create an efficient content workflow (+ templates)](https://www.notion.com/blog/content-workflow)
- [Notion Approval Workflow: Build a Scalable System](https://noteforms.com/resources/notion-approval-workflow-system)
- [Notion Pricing Plans: Free, Plus, Business, & Enterprise](https://www.notion.com/pricing)
- [Notion Pricing in 2026: Plans, AI Add-On, and the Limits Nobody Mentions](https://www.notionpricing.com/)
- [Board layout – Linear Docs](https://linear.app/docs/board-layout)
- [Custom Views – Linear Docs](https://linear.app/docs/custom-views)
- [Issue templates – Linear Docs](https://linear.app/docs/issue-templates)
- [Asks fields and Triage routing – Linear Changelog](https://linear.app/changelog/2025-06-05-asks-fields-and-triage-routing)
- [Billing and plans – Linear Docs](https://linear.app/docs/billing-and-plans)
- [Linear Pricing in 2026: Plans, Per-User Costs](https://quackback.io/blog/linear-pricing)
- [Adobe Introduces Next Generation of Frame.io](https://news.adobe.com/news/news-details/2024/adobe-introduces-next-generation-of-frame-io-to-accelerate-content-workflow-and-collaboration-for-every-creative-project)
- [Frame.io V4: The fully reimagined platform is now available for all](https://blog.adobe.com/en/publish/2024/10/14/frameio-v4-the-fully-reimagined-platform-is-now-available-for-all)
- [Frame.io Ecosystem and Integrations (2025)](https://blog.frame.io/2025/06/03/frame-io-ecosystem-and-integrations-powering-creative-workflows-across-apis/)
- [Frame.io at Adobe MAX 2025](https://blog.frame.io/2025/10/28/adobe-max-2025-connected-creativity-for-modern-content-production/)
- [What's New in Frame.io: April 2025 Releases](https://blog.frame.io/2025/05/12/whats-new-in-frame-io-april-2025-releases/)
- [Frame.io Pricing](https://frame.io/pricing)
- [Airtable vs. Notion: Which is best? | Zapier](https://zapier.com/blog/airtable-vs-notion/)
- [Airtable vs Notion Definitive 2026 Comparison](https://sotion.so/blog/airtable-vs-notion)
- [Linear Project Management for Creative Agencies](https://www.manyrequests.com/blog/linear-project-management)
- [Top 8 Frame.io alternatives for video review and approval in 2025](https://www.ziflow.com/blog/frame-io-alternatives)
