import { mutation, query } from "./_generated/server";
import { v } from "convex/values";

// ── Approve a candidate → insert into trackedAccounts ────────────────────────

export const approveCandidate = mutation({
  args: {
    handle:        v.string(),
    displayName:   v.string(),
    niche:         v.string(),
    avatarColor:   v.string(),
    followerCount: v.number(),
    avgEngagementRate: v.number(),
  },
  handler: async (ctx, args) => {
    // Dedup - skip if already tracked
    const existing = await ctx.db
      .query("trackedAccounts")
      .withIndex("by_handle", q => q.eq("handle", args.handle))
      .first();
    if (existing) return { inserted: false, reason: "already tracked" };

    const id = await ctx.db.insert("trackedAccounts", {
      handle:            args.handle,
      displayName:       args.displayName,
      platform:          "instagram",
      niche:             args.niche,
      avatarColor:       args.avatarColor,
      followerCount:     args.followerCount,
      avgEngagementRate: args.avgEngagementRate,
      status:            "active",
      postsScraped:      0,
      isOwn:             false,
      enrichStatus:      "idle",
    });
    return { inserted: true, id };
  },
});

// ── Check if a handle is already tracked (for dedup UI) ──────────────────────

export const isTracked = query({
  args: { handle: v.string() },
  handler: async (ctx, { handle }) => {
    const acc = await ctx.db
      .query("trackedAccounts")
      .withIndex("by_handle", q => q.eq("handle", handle))
      .first();
    return !!acc;
  },
});

const EnrichStatus = v.union(
  v.literal("idle"),
  v.literal("enriching"),
  v.literal("done"),
  v.literal("error"),
);

export const setEnrichStatus = mutation({
  args: { handle: v.string(), status: EnrichStatus },
  handler: async (ctx, { handle, status }) => {
    const acc = await ctx.db
      .query("trackedAccounts")
      .withIndex("by_handle", q => q.eq("handle", handle))
      .first();
    if (acc) await ctx.db.patch(acc._id, { enrichStatus: status });
  },
});

export const upsertEnriched = mutation({
  args: {
    handle:                v.string(),
    followerCount:         v.number(),
    followsCount:          v.optional(v.number()),
    postsCount:            v.optional(v.number()),
    bio:                   v.optional(v.string()),
    avatarUrl:             v.optional(v.string()),
    avgEngagementRate:     v.optional(v.number()),
    displayName:           v.optional(v.string()),
    verified:              v.optional(v.boolean()),
    externalUrl:           v.optional(v.string()),
    isBusinessAccount:     v.optional(v.boolean()),
    isProfessionalAccount: v.optional(v.boolean()),
    businessCategoryName:  v.optional(v.string()),
    businessEmail:         v.optional(v.string()),
    isPrivate:             v.optional(v.boolean()),
    igtvVideoCount:        v.optional(v.number()),
    instagramId:           v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const acc = await ctx.db
      .query("trackedAccounts")
      .withIndex("by_handle", q => q.eq("handle", args.handle))
      .first();

    const patch = {
      followerCount:  args.followerCount,
      enrichStatus:   "done" as const,
      enrichedAt:     Date.now(),
      ...(args.followsCount          != null && { followsCount:          args.followsCount          }),
      ...(args.postsCount            != null && { postsCount:            args.postsCount            }),
      ...(args.bio                   != null && { bio:                   args.bio                   }),
      ...(args.avatarUrl             != null && { avatarUrl:             args.avatarUrl             }),
      ...(args.displayName           != null && { displayName:           args.displayName           }),
      ...(args.verified              != null && { verified:              args.verified              }),
      ...(args.avgEngagementRate     != null && { avgEngagementRate:     args.avgEngagementRate     }),
      ...(args.externalUrl           != null && { externalUrl:           args.externalUrl           }),
      ...(args.isBusinessAccount     != null && { isBusinessAccount:     args.isBusinessAccount     }),
      ...(args.isProfessionalAccount != null && { isProfessionalAccount: args.isProfessionalAccount }),
      ...(args.businessCategoryName  != null && { businessCategoryName:  args.businessCategoryName  }),
      ...(args.businessEmail         != null && { businessEmail:         args.businessEmail         }),
      ...(args.isPrivate             != null && { isPrivate:             args.isPrivate             }),
      ...(args.igtvVideoCount        != null && { igtvVideoCount:        args.igtvVideoCount        }),
      ...(args.instagramId           != null && { instagramId:           args.instagramId           }),
    };

    if (acc) {
      await ctx.db.patch(acc._id, patch);
      return acc._id;
    }

    return await ctx.db.insert("trackedAccounts", {
      handle:            args.handle,
      platform:          "instagram",
      niche:             "Unknown",
      avatarColor:       "#833ab4",
      status:            "active",
      postsScraped:      0,
      avgEngagementRate: args.avgEngagementRate ?? 0,
      isOwn:             false,
      ...patch,
    });
  },
});
