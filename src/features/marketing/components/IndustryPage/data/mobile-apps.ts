// Mobile Apps & Gaming industry page data — extracted from www_foreplay_co (12).html

import type { IndustryPageData } from '../types';

const CDN = 'https://cdn.prod.website-files.com/62a4ed18ddad95dde8b8bfa4';
const PUB = 'https://publicassets.foreplay.co';

export const mobileAppsData: IndustryPageData = {
  slug: 'mobile-apps-gaming',

  hero: {
    subtitle: 'ISSO For Mobile Apps & Gaming',
    headline: 'Profitably acquire mobile app users with paid advertising.',
    paragraph:
      'Your ads are your app\'s first impression. ISSO helps UA and creative teams move faster by launching more diverse, higher-performing creatives that keep installs flowing and CPIs dropping.',
  },

  clientLogos: [
    { src: `${CDN}/69120bbad011881d13c2d3d9_supercell_logo.jpg`, alt: 'supercell logo' },
    { src: `${CDN}/69120bd336860c8ab0a5d9e7_duolingo_logo.jpg`, alt: 'duolingo logo' },
    { src: `${CDN}/69120aa46aa813cff769275a_codewaystudios_logo.jpg`, alt: 'codeway studios logo' },
  ],

  testimonials: {
    sectionTitle: 'Trusted by top mobile growth teams',
    items: [
      {
        companyUrl: 'https://appewa.com/',
        logoSrc: `${CDN}/691b657cd070df6188afe81e_ewa-logo.svg`,
        logoAlt: 'EWA app logo',
        quote:
          '"The first principles of highly engaging pop-culture is what helps our users learn new languages, and we use ISSO to learn what highly engaging advertising looks like. It\'s the backbone of our ad creative intelligence."',
        headshot: `${CDN}/691b652c05c230fd8384d929_1604844525582.jpg`,
        name: 'Ania Wysocka',
        title: 'Founder @ EWA',
        screenshotSrc: `${CDN}/691b664a0883910699a1c96b_ewa-image.png`,
      },
      {
        companyUrl: 'https://taxfix.de/',
        logoSrc: `${CDN}/691ba83d7e08eb85506279a1_taxfix-logo.svg`,
        logoAlt: 'Taxfix logo',
        quote:
          '"This is the highest ROI creative collaboration tool by far. Absolute no-brainer. At first I was skeptical. After trying it myself and bringing it to the team it was clear within days that this could save us 100\'s of hours and a lot of messy brainstorming effort."',
        headshot: `${CDN}/691ba90db848bd2c0543757e_1551647851244.jpg`,
        name: 'Alex Beresford',
        title: 'Chief Growth Officer @ Taxfix',
        screenshotSrc: `${CDN}/691baa75c5fad08c32e743f0_taxfix-image.webp`,
      },
    ],
  },

  features: {
    subtitle: '5 Apps in One',
    title: 'The ad creative operating system for mobile growth',
    paragraph:
      'From competitor ad tracking to creative analytics, ISSO helps app marketers build, test, and scale creative with precision and speed.',
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
    subtitle: 'Mobile App Advertising Inspiration',
    title: 'Browse top performing mobile app ads',
    ctaText: 'Browse over 100k Mobile App Ads',
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
          name: 'Clash of Clans',
          avatarSrc: `${CDN}/6912100c3395c80874d87315_05f959c8b169d75e3bc6ed24cb5e683306ab748db96119754610841a39b5ff4a.jpg`,
        },
        duration: '7D',
        imageSrc: `${CDN}/69121023a0af39c87f05f588_thumbnail-LwYHyqJspEIAUsRmBq3Y.jpg`,
      },
      {
        brand: {
          name: 'Opal',
          avatarSrc: `${CDN}/69120fd041b9e16829fca9eb_59b97baa42b1d3e6bf901eec00c905ea2a1b87181986a5607dc4de97021c9ffb.jpg`,
        },
        duration: '109D',
        imageSrc: `${CDN}/69120f8717113d7b30de299a_thumbnail-PW8FGTPyQeGLfdvH5iP6.jpg`,
      },
    ],
  },

  bottomCta: {
    headline: 'Turn Creative Testing Into Scalable User Acquisition',
    paragraph:
      'Unlock the power of ISSO for your app UA teams. Discover, launch and analyze winning ads with an unrestricted 7-Day free trial.',
  },
};
