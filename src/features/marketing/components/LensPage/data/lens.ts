import { LensData } from '../types';

const CDN = 'https://cdn.prod.website-files.com/62a4ed18ddad95dde8b8bfa4';
const PUBLIC = 'https://publicassets.foreplay.co';

export const lensData: LensData = {
  hero: {
    headline: 'Performance insights through a creative lens.',
    subtext:
      'Unlock growth from your paid advertising with powerful creative reporting that your team & brands love using.',
    ctaText: 'Start free trial',
    ctaHref: 'https://app.isso.co/sign-up',
    videoWebm: `${PUBLIC}/animated-icon-lens.webm`,
    videoMp4: `${PUBLIC}/animated-icon-lens.mov`,
    posterUrl: `${CDN}/682f9f725170de3b3258d310_pi-lens-hq.webp`,
    mockupUrl: `${CDN}/6820c07c2e5b8c350c8e1f4c_hero-empty-mockup.webp`,
    videoMp4Src: `${CDN}/68338afa127062351d6e99da_product-video-lens-transcode.mp4`,
    videoWebmSrc: `${CDN}/68338afa127062351d6e99da_product-video-lens-transcode.webm`,
    lightboxVideoUrl: 'https://youtube.com/watch?v=93_VRP1c_a4',
    lightboxLabel: 'Watch Video',
    lightboxSubtext: 'Learn more about Lens.',
  },

  solutionIcons: [
    {
      title: 'Automated Reporting',
      description: 'Quickly create and share creative reports by any segment or metric.',
      svgPath:
        'M9.33 17.33v1a2 2 0 0 1-2 2H5.67a2 2 0 0 1-2-2V5.67c0-1.1.9-2 2-2h1.66a2 2 0 0 1 2 2v1M14.67 17.33v1c0 1.1.9 2 2 2h1.66a2 2 0 0 0 2-2V5.67a2 2 0 0 0-2-2h-1.66a2 2 0 0 0-2 2v1 M16.33 10.67l-2.16 2.66-4.34-2.66-2.16 2.67',
    },
    {
      title: 'Goal Tracking',
      description: 'Gamify and incentivize teams to outperform your goals.',
      svgPath:
        'M21 12a9 9 0 1 1-9-9m4.771 10.5A5.002 5.002 0 0 1 7 12a5.002 5.002 0 0 1 3.5-4.771 M14 10h3.172a2 2 0 0 0 1.414-.586l2.628-2.628a.25.25 0 0 0-.098-.414L18.5 5.5l-.872-2.616a.25.25 0 0 0-.414-.098l-2.628 2.628A2 2 0 0 0 14 6.83V10Zm0 0l-2 2',
    },
    {
      title: 'Industry Benchmarking',
      description: 'Compare results with over 30,000 other advertisers.',
      svgPath: 'M7.2 12H2.4 M21.6 12h-4.8 M12 7.8v8.4',
    },
    {
      title: 'Automated Inspiration',
      description: 'Enable agents to research, ideate and iterate your advertising.',
      svgPath:
        'M18 20.25v-1m0-5.5v1m-1.95 3.38l-.86.5m4.76-2.75l.86-.5m-4.76.5l-.86-.5m4.76 2.74l.86.5 M20 17a2 2 0 0 0-2-2 2 2 0 1 0 2 2Z M3.67 18.33l3.65-3.65c.2-.2.5-.2.7 0l4.31 5.65m.59-11a1 1 0 1 1-2 0 1 1 0 0 1 2 0Z M12.33 20.33H5.67a2 2 0 0 1-2-2V5.67c0-1.1.9-2 2-2h12.66a2 2 0 0 1 2 2v4',
    },
  ],

  graphCards: [
    {
      title: 'Other Analytics Tools',
      description: 'Your performance should not mean you have to pay more.',
      legend: [
        { label: 'Ad Spend', color: 'teal' },
        { label: 'Analytics Cost', color: 'red' },
      ],
    },
    {
      title: 'Lens Analytics',
      description:
        "We're on the same team scale your account to the moon & enjoy flat pricing.",
      legend: [
        { label: 'Ad Spend', color: 'white' },
        { label: 'Lens Cost', color: 'rainbow' },
      ],
      isLens: true,
    },
  ],

  subtext:
    "Creativity is complex, but pricing doesn't have to be. Get the simplest self-serve pricing, with no strings attached.",

  testimonials: [
    {
      name: 'Daniel Bogulewski',
      title: 'Creative Director',
      company: 'Viasox',
      avatarUrl: `${CDN}/6835e653eb1107c0c2620fbf_iEUZ_Xb2_400x400.png`,
      quote:
        'Data presentation has always been difficult when looking at ads, but with Lens, it has made the team much more aligned when deciding how to optimize for the future. Combined with all of ISSO\u2019s other capabilities, this all in one tool has cut down on software bills, and given us clarity on what matters.',
    },
    {
      name: 'Luis Morales',
      title: 'Co-Founder',
      company: 'Growth Collective',
      avatarUrl: `${CDN}/6811334e209446a735395e88_TBGAMNA75-U04K4GJ1PS6-840aeda5bec0-512.jpg`,
      quote:
        'We can build client reports in minutes instead of hours, and the password-protected links make sharing updates fast, easy, and secure. No more messy PDFs or back-and-forth emails. Just clean, clear insights our clients love.',
    },
  ],

  integrationTabs: [
    {
      label: 'Creative Test Analysis',
      imageUrl: `${CDN}/68111d8e2cd08ba43e25c8f2_Creative%20Tests%20-%20Mockup%20-%202.png`,
    },
    {
      label: 'Group Comparison',
      imageUrl: `${CDN}/68111efbb122dcabfed9eb77_Influencer%20Comparison%20-%20Mockup%20-%202.png`,
    },
    {
      label: 'Trend Analysis',
      imageUrl: `${CDN}/68111efb4aca9a2da3e5b251_Trend%20Analysis%20-%20Mockup%20-%202.png`,
    },
  ],

  gamification: {
    overline: 'Gamification',
    title: 'Gamify and incentivize team reporting.',
    subtext:
      'Accelerate time to action by incentivizing creative that works. Unlock transparency over creative that performs, and create addicting real-time feedback loops.',
    ctaText: 'Start Free Trial',
    imageUrl: `${CDN}/67eeea66467dd9874bef129c_game-illo1.webp`,
  },

  benchmarks: {
    overline: 'Benchmarks',
    title: 'Compare your analytics to over 20,000+ advertisers.',
    subtext:
      'Get accurate, real-time benchmarks on your main KPIs (CPA, ROAS, CPC, CPM, conversion rate, etc.) compared to your competitors.',
    ctaText: 'Start Free Trial',
    imageUrl: `${CDN}/67eeea669886a4ee84fc6c9c_game-illo2.webp`,
  },

  benchmarkSegments: [
    { name: 'Art', imageUrl: `${CDN}/67d60138b8bfe229f1ca038b_segment-art.webp` },
    { name: 'Books', imageUrl: `${CDN}/67d60138e9944951698b6c80_segment-books.webp` },
    { name: 'Clothing', imageUrl: `${CDN}/67d6013895de9f5015615e0f_segment-clothing.webp` },
    { name: 'Electronics', imageUrl: `${CDN}/67d6013837ff54b81dc90b9b_segment-electronics.webp` },
    { name: 'Automative', imageUrl: `${CDN}/67d60139c5c4b283a4e32e32_segment-automotive.webp` },
    { name: 'Baby', imageUrl: `${CDN}/67d60138e9944951698b6c9a_segment-baby.webp` },
    { name: 'Toys & Hobbies', imageUrl: `${CDN}/67d60139e9d19b9bec6f9da3_segment-toys-%26-hobbies.webp` },
    { name: 'Beauty', imageUrl: `${CDN}/67d60138c432e9224ddd91c3_segment-beauty.webp` },
    { name: 'Food & Beverages', imageUrl: `${CDN}/67d601396d4c7e747e89fdec_segment-food-%26-beverage.webp` },
    { name: 'Sporting Goods', imageUrl: `${CDN}/67d601396d4c7e747e89fe11_segment-sporting-goods.webp` },
    { name: 'Fashion', imageUrl: `${CDN}/67d60138178881123c43aaac_segment-fashion.webp` },
    { name: 'Accessories', imageUrl: `${CDN}/67d60138748485a56d5812b5_segment-accessories.webp` },
    { name: 'Pets', imageUrl: `${CDN}/67d60138d1a411f5bd2fa9a8_segment-pets.webp` },
    { name: 'Home & Garden', imageUrl: `${CDN}/67d60139a79f0c901c5db349_segment-home-%26-garden.webp` },
    { name: 'Health', imageUrl: `${CDN}/67d601396d4c7e747e89fdf3_segment-health.webp` },
  ],

  benchmarkBadges: [
    { value: '> $1m', label: 'GMV' },
    { value: '<$100', label: 'AOV', isGreen: true },
    { value: '$1m - $10m', label: 'GMV' },
    { value: '>$100', label: 'AOV', isGreen: true },
    { value: '> $10m', label: 'GMV' },
  ],

  enrichmentTools: [
    {
      name: 'Persona Targeting',
      description: 'Let AI tag your creatives with the persona they are speaking too.',
      imageUrl: `${CDN}/67d5f04eed5716afa723bf49_tooltip-2.webp`,
    },
    {
      name: 'Hook Transcription',
      description: 'Automatically transcribe and identify top performing hooks.',
      imageUrl: `${CDN}/67d5f04e6bfc757685daf9fd_tooltip-1.webp`,
    },
    {
      name: 'Top Themes',
      description: 'See what themes and styles you should double down on.',
      imageUrl: `${CDN}/67d5f04fa76aa2b2af723a0e_tooltip-3.webp`,
    },
    {
      name: 'Manual Rating',
      description: 'Level up your creative organization with internal ratings.',
      imageUrl: `${CDN}/67d5f04ea79f0c901c510881_tooltip-4.webp`,
    },
    {
      name: 'Custom Tagging',
      description: 'Quickly add custom tags by creative ID for report creation.',
      imageUrl: `${CDN}/67d5f04e5057b3fadc63d8f1_tooltip-5.webp`,
    },
    {
      name: 'Video Transcription',
      description: 'All videos are automatically transcribed with AI.',
      imageUrl: `${CDN}/67d5f04f5057b3fadc63d92b_tooltip-6.webp`,
    },
    {
      name: 'Facial Recognition',
      description: 'See what creators in influencers perform across your entire account.',
      imageUrl: `${CDN}/67d5f04edef0ff09efcaf290_tooltip-7.webp`,
    },
  ],

  securityCards: [
    {
      title: 'Password Protection',
      description: 'Avoid your creative data leaking through unsecured report links.',
      imageUrl: `${CDN}/67d5c49be9d19b9bec42f1dc_password-protection.webp`,
      svgPath:
        'M16.71 9.43a.86.86 0 0 0-1.71 0v5.14a.86.86 0 1 0 1.71 0V9.43Z M19.71 16.11V7.85c0-.45 0-.84-.02-1.16a2.62 2.62 0 0 0-.26-1 2.57 2.57 0 0 0-1.12-1.12 2.62 2.62 0 0 0-1-.26c-.32-.02-.71-.02-1.16-.02h-8.3c-.45 0-.84 0-1.16.02a2.53 2.53 0 0 0-2.38 2.38c-.02.32-.02.71-.02 1.16v8.3c0 .45 0 .84.02 1.16a2.53 2.53 0 0 0 2.38 2.38c.32.02.71.02 1.16.02h8.3c.45 0 .84 0 1.16-.02a2.53 2.53 0 0 0 2.38-2.38c.02-.32.02-.71.02-1.16v-.04Zm-1.71 0V7.9c0-.5 0-.82-.02-1.06a.98.98 0 0 0-.07-.36.86.86 0 0 0-.38-.38.98.98 0 0 0-.36-.07C16.93 6 16.61 6 16.11 6H7.9c-.5 0-.82 0-1.06.02a.98.98 0 0 0-.36.07.86.86 0 0 0-.38.38.98.98 0 0 0-.07.36C6 7.07 6 7.39 6 7.89v8.22c0 .5 0 .82.02 1.06.02.23.05.32.07.36.09.16.22.3.38.38.04.02.13.05.36.07.24.02.56.02 1.06.02h8.22c.5 0 .82 0 1.06-.02a.98.98 0 0 0 .36-.07c.16-.09.3-.22.38-.38a.98.98 0 0 0 .07-.36c.02-.24.02-.56.02-1.06Z M10 12a1.5 1.5 0 1 1-3 0 1.5 1.5 0 0 1 3 0Zm4 0a1.5 1.5 0 1 1-3 0 1.5 1.5 0 0 1 3 0Z',
    },
    {
      title: 'IP Tracking',
      description: "See who's viewing your reports and from where.",
      imageUrl: `${CDN}/67d5c49b6bfc757685b68eac_ip-tracking.webp`,
      svgPath:
        'M7.29 8.57a1.71 1.71 0 1 0 0-3.43 1.71 1.71 0 0 0 0 3.43ZM7.29 18.86a1.71 1.71 0 1 0 0-3.43 1.71 1.71 0 0 0 0 3.43ZM16.71 18.86a1.71 1.71 0 1 0 0-3.43 1.71 1.71 0 0 0 0 3.43ZM7.29 8.57v6.86 M16.71 11.14v4.29 M15.21 5.36l3 3m0-3l-3 3',
    },
    {
      title: 'Internal Protection',
      description:
        'All Lens data remains secure and partitioned from research & benchmarking products.',
      imageUrl: `${CDN}/67d5c49c9a3768e0b81621f5_internal-protection.webp`,
      svgPath:
        'm9.86 11.79 1.28 1.28 3-3m4.72 1.86V7.87c0-.74-.47-1.39-1.16-1.62l-5.14-1.77a1.71 1.71 0 0 0-1.12 0L6.3 6.25c-.7.23-1.16.88-1.16 1.62v4.06c0 4.26 3.43 6.07 6.86 7.92 3.43-1.85 6.86-3.66 6.86-7.92Z',
    },
  ],

  embeddedCta: {
    headline: 'Get a 7-Day free trial today',
    subtext:
      "Lens comes with ISSO's full suite of tools for creative analytics, research, competitor tracking and inspiration.\n\nDelightfully all in one place.",
    ctaText: 'Start Free Trial',
    ctaHref: 'https://app.isso.co/sign-up',
    videoMp4: `${PUBLIC}/cta-lens.mp4`,
    isoImageUrl: `${CDN}/682f93b43a94db00dbc45367_iso-lens.webp`,
  },
};
