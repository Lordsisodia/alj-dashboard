import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

export default defineSchema({

  // ── Models (creators/talent) ───────────────────────────────────────
  models: defineTable({
    name: v.string(),
    niche: v.union(
      v.literal("GFE"),
      v.literal("Fitness"),
      v.literal("Meme"),
      v.literal("Thirst Trap"),
      v.literal("Lifestyle")
    ),
    ofHandle: v.optional(v.string()),
    igHandle: v.optional(v.string()),
    avatarColor: v.string(),
    avatarUrl: v.optional(v.string()),        // Real avatar photo URL (R2)
    referencePhotos: v.optional(v.array(v.string())), // Face reference photo URLs for FLUX
    active: v.boolean(),
    bio: v.optional(v.string()),
  }),

  // ── Ideas (AI-generated content briefs) ───────────────────────────
  ideas: defineTable({
    modelId: v.id("models"),
    niche: v.string(),
    style: v.string(),
    campaign: v.optional(v.string()),
    hook: v.string(),
    steps: v.array(v.string()),
    camera: v.string(),
    onScreenText: v.string(),
    endShot: v.string(),
    captionSuggestion: v.string(),
    hashtags: v.array(v.string()),
    status: v.union(
      v.literal("draft"),
      v.literal("generating"),
      v.literal("ready"),
      v.literal("sent")
    ),
    sentAt: v.optional(v.number()),
    createdBy: v.optional(v.string()),
  }).index("by_model", ["modelId"])
    .index("by_status", ["status"]),

  // ── Content (uploaded clips + enhancement) ────────────────────────
  content: defineTable({
    modelId: v.id("models"),
    ideaId: v.optional(v.id("ideas")),
    brief: v.optional(v.string()),
    niche: v.string(),
    props: v.array(v.string()),
    outfits: v.array(v.string()),
    clips: v.array(v.object({
      id: v.string(),
      filename: v.string(),
      sizeBytes: v.number(),
      driveUrl: v.optional(v.string()),
      status: v.union(
        v.literal("uploading"),
        v.literal("enhancing"),
        v.literal("enhanced")
      ),
      enhancement: v.optional(v.object({
        upscaled: v.boolean(),
        denoised: v.boolean(),
        colorCorrected: v.boolean(),
        stabilized: v.boolean(),
        detailEnhanced: v.boolean(),
      })),
    })),
    status: v.union(
      v.literal("draft"),
      v.literal("enhancing"),
      v.literal("ready"),
      v.literal("sent_to_pipeline")
    ),
    sentToPipelineAt: v.optional(v.number()),
    createdBy: v.optional(v.string()),
  }).index("by_model", ["modelId"])
    .index("by_status", ["status"]),

  // ── Schedule (planned posts) ───────────────────────────────────────
  schedule: defineTable({
    modelId: v.id("models"),
    contentId: v.optional(v.id("content")),
    approvalId: v.optional(v.id("approvals")),
    date: v.string(),
    time: v.string(),
    type: v.union(
      v.literal("post"),
      v.literal("reel"),
      v.literal("story"),
      v.literal("carousel"),
      v.literal("video"),
      v.literal("photo"),
      v.literal("bundle"),
      v.literal("ppv")
    ),
    status: v.union(
      v.literal("draft"),
      v.literal("scheduled"),
      v.literal("published"),
      v.literal("failed")
    ),
    caption: v.optional(v.string()),
    publishedAt: v.optional(v.number()),
  }).index("by_model", ["modelId"])
    .index("by_date", ["date"]),

  // ── Approvals ─────────────────────────────────────────────────────
  approvals: defineTable({
    modelId: v.id("models"),
    contentId: v.optional(v.id("content")),
    accountHandle: v.string(),
    contentType: v.union(
      v.literal("Reel"),
      v.literal("Post"),
      v.literal("Story"),
      v.literal("Carousel"),
      v.literal("Video"),
      v.literal("Photo")
    ),
    caption: v.string(),
    hashtags: v.array(v.string()),
    mediaUrl: v.optional(v.string()),
    thumbnailUrl: v.optional(v.string()),
    submittedBy: v.string(),
    status: v.union(
      v.literal("pending"),
      v.literal("approved"),
      v.literal("revision"),
      v.literal("published")
    ),
    revisionNote: v.optional(v.string()),
    approvedBy: v.optional(v.string()),
    approvedAt: v.optional(v.number()),
    publishedAt: v.optional(v.number()),
  }).index("by_model", ["modelId"])
    .index("by_status", ["status"]),

  // ── Analytics (per model, periodically synced) ────────────────────
  analytics: defineTable({
    modelId: v.id("models"),
    updatedAt: v.number(),
    subscribers: v.number(),
    totalPosts: v.number(),
    engagementRate: v.number(),
    avgLikes: v.number(),
    avgComments: v.number(),
    avgTips: v.number(),
    avgViews: v.number(),
    subscriberGrowth: v.array(v.object({
      label: v.string(),
      value: v.number(),
    })),
    weeklyEngagement: v.array(v.object({
      week: v.string(),
      rate: v.number(),
    })),
    topPosts: v.array(v.object({
      id: v.string(),
      thumbnailUrl: v.optional(v.string()),
      likes: v.number(),
      comments: v.number(),
      tips: v.number(),
      views: v.number(),
      posted: v.string(),
      caption: v.string(),
    })),
    audienceLocations: v.array(v.object({
      city: v.string(),
      pct: v.number(),
    })),
    ageRange: v.optional(v.string()),
    agePct: v.optional(v.number()),
    genderMalePct: v.optional(v.number()),
    genderFemalePct: v.optional(v.number()),
    activeHours: v.array(v.string()),
  }).index("by_model", ["modelId"]),

  // ── Team members ──────────────────────────────────────────────────
  teamMembers: defineTable({
    name: v.string(),
    email: v.string(),
    // Expanded role enum (R1, R6) — Part 3B addition
    role: v.union(
      v.literal("Admin"),
      v.literal("VA"),
      v.literal("Editor"),
      v.literal("Owner"),
      v.literal("Partner"),
      v.literal("MarketingManager"),
      v.literal("Model"),
      v.literal("Chatter"),
      v.literal("Developer")
    ),
    // Multiple roles per user (R3) — Part 3B addition
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
    status: v.union(
      v.literal("Online"),
      v.literal("Away"),
      v.literal("Offline")
    ),
    accountAccess: v.array(v.id("models")),
    permissions: v.object({
      schedule: v.boolean(),
      upload: v.boolean(),
      approve: v.boolean(),
      analytics: v.boolean(),
      manageTeam: v.boolean(),
      settings: v.boolean(),
      canAssignRoles: v.optional(v.boolean()),  // only Owner can set true (R5) — Part 3B addition
    }),
    lastActive: v.optional(v.number()),
    inviteAccepted: v.boolean(),
    avatarColor: v.optional(v.string()),
    // Hourly rate for shift cost calculation (A63) — Part 5B addition
    hourlyRate: v.optional(v.number()),         // rate per hour in base currency units
    hourlyRateCurrency: v.optional(v.string()), // ISO 4217: "THB", "GBP", "USD"
    // Real-time presence heartbeat (A58) — Part 5C addition
    lastHeartbeat: v.optional(v.number()),      // Unix ms — updated by client ping every ~30s
  }).index("by_email", ["email"]),

  // ── Activity log ──────────────────────────────────────────────────
  activity: defineTable({
    actorId: v.optional(v.id("teamMembers")),
    actorName: v.string(),
    action: v.string(),
    target: v.string(),
    targetId: v.optional(v.string()),
    timestamp: v.number(),
  }).index("by_timestamp", ["timestamp"]),

  // ── Tracked accounts (Recon) ─────────────────────────────────────
  trackedAccounts: defineTable({
    handle: v.string(),
    displayName: v.optional(v.string()),   // ownerFullName from scraper
    platform: v.union(v.literal("instagram"), v.literal("tiktok"), v.literal("twitter")),
    niche: v.string(),
    followerCount: v.number(),
    avatarUrl: v.optional(v.string()),
    avatarColor: v.optional(v.string()),
    status: v.union(v.literal("active"), v.literal("paused"), v.literal("failed")),
    lastScrapedAt: v.optional(v.number()),
    postsScraped: v.optional(v.number()),
    avgEngagementRate: v.optional(v.number()),
    isOwn: v.optional(v.boolean()),           // true = one of our models, false = competitor
    // enrichment fields (populated by /api/enrich-profile)
    bio:          v.optional(v.string()),
    postsCount:   v.optional(v.number()),
    verified:     v.optional(v.boolean()),
    enrichStatus: v.optional(v.union(v.literal("idle"), v.literal("enriching"), v.literal("done"), v.literal("error"))),
    enrichedAt:   v.optional(v.number()),
    followsCount:          v.optional(v.number()),
    externalUrl:           v.optional(v.string()),
    isBusinessAccount:     v.optional(v.boolean()),
    isProfessionalAccount: v.optional(v.boolean()),
    businessCategoryName:  v.optional(v.string()),
    businessEmail:         v.optional(v.string()),
    isPrivate:             v.optional(v.boolean()),
    igtvVideoCount:        v.optional(v.number()),
    instagramId:           v.optional(v.string()),
    // signals lost at approval hand-off
    avgViews:              v.optional(v.number()),
    outlierRatio:          v.optional(v.number()),
    highlightReelCount:    v.optional(v.number()),
    postsPerWeek:          v.optional(v.number()),
    // computed score (persisted snapshot; live value lives in getCreatorStats)
    creatorScore:          v.optional(v.number()),
    creatorScoreUpdatedAt: v.optional(v.number()),
    // links own accounts (isOwn=true) to model records (A18) — Part 3A addition
    modelId:               v.optional(v.id("models")),
  }).index("by_handle", ["handle"])
    .index("by_status", ["status"])
    .index("by_niche", ["niche"])
    .index("by_model", ["modelId"]),

  // ── Scraped posts (Intelligence feed) ────────────────────────────
  scrapedPosts: defineTable({
    externalId: v.string(),       // Instagram post ID
    accountId: v.optional(v.id("trackedAccounts")),
    handle: v.string(),           // denormalised for fast queries
    platform: v.union(v.literal("instagram"), v.literal("tiktok")),
    contentType: v.union(
      v.literal("reel"),
      v.literal("post"),
      v.literal("carousel"),
      v.literal("story")
    ),
    niche: v.string(),
    thumbnailUrl: v.string(),          // R2 permanent URL after download; original CDN url until then
    thumbnailSourceUrl:      v.optional(v.string()),   // original Instagram CDN url (ephemeral)
    thumbnailDownloadStatus: v.optional(v.union(
      v.literal("pending"),
      v.literal("downloading"),
      v.literal("ready"),
      v.literal("expired"),
      v.literal("failed")
    )),
    thumbnailDownloadError:  v.optional(v.string()),
    caption: v.string(),
    hashtags: v.array(v.string()),
    likes: v.number(),
    comments: v.number(),
    saves: v.number(),
    views: v.number(),
    reach: v.number(),
    engagementRate: v.number(),   // (likes+comments+saves) / reach
    postedAt: v.number(),
    scrapedAt: v.number(),
    firstComment: v.optional(v.string()), // top comment - sentiment signal
    outlierRatio: v.optional(v.number()), // views / followerCount - virality signal
    videoUrl: v.optional(v.string()),     // R2 permanent video URL (mp4)
    videoSourceUrl:      v.optional(v.string()),   // original IG CDN url (ephemeral)
    videoDownloadStatus: v.optional(v.union(
      v.literal("pending"),
      v.literal("downloading"),
      v.literal("ready"),
      v.literal("expired"),
      v.literal("failed")
    )),
    videoDownloadError:  v.optional(v.string()),
    videoDownloadedAt:   v.optional(v.number()),
    saved: v.optional(v.boolean()),           // user saved to swipe file
    boardIds: v.optional(v.array(v.string())), // which boards it's saved to
    baselineScore: v.optional(v.number()), // viral multiplier vs account average
    savedForPipeline: v.optional(v.boolean()), // saved to content pipeline
    savedAt: v.optional(v.number()), // timestamp when saved for pipeline
    aiAnalysis: v.optional(v.object({
      transcript:  v.optional(v.string()),
      hookScore:   v.number(),
      hookLine:    v.string(),
      emotions:    v.array(v.string()),
      breakdown:   v.string(),
      suggestions: v.array(v.string()),
      analyzedAt:  v.number(),
    })),
  }).index("by_account", ["accountId"])
    .index("by_niche", ["niche"])
    .index("by_content_type", ["contentType"])
    .index("by_posted_at", ["postedAt"])
    .index("by_engagement", ["engagementRate"])
    .index("by_download_status", ["videoDownloadStatus"])
    .searchIndex("search_caption", {
      searchField: "caption",
      filterFields: ["niche", "contentType"],
    }),

  // ── Swipe ratings (Hub Swipe & Rate → trains Intelligence) ───────
  swipeRatings: defineTable({
    postId: v.id("scrapedPosts"),
    ratedBy: v.string(),          // team member name
    rating: v.union(
      v.literal("up"),            // thumbs up / right swipe
      v.literal("down"),          // thumbs down / left swipe
      v.literal("save")           // saved to swipe file
    ),
    ratedAt: v.number(),
  }).index("by_post", ["postId"])
    .index("by_rater", ["ratedBy"]),

  // ── Agent-generated reports ───────────────────────────────────────
  agentReports: defineTable({
    title: v.string(),
    category: v.union(
      v.literal('Intelligence'),
      v.literal('Recon'),
      v.literal('Performance')
    ),
    insights: v.array(v.string()),
    generatedBy: v.string(),
    generatedAt: v.number(),
  }).index('by_generated_at', ['generatedAt'])
    .index('by_category', ['category']),

  // ── Content generation jobs (FLUX → Kling/Higgsfield pipeline) ───
  contentGenJobs: defineTable({
    name:       v.string(),               // e.g. FLUX-KL-ref01-gym-mirror-v1
    modelId:    v.optional(v.id("models")),
    modelName:  v.string(),               // denormalised for fast display
    scene:      v.string(),               // scene description / prompt
    provider: v.union(
      v.literal("FLUX"),
      v.literal("Kling"),
      v.literal("Higgsfield")
    ),
    status: v.union(
      v.literal("Queued"),
      v.literal("Generating"),
      v.literal("Done"),
      v.literal("Failed")
    ),
    progress:       v.optional(v.number()),   // 0-100, only when Generating
    etaSeconds:     v.optional(v.number()),   // remaining seconds
    outcome: v.optional(v.union(
      v.literal("Approved"),
      v.literal("Rejected"),
      v.literal("Pending Review")
    )),
    approvedAt:      v.optional(v.number()),   // set when approved
    completedAt:    v.optional(v.number()),
    durationSec:    v.optional(v.number()),
    thumbnailColor: v.optional(v.string()),   // hex placeholder until real thumb
    errorMessage:   v.optional(v.string()),
    retryCount:     v.optional(v.number()),   // incremented on each retry
    createdAt:      v.number(),
    // ── Replicate / Kling integration (Phase 3.1) ──
    replicatePredictionId: v.optional(v.string()),
    mode:                  v.optional(v.union(v.literal("std"), v.literal("pro"))),
    characterOrientation:  v.optional(v.union(v.literal("image"), v.literal("video"))),
    keepOriginalSound:     v.optional(v.boolean()),
    generatedVideoUrl:     v.optional(v.string()),   // Replicate ephemeral URL
    generatedVideoR2Url:   v.optional(v.string()),   // R2 permanent URL after download
    replicateLogs:         v.optional(v.string()),   // for debugging
    costUsd:               v.optional(v.number()),   // for dashboard metrics
    startedAt:             v.optional(v.number()),
    cancelledAt:           v.optional(v.number()),
  }).index("by_status",  ["status"])
    .index("by_created", ["createdAt"])
    .index("by_model",   ["modelId"])
    .index("by_replicate_prediction_id", ["replicatePredictionId"]),

  // ── Scenes (approved video ideas waiting to be generated) ────────
  scenes: defineTable({
    modelId: v.id("models"),
    modelName: v.string(), // denormalised for fast display
    sourceType: v.union(
      v.literal("saved_post"),  // from scrapedPosts.savedForPipeline
      v.literal("idea"),         // from ideas table
      v.literal("manual")        // created in Scenes tab
    ),
    sourceId: v.optional(v.string()), // _id of the source record
    sceneDescription: v.string(), // the prompt / what to recreate
    // ── Source post snapshot (denormalised at creation for saved_post scenes) ──
    sourceHandle:         v.optional(v.string()),
    sourceNiche:          v.optional(v.string()),
    sourceVerified:       v.optional(v.boolean()),
    sourceViews:          v.optional(v.number()),
    sourceEngagementRate: v.optional(v.number()),
    sourceOutlierRatio:   v.optional(v.number()),
    sourceCaption:        v.optional(v.string()),
    sourceHookLine:       v.optional(v.string()),
    sourceEmotions:       v.optional(v.array(v.string())),
    referenceVideoUrl: v.optional(v.string()),     // the post being recreated
    referenceThumbnailUrl: v.optional(v.string()),
    startingImageUrl: v.optional(v.string()),
    startingImageStatus: v.union(
      v.literal("missing"),
      v.literal("generating"),
      v.literal("ready"),
      v.literal("failed")
    ),
    startingImageError: v.optional(v.string()),
    priorityScore: v.number(), // 0-100, higher = higher priority
    provider: v.union(
      v.literal("FLUX"),
      v.literal("Kling"),
      v.literal("Higgsfield")
    ),
    status: v.union(
      v.literal("Pending"),    // awaiting starting image or approval
      v.literal("Queued"),     // approved + ready, waiting for generation slot
      v.literal("Generating"), // active generation job
      v.literal("Done")        // job finished
    ),
    approvalState: v.union(
      v.literal("draft"),
      v.literal("pending_review"),
      v.literal("approved"),
      v.literal("rejected")
    ),
    approvedBy: v.optional(v.string()),
    approvedAt: v.optional(v.number()),
    rejectionReason: v.optional(v.string()),
    generatedJobId: v.optional(v.id("contentGenJobs")),
    generatedVideoUrl: v.optional(v.string()),  // mirrors contentGenJobs.generatedVideoR2Url for fast scene-list reads
    createdBy: v.optional(v.string()),
    createdAt: v.number(),
    // ── Wizard state ──────────────────────────────────────────────────
    wizardStep: v.optional(v.number()),                          // 1-4, persisted step
    selectedReferencePhotoUrls: v.optional(v.array(v.string())), // model reference photos chosen in step 3
  })
    .index("by_status", ["status"])
    .index("by_approval", ["approvalState"])
    .index("by_model", ["modelId"])
    .index("by_priority", ["priorityScore"])
    .index("by_created", ["createdAt"]),

  // ── Feature Requests ─────────────────────────────────────────────
  featureRequests: defineTable({
    title:       v.string(),
    description: v.string(),
    requestedBy: v.string(),
    submittedAt: v.number(),
    status: v.union(
      v.literal('Queued'),
      v.literal('In Progress'),
      v.literal('Delivered')
    ),
    eta:      v.string(),
    priority: v.union(
      v.literal('Low'),
      v.literal('Medium'),
      v.literal('High')
    ),
  }).index('by_submitted', ['submittedAt']),

  // ── Agent runs (task execution log) ─────────────────────────────────
  agentRuns: defineTable({
    agentName: v.string(),
    type: v.union(v.literal('Scraper'), v.literal('Scheduler'), v.literal('Analyst')),
    description: v.string(),
    status: v.union(v.literal('running'), v.literal('completed'), v.literal('failed')),
    startedAt: v.number(),      // Unix ms timestamp
    duration: v.string(),
    progress: v.number(),       // 0-100
    outputPreview: v.string(),
  }).index('by_status', ['status'])
    .index('by_started_at', ['startedAt']),

  // ── Creator candidates (Recon discovery pipeline) ────────────────
  creatorCandidates: defineTable({
    handle:            v.string(),
    displayName:       v.string(),
    niche:             v.optional(v.string()),
    followerCount:     v.optional(v.number()),
    followsCount:      v.optional(v.number()),
    postsCount:        v.optional(v.number()),
    bio:               v.optional(v.string()),
    avatarUrl:         v.optional(v.string()),
    avgEngagementRate: v.optional(v.number()),
    avgViews:          v.optional(v.number()),
    outlierRatio:      v.optional(v.number()),
    postsPerWeek:      v.optional(v.number()),
    verified:           v.optional(v.boolean()),
    isPrivate:          v.optional(v.boolean()),
    isBusinessAccount:  v.optional(v.boolean()),
    instagramId:        v.optional(v.string()),
    externalUrl:        v.optional(v.string()),
    highlightReelCount: v.optional(v.number()),
    igtvVideoCount:     v.optional(v.number()),
    // Pipeline status
    status:            v.union(v.literal('pending'), v.literal('approved'), v.literal('rejected')),
    source:            v.union(v.literal('pre_approved'), v.literal('scraper'), v.literal('manual')),
    suggestedBy:       v.optional(v.string()),  // handle that referred them
    addedAt:           v.number(),
    // AI scoring
    aiScore:           v.optional(v.number()),
    aiVerdict:         v.optional(v.union(v.literal('HIRE'), v.literal('WATCH'), v.literal('PASS'))),
    aiReason:          v.optional(v.string()),
    // Enrichment
    enrichStatus:      v.optional(v.union(v.literal('idle'), v.literal('enriching'), v.literal('done'), v.literal('error'))),
    enrichedAt:        v.optional(v.number()),
  }).index('by_handle', ['handle'])
    .index('by_status', ['status'])
    .index('by_added_at', ['addedAt']),

  // ── Blocked handles (rejected from discovery, never re-add) ─────────────
  blockedHandles: defineTable({
    handle:    v.string(),   // normalised lowercase e.g. "@minaxash"
    blockedAt: v.number(),
  }).index('by_handle', ['handle']),

  // ── Tool analyses (Video Analyser runs) ──────────────────────────────────
  toolAnalyses: defineTable({
    label:        v.optional(v.string()),   // user-provided name/label
    videoUrl:     v.string(),
    systemPrompt: v.string(),
    model:        v.string(),
    transcript:   v.optional(v.string()),
    hookScore:    v.number(),
    hookLine:     v.string(),
    emotions:     v.array(v.string()),
    breakdown:    v.string(),
    suggestions:  v.array(v.string()),
    analyzedAt:     v.number(),
    lastActivityAt: v.optional(v.number()),
    chatHistory:    v.optional(v.array(v.object({
      role:    v.union(v.literal('user'), v.literal('assistant')),
      content: v.string(),
      ts:      v.number(),
    }))),
  }).index('by_analyzed_at',   ['analyzedAt'])
    .index('by_last_activity', ['lastActivityAt']),

  // ── Routines (recurring agent tasks) ──────────────────────────────────────
  routines: defineTable({
    title: v.string(),
    description: v.optional(v.string()),
    assigneeAgent: v.optional(v.string()),
    status: v.union(v.literal("active"), v.literal("paused"), v.literal("archived")),
    concurrencyPolicy: v.union(
      v.literal("coalesce_if_active"),
      v.literal("always_enqueue"),
      v.literal("skip_if_active")
    ),
    catchUpPolicy: v.union(v.literal("skip_missed"), v.literal("enqueue_missed")),
    lastRunAt: v.optional(v.number()),
    lastRunStatus: v.optional(v.string()),
    createdAt: v.number(),
  }).index("by_status", ["status"])
    .index("by_created", ["createdAt"]),

  // ── Issues (agent task tracker) ───────────────────────────────────────────
  issues: defineTable({
    title: v.string(),
    description: v.optional(v.string()),
    status: v.union(
      v.literal("backlog"),
      v.literal("todo"),
      v.literal("in_progress"),
      v.literal("in_review"),
      v.literal("blocked"),
      v.literal("done")
    ),
    priority: v.union(
      v.literal("low"),
      v.literal("medium"),
      v.literal("high"),
      v.literal("urgent")
    ),
    assigneeAgent: v.optional(v.string()),
    identifier: v.optional(v.string()),
    updatedAt: v.number(),
    createdAt: v.number(),
  }).index("by_status", ["status"])
    .index("by_priority", ["priority"])
    .index("by_updated", ["updatedAt"]),

  // ── Costs (AI model spend tracking) ──────────────────────────────────────
  costs: defineTable({
    agentName: v.string(),
    provider: v.string(),
    model: v.string(),
    inputTokens: v.optional(v.number()),
    outputTokens: v.optional(v.number()),
    costCents: v.number(),
    recordedAt: v.number(),
  }).index("by_agent", ["agentName"])
    .index("by_recorded", ["recordedAt"]),

  // ── Media uploads (R2 upload history) ────────────────────────────
  mediaUploads: defineTable({
    r2Key:      v.string(),
    url:        v.string(),
    filename:   v.string(),
    mimeType:   v.string(),
    sizeBytes:  v.number(),
    uploadedAt: v.number(),
    context:    v.union(
      v.literal("tool_upload"),
      v.literal("gen_result"),
      v.literal("scrape")
    ),
    label:      v.optional(v.string()),
    analysisId: v.optional(v.string()),  // toolAnalyses _id
  }).index("by_uploaded_at", ["uploadedAt"])
    .index("by_context",     ["context"]),

  // ── Agent debug logs (AI call tracing) ───────────────────────────
  agentDebugLogs: defineTable({
    agentId:   v.string(),               // "analyser" | "scraper" | "minimax" etc
    stage:     v.string(),               // "api_call" | "parse" | "save" etc
    input:     v.string(),               // prompt / payload sent (may be truncated)
    output:    v.string(),               // raw model response (may be truncated)
    model:     v.string(),
    provider:  v.string(),               // "openrouter" | "minimax" | "convex"
    tokens:    v.optional(v.object({
      input:  v.number(),
      output: v.number(),
      total:  v.number(),
    })),
    latencyMs: v.number(),
    status:    v.union(v.literal("ok"), v.literal("error")),
    error:     v.optional(v.string()),
    jobId:     v.optional(v.string()),   // contentGenJobs _id
    runId:     v.optional(v.string()),   // agentRuns _id
    timestamp: v.number(),
  }).index("by_timestamp", ["timestamp"])
    .index("by_agent",     ["agentId"])
    .index("by_status",    ["status"]),

  // ── Settings (single workspace doc) ──────────────────────────────
  settings: defineTable({
    workspaceId: v.string(),
    displayName: v.string(),
    email: v.string(),
    timezone: v.string(),
    notifications: v.object({
      email: v.boolean(),
      slack: v.boolean(),
      push: v.boolean(),
    }),
    contentDefaults: v.object({
      defaultNiche: v.string(),
      defaultModelId: v.optional(v.id("models")),
      autoEnhance: v.boolean(),
      enhancementLevel: v.number(),
      defaultDriveFolder: v.string(),
      autoHashtags: v.boolean(),
      defaultPostTime: v.union(v.literal("best"), v.literal("custom")),
    }),
    integrations: v.object({
      googleDrive: v.object({ connected: v.boolean(), lastSynced: v.optional(v.number()) }),
      airtable: v.object({ connected: v.boolean(), lastSynced: v.optional(v.number()) }),
      telegram: v.object({ connected: v.boolean(), botUsername: v.optional(v.string()), lastSynced: v.optional(v.number()) }),
      metaGraph: v.object({ connected: v.boolean() }),
    }),
    billing: v.object({
      plan: v.string(),
      price: v.number(),
      status: v.union(v.literal("active"), v.literal("cancelled"), v.literal("trialing")),
      nextBillingDate: v.optional(v.number()),
    }),
  }),

  // ── Analysis prompts (versioned system prompts for intelligence analysis) ──
  analysisPrompts: defineTable({
    typeKey:   v.string(),   // e.g. "ofm_comprehensive", "hook_focus"
    typeLabel: v.string(),   // display label
    version:   v.number(),   // auto-incremented per typeKey
    name:      v.string(),   // user label e.g. "v1", "fashion-focused"
    prompt:    v.string(),   // system prompt text (user editable)
    isActive:  v.boolean(),  // one active version per typeKey
    createdAt: v.number(),
  }).index('by_type', ['typeKey'])
    .index('by_type_active', ['typeKey', 'isActive']),

  // ── Post analyses V2 — structured feature vector per video ──────────────────────────
  postAnalyses: defineTable({
    postId:         v.id("scrapedPosts"),
    handle:         v.string(),
    niche:          v.string(),
    outlierRatio:   v.optional(v.number()),
    engagementRate: v.number(),
    views:          v.number(),
    saves:          v.number(),
    likes:          v.number(),

    hookStructure: v.union(
      v.literal("question"), v.literal("shock_claim"), v.literal("negation"),
      v.literal("listicle"), v.literal("pov"), v.literal("before_after"),
      v.literal("visual_hook"), v.literal("transformation_tease"),
      v.literal("direct_command"), v.literal("storytime"),
      v.literal("other"), v.literal("unknown"),
    ),
    hookModality: v.union(
      v.literal("spoken"), v.literal("on_screen_text"), v.literal("visual_only"),
      v.literal("audio_cue"), v.literal("mixed"), v.literal("unknown"),
    ),
    firstFrameType: v.union(
      v.literal("face_closeup"), v.literal("face_medium"), v.literal("body_full"),
      v.literal("product"), v.literal("environment"), v.literal("text_card"),
      v.literal("action_in_progress"), v.literal("unknown"),
    ),
    spokenFirstWords:        v.optional(v.string()),
    onScreenTextFirstFrame:  v.optional(v.string()),
    curiosityGapPresent:     v.boolean(),
    patternInterruptPresent: v.boolean(),
    directAddress:           v.boolean(),
    hookDurationSec:         v.optional(v.number()),

    formatPrimary: v.union(
      v.literal("talking_head"), v.literal("voiceover_b_roll"), v.literal("pov_action"),
      v.literal("transition_montage"), v.literal("lipsync"), v.literal("tutorial_demo"),
      v.literal("reaction"), v.literal("skit_scripted"), v.literal("text_on_screen_silent"),
      v.literal("product_showcase"), v.literal("thirst_trap_static"),
      v.literal("before_after_reveal"), v.literal("dance_performance"),
      v.literal("day_in_life_vlog"), v.literal("other"), v.literal("unknown"),
    ),
    setting: v.union(
      v.literal("home_bedroom"), v.literal("home_other"), v.literal("gym"),
      v.literal("outdoor_urban"), v.literal("outdoor_nature"), v.literal("studio"),
      v.literal("car"), v.literal("mirror"), v.literal("other"), v.literal("unknown"),
    ),
    creatorOnScreen: v.boolean(),
    faceVisibility: v.union(
      v.literal("full"), v.literal("partial"), v.literal("obscured"),
      v.literal("none"), v.literal("unknown"),
    ),
    energyLevel:         v.number(),
    cutsPerSecondBucket: v.union(
      v.literal("low"), v.literal("med"), v.literal("high"),
      v.literal("extreme"), v.literal("unknown"),
    ),
    hasJumpCuts:    v.boolean(),
    hasSpeedRamps:  v.boolean(),
    hasZoomPunches: v.boolean(),

    hasSpokenWords:      v.boolean(),
    hasVoiceover:        v.boolean(),
    musicEnergy: v.union(
      v.literal("none"), v.literal("low"), v.literal("mid"), v.literal("high"),
    ),
    soundEffectsPresent: v.boolean(),
    speakingPace: v.union(
      v.literal("slow"), v.literal("normal"), v.literal("fast"),
      v.literal("rapid"), v.literal("unknown"),
    ),

    creatorExpressedEmotion: v.union(
      v.literal("neutral"), v.literal("confident"), v.literal("playful"),
      v.literal("seductive"), v.literal("intense"), v.literal("vulnerable"),
      v.literal("excited"), v.literal("deadpan"), v.literal("angry"),
      v.literal("joyful"), v.literal("unknown"),
    ),
    vibeKeyword: v.union(
      v.literal("aspirational"), v.literal("relatable"), v.literal("educational"),
      v.literal("provocative"), v.literal("cozy"), v.literal("hype"),
      v.literal("controversial"), v.literal("wholesome"), v.literal("premium"),
      v.literal("raw_authentic"), v.literal("humorous"), v.literal("motivational"),
      v.literal("sensual"), v.literal("unknown"),
    ),

    captionHasCTA:       v.boolean(),
    captionAddsContext:  v.boolean(),
    captionRepeatsVideo: v.boolean(),
    ctaType: v.union(
      v.literal("save"), v.literal("comment"), v.literal("share"),
      v.literal("follow"), v.literal("dm"), v.literal("link_bio"),
      v.literal("none"), v.literal("unknown"),
    ),
    captionLengthBucket: v.union(
      v.literal("short"), v.literal("medium"), v.literal("long"),
    ),
    hashtagCount:     v.optional(v.number()),
    transcript:       v.optional(v.string()),
    onScreenTextFull: v.optional(v.string()),

    extractionModel:      v.string(),
    promptVersion:        v.string(),
    extractionConfidence: v.number(),
    extractionFlags:      v.array(v.string()),
    analyzedAt:           v.number(),
    rawResponse:          v.optional(v.string()),
  })
    .index("by_post_id",        ["postId"])
    .index("by_niche",          ["niche"])
    .index("by_niche_format",   ["niche", "formatPrimary"])
    .index("by_niche_hook",     ["niche", "hookStructure"])
    .index("by_format_energy",  ["formatPrimary", "energyLevel"])
    .index("by_prompt_version", ["promptVersion"]),

  // -- Creator briefs (Recon — OpenRouter AI-generated profiles) ------------------------
  creatorBriefs: defineTable({
    handle:           v.string(),
    displayName:       v.string(),
    niche:            v.string(),
    // OpenRouter output
    contentScore:     v.number(),       // 1-10
    consistencyScore: v.number(),       // 1-10
    monetizationRating: v.number(),      // 1-10
    topHooks:         v.array(v.string()),
    contentPatterns:  v.array(v.string()),
    overallVerdict:   v.string(),       // HIRE | WATCH | PASS
    recommendation:   v.string(),
    // Raw source data snapshot at time of generation
    followerCount:    v.number(),
    engagementRate:  v.number(),
    postsThisWeek:    v.number(),
    source:           v.string(),
    generatedAt:      v.number(),
  }).index('by_handle', ['handle'])
    .index('by_generated_at', ['generatedAt']),

  // ── Agency Dashboard Pipeline Tables ──────────────────────────────────

  // ═══════════════════════════════════════════════════════════════════════
  // CONTENT PIPELINE TABLES (9 new tables)
  // ═══════════════════════════════════════════════════════════════════════

  // ── R&D Entries (content ideas backlog — the Sunday planning table) ──
  rdEntries: defineTable({
    // ── Identity
    modelId: v.id("models"),
    niche: v.string(),
    theme: v.optional(v.string()),
    category: v.optional(v.string()),

    // ── Content
    title: v.string(),
    description: v.string(),
    referenceReelUrl: v.optional(v.string()),
    referencePostId: v.optional(v.id("scrapedPosts")),

    // ── Source tracking
    source: v.union(
      v.literal("editor_sunday"),
      v.literal("analytics"),
      v.literal("model_swipe"),
      v.literal("ai_suggestion"),
      v.literal("manual")
    ),

    // ── Pipeline status
    status: v.union(
      v.literal("proposed"),
      v.literal("approved"),
      v.literal("assigned"),
      v.literal("in_production"),
      v.literal("completed"),
      v.literal("rejected")
    ),

    // ── Approval
    approvedBy: v.optional(v.string()),
    approvedAt: v.optional(v.number()),
    rejectionReason: v.optional(v.string()),

    // ── Performance feedback loop
    performanceTags: v.optional(v.array(v.string())),
    linkedPostAnalysisId: v.optional(v.id("postAnalyses")),
    engagementRate: v.optional(v.number()),
    viewCount: v.optional(v.number()),

    // ── Duplicate detection
    contentHash: v.optional(v.string()),

    // ── Priority & ordering
    priorityScore: v.optional(v.number()),

    // ── CapCut template linkage (E10) — Part 3F addition
    capCutTemplateId: v.optional(v.id("capCutTemplates")),

    // ── Metadata
    createdBy: v.optional(v.string()),
    contentRequestId: v.optional(v.id("contentRequests")),
    createdAt: v.number(),
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
  contentRequests: defineTable({
    // ── Identity
    modelId: v.id("models"),
    rdEntryId: v.optional(v.id("rdEntries")),

    // ── Brief content
    title: v.string(),
    instructions: v.string(),
    tips: v.optional(v.string()),
    briefVideoUrl: v.optional(v.string()),
    briefThumbnailUrl: v.optional(v.string()),

    // ── Niche denormalisation (E3 — editor queue filter) — Part 3D addition
    niche: v.optional(v.string()),

    // ── Deadline & tracking
    deadline: v.optional(v.number()),
    reminderSentAt: v.optional(v.number()),

    // ── Model response
    status: v.union(
      v.literal("draft"),
      v.literal("sent"),
      v.literal("acknowledged"),
      v.literal("in_progress"),
      v.literal("uploaded"),
      v.literal("overdue"),
      v.literal("cancelled")
    ),
    uploadedClipUrl: v.optional(v.string()),
    googleDriveFileId: v.optional(v.string()),
    uploadedAt: v.optional(v.number()),

    // ── Gamification
    pointsAwarded: v.optional(v.number()),
    submittedEarly: v.optional(v.boolean()),

    // ── Metadata
    sentBy: v.optional(v.string()),
    sentAt: v.optional(v.number()),
    createdAt: v.number(),
  })
    .index("by_model", ["modelId"])
    .index("by_status", ["status"])
    .index("by_model_status", ["modelId", "status"])
    .index("by_deadline", ["deadline"])
    .index("by_niche", ["niche"])
    .index("by_created", ["createdAt"]),


  // ── Reels (edited content — master record per piece) ─────────────────
  reels: defineTable({
    // ── Identity
    modelId: v.id("models"),
    editorId: v.optional(v.id("teamMembers")),
    contentRequestId: v.optional(v.id("contentRequests")),
    rdEntryId: v.optional(v.id("rdEntries")),

    // ── Content metadata
    title: v.string(),
    description: v.optional(v.string()),
    niche: v.string(),
    category: v.optional(v.string()),

    // ── AI metadata
    captionAI: v.optional(v.string()),
    onScreenTextAI: v.optional(v.string()),
    hookVariants: v.optional(v.array(v.string())),
    suggestedHashtags: v.optional(v.array(v.string())),
    viralityScore: v.optional(v.number()),

    // ── Version tracking
    currentVersion: v.number(),
    latestVersionId: v.optional(v.id("reelVersions")),

    // ── PTP status
    ptpStatus: v.union(
      v.literal("editing"),
      v.literal("submitted"),
      v.literal("approved"),
      v.literal("revision"),
      v.literal("scheduled")
    ),
    approvalId: v.optional(v.id("approvals")),
    approvedBy: v.optional(v.string()),
    approvedAt: v.optional(v.number()),
    rejectionNote: v.optional(v.string()),
    scheduledDate: v.optional(v.string()),

    // ── Edit tracking
    totalEditTimeSeconds: v.optional(v.number()),
    editStartedAt: v.optional(v.number()),

    // ── Storage
    mediaUrl: v.optional(v.string()),
    thumbnailUrl: v.optional(v.string()),
    googleDriveUrl: v.optional(v.string()),

    // ── Metadata
    createdAt: v.number(),
    updatedAt: v.number(),
  })
    .index("by_model", ["modelId"])
    .index("by_editor", ["editorId"])
    .index("by_ptp_status", ["ptpStatus"])
    .index("by_model_ptp", ["modelId", "ptpStatus"])
    .index("by_niche", ["niche"])
    .index("by_created", ["createdAt"])
    .index("by_updated", ["updatedAt"]),


  // ── Reel Versions (V1, V2, V3... per reel) ──────────────────────────
  reelVersions: defineTable({
    // ── Identity
    reelId: v.id("reels"),
    versionNumber: v.number(),

    // ── Media
    mediaUrl: v.string(),
    thumbnailUrl: v.optional(v.string()),
    googleDriveUrl: v.optional(v.string()),
    fileSizeBytes: v.optional(v.number()),

    // ── AI metadata snapshot
    captionAI: v.optional(v.string()),
    onScreenTextAI: v.optional(v.string()),
    viralityScore: v.optional(v.number()),

    // ── Edit metadata
    editTimeSeconds: v.optional(v.number()),
    editorNotes: v.optional(v.string()),

    // ── Review
    status: v.union(
      v.literal("uploaded"),
      v.literal("submitted"),
      v.literal("approved"),
      v.literal("rejected")
    ),
    reviewedBy: v.optional(v.string()),
    reviewedAt: v.optional(v.number()),
    rejectionNote: v.optional(v.string()),

    // ── Annotations (frame-accurate video annotation)
    annotations: v.optional(v.array(v.object({
      timestampSec: v.number(),
      comment: v.string(),
      authorName: v.string(),
      createdAt: v.number(),
    }))),

    // ── Metadata
    uploadedBy: v.optional(v.string()),
    createdAt: v.number(),
  })
    .index("by_reel", ["reelId"])
    .index("by_reel_version", ["reelId", "versionNumber"])
    .index("by_status", ["status"])
    .index("by_created", ["createdAt"]),


  // ── Scheduled Posts (internal queue + Meta slot tracking) ─────────────
  scheduledPosts: defineTable({
    // ── Identity
    modelId: v.id("models"),
    reelId: v.optional(v.id("reels")),
    approvalId: v.optional(v.id("approvals")),
    scheduleId: v.optional(v.id("schedule")),
    accountHandle: v.string(),

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
    caption: v.optional(v.string()),
    hashtags: v.optional(v.array(v.string())),
    onScreenText: v.optional(v.string()),
    mediaUrl: v.optional(v.string()),

    // ── Scheduling
    scheduledAt: v.number(),
    bestTimeScore: v.optional(v.number()),

    // ── Meta API slot tracking
    metaSlotPosition: v.optional(v.number()),
    metaMediaContainerId: v.optional(v.string()),
    metaPostId: v.optional(v.string()),

    // ── Duplicate detection (P16) — Part 3C addition
    contentHash: v.optional(v.string()),

    // ── Status
    status: v.union(
      v.literal("queued"),
      v.literal("slot_assigned"),
      v.literal("uploading_to_meta"),
      v.literal("scheduled_meta"),
      v.literal("published"),
      v.literal("failed"),
      v.literal("cancelled")
    ),
    errorMessage: v.optional(v.string()),
    retryCount: v.optional(v.number()),

    // ── SLA tracking
    enteredQueueAt: v.optional(v.number()),
    slotAssignedAt: v.optional(v.number()),
    publishedAt: v.optional(v.number()),

    // ── Metadata
    scheduledBy: v.optional(v.string()),
    createdAt: v.number(),
  })
    .index("by_model", ["modelId"])
    .index("by_status", ["status"])
    .index("by_scheduled_at", ["scheduledAt"])
    .index("by_model_platform", ["modelId", "platform"])
    .index("by_platform_status", ["platform", "status"])
    .index("by_account", ["accountHandle"])
    .index("by_content_hash", ["contentHash"])
    .index("by_created", ["createdAt"]),


  // ── Notifications (3-channel notification system) ────────────────────
  notifications: defineTable({
    // ── Recipient
    recipientId: v.optional(v.id("teamMembers")),
    recipientModelId: v.optional(v.id("models")),
    recipientName: v.string(),

    // ── Content
    title: v.string(),
    body: v.string(),
    linkTo: v.optional(v.string()),

    // ── Classification
    type: v.union(
      v.literal("content_request"),
      v.literal("editing_task"),
      v.literal("ptp_rejection"),
      v.literal("ptp_submission"),
      v.literal("model_uploaded"),
      v.literal("shift_starting"),
      v.literal("shift_late"),
      v.literal("deadline_reminder"),
      v.literal("approval_complete"),
      v.literal("schedule_published"),
      v.literal("gamification_milestone"),
      v.literal("system"),
      v.literal("digest")
    ),
    severity: v.union(
      v.literal("high"),
      v.literal("medium"),
      v.literal("low")
    ),

    // ── Channel delivery status
    channels: v.object({
      inApp: v.boolean(),
      push: v.boolean(),
      telegram: v.boolean(),
    }),
    deliveredPush: v.optional(v.boolean()),
    deliveredTelegram: v.optional(v.boolean()),

    // ── Read status
    isRead: v.boolean(),
    readAt: v.optional(v.number()),

    // ── Source reference
    sourceTable: v.optional(v.string()),
    sourceId: v.optional(v.string()),

    // ── Send-time optimization (M50) — Part 3G addition
    sendTimeOptimizationScore: v.optional(v.number()),
    optimalSendAt: v.optional(v.number()),

    // ── Metadata
    sentAt: v.number(),
    expiresAt: v.optional(v.number()),
  })
    .index("by_recipient", ["recipientId"])
    .index("by_recipient_model", ["recipientModelId"])
    .index("by_recipient_read", ["recipientId", "isRead"])
    .index("by_type", ["type"])
    .index("by_severity", ["severity"])
    .index("by_sent_at", ["sentAt"]),


  // ── Gamification Events (model points tracking) ──────────────────────
  gamificationEvents: defineTable({
    // ── Who
    modelId: v.id("models"),

    // ── What
    action: v.union(
      v.literal("swipe_right"),
      v.literal("swipe_discard"),
      v.literal("content_upload"),
      v.literal("submit_early"),
      v.literal("submit_on_time"),
      v.literal("daily_target_hit"),
      v.literal("weekly_target_hit"),
      v.literal("stream_completed"),
      v.literal("streak_day"),
      v.literal("challenge_completed"),
      v.literal("go_live"),
      v.literal("pre_stream_checklist"),
      v.literal("custom")
    ),
    points: v.number(),
    multiplier: v.optional(v.number()),

    // ── Context
    description: v.optional(v.string()),
    sourceTable: v.optional(v.string()),
    sourceId: v.optional(v.string()),

    // ── Challenge tracking
    challengeId: v.optional(v.string()),
    challengeWeek: v.optional(v.string()),

    // ── Metadata
    awardedBy: v.optional(v.string()),
    createdAt: v.number(),
  })
    .index("by_model", ["modelId"])
    .index("by_model_action", ["modelId", "action"])
    .index("by_model_created", ["modelId", "createdAt"])
    .index("by_action", ["action"])
    .index("by_created", ["createdAt"])
    .index("by_challenge", ["challengeId"]),


  // ── Shift Records (clock in/out tracking) ────────────────────────────
  shiftRecords: defineTable({
    // ── Who
    userId: v.id("teamMembers"),

    // ── Schedule reference
    shiftScheduleId: v.optional(v.id("shiftSchedules")),
    scheduledStart: v.optional(v.number()),
    scheduledEnd: v.optional(v.number()),

    // ── Actual times
    actualStart: v.optional(v.number()),
    actualEnd: v.optional(v.number()),

    // ── Status
    status: v.union(
      v.literal("scheduled"),
      v.literal("clocked_in"),
      v.literal("on_time"),
      v.literal("late"),
      v.literal("early"),
      v.literal("absent"),
      v.literal("partial")
    ),

    // ── Lateness tracking
    latenessMinutes: v.optional(v.number()),
    deductionAmount: v.optional(v.number()),
    deductionCurrency: v.optional(v.string()),

    // ── Alerts
    seniorAlertSent: v.optional(v.boolean()),

    // ── Break tracking (A54) — Part 3H addition
    breakMinutes: v.optional(v.number()),
    breakCount: v.optional(v.number()),

    // ── Notes
    notes: v.optional(v.string()),

    // ── Metadata
    date: v.string(),
    createdAt: v.number(),
  })
    .index("by_user", ["userId"])
    .index("by_date", ["date"])
    .index("by_user_date", ["userId", "date"])
    .index("by_status", ["status"])
    .index("by_created", ["createdAt"]),


  // ── Shift Schedules (who works when) ─────────────────────────────────
  shiftSchedules: defineTable({
    // ── Who
    userId: v.id("teamMembers"),

    // ── When
    date: v.string(),
    startTime: v.string(),
    endTime: v.string(),

    // ── Type
    isDayOff: v.boolean(),
    shiftType: v.optional(v.union(
      v.literal("morning"),
      v.literal("afternoon"),
      v.literal("evening"),
      v.literal("night"),
      v.literal("split"),
      v.literal("custom")
    )),

    // ── Swap workflow stub
    swapRequestedWith: v.optional(v.id("teamMembers")),
    swapStatus: v.optional(v.union(
      v.literal("none"),
      v.literal("pending"),
      v.literal("accepted"),
      v.literal("manager_approved"),
      v.literal("rejected")
    )),

    // ── Cost tracking stub
    estimatedCost: v.optional(v.number()),

    // ── Recurrence support (A57) — Part 3E addition
    recurrenceRule: v.optional(v.string()),
    isRecurrenceInstance: v.optional(v.boolean()),
    recurrenceParentId: v.optional(v.id("shiftSchedules")),

    // ── Metadata
    createdBy: v.optional(v.string()),
    createdAt: v.number(),
    updatedAt: v.optional(v.number()),
  })
    .index("by_user", ["userId"])
    .index("by_date", ["date"])
    .index("by_user_date", ["userId", "date"])
    .index("by_created", ["createdAt"]),


  // ═══════════════════════════════════════════════════════════════════════
  // REMAINING TABLES (11 new tables — Part 2)
  // ═══════════════════════════════════════════════════════════════════════


  // ── Financial Records (Google Sheets mirror — P&L / Revenue / ROI) ──
  financialRecords: defineTable({
    // ── Classification
    category: v.union(
      v.literal("revenue"),
      v.literal("payroll"),
      v.literal("cost"),
      v.literal("subscription"),
      v.literal("model_cut")
    ),
    subcategory: v.optional(v.string()),

    // ── Attribution
    department: v.optional(v.string()),
    staffUserId: v.optional(v.id("teamMembers")),
    modelId: v.optional(v.id("models")),

    // ── Financials
    amount: v.number(),
    currency: v.string(),
    period: v.string(),
    date: v.optional(v.string()),

    // ── Projection
    isProjected: v.optional(v.boolean()),
    projectedAmount: v.optional(v.number()),

    // ── Source tracking
    source: v.union(
      v.literal("sheets_sync"),
      v.literal("manual"),
      v.literal("api_sync"),
      v.literal("computed")
    ),
    sheetsRowRef: v.optional(v.string()),
    description: v.optional(v.string()),

    // ── Sync metadata
    syncedAt: v.optional(v.number()),
    syncBatchId: v.optional(v.string()),

    // ── Metadata
    createdBy: v.optional(v.string()),
    createdAt: v.number(),
    updatedAt: v.optional(v.number()),
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
  webcamSessions: defineTable({
    // ── Identity
    modelId: v.id("models"),

    // ── Platform
    platform: v.string(),
    accountHandle: v.optional(v.string()),
    streamKeyId: v.optional(v.id("streamKeys")),

    // ── Timing
    startedAt: v.number(),
    endedAt: v.optional(v.number()),
    durationSeconds: v.optional(v.number()),
    scheduledStartAt: v.optional(v.number()),

    // ── Live status
    isLive: v.boolean(),
    streamUrl: v.optional(v.string()),

    // ── Viewer metrics
    viewerCount: v.optional(v.number()),
    peakViewers: v.optional(v.number()),
    avgViewers: v.optional(v.number()),

    // ── Earnings
    earnings: v.optional(v.number()),
    earningsCurrency: v.optional(v.string()),
    tipsCount: v.optional(v.number()),
    topTipAmount: v.optional(v.number()),

    // ── Post-stream summary
    postStreamSummaryUrl: v.optional(v.string()),
    postStreamSentAt: v.optional(v.number()),
    postStreamSentTo: v.optional(v.string()),

    // ── Pre-stream checklist
    preStreamChecklistCompleted: v.optional(v.boolean()),
    preStreamChecklistItems: v.optional(v.array(v.object({
      label: v.string(),
      completed: v.boolean(),
    }))),

    // ── Shift correlation
    shiftScheduleId: v.optional(v.id("shiftSchedules")),

    // ── Notes
    notes: v.optional(v.string()),

    // ── Metadata
    createdAt: v.number(),
  })
    .index("by_model", ["modelId"])
    .index("by_model_platform", ["modelId", "platform"])
    .index("by_platform", ["platform"])
    .index("by_started", ["startedAt"])
    .index("by_model_started", ["modelId", "startedAt"])
    .index("by_is_live", ["isLive"])
    .index("by_created", ["createdAt"]),


  // ── Earnings Records (OF/Fans.ly model earnings) ────────────────────
  earningsRecords: defineTable({
    // ── Identity
    modelId: v.id("models"),

    // ── Platform & type
    platform: v.union(
      v.literal("onlyfans"),
      v.literal("fansly"),
      v.literal("webcam"),
      v.literal("instagram"),
      v.literal("tiktok"),
      v.literal("other")
    ),
    contentType: v.optional(v.string()),
    earningType: v.union(
      v.literal("subscription"),
      v.literal("tips"),
      v.literal("ppv"),
      v.literal("custom_content"),
      v.literal("referral"),
      v.literal("stream"),
      v.literal("other")
    ),

    // ── Financials
    grossAmount: v.number(),
    netAmount: v.optional(v.number()),
    currency: v.string(),
    period: v.string(),

    // ── Goal tracking
    goalAmount: v.optional(v.number()),
    goalCurrency: v.optional(v.string()),

    // ── Payment tracking
    paymentDate: v.optional(v.string()),
    paymentStatus: v.optional(v.union(
      v.literal("pending"),
      v.literal("processing"),
      v.literal("paid"),
      v.literal("failed")
    )),

    // ── Source
    source: v.union(
      v.literal("api_sync"),
      v.literal("manual"),
      v.literal("sheets_sync")
    ),
    description: v.optional(v.string()),

    // ── Metadata
    recordedAt: v.number(),
    createdAt: v.number(),
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
  swipeDeckItems: defineTable({
    // ── Identity
    modelId: v.id("models"),

    // ── Source content
    sourceType: v.union(
      v.literal("scraped_post"),
      v.literal("rd_entry"),
      v.literal("ai_suggestion"),
      v.literal("content_gen")
    ),
    sourceId: v.string(),
    contentUrl: v.optional(v.string()),
    thumbnailUrl: v.optional(v.string()),
    title: v.optional(v.string()),
    description: v.optional(v.string()),

    // ── Content classification
    niche: v.string(),
    theme: v.optional(v.string()),

    // ── Swipe action
    action: v.union(
      v.literal("pending"),
      v.literal("saved"),
      v.literal("make_now"),
      v.literal("discarded")
    ),
    swipedAt: v.optional(v.number()),

    // ── Daily drop tracking
    droppedDate: v.string(),
    dropPosition: v.optional(v.number()),

    // ── Trend signals
    isTrending: v.optional(v.boolean()),
    trendScore: v.optional(v.number()),

    // ── Conversion tracking
    contentRequestId: v.optional(v.id("contentRequests")),
    gamificationEventId: v.optional(v.string()),

    // ── Metadata
    createdAt: v.number(),
  })
    .index("by_model", ["modelId"])
    .index("by_model_action", ["modelId", "action"])
    .index("by_model_date", ["modelId", "droppedDate"])
    .index("by_action", ["action"])
    .index("by_dropped_date", ["droppedDate"])
    .index("by_niche", ["niche"])
    .index("by_created", ["createdAt"]),


  // ── Stream Keys (per-model per-platform OBS keys) ───────────────────
  streamKeys: defineTable({
    // ── Identity
    modelId: v.id("models"),
    platform: v.string(),

    // ── Key data
    keyEncrypted: v.string(),
    keyHint: v.optional(v.string()),
    serverUrl: v.optional(v.string()),

    // ── Status
    isActive: v.boolean(),
    label: v.optional(v.string()),

    // ── Usage tracking
    lastUsedAt: v.optional(v.number()),
    lastVerifiedAt: v.optional(v.number()),

    // ── Metadata
    createdBy: v.optional(v.string()),
    createdAt: v.number(),
    updatedAt: v.optional(v.number()),
  })
    .index("by_model", ["modelId"])
    .index("by_model_platform", ["modelId", "platform"])
    .index("by_active", ["isActive"])
    .index("by_created", ["createdAt"]),


  // ── User Preferences (per-user settings) ────────────────────────────
  userPreferences: defineTable({
    // ── Identity
    userId: v.optional(v.id("teamMembers")),
    modelId: v.optional(v.id("models")),

    // ── Display preferences
    language: v.string(),
    timezone: v.string(),
    dateFormat: v.optional(v.string()),
    theme: v.optional(v.union(
      v.literal("light"),
      v.literal("dark"),
      v.literal("system")
    )),

    // ── Notification preferences
    notificationPrefs: v.object({
      inAppEnabled: v.boolean(),
      pushEnabled: v.boolean(),
      telegramEnabled: v.boolean(),
      telegramChatId: v.optional(v.string()),
      digestMode: v.boolean(),
      digestTime: v.optional(v.string()),
      quietHoursStart: v.optional(v.string()),
      quietHoursEnd: v.optional(v.string()),
    }),

    // ── Dashboard preferences
    defaultView: v.optional(v.string()),
    sidebarCollapsed: v.optional(v.boolean()),

    // ── Metadata
    createdAt: v.number(),
    updatedAt: v.number(),
  })
    .index("by_user", ["userId"])
    .index("by_model", ["modelId"])
    .index("by_created", ["createdAt"]),


  // ── Challenges (weekly themed challenge definitions) ─────────────────
  challenges: defineTable({
    // ── Content
    title: v.string(),
    description: v.string(),
    theme: v.optional(v.string()),

    // ── Timing
    week: v.string(),
    startsAt: v.number(),
    endsAt: v.number(),

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
    targetCount: v.number(),
    customTargetDescription: v.optional(v.string()),

    // ── Rewards
    bonusPoints: v.number(),
    rewardDescription: v.optional(v.string()),
    rewardId: v.optional(v.id("rewards")),

    // ── Status
    isActive: v.boolean(),
    participantCount: v.optional(v.number()),
    completedCount: v.optional(v.number()),

    // ── Metadata
    createdBy: v.optional(v.string()),
    createdAt: v.number(),
  })
    .index("by_week", ["week"])
    .index("by_active", ["isActive"])
    .index("by_starts", ["startsAt"])
    .index("by_created", ["createdAt"]),


  // ── Approval Delegations (owner delegates PTP to managers per model) ─
  approvalDelegations: defineTable({
    // ── Who delegates
    delegatorId: v.id("teamMembers"),

    // ── Who receives authority
    delegateId: v.id("teamMembers"),

    // ── Scope
    modelId: v.optional(v.id("models")),
    contentTypes: v.optional(v.array(v.union(
      v.literal("reel"),
      v.literal("post"),
      v.literal("story"),
      v.literal("carousel")
    ))),

    // ── Validity
    isActive: v.boolean(),
    expiresAt: v.optional(v.number()),
    reason: v.optional(v.string()),

    // ── Metadata
    createdAt: v.number(),
    revokedAt: v.optional(v.number()),
  })
    .index("by_delegator", ["delegatorId"])
    .index("by_delegate", ["delegateId"])
    .index("by_delegate_model", ["delegateId", "modelId"])
    .index("by_active", ["isActive"])
    .index("by_created", ["createdAt"]),


  // ── Rewards (monthly gamification reward catalog) ───────────────────
  rewards: defineTable({
    // ── Prize definition
    title: v.string(),
    description: v.optional(v.string()),
    imageUrl: v.optional(v.string()),

    // ── Requirements
    pointsRequired: v.number(),
    tier: v.optional(v.union(
      v.literal("bronze"),
      v.literal("silver"),
      v.literal("gold"),
      v.literal("platinum")
    )),

    // ── Availability
    month: v.string(),
    maxRedemptions: v.optional(v.number()),
    currentRedemptions: v.optional(v.number()),

    // ── Status
    status: v.union(
      v.literal("available"),
      v.literal("claimed"),
      v.literal("expired"),
      v.literal("draft")
    ),

    // ── Winner tracking
    winnerId: v.optional(v.id("models")),
    winnerName: v.optional(v.string()),
    awardedAt: v.optional(v.number()),
    redeemedAt: v.optional(v.number()),
    redemptionNotes: v.optional(v.string()),

    // ── Metadata
    createdBy: v.optional(v.string()),
    createdAt: v.number(),
  })
    .index("by_month", ["month"])
    .index("by_status", ["status"])
    .index("by_tier", ["tier"])
    .index("by_month_status", ["month", "status"])
    .index("by_winner", ["winnerId"])
    .index("by_created", ["createdAt"]),


  // ── CapCut Templates (template library by niche) ────────────────────
  capCutTemplates: defineTable({
    // ── Content
    name: v.string(),
    description: v.optional(v.string()),

    // ── Classification
    niche: v.string(),
    category: v.optional(v.string()),
    tags: v.optional(v.array(v.string())),

    // ── Media
    templateUrl: v.string(),
    previewUrl: v.optional(v.string()),
    previewThumbnailUrl: v.optional(v.string()),

    // ── Usage tracking
    usageCount: v.optional(v.number()),
    lastUsedAt: v.optional(v.number()),
    rating: v.optional(v.number()),

    // ── Status
    isActive: v.boolean(),

    // ── Metadata
    addedBy: v.optional(v.string()),
    createdAt: v.number(),
    updatedAt: v.optional(v.number()),
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
  trendFeedItems: defineTable({
    // ── Source
    platform: v.union(
      v.literal("tiktok"),
      v.literal("instagram"),
      v.literal("youtube"),
      v.literal("twitter")
    ),

    // ── Trend data
    type: v.union(
      v.literal("hashtag"),
      v.literal("sound"),
      v.literal("format"),
      v.literal("topic"),
      v.literal("effect")
    ),
    label: v.string(),
    description: v.optional(v.string()),

    // ── Relevance
    niche: v.optional(v.string()),
    trendScore: v.optional(v.number()),
    viewCount: v.optional(v.number()),
    growthRate: v.optional(v.number()),
    region: v.optional(v.string()),

    // ── Media
    previewUrl: v.optional(v.string()),
    externalUrl: v.optional(v.string()),

    // ── Lifecycle
    fetchedAt: v.number(),
    expiresAt: v.number(),
    isActive: v.boolean(),

    // ── Metadata
    fetchBatchId: v.optional(v.string()),
    createdAt: v.number(),
  })
    .index("by_platform", ["platform"])
    .index("by_platform_type", ["platform", "type"])
    .index("by_niche", ["niche"])
    .index("by_trend_score", ["trendScore"])
    .index("by_active", ["isActive"])
    .index("by_fetched", ["fetchedAt"])
    .index("by_expires", ["expiresAt"])
    .index("by_created", ["createdAt"]),


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
  // is stored as an inline array of {role, content, ts} objects (same
  // shape as toolAnalyses.chatHistory). context captures the page/model
  // the session was started from for personalisation.
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

    // ── AI model used
    aiModelId: v.optional(v.string()),          // e.g. "gpt-4o", "claude-3-5-sonnet"

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


  // ═══════════════════════════════════════════════════════════════════════
  // MINOR FIELD ADDITIONS — Part 5 New Tables
  // (teamMembers field additions are inline above; new tables listed here)
  // ═══════════════════════════════════════════════════════════════════════


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
    entityId: v.optional(v.string()),           // _id of the model/account (string for flexibility)

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


  // ── Themes (content theme taxonomy — admin-managed lookup) ───────────
  // Feature: Theme tagging across rdEntries, swipeDeckItems, challenges (E7).
  // Admin-managed so seasonal themes (e.g. "Songkran 2027") can be added
  // without a schema migration.
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

});
