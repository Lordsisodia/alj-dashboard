// Webinars page data — extracted from www_foreplay_co (20).html

import { CDN, CDN2 } from '@/lib/cdn';

export interface WebinarReplay {
  title: string;
  href: string;
  authorName: string;
  authorHeadshot: string;
  date: string;
  thumbnail: string;
}

export interface WebinarsPageData {
  hero: {
    logoSrc: string;
    logoAlt: string;
    headline: string;
    paragraph: string;
    ctaText: string;
    ctaHref: string;
  };
  whyAttend: {
    title: string;
    paragraph: string;
    cards: {
      icon: string;
      title: string;
      imageSrc: string;
      imageAlt: string;
      body: string;
    }[];
  };
  bottomCta: {
    headline: string;
    paragraph: string;
    primaryCtaText: string;
    primaryCtaHref: string;
    secondaryCtaText: string;
    secondaryCtaHref: string;
    imageSrc: string;
    imageAlt: string;
  };
  speakerCta: {
    headline: string;
    paragraph: string;
    ctaText: string;
    ctaHref: string;
  };
}

export const webinarsReplays: WebinarReplay[] = [
  {
    title: 'Last-Minute Black Friday Email Setup: How to Pull $100K/Day Without a Plan',
    href: '/events/last-minute-black-friday-email-setup-how-to-pull-100k-day-without-a-plan',
    authorName: 'Conor Sunderland',
    authorHeadshot:
      `${CDN2}/6900e464536b07367c24a9ec_Conor-Sunderland-1.webp`,
    date: 'November 5, 2025',
    thumbnail:
      `${CDN2}/6900e5dcfb1b40140db4dee5_Conor%20-Thumbnail.png`,
  },
  {
    title: 'Black Friday Landing Page Audit',
    href: '/events/black-friday-landing-pages',
    authorName: 'Matthew Attalah',
    authorHeadshot:
      `${CDN2}/68ee636e6a0497e26f739eca_64c2120c18d503a72d92093e_CleanShot%202023-07-17%20at%2013.02%201.png`,
    date: 'October 16, 2025',
    thumbnail:
      `${CDN2}/68ee6e71741cd6f949cd2556_Matthew%20-Thumbnail%20(1).png`,
  },
  {
    title: 'Marketing Sprints That Scale New Customers',
    href: '/events/marketing-sprints-that-scale-new-customers',
    authorName: 'Hal Smith',
    authorHeadshot:
      `${CDN2}/68a603b34a01a630ebc27670_T010Z93HZFS-U01115M4EDU-d43b5ce15f8e-512.png`,
    date: 'August 27, 2025',
    thumbnail:
      `${CDN2}/68a6052daf20c8147a8740d9_Hal%20-Thumbnail.png`,
  },
  {
    title: 'The Group Chat: Becoming an AI Creative Strategist',
    href: '/events/the-group-chat-becoming-an-ai-creative-strategist',
    authorName: 'Zachary Murray',
    authorHeadshot:
      `${CDN2}/64766a422ca53ffc07495f5a_zach.webp`,
    date: 'August 12, 2025',
    thumbnail:
      `${CDN2}/6894d70ee98dee7db50a2b22_AI%20Chat%20-Thumbnail.png`,
  },
  {
    title: 'How to stand out with new ad creative concepts',
    href: '/events/how-to-stand-out-with-new-ad-creative-concepts',
    authorName: 'Ben Dyer',
    authorHeadshot:
      `${CDN2}/687fdb760afaa5c56635a2a3_THV16KSGP-U05J22RKBGD-a5e1e91c871c-512.jpeg`,
    date: '',
    thumbnail:
      `${CDN2}/6883c363b3cca0bf79dcc0d7_Ben%20Webtopia.png`,
  },
  {
    title: 'Stopping the Scroll with Alternative Ad Styles',
    href: '/events/stopping-the-scroll-with-alternative-ad-styles',
    authorName: 'Luke Thorburg',
    authorHeadshot:
      `${CDN2}/6859ca02e2faf6cbb5d38568_T05KBJQ7E7M-U05K52MLLR4-db8f261fd6f5-512.png`,
    date: 'June 26, 2025',
    thumbnail:
      `${CDN2}/6859ca7f4e1ab5c974fda8e8_Luke%20-Thumbnail.png`,
  },
  {
    title: 'How I Use ISSO To Rapid Test Hundreds Of Static Images Every Month',
    href: '/events/how-i-use-foreplay-to-rapid-test-hundreds-of-static-images-every-month',
    authorName: 'Brandon Wasoski',
    authorHeadshot:
      `${CDN2}/6835febdce1ecf5dc35266a2_brandon-02.png`,
    date: 'May 29, 2025',
    thumbnail:
      `${CDN2}/6835feccc90e88a4d4a8d7bb_Brandon-Thumbnail%20(1).png`,
  },
  {
    title: 'The State of Paid Ads in 2025',
    href: '/events/the-state-of-paid-ads-in-2025',
    authorName: 'Maxwell Finn & Jeremy Adams',
    authorHeadshot:
      `${CDN2}/6823c0f93b6034fd12e34c94_maxwell.jpg`,
    date: 'June 19, 2025',
    thumbnail:
      `${CDN2}/6823c9686a5e01e9a09c3ba0_Max%20%26%20Jeremy-Thumbnail.png`,
  },
  {
    title: 'How to Hunt, Train and Retain the Top 1% of Marketing Talent',
    href: '/events/how-to-hunt-train-and-retain-the-top-1-of-marketing-talent',
    authorName: 'Shahbaz Khokhar',
    authorHeadshot:
      `${CDN2}/68010d87dccd8f7688d27499_1718254984753.jpeg`,
    date: 'June 10, 2025',
    thumbnail:
      `${CDN2}/6823c542e2c3d11ea9ae5a42_Shahbaz2-Thumbnail.png`,
  },
  {
    title: 'How to Transform One Great Creative Idea Into Infinite Creative Assets with Jake Abrams: Founder of Odyssey',
    href: '/events/how-to-transform-one-great-creative-idea-into-infinite-creative-assets-with-jake-abrams-founder-of-odyssey',
    authorName: 'Jake Abrams',
    authorHeadshot:
      `${CDN2}/680a86eaf772eb6b46cd15c7_lRe3a1Ki_400x400.jpg`,
    date: 'May 8, 2025',
    thumbnail:
      `${CDN2}/680a8f1a8a13f1e5fde1f2d1_Jake-Thumbnail%20(1).png`,
  },
  {
    title: 'How to Build a Team That Can Launch 1,000+ Ads Every Month',
    href: '/events/how-to-build-a-team-that-can-launch-1-000-ads-every-month',
    authorName: 'Shahbaz Khokhar',
    authorHeadshot:
      `${CDN2}/68010d87dccd8f7688d27499_1718254984753.jpeg`,
    date: 'May 13, 2025',
    thumbnail:
      `${CDN2}/68010d2aa20c970942242eea_SF.png`,
  },
  {
    title: 'How eCom ad creatives evolved in 2025 with Lachezar Voynov',
    href: '/events/how-ecom-ad-creatives-evolved-in-2025-with-lachezar-voynov',
    authorName: 'Lachezar Voynov',
    authorHeadshot:
      `${CDN2}/67f55d36d896bd436aab3ab6_1685370706023%20(2).jpeg`,
    date: 'April 15, 2025',
    thumbnail:
      `${CDN2}/67f55c77b768efe2aa5e05b2_LJV-Thumbnail.png`,
  },
  {
    title: 'How social commerce is rewriting the rules of retail with Timoté Chanut',
    href: '/events/how-social-commerce-is-rewriting-the-rules-of-retail-with-timote-chanut',
    authorName: 'Timoté Chanut',
    authorHeadshot:
      `${CDN2}/67e20ee9e49c33e674d97965_T012HSPV3LZ-U011YG4A4J2-e406fe3fb051-512.png`,
    date: 'March 27, 2025',
    thumbnail:
      `${CDN2}/67e20e886de2ff9644c96e19_16x9-Thumbnail.png`,
  },
  {
    title: 'How to Make Ads for Apps (That Work) with Social Savannah',
    href: '/events/how-to-make-ads-for-apps-that-work-with-social-savannah',
    authorName: 'Savannah Sanchez',
    authorHeadshot:
      `${CDN2}/65a3f213736b28beba856f96_RW4SVBIS_400x400.jpg`,
    date: 'March 6, 2025',
    thumbnail:
      `${CDN2}/67aa89c586d4bdefc6c7b3cb_Savannah-Thumbnail.png`,
  },
  {
    title: 'Unverified Ad Awards Live Judging',
    href: '/events/unverified-ad-awards-live-judging',
    authorName: 'Zachary Murray',
    authorHeadshot:
      `${CDN2}/64766a422ca53ffc07495f5a_zach.webp`,
    date: 'February 27, 2025',
    thumbnail:
      `${CDN2}/67aa2a3fb4e40d201e7efe33_judging-image.png`,
  },
  {
    title: 'How Unlock Scale with TikTok Shop in 2024',
    href: '/events/scale-with-tiktok-shop',
    authorName: 'Danil Saliukov',
    authorHeadshot:
      `${CDN2}/6655e8224e26e62c020ac5b2_geekoutdubai1%20(1).jpeg`,
    date: 'June 6, 2024',
    thumbnail:
      `${CDN2}/6655e54f3a451245a321f164_Danil-Thumbnail%20(1).png`,
  },
  {
    title: "How to Hack Influencer's As a Sustainable Growth Channel",
    href: '/events/how-to-hack-influencers-as-a-sustainable-growth-channel',
    authorName: 'Micah Whitehead',
    authorHeadshot:
      `${CDN2}/6632aaf21b59b2a93a4583fc_image%20(2).png`,
    date: 'May 7, 2024',
    thumbnail:
      `${CDN2}/6632ab7b95433c9073078965_Micah-Thumbnail.png`,
  },
  {
    title: 'Creative Audit Masterclass: 5x Your Creative Output with a Winning Strategy',
    href: '/events/creative-audit-masterclass-5x-your-creative-output-with-a-winning-strategy',
    authorName: 'Lauren Schwartz',
    authorHeadshot:
      `${CDN2}/65ef67d269eb16f85fa5841d_Screenshot%202024-03-11%20at%203.00.52%E2%80%AFPM.png`,
    date: 'March 27, 2024',
    thumbnail:
      `${CDN2}/65ef67b16422b80c4855666f_Lauren-Thumbnail.png`,
  },
  {
    title: '10x Affiliate Growth: 2 Secret Strategies to Scaling Your Automated Growth Channel',
    href: '/events/10x-affiliate-growth-2-secret-strategies-to-scaling-your-automated-growth-channel',
    authorName: 'Noah Tucker',
    authorHeadshot:
      `${CDN2}/65bbda117fdfb50f95bf9da6_1638936638801.jpg`,
    date: 'March 5, 2024',
    thumbnail:
      `${CDN2}/65bc15c5f73dde3a46ae72cb_Noah-Thumbnail.png`,
  },
  {
    title: 'Cannabis Campaigns on Meta: How to Run Profitable CBD & THC Ads (Without Getting Banned)',
    href: '/events/cbd-thc-ads-meta',
    authorName: 'Aaron Nosbisch',
    authorHeadshot:
      `${CDN2}/65d35c53a788d2ef8cda8882_IMG_4617%20copy.png`,
    date: 'February 22, 2024',
    thumbnail:
      `${CDN2}/65d35c2733ad015059469c47_Aaron-Thumbnail.png`,
  },
  {
    title: 'Supercharge Your Content & Conversion',
    href: '/events/supercharge-your-content-conversion',
    authorName: 'Ashvin Melwani',
    authorHeadshot:
      `${CDN2}/645c1bb5c4769b70a43711fc_NljFfVjj_400x400-1.jpg`,
    date: 'June 15, 2023',
    thumbnail:
      `${CDN2}/65adb3f9444e30dba843bec5_Ash-Thumbnail.png`,
  },
  {
    title: 'Building Creative Strategy Platform Synergies',
    href: '/events/building-creative-strategy-platform-synergies',
    authorName: 'Evan Lee',
    authorHeadshot:
      `${CDN2}/65a3f8399f6d3c6f7e6024ff_WNdxAnJ2_400x400.jpg`,
    date: 'June 14, 2023',
    thumbnail:
      `${CDN2}/65adb402dba71fccff9a091a_Evan-Thumbnail.png`,
  },
  {
    title: 'Stop the Scroll: Top Performing Formulas for High Converting Ad Creatives in 2024',
    href: '/events/social-savanah',
    authorName: 'Savannah Sanchez',
    authorHeadshot:
      `${CDN2}/65a3f213736b28beba856f96_RW4SVBIS_400x400.jpg`,
    date: 'February 7, 2024',
    thumbnail:
      `${CDN2}/65ad7dc90a65d017568f725d_Savanah-Thumbnail.png`,
  },
  {
    title: 'Using Psychology in Your Ad Creative',
    href: '/events/using-psychology-in-your-ad-creative',
    authorName: 'Sarah Levinger',
    authorHeadshot:
      `${CDN2}/65a3f6c7c5f42eb05009ec9f_1644123838088.jpg`,
    date: 'June 14, 2023',
    thumbnail:
      `${CDN2}/65adb40a6f088e8d0ed7b636_Sarah-Thumbnail.png`,
  },
  {
    title: 'Finding Unicorn Ad Inspiration',
    href: '/events/finding-unicorn-ad-inspiration',
    authorName: 'Dara Denny',
    authorHeadshot:
      `${CDN2}/65a3f57f411a110327693e18_CwZIii3w_400x400-1.jpg`,
    date: 'June 14, 2023',
    thumbnail:
      `${CDN2}/65adb41360dc2c161f4c4cd7_Dara-Thumbnail.png`,
  },
  {
    title: 'From Concept to Conversion Proven Direct Response Ad Types',
    href: '/events/from-concept-to-conversion-proven-direct-response-ad-types',
    authorName: 'Mirella Crespi',
    authorHeadshot:
      `${CDN2}/65a3f6e7d78a496b276a81b6_74Sk7QE4_400x400.jpg`,
    date: 'June 14, 2023',
    thumbnail:
      `${CDN2}/65adb41bb8e90d975799ba5a_Mirella-Thumbnail.png`,
  },
  {
    title: '1 Prompt = 1000 Ads: Hacking Midjourney for Insane Ad Creative',
    href: '/events/hacking-midjourney-to-make-high-converting-ads',
    authorName: 'Rory Flynn',
    authorHeadshot:
      `${CDN2}/65a3ee299a5e22222e0a339c_rory_flynn_headshot_720-1.png`,
    date: 'January 25, 2024',
    thumbnail:
      `${CDN2}/65ad7dd33b3fac2a0d23efb4_Rory-Thumbnail.png`,
  },
];

export const webinarsData: WebinarsPageData = {
  hero: {
    logoSrc:
      `${CDN}/681bb42926f71fca09455943_foreplay-fireside-logo-2.webp`,
    logoAlt: 'ISSO fireside logo',
    headline: 'Discover tactics, tools & tips from top voices.',
    paragraph: 'Get the inside scoop, smart tricks, and juicy tips straight from marketing pros who actually know their stuff.',
    ctaText: 'Subscribe to the Calendar',
    ctaHref: '#',
  },
  whyAttend: {
    title: 'Why should I attend?',
    paragraph: "One breakthrough could change your business, career and life. ISSO Firesides gives you an inside look into tomorrows trends.",
    cards: [
      {
        icon: 'eye',
        title: 'Industry Wisdom',
        imageSrc:
          `${CDN}/681bbe6f0c7c257b3e711497_industry-wisdom.webp`,
        imageAlt: 'ad webinar examples',
        body: "Tune into live sessions every week to learn dynamic tactics and tools from today's most prominent marketing voices.",
      },
      {
        icon: 'trending',
        title: "Tomorrow's Trends",
        imageSrc:
          `${CDN}/681bbe702e90daa3591b4857_tomorrows-trends.webp`,
        imageAlt: 'facebook ad trends',
        body: 'Stay ahead of the curve with your marketing & advertising by tapping into real-time insights.',
      },
      {
        icon: 'people',
        title: 'Connect with People',
        imageSrc:
          `${CDN}/681bbe6f77919dfb706705d8_connect-with-people.webp`,
        imageAlt: 'facebook ad experts',
        body: 'Meet, interact and share with one of the most passionate marketing communities in the world.',
      },
    ],
  },
  bottomCta: {
    headline: 'Ready to ship more winning ads?',
    paragraph: 'Unlock the power of ISSO with an unrestricted 7-Day free trial.',
    primaryCtaText: 'Join SISO',
    primaryCtaHref: 'https://app.isso.co/sign-up',
    secondaryCtaText: 'View Pricing',
    secondaryCtaHref: '/pricing',
    imageSrc:
      `${CDN}/680a4b467abdcf40d0d0fa8b_home-cta.webp`,
    imageAlt: 'Two people looking at laptop, ISSO dashboard is displayed.',
  },
  speakerCta: {
    headline: "The stage is yours — if you've got something worth saying.",
    paragraph: "We're looking for fresh voices, bold ideas, and real stories that spark something. If that sounds like you, we're listening.",
    ctaText: 'Apply Now',
    ctaHref: '/fireside-application',
  },
};
