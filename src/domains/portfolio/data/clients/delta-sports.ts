import { PortfolioClient } from "../../types";

export const deltaSports: PortfolioClient = {
  id: "delta-sports",
  name: "Delta Sports",
  industry: "fitness-sports",
  tagline: "Sports club site with jobs board and team updates",
  description: "Sports club marketing site featuring schedules, teams, and hiring pipeline.",
  rating: 4.8,
  liveUrl: undefined,
  projectType: "Website",
  status: "Live",
  launchDate: "2024-10-12",
  timeline: { startDate: "2024-09-28", endDate: "2024-10-12", durationDays: 14, phases: [] },
  pricing: { marketValue: 4000, sisoPrice: 497, currency: "GBP", savings: 88 },
  features: {
    key: ["Team roster", "Jobs board", "Schedule", "Coach matching"],
    technical: [],
    integrations: [],
    tokens: { estimate: "80m" },
  },
  techStack: { frontend: ["Next.js", "TypeScript"], backend: ["Node.js"], database: ["Supabase"], hosting: ["Vercel"], tools: [] },
  media: {
    hero: "/portfolio/delta-sports/desktop/hero-top.webp",
    screenshots: {
      desktop: [
        "/portfolio/delta-sports/desktop/hero-top.webp",
        "/portfolio/delta-sports/desktop/hero-1.png",
        "/portfolio/delta-sports/desktop/jobs.png",
      ],
      mobile: ["/portfolio/delta-sports/mobile/home.png"],
      features: [],
    },
  },
  metadata: {
    featured: false,
    showInPortfolio: true,
    seoTitle: "Delta Sports | Sports Club Site",
    seoDescription: "Sports club site with schedule, teams, and hiring pipeline.",
    tags: ["sports", "club"],
  },
};
