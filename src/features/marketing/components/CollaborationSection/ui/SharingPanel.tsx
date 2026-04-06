'use client';

import { useState } from 'react';

const TABS = [
  {
    id: 'inspiration',
    label: 'Reels & Moodboards',
    icon: (
      <svg width="20" height="20" fill="none" viewBox="0 0 20 20">
        <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M10 4.2v11.6m5.8-4.4H10m0-2.8H4.2m1.6 7.2h8.4c.88 0 1.6-.72 1.6-1.6V5.8c0-.88-.72-1.6-1.6-1.6H5.8c-.88 0-1.6.72-1.6 1.6v8.4c0 .88.72 1.6 1.6 1.6Z"/>
      </svg>
    ),
    ctaLabel: 'Curate and share the best-performing content',
    ctaText: 'A visual library for your top reels. Organize by model, niche, or trend - share instantly with your team.',
    image: 'https://cdn.prod.website-files.com/62a4ed18ddad95dde8b8bfa4/680c3ed43df5ea8859a6ac18_home-mockup-1.webp',
    messageImage: 'https://cdn.prod.website-files.com/62a4ed18ddad95dde8b8bfa4/681926627347f25bbe9bb302_moodboard-message.webp',
    messagePosition: { top: '25%', left: '5%' },
  },
  {
    id: 'reports',
    label: 'Performance Reports',
    icon: (
      <svg width="20" height="20" fill="none" viewBox="0 0 20 20">
        <path stroke="currentColor" strokeLinecap="round" strokeWidth="1.5" d="M16.25 14.75v-9.5c0-.83-.67-1.5-1.5-1.5h-9.5c-.83 0-1.5.67-1.5 1.5v9.5c0 .83.67 1.5 1.5 1.5h9.5c.83 0 1.5-.67 1.5-1.5ZM7 13v-2.25M10 13V7m3 6V9.25"/>
      </svg>
    ),
    ctaLabel: 'Highlight trends. Back it with proof.',
    ctaText: "Turn creative data into deck-worthy insights. Share visual reports that break down what's driving performance - and what's just taking up space.",
    image: 'https://cdn.prod.website-files.com/62a4ed18ddad95dde8b8bfa4/680c3ed4458a2826d337aa28_home-mockup-2.webp',
    messageImage: 'https://cdn.prod.website-files.com/62a4ed18ddad95dde8b8bfa4/681927286de6a527f591fa12_reports-message.webp',
    messagePosition: { top: '58%', left: '7%' },
  },
  {
    id: 'briefs',
    label: 'Briefs & Deliverables',
    icon: (
      <svg width="20" height="20" fill="none" viewBox="0 0 20 20">
        <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M12 4.83h1.33c.74 0 1.34.6 1.34 1.34v8.5c0 .73-.6 1.33-1.34 1.33H6.67c-.74 0-1.34-.6-1.34-1.33v-8.5c0-.74.6-1.34 1.34-1.34H8m4 0v1.34H8V4.83m4 0c0-.73-.6-1.33-1.33-1.33H9.33C8.6 3.5 8 4.1 8 4.83"/>
      </svg>
    ),
    ctaLabel: 'Brief once. Collect everything.',
    ctaText: 'Send one brief to multiple creators and gather all their work in one clean, organized place. No more chasing links, files, or context across multiple platforms.',
    image: 'https://cdn.prod.website-files.com/62a4ed18ddad95dde8b8bfa4/680c3ed40c687a098d45485e_home-mockup-3.webp',
    messageImage: 'https://cdn.prod.website-files.com/62a4ed18ddad95dde8b8bfa4/681927698f437ece92472cac_upload-content-message.webp',
    messagePosition: { bottom: '16%', left: '29%' },
  },
];

function ChevronDown() {
  return (
    <svg width="16" height="16" viewBox="0 0 20 20" fill="none" style={{ transform: 'rotate(-90deg)' }}>
      <path d="M5 10L10 5L15 10" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  );
}

export function SharingPanel() {
  const [sharingTab, setSharingTab] = useState('inspiration');
  const active = TABS.find((t) => t.id === sharingTab)!;

  return (
    <div style={{
      display: 'grid',
      gridTemplateColumns: '1fr 1fr',
      gap: '80px',
      alignItems: 'center',
      padding: '80px 80px 0',
      marginLeft: '-80px',
      marginRight: '-80px',
    }}>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
        <span style={{
          fontFamily: 'Inter, sans-serif',
          fontSize: '12px',
          fontWeight: 550,
          lineHeight: '1rem',
          letterSpacing: '0.166667em',
          textTransform: 'uppercase',
          color: 'rgba(0,0,0,0.5)',
        }}>
          SHARING &amp; PRESENTING
        </span>
        <h2 style={{
          fontFamily: 'Inter Display, Arial, sans-serif',
          fontSize: '36px',
          fontWeight: 600,
          lineHeight: '44px',
          letterSpacing: '-0.00722222em',
          color: '#000000',
          margin: 0,
        }}>
          Share results, briefs, and inspiration - beautifully
        </h2>
        <p style={{
          fontFamily: 'Inter, sans-serif',
          fontSize: '18px',
          lineHeight: '28px',
          color: 'rgba(0,0,0,0.6)',
          margin: 0,
        }}>
          Show models what&apos;s working, share briefs with your team, and keep everyone aligned - all from one dashboard.
        </p>
        <div style={{ height: '1px', background: '#e9eaef', marginTop: '32px' }} />
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gridColumnGap: '12px', gridRowGap: '12px' }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
            {TABS.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setSharingTab(tab.id)}
                style={{
                  background: sharingTab === tab.id ? 'rgba(255,255,255,0.05)' : 'transparent',
                  border: 'none',
                  borderRadius: '10px',
                  padding: '6px 20px 6px 12px',
                  cursor: 'pointer',
                  display: 'flex',
alignItems: 'start',
                  gap: '6px',
                  color: sharingTab === tab.id ? '#000000' : 'rgba(0,0,0,0.56)',
                  transition: 'all 0.4s cubic-bezier(0.19, 1, 0.22, 1)',
                  textAlign: 'left',
                  width: '100%',
                }}
              >
                <span style={{ opacity: 0.7, flexShrink: 0 }}>{tab.icon}</span>
                <span style={{ fontFamily: 'Inter, sans-serif', fontSize: '14px', fontWeight: 500, letterSpacing: '-0.00642857em' }}>{tab.label}</span>
              </button>
            ))}
          </div>
          <div style={{ background: 'rgba(255,255,255,0.05)', borderRadius: '18px', padding: '8px', display: 'flex', flexDirection: 'column', gap: '12px' }}>
            <p style={{ fontFamily: 'Inter, sans-serif', fontSize: '14px', fontWeight: 500, color: 'rgba(0,0,0,0.85)', letterSpacing: '-0.00642857em', lineHeight: '20px', margin: 0 }}>
              {active.ctaLabel}
            </p>
            <p style={{ fontFamily: 'Inter, sans-serif', fontSize: '14px', lineHeight: '20px', color: 'rgba(0,0,0,0.5)', margin: 0 }}>
              {active.ctaText}
            </p>
            <a href="https://app.isso.co/sign-up" style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '8px',
              background: '#13151a',
              color: '#ffffff',
              borderRadius: '10px',
              padding: '8px',
              textDecoration: 'none',
              fontFamily: 'Inter, sans-serif',
              fontSize: '16px',
              fontWeight: 550,
              letterSpacing: '-0.01125em',
              lineHeight: '24px',
              flex: 1,
            }}>
              Start
              <ChevronDown />
            </a>
          </div>
        </div>
      </div>

      <div style={{ position: 'relative', display: 'flex', flexDirection: 'column', justifyContent: 'flex-end', borderRadius: '20px', overflow: 'hidden', marginRight: '-200px' }}>
        {TABS.map((tab) => (
          <img
            key={tab.id}
            src={tab.image}
            alt=""
            style={{
              width: '720px',
              height: 'auto',
              display: sharingTab === tab.id ? 'block' : 'none',
            }}
          />
        ))}
        {TABS.map((tab) => (
          <img
            key={`msg-${tab.id}`}
            src={tab.messageImage}
            alt=""
            style={{
              position: 'absolute',
              ...tab.messagePosition,
              width: '45%',
              height: 'auto',
              borderRadius: '14px',
              boxShadow: '0 8px 32px rgba(0,0,0,0.2)',
              display: sharingTab === tab.id ? 'block' : 'none',
            }}
          />
        ))}
      </div>
    </div>
  );
}
