/**
 * Blog static data - extracted from HTML source www_foreplay_co (22).html
 * Images are served from Foreplay's Webflow CDN.
 */

import { CDN2 } from '@/lib/cdn';

export interface BlogPost {
  slug: string;
  href: string;
  title: string;
  excerpt: string;
  author: string;
  authorAvatar: string;
  authorHref: string;
  thumbnail: string;
  minRead: number;
  category?: string;
}

export interface FeaturedPost {
  href: string;
  title: string;
  excerpt: string;
  image: string;
  author: string;
  authorAvatar: string;
  authorHref: string;
}

// Avatar shorthand
const JACK_AVATAR = `${CDN2}/679252417b4e7f917c8e9842_T01VC6J4RBM-U081BE37V8T-7338e244e1a2-512.png`;
const ZACH_AVATAR = `${CDN2}/64766a422ca53ffc07495f5a_zach.webp`;

export const FEATURED_POST: FeaturedPost = {
  href: '/post/api-launch',
  title: 'Introducing the ISSO API: Win $5,000',
  excerpt:
    'ISSO has launched their competitor advertising API and you could win $5,000 by building an AI workflow',
  image:
    `${CDN2}/68bf2cc8f0c30675e16891ce_api-thumbnail.png`,
  author: 'Zachary Murray',
  authorAvatar: ZACH_AVATAR,
  authorHref: '/authors/zachary-murray',
};

export const POPULAR_POSTS: BlogPost[] = [
  {
    slug: 'e45-swiping-left-on-ads-like-tinder',
    href: '/post/e45-swiping-left-on--ads-like-tinder-with-john-gargiulo',
    title: 'E45: Swiping Left on Ads Like Tinder with John Gargiulo',
    excerpt:
      'In this episode we talked to John Gargiulo, the founder of Airpost. Airpost makes new video ads every week for enterprise advertisers spending $1M or more a month on Facebook ads.',
    author: 'Jack Kavanagh',
    authorAvatar: JACK_AVATAR,
    authorHref: '/authors/jack-kavanagh',
    thumbnail: '',
    minRead: 10,
    category: 'SAAS Operators Podcast',
  },
  {
    slug: 'e44-3500-customers-zero-outbound',
    href: '/post/e44-3-500-customers-and-zero-outbound-with-shaan-arora',
    title: 'E44: 3,500 Customers and Zero Outbound with Shaan Arora',
    excerpt:
      'In this episode we talked to Shaan Arora, the co-founder of Alia, about bootstrapping Alia Popups from $1M to $9M ARR in a year, bootstrapped, with zero outbound, and no venture capital.',
    author: 'Jack Kavanagh',
    authorAvatar: JACK_AVATAR,
    authorHref: '/authors/jack-kavanagh',
    thumbnail: '',
    minRead: 15,
    category: 'SAAS Operators Podcast',
  },
  {
    slug: 'the-2026-super-bowl-ads',
    href: '/post/the-2026-super-bowl-ads',
    title: 'The 2026 Super Bowl Ads',
    excerpt:
      'Super Bowl ads are the most expensive impressions in the world. Every brand that ran one this year spent more on 30 seconds than most businesses spend on marketing in a year.',
    author: 'Jack Kavanagh',
    authorAvatar: JACK_AVATAR,
    authorHref: '/authors/jack-kavanagh',
    thumbnail: '',
    minRead: 10,
    category: 'Creative Strategy',
  },
  {
    slug: 'e43-saas-sell-off-dipti-desai',
    href: '/post/e43-how-to-survive-the-saas-sell-off-with-dipti-desai',
    title: 'E43: How to Survive The SaaS Sell Off with Dipti Desai',
    excerpt:
      'In this episode we talked to Dipti Desai, the founder and CEO of Crstl, about why traditional SaaS pricing is dying and what actually makes software defensible in 2025.',
    author: 'Jack Kavanagh',
    authorAvatar: JACK_AVATAR,
    authorHref: '/authors/jack-kavanagh',
    thumbnail: '',
    minRead: 15,
    category: 'SAAS Operators Podcast',
  },
];

export const BLOG_POSTS: BlogPost[] = [
  {
    slug: 'e45-swiping-left-on-ads-like-tinder',
    href: '/post/e45-swiping-left-on--ads-like-tinder-with-john-gargiulo',
    title: 'E45: Swiping Left on Ads Like Tinder with John Gargiulo',
    excerpt:
      'In this episode we talked to John Gargiulo, the founder of Airpost. Airpost makes new video ads every week for enterprise advertisers spending $1M or more a month on Facebook ads.',
    author: 'Jack Kavanagh',
    authorAvatar: JACK_AVATAR,
    authorHref: '/authors/jack-kavanagh',
    thumbnail:
      `${CDN2}/69a21a4490a39a15291b61b7_E45%20thumb.png`,
    minRead: 10,
    category: 'SAAS Operators Podcast',
  },
  {
    slug: 'e44-3500-customers-zero-outbound',
    href: '/post/e44-3-500-customers-and-zero-outbound-with-shaan-arora',
    title: 'E44: 3,500 Customers and Zero Outbound with Shaan Arora',
    excerpt:
      'In this episode we talked to Shaan Arora, the co-founder of Alia, about bootstrapping Alia Popups from $1M to $9M ARR in a year, bootstrapped, with zero outbound, and no venture capital.',
    author: 'Jack Kavanagh',
    authorAvatar: JACK_AVATAR,
    authorHref: '/authors/jack-kavanagh',
    thumbnail:
      `${CDN2}/699dec081ed65d548676f2fa_E44%20thumb.png`,
    minRead: 15,
    category: 'SAAS Operators Podcast',
  },
  {
    slug: 'the-2026-super-bowl-ads',
    href: '/post/the-2026-super-bowl-ads',
    title: 'The 2026 Super Bowl Ads',
    excerpt:
      'Super Bowl ads are the most expensive impressions in the world. Every brand that ran one this year spent more on 30 seconds than most businesses spend on marketing in a year. The best marketers treat it like a free research library built by the highest paid creative teams in the world.',
    author: 'Jack Kavanagh',
    authorAvatar: JACK_AVATAR,
    authorHref: '/authors/jack-kavanagh',
    thumbnail:
      `${CDN2}/699c79256759e8e5e5d30ffa_Blog.png`,
    minRead: 10,
    category: 'Creative Strategy',
  },
  {
    slug: 'e43-saas-sell-off-dipti-desai',
    href: '/post/e43-how-to-survive-the-saas-sell-off-with-dipti-desai',
    title: 'E43: How to Survive The SaaS Sell Off with Dipti Desai',
    excerpt:
      'In this episode we talked to Dipti Desai, the founder and CEO of Crstl, about why traditional SaaS pricing is dying and what actually makes software defensible in 2025.',
    author: 'Jack Kavanagh',
    authorAvatar: JACK_AVATAR,
    authorHref: '/authors/jack-kavanagh',
    thumbnail:
      `${CDN2}/6995f01954daca560aabcb46_E43%20thumb.png`,
    minRead: 15,
    category: 'SAAS Operators Podcast',
  },
  {
    slug: 'e42-saas-is-changing-yash-chavan',
    href: '/post/e42-saas-is-changing-with-yash-chavan',
    title: 'E42: SaaS is changing with Yash Chavan',
    excerpt:
      'In this episode of the SaaS Operators, we talked to Yash Chavan, the founder and CEO of SARAL. We talked about why the pace of building has fundamentally changed and most SaaS is falling behind.',
    author: 'Jack Kavanagh',
    authorAvatar: JACK_AVATAR,
    authorHref: '/authors/jack-kavanagh',
    thumbnail:
      `${CDN2}/698a2de9fef897819f3ec9cb_e42%20thumb.png`,
    minRead: 12,
    category: 'SAAS Operators Podcast',
  },
  {
    slug: 'e40-making-money-with-memes-jason-levin',
    href: '/post/e40-making-money-with-memes-with-jason-levin',
    title: 'E40: Making Money with Memes with Jason Levin',
    excerpt:
      'In this episode of the SAAS Operators Podcast, we talked to Jason Levin, the founder of Memelord. Jason explained how memes are the most useful tool for growth on the internet, and how "posting" is quickly becoming a necessity skill.',
    author: 'Jack Kavanagh',
    authorAvatar: JACK_AVATAR,
    authorHref: '/authors/jack-kavanagh',
    thumbnail:
      `${CDN2}/6973de01d7a13850dd20e0af_thumbnail.png`,
    minRead: 11,
    category: 'SAAS Operators Podcast',
  },
  {
    slug: 'how-we-make-creative-briefs-with-ai',
    href: '/post/how-we-make-creative-briefs-with-ai-at-isso',
    title: 'How We Make Creative Briefs with AI at ISSO',
    excerpt:
      'A behind-the-scenes look at how the ISSO team uses AI to generate high-quality creative briefs for ad campaigns, saving hours of manual work every week.',
    author: 'Jack Kavanagh',
    authorAvatar: JACK_AVATAR,
    authorHref: '/authors/jack-kavanagh',
    thumbnail:
      `${CDN2}/68bf2cc8f0c30675e16891ce_api-thumbnail.png`,
    minRead: 8,
    category: 'ISSO Ships',
  },
  {
    slug: 'how-creative-strategists-at-agencies-create-briefs',
    href: '/post/how-creative-strategists-at-agencies-create-briefs',
    title: 'How Creative Strategists at Agencies Create Briefs',
    excerpt:
      'We interviewed top creative strategists at leading agencies to understand how they build briefs that actually convert. Here is what we found.',
    author: 'Jack Kavanagh',
    authorAvatar: JACK_AVATAR,
    authorHref: '/authors/jack-kavanagh',
    thumbnail:
      `${CDN2}/699c79256759e8e5e5d30ffa_Blog.png`,
    minRead: 9,
    category: 'Creative Strategy',
  },
  {
    slug: 'how-to-use-the-worlds-largest-library-of-ads',
    href: '/post/how-to-use-the-worlds-largest-library-of-ads-to-do-creative-strategy-for-your-brands',
    title: "How to Use the World's Largest Library of Ads to Do Creative Strategy",
    excerpt:
      'ISSO Intelligence gives you access to over 100M ads. Here is a step-by-step guide to using this library to build a winning creative strategy for your brand.',
    author: 'Jack Kavanagh',
    authorAvatar: JACK_AVATAR,
    authorHref: '/authors/jack-kavanagh',
    thumbnail:
      `${CDN2}/6973de01d7a13850dd20e0af_thumbnail.png`,
    minRead: 7,
    category: 'Ad Inspiration',
  },
  {
    slug: 'how-to-search-ads-using-the-foreplay-api',
    href: '/post/how-to-search-ads-using-the-isso-api',
    title: 'How to Search Ads Using the ISSO API',
    excerpt:
      'Step-by-step guide to authenticating and querying the ISSO API to search over 100M ads programmatically and integrate them into your own workflows.',
    author: 'Jack Kavanagh',
    authorAvatar: JACK_AVATAR,
    authorHref: '/authors/jack-kavanagh',
    thumbnail:
      `${CDN2}/68bf2cc8f0c30675e16891ce_api-thumbnail.png`,
    minRead: 6,
    category: 'ISSO Ships',
  },
  {
    slug: 'how-to-use-hooks',
    href: '/post/how-to-use-hooks',
    title: 'How to Use Hooks to Make Your Ads Convert',
    excerpt:
      'Hooks are the most important part of any ad. In the first 3 seconds you either win or lose your audience. Here is how to write hooks that stop the scroll.',
    author: 'Jack Kavanagh',
    authorAvatar: JACK_AVATAR,
    authorHref: '/authors/jack-kavanagh',
    thumbnail:
      `${CDN2}/699c79256759e8e5e5d30ffa_Blog.png`,
    minRead: 8,
    category: 'Creative Strategy',
  },
  {
    slug: 'landing-page-strategy',
    href: '/post/landing-page-strategy',
    title: 'Landing Page Strategy: What the Best DTC Brands Get Right',
    excerpt:
      'We analyzed 500 landing pages from top DTC brands to find the patterns that consistently drive conversions. Here is everything we learned.',
    author: 'Jack Kavanagh',
    authorAvatar: JACK_AVATAR,
    authorHref: '/authors/jack-kavanagh',
    thumbnail:
      `${CDN2}/6973de01d7a13850dd20e0af_thumbnail.png`,
    minRead: 10,
    category: 'Creative Strategy',
  },
];

export const CATEGORIES = [
  { label: 'SAAS Operators Podcast', href: '/category/saas-operators-podcast' },
  { label: 'Behind the Bootstraps', href: '/category/behind-the-bootstraps' },
  { label: 'Spyder', href: '/category/spyder' },
  { label: 'AD&P', href: '/category/ad-p' },
  { label: 'ISSO Ships', href: '/category/isso-ships' },
  { label: 'TikTok Creative Center', href: '/category/tiktok-creative-center' },
  { label: 'Facebook Ad Library', href: '/category/facebook-ad-library' },
  { label: 'Ad Briefs', href: '/category/ad-briefs' },
  { label: 'Ad Inspiration', href: '/category/ad-inspiration' },
  { label: 'Swipe File', href: '/category/swipe-file' },
  { label: 'Google Ads', href: '/category/google-ads' },
  { label: 'LinkedIn Ads', href: '/category/linkedin-ads' },
  { label: 'Creative Strategy', href: '/category/creative-strategy' },
  { label: 'TikTok Ads', href: '/category/tiktok-ads' },
  { label: 'Meta Ads', href: '/category/meta-ads' },
];
