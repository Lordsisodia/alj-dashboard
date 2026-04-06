// WorkWithBrandsCTA - bottom CTA section: headline, paragraph, dual buttons, decorative image.

import type { WorkWithBrandsData } from './data/work-with-brands';

interface Props {
  cta: WorkWithBrandsData['bottomCta'];
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

export default function WorkWithBrandsCTA({ cta }: Props) {
  return (
    <div className="section overflow-hidden">
      <div className="container section-container">
        <div className="home-cta">
          <div className="section-head is-large">
            <div className="section-head_title">
              <h2 className="text-display-h2">{cta.headline}</h2>
            </div>
            <div className="section-head_paragraph is-large">
              <div className="text-alpha-100">
                <p className="text-body-l">{cta.paragraph}</p>
              </div>
            </div>
          </div>

          <div className="main-cta-buttons">
            <a href="https://app.isso.co/sign-up" className="button-dark button-primary w-inline-block">
              <div className="button-text-block">
                <div className="text-heading-m">Start free trial</div>
              </div>
              <div className="button-icon-block icon-right opacity-100">
                <div className="icon-24">
                  <div className="svg w-embed">
                    <ChevronIcon />
                  </div>
                </div>
              </div>
            </a>
            <a href="/pricing" className="button-dark button-secondary w-inline-block">
              <div className="button-text-block">
                <div className="text-heading-m">View Pricing</div>
              </div>
            </a>
          </div>

          <div className="home-cta-image-wrapper">
            <img
              src="https://cdn.prod.website-files.com/62a4ed18ddad95dde8b8bfa4/680a4b467abdcf40d0d0fa8b_home-cta.webp"
              loading="lazy"
              width={1440}
              height={924}
              alt="Two people looking at laptop, ISSO dashboard is displayed."
              className="home-cta-image"
            />
          </div>
        </div>
      </div>
    </div>
  );
}
