import { mutation, query } from "./_generated/server";
import { v } from "convex/values";

// mutation: record a swipe
export const recordSwipe = mutation({
  args: {
    postId:  v.id("scrapedPosts"),
    ratedBy: v.string(),
    rating:  v.union(v.literal("up"), v.literal("down"), v.literal("save")),
    tags:    v.optional(v.any()),
  },
  handler: async (ctx, args) => {
    await ctx.db.insert("swipeRatings", {
      postId:   args.postId,
      ratedBy:  args.ratedBy,
      rating:   args.rating,
      ratedAt:  Date.now(),
    });
  },
});

// query: get recent ratings with joined post + account data for history view
export const getSwipeHistory = query({
  args: { limit: v.optional(v.number()) },
  handler: async (ctx, { limit = 50 }) => {
    const ratings = await ctx.db.query("swipeRatings")
      .order("desc")
      .take(limit ?? 50);
    return Promise.all(ratings.map(async (r) => {
      const post = await ctx.db.get(r.postId);
      const account = post?.accountId ? await ctx.db.get(post.accountId) : null;
      return { ...r, post: post ? { ...post, account } : null };
    }));
  },
});

// query: get unrated posts for the swipe queue (joined with trackedAccounts for avatar)
export const getSwipeQueue = query({
  args: {},
  handler: async (ctx) => {
    const rated    = await ctx.db.query("swipeRatings").collect();
    const ratedIds = new Set(rated.map((r) => r.postId));
    const posts    = await ctx.db.query("scrapedPosts")
      .withIndex("by_engagement")
      .order("desc")
      .take(50);
    const filtered = posts.filter((p) => !ratedIds.has(p._id));
    return Promise.all(filtered.map(async (p) => ({
      ...p,
      account: p.accountId ? await ctx.db.get(p.accountId) : null,
    })));
  },
});
