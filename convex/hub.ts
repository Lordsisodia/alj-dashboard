import { mutation, query } from "./_generated/server";
import { v } from "convex/values";

function humanise(s: string): string {
  return s.replace(/_/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase());
}

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

// query: get unrated posts for the swipe queue (joined with trackedAccounts for avatar + postAnalyses for AI data)
export const getSwipeQueue = query({
  args: {},
  handler: async (ctx) => {
    const rated    = await ctx.db.query("swipeRatings").collect();
    const ratedIds = new Set(rated.map((r) => r.postId));
    const posts    = await ctx.db.query("scrapedPosts")
      .withIndex("by_engagement")
      .order("desc")
      .take(200);
    const filtered = posts.filter((p) => !ratedIds.has(p._id));

    const enriched = await Promise.all(filtered.map(async (p) => {
      const account = p.accountId ? await ctx.db.get(p.accountId) : null;
      const postAnalysis = await ctx.db
        .query("postAnalyses")
        .withIndex("by_post_id", (q) => q.eq("postId", p._id))
        .first();

      let derivedAnalysis: {
        hookScore: number;
        hookLine: string;
        emotions: string[];
        breakdown: string;
        suggestions: string[];
        transcript?: string;
      } | null = null;

      if (p.aiAnalysis) {
        derivedAnalysis = {
          hookScore:   p.aiAnalysis.hookScore,
          hookLine:    p.aiAnalysis.hookLine,
          emotions:    p.aiAnalysis.emotions,
          breakdown:   p.aiAnalysis.breakdown,
          suggestions: p.aiAnalysis.suggestions,
          transcript:  p.aiAnalysis.transcript,
        };
      } else if (postAnalysis) {
        const pa = postAnalysis;

        const hookLine =
          pa.spokenFirstWords ??
          pa.onScreenTextFirstFrame ??
          humanise(pa.hookStructure);

        const emotions = (
          [pa.vibeKeyword, pa.creatorExpressedEmotion] as Array<string | undefined>
        ).filter((x): x is string => !!x && x !== 'unknown');

        const breakdown =
          `${humanise(pa.formatPrimary)} filmed in a ${humanise(pa.setting)} setting. ` +
          `Hook: ${humanise(pa.hookStructure)} via ${humanise(pa.hookModality)}. ` +
          `Energy level ${pa.energyLevel}/100. Face: ${humanise(pa.faceVisibility)}.` +
          (pa.curiosityGapPresent ? ' Contains a curiosity gap.' : '') +
          (pa.patternInterruptPresent ? ' Has a pattern interrupt.' : '') +
          (pa.directAddress ? ' Creator addresses viewer directly.' : '');

        const suggestions: string[] = [];
        if (pa.curiosityGapPresent) suggestions.push("Use a curiosity gap in your hook");
        if (pa.patternInterruptPresent) suggestions.push("Recreate the pattern interrupt to stop the scroll");
        if (pa.captionHasCTA && pa.ctaType !== 'none') suggestions.push(`Include a ${pa.ctaType} CTA in your caption`);
        if (pa.musicEnergy !== 'none') suggestions.push(`Match the ${pa.musicEnergy}-energy music`);
        if (pa.hasSpeedRamps) suggestions.push("Use speed ramps in the edit");
        suggestions.push(`Mirror the ${humanise(pa.formatPrimary)} format and ${humanise(pa.setting)} setting`);

        derivedAnalysis = {
          hookScore:   pa.energyLevel,
          hookLine,
          emotions,
          breakdown,
          suggestions: suggestions.slice(0, 5),
          transcript:  pa.transcript,
        };
      }

      return { ...p, account, derivedAnalysis };
    }));

    return enriched;
  },
});

// query: KPIs for the Hub Dashboard tab
export const getDashboardKpis = query({
  args: {},
  handler: async (ctx) => {
    const allRatings = await ctx.db.query("swipeRatings").collect();
    const ratedIds   = new Set(allRatings.map((r) => r.postId));
    const allPosts   = await ctx.db.query("scrapedPosts").collect();
    const inQueue    = allPosts.filter((p) => !ratedIds.has(p._id)).length;

    const weekAgo      = Date.now() - 7 * 24 * 60 * 60 * 1000;
    const sentThisWeek = allRatings.filter(
      (r) => r.rating === "save" && r.ratedAt > weekAgo
    ).length;

    const ups   = allRatings.filter((r) => r.rating === "up").length;
    const downs = allRatings.filter((r) => r.rating === "down").length;
    const approvalRate = ups + downs > 0 ? Math.round((ups / (ups + downs)) * 100) : 0;

    const accounts  = await ctx.db.query("trackedAccounts").collect();
    const validTs   = accounts.map((a) => a.lastScrapedAt).filter((t): t is number => t != null);
    const lastScrapedAt = validTs.length > 0 ? Math.max(...validTs) : null;

    const vaulted  = allPosts.length;
    const approved = allPosts.filter((p) => p.saved === true).length;
    const saved    = allPosts.filter((p) => p.savedForPipeline === true).length;

    return { inQueue, sentThisWeek, approvalRate, lastScrapedAt, vaulted, approved, saved };
  },
});

// query: stats for the most recent session (last 24h of swipe activity)
export const getLastSessionStats = query({
  args: {},
  handler: async (ctx) => {
    const dayAgo  = Date.now() - 24 * 60 * 60 * 1000;
    const ratings = await ctx.db.query("swipeRatings").collect();
    const recent  = ratings.filter((r) => r.ratedAt > dayAgo);
    const rated   = recent.filter((r) => r.rating === "up").length;
    const passed  = recent.filter((r) => r.rating === "down").length;
    const sent    = recent.filter((r) => r.rating === "save").length;
    return { rated, passed, sent };
  },
});

// query: last 10 swipe ratings with post niche + handle
export const getRecentActivity = query({
  args: {},
  handler: async (ctx) => {
    const ratings = await ctx.db.query("swipeRatings").order("desc").take(10);
    return Promise.all(
      ratings.map(async (r) => {
        const post = await ctx.db.get(r.postId);
        return {
          handle:        post?.handle ?? "",
          decision:      r.rating as "up" | "down" | "save",
          niche:         post?.niche  ?? "",
          _creationTime: r.ratedAt,
        };
      })
    );
  },
});

// query: count of unrated posts per niche
export const getNicheQueueCounts = query({
  args: {},
  handler: async (ctx) => {
    const allRatings = await ctx.db.query("swipeRatings").collect();
    const ratedIds   = new Set(allRatings.map((r) => r.postId));
    const allPosts   = await ctx.db.query("scrapedPosts").collect();
    const unrated    = allPosts.filter((p) => !ratedIds.has(p._id));
    const counts: Record<string, number> = {};
    for (const p of unrated) {
      counts[p.niche] = (counts[p.niche] ?? 0) + 1;
    }
    return Object.entries(counts).map(([niche, count]) => ({ niche, count }));
  },
});

// query: last 5 'save' ratings with post info for the Send Queue panel
export const getSendQueue = query({
  args: {},
  handler: async (ctx) => {
    const ratings = await ctx.db.query("swipeRatings").order("desc").take(200);
    const saves   = ratings.filter((r) => r.rating === "save").slice(0, 5);
    return Promise.all(
      saves.map(async (r) => {
        const post = await ctx.db.get(r.postId);
        return {
          handle:       post?.handle       ?? "",
          thumbnailUrl: post?.thumbnailUrl ?? "",
          niche:        post?.niche        ?? "",
          savedAt:      r.ratedAt,
        };
      })
    );
  },
});

// query: funnel stats for the hub queue strip
export const getHubQueueStats = query({
  args: {},
  handler: async (ctx) => {
    const allPosts   = await ctx.db.query("scrapedPosts").collect();
    const ratings    = await ctx.db.query("swipeRatings").collect();
    const analyses   = await ctx.db.query("postAnalyses").collect();

    const ratedIds    = new Set(ratings.map(r => r.postId));
    const analysedIds = new Set(analyses.map(a => a.postId));

    const scraped      = allPosts.length;
    const analysed     = allPosts.filter(p => p.aiAnalysis || analysedIds.has(p._id)).length;
    const rated        = new Set(ratings.map(r => r.postId)).size;
    const readyToSwipe = allPosts.filter(p => !ratedIds.has(p._id)).length;
    const ratedToday   = ratings.filter(r => r.ratedAt > Date.now() - 86_400_000).length;

    const lastPost = allPosts.sort((a, b) => b.scrapedAt - a.scrapedAt)[0];

    return { scraped, analysed, rated, readyToSwipe, ratedToday, lastScrapedAt: lastPost?.scrapedAt ?? null };
  },
});
