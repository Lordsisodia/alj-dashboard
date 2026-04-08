import { action } from "./_generated/server";
import { api } from "./_generated/api";

// One-time backfill: graduate all enriched creatorCandidates into trackedAccounts.
// Run via: npx convex run backfill:enrichedCandidatesToTrackedAccounts
export const enrichedCandidatesToTrackedAccounts = action({
  args: {},
  handler: async (ctx) => {
    const candidates = await ctx.runQuery(api.candidates.list, { status: "approved" });
    const enriched = candidates.filter((c) => c.enrichStatus === "done");

    let inserted = 0;
    let skipped = 0;

    for (const c of enriched) {
      const result = await ctx.runMutation(api.trackedAccounts.upsertEnriched, {
        handle:            c.handle,
        followerCount:     c.followerCount ?? 0,
        followsCount:      c.followsCount  ?? undefined,
        postsCount:        c.postsCount    ?? undefined,
        bio:               c.bio           ?? undefined,
        avatarUrl:         c.avatarUrl     ?? undefined,
        displayName:       c.displayName   ?? undefined,
        verified:          c.verified      ?? undefined,
        isPrivate:         c.isPrivate     ?? undefined,
        isBusinessAccount: c.isBusinessAccount ?? undefined,
        instagramId:       c.instagramId   ?? undefined,
        externalUrl:       c.externalUrl   ?? undefined,
        igtvVideoCount:    c.igtvVideoCount ?? undefined,
        avgEngagementRate: c.avgEngagementRate ?? undefined,
      });
      if (result) inserted++;
      else skipped++;
    }

    console.log(`[backfill] ${enriched.length} enriched candidates → inserted: ${inserted}, skipped (already tracked): ${skipped}`);
    return { total: enriched.length, inserted, skipped };
  },
});
