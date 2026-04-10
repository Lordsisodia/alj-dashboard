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
    avatarUrl: v.optional(v.string()),  // Real avatar photo URL (R2)
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
    role: v.union(
      v.literal("Admin"),
      v.literal("VA"),
      v.literal("Editor")
    ),
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
    }),
    lastActive: v.optional(v.number()),
    inviteAccepted: v.boolean(),
    avatarColor: v.optional(v.string()),
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
    platform: v.union(v.literal("instagram"), v.literal("tiktok")),
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
  }).index("by_handle", ["handle"])
    .index("by_status", ["status"])
    .index("by_niche", ["niche"]),

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
    completedAt:    v.optional(v.number()),
    durationSec:    v.optional(v.number()),
    thumbnailColor: v.optional(v.string()),   // hex placeholder until real thumb
    errorMessage:   v.optional(v.string()),
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

});
