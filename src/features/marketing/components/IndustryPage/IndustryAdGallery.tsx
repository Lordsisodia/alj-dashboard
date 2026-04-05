// IndustryAdGallery — subtitle, title, grid of ad example cards with brand avatar, duration, and ad image. CTA below the grid.

import Image from 'next/image';
import type { IndustryPageData, AdGalleryItem } from './types';

interface Props {
  adGallery: IndustryPageData['adGallery'];
}

function AdCard({ item, cardClass }: { item: AdGalleryItem; cardClass: string }) {
  return (
    <div className={`industries-examples-card ${cardClass}`}>
      <div className="industries-examples-header">
        <Image src={item.brand.avatarSrc} width={40} height={40} alt="" className="industries-examples-avatar" />
        <div className="industries-examples-header-text">
          <div className="text-white">
            <div className="text-label-m ad-card-text">{item.brand.name}</div>
          </div>
          <div className="industries-examples-date">
            <div className="industreis-examples-active" />
            <div className="text-label-s ad-card-date-text">{item.duration}</div>
          </div>
        </div>
      </div>
      <div className="industries-examples-content">
        <Image src={item.imageSrc} width={300} height={400} alt="" className="industries-examples-image" />
      </div>
    </div>
  );
}

const CARD_CLASSES = ['card-1', 'card-2', 'card-3'];

export default function IndustryAdGallery({ adGallery }: Props) {
  return (
    <div className="section">
      <div className="product-page-padding-y">
        <div className="container section-container">
          {/* Section header */}
          <div className="section-head">
            <div className="section-head-wrapper">
              <div className="section-head_subtitle">
                <div className="text-overline text-white-68">{adGallery.subtitle}</div>
              </div>
              <div className="section-head_title">
                <h2 className="text-display-h2">{adGallery.title}</h2>
              </div>
            </div>
          </div>

          {/* Ad grid + CTA */}
          <div className="section-content-main">
            <div className="industries-examples-grid">
              {adGallery.items.map((item, idx) => (
                <AdCard key={idx} item={item} cardClass={CARD_CLASSES[idx] ?? 'card-1'} />
              ))}
              <div className="industries-examples-fade" />
            </div>

            <div className="industries-examples-cta">
              <div className="text-white">
                <div className="text-label-l">{adGallery.ctaText}</div>
              </div>
              <a href="https://app.isso.co/sign-up" className="button-dark button-secondary w-inline-block">
                <div className="button-text-block">
                  <div className="text-heading-m">Browse Ads</div>
                </div>
                <div className="button-icon-block icon-right">
                  <div className="icon-24">
                    <div className="svg w-embed">
                      <svg viewBox="0 0 20 20" width="20" height="20" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <g style={{ transform: 'rotate(-90deg)', transformOrigin: 'center' }}>
                          <path d="M5 10L10 5L15 10" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                        </g>
                      </svg>
                    </div>
                  </div>
                </div>
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
