import { query, mutation } from "./_generated/server";
import { v } from "convex/values";

// ── Save an upload record after R2 success ────────────────────────────────────

export const save = mutation({
  args: {
    r2Key:      v.string(),
    url:        v.string(),
    filename:   v.string(),
    mimeType:   v.string(),
    sizeBytes:  v.number(),
    context:    v.union(
      v.literal("tool_upload"),
      v.literal("gen_result"),
      v.literal("scrape")
    ),
    label:      v.optional(v.string()),
    analysisId: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    return ctx.db.insert("mediaUploads", {
      ...args,
      uploadedAt: Date.now(),
    });
  },
});

// ── List uploads, newest first ────────────────────────────────────────────────

export const list = query({
  args: {
    limit:   v.optional(v.number()),
    context: v.optional(v.union(
      v.literal("tool_upload"),
      v.literal("gen_result"),
      v.literal("scrape")
    )),
  },
  handler: async (ctx, { limit = 100, context }) => {
    const q = context
      ? ctx.db.query("mediaUploads").withIndex("by_context", q => q.eq("context", context))
      : ctx.db.query("mediaUploads").withIndex("by_uploaded_at");
    return q.order("desc").take(limit);
  },
});
