// Info, Education & Community industry page data — extracted from www_foreplay_co (15).html

import type { IndustryPageData } from '../types';

const CDN = 'https://cdn.prod.website-files.com/62a4ed18ddad95dde8b8bfa4';
const PUB = 'https://publicassets.foreplay.co';

export const infoEducationData: IndustryPageData = {
  slug: 'info-education',

  hero: {
    subtitle: 'ISSO For Info, Education & Community',
    headline: 'Enroll a tsunami of students on autopilot with your paid ads',
    paragraph:
      'Stop guessing which ads will fill your courses. See what\'s working for top educators, creators and use those insights to scale your student growth with precision instead of guesswork.',
  },

  clientLogos: [
    { src: `${CDN}/68fbbd66cb1ce4f467252e02_skool-logo.webp`, alt: 'skool logo' },
    { src: `${CDN}/68fbbd66673e2848b5c39158_mindvalley-logo.webp`, alt: 'mindvalley logo' },
    { src: `${CDN}/68fbbd66bb6371d544d604d7_whop-logo.webp`, alt: 'whop logo' },
    { src: `${CDN}/68fbbd66857c62b1d923f416_foundersclub-logo.webp`, alt: 'founders club logo' },
    { src: `${CDN}/68fbbd668cc60943009f2553_masterclass-logo.webp`, alt: 'masterclass logo' },
  ],

  testimonials: {
    sectionTitle: 'Verified and loved by major players',
    items: [
      {
        companyUrl: 'https://www.founderos.com/',
        logoSrc: `${CDN}/68fbafe155ae9036329833f8_6776246b72f981235e69f4e3_FOUNDEROS.svg`,
        logoAlt: 'FounderOS logo',
        quote:
          '"Our organic funnel was growing like crazy. ISSO gave us insights into what was working across paid to reinforce our organic strategy. It became our creative playbook overnight."',
        headshot: `${CDN}/68fbb0c0560270c55e65bc22_1686793511383.jpg`,
        name: 'Matt Gray',
        title: 'Founder @ Founder OS',
        screenshotSrc: `${CDN}/68fbb6db3dcd21a41783c4c4_matt-gray-testimonial.webp`,
      },
      {
        companyUrl: 'https://www.actualize.club/',
        logoSrc: `${CDN}/68fbb71f729f8d2bddde51a3_68f038055898f5311f9f97dd_Actualize%20Logo%20Feb%2025%20-%20Centred%20Star-p-500.png`,
        logoAlt: 'Actualize Club logo',
        quote:
          '"Shifting our focus to optimizing our creative cut our CLP in half. ISSO sparked this new workflow and continues to help us scale."',
        headshot: `${CDN}/68fbb745aec506fa2ec8f1f4_550793602_18524353798009261_7727866367549708554_n.jpg`,
        name: 'Cam Russelle',
        title: 'Founder @ Actualize Club',
        screenshotSrc: `${CDN}/68fbb6dbde3940e8a1cdc289_actualize-testomonial.webp`,
      },
    ],
  },

  features: {
    subtitle: '5 Apps in One',
    title: 'The creative operating system for online education',
    paragraph:
      'From competitor research to creative analytics & attribution. ISSO helps your team increase creative diversity to capture more students.',
    cards: [
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
    subtitle: 'Info Advertising Inspiration',
    title: 'Browse top performing info & education ads',
    ctaText: 'Browse over 1k Info & Education Ads',
    items: [
      {
        brand: {
          name: 'Tony Robbins',
          avatarSrc: `${CDN}/690111b56d0bc59079c7e355_avatar-tony.webp`,
        },
        duration: '203D',
        imageSrc: `${CDN}/6901114ac979b2f3fdcc287e_ad-tony-robbins.webp`,
      },
      {
        brand: {
          name: 'Masterclass',
          avatarSrc: `${CDN}/690111b52d78190e5bc607e2_avatar-masterclass.webp`,
        },
        duration: '7D',
        imageSrc: `${CDN}/6901114ab90982795b5dc108_ad-masterclass.webp`,
      },
      {
        brand: {
          name: 'Mindvalley',
          avatarSrc: `${CDN}/690111b57098d1628a28e9dd_avatar-mindvaley.webp`,
        },
        duration: '109D',
        imageSrc: `${CDN}/6901114a766fdfc3a2b6ec1b_ad-mindvalley.webp`,
      },
    ],
  },

  bottomCta: {
    headline: 'Ready to scale your info offer?',
    paragraph:
      'Unlock the power of ISSO for info, education & community. Discover, launch and analyze winning ads with an unrestricted 7-Day free trial.',
  },
};
