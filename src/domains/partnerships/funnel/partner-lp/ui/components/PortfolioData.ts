export type PortfolioCategory = 'events' | 'restaurant' | 'beauty' | 'fintech' | 'real-estate';

export const categoryLabels: Record<PortfolioCategory, string> = {
  events: 'Events',
  restaurant: 'Restaurant',
  beauty: 'Beauty',
  fintech: 'Fintech',
  'real-estate': 'Real Estate'
};

export const portfolioItems = [
  {
    id: 'events-1',
    title: 'EventFlow Platform',
    category: 'events' as const,
    description: 'End-to-end event management with ticketing, check-in, and analytics.',
    status: 'live' as const,
    priceRange: { min: 12000, max: 18000 },
    technologies: ['Next.js', 'Supabase', 'Stripe'],
    image: 'https://images.unsplash.com/photo-1511578314322-379afb476865?w=800&h=600&fit=crop'
  },
  {
    id: 'restaurant-1',
    title: 'Smart Kitchen OS',
    category: 'restaurant' as const,
    description: 'Kitchen display system with live orders, prep timers, and staff chat.',
    status: 'live' as const,
    priceRange: { min: 10000, max: 15000 },
    technologies: ['React', 'Firebase', 'Twilio'],
    image: 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=800&h=600&fit=crop'
  },
  {
    id: 'beauty-1',
    title: 'GlowBook',
    category: 'beauty' as const,
    description: 'AI scheduling and retention engine for salons with memberships.',
    status: 'live' as const,
    priceRange: { min: 9000, max: 14000 },
    technologies: ['Next.js', 'Postgres', 'SendGrid'],
    image: 'https://images.unsplash.com/photo-1560066984-138dadb4c035?w=800&h=600&fit=crop'
  },
  {
    id: 'fintech-1',
    title: 'LedgerIQ',
    category: 'fintech' as const,
    description: 'Reconciliation and payment orchestration for multi-entity agencies.',
    status: 'prototype' as const,
    priceRange: { min: 18000, max: 26000 },
    technologies: ['Next.js', 'Supabase', 'Plaid'],
    image: 'https://images.unsplash.com/photo-1559526324-4b87b5e36e44?w=800&h=600&fit=crop'
  },
  {
    id: 'real-estate-1',
    title: 'PropLaunch',
    category: 'real-estate' as const,
    description: 'Investor portal with deal rooms, KYC, and e-sign workflows.',
    status: 'live' as const,
    priceRange: { min: 14000, max: 21000 },
    technologies: ['Next.js', 'Supabase', 'DocuSign'],
    image: 'https://images.unsplash.com/photo-1560518883-ce09059eeffa?w=800&h=600&fit=crop'
  }
];

