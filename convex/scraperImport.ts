import { mutation } from "./_generated/server";
import { v } from "convex/values";
import { api } from "./_generated/api";

// ── Apify Instagram Reel Scraper output formats ───────────────────────────────
//
// NEW format (2026-04-05): shortCode, ownerUsername, ownerFullName, displayUrl,
//   videoUrl, videoViewCount, videoPlayCount, likesCount, commentsCount, caption,
//   hashtags, timestamp, firstComment, latestComments, ownerId
//
// OLD format (2026-03-28): displayUrl, caption, ownerFullName, ownerUsername, url,
//   commentsCount, firstComment, likesCount, timestamp, viewsCount, savesCount
//
// Both upsert on externalId = shortcode.

// ── Helpers ───────────────────────────────────────────────────────────────────

function extractShortcode(raw: Record<string, unknown>): string {
  // New format: use shortCode field directly
  if (typeof raw.shortCode === "string") return raw.shortCode as string;
  // Old format: extract from url
  const url = raw.url as string | undefined;
  if (!url) return String(raw.id ?? Date.now());
  const match = url.match(/\/(?:p|reel|reels)\/([A-Za-z0-9_-]+)/);
  return match ? match[1] : String(raw.id ?? Date.now());
}

function extractHashtags(caption: string | null | undefined): string[] {
  if (!caption) return [];
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
  return "Lifestyle";
}

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
      // Shared
      caption:        v.optional(v.string()),
      ownerFullName:  v.optional(v.string()),
      ownerUsername:  v.optional(v.string()),
      commentsCount:   v.optional(v.number()),
      firstComment:    v.optional(v.string()),
      likesCount:     v.optional(v.number()),
      timestamp:      v.optional(v.string()),
      // Old format
      displayUrl:     v.optional(v.string()),
      url:            v.optional(v.string()),
      viewsCount:     v.optional(v.number()),
      savesCount:     v.optional(v.number()),
      followerCount:  v.optional(v.number()),
      videoUrl:       v.optional(v.string()),
      // New format (2026-04-05)
      shortCode:      v.optional(v.string()),
      id:             v.optional(v.string()),
      videoViewCount: v.optional(v.number()),
      videoPlayCount: v.optional(v.number()),
      hashtags:       v.optional(v.array(v.string())),
      isVideo:        v.optional(v.boolean()),
      type:           v.optional(v.string()),
      productType:    v.optional(v.string()),
    })),
    nicheOverride: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const inserted = { accounts: 0, posts: 0, skipped: 0 };

    // Collect existing shortcodes once up-front to avoid O(n²) queries inside the loop
    const allExisting = await ctx.db.query("scrapedPosts").collect();
    const existingByShortcode = new Map(allExisting.map(p => [p.externalId, p]));

    for (const raw of args.posts) {
      const handle = raw.ownerUsername ? `@${raw.ownerUsername}` : null;

      // Skip rows without a handle or any content
      if (!handle || (!raw.displayUrl && !raw.videoViewCount)) {
        inserted.skipped++;
        continue;
      }

      const shortcode = extractShortcode(raw as Record<string, unknown>);
      const caption = raw.caption ?? "";
      const hashtags = (raw.hashtags as string[] | undefined)?.length
        ? (raw.hashtags as string[]).map(t => t.toLowerCase())
        : extractHashtags(caption);
      const niche = args.nicheOverride ?? guessNiche(raw.ownerUsername ?? "", hashtags);
      const likes    = raw.likesCount ?? 0;
      const comments = raw.commentsCount ?? 0;

      // videoViewCount = Apify reel-scraper field; videoPlayCount = alt field name
      // viewsCount = legacy format; fall back to 0 for non-video posts
      const views = raw.videoViewCount ?? raw.videoPlayCount ?? raw.viewsCount ?? 0;

      // For ER: use views as reach proxy when views > 0, otherwise fall back to likes*10
      const reach = views > 0 ? views : likes * 10;
      const engagementRate = reach > 0
        ? parseFloat(((likes + comments) / reach).toFixed(4))
        : 0;

      const postedAt = raw.timestamp ? new Date(raw.timestamp).getTime() : Date.now();

      // ── Upsert tracked account ──────────────────────────────────────
      let account = await ctx.db
        .query("trackedAccounts")
        .withIndex("by_handle", q => q.eq("handle", handle))
        .first();

      if (!account) {
        const accountId = await ctx.db.insert("trackedAccounts", {
          handle,
          displayName:       raw.ownerFullName ?? raw.ownerUsername,
          platform:          "instagram",
          niche,
          followerCount:     raw.followerCount ?? 0,
          avatarColor:       handleToColor(raw.ownerUsername ?? handle),
          status:            "active",
          postsScraped:      1,
          avgEngagementRate: reach > 0 ? engagementRate : 0,
          lastScrapedAt:     Date.now(),
          isOwn:             false,
        });
        account = await ctx.db.get(accountId);
        inserted.accounts++;
      } else {
        await ctx.db.patch(account._id, {
          lastScrapedAt: Date.now(),
          postsScraped:  (account.postsScraped ?? 0) + 1,
          ...(raw.ownerFullName ? { displayName: raw.ownerFullName } : {}),
        });
      }

      // ── Upsert: skip duplicate shortcode, backfill missing fields ──────
      const existingPost = existingByShortcode.get(shortcode);
      if (existingPost) {
        const patch: Record<string, unknown> = {};
        if (raw.videoUrl && !existingPost.videoUrl) patch.videoUrl = raw.videoUrl;
        // Backfill views if new format has view count and old value was 0
        const backfillViews = raw.videoViewCount ?? raw.videoPlayCount;
        if (backfillViews && existingPost.views === 0) {
          patch.views = backfillViews;
          patch.reach = backfillViews;
          patch.engagementRate = backfillViews > 0
            ? parseFloat(((likes + comments) / backfillViews).toFixed(4))
            : 0;
        }
        if (Object.keys(patch).length > 0) {
          await ctx.db.patch(existingPost._id, patch);
        }
        inserted.skipped++;
        continue;
      }

      // ── Insert scraped post ─────────────────────────────────────────
      const followerCount = raw.followerCount ?? account?.followerCount ?? 0;
      const outlierRatio = followerCount > 0 && views > 0
        ? parseFloat((views / followerCount).toFixed(4))
        : undefined;

      // Determine content type from Apify signals
      const contentType: "reel" | "post" | "carousel" | "story" =
        raw.productType === 'clips' || raw.productType === 'reel'
          ? 'reel'
          : raw.type === 'Sidecar' || raw.productType === 'carousel_container'
            ? 'carousel'
            : raw.isVideo === true || (raw.videoViewCount ?? raw.videoPlayCount ?? 0) > 0
              ? 'reel'
              : 'post';

      const thumbnailCdnUrl = raw.displayUrl ?? "";
      const postId = await ctx.db.insert("scrapedPosts", {
        externalId:    shortcode,
        accountId:     account!._id,
        handle,
        platform:      "instagram",
        contentType,
        niche,
        thumbnailUrl:            thumbnailCdnUrl,
        thumbnailSourceUrl:      thumbnailCdnUrl || undefined,
        thumbnailDownloadStatus: thumbnailCdnUrl ? "pending" : undefined,
        caption,
        hashtags,
        likes,
        comments,
        saves:         raw.savesCount ?? 0,
        views,
        reach,
        engagementRate,
        postedAt,
        scrapedAt:     Date.now(),
        firstComment:  raw.firstComment || undefined,
        outlierRatio,
        videoUrl:      raw.videoUrl || undefined,
        saved:         false,
        boardIds:      [],
      });
      if (thumbnailCdnUrl) {
        await ctx.scheduler.runAfter(0, api.intelligenceNode.downloadThumbnailToR2, { postId });
      }
      inserted.posts++;
    }

    return inserted;
  },
});
