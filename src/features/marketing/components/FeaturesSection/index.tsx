'use client';

import { useState } from 'react';

const FEATURES = [
  {
    id: 'expert-swipe-files',
    title: 'Creator Vault',
    description: "Browse the content libraries behind the industry's top-performing creators.",
    ctaText: 'Explore',
    ctaHref: '/experts',
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M9.91667 10.8333C11.5275 10.8333 12.8333 9.5275 12.8333 7.91667C12.8333 6.30584 11.5275 5 9.91667 5C8.30584 5 7 6.30584 7 7.91667C7 9.5275 8.30584 10.8333 9.91667 10.8333Z" stroke="white" strokeWidth="1.66667"/>
        <path d="M3.66667 18.6667C3.66667 16.3664 5.22003 14.4289 7.335 13.846" stroke="white" strokeWidth="1.66667" strokeLinecap="round" strokeLinejoin="round"/>
        <path d="M11.1667 18.6667L12.5743 13.7399C12.7277 13.2033 13.2181 12.8333 13.7762 12.8333H19.1181C19.7271 12.8333 20.1667 13.4162 19.9995 14.0018L18.8393 18.0622C18.7372 18.42 18.4102 18.6667 18.0381 18.6667H11.1667ZM11.1667 18.6667H7.83333" stroke="white" strokeWidth="1.66667" strokeLinecap="round" strokeLinejoin="round"/>
      </svg>
    ),
    image: 'https://cdn.prod.website-files.com/62a4ed18ddad95dde8b8bfa4/681947a3da1e34aa66fcdccb_expert-boards-img.webp',
    imageAlt: 'creator swipe files',
    imageSrcSet: 'https://cdn.prod.website-files.com/62a4ed18ddad95dde8b8bfa4/681947a3da1e34aa66fcdccb_expert-boards-img-p-500.webp 500w, https://cdn.prod.website-files.com/62a4ed18ddad95dde8b8bfa4/681947a3da1e34aa66fcdccb_expert-boards-img.webp 768w',
  },
  {
    id: 'mobile-app',
    title: 'Mobile App',
    description: 'Manage your pipeline on the go. Review content, approve reels, track performance - from your phone.',
    ctaText: 'Download App',
    ctaHref: '/mobile-app',
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M10.3333 17.8333H13.6667M8.66667 20.3333H15.3333C16.2538 20.3333 17 19.5872 17 18.6667V5.33333C17 4.41286 16.2538 3.66667 15.3333 3.66667H8.66667C7.74619 3.66667 7 4.41286 7 5.33333V18.6667C7 19.5872 7.74619 20.3333 8.66667 20.3333Z" stroke="white" strokeWidth="1.66667" strokeLinecap="round"/>
      </svg>
    ),
    image: 'https://cdn.prod.website-files.com/62a4ed18ddad95dde8b8bfa4/681947a2d93fde0a00822fcf_mobile-app-block.webp',
    imageAlt: 'ISSO mobile app screenshot',
    imageSrcSet: 'https://cdn.prod.website-files.com/62a4ed18ddad95dde8b8bfa4/681947a2d93fde0a00822fcf_mobile-app-block-p-500.webp 500w, https://cdn.prod.website-files.com/62a4ed18ddad95dde8b8bfa4/681947a2d93fde0a00822fcf_mobile-app-block.webp 768w',
    isMiddle: true,
  },
  {
    id: 'api',
    title: 'API',
    description: 'Plug ISSO intelligence into your own tools via a clean, documented API.',
    ctaText: 'Learn More',
    ctaHref: '/api',
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M14.9166 7.625C14.9166 9.23583 13.6108 10.5417 12 10.5417C10.3891 10.5417 9.08331 9.23583 9.08331 7.625C9.08331 6.01417 10.3891 4.70833 12 4.70833C13.6108 4.70833 14.9166 6.01417 14.9166 7.625Z" stroke="white" strokeWidth="1.66667"/>
        <path d="M10.3333 15.5417C10.3333 17.1525 9.0275 18.4583 7.41667 18.4583C5.80583 18.4583 4.5 17.1525 4.5 15.5417C4.5 13.9308 5.80583 12.625 7.41667 12.625C9.0275 12.625 10.3333 13.9308 10.3333 15.5417Z" stroke="white" strokeWidth="1.66667"/>
        <path d="M19.5 15.5417C19.5 17.1525 18.1942 18.4583 16.5834 18.4583C14.9725 18.4583 13.6667 17.1525 13.6667 15.5417C13.6667 13.9308 14.9725 12.625 16.5834 12.625C18.1942 12.625 19.5 13.9308 19.5 15.5417Z" stroke="white" strokeWidth="1.66667"/>
      </svg>
    ),
    image: 'https://cdn.prod.website-files.com/62a4ed18ddad95dde8b8bfa4/68194b5e0cead2d7bd121660_Frame%201171276106.webp',
    imageAlt: 'content api',
    imageSrcSet: null,
  },
];

function FeatureCard({ feature }: { feature: typeof FEATURES[0] }) {
  const [imageError, setImageError] = useState(false);

  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        padding: '24px',
        paddingBottom: '24px',
        ...(feature.isMiddle ? {
          borderRight: '1px solid #171920',
          borderLeft: '1px solid #171920',
        } : {}),
      }}
    >
      {/* Card Head - icon + title */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        gap: '8px',
        color: 'white',
        marginBottom: '0',
        position: 'relative',
      }}>
        <div style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          width: '24px',
          height: '24px',
        }}>
          {feature.icon}
        </div>
        <h3 className="font-body text-white" style={{
          fontSize: '16px',
          fontWeight: 500,
          lineHeight: '1.5rem',
          letterSpacing: '-0.01125em',
          margin: 0,
          textDecoration: 'none',
        }}>
          {feature.title}
        </h3>
      </div>

      {/* Card Image - bleeds to edges via negative margins (matches HTML) */}
      <div style={{
        height: 'auto',
        marginLeft: '-24px',
        marginRight: '-24px',
        marginTop: '-39px',
      }}>
        {!imageError ? (
          <img
            src={feature.image}
            alt={feature.imageAlt}
            srcSet={feature.imageSrcSet || undefined}
            sizes={feature.imageSrcSet ? '(max-width: 767px) 100vw, 768px, 100vw' : undefined}
            loading="lazy"
            onError={() => setImageError(true)}
            style={{ width: '100%', display: 'block' }}
          />
        ) : (
          <div className="font-body" style={{
            width: '100%',
            height: '200px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: 'rgba(255,255,255,0.3)',
            fontSize: '14px',
            background: 'rgba(255,255,255,0.03)',
          }}>
            {feature.imageAlt}
          </div>
        )}
      </div>

      {/* Card Footer - description + CTA */}
      <div style={{
        display: 'flex',
        flexDirection: 'column',
        flex: 1,
        justifyContent: 'flex-end',
        alignItems: 'flex-start',
        paddingTop: '15px',
        gap: '15px',
        marginLeft: feature.isMiddle ? '0' : '0',
      }}>
        <p className="font-body" style={{
          fontSize: '16px',
          fontWeight: 400,
          lineHeight: '1.5rem',
          letterSpacing: '-0.01125em',
          color: 'rgba(255,255,255,0.85)',
          margin: 0,
        }}>
          {feature.description}
        </p>
        <a
          href={feature.ctaHref}
          style={{
            display: 'flex',
            alignItems: 'center',
            background: 'white',
            color: '#090a0e',
            borderRadius: '10px',
            padding: '8px',
            textDecoration: 'none',
            fontWeight: 600,
            transition: 'all 0.15s',
            position: 'relative',
          }}
        >
          <span style={{
            position: 'relative',
            zIndex: 2,
            paddingLeft: '6px',
            paddingRight: '6px',
            display: 'flex',
            alignItems: 'center',
          }}>
            <span className="font-body" style={{
              fontSize: '16px',
              fontWeight: 550,
              lineHeight: '1.5rem',
              letterSpacing: '-0.01125em',
              marginRight: '6px',
            }}>
              {feature.ctaText}
            </span>
          </span>
          <span style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            opacity: 0.68,
            marginLeft: '-4px',
          }}>
            <svg viewBox="0 0 20 20" width="20" height="20" fill="none" style={{ transform: 'rotate(-90deg)' }}>
              <path d="M5 10L10 5L15 10" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </span>
        </a>
      </div>
    </div>
  );
}

export default function FeaturesSection() {
  return (
    <section style={{ background: '#000', paddingTop: '108px', paddingBottom: '108px' }}>
      <div className="isso-container">
        {/* Section Header */}
        <div style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: '12px',
          marginBottom: '48px',
        }}>
          <div className="text-label text-white-68">
            Built For Scale
          </div>
          <div style={{ color: 'white', textWrap: 'balance' }}>
            <h2 className="font-display text-h2 text-white" style={{
              margin: 0,
              textAlign: 'center',
            }}>
              Miles beyond the status quo
            </h2>
          </div>
          <div style={{ textWrap: 'pretty', maxWidth: '512px' }}>
            <p className="font-body text-body-lg text-white-68" style={{
              letterSpacing: '-0.0144444em',
              margin: 0,
              textAlign: 'center',
            }}>
              Say goodbye to fragmented workflows. ISSO gives you enterprise-grade AI infrastructure with zero learning curve.
            </p>
          </div>
        </div>

        {/* Feature Cards Grid - shared border (matches lens-security-grid) */}
        <div className="features-grid" style={{
          display: 'grid',
          gridTemplateColumns: '1fr 1fr 1fr',
          border: '1px solid #171920',
          borderRadius: '28px',
          overflow: 'hidden',
        }}>
          {FEATURES.map((feature) => (
            <FeatureCard key={feature.id} feature={feature} />
          ))}
        </div>
      </div>
    </section>
  );
}