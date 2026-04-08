import { NextRequest, NextResponse } from 'next/server';
import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3';

// Actor: apify/instagram-profile-scraper (dSCLg0C3YEZ83HzYX)
const APIFY_ACTOR = 'apify~instagram-profile-scraper';

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
    const res = await fetch(picUrl, {
      headers: { 'Referer': 'https://www.instagram.com/', 'User-Agent': 'Mozilla/5.0' },
      signal: AbortSignal.timeout(10_000),
    });
    if (!res.ok) return null;
    const buffer      = Buffer.from(await res.arrayBuffer());
    const contentType = res.headers.get('content-type') ?? 'image/jpeg';
    const ext         = contentType.includes('png') ? 'png' : 'jpg';
    const key         = `avatars/ig/${username}.${ext}`;
    await R2.send(new PutObjectCommand({ Bucket: BUCKET, Key: key, Body: buffer, ContentType: contentType }));
    return `${PUBLIC_BASE}/${key}`;
  } catch (e) {
    console.warn('[enrich-profile] R2 upload failed:', e);
    return null;
  }
}

export async function POST(req: NextRequest) {
  const { handle } = await req.json() as { handle: string };
  const username = handle.replace('@', '').trim();
  const token = process.env.APIFY_API_TOKEN;

  if (!token) {
    await new Promise(r => setTimeout(r, 1400));
    return NextResponse.json({
      handle:                `@${username}`,
      followerCount:         Math.floor(Math.random() * 800_000) + 50_000,
      followsCount:          Math.floor(Math.random() * 2_000) + 100,
      postsCount:            Math.floor(Math.random() * 900) + 80,
      bio:                   '✨ Content creator • lifestyle & aesthetics',
      avatarUrl:             null,
      displayName:           username.charAt(0).toUpperCase() + username.slice(1),
      verified:              Math.random() > 0.75,
      externalUrl:           null,
      isBusinessAccount:     Math.random() > 0.5,
      isProfessionalAccount: Math.random() > 0.5,
      businessCategoryName:  'Personal blog',
      businessEmail:         null,
      isPrivate:             false,
      igtvVideoCount:        Math.floor(Math.random() * 20),
      instagramId:           null,
      relatedHandles:        [],
    });
  }

  try {
    const res = await fetch(
      `https://api.apify.com/v2/acts/${APIFY_ACTOR}/run-sync-get-dataset-items?token=${token}&memory=256`,
      {
        method:  'POST',
        headers: { 'Content-Type': 'application/json' },
        body:    JSON.stringify({ usernames: [username] }),
      }
    );

    if (!res.ok) {
      const text = await res.text();
      return NextResponse.json({ error: `Apify ${res.status}: ${text}` }, { status: 502 });
    }

    const items: ApifyProfile[] = await res.json();
    const p = items[0];
    if (!p) return NextResponse.json({ error: 'No profile found' }, { status: 404 });

    const rawAvatarUrl = p.profilePicUrlHD ?? p.profilePicUrl ?? null;
    const stableAvatar = rawAvatarUrl ? await uploadAvatarToR2(username, rawAvatarUrl) : null;
    const avatarUrl    = stableAvatar ?? rawAvatarUrl ?? null;

    const relatedHandles: string[] = (p.relatedProfiles ?? [])
      .map((r: { username?: string }) => r.username)
      .filter((u): u is string => Boolean(u))
      .slice(0, 30);

    return NextResponse.json({
      handle:                `@${p.username ?? username}`,
      followerCount:         p.followersCount         ?? 0,
      followsCount:          p.followsCount           ?? null,
      postsCount:            p.postsCount             ?? null,
      bio:                   p.biography              ?? null,
      avatarUrl,
      displayName:           p.fullName               || username,
      verified:              p.verified               ?? false,
      externalUrl:           p.externalUrl            ?? null,
      isBusinessAccount:     p.isBusinessAccount      ?? null,
      isProfessionalAccount: p.isProfessionalAccount  ?? null,
      businessCategoryName:  p.businessCategoryName   ?? null,
      businessEmail:         p.businessEmail          ?? null,
      isPrivate:             p.private                ?? null,
      igtvVideoCount:        p.igtvVideoCount         ?? null,
      instagramId:           p.id                     ? String(p.id) : null,
      relatedHandles,
    });
  } catch (err) {
    return NextResponse.json({ error: String(err) }, { status: 500 });
  }
}

interface ApifyProfile {
  username?:             string;
  fullName?:             string;
  biography?:            string;
  followersCount?:       number;
  followsCount?:         number;
  postsCount?:           number;
  profilePicUrl?:        string;
  profilePicUrlHD?:      string;
  verified?:             boolean;
  externalUrl?:          string;
  isBusinessAccount?:    boolean;
  isProfessionalAccount?: boolean;
  businessCategoryName?: string;
  businessEmail?:        string;
  private?:              boolean;
  igtvVideoCount?:       number;
  id?:                   string | number;
  relatedProfiles?:      { username?: string }[];
}
