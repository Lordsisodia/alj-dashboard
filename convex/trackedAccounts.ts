import { mutation, query } from "./_generated/server";
import { v } from "convex/values";

// ── List all tracked accounts ─────────────────────────────────────────────────

export const list = query({
  args: {},
  handler: async (ctx) => {
    return ctx.db.query("trackedAccounts").collect();
  },
});

// ── Approve a candidate → insert into trackedAccounts ────────────────────────

export const approveCandidate = mutation({
  args: {
    handle:             v.string(),
    displayName:        v.string(),
    niche:              v.string(),
    avatarColor:        v.string(),
    followerCount:      v.number(),
    avgEngagementRate:  v.number(),
    // Extended signals (all optional — carry whatever the candidate has)
    avgViews:           v.optional(v.number()),
    outlierRatio:       v.optional(v.number()),
    highlightReelCount: v.optional(v.number()),
    postsPerWeek:       v.optional(v.number()),
    followsCount:       v.optional(v.number()),
    postsCount:         v.optional(v.number()),
    bio:                v.optional(v.string()),
    avatarUrl:          v.optional(v.string()),
    verified:           v.optional(v.boolean()),
    isPrivate:          v.optional(v.boolean()),
    isBusinessAccount:  v.optional(v.boolean()),
    externalUrl:        v.optional(v.string()),
    igtvVideoCount:     v.optional(v.number()),
    instagramId:        v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const existing = await ctx.db
      .query("trackedAccounts")
      .withIndex("by_handle", q => q.eq("handle", args.handle))
      .first();
    if (existing) {
      // Idempotent on repeat approves — still patch any newly-available fields
      const patch: Record<string, unknown> = {};
      for (const k of Object.keys(args) as (keyof typeof args)[]) {
        if (args[k] !== undefined && existing[k as keyof typeof existing] === undefined) {
          patch[k] = args[k];
        }
      }
      if (Object.keys(patch).length > 0) await ctx.db.patch(existing._id, patch);
      return { inserted: false, reason: "already tracked", id: existing._id };
    }

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
      ...(args.avgViews           !== undefined && { avgViews:           args.avgViews }),
      ...(args.outlierRatio       !== undefined && { outlierRatio:       args.outlierRatio }),
      ...(args.highlightReelCount !== undefined && { highlightReelCount: args.highlightReelCount }),
      ...(args.postsPerWeek       !== undefined && { postsPerWeek:       args.postsPerWeek }),
      ...(args.followsCount       !== undefined && { followsCount:       args.followsCount }),
      ...(args.postsCount         !== undefined && { postsCount:         args.postsCount }),
      ...(args.bio                !== undefined && { bio:                args.bio }),
      ...(args.avatarUrl          !== undefined && { avatarUrl:          args.avatarUrl }),
      ...(args.verified           !== undefined && { verified:           args.verified }),
      ...(args.isPrivate          !== undefined && { isPrivate:          args.isPrivate }),
      ...(args.isBusinessAccount  !== undefined && { isBusinessAccount:  args.isBusinessAccount }),
      ...(args.externalUrl        !== undefined && { externalUrl:        args.externalUrl }),
      ...(args.igtvVideoCount     !== undefined && { igtvVideoCount:     args.igtvVideoCount }),
      ...(args.instagramId        !== undefined && { instagramId:        args.instagramId }),
    });
    return { inserted: true, id };
  },
});

// ── One-time backfill: copy missing signals from creatorCandidates ────────────

export const backfillFromCandidates = mutation({
  args: {},
  handler: async (ctx) => {
    const accounts = await ctx.db.query("trackedAccounts").collect();
    const candidates = await ctx.db.query("creatorCandidates").collect();
    const candByHandle = new Map(candidates.map(c => [c.handle, c]));

    let patched = 0;
    const fields = [
      'avgViews', 'outlierRatio', 'highlightReelCount', 'postsPerWeek',
      'followsCount', 'postsCount', 'bio', 'avatarUrl', 'verified',
      'isPrivate', 'isBusinessAccount', 'externalUrl', 'igtvVideoCount', 'instagramId',
    ] as const;

    for (const acc of accounts) {
      const cand = candByHandle.get(acc.handle);
      if (!cand) continue;
      const patch: Record<string, unknown> = {};
      for (const f of fields) {
        if (acc[f as keyof typeof acc] === undefined && cand[f as keyof typeof cand] !== undefined) {
          patch[f] = cand[f as keyof typeof cand];
        }
      }
      if (Object.keys(patch).length > 0) {
        await ctx.db.patch(acc._id, patch);
        patched++;
      }
    }
    return { patched, totalAccounts: accounts.length };
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

export const setFailed = mutation({
  args: { handle: v.string() },
  handler: async (ctx, { handle }) => {
    const acc = await ctx.db
      .query("trackedAccounts")
      .withIndex("by_handle", q => q.eq("handle", handle))
      .first();
    if (acc) await ctx.db.patch(acc._id, { status: "failed", enrichStatus: "error" });
  },
});

// Mark account as likely private — visible but excluded from active pipeline
export const setPaused = mutation({
  args: { handle: v.string() },
  handler: async (ctx, { handle }) => {
    const acc = await ctx.db
      .query("trackedAccounts")
      .withIndex("by_handle", q => q.eq("handle", handle))
      .first();
    if (acc) await ctx.db.patch(acc._id, { status: "paused", isPrivate: true });
  },
});

export const remove = mutation({
  args: { handle: v.string() },
  handler: async (ctx, { handle }) => {
    const acc = await ctx.db
      .query("trackedAccounts")
      .withIndex("by_handle", q => q.eq("handle", handle))
      .first();
    if (acc) await ctx.db.delete(acc._id);
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

// ── Sync enriched data to trackedAccounts (unconditional overwrite) ──────────────────────────
// Called after enrich-candidate API succeeds — overwrites ALL provided fields so placeholder
// values (0, empty string) get replaced with real Apify data.

// Returns handles that have no avatar or still have a raw CDN URL (not yet on R2)
export const getAccountsNeedingAvatar = query({
  args: {},
  handler: async (ctx) => {
    const accounts = await ctx.db.query("trackedAccounts").collect();
    return accounts
      .filter(a => {
        if (!a.avatarUrl) return true;
        const u = a.avatarUrl;
        return u.includes('cdninstagram.com') || u.includes('fbcdn.net') || u.includes('instagram.com');
      })
      .map(a => ({ handle: a.handle, avatarUrl: a.avatarUrl ?? null }));
  },
});

export const syncEnrichedToTracked = mutation({
  args: {
    handle:             v.string(),
    displayName:        v.optional(v.string()),
    followerCount:      v.optional(v.number()),
    avgEngagementRate: v.optional(v.number()),
    avgViews:          v.optional(v.number()),
    outlierRatio:      v.optional(v.number()),
    highlightReelCount: v.optional(v.number()),
    postsPerWeek:      v.optional(v.number()),
    followsCount:      v.optional(v.number()),
    postsCount:        v.optional(v.number()),
    bio:               v.optional(v.string()),
    avatarUrl:         v.optional(v.string()),
    verified:          v.optional(v.boolean()),
    isPrivate:         v.optional(v.boolean()),
    isBusinessAccount: v.optional(v.boolean()),
    externalUrl:       v.optional(v.string()),
    igtvVideoCount:   v.optional(v.number()),
    instagramId:       v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const acc = await ctx.db
      .query("trackedAccounts")
      .withIndex("by_handle", q => q.eq("handle", args.handle))
      .first();
    if (!acc) return null;

    const patch: Record<string, unknown> = { enrichStatus: "done", enrichedAt: Date.now() };
    for (const k of Object.keys(args) as (keyof typeof args)[]) {
      if (k === 'handle') continue;
      if (args[k] !== undefined) patch[k] = args[k];
    }
    await ctx.db.patch(acc._id, patch);
    return acc._id;
  },
});

// Recompute avgEngagementRate for all accounts from their actual scraped posts
export const recomputeEngagementRates = mutation({
  args: {},
  handler: async (ctx) => {
    const accounts = await ctx.db.query("trackedAccounts").collect();
    const posts    = await ctx.db.query("scrapedPosts").collect();

    let updated = 0;
    for (const acc of accounts) {
      const accPosts = posts.filter(p => p.handle === acc.handle && p.engagementRate > 0);
      if (accPosts.length === 0) continue;

      const avgER = parseFloat(
        (accPosts.reduce((s, p) => s + p.engagementRate, 0) / accPosts.length).toFixed(6)
      );
      if (Math.abs(avgER - (acc.avgEngagementRate ?? 0)) > 0.0001) {
        await ctx.db.patch(acc._id, { avgEngagementRate: avgER });
        updated++;
      }
    }
    return { checked: accounts.length, updated };
  },
});
