"use node";
import { action } from "./_generated/server";
import { v } from "convex/values";
import { api } from "./_generated/api";
import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";

const MAX_BYTES = 25 * 1024 * 1024; // 25 MB

function makeR2Client() {
  return new S3Client({
    region: "auto",
    endpoint: `https://${process.env.CLOUDFLARE_ACCOUNT_ID}.r2.cloudflarestorage.com`,
    credentials: {
      accessKeyId:     process.env.R2_ACCESS_KEY_ID!,
      secretAccessKey: process.env.R2_SECRET_ACCESS_KEY!,
    },
  });
}

// ── Download a scraped post thumbnail to R2 ──────────────────────────────────

export const downloadThumbnailToR2 = action({
  args: { postId: v.id("scrapedPosts") },
  handler: async (ctx, { postId }): Promise<{ ok: boolean; status: string }> => {
    const posts: any[] = await ctx.runQuery(api.intelligence.getPostsByIds, { ids: [postId] });
    const p = posts?.[0];
    if (!p) return { ok: false, status: "not_found" };

    const PUBLIC_BASE = process.env.R2_PUBLIC_URL ?? "https://pub-6c398617211c499ea00c44c3d18564bc.r2.dev";
    const alreadyInR2 = p.thumbnailDownloadStatus === "ready" && p.thumbnailUrl?.startsWith(PUBLIC_BASE);
    if (alreadyInR2) return { ok: true, status: "already_ready" };

    const sourceUrl = p.thumbnailSourceUrl ?? p.thumbnailUrl;
    if (!sourceUrl) {
      await ctx.runMutation(api.intelligence.patchThumbnailDownload, {
        postId, status: "failed", error: "no_source_url",
      });
      return { ok: false, status: "no_source_url" };
    }

    await ctx.runMutation(api.intelligence.patchThumbnailDownload, { postId, status: "downloading" });

    try {
      const res = await fetch(sourceUrl, {
        signal: AbortSignal.timeout(30_000),
        headers: {
          'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36',
          'Referer':    'https://www.instagram.com/',
          'Accept':     'image/avif,image/webp,image/apng,image/*,*/*;q=0.8',
        },
      });

      if (!res.ok) {
        const expired = res.status === 404 || res.status === 410;
        await ctx.runMutation(api.intelligence.patchThumbnailDownload, {
          postId,
          status: expired ? "expired" : "failed",
          error: `fetch ${res.status} - ${expired ? "CDN URL expired" : "upstream error"}`,
        });
        return { ok: false, status: expired ? "expired" : "failed" };
      }

      const buf = Buffer.from(await res.arrayBuffer());
      if (buf.byteLength > MAX_BYTES) {
        await ctx.runMutation(api.intelligence.patchThumbnailDownload, {
          postId, status: "failed",
          error: `thumbnail too large: ${(buf.byteLength / 1024 / 1024).toFixed(1)} MB`,
        });
        return { ok: false, status: "too_large" };
      }

      const contentType = res.headers.get("content-type") ?? "image/jpeg";
      const ext = contentType.includes("webp") ? "webp" : contentType.includes("png") ? "png" : "jpg";
      const safeId = (p.externalId ?? "unknown").replace(/[^a-zA-Z0-9_-]/g, "_").slice(0, 60);
      const key = `thumbnails/${safeId}-${Date.now()}.${ext}`;

      const BUCKET = process.env.R2_BUCKET ?? "ofm-saas-media";

      await makeR2Client().send(new PutObjectCommand({
        Bucket:      BUCKET,
        Key:         key,
        Body:        buf,
        ContentType: contentType,
      }));

      const url = `${PUBLIC_BASE}/${key}`;
      await ctx.runMutation(api.intelligence.patchThumbnailDownload, {
        postId, status: "ready", thumbnailUrl: url,
      });
      return { ok: true, status: "ready" };

    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : String(err);
      await ctx.runMutation(api.intelligence.patchThumbnailDownload, {
        postId, status: "failed", error: message,
      });
      return { ok: false, status: "exception" };
    }
  },
});

// ── Download a scraped post video to R2 ───────────────────────────────────────

export const downloadPostToR2 = action({
  args: { postId: v.id("scrapedPosts") },
  handler: async (ctx, { postId }): Promise<{ ok: boolean; status: string }> => {
    const posts: any[] = await ctx.runQuery(api.intelligence.getPostsByIds, { ids: [postId] });
    const p = posts?.[0];
    if (!p) return { ok: false, status: "not_found" };

    // Only skip if videoUrl is already on our R2 domain (truly downloaded)
    const PUBLIC_BASE = process.env.R2_PUBLIC_URL ?? "https://pub-6c398617211c499ea00c44c3d18564bc.r2.dev";
    const alreadyInR2 = p.videoDownloadStatus === "ready" && p.videoUrl?.startsWith(PUBLIC_BASE);
    if (alreadyInR2) return { ok: true, status: "already_ready" };

    // Use videoSourceUrl (original Instagram CDN) if available, otherwise videoUrl
    const sourceUrl = p.videoSourceUrl ?? p.videoUrl;
    if (!sourceUrl) {
      await ctx.runMutation(api.intelligence.patchVideoDownload, {
        postId, status: "failed", error: "no_source_url",
      });
      return { ok: false, status: "no_source_url" };
    }

    await ctx.runMutation(api.intelligence.patchVideoDownload, { postId, status: "downloading" });

    try {
      const res = await fetch(sourceUrl, {
        signal: AbortSignal.timeout(60_000),
        headers: {
          'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36',
          'Referer':    'https://www.instagram.com/',
          'Accept':     'video/mp4,video/*;q=0.9,*/*;q=0.8',
        },
      });

      if (!res.ok) {
        const expired = res.status === 404 || res.status === 410;
        await ctx.runMutation(api.intelligence.patchVideoDownload, {
          postId,
          status: expired ? "expired" : "failed",
          error: `fetch ${res.status} - ${expired ? "Instagram CDN URL expired" : "upstream error"}`,
        });
        return { ok: false, status: expired ? "expired" : "failed" };
      }

      const buf = Buffer.from(await res.arrayBuffer());
      if (buf.byteLength > MAX_BYTES) {
        await ctx.runMutation(api.intelligence.patchVideoDownload, {
          postId, status: "failed",
          error: `video too large: ${(buf.byteLength / 1024 / 1024).toFixed(1)} MB`,
        });
        return { ok: false, status: "too_large" };
      }

      const contentType = res.headers.get("content-type") ?? "video/mp4";
      const ext = contentType.includes("mp4") ? "mp4" : "bin";
      const safeId = (p.externalId ?? "unknown").replace(/[^a-zA-Z0-9_-]/g, "_").slice(0, 60);
      const key = `intelligence/${safeId}-${Date.now()}.${ext}`;

      const BUCKET      = process.env.R2_BUCKET      ?? "ofm-saas-media";
      const PUBLIC_BASE = process.env.R2_PUBLIC_URL   ?? "https://pub-6c398617211c499ea00c44c3d18564bc.r2.dev";

      await makeR2Client().send(new PutObjectCommand({
        Bucket:      BUCKET,
        Key:         key,
        Body:        buf,
        ContentType: contentType,
      }));

      const url = `${PUBLIC_BASE}/${key}`;
      await ctx.runMutation(api.intelligence.patchVideoDownload, {
        postId, status: "ready", videoUrl: url,
      });
      return { ok: true, status: "ready" };

    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : String(err);
      await ctx.runMutation(api.intelligence.patchVideoDownload, {
        postId, status: "failed", error: message,
      });
      return { ok: false, status: "exception" };
    }
  },
});
