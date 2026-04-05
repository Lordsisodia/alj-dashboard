// @ts-nocheck
import { PortfolioClient } from '../../types';
export const teamApollo: PortfolioClient = {
  id: 'team-apollo', name: 'Team Apollo', industry: 'internal-tools',
  tagline: 'Internal team collaboration tool',
  description: 'Team collaboration and project coordination platform for internal use.',
  liveUrl: undefined, projectType: 'Internal Tool', status: 'Live', launchDate: '2024-05-15',
  timeline: {
    startDate: '2024-05-01',
    endDate: '2024-05-15',
    durationDays: 14,
    phases: [
      { name: 'Discovery', description: 'Stakeholder interviews, scope lock, and IA outline.', duration: 'Days 1-3' },
      { name: 'Build', description: 'UI assembly, integrations, and internal comms flows.', duration: 'Days 4-10' },
      { name: 'QA & Launch', description: 'UAT, polish, and handoff for internal rollout.', duration: 'Days 11-14' },
    ],
  },
  pricing: { marketValue: 2000, sisoPrice: 250, currency: 'GBP', savings: 88 },
  features: {
    key: ['Lead collection', 'Live project data', 'Conversion-optimized hero'],
    technical: [],
    integrations: ['Analytics'],
    tokens: { estimate: '30m' }
  },
  techStack: { frontend: ['React', 'TypeScript'], backend: ['Node.js'], database: ['PostgreSQL'], hosting: ['Vercel'], tools: ['Vite'] },
  faq: [
    {
      question: 'Can we roll this out to other internal teams?',
      answer: 'Yes. The workspace supports multi-team instances with isolated channels, and we can provision new pods in under a day.',
    },
    {
      question: 'Does it support SSO and role-based access?',
      answer: 'We ship with SSO (Okta/Google) and role-based permissions baked in; additional roles can be configured per team.',
    },
    {
      question: 'How long does onboarding take?',
      answer: 'Typical onboarding is 1–2 days: connect identity, set up channels, and import your first projects.',
    },
    {
      question: 'Can we integrate Jira or Linear?',
      answer: 'Yes. We can sync issues bi-directionally with Jira or Linear, including status, assignee, and labels.',
    },
    {
      question: 'Do you support AI summaries for updates?',
      answer: 'AI-generated daily digests are built-in; they condense channel chatter and project changes for fast catch-up.',
    },
    {
      question: 'Is there audit logging for compliance?',
      answer: 'Every action (edits, comments, file access) is logged and exportable for compliance reviews.',
    },
    {
      question: 'What environments are supported?',
      answer: 'We deploy to Vercel by default and can mirror staging/production with feature flags for safe rollouts.',
    },
  ],
  media: {
    logo: '/portfolio/team-apollo/logo.png',
    hero: '/portfolio/team-apollo/desktop/hero-top.webp',
    screenshots: {
      desktop: [
        '/portfolio/team-apollo/desktop/hero-top.webp',
        '/portfolio/team-apollo/desktop/hero-1.png',
      ],
      mobile: ['/portfolio/team-apollo/mobile/home.png'],
      features: [],
    },
  },
  mediaMeta: [
    {
      src: '/portfolio/team-apollo/desktop/hero-top.webp',
      role: 'hero',
      label: 'Desktop hero',
      caption: 'Full-width hero showing workspace overview.',
    },
    {
      src: '/portfolio/team-apollo/desktop/hero-1.png',
      role: 'desktop',
      label: 'Projects view',
      caption: 'Kanban board with live project data and approvals.',
    },
    {
      src: '/portfolio/team-apollo/mobile/home.png',
      role: 'mobile',
      label: 'Mobile flow',
      caption: 'Team updates and quick approvals on the go.',
    },
  ],
  metadata: { featured: false, showInPortfolio: true, seoTitle: 'Team Apollo | SISO Portfolio', seoDescription: 'Team collaboration tool', tags: ['internal', 'collaboration'] }
};
