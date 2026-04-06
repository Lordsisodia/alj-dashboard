import type { ProductPageData } from '../types';
import { CDN, ASSETS } from '@/lib/cdn';

export const lensData: ProductPageData = {
  slug: 'lens',
  hero: {
    subtitle: 'Agents',
    headline: 'See exactly what your AI team is building - and what\'s working.',
    paragraph: 'Your dedicated agent team works 24/7. Track what they\'ve done, request what you need - built in 72hrs.',
    ctaHref: 'https://siso.ai/sign-up',
    animatedIconVideoSrc: `${ASSETS}/animated-icon-lens.webm`,
    staticIconSrc: `${CDN}/682f9f725170de3b3258d310_pi-lens-hq.webp`,
    heroVideoSrc: `${CDN}%2F68338afa127062351d6e99da_product-video-lens-transcode.mp4`,
    heroVideoPoster: `${CDN}%2F68338afa127062351d6e99da_product-video-lens-poster-00001.jpg`,
    mockupSrc: `${CDN}/6820c07c2e5b8c350c8e1f4c_hero-empty-mockup.webp`,
  },
  beforeAfter: {
    sectionTitle: 'Why do agencies need dedicated AI agents?',
    sectionParagraph: 'Most agencies run blind - no visibility into what\'s being built, no way to request changes fast. ISSO Agents fix that.',
    before: {
      label: 'Before ...',
      description: 'Chasing updates across Slack threads, spreadsheets, and guesswork.',
      imageSrc: `${CDN}/682e02bbc356a16526b39201_before-spyder.webp`,
    },
    after: {
      label: 'After ISSO',
      description: 'One dashboard. Every agent, every insight, every build - live.',
      imageSrc: `${CDN}/682e02bbb206d4bd3ae644fe_after-spyder.webp`,
    },
  },
  useCases: {
    subtitle: 'Use Cases',
    title: 'Your AI team, fully visible',
    paragraph: 'Agents is the command centre for your AI operation - see what\'s running, what\'s been built, and what\'s coming next.',
    items: [
      {
        title: 'Track Agent Activity Live',
        description: 'See every task your agents are working on in real time - no black boxes, no surprises.',
        imageSrc: `${CDN}/6453d07eaf4c84835bc3640a_itterate-velocity.webp`,
      },
      {
        title: 'Request Custom Features',
        description: 'Need something built for your agency or a specific creator? Submit a request. Delivered in 72hrs.',
        imageSrc: `${CDN}/6474cb2a6d47ed343b8907bf_multiple-brands-2.webp`,
      },
      {
        title: 'Surface What\'s Working',
        description: 'Agents automatically flag which reels, creators, and content pipelines are driving results.',
        imageSrc: `${CDN}/6474cb43476077e17c97ca8b_brief-deadline.webp`,
      },
      {
        title: 'Scale Across Creators',
        description: 'One agent team managing insights and automation across every model in your roster.',
        imageSrc: `${CDN}/6453d07e922f8a155fff9eba_dynamic-deliverables.webp`,
      },
    ],
  },
  coreFeatures: {
    subtitle: 'Core Features',
    title: 'Full transparency into your AI operation',
    paragraph: 'Agents gives you a live feed of everything your AI team is working on - performance tracking, insight surfacing, and custom builds on demand.',
    tabs: [
      {
        label: 'Agent Activity Feed',
        svgContent: `<svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M12 3L14.5 8.5L21 9.5L16.5 14L17.5 21L12 18L6.5 21L7.5 14L3 9.5L9.5 8.5L12 3Z" stroke="white" stroke-width="1.66667" stroke-linejoin="round"/></svg>`,
        imageSrc: `${CDN}/682e02bb5956e6397077a270_after-briefs.webp`,
      },
      {
        label: 'Performance Insights',
        svgContent: `<svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><rect x="3" y="4" width="18" height="16" rx="2" stroke="white" stroke-width="1.66667"/><path d="M3 9H21M8 14H11M8 17H14" stroke="white" stroke-width="1.66667" stroke-linecap="round"/></svg>`,
        imageSrc: `${CDN}/682e02bb5956e6397077a270_after-briefs.webp`,
      },
      {
        label: 'Custom Feature Requests',
        svgContent: `<svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><circle cx="12" cy="8" r="4" stroke="white" stroke-width="1.66667"/><path d="M6 20C6 16.6863 8.68629 14 12 14C15.3137 14 18 16.6863 18 20" stroke="white" stroke-width="1.66667" stroke-linecap="round"/></svg>`,
        imageSrc: `${CDN}/682e02bb5956e6397077a270_after-briefs.webp`,
      },
    ],
  },
  smartFeatures: {
    subtitle: 'All Features',
    title: 'Everything your agent team does, visible',
    paragraph: 'From live task tracking to custom builds - Agents puts your full AI operation in one place.',
    row1: [
      {
        imageSrc: `${CDN}/645186758b63b0137bd005d0_Real-Time%20Activity-5.png`,
        title: 'Live Agent Feed',
        description: 'See what every agent is working on right now - tasks in progress, completed, and queued.',
      },
      {
        imageSrc: `${CDN}/6451d1e93e756110132e66ad_Team%20Commenting.webp`,
        title: 'Insight Digests',
        description: 'Agents surface key findings from your content pipeline - delivered as clear, actionable summaries.',
      },
      {
        imageSrc: `${CDN}/6451d1f1d8e29bb7aec06775_Embed%20in%20Notion.webp`,
        title: 'Build Log',
        description: 'Every feature and automation your agents have built - documented and searchable.',
      },
      {
        imageSrc: `${CDN}/6451d6459aadc0c4b1ee27eb_Landing%20Page%20Screenshot.webp`,
        title: 'Creator Performance View',
        description: 'Per-model analytics showing which creators are growing and which content is converting.',
      },
      {
        imageSrc: `${CDN}/6451d645f6f0ee84bb0f170a_Ai%20Search.webp`,
        title: 'Natural Language Search',
        description: 'Ask your agents anything - find insights, past builds, or performance data in plain English.',
      },
      {
        imageSrc: `${CDN}/64518894857cf21aa6e1b607_Share%20with%20Anyone.webp`,
        title: 'Share with Your Team',
        description: 'Share agent reports and insight digests with managers or clients via a simple link.',
      },
    ],
    testimonial1: {
      logoSrc: '',
      logoAlt: '',
      quote: '',
      authorName: '',
      authorTitle: '',
      authorHeadshot: '',
    },
    row2: [
      {
        imageSrc: `${CDN}/645186758b63b0137bd005d0_Real-Time%20Activity-5.png`,
        title: '72hr Custom Builds',
        description: 'Request a new automation or feature. Your agents scope it and ship it within 72hrs.',
      },
      {
        imageSrc: `${CDN}/6451d1e93e756110132e66ad_Team%20Commenting.webp`,
        title: 'Content Pipeline Monitoring',
        description: 'Track your reels pipeline end-to-end - generation, approval, and publish status in one view.',
      },
      {
        imageSrc: `${CDN}/6451d1f1d8e29bb7aec06775_Embed%20in%20Notion.webp`,
        title: 'Approval Workflow Tracking',
        description: 'See which reels are pending manager review and which have been approved for each model.',
      },
      {
        imageSrc: `${CDN}/6451d6459aadc0c4b1ee27eb_Landing%20Page%20Screenshot.webp`,
        title: 'Agency-Wide Overview',
        description: 'One dashboard across all your creators - spot issues before they become problems.',
      },
      {
        imageSrc: `${CDN}/6451d645f6f0ee84bb0f170a_Ai%20Search.webp`,
        title: 'Automated Alerts',
        description: 'Get notified when agent tasks complete, insights surface, or builds are ready to review.',
      },
      {
        imageSrc: `${CDN}/64518894857cf21aa6e1b607_Share%20with%20Anyone.webp`,
        title: 'Export & Document',
        description: 'Export agent activity logs and performance reports to share with your team or clients.',
      },
    ],
    testimonial2: {
      logoSrc: '',
      logoAlt: '',
      quote: '',
      authorName: '',
      authorTitle: '',
      authorHeadshot: '',
    },
  },
  embeddedCta: {
    headline: 'Start with a 7-day free trial',
    paragraph: "Agents comes with ISSO's full suite - Hub, Intelligence, Recon, and Content Gen.\n\nOne platform running your entire operation.",
    primaryCtaText: 'Start',
    primaryCtaHref: 'https://siso.ai/sign-up',
    showNoCcBadge: true,
    videoSrc: `${ASSETS}/cta-lens.mov`,
    iconSrc: `${CDN}/682f93b44b8360f413644eb7_iso-briefs.webp`,
  },
  faq: {
    sectionTitle: 'Questions about Agents?',
    sectionParagraph: 'Most frequent questions about ISSO Agents - your dedicated AI team for model management and OFM agencies.',
    items: [
      {
        question: 'What are ISSO Agents?',
        answer: 'ISSO Agents are your dedicated AI team - running 24/7 to track performance, surface insights, and build custom automations for your agency. You see everything they\'re working on in one dashboard. Think of it as hiring a full technical ops team that never sleeps.',
      },
      {
        question: 'What does "72hr custom builds" actually mean?',
        answer: 'Submit a feature request through Agents - a new automation, a custom report, a workflow integration, or anything your agency needs built. Your agent team scopes it and ships it within 72 hours. No dev meetings, no back-and-forth, no waiting weeks.',
      },
      {
        question: 'Can I see what the agents are doing right now?',
        answer: 'Yes. The live agent feed shows every task in progress, completed, and queued - across your entire content pipeline and creator roster. No black boxes. You always know what\'s being worked on.',
      },
      {
        question: 'What kind of things can I request agents to build?',
        answer: 'Anything that would make your agency run smoother - custom reporting dashboards, automation triggers, new data pipelines, integrations with tools you already use, or workflow fixes. If it can be built, your agent team will scope and deliver it within 72 hours.',
      },
      {
        question: 'How does Agents help with creator management?',
        answer: 'Agents tracks per-model performance, monitors your content pipeline, flags approval bottlenecks, and surfaces which creators and reels are driving results - automatically. Instead of you piecing together data from spreadsheets, the agents do it and present you the findings.',
      },
      {
        question: 'Does Agents work across multiple models and managers?',
        answer: 'Yes. Agents gives you an agency-wide view across every creator on your roster, with role-based access so managers see what\'s relevant to them. One view for the agency owner, filtered views for each manager.',
      },
      {
        question: 'How is Agents different from the other ISSO tools?',
        answer: 'Hub, Intelligence, Recon, and Content Gen are tools you use directly. Agents is your dedicated team operating those tools and the infrastructure underneath - analysing data, building automations, and continuously improving your pipeline. The tools give you capability; Agents gives you execution.',
      },
    ],
  },
  bottomCta: {
    headline: 'Start with ISSO today',
    paragraph: "Agents comes with ISSO's full suite - Hub, Intelligence, Recon, and Content Gen. Everything your agency needs to run on autopilot.",
    primaryCtaText: 'Start',
    primaryCtaHref: 'https://siso.ai/sign-up',
    secondaryCtaText: 'No credit card required',
    secondaryCtaHref: '',
  },
};
