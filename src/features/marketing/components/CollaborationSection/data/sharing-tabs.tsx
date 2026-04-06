import React from 'react';

export type SharingTab = {
  id: string;
  label: string;
  ctaLabel: string;
  ctaText: string;
  buttonText: string;
  image: string;
  messageImage: string;
  messagePosition: { top?: string; bottom?: string; left?: string };
};

const InspirationIcon = () => (
  <svg width="20" height="20" fill="none" viewBox="0 0 20 20">
    <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M10 4.2v11.6m5.8-4.4H10m0-2.8H4.2m1.6 7.2h8.4c.88 0 1.6-.72 1.6-1.6V5.8c0-.88-.72-1.6-1.6-1.6H5.8c-.88 0-1.6.72-1.6 1.6v8.4c0 .88.72 1.6 1.6 1.6Z"/>
  </svg>
);

const ReportsIcon = () => (
  <svg width="20" height="20" fill="none" viewBox="0 0 20 20">
    <path stroke="currentColor" strokeLinecap="round" strokeWidth="1.5" d="M16.25 14.75v-9.5c0-.83-.67-1.5-1.5-1.5h-9.5c-.83 0-1.5.67-1.5 1.5v9.5c0 .83.67 1.5 1.5 1.5h9.5c.83 0 1.5-.67 1.5-1.5ZM7 13v-2.25M10 13V7m3 6V9.25"/>
  </svg>
);

const BriefsIcon = () => (
  <svg width="20" height="20" fill="none" viewBox="0 0 20 20">
    <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M12 4.83h1.33c.74 0 1.34.6 1.34 1.34v8.5c0 .73-.6 1.33-1.34 1.33H6.67c-.74 0-1.34-.6-1.34-1.33v-8.5c0-.74.6-1.34 1.34-1.34H8m4 0v1.34H8V4.83m4 0c0-.73-.6-1.33-1.33-1.33H9.33C8.6 3.5 8 4.1 8 4.83"/>
  </svg>
);

export const ICONS: Record<string, React.ReactNode> = {
  inspiration: <InspirationIcon />,
  reports: <ReportsIcon />,
  briefs: <BriefsIcon />,
};

export const SHARING_TABS: SharingTab[] = [
  {
    id: 'inspiration',
    label: 'Inspiration & Moodboards',
    ctaLabel: 'Curate & collaborate on creative genius',
    ctaText: 'Like Pinterest for ad inspiration, ISSO lets you create mood boards to communicate internally or show off externally.',
    buttonText: 'Start For Free',
    image: 'https://cdn.prod.website-files.com/62a4ed18ddad95dde8b8bfa4/680c3ed43df5ea8859a6ac18_home-mockup-1.webp',
    messageImage: 'https://cdn.prod.website-files.com/62a4ed18ddad95dde8b8bfa4/681926627347f25bbe9bb302_moodboard-message.webp',
    messagePosition: { top: '25%', left: '5%' },
  },
  {
    id: 'reports',
    label: 'Performance Reports',
    ctaLabel: 'Highlight trends. Back it with proof.',
    ctaText: "Turn creative data into deck-worthy insights. Share visual reports that break down what's driving performance - and what's just taking up space.",
    buttonText: 'Start For Free',
    image: 'https://cdn.prod.website-files.com/62a4ed18ddad95dde8b8bfa4/680c3ed4458a2826d337aa28_home-mockup-2.webp',
    messageImage: 'https://cdn.prod.website-files.com/62a4ed18ddad95dde8b8bfa4/681927286de6a527f591fa12_reports-message.webp',
    messagePosition: { top: '58%', left: '7%' },
  },
  {
    id: 'briefs',
    label: 'Briefs & Asset Collection',
    ctaLabel: 'Brief once. Collect everything.',
    ctaText: 'Send one brief to multiple creators and gather all their work in one clean, organized place. No more chasing links, files, or context across multiple platforms.',
    buttonText: 'Start For Free',
    image: 'https://cdn.prod.website-files.com/62a4ed18ddad95dde8b8bfa4/680c3ed40c687a098d45485e_home-mockup-3.webp',
    messageImage: 'https://cdn.prod.website-files.com/62a4ed18ddad95dde8b8bfa4/681927698f437ece92472cac_upload-content-message.webp',
    messagePosition: { bottom: '16%', left: '29%' },
  },
];
