// @ts-nocheck
import { PortfolioClient } from "../../types";

export const bikeRental: PortfolioClient = {
  id: "bike-rental",
  name: "Bike Rental",
  industry: "transportation",
  tagline: "City bike rentals with live availability and passes",
  description: "Mobile-first bike rental with QR pickup, deposits, and pass management.",
  rating: 4.8,
  liveUrl: undefined,
  projectType: "Rental platform",
  status: "Live",
  launchDate: "2024-09-18",
  timeline: {
    startDate: "2024-09-05",
    endDate: "2024-09-18",
    durationDays: 13,
    phases: [
      { name: "Discovery", description: "Fleet + station mapping", duration: "2 days" },
      { name: "UX & flows", description: "Passes, deposits, returns", duration: "3 days" },
      { name: "Build", description: "Booking, payments, QR handoff", duration: "6 days" },
      { name: "QA & launch", description: "Device testing + fraud checks", duration: "2 days" },
    ],
  },
  pricing: { marketValue: 7000, sisoPrice: 598, currency: "GBP", savings: 91 },
  features: {
    key: ["Live availability", "Fleet catalog", "Booking system", "WhatsApp connect"],
    technical: ["Stripe holds", "Mapbox", "Pass management"],
    integrations: ["Stripe", "Mapbox", "WhatsApp"],
    tokens: { estimate: "70m" },
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
    businessImpact: "Reduced counter time; more mobile self-serve.",
    clientSatisfaction: 4.8,
    kpis: [
      { label: "Mobile bookings", value: "+26%" },
      { label: "Check-in time", value: "-35%" },
    ],
  },
  media: {
    hero: "/portfolio/bike-rental/desktop/hero-top.webp",
    screenshots: {
      desktop: [
        "/portfolio/bike-rental/desktop/hero-top.webp",
        "/portfolio/bike-rental/desktop/hero-1.png",
        "/portfolio/bike-rental/desktop/hero-2.png",
        "/portfolio/bike-rental/desktop/bikes.png",
      ],
      mobile: ["/portfolio/bike-rental/mobile/home.jpg"],
      features: [],
    },
  },
  metadata: {
    featured: false,
    showInPortfolio: true,
    seoTitle: "Bike Rental Platform | SISO Portfolio",
    seoDescription: "Bike rentals with live availability and QR pickup.",
    tags: ["rental", "transportation"],
  },
};
