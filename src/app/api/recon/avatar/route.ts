import { NextRequest, NextResponse } from 'next/server';

// Proxies Instagram CDN avatar URLs through our server so browsers
// don't need Instagram auth cookies and CSP issues are bypassed.
export async function GET(req: NextRequest) {
  const url = req.nextUrl.searchParams.get('url');
  if (!url) return new NextResponse(null, { status: 400 });

  try {
    const res = await fetch(url, {
      headers: {
        'Referer': 'https://www.instagram.com/',
        'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36',
      },
      signal: AbortSignal.timeout(10_000),
    });
    if (!res.ok) return new NextResponse(null, { status: 404 });

    const buffer = await res.arrayBuffer();
    return new NextResponse(buffer, {
      headers: {
        'Content-Type': res.headers.get('content-type') ?? 'image/jpeg',
        'Cache-Control': 'public, max-age=86400, stale-while-revalidate=3600',
      },
    });
  } catch {
    return new NextResponse(null, { status: 404 });
  }
}
