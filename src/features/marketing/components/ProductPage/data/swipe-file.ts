import type { ProductPageData } from '../types';
import { CDN, ASSETS } from '@/lib/cdn';

export const swipeFileData: ProductPageData = {
  slug: 'hub',
  hero: {
    subtitle: 'Hub',
    headline: 'Your data layer. Reels, approvals, analytics in one place.',
    paragraph: 'Stop chasing approvals over Telegram and managing reels across spreadsheets. ISSO Hub gives models, managers, and agencies one central place to browse, approve, and track content.',
    ctaHref: 'https://app.isso.io/sign-up',
    animatedIconVideoSrc: `${ASSETS}/animated-icon-swipefile.webm`,
    staticIconSrc: `${CDN}/682f9f72df2782e8df1d1114_pi-swipefile-hq.webp`,
    heroVideoSrc: `${ASSETS}/!SwipeFile-2025_high.webm`,
    heroVideoPoster: `${CDN}%2F68338a6524e01d2ff9f48747_product-video-swipefile-poster-00001.jpg`,
    mockupSrc: `${CDN}/6820c07c2e5b8c350c8e1f4c_hero-empty-mockup.webp`,
  },
  beforeAfter: {
    sectionTitle: 'Why does your agency need Hub?',
    sectionParagraph: 'Top OFM agencies already track reels, approvals, and analytics — just manually, across five different tools. Hub replaces all of it with one clean dashboard your whole team can use.',
    before: {
      label: 'Before ...',
      description: 'Telegram threads, Airtable rows, and scattered DMs to models.',
      imageSrc: `${CDN}/682dfe3a46d48842bb8f17db_before-swipefile.webp`,
    },
    after: {
      label: 'After ISSO',
      description: 'Browse reels, send approvals, and track performance — all in Hub.',
      imageSrc: `${CDN}/682dfe3a5956e63970743aa1_after-swipefile.webp`,
    },
  },
  useCases: {
    subtitle: 'Use Cases',
    title: 'Built for every role in your agency',
    paragraph: 'Hub serves three audiences simultaneously — models browsing inspiration, managers running approvals, and agency owners tracking performance — all from one dashboard.',
    items: [
      {
        title: 'Models: Browse & Swipe',
        description: 'Models swipe through high-performing reels curated by ISSO. Like what works, skip what doesn\'t. Save inspiration for your next shoot in seconds.',
        imageSrc: `${CDN}/6446c0b1c2f78eaae4163bb9_competitor%20research.webp`,
      },
      {
        title: 'Managers: Approve & Assign',
        description: 'See exactly what your models have liked. Approve reels, push them directly to specific models, and replace your Airtable workflow without changing how your team operates.',
        imageSrc: `${CDN}/6446c0b1c2f78eaae4163bb9_competitor%20research.webp`,
      },
      {
        title: 'Agencies: Track & Improve',
        description: 'Every swipe, approval, and content interaction feeds your analytics. See what\'s working across all models and accounts. The data that makes your content pipeline smarter over time.',
        imageSrc: `${CDN}/6446c0b1c2f78eaae4163bb9_competitor%20research.webp`,
      },
    ],
  },
  coreFeatures: {
    subtitle: 'Core Features',
    title: 'How Hub fits into your content pipeline',
    paragraph: 'Hub connects directly to ISSO\'s scraped reels database — 100K+ reels from top-performing accounts in your niche. Models swipe, managers approve, and every action updates the pipeline automatically.',
    tabs: [
      {
        label: 'Swipe Reel Inspiration',
        svgContent: `<svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M11.5 14.0834V3.66675M11.5 14.0834L8.58334 11.1667M11.5 14.0834L14.4167 11.1667" stroke="white" stroke-width="1.66667" stroke-linecap="round" stroke-linejoin="round"/><path d="M15.6667 6.16675H16.5C17.4205 6.16675 18.1667 6.91294 18.1667 7.83341V17.0001C18.1667 17.9206 17.4205 18.6667 16.5 18.6667H6.50001C5.57954 18.6667 4.83334 17.9206 4.83334 17.0001V7.83341C4.83334 6.91294 5.57954 6.16675 6.50001 6.16675H7.33334" stroke="white" stroke-width="1.66667" stroke-linecap="round" stroke-linejoin="round"/></svg>`,
        imageSrc: `${CDN}/646fac024fc1759bfea42a8f_Swipe-File-Tab-1.webp`,
      },
      {
        label: 'Approve & Assign',
        svgContent: `<svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M14.4166 5.74992L12.75 7.41659L14.4166 9.08325M13.5833 7.41659H16.5C17.4205 7.41659 18.1666 8.16278 18.1666 9.08325V14.9166C18.1666 15.8371 17.4205 16.5833 16.5 16.5833H13.1666M8.99998 7.41659C8.99998 8.56718 8.06724 9.49992 6.91665 9.49992C5.76605 9.49992 4.83331 8.56718 4.83331 7.41659C4.83331 6.26599 5.76605 5.33325 6.91665 5.33325C8.06724 5.33325 8.99998 6.26599 8.99998 7.41659ZM8.99998 16.5833C8.99998 17.7338 8.06724 18.6666 6.91665 18.6666C5.76605 18.6666 4.83331 17.7338 4.83331 16.5833C4.83331 15.4327 5.76605 14.4999 6.91665 14.4999C8.06724 14.4999 8.99998 15.4327 8.99998 16.5833Z" stroke="white" stroke-width="1.66667" stroke-linecap="round" stroke-linejoin="round"/></svg>`,
        imageSrc: `${CDN}/646faff298f84dcd14fd6715_Swipe-File-Tab-2.webp`,
      },
      {
        label: 'Track Performance',
        svgContent: `<svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M9.22046 13.1499L13.9461 15.8503" stroke="white" stroke-width="1.66667"/><path d="M9.5 12C9.5 12.4146 9.39908 12.8056 9.22048 13.1498C8.80427 13.952 7.96613 14.5 7 14.5C5.61929 14.5 4.5 13.3807 4.5 12C4.5 10.6192 5.61929 9.5 7 9.5C7.96613 9.5 8.80427 10.048 9.22048 10.8502C9.39908 11.1944 9.5 11.5854 9.5 12Z" stroke="white" stroke-width="1.66667"/><path d="M18.6667 7C18.6667 8.38071 17.5474 9.5 16.1667 9.5C15.2005 9.5 14.3624 8.95196 13.9462 8.1498C13.7676 7.80558 13.6667 7.41457 13.6667 7C13.6667 5.61929 14.7859 4.5 16.1667 4.5C17.5474 4.5 18.6667 5.61929 18.6667 7Z" stroke="white" stroke-width="1.66667"/><path d="M18.6667 17C18.6667 18.3807 17.5474 19.5 16.1667 19.5C14.7859 19.5 13.6667 18.3807 13.6667 17C13.6667 16.5854 13.7676 16.1944 13.9462 15.8502C14.3624 15.048 15.2005 14.5 16.1667 14.5C17.5474 14.5 18.6667 15.6192 18.6667 17Z" stroke="white" stroke-width="1.66667"/><path d="M13.9461 8.1499L9.22046 10.8503" stroke="white" stroke-width="1.66667"/></svg>`,
        imageSrc: `${CDN}/646faff31a3bf4f6ae060124_Swipe-File-Tab-3.webp`,
      },
    ],
  },
  smartFeatures: {
    subtitle: 'All Features',
    title: 'Everything your content pipeline needs',
    paragraph: "Better than an Airtable sheet and a Telegram group combined. Hub is purpose-built for OFM agencies and model managers to run their content operation without the chaos.",
    row1: [
      {
        imageSrc: `${CDN}/64419c26788e98000d82fa26_No%20Expired%20Links.webp`,
        title: 'Always-Fresh Reel Library',
        description: 'ISSO scrapes and refreshes the reel database continuously. Your models never run out of new inspiration.',
      },
      {
        imageSrc: `${CDN}/64419c27702cee383050839c_Save%20All%20Ad%20Types.webp`,
        title: 'All Content Formats',
        description: 'Short-form reels, clips, and video content across every format your models actually create.',
      },
      {
        imageSrc: `${CDN}/64419c26ac48d69350ba5968_Ad%20Metadata.webp`,
        title: 'Reel Performance Data',
        description: 'Every reel in Hub comes with engagement data. Models know what performs before they even start filming.',
      },
      {
        imageSrc: `${CDN}/6441d838bbed821cfc43c56c_Custom%20Tags.webp`,
        title: 'Custom Tags & Filters',
        description: 'Tag reels by niche, style, or model. Filter to exactly what each creator needs for their next shoot.',
      },
      {
        imageSrc: `${CDN}/64419c26aa612008aab9e28e_Filtering.webp`,
        title: 'Filter by Niche & Style',
        description: "Never send irrelevant reels to your models. Filter Hub by niche, format, and dozens of content signals.",
      },
      {
        imageSrc: `${CDN}/64418894857cf21aa6e1b607_Share%20with%20Anyone.webp`,
        title: 'Share Directly to Models',
        description: 'Push approved reels to specific models with one click. No forwarding, no Airtable rows, no confusion.',
      },
    ],
    testimonial1: {
      logoSrc: `${CDN}/6478be2ffe695cac2f9d4a34_290-2904512_awe-logo-gold-affiliate-world-conferences-logo.webp`,
      logoAlt: 'Affiliate World logo',
      quote: '"Hub is now the first thing my models open every morning. The swipe interface is exactly right — fast, visual, no friction. Our content ideation process went from 2 hours of back-and-forth to 15 minutes."',
      authorName: 'Matthew Williams',
      authorTitle: 'Agency Director @ iStack',
      authorHeadshot: `${CDN}/6478bd8550054135284b7d7f_matt-williams.webp`,
    },
    row2: [
      {
        imageSrc: `${CDN}/644186758b63b0137bd005d0_Real-Time%20Activity-5.png`,
        title: 'Real-Time Approval Status',
        description: 'See which reels your managers have approved and which models have received them — live.',
      },
      {
        imageSrc: `${CDN}/6441d1e93e756110132e66ad_Team%20Commenting.webp`,
        title: 'Manager Notes',
        description: 'Leave direction on specific reels. Models see your notes before they shoot, not after.',
      },
      {
        imageSrc: `${CDN}/6441d1f1d8e29bb7aec06775_Embed%20in%20Notion.webp`,
        title: 'Airtable Integration',
        description: 'Already running approvals in Airtable? Hub syncs with it. Switch at your own pace.',
      },
      {
        imageSrc: `${CDN}/6441d6459aadc0c4b1ee27eb_Landing%20Page%20Screenshot.webp`,
        title: 'Telegram Approvals',
        description: 'Managers can approve reels directly from Telegram. No app switch needed when you\'re on the go.',
      },
      {
        imageSrc: `${CDN}/6441d645f6f0ee84bb0f170a_Ai%20Search.webp`,
        title: 'AI Search & Filter',
        description: 'Search the full reel library using natural language. Find "high-energy fitness clips under 30s" in seconds.',
      },
      {
        imageSrc: `${CDN}/681b6844dfcf6665c1fd25e8_embed-in-website.webp`,
        title: 'Data Flywheel',
        description: 'Every like, skip, and approval trains the content pipeline. More usage means smarter reel recommendations over time.',
      },
    ],
    testimonial2: {
      logoSrc: `${CDN}/62ab5053126567f2d1045a12_61867ad4caa11f2834eb5799_loop%20club%20logo-1.jpg`,
      logoAlt: 'Loop logo',
      quote: '"ISSO replaced the Airtable spreadsheet we were manually maintaining for reel approvals. Hub gives our managers visibility into what every model is working from, and the pipeline keeps improving on its own."',
      authorName: 'Tim Keen',
      authorTitle: 'Founder / CEO @ Loop.club',
      authorHeadshot: `${CDN}/62ab50d7b920aacfc304ae19_pqt5NNy9_400x400.webp`,
    },
  },
  embeddedCta: {
    headline: 'Start running Hub today',
    paragraph: "Hub comes with ISSO's full content pipeline — reel scraping, approval workflows, analytics, and AI content generation.\n\nEverything your agency needs in one place.",
    primaryCtaText: 'Start',
    primaryCtaHref: 'https://app.isso.io/sign-up',
    showNoCcBadge: true,
    videoSrc: `${ASSETS}/cta-hub.mov`,
    iconSrc: `${CDN}/682f93b40d86b433e8039cc9_iso-swipefile.webp`,
  },
  faq: {
    sectionTitle: 'Questions about Hub?',
    sectionParagraph: 'Common questions from agencies and managers getting started with Hub.',
    items: [
      {
        question: 'Can I share approved reels directly with my models?',
        answer: "Yes. Managers can push approved reels to specific models with one click. Models receive them inside Hub and can also get notified via Telegram. No forwarding links manually — Hub handles the handoff.",
      },
      {
        question: 'Does Hub replace our current Airtable approval workflow?',
        answer: "Hub is designed to replace manual Airtable workflows — but it also integrates with Airtable if you want to transition gradually. Most agencies switch fully within the first month because Hub handles approvals, tracking, and analytics in one place.",
      },
      {
        question: 'Where do the reels in Hub come from?',
        answer: "ISSO's Recon tool scrapes 100K–1M reels from top-performing accounts in your niche on a continuous basis. We curate a set of high performers for Hub. The library refreshes automatically so your models always have fresh inspiration.",
      },
      {
        question: 'How does the swipe interface work for models?',
        answer: "It's a Tinder-style UX. Models swipe right on reels they like and want to use as inspiration, and swipe left to skip. Their saved reels are visible to their manager, who can then approve and add direction before the shoot.",
      },
      {
        question: 'Can managers approve reels without opening the app?',
        answer: "Yes. ISSO supports Telegram-based approvals for managers who prefer to work on mobile. Approval notifications come through Telegram and managers can approve directly from the chat — no separate app needed.",
      },
      {
        question: 'How does Hub feed the content generation pipeline?',
        answer: "Every swipe and approval in Hub is labeled training data. Likes, skips, and manager approvals tell the AI what your agency\'s models respond to. This data feeds Content Gen, making each new batch of AI-generated reels more on-target than the last.",
      },
      {
        question: 'What is Hub exactly?',
        answer: "Hub is ISSO's central dashboard for the content pipeline. It's where models browse reel inspiration, managers run approvals, and agencies track performance data — all in one place. Think of it as the command center your Airtable sheet was trying to be.",
      },
      {
        question: 'What other ISSO tools does Hub connect to?',
        answer: "Hub connects to Intelligence (trend analysis and reel scoring), Recon (competitor scraping), and Content Gen (AI video generation). The data flows automatically — you don't need to export or import anything between tools.",
      },
    ],
  },
  bottomCta: {
    headline: 'Ready to run a smarter content pipeline?',
    paragraph: 'Start with Hub. Connect Intelligence, Recon, and Content Gen when you\'re ready.',
    primaryCtaText: 'Start',
    primaryCtaHref: 'https://app.isso.io/sign-up',
    secondaryCtaText: 'View Pricing',
    secondaryCtaHref: '/pricing',
  },
};
