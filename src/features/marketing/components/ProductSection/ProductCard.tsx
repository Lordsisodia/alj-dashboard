'use client';
import { useState } from 'react';
import LazyVideo from './LazyVideo';
import { TabIcon } from './icons';

export interface ProductCardProps {
  label: string;
  title: string;
  tabs: ReadonlyArray<{ id: string; label: string; icon: string }>;
  images: Record<string, string>;
  bgImage: string;
  videoSrc: string;
  isometricSrc: string;
  poster?: string;
  activeTab: string;
  onTabChange: (id: string) => void;
  learnMoreHref: string;
  productName?: string;
  ctaText?: string;
  dotColor?: string;
}

/**
 * Reusable two-column product card: left panel has label + title + CTA + tab list;
 * right panel shows the active tab's screenshot over a background image.
 */
export default function ProductCard({
  label,
  title,
  tabs,
  images,
  bgImage,
  videoSrc,
  isometricSrc,
  poster,
  activeTab,
  onTabChange,
  learnMoreHref,
  productName,
  ctaText = 'Start',
  dotColor = '#ffffff',
}: ProductCardProps) {
  const [primaryHovered, setPrimaryHovered] = useState(false);
  const [secondaryHovered, setSecondaryHovered] = useState(false);

  return (
    <div className="product-card-root" style={{ display: 'flex', gap: '16px', alignItems: 'stretch', flexDirection: 'row' }}>
      {/* LEFT: content card - flex: 3 */}
      <div
        style={{
          background: '#020308',
          borderRadius: '24px',
          padding: '32px',
          display: 'flex',
          flexDirection: 'column',
          position: 'relative',
          overflow: 'hidden',
          flex: '3 1 0',
          boxShadow: '0 0 0 1px rgba(255,255,255,0.06)',
        }}
      >
        <div className="product-card-content" style={{ display: 'flex', flexDirection: 'column', gap: '24px', flex: 1, position: 'relative', zIndex: 1, alignItems: 'flex-start' }}>
          {/* Header */}
          <div>
            <span
              style={{
                display: 'inline-flex', alignItems: 'center', gap: 8,
                fontFamily: 'Inter, sans-serif', fontSize: '12px', fontWeight: 550,
                lineHeight: '1rem', letterSpacing: '0.166667em', textTransform: 'uppercase',
                color: 'rgba(255,255,255,0.68)', background: 'rgba(255,255,255,0.06)',
                border: '1px solid rgba(255,255,255,0.1)', borderRadius: 100,
                padding: '6px 14px', marginBottom: '8px',
              }}
            >
              <span style={{ width: 6, height: 6, borderRadius: '50%', background: dotColor, boxShadow: `0 0 6px ${dotColor}cc, 0 0 12px ${dotColor}55`, animation: 'pulse-dot 2s ease-in-out infinite' }} />
              {label}
            </span>
            <h3
              style={{
                fontFamily: 'Inter Display, Arial, sans-serif', fontSize: '36px',
                fontWeight: 600, lineHeight: '44px', letterSpacing: '-0.00722222em',
                color: '#ffffff', margin: 0,
              }}
            >
              {title}
            </h3>
          </div>

          {/* CTAs */}
          <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
            <a
              href="https://app.isso.co/sign-up"
              onMouseEnter={() => setPrimaryHovered(true)}
              onMouseLeave={() => setPrimaryHovered(false)}
              style={{
                display: 'inline-flex', alignItems: 'center',
                background: primaryHovered ? 'rgba(255,255,255,0.14)' : 'rgba(255,255,255,0.08)',
                color: '#ffffff', fontWeight: 600, borderRadius: '10px',
                textDecoration: 'none', padding: '10px 16px', transition: 'background 200ms',
              }}
            >
              <span style={{ fontFamily: 'Inter, sans-serif', fontSize: '14px', fontWeight: 550, lineHeight: '21px', letterSpacing: '-0.01125em' }}>
                {ctaText}
              </span>
            </a>
            <a
              href={learnMoreHref}
              onMouseEnter={() => setSecondaryHovered(true)}
              onMouseLeave={() => setSecondaryHovered(false)}
              style={{
                display: 'inline-flex', alignItems: 'center',
                background: secondaryHovered ? 'rgba(255,255,255,0.05)' : 'transparent',
                color: secondaryHovered ? '#ffffff' : 'rgba(255,255,255,0.72)',
                border: '1px solid #ffffff1a', borderRadius: '10px',
                textDecoration: 'none', padding: '10px 16px', transition: 'all 200ms',
              }}
            >
              <span style={{ fontFamily: 'Inter, sans-serif', fontSize: '14px', fontWeight: 500, lineHeight: '21px', letterSpacing: '-0.01125em' }}>
                Learn More
              </span>
            </a>
          </div>

          {/* Tab List */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => onTabChange(tab.id)}
                style={{
                  background: activeTab === tab.id ? 'rgba(255,255,255,0.08)' : 'transparent',
                  border: 'none', borderRadius: '10px', padding: '6px 20px 6px 6px',
                  cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '6px',
                  color: activeTab === tab.id ? '#ffffff' : '#ffffff70',
                  transition: 'all 0.4s cubic-bezier(0.19,1,0.22,1)', textAlign: 'left',
                }}
              >
                <TabIcon icon={tab.icon} />
                <span style={{ fontFamily: 'Inter, sans-serif', fontSize: '14px', fontWeight: activeTab === tab.id ? 500 : 400, lineHeight: '21px', letterSpacing: '-0.01125em' }}>
                  {tab.label}
                </span>
              </button>
            ))}
          </div>
        </div>

        {/* Isometric background media */}
        <div
          className={`product-card-isometric ${productName || ''}`}
          style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', position: 'absolute', top: 0, right: 0, width: '100%', height: '100%', pointerEvents: 'none', overflow: 'hidden' }}
        >
          {videoSrc && (
            <LazyVideo src={videoSrc} autoPlay loop muted playsInline style={{ width: '100%', height: '100%', objectFit: 'cover', pointerEvents: 'none' }} />
          )}
          {isometricSrc && (
            <img src={isometricSrc} alt="" className="product-isometric-image" style={{ width: 300, height: 300, objectFit: 'contain', pointerEvents: 'none' }} />
          )}
        </div>
      </div>

      {/* RIGHT: screenshot panel - flex: 7 */}
      <div
        className="product-card-figure"
        style={{ backgroundColor: '#ffffff0f', borderRadius: '24px', flex: '7 1 0', display: 'flex', position: 'relative', overflow: 'hidden' }}
      >
        <img src={bgImage} alt="" style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover', pointerEvents: 'none' }} />
        <div>
          {tabs.map((tab) => (
            <div key={tab.id} style={{ position: 'absolute', inset: 0, display: activeTab === tab.id ? 'block' : 'none' }}>
              <img src={images[tab.id]} alt={tab.label} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
