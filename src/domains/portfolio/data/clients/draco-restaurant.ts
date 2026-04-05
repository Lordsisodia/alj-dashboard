// @ts-nocheck
import { PortfolioClient } from "../../types";

export const dracoRestaurant: PortfolioClient = {
  id: "draco-restaurant",
  name: "Draco Restaurant",
  industry: "food-beverage",
  tagline: "Tasting-menu restaurant with reservations and deposits",
  description: "Fine-dining site with timed seatings, deposits, and menu CMS.",
  rating: 4.9,
  liveUrl: undefined,
  projectType: "Restaurant site",
  status: "Live",
  launchDate: "2024-11-12",
  timeline: {
    startDate: "2024-11-01",
    endDate: "2024-11-12",
    durationDays: 11,
    phases: [
      { name: "Discovery", description: "Seating model + menu", duration: "2 days" },
      { name: "Design", description: "Hero + menu + booking flow", duration: "3 days" },
      { name: "Build", description: "Bookings, deposits, menu CMS", duration: "5 days" },
      { name: "QA & launch", description: "Perf + schema", duration: "1 day" },
    ],
  },
  pricing: { marketValue: 9000, sisoPrice: 997, currency: "GBP", savings: 89 },
  features: {
    key: ["Menu", "Admin dashboard", "Deliveroo link", "Order management"],
    technical: ["Stripe holds", "Schema.org", "Gallery"],
    integrations: ["Stripe", "Twilio", "Deliveroo"],
    tokens: { estimate: "250m" },
  },
  techStack: {
    frontend: ["Next.js", "TypeScript", "Tailwind"],
    backend: ["Node.js"],
    database: ["Supabase"],
    hosting: ["Vercel"],
    tools: ["Stripe", "Twilio"],
  },
  teamSize: 4,
  engagementModel: "Fixed bid",
  results: {
    deliverySpeed: "11 days",
    businessImpact: "Higher prepaid bookings, fewer no-shows.",
    clientSatisfaction: 4.9,
    kpis: [
      { label: "Prepaid bookings", value: "+19%" },
      { label: "No-shows", value: "-17%" },
    ],
  },
  media: {
    hero: "/portfolio/draco-restaurant/desktop/hero-top.webp",
    screenshots: {
      desktop: [
        "/portfolio/draco-restaurant/desktop/hero-top.webp",
        "/portfolio/draco-restaurant/desktop/hero-1.png",
        "/portfolio/draco-restaurant/desktop/hero-2.png",
        "/portfolio/draco-restaurant/desktop/hero-3.png",
        "/portfolio/draco-restaurant/desktop/menu.png",
      ],
      mobile: ["/portfolio/draco-restaurant/mobile/home.jpg"],
      features: [],
    },
  },
  metadata: {
    featured: false,
    showInPortfolio: true,
    seoTitle: "Draco Restaurant | SISO Portfolio",
    seoDescription: "Fine dining bookings with deposits and tasting menus.",
    tags: ["restaurant", "food"],
  },
};
