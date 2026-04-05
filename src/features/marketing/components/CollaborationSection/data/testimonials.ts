import { CDN } from '@/lib/cdn';

export type TestimonialPosition = { top: string; left?: string; right?: string };

export type Testimonial = {
  quote: string;
  name: string;
  title: string;
  avatar: string;
  position: TestimonialPosition;
};

export const TESTIMONIALS_RAY_1: Testimonial[] = [
  {
    quote: "ISSO is a key piece of how we find, save, review, and communicate around performance creative assets. It's really reduced a lot of friction in the process and has allowed us to review and save 10x more content than we would have otherwise.",
    name: "Connor MacDonald",
    title: "CMO @ Ridge Wallet",
    avatar: `${CDN}/6814ed829560f0bddedd81e3_6478c447be86e2342219433d_Connor%20MacDonald.webp`,
    position: { top: '12%', left: '60%' },
  },
  {
    quote: "My team uses it daily. Creative communication between performance teams, clients and strategists has always been a massive bottleneck. ISSO added structure & efficiency that simply let's everyone do their best work while cutting down needless back and forth.",
    name: "Nick Shackelford",
    title: "Founder @ Structured & Konstant Kreative",
    avatar: `${CDN}/646e13166ca538092d4c53fc_nick-shak.webp`,
    position: { top: '44%', left: '50%' },
  },
  {
    quote: "We use ISSO literally every day at our agency. It started as a simple way to collect ad inspiration but it has turned into such a crucial part of our workflow internally, but more importantly for client communication",
    name: "Savannah Sanchez",
    title: "Founder @ The Social Savannah",
    avatar: `${CDN}/68307355e138e6b0366b3a58_628EA4nu_400x400.png`,
    position: { top: '76%', left: '60%' },
  },
];

export const TESTIMONIALS_RAY_2: Testimonial[] = [
  {
    quote: "We operate in a highly competitive market, and every time I use Spyder, it feels like an unfair advantage. We have been using it since beta, and easily 90% of our winning ads come from Spyder insights.",
    name: "Stephen Hakami",
    title: "Founder @ Wiza",
    avatar: `${CDN}/6679ebddfad13bb59b5a8f25_TS2G1MWKZ-US2G1MXHD-eb1db3a0ea43-192.png`,
    position: { top: '39%', right: '36%' },
  },
  {
    quote: "This is the #1 tool in my facebook ads toolkit. I use it daily for creative strategy research, compiling content ideas for clients, and even personal content development. If you're trying to make better ad creative, ISSO is not just 'a nice to have'. It's a must.",
    name: "Dara Denney",
    title: "Director of Performance Creative",
    avatar: `${CDN}/646e7c53dd2b77ffdce88775_1671719386025.jpg`,
    position: { top: '10%', right: '50%' },
  },
  {
    quote: "Once we found ISSO it became our agencies one-stop shop for everything creative research and creative analysis. Lens specifically has catapulted our creative testing for the better.",
    name: "Christina Bell",
    title: "Growth Lead @ Webtopia",
    avatar: `${CDN}/68307166d8a07360e78b981a_Webtopia_Headshot_1080x1080_Christina.png`,
    position: { top: '53%', right: '40%' },
  },
  {
    quote: "Everyone who works in creative strategy knows 90% of your success ends in a brief with references. Every week I schedule time to build out moodboards for our projects. I do most of this work in ISSO since I can save content from anywhere including my mobile phone.",
    name: "Oren John",
    title: "Creative Director",
    avatar: `${CDN}/68307315081e73189935dab8_1706814091085.jpg`,
    position: { top: '70%', right: '50%' },
  },
];
