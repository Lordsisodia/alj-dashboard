import { mutation } from "./_generated/server";
import { v } from "convex/values";

// ── Apify Instagram Reel Scraper output format ────────────────────────────────
// Fields: displayUrl, caption, ownerFullName, ownerUsername, url,
//         commentsCount, firstComment, likesCount, timestamp

// ── Helpers ───────────────────────────────────────────────────────────────────

function extractShortcode(postUrl: string): string {
  const match = postUrl.match(/\/p\/([A-Za-z0-9_-]+)/);
  return match ? match[1] : postUrl;
}

function extractHashtags(caption: string): string[] {
  const tags = caption.match(/#[A-Za-z0-9_]+/g) ?? [];
  return tags.map(t => t.toLowerCase());
}

function guessNiche(handle: string, hashtags: string[]): string {
  const h = handle.toLowerCase();
  const tags = hashtags.join(" ");
  if (/gfe|girlfriend|luxe|softgirl/.test(h + tags))    return "GFE";
  if (/fit|gym|workout|muscle|health/.test(h + tags))    return "Fitness";
  if (/meme|funny|comedy|laugh/.test(h + tags))          return "Meme";
  if (/thirst|trap|spicy/.test(h + tags))                return "Thirst Trap";
  if (/lifestyle|vlog|daily|aesthetic/.test(h + tags))   return "Lifestyle";
  if (/egirl|alt|goth|kawaii/.test(h + tags))            return "E-Girl";
  return "Lifestyle"; // default
}

// Deterministic pastel color from handle string
function handleToColor(handle: string): string {
  const colors = ["#ff0069","#833ab4","#fcaf45","#78c257","#4a9eff","#ec4899","#f97316","#06b6d4","#8b5cf6"];
  let hash = 0;
  for (let i = 0; i < handle.length; i++) hash = handle.charCodeAt(i) + ((hash << 5) - hash);
  return colors[Math.abs(hash) % colors.length];
}

// ── Import mutation ───────────────────────────────────────────────────────────

export const importFromScraper = mutation({
  args: {
    posts: v.array(v.object({
      displayUrl:    v.string(),
      caption:       v.optional(v.string()),
      ownerFullName: v.optional(v.string()),
      ownerUsername: v.optional(v.string()),
      url:           v.string(),
      commentsCount: v.optional(v.number()),
      firstComment:  v.optional(v.string()),
      likesCount:    v.optional(v.number()),
      timestamp:     v.optional(v.string()),
      // optional enriched fields (if scraper provides them later)
      viewsCount:    v.optional(v.number()),
      savesCount:    v.optional(v.number()),
      followerCount: v.optional(v.number()),
    })),
    // override niche for all posts in this batch (e.g. "GFE" if you scraped a GFE account)
    nicheOverride: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const inserted = { accounts: 0, posts: 0, skipped: 0 };

    for (const raw of args.posts) {
      // Skip profile-only rows (the first row is sometimes just { url: "https://instagram.com/handle" })
      if (!raw.ownerUsername || !raw.displayUrl || raw.displayUrl.startsWith("https://www.instagram.com/")) {
        inserted.skipped++;
        continue;
      }

      const handle = `@${raw.ownerUsername!}`;
      const shortcode = extractShortcode(raw.url);
      const caption = raw.caption ?? "";
      const hashtags = extractHashtags(caption);
      const niche = args.nicheOverride ?? guessNiche(raw.ownerUsername, hashtags);
      const likes = raw.likesCount ?? 0;
      const comments = raw.commentsCount ?? 0;
      const views = raw.viewsCount ?? 0;
      const saves = raw.savesCount ?? 0;
      const reach = views || likes * 10; // rough estimate if views not available
      const postedAt = raw.timestamp ? new Date(raw.timestamp).getTime() : Date.now();

      // ── Upsert tracked account ──────────────────────────────────────
      let account = await ctx.db
        .query("trackedAccounts")
        .withIndex("by_handle", q => q.eq("handle", handle))
        .unique();

      if (!account) {
        const accountId = await ctx.db.insert("trackedAccounts", {
          handle,
          displayName:       raw.ownerFullName,
          platform:          "instagram",
          niche,
          followerCount:     raw.followerCount ?? 0,
          avatarColor:       handleToColor(raw.ownerUsername),
          status:            "active",
          postsScraped:      1,
          avgEngagementRate: reach > 0 ? (likes + comments + saves) / reach : 0,
          lastScrapedAt:     Date.now(),
          isOwn:             false,
        });
        account = await ctx.db.get(accountId);
        inserted.accounts++;
      } else {
        // Update lastScrapedAt and increment postsScraped
        await ctx.db.patch(account._id, {
          lastScrapedAt: Date.now(),
          postsScraped:  (account.postsScraped ?? 0) + 1,
          ...(raw.ownerFullName ? { displayName: raw.ownerFullName } : {}),
        });
      }

      // ── Skip duplicate posts ────────────────────────────────────────
      const existing = await ctx.db
        .query("scrapedPosts")
        .withIndex("by_posted_at", q => q.eq("postedAt", postedAt))
        .collect();
      const isDuplicate = existing.some(p => p.externalId === shortcode);
      if (isDuplicate) { inserted.skipped++; continue; }

      // ── Insert scraped post ─────────────────────────────────────────
      const followerCount = raw.followerCount ?? account?.followerCount ?? 0;
      const outlierRatio = followerCount > 0 && views > 0 ? views / followerCount : undefined;

      await ctx.db.insert("scrapedPosts", {
        externalId:    shortcode,
        accountId:     account!._id,
        handle,
        platform:      "instagram",
        contentType:   "reel",  // this scraper only pulls reels
        niche,
        thumbnailUrl:  raw.displayUrl,
        caption,
        hashtags,
        likes,
        comments,
        saves,
        views,
        reach,
        engagementRate: reach > 0 ? parseFloat(((likes + comments + saves) / reach).toFixed(4)) : 0,
        postedAt,
        scrapedAt:     Date.now(),
        firstComment:  raw.firstComment || undefined,
        outlierRatio,
        saved:         false,
        boardIds:      [],
      });
      inserted.posts++;
    }

    return inserted;
  },
});
