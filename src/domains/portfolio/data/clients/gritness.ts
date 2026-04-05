/**
 * Portfolio Client Data - gritness
 * TODO: Fill in actual client data
 */

import { PortfolioClient } from '../../types';

export const gritness: PortfolioClient = {
  id: 'gritness',
  name: 'Gritness Gym',
  industry: 'fitness-sports',
  tagline: 'Gym management and member application',
  description: 'Complete gym management platform with class booking and membership management.',
  liveUrl: undefined,
  projectType: 'Web App',
  status: 'Live',
  launchDate: '2024-01-01',
  timeline: {
    startDate: '2024-01-01',
    endDate: '2024-01-14',
    durationDays: 14,
    phases: [],
  },
  pricing: {
    marketValue: 10000,
    sisoPrice: 3000,
    currency: 'GBP',
    savings: 70,
  },
  features: {
    key: ['TODO: Add features'],
    technical: [],
    integrations: [],
  },
  techStack: {
    frontend: ['React', 'TypeScript'],
    backend: ['Node.js'],
    database: ['PostgreSQL'],
    hosting: ['Vercel'],
    tools: ['Vite'],
  },
  media: {
    logo: '/portfolio/gritness/logo.png',
    hero: '/portfolio/gritness/desktop/hero-top.webp',
    screenshots: {
      desktop: [
        '/portfolio/gritness/desktop/hero-top.webp',
        '/portfolio/gritness/desktop/hero-1.png',
        '/portfolio/gritness/desktop/hero-2.png',
        '/portfolio/gritness/desktop/hero-3.png',
      ],
      mobile: ['/portfolio/gritness/mobile/home.png'],
      features: [],
    },
  },
  metadata: {
    featured: false,
    showInPortfolio: true,
    seoTitle: 'gritness | SISO Portfolio',
    seoDescription: 'TODO: Add SEO description',
    tags: ['TODO'],
  },
};
