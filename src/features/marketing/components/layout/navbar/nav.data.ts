// ═══════════════════════════════════════════════════════════════════════════════
// Navigation Data - all items, labels, hrefs, icons in one place
// ═══════════════════════════════════════════════════════════════════════════════

// ─── Product data ─────────────────────────────────────────────────────────────

export const RESEARCH = [
  { label: 'Hub', href: '/hub', desc: 'Your content library, organized and accessible.', sprite: 'swipe-file', gradient: '' },
  { label: 'Intelligence', href: '/intelligence', desc: 'AI-powered trend detection and content search.', sprite: 'discovery', gradient: 'discovery' },
  { label: 'Recon', href: '/recon', desc: 'Track any creator or competitor 24/7.', sprite: 'spyder', gradient: 'spyder' },
] as const;

export const ANALYTICS = [
  { label: 'Agents', href: '/agents', desc: 'Your dedicated AI agent team, always working.', sprite: 'lens', gradient: 'lens' },
  { label: 'Content Gen', href: '/content-gen', desc: 'AI video pipeline - concept to published reel.', sprite: 'briefs', gradient: 'briefs' },
] as const;

export const EXTEND = [
  { label: 'Chrome Extension', href: 'https://chromewebstore.google.com/detail/ad-library-save-facebook/eaancnanphggbfliooildilcnjocggjm', desc: 'Save ads from anywhere.', icon: 'chrome', external: true },
  { label: 'Mobile App', href: '/mobile-app', desc: 'Save ads from your phone.', icon: 'mobile', external: false },
  { label: 'API', href: '/api', desc: 'Leverage ISSO data.', icon: 'api', external: false },
] as const;

// ─── Solutions data ────────────────────────────────────────────────────────────

export const SOLUTION_FEATURED = {
  label: 'OFM & Model Management',
  href: '/ofm',
  desc: 'The complete ISSO stack built for model management agencies - automate content, track talent, and scale revenue.',
  iconKey: 'OFM & Model Management',
} as const;

export const SOLUTIONS_COMING_SOON = [
  { label: 'E-Commerce & Retail', href: '/ecommerce', iconKey: 'E-Commerce & Retail' },
  { label: 'Agencies', href: '/agencies', iconKey: 'Agencies' },
  { label: 'Mobile Apps & Gaming', href: '/mobile-apps-gaming', iconKey: 'Mobile Apps & Gaming' },
  { label: 'B2B & SaaS', href: '/b2b-saas', iconKey: 'B2B & SaaS' },
  { label: 'Info, Education & Community', href: '/info-education', iconKey: 'Info, Education & Community' },
] as const;

// Keep for legacy compatibility
export const SOLUTIONS = [
  { label: 'E-Commerce & Retail', href: '/ecommerce' },
  { label: 'Agencies', href: '/agencies' },
  { label: 'Mobile Apps & Gaming', href: '/mobile-apps-gaming' },
  { label: 'B2B & SaaS', href: '/b2b-saas' },
  { label: 'Info, Education & Community', href: '/info-education' },
  { label: 'Freelancers & Creators', href: '/freelancers' },
] as const;

// ─── Resources data ───────────────────────────────────────────────────────────

export const RESOURCES_LEARN = [
  { label: 'University', href: '/university', desc: 'Ad masterclasses', icon: 'university', comingSoon: true },
  { label: 'Events & Webinars', href: '/webinars', desc: 'Live workshops + Q&A', icon: 'events', comingSoon: true },
  { label: 'Knowledge Base', href: '/help', desc: 'Guides and tutorials', icon: 'knowledge', comingSoon: true },
  { label: 'Experts', href: '/experts', desc: 'Free Swipe Files', icon: 'experts', comingSoon: true },
  { label: 'Blog', href: '/blog', desc: 'Marketing news & tips', icon: 'blog', comingSoon: false },
] as const;

export const RESOURCES_EARN = [
  { label: 'Affiliate Program', href: '/affiliates', desc: 'Earn 20% recurring commission', icon: 'affiliate', comingSoon: true },
] as const;

// Two rows of 3 - split by a single divider, no section labels
export const RESOURCES_ROW1 = [
  { label: 'University', href: '/university', desc: 'Ad masterclasses', icon: 'university', comingSoon: true },
  { label: 'Knowledge Base', href: '/help', desc: 'Guides and tutorials', icon: 'knowledge', comingSoon: true },
  { label: 'Experts', href: '/experts', desc: 'Free Swipe Files', icon: 'experts', comingSoon: true },
] as const;

export const RESOURCES_ROW2 = [
  { label: 'Events & Webinars', href: '/webinars', desc: 'Live workshops + Q&A', icon: 'events', comingSoon: true },
  { label: 'Blog', href: '/blog', desc: 'Marketing news & tips', icon: 'blog', comingSoon: false },
  { label: 'Affiliate Program', href: '/affiliates', desc: 'Earn 20% recurring commission', icon: 'affiliate', comingSoon: true },
] as const;
