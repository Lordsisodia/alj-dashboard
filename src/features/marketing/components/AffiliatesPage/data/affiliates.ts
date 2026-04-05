// AffiliatesPage data — extracted from www_foreplay_co (24).html

const CDN = 'https://cdn.prod.website-files.com/62a4ed18ddad95dde8b8bfa4';

export interface AffiliatesPageData {
  hero: {
    overline: string;
    headline: string;
    paragraph: string;
    ctaHref: string;
    ctaLabel: string;
  };
  steps: {
    cards: {
      title: string;
      imageSrc: string;
      imageAlt: string;
      imageSrcSet?: string;
      body: string;
    }[];
  };
  faq: {
    sectionTitle: string;
    sectionSubtitle: string;
    paragraph: string;
    items: {
      question: string;
      answer: string;
    }[];
  };
  bottomCta: {
    headline: string;
    paragraph: string;
  };
}

export const affiliatesData: AffiliatesPageData = {
  hero: {
    overline: 'Affiliate Program',
    headline: 'ISSO is better with friends',
    paragraph:
      "Helping each-other with no strings attached. Earn 20% on all new subscriptions you refer with no limit on how much you can earn.",
    ctaHref: 'https://foreplay.getrewardful.com/signup',
    ctaLabel: 'Become an Affiliate',
  },

  steps: {
    cards: [
      {
        title: '1. Signup Instantly',
        imageSrc: `${CDN}/6835eba827d5b7821771ad71_affiliate-1.webp`,
        imageAlt: 'ISSO affiliate signup',
        imageSrcSet: `${CDN}/6835eba827d5b7821771ad71_affiliate-1-p-500.webp 500w, ${CDN}/6835eba827d5b7821771ad71_affiliate-1.webp 768w`,
        body: "Once approved, we'll give you a unique affiliate link you can share on your website, blog, social media, videos — wherever.",
      },
      {
        title: '2. Share your love of ISSO',
        imageSrc: `${CDN}/6835eba8cb712c81db2fe4f7_affiliate-2.webp`,
        imageAlt: 'Share ISSO on socialmedia',
        imageSrcSet: `${CDN}/6835eba8cb712c81db2fe4f7_affiliate-2-p-500.webp 500w, ${CDN}/6835eba8cb712c81db2fe4f7_affiliate-2.webp 769w`,
        body: "The more you share, the more you earn. There's no limit to how much you can make, either per customer or overall as an affiliate.",
      },
      {
        title: '3. Get Paid',
        imageSrc: `${CDN}/6835eba861799402175d285e_affiliate-3.webp`,
        imageAlt: 'Get affiliate payouts',
        imageSrcSet: `${CDN}/6835eba861799402175d285e_affiliate-3-p-500.webp 500w, ${CDN}/6835eba861799402175d285e_affiliate-3.webp 769w`,
        body: "Across all plans, you'll earn 20% of all payments automatically for 12 months, including plan expansion.",
      },
    ],
  },

  faq: {
    sectionTitle: 'Affiliate program questions',
    sectionSubtitle: 'FAQ',
    paragraph: 'Find answers to common questions about our affiliate and creator program',
    items: [
      {
        question: 'Can I Advertise to Your Domain?',
        answer:
          'Running ad traffic directly to isso.co is strictly prohibited. If you would like to be a paid advertising affiliate, you must use your own advertorial, listicle or website.',
      },
      {
        question: 'How long is your cookie window?',
        answer:
          'If you send someone to our site, they will be tracked for 60 days. If they signup anytime within the 60 day window, you will unlock your 20% commission.',
      },
      {
        question: 'As an agency owner, can I use my affiliate link with my clients?',
        answer:
          "Absolutely! Feel free to use your affiliate link with anyone from clients, friends, online communities and more.",
      },
      {
        question: 'How do I get paid my commission?',
        answer:
          'We use <a href="https://getrewardful.com/" target="_blank" rel="noopener noreferrer">Rewardful</a> to manage our affiliate program. Once you sign-up you will be asked to link your PayPal account. Once that is complete you will be paid out at the end of each month.',
      },
    ],
  },

  bottomCta: {
    headline: 'Start earning with ISSO today',
    paragraph:
      'Join our affiliate program and earn 20% recurring commission on every subscription you refer. No limits, no caps.',
  },
};
