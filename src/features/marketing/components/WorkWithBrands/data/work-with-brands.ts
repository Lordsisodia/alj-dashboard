// WorkWithBrands page data - extracted from www_foreplay_co (25).html

const CDN = 'https://cdn.prod.website-files.com/62a4ed18ddad95dde8b8bfa4';

export interface WorkWithBrandsData {
  hero: {
    overline: string;
    headline: string;
    paragraph: string;
    logos: { src: string; alt: string }[];
  };
  bestSection: {
    headline: string;
    paragraph: string;
    imageSrc: string;
    imageSrcSet: string;
  };
  socialProof: {
    headline: string;
    paragraph: string;
    platforms: {
      name: string;
      rating: string;
      href: string;
      icon: 'g2' | 'chrome' | 'capterra';
    }[];
  };
  bottomCta: {
    headline: string;
    paragraph: string;
  };
}

export const workWithBrandsData: WorkWithBrandsData = {
  hero: {
    overline: 'FIND A BEST FIT MARKETING PARTNER FOR YOUR BRAND',
    headline: 'Work with Brands',
    paragraph:
      'Get clients and add world-class creative services to your agency. Work with the fastest growing brands. Build your empire, with ISSO.',
    logos: [
      { src: `${CDN}/688b6298b31d165cabb4f613_work-logo-hello-fresh.webp`, alt: 'Hello Fresh' },
      { src: `${CDN}/688b6298585107d4c043dc95_work-logo-canva.webp`, alt: 'Canva' },
      { src: `${CDN}/688b62989ae80e4a3b1bfa15_work-logo-vayner-media.webp`, alt: 'Vayner Media' },
      { src: `${CDN}/688b6298e2496c5e3f207e03_work-logo-pearmill.webp`, alt: 'Pearmill' },
      { src: `${CDN}/688b629848219ed53e3068e9_work-logo-paramount.webp`, alt: 'Paramount' },
      { src: `${CDN}/688b6298505fecedaf609070_work-logo-true-classic.webp`, alt: 'True Classic' },
      { src: `${CDN}/688b6298b53ef7d16e3538f5_work-logo-common-thread-collective.webp`, alt: 'Common Thread Collective' },
      { src: `${CDN}/688b62981fd02f73d1c39824_work-logo-ag1.webp`, alt: 'AG1' },
      { src: `${CDN}/688b62986d6c5f9871b82029_work-logo-growth-collective.webp`, alt: 'Growth Collective' },
    ],
  },

  bestSection: {
    headline: "The world's best marketers use ISSO",
    paragraph:
      'Get matched with marketing experts in your niche, the same marketing experts powering meteoric growth at the fastest growing brands.\nUnlock done for you ad creative strategy, from the best.',
    imageSrc: `${CDN}/688baa48834a09a6fb2242b7_5fc566ef4ffe8d9a1f4eb5c58376f9f7_work-with-brands-illo.webp`,
    imageSrcSet:
      `${CDN}/688baa48834a09a6fb2242b7_5fc566ef4ffe8d9a1f4eb5c58376f9f7_work-with-brands-illo-p-500.webp 500w,` +
      `${CDN}/688baa48834a09a6fb2242b7_5fc566ef4ffe8d9a1f4eb5c58376f9f7_work-with-brands-illo-p-800.webp 800w,` +
      `${CDN}/688baa48834a09a6fb2242b7_5fc566ef4ffe8d9a1f4eb5c58376f9f7_work-with-brands-illo-p-1080.webp 1080w,` +
      `${CDN}/688baa48834a09a6fb2242b7_5fc566ef4ffe8d9a1f4eb5c58376f9f7_work-with-brands-illo-p-1600.webp 1600w,` +
      `${CDN}/688baa48834a09a6fb2242b7_5fc566ef4ffe8d9a1f4eb5c58376f9f7_work-with-brands-illo.webp 2272w`,
  },

  socialProof: {
    headline: 'Loved by brands and agencies globally.',
    paragraph: "Don't just take our word for it, read our reviews or checkout the wall of love.",
    platforms: [
      {
        name: 'G2 REVIEWS',
        rating: '4.9/5',
        href: '#',
        icon: 'g2',
      },
      {
        name: 'CHROME',
        rating: '4.8/5',
        href: '#',
        icon: 'chrome',
      },
      {
        name: 'CAPTERRA',
        rating: '4.8/5',
        href: '#',
        icon: 'capterra',
      },
    ],
  },

  bottomCta: {
    headline: 'Ready to ship more winning ads?',
    paragraph: 'Unlock the power of ISSO with an unrestricted 7-Day free trial.',
  },
};
