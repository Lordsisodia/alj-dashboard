import { NextRequest, NextResponse } from 'next/server';
import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3';

const R2 = new S3Client({
  region: 'auto',
  endpoint: `https://${process.env.CLOUDFLARE_ACCOUNT_ID}.r2.cloudflarestorage.com`,
  credentials: {
    accessKeyId:     process.env.R2_ACCESS_KEY_ID!,
    secretAccessKey: process.env.R2_SECRET_ACCESS_KEY!,
  },
});

const BUCKET      = process.env.R2_BUCKET      ?? 'ofm-saas-media';
const PUBLIC_BASE = process.env.R2_PUBLIC_URL   ?? 'https://pub-6c398617211c499ea00c44c3d18564bc.r2.dev';
const MAX_BYTES   = 50 * 1024 * 1024; // 50 MB ceiling

export async function POST(req: NextRequest) {
  // Require internal secret so only Convex actions can call this
  if (req.headers.get('x-internal-secret') !== process.env.INTERNAL_API_SECRET) {
    return NextResponse.json({ error: 'unauthorized' }, { status: 401 });
  }

  const { externalId, sourceUrl } = await req.json() as { externalId: string; sourceUrl: string };
  if (!sourceUrl) return NextResponse.json({ error: 'sourceUrl required' }, { status: 400 });

  try {
    const videoRes = await fetch(sourceUrl, { signal: AbortSignal.timeout(60_000) });
    if (!videoRes.ok) {
      const status = videoRes.status === 404 || videoRes.status === 410 ? 410 : 502;
      return NextResponse.json(
        { error: 'source_fetch_failed', upstream: videoRes.status },
        { status }
      );
    }

    const buf = Buffer.from(await videoRes.arrayBuffer());
    if (buf.byteLength > MAX_BYTES) {
      return NextResponse.json({ error: 'too_large', bytes: buf.byteLength }, { status: 413 });
    }

    const contentType = videoRes.headers.get('content-type') ?? 'video/mp4';
    const ext = contentType.includes('mp4') ? 'mp4' : 'bin';
    const safeId = (externalId ?? 'unknown').replace(/[^a-zA-Z0-9_-]/g, '_').slice(0, 60);
    const key = `intelligence/${safeId}-${Date.now()}.${ext}`;

    await R2.send(new PutObjectCommand({
      Bucket:      BUCKET,
      Key:         key,
      Body:        buf,
      ContentType: contentType,
    }));

    return NextResponse.json({
      url:         `${PUBLIC_BASE}/${key}`,
      key,
      sizeBytes:   buf.byteLength,
      contentType,
    });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : String(err);
    return NextResponse.json({ error: 'exception', message }, { status: 500 });
  }
}
