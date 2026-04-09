import { query, mutation } from "./_generated/server";
import { v } from "convex/values";

// ── List scenes with optional filters, sorted by priority then createdAt ──────

export const list = query({
  args: {
    status:        v.optional(v.union(v.literal("Pending"), v.literal("Queued"), v.literal("Generating"), v.literal("Done"))),
    approvalState: v.optional(v.union(v.literal("draft"), v.literal("pending_review"), v.literal("approved"), v.literal("rejected"))),
    modelId:       v.optional(v.id("models")),
  },
  handler: async (ctx, args) => {
    let scenes = await ctx.db.query("scenes").collect();
    if (args.status)        scenes = scenes.filter(s => s.status === args.status);
    if (args.approvalState) scenes = scenes.filter(s => s.approvalState === args.approvalState);
    if (args.modelId)       scenes = scenes.filter(s => s.modelId === args.modelId);
    return scenes.sort((a, b) => {
      if (b.priorityScore !== a.priorityScore) return b.priorityScore - a.priorityScore;
      return b.createdAt - a.createdAt;
    });
  },
});

// ── Get a single scene by ID ──────────────────────────────────────────────────

export const getById = query({
  args: { sceneId: v.id("scenes") },
  handler: async (ctx, args) => {
    return await ctx.db.get(args.sceneId);
  },
});

// ── Create a scene from a saved post ─────────────────────────────────────────

export const createFromPost = mutation({
  args: {
    postId:           v.id("scrapedPosts"),
    modelId:          v.id("models"),
    sceneDescription: v.string(),
    priorityScore:    v.optional(v.number()),
    provider:         v.optional(v.union(v.literal("FLUX"), v.literal("Kling"), v.literal("Higgsfield"))),
    createdBy:        v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const post  = await ctx.db.get(args.postId);
    const model = await ctx.db.get(args.modelId);
    return await ctx.db.insert("scenes", {
      modelId:              args.modelId,
      modelName:            model?.name ?? "",
      sourceType:           "saved_post",
      sourceId:             args.postId,
      sceneDescription:     args.sceneDescription,
      // Source post snapshot — point-in-time for decision audit
      sourceHandle:         post?.handle,
      sourceNiche:          post?.niche,
      sourceVerified:       undefined,
      sourceViews:          post?.views,
      sourceEngagementRate: post?.engagementRate,
      sourceOutlierRatio:   post?.outlierRatio,
      sourceCaption:        post?.caption ? post.caption.slice(0, 200) : undefined,
      sourceHookLine:       post?.aiAnalysis?.hookLine,
      sourceEmotions:       post?.aiAnalysis?.emotions?.slice(0, 3),
      referenceVideoUrl:    post?.videoUrl,
      referenceThumbnailUrl: post?.thumbnailUrl,
      startingImageStatus:  "missing",
      priorityScore:        args.priorityScore ?? 50,
      provider:             args.provider ?? "Kling",
      status:               "Pending",
      approvalState:        "draft",
      createdBy:            args.createdBy,
      createdAt:            Date.now(),
    });
  },
});

// ── Create a manual scene ─────────────────────────────────────────────────────

export const createManual = mutation({
  args: {
    modelId:           v.id("models"),
    sceneDescription:  v.string(),
    priorityScore:     v.optional(v.number()),
    provider:          v.optional(v.union(v.literal("FLUX"), v.literal("Kling"), v.literal("Higgsfield"))),
    referenceVideoUrl: v.optional(v.string()),
    createdBy:         v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const model = await ctx.db.get(args.modelId);
    return await ctx.db.insert("scenes", {
      modelId:              args.modelId,
      modelName:            model?.name ?? "",
      sourceType:           "manual",
      sourceId:             undefined,
      sceneDescription:     args.sceneDescription,
      referenceVideoUrl:    args.referenceVideoUrl,
      referenceThumbnailUrl: undefined,
      startingImageStatus:  "missing",
      priorityScore:        args.priorityScore ?? 50,
      provider:             args.provider ?? "Kling",
      status:               "Pending",
      approvalState:        "draft",
      createdBy:            args.createdBy,
      createdAt:            Date.now(),
    });
  },
});

// ── Approve a scene ───────────────────────────────────────────────────────────

export const approve = mutation({
  args: {
    sceneId:    v.id("scenes"),
    approvedBy: v.string(),
  },
  handler: async (ctx, args) => {
    const scene = await ctx.db.get(args.sceneId);
    if (!scene) return;
    const nextStatus = (scene.startingImageStatus === "ready" ? "Queued" : "Pending") as "Queued" | "Pending";
    await ctx.db.patch(args.sceneId, {
      approvalState: "approved",
      approvedBy:    args.approvedBy,
      approvedAt:    Date.now(),
      status:        nextStatus,
    });
  },
});

// ── Reject a scene ────────────────────────────────────────────────────────────

export const reject = mutation({
  args: {
    sceneId: v.id("scenes"),
    reason:  v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    await ctx.db.patch(args.sceneId, {
      approvalState:   "rejected",
      rejectionReason: args.reason,
    });
  },
});

// ── Set priority (clamped 0-100) ──────────────────────────────────────────────

export const setPriority = mutation({
  args: {
    sceneId:       v.id("scenes"),
    priorityScore: v.number(),
  },
  handler: async (ctx, args) => {
    const clamped = Math.max(0, Math.min(100, args.priorityScore));
    await ctx.db.patch(args.sceneId, { priorityScore: clamped });
  },
});

// ── Update starting image (Phase 2 Replicate callback target) ─────────────────

export const updateStartingImage = mutation({
  args: {
    sceneId: v.id("scenes"),
    url:     v.optional(v.string()),
    status:  v.union(v.literal("missing"), v.literal("generating"), v.literal("ready"), v.literal("failed")),
    error:   v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const scene = await ctx.db.get(args.sceneId);
    if (!scene) return;
    const shouldQueue = args.status === "ready" && scene.approvalState === "approved";
    await ctx.db.patch(args.sceneId, {
      startingImageUrl:    args.url,
      startingImageStatus: args.status,
      startingImageError:  args.error,
      ...(shouldQueue ? { status: "Queued" as const } : {}),
    });
  },
});

// ── Link a generation job to a scene ─────────────────────────────────────────

export const linkGenerationJob = mutation({
  args: {
    sceneId: v.id("scenes"),
    jobId:   v.id("contentGenJobs"),
  },
  handler: async (ctx, args) => {
    await ctx.db.patch(args.sceneId, {
      generatedJobId: args.jobId,
      status:         "Generating",
    });
  },
});

// ── Delete a scene ────────────────────────────────────────────────────────────

export const remove = mutation({
  args: { sceneId: v.id("scenes") },
  handler: async (ctx, args) => {
    await ctx.db.delete(args.sceneId);
  },
});

// ── Seed demo scenes (idempotent) ─────────────────────────────────────────────

export const seed = mutation({
  args: {},
  handler: async (_ctx) => {
    return { skipped: true, reason: "seeding disabled" };
  },
});
