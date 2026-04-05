import type { ProductPageData } from '../types';
import { CDN, ASSETS } from '@/lib/cdn';

export const briefsData: ProductPageData = {
  slug: 'briefs',
  hero: {
    subtitle: 'Content Gen',
    headline: 'Go from insight to published reel in minutes',
    paragraph: 'Stop building content manually. ISSO Content Gen takes Intelligence data and generates production-ready reels — scripts, storyboards, and batch video — ready to publish.',
    ctaHref: 'https://siso.ai/sign-up',
    animatedIconVideoSrc: `${ASSETS}/animated-icon-briefs.webm`,
    staticIconSrc: `${CDN}/682f9f72dc306ab5bf957aea_pi-briefs-hq.webp`,
    heroVideoSrc: `${ASSETS}/!Briefs-2025_high.webm`,
    heroVideoPoster: `${CDN}%2F68338ad5ea21a80a4e3fe221_product-video-briefs-poster-00001.jpg`,
    mockupSrc: `${CDN}/6820c07c2e5b8c350c8e1f4c_hero-empty-mockup.webp`,
  },
  beforeAfter: {
    sectionTitle: 'Why do you need an AI video pipeline?',
    sectionParagraph: 'Stop bouncing between Canva, ChatGPT, and your DMs trying to coordinate content. ISSO Content Gen gives your agency a repeatable, scalable reel production pipeline.',
    before: {
      label: 'Before ...',
      description: 'Manual scripts, slow approvals, inconsistent output across models.',
      imageSrc: `${CDN}/682dfe3aacd1e2e93f141aee_before-briefs.webp`,
    },
    after: {
      label: 'After ISSO',
      description: 'AI generates the content. You approve it. Reels go out the same day.',
      imageSrc: `${CDN}/682e02bb5956e6397077a270_after-briefs.webp`,
    },
  },
  useCases: {
    subtitle: 'Use Cases',
    title: 'The production engine for model management agencies',
    paragraph: 'Content Gen closes the loop — it takes what Intelligence and Recon found, and turns it into reels your models can post today.',
    items: [
      {
        title: 'AI Script Generation',
        description: 'Generate platform-native scripts for each model based on what is trending in their niche.',
        imageSrc: `${CDN}/64542080cff603563db5f72_edit%20copy-2.webp`,
      },
      {
        title: 'Storyboarding',
        description: 'Turn a script into a shot-by-shot storyboard, ready to hand off for production or AI generation.',
        imageSrc: `${CDN}/645420809ed898e0a2e34a9e_multi-language-2.webp`,
      },
      {
        title: 'Batch Reel Generation',
        description: 'Run Kling, Higgsfield, and Replicate in batch — generate a week of content in one session.',
        imageSrc: `${CDN}/6474dfaa93a6291dbec99294_upload%20assets-4.webp`,
      },
    ],
  },
  coreFeatures: {
    subtitle: 'Core Features',
    title: 'Your AI content pipeline, end to end',
    paragraph: 'From first script line to final reel export — Content Gen handles the production so your team can focus on strategy and growth.',
    tabs: [
      {
        label: 'AI Reel Scripts',
        svgContent: `<svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M12 3L14.5 8.5L21 9.5L16.5 14L17.5 21L12 18L6.5 21L7.5 14L3 9.5L9.5 8.5L12 3Z" stroke="white" stroke-width="1.66667" stroke-linejoin="round"/></svg>`,
        imageSrc: `${CDN}/682e02bb5956e6397077a270_after-briefs.webp`,
      },
      {
        label: 'Storyboard Generation',
        svgContent: `<svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><rect x="3" y="4" width="18" height="16" rx="2" stroke="white" stroke-width="1.66667"/><path d="M3 9H21M8 14H11M8 17H14" stroke="white" stroke-width="1.66667" stroke-linecap="round"/></svg>`,
        imageSrc: `${CDN}/682e02bb5956e6397077a270_after-briefs.webp`,
      },
      {
        label: 'Model Profiles',
        svgContent: `<svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><circle cx="12" cy="8" r="4" stroke="white" stroke-width="1.66667"/><path d="M6 20C6 16.6863 8.68629 14 12 14C15.3137 14 18 16.6863 18 20" stroke="white" stroke-width="1.66667" stroke-linecap="round"/></svg>`,
        imageSrc: `${CDN}/682e02bb5956e6397077a270_after-briefs.webp`,
      },
    ],
  },
  smartFeatures: {
    subtitle: 'All Features',
    title: "A content pipeline that actually ships",
    paragraph: 'Built for agencies running multiple models at once. Content Gen keeps production moving without the back-and-forth.',
    row1: [
      {
        imageSrc: `${CDN}/645405e3a1cdeeb67fce56d3_attach-inspo.webp`,
        title: 'Attach Reel Inspiration',
        description: 'Pull top-performing reels from Recon directly into your content brief.',
      },
      {
        imageSrc: `${CDN}/6474dfaa2e9a4a5888f31dcd_brand-guidelines.webp`,
        title: 'Model Profiles',
        description: 'Store each model\'s style, tone, and niche. Inject into scripts with one click.',
      },
      {
        imageSrc: `${CDN}/645405e3fbeb9258c2385d11_modular-editor.webp`,
        title: 'Modular Script Editor',
        description: 'Build scripts from reusable blocks — hooks, CTAs, scene descriptions.',
      },
      {
        imageSrc: `${CDN}/645405e354900dd97b639df3_export-brief.webp`,
        title: 'Export Everywhere',
        description: 'Export scripts and storyboards to PDF, Sheets, or directly to your models.',
      },
      {
        imageSrc: `${CDN}/645405e32a498148618e56fa_brief-template.webp`,
        title: 'Content Templates',
        description: 'Build reusable script formats per niche — save and reuse across your roster.',
      },
      {
        imageSrc: `${CDN}/645405e3a367f05e79030230_brief-share.webp`,
        title: 'Share with Models',
        description: 'Send a link to any model, manager, or creator — no login required.',
      },
    ],
    testimonial1: {
      logoSrc: `${CDN}/6478c6a9d904f44339a39b5f_63cd2aa75c56b2db086ad38b_LOGO%20BLUE-p-500.webp`,
      logoAlt: 'Envu Media logo',
      quote: '"If you\'re not using ISSO Content Gen you\'re already behind. What used to take our team days — briefing models, coordinating scripts, waiting on edits — now takes an hour. We go from a trending reel to a published video the same day. It\'s the only content pipeline built for how agencies actually operate."',
      authorName: 'Kevin Sussat',
      authorTitle: 'Founder @ Envu Media',
      authorHeadshot: `${CDN}/6478c6e1810c46a199122313_Dv92wDm3_400x400.webp`,
    },
    row2: [
      {
        imageSrc: `${CDN}/64541ad7101e24294205eba5_new-hooks.webp`,
        title: 'Regenerate Hooks',
        description: 'Generate new opening hooks and CTAs instantly — test more angles, faster.',
      },
      {
        imageSrc: `${CDN}/64541acd4d56e7cdfc6abaa7_scene-description.webp`,
        title: 'Scene Descriptions',
        description: 'Shot-level direction for each scene — hand off to Kling or Higgsfield directly.',
      },
      {
        imageSrc: `${CDN}/64541ade63d9544d60a6e5f3_text-overlay.webp`,
        title: 'On-Screen Text',
        description: 'AI-generated text overlays tuned for engagement and reel retention.',
      },
      {
        imageSrc: `${CDN}/645420f1ac10bfbbe22cff0f_upload%20assets-4.webp`,
        title: 'Batch Generation',
        description: 'Queue a full week of reels across multiple models and run them in one batch.',
      },
      {
        imageSrc: `${CDN}/645420809ed898e0a2e34a9e_multi-language-2.webp`,
        title: 'Multi-Model Output',
        description: 'Adapt a single script across your full roster — different voice, same strategy.',
      },
      {
        imageSrc: `${CDN}/6474dfaa93a6291dbec99294_upload%20assets-4.webp`,
        title: 'Agency Branding',
        description: 'White-label your share pages with agency branding for each client.',
      },
    ],
    testimonial2: {
      logoSrc: `${CDN}/6478bf6f2eb8f9e5dd1563d4_Group%2048348.webp`,
      logoAlt: 'Porter Media logo',
      quote: '"Game changer for any agency managing more than five models. The model profiles alone save us hours every week — no more re-explaining tone and niche every time. The batch generation with Kling turns what used to be a full production day into a 30-minute review session. This is what the pipeline should have looked like all along."',
      authorName: 'Allan Porter',
      authorTitle: 'Founder @ Porter Media',
      authorHeadshot: `${CDN}/6478bf7a1f7099006baab519_allan-porter.webp`,
    },
  },
  embeddedCta: {
    headline: 'Start generating reels today',
    paragraph: "Content Gen is part of ISSO's full pipeline — Intelligence finds what works, Recon tracks your competitors, and Content Gen turns it all into published reels.\n\nEverything your agency needs, in one place.",
    primaryCtaText: 'Start',
    primaryCtaHref: 'https://siso.ai/sign-up',
    showNoCcBadge: true,
    videoSrc: `${ASSETS}/cta-briefs.mov`,
    iconSrc: `${CDN}/682f93b44b8360f413644eb7_iso-briefs.webp`,
  },
  faq: {
    sectionTitle: 'Questions about Content Gen?',
    sectionParagraph: 'Answers to the most common questions about ISSO\'s AI video pipeline.',
    items: [
      {
        question: 'Which AI video models does Content Gen use?',
        answer: 'Content Gen runs on Kling, Higgsfield, and Replicate. You can select the model per generation or run batch jobs across multiple engines simultaneously. Each has different strengths — Kling for motion quality, Higgsfield for character consistency, Replicate for high-volume output.',
      },
      {
        question: 'How does the script-to-reel workflow actually work?',
        answer: 'Start with a brief — pull inspiration from Recon or write your own hook. Content Gen generates a full script with scene descriptions and on-screen text. You review, adjust if needed, then send it to Kling, Higgsfield, or Replicate to generate the video. The whole process from brief to generated reel can happen in under an hour.',
      },
      {
        question: 'How does Content Gen connect to Intelligence and Recon?',
        answer: 'Content Gen is the production layer that sits on top of Intelligence and Recon. When Intelligence surfaces a trending format or Recon flags a competitor reel, Content Gen lets you turn that insight into a script and storyboard immediately — no copy-pasting or context switching.',
      },
      {
        question: 'Can I use Content Gen for multiple models at the same time?',
        answer: 'Yes. Model Profiles let you store each creator\'s niche, tone, and style preferences. You can generate a script once and adapt it across your full roster in seconds — same core angle, different voice per model.',
      },
      {
        question: 'How does batch generation work?',
        answer: 'Queue up scripts and storyboards for multiple reels, select your AI video engine, and run them in one batch. Content Gen handles the generation and surfaces the outputs for your review. A typical agency can produce a full week of content in a single session.',
      },
      {
        question: 'Do my models or managers need to log in to review content?',
        answer: 'No. You can share any script, storyboard, or reel via a direct link — no account required for the recipient. Managers can approve directly in Telegram if your agency uses that workflow.',
      },
      {
        question: 'How does Content Gen get better over time?',
        answer: 'Every reel your models post, every swipe in Hub, and every approval feeds back into the pipeline. The data from Hub tells Content Gen what formats and styles your models actually respond to — so each new batch of generated content is more targeted than the last. The more you use ISSO, the smarter the output.',
      },
    ],
  },
  bottomCta: {
    headline: 'Start generating reels today',
    paragraph: "Content Gen is part of ISSO's full pipeline — Intelligence, Recon, and Content Gen working together so your agency ships more reels with less effort. All in one place.",
    primaryCtaText: 'Start',
    primaryCtaHref: 'https://siso.ai/sign-up',
    secondaryCtaText: 'No credit card required',
    secondaryCtaHref: '',
  },
};
