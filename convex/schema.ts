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
    status: v.union(v.literal("active"), v.literal("paused")),
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
    thumbnailUrl: v.string(),     // CDN url - no video stored
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
  }).index("by_status",  ["status"])
    .index("by_created", ["createdAt"])
    .index("by_model",   ["modelId"]),

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
    verified:          v.optional(v.boolean()),
    isPrivate:         v.optional(v.boolean()),
    instagramId:       v.optional(v.string()),
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

});
