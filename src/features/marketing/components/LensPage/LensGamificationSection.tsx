interface GamificationSectionProps {
  gamification: {
    overline: string;
    title: string;
    subtext: string;
    ctaText: string;
    imageUrl: string;
  };
  benchmarks: {
    overline: string;
    title: string;
    subtext: string;
    ctaText: string;
    imageUrl: string;
  };
}

export default function LensGamificationSection({ gamification, benchmarks }: GamificationSectionProps) {
  return (
    <section aria-labelledby="carousel-heading" className="section">
      <div className="section-padding">
        <div className="section-white-block">
          <div className="lens-gamification">
            <div className="container section-container">
              <div className="section-head">
                <div className="section-head-wrapper">
                  <div className="section-head_subtitle">
                    <div className="text-overline text-solid-400">Contextual Ad Reports</div>
                  </div>
                  <h2 className="text-display-h2 title-dark">Performance storytelling beyond a pretty picture</h2>
                  <p className="text-body-l text-solid-600">
                    Performance and creative teams need context beyond the data. Build and share reports with enriched data.
                  </p>
                </div>
              </div>
            </div>

            {/* Gamification left-right */}
            <div className="container section-container">
              <div className="left-right-section">
                <div className="left-right-section-image-wrapper">
                  <img
                    src={gamification.imageUrl}
                    width={560}
                    loading="lazy"
                    alt="Gamification by Lens"
                    className="left-right-section-image"
                  />
                </div>
                <div className="left-right-section-content">
                  <div className="section-head is-align-left">
                    <div className="text-overline text-solid-500">{gamification.overline}</div>
                    <h3 className="text-display-h3 text-solid-900">{gamification.title}</h3>
                    <p className="text-body-l text-solid-500">{gamification.subtext}</p>
                  </div>
                  <a href="https://app.isso.co/sign-up" className="button-light button-stroke w-inline-block">
                    <div className="button-text-block">
                      <div className="text-heading-m">{gamification.ctaText}</div>
                    </div>
                    <div className="button-icon-block icon-right">
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
            </div>

            {/* Benchmarks left-right */}
            <div className="container section-container">
              <div className="left-right-section">
                <div className="left-right-section-content">
                  <div className="section-head is-align-left">
                    <div className="text-overline text-solid-500">{benchmarks.overline}</div>
                    <h3 className="text-display-h3 text-solid-900">{benchmarks.title}</h3>
                    <p className="text-body-l text-solid-500">{benchmarks.subtext}</p>
                  </div>
                  <a href="https://app.isso.co/sign-up" className="button-light button-stroke w-inline-block">
                    <div className="button-text-block">
                      <div className="text-heading-m">{benchmarks.ctaText}</div>
                    </div>
                    <div className="button-icon-block icon-right">
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
                <div className="left-right-section-image-wrapper">
                  <img
                    src={benchmarks.imageUrl}
                    width={560}
                    loading="lazy"
                    alt="Benchmarks Ad Reports"
                    className="left-right-section-image"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
