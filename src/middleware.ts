import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

// ── Role → domain redirect map ─────────────────────────────────────────────────
// Route groups don't appear in URLs  -  a file at (agency)/page.tsx is just /agency
const ROLE_DOMAINS: Record<string, string> = {
  owner:   "/agency",
  editor:  "/models",
  chatter: "/chatters",
  viewer:  "/content-gen",
  agency:  "/content-gen",
};

// ── Route matchers ─────────────────────────────────────────────────────────────
const isProtected = createRouteMatcher([
  "/content-gen(.*)",
  "/chatters(.*)",
  "/agency(.*)",
  "/models(.*)",
]);

// Role-restricted domain routes
const domainRoutes = createRouteMatcher([
  "/agency(.*)",
  "/models(.*)",
  "/chatters(.*)",
  "/content-gen(.*)",
]);

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

// Role-based access control map
const ROLE_ALLOWED_DOMAINS: Record<string, string[]> = {
  owner:   ["/agency", "/content-gen"],
  editor:  ["/models", "/content-gen"],
  chatter: ["/chatters", "/content-gen"],
  viewer:  ["/content-gen"],
  agency:  ["/content-gen"],
};

export default clerkMiddleware(async (auth, req: NextRequest) => {
  const path = req.nextUrl.pathname;
  const method = req.method.toUpperCase();

  // ── 0. Dev bypass  -  skip Clerk auth entirely in development ────────────────
  if (
    process.env.NEXT_PUBLIC_DEV_BYPASS_AUTH === "true" &&
    process.env.NODE_ENV === "development"
  ) {
    return NextResponse.next();
  }

  const authObj = await auth();
  const { userId, redirectToSignIn } = authObj;

  // ── 1. Protect new dashboard routes ───────────────────────────────────────────
  if (isProtected(req) && !userId) {
    if (process.env.NODE_ENV !== "development") {
      return redirectToSignIn();
    }
  }

  // @ts-expect-error - role may be on publicMetadata
  const role = (authObj?.publicMetadata?.role as string) || "agency";

  // ── 2. Role-based redirect on first access to /content-gen ─────────────────────
  if (userId && method === "GET" && (path === "/content-gen" || path === "/content-gen/")) {
    const redirectTo = ROLE_DOMAINS[role] || "/content-gen";
    // Only redirect if target differs from /content-gen to avoid infinite loop
    if (redirectTo !== "/content-gen") {
      return NextResponse.redirect(new URL(redirectTo, req.url));
    }
  }

  // ── 3. Role-based access control for domain routes ───────────────────────────
  if (userId && domainRoutes(req)) {
    const allowed = ROLE_ALLOWED_DOMAINS[role] || ROLE_ALLOWED_DOMAINS["agency"];

    const isAllowed = allowed.some((prefix) => path.startsWith(prefix));
    if (!isAllowed) {
      const redirectTo = ROLE_DOMAINS[role] || "/content-gen";
      return NextResponse.redirect(new URL(redirectTo, req.url));
    }
  }

  // ── 4. Edge caching for partner routes ──────────────────────────────────────
  const response = NextResponse.next();
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
