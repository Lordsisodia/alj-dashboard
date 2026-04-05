// WebinarsBottomCTA — bottom CTA section with dual buttons and decorative image.

import type { WebinarsPageData } from './data/webinars';

interface Props {
  bottomCta: WebinarsPageData['bottomCta'];
}

function ChevronIcon() {
  return (
    <svg viewBox="0 0 20 20" width="20" height="20" fill="none" xmlns="http://www.w3.org/2000/svg">
      <g style={{ transform: 'rotate(-90deg)', transformOrigin: 'center' }}>
        <path d="M5 10L10 5L15 10" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
      </g>
    </svg>
  );
}

export default function WebinarsBottomCTA({ bottomCta }: Props) {
  return (
    <div className="section overflow-hidden">
      <div className="container section-container">
        <div className="home-cta">
          <div className="section-head is-large">
            <div className="section-head_title">
              <h2 className="text-display-h2">{bottomCta.headline}</h2>
            </div>
            <div className="section-head_paragraph is-large">
              <div className="text-alpha-100">
                <p className="text-body-l">{bottomCta.paragraph}</p>
              </div>
            </div>
          </div>

          <div className="main-cta-buttons">
            <a href={bottomCta.primaryCtaHref} className="button-dark button-primary w-inline-block">
              <div className="button-text-block">
                <div className="text-heading-m">{bottomCta.primaryCtaText}</div>
              </div>
              <div className="button-icon-block icon-right opacity-100">
                <div className="icon-24">
                  <div className="svg w-embed"><ChevronIcon /></div>
                </div>
              </div>
            </a>
            <a href={bottomCta.secondaryCtaHref} className="button-dark button-secondary w-inline-block">
              <div className="button-text-block">
                <div className="text-heading-m">{bottomCta.secondaryCtaText}</div>
              </div>
            </a>
          </div>

          <div className="home-cta-image-wrapper">
            <img
              src={bottomCta.imageSrc}
              loading="lazy"
              width={1440}
              height={924}
              alt={bottomCta.imageAlt}
              className="home-cta-image"
            />
          </div>
        </div>
      </div>
    </div>
  );
}
