import type { ProductPageData } from '../types';
import { CDN, ASSETS } from '@/lib/cdn';

export const spyderData: ProductPageData = {
  slug: 'spyder',
  hero: {
    subtitle: 'Recon - 24/7 Competitor Tracker',
    headline: 'Know What Every Competitor Is Posting Before Your Team Wakes Up',
    paragraph: 'Recon scrapes every reel, hook, and content test your competitors publish - automatically, around the clock. No manual checking. No missed moves.',
    ctaHref: 'https://siso.ai/sign-up',
    animatedIconVideoSrc: `${ASSETS}/animated-icon-spyder.webm`,
    staticIconSrc: `${CDN}/682f9f72ef4d27826a8d2aa0_pi-spyder-hq.webp`,
    heroVideoSrc: `${CDN}%2F68338b3e839a771394bbc430_product-video-spyder-transcode.mp4`,
    heroVideoPoster: `${CDN}%2F68338b3e839a771394bbc430_product-video-spyder-poster-00001.jpg`,
    mockupSrc: `${CDN}/6820c07c2e5b8c350c8e1f4c_hero-empty-mockup.webp`,
  },
  beforeAfter: {
    sectionTitle: 'Stop guessing what your competitors are doing',
    sectionParagraph: 'Most agencies manually browse profiles and take notes. Recon replaces that entirely - automated scraping, scored content, actionable reports.',
    before: {
      label: 'Before Recon',
      description: 'Manually checking competitor profiles, missing new posts, no record of what they tested.',
      imageSrc: `${CDN}/682e02bbc356a16526b39201_before-spyder.webp`,
    },
    after: {
      label: 'After Recon',
      description: 'Every competitor reel logged, scored, and surfaced - delivered to your dashboard before the morning call.',
      imageSrc: `${CDN}/682e02bbb206d4bd3ae644fe_after-spyder.webp`,
    },
  },
  useCases: {
    subtitle: 'Use Cases',
    title: 'Intelligence that runs while you sleep',
    paragraph: 'Recon handles the tracking. You handle the strategy. Every insight is waiting in your dashboard when you need it.',
    items: [
      {
        title: '24/7 Competitor Scraping',
        description: 'Recon monitors every account you track around the clock - new reels, format changes, posting cadence. Nothing slips through.',
        imageSrc: `${CDN}/6679734bf7cb3c37f5ebdf64_24-7-scraper.webp`,
      },
      {
        title: 'Automated Intelligence Reports',
        description: 'Weekly and daily reports generated automatically - what your competitors posted, what performed, what hooks they tested. Sent to your inbox without lifting a finger.',
        imageSrc: `${CDN}/667b034872fc6e86638d70fc_share-report-2.webp`,
      },
      {
        title: 'Surface Winning Hooks',
        description: "Recon scores every piece of content and flags the hooks that are gaining traction. Know what's working in your niche before you brief your creators.",
        imageSrc: `${CDN}/6679734b836c41d2742ab24b_identify-hooks.webp`,
      },
    ],
  },
  coreFeatures: {
    subtitle: 'Core Features',
    title: 'Full visibility into your competitor\'s content pipeline',
    paragraph: "Recon maps every account you track - posting frequency, format mix, hook patterns, and what's gaining engagement. Built for managers and agencies who need signal, not noise.",
    tabs: [
      {
        label: 'Real-Time Tracking',
        svgContent: `<svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><circle cx="12" cy="12" r="9" stroke="white" stroke-width="1.66667"/><circle cx="12" cy="12" r="5" stroke="white" stroke-width="1.66667"/><circle cx="12" cy="12" r="1.5" fill="white"/></svg>`,
        imageSrc: `${CDN}/682e02bbb206d4bd3ae644fe_after-spyder.webp`,
      },
      {
        label: 'Content Tests',
        svgContent: `<svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M11 4H4C3.44772 4 3 4.44772 3 5V20C3 20.5523 3.44772 21 4 21H20C20.5523 21 21 20.5523 21 20V13M18.5 2.5C19.3284 1.67157 20.6716 1.67157 21.5 2.5C22.3284 3.32843 22.3284 4.67157 21.5 5.5L12 15L8 16L9 12L18.5 2.5Z" stroke="white" stroke-width="1.66667" stroke-linecap="round" stroke-linejoin="round"/></svg>`,
        imageSrc: `${CDN}/682e02bbb206d4bd3ae644fe_after-spyder.webp`,
      },
      {
        label: 'Intelligence Reports',
        svgContent: `<svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><rect x="3" y="4" width="18" height="16" rx="2" stroke="white" stroke-width="1.66667"/><path d="M3 9H21" stroke="white" stroke-width="1.66667"/><path d="M8 14H11M8 17H14" stroke="white" stroke-width="1.66667" stroke-linecap="round"/></svg>`,
        imageSrc: `${CDN}/682e02bbb206d4bd3ae644fe_after-spyder.webp`,
      },
    ],
  },
  smartFeatures: {
    subtitle: 'All Features',
    title: 'Everything Recon tracks for you',
    paragraph: "No add-ons or feature gating. Every Recon capability is included - competitor scraping, hook analysis, automated reports, and real-time alerts.",
    row1: [
      {
        imageSrc: `${CDN}/6822010b1db333a3279d12f0_realtime-status.webp`,
        title: 'Live Account Status',
        description: 'See posting volume, format breakdown, and cadence shifts for every tracked creator in real time.',
      },
      {
        imageSrc: `${CDN}/682250526cf05f1944daa3f3_creative-tests.webp`,
        title: 'Track Content Tests',
        description: 'Group and follow reels launched in the same test window - see which hooks and formats a competitor is pushing.',
      },
      {
        imageSrc: `${CDN}/68220b448aa4cb6939da0c95_landing-page.webp`,
        title: 'Hook Pattern Analysis',
        description: 'Identify the opening lines and visual formats getting the most traction across competing accounts.',
      },
      {
        imageSrc: `${CDN}/6823a697a0c46d8ee3c03b18_historical-data.webp`,
        title: 'Full Content History',
        description: 'Every reel ever posted by a tracked creator - archived from day one. Never lose historical context.',
      },
      {
        imageSrc: `${CDN}/68220b4429bdc7d30078e6b7_share-reports.webp`,
        title: 'Share Intelligence Reports',
        description: 'Generate a competitor snapshot and send it to your team or clients in one click - no manual compiling.',
      },
      {
        imageSrc: `${CDN}/68220b44c6a9b4d97676ea73_notifications.webp`,
        title: 'Slack & Email Alerts',
        description: 'Get notified the moment a tracked account posts. Your team stays current without checking manually.',
      },
    ],
    testimonial1: {
      logoSrc: `${CDN}/6679ef83dd47e5000aa10cd5_Wiza.svg`,
      logoAlt: 'Agency logo',
      quote: '"We manage 12 models across three niches. Recon tells us what top creators in each niche are testing every week - our content team uses that directly to brief the next batch of reels. Saves us 10+ hours a week of manual research."',
      authorName: 'Agency Manager',
      authorTitle: 'OFM Agency, 12 Models',
      authorHeadshot: `${CDN}/6679ebddfad13bb59b5a8f25_TS2G1MWKZ-US2G1MXHD-eb1db3a0ea43-192.png`,
    },
    row2: [],
    testimonial2: {
      logoSrc: '',
      logoAlt: '',
      quote: '',
      authorName: '',
      authorTitle: '',
      authorHeadshot: '',
    },
  },
  embeddedCta: {
    headline: 'Start tracking competitors today',
    paragraph: "Recon is included in ISSO's full suite - alongside Intelligence, Hub, Content Gen, and Agents.",
    primaryCtaText: 'Start',
    primaryCtaHref: 'https://siso.ai/sign-up',
    showNoCcBadge: true,
    videoSrc: `${ASSETS}/cta-spyder.mov`,
    iconSrc: `${CDN}/682f93b469081ade4aadbbad_iso-spyder.webp`,
  },
  faq: {
    sectionTitle: 'Questions about Recon?',
    sectionParagraph: 'Common questions about Recon, competitor tracking, and how it fits into your content pipeline.',
    items: [
      {
        question: 'What is Recon?',
        answer: "Recon is ISSO's 24/7 competitor tracking engine. It automatically scrapes every reel, hook, and content test published by the creator accounts you track - then delivers scored intelligence reports to your dashboard. No manual checking, no missed posts.",
      },
      {
        question: 'Which platforms does Recon scrape?',
        answer: 'Recon focuses on the platforms that matter for model management and OFM agencies - Instagram Reels and TikTok. New platform support is added as the content pipeline expands.',
      },
      {
        question: 'How often does Recon check for new content?',
        answer: 'Recon runs continuously around the clock. When a tracked account posts a new reel, it gets scraped, scored, and added to your dashboard within hours - not days. You can also set Slack or email alerts to be notified the moment something goes live.',
      },
      {
        question: 'How does Recon know what content is performing?',
        answer: "Recon scores every reel it scrapes using engagement signals and trend velocity. High-scoring content gets surfaced automatically - your team sees the winners without manually reviewing hundreds of posts.",
      },
      {
        question: 'How long is competitor data kept?',
        answer: "Recon archives every reel from the moment you start tracking - indefinitely. You build a permanent intelligence layer on every competitor account, not just a rolling 30-day window. That history is useful for spotting cyclical trends.",
      },
      {
        question: 'How many competitor accounts can I track?',
        answer: "Every plan includes a set number of tracked accounts. Additional accounts can be added on any plan - see the pricing page for current limits.",
      },
      {
        question: 'Do I need to set anything up for Recon to keep running?',
        answer: 'No. Once you add an account to track, Recon runs automatically - scraping new content, scoring it, and updating your dashboard. There is nothing to maintain.',
      },
      {
        question: 'How is Recon different from Intelligence?',
        answer: 'Recon watches specific accounts you tell it to track - it gives you a precise, continuous record of what your named competitors are posting. Intelligence is broader - it surfaces trending patterns and top-performing reels across your whole niche, not just the accounts you follow. Most agencies use both together.',
      },
    ],
  },
  bottomCta: {
    headline: 'Start tracking competitors today',
    paragraph: "Recon is included in ISSO's full suite - alongside Intelligence, Hub, Content Gen, and Agents.",
    primaryCtaText: 'Start',
    primaryCtaHref: 'https://siso.ai/sign-up',
    secondaryCtaText: 'No credit card required',
    secondaryCtaHref: '',
  },
};
