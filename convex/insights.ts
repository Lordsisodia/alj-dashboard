import { query } from "./_generated/server";

// ── Insights aggregation — powered by swipeRatings ───────────────────────────
//
// Joins all swipeRatings with scrapedPosts to produce:
//   summary         — total/up/down/save counts
//   nichePreferences — upRate + saveRate per niche, sorted by signal strength
//   formatPreferences — same per contentType
//   topRatedPosts   — top 12 by score (up + save×2)
//   raterActivity   — per-team-member totals, sorted by volume

export const getInsights = query({
  args: {},
  handler: async (ctx) => {
    const ratings = await ctx.db.query("swipeRatings").collect();

    const summary = {
      totalRatings: ratings.length,
      upCount:      ratings.filter(r => r.rating === "up").length,
      downCount:    ratings.filter(r => r.rating === "down").length,
      saveCount:    ratings.filter(r => r.rating === "save").length,
    };

    // Group votes by postId
    const byPost: Record<string, { up: number; down: number; save: number }> = {};
    for (const r of ratings) {
      const id = r.postId.toString();
      if (!byPost[id]) byPost[id] = { up: 0, down: 0, save: 0 };
      byPost[id][r.rating]++;
    }

    // Bulk-fetch all rated posts
    const postIds = [...new Set(ratings.map(r => r.postId))];
    const fetched = await Promise.all(postIds.map(id => ctx.db.get(id)));
    const postMap = new Map(fetched.filter(Boolean).map(p => [p!._id.toString(), p!]));

    // Aggregate niche preferences
    const nicheAgg: Record<string, { up: number; down: number; save: number; total: number }> = {};
    for (const [id, c] of Object.entries(byPost)) {
      const post = postMap.get(id);
      if (!post) continue;
      const n = post.niche ?? "Unknown";
      if (!nicheAgg[n]) nicheAgg[n] = { up: 0, down: 0, save: 0, total: 0 };
      nicheAgg[n].up    += c.up;
      nicheAgg[n].down  += c.down;
      nicheAgg[n].save  += c.save;
      nicheAgg[n].total += c.up + c.down + c.save;
    }
    const nichePreferences = Object.entries(nicheAgg)
      .map(([niche, c]) => ({
        niche,
        upRate:   c.total > 0 ? c.up   / c.total : 0,
        saveRate: c.total > 0 ? c.save / c.total : 0,
        total:    c.total,
      }))
      .filter(n => n.total >= 1)
      .sort((a, b) => (b.upRate + b.saveRate) - (a.upRate + a.saveRate));

    // Aggregate format preferences
    const formatAgg: Record<string, { up: number; down: number; save: number; total: number }> = {};
    for (const [id, c] of Object.entries(byPost)) {
      const post = postMap.get(id);
      if (!post) continue;
      const f = post.contentType ?? "Unknown";
      if (!formatAgg[f]) formatAgg[f] = { up: 0, down: 0, save: 0, total: 0 };
      formatAgg[f].up    += c.up;
      formatAgg[f].down  += c.down;
      formatAgg[f].save  += c.save;
      formatAgg[f].total += c.up + c.down + c.save;
    }
    const formatPreferences = Object.entries(formatAgg)
      .map(([format, c]) => ({
        format,
        upRate:   c.total > 0 ? c.up   / c.total : 0,
        saveRate: c.total > 0 ? c.save / c.total : 0,
        total:    c.total,
      }))
      .filter(f => f.total >= 1)
      .sort((a, b) => (b.upRate + b.saveRate) - (a.upRate + a.saveRate));

    // Top rated posts (score = up + save×2)
    const topRatedPosts = Object.entries(byPost)
      .map(([id, c]) => ({ post: postMap.get(id), ...c, score: c.up + c.save * 2 }))
      .filter(x => x.post != null && x.score > 0)
      .sort((a, b) => b.score - a.score)
      .slice(0, 12)
      .map(x => ({
        _id:            x.post!._id.toString(),
        handle:         x.post!.handle,
        niche:          x.post!.niche ?? "Unknown",
        contentType:    x.post!.contentType ?? "reel",
        thumbnailUrl:   x.post!.thumbnailUrl ?? "",
        caption:        x.post!.caption,
        engagementRate: x.post!.engagementRate ?? 0,
        upCount:        x.up,
        saveCount:      x.save,
        downCount:      x.down,
      }));

    // Rater leaderboard
    const raterAgg: Record<string, { total: number; up: number; save: number }> = {};
    for (const r of ratings) {
      if (!raterAgg[r.ratedBy]) raterAgg[r.ratedBy] = { total: 0, up: 0, save: 0 };
      raterAgg[r.ratedBy].total++;
      if (r.rating === "up")   raterAgg[r.ratedBy].up++;
      if (r.rating === "save") raterAgg[r.ratedBy].save++;
    }
    const raterActivity = Object.entries(raterAgg)
      .map(([ratedBy, s]) => ({ ratedBy, total: s.total, upCount: s.up, saveCount: s.save }))
      .sort((a, b) => b.total - a.total);

    return { summary, nichePreferences, formatPreferences, topRatedPosts, raterActivity };
  },
});
