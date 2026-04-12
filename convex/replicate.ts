"use node";

import { action } from "./_generated/server";
import { internal } from "./_generated/api";
import { v } from "convex/values";
import type { Id } from "./_generated/dataModel";
import Replicate from "replicate";
import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";

// ── Constants ────────────────────────────────────────────────────────────────

const MODEL = "kwaivgi/kling-v3-motion-control";

const IMAGE_MAX_BYTES = 10_000_000;   // 10 MB
const VIDEO_MAX_BYTES = 100_000_000;  // 100 MB
const ALLOWED_IMAGE_TYPES = ["image/jpeg", "image/png"];
const ALLOWED_VIDEO_TYPES = ["video/mp4", "video/quicktime"];

// ── R2 helpers (reused from intelligenceNode.ts) ─────────────────────────────

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

// ── Pre-flight input validator ───────────────────────────────────────────────

async function validateInputs(startingImageUrl: string, referenceVideoUrl: string) {
  // Validate starting image
  const imgRes = await fetch(startingImageUrl, {
    method: "HEAD",
    signal: AbortSignal.timeout(15_000),
  });
  if (!imgRes.ok) {
    throw new Error(`Starting image URL returned HTTP ${imgRes.status}. Is the URL accessible?`);
  }
  const imgType = imgRes.headers.get("content-type")?.split(";")[0]?.trim() ?? "";
  if (!ALLOWED_IMAGE_TYPES.includes(imgType)) {
    throw new Error(
      `Starting image must be JPEG or PNG (got "${imgType}"). Convert to .jpg/.png and re-upload.`
    );
  }
  const imgSize = Number(imgRes.headers.get("content-length") ?? "0");
  if (imgSize > IMAGE_MAX_BYTES) {
    throw new Error(
      `Starting image is ${(imgSize / 1_000_000).toFixed(1)} MB - max is 10 MB. Compress or resize the image.`
    );
  }

  // Validate reference video
  const vidRes = await fetch(referenceVideoUrl, {
    method: "HEAD",
    signal: AbortSignal.timeout(15_000),
  });
  if (!vidRes.ok) {
    throw new Error(`Reference video URL returned HTTP ${vidRes.status}. Is the URL accessible?`);
  }
  const vidType = vidRes.headers.get("content-type")?.split(";")[0]?.trim() ?? "";
  if (!ALLOWED_VIDEO_TYPES.includes(vidType)) {
    throw new Error(
      `Reference video must be MP4 or MOV (got "${vidType}"). Convert to .mp4 and re-upload.`
    );
  }
  const vidSize = Number(vidRes.headers.get("content-length") ?? "0");
  if (vidSize > VIDEO_MAX_BYTES) {
    throw new Error(
      `Reference video is ${(vidSize / 1_000_000).toFixed(1)} MB - max is 100 MB. Trim or compress the video.`
    );
  }
}

// ── Cost estimator ───────────────────────────────────────────────────────────

function estimateCost(mode: "std" | "pro"): number {
  return mode === "pro" ? 1.0 : 0.4;
}

// ── dispatchKlingJob — public action (client calls via useAction) ────────────

export const dispatchKlingJob = action({
  args: {
    sceneId:              v.optional(v.id("scenes")),
    modelName:            v.string(),
    brief:                v.string(),
    provider:             v.union(v.literal("FLUX"), v.literal("Kling"), v.literal("Higgsfield")),
    startingImageUrl:     v.string(),
    referenceVideoUrl:    v.string(),
    mode:                 v.optional(v.union(v.literal("std"), v.literal("pro"))),
    characterOrientation: v.optional(v.union(v.literal("image"), v.literal("video"))),
    keepOriginalSound:    v.optional(v.boolean()),
  },
  handler: async (ctx, args): Promise<Id<"contentGenJobs">> => {
    const mode = args.mode ?? "pro";
    const characterOrientation = args.characterOrientation ?? "video";
    const keepOriginalSound = args.keepOriginalSound ?? false;

    // 1. Pre-flight validate file constraints before creating a prediction
    await validateInputs(args.startingImageUrl, args.referenceVideoUrl);

    // 2. Insert the contentGenJobs row as Queued so the UI sees it immediately
    const jobId: Id<"contentGenJobs"> = await ctx.runMutation(internal.contentGen.internalCreateJobFromReplicate, {
      modelName:            args.modelName,
      brief:                args.brief,
      provider:             args.provider,
      sceneId:              args.sceneId,
      mode,
      characterOrientation,
      keepOriginalSound,
    });

    // 3. Create the Replicate prediction with a webhook
    const replicate = new Replicate({ auth: process.env.REPLICATE_API_TOKEN! });

    const input = {
      image:                 args.startingImageUrl,
      video:                 args.referenceVideoUrl,
      prompt:                args.brief,
      mode,
      character_orientation: characterOrientation,
      keep_original_sound:   keepOriginalSound,
    };

    const webhookUrl = `${process.env.NEXT_PUBLIC_SITE_URL}/api/replicate/webhook?jobId=${jobId}&sceneId=${args.sceneId || ''}&mode=${mode}`;

    const prediction = await replicate.predictions.create({
      model: MODEL,
      input,
      webhook: webhookUrl,
      webhook_events_filter: ["start", "output", "logs", "completed"],
    });

    // 4. Persist the Replicate prediction id on the row for poll-fallback
    await ctx.runMutation(internal.contentGen.internalAttachPrediction, {
      jobId,
      replicatePredictionId: prediction.id,
    });

    return jobId;
  },
});

// ── downloadToR2 — internal action (called by webhook on success) ────────────

export const downloadToR2 = action({
  args: {
    jobId:     v.id("contentGenJobs"),
    sourceUrl: v.string(),
    sceneId:   v.optional(v.id("scenes")),
    mode:      v.optional(v.union(v.literal("std"), v.literal("pro"))),
    metrics:   v.optional(v.any()),
  },
  handler: async (ctx, args) => {
    const BUCKET      = process.env.R2_BUCKET    ?? "ofm-saas-media";
    const PUBLIC_BASE = process.env.R2_PUBLIC_URL ?? "https://pub-6c398617211c499ea00c44c3d18564bc.r2.dev";

    try {
      // Fetch the ephemeral Replicate MP4
      const res = await fetch(args.sourceUrl, {
        signal: AbortSignal.timeout(120_000), // generous timeout for large video files
      });

      if (!res.ok) {
        throw new Error(`Failed to fetch Replicate output: HTTP ${res.status}`);
      }

      const buf = Buffer.from(await res.arrayBuffer());
      const contentType = res.headers.get("content-type") ?? "video/mp4";
      const key = `content-gen/${args.jobId}/output.mp4`;

      // Upload to R2
      await makeR2Client().send(new PutObjectCommand({
        Bucket:      BUCKET,
        Key:         key,
        Body:        buf,
        ContentType: contentType,
      }));

      const generatedVideoR2Url = `${PUBLIC_BASE}/${key}`;

      // Compute duration from metrics if available
      const durationSec = args.metrics && typeof args.metrics === "object" && "predict_time" in args.metrics
        ? Number(args.metrics.predict_time) || undefined
        : undefined;

      const costUsd = estimateCost(args.mode ?? "pro");

      // Mark the job as done
      await ctx.runMutation(internal.contentGen.internalMarkDone, {
        jobId:               args.jobId,
        generatedVideoR2Url,
        durationSec,
        costUsd,
        sceneId:             args.sceneId,
      });

    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : String(err);
      // Mark as failed — the R2 upload broke, not the Replicate prediction
      await ctx.runMutation(internal.contentGen.internalUpdateFromWebhook, {
        jobId:           args.jobId,
        replicateStatus: "failed",
        error:           `R2 upload failed: ${message}`,
      });
    }
  },
});
