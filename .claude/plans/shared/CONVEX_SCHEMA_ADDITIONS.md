# Convex Schema Additions — Content Pipeline

*Designed 2026-04-12. Ready to paste into `convex/schema.ts` inside `defineSchema({...})`.*

**Existing tables referenced (DO NOT duplicate):**
`models`, `scrapedPosts`, `postAnalyses`, `scenes`, `contentGenJobs`, `approvals`, `schedule`, `teamMembers`, `trackedAccounts`, `ideas`, `content`

---

## How to integrate

Paste the 9 table definitions below **after** the existing `creatorBriefs` table and **before** the closing `});` of `defineSchema`. No existing tables are modified.

---

## Schema Code

```typescript
  // ═══════════════════════════════════════════════════════════════════════
  // CONTENT PIPELINE TABLES (9 new tables)
  // ═══════════════════════════════════════════════════════════════════════

  // ── R&D Entries (content ideas backlog — the Sunday planning table) ──
  // Page: R&D Table (P2). Source of truth for content ideas before they
  // become content requests. Links to scrapedPosts when the idea came from
  // analytics, and to postAnalyses for performance feedback loop (P15).
  // NOT the same as `ideas` (which is AI-generated briefs from the content
  // gen pipeline). This is the human-curated Airtable-style backlog.
  rdEntries: defineTable({
    // ── Identity
    modelId: v.id("models"),                   // which model this idea is for
    niche: v.string(),                         // e.g. "GFE", "Fitness", "Meme"
    theme: v.optional(v.string()),             // e.g. "Songkran", "Western", "Trending"
    category: v.optional(v.string()),          // e.g. "hook_reel", "tutorial", "thirst_trap"

    // ── Content
    title: v.string(),                         // short idea title
    description: v.string(),                   // full idea description
    referenceReelUrl: v.optional(v.string()),  // URL of reference reel (could be R2 or external)
    referencePostId: v.optional(v.id("scrapedPosts")), // link to scraped post if sourced from analytics

    // ── Source tracking — where the idea came from
    source: v.union(
      v.literal("editor_sunday"),              // editor filled on Sunday planning session
      v.literal("analytics"),                  // auto-generated from social analytics insights
      v.literal("model_swipe"),                // model swiped right in Swipe Deck
      v.literal("ai_suggestion"),              // AI-generated suggestion from Ideas Lab
      v.literal("manual")                      // manually added by anyone
    ),

    // ── Pipeline status
    status: v.union(
      v.literal("proposed"),                   // initial state — idea submitted
      v.literal("approved"),                   // senior approved (P4 gate)
      v.literal("assigned"),                   // turned into a contentRequest
      v.literal("in_production"),              // model is creating content
      v.literal("completed"),                  // content delivered and edited
      v.literal("rejected")                    // rejected at approval gate
    ),

    // ── Approval
    approvedBy: v.optional(v.string()),        // who approved (partner name)
    approvedAt: v.optional(v.number()),        // Unix ms timestamp
    rejectionReason: v.optional(v.string()),   // why rejected

    // ── Performance feedback loop (P15 — auto-tagged after posting)
    performanceTags: v.optional(v.array(v.string())),  // e.g. ["high_engagement", "viral"]
    linkedPostAnalysisId: v.optional(v.id("postAnalyses")), // link to post performance data
    engagementRate: v.optional(v.number()),     // backfilled from posted content
    viewCount: v.optional(v.number()),          // backfilled from posted content

    // ── Duplicate detection (E16)
    contentHash: v.optional(v.string()),        // fuzzy-match hash for duplicate detection

    // ── Priority & ordering
    priorityScore: v.optional(v.number()),      // 0-100, for sorting in the table view

    // ── Metadata
    createdBy: v.optional(v.string()),          // team member name or "system"
    contentRequestId: v.optional(v.id("contentRequests")), // set when assigned → contentRequest
    createdAt: v.number(),                      // Unix ms timestamp
  })
    .index("by_model", ["modelId"])
    .index("by_status", ["status"])
    .index("by_model_status", ["modelId", "status"])
    .index("by_source", ["source"])
    .index("by_created", ["createdAt"])
    .index("by_niche", ["niche"])
    .searchIndex("search_rd", {
      searchField: "description",
      filterFields: ["niche", "status", "modelId"],
    }),


  // ── Content Requests (briefs sent to models) ─────────────────────────
  // Page: Content Requests (P5). A brief with video clip, instructions,
  // and tips sent from marketing to a model. The model uploads raw content
  // back, which flows into the Raw Content Queue.
  // Links TO rdEntries (source idea) and TO models (recipient).
  // The model's upload triggers a Google Drive sync and notification.
  contentRequests: defineTable({
    // ── Identity
    modelId: v.id("models"),                   // which model receives the brief
    rdEntryId: v.optional(v.id("rdEntries")),  // which R&D idea this brief is based on

    // ── Brief content
    title: v.string(),                         // brief title
    instructions: v.string(),                  // what the model should do
    tips: v.optional(v.string()),              // CapCut tips, style notes, etc.
    briefVideoUrl: v.optional(v.string()),     // reference video clip URL (R2)
    briefThumbnailUrl: v.optional(v.string()), // thumbnail for the brief

    // ── Deadline & tracking
    deadline: v.optional(v.number()),          // Unix ms — when model must submit by
    reminderSentAt: v.optional(v.number()),    // Unix ms — 24h auto-reminder timestamp (M23)

    // ── Model response
    status: v.union(
      v.literal("draft"),                      // brief being prepared
      v.literal("sent"),                       // sent to model
      v.literal("acknowledged"),               // model opened it
      v.literal("in_progress"),                // model is recording/uploading
      v.literal("uploaded"),                   // model submitted raw content
      v.literal("overdue"),                    // past deadline, no upload
      v.literal("cancelled")                   // cancelled by marketing
    ),
    uploadedClipUrl: v.optional(v.string()),   // model's uploaded raw video (R2/Drive)
    googleDriveFileId: v.optional(v.string()), // auto-synced Drive file ID (P7)
    uploadedAt: v.optional(v.number()),        // Unix ms — when model uploaded

    // ── Gamification
    pointsAwarded: v.optional(v.number()),     // points awarded for submission (M25 early bonus)
    submittedEarly: v.optional(v.boolean()),   // true if submitted before deadline

    // ── Metadata
    sentBy: v.optional(v.string()),            // team member who sent the brief
    sentAt: v.optional(v.number()),            // Unix ms
    createdAt: v.number(),                     // Unix ms
  })
    .index("by_model", ["modelId"])
    .index("by_status", ["status"])
    .index("by_model_status", ["modelId", "status"])
    .index("by_deadline", ["deadline"])
    .index("by_created", ["createdAt"]),


  // ── Reels (edited content — master record per piece) ─────────────────
  // Page: Finished Reels + PTP Approval (E17-E26, A35-A45).
  // One reel = one piece of content being edited. Each reel has multiple
  // versions tracked in `reelVersions`. The latest version is what gets
  // submitted to PTP. Links to `approvals` when submitted for PTP review.
  // Links to `contentRequests` (what triggered the edit) and `models`.
  reels: defineTable({
    // ── Identity
    modelId: v.id("models"),                   // which model the reel is for
    editorId: v.optional(v.id("teamMembers")), // which editor is working on it
    contentRequestId: v.optional(v.id("contentRequests")), // originating content request
    rdEntryId: v.optional(v.id("rdEntries")),  // originating R&D entry

    // ── Content metadata
    title: v.string(),                         // reel title (AI-generated or manual)
    description: v.optional(v.string()),       // 1-2 sentence description (E20)
    niche: v.string(),                         // content niche
    category: v.optional(v.string()),          // content category

    // ── AI metadata (E18-E20, E25-E26)
    captionAI: v.optional(v.string()),         // AI-generated caption
    onScreenTextAI: v.optional(v.string()),    // extracted on-screen text (E19)
    hookVariants: v.optional(v.array(v.string())), // 3 hook variants (E26)
    suggestedHashtags: v.optional(v.array(v.string())), // AI-suggested hashtags (E26)
    viralityScore: v.optional(v.number()),     // 0-99 virality/quality score (E25)

    // ── Version tracking
    currentVersion: v.number(),                // current version number (1, 2, 3...)
    latestVersionId: v.optional(v.id("reelVersions")), // pointer to latest version record

    // ── PTP status (mirrors approval flow)
    ptpStatus: v.union(
      v.literal("editing"),                    // still being edited
      v.literal("submitted"),                  // submitted to PTP for review
      v.literal("approved"),                   // approved by partner
      v.literal("revision"),                   // rejected, needs tweaking (P13)
      v.literal("scheduled")                   // approved and scheduled for posting
    ),
    approvalId: v.optional(v.id("approvals")), // link to existing approvals table when submitted
    approvedBy: v.optional(v.string()),        // partner who approved
    approvedAt: v.optional(v.number()),        // Unix ms
    rejectionNote: v.optional(v.string()),     // why it was rejected
    scheduledDate: v.optional(v.string()),     // recommended post date (YYYY-MM-DD)

    // ── Edit tracking (E24)
    totalEditTimeSeconds: v.optional(v.number()), // cumulative edit time across versions
    editStartedAt: v.optional(v.number()),     // Unix ms — when editing started

    // ── Storage
    mediaUrl: v.optional(v.string()),          // latest version video URL (R2)
    thumbnailUrl: v.optional(v.string()),      // latest version thumbnail
    googleDriveUrl: v.optional(v.string()),    // dual storage — Google Drive URL (E23)

    // ── Metadata
    createdAt: v.number(),                     // Unix ms
    updatedAt: v.number(),                     // Unix ms — last modified
  })
    .index("by_model", ["modelId"])
    .index("by_editor", ["editorId"])
    .index("by_ptp_status", ["ptpStatus"])
    .index("by_model_ptp", ["modelId", "ptpStatus"])
    .index("by_niche", ["niche"])
    .index("by_created", ["createdAt"])
    .index("by_updated", ["updatedAt"]),


  // ── Reel Versions (V1, V2, V3... per reel) ──────────────────────────
  // Unlimited version tracking (A39, E31). Each version is an immutable
  // snapshot. When PTP rejects, editor creates a new version. Supports
  // side-by-side comparison (A42) by keeping all versions accessible.
  reelVersions: defineTable({
    // ── Identity
    reelId: v.id("reels"),                     // parent reel
    versionNumber: v.number(),                 // 1, 2, 3, ...

    // ── Media
    mediaUrl: v.string(),                      // video URL for this version (R2)
    thumbnailUrl: v.optional(v.string()),      // thumbnail for this version
    googleDriveUrl: v.optional(v.string()),    // Drive backup URL
    fileSizeBytes: v.optional(v.number()),     // file size for storage tracking

    // ── AI metadata snapshot (frozen at upload time)
    captionAI: v.optional(v.string()),
    onScreenTextAI: v.optional(v.string()),
    viralityScore: v.optional(v.number()),     // 0-99

    // ── Edit metadata
    editTimeSeconds: v.optional(v.number()),   // how long this version took to edit (E24)
    editorNotes: v.optional(v.string()),       // editor's notes on what changed

    // ── Review
    status: v.union(
      v.literal("uploaded"),                   // just uploaded
      v.literal("submitted"),                  // sent to PTP
      v.literal("approved"),                   // approved
      v.literal("rejected")                    // rejected — triggers next version
    ),
    reviewedBy: v.optional(v.string()),        // who reviewed
    reviewedAt: v.optional(v.number()),        // Unix ms
    rejectionNote: v.optional(v.string()),     // rejection feedback

    // ── Annotations (A44 — frame-accurate video annotation)
    annotations: v.optional(v.array(v.object({
      timestampSec: v.number(),                // frame timestamp in seconds
      comment: v.string(),                     // reviewer comment
      authorName: v.string(),                  // who left the comment
      createdAt: v.number(),                   // Unix ms
    }))),

    // ── Metadata
    uploadedBy: v.optional(v.string()),        // editor name
    createdAt: v.number(),                     // Unix ms
  })
    .index("by_reel", ["reelId"])
    .index("by_reel_version", ["reelId", "versionNumber"])
    .index("by_status", ["status"])
    .index("by_created", ["createdAt"]),


  // ── Scheduled Posts (internal queue + Meta slot tracking) ─────────────
  // Page: Content Scheduler (A24-A34). This is the INTERNAL infinite queue
  // that drips to Meta's 25-slot limit (A28-A29). Different from the
  // existing `schedule` table which is a simple planned-post record.
  // `schedule` = high-level content calendar view.
  // `scheduledPosts` = execution-level Meta API queue with slot management.
  scheduledPosts: defineTable({
    // ── Identity
    modelId: v.id("models"),                   // which model's account
    reelId: v.optional(v.id("reels")),         // which reel to post
    approvalId: v.optional(v.id("approvals")), // link to PTP approval
    scheduleId: v.optional(v.id("schedule")),  // link to existing schedule table entry
    accountHandle: v.string(),                 // IG handle being posted to

    // ── Content
    platform: v.union(
      v.literal("instagram"),
      v.literal("tiktok"),
      v.literal("twitter"),
      v.literal("onlyfans"),
      v.literal("fansly")
    ),
    contentType: v.union(
      v.literal("reel"),
      v.literal("post"),
      v.literal("story"),
      v.literal("carousel")
    ),
    caption: v.optional(v.string()),           // final caption
    hashtags: v.optional(v.array(v.string())), // final hashtags
    onScreenText: v.optional(v.string()),      // on-screen text for reference
    mediaUrl: v.optional(v.string()),          // video/image URL to post

    // ── Scheduling
    scheduledAt: v.number(),                   // Unix ms — when to post
    bestTimeScore: v.optional(v.number()),     // AI best-time-to-post score (A31)

    // ── Meta API slot tracking (A28-A29)
    metaSlotPosition: v.optional(v.number()),  // 1-25, null = in internal queue
    metaMediaContainerId: v.optional(v.string()), // Meta API container ID after upload
    metaPostId: v.optional(v.string()),        // Meta API post ID after publish

    // ── Status
    status: v.union(
      v.literal("queued"),                     // in internal infinite queue
      v.literal("slot_assigned"),              // assigned a Meta slot (1-25)
      v.literal("uploading_to_meta"),          // media being uploaded to Meta
      v.literal("scheduled_meta"),             // confirmed scheduled in Meta
      v.literal("published"),                  // successfully posted
      v.literal("failed"),                     // posting failed
      v.literal("cancelled")                   // removed from queue
    ),
    errorMessage: v.optional(v.string()),      // error detail if failed
    retryCount: v.optional(v.number()),        // number of retry attempts

    // ── SLA tracking (A30)
    enteredQueueAt: v.optional(v.number()),    // Unix ms — when entered internal queue
    slotAssignedAt: v.optional(v.number()),    // Unix ms — when Meta slot was assigned
    publishedAt: v.optional(v.number()),       // Unix ms — when actually posted

    // ── Metadata
    scheduledBy: v.optional(v.string()),       // who scheduled it
    createdAt: v.number(),                     // Unix ms
  })
    .index("by_model", ["modelId"])
    .index("by_status", ["status"])
    .index("by_scheduled_at", ["scheduledAt"])
    .index("by_model_platform", ["modelId", "platform"])
    .index("by_platform_status", ["platform", "status"])
    .index("by_account", ["accountHandle"])
    .index("by_created", ["createdAt"]),


  // ── Notifications (3-channel notification system) ────────────────────
  // N1-N6. Three channels: in-app, push, telegram. Severity determines
  // which channels fire. Digest mode (N6) batches low-severity into
  // daily summaries. Links to teamMembers for recipient.
  notifications: defineTable({
    // ── Recipient
    recipientId: v.optional(v.id("teamMembers")), // null for model-targeted notifs
    recipientModelId: v.optional(v.id("models")), // for model-targeted notifs
    recipientName: v.string(),                 // denormalised for fast display

    // ── Content
    title: v.string(),                         // notification title
    body: v.string(),                          // notification body text
    linkTo: v.optional(v.string()),            // deep link URL within dashboard

    // ── Classification
    type: v.union(
      v.literal("content_request"),            // brief sent to model (HIGH)
      v.literal("editing_task"),               // new item in editor queue (HIGH)
      v.literal("ptp_rejection"),              // reel rejected, needs re-edit (HIGH)
      v.literal("ptp_submission"),             // reel submitted for approval (MEDIUM)
      v.literal("model_uploaded"),             // model uploaded raw content (MEDIUM)
      v.literal("shift_starting"),             // shift about to start (MEDIUM)
      v.literal("shift_late"),                 // employee late (LOW)
      v.literal("deadline_reminder"),          // 24h content deadline (HIGH)
      v.literal("approval_complete"),          // reel approved (MEDIUM)
      v.literal("schedule_published"),         // post published successfully (LOW)
      v.literal("gamification_milestone"),     // points milestone (LOW)
      v.literal("system"),                     // system notification (LOW)
      v.literal("digest")                      // daily digest batch (LOW — N6)
    ),
    severity: v.union(
      v.literal("high"),                       // all 3 channels: in-app + push + telegram
      v.literal("medium"),                     // in-app + push
      v.literal("low")                         // in-app only
    ),

    // ── Channel delivery status
    channels: v.object({
      inApp: v.boolean(),                      // always true
      push: v.boolean(),                       // true for high + medium
      telegram: v.boolean(),                   // true for high only
    }),
    deliveredPush: v.optional(v.boolean()),     // push actually sent
    deliveredTelegram: v.optional(v.boolean()), // telegram actually sent

    // ── Read status
    isRead: v.boolean(),                       // has recipient seen it
    readAt: v.optional(v.number()),            // Unix ms

    // ── Source reference (what triggered the notification)
    sourceTable: v.optional(v.string()),        // e.g. "contentRequests", "reels", "shiftRecords"
    sourceId: v.optional(v.string()),           // _id of the source record

    // ── Metadata
    sentAt: v.number(),                        // Unix ms
    expiresAt: v.optional(v.number()),         // Unix ms — auto-dismiss after this time
  })
    .index("by_recipient", ["recipientId"])
    .index("by_recipient_model", ["recipientModelId"])
    .index("by_recipient_read", ["recipientId", "isRead"])
    .index("by_type", ["type"])
    .index("by_severity", ["severity"])
    .index("by_sent_at", ["sentAt"]),


  // ── Gamification Events (model points tracking) ──────────────────────
  // M45-M50. Every desired action = points. Feeds leaderboard (M47),
  // weekly targets (M46), and monthly rewards (M48).
  // One row per point-earning event. Aggregate queries compute totals.
  gamificationEvents: defineTable({
    // ── Who
    modelId: v.id("models"),                   // which model earned points

    // ── What
    action: v.union(
      v.literal("swipe_right"),                // saved content from Swipe Deck (M42)
      v.literal("swipe_discard"),              // swiped left (still engagement)
      v.literal("content_upload"),             // uploaded raw content for a request
      v.literal("submit_early"),               // submitted before deadline (M25)
      v.literal("submit_on_time"),             // submitted by deadline
      v.literal("daily_target_hit"),           // hit 10 suggestions/day (M37)
      v.literal("weekly_target_hit"),          // hit weekly target (M46)
      v.literal("stream_completed"),           // completed a webcam stream
      v.literal("streak_day"),                 // consecutive day streak (M11)
      v.literal("challenge_completed"),        // weekly themed challenge (M43)
      v.literal("go_live"),                    // went live on webcam
      v.literal("pre_stream_checklist"),       // completed pre-stream checklist (M8)
      v.literal("custom")                      // admin-awarded manual points
    ),
    points: v.number(),                        // points awarded (can be negative for penalties)
    multiplier: v.optional(v.number()),        // bonus multiplier (e.g. 1.5x for early submit)

    // ── Context
    description: v.optional(v.string()),       // human-readable description
    sourceTable: v.optional(v.string()),       // e.g. "contentRequests", "reels"
    sourceId: v.optional(v.string()),          // _id of triggering record

    // ── Challenge tracking (M43, M49)
    challengeId: v.optional(v.string()),       // if part of a weekly challenge
    challengeWeek: v.optional(v.string()),     // e.g. "2026-W15"

    // ── Metadata
    awardedBy: v.optional(v.string()),         // "system" or admin name
    createdAt: v.number(),                     // Unix ms
  })
    .index("by_model", ["modelId"])
    .index("by_model_action", ["modelId", "action"])
    .index("by_model_created", ["modelId", "createdAt"])
    .index("by_action", ["action"])
    .index("by_created", ["createdAt"])
    .index("by_challenge", ["challengeId"]),


  // ── Shift Records (clock in/out tracking) ────────────────────────────
  // A51-A56. Basic clock-in/out for now; payroll integration and pattern
  // detection (A56) to be expanded later. Links to teamMembers.
  shiftRecords: defineTable({
    // ── Who
    userId: v.id("teamMembers"),               // which team member

    // ── Schedule reference
    shiftScheduleId: v.optional(v.id("shiftSchedules")), // which scheduled shift this is for
    scheduledStart: v.optional(v.number()),     // Unix ms — expected start
    scheduledEnd: v.optional(v.number()),       // Unix ms — expected end

    // ── Actual times
    actualStart: v.optional(v.number()),       // Unix ms — clock-in time
    actualEnd: v.optional(v.number()),         // Unix ms — clock-out time

    // ── Status (A51)
    status: v.union(
      v.literal("scheduled"),                  // upcoming, not yet clocked in
      v.literal("clocked_in"),                 // currently on shift
      v.literal("on_time"),                    // clocked in on time, shift complete
      v.literal("late"),                       // clocked in late
      v.literal("early"),                      // clocked in early
      v.literal("absent"),                     // never clocked in
      v.literal("partial")                     // clocked in but left early
    ),

    // ── Lateness tracking (A52, A56)
    latenessMinutes: v.optional(v.number()),   // minutes late (0 if on time)
    deductionAmount: v.optional(v.number()),   // payroll deduction amount (A52)
    deductionCurrency: v.optional(v.string()), // e.g. "THB", "GBP"

    // ── Alerts (A53)
    seniorAlertSent: v.optional(v.boolean()),  // true if senior was notified of lateness

    // ── Notes
    notes: v.optional(v.string()),             // manual notes (e.g. "traffic jam")

    // ── Metadata
    date: v.string(),                          // YYYY-MM-DD for easy day grouping
    createdAt: v.number(),                     // Unix ms
  })
    .index("by_user", ["userId"])
    .index("by_date", ["date"])
    .index("by_user_date", ["userId", "date"])
    .index("by_status", ["status"])
    .index("by_created", ["createdAt"]),


  // ── Shift Schedules (who works when) ─────────────────────────────────
  // A57-A64. Basic schedule definition; drag-and-drop builder (A63) and
  // shift swap workflow (A64) to be expanded later.
  shiftSchedules: defineTable({
    // ── Who
    userId: v.id("teamMembers"),               // which team member

    // ── When
    date: v.string(),                          // YYYY-MM-DD
    startTime: v.string(),                     // HH:MM (24h format)
    endTime: v.string(),                       // HH:MM (24h format)

    // ── Type
    isDayOff: v.boolean(),                     // true = day off, ignore start/endTime
    shiftType: v.optional(v.union(
      v.literal("morning"),
      v.literal("afternoon"),
      v.literal("evening"),
      v.literal("night"),
      v.literal("split"),
      v.literal("custom")
    )),

    // ── Swap workflow stub (A64 — expand later)
    swapRequestedWith: v.optional(v.id("teamMembers")), // swap target
    swapStatus: v.optional(v.union(
      v.literal("none"),
      v.literal("pending"),                    // swap requested
      v.literal("accepted"),                   // coworker accepted
      v.literal("manager_approved"),           // manager approved swap
      v.literal("rejected")                    // swap denied
    )),

    // ── Cost tracking stub (A63 — expand later)
    estimatedCost: v.optional(v.number()),     // labor cost for this shift

    // ── Metadata
    createdBy: v.optional(v.string()),         // who created the schedule entry
    createdAt: v.number(),                     // Unix ms
    updatedAt: v.optional(v.number()),         // Unix ms
  })
    .index("by_user", ["userId"])
    .index("by_date", ["date"])
    .index("by_user_date", ["userId", "date"])
    .index("by_created", ["createdAt"]),
```

---

## Relationship Map

```
scrapedPosts ──────────┐
postAnalyses ──────────┤
                       ▼
                   rdEntries ──────► contentRequests ──────► reels ──────► reelVersions
                       │                    │                  │
                       │                    │                  ├──► approvals (existing)
                       │                    │                  └──► scheduledPosts
                       │                    │                           │
                       │                    ▼                           ▼
                       │              Google Drive                  Meta API
                       │                    │
                       │                    ▼
                       │            Raw Content Queue
                       │               (reels with
                       │            ptpStatus="editing")
                       │
                       └──────────► models (existing)

teamMembers ──────► shiftSchedules
     │                    │
     └──────────► shiftRecords
                       │
                       └──► notifications

models ──────► gamificationEvents
  │
  └──────► notifications
```

---

## Index Justification

| Table | Index | Query Pattern |
|-------|-------|---------------|
| rdEntries | `by_model_status` | "Show all approved ideas for Model X" |
| rdEntries | `search_rd` | Full-text search across idea descriptions with niche/status filters |
| contentRequests | `by_model_status` | "Show all sent briefs for Model X" |
| contentRequests | `by_deadline` | "Show overdue requests" (deadline < now, status != uploaded) |
| reels | `by_model_ptp` | "Show all reels awaiting PTP for Model X" |
| reels | `by_editor` | "Show my editing queue" |
| reelVersions | `by_reel_version` | "Get V2 of reel X" for side-by-side comparison |
| scheduledPosts | `by_model_platform` | "Show all scheduled IG posts for Model X" |
| scheduledPosts | `by_platform_status` | "How many Meta slots are in use for Instagram?" |
| notifications | `by_recipient_read` | "Show unread notifications for user X" |
| gamificationEvents | `by_model_created` | "Points earned by Model X this week" |
| shiftRecords | `by_user_date` | "Show shift for User X on 2026-04-12" |
| shiftSchedules | `by_user_date` | "Show schedule for User X on 2026-04-12" |

---

## Migration Notes

1. **No breaking changes** — all 9 tables are additive. Existing tables untouched.
2. **`approvals` linkage** — `reels.approvalId` links to existing `approvals` table. When a reel is submitted to PTP, create a row in `approvals` AND set `reels.approvalId`. This lets existing PTP UI code keep working.
3. **`schedule` vs `scheduledPosts`** — the existing `schedule` table is the content calendar view. `scheduledPosts` is the execution queue with Meta API slot tracking. They link via `scheduledPosts.scheduleId`.
4. **`ideas` vs `rdEntries`** — `ideas` is AI-generated briefs from the content gen pipeline. `rdEntries` is the human-curated R&D backlog. They serve different purposes and both remain.
5. **Timestamps** — all timestamps are Unix milliseconds (`v.number()`), matching existing convention.
6. **ID references** — all foreign keys use `v.id("tableName")`, matching existing convention.
7. **String-based IDs** — `sourceId` fields use `v.string()` (not `v.id()`) when the source table varies, matching the pattern used in `activity.targetId`.

---

## Part 2: Remaining Tables (11)

*Designed 2026-04-12. Covers all gaps identified in SCHEMA_COVERAGE_AUDIT.md. Same conventions as Part 1 — paste after the Part 1 tables, before the closing `});`.*

**Tables in this section:**
1. `financialRecords` (CRITICAL) — A5-A12, A68, I1
2. `webcamSessions` (CRITICAL) — A46-A50, M1-M3, M6, M9-M10, I5
3. `earningsRecords` (CRITICAL) — M26-M30
4. `swipeDeckItems` (CRITICAL) — M32-M34, M36, M38, M40-M41, P14
5. `streamKeys` (MEDIUM) — M7, I5-I6
6. `userPreferences` (MEDIUM) — A69-A71, N1-N6
7. `challenges` (MEDIUM) — M43, M49
8. `approvalDelegations` (MEDIUM) — A43
9. `rewards` (LOW) — M48
10. `capCutTemplates` (LOW) — E10
11. `trendFeedItems` (LOW) — E11, I9

---

### Schema Code

```typescript
  // ═══════════════════════════════════════════════════════════════════════
  // REMAINING TABLES (11 new tables — Part 2)
  // ═══════════════════════════════════════════════════════════════════════


  // ── Financial Records (Google Sheets mirror — P&L / Revenue / ROI) ──
  // Pages: Revenue & ROI Analytics (A5-A12), Billings (A68), Integration
  // (I1). Initially synced from Google Sheets, later migrated to native
  // Convex. Each row = one line item (revenue, cost, payroll, etc.).
  // Department and staff breakdowns enable drill-down views (A6, A7).
  financialRecords: defineTable({
    // ── Classification
    category: v.union(
      v.literal("revenue"),                    // model earnings, subscriptions
      v.literal("payroll"),                    // staff wages
      v.literal("cost"),                       // operational costs (rent, software)
      v.literal("subscription"),               // SaaS/tool costs
      v.literal("model_cut")                   // model's share of earnings
    ),
    subcategory: v.optional(v.string()),       // freeform: "editing_software", "studio_rent", etc.

    // ── Attribution
    department: v.optional(v.string()),        // e.g. "editing", "marketing", "management", "webcam"
    staffUserId: v.optional(v.id("teamMembers")), // drill to individual staff cost (A7)
    modelId: v.optional(v.id("models")),       // drill to individual model revenue (A12)

    // ── Financials
    amount: v.number(),                        // in base currency units (e.g. cents or satangs)
    currency: v.string(),                      // ISO 4217: "THB", "GBP", "USD"
    period: v.string(),                        // YYYY-MM for monthly, YYYY-WW for weekly
    date: v.optional(v.string()),              // YYYY-MM-DD for daily granularity (billing line items)

    // ── Projection (A12 — actual vs projected)
    isProjected: v.optional(v.boolean()),      // true = forecast, false/null = actual
    projectedAmount: v.optional(v.number()),   // forecast value for comparison

    // ── Source tracking (A10 — Google Sheets migration)
    source: v.union(
      v.literal("sheets_sync"),                // imported from Google Sheets
      v.literal("manual"),                     // CEO manual data entry (A9)
      v.literal("api_sync"),                   // auto-synced from platform API
      v.literal("computed")                    // derived/aggregated by system
    ),
    sheetsRowRef: v.optional(v.string()),      // Google Sheets row reference for traceability
    description: v.optional(v.string()),       // human-readable note

    // ── Sync metadata
    syncedAt: v.optional(v.number()),          // Unix ms — when last synced from external source
    syncBatchId: v.optional(v.string()),       // group imports in same batch for rollback

    // ── Metadata
    createdBy: v.optional(v.string()),         // "system", "sheets_sync", or team member name
    createdAt: v.number(),                     // Unix ms
    updatedAt: v.optional(v.number()),         // Unix ms
  })
    .index("by_category", ["category"])
    .index("by_period", ["period"])
    .index("by_category_period", ["category", "period"])
    .index("by_department", ["department"])
    .index("by_department_period", ["department", "period"])
    .index("by_staff", ["staffUserId"])
    .index("by_model", ["modelId"])
    .index("by_model_period", ["modelId", "period"])
    .index("by_source", ["source"])
    .index("by_created", ["createdAt"]),


  // ── Webcam Sessions (streaming across 17 platforms) ─────────────────
  // Pages: Webcam Stats owner view (A46-A50), Model Webcam (M1-M3, M6,
  // M9-M10), Integration (I5). One row per streaming session. Platform
  // is a free string to accommodate all 17 platforms without a rigid enum.
  // Links to streamKeys for OBS integration and shiftSchedules for shift
  // correlation.
  webcamSessions: defineTable({
    // ── Identity
    modelId: v.id("models"),                   // which model streamed

    // ── Platform
    platform: v.string(),                      // free string: "chaturbate", "stripchat", "bongacams", etc.
    accountHandle: v.optional(v.string()),      // model's handle on this platform
    streamKeyId: v.optional(v.id("streamKeys")), // which stream key was used

    // ── Timing
    startedAt: v.number(),                     // Unix ms — session start
    endedAt: v.optional(v.number()),           // Unix ms — session end (null if live)
    durationSeconds: v.optional(v.number()),   // computed on session end
    scheduledStartAt: v.optional(v.number()),  // Unix ms — when the session was planned (A47)

    // ── Live status (A50 — live view)
    isLive: v.boolean(),                       // true = currently streaming
    streamUrl: v.optional(v.string()),         // embed/watch URL for live view (A50)

    // ── Viewer metrics
    viewerCount: v.optional(v.number()),       // current/final viewers
    peakViewers: v.optional(v.number()),       // peak concurrent viewers
    avgViewers: v.optional(v.number()),        // average over session

    // ── Earnings
    earnings: v.optional(v.number()),          // total earnings for this session
    earningsCurrency: v.optional(v.string()),  // ISO 4217
    tipsCount: v.optional(v.number()),         // number of tip transactions
    topTipAmount: v.optional(v.number()),      // largest single tip

    // ── Post-stream summary (M6, M10)
    postStreamSummaryUrl: v.optional(v.string()),  // shareable screenshot card URL (M10)
    postStreamSentAt: v.optional(v.number()),      // Unix ms — when summary sent to manager (M6)
    postStreamSentTo: v.optional(v.string()),      // manager name who received summary

    // ── Pre-stream checklist (M8)
    preStreamChecklistCompleted: v.optional(v.boolean()), // true if checklist done before going live
    preStreamChecklistItems: v.optional(v.array(v.object({
      label: v.string(),                       // e.g. "Lighting check", "Audio test"
      completed: v.boolean(),
    }))),

    // ── Shift correlation
    shiftScheduleId: v.optional(v.id("shiftSchedules")), // link to scheduled shift

    // ── Notes
    notes: v.optional(v.string()),             // model or manager notes

    // ── Metadata
    createdAt: v.number(),                     // Unix ms
  })
    .index("by_model", ["modelId"])
    .index("by_model_platform", ["modelId", "platform"])
    .index("by_platform", ["platform"])
    .index("by_started", ["startedAt"])
    .index("by_model_started", ["modelId", "startedAt"])
    .index("by_is_live", ["isLive"])
    .index("by_created", ["createdAt"]),


  // ── Earnings Records (OF/Fans.ly model earnings) ────────────────────
  // Pages: Model Earnings (M26-M30). Per-platform, per-content-type
  // earnings records. Separate from financialRecords because these are
  // model-facing (model sees her own earnings) while financialRecords
  // are agency-facing (owner sees P&L).
  earningsRecords: defineTable({
    // ── Identity
    modelId: v.id("models"),                   // which model

    // ── Platform & type
    platform: v.union(
      v.literal("onlyfans"),
      v.literal("fansly"),
      v.literal("webcam"),
      v.literal("instagram"),
      v.literal("tiktok"),
      v.literal("other")
    ),
    contentType: v.optional(v.string()),       // freeform: "tips", "ppv", "subscription", "GFE", "custom"
    earningType: v.union(
      v.literal("subscription"),               // recurring subscriber revenue
      v.literal("tips"),                       // one-off tips
      v.literal("ppv"),                        // pay-per-view content
      v.literal("custom_content"),             // custom/commissioned content
      v.literal("referral"),                   // referral bonuses
      v.literal("stream"),                     // webcam stream earnings
      v.literal("other")
    ),

    // ── Financials
    grossAmount: v.number(),                   // gross earnings before agency cut
    netAmount: v.optional(v.number()),         // net after platform fees + agency cut
    currency: v.string(),                      // ISO 4217
    period: v.string(),                        // YYYY-MM-DD for daily, YYYY-WW for weekly, YYYY-MM for monthly

    // ── Goal tracking (M29)
    goalAmount: v.optional(v.number()),        // target for this period
    goalCurrency: v.optional(v.string()),      // ISO 4217

    // ── Payment tracking (M30 — payday countdown)
    paymentDate: v.optional(v.string()),       // YYYY-MM-DD — expected payout date
    paymentStatus: v.optional(v.union(
      v.literal("pending"),                    // not yet paid
      v.literal("processing"),                 // payout initiated
      v.literal("paid"),                       // received
      v.literal("failed")                      // payout failed
    )),

    // ── Source
    source: v.union(
      v.literal("api_sync"),                   // auto from platform API
      v.literal("manual"),                     // model or admin entered
      v.literal("sheets_sync")                 // imported from Google Sheets
    ),
    description: v.optional(v.string()),       // notes

    // ── Metadata
    recordedAt: v.number(),                    // Unix ms — when data was recorded/synced
    createdAt: v.number(),                     // Unix ms
  })
    .index("by_model", ["modelId"])
    .index("by_model_platform", ["modelId", "platform"])
    .index("by_model_period", ["modelId", "period"])
    .index("by_platform", ["platform"])
    .index("by_period", ["period"])
    .index("by_earning_type", ["earningType"])
    .index("by_payment_status", ["paymentStatus"])
    .index("by_created", ["createdAt"]),


  // ── Swipe Deck Items (model's daily content swipe queue) ────────────
  // Pages: Swipe Deck (M31-M44), Pipeline shortcut (P14). Each row is
  // one content suggestion surfaced to a model. The model swipes right
  // (save), up (make now), or left (discard). 10/day minimum target
  // (M36). Feeds gamification points (M42) and content requests (M33).
  swipeDeckItems: defineTable({
    // ── Identity
    modelId: v.id("models"),                   // which model sees this item

    // ── Source content
    sourceType: v.union(
      v.literal("scraped_post"),               // from scrapedPosts (competitor/own content)
      v.literal("rd_entry"),                   // from rdEntries (curated ideas)
      v.literal("ai_suggestion"),              // AI-generated suggestion from Ideas Lab
      v.literal("content_gen")                 // from contentGenJobs output
    ),
    sourceId: v.string(),                      // _id of source record (varies by sourceType)
    contentUrl: v.optional(v.string()),        // media URL to display
    thumbnailUrl: v.optional(v.string()),      // thumbnail for card display
    title: v.optional(v.string()),             // short title/hook
    description: v.optional(v.string()),       // description text

    // ── Content classification
    niche: v.string(),                         // e.g. "GFE", "Fitness", "Meme"
    theme: v.optional(v.string()),             // e.g. "Songkran", "Summer"

    // ── Swipe action
    action: v.union(
      v.literal("pending"),                    // not yet swiped
      v.literal("saved"),                      // swiped right — added to "content to make" list (M32)
      v.literal("make_now"),                   // swiped up — opens camera, auto-creates contentRequest (M33)
      v.literal("discarded")                   // swiped left — trains algorithm (M34)
    ),
    swipedAt: v.optional(v.number()),          // Unix ms — when action was taken

    // ── Daily drop tracking (M40)
    droppedDate: v.string(),                   // YYYY-MM-DD — which daily drop this belongs to
    dropPosition: v.optional(v.number()),      // 1-10+ position within the day's drop

    // ── Trend signals (M39)
    isTrending: v.optional(v.boolean()),       // "trending in your niche" badge
    trendScore: v.optional(v.number()),        // 0-100 trend relevance score

    // ── Conversion tracking
    contentRequestId: v.optional(v.id("contentRequests")), // set when make_now creates a request
    gamificationEventId: v.optional(v.string()), // points event ID from swiping

    // ── Metadata
    createdAt: v.number(),                     // Unix ms
  })
    .index("by_model", ["modelId"])
    .index("by_model_action", ["modelId", "action"])
    .index("by_model_date", ["modelId", "droppedDate"])
    .index("by_action", ["action"])
    .index("by_dropped_date", ["droppedDate"])
    .index("by_niche", ["niche"])
    .index("by_created", ["createdAt"]),


  // ── Stream Keys (per-model per-platform OBS keys) ───────────────────
  // Pages: Stream Key Management (M7), OBS Integration (I5, I6).
  // One row per platform per model. Key values should be encrypted at
  // the application layer before storage. The `isActive` flag allows
  // deactivating old keys without deletion.
  streamKeys: defineTable({
    // ── Identity
    modelId: v.id("models"),                   // which model owns this key
    platform: v.string(),                      // e.g. "chaturbate", "stripchat", "bongacams"

    // ── Key data
    keyEncrypted: v.string(),                  // AES-encrypted stream key (NOT plaintext)
    keyHint: v.optional(v.string()),           // last 4 chars for display: "...a3f2"
    serverUrl: v.optional(v.string()),         // RTMP server URL for this platform

    // ── Status
    isActive: v.boolean(),                     // true = current key, false = rotated/revoked
    label: v.optional(v.string()),             // user label: "Primary", "Backup", etc.

    // ── Usage tracking
    lastUsedAt: v.optional(v.number()),        // Unix ms — last time key was used to stream
    lastVerifiedAt: v.optional(v.number()),    // Unix ms — last connectivity check

    // ── Metadata
    createdBy: v.optional(v.string()),         // who added this key
    createdAt: v.number(),                     // Unix ms
    updatedAt: v.optional(v.number()),         // Unix ms — last modified
  })
    .index("by_model", ["modelId"])
    .index("by_model_platform", ["modelId", "platform"])
    .index("by_active", ["isActive"])
    .index("by_created", ["createdAt"]),


  // ── User Preferences (per-user settings) ────────────────────────────
  // Pages: Settings (A69-A71), Notifications (N1-N6). Separate from the
  // workspace-level `settings` table. One row per user (teamMember or
  // model). Stores language, timezone, and notification channel prefs.
  userPreferences: defineTable({
    // ── Identity — one of these will be set, not both
    userId: v.optional(v.id("teamMembers")),   // for staff users
    modelId: v.optional(v.id("models")),       // for model users

    // ── Display preferences
    language: v.string(),                      // ISO 639-1: "en", "th", "ja"
    timezone: v.string(),                      // IANA: "Asia/Bangkok", "Europe/London"
    dateFormat: v.optional(v.string()),        // "DD/MM/YYYY", "MM/DD/YYYY", etc.
    theme: v.optional(v.union(
      v.literal("light"),
      v.literal("dark"),
      v.literal("system")
    )),

    // ── Notification preferences (N1-N6)
    notificationPrefs: v.object({
      inAppEnabled: v.boolean(),               // always true (baseline channel)
      pushEnabled: v.boolean(),                // push notifications on/off
      telegramEnabled: v.boolean(),            // Telegram bot on/off
      telegramChatId: v.optional(v.string()),  // Telegram chat ID for delivery
      digestMode: v.boolean(),                 // true = batch low-severity into daily digest (N6)
      digestTime: v.optional(v.string()),      // HH:MM — when to send daily digest
      quietHoursStart: v.optional(v.string()), // HH:MM — do not disturb start
      quietHoursEnd: v.optional(v.string()),   // HH:MM — do not disturb end
    }),

    // ── Dashboard preferences
    defaultView: v.optional(v.string()),       // last-used dashboard view for quick resume
    sidebarCollapsed: v.optional(v.boolean()), // remember sidebar state

    // ── Metadata
    createdAt: v.number(),                     // Unix ms
    updatedAt: v.number(),                     // Unix ms
  })
    .index("by_user", ["userId"])
    .index("by_model", ["modelId"])
    .index("by_created", ["createdAt"]),


  // ── Challenges (weekly themed challenge definitions) ─────────────────
  // Pages: Challenge Mode (M43, M49). Defines the challenge; individual
  // participation is tracked via gamificationEvents.challengeId. One row
  // per weekly challenge. Models earn bonus points for completing the
  // challenge target.
  challenges: defineTable({
    // ── Content
    title: v.string(),                         // e.g. "Beach Week", "GFE Marathon"
    description: v.string(),                   // full challenge description + rules
    theme: v.optional(v.string()),             // thematic tag: "summer", "holiday", etc.

    // ── Timing
    week: v.string(),                          // YYYY-WW — which week this challenge runs
    startsAt: v.number(),                      // Unix ms — challenge start
    endsAt: v.number(),                        // Unix ms — challenge deadline

    // ── Target
    targetAction: v.union(
      v.literal("swipe_right"),
      v.literal("content_upload"),
      v.literal("submit_early"),
      v.literal("stream_completed"),
      v.literal("daily_target_hit"),
      v.literal("go_live"),
      v.literal("custom")
    ),
    targetCount: v.number(),                   // how many actions to complete the challenge
    customTargetDescription: v.optional(v.string()), // if targetAction="custom", describe the goal

    // ── Rewards
    bonusPoints: v.number(),                   // extra points awarded on completion
    rewardDescription: v.optional(v.string()), // e.g. "Ring light for top performer"
    rewardId: v.optional(v.id("rewards")),     // link to rewards table if a physical prize

    // ── Status
    isActive: v.boolean(),                     // true = currently running
    participantCount: v.optional(v.number()),  // denormalised count for display
    completedCount: v.optional(v.number()),    // how many models completed it

    // ── Metadata
    createdBy: v.optional(v.string()),         // admin who created the challenge
    createdAt: v.number(),                     // Unix ms
  })
    .index("by_week", ["week"])
    .index("by_active", ["isActive"])
    .index("by_starts", ["startsAt"])
    .index("by_created", ["createdAt"]),


  // ── Approval Delegations (owner delegates PTP to managers per model) ─
  // Page: Approval Delegation (A43). Allows the owner to grant approval
  // rights to specific managers for specific models. More granular than
  // the global `teamMembers.permissions.approve` boolean.
  approvalDelegations: defineTable({
    // ── Who delegates
    delegatorId: v.id("teamMembers"),          // owner/partner who grants authority

    // ── Who receives authority
    delegateId: v.id("teamMembers"),           // manager who can now approve

    // ── Scope
    modelId: v.optional(v.id("models")),       // null = all models, set = only this model
    contentTypes: v.optional(v.array(v.union(  // null = all types
      v.literal("reel"),
      v.literal("post"),
      v.literal("story"),
      v.literal("carousel")
    ))),

    // ── Validity
    isActive: v.boolean(),                     // soft-delete / revoke without deleting
    expiresAt: v.optional(v.number()),         // Unix ms — auto-expire delegation
    reason: v.optional(v.string()),            // why delegated: "Alex on holiday"

    // ── Metadata
    createdAt: v.number(),                     // Unix ms
    revokedAt: v.optional(v.number()),         // Unix ms — when revoked (if isActive=false)
  })
    .index("by_delegator", ["delegatorId"])
    .index("by_delegate", ["delegateId"])
    .index("by_delegate_model", ["delegateId", "modelId"])
    .index("by_active", ["isActive"])
    .index("by_created", ["createdAt"]),


  // ── Rewards (monthly gamification reward catalog) ───────────────────
  // Page: Monthly Rewards (M48). Admin defines available prizes per month.
  // Models redeem using accumulated points. Links to gamificationEvents
  // for point verification.
  rewards: defineTable({
    // ── Prize definition
    title: v.string(),                         // e.g. "Nail treatment", "Ring light", "Mystery gift"
    description: v.optional(v.string()),       // full description of the reward
    imageUrl: v.optional(v.string()),          // reward image for display

    // ── Requirements
    pointsRequired: v.number(),               // minimum points to claim
    tier: v.optional(v.union(
      v.literal("bronze"),                     // lowest tier
      v.literal("silver"),
      v.literal("gold"),
      v.literal("platinum")                    // highest tier
    )),

    // ── Availability
    month: v.string(),                         // YYYY-MM — which month's catalog
    maxRedemptions: v.optional(v.number()),    // limit how many models can claim (null = unlimited)
    currentRedemptions: v.optional(v.number()), // denormalised count

    // ── Status
    status: v.union(
      v.literal("available"),                  // can be claimed
      v.literal("claimed"),                    // all units claimed
      v.literal("expired"),                    // month passed, no longer available
      v.literal("draft")                       // not yet published
    ),

    // ── Winner tracking
    winnerId: v.optional(v.id("models")),      // model who won/claimed (if single-winner)
    winnerName: v.optional(v.string()),        // denormalised for display
    awardedAt: v.optional(v.number()),         // Unix ms — when awarded
    redeemedAt: v.optional(v.number()),        // Unix ms — when physically redeemed
    redemptionNotes: v.optional(v.string()),   // delivery/fulfillment notes

    // ── Metadata
    createdBy: v.optional(v.string()),         // admin who created the reward
    createdAt: v.number(),                     // Unix ms
  })
    .index("by_month", ["month"])
    .index("by_status", ["status"])
    .index("by_tier", ["tier"])
    .index("by_month_status", ["month", "status"])
    .index("by_winner", ["winnerId"])
    .index("by_created", ["createdAt"]),


  // ── CapCut Templates (template library by niche) ────────────────────
  // Page: CapCut Template Library (E10). Organized by niche so editors
  // can quickly find the right template. Tags enable search/filter.
  capCutTemplates: defineTable({
    // ── Content
    name: v.string(),                          // template display name
    description: v.optional(v.string()),       // what the template is good for

    // ── Classification
    niche: v.string(),                         // e.g. "GFE", "Fitness", "Meme", "General"
    category: v.optional(v.string()),          // e.g. "hook_reel", "tutorial", "transition"
    tags: v.optional(v.array(v.string())),     // freeform tags for search: ["trending", "summer"]

    // ── Media
    templateUrl: v.string(),                   // CapCut share link or R2 download URL
    previewUrl: v.optional(v.string()),        // preview video/image URL
    previewThumbnailUrl: v.optional(v.string()), // static thumbnail

    // ── Usage tracking
    usageCount: v.optional(v.number()),        // how many times editors have used it
    lastUsedAt: v.optional(v.number()),        // Unix ms
    rating: v.optional(v.number()),            // 1-5 editor rating

    // ── Status
    isActive: v.boolean(),                     // false = archived/hidden

    // ── Metadata
    addedBy: v.optional(v.string()),           // who added the template
    createdAt: v.number(),                     // Unix ms
    updatedAt: v.optional(v.number()),         // Unix ms
  })
    .index("by_niche", ["niche"])
    .index("by_category", ["category"])
    .index("by_active", ["isActive"])
    .index("by_usage", ["usageCount"])
    .index("by_created", ["createdAt"])
    .searchIndex("search_templates", {
      searchField: "name",
      filterFields: ["niche", "category"],
    }),


  // ── Trend Feed Items (cached external trend intelligence) ───────────
  // Pages: Trend Intelligence Feed (E11), TikTok Creative Center (I9).
  // Ephemeral cached data from external trend sources. Rows expire and
  // get refreshed on a schedule. Editors browse trends for inspiration.
  trendFeedItems: defineTable({
    // ── Source
    platform: v.union(
      v.literal("tiktok"),                     // TikTok Creative Center (I9)
      v.literal("instagram"),                  // Instagram trending
      v.literal("youtube"),                    // YouTube trending
      v.literal("twitter")                     // Twitter/X trending
    ),

    // ── Trend data
    type: v.union(
      v.literal("hashtag"),                    // trending hashtag
      v.literal("sound"),                      // trending audio/sound
      v.literal("format"),                     // trending video format
      v.literal("topic"),                      // trending topic/theme
      v.literal("effect")                      // trending filter/effect
    ),
    label: v.string(),                         // display text: "#summerbody", "Trending sound: XYZ"
    description: v.optional(v.string()),       // fuller context about the trend

    // ── Relevance
    niche: v.optional(v.string()),             // which niche this is relevant to (null = general)
    trendScore: v.optional(v.number()),        // 0-100 relevance/virality score
    viewCount: v.optional(v.number()),         // total views on trending content
    growthRate: v.optional(v.number()),        // % growth in last 24h/7d
    region: v.optional(v.string()),            // geographic relevance: "TH", "US", "global"

    // ── Media
    previewUrl: v.optional(v.string()),        // preview clip/image URL
    externalUrl: v.optional(v.string()),       // link to trend on source platform

    // ── Lifecycle
    fetchedAt: v.number(),                     // Unix ms — when data was fetched
    expiresAt: v.number(),                     // Unix ms — when to consider stale/remove
    isActive: v.boolean(),                     // false = expired/superseded

    // ── Metadata
    fetchBatchId: v.optional(v.string()),      // group fetches for bulk refresh
    createdAt: v.number(),                     // Unix ms
  })
    .index("by_platform", ["platform"])
    .index("by_platform_type", ["platform", "type"])
    .index("by_niche", ["niche"])
    .index("by_trend_score", ["trendScore"])
    .index("by_active", ["isActive"])
    .index("by_fetched", ["fetchedAt"])
    .index("by_expires", ["expiresAt"])
    .index("by_created", ["createdAt"]),
```

---

## Part 2: Relationship Map (additions to Part 1 map)

```
models ──────────────────► financialRecords
  │                              │
  │                              ├── by department ──► teamMembers
  │                              └── by staff ──────► teamMembers
  │
  ├──────► webcamSessions ──────► streamKeys
  │             │
  │             └──────────────► shiftSchedules (existing)
  │
  ├──────► earningsRecords
  │
  ├──────► swipeDeckItems ──────► scrapedPosts / rdEntries / contentRequests
  │
  └──────► rewards (winner)

teamMembers ──► userPreferences
models ─────► userPreferences

teamMembers ──► approvalDelegations (delegator + delegate)
                     │
                     └──► models (scope)

gamificationEvents.challengeId ──► challenges
challenges.rewardId ──────────────► rewards

editors ──► capCutTemplates (browse)
external APIs ──► trendFeedItems (cached feed)
```

---

## Part 2: Index Justification

| Table | Index | Query Pattern |
|-------|-------|---------------|
| financialRecords | `by_category_period` | "Show all revenue for 2026-03" (P&L view) |
| financialRecords | `by_department_period` | "Marketing costs in April" (department drill-down A6) |
| financialRecords | `by_model_period` | "Model X earnings for Q1" (model earnings projection A12) |
| webcamSessions | `by_model_started` | "All streams for Model X this week" |
| webcamSessions | `by_is_live` | "Who's currently live?" (A50 live view) |
| earningsRecords | `by_model_period` | "Model X earnings for March" (M26 combined view) |
| earningsRecords | `by_payment_status` | "Show pending payouts" (M30 payday countdown) |
| swipeDeckItems | `by_model_action` | "Show Model X's saved items" (M41 saved list) |
| swipeDeckItems | `by_model_date` | "Today's daily drop for Model X" (M40) |
| streamKeys | `by_model_platform` | "Get Chaturbate key for Model X" (M7) |
| userPreferences | `by_user` | "Load preferences for current team member" |
| userPreferences | `by_model` | "Load preferences for current model" |
| challenges | `by_week` | "Show this week's challenge" |
| challenges | `by_active` | "List all active challenges" |
| approvalDelegations | `by_delegate_model` | "Can Manager X approve Model Y?" |
| rewards | `by_month_status` | "Available rewards for April 2026" |
| capCutTemplates | `search_templates` | "Search templates by name, filtered by niche" |
| trendFeedItems | `by_platform_type` | "Show TikTok trending hashtags" |
| trendFeedItems | `by_active` | "Show only current (non-expired) trends" |

---

## Part 3: Field Additions to Existing Tables

*These are fields that need adding to already-designed tables (existing 28 + new 9 from Part 1). Listed as ready-to-add field definitions with the exact Convex validator syntax.*

---

### 3A. `trackedAccounts` — existing table (table #9)

**Blocks:** A17 (Twitter platform tab), A18 (filter by model)

```typescript
// ADD to trackedAccounts defineTable({...}):

// 1. Expand platform enum to include twitter (A17)
//    CHANGE FROM:
//      platform: v.union(v.literal("instagram"), v.literal("tiktok")),
//    CHANGE TO:
//      platform: v.union(v.literal("instagram"), v.literal("tiktok"), v.literal("twitter")),

// 2. Add modelId foreign key to link own accounts to model records (A18)
    modelId: v.optional(v.id("models")),       // links own accounts (isOwn=true) to model

// 3. Add index for model drill-down
//    ADD: .index("by_model", ["modelId"])
```

---

### 3B. `teamMembers` — existing table (table #7)

**Blocks:** R1 (7 role types), R3 (multiple roles per user), R5 (owner-only assignment), R6 (Developer role)

```typescript
// ADD/CHANGE in teamMembers defineTable({...}):

// 1. Add roles array for multiple role support (R3)
//    Keep existing `role` field for backward compat during migration.
    roles: v.optional(v.array(v.union(
      v.literal("Owner"),
      v.literal("Partner"),
      v.literal("MarketingManager"),
      v.literal("Editor"),
      v.literal("VA"),
      v.literal("Model"),
      v.literal("Chatter"),
      v.literal("Developer")
    ))),

// 2. Expand the single `role` enum (R1, R6) — for backward compat keep as-is
//    and add new roles to the `roles` array above. Eventually migrate.
//    CHANGE FROM:
//      role: v.union(v.literal("Admin"), v.literal("VA"), v.literal("Editor")),
//    CHANGE TO:
//      role: v.union(
//        v.literal("Admin"),
//        v.literal("VA"),
//        v.literal("Editor"),
//        v.literal("Owner"),
//        v.literal("Partner"),
//        v.literal("MarketingManager"),
//        v.literal("Model"),
//        v.literal("Chatter"),
//        v.literal("Developer")
//      ),

// 3. Add role-assignment permission (R5)
//    ADD to permissions object:
    //  canAssignRoles: v.optional(v.boolean()),   // only Owner can set this true
```

---

### 3C. `scheduledPosts` — new table from Part 1 (table #33)

**Blocks:** P16 (recurring post duplicate detection)

```typescript
// ADD to scheduledPosts defineTable({...}):

    // Duplicate detection (P16)
    contentHash: v.optional(v.string()),       // SHA-256 or fuzzy hash for duplicate detection

// ADD index:
//    .index("by_content_hash", ["contentHash"])
```

---

### 3D. `contentRequests` — new table from Part 1 (table #30)

**Blocks:** E3 (editor queue needs niche filter)

```typescript
// ADD to contentRequests defineTable({...}):

    // Niche denormalisation (E3 — editor queue filter)
    niche: v.optional(v.string()),             // denormalized from rdEntries.niche for fast filtering

// ADD index:
//    .index("by_niche", ["niche"])
```

---

### 3E. `shiftSchedules` — new table from Part 1 (table #37)

**Blocks:** A57 (recurring weekly shifts)

```typescript
// ADD to shiftSchedules defineTable({...}):

    // Recurrence support (A57 — template-based weekly scheduling)
    recurrenceRule: v.optional(v.string()),     // iCal RRULE format: "FREQ=WEEKLY;BYDAY=MO,WE,FR"
    isRecurrenceInstance: v.optional(v.boolean()), // true = auto-generated from a recurrence rule
    recurrenceParentId: v.optional(v.id("shiftSchedules")), // link to the template shift
```

---

### 3F. `rdEntries` — new table from Part 1 (table #29)

**Blocks:** E10 (link ideas to CapCut templates)

```typescript
// ADD to rdEntries defineTable({...}):

    // CapCut template linkage (E10)
    capCutTemplateId: v.optional(v.id("capCutTemplates")), // reference to suggested CapCut template
```

---

### 3G. `notifications` — new table from Part 1 (table #34)

**Blocks:** M50 (AI-driven send time optimization)

```typescript
// ADD to notifications defineTable({...}):

    // Send-time optimization (M50)
    sendTimeOptimizationScore: v.optional(v.number()), // 0-1 confidence from ML model
    optimalSendAt: v.optional(v.number()),     // Unix ms — AI-recommended send time
```

---

### 3H. `shiftRecords` — new table from Part 1 (table #36)

**Blocks:** A54 (shift analytics accuracy)

```typescript
// ADD to shiftRecords defineTable({...}):

    // Break tracking (A54 — payroll accuracy)
    breakMinutes: v.optional(v.number()),      // total break time during shift
    breakCount: v.optional(v.number()),        // number of breaks taken
```

---

### 3I. `gamificationEvents` — new table from Part 1 (table #35)

**Blocks:** M46 (weekly target definitions)

```typescript
// NOTE: gamificationEvents itself does not need a new field.
// Weekly target configuration should live in a settings-like document.
// Option 1: Add a `gamificationConfig` key to the existing `settings` table.
// Option 2: Use the `challenges` table (Part 2) with targetAction="custom"
//           and targetCount set to weekly minimums (10 reels, 3/day submissions).
//
// Recommendation: Use `challenges` table for weekly targets.
// Create a recurring "Weekly Minimum" challenge each week with:
//   { title: "Weekly Content Target", targetAction: "content_upload",
//     targetCount: 10, bonusPoints: 50, week: "2026-W15" }
// This avoids schema changes and keeps target history queryable.
```

---

---

## Part 4: Coverage Gap Tables

*Designed 2026-04-12. Covers 6 of the 7 features with no table (A32, A33, E15, P3, I8, I10). A34 IG grid preview is client-side only; E12-14 federated search and E33 semantic search require external services — no table needed. Paste after the Part 2 tables, before the closing `});`.*

**Tables in this section:**
1. `hashtagGroups` — saved hashtag group templates (A32)
2. `importJobs` — CSV import tracking (A33)
3. `rdEntryRelationships` — graph view edges (P3)
4. `aiSuggestionSessions` — AI chatbot history (E15)
5. `socialPostJobs` — Ayrshare multi-platform posting (I8)
6. `opusClipJobs` — Opus Clip integration (I10)

---

### Schema Code

```typescript
  // ═══════════════════════════════════════════════════════════════════════
  // COVERAGE GAP TABLES (6 new tables — Part 4)
  // ═══════════════════════════════════════════════════════════════════════


  // ── Hashtag Groups (saved hashtag set templates) ─────────────────────
  // Page: Content Scheduler hashtag panel (A32). Models/editors save
  // frequently-used hashtag combos as named groups. Applied to scheduled
  // posts with one click. Niche-scoped so irrelevant groups don't surface.
  hashtagGroups: defineTable({
    // ── Identity
    name: v.string(),                           // e.g. "GFE Summer Set", "Fitness Core"

    // ── Content
    hashtags: v.array(v.string()),              // array of hashtag strings (without #)

    // ── Classification
    niche: v.optional(v.string()),              // e.g. "GFE", "Fitness", "General"

    // ── Usage tracking
    usageCount: v.optional(v.number()),         // how many times applied to a post

    // ── Metadata
    createdBy: v.optional(v.string()),          // team member name or "system"
    createdAt: v.number(),                      // Unix ms
  })
    .index("by_niche", ["niche"])
    .index("by_usage", ["usageCount"])
    .index("by_created", ["createdAt"]),


  // ── Import Jobs (CSV import tracking) ────────────────────────────────
  // Page: Bulk import flows (A33). One row per CSV import run. Tracks
  // row-level success/failure so the user can see what imported and what
  // failed. errorLog is a JSON-serialised array of {row, reason} objects.
  importJobs: defineTable({
    // ── File info
    fileName: v.string(),                       // original uploaded filename

    // ── Row counts
    rowCount: v.number(),                       // total rows in CSV
    successCount: v.optional(v.number()),       // rows successfully imported
    errorCount: v.optional(v.number()),         // rows that failed

    // ── Status
    status: v.union(
      v.literal("pending"),                     // queued, not yet started
      v.literal("processing"),                  // actively importing
      v.literal("completed"),                   // all rows processed (some may have errored)
      v.literal("failed")                       // catastrophic failure — no rows imported
    ),

    // ── Error details
    errorLog: v.optional(v.string()),           // JSON array of {row, reason} error objects

    // ── Metadata
    importedBy: v.optional(v.string()),         // team member who triggered the import
    createdAt: v.number(),                      // Unix ms
  })
    .index("by_status", ["status"])
    .index("by_created", ["createdAt"]),


  // ── R&D Entry Relationships (graph view edges) ───────────────────────
  // Page: R&D Graph View (P3). Directed edges between rdEntries for the
  // knowledge graph visualisation. relationshipType describes how the
  // target is related to the source. strength is 0-1 for edge weight.
  rdEntryRelationships: defineTable({
    // ── Edge endpoints
    sourceEntryId: v.id("rdEntries"),           // origin node
    targetEntryId: v.id("rdEntries"),           // destination node

    // ── Edge type
    relationshipType: v.union(
      v.literal("similar"),                     // thematically similar content
      v.literal("sequel"),                      // target is a follow-up to source
      v.literal("variant")                      // target is a variation of source
    ),

    // ── Edge weight
    strength: v.optional(v.number()),           // 0.0-1.0, used for graph edge thickness

    // ── Metadata
    createdBy: v.optional(v.string()),          // team member name or "system"
    createdAt: v.number(),                      // Unix ms
  })
    .index("by_source", ["sourceEntryId"])
    .index("by_target", ["targetEntryId"])
    .index("by_type", ["relationshipType"])
    .index("by_created", ["createdAt"]),


  // ── AI Suggestion Sessions (AI chatbot conversation history) ─────────
  // Page: Ideas Lab AI chatbot (E15). One row per chat session. messages
  // is stored as a JSON-serialised array of {role, content, ts} objects
  // (same shape as toolAnalyses.chatHistory) to stay consistent with
  // existing conventions. context captures what page/model the session
  // was started from for personalisation.
  aiSuggestionSessions: defineTable({
    // ── Identity
    userId: v.optional(v.id("teamMembers")),    // which team member opened the session
    modelId: v.optional(v.id("models")),        // which model the suggestions are for

    // ── Conversation
    messages: v.array(v.object({
      role: v.union(v.literal("user"), v.literal("assistant")),
      content: v.string(),                      // message text
      ts: v.number(),                           // Unix ms timestamp
    })),

    // ── Context
    context: v.optional(v.string()),            // e.g. "ideas_lab", "rd_table", "swipe_deck"

    // ── Model used
    modelId_ai: v.optional(v.string()),         // AI model ID e.g. "gpt-4o", "claude-3-5-sonnet"

    // ── Metadata
    createdAt: v.number(),                      // Unix ms
  })
    .index("by_user", ["userId"])
    .index("by_model", ["modelId"])
    .index("by_created", ["createdAt"]),


  // ── Social Post Jobs (Ayrshare multi-platform posting) ───────────────
  // Page: Integrations — Ayrshare (I8). One row per Ayrshare posting job.
  // A single job can target multiple platforms simultaneously. results is
  // a JSON-serialised Ayrshare response object per platform. Linked to
  // the reel being posted for traceability.
  socialPostJobs: defineTable({
    // ── Source content
    reelId: v.optional(v.id("reels")),          // which reel is being posted

    // ── Targeting
    platforms: v.array(v.string()),             // e.g. ["instagram", "tiktok", "twitter"]

    // ── Status
    status: v.union(
      v.literal("pending"),                     // job created, not yet submitted to Ayrshare
      v.literal("submitted"),                   // sent to Ayrshare API
      v.literal("published"),                   // Ayrshare confirmed all platforms posted
      v.literal("partial"),                     // some platforms succeeded, some failed
      v.literal("failed")                       // all platforms failed
    ),

    // ── Ayrshare tracking
    ayrshareJobId: v.optional(v.string()),      // Ayrshare's postId for status polling

    // ── Results
    results: v.optional(v.string()),            // JSON — Ayrshare per-platform response object

    // ── Metadata
    createdAt: v.number(),                      // Unix ms
  })
    .index("by_reel", ["reelId"])
    .index("by_status", ["status"])
    .index("by_ayrshare_job", ["ayrshareJobId"])
    .index("by_created", ["createdAt"]),


  // ── Opus Clip Jobs (Opus Clip AI clip generation) ────────────────────
  // Page: Integrations — Opus Clip (I10). One row per Opus Clip job.
  // clips is a JSON-serialised array of {url, startSec, endSec, title}
  // objects returned by Opus Clip. viralityScores mirrors the per-clip
  // score Opus Clip provides for sorting.
  opusClipJobs: defineTable({
    // ── Source
    sourceVideoUrl: v.string(),                 // full video URL sent to Opus Clip

    // ── Status
    status: v.union(
      v.literal("pending"),                     // queued, not yet sent to Opus Clip
      v.literal("processing"),                  // Opus Clip is processing
      v.literal("completed"),                   // clips generated successfully
      v.literal("failed")                       // job failed
    ),

    // ── Output
    clips: v.optional(v.string()),              // JSON — array of {url, startSec, endSec, title}
    viralityScores: v.optional(v.string()),     // JSON — array of per-clip virality scores

    // ── Metadata
    createdAt: v.number(),                      // Unix ms
  })
    .index("by_status", ["status"])
    .index("by_created", ["createdAt"]),
```

---

## Part 4: Relationship Map

```
rdEntries ──────► rdEntryRelationships (source + target edges)

reels ──────────► socialPostJobs (what's being posted)
reels ──────────► opusClipJobs (source video for clipping)

teamMembers ────► aiSuggestionSessions (who chatted)
models ─────────► aiSuggestionSessions (whose content was discussed)

hashtagGroups ──► scheduledPosts.hashtags (applied at scheduling time)

importJobs ─────► (standalone — no FK, rows describe the file batch)
```

---

## Part 4: Index Justification

| Table | Index | Query Pattern |
|-------|-------|---------------|
| hashtagGroups | `by_niche` | "Show hashtag groups for GFE niche" |
| hashtagGroups | `by_usage` | "Sort by most-used for quick picker" |
| importJobs | `by_status` | "Show all pending/processing imports" |
| rdEntryRelationships | `by_source` | "Show all edges out of entry X" (graph traversal) |
| rdEntryRelationships | `by_target` | "Show all edges into entry X" (reverse lookup) |
| aiSuggestionSessions | `by_user` | "Load session history for current user" |
| aiSuggestionSessions | `by_model` | "All AI sessions for Model X" |
| socialPostJobs | `by_reel` | "Has this reel been posted via Ayrshare?" |
| socialPostJobs | `by_ayrshare_job` | "Poll Ayrshare for job status" |
| opusClipJobs | `by_status` | "Show all processing Opus Clip jobs" |

---

## Part 5: Minor Field Additions

*Field additions to address the 11 partially-covered features. Listed as ready-to-add Convex validator snippets. Only the 4 items that warrant a new table or clear field addition are included; the remaining 7 partial gaps (A14, A15, A48, A56, E32, M5, M9) are deferred as application-logic or require external services.*

---

### 5A. `alerts` table — decline detection persistence (A11)

Replaces in-memory threshold checks with a persisted alert record so decline trends survive page reloads and can be reviewed historically.

```typescript
  // ── Alerts (decline detection + threshold breach persistence) ────────
  // Feature: Analytics decline detection (A11). One row per breach event.
  // Avoids re-alerting on the same breach via the resolvedAt lifecycle.
  alerts: defineTable({
    // ── What triggered it
    metricName: v.string(),                     // e.g. "engagementRate", "subscribers", "views"
    entityType: v.union(
      v.literal("model"),                       // alert is for a model
      v.literal("account"),                     // alert is for a tracked account
      v.literal("agency")                       // agency-wide metric
    ),
    entityId: v.optional(v.string()),           // _id of the model/account (v.string for flexibility)

    // ── Breach details
    thresholdValue: v.number(),                 // configured threshold that was crossed
    actualValue: v.number(),                    // actual value at time of breach
    changePercent: v.optional(v.number()),      // % change that triggered the alert

    // ── Severity
    severity: v.union(
      v.literal("warning"),                     // approaching threshold
      v.literal("critical")                     // hard breach
    ),

    // ── Lifecycle
    status: v.union(
      v.literal("active"),                      // unresolved
      v.literal("acknowledged"),                // seen by a manager
      v.literal("resolved")                     // metric recovered or manually closed
    ),
    acknowledgedBy: v.optional(v.string()),     // team member name
    acknowledgedAt: v.optional(v.number()),     // Unix ms
    resolvedAt: v.optional(v.number()),         // Unix ms

    // ── Metadata
    createdAt: v.number(),                      // Unix ms — when breach was detected
  })
    .index("by_entity", ["entityId"])
    .index("by_status", ["status"])
    .index("by_severity", ["severity"])
    .index("by_metric", ["metricName"])
    .index("by_created", ["createdAt"]),
```

---

### 5B. `hourlyRate` field on `teamMembers` (A63)

Required for shift cost calculation in the drag-and-drop schedule builder. Pairs with `shiftSchedules.estimatedCost` which is already in schema.

```typescript
// ADD to teamMembers defineTable({...}):

    // Hourly rate for shift cost calculation (A63)
    hourlyRate: v.optional(v.number()),         // rate per hour in base currency units
    hourlyRateCurrency: v.optional(v.string()), // ISO 4217: "THB", "GBP", "USD"
```

---

### 5C. `lastHeartbeat` field on `teamMembers` (A58)

Required for real-time presence indicators (online/away dots). Should be written by a client-side ping every 30s and read to determine if a user is "Online" vs "Away" vs "Offline".

```typescript
// ADD to teamMembers defineTable({...}):

    // Real-time presence heartbeat (A58)
    lastHeartbeat: v.optional(v.number()),      // Unix ms — updated by client ping every ~30s
```

---

### 5D. `themes` lookup table (E7)

Content theme taxonomy used throughout R&D entries, swipe deck, and challenges. Having it as a table (rather than a hardcoded enum) lets admins add seasonal themes (e.g. "Songkran 2027") without a schema migration.

```typescript
  // ── Themes (content theme taxonomy — admin-managed lookup) ───────────
  // Feature: Theme tagging across rdEntries, swipeDeckItems, challenges (E7).
  // Admin-managed list so seasonal themes can be added without schema changes.
  themes: defineTable({
    // ── Identity
    name: v.string(),                           // e.g. "Songkran", "Western", "Summer"
    slug: v.string(),                           // URL-safe: "songkran", "western", "summer"

    // ── Classification
    niche: v.optional(v.string()),              // null = applies to all niches
    season: v.optional(v.string()),             // e.g. "spring", "Q2", "Songkran 2026"
    isActive: v.boolean(),                      // false = archived/hidden from pickers

    // ── Display
    color: v.optional(v.string()),              // hex color for badge display
    emoji: v.optional(v.string()),              // optional emoji icon

    // ── Metadata
    createdBy: v.optional(v.string()),
    createdAt: v.number(),                      // Unix ms
  })
    .index("by_slug", ["slug"])
    .index("by_niche", ["niche"])
    .index("by_active", ["isActive"])
    .index("by_created", ["createdAt"]),
```

---

## Summary — Final Table Count

| Category | Count | Tables |
|----------|-------|--------|
| Existing (pre-project) | 28 | models, ideas, content, schedule, approvals, analytics, teamMembers, activity, trackedAccounts, scrapedPosts, swipeRatings, agentReports, contentGenJobs, scenes, featureRequests, agentRuns, creatorCandidates, blockedHandles, toolAnalyses, routines, issues, costs, mediaUploads, agentDebugLogs, settings, analysisPrompts, postAnalyses, creatorBriefs |
| Part 1 (content pipeline) | 9 | rdEntries, contentRequests, reels, reelVersions, scheduledPosts, notifications, gamificationEvents, shiftRecords, shiftSchedules |
| Part 2 (remaining) | 11 | financialRecords, webcamSessions, earningsRecords, swipeDeckItems, streamKeys, userPreferences, challenges, approvalDelegations, rewards, capCutTemplates, trendFeedItems |
| **TOTAL** | **48** | |

### Feature Coverage After Part 2

| Category | Before Part 2 | After Part 2 |
|----------|---------------|--------------|
| Fully covered | 108 | 155+ |
| Partially covered | 47 | 36 |
| Zero coverage (pure gaps) | 50 | ~0 (data layer) |
| UI-only (no table needed) | 14 | 14 |

*Remaining partial coverage gaps are application-layer logic (E32 comment-to-task, E33 semantic search, I10 Opus Clip, R2 granular ACL matrix) — not schema gaps.*
