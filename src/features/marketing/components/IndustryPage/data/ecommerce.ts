// Ecommerce industry page data - extracted from the original ISSO HTML (www_foreplay_co (10).html).

import type { IndustryPageData } from '../types';

const CDN = 'https://cdn.prod.website-files.com/62a4ed18ddad95dde8b8bfa4';
const PUB = 'https://publicassets.foreplay.co';

export const ecommerceData: IndustryPageData = {
  slug: 'ecommerce',

  hero: {
    subtitle: 'ISSO For eCommerce Brands',
    headline: 'Crush creative fatigue and scale your creative velocity by 10x',
    paragraph:
      'Stop spinning your wheels on creative that\'s stale before it even hits the feed. See what the top 1% of ecommerce advertisers are already doing, then launch more winning ads faster and smarter.',
  },

  clientLogos: [
    { src: `${CDN}/6901211f335601e4f11435c7_gruns_logo.jpeg`, alt: 'gruns logo' },
    { src: `${CDN}/690123782bbd1a63cf96e99b_cuts_clothing_inc_logo.jpg`, alt: 'cuts clothing logo' },
    { src: `${CDN}/6901213def9dbb235788f85e_image.png`, alt: 'AG1 logo' },
    { src: `${CDN}/690125db8f9088175a692da3_ilmakiage_logo.jpg`, alt: 'il makiage logo' },
    { src: `${CDN}/6901263cc57155d3857ac3c7_219522-8874a242d3d67f128f77a9060056dd34-medium_jpg.jpg`, alt: 'hello fresh logo' },
    { src: `${CDN}/690126a133a99ca994bd3f73_brooklinen-logo-png_seeklogo-442099.png`, alt: 'brooklinen logo' },
    { src: `${CDN}/690bca59febb5423b1816bdd_reef_2_logo.jpg`, alt: 'reef logo' },
    { src: `${CDN}/690bcaa3d10a25559d1d4ff2_nrkro03f4hmp59xanfu5.avif`, alt: 'mary ruth organics logo' },
    { src: `${CDN}/690bcbcb3091e50bdf07c43d_petlabco_logo.jpg`, alt: 'petlab co logo' },
  ],

  testimonials: {
    sectionTitle: 'Trusted by growth-hungry eCommerce brands',
    items: [
      {
        companyUrl: 'https://ridge.com/',
        logoSrc: `${CDN}/6478c433c4fc1d3402c883fc_the-ridge.webp`,
        logoAlt: 'The Ridge logo',
        quote:
          '"ISSO is a key piece of how we find, save, review, and communicate around performance creative assets. It\'s really reduced a lot of friction in the process and has allowed us to ship 10x more content than we would have otherwise."',
        headshot: `${CDN}/6478c447be86e2342219433d_Connor%20MacDonald.webp`,
        name: 'Connor MacDonald',
        title: 'CMO @ The Ridge',
        screenshotSrc: `${CDN}/691b5d6114156c5776564535_ridge-image.webp`,
      },
      {
        companyUrl: 'https://bydavidkollar.com/',
        logoSrc: `${CDN}/690120f44b70c00086aaec6d_White_e8711f69-aa57-4481-8048-78047ccd68d1.avif`,
        logoAlt: 'Kollar Clothing logo',
        quote:
          '"We have been using ISSO for 3 years. Easily 90% of our winning ad ideas came from the Intelligence feed"',
        headshot: `${CDN}/6901230890f3af15186d2e76_david-kollar-headshot.webp`,
        name: 'David Kollar',
        title: 'Founder @ ByDavidKollar',
        screenshotSrc: `${CDN}/69012308669938a5c3f8b698_david-kollar-testimonial.webp`,
      },
      {
        companyUrl: 'https://www.drinkbrez.com/',
        logoSrc: `${CDN}/690e40281d7f30cbbaff3c6c_brez-logo.svg`,
        logoAlt: 'BREZ logo',
        quote:
          '"ISSO helps our entire team find new angles and industry compliant approaches to market our restricted product on Meta."',
        headshot: `${CDN}/690e4074e56f5f919a5afdeb_531363979_18524588173028937_8380805158155772432_n.jpg`,
        name: 'Aaron Nosbisch',
        title: 'Founder @ BREZ',
        screenshotSrc: `${CDN}/690e402852b8720eb330f7d0_brez-image.png`,
      },
    ],
  },

  features: {
    subtitle: '5 Apps in One',
    title: 'The creative operating system for ecommerce growth',
    paragraph:
      'From competitor research to creative analytics & attribution. ISSO helps your team increase the volume and effectiveness of your ads.',
    cards: [
      {
        subtitle: 'Agents',
        title: 'Creative Analytics & Reporting',
        iconSrc: `${CDN}/682f9f725170de3b3258d310_pi-lens-hq.webp`,
        features: [
          { label: 'Creative Test Analysis' },
          { label: 'Build & Share Reports' },
          { label: 'Compare Winning Themes' },
        ],
        ctaHref: 'https://app.isso.co/sign-up',
        videoSrc: `${PUB}/cta-lens.mp4`,
        isoSrc: `${CDN}/682f93b43a94db00dbc45367_iso-lens.webp`,
        bgSrc: `${CDN}/6818f491db7df5646bba2c71_lens-product-bg.webp`,
        slides: [
          `${CDN}/6818f4ab1be4acb01b76b457_creative-test-analysis.webp`,
          `${CDN}/6818f4abf647a12cb791df19_build-and-share-reports.webp`,
          `${CDN}/6818f4abb4e886135485759a_compare-segments.webp`,
        ],
      },
      {
        subtitle: 'Recon',
        title: 'Automatically track competitors',
        iconSrc: `${CDN}/682f8f898e2734095cb3d708_pi-spyder.webp`,
        features: [
          { label: '24/7 Ad Library Scraper' },
          { label: 'Analyze Creative Tests' },
          { label: 'Identify Top Hooks' },
        ],
        ctaHref: 'https://app.isso.co/sign-up',
        videoSrc: `${PUB}/cta-spyder.mov`,
        isoSrc: `${CDN}/682f93b469081ade4aadbbad_iso-spyder.webp`,
        bgSrc: `${CDN}/680bbc29442689a5eff3f659_home-spyder-bg.webp`,
        slides: [
          `${CDN}/6810ff44da8facf8efaa1529_Recon-1.webp`,
          `${CDN}/6810ff441a17fded3a5d9e33_Recon-2.webp`,
          `${CDN}/6810ff493741dd270180d33a_Recon-3.webp`,
        ],
      },
      {
        subtitle: 'Hub',
        title: 'Save ads from anywhere, forever',
        iconSrc: `${CDN}/682f9f72df2782e8df1d1114_pi-swipefile-hq.webp`,
        features: [
          { label: 'Save & Organize' },
          { label: 'Automate Transcription' },
          { label: 'Easily Share & Collaborate' },
        ],
        ctaHref: 'https://app.isso.co/sign-up',
        videoSrc: `${PUB}/cta-swipe-file.mov`,
        isoSrc: `${CDN}/682f93b40d86b433e8039cc9_iso-swipefile.webp`,
        bgSrc: `${CDN}/680bbc292a514713177aac15_home-swipefile-bg.webp`,
        slides: [
          `${CDN}/682e079a4aaf06e2b30921cd_swipe-file-slide-1.webp`,
          `${CDN}/68192291514c5eb42a2b307d_spyder-transcription-new.webp`,
          `${CDN}/6810ff44263ea947f36b6c18_Swipefile-3.webp`,
        ],
      },
      {
        subtitle: 'Intelligence',
        title: 'The smartest ad search engine',
        iconSrc: `${CDN}/682f9f722b39359a238b0ff9_pi-discovery-hq.webp`,
        features: [
          { label: 'Smart Search' },
          { label: 'AI Creative Analysis' },
          { label: 'Advanced Filters' },
        ],
        ctaHref: 'https://app.isso.co/sign-up',
        videoSrc: `${PUB}/cta-discovery.mov`,
        isoSrc: `${CDN}/682f93b42567b6ff190373b9_iso-discovery.webp`,
        bgSrc: `${CDN}/680bbc2b22ec562396738e58_home-discovery-bg.webp`,
        slides: [
          `${CDN}/6810ff44c9b7dbd2a13d4157_Discoverty-1.webp`,
          `${CDN}/681922ba61ce305541bf6b10_discovery-ai-new.webp`,
          `${CDN}/6810ff444d53cd2c23b1643a_Intelligence-3.webp`,
        ],
      },
      {
        subtitle: 'Content Gen',
        title: 'Go from concept to launched, faster',
        iconSrc: `${CDN}/682f9f72dc306ab5bf957aea_pi-briefs-hq.webp`,
        features: [
          { label: 'Storyboard & Script' },
          { label: 'Brand Profiles' },
          { label: 'Modular Brief Builder' },
        ],
        ctaHref: 'https://app.isso.co/sign-up',
        videoSrc: `${PUB}/cta-briefs.mp4`,
        isoSrc: `${CDN}/682f93b44b8360f413644eb7_iso-briefs.webp`,
        bgSrc: `${CDN}/680bbc29f6ff9917b3df880f_home-briefs-bg.webp`,
        slides: [
          `${CDN}/68191db8d6fd3e791a16b485_briefs-storyboard-2.webp`,
          `${CDN}/6818f77a3cb4900456b65643_brand-profiles.webp`,
          `${CDN}/681b51296ef70672be45e334_brief-editor.webp`,
        ],
      },
    ],
  },

  adGallery: {
    subtitle: 'eCommerce Advertising Inspiration',
    title: 'Browse top performing ecommerce ads',
    ctaText: 'Browse over 100m Ecommerce Ads',
    items: [
      {
        brand: {
          name: 'AG1',
          avatarSrc: `${CDN}/6901213def9dbb235788f85e_image.png`,
        },
        duration: '203D',
        imageSrc: `${CDN}/690e43bce5daae0783a0d0fa_0-dco-fVzvC4MZPO6e1fsjTwcN%400.3x.png`,
      },
      {
        brand: {
          name: 'Space Goods',
          avatarSrc: `${CDN}/690e4163815a4dfcdc62e2a1_images.png`,
        },
        duration: '7D',
        imageSrc: `${CDN}/690e43136657394d12f097fb_205727aa1d36a25bb5b6345abc6fb226.jpg`,
      },
      {
        brand: {
          name: 'Hims',
          avatarSrc: `${CDN}/690e41845213d9f3a721fb3b_image%20(9).png`,
        },
        duration: '109D',
        imageSrc: `${CDN}/690e42700eaee9e08447a61d_de11366cf74addca6a2396586748492b.png`,
      },
    ],
  },

  bottomCta: {
    headline: 'Ready to scale your online store?',
    paragraph:
      'Unlock the power of ISSO for ecommerce. Discover, launch and analyze winning ads with an unrestricted 7-Day free trial.',
  },
};
