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
    platform: v.union(v.literal("instagram"), v.literal("tiktok")),
    niche: v.string(),
    followerCount: v.number(),
    avatarUrl: v.optional(v.string()),
    avatarColor: v.string(),
    status: v.union(v.literal("active"), v.literal("paused")),
    lastScrapedAt: v.optional(v.number()),
    postsScraped: v.number(),
    avgEngagementRate: v.number(),
    isOwn: v.boolean(),           // true = one of our models, false = competitor
  }).index("by_handle", ["handle"])
    .index("by_status", ["status"])
    .index("by_niche", ["niche"]),

  // ── Scraped posts (Intelligence feed) ────────────────────────────
  scrapedPosts: defineTable({
    externalId: v.string(),       // Instagram post ID
    accountId: v.id("trackedAccounts"),
    handle: v.string(),           // denormalised for fast queries
    platform: v.union(v.literal("instagram"), v.literal("tiktok")),
    contentType: v.union(
      v.literal("reel"),
      v.literal("post"),
      v.literal("carousel"),
      v.literal("story")
    ),
    niche: v.string(),
    thumbnailUrl: v.string(),     // CDN url — no video stored
    videoUrl: v.optional(v.string()),
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
    saved: v.boolean(),           // user saved to swipe file
    boardIds: v.array(v.string()), // which boards it's saved to
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
