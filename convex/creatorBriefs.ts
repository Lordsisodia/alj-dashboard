import { mutation, query } from './_generated/server';
import { v } from 'convex/values';

export const save = mutation({
  args: {
    handle:            v.string(),
    displayName:        v.string(),
    niche:             v.string(),
    contentScore:      v.number(),
    consistencyScore:  v.number(),
    monetizationRating: v.number(),
    topHooks:          v.array(v.string()),
    contentPatterns:   v.array(v.string()),
    overallVerdict:   v.string(),
    recommendation:   v.string(),
    followerCount:     v.number(),
    engagementRate:   v.number(),
    postsThisWeek:     v.number(),
    source:           v.string(),
    generatedAt:       v.number(),
  },
  handler: async (ctx, args) => {
    // Upsert — replace existing brief for this handle with latest
    const existing = await ctx.db
      .query('creatorBriefs')
      .withIndex('by_handle', q => q.eq('handle', args.handle))
      .first();

    if (existing) {
      await ctx.db.patch(existing._id, args);
      return existing._id;
    }

    return await ctx.db.insert('creatorBriefs', args);
  },
});

export const getByHandle = query({
  args: { handle: v.string() },
  handler: async (ctx, { handle }) => {
    const briefs = await ctx.db
      .query('creatorBriefs')
      .withIndex('by_handle', q => q.eq('handle', handle))
      .collect();
    // Return the most recent one
    return briefs.sort((a, b) => b.generatedAt - a.generatedAt)[0] ?? null;
  },
});

export const getRecent = query({
  args: { limit: v.optional(v.number()) },
  handler: async (ctx, { limit }) => {
    const all = await ctx.db
      .query('creatorBriefs')
      .withIndex('by_generated_at')
      .collect();
    return all
      .sort((a, b) => b.generatedAt - a.generatedAt)
      .slice(0, limit ?? 20);
  },
});
