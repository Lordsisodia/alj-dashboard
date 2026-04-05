import { PortfolioClient } from '../../types';
export const mooshin: PortfolioClient = {
  id: 'mooshin', name: 'Mooshin', industry: 'elearning',
  tagline: 'Martial arts course selling platform',
  description: 'Online course marketplace for martial arts instruction with payment processing.',
  liveUrl: undefined, projectType: 'Platform', status: 'Live', launchDate: '2024-09-01',
  timeline: { startDate: '2024-08-15', endDate: '2024-09-01', durationDays: 17, phases: [] },
  pricing: { marketValue: 15000, sisoPrice: 1950, currency: 'GBP', savings: 87 },
  features: {
    key: ['Interactive courses', 'Student portal', 'Blog system', 'Payment processing'],
    technical: [],
    integrations: ['Stripe'],
    tokens: { estimate: '220m' }
  },
  techStack: { frontend: ['React', 'TypeScript'], backend: ['Node.js'], database: ['PostgreSQL'], hosting: ['Vercel'], tools: ['Vite'] },
  media: {
    logo: '/portfolio/mooshin/logo.png',
    hero: '/portfolio/mooshin/desktop/hero-top.webp',
    screenshots: {
      desktop: [
        '/portfolio/mooshin/desktop/hero-top.webp',
        '/portfolio/mooshin/desktop/hero-1.png',
        '/portfolio/mooshin/desktop/hero-2.png',
        '/portfolio/mooshin/desktop/hero-3.png',
      ],
      mobile: ['/portfolio/mooshin/mobile/home.png'],
      features: [],
    },
  },
  metadata: { featured: false, showInPortfolio: true, seoTitle: 'Mooshin - Martial Arts Courses | SISO Portfolio', seoDescription: 'Martial arts online course platform', tags: ['elearning', 'courses', 'martial-arts'] }
};
