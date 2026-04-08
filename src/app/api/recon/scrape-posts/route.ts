import { NextRequest, NextResponse } from 'next/server';
import { ConvexHttpClient } from 'convex/browser';
import { api } from '@/convex/_generated/api';
import { getApifyToken } from '@/lib/apifyTokens';

const REEL_ACTOR    = 'apify~instagram-reel-scraper';
const DEFAULT_LIMIT = 30;

type ReelRow = Record<string, unknown>;

export async function POST(req: NextRequest) {
  const body = await req.json().catch(() => ({}));
  const { handle, limit, niche } = body as { handle?: string; limit?: number; niche?: string };

  if (!handle || typeof handle !== 'string') {
    return NextResponse.json({ error: 'handle is required' }, { status: 400 });
  }

  const username = handle.replace('@', '').trim();
  if (!username) {
    return NextResponse.json({ error: 'handle cannot be empty' }, { status: 400 });
  }

  let token: string;
  try { token = getApifyToken(); }
  catch { return NextResponse.json({ error: 'No Apify token configured' }, { status: 500 }); }

  try {
    const res = await fetch(
      `https://api.apify.com/v2/acts/${REEL_ACTOR}/run-sync-get-dataset-items?token=${token}`,
      {
        method:  'POST',
        headers: { 'Content-Type': 'application/json' },
        body:    JSON.stringify({
          username:     [username],
          resultsLimit: typeof limit === 'number' && limit > 0 ? limit : DEFAULT_LIMIT,
        }),
        signal:  AbortSignal.timeout(180_000),
      }
    );

    if (!res.ok) {
      const errText = await res.text().catch(() => '');
      console.error(`[scrape-posts] Apify ${res.status}:`, errText.slice(0, 500));
      return NextResponse.json({ error: `Apify ${res.status}`, detail: errText.slice(0, 500) }, { status: 502 });
    }

    const items = (await res.json()) as ReelRow[];
    if (!Array.isArray(items) || items.length === 0) {
      return NextResponse.json({ handle: username, fetched: 0, posts: 0, accounts: 0, skipped: 0, detail: 'No reels found' });
    }

    // Shape each row to match the importFromScraper mutation schema exactly.
    // 'id' is deliberately excluded — Instagram's 19-digit IDs exceed JS Number precision
    // and get mangled in transit. The mutation uses shortCode as externalId.
    const posts = items.map((row): {
      shortCode?:      string;
      caption?:        string;
      hashtags?:       string[];
      url?:            string;
      commentsCount?:  number;
      displayUrl?:     string;
      likesCount?:     number;
      timestamp?:      string;
      firstComment?:   string;
      ownerFullName?:  string;
      ownerUsername?:  string;
      videoUrl?:       string;
      videoViewCount?: number;
      videoPlayCount?: number;
      isVideo?:        boolean;
      type?:           string;   // "Video", "Image", "Sidecar"
      productType?:    string;   // "clips" = Reel, "feed" = photo/carousel, "igtv"
    } => ({
      shortCode:      typeof row.shortCode      === 'string'  ? row.shortCode      : undefined,
      caption:        typeof row.caption        === 'string'  ? row.caption        : undefined,
      hashtags:       Array.isArray(row.hashtags) ? (row.hashtags as string[])     : undefined,
      url:            typeof row.url            === 'string'  ? row.url            : undefined,
      commentsCount:  typeof row.commentsCount  === 'number'  ? row.commentsCount  : undefined,
      displayUrl:     typeof row.displayUrl     === 'string'  ? row.displayUrl     : undefined,
      likesCount:     typeof row.likesCount     === 'number'  ? row.likesCount     : undefined,
      timestamp:      typeof row.timestamp      === 'string'  ? row.timestamp      : undefined,
      firstComment:   typeof row.firstComment   === 'string'  ? row.firstComment   : undefined,
      ownerFullName:  typeof row.ownerFullName  === 'string'  ? row.ownerFullName  : undefined,
      ownerUsername:  typeof row.ownerUsername  === 'string'  ? row.ownerUsername  : undefined,
      videoUrl:       typeof row.videoUrl       === 'string'  ? row.videoUrl       : undefined,
      videoViewCount: typeof row.videoViewCount === 'number'  ? row.videoViewCount : undefined,
      videoPlayCount: typeof row.videoPlayCount === 'number'  ? row.videoPlayCount : undefined,
      isVideo:        typeof row.isVideo        === 'boolean' ? row.isVideo        : undefined,
      type:           typeof row.type           === 'string'  ? row.type           : undefined,
      productType:    typeof row.productType    === 'string'  ? row.productType    : undefined,
    }));

    if (!process.env.NEXT_PUBLIC_CONVEX_URL) {
      return NextResponse.json({ error: 'NEXT_PUBLIC_CONVEX_URL not configured' }, { status: 500 });
    }

    const convex = new ConvexHttpClient(process.env.NEXT_PUBLIC_CONVEX_URL);
    const result = await convex.mutation(api.scraperImport.importFromScraper, {
      posts,
      ...(typeof niche === 'string' && niche.length > 0 ? { nicheOverride: niche } : {}),
    });

    console.log(`[scrape-posts] ${username} - fetched ${items.length}, imported ${result.posts} posts, ${result.accounts} accounts, ${result.skipped} skipped`);

    // Fire-and-forget: fetch avatar for newly created accounts (no avatar yet)
    if (result.accounts > 0) {
      const origin = req.nextUrl.origin;
      fetch(`${origin}/api/recon/enrich-candidate`, {
        method:  'POST',
        headers: { 'Content-Type': 'application/json' },
        body:    JSON.stringify({ handle: `@${username}` }),
      }).catch(e => console.warn('[scrape-posts] background avatar fetch failed:', e));
    }

    return NextResponse.json({
      handle:   username,
      fetched:  items.length,
      posts:    result.posts,
      accounts: result.accounts,
      skipped:  result.skipped,
    });
  } catch (err) {
    // Surface the full Convex error (message + data if present)
    const errObj = err as Record<string, unknown>;
    const detail = errObj?.data ?? errObj?.message ?? String(err);
    console.error('[scrape-posts] exception:', String(err), detail);
    return NextResponse.json({ error: String(err), detail }, { status: 500 });
  }
}
