// @ts-nocheck
import { PortfolioClient } from "../../types";

export const carpetCleaner: PortfolioClient = {
  id: "carpet-cleaner",
  name: "Carpet Cleaner",
  industry: "construction",
  tagline: "Local services booking with routes and deposits",
  description: "Book carpet cleaning slots with upsells, deposits, and crew routing.",
  rating: 4.8,
  liveUrl: undefined,
  projectType: "Services booking",
  status: "Live",
  launchDate: "2024-08-28",
  timeline: {
    startDate: "2024-08-15",
    endDate: "2024-08-28",
    durationDays: 13,
    phases: [
      { name: "Discovery", description: "Service SKUs + geo coverage", duration: "2 days" },
      { name: "Flows", description: "Booking + upsell + deposits", duration: "3 days" },
      { name: "Build", description: "Scheduling, payments, notifications", duration: "6 days" },
      { name: "QA & launch", description: "Routing + perf", duration: "2 days" },
    ],
  },
  pricing: { marketValue: 2500, sisoPrice: 249, currency: "GBP", savings: 90 },
  features: {
    key: ["Slot booking", "Deposit holds", "Add-on upsells", "Client portfolio"],
    technical: ["Stripe holds", "Route optimization", "Service CMS"],
    integrations: ["Stripe", "Mapbox"],
    tokens: { estimate: "40m" },
  },
  techStack: {
    frontend: ["Next.js", "TypeScript", "Tailwind"],
    backend: ["Node.js"],
    database: ["Supabase"],
    hosting: ["Vercel"],
    tools: ["Stripe", "Mapbox"],
  },
  teamSize: 4,
  engagementModel: "Fixed bid",
  results: {
    deliverySpeed: "13 days",
    businessImpact: "Higher prepaids via deposit holds and add-ons.",
    clientSatisfaction: 4.8,
    kpis: [
      { label: "Online bookings", value: "+22%" },
      { label: "Upsell attach", value: "+14%" },
    ],
  },
  media: {
    hero: "/portfolio/carpet-cleaner/desktop/hero-top.webp",
    screenshots: {
      desktop: [
        "/portfolio/carpet-cleaner/desktop/hero-top.webp",
        "/portfolio/carpet-cleaner/desktop/hero-1.png",
        "/portfolio/carpet-cleaner/desktop/hero-2.png",
      ],
      mobile: ["/portfolio/carpet-cleaner/mobile/home.jpg"],
      features: [],
    },
  },
  metadata: {
    featured: false,
    showInPortfolio: true,
    seoTitle: "Carpet Cleaner Booking | SISO Portfolio",
    seoDescription: "Services booking with deposits, upsells, and routing.",
    tags: ["services", "construction"],
  },
};
