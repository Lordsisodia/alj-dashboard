// IndustryHero — top section with icon, subtitle, headline, paragraph, CTA buttons, and scrolling logo carousel.

import type { IndustryPageData } from './types';

interface Props {
  hero: IndustryPageData['hero'];
  clientLogos: IndustryPageData['clientLogos'];
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

export default function IndustryHero({ hero, clientLogos }: Props) {
  return (
    <div className="section">
      <div className="container section-container">
        {/* Header */}
        <div className="section-head">
          <div className="section-head-wrapper">
            {/* Icon */}
            <div className="industries-icon">
              <div className="icon-36 w-embed">
                <svg width="32" height="32" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M20.0008 10.6668C20.0008 12.876 18.2099 14.6668 16.0008 14.6668C13.7916 14.6668 12.0008 12.876 12.0008 10.6668M6.51116 7.83382L5.51116 23.8338C5.41521 25.369 6.63444 26.6668 8.17264 26.6668H23.8289C25.3671 26.6668 26.5863 25.369 26.4904 23.8338L25.4904 7.83382C25.4025 6.42839 24.2371 5.3335 22.8289 5.3335H9.17264C7.76447 5.3335 6.599 6.42839 6.51116 7.83382Z" stroke="white" strokeWidth="2.66667" strokeLinecap="round" />
                </svg>
              </div>
            </div>

            {/* Subtitle */}
            <div className="section-head_subtitle">
              <h1 className="text-overline">{hero.subtitle}</h1>
            </div>

            {/* Headline */}
            <div className="section-head_title">
              <h2 className="text-display-h2">{hero.headline}</h2>
            </div>

            {/* Paragraph */}
            <div className="section-head_paragraph">
              <div className="text-alpha-100">
                <p className="text-body-l">{hero.paragraph}</p>
              </div>
            </div>

            {/* CTA Buttons */}
            <div className="industru-buttons-padding">
              <div className="main-cta-buttons">
                <a href="https://app.isso.co/sign-up" className="button-dark button-primary w-inline-block">
                  <div className="button-text-block">
                    <div className="text-heading-m">Start</div>
                  </div>
                  <div className="button-icon-block icon-right opacity-100">
                    <div className="icon-24">
                      <div className="svg w-embed">
                        <ChevronIcon />
                      </div>
                    </div>
                  </div>
                </a>
                <a href="/book-demo" className="button-dark button-secondary w-inline-block">
                  <div className="button-text-block">
                    <div className="text-heading-m">Book a Demo</div>
                  </div>
                </a>
              </div>
            </div>
          </div>
        </div>

        {/* Logo Carousel */}
        <div className="industries-carousel-container">
          {[0, 1].map((i) => (
            <div key={i} className="industries-carousel-logos">
              {clientLogos.map((logo, idx) => (
                <div key={idx} className="industry-carousel-logo">
                  <img
                    src={logo.src}
                    loading="lazy"
                    alt={logo.alt}
                    className="industry-carousel-image"
                  />
                </div>
              ))}
            </div>
          ))}
          <div className="industries-carousel-fade" />
        </div>
      </div>
    </div>
  );
}
