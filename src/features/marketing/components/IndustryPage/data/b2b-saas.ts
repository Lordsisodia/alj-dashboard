// B2B SaaS industry page data - extracted from www_foreplay_co (13).html

import type { IndustryPageData } from '../types';

const CDN = 'https://cdn.prod.website-files.com/62a4ed18ddad95dde8b8bfa4';
const PUB = 'https://publicassets.foreplay.co';

export const b2bSaasData: IndustryPageData = {
  slug: 'b2b-saas',

  hero: {
    subtitle: 'ISSO For B2B & SaaS',
    headline: 'Turn competitor insights into your B2B growth channel',
    paragraph:
      'Stop donating your paid budget on stale concepts and generic messaging. ISSO gives SaaS marketers and demand gen teams the power to test, iterate, and scale creative faster.',
  },

  clientLogos: [
    { src: `${CDN}/690bc99a68a9ffaa9d6fee09_triple_whale_logo.jpg`, alt: 'triple whale logo' },
    { src: `${CDN}/690bc9b7d41847c9eafe87b3_sezzle_logo.jpg`, alt: 'sezzle logo' },
    { src: `${CDN}/690bc9e20892424ea044e22b_ahrefs_logo.jpg`, alt: 'ahrefs logo' },
    { src: `${CDN}/690bcd451ce334134df729ae_joinslash_logo.jpg`, alt: 'slash logo' },
    { src: `${CDN}/690bce6442990728d246899e_rokt_logo.jpg`, alt: 'rokt logo' },
    { src: `${CDN}/690bcf953199334582aebe50_wizainc_logo.jpg`, alt: 'wiza logo' },
  ],

  testimonials: {
    sectionTitle: 'Trusted by acquisition focused B2B software companies',
    items: [
      {
        companyUrl: 'https://wiza.com/',
        logoSrc: `${CDN}/690bc7817130edbb280695c5_wiza-logo.svg`,
        logoAlt: 'Wiza logo',
        quote:
          '"Implementing the complete ISSO workflow transformed our Meta advertising from a cost center to an acquisition machine."',
        headshot: `${CDN}/690bc6ed1bcc3bdfb56f3762_1750214304476.jpg`,
        name: 'Stephen Hakami',
        title: 'Founder @ Wiza',
        screenshotSrc: `${CDN}/690bc95032ed47769365d33b_wiza-photo-2.webp`,
      },
      {
        companyUrl: 'https://www.perspective.co/',
        logoSrc: `${CDN}/690ccdf63ab25cef4f8f26e4_perspective-logo.webp`,
        logoAlt: 'Perspective logo',
        quote:
          '"ISSO transformed how our team collaborates on creative strategy, sparking fresh Meta ad ideas daily, our main growth driver."',
        headshot: `${CDN}/690ccbd2d2e64d19b85c517d_T02SEBT8V-U03JWEBPWUV-9255c91735ee-512.png`,
        name: 'Niels Klement',
        title: 'CMO @ Perspective',
        screenshotSrc: `${CDN}/690cd102b59a7ef6ec897629_perspective-image-2.webp`,
      },
      {
        companyUrl: 'https://fermat.com/',
        logoSrc: `${CDN}/690ccf92e19129d551045dc7_fermat-logo.svg`,
        logoAlt: 'FERMAT logo',
        quote:
          '"We use ISSO different then most. The API is our #1 enrichment source for our sales team to qualify and customize prospecting and outbound."',
        headshot: `${CDN}/690ccf5dace9185c1cc4afa9_1657044445897.jpg`,
        name: 'Rabah Rahil',
        title: 'CMO @ FERMAT',
        screenshotSrc: `${CDN}/690cd10156728e58058799b0_fermat-image.webp`,
      },
    ],
  },

  features: {
    subtitle: '5 Apps in One',
    title: 'The creative operating system for SaaS growth',
    paragraph:
      'From competitor intelligence to creative analytics, ISSO keeps your funnel full and your creative strategy moving up and to the right.',
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
    subtitle: 'Software Advertising Inspiration',
    title: 'Browse top performing B2B software ads',
    ctaText: 'Browse over 100k B2B SaaS Ads',
    items: [
      {
        brand: {
          name: 'Replit',
          avatarSrc: `${CDN}/690cd225bfd8956971906051_repl_it_logo.jpg`,
        },
        duration: '203D',
        imageSrc: `${CDN}/690cd4ab38c09aef33cde9bd_ad-replit.webp`,
      },
      {
        brand: {
          name: 'Slack',
          avatarSrc: `${CDN}/690cd21f1ef2593bd7a81865_tiny_spec_inc_logo.jpg`,
        },
        duration: '7D',
        imageSrc: `${CDN}/690cd4abc81dbe47ed42d798_ad-slack.webp`,
      },
      {
        brand: {
          name: 'Hyros',
          avatarSrc: `${CDN}/690cd21f032067480cfc27df_hyros_software_logo.jpg`,
        },
        duration: '109D',
        imageSrc: `${CDN}/690cd4ab117b0b999b31a860_ad-hyros.webp`,
      },
    ],
  },

  bottomCta: {
    headline: 'Ready for profitable paid acquisition?',
    paragraph:
      'Unlock the power of ISSO for your SaaS GTM. Discover, launch and analyze winning ads with an unrestricted 7-Day free trial.',
  },
};
