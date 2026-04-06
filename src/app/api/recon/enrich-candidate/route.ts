import { NextRequest, NextResponse } from 'next/server';
import { getApifyToken } from '@/lib/apifyTokens';

const PROFILE_ACTOR = 'apify~instagram-profile-scraper';

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

    if (!res.ok) {
      return NextResponse.json({ error: `Apify ${res.status}` }, { status: 502 });
    }

    const items = await res.json();
    const p = items[0];
    if (!p) return NextResponse.json({ error: 'Profile not found' }, { status: 404 });

    const followerCount     = p.followersCount ?? 0;
    const avgViews          = p.latestIgtvVideos?.[0]?.videoViewCount
                              ?? p.latestPosts?.[0]?.videoViewCount
                              ?? null;
    const outlierRatio      = followerCount > 0 && avgViews
                              ? parseFloat((avgViews / followerCount).toFixed(2))
                              : null;

    // Related accounts - from tagged posts or similar (Apify sometimes returns these)
    const relatedHandles: string[] = (p.relatedProfiles ?? [])
      .map((r: { username?: string }) => r.username)
      .filter(Boolean)
      .slice(0, 30);

    return NextResponse.json({
      handle:            `@${p.username ?? username}`,
      displayName:       p.fullName || username,
      followerCount,
      followsCount:      p.followsCount      ?? null,
      postsCount:        p.postsCount        ?? null,
      bio:               p.biography         ?? null,
      avatarUrl:         p.profilePicUrlHD ?? p.profilePicUrl ?? null,
      verified:          p.verified          ?? false,
      isPrivate:         p.private           ?? false,
      instagramId:       p.id ? String(p.id) : null,
      avgViews,
      outlierRatio,
      relatedHandles,   // → feed back into candidates
    });
  } catch (err) {
    return NextResponse.json({ error: String(err) }, { status: 500 });
  }
}
