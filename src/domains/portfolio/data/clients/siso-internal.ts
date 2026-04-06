import { PortfolioClient } from '../../types';
export const sisoInternal: PortfolioClient = {
  id: 'siso-internal', name: 'ORACLE Internal', industry: 'internal-tools',
  tagline: 'Internal task tracker and daily life manager for ORACLE agency',
  description: 'Complete task management and team coordination platform for internal agency use.',
  liveUrl: undefined, projectType: 'Internal Tool', status: 'Live', launchDate: '2024-08-01',
  timeline: { startDate: '2024-07-15', endDate: '2024-08-28', durationDays: 42, phases: [] },
  pricing: { marketValue: 0, sisoPrice: 0, currency: 'GBP', savings: 0 },
  features: {
    key: [
      'Task management',
      'Timeboxing',
      'Morning routine',
      'Nightly checkout',
      'Water tracker',
      'Food tracker',
      'Clients tracker',
      'Partners tracker',
      'XP store & gamification'
    ],
    technical: ['Kubernetes-managed runtime'],
    integrations: ['Internal auth'],
    tokens: { estimate: '1.2b' }
  },
  techStack: { frontend: ['React', 'TypeScript', 'Tailwind CSS'], backend: ['Node.js'], database: ['PostgreSQL'], hosting: ['Vercel'], tools: ['Vite'] },
  media: { logo: '/portfolio/siso-internal/logo.png', screenshots: { desktop: ['/portfolio/siso-internal/desktop/hero.png'], mobile: ['/portfolio/siso-internal/mobile/home.png'], features: [] } },
  metadata: { featured: true, showInPortfolio: true, seoTitle: 'ORACLE Internal - Task Manager | ORACLE Portfolio', seoDescription: 'Internal task and project management system', tags: ['internal', 'productivity', 'task-manager'] }
};
