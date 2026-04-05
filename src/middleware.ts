import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

// Global partner caching policy: cache most partner GET routes at the edge for 1h, serve stale for 24h.
// Dynamic/interactive routes are explicitly excluded.
export function middleware(request: NextRequest) {
    const response = NextResponse.next();
    const path = request.nextUrl.pathname;
    const method = request.method.toUpperCase();

    const isPartners = path.startsWith("/partners");

    // Routes that should NOT be cached at the edge (interactive / mutating / user-specific)
    const dynamicBlocklist = [
        "/partners/messages", // messaging threads and inbox
        "/partners/pipeline-ops/submit-client",
        "/partners/recruitment/prospects",
        "/partners/recruitment/team", // team detail has editable state
        "/partners/workspace", // editors/tasks likely user-scoped
        "/partners/tools", // generators/editors
        "/partners/wallet",
        "/partners/earnings/wallet",
    ];

    const isDynamic = dynamicBlocklist.some((route) => path.startsWith(route));

    if (isPartners && method === "GET" && !isDynamic) {
        // s-maxage=3600: cached on the edge for 1 hour
        // stale-while-revalidate=86400: serve stale for up to 1 day while revalidating
        response.headers.set(
            "Cache-Control",
            "s-maxage=3600, stale-while-revalidate=86400"
        );
        response.headers.set("x-middleware-cache", "turbo");
    }

    return response;
}

export const config = {
    matcher: [
        /*
         * Match all request paths except for the ones starting with:
         * - api (API routes)
         * - _next/static (static files)
         * - _next/image (image optimization files)
         * - favicon.ico (favicon file)
         */
        "/((?!api|_next/static|_next/image|favicon.ico).*)",
    ],
};
