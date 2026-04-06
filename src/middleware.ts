import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

const isProtected = createRouteMatcher(["/isso(.*)"]);

// Partner routes that should NOT be edge-cached
const DYNAMIC_PARTNER_ROUTES = [
  "/partners/messages",
  "/partners/pipeline-ops/submit-client",
  "/partners/recruitment/prospects",
  "/partners/recruitment/team",
  "/partners/workspace",
  "/partners/tools",
  "/partners/wallet",
  "/partners/earnings/wallet",
];

export default clerkMiddleware(async (auth, req: NextRequest) => {
  // Protect /isso/* - require Clerk session
  // Skip in local dev when NEXT_PUBLIC_DEV_BYPASS_AUTH=true
  const host = req.headers.get('host') ?? '';
  const devBypass =
    host.startsWith('localhost') ||
    host.startsWith('127.0.0.1') ||
    process.env.NEXT_PUBLIC_DEV_BYPASS_AUTH === 'true';
  if (isProtected(req) && !devBypass) {
    await auth.protect();
  }

  const response = NextResponse.next();
  const path = req.nextUrl.pathname;
  const method = req.method.toUpperCase();

  // Edge caching for partner routes
  const isPartners = path.startsWith("/partners");
  const isDynamic = DYNAMIC_PARTNER_ROUTES.some((r) => path.startsWith(r));

  if (isPartners && method === "GET" && !isDynamic) {
    response.headers.set(
      "Cache-Control",
      "s-maxage=3600, stale-while-revalidate=86400"
    );
    response.headers.set("x-middleware-cache", "turbo");
  }

  return response;
});

export const config = {
  matcher: [
    "/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)",
    "/(api|trpc)(.*)",
  ],
};
