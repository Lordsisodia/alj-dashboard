import { query, mutation, action } from "./_generated/server";
import { v } from "convex/values";
import { api } from "./_generated/api";

// ── Feed query  -  powers the Intelligence Community Feed ──────────────────────

export const getFeed = query({
  args: {
    niche:        v.optional(v.string()),
    contentType:  v.optional(v.string()),
    sortBy:       v.optional(v.union(
      v.literal("newest"),
      v.literal("oldest"),
      v.literal("most-likes"),
      v.literal("most-views"),
      v.literal("most-saves"),
      v.literal("top-engagement"),
      v.literal("trending"),
      v.literal("top"),
      v.literal("viral")
    )),
    limit:        v.optional(v.number()),
    onlyAnalyzed: v.optional(v.boolean()),
  },
  handler: async (ctx, args) => {
    let posts = await ctx.db.query("scrapedPosts").collect();

    // Exclude seed data  -  only show real scraped posts
    posts = posts.filter(p => !p.externalId?.startsWith('seed_'));

    if (args.onlyAnalyzed) {
      posts = posts.filter(p => p.aiAnalysis != null);
    }

    if (args.niche && args.niche !== "all") {
      posts = posts.filter(p => p.niche === args.niche);
    }
    if (args.contentType && args.contentType !== "all") {
      posts = posts.filter(p => p.contentType === args.contentType);
    }

    switch (args.sortBy) {
      case "oldest":
        posts.sort((a, b) => (a.postedAt ?? 0) - (b.postedAt ?? 0));
        break;
      case "most-likes":
        posts.sort((a, b) => (b.likes ?? 0) - (a.likes ?? 0));
        break;
      case "most-views":
        posts.sort((a, b) => (b.views ?? 0) - (a.views ?? 0));
        break;
      case "most-saves":
        posts.sort((a, b) => (b.saves ?? 0) - (a.saves ?? 0));
        break;
      case "top-engagement":
      case "top":
        posts.sort((a, b) => (b.engagementRate ?? 0) - (a.engagementRate ?? 0));
        break;
      case "trending": {
        const cutoff = Date.now() - 14 * 24 * 60 * 60 * 1000;
        posts = posts.filter(p => (p.postedAt ?? 0) > cutoff);
        posts.sort((a, b) => (b.engagementRate ?? 0) - (a.engagementRate ?? 0));
        break;
      }
      case "viral":
        posts.sort((a, b) => {
          const ar = a.outlierRatio ?? (a.engagementRate ?? 0) * 10;
          const br = b.outlierRatio ?? (b.engagementRate ?? 0) * 10;
          return br - ar;
        });
        break;
      default:
        // newest
        posts.sort((a, b) => (b.postedAt ?? 0) - (a.postedAt ?? 0));
    }

    const slicedPosts = posts.slice(0, args.limit ?? 40);

    // Join v2 analyses + creator account data in parallel
    const [v2Analyses, accounts] = await Promise.all([
      Promise.all(
        slicedPosts.map(p =>
          ctx.db
            .query("postAnalyses")
            .withIndex("by_post_id", q => q.eq("postId", p._id))
            .first()
        )
      ),
      Promise.all(
        slicedPosts.map(p =>
          ctx.db
            .query("trackedAccounts")
            .withIndex("by_handle", q => q.eq("handle", p.handle))
            .first()
        )
      ),
    ]);

    return slicedPosts.map((p, i) => {
      const v2  = v2Analyses[i];
      const acc = accounts[i];
      return {
        ...p,
        avatarUrl:   acc?.avatarUrl   ?? null,
        avatarColor: acc?.avatarColor ?? null,
        displayName: acc?.displayName ?? null,
        verified:    acc?.verified    ?? null,
        v2Analysis: v2
          ? {
              vibeKeyword:             v2.vibeKeyword,
              hookStructure:           v2.hookStructure,
              formatPrimary:           v2.formatPrimary,
              curiosityGapPresent:     v2.curiosityGapPresent,
              patternInterruptPresent: v2.patternInterruptPresent,
              energyLevel:             v2.energyLevel,
            }
          : null,
      };
    });
  },
});

// ── Fetch posts by ids  -  used by InsightsView drawer ──────────────────────────

export const getPostsByIds = query({
  args: { ids: v.array(v.id("scrapedPosts")) },
  handler: async (ctx, args) => {
    if (args.ids.length === 0) return [];
    const posts = await Promise.all(args.ids.map(id => ctx.db.get(id)));
    return posts.filter(p => p != null);
  },
});

// ── Search posts by caption ───────────────────────────────────────────────────

export const searchPosts = query({
  args: {
    query: v.string(),
    niche: v.optional(v.string()),
    contentType: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const results = await ctx.db
      .query("scrapedPosts")
      .withSearchIndex("search_caption", q => {
        let search = q.search("caption", args.query);
        if (args.niche && args.niche !== "all") search = search.eq("niche", args.niche);
        if (args.contentType && args.contentType !== "all") search = search.eq("contentType", args.contentType as "post" | "reel" | "story" | "carousel");
        return search;
      })
      .take(40);
    return results;
  },
});

// ── Stats for the header pill ─────────────────────────────────────────────────

export const getStats = query({
  args: {},
  handler: async (ctx) => {
    const posts = await ctx.db.query("scrapedPosts").collect();

    const now           = Date.now();
    const weekMs        = 7 * 24 * 60 * 60 * 1000;
    const thisWeekStart = now - weekMs;
    const lastWeekStart = now - weekMs * 2;

    const postsThisWeek = posts.filter(p => (p.scrapedAt ?? p.postedAt ?? 0) > thisWeekStart).length;
    const postsLastWeek = posts.filter(p => {
      const t = p.scrapedAt ?? p.postedAt ?? 0;
      return t > lastWeekStart && t <= thisWeekStart;
    }).length;

    const unanalysedCount = posts.filter(p =>
      !p.externalId?.startsWith('seed_') &&
      p.aiAnalysis == null &&
      (p.outlierRatio != null ? p.outlierRatio >= 1.5 : (p.engagementRate ?? 0) >= 0.05)
    ).length;

    // Latest scrape time across all posts
    const latestScrape = posts.reduce((max, p) => Math.max(max, p.scrapedAt ?? 0), 0);

    // Analysis stats
    const analysedPosts = posts.filter(p => p.aiAnalysis != null);
    const analysedCount = analysedPosts.length;
    const avgHookScore  = analysedCount > 0
      ? analysedPosts.reduce((sum, p) => sum + (p.aiAnalysis?.hookScore ?? 0), 0) / analysedCount
      : 0;

    return {
      totalIndexed:    posts.length,
      postsThisWeek,
      postsLastWeek,
      unanalysedCount,
      analysedCount,
      avgHookScore,
      latestScrapeAt:  latestScrape,
    };
  },
});

// ── Patch AI analysis onto a post ────────────────────────────────────────────

export const patchAnalysis = mutation({
  args: {
    postId:     v.id("scrapedPosts"),
    transcript: v.optional(v.string()),
    hookScore:  v.number(),
    hookLine:   v.string(),
    emotions:   v.array(v.string()),
    breakdown:  v.string(),
    suggestions: v.array(v.string()),
  },
  handler: async (ctx, args) => {
    await ctx.db.patch(args.postId, {
      aiAnalysis: {
        transcript:  args.transcript,
        hookScore:   args.hookScore,
        hookLine:    args.hookLine,
        emotions:    args.emotions,
        breakdown:   args.breakdown,
        suggestions: args.suggestions,
        analyzedAt:  Date.now(),
      },
    });
  },
});

// ── Toggle save on a post ─────────────────────────────────────────────────────

export const toggleSave = mutation({
  args: { postId: v.id("scrapedPosts") },
  handler: async (ctx, args) => {
    const post = await ctx.db.get(args.postId);
    if (!post) return;
    await ctx.db.patch(args.postId, { saved: !post.saved });
  },
});

// ── Saved posts ─────────────────────────────────────────────────────────────

export const getSavedPosts = query({
  args: {
    niche:       v.optional(v.string()),
    contentType: v.optional(v.string()),
    sortBy:      v.optional(v.union(
      v.literal("newest"),
      v.literal("most-likes"),
      v.literal("most-views"),
      v.literal("most-saves"),
      v.literal("top-engagement"),
    )),
    search:      v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    let posts = await ctx.db
      .query("scrapedPosts")
      .filter(q => q.eq(q.field("saved"), true))
      .collect();

    posts = posts.filter(p => !p.externalId?.startsWith('seed_'));

    if (args.niche && args.niche !== "all") {
      posts = posts.filter(p => p.niche === args.niche);
    }
    if (args.contentType && args.contentType !== "all") {
      posts = posts.filter(p => p.contentType === args.contentType);
    }
    if (args.search) {
      const q = args.search.toLowerCase();
      posts = posts.filter(p =>
        p.handle.toLowerCase().includes(q) ||
        (p.caption ?? '').toLowerCase().includes(q) ||
        (p.hashtags ?? []).some((t: string) => t.toLowerCase().includes(q))
      );
    }

    switch (args.sortBy) {
      case "most-likes":
        posts.sort((a, b) => (b.likes ?? 0) - (a.likes ?? 0));
        break;
      case "most-views":
        posts.sort((a, b) => (b.views ?? 0) - (a.views ?? 0));
        break;
      case "most-saves":
        posts.sort((a, b) => (b.saves ?? 0) - (a.saves ?? 0));
        break;
      case "top-engagement":
        posts.sort((a, b) => (b.engagementRate ?? 0) - (a.engagementRate ?? 0));
        break;
      default:
        posts.sort((a, b) => (b.postedAt ?? 0) - (a.postedAt ?? 0));
    }

    return posts;
  },
});

// ── Saved posts summary stats ────────────────────────────────────────────────

export const getSavedStats = query({
  args: {},
  handler: async (ctx) => {
    const posts = await ctx.db
      .query("scrapedPosts")
      .filter(q => q.eq(q.field("saved"), true))
      .collect();

    const real = posts.filter(p => !p.externalId?.startsWith('seed_'));

    // Latest save time
    const lastSaved = real.reduce((max, p) => {
      // Use scrapedAt as a proxy for when it was saved (toggleSave patches savedAt)
      return Math.max(max, p.scrapedAt ?? 0);
    }, 0);

    // Unique creators
    const creators = new Set(real.map(p => p.handle));

    // Niche breakdown
    const nicheCounts: Record<string, number> = {};
    for (const p of real) {
      nicheCounts[p.niche] = (nicheCounts[p.niche] ?? 0) + 1;
    }

    return {
      total: real.length,
      creators: creators.size,
      lastSavedAt: lastSaved || null,
      nicheCounts,
    };
  },
});

// ── Trends aggregation  -  format + niche stats + top hooks ────────────────────

export const getTrends = query({
  args: {
    days:     v.optional(v.number()),
    niche:    v.optional(v.string()),
    platform: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    let posts = await ctx.db.query("scrapedPosts").collect();
    posts = posts.filter(p => !p.externalId?.startsWith('seed_'));

    const days   = args.days ?? 30;
    const cutoff = Date.now() - days * 24 * 60 * 60 * 1000;
    posts = posts.filter(p => (p.postedAt ?? 0) > cutoff);
    if (args.niche    && args.niche    !== 'all') posts = posts.filter(p => p.niche    === args.niche);
    if (args.platform && args.platform !== 'all') posts = posts.filter(p => p.platform === args.platform);

    const fMap: Record<string, { count: number; erSum: number; viewsSum: number }> = {};
    const nMap: Record<string, { count: number; erSum: number; viewsSum: number; savesSum: number }> = {};

    for (const p of posts) {
      const f = p.contentType;
      if (!fMap[f]) fMap[f] = { count: 0, erSum: 0, viewsSum: 0 };
      fMap[f].count++; fMap[f].erSum += (p.engagementRate ?? 0); fMap[f].viewsSum += (p.views ?? 0);

      const n = p.niche;
      if (!nMap[n]) nMap[n] = { count: 0, erSum: 0, viewsSum: 0, savesSum: 0 };
      nMap[n].count++; nMap[n].erSum += (p.engagementRate ?? 0); nMap[n].viewsSum += (p.views ?? 0); nMap[n].savesSum += (p.saves ?? 0);
    }

    const formatStats = Object.entries(fMap)
      .map(([format, d]) => ({
        format,
        count:    d.count,
        avgER:    d.count ? d.erSum    / d.count : 0,
        avgViews: d.count ? d.viewsSum / d.count : 0,
      }))
      .sort((a, b) => b.avgER - a.avgER);

    const nicheStats = Object.entries(nMap)
      .map(([niche, d]) => ({
        niche,
        count:    d.count,
        avgER:    d.count ? d.erSum    / d.count : 0,
        avgViews: d.count ? d.viewsSum / d.count : 0,
        avgSaves: d.count ? d.savesSum / d.count : 0,
      }))
      .sort((a, b) => b.avgER - a.avgER);

    const topHooks = [...posts]
      .sort((a, b) => (b.engagementRate ?? 0) - (a.engagementRate ?? 0))
      .slice(0, 15)
      .map(p => ({
        _id:            p._id,
        hook:           (p.caption ?? '').split('\n')[0].slice(0, 100),
        handle:         p.handle,
        niche:          p.niche,
        contentType:    p.contentType,
        engagementRate: p.engagementRate ?? 0,
        likes:          p.likes ?? 0,
        views:          p.views ?? 0,
        saves:          p.saves ?? 0,
      }));

    const avgER = posts.length ? posts.reduce((s, p) => s + (p.engagementRate ?? 0), 0) / posts.length : 0;

    // Top outliers  -  posts with highest outlierRatio (virality signal)
    const outlierPosts = [...posts]
      .filter(p => p.outlierRatio != null || (p.engagementRate ?? 0) > 0.08)
      .sort((a, b) => {
        const ar = a.outlierRatio ?? (a.engagementRate ?? 0) * 10;
        const br = b.outlierRatio ?? (b.engagementRate ?? 0) * 10;
        return br - ar;
      })
      .slice(0, 20)
      .map(p => ({
        _id:            p._id,
        handle:         p.handle,
        niche:          p.niche,
        contentType:    p.contentType,
        hook:           (p.caption ?? '').split('\n')[0].slice(0, 120),
        thumbnailUrl:   p.thumbnailUrl,
        likes:          p.likes ?? 0,
        views:          p.views ?? 0,
        saves:          p.saves ?? 0,
        engagementRate: p.engagementRate ?? 0,
        outlierRatio:   p.outlierRatio ?? parseFloat(((p.engagementRate ?? 0) * 10).toFixed(2)),
        postedAt:       p.postedAt ?? 0,
      }));

    return { totalPosts: posts.length, avgER, formatStats, nicheStats, topHooks, outlierPosts };
  },
});

// ── Signals  -  posts ranked by outlierRatio above a multiplier threshold ───────

export const getSignals = query({
  args: {
    minMultiple: v.optional(v.number()),
    niche:       v.optional(v.string()),
    limit:       v.optional(v.number()),
  },
  handler: async (ctx, args) => {
    let posts = await ctx.db.query("scrapedPosts").collect();
    posts = posts.filter(p => !p.externalId?.startsWith('seed_'));

    const minMult = args.minMultiple ?? 2;
    const erFallbacks: Record<number, number> = { 2: 0.05, 5: 0.08, 10: 0.12, 20: 0.20 };
    const erFloor = erFallbacks[minMult] ?? 0.05;

    posts = posts.filter(p =>
      p.outlierRatio != null ? p.outlierRatio >= minMult : (p.engagementRate ?? 0) >= erFloor
    );

    if (args.niche && args.niche !== 'all') posts = posts.filter(p => p.niche === args.niche);

    posts.sort((a, b) => {
      const ar = a.outlierRatio ?? (a.engagementRate ?? 0) * 10;
      const br = b.outlierRatio ?? (b.engagementRate ?? 0) * 10;
      return br - ar;
    });

    return posts.slice(0, args.limit ?? 30);
  },
});

// ── Delete seed data (externalId starts with "seed_") ────────────────────────

export const clearSeedData = mutation({
  args: {},
  handler: async (ctx) => {
    const all = await ctx.db.query("scrapedPosts").collect();
    const seedPosts = all.filter(p => p.externalId?.startsWith('seed_'));
    for (const p of seedPosts) await ctx.db.delete(p._id);

    // Also delete seed accounts (no real posts left pointing to them)
    const seedHandles = [...new Set(seedPosts.map(p => p.handle))];
    const accounts = await ctx.db.query("trackedAccounts").collect();
    for (const acc of accounts) {
      if (seedHandles.includes(acc.handle)) await ctx.db.delete(acc._id);
    }

    return { deletedPosts: seedPosts.length, deletedAccounts: seedHandles.length };
  },
});

// ── Seed with realistic OFM/lifestyle posts ───────────────────────────────────

export const seedIntelligenceFeed = mutation({
  args: {},
  handler: async (ctx) => {
    // Check if already seeded (look for seed_ prefix specifically)
    const existing = await ctx.db.query("scrapedPosts").collect();
    const alreadySeeded = existing.some(p => p.externalId?.startsWith('seed_'));
    if (alreadySeeded) return { seeded: false, reason: "already seeded" };

    // Seed tracked accounts first
    const accounts = [
      { handle: "@abg.ricebunny",  niche: "GFE",       followerCount: 245000, avatarColor: "#ff0069", isOwn: true  },
      { handle: "@onlytylerrex",   niche: "Fitness",    followerCount: 182000, avatarColor: "#fcaf45", isOwn: true  },
      { handle: "@rhinxrenx",      niche: "Fitness",    followerCount: 134000, avatarColor: "#833ab4", isOwn: true  },
      { handle: "@ellamira",       niche: "Lifestyle",  followerCount: 98000,  avatarColor: "#78c257", isOwn: true  },
      { handle: "@fitqueenmanila", niche: "Fitness",    followerCount: 312000, avatarColor: "#06b6d4", isOwn: false },
      { handle: "@lifestylebylee", niche: "Lifestyle",  followerCount: 278000, avatarColor: "#f97316", isOwn: false },
      { handle: "@gfevibez",       niche: "GFE",        followerCount: 156000, avatarColor: "#ec4899", isOwn: false },
      { handle: "@manilafitnation",niche: "Fitness",    followerCount: 421000, avatarColor: "#8b5cf6", isOwn: false },
    ];

    const accountIds: Record<string, string> = {};
    for (const acc of accounts) {
      const id = await ctx.db.insert("trackedAccounts", {
        ...acc,
        platform: "instagram",
        status: "active",
        postsScraped: Math.floor(Math.random() * 200) + 50,
        avgEngagementRate: Math.random() * 0.06 + 0.02,
        lastScrapedAt: Date.now() - Math.floor(Math.random() * 3600000),
      });
      accountIds[acc.handle] = id;
    }

    // Seed posts
    const posts = [
      { handle: "@abg.ricebunny",  contentType: "reel",     niche: "GFE",      caption: "Monday grind starts early. No excuses, just results. The gym opens at 5am and I'm already there.", hashtags: ["#gymmotivation","#gaybear","#manila","#fitness"], likes: 12400, comments: 342, saves: 891, views: 184000, reach: 220000, daysAgo: 1 },
      { handle: "@onlytylerrex",   contentType: "reel",     niche: "Fitness",   caption: "Transformation Tuesday. 12 weeks in. Same mirror, different energy. The discipline is starting to show.", hashtags: ["#transformation","#fitness","#progress","#gym"], likes: 18200, comments: 521, saves: 1240, views: 267000, reach: 310000, daysAgo: 2 },
      { handle: "@rhinxrenx",      contentType: "carousel", niche: "Fitness",   caption: "5 ways to stay consistent with your fitness goals. Save this for your next reset week.", hashtags: ["#fitnessgoals","#consistency","#gymtips","#motivation"], likes: 9800, comments: 287, saves: 2100, views: 0, reach: 145000, daysAgo: 2 },
      { handle: "@ellamira",       contentType: "reel",     niche: "Lifestyle", caption: "Chasing the golden hour. Some days the light is just perfect. No plan, just vibes.", hashtags: ["#goldenhour","#lifestyle","#ootd","#manilaph"], likes: 7600, comments: 198, saves: 640, views: 112000, reach: 134000, daysAgo: 3 },
      { handle: "@fitqueenmanila", contentType: "reel",     niche: "Fitness",   caption: "Morning routine that changed everything. 45 minutes. No equipment. Just commitment.", hashtags: ["#morningroutine","#homeworkout","#fitness","#discipline"], likes: 24100, comments: 678, saves: 3200, views: 412000, reach: 490000, daysAgo: 1 },
      { handle: "@lifestylebylee", contentType: "post",     niche: "Lifestyle", caption: "The apartment finally feels like home. Took 6 months but every piece has a story.", hashtags: ["#homedecor","#apartmentlife","#interiordesign","#cozy"], likes: 8900, comments: 312, saves: 1800, views: 0, reach: 125000, daysAgo: 4 },
      { handle: "@gfevibez",       contentType: "reel",     niche: "GFE",       caption: "Outfit check before date night. Which look? 1 or 2?", hashtags: ["#ootd","#datenight","#fashion","#style"], likes: 15600, comments: 892, saves: 780, views: 198000, reach: 238000, daysAgo: 2 },
      { handle: "@manilafitnation",contentType: "reel",     niche: "Fitness",   caption: "Full body HIIT - 20 minutes, zero rest. This one destroyed me but the pump was unreal.", hashtags: ["#hiit","#fullbody","#workoutvideo","#fitness"], likes: 31200, comments: 940, saves: 4100, views: 562000, reach: 640000, daysAgo: 1 },
      { handle: "@abg.ricebunny",  contentType: "post",     niche: "GFE",       caption: "Rest day energy. Active recovery, good food, and a lot of gratitude today.", hashtags: ["#restday","#selfcare","#recovery","#grateful"], likes: 6200, comments: 145, saves: 320, views: 0, reach: 89000, daysAgo: 5 },
      { handle: "@onlytylerrex",   contentType: "reel",     niche: "Fitness",   caption: "Post-workout glow hits different when you've been grinding for 90 days straight.", hashtags: ["#postworkout","#gymlife","#dedication","#results"], likes: 14300, comments: 398, saves: 970, views: 198000, reach: 234000, daysAgo: 6 },
      { handle: "@rhinxrenx",      contentType: "reel",     niche: "Fitness",   caption: "What I eat in a day as a gym guy. Full transparency  -  real food, real results.", hashtags: ["#whatieat","#mealprep","#gymfood","#nutrition"], likes: 11800, comments: 445, saves: 1680, views: 167000, reach: 198000, daysAgo: 7 },
      { handle: "@lifestylebylee", contentType: "carousel", niche: "Lifestyle", caption: "Morning routine dump. This is what a slow morning looks like when you actually protect your time.", hashtags: ["#morningroutine","#slowliving","#selfcare","#lifestyle"], likes: 12400, comments: 521, saves: 2800, views: 0, reach: 178000, daysAgo: 3 },
      { handle: "@fitqueenmanila", contentType: "carousel", niche: "Fitness",   caption: "Glute workout guide. 4 exercises, 4 sets each. Save this  -  you'll thank me later.", hashtags: ["#gluteworkout","#legday","#fitness","#gym"], likes: 19800, comments: 612, saves: 5400, views: 0, reach: 287000, daysAgo: 5 },
      { handle: "@gfevibez",       contentType: "post",     niche: "GFE",       caption: "Sunday soft life. This is the reset I needed after a long week.", hashtags: ["#sundayvibes","#selfcare","#cozy","#softlife"], likes: 9100, comments: 267, saves: 890, views: 0, reach: 132000, daysAgo: 8 },
      { handle: "@ellamira",       contentType: "reel",     niche: "Lifestyle", caption: "Rooftop sunset shoot. Manila at magic hour is something else entirely.", hashtags: ["#sunset","#manila","#rooftop","#goldenhour"], likes: 8400, comments: 231, saves: 720, views: 124000, reach: 148000, daysAgo: 9 },
      { handle: "@manilafitnation",contentType: "post",     niche: "Fitness",   caption: "Progress pics drop every 30 days. The compound effect is real  -  trust the process.", hashtags: ["#progresspics","#bodybuilding","#fitness","#transformation"], likes: 22400, comments: 734, saves: 3100, views: 0, reach: 312000, daysAgo: 4 },
    ];

    const gradients: Record<string, string> = {
      "@abg.ricebunny":   "linear-gradient(135deg, #ff006920, #fd1d1d20)",
      "@onlytylerrex":    "linear-gradient(135deg, #fcaf4520, #833ab420)",
      "@rhinxrenx":       "linear-gradient(135deg, #833ab420, #78c25720)",
      "@ellamira":        "linear-gradient(135deg, #78c25720, #00f4e220)",
      "@fitqueenmanila":  "linear-gradient(135deg, #06b6d420, #3b82f620)",
      "@lifestylebylee":  "linear-gradient(135deg, #f9731620, #fbbf2420)",
      "@gfevibez":        "linear-gradient(135deg, #ec489920, #f4366420)",
      "@manilafitnation": "linear-gradient(135deg, #8b5cf620, #6366f120)",
    };

    for (const p of posts) {
      const reach = p.reach || p.views || 100000;
      await ctx.db.insert("scrapedPosts", {
        externalId:     `seed_${p.handle.replace("@","")}_${Date.now()}_${Math.random()}`,
        accountId:      accountIds[p.handle] as any,
        handle:         p.handle,
        platform:       "instagram",
        contentType:    p.contentType as any,
        niche:          p.niche,
        thumbnailUrl:   gradients[p.handle] ?? "linear-gradient(135deg, #ff006920, #833ab420)",
        caption:        p.caption,
        hashtags:       p.hashtags,
        likes:          p.likes,
        comments:       p.comments,
        saves:          p.saves,
        views:          p.views,
        reach:          reach,
        engagementRate: parseFloat(((p.likes + p.comments + p.saves) / reach).toFixed(4)),
        postedAt:       Date.now() - p.daysAgo * 24 * 60 * 60 * 1000,
        scrapedAt:      Date.now(),
        saved:          false,
        boardIds:       [],
      });
    }

    return { seeded: true, accounts: accounts.length, posts: posts.length };
  },
});

// ── Pattern detection  -  cluster posts by recurring hashtags ──────────────────

export const getPatterns = query({
  args: {
    days:  v.optional(v.number()),
    niche: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    let posts = await ctx.db.query("scrapedPosts").collect();
    // Include all posts (real + seed) so demo data contributes to clusters

    const days   = args.days ?? 30;
    const cutoff = Date.now() - days * 24 * 60 * 60 * 1000;
    posts = posts.filter(p => (p.postedAt ?? 0) > cutoff);
    if (args.niche && args.niche !== 'all') {
      posts = posts.filter(p => p.niche === args.niche);
    }

    const globalAvgER = posts.length
      ? posts.reduce((s, p) => s + (p.engagementRate ?? 0), 0) / posts.length
      : 0;

    // Try hashtag clustering first; fall back to niche+format if hashtags are empty
    const hasHashtags = posts.some(p => (p.hashtags ?? []).length > 0);
    const clusterMap: Record<string, { posts: typeof posts; erSum: number }> = {};

    if (hasHashtags) {
      for (const p of posts) {
        for (const tag of p.hashtags ?? []) {
          const key = tag.toLowerCase();
          if (!clusterMap[key]) clusterMap[key] = { posts: [], erSum: 0 };
          clusterMap[key].posts.push(p);
          clusterMap[key].erSum += p.engagementRate ?? 0;
        }
      }
    } else {
      // Cluster by niche + contentType (e.g. "Fitness · Reel")
      for (const p of posts) {
        const key = `${p.niche} · ${p.contentType.charAt(0).toUpperCase() + p.contentType.slice(1)}`;
        if (!clusterMap[key]) clusterMap[key] = { posts: [], erSum: 0 };
        clusterMap[key].posts.push(p);
        clusterMap[key].erSum += p.engagementRate ?? 0;
      }
    }

    // Build clusters from groups that appear in ≥ 2 posts
    const clusters = Object.entries(clusterMap)
      .filter(([, d]) => d.posts.length >= 2)
      .map(([theme, d]) => {
        const avgER      = d.erSum / d.posts.length;
        const multiplier = globalAvgER > 0 ? parseFloat((avgER / globalAvgER).toFixed(2)) : 1;
        const handles    = [...new Set(d.posts.map(p => p.handle))];
        const topPosts   = [...d.posts]
          .sort((a, b) => (b.engagementRate ?? 0) - (a.engagementRate ?? 0))
          .slice(0, 3)
          .map(p => ({
            _id:            p._id,
            hook:           (p.caption ?? '').split('\n')[0].slice(0, 100),
            handle:         p.handle,
            niche:          p.niche,
            contentType:    p.contentType,
            engagementRate: p.engagementRate ?? 0,
            likes:          p.likes ?? 0,
            views:          p.views ?? 0,
            saves:          p.saves ?? 0,
          }));

        return {
          theme,
          postCount:  d.posts.length,
          handles,
          avgER,
          baselineER: globalAvgER,
          multiplier,
          posts:      topPosts,
        };
      })
      // Sort by multiplier desc  -  most above baseline first
      .sort((a, b) => b.multiplier - a.multiplier)
      .slice(0, 6);

    return clusters;
  },
});

// ── Hashtag correlation  -  which hashtags appear most in top-10% ER posts ────

export const getHashtagCorrelation = query({
  args: {
    days:  v.optional(v.number()),
    niche: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    let posts = await ctx.db.query("scrapedPosts").collect();
    posts = posts.filter(p => !p.externalId?.startsWith('seed_'));

    const days   = args.days ?? 30;
    const cutoff = Date.now() - days * 24 * 60 * 60 * 1000;
    posts = posts.filter(p => (p.postedAt ?? 0) > cutoff && (p.hashtags ?? []).length > 0);
    if (args.niche && args.niche !== 'all') posts = posts.filter(p => p.niche === args.niche);

    if (posts.length < 3) return [];

    // Determine top-10% ER threshold
    const sorted    = [...posts].sort((a, b) => (b.engagementRate ?? 0) - (a.engagementRate ?? 0));
    const topCount  = Math.max(1, Math.ceil(sorted.length * 0.1));
    const topIds    = new Set(sorted.slice(0, topCount).map(p => p._id));

    // Count each hashtag across top-tier and all posts
    const map: Record<string, { top: number; total: number; erSum: number; topErSum: number }> = {};
    for (const p of posts) {
      const inTop = topIds.has(p._id);
      for (const tag of p.hashtags ?? []) {
        const key = tag.toLowerCase().replace(/^#/, '');
        if (!map[key]) map[key] = { top: 0, total: 0, erSum: 0, topErSum: 0 };
        map[key].total++;
        map[key].erSum += p.engagementRate ?? 0;
        if (inTop) { map[key].top++; map[key].topErSum += p.engagementRate ?? 0; }
      }
    }

    return Object.entries(map)
      .filter(([, d]) => d.total >= 2)
      .map(([hashtag, d]) => ({
        hashtag,
        topCount:       d.top,
        totalCount:     d.total,
        correlationPct: parseFloat(((d.top / d.total) * 100).toFixed(1)),
        avgER:          parseFloat((d.erSum / d.total).toFixed(4)),
        topAvgER:       d.top > 0 ? parseFloat((d.topErSum / d.top).toFixed(4)) : 0,
      }))
      .sort((a, b) => b.correlationPct - a.correlationPct || b.topCount - a.topCount)
      .slice(0, 20);
  },
});

// ── Bulk import real scraped posts ────────────────────────────────────────────

export const importScrapedPost = mutation({
  args: {
    externalId:   v.string(),
    handle:       v.string(),
    displayName:  v.string(),
    platform:     v.union(v.literal("instagram"), v.literal("tiktok")),
    contentType:  v.union(v.literal("reel"), v.literal("post"), v.literal("carousel"), v.literal("story")),
    niche:        v.string(),
    thumbnailUrl: v.string(),
    videoUrl:     v.optional(v.string()),
    caption:      v.string(),
    hashtags:     v.array(v.string()),
    likes:        v.number(),
    comments:     v.number(),
    saves:        v.number(),
    views:        v.number(),
    reach:        v.number(),
    engagementRate: v.number(),
    postedAt:     v.number(),
    scrapedAt:    v.number(),
    firstComment: v.optional(v.string()),
    outlierRatio: v.optional(v.number()),
    followerCount: v.number(),
    avatarColor:  v.string(),
  },
  handler: async (ctx, args) => {
    // Skip duplicates
    const existing = await ctx.db
      .query("scrapedPosts")
      .filter(q => q.eq(q.field("externalId"), args.externalId))
      .first();
    if (existing) return { inserted: false, reason: "duplicate" };

    // Upsert trackedAccount
    let account = await ctx.db
      .query("trackedAccounts")
      .withIndex("by_handle", q => q.eq("handle", `@${args.handle}`))
      .first();

    if (!account) {
      const accountId = await ctx.db.insert("trackedAccounts", {
        handle:            `@${args.handle}`,
        displayName:       args.displayName,
        platform:          args.platform,
        niche:             args.niche,
        followerCount:     args.followerCount,
        avatarColor:       args.avatarColor,
        status:            "active",
        lastScrapedAt:     args.scrapedAt,
        postsScraped:      1,
        avgEngagementRate: args.engagementRate,
        isOwn:             false,
      });
      account = await ctx.db.get(accountId);
    }

    await ctx.db.insert("scrapedPosts", {
      externalId:    args.externalId,
      accountId:     account!._id,
      handle:        `@${args.handle}`,
      platform:      args.platform,
      contentType:   args.contentType,
      niche:         args.niche,
      thumbnailUrl:  args.thumbnailUrl,
      videoUrl:      args.videoUrl,
      caption:       args.caption,
      hashtags:      args.hashtags,
      likes:         args.likes,
      comments:      args.comments,
      saves:         args.saves,
      views:         args.views,
      reach:         args.reach,
      engagementRate: args.engagementRate,
      postedAt:      args.postedAt,
      scrapedAt:     args.scrapedAt,
      firstComment:  args.firstComment,
      outlierRatio:  args.outlierRatio,
      saved:         false,
      boardIds:      [],
    });

    return { inserted: true };
  },
});

// ── Qualify tab — all scraped posts ordered by baseline score ──────────────────

function median(nums: number[]): number {
  if (nums.length === 0) return 0;
  const sorted = [...nums].sort((a, b) => a - b);
  const mid = Math.floor(sorted.length / 2);
  return sorted.length % 2 === 0 ? (sorted[mid - 1] + sorted[mid]) / 2 : sorted[mid];
}

export const getQualifyPosts = query({
  args: { minBaseline: v.optional(v.number()) },
  handler: async (ctx, { minBaseline }) => {
    let posts = await ctx.db.query("scrapedPosts").collect();
    // Exclude seed posts
    posts = posts.filter(p => !p.externalId?.startsWith('seed_'));

    // Fetch trackedAccounts for avgViews fallback
    const accounts = await ctx.db.query("trackedAccounts").collect();
    const accountAvgViews = new Map(
      accounts
        .filter(a => (a.avgViews ?? 0) > 0)
        .map(a => [a.handle, a.avgViews!] as [string, number])
    );

    // Compute per-creator medians from ALL posts before any filtering
    const viewsByHandle:    Map<string, number[]> = new Map();
    const likesByHandle:    Map<string, number[]> = new Map();
    const commentsByHandle: Map<string, number[]> = new Map();

    for (const p of posts) {
      const h = p.handle;
      if (!viewsByHandle.has(h)) {
        viewsByHandle.set(h, []);
        likesByHandle.set(h, []);
        commentsByHandle.set(h, []);
      }
      // Only include posts with actual views (Reels) so regular posts/carousels
      // don't drag the median to 0. Likes/comments are available on all types.
      if ((p.views ?? 0) > 0) viewsByHandle.get(h)!.push(p.views!);
      likesByHandle.get(h)!.push(p.likes ?? 0);
      commentsByHandle.get(h)!.push(p.comments ?? 0);
    }

    const medViews:    Map<string, number> = new Map();
    const medLikes:    Map<string, number> = new Map();
    const medComments: Map<string, number> = new Map();
    for (const [h, v2] of viewsByHandle)    medViews.set(h, median(v2));
    for (const [h, v2] of likesByHandle)    medLikes.set(h, median(v2));
    for (const [h, v2] of commentsByHandle) medComments.set(h, median(v2));

    const mapped = posts.map(p => {
      const mv = medViews.get(p.handle) ?? 0;
      const sampleCount = viewsByHandle.get(p.handle)?.length ?? 0;
      // Use account-level avgViews when we have < 5 reel samples (more accurate baseline)
      const effectiveMedian = sampleCount >= 5 ? mv : (accountAvgViews.get(p.handle) ?? mv);
      const baseline = effectiveMedian > 0
        ? parseFloat(((p.views ?? 0) / effectiveMedian).toFixed(2))
        : parseFloat(((p.engagementRate ?? 0) * 10).toFixed(2));
      return {
        ...p,
        baselineScore:         baseline,
        creatorMedianViews:    Math.round(effectiveMedian),
        creatorMedianLikes:    Math.round(medLikes.get(p.handle)    ?? 0),
        creatorMedianComments: Math.round(medComments.get(p.handle) ?? 0),
      };
    });

    const result = minBaseline !== undefined
      ? mapped.filter(p => p.baselineScore >= minBaseline)
      : mapped;

    return result.sort((a, b) => b.baselineScore - a.baselineScore);
  },
});

export const saveTopPostsForPipeline = mutation({
  args: { postIds: v.array(v.id("scrapedPosts")) },
  handler: async (ctx, { postIds }) => {
    for (const id of postIds) {
      const post = await ctx.db.get(id);
      if (!post) continue;
      await ctx.db.patch(id, {
        savedForPipeline:    true,
        savedAt:             Date.now(),
        videoDownloadStatus: post.videoDownloadStatus ?? 'pending',
      });
      // Kick off R2 download unless video is already stable
      if (post.videoDownloadStatus !== 'ready') {
        await ctx.scheduler.runAfter(0, api.intelligenceNode.downloadPostToR2, { postId: id });
      }
    }
    return { scheduled: postIds.length };
  },
});

// ── Per-creator stats from real scraped data ──────────────────────────────────

export const getCreatorStats = query({
  args: {},
  handler: async (ctx) => {
    const accounts = await ctx.db.query("trackedAccounts").collect();
    const allPosts  = await ctx.db.query("scrapedPosts").collect();

    return accounts.map(acc => {
      const posts = allPosts.filter(p => p.handle === acc.handle);
      const reals = posts.filter(p => !p.externalId?.startsWith('seed_'));

      const totalPosts  = reals.length;
      const totalLikes  = reals.reduce((s, p) => s + (p.likes   ?? 0), 0);
      const totalViews  = reals.reduce((s, p) => s + (p.views   ?? 0), 0);
      const totalSaves  = reals.reduce((s, p) => s + (p.saved ? 1 : 0), 0);

      // Engagement rate: avg (likes+comments) / followerCount across posts
      const avgEngagement = totalPosts > 0 && acc.followerCount > 0
        ? parseFloat((reals.reduce((s, p) => s + ((p.likes ?? 0) + (p.comments ?? 0)), 0) / totalPosts / acc.followerCount * 100).toFixed(2))
        : 0;

      // Weekly post frequency  -  posts in the last 7 days
      const weekAgo = Date.now() - 7 * 24 * 60 * 60 * 1000;
      const postsThisWeek = reals.filter(p => (p.postedAt ?? 0) > weekAgo).length;

      // Trend: posts per day over the last 7 days (index 0 = 7 days ago, index 6 = today)
      const trendBuckets = Array(7).fill(0);
      reals.forEach(p => {
        const daysAgo = Math.floor((Date.now() - (p.postedAt ?? 0)) / (24 * 60 * 60 * 1000));
        if (daysAgo >= 0 && daysAgo < 7) trendBuckets[6 - daysAgo]++;
      });

      const lastPost = reals.length > 0
        ? Math.max(...reals.map(p => p.postedAt ?? 0))
        : null;

      return {
        handle:                acc.handle,
        displayName:           acc.displayName ?? acc.handle,
        niche:                 acc.niche,
        followerCount:         acc.followerCount,
        avatarColor:           acc.avatarColor,
        totalPosts,
        totalLikes,
        totalViews,
        totalSaves,
        avgEngagement,
        postsThisWeek,
        trendBuckets,
        lastScrapedAt:         acc.lastScrapedAt ?? null,
        lastPostAt:            lastPost,
        status:                acc.status,
        // enrichment fields
        bio:                   acc.bio                   ?? null,
        avatarUrl:             acc.avatarUrl             ?? null,
        postsCount:            acc.postsCount            ?? null,
        verified:              acc.verified              ?? null,
        enrichStatus:          acc.enrichStatus          ?? null,
        enrichedAt:            acc.enrichedAt            ?? null,
        followsCount:          acc.followsCount          ?? null,
        externalUrl:           acc.externalUrl           ?? null,
        isBusinessAccount:     acc.isBusinessAccount     ?? null,
        isProfessionalAccount: acc.isProfessionalAccount ?? null,
        businessCategoryName:  acc.businessCategoryName  ?? null,
        businessEmail:         acc.businessEmail         ?? null,
        isPrivate:             acc.isPrivate             ?? null,
        igtvVideoCount:        acc.igtvVideoCount        ?? null,
        instagramId:           acc.instagramId           ?? null,
        // ScoreableCreator fields (Phase 1 + stale profile)
        avgViews:              acc.avgViews              ?? null,
        outlierRatio:          acc.outlierRatio          ?? null,
        highlightReelCount:    acc.highlightReelCount    ?? null,
        avgEngagementRate:     acc.avgEngagementRate     ?? null,
        ...(acc.creatorScore != null && { creatorScore: acc.creatorScore }),
      };
    });
  },
});

// ── Dashboard stats - stat strip + funnel counts ─────────────────────────────

export const getReconDashboardStats = query({
  args: {},
  handler: async (ctx) => {
    const now = Date.now();
    const todayStart = new Date(); todayStart.setHours(0, 0, 0, 0);
    const weekStart  = now - 7 * 24 * 60 * 60 * 1000;

    const [accounts, allPosts] = await Promise.all([
      ctx.db.query("trackedAccounts").collect(),
      ctx.db.query("scrapedPosts").collect(),
    ]);

    const real    = allPosts.filter(p => !p.externalId?.startsWith('seed_'));
    const active  = accounts.filter(a => a.status === 'active');
    const lastRun = accounts.reduce((m, a) => Math.max(m, a.lastScrapedAt ?? 0), 0);

    const postsToday    = real.filter(p => p.scrapedAt >= todayStart.getTime()).length;
    const postsThisWeek = real.filter(p => p.scrapedAt >= weekStart).length;
    const refined       = real.filter(p => p.saved).length;
    const generated     = real.filter(p => !!p.aiAnalysis).length;

    let posted = 0;
    try {
      const content = await ctx.db.query("content").collect();
      posted = content.filter(c => (c.sentToPipelineAt ?? 0) >= weekStart).length;
    } catch { /* content table may be empty */ }

    return {
      postsToday,
      postsThisWeek,
      activeCreators:  active.length,
      totalCreators:   accounts.length,
      totalInLibrary:  real.length,
      lastRunAt:       lastRun || null,
      funnel: {
        basket:    active.length,
        scraped:   postsToday,
        refined,
        generated,
        posted,
      },
    };
  },
});

// ── Recent activity - live activity feed ──────────────────────────────────────

export const getRecentActivity = query({
  args: {},
  handler: async (ctx) => {
    const [posts, accounts] = await Promise.all([
      ctx.db.query("scrapedPosts").collect(),
      ctx.db.query("trackedAccounts").collect(),
    ]);

    const real = posts
      .filter(p => !p.externalId?.startsWith('seed_'))
      .sort((a, b) => b.scrapedAt - a.scrapedAt)
      .slice(0, 100);

    const accountMap = new Map(
      accounts.map(a => [a.handle, { avatarUrl: a.avatarUrl ?? null, followerCount: a.followerCount ?? null }])
    );

    // Group posts into scrape "events": same handle within a 2-hour window
    const events: { handle: string; count: number; contentType: string; ts: number }[] = [];
    for (const post of real) {
      const bucket = Math.floor(post.scrapedAt / (2 * 60 * 60 * 1000));
      const hit    = events.find(e =>
        e.handle === post.handle &&
        Math.floor(e.ts / (2 * 60 * 60 * 1000)) === bucket
      );
      if (hit) { hit.count++; }
      else events.push({ handle: post.handle, count: 1, contentType: post.contentType, ts: post.scrapedAt });
    }

    return events.slice(0, 20).map((e, id) => ({
      id,
      handle:        `@${e.handle}`,
      count:         e.count,
      contentType:   e.contentType,
      ts:            e.ts,
      status:        'success' as const,
      avatarUrl:     accountMap.get(e.handle)?.avatarUrl     ?? null,
      followerCount: accountMap.get(e.handle)?.followerCount ?? null,
    }));
  },
});

// ── Daily scraped volume  -  powers the Posts Scraped chart ──────────────────

export const getDailyScrapedVolume = query({
  args: { days: v.optional(v.number()) },
  handler: async (ctx, args) => {
    const days   = args.days ?? 14;
    const now    = Date.now();
    const cutoff = now - days * 24 * 60 * 60 * 1000;

    const posts = await ctx.db.query("scrapedPosts").collect();
    const real  = posts.filter(p =>
      (p.scrapedAt ?? 0) >= cutoff && !p.externalId?.startsWith('seed_')
    );

    // Build ordered day buckets (oldest → newest)
    const buckets: { label: string; total: number }[] = [];
    for (let i = days - 1; i >= 0; i--) {
      const d     = new Date(now - i * 24 * 60 * 60 * 1000);
      const label = d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
      buckets.push({ label, total: 0 });
    }

    for (const post of real) {
      const label = new Date(post.scrapedAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
      const b = buckets.find(x => x.label === label);
      if (b) b.total++;
    }

    return buckets;
  },
});

// ── Analysis queue  -  outlier posts not yet AI-analysed ─────────────────────

export const getAnalysisQueue = query({
  args: {
    days:  v.optional(v.number()),
    limit: v.optional(v.number()),
  },
  handler: async (ctx, args) => {
    let posts = await ctx.db.query("scrapedPosts").collect();
    posts = posts.filter(p => !p.externalId?.startsWith('seed_') && p.aiAnalysis == null);

    const days   = args.days ?? 90;
    const cutoff = Date.now() - days * 24 * 60 * 60 * 1000;

    // Two-tier: (a) explicitly saved for pipeline (no day cutoff - user intent),
    // (b) auto-threshold posts within the day window
    const qualified = posts.filter(p =>
      p.savedForPipeline === true ||
      (
        (p.postedAt ?? 0) > cutoff &&
        (p.outlierRatio != null ? p.outlierRatio >= 1.5 : (p.engagementRate ?? 0) >= 0.05)
      )
    );

    // savedForPipeline first (FIFO by savedAt), then threshold posts by outlierRatio desc
    qualified.sort((a, b) => {
      const aSaved = a.savedForPipeline === true;
      const bSaved = b.savedForPipeline === true;
      if (aSaved && !bSaved) return -1;
      if (!aSaved && bSaved) return 1;
      if (aSaved && bSaved)  return (a.savedAt ?? 0) - (b.savedAt ?? 0);
      const ar = a.outlierRatio ?? (a.engagementRate ?? 0) * 10;
      const br = b.outlierRatio ?? (b.engagementRate ?? 0) * 10;
      return br - ar;
    });

    return qualified.slice(0, args.limit ?? 20).map(p => ({
      _id:                 p._id,
      handle:              p.handle,
      niche:               p.niche,
      contentType:         p.contentType,
      thumbnailUrl:        p.thumbnailUrl,
      caption:             p.caption ?? '',
      engagementRate:      p.engagementRate ?? 0,
      outlierRatio:        p.outlierRatio ?? parseFloat(((p.engagementRate ?? 0) * 10).toFixed(2)),
      videoUrl:            p.videoUrl,
      videoDownloadStatus: p.videoDownloadStatus ?? (p.videoUrl ? 'ready' : 'pending'),
      savedForPipeline:    p.savedForPipeline === true,
      savedAt:             p.savedAt,
      postedAt:            p.postedAt ?? 0,
      views:               p.views  ?? 0,
      saves:               p.saves  ?? 0,
      likes:               p.likes  ?? 0,
    }));
  },
});

// ── Analysed posts  -  posts with completed aiAnalysis ───────────────────────

export const getAnalysedPosts = query({
  args: {
    days:  v.optional(v.number()),
    niche: v.optional(v.string()),
    limit: v.optional(v.number()),
  },
  handler: async (ctx, args) => {
    let posts = await ctx.db.query("scrapedPosts").collect();
    posts = posts.filter(p => !p.externalId?.startsWith('seed_') && p.aiAnalysis != null);

    const days   = args.days ?? 90;
    const cutoff = Date.now() - days * 24 * 60 * 60 * 1000;
    posts = posts.filter(p => (p.postedAt ?? 0) > cutoff);
    if (args.niche && args.niche !== 'all') posts = posts.filter(p => p.niche === args.niche);

    posts.sort((a, b) => (b.aiAnalysis!.hookScore) - (a.aiAnalysis!.hookScore));

    return posts.slice(0, args.limit ?? 40).map(p => ({
      // Full DrawerPost-compatible shape
      _id:            p._id,
      externalId:     p.externalId,
      handle:         p.handle,
      platform:       p.platform ?? 'instagram',
      niche:          p.niche,
      contentType:    p.contentType,
      thumbnailUrl:   p.thumbnailUrl,
      videoUrl:       p.videoUrl,
      caption:        p.caption,
      hashtags:       p.hashtags,
      likes:          p.likes ?? 0,
      views:          p.views ?? 0,
      saves:          p.saves ?? 0,
      comments:       p.comments ?? 0,
      engagementRate: p.engagementRate ?? 0,
      outlierRatio:   p.outlierRatio,
      postedAt:       p.postedAt ?? 0,
      scrapedAt:      p.scrapedAt,
      saved:          p.saved ?? false,
      aiAnalysis:     p.aiAnalysis!,
    }));
  },
});

// ── Analysis pipeline stats  -  funnel from qualified → downloaded → analyzed ──

export const getAnalysisPipelineStats = query({
  args: {},
  handler: async (ctx) => {
    const posts = await ctx.db.query('scrapedPosts').collect();
    const real      = posts.filter(p => !p.externalId?.startsWith('seed_'));
    const qualified = real.filter(p => p.savedForPipeline === true);
    const ready     = qualified.filter(p => p.videoDownloadStatus === 'ready');
    const analyzed  = ready.filter(p => !!p.aiAnalysis);
    return {
      totalQualified:    qualified.length,
      downloading:       qualified.filter(p => p.videoDownloadStatus === 'downloading').length,
      downloaded:        ready.length,
      pendingDownload:   qualified.filter(p => !p.videoDownloadStatus || p.videoDownloadStatus === 'pending').length,
      downloadFailed:    qualified.filter(p => p.videoDownloadStatus === 'expired' || p.videoDownloadStatus === 'failed').length,
      analyzed:          analyzed.length,
      queuedForAnalysis: ready.length - analyzed.length,
    };
  },
});

// ── Patch video download status on a post ─────────────────────────────────────

export const patchVideoDownload = mutation({
  args: {
    postId:    v.id("scrapedPosts"),
    status:    v.union(
      v.literal("pending"), v.literal("downloading"),
      v.literal("ready"),   v.literal("expired"),
      v.literal("failed")
    ),
    videoUrl:  v.optional(v.string()),
    error:     v.optional(v.string()),
  },
  handler: async (ctx, { postId, status, videoUrl, error }) => {
    const patch: Record<string, unknown> = { videoDownloadStatus: status };
    if (videoUrl)           patch.videoUrl          = videoUrl;
    if (error)              patch.videoDownloadError = error;
    if (status === 'ready') patch.videoDownloadedAt  = Date.now();
    await ctx.db.patch(postId, patch);
  },
});

// downloadPostToR2 action lives in convex/intelligenceNode.ts ("use node" runtime)
// It uses @aws-sdk/client-s3 directly to upload to R2.

// ── Heatmap data  -  7-day × 24-hour grid of engagement activity ────────────────

export const getHeatmapData = query({
  args: { days: v.optional(v.number()) },
  handler: async (ctx, args) => {
    const days   = args.days ?? 30;
    const cutoff = Date.now() - days * 24 * 60 * 60 * 1000;

    const posts = await ctx.db.query("scrapedPosts").collect();
    const real  = posts.filter(p =>
      !p.externalId?.startsWith('seed_') &&
      (p.postedAt ?? 0) > cutoff
    );

    // 7 rows (Mon–Sun) × 8 columns (3-hour buckets: 0,3,6,9,12,15,18,21)
    const DAYS  = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
    const HOURS = [0, 3, 6, 9, 12, 15, 18, 21];

    // Accumulate: sum + count per cell
    const cells: Record<string, { sum: number; count: number }> = {};
    for (const d of DAYS) {
      for (const h of HOURS) {
        cells[`${d}_${h}`] = { sum: 0, count: 0 };
      }
    }

    for (const p of real) {
      const date = new Date(p.postedAt);
      const dow  = DAYS[date.getDay() === 0 ? 6 : date.getDay() - 1]; // Mon=0
      const hr   = date.getHours();
      const bucket = HOURS.find(h => hr >= h && hr < h + 3) ?? HOURS[Math.floor(hr / 3)];
      const key  = `${dow}_${bucket}`;
      if (cells[key]) {
        cells[key].sum   += p.engagementRate ?? 0;
        cells[key].count += 1;
      }
    }

    // Build heatmap rows
    const heatmapData = DAYS.map(day => ({
      key: day,
      data: HOURS.map(h => {
        const c = cells[`${day}_${h}`];
        return {
          key:  `${h}h`,
          data: c.count > 0 ? parseFloat((c.sum / c.count).toFixed(4)) : null,
        };
      }),
    }));

    // Stats
    const allER    = real.map(p => p.engagementRate ?? 0);
    const avgER    = allER.length ? allER.reduce((s, v) => s + v, 0) / allER.length : 0;
    const topPosts = [...real].sort((a, b) => (b.engagementRate ?? 0) - (a.engagementRate ?? 0)).slice(0, 5);

    // Niche breakdown
    const nicheMap: Record<string, number> = {};
    for (const p of real) {
      nicheMap[p.niche] = (nicheMap[p.niche] ?? 0) + 1;
    }
    const topNiche = Object.entries(nicheMap).sort((a, b) => b[1] - a[1])[0]?.[0] ?? 'N/A';

    // Posts this week vs last
    const now        = Date.now();
    const weekMs     = 7 * 24 * 60 * 60 * 1000;
    const thisWeek   = real.filter(p => (p.postedAt ?? 0) > now - weekMs).length;
    const lastWeek   = real.filter(p => {
      const t = p.postedAt ?? 0;
      return t > now - weekMs * 2 && t <= now - weekMs;
    }).length;
    const pctChange = lastWeek > 0 ? parseFloat((((thisWeek - lastWeek) / lastWeek) * 100).toFixed(1)) : 0;

    // Metric list — derive from real posts
    const totalViews   = real.reduce((s, p) => s + (p.views ?? 0), 0);
    const totalSaves   = real.reduce((s, p) => s + (p.saves ?? 0), 0);
    const totalLikes  = real.reduce((s, p) => s + (p.likes ?? 0), 0);

    const avgViews    = real.length ? totalViews / real.length : 0;
    const avgSaves    = real.length ? totalSaves / real.length : 0;
    const avgLikes    = real.length ? totalLikes / real.length : 0;

    return {
      heatmapData,
      stats: {
        totalPosts:      real.length,
        postsThisWeek:   thisWeek,
        postsLastWeek:   lastWeek,
        pctChange,
        avgEngagementRate: parseFloat((avgER * 100).toFixed(2)),
        topNiche,
        topPosts: topPosts.map(p => ({
          handle:    p.handle,
          niche:     p.niche,
          er:        parseFloat(((p.engagementRate ?? 0) * 100).toFixed(2)),
          views:     p.views ?? 0,
          likes:     p.likes ?? 0,
          saves:     p.saves ?? 0,
        })),
      },
      metrics: {
        avgViews:    Math.round(avgViews).toLocaleString(),
        avgSaves:    Math.round(avgSaves).toLocaleString(),
        avgLikes:    Math.round(avgLikes).toLocaleString(),
        totalPosts:  real.length,
      },
    };
  },
});

// ── Hook stats  -  aggregate hookScore distribution + emotion frequency ───────

export const getHookStats = query({
  args: { days: v.optional(v.number()) },
  handler: async (ctx, args) => {
    let posts = await ctx.db.query("scrapedPosts").collect();
    posts = posts.filter(p => !p.externalId?.startsWith('seed_') && p.aiAnalysis != null);

    const days   = args.days ?? 90;
    const cutoff = Date.now() - days * 24 * 60 * 60 * 1000;
    posts = posts.filter(p => (p.postedAt ?? 0) > cutoff);

    if (posts.length === 0) return { scoreDistribution: [], emotionFrequency: [], hookLines: [] };

    // Score distribution: bucket into 0-2, 2-4, 4-6, 6-8, 8-10
    const buckets = [0, 0, 0, 0, 0];
    const emotionMap: Record<string, { count: number; erSum: number }> = {};

    for (const p of posts) {
      const score = p.aiAnalysis!.hookScore;
      const idx   = Math.min(4, Math.floor(score / 2));
      buckets[idx]++;

      for (const e of p.aiAnalysis!.emotions) {
        const key = e.toLowerCase();
        if (!emotionMap[key]) emotionMap[key] = { count: 0, erSum: 0 };
        emotionMap[key].count++;
        emotionMap[key].erSum += p.engagementRate ?? 0;
      }
    }

    const scoreDistribution = buckets.map((count, i) => ({
      label: `${i * 2}-${i * 2 + 2}`,
      count,
    }));

    const emotionFrequency = Object.entries(emotionMap)
      .map(([emotion, d]) => ({
        emotion,
        count:  d.count,
        avgER:  parseFloat((d.erSum / d.count).toFixed(4)),
      }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 10);

    const hookLines = posts
      .sort((a, b) => b.aiAnalysis!.hookScore - a.aiAnalysis!.hookScore)
      .slice(0, 12)
      .map(p => ({
        hookLine:       p.aiAnalysis!.hookLine,
        hookScore:      p.aiAnalysis!.hookScore,
        handle:         p.handle,
        niche:          p.niche,
        engagementRate: p.engagementRate ?? 0,
      }));

    return { scoreDistribution, emotionFrequency, hookLines };
  },
});

// ── Scrape progress — live post count per handle since a given timestamp ─────

export const getScrapeProgress = query({
  args: {
    handles: v.array(v.string()),
    since:   v.number(), // timestamp ms
  },
  handler: async (ctx, { handles, since }) => {
    if (handles.length === 0) return [];
    const handleSet = new Set(handles);
    const allPosts = await ctx.db.query("scrapedPosts").collect();
    const counts = new Map<string, number>();
    for (const h of handles) counts.set(h, 0);
    for (const p of allPosts) {
      if (handleSet.has(p.handle) && (p.scrapedAt ?? 0) >= since) {
        counts.set(p.handle, (counts.get(p.handle) ?? 0) + 1);
      }
    }
    return handles.map(h => ({ handle: h, postsScraped: counts.get(h) ?? 0 }));
  },
});

// ── V2 analytics: insert/upsert structured feature vector ────────────────────

const ENUM_HOOK_STRUCTURE   = ["question","shock_claim","negation","listicle","pov","before_after","visual_hook","transformation_tease","direct_command","storytime","other","unknown"] as const;
const ENUM_HOOK_MODALITY    = ["spoken","on_screen_text","visual_only","audio_cue","mixed","unknown"] as const;
const ENUM_FIRST_FRAME_TYPE = ["face_closeup","face_medium","body_full","product","environment","text_card","action_in_progress","unknown"] as const;
const ENUM_FORMAT_PRIMARY   = ["talking_head","voiceover_b_roll","pov_action","transition_montage","lipsync","tutorial_demo","reaction","skit_scripted","text_on_screen_silent","product_showcase","thirst_trap_static","before_after_reveal","dance_performance","day_in_life_vlog","other","unknown"] as const;
const ENUM_SETTING          = ["home_bedroom","home_other","gym","outdoor_urban","outdoor_nature","studio","car","mirror","other","unknown"] as const;
const ENUM_FACE_VISIBILITY  = ["full","partial","obscured","none","unknown"] as const;
const ENUM_CUTS_BUCKET      = ["low","med","high","extreme","unknown"] as const;
const ENUM_MUSIC_ENERGY     = ["none","low","mid","high"] as const;
const ENUM_SPEAKING_PACE    = ["slow","normal","fast","rapid","unknown"] as const;
const ENUM_EMOTION          = ["neutral","confident","playful","seductive","intense","vulnerable","excited","deadpan","angry","joyful","unknown"] as const;
const ENUM_VIBE             = ["aspirational","relatable","educational","provocative","cozy","hype","controversial","wholesome","premium","raw_authentic","humorous","motivational","sensual","unknown"] as const;
const ENUM_CTA_TYPE         = ["save","comment","share","follow","dm","link_bio","none","unknown"] as const;
const ENUM_CAPTION_LENGTH   = ["short","medium","long"] as const;

function clamp<T extends string>(val: unknown, valid: readonly T[], fallback: T): T {
  return valid.includes(val as T) ? (val as T) : fallback;
}

export const insertAnalysisV2 = mutation({
  args: {
    postId:         v.id("scrapedPosts"),
    handle:         v.string(),
    niche:          v.string(),
    outlierRatio:   v.optional(v.number()),
    engagementRate: v.number(),
    views:          v.number(),
    saves:          v.number(),
    likes:          v.number(),
    // All enum fields passed as plain strings — clamped to valid values in handler
    hookStructure:           v.string(),
    hookModality:            v.string(),
    firstFrameType:          v.string(),
    spokenFirstWords:        v.optional(v.string()),
    onScreenTextFirstFrame:  v.optional(v.string()),
    curiosityGapPresent:     v.boolean(),
    patternInterruptPresent: v.boolean(),
    directAddress:           v.boolean(),
    hookDurationSec:         v.optional(v.number()),
    formatPrimary:       v.string(),
    setting:             v.string(),
    creatorOnScreen:     v.boolean(),
    faceVisibility:      v.string(),
    energyLevel:         v.number(),
    cutsPerSecondBucket: v.string(),
    hasJumpCuts:    v.boolean(),
    hasSpeedRamps:  v.boolean(),
    hasZoomPunches: v.boolean(),
    hasSpokenWords:      v.boolean(),
    hasVoiceover:        v.boolean(),
    musicEnergy:         v.string(),
    soundEffectsPresent: v.boolean(),
    speakingPace:        v.string(),
    creatorExpressedEmotion: v.string(),
    vibeKeyword:             v.string(),
    captionHasCTA:       v.boolean(),
    captionAddsContext:  v.boolean(),
    captionRepeatsVideo: v.boolean(),
    ctaType:             v.string(),
    captionLengthBucket: v.string(),
    hashtagCount:        v.optional(v.number()),
    transcript:          v.optional(v.string()),
    onScreenTextFull:    v.optional(v.string()),
    extractionModel:      v.string(),
    promptVersion:        v.string(),
    extractionConfidence: v.number(),
    extractionFlags:      v.array(v.string()),
    rawResponse:          v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    // Delete any existing row for same post + prompt version (upsert)
    const existing = await ctx.db
      .query("postAnalyses")
      .withIndex("by_post_id", q => q.eq("postId", args.postId))
      .collect();
    for (const old of existing.filter(r => r.promptVersion === args.promptVersion)) {
      await ctx.db.delete(old._id);
    }

    await ctx.db.insert("postAnalyses", {
      postId:         args.postId,
      handle:         args.handle,
      niche:          args.niche,
      outlierRatio:   args.outlierRatio,
      engagementRate: args.engagementRate,
      views:          args.views,
      saves:          args.saves,
      likes:          args.likes,
      hookStructure:           clamp(args.hookStructure,           ENUM_HOOK_STRUCTURE,   "unknown"),
      hookModality:            clamp(args.hookModality,            ENUM_HOOK_MODALITY,    "unknown"),
      firstFrameType:          clamp(args.firstFrameType,          ENUM_FIRST_FRAME_TYPE, "unknown"),
      spokenFirstWords:        args.spokenFirstWords,
      onScreenTextFirstFrame:  args.onScreenTextFirstFrame,
      curiosityGapPresent:     args.curiosityGapPresent,
      patternInterruptPresent: args.patternInterruptPresent,
      directAddress:           args.directAddress,
      hookDurationSec:         args.hookDurationSec,
      formatPrimary:       clamp(args.formatPrimary,       ENUM_FORMAT_PRIMARY,  "unknown"),
      setting:             clamp(args.setting,             ENUM_SETTING,         "unknown"),
      creatorOnScreen:     args.creatorOnScreen,
      faceVisibility:      clamp(args.faceVisibility,      ENUM_FACE_VISIBILITY, "unknown"),
      energyLevel:         Math.min(5, Math.max(1, Math.round(args.energyLevel || 3))),
      cutsPerSecondBucket: clamp(args.cutsPerSecondBucket, ENUM_CUTS_BUCKET,     "unknown"),
      hasJumpCuts:    args.hasJumpCuts,
      hasSpeedRamps:  args.hasSpeedRamps,
      hasZoomPunches: args.hasZoomPunches,
      hasSpokenWords:      args.hasSpokenWords,
      hasVoiceover:        args.hasVoiceover,
      musicEnergy:         clamp(args.musicEnergy,   ENUM_MUSIC_ENERGY,  "none"),
      soundEffectsPresent: args.soundEffectsPresent,
      speakingPace:        clamp(args.speakingPace,  ENUM_SPEAKING_PACE, "unknown"),
      creatorExpressedEmotion: clamp(args.creatorExpressedEmotion, ENUM_EMOTION, "unknown"),
      vibeKeyword:             clamp(args.vibeKeyword,             ENUM_VIBE,    "unknown"),
      captionHasCTA:       args.captionHasCTA,
      captionAddsContext:  args.captionAddsContext,
      captionRepeatsVideo: args.captionRepeatsVideo,
      ctaType:             clamp(args.ctaType,             ENUM_CTA_TYPE,      "unknown"),
      captionLengthBucket: clamp(args.captionLengthBucket, ENUM_CAPTION_LENGTH, "short"),
      hashtagCount:        args.hashtagCount,
      transcript:          args.transcript,
      onScreenTextFull:    args.onScreenTextFull,
      extractionModel:      args.extractionModel,
      promptVersion:        args.promptVersion,
      extractionConfidence: Math.min(5, Math.max(1, Math.round(args.extractionConfidence || 3))),
      extractionFlags:      args.extractionFlags,
      analyzedAt:           Date.now(),
      rawResponse:          args.rawResponse,
    });
  },
});

export const getAnalysisV2ForPost = query({
  args: { postId: v.id("scrapedPosts") },
  handler: async (ctx, args) => {
    const rows = await ctx.db
      .query("postAnalyses")
      .withIndex("by_post_id", q => q.eq("postId", args.postId))
      .collect();
    if (rows.length === 0) return null;
    rows.sort((a, b) => b.analyzedAt - a.analyzedAt);
    return rows[0];
  },
});

export const getRuleLeaderboard = query({
  args: {
    groupBy: v.union(v.literal("hook"), v.literal("format"), v.literal("vibe"), v.literal("emotion")),
    niche:   v.optional(v.string()),
    limit:   v.optional(v.number()),
  },
  handler: async (ctx, args) => {
    let rows = args.niche && args.niche !== "all"
      ? await ctx.db.query("postAnalyses").withIndex("by_niche", q => q.eq("niche", args.niche!)).collect()
      : await ctx.db.query("postAnalyses").collect();

    type Bucket = { key: string; niche: string; count: number; outlierSum: number; erSum: number };
    const map: Record<string, Bucket> = {};

    for (const r of rows) {
      const dimension =
        args.groupBy === "hook"    ? r.hookStructure :
        args.groupBy === "format"  ? r.formatPrimary :
        args.groupBy === "vibe"    ? r.vibeKeyword   :
        r.creatorExpressedEmotion;
      if (dimension === "unknown") continue;
      const key = `${r.niche}::${dimension}`;
      if (!map[key]) map[key] = { key: dimension, niche: r.niche, count: 0, outlierSum: 0, erSum: 0 };
      map[key].count++;
      map[key].outlierSum += r.outlierRatio ?? 0;
      map[key].erSum      += r.engagementRate;
    }

    return Object.values(map)
      .map(b => ({
        niche:      b.niche,
        dimension:  b.key,
        count:      b.count,
        avgOutlier: parseFloat((b.outlierSum / b.count).toFixed(2)),
        avgER:      parseFloat(((b.erSum / b.count) * 100).toFixed(2)),
      }))
      .sort((a, b) => b.avgOutlier - a.avgOutlier)
      .slice(0, args.limit ?? 20);
  },
});

// ── One-time migration: patch stale documents missing required fields ──────────
export const patchLegacyScrapedPosts = mutation({
  args: {},
  handler: async (ctx) => {
    const all = await ctx.db.query("scrapedPosts").collect();
    let patched = 0;
    for (const doc of all) {
      const updates: Record<string, unknown> = {};
      if ((doc as any).saved === undefined)    updates.saved    = false;
      if ((doc as any).boardIds === undefined) updates.boardIds = [];
      if (Object.keys(updates).length > 0) {
        await ctx.db.patch(doc._id, updates);
        patched++;
      }
    }
    return { patched, total: all.length };
  },
});
