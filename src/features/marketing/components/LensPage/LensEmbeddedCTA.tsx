import LazyVideo from '@/features/marketing/components/ProductSection/LazyVideo';

interface Props {
  cta: {
    headline: string;
    subtext: string;
    ctaText: string;
    ctaHref: string;
    videoMp4: string;
    isoImageUrl: string;
  };
}

export default function LensEmbeddedCTA({ cta }: Props) {
  return (
    <div className="cta-block">
      <div className="cta-block-content">
        <div className="flex-col-gap-2 align-start text-balance">
          <h2 className="text-display-h3 text-white mobile-landscape-text-display-h4">{cta.headline}</h2>
          <div className="text-alpha-100">
            <div className="text-balance">
              <p className="text-body-l mobile-landscape-text-body-n">
                {cta.subtext.split('\n').map((line, i) => (
                  <span key={i}>
                    {line}
                    {i < cta.subtext.split('\n').length - 1 && (
                      <>
                        <br />
                        <br />
                      </>
                    )}
                  </span>
                ))}
              </p>
            </div>
          </div>
        </div>
        <div className="flex-col-gap-3">
          <a href={cta.ctaHref} className="button-dark button-primary w-inline-block">
            <div className="button-text-block">
              <div className="text-heading-m">{cta.ctaText}</div>
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
          <div className="no-cc-required">
            <div className="flex-gap-2">
              <div className="icon-20">
                <div className="svg w-embed">
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" width="20" height="20" viewBox="0 0 20 20">
                    <path
                      stroke="#fff"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeOpacity="0.68"
                      strokeWidth="1.5"
                      d="M2.3 8.13v6.24c0 .92.74 1.67 1.66 1.67h7.29M2.29 8.13v-2.5c0-.92.75-1.67 1.67-1.67h12.08c.92 0 1.66.74 1.66 1.66v2.5m-15.4 0h15.4m0 0v1.25M17.8 12.6l-1.76 1.77m0 0l-1.77 1.77m1.77-1.77l-1.77-1.77m1.77 1.77l1.76 1.77"
                    />
                  </svg>
                </div>
              </div>
              <div className="text-alpha-100">
                <div className="text-label-s">No credit card required</div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="cta-block-animation">
        <div className="code-video w-embed">
          <LazyVideo src={cta.videoMp4} autoPlay playsInline muted loop width="100%" height="100%" style={{ margin: 0, padding: 0 }} />
        </div>
      </div>
      <div className="cta-block-icon">
        <img
          src={cta.isoImageUrl}
          loading="lazy"
          sizes="240px"
          alt="isometric glass ball logo"
          className="cta-block-icon-image"
        />
      </div>
    </div>
  );
}
