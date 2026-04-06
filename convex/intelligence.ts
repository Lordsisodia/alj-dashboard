import { query, mutation } from "./_generated/server";
import { v } from "convex/values";

// ── Feed query  -  powers the Intelligence Community Feed ──────────────────────

export const getFeed = query({
  args: {
    niche:       v.optional(v.string()),
    contentType: v.optional(v.string()),
    sortBy:      v.optional(v.union(
      v.literal("newest"),
      v.literal("oldest"),
      v.literal("most-likes"),
      v.literal("most-views"),
      v.literal("most-saves"),
      v.literal("top-engagement"),
      v.literal("trending"),
      v.literal("top")
    )),
    limit:       v.optional(v.number()),
  },
  handler: async (ctx, args) => {
    let posts = await ctx.db.query("scrapedPosts").collect();

    // Exclude seed data  -  only show real scraped posts
    posts = posts.filter(p => !p.externalId?.startsWith('seed_'));

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
      default:
        // newest
        posts.sort((a, b) => (b.postedAt ?? 0) - (a.postedAt ?? 0));
    }

    return posts.slice(0, args.limit ?? 40);
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
    return { totalIndexed: posts.length };
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
        handle:         acc.handle,
        displayName:    acc.displayName ?? acc.handle,
        niche:          acc.niche,
        followerCount:  acc.followerCount,
        avatarColor:    acc.avatarColor,
        totalPosts,
        totalLikes,
        totalViews,
        totalSaves,
        avgEngagement,
        postsThisWeek,
        trendBuckets,
        lastScrapedAt:  acc.lastScrapedAt ?? null,
        lastPostAt:     lastPost,
        status:         acc.status,
      };
    });
  },
});
