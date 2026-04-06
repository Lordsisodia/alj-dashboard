import { query, mutation } from './_generated/server';

export const list = query({
  args: {},
  handler: async (ctx) => {
    return await ctx.db
      .query('agentReports')
      .withIndex('by_generated_at')
      .order('desc')
      .collect();
  },
});

export const seed = mutation({
  args: {},
  handler: async (ctx) => {
    const existing = await ctx.db.query('agentReports').first();
    if (existing) return;

    const now = Date.now();
    const reports = [
      {
        title: 'Weekly Intelligence Report  -  Apr 6, 2026',
        category: 'Intelligence' as const,
        insights: [
          'GFE content engagement up 12% week-over-week across tracked accounts',
          'Short-form reels under 30s outperforming 60s+ clips by 2.4x in saves',
          '@fitness_king posted 9 reels this week  -  highest cadence of tracked competitors',
          'Trending hook pattern: "Day in my life" style intros driving 3.1x saves vs. direct promo',
        ],
        generatedBy: 'Intelligence Indexer',
        generatedAt: now - 2 * 60 * 60 * 1000, // 2h ago  -  shows NEW
      },
      {
        title: 'Competitor Recon Digest  -  Apr 3, 2026',
        category: 'Recon' as const,
        insights: [
          '@gfe_luxe has the highest average engagement rate at 7.8%  -  up from 6.2% last month',
          'Competitors averaging 8.4 posts/week; our models currently at 6.2  -  gap to close',
          '@lifestyle.nova gained 22K followers this week, likely driven by a viral reel',
          'Paused competitors show 31% lower follower growth vs. active scraped accounts',
        ],
        generatedBy: 'Recon Scraper #1',
        generatedAt: now - 3 * 24 * 60 * 60 * 1000, // 3d ago
      },
      {
        title: 'Performance Snapshot  -  Mar 31, 2026',
        category: 'Performance' as const,
        insights: [
          'Top performing creator this week: @ellamira  -  19.8K likes on single post',
          'Schedule adherence at 94%  -  1 post missed due to approval delay',
          'Average time-to-post after approval: 4.2 hours (target: under 2 hours)',
        ],
        generatedBy: 'Weekly Report Agent',
        generatedAt: now - 6 * 24 * 60 * 60 * 1000, // 6d ago
      },
    ];

    for (const r of reports) {
      await ctx.db.insert('agentReports', r);
    }
  },
});
