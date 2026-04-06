import { PortfolioClient } from '../../types';
export const elementary: PortfolioClient = {
  id: 'elementary', name: 'Elementary', industry: 'food-beverage',
  tagline: 'Restaurant website and reservation system',
  description: 'Modern restaurant website with menu showcase and online reservations.',
  rating: 4.9,
  liveUrl: undefined, projectType: 'Website', status: 'Live', launchDate: '2024-10-01',
  timeline: {
    startDate: '2024-09-20',
    endDate: '2024-10-01',
    durationDays: 11,
    phases: [
      { name: 'Intake & Goals', description: 'Collect requirements, success metrics, constraints from the client.', duration: '1 day' },
      { name: 'PRD & Research (47-step system)', description: 'Run our structured PRD workflow: competitive/SEO scan, booking patterns, risk/edge cases.', duration: '2 days' },
      { name: 'Experience Blueprint', description: 'Plan flows, states, and content; define color/typography directions.', duration: '2 days' },
      { name: 'Wireframes & UI Directions', description: 'Wireframe key screens against 2-3 color schemes; agree on the chosen direction.', duration: '1 day' },
      { name: 'Build & Integrations', description: 'Implement booking flow, CMS menus, Stripe/Twilio hooks, performance budget.', duration: '3 days' },
      { name: 'QA & UAT', description: 'Cross-device testing, accessibility, schema/SEO checks, load/perf validation.', duration: '1 day' },
      { name: 'Client Feedback Loops', description: 'Iterate with the client (2-3 cycles) until sign-off.', duration: '1 day' },
      { name: 'Launch & Handoff', description: 'Deploy, run smoke tests, and hand over training + Looms.', duration: '0.5 day' },
    ]
  },
  pricing: { marketValue: 6000, sisoPrice: 997, currency: 'GBP', savings: 83 },
  features: {
    key: ['Menu showcase', 'Online reservations', 'Contact system'],
    technical: ['Headless menu CMS', 'Slot-based booking API', 'Structured data for SEO'],
    integrations: ['Stripe Checkout', 'Twilio SMS'],
    descriptions: {
      'Menu showcase': 'Menu CMS with schedule-based publishing and image CDN.',
      'Online reservations': 'Frictionless table booking with availability awareness.',
      'Contact system': 'Contact form with routing + notifications.',
      'Headless menu CMS': 'Structured menu content served via headless API.',
      'Slot-based booking API': 'Prevents double-bookings; enforces party-size guardrails.',
      'Structured data for SEO': 'Schema.org markup to boost local search ranking.',
      'Stripe Checkout': 'Secure payments without storing card data on origin.',
      'Twilio SMS': 'Confirmation + reminder messages to cut no-shows.',
    },
    costs: {
      'Menu showcase': '+$600 for complex menu variants (multi-location).',
      'Online reservations': '+$900 when integrating legacy POS or table maps.',
      'Contact system': '+$250 for CRM routing & spam filtering.',
      'Headless menu CMS': '+$700 if migrating from non-structured menus.',
      'Slot-based booking API': '+$850 for multi-venue load balancing.',
      'Structured data for SEO': '+$300 for multilingual schema variants.',
      'Stripe Checkout': '+$400 for custom tax/shipping rules.',
      'Twilio SMS': '+$250 per locale set (templates + sender IDs).',
    },
    tokens: {
      'Menu showcase': '~8M tokens',
      'Online reservations': '~12M tokens',
      'Contact system': '~5M tokens',
      'Headless menu CMS': '~10M tokens',
      'Slot-based booking API': '~15M tokens',
      'Structured data for SEO': '~6M tokens',
      'Stripe Checkout': '~4M tokens',
      'Twilio SMS': '~3M tokens',
      total: '~140M tokens'
    },
  },
  techStack: { frontend: ['Next.js', 'TypeScript', 'Tailwind'], backend: ['Node.js'], database: ['Supabase'], hosting: ['Vercel'], tools: ['Twilio', 'Stripe'] },
  teamSize: 5,
  engagementModel: 'Fixed bid',
  problemStatements: [
    'Mobile visitors could not complete bookings; form errors on iOS.',
    'No live availability; staff overloaded by phone reservations.',
    'Menu changes were slow to publish; local SEO slipping.'
  ],
  solutionHighlights: [
    'Redesigned booking flow with time-slot chips and party-size guardrails.',
    'Real-time availability service with SMS/email confirmations.',
    'Headless menu CMS with scheduled publishing and schema markup for SEO.',
    'Performance budget enforced: LCP <2.5s on mid-tier mobile.'
  ],
  results: {
    deliverySpeed: '11 days',
    businessImpact: 'Restaurant shifted to majority online bookings within the first month.',
    clientSatisfaction: 4.8,
    kpis: [
      { label: 'Reservations', value: '+31% in 30 days' },
      { label: 'Mobile LCP', value: '-0.7s (p75)' },
      { label: 'No-shows', value: '-19% with reminders' },
      { label: 'Feedback', value: '4.8★ avg' },
    ]
  },
  challenges: [
    { issue: 'PCI & card handling risk', mitigation: 'Kept payments on Stripe Checkout; no card data stored on origin.' },
    { issue: 'Peak weekend traffic', mitigation: 'Menu cached on CDN with ISR; booking shell SSR with edge caching.' }
  ],
  testimonial: {
    quote: 'We went from frantic phone calls to smooth online bookings in days. The new flow paid for itself in the first month.',
    author: 'Priya Desai',
    title: 'Owner, Elementary Restaurant'
  },
  faq: [
    { question: 'How do you price?', answer: 'Fixed band with agreed scope; typical restaurant builds land between £2.5k-£6k.' },
    { question: 'Can you integrate our POS?', answer: 'Yes. Toast/Square hooks are supported; others via webhooks.' },
    { question: 'How fast can you launch?', answer: '11-14 days for a standard booking site with menu CMS.' },
    { question: 'Do you support multiple locations?', answer: 'Yes, with per-location availability flags and menu variants.' },
    { question: 'Can staff edit the menu without developers?', answer: 'Yes. Menu items, pricing, and availability are editable in a simple CMS with scheduled publishing.' },
    { question: 'What happens if a guest cancels or no-shows?', answer: 'We can require deposits or card holds via Stripe and send automated reminder/cancellation flows to cut no-shows.' },
    { question: 'Is the site accessible?', answer: 'We build to WCAG 2.1 AA patterns: focus states, semantic HTML, ARIA for menus/modals, and high-contrast fallbacks.' },
    { question: 'Can we pipe bookings into our CRM or email tool?', answer: 'Yes. We support webhooks and native integrations (HubSpot, Klaviyo) so bookings sync with your CRM and campaigns.' },
    { question: 'Do you provide training?', answer: 'We include a 45-minute handoff with loom videos plus a quickstart doc for staff to manage bookings and menu updates.' }
  ],
  media: {
    logo: '/portfolio/elementary/logo.png',
    hero: '/portfolio/elementary/desktop/hero-top.webp',
    screenshots: {
      desktop: [
        '/portfolio/elementary/desktop/hero-top.webp',
        '/portfolio/elementary/desktop/hero-1.png',
        '/portfolio/elementary/desktop/hero-2.png',
      ],
      mobile: ['/portfolio/elementary/mobile/home.png'],
      features: [],
    },
  },
  metadata: { featured: false, showInPortfolio: true, seoTitle: 'Elementary Restaurant | SISO Portfolio', seoDescription: 'Restaurant website and reservations', tags: ['restaurant', 'food'] }
};
