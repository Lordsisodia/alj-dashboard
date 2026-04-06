'use client';

import { useRef, useEffect } from 'react';
import gsap from 'gsap';
import LazyVideo from '@/features/marketing/components/ProductSection/LazyVideo';

export default function SecretWeaponSection() {
  const beforeCardRef = useRef<HTMLDivElement>(null);
  const beforeImageRef = useRef<HTMLImageElement>(null);
  const hasAnimatedRef = useRef(false);

  useEffect(() => {
    const card = beforeCardRef.current;
    const image = beforeImageRef.current;

    if (!card || !image) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting && !hasAnimatedRef.current) {
            hasAnimatedRef.current = true;
            gsap.fromTo(
              image,
              { opacity: 0, y: -50 },
              { opacity: 1, y: 0, duration: 0.8, ease: 'power2.out' }
            );
          }
        });
      },
      { threshold: 0.3 }
    );

    observer.observe(card);

    return () => observer.disconnect();
  }, []);

  return (
    <section style={{
      position: 'relative',
    }}>
      {/* Section Padding */}
      <div style={{
        padding: '8px',
      }}>
        {/* Section White Block */}
        <div style={{
          zIndex: 2,
          backgroundColor: 'var(--_lens---neutral-0, #fff)',
          color: 'var(--_lens---solid-700, rgba(0,0,0,0.9))',
          borderRadius: 36,
          position: 'relative',
          overflow: 'hidden',
        }}>
          {/* Container Section Container */}
          <div className="isso-container">
            {/* Home Winning */}
            <div className="secret-weapon-header" style={{
              gridColumnGap: 72,
              gridRowGap: 72,
              flexFlow: 'column',
              justifyContent: 'flex-start',
              alignItems: 'center',
              paddingTop: 80,
              paddingBottom: 80,
              display: 'flex',
            }}>
              {/* Section Header */}
              <div style={{
                textAlign: 'center',
                maxWidth: 720,
                marginLeft: 'auto',
                marginRight: 'auto',
                marginBottom: 0,
                display: 'flex',
                flexDirection: 'column',
                gap: 12,
              }}>
                {/* Title */}
                <h2 className="font-display" style={{
                  letterSpacing: '-0.00722222em',
                  marginTop: 0,
                  marginBottom: 0,
                  fontSize: 'clamp(2rem, 4vw, 2.25rem)',
                  fontWeight: 600,
                  lineHeight: 2.75,
                  color: '#000',
                }}>
                  Your content infrastructure that never sleeps
                </h2>

                {/* Paragraph */}
                <div className="font-body" style={{
                  letterSpacing: '-0.01125em',
                  marginTop: 0,
                  marginBottom: 0,
                  fontSize: 'clamp(0.9rem, 2vw, 1rem)',
                  fontWeight: 400,
                  lineHeight: 1.5,
                  color: 'rgba(0,0,0,0.6)',
                }}>
                  We don&apos;t guess what&apos;s next. Our AI agents scrape and analyze thousands of top-performing reels daily to continuously enhance your content strategy.
                </div>
              </div>

              {/* Cards Grid */}
              <div className="secret-weapon-grid" style={{
                gridColumnGap: 72,
                gridRowGap: 72,
                width: '100%',
                maxWidth: 960,
                margin: '0 auto',
                display: 'grid',
              }}>
                <style>{`
                  @media (max-width: 768px) {
                    .secret-weapon-header {
                      padding-top: 40px !important;
                      padding-bottom: 40px !important;
                    }
                    .secret-weapon-grid {
                      grid-template-columns: 1fr !important;
                      grid-column-gap: 24px !important;
                      grid-row-gap: 24px !important;
                    }
                    .secret-weapon-after-video {
                      margin-bottom: -60px !important;
                    }
                  }
                `}</style>
                {/* Before Card */}
                <div
                  ref={beforeCardRef}
                  style={{
                    boxShadow: '0 0 0 1px rgba(0,0,0,0.05)',
                    borderRadius: 24,
                    flexDirection: 'column',
                    justifyContent: 'flex-start',
                    alignItems: 'stretch',
                    padding: 24,
                    display: 'flex',
                    position: 'relative',
                    overflow: 'hidden',
                    background: 'transparent',
                    minHeight: 480,
                  }}
                >
                  {/* Card Text */}
                  <div style={{
                    zIndex: 10,
                    pointerEvents: 'none',
                    textAlign: 'left',
                    position: 'relative',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: 4,
                  }}>
                    <div className="font-body" style={{
                      letterSpacing: '-0.0144444em',
                      marginTop: 0,
                      marginBottom: 0,
                      fontSize: '1.125rem',
                      fontWeight: 500,
                      lineHeight: 'normal',
                      color: 'rgba(0,0,0,0.9)',
                    }}>
                      Before ...
                    </div>
                    <div className="font-body" style={{
                      letterSpacing: '-0.01125em',
                      marginTop: 0,
                      marginBottom: 0,
                      fontSize: '1rem',
                      fontWeight: 400,
                      lineHeight: 1.5,
                      color: 'rgba(0,0,0,0.5)',
                    }}>
                      Scattered spreadsheets, missed messages, and manual workflows that can&apos;t keep up with your content demands.
                    </div>
                  </div>

                  {/* Image wrapper - positioned absolutely at bottom, starts invisible */}
                  <div style={{
                    position: 'absolute',
                    inset: 'auto 0% 0%',
                    width: '100%',
                  }}>
                    <img
                      ref={beforeImageRef}
                      src="https://cdn.prod.website-files.com/62a4ed18ddad95dde8b8bfa4/6832375f1f0c8f88fd92aaf0_logos-rain.webp"
                      alt=""
                      style={{
                        width: '100%',
                        height: 'auto',
                        display: 'block',
                        borderRadius: 8,
                        opacity: 0,
                      }}
                    />
                  </div>
                </div>

                {/* After Card */}
                <div style={{
                  boxShadow: '0 0 0 1px rgba(0,0,0,0.05)',
                  borderRadius: 24,
                  flexDirection: 'column',
                  justifyContent: 'flex-start',
                  alignItems: 'stretch',
                  padding: 24,
                  display: 'flex',
                  position: 'relative',
                  overflow: 'hidden',
                  backgroundColor: '#000',
                  minHeight: 480,
                }}>
                  {/* Card Text */}
                  <div style={{
                    zIndex: 10,
                    pointerEvents: 'none',
                    textAlign: 'left',
                    position: 'relative',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: 4,
                  }}>
                    <div className="font-body text-white" style={{
                      letterSpacing: '-0.0144444em',
                      marginTop: 0,
                      marginBottom: 0,
                      fontSize: '1.125rem',
                      fontWeight: 500,
                      lineHeight: 'normal',
                    }}>
                      After ISSO
                    </div>
                    <div className="font-body text-white-90" style={{
                      letterSpacing: '-0.01125em',
                      marginTop: 0,
                      marginBottom: 0,
                      fontSize: '1rem',
                      fontWeight: 400,
                      lineHeight: 1.5,
                    }}>
                      One pipeline that scrapes, generates, and improves - automatically. Every day it runs, every day it gets smarter.
                    </div>
                  </div>

                  {/* Video - full width at bottom with negative margin to overlap section below */}
                  <div className="secret-weapon-after-video" style={{
                    margin: -24,
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                    position: 'relative',
                    zIndex: 1,
                  }}>
                    <LazyVideo
                      src="https://cdn.prod.website-files.com/62a4ed18ddad95dde8b8bfa4%2F683351909f621123bbf25f44_home-loader-main-transcode.mp4"
                      autoPlay
                      loop
                      muted
                      playsInline
                      style={{
                        width: '100%',
                        height: 440,
                        objectFit: 'cover',
                        display: 'block',
                      }}
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
