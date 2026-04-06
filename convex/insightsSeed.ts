import { mutation } from "./_generated/server";

// ── Seed swipe ratings - realistic fake data for dev/demo ─────────────────────
//
// Seeds ~80 ratings from 4 team members across existing scrapedPosts.
// Niche biases are baked in so preference charts show clear signal.
// Skips silently if the table already has data.

const RATERS = ["Alex", "Jordan", "Sam", "Riley"];

const NICHE_UP_BIAS: Record<string, number> = {
  "Thirst Trap": 0.70,
  "GFE":         0.65,
  "E-Girl":      0.60,
  "Fitness":     0.55,
  "Lifestyle":   0.45,
};

const WEEK_MS = 7 * 24 * 60 * 60 * 1000;

function pickRating(bias: number): "up" | "down" | "save" {
  const r = Math.random();
  if (r < bias * 0.6)             return "up";
  if (r < bias * 0.6 + 0.25)     return "save";
  return "down";
}

export const seedSwipeRatings = mutation({
  args: {},
  handler: async (ctx) => {
    const existing = await ctx.db.query("swipeRatings").take(1);
    if (existing.length > 0) return { seeded: 0, message: "Already seeded" };

    const posts = await ctx.db.query("scrapedPosts").collect();
    if (posts.length === 0) return { seeded: 0, message: "No posts to rate" };

    const now    = Date.now();
    let seeded   = 0;

    for (const rater of RATERS) {
      const sample = [...posts].sort(() => Math.random() - 0.5).slice(0, 20);
      for (const post of sample) {
        const bias   = NICHE_UP_BIAS[post.niche] ?? 0.5;
        const rating = pickRating(bias);
        await ctx.db.insert("swipeRatings", {
          postId:  post._id,
          ratedBy: rater,
          rating,
          ratedAt: now - Math.floor(Math.random() * WEEK_MS),
        });
        seeded++;
      }
    }

    return { seeded, message: `Seeded ${seeded} ratings` };
  },
});
