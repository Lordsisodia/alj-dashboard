import { query, mutation } from "./_generated/server";
import { v } from "convex/values";

// ── List candidates by status ─────────────────────────────────────────────────

export const list = query({
  args: { status: v.optional(v.union(v.literal('pending'), v.literal('approved'), v.literal('rejected'))) },
  handler: async (ctx, { status }) => {
    if (status) {
      return ctx.db.query("creatorCandidates").withIndex("by_status", q => q.eq("status", status)).collect();
    }
    return ctx.db.query("creatorCandidates").order("desc").collect();
  },
});

// ── Upsert a candidate (deduped by handle) ────────────────────────────────────

export const upsert = mutation({
  args: {
    handle:            v.string(),
    displayName:       v.string(),
    niche:             v.optional(v.string()),
    followerCount:     v.optional(v.number()),
    followsCount:      v.optional(v.number()),
    postsCount:        v.optional(v.number()),
    bio:               v.optional(v.string()),
    avatarUrl:         v.optional(v.string()),
    avgEngagementRate: v.optional(v.number()),
    avgViews:          v.optional(v.number()),
    outlierRatio:      v.optional(v.number()),
    postsPerWeek:      v.optional(v.number()),
    verified:           v.optional(v.boolean()),
    isPrivate:          v.optional(v.boolean()),
    isBusinessAccount:  v.optional(v.boolean()),
    instagramId:        v.optional(v.string()),
    externalUrl:        v.optional(v.string()),
    highlightReelCount: v.optional(v.number()),
    igtvVideoCount:     v.optional(v.number()),
    status:            v.union(v.literal('pending'), v.literal('approved'), v.literal('rejected')),
    source:            v.union(v.literal('pre_approved'), v.literal('scraper'), v.literal('manual')),
    suggestedBy:       v.optional(v.string()),
    aiScore:           v.optional(v.number()),
    aiVerdict:         v.optional(v.union(v.literal('HIRE'), v.literal('WATCH'), v.literal('PASS'))),
    aiReason:          v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const existing = await ctx.db
      .query("creatorCandidates")
      .withIndex("by_handle", q => q.eq("handle", args.handle))
      .first();

    // Check blocklist — skip if handle was previously rejected
    const handleNorm = args.handle.toLowerCase();
    const blocked = await ctx.db
      .query("blockedHandles")
      .withIndex("by_handle", q => q.eq("handle", handleNorm))
      .first();
    if (blocked) return null;

    if (existing) {
      // Only update if we have better data (don't overwrite approved with pending)
      if (existing.status === 'approved' && args.status === 'pending') return existing._id;
      await ctx.db.patch(existing._id, {
        ...args,
        addedAt: existing.addedAt, // preserve original discovery time
      });
      return existing._id;
    }

    return ctx.db.insert("creatorCandidates", {
      ...args,
      addedAt:      Date.now(),
      enrichStatus: 'idle',
    });
  },
});

// ── Update status (approve / reject) ─────────────────────────────────────────

export const updateStatus = mutation({
  args: {
    id:     v.id("creatorCandidates"),
    status: v.union(v.literal('pending'), v.literal('approved'), v.literal('rejected')),
  },
  handler: async (ctx, { id, status }) => {
    await ctx.db.patch(id, { status });
  },
});

// ── Patch AI verdict onto a candidate ─────────────────────────────────────────

export const patchVerdict = mutation({
  args: {
    id:        v.id("creatorCandidates"),
    aiScore:   v.number(),
    aiVerdict: v.union(v.literal('HIRE'), v.literal('WATCH'), v.literal('PASS')),
    aiReason:  v.string(),
  },
  handler: async (ctx, { id, aiScore, aiVerdict, aiReason }) => {
    await ctx.db.patch(id, { aiScore, aiVerdict, aiReason });
  },
});

// ── Mark enrich status ────────────────────────────────────────────────────────

export const setEnrichStatus = mutation({
  args: {
    id:     v.id("creatorCandidates"),
    status: v.union(v.literal('idle'), v.literal('enriching'), v.literal('done'), v.literal('error')),
  },
  handler: async (ctx, { id, status }) => {
    await ctx.db.patch(id, { enrichStatus: status, ...(status === 'done' ? { enrichedAt: Date.now() } : {}) });
  },
});

// ── Clear duplicate pending candidates (keeps first occurrence) ────────────────

export const clearDuplicates = mutation({
  args: {},
  handler: async (ctx) => {
    const all = await ctx.db.query("creatorCandidates").collect();
    const seen = new Map<string, string>();
    for (const c of all) {
      if (c.status !== 'pending') continue;
      const k = c.handle.toLowerCase();
      if (!seen.has(k)) {
        seen.set(k, c._id);
      } else {
        await ctx.db.patch(c._id, { status: 'rejected' });
      }
    }
  },
});

// ── Bulk seed pre-approved accounts ──────────────────────────────────────────

export const seedPreApproved = mutation({
  args: {
    accounts: v.array(v.object({
      handle:      v.string(),
      displayName: v.string(),
      niche:       v.string(),
    })),
  },
  handler: async (ctx, { accounts }) => {
    let inserted = 0;
    for (const acc of accounts) {
      const existing = await ctx.db
        .query("creatorCandidates")
        .withIndex("by_handle", q => q.eq("handle", acc.handle))
        .first();
      if (existing) continue;

      await ctx.db.insert("creatorCandidates", {
        handle:      acc.handle,
        displayName: acc.displayName,
        niche:       acc.niche,
        status:      'approved',
        source:      'pre_approved',
        addedAt:     Date.now(),
        enrichStatus: 'idle',
      });
      inserted++;
    }
    return { inserted };
  },
});

// ── List blocked handles ──────────────────────────────────────────────────────

export const listBlocked = query({
  args: {},
  handler: async (ctx) => {
    return ctx.db.query("blockedHandles").collect();
  },
});

// ── Delete a candidate and add handle to blocklist ────────────────────────────

export const deleteAndBlock = mutation({
  args: { id: v.id("creatorCandidates") },
  handler: async (ctx, { id }) => {
    const doc = await ctx.db.get(id);
    if (!doc) return;
    const handle = doc.handle.toLowerCase();
    // Only insert if not already blocked
    const existing = await ctx.db
      .query("blockedHandles")
      .withIndex("by_handle", q => q.eq("handle", handle))
      .first();
    if (!existing) {
      await ctx.db.insert("blockedHandles", { handle, blockedAt: Date.now() });
    }
    await ctx.db.delete(id);
  },
});
