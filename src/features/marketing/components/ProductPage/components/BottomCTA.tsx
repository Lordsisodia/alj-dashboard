import ChevronIcon from './ChevronIcon';
import type { BottomCTA as BottomCTAType } from '../types';

interface Props {
  cta: BottomCTAType;
}

export default function BottomCTA({ cta }: Props) {
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
            <a href={cta.primaryCtaHref} className="button-dark button-primary w-inline-block">
              <div className="button-text-block">
                <div className="text-heading-m">{cta.primaryCtaText}</div>
              </div>
              <div className="button-icon-block icon-right opacity-100">
                <div className="icon-24">
                  <div className="svg w-embed"><ChevronIcon /></div>
                </div>
              </div>
            </a>
            {cta.secondaryCtaHref ? (
              <a href={cta.secondaryCtaHref} className="button-dark button-secondary w-inline-block">
                <div className="button-text-block">
                  <div className="text-heading-m">{cta.secondaryCtaText}</div>
                </div>
              </a>
            ) : (
              <div className="button-dark button-secondary" style={{ display: 'flex', alignItems: 'center', padding: '0 24px' }}>
                <div className="text-heading-m text-alpha-50">{cta.secondaryCtaText}</div>
              </div>
            )}
          </div>
          <div className="home-cta-image-wrapper">
            <img
              src="https://cdn.prod.website-files.com/62a4ed18ddad95dde8b8bfa4/680a4b467abdcf40d0d0fa8b_home-cta.webp"
              loading="lazy"
              width={1440}
              height={924}
              alt="Two people looking at laptop with ISSO dashboard."
              className="home-cta-image"
            />
          </div>
        </div>
      </div>
    </div>
  );
}
