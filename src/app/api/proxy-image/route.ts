import { NextRequest, NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

// Allowed CDN hostnames - only proxy known Instagram/Facebook CDN domains
const ALLOWED_HOSTS = [
  'cdninstagram.com',
  'fbcdn.net',
  'instagram.com',
  'scontent.cdninstagram.com',
];

function isAllowed(url: string): boolean {
  try {
    const { hostname } = new URL(url);
    return ALLOWED_HOSTS.some(h => hostname === h || hostname.endsWith('.' + h));
  } catch {
    return false;
  }
}

export async function GET(req: NextRequest) {
  const raw = req.nextUrl.searchParams.get('url');
  if (!raw) return new NextResponse('Missing url param', { status: 400 });

  const target = decodeURIComponent(raw);
  if (!isAllowed(target)) {
    return new NextResponse('Forbidden domain', { status: 403 });
  }

  try {
    const upstream = await fetch(target, {
      headers: {
        // Spoof Instagram as the referrer - bypasses CDN hotlink protection
        'Referer':          'https://www.instagram.com/',
        'Origin':           'https://www.instagram.com',
        'User-Agent':       'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36',
        'Accept':           'image/avif,image/webp,image/apng,image/*,*/*;q=0.8',
        'Accept-Language':  'en-US,en;q=0.9',
        'sec-fetch-dest':   'image',
        'sec-fetch-mode':   'no-cors',
        'sec-fetch-site':   'cross-site',
      },
      // Don't follow redirects to non-allowed domains
      redirect: 'follow',
    });

    if (!upstream.ok) {
      return new NextResponse(`Upstream error: ${upstream.status}`, { status: upstream.status });
    }

    const contentType = upstream.headers.get('content-type') ?? 'image/jpeg';
    const body = await upstream.arrayBuffer();

    return new NextResponse(body, {
      status: 200,
      headers: {
        'Content-Type':        contentType,
        // Cache aggressively client + CDN side - these are static thumbnails
        'Cache-Control':       'public, max-age=86400, stale-while-revalidate=604800',
        'Access-Control-Allow-Origin': '*',
      },
    });
  } catch (err) {
    console.error('[proxy-image] fetch failed:', err);
    return new NextResponse('Proxy error', { status: 502 });
  }
}
