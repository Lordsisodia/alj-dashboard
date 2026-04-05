// @ts-nocheck
import { PortfolioClient } from "../../types";

export const luminelle: PortfolioClient = {
  id: "luminelle",
  name: "Luminelle",
  industry: "saas",
  tagline: "Headless e‑commerce experience with shoppable stories",
  description: "Premium DTC storefront with headless cart, PDPs, and content-led commerce.",
  rating: 4.9,
  liveUrl: undefined,
  projectType: "E-commerce",
  status: "Live",
  launchDate: "2024-11-05",
  timeline: {
    startDate: "2024-10-20",
    endDate: "2024-11-05",
    durationDays: 16,
    phases: [
      { name: "Discovery", description: "Brand + SKU audit, funnel mapping", duration: "2 days" },
      { name: "Design system", description: "Landing, PDP, cart", duration: "3 days" },
      { name: "Build", description: "Headless cart, search, payments", duration: "8 days" },
      { name: "QA & launch", description: "Perf + checkout flows", duration: "3 days" },
    ],
  },
  pricing: { marketValue: 8000, sisoPrice: 1950, currency: "GBP", savings: 76 },
  features: {
    key: ["Headless cart", "Story-driven PDP", "On-page cross-sell", "Gamified shopping"],
    technical: ["Stripe + Apple/Google Pay", "Algolia search", "Contentful CMS"],
    integrations: ["Stripe", "Algolia", "Contentful", "Shopify"],
    tokens: { estimate: "180m" },
  },
  techStack: {
    frontend: ["Next.js", "TypeScript", "Tailwind"],
    backend: ["Node.js"],
    database: ["Supabase"],
    hosting: ["Vercel"],
    tools: ["Stripe", "Algolia"],
  },
  teamSize: 5,
  engagementModel: "Fixed bid",
  results: {
    deliverySpeed: "16 days",
    businessImpact: "Increased AOV with stories and cross-sells.",
    clientSatisfaction: 4.9,
    kpis: [
      { label: "AOV", value: "+12%" },
      { label: "Checkout speed", value: "-0.6s" },
      { label: "Search CTR", value: "+18%" },
    ],
  },
  media: {
    hero: "/portfolio/luminelle/desktop/hero-top.webp",
    screenshots: {
      desktop: [
        "/portfolio/luminelle/desktop/hero-top.webp",
        "/portfolio/luminelle/desktop/hero-1.png",
        "/portfolio/luminelle/desktop/hero-2.png",
        "/portfolio/luminelle/desktop/product.png",
      ],
      mobile: ["/portfolio/luminelle/mobile/home.jpg"],
      features: [],
    },
  },
  metadata: {
    featured: false,
    showInPortfolio: true,
    seoTitle: "Luminelle | E‑commerce Experience",
    seoDescription: "Headless e-commerce with shoppable stories and cross-sell.",
    tags: ["ecommerce", "saas"],
  },
};
