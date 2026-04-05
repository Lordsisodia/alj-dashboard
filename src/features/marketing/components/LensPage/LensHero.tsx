import { LensHeroData } from './types';
import LazyVideo from '@/features/marketing/components/ProductSection/LazyVideo';

interface Props {
  hero: LensHeroData;
}

export default function LensHero({ hero }: Props) {
  return (
    <section id="product-hero-section" className="section relative">
      <div className="dot-bg" />
      <div className="container">
        <div className="product-hero">
          <div data-w-id="78a6fcc6-755c-279f-a8d8-413b6af7ee18" className="product-hero-animation-trigger" />
          <div className="product-hero-sticky">
            <div className="product-hero-icon">
              <div className="product-hero-icon-video">
                <div className="code-video w-embed">
                  <LazyVideo src={hero.videoMp4} autoPlay playsInline muted loop width="100%" height="100%" style={{ margin: 0, padding: 0 }} />
                </div>
              </div>
              <img
                src={hero.posterUrl}
                loading="lazy"
                width={128}
                height={128}
                alt="Lens app icon"
                className="product-hero-icon-image"
              />
            </div>
            <div className="product-hero-content">
              <div className="hero-text">
                <h1 className="text-overline">Lens</h1>
                <h2 className="text-display-h1 hero-title">{hero.headline}</h2>
                <div className="max-w-lg">
                  <p className="text-body-l text-white-84">{hero.subtext}</p>
                </div>
              </div>
              <a href={hero.ctaHref} className="button-dark button-primary w-inline-block">
                <div className="button-text-block">
                  <div className="text-heading-m">{hero.ctaText}</div>
                </div>
                <div className="button-icon-block icon-right opacity-100">
                  <div className="icon-24">
                    <div className="svg w-embed">
                      <svg viewBox="0 0 20 20" width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
                        <g style={{ transform: 'rotate(-90deg)', transformOrigin: 'center' }}>
                          <use href="#sprite-chevron" width="20" height="20" fill="none" />
                        </g>
                      </svg>
                    </div>
                  </div>
                </div>
              </a>
            </div>
          </div>
          <div className="product-hero-preview">
            <img
              src={hero.mockupUrl}
              loading="lazy"
              width={1440}
              height={900}
              alt="apple pro xdr monitor mockup"
              className="product-hero-preview-image"
            />
            <div className="product-hero-preview-underlay" />
            <div className="product-hero-video w-background-video w-background-video-atom">
              <LazyVideo
                src={hero.videoMp4Src}
                autoPlay
                loop
                muted
                playsInline
                poster={hero.posterUrl}
                data-wf-ignore="true"
                data-object-fit="cover"
              />
            </div>
            <div className="video-lightbox-holder">
              <a href="#" className="lightbox-video-main w-inline-block w-lightbox">
                <div className="lightbox-video-trigger">
                  <div className="video-lightbox-button">
                    <div className="icon-24 w-embed">
                      <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path
                          d="M16.1838 8.72379L7.78824 3.53831C6.78891 2.92108 5.5 3.63993 5.5 4.81451V15.1855C5.5 16.3601 6.7889 17.0789 7.78823 16.4617L16.1838 11.2762C17.1328 10.6901 17.1328 9.30991 16.1838 8.72379Z"
                          fill="white"
                          stroke="white"
                          strokeWidth="1.5"
                          strokeLinejoin="round"
                        />
                      </svg>
                    </div>
                  </div>
                  <div className="video-lightbox-text">
                    <div className="text-label-s">{hero.lightboxLabel}</div>
                    <div className="text-body-s">{hero.lightboxSubtext}</div>
                  </div>
                </div>
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
