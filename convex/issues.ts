import { query, mutation } from "./_generated/server";
import { v } from "convex/values";

export const list = query({
  args: {},
  handler: async (ctx) => {
    const rows = await ctx.db.query("issues").collect();
    return rows.sort((a, b) => b.updatedAt - a.updatedAt);
  },
});

export const create = mutation({
  args: {
    title: v.string(),
    description: v.optional(v.string()),
    priority: v.union(v.literal("low"), v.literal("medium"), v.literal("high"), v.literal("urgent")),
    assigneeAgent: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const all = await ctx.db.query("issues").collect();
    const identifier = `ISSO-${all.length + 1}`;
    const now = Date.now();
    await ctx.db.insert("issues", { ...args, status: "todo", identifier, createdAt: now, updatedAt: now });
  },
});

export const updateStatus = mutation({
  args: { id: v.id("issues"), status: v.union(v.literal("backlog"), v.literal("todo"), v.literal("in_progress"), v.literal("in_review"), v.literal("blocked"), v.literal("done")) },
  handler: async (ctx, { id, status }) => {
    await ctx.db.patch(id, { status, updatedAt: Date.now() });
  },
});

export const seed = mutation({
  args: {},
  handler: async (ctx) => {
    const existing = await ctx.db.query("issues").first();
    if (existing) return;
    const now = Date.now();
    const rows = [
      { identifier: "ISSO-1", title: "Set up FLUX face reference pipeline", priority: "urgent" as const, status: "in_progress" as const, assigneeAgent: "Recon Scraper #1", description: "Configure FLUX pipeline with face reference images for each model." },
      { identifier: "ISSO-2", title: "Integrate Kling API for video generation", priority: "high" as const, status: "todo" as const, assigneeAgent: "Intelligence Indexer", description: "Wire Kling API into content gen pipeline after FLUX image step." },
      { identifier: "ISSO-3", title: "Automate Google Drive folder delivery", priority: "high" as const, status: "in_review" as const, assigneeAgent: "Post Scheduler Bot", description: "Auto-upload finished videos to the correct model subfolder in Drive." },
      { identifier: "ISSO-4", title: "Caption generation from reel transcript", priority: "medium" as const, status: "todo" as const, description: "Extract transcript from reel and generate caption + hashtags automatically." },
      { identifier: "ISSO-5", title: "Build Higgsfield fallback for Kling failures", priority: "medium" as const, status: "backlog" as const, description: "If Kling generation fails, auto-retry with Higgsfield as fallback provider." },
      { identifier: "ISSO-6", title: "Approval workflow mobile view", priority: "low" as const, status: "done" as const, assigneeAgent: "Post Scheduler Bot", description: "Make the approval card readable and actionable on mobile screens." },
    ];
    for (const row of rows) {
      await ctx.db.insert("issues", { ...row, createdAt: now - Math.random() * 7 * 86400000, updatedAt: now - Math.random() * 86400000 });
    }
  },
});
