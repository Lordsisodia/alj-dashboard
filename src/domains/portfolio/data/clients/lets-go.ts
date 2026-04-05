/**
 * Portfolio Client Data - lets go
 * TODO: Fill in actual client data
 */

import { PortfolioClient } from '../../types';

export const letsGo: PortfolioClient = {
  id: 'lets-go',
  name: "Let's Go",
  industry: 'saas',
  tagline: 'Student housing matchmaking platform',
  description: 'University student housemate finder with profile matching and messaging.',
  liveUrl: undefined,
  projectType: 'Web App',
  status: 'Live',
  launchDate: '2024-01-01',
  timeline: {
    startDate: '2024-01-01',
    endDate: '2024-01-25',
    durationDays: 25,
    phases: [],
  },
  pricing: {
    marketValue: 10000,
    sisoPrice: 997,
    currency: 'GBP',
    savings: 90,
  },
  features: {
    key: ['Messaging', 'Profile creation', 'Matchmaking algorithm', 'Swipe-style discovery', 'Student hobbies matching'],
    technical: ['Realtime feed'],
    integrations: ['Email'],
    tokens: { estimate: '125m' },
  },
  techStack: {
    frontend: ['React', 'TypeScript'],
    backend: ['Node.js'],
    database: ['PostgreSQL'],
    hosting: ['Vercel'],
    tools: ['Vite'],
  },
  media: {
    logo: '/portfolio/lets-go/logo.png',
    hero: '/portfolio/lets-go/desktop/hero-top.webp',
    screenshots: {
      desktop: [
        '/portfolio/lets-go/desktop/hero-top.webp',
        '/portfolio/lets-go/desktop/matchmate-01.png',
        '/portfolio/lets-go/desktop/matchmate-02.png',
        '/portfolio/lets-go/desktop/matchmate-03.png',
        '/portfolio/lets-go/desktop/matchmate-04.png',
        '/portfolio/lets-go/desktop/matchmate-05.png',
        '/portfolio/lets-go/desktop/matchmate-06.png',
        '/portfolio/lets-go/desktop/matchmate-07.png',
        '/portfolio/lets-go/desktop/matchmate-08.png',
        '/portfolio/lets-go/desktop/matchmate-09.png',
        '/portfolio/lets-go/desktop/matchmate-10.png',
      ],
      // Reuse hero for mobile until a dedicated portrait asset is added
      mobile: ['/portfolio/lets-go/desktop/hero-top.webp'],
      features: [],
    },
  },
  metadata: {
    featured: false,
    showInPortfolio: true,
    seoTitle: 'lets go | SISO Portfolio',
    seoDescription: 'TODO: Add SEO description',
    tags: ['TODO'],
  },
};
