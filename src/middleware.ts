import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

// ── Role → domain redirect map ─────────────────────────────────────────────────
// Route groups don't appear in URLs  -  a file at (agency)/page.tsx is just /isso
const ROLE_DOMAINS: Record<string, string> = {
  owner:   "/isso/owners",
  editor:  "/isso/editors",
  chatter: "/isso/chatter",
  viewer:  "/isso",
  agency:  "/isso",
};

// ── Route matchers ─────────────────────────────────────────────────────────────
const isProtected = createRouteMatcher(["/isso(.*)"]);

// Role-restricted domain routes
const domainRoutes = createRouteMatcher([
  "/isso/owners(.*)",
  "/isso/editors(.*)",
  "/isso/chatter(.*)",
  "/isso/contentgen(.*)",
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
  owner:   ["/isso/owners", "/isso"],
  editor:  ["/isso/editors", "/isso", "/isso/contentgen"],
  chatter: ["/isso/chatter", "/isso"],
  viewer:  ["/isso"],
  agency:  ["/isso", "/isso/contentgen"],
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

  // ── 1. Protect /isso/* routes ──────────────────────────────────────────────
  if (isProtected(req) && !userId) {
    if (process.env.NODE_ENV !== "development") {
      return redirectToSignIn();
    }
  }

  // @ts-expect-error - role may be on publicMetadata
  const role = (authObj?.publicMetadata?.role as string) || "agency";

  // ── 2. Role-based redirect on first access to /isso ─────────────────────────
  if (userId && method === "GET" && (path === "/isso" || path === "/isso/")) {
    const redirectTo = ROLE_DOMAINS[role] || "/isso";
    // Only redirect if target differs from /isso to avoid infinite loop
    if (redirectTo !== "/isso") {
      return NextResponse.redirect(new URL(redirectTo, req.url));
    }
  }

  // ── 3. Role-based access control for domain routes ───────────────────────────
  if (userId && domainRoutes(req)) {
    const allowed = ROLE_ALLOWED_DOMAINS[role] || ROLE_ALLOWED_DOMAINS["agency"];

    const isAllowed = allowed.some((prefix) => path.startsWith(prefix));
    if (!isAllowed) {
      const redirectTo = ROLE_DOMAINS[role] || "/isso";
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
