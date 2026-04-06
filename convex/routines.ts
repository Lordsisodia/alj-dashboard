import { query, mutation } from "./_generated/server";
import { v } from "convex/values";

export const list = query({
  args: {},
  handler: async (ctx) => {
    const rows = await ctx.db.query("routines").collect();
    return rows.sort((a, b) => b.createdAt - a.createdAt);
  },
});

export const create = mutation({
  args: {
    title: v.string(),
    description: v.optional(v.string()),
    assigneeAgent: v.optional(v.string()),
    concurrencyPolicy: v.string(),
    catchUpPolicy: v.string(),
  },
  handler: async (ctx, args) => {
    await ctx.db.insert("routines", {
      ...args,
      concurrencyPolicy: args.concurrencyPolicy as "coalesce_if_active" | "always_enqueue" | "skip_if_active",
      catchUpPolicy: args.catchUpPolicy as "skip_missed" | "enqueue_missed",
      status: "active",
      createdAt: Date.now(),
    });
  },
});

export const setStatus = mutation({
  args: { id: v.id("routines"), status: v.union(v.literal("active"), v.literal("paused"), v.literal("archived")) },
  handler: async (ctx, { id, status }) => {
    await ctx.db.patch(id, { status });
  },
});

export const seed = mutation({
  args: {},
  handler: async (ctx) => {
    const existing = await ctx.db.query("routines").first();
    if (existing) return;
    const now = Date.now();
    const rows = [
      { title: "Daily Competitor Scrape", assigneeAgent: "Recon Scraper #1", status: "active" as const, description: "Scrape all tracked competitor accounts and index new posts into Intelligence.", lastRunAt: now - 2 * 60 * 60 * 1000, lastRunStatus: "succeeded" },
      { title: "Weekly Intelligence Report", assigneeAgent: "Intelligence Indexer", status: "active" as const, description: "Generate weekly insights report from the past 7 days of scraped data.", lastRunAt: now - 24 * 60 * 60 * 1000, lastRunStatus: "succeeded" },
      { title: "Post Scheduler Sync", assigneeAgent: "Post Scheduler Bot", status: "active" as const, description: "Sync upcoming scheduled posts and confirm pipeline readiness.", lastRunAt: now - 6 * 60 * 60 * 1000, lastRunStatus: "succeeded" },
      { title: "Nightly Engagement Pull", assigneeAgent: "Recon Scraper #2", status: "paused" as const, description: "Pull engagement metrics from all model accounts overnight.", lastRunAt: now - 3 * 24 * 60 * 60 * 1000, lastRunStatus: "failed" },
    ];
    for (const row of rows) {
      await ctx.db.insert("routines", { ...row, concurrencyPolicy: "coalesce_if_active", catchUpPolicy: "skip_missed", createdAt: now });
    }
  },
});
