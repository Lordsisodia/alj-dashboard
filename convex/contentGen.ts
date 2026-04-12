import { query, mutation, internalMutation } from "./_generated/server";
import { internal } from "./_generated/api";
import { v } from "convex/values";

// ── List generation jobs (ideas table, content-gen origin tagged by campaign prefix) ──

export const getJobs = query({
  args: {
    status: v.optional(v.union(
      v.literal("draft"),
      v.literal("generating"),
      v.literal("ready"),
      v.literal("sent"),
    )),
  },
  handler: async (ctx, args) => {
    let jobs = await ctx.db.query("ideas").collect();
    // Content-gen jobs are tagged with campaign starting with "gen:"
    jobs = jobs.filter(j => j.campaign?.startsWith("gen:"));
    if (args.status) jobs = jobs.filter(j => j.status === args.status);
    // Newest first
    return jobs.sort((a, b) => (b._creationTime ?? 0) - (a._creationTime ?? 0));
  },
});

// ── Fetch job details for notifications (webhook route) ───────────────────────

export const getJobForNotification = query({
  args: { jobId: v.id("contentGenJobs") },
  handler: async (ctx, args) => {
    const job = await ctx.db.get(args.jobId);
    if (!job) return null;
    return {
      name: job.name,
      modelName: job.modelName,
      provider: job.provider,
    };
  },
});

// ── Stats for header pill ─────────────────────────────────────────────────────

export const getStats = query({
  args: {},
  handler: async (ctx) => {
    const jobs = await ctx.db.query("ideas").collect();
    const genJobs = jobs.filter(j => j.campaign?.startsWith("gen:"));
    return {
      total:      genJobs.length,
      generating: genJobs.filter(j => j.status === "generating").length,
      ready:      genJobs.filter(j => j.status === "ready").length,
      sent:       genJobs.filter(j => j.status === "sent").length,
    };
  },
});

// ── Create a new manual generation job (bypasses scenes) ──────────────────────

export const createManualJob = mutation({
  args: {
    modelName: v.string(),
    brief:     v.string(),
    provider:  v.union(v.literal("FLUX"), v.literal("Kling"), v.literal("Higgsfield")),
  },
  handler: async (ctx, args) => {
    return await ctx.db.insert("contentGenJobs", {
      name: `MANUAL-${args.provider}-${Date.now().toString().slice(-4)}`,
      modelName: args.modelName,
      scene: args.brief,
      provider: args.provider,
      status: "Queued",
      etaSeconds: 300,
      createdAt: Date.now(),
    });
  },
});

// ── Dispatch a scene job ───────────────────────────────────────────────────────

export const dispatchJob = mutation({
  args: {
    sceneId:   v.id("scenes"),
    modelName: v.string(),
    sceneDesc: v.string(),
    provider:  v.union(v.literal("FLUX"), v.literal("Kling"), v.literal("Higgsfield")),
  },
  handler: async (ctx, args) => {
    const jobId = await ctx.db.insert("contentGenJobs", {
      name: `SCENE-${args.provider}-${Date.now().toString().slice(-4)}`,
      modelName: args.modelName,
      scene: args.sceneDesc,
      provider: args.provider,
      status: "Queued",
      etaSeconds: 300,
      createdAt: Date.now(),
    });
    
    // update the scene
    await ctx.db.patch(args.sceneId, {
      generatedJobId: jobId,
      status: "Generating",
    });
    
    return jobId;
  },
});

// ── Update job status (generating → ready → sent) ─────────────────────────────

export const updateJobStatus = mutation({
  args: {
    jobId:  v.id("ideas"),
    status: v.union(
      v.literal("draft"),
      v.literal("generating"),
      v.literal("ready"),
      v.literal("sent"),
    ),
  },
  handler: async (ctx, args) => {
    await ctx.db.patch(args.jobId, {
      status:  args.status,
      sentAt:  args.status === "sent" ? Date.now() : undefined,
    });
  },
});

// ── Delete a job ──────────────────────────────────────────────────────────────

export const deleteJob = mutation({
  args: { jobId: v.id("ideas") },
  handler: async (ctx, args) => {
    await ctx.db.delete(args.jobId);
  },
});

// ═════════════════════════════════════════════════════════════════════════════
// Queue page - contentGenJobs table
// Tracks the FLUX → Kling/Higgsfield video generation pipeline per job.
// ═════════════════════════════════════════════════════════════════════════════

// ── Active jobs: Queued + Generating + Failed ─────────────────────────────────
// Ordered: Generating first (user watches), Failed second (needs action),
// Queued last (just waiting).

export const getActiveJobs = query({
  args: {},
  handler: async (ctx) => {
    const jobs = await ctx.db.query("contentGenJobs").collect();
    const ORDER = { Generating: 0, Failed: 1, Queued: 2 } as const;
    return jobs
      .filter(j => j.status !== "Done")
      .sort((a, b) => {
        const oa = ORDER[a.status as keyof typeof ORDER] ?? 9;
        const ob = ORDER[b.status as keyof typeof ORDER] ?? 9;
        if (oa !== ob) return oa - ob;
        return b.createdAt - a.createdAt;
      });
  },
});

// ── History: Done jobs, newest first ─────────────────────────────────────────

export const getHistory = query({
  args: { limit: v.optional(v.number()) },
  handler: async (ctx, args) => {
    const jobs = await ctx.db.query("contentGenJobs").collect();
    return jobs
      .filter(j => j.status === "Done")
      .sort((a, b) => (b.completedAt ?? 0) - (a.completedAt ?? 0))
      .slice(0, args.limit ?? 50);
  },
});

// ── Retry a failed job → reset to Queued ─────────────────────────────────────

export const retryJob = mutation({
  args: { jobId: v.id("contentGenJobs") },
  handler: async (ctx, { jobId }) => {
    const job = await ctx.db.get(jobId);
    if (!job || job.status !== "Failed") return;
    await ctx.db.patch(jobId, {
      status: "Queued",
      progress: undefined,
      errorMessage: undefined,
      etaSeconds: 300,
      retryCount: ((job as any).retryCount ?? 0) + 1,
    });
  },
});

// ── Cancel a queued or generating job ────────────────────────────────────────

export const cancelJob = mutation({
  args: { jobId: v.id("contentGenJobs") },
  handler: async (ctx, { jobId }) => {
    const job = await ctx.db.get(jobId);
    if (!job) return;
    if (job.status === "Queued") {
      // Queued jobs: just delete them (no work started)
      await ctx.db.delete(jobId);
    } else if (job.status === "Generating") {
      // Generating jobs: mark as Failed with cancelledAt timestamp
      // Full Replicate abort can come later when API key is available
      await ctx.db.patch(jobId, {
        status: "Failed",
        errorMessage: "canceled",
        cancelledAt: Date.now(),
      });
    }
  },
});

// ── Submit a completed job for review (sets outcome + inserts approval record) ─

export const submitForReview = mutation({
  args: {
    jobId: v.id("contentGenJobs"),
  },
  handler: async (ctx, { jobId }) => {
    const job = await ctx.db.get(jobId);
    if (!job || job.status !== "Done") return;

    // Set outcome to Pending Review
    await ctx.db.patch(jobId, { outcome: "Pending Review" });

    // Insert into approvals table only if the job has a modelId
    if (job.modelId) {
      await ctx.db.insert("approvals", {
        modelId: job.modelId,
        accountHandle: job.modelName,
        contentType: "Video",
        caption: job.scene ?? "",
        hashtags: [],
        mediaUrl: job.generatedVideoR2Url ?? job.generatedVideoUrl,
        submittedBy: "content-gen",
        status: "pending",
      });
    }
  },
});

// ── Set outcome on a completed job ────────────────────────────────────────────

export const updateOutcome = mutation({
  args: {
    jobId: v.id("contentGenJobs"),
    outcome: v.union(
      v.literal("Approved"),
      v.literal("Rejected"),
      v.literal("Pending Review")
    ),
  },
  handler: async (ctx, { jobId, outcome }) => {
    const patch: Record<string, unknown> = { outcome };
    if (outcome === 'Approved') {
      patch.approvedAt = Date.now();
    }
    await ctx.db.patch(jobId, patch);
  },
});

// ── Seed demo data (idempotent) ───────────────────────────────────────────────

export const seedJobs = mutation({
  args: {},
  handler: async (ctx) => {
    const existing = await ctx.db.query("contentGenJobs").collect();
    if (existing.length > 0) return { skipped: true };

    const now = Date.now();

    await ctx.db.insert("contentGenJobs", {
      name: "FLUX-KL-ref01-gym-mirror-v1",
      modelName: "Tyler",
      scene: "Model in gym, mirror selfie angle, natural lighting, motivational energy",
      provider: "Kling",
      status: "Generating",
      progress: 63,
      etaSeconds: 142,
      createdAt: now - 180_000,
    });

    await ctx.db.insert("contentGenJobs", {
      name: "FLUX-HF-ref02-beach-sunset-v1",
      modelName: "Ren",
      scene: "Beach at golden hour, candid walk along shoreline, soft bokeh background",
      provider: "Higgsfield",
      status: "Queued",
      etaSeconds: 310,
      createdAt: now - 60_000,
    });

    await ctx.db.insert("contentGenJobs", {
      name: "FLUX-KL-ref01-gym-mirror-v0",
      modelName: "Tyler",
      scene: "Model in gym, mirror selfie angle, natural lighting",
      provider: "Kling",
      status: "Done",
      outcome: "Approved",
      completedAt: now - 5_400_000,
      durationSec: 187,
      thumbnailColor: "#d4a574",
      createdAt: now - 5_600_000,
    });

    await ctx.db.insert("contentGenJobs", {
      name: "FLUX-HF-ref03-pool-day-v1",
      modelName: "Ella",
      scene: "Poolside, afternoon light, relaxed candid shot",
      provider: "Higgsfield",
      status: "Done",
      outcome: "Pending Review",
      completedAt: now - 11_700_000,
      durationSec: 224,
      thumbnailColor: "#7fb3d3",
      createdAt: now - 12_000_000,
    });

    await ctx.db.insert("contentGenJobs", {
      name: "FLUX-KL-ref02-rooftop-night-v1",
      modelName: "Amam",
      scene: "Rooftop at night, city lights background, moody atmosphere",
      provider: "Kling",
      status: "Done",
      outcome: "Rejected",
      completedAt: now - 86_400_000 - 3_000_000,
      durationSec: 198,
      thumbnailColor: "#2c3e50",
      createdAt: now - 86_400_000 - 3_200_000,
    });

    await ctx.db.insert("contentGenJobs", {
      name: "FLUX-HF-ref01-studio-closeup-v2",
      modelName: "Tyler",
      scene: "Studio setup, close-up portrait, professional lighting",
      provider: "Higgsfield",
      status: "Done",
      outcome: "Approved",
      completedAt: now - 86_400_000 - 6_000_000,
      durationSec: 211,
      thumbnailColor: "#c0392b",
      createdAt: now - 86_400_000 - 6_200_000,
    });

    return { seeded: 6 };
  },
});

// ═════════════════════════════════════════════════════════════════════════════
// Phase 3.1 — Internal mutations for Replicate / Kling integration
// ═════════════════════════════════════════════════════════════════════════════

// ── a) Insert a Queued contentGenJobs row from a Replicate dispatch ──────────

export const internalCreateJobFromReplicate = internalMutation({
  args: {
    modelName:            v.string(),
    brief:                v.string(),
    provider:             v.union(v.literal("FLUX"), v.literal("Kling"), v.literal("Higgsfield")),
    sceneId:              v.optional(v.id("scenes")),
    mode:                 v.union(v.literal("std"), v.literal("pro")),
    characterOrientation: v.union(v.literal("image"), v.literal("video")),
    keepOriginalSound:    v.boolean(),
  },
  handler: async (ctx, args) => {
    const jobId = await ctx.db.insert("contentGenJobs", {
      name:                 `KLING-${args.mode.toUpperCase()}-${Date.now().toString().slice(-6)}`,
      modelName:            args.modelName,
      scene:                args.brief,
      provider:             args.provider,
      status:               "Queued",
      progress:             0,
      mode:                 args.mode,
      characterOrientation: args.characterOrientation,
      keepOriginalSound:    args.keepOriginalSound,
      createdAt:            Date.now(),
    });

    // Link the scene to the job if provided
    if (args.sceneId) {
      await ctx.db.patch(args.sceneId, {
        generatedJobId: jobId,
        status: "Generating",
      });
    }

    return jobId;
  },
});

// ── b) Attach Replicate prediction ID to an existing job row ────────────────

export const internalAttachPrediction = internalMutation({
  args: {
    jobId:                 v.id("contentGenJobs"),
    replicatePredictionId: v.string(),
  },
  handler: async (ctx, { jobId, replicatePredictionId }) => {
    await ctx.db.patch(jobId, { replicatePredictionId });
  },
});

// ── c) Map Replicate webhook status to our schema ───────────────────────────

export const internalUpdateFromWebhook = internalMutation({
  args: {
    jobId:            v.id("contentGenJobs"),
    replicateStatus:  v.string(),
    logs:             v.optional(v.string()),
    output:           v.optional(v.string()),
    error:            v.optional(v.string()),
    metrics:          v.optional(v.any()),
  },
  handler: async (ctx, args) => {
    const job = await ctx.db.get(args.jobId);
    if (!job) return;

    const patch: Record<string, unknown> = {};

    // Store logs (truncate to 2000 chars)
    if (args.logs) {
      patch.replicateLogs = args.logs.slice(0, 2000);
    }

    switch (args.replicateStatus) {
      case "starting":
        patch.status = "Generating";
        patch.startedAt = Date.now();
        break;

      case "processing":
        patch.status = "Generating";
        if (args.metrics && typeof args.metrics === "object" && "predict_progress" in args.metrics) {
          const prog = Number(args.metrics.predict_progress);
          if (!isNaN(prog)) patch.progress = Math.round(prog * 100);
        }
        break;

      case "succeeded":
        // Stay "Generating" until downloadToR2 calls internalMarkDone.
        // Store ephemeral URL for reference.
        if (args.output) {
          patch.generatedVideoUrl = args.output;
        }
        break;

      case "failed":
      case "canceled":
        patch.status = "Failed";
        patch.errorMessage = args.error ?? (args.replicateStatus === "canceled" ? "canceled" : "unknown error");
        break;
    }

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    await ctx.db.patch(args.jobId, patch as any);
  },
});

// ── Public thin wrapper so webhook route (ConvexHttpClient) can call it ─────

export const updateFromWebhookPublic = mutation({
  args: {
    jobId:            v.id("contentGenJobs"),
    replicateStatus:  v.string(),
    logs:             v.optional(v.string()),
    output:           v.optional(v.string()),
    error:            v.optional(v.string()),
    metrics:          v.optional(v.any()),
  },
  handler: async (ctx, args) => {
    // Delegate to the internal mutation logic inline (can't call internal from mutation ctx)
    const job = await ctx.db.get(args.jobId);
    if (!job) return;

    const patch: Record<string, unknown> = {};

    if (args.logs) {
      patch.replicateLogs = args.logs.slice(0, 2000);
    }

    switch (args.replicateStatus) {
      case "starting":
        patch.status = "Generating";
        patch.startedAt = Date.now();
        break;

      case "processing":
        patch.status = "Generating";
        if (args.metrics && typeof args.metrics === "object" && "predict_progress" in args.metrics) {
          const prog = Number(args.metrics.predict_progress);
          if (!isNaN(prog)) patch.progress = Math.round(prog * 100);
        }
        break;

      case "succeeded":
        if (args.output) {
          patch.generatedVideoUrl = args.output;
        }
        break;

      case "failed":
      case "canceled":
        patch.status = "Failed";
        patch.errorMessage = args.error ?? (args.replicateStatus === "canceled" ? "canceled" : "unknown error");
        break;
    }

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    await ctx.db.patch(args.jobId, patch as any);
  },
});

// ── d) Finalise a completed job after R2 download ───────────────────────────

export const internalMarkDone = internalMutation({
  args: {
    jobId:              v.id("contentGenJobs"),
    generatedVideoR2Url: v.string(),
    durationSec:        v.optional(v.number()),
    costUsd:            v.optional(v.number()),
    sceneId:            v.optional(v.id("scenes")),
  },
  handler: async (ctx, args) => {
    await ctx.db.patch(args.jobId, {
      status:              "Done",
      progress:            100,
      completedAt:         Date.now(),
      generatedVideoR2Url: args.generatedVideoR2Url,
      durationSec:         args.durationSec,
      costUsd:             args.costUsd,
    });

    // Also patch the parent scene if provided
    if (args.sceneId) {
      const scene = await ctx.db.get(args.sceneId);
      if (scene) {
        await ctx.db.patch(args.sceneId, {
          generatedVideoUrl: args.generatedVideoR2Url,
          status: "Done",
        });
      }
    }
  },
});
