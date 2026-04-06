import { mutation, query } from "./_generated/server";
import { v } from "convex/values";

export const list = query({
  handler: async (ctx) => {
    return await ctx.db
      .query("featureRequests")
      .withIndex("by_submitted")
      .order("desc")
      .collect();
  },
});

export const create = mutation({
  args: {
    title:       v.string(),
    description: v.string(),
    priority:    v.union(v.literal("Low"), v.literal("Medium"), v.literal("High")),
  },
  handler: async (ctx, args) => {
    return await ctx.db.insert("featureRequests", {
      title:       args.title,
      description: args.description,
      requestedBy: "Shaan S.",
      submittedAt: Date.now(),
      status:      "Queued",
      eta:         "72hr SLA",
      priority:    args.priority,
    });
  },
});

// Idempotent - only runs if the table is empty
export const seed = mutation({
  handler: async (ctx) => {
    const existing = await ctx.db.query("featureRequests").first();
    if (existing) return;

    const items = [
      {
        title:       "Auto-caption generation for Reels",
        description: "Automatically generate captions with relevant hashtags when scheduling a new reel, based on niche and content tags.",
        requestedBy: "Shaan S.",
        submittedAt: new Date("Apr 4, 2026").getTime(),
        status:      "In Progress" as const,
        eta:         "Apr 10, 2026",
        priority:    "High" as const,
      },
      {
        title:       "Competitor content alerts",
        description: "Push notification when a tracked competitor posts content that exceeds a set engagement threshold.",
        requestedBy: "Shaan S.",
        submittedAt: new Date("Apr 2, 2026").getTime(),
        status:      "Queued" as const,
        eta:         "72hr SLA",
        priority:    "Medium" as const,
      },
      {
        title:       "Board sharing via link",
        description: "Allow boards in Intelligence to be shared externally via a read-only link for client presentations.",
        requestedBy: "Shaan S.",
        submittedAt: new Date("Mar 30, 2026").getTime(),
        status:      "Delivered" as const,
        eta:         "Shipped",
        priority:    "Low" as const,
      },
      {
        title:       "CSV export for recon data",
        description: "Export competitor stats (followers, engagement rate, posts/week) as a downloadable CSV for reporting.",
        requestedBy: "Shaan S.",
        submittedAt: new Date("Mar 28, 2026").getTime(),
        status:      "Queued" as const,
        eta:         "72hr SLA",
        priority:    "Low" as const,
      },
    ];

    for (const item of items) {
      await ctx.db.insert("featureRequests", item);
    }
  },
});
