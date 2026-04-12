import { NextRequest, NextResponse } from "next/server";
import crypto from 'node:crypto';
import { ConvexHttpClient } from "convex/browser";
import { api } from "@/convex/_generated/api";
import type { Id } from "@/convex/_generated/dataModel";
import { sendJobNotification } from "@/lib/notifications";

const convex = new ConvexHttpClient(process.env.NEXT_PUBLIC_CONVEX_URL!);

function verifyWebhookSignature(body: string, signature: string): boolean {
  const secret = process.env.REPLICATE_WEBHOOK_SECRET!;
  const computed = crypto
    .createHmac('sha256', secret)
    .update(body)
    .digest('hex');
  return crypto.timingSafeEqual(
    Buffer.from(computed),
    Buffer.from(signature)
  );
}

export async function POST(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const jobId = searchParams.get("jobId") as Id<"contentGenJobs"> | null;
  const sceneId = searchParams.get("sceneId") as Id<"scenes"> | null;
  const mode = (searchParams.get("mode") ?? "pro") as "std" | "pro";

  if (!jobId) {
    return NextResponse.json({ error: "missing jobId" }, { status: 400 });
  }

  const signature = req.headers.get('x-replicate-webhook-signature');
  if (!signature) {
    return NextResponse.json({ error: 'missing signature' }, { status: 401 });
  }

  const rawBody = await req.text();
  if (!verifyWebhookSignature(rawBody, signature)) {
    return NextResponse.json({ error: 'invalid signature' }, { status: 401 });
  }

  const body = JSON.parse(rawBody);

  // Update the job row with the latest Replicate status
  await convex.mutation(api.contentGen.updateFromWebhookPublic, {
    jobId,
    replicateStatus: body.status,
    logs:    body.logs ?? undefined,
    output:  typeof body.output === "string" ? body.output : undefined,
    error:   body.error ?? undefined,
    metrics: body.metrics ?? undefined,
  });

  // If terminal success, kick off the R2 download as a fire-and-forget action
  // Fire async without awaiting to prevent webhook timeout
  if (body.status === "succeeded" && body.output) {
    const outputUrl = typeof body.output === "string" ? body.output : undefined;
    if (outputUrl) {
      // Non-blocking: spawn the R2 download in the background
      convex.action(api.replicate.downloadToR2, {
        jobId,
        sourceUrl: outputUrl,
        mode,
        sceneId: sceneId || undefined,
        metrics: body.metrics ?? undefined,
      }).catch(err => {
        console.error(`R2 download failed for job ${jobId}:`, err);
        // Log to a monitoring service if available
      });
    }
  }

  // Send notification on terminal states (fire-and-forget to avoid webhook timeout)
  if (body.status === "succeeded" || body.status === "failed") {
    // Fetch job details for notification
    convex.query(api.contentGen.getJobForNotification, { jobId })
      .then(job => {
        if (job) {
          const notification = {
            jobName: job.name,
            modelName: job.modelName,
            provider: job.provider,
            status: (body.status === "succeeded" ? "completed" : "failed") as "completed" | "failed",
            videoUrl: typeof body.output === "string" ? body.output : undefined,
          };
          sendJobNotification(notification).catch(err => {
            console.error('[webhook] Notification failed:', err);
          });
        }
      })
      .catch(err => {
        console.error('[webhook] Failed to fetch job for notification:', err);
      });
  }

  return NextResponse.json({ ok: true });
}
