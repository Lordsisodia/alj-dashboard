import { query, mutation } from "./_generated/server";
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

// ── Create a new generation job ───────────────────────────────────────────────

export const createJob = mutation({
  args: {
    modelId:   v.id("models"),
    brief:     v.string(),
    generator: v.union(v.literal("flux"), v.literal("kling"), v.literal("higgsfield")),
    style:     v.string(),
    niche:     v.string(),
  },
  handler: async (ctx, args) => {
    return await ctx.db.insert("ideas", {
      modelId:           args.modelId,
      hook:              args.brief,
      style:             args.style,
      niche:             args.niche,
      campaign:          `gen:${args.generator}`,   // tag + encode generator
      steps:             [],
      camera:            "",
      onScreenText:      "",
      endShot:           "",
      captionSuggestion: "",
      hashtags:          [],
      status:            "generating",
    });
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
    });
  },
});

// ── Cancel a queued job ───────────────────────────────────────────────────────

export const cancelJob = mutation({
  args: { jobId: v.id("contentGenJobs") },
  handler: async (ctx, { jobId }) => {
    const job = await ctx.db.get(jobId);
    if (!job || job.status !== "Queued") return;
    await ctx.db.delete(jobId);
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
    await ctx.db.patch(jobId, { outcome });
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
