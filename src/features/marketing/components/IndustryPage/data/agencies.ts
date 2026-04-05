// Agencies industry page data — extracted from www_foreplay_co (11).html

import type { IndustryPageData } from '../types';

const CDN = 'https://cdn.prod.website-files.com/62a4ed18ddad95dde8b8bfa4';
const PUB = 'https://publicassets.foreplay.co';

export const agenciesData: IndustryPageData = {
  slug: 'agencies',

  hero: {
    subtitle: 'ISSO For Agencies',
    headline: 'Win more clients and keep them longer with ISSO',
    paragraph:
      "Stop sending static decks and screenshots. ISSO turns your creative strategy into a visual, interactive experience that helps you win pitches, wow clients, and prove performance with clarity and confidence.",
  },

  clientLogos: [
    { src: `${CDN}/690e239f7828b83b8bfedaec_wallaroo_media_logo.jpg`, alt: 'wallaroo media logo' },
    { src: `${CDN}/690e239f2c76d3f771b22c4e_common_thread_collective_logo.jpg`, alt: 'common thread collective logo' },
    { src: `${CDN}/690e239f0479721723b47681_wearegrowthco_logo.jpg`, alt: 'we are growth co logo' },
  ],

  testimonials: {
    sectionTitle: 'Trusted by the world\'s best performance agencies',
    items: [
      {
        companyUrl: 'https://thesocialsavannah.com/',
        logoSrc: `${CDN}/690e15d80c06e35f3ab82175_footer-logo03.png`,
        logoAlt: 'Social Savannah logo',
        quote:
          '"As an ad creative producer, the most difficult part of the job is finding great ad inspiration. ISSO makes it easy to save great ads and to keep them organized. No other tool compares!"',
        headshot: `${CDN}/690e15c87211e140e0273c47_1733772243879.jpg`,
        name: 'Savannah Sanchez',
        title: 'Founder @ Social Savannah',
        screenshotSrc: `${CDN}/690e163896fa29d354f065b9_social-savanah-image.webp`,
      },
      {
        companyUrl: 'https://pearmill.com/',
        logoSrc: `${CDN}/690e166537748feee0b74868_63b59b7475377c988b04eb2e_Pearmill-logo-svg.svg`,
        logoAlt: 'Pearmill agency logo',
        quote:
          '"We have used ISSO for years now, whether we\'re auditing an account, trying to win new business, or doing some competitive research ISSO is our first stop."',
        headshot: `${CDN}/690e15c8dad4e6da324d6fb4_1585368523538.jpg`,
        name: 'Donovan McKnight',
        title: 'Head of Creative @ Pearmill',
        screenshotSrc: `${CDN}/690e163857fb65d5f2648a37_pearmill-image.webp`,
      },
      {
        companyUrl: 'https://wallaroomedia.com/',
        logoSrc: `${CDN}/690e22ef3bbcdef088e45259_Wallaroo-Horizontal-Logo-2.svg`,
        logoAlt: 'Wallaroo Media logo',
        quote:
          '"ISSO is an essential part of how our agency operates. It\'s not just a research tool, but an integral part of our creative strategy process. Every week, our team uses it to uncover insights and ad patterns that would\'ve taken hours to find before."',
        headshot: `${CDN}/690e15c8eabf90569ff11514_1554911405576.jpg`,
        name: 'Eric Farmer',
        title: 'Partner @ Wallaroo',
        screenshotSrc: `${CDN}/690e1638f641be4453f94319_wallaroo-image.webp`,
      },
    ],
  },

  features: {
    subtitle: '5 Apps in One',
    title: 'The creative operating system built for agencies',
    paragraph:
      "Showcase your team's work beautifully, share insights instantly, and keep every client engagement organized and impressive.",
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
    subtitle: 'Agency Advertising Inspiration',
    title: 'Browse top performing agency ads',
    ctaText: 'Browse over 1,000 agency ads',
    items: [
      {
        brand: {
          name: 'Soar With Us',
          avatarSrc: `${CDN}/690e23e107631efa4a626cb0_image%20(8).png`,
        },
        duration: '203D',
        imageSrc: `${CDN}/690e24ece6ebf2166939da9f_0-dco-O1pJqOOKXj7CHN2wGMe4.jpg`,
      },
      {
        brand: {
          name: 'CTC',
          avatarSrc: `${CDN}/690e239f2c76d3f771b22c4e_common_thread_collective_logo.jpg`,
        },
        duration: '7D',
        imageSrc: `${CDN}/690e264393c08ce0a6662787_thumbnail-1xndDXw6LSzTTm87bObn.jpeg`,
      },
      {
        brand: {
          name: 'Boomerangme',
          avatarSrc: `${CDN}/690e26dd28b7bdef0706f483_71cbc6cb27f3364d05cc2178aed3d02d.jpg`,
        },
        duration: '109D',
        imageSrc: `${CDN}/690e43136657394d12f097fb_205727aa1d36a25bb5b6345abc6fb226.jpg`,
      },
    ],
  },

  bottomCta: {
    headline: 'Creative experience your clients expect, results they can\'t ignore.',
    paragraph:
      'Unlock the power of ISSO for your clients and creative teams. Discover, launch and analyze winning ads with an unrestricted 7-Day free trial.',
  },
};
