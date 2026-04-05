/**
 * Portfolio Domain - Route Constants
 *
 * Central place for public/private portfolio paths to avoid hard-coded strings.
 */

export const PORTFOLIO_ROUTES = {
  appHub: "/partners/academy/portfolio",
  publicHub: "/portfolio",
  publicIndustry: (slug: string) => `/portfolio/${slug}`,
  publicClient: (industrySlug: string, clientId: string) => `/portfolio/${industrySlug}/${clientId}`,
  query: {
    industry: "industry",
  },
  fallback: "/portfolio",
} as const;
