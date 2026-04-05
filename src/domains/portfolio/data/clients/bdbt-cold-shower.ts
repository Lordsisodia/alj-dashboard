import { PortfolioClient } from "../../types";

export const bdbtColdShower: PortfolioClient = {
  id: "bdbt-cold-shower",
  name: "BDBT Cold Shower Tracker",
  industry: "health-wellness",
  tagline: "Cold exposure tracker with streaks and habits",
  description: "Mobile-first cold shower tracker with streaks, blueprints, and partner perks.",
  rating: 4.8,
  liveUrl: undefined,
  projectType: "Web App",
  status: "Live",
  launchDate: "2024-09-10",
  timeline: { startDate: "2024-08-28", endDate: "2024-09-10", durationDays: 13, phases: [] },
  pricing: { marketValue: 4000, sisoPrice: 997, currency: "GBP", savings: 75 },
  features: {
    key: ["Streaks", "Blueprints", "Partner offers", "Tips library", "Newsletter"],
    technical: [],
    integrations: ['Payments'],
    tokens: { estimate: "130m" },
  },
  techStack: { frontend: ["Next.js", "TypeScript"], backend: ["Node.js"], database: ["Supabase"], hosting: ["Vercel"], tools: [] },
  media: {
    hero: "/portfolio/bdbt-cold-shower/desktop/hero-top.webp",
    screenshots: {
      desktop: [
        "/portfolio/bdbt-cold-shower/desktop/hero-top.webp",
        "/portfolio/bdbt-cold-shower/desktop/hero-1.png",
        "/portfolio/bdbt-cold-shower/desktop/blueprint.png",
        "/portfolio/bdbt-cold-shower/desktop/partnership.png",
      ],
      mobile: ["/portfolio/bdbt-cold-shower/mobile/home.png"],
      features: [],
    },
  },
  metadata: {
    featured: false,
    showInPortfolio: true,
    seoTitle: "Cold Shower Tracker | SISO Portfolio",
    seoDescription: "Track cold exposure streaks with blueprints and partner perks.",
    tags: ["habit", "health"],
  },
};
