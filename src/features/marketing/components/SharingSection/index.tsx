'use client';

import { useState } from 'react';

const TABS = [
  {
    id: 'inspiration',
    label: 'Inspiration & Moodboards',
    icon: (
      <svg width="20" height="20" fill="none" viewBox="0 0 20 20">
        <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M10 4.2v11.6m5.8-4.4H10m0-2.8H4.2m1.6 7.2h8.4c.88 0 1.6-.72 1.6-1.6V5.8c0-.88-.72-1.6-1.6-1.6H5.8c-.88 0-1.6.72-1.6 1.6v8.4c0 .88.72 1.6 1.6 1.6Z"/>
      </svg>
    ),
    ctaLabel: 'Curate & collaborate on creative genius',
    ctaText: 'Like Pinterest for ad inspiration, ISSO lets you create mood boards to communicate internally or show off externally.',
    buttonText: 'Start For Free',
    image: 'https://cdn.prod.website-files.com/62a4ed18ddad95dde8b8bfa4/680c3ed43df5ea8859a6ac18_home-mockup-1.webp',
    messageImage: 'https://cdn.prod.website-files.com/62a4ed18ddad95dde8b8bfa4/681926627347f25bbe9bb302_moodboard-message.webp',
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
    buttonText: 'Start For Free',
    image: 'https://cdn.prod.website-files.com/62a4ed18ddad95dde8b8bfa4/680c3ed4458a2826d337aa28_home-mockup-2.webp',
    messageImage: 'https://cdn.prod.website-files.com/62a4ed18ddad95dde8b8bfa4/681927286de6a527f591fa12_reports-message.webp',
  },
  {
    id: 'briefs',
    label: 'Briefs & Asset Collection',
    icon: (
      <svg width="20" height="20" fill="none" viewBox="0 0 20 20">
        <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M12 4.83h1.33c.74 0 1.34.6 1.34 1.34v8.5c0 .73-.6 1.33-1.34 1.33H6.67c-.74 0-1.34-.6-1.34-1.33v-8.5c0-.74.6-1.34 1.34-1.34H8m4 0v1.34H8V4.83m4 0c0-.73-.6-1.33-1.33-1.33H9.33C8.6 3.5 8 4.1 8 4.83"/>
      </svg>
    ),
    ctaLabel: 'Brief once. Collect everything.',
    ctaText: 'Send one brief to multiple creators and gather all their work in one clean, organized place. No more chasing links, files, or context across multiple platforms.',
    buttonText: 'Start For Free',
    image: 'https://cdn.prod.website-files.com/62a4ed18ddad95dde8b8bfa4/680c3ed40c687a098d45485e_home-mockup-3.webp',
    messageImage: 'https://cdn.prod.website-files.com/62a4ed18ddad95dde8b8bfa4/681927698f437ece92472cac_upload-content-message.webp',
  },
];

export default function SharingSection() {
  const [activeTab, setActiveTab] = useState('inspiration');

  const active = TABS.find((t) => t.id === activeTab)!;

  return (
    <section style={{ background: '#000', paddingTop: '120px', paddingBottom: '120px' }}>
      <div style={{ maxWidth: '1216px', paddingLeft: '24px', paddingRight: '24px', margin: '0 auto' }}>
        <div className="sharing-grid" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '64px', alignItems: 'center' }}>
          {/* Left: Content */}
          <div>
            {/* Header */}
            <div style={{ marginBottom: '32px' }}>
              <span
                style={{
                  fontFamily: 'Inter, sans-serif',
                  fontSize: '12px',
                  fontWeight: 550,
                  lineHeight: '1rem',
                  letterSpacing: '0.166667em',
                  textTransform: 'uppercase',
                  color: 'rgba(255,255,255,0.5)',
                  display: 'block',
                  marginBottom: '12px',
                }}
              >
                Sharing & Presenting
              </span>
              <h2
                style={{
                  fontFamily: 'Inter Display, Arial, sans-serif',
                  fontSize: '36px',
                  fontWeight: 600,
                  lineHeight: '44px',
                  letterSpacing: '-0.00722222em',
                  color: '#ffffff',
                  margin: '0 0 16px 0',
                  textWrap: 'balance',
                }}
              >
                Beautifully present wins and opportunities
              </h2>
              <p
                style={{
                  fontFamily: 'Inter, sans-serif',
                  fontSize: '18px',
                  lineHeight: '28px',
                  color: 'rgba(255,255,255,0.6)',
                  margin: 0,
                  textWrap: 'balance',
                }}
              >
                Impress your clients or wow your co-workers. ISSO makes it seamless to share inspiration, performance reports and briefs with anyone, anywhere.
              </p>
            </div>

            {/* Divider */}
            <div style={{ height: '1px', background: 'rgba(255,255,255,0.1)', marginBottom: '32px' }} />

            {/* Tabs */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
              {TABS.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  style={{
                    background: activeTab === tab.id ? 'rgba(255,255,255,0.08)' : 'transparent',
                    border: 'none',
                    borderRadius: '10px',
                    padding: '12px 16px',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '12px',
                    color: activeTab === tab.id ? '#ffffff' : 'rgba(255,255,255,0.56)',
                    transition: 'all 0.3s ease',
                    textAlign: 'left',
                  }}
                >
                  <span style={{ opacity: 0.7 }}>{tab.icon}</span>
                  <span
                    style={{
                      fontFamily: 'Inter, sans-serif',
                      fontSize: '14px',
                      fontWeight: 500,
                      letterSpacing: '-0.01em',
                    }}
                  >
                    {tab.label}
                  </span>
                </button>
              ))}
            </div>

            {/* CTA Box */}
            <div
              style={{
                background: 'rgba(255,255,255,0.05)',
                borderRadius: '16px',
                padding: '24px',
                marginTop: '24px',
                border: '1px solid rgba(255,255,255,0.1)',
              }}
            >
              <p
                style={{
                  fontFamily: 'Inter, sans-serif',
                  fontSize: '14px',
                  fontWeight: 550,
                  color: 'rgba(255,255,255,0.85)',
                  margin: '0 0 8px 0',
                  letterSpacing: '-0.01em',
                }}
              >
                {active.ctaLabel}
              </p>
              <p
                style={{
                  fontFamily: 'Inter, sans-serif',
                  fontSize: '14px',
                  lineHeight: '20px',
                  color: 'rgba(255,255,255,0.5)',
                  margin: '0 0 16px 0',
                }}
              >
                {active.ctaText}
              </p>
              <a
                href="https://app.isso.co/sign-up"
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '8px',
                  background: '#ffffff',
                  color: '#000000',
                  fontFamily: 'Inter, sans-serif',
                  fontSize: '14px',
                  fontWeight: 600,
                  padding: '10px 20px',
                  borderRadius: '8px',
                  textDecoration: 'none',
                }}
              >
                Start
                <svg width="16" height="16" viewBox="0 0 20 20" fill="none" style={{ transform: 'rotate(-90deg)' }}>
                  <path d="M5 10L10 5L15 10" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </a>
            </div>
          </div>

          {/* Right: Images */}
          <div style={{ position: 'relative' }}>
            {/* Main Image */}
            <img
              src={active.image}
              alt={active.ctaLabel}
              style={{ width: '100%', height: 'auto', display: 'block', borderRadius: '16px' }}
            />
            {/* Message Overlay */}
            <img
              src={active.messageImage}
              alt="Message preview"
              style={{
                position: 'absolute',
                bottom: '-20px',
                right: '-20px',
                width: '60%',
                height: 'auto',
                borderRadius: '12px',
                boxShadow: '0 8px 32px rgba(0,0,0,0.3)',
              }}
            />
          </div>
        </div>
      </div>
    </section>
  );
}
