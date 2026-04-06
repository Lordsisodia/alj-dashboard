'use client';

import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import LazyVideo from '@/features/marketing/components/ProductSection/LazyVideo';

gsap.registerPlugin(ScrollTrigger);

const ChevronUp = () => (
  <svg width="16" height="16" viewBox="0 0 20 20" fill="none" style={{ transform: 'rotate(-180deg)' }}>
    <path d="M5 10l4.5-4.5M14.5 10L10 5m4.5 5L10 14.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
);

import { LOGOS } from './logos';

const DOT_GRID_IMAGE = 'https://cdn.prod.website-files.com/62a4ed18ddad95dde8b8bfa4/68331d86cf0a6a7db433a56d_dot-grid.webp';
const POSTER_URL = 'https://cdn.prod.website-files.com/62a4ed18ddad95dde8b8bfa4%2F6833876c700d2cc61b273644_home-video-poster-00001.jpg';
const VIDEO_MP4 = 'https://cdn.prod.website-files.com/62a4ed18ddad95dde8b8bfa4%2F6833876c700d2cc61b273644_home-video-transcode.mp4';
const VIDEO_WEBM = 'https://cdn.prod.website-files.com/62a4ed18ddad95dde8b8bfa4%2F6833876c700d2cc61b273644_home-video-transcode.webm';

export default function HeroSection() {
  const videoContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Scroll animation: video fades in + slides up as user scrolls into it
    if (videoContainerRef.current) {
      gsap.fromTo(videoContainerRef.current,
        { opacity: 0, y: 80 },
        {
          opacity: 1,
          y: 0,
          duration: 1.2,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: videoContainerRef.current,
            start: 'top 90%',
            end: 'top 30%',
            scrub: 1,
          },
        }
      );
    }

    return () => {
      ScrollTrigger.getAll().forEach(t => t.kill());
    };
  }, []);

  return (
    <section
      style={{
        background: '#000',
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      <style>{`
        @keyframes bounce {
          0%, 20%, 50%, 80%, 100% { transform: translateY(0) translateX(-50%); }
          40% { transform: translateY(-10px) translateX(-50%); }
          60% { transform: translateY(-5px) translateX(-50%); }
        }
        .hero-scroll-indicator {
          animation: bounce 2s infinite;
        }
        .hero-logo-item {
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 12px;
          color: rgba(255,255,255,0.4);
          transition: color 0.2s;
        }
        .hero-logo-item:hover {
          color: rgba(255,255,255,0.7);
        }
        /* Video container: full width, aspect ratio 1400/730 */
        .hero-video-container {
          aspect-ratio: 1400 / 730;
          width: 100%;
          height: auto;
          overflow: hidden;
          border-radius: 0;
          position: relative;
        }
        /* Bottom overlay on video */
        .hero-video-overlay {
          background-image: linear-gradient(to bottom, transparent 30%, rgba(0,0,0,0.3) 100%);
          position: absolute;
          inset: 0;
          pointer-events: none;
        }
        /* Section-level overlay */
        .hero-section-overlay {
          background-image: linear-gradient(to bottom, rgba(0,0,0,0.4) 0%, transparent 100%);
          position: absolute;
          inset: 0;
          pointer-events: none;
          z-index: 1;
        }
        .hero-scroll {
          position: absolute;
          bottom: 24px;
          left: 50%;
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 8px;
          z-index: 2;
        }
      `}</style>

      {/* Dot-grid background */}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          zIndex: 0,
          opacity: 0.66,
          pointerEvents: 'none',
          backgroundImage: `url(${DOT_GRID_IMAGE})`,
          backgroundPosition: '50% 0',
          backgroundRepeat: 'repeat',
          backgroundSize: '380px 380px',
          WebkitMaskImage: 'linear-gradient(#0000 0%, #000 20% 75%, #0000 100%)',
          maskImage: 'linear-gradient(#0000 0%, #000 20% 75%, #0000 100%)',
        }}
      />

      {/* Sticky wrapper */}
      <div style={{ position: 'sticky', top: 132, zIndex: 10 }}>
        <div className="isso-container" style={{ position: 'relative' }}>

          {/* Single column: content centered */}
          <div style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            paddingTop: 60,
            paddingBottom: 80,
          }}>
            {/* .home-hero-content - centered text block */}
            <div style={{
              textAlign: 'center',
              maxWidth: 1100,
              margin: '0 auto',
              display: 'flex',
              flexDirection: 'column',
              gap: 24,
            }}>
              {/* Reel counter pill */}
              <div style={{ display: 'flex', justifyContent: 'center' }}>
                <div className="font-body" style={{
                  display: 'inline-flex', alignItems: 'center', gap: 8,
                  background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.1)',
                  borderRadius: 100, padding: '6px 16px',
                  fontSize: 12, fontWeight: 550,
                  letterSpacing: '0.05em', textTransform: 'uppercase', color: 'rgba(255,255,255,0.5)',
                }}>
                  Collected &amp; Analyzed <span style={{ fontVariantNumeric: 'tabular-nums', color: 'rgba(255,255,255,0.7)' }}>10,000</span> Reels
                  <span style={{
                    display: 'inline-flex', alignItems: 'center', gap: 4,
                    background: 'rgba(64,196,170,0.15)', color: '#40c4aa',
                    padding: '2px 8px', borderRadius: 100, fontSize: 11, fontWeight: 600,
                    letterSpacing: '0.02em', textTransform: 'none',
                  }}>&#9650; 1,000% <span style={{ color: 'rgba(64,196,170,0.6)', fontWeight: 400 }}>7d</span></span>
                </div>
              </div>

              {/* Headline */}
              <h1 className="font-display" style={{
                fontSize: 'clamp(40px, 6vw, 64px)',
                fontWeight: 600,
                lineHeight: 1.1,
                letterSpacing: '-0.03em',
                margin: 0,
                color: '#ffffff',
              }}>
                Your Agency Content Pipeline,<br />Running 24/7
              </h1>

              {/* Subheadline */}
              <p className="font-body" style={{
                fontSize: 18,
                lineHeight: 1.75,
                color: 'rgba(255,255,255,0.5)',
                margin: '0 auto',
                maxWidth: 720,
                letterSpacing: '-0.0144444em',
              }}>
                The content infrastructure that never stops. We scrape what's trending, generate AI reels, and continuously improve your pipeline - all running in the background.
              </p>
            </div>

            {/* CTA Button */}
            <div style={{ marginTop: 32 }}>
              <a
                href="https://app.isso.co/sign-up"
                className="font-body"
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: 8,
                  background: '#fff',
                  color: '#000',
                  fontSize: 16,
                  fontWeight: 600,
                  padding: '14px 28px',
                  borderRadius: 10,
                  textDecoration: 'none',
                  transition: 'opacity 150ms',
                }}
                onMouseEnter={(e) => (e.currentTarget.style.opacity = '0.85')}
                onMouseLeave={(e) => (e.currentTarget.style.opacity = '1')}
              >
                Start
                <ChevronUp />
              </a>
            </div>
          </div>

          {/* Social Proof Bar */}
          <div style={{
            paddingBottom: 80,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: 24,
          }}>

            {/* Logo Grid - 7 cols x 2 rows */}
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(7, 1fr)',
              gridTemplateRows: 'auto auto',
              gridColumnGap: 16,
              gridRowGap: 16,
              width: '100%',
              maxWidth: 800,
            }}>
              {LOGOS.map((logo) => (
                <div key={logo.name} className="hero-logo-item">
                  <logo.Component />
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Video mockup - below sticky, overlaps via negative margin */}
      <div style={{ position: 'relative', marginBottom: -120, zIndex: 1 }}>
        <div className="isso-container">
          <div ref={videoContainerRef} className="hero-video-container">
            {/* Poster image - always visible */}
            <img
              src={POSTER_URL}
              alt=""
              className="w-full h-auto block object-cover"
            />
            {/* Video element - try autoplay */}
            <LazyVideo
              src={VIDEO_MP4}
              autoPlay
              loop
              muted
              playsInline
              poster={POSTER_URL}
              className="absolute inset-0 w-full h-full object-cover"
            />
            {/* Bottom overlay */}
            <div className="hero-video-overlay" />
          </div>
        </div>
      </div>

      {/* Section-level overlay */}
      <div className="hero-section-overlay" />

      {/* Scroll Indicator */}
      <div className="hero-scroll">
        <span className="font-body text-white-40" style={{
          fontSize: 11,
          fontWeight: 500,
          letterSpacing: '0.1em',
          textTransform: 'uppercase',
        }}>
          Scroll
        </span>
        <svg width="20" height="20" viewBox="0 0 20 20" fill="none" style={{ opacity: 0.6 }}>
          <path d="M5 7.5l4.5 4.5 4.5-4.5" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
      </div>
    </section>
  );
}
