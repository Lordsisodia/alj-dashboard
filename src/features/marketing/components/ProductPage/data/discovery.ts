import type { ProductPageData } from '../types';
import { CDN, ASSETS } from '@/lib/cdn';

export const discoveryData: ProductPageData = {
  slug: 'discovery',
  hero: {
    subtitle: 'Intelligence',
    headline: 'Know what goes viral before your competitors post it',
    paragraph: "ISSO scrapes thousands of top-performing reels across your niche, scores them, and surfaces the patterns — so you're always posting on the wave, never chasing it.",
    ctaHref: 'https://siso.ai/sign-up',
    animatedIconVideoSrc: `${ASSETS}/animated-icon-discovery.webm`,
    staticIconSrc: `${CDN}/682f9f722b39359a238b0ff9_pi-discovery-hq.webp`,
    heroVideoSrc: `${CDN}%2F68338a8a2fcb274d77daaec1_product-video-discovery-transcode.mp4`,
    heroVideoPoster: `${CDN}%2F68338a8a2fcb274d77daaec1_product-video-discovery-poster-00001.jpg`,
    mockupSrc: `${CDN}/6820c07c2e5b8c350c8e1f4c_hero-empty-mockup.webp`,
  },
  beforeAfter: {
    sectionTitle: 'You need a real-time trend engine for your content pipeline',
    sectionParagraph: 'Stop guessing what to post. Access a live feed of top-performing reels scored by engagement — filtered for your niche, updated daily.',
    before: {
      label: 'Before ...',
      description: 'Scrolling for hours, copying trends that already peaked.',
      imageSrc: `${CDN}/682e02bbeb2b8d4676c51bcb_before-discovery.webp`,
    },
    after: {
      label: 'After ISSO',
      description: 'Instant access to what\'s working in your niche right now.',
      imageSrc: `${CDN}/682e02bb2bfe3aa652c28c43_after-discovery.webp`,
    },
  },
  useCases: {
    subtitle: 'Use Cases',
    title: 'Find what\'s working before everyone else does',
    paragraph: "Stop posting blind. Intelligence analyzes thousands of reels across your niche so you can build a content pipeline around what actually drives growth — before the format saturates.",
    items: [
      {
        title: 'Catch trends before they peak',
        description: 'Get a live feed of reels gaining momentum in your niche. ISSO scores engagement velocity so you move first, not last.',
        imageSrc: `${CDN}/6452b20ee4031bfa414e9376_stay-on-trends.webp`,
      },
      {
        title: 'Map competitor content strategies',
        description: 'Search by niche or creator type to uncover what top accounts are posting. Know their angles before your models go live.',
        imageSrc: `${CDN}/6452b20e1faec53688be8c5e_secret%20competitors.webp`,
      },
      {
        title: 'Reel performance history',
        description: 'Every reel ISSO tracks is stored. Go back and see what formats dominated your niche 3, 6, or 12 months ago — and what\'s coming back around.',
        imageSrc: `${CDN}/6452b2233aadbc8e5dddb5dd_ad-screative-time-machine.webp`,
      },
      {
        title: 'Build your competitor watchlist',
        description: 'Track the top-performing agencies and models in your niche. See their posting cadence, format mix, and what reels are pulling the most reach.',
        imageSrc: `${CDN}/6452b4e5b9602e476d8dbf96_competitor-hitlist.webp`,
      },
    ],
  },
  coreFeatures: {
    subtitle: 'Core Features',
    title: 'Stop Posting Into the Void',
    paragraph: 'How much time are you wasting scrolling for content ideas? Intelligence gives your team a daily feed of proven reels — scored, filtered by niche, ready to brief your models.',
    tabs: [
      {
        label: 'AI Trend Search',
        svgContent: `<svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><circle cx="11" cy="11" r="7" stroke="white" stroke-width="1.66667"/><path d="M16.5 16.5L21 21" stroke="white" stroke-width="1.66667" stroke-linecap="round"/><path d="M11.5 8.5C11.5 9.32843 10.8284 10 10 10C9.17157 10 8.5 9.32843 8.5 8.5C8.5 7.67157 9.17157 7 10 7C10.8284 7 11.5 7.67157 11.5 8.5Z" stroke="white" stroke-width="1.66667"/></svg>`,
        imageSrc: `${CDN}/682e02bb5956e6397077a270_after-briefs.webp`,
      },
      {
        label: 'Reel History',
        svgContent: `<svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><circle cx="12" cy="12" r="9" stroke="white" stroke-width="1.66667"/><path d="M12 7V12L15 15" stroke="white" stroke-width="1.66667" stroke-linecap="round"/></svg>`,
        imageSrc: `${CDN}/682e02bb5956e6397077a270_after-briefs.webp`,
      },
      {
        label: 'Niche Analysis',
        svgContent: `<svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><circle cx="12" cy="8" r="4" stroke="white" stroke-width="1.66667"/><path d="M6 20C6 16.6863 8.68629 14 12 14C15.3137 14 18 16.6863 18 20" stroke="white" stroke-width="1.66667" stroke-linecap="round"/></svg>`,
        imageSrc: `${CDN}/682e02bb5956e6397077a270_after-briefs.webp`,
      },
    ],
  },
  smartFeatures: {
    subtitle: 'All Features',
    title: 'The trend engine behind your content pipeline',
    paragraph: "Manual scrolling and gut-feel posting isn't a strategy. Built for managers and agencies running multiple models, ISSO Intelligence gives you structured data on what's actually working in your niche.",
    row1: [
      {
        imageSrc: `${CDN}/6452c3588f595986621e7e7f_ai-search.webp`,
        title: 'AI Trend Search',
        description: 'Search by niche, format, or creator type to surface high-performing reel patterns instantly.',
      },
      {
        imageSrc: `${CDN}/6452c358f3df0561dcd05aaf_discovery-filtering.webp`,
        title: 'Filter by Niche & Format',
        description: 'Drill into specific content categories to find what formats and hooks are outperforming in your space.',
      },
      {
        imageSrc: `${CDN}/6452c359d7107e537d664c3e_filter-by-platform.webp`,
        title: 'Filter by Platform',
        description: 'Analyse reel performance across Instagram, TikTok, and more — separately or combined.',
      },
      {
        imageSrc: `${CDN}/6452c3582ce631b474f7a429_Discovery-Real-Time%20Activity.webp`,
        title: 'Engagement Velocity Score',
        description: 'See how fast a reel is gaining traction to identify trends before they hit peak saturation.',
      },
      {
        imageSrc: `${CDN}/6452c6577004376045ccff74_Landing%20Page%20Screenshot.webp`,
        title: 'Creator & Account Metadata',
        description: 'See the account behind every top reel — follower count, posting cadence, niche, and engagement rate.',
      },
      {
        imageSrc: `${CDN}/6452c64a23cd3d10d788aff5_sort-by-longest-running.webp`,
        title: 'Sort by Top Performers',
        description: 'Quickly surface the highest-engagement reels in any niche by sorting on reach, saves, or comments.',
      },
    ],
    testimonial1: {
      logoSrc: `${CDN}/6478c259d089e1fcfd9fe514_9d81a1_1c7f11b03b5b4dd990abe5c8426f16cd~mv2.webp`,
      logoAlt: 'Agency logo',
      quote: '"ISSO Intelligence changed how we brief our models. We stopped guessing and started pulling from what\'s actually going viral in our niches. Our content pipeline is tighter, faster, and hitting harder."',
      authorName: 'Marcus Reid',
      authorTitle: 'Head of Content @ Apex Model Agency',
      authorHeadshot: `${CDN}/6478c25916a783229ba8d802_Jess-Fire%20Team.webp`,
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
    headline: 'Start posting on the wave, not after it',
    paragraph: "Intelligence comes with ISSO's full suite of tools for content pipeline management, trend tracking, competitor analysis, and reel sourcing.\n\nEverything your agency needs in one place.",
    primaryCtaText: 'Start',
    primaryCtaHref: 'https://siso.ai/sign-up',
    showNoCcBadge: true,
    videoSrc: `${ASSETS}/cta-discovery.mov`,
    iconSrc: `${CDN}/682f93b42567b6ff190373b9_iso-discovery.webp`,
  },
  faq: {
    sectionTitle: 'Questions about Intelligence?',
    sectionParagraph: 'The most common questions about finding viral trends and analysing what works with ISSO Intelligence.',
    items: [
      {
        question: 'How does Intelligence fit into my content pipeline?',
        answer: "Intelligence sits at the front of your pipeline — research and trend detection. Once you know what formats are working, you brief your models through Hub, source reels via Recon, and generate new content with Content Gen. Intelligence is the signal that drives everything downstream.",
      },
      {
        question: 'How do I find top-performing reels in my niche?',
        answer: 'Search by niche keyword or creator type, then sort by engagement velocity or total reach. You can filter by platform, format, and time window to zero in on what\'s working right now versus what peaked months ago.',
      },
      {
        question: 'Do you track competitor accounts automatically?',
        answer: 'Competitor account tracking is handled by Recon — our 24/7 automated scraping feature. Intelligence surfaces broader trend patterns across your niche, while Recon keeps a constant watch on the specific accounts you care about.',
      },
      {
        question: "Can I see what top creators in my niche are posting?",
        answer: "Yes. Search by niche or category and ISSO surfaces the top-performing creators and their reels. You can drill into any account to see their posting cadence, format mix, and which specific reels are driving the most engagement.",
      },
      {
        question: 'How is ISSO Intelligence different from just scrolling Instagram?',
        answer: 'Scrolling shows you what the algorithm serves you — not what\'s actually performing. Intelligence pulls from thousands of reels across your niche, scores them by real engagement data, and ranks them so you see the signal without the noise. No guessing, no hours lost.',
      },
      {
        question: 'How far back does the reel history go?',
        answer: "Every reel ISSO has tracked is stored and searchable. You can look back across any time window to see which formats dominated your niche historically — useful for spotting cyclical trends and what's likely to resurface.",
      },
      {
        question: 'How often is the Intelligence feed updated?',
        answer: 'The trend feed updates daily. New reels are scraped, scored, and surfaced automatically — so your team always has fresh data without any manual work.',
      },
      {
        question: 'How do I know if a reel format is worth replicating?',
        answer: "Look at the engagement velocity score — how fast a reel gained traction in its first 48 hours. Combine that with reach and save rate to gauge whether a format has lasting pull or was a one-off spike. High velocity plus strong saves is the clearest signal.",
      },
    ],
  },
  bottomCta: {
    headline: 'Start finding what goes viral',
    paragraph: 'Give your content pipeline a real edge. Start with ISSO Intelligence and know what works before you post.',
    primaryCtaText: 'Start',
    primaryCtaHref: 'https://siso.ai/sign-up',
    secondaryCtaText: 'View Pricing',
    secondaryCtaHref: '/pricing',
  },
};
