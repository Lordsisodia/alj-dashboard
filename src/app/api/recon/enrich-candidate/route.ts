import { NextRequest, NextResponse } from 'next/server';
import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3';
import { ConvexHttpClient } from 'convex/browser';
import { api } from '@/convex/_generated/api';
import { getApifyToken } from '@/lib/apifyTokens';

const PROFILE_ACTOR = 'apify~instagram-profile-scraper';

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

async function uploadAvatarToR2(username: string, picUrl: string): Promise<string | null> {
  try {
    const res = await fetch(picUrl, { signal: AbortSignal.timeout(10_000) });
    if (!res.ok) return null;
    const buffer      = Buffer.from(await res.arrayBuffer());
    const contentType = res.headers.get('content-type') ?? 'image/jpeg';
    const ext         = contentType.includes('png') ? 'png' : 'jpg';
    const key         = `avatars/ig/${username}.${ext}`;
    await R2.send(new PutObjectCommand({ Bucket: BUCKET, Key: key, Body: buffer, ContentType: contentType }));
    return `${PUBLIC_BASE}/${key}`;
  } catch {
    return null;
  }
}

async function writeToConvex(enriched: Record<string, unknown>) {
  if (!process.env.NEXT_PUBLIC_CONVEX_URL) return;
  try {
    const convex = new ConvexHttpClient(process.env.NEXT_PUBLIC_CONVEX_URL);
    await convex.mutation(api.candidates.upsert, {
      handle:             enriched.handle as string,
      displayName:        enriched.displayName as string,
      followerCount:       enriched.followerCount as number | undefined,
      followsCount:        enriched.followsCount as number | undefined,
      postsCount:          enriched.postsCount as number | undefined,
      bio:                enriched.bio as string | undefined,
      avatarUrl:          enriched.avatarUrl as string | undefined,
      verified:           enriched.verified as boolean | undefined,
      isPrivate:          enriched.isPrivate as boolean | undefined,
      isBusinessAccount:  enriched.isBusinessAccount as boolean | undefined,
      instagramId:        enriched.instagramId as string | undefined,
      externalUrl:        enriched.externalUrl as string | undefined,
      highlightReelCount: enriched.highlightReelCount as number | undefined,
      igtvVideoCount:    enriched.igtvVideoCount as number | undefined,
      avgViews:           enriched.avgViews as number | undefined,
      outlierRatio:       enriched.outlierRatio as number | undefined,
      status:  'approved',
      source:  'scraper',
    });
  } catch (e) {
    console.error('[enrich-candidate] Convex write failed:', e);
  }
}

export async function POST(req: NextRequest) {
  const { handle } = await req.json();
  const username = (handle as string).replace('@', '').trim();

  let token: string;
  try { token = getApifyToken(); }
  catch { return NextResponse.json({ error: 'No Apify token configured' }, { status: 500 }); }

  try {
    const res = await fetch(
      `https://api.apify.com/v2/acts/${PROFILE_ACTOR}/run-sync-get-dataset-items?token=${token}&memory=256`,
      {
        method:  'POST',
        headers: { 'Content-Type': 'application/json' },
        body:    JSON.stringify({ usernames: [username] }),
        signal:  AbortSignal.timeout(30_000),
      }
    );

    if (!res.ok) return NextResponse.json({ error: `Apify ${res.status}` }, { status: 502 });

    const items = await res.json();
    const p = items[0];
    if (!p) return NextResponse.json({ error: 'Profile not found' }, { status: 404 });

    const followerCount = p.followersCount ?? 0;
    const avgViews      = p.latestIgtvVideos?.[0]?.videoViewCount
                       ?? p.latestPosts?.[0]?.videoViewCount
                       ?? null;
    const outlierRatio  = followerCount > 0 && avgViews
                       ? parseFloat((avgViews / followerCount).toFixed(2))
                       : null;

    const relatedHandles: string[] = (p.relatedProfiles ?? [])
      .map((r: { username?: string }) => r.username)
      .filter(Boolean)
      .slice(0, 30);

    const rawAvatarUrl = p.profilePicUrlHD ?? p.profilePicUrl ?? null;

    // Kick off R2 upload + Convex write in parallel — don't await them
    const avatarUpload = rawAvatarUrl
      ? uploadAvatarToR2(username, rawAvatarUrl)
      : Promise.resolve(null);

    const enriched = {
      handle:            `@${p.username ?? username}`,
      displayName:       p.fullName || username,
      followerCount,
      followsCount:     p.followsCount        ?? null,
      postsCount:       p.postsCount          ?? null,
      bio:              p.biography           ?? null,
      avatarUrl:        null, // filled below after R2 upload
      verified:         p.verified            ?? false,
      isPrivate:        p.private             ?? false,
      isBusinessAccount: p.isBusinessAccount   ?? false,
      instagramId:      p.id ? String(p.id)   : null,
      externalUrl:      p.externalUrl           ?? p.externalUrls?.[0]?.url ?? null,
      highlightReelCount: p.highlightReelCount  ?? null,
      igtvVideoCount:   p.igtvVideoCount      ?? null,
      avgViews,
      outlierRatio,
    };

    // Race R2 upload against a short timeout — respond as soon as Apify returns
    const [stableAvatar] = await Promise.all([
      avatarUpload,
      new Promise(r => setTimeout(r, 500)), // minimum 500ms so UI feels natural
    ]);

    enriched.avatarUrl = stableAvatar ?? rawAvatarUrl;

    // Fire Convex write without awaiting — doesn't block the response
    writeToConvex(enriched);

    return NextResponse.json({ ...enriched, relatedHandles });
  } catch (err) {
    return NextResponse.json({ error: String(err) }, { status: 500 });
  }
}
