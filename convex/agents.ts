import { query, mutation } from "./_generated/server";
import { v } from "convex/values";

// ── Queries ───────────────────────────────────────────────────────────────────

export const getAgentRuns = query({
  args: {},
  handler: async (ctx) => {
    const runs = await ctx.db.query("agentRuns").collect();
    return runs.sort((a, b) => b.startedAt - a.startedAt);
  },
});

export const getAgentReports = query({
  args: {},
  handler: async (ctx) => {
    return await ctx.db.query("agentReports").collect();
  },
});

export const getFeatureRequests = query({
  args: {},
  handler: async (ctx) => {
    const reqs = await ctx.db.query("featureRequests").collect();
    return reqs.sort((a, b) => {
      const order = { 'Queued': 0, 'In Progress': 1, 'Delivered': 2 } as const;
      return (order[a.status as keyof typeof order] ?? 0) - (order[b.status as keyof typeof order] ?? 0);
    });
  },
});

// ── Mutations ─────────────────────────────────────────────────────────────────

export const retryRun = mutation({
  args: { id: v.id("agentRuns") },
  handler: async (ctx, { id }) => {
    await ctx.db.patch(id, {
      status: "running",
      progress: 0,
      outputPreview: "Retrying...",
    });
  },
});

export const addRun = mutation({
  args: {
    agentName: v.string(),
    type: v.union(v.literal("Scraper"), v.literal("Scheduler"), v.literal("Analyst")),
    description: v.string(),
  },
  handler: async (ctx, args) => {
    await ctx.db.insert("agentRuns", {
      agentName: args.agentName,
      type: args.type,
      description: args.description,
      status: "running",
      startedAt: Date.now(),
      duration: "0m 00s",
      progress: 0,
      outputPreview: "Starting...",
    });
  },
});

export const submitRequest = mutation({
  args: {
    title: v.string(),
    description: v.string(),
    requestedBy: v.string(),
    priority: v.union(v.literal("Low"), v.literal("Medium"), v.literal("High")),
  },
  handler: async (ctx, args) => {
    await ctx.db.insert("featureRequests", {
      title: args.title,
      description: args.description,
      requestedBy: args.requestedBy,
      submittedAt: Date.now(),
      status: "Queued",
      eta: "72hr SLA",
      priority: args.priority,
    });
  },
});

export const seedAgents = mutation({
  args: {},
  handler: async (ctx) => {
    // Guard: don't re-seed if data already exists
    const existingRun = await ctx.db.query("agentRuns").first();
    if (existingRun) return;

    const now = Date.now();

    // ── Agent runs ──
    await ctx.db.insert("agentRuns", {
      agentName: "Recon Scraper #1",
      type: "Scraper",
      description: "Scraping competitor @fitness_king  -  found 23 new posts",
      status: "running",
      startedAt: now - 134_000,
      duration: "2m 14s",
      progress: 68,
      outputPreview: "23 posts found, 18 processed, 5 queued...",
    });

    await ctx.db.insert("agentRuns", {
      agentName: "Intelligence Indexer",
      type: "Analyst",
      description: "Indexing 412 new reels from community feed  -  niche tagging in progress",
      status: "running",
      startedAt: now - 422_000,
      duration: "7m 02s",
      progress: 41,
      outputPreview: "Tagged 169/412 reels. Dominant niches: Fitness (34%), GFE (28%)...",
    });

    await ctx.db.insert("agentRuns", {
      agentName: "Post Scheduler Bot",
      type: "Scheduler",
      description: "Scheduled 8 posts for @abg.ricebunny across the next 7 days",
      status: "completed",
      startedAt: now - 5_700_000,
      duration: "0m 48s",
      progress: 100,
      outputPreview: "8 posts queued. Next: Apr 7 at 6:00 PM.",
    });

    await ctx.db.insert("agentRuns", {
      agentName: "Recon Scraper #2",
      type: "Scraper",
      description: "Attempted scrape of @glam.gfe  -  rate limit reached, retrying in 30 min",
      status: "failed",
      startedAt: now - 8_100_000,
      duration: "0m 12s",
      progress: 0,
      outputPreview: "Error: 429 Too Many Requests. Retry scheduled 2:00 PM.",
    });

    await ctx.db.insert("agentRuns", {
      agentName: "Weekly Report Agent",
      type: "Analyst",
      description: "Generated weekly intelligence report  -  14 insights extracted",
      status: "completed",
      startedAt: now - 22_800_000,
      duration: "3m 21s",
      progress: 100,
      outputPreview: "Report saved. Top insight: GFE engagement up 12% WoW.",
    });

    // ── Agent reports ──
    const existingReport = await ctx.db.query("agentReports").first();
    if (!existingReport) {
      await ctx.db.insert("agentReports", {
        title: "Weekly Intelligence Report  -  Apr 5, 2026",
        insights: [
          "GFE content engagement up 12% week-over-week across tracked accounts",
          "Short-form reels under 30s outperforming 60s+ clips by 2.4x in saves",
          "@fitness_king posted 9 reels this week  -  highest cadence of tracked competitors",
          'Trending hook pattern: "Day in my life" style intros driving 3.1x saves vs. direct promo',
        ],
        generatedBy: "Intelligence Indexer",
        generatedAt: now - 2 * 60 * 60 * 1000,
        category: "Intelligence",
      });

      await ctx.db.insert("agentReports", {
        title: "Competitor Recon Digest  -  Apr 3, 2026",
        insights: [
          "@gfe_luxe has the highest average engagement rate at 7.8%  -  up from 6.2% last month",
          "Competitors averaging 8.4 posts/week; our models currently at 6.2  -  gap to close",
          "@lifestyle.nova gained 22K followers this week, likely driven by a viral reel",
          "Paused competitors show 31% lower follower growth vs. active scraped accounts",
        ],
        generatedBy: "Recon Scraper #1",
        generatedAt: now - 3 * 24 * 60 * 60 * 1000,
        category: "Recon",
      });

      await ctx.db.insert("agentReports", {
        title: "Performance Snapshot  -  Mar 31, 2026",
        insights: [
          "Top performing creator this week: @ellamira  -  19.8K likes on single post",
          "Schedule adherence at 94%  -  1 post missed due to approval delay",
          "Average time-to-post after approval: 4.2 hours (target: under 2 hours)",
        ],
        generatedBy: "Weekly Report Agent",
        generatedAt: now - 6 * 24 * 60 * 60 * 1000,
        category: "Performance",
      });
    }

    // ── Feature requests ──
    const existingReq = await ctx.db.query("featureRequests").first();
    if (!existingReq) {
      await ctx.db.insert("featureRequests", {
        title: "Auto-caption generation for Reels",
        description: "Automatically generate captions with relevant hashtags when scheduling a new reel, based on niche and content tags.",
        requestedBy: "Shaan S.",
        submittedAt: new Date("Apr 4, 2026").getTime(),
        status: "In Progress",
        eta: "Apr 10, 2026",
        priority: "High",
      });

      await ctx.db.insert("featureRequests", {
        title: "Competitor content alerts",
        description: "Push notification when a tracked competitor posts content that exceeds a set engagement threshold.",
        requestedBy: "Shaan S.",
        submittedAt: new Date("Apr 2, 2026").getTime(),
        status: "Queued",
        eta: "72hr SLA",
        priority: "Medium",
      });

      await ctx.db.insert("featureRequests", {
        title: "Board sharing via link",
        description: "Allow boards in Intelligence to be shared externally via a read-only link for client presentations.",
        requestedBy: "Shaan S.",
        submittedAt: new Date("Mar 30, 2026").getTime(),
        status: "Delivered",
        eta: "Shipped",
        priority: "Low",
      });

      await ctx.db.insert("featureRequests", {
        title: "CSV export for recon data",
        description: "Export competitor stats (followers, engagement rate, posts/week) as a downloadable CSV for reporting.",
        requestedBy: "Shaan S.",
        submittedAt: new Date("Mar 28, 2026").getTime(),
        status: "Queued",
        eta: "72hr SLA",
        priority: "Low",
      });
    }
  },
});
