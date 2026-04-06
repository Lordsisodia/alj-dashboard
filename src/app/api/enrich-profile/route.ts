import { NextRequest, NextResponse } from 'next/server';

// Actor: apify/instagram-profile-scraper (dSCLg0C3YEZ83HzYX)
const APIFY_ACTOR = 'apify~instagram-profile-scraper';

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

    return NextResponse.json({
      handle:                `@${p.username ?? username}`,
      followerCount:         p.followersCount         ?? 0,
      followsCount:          p.followsCount           ?? null,
      postsCount:            p.postsCount             ?? null,
      bio:                   p.biography              ?? null,
      avatarUrl:             p.profilePicUrlHD ?? p.profilePicUrl ?? null,
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
}
