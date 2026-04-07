import { NextRequest, NextResponse } from 'next/server';
import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3';
import { ConvexHttpClient } from 'convex/browser';
import { api } from '@/convex/_generated/api';

const R2 = new S3Client({
  region: 'auto',
  endpoint: `https://${process.env.CLOUDFLARE_ACCOUNT_ID}.r2.cloudflarestorage.com`,
  credentials: {
    accessKeyId:     process.env.R2_ACCESS_KEY_ID!,
    secretAccessKey: process.env.R2_SECRET_ACCESS_KEY!,
  },
});

const BUCKET      = process.env.R2_BUCKET ?? 'ofm-saas-media';
const PUBLIC_BASE = process.env.R2_PUBLIC_URL ?? 'https://pub-6c398617211c499ea00c44c3d18564bc.r2.dev';

export async function POST(req: NextRequest) {
  const form = await req.formData();
  const file = form.get('file') as File | null;
  if (!file) return NextResponse.json({ error: 'No file' }, { status: 400 });

  const bytes  = await file.arrayBuffer();
  const buffer = Buffer.from(bytes);
  const key    = `tools/${Date.now()}-${file.name.replace(/[^a-zA-Z0-9._-]/g, '_')}`;

  await R2.send(new PutObjectCommand({
    Bucket:      BUCKET,
    Key:         key,
    Body:        buffer,
    ContentType: file.type,
  }));

  const url = `${PUBLIC_BASE}/${key}`;

  // Persist upload record to Convex
  if (process.env.NEXT_PUBLIC_CONVEX_URL) {
    try {
      const convex = new ConvexHttpClient(process.env.NEXT_PUBLIC_CONVEX_URL);
      await convex.mutation(api.mediaUploads.save, {
        r2Key:     key,
        url,
        filename:  file.name,
        mimeType:  file.type,
        sizeBytes: buffer.byteLength,
        context:   'tool_upload',
      });
    } catch { /* don't fail upload on Convex error */ }
  }

  return NextResponse.json({ url, key });
}
