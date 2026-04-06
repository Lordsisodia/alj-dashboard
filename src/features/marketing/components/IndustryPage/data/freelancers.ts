// Freelancers & UGC Creators industry page data - extracted from www_foreplay_co (16).html

import type { IndustryPageData } from '../types';

const CDN = 'https://cdn.prod.website-files.com/62a4ed18ddad95dde8b8bfa4';
const PUB = 'https://publicassets.foreplay.co';

export const freelancersData: IndustryPageData = {
  slug: 'freelancers',

  hero: {
    subtitle: 'ISSO For Freelancers & Creators',
    headline: 'Madison Avenue software on a freelancer budget',
    paragraph:
      "When you're a one-person show, your time is everything. ISSO helps freelancers & UGC creators manage creative inspiration, client reporting, and performance insights all in one place.",
  },

  clientLogos: [
    { src: `${CDN}/69120f8e40d0d1c6bd08b315_22f4d966b9103f8011d3c00de1daa5e1cb6a874c950df300577aa55b086c70ed.jpg`, alt: 'calm logo' },
    { src: `${CDN}/6901213def9dbb235788f85e_image.png`, alt: 'AG1 logo' },
    { src: `${CDN}/690e4163815a4dfcdc62e2a1_images.png`, alt: 'space goods logo' },
  ],

  testimonials: {
    sectionTitle: 'Trusted by independent marketers and UGC creators worldwide',
    items: [
      {
        companyUrl: 'https://www.youtube.com/@orenmeetsworld',
        logoSrc: `${CDN}/69121692cfef073deb3bf3a8_oren_logo.png`,
        logoAlt: 'Oren John logo',
        quote:
          '"I do the majority of research work inside ISSO. I can save organic IG and TikTok posts to boards and browse the complete advertising libraries of thousands and thousands of brands."',
        headshot: `${CDN}/69121475ff104fa0f96ae170_channels4_profile.jpg`,
        name: 'Oren John',
        title: "The Internet's Creative Director",
        screenshotSrc: `${CDN}/691217066243edcf41278615_oren-image.png`,
      },
      {
        companyUrl: 'https://www.perspective.co/',
        logoSrc: `${CDN}/69121ab1e72bae3b28e21776_kelly-logo.webp`,
        logoAlt: 'Kelly J UGC logo',
        quote:
          '"I save all my ads to a ISSO board. When you\'re strapped for ideas, I come back to my long-running ads and repurpose the concepts! You don\'t have to reinvent the wheel every time. Eternal goal: work smarter, not harder."',
        headshot: `${CDN}/691217a48b9a6d53b6286221_344372476_227668366546891_1082099233011237103_n.jpg`,
        name: 'Kelly J UGC',
        title: 'UGC Creator',
        screenshotSrc: `${CDN}/69121ab1e909a11acf708879_kelly-image.webp`,
      },
      {
        companyUrl: 'https://www.perspective.co/',
        logoSrc: `${CDN}/66269cefcd8042e78308e9eb_dara-logo.png`,
        logoAlt: 'Dara Denney logo',
        quote:
          '"If you\'re a media buyer or a creative strategist that hasn\'t tried ISSO, then you\'re missing out. For over 3 years I have used it for all creative research."',
        headshot: `${CDN}/691211fa72f29cd65aa5ccc3_unnamed.jpg`,
        name: 'Dara Denney',
        title: 'Creative Strategy Educator',
        screenshotSrc: `${CDN}/69121ab1e909a11acf708879_kelly-image.webp`,
      },
    ],
  },

  features: {
    subtitle: '5 Apps in One',
    title: 'The creative operating system for solo marketers',
    paragraph:
      'From research to reporting, ISSO keeps your creative workflow organized and your clients coming back.',
    cards: [
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
        subtitle: 'Agents',
        title: 'Creative Analytics & Reporting',
        iconSrc: `${CDN}/682f9f725170de3b3258d310_pi-lens-hq.webp`,
        features: [
          { label: 'Creative Test Analysis' },
          {label: 'Build & Share Reports' },
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
    subtitle: 'Advertising Inspo for Every Niche',
    title: 'Browse ads from over 1,000 different niches',
    ctaText: 'Browse over 1,000 niches',
    items: [
      {
        brand: {
          name: 'Calm',
          avatarSrc: `${CDN}/69120f8e40d0d1c6bd08b315_22f4d966b9103f8011d3c00de1daa5e1cb6a874c950df300577aa55b086c70ed.jpg`,
        },
        duration: '203D',
        imageSrc: `${CDN}/69120f8717113d7b30de299a_thumbnail-PW8FGTPyQeGLfdvH5iP6.jpg`,
      },
      {
        brand: {
          name: 'AG1',
          avatarSrc: `${CDN}/6901213def9dbb235788f85e_image.png`,
        },
        duration: '7D',
        imageSrc: `${CDN}/690e43bce5daae0783a0d0fa_0-dco-fVzvC4MZPO6e1fsjTwcN%400.3x.png`,
      },
      {
        brand: {
          name: 'Spacegoods',
          avatarSrc: `${CDN}/690e4163815a4dfcdc62e2a1_images.png`,
        },
        duration: '109D',
        imageSrc: `${CDN}/690e43136657394d12f097fb_205727aa1d36a25bb5b6345abc6fb226.jpg`,
      },
    ],
  },

  bottomCta: {
    headline: 'Service more clients. Keep them longer. Stress less.',
    paragraph:
      'ISSO helps you organize inspiration, pitch ideas beautifully, and show real results, so your freelance business scales like an agency.',
  },
};
