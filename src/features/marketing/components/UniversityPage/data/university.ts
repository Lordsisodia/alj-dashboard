// UniversityPage data - extracted from www_foreplay_co (17).html

const CDN = 'https://cdn.prod.website-files.com/62a4ed18ddad95dde8b8bfa4';

export interface UniversityCourse {
  title: string;
  wordmarkSrc: string;
  wordmarkAlt: string;
  href: string;
  isReady: boolean;
  videoPlaySrc?: string;
}

export interface UniversityPageData {
  meta: {
    title: string;
    description: string;
  };
  hero: {
    logoSrc: string;
    logoAlt: string;
    headline: string;
    courses: UniversityCourse[];
  };
  campus: {
    logoSrc: string;
    logoAlt: string;
    title: string;
    paragraphs: string[];
    imageSrc: string;
    imageAlt: string;
  };
  professor: {
    imageSrc: string;
    imageAlt: string;
    title: string;
    paragraph: string;
    ctaText: string;
    ctaHref: string;
  };
  bottomCta: {
    headline: string;
    paragraph: string;
    primaryCtaText: string;
    primaryCtaHref: string;
    secondaryCtaText: string;
    secondaryCtaHref: string;
  };
}

export const universityData: UniversityPageData = {
  meta: {
    title: 'ISSO University - Performance Marketing & Creative Masterclasses',
    description:
      "Become a pro with free marketing & advertising masterclasses led by today's leading voices in performance marketing, e-commerce, and creative.",
  },

  hero: {
    logoSrc: `${CDN}/670fd3ca6faff7ca0dab1805_fu-logo-full.svg`,
    logoAlt: 'ISSO university logo',
    headline: 'Become a pro with free marketing & advertising masterclasses',
    courses: [
      {
        title: 'Coming Soon',
        wordmarkSrc: '',
        wordmarkAlt: '',
        href: '#',
        isReady: false,
      },
      {
        title: 'Coming Soon',
        wordmarkSrc: '',
        wordmarkAlt: '',
        href: '#',
        isReady: false,
      },
      {
        title: 'Psychology in Advertising',
        wordmarkSrc: `${CDN}/6716a79cb8150ee15297cbdd_psychology-in-advertising-wordmark.svg`,
        wordmarkAlt: 'psychology in advertising course',
        href: '/university/psychology-in-advertising',
        isReady: true,
        videoPlaySrc: `${CDN}/6716b43bc943259847c9212a_play-icon-blue.svg`,
      },
      {
        title: 'Coming Soon',
        wordmarkSrc: '',
        wordmarkAlt: '',
        href: '#',
        isReady: false,
      },
      {
        title: 'Coming Soon',
        wordmarkSrc: '',
        wordmarkAlt: '',
        href: '#',
        isReady: false,
      },
    ],
  },

  campus: {
    logoSrc: `${CDN}/670fd3ca6faff7ca0dab1805_fu-logo-full.svg`,
    logoAlt: 'ISSO university logo',
    title: 'Welcome to Your Campus',
    paragraphs: [
      'Here to help you stay on top of trends, crush creative strategy, and ride the AI waves like a pro.',
      "Think of ISSO University as your backstage pass to marketing's coolest ideas, straight from the sharpest minds in the game.",
      "The best part? It's 100% free.",
    ],
    imageSrc: `${CDN}/6718fae17ad24b460a6924a4_campus-photo.png`,
    imageAlt: 'ISSO university campus',
  },

  professor: {
    imageSrc: `${CDN}/671914cc4802cf20d73e78df_become-professor-2.png`,
    imageAlt: 'become a professor graphic',
    title: 'Become a Professor and Access 100,000+ Marketers',
    paragraph:
      'Do you have a killer process, workflow or app you want to share? Become a ISSO University professor to share your knowledge.',
    ctaText: 'Apply Now',
    ctaHref: 'https://forms.gle/BjqX45o2nYzsgV9g6',
  },

  bottomCta: {
    headline: 'Ready to ship more winning ads?',
    paragraph: 'Unlock the power of ISSO with an unrestricted 7-Day free trial.',
    primaryCtaText: 'Join SISO',
    primaryCtaHref: 'https://app.isso.co/sign-up',
    secondaryCtaText: 'View Pricing',
    secondaryCtaHref: '/pricing',
  },
};
