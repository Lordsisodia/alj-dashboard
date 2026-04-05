import { query, mutation } from "./_generated/server";
import { v } from "convex/values";

// ── Feed query — powers the Intelligence Community Feed ──────────────────────

export const getFeed = query({
  args: {
    niche:       v.optional(v.string()),
    contentType: v.optional(v.string()),
    sortBy:      v.optional(v.union(v.literal("newest"), v.literal("trending"), v.literal("top"))),
    limit:       v.optional(v.number()),
  },
  handler: async (ctx, args) => {
    let posts = await ctx.db.query("scrapedPosts").collect();

    if (args.niche && args.niche !== "all") {
      posts = posts.filter(p => p.niche === args.niche);
    }
    if (args.contentType && args.contentType !== "all") {
      posts = posts.filter(p => p.contentType === args.contentType);
    }

    if (args.sortBy === "trending") {
      // Trending = high engagement rate, posted within last 14 days
      const cutoff = Date.now() - 14 * 24 * 60 * 60 * 1000;
      posts = posts.filter(p => p.postedAt > cutoff);
      posts.sort((a, b) => b.engagementRate - a.engagementRate);
    } else if (args.sortBy === "top") {
      posts.sort((a, b) => b.engagementRate - a.engagementRate);
    } else {
      // newest
      posts.sort((a, b) => b.postedAt - a.postedAt);
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

// ── Seed with realistic OFM/lifestyle posts ───────────────────────────────────

export const seedIntelligenceFeed = mutation({
  args: {},
  handler: async (ctx) => {
    // Check if already seeded
    const existing = await ctx.db.query("scrapedPosts").take(1);
    if (existing.length > 0) return { seeded: false, reason: "already seeded" };

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
      { handle: "@rhinxrenx",      contentType: "reel",     niche: "Fitness",   caption: "What I eat in a day as a gym guy. Full transparency — real food, real results.", hashtags: ["#whatieat","#mealprep","#gymfood","#nutrition"], likes: 11800, comments: 445, saves: 1680, views: 167000, reach: 198000, daysAgo: 7 },
      { handle: "@lifestylebylee", contentType: "carousel", niche: "Lifestyle", caption: "Morning routine dump. This is what a slow morning looks like when you actually protect your time.", hashtags: ["#morningroutine","#slowliving","#selfcare","#lifestyle"], likes: 12400, comments: 521, saves: 2800, views: 0, reach: 178000, daysAgo: 3 },
      { handle: "@fitqueenmanila", contentType: "carousel", niche: "Fitness",   caption: "Glute workout guide. 4 exercises, 4 sets each. Save this — you'll thank me later.", hashtags: ["#gluteworkout","#legday","#fitness","#gym"], likes: 19800, comments: 612, saves: 5400, views: 0, reach: 287000, daysAgo: 5 },
      { handle: "@gfevibez",       contentType: "post",     niche: "GFE",       caption: "Sunday soft life. This is the reset I needed after a long week.", hashtags: ["#sundayvibes","#selfcare","#cozy","#softlife"], likes: 9100, comments: 267, saves: 890, views: 0, reach: 132000, daysAgo: 8 },
      { handle: "@ellamira",       contentType: "reel",     niche: "Lifestyle", caption: "Rooftop sunset shoot. Manila at magic hour is something else entirely.", hashtags: ["#sunset","#manila","#rooftop","#goldenhour"], likes: 8400, comments: 231, saves: 720, views: 124000, reach: 148000, daysAgo: 9 },
      { handle: "@manilafitnation",contentType: "post",     niche: "Fitness",   caption: "Progress pics drop every 30 days. The compound effect is real — trust the process.", hashtags: ["#progresspics","#bodybuilding","#fitness","#transformation"], likes: 22400, comments: 734, saves: 3100, views: 0, reach: 312000, daysAgo: 4 },
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
        externalId:     `ig_${p.handle.replace("@","")}_${Date.now()}_${Math.random()}`,
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
