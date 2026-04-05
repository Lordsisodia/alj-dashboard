import FeatureCard from './FeatureCard';
import TestimonialBlock from './TestimonialBlock';
import type { SmartFeatures } from '../types';

interface Props {
  data: SmartFeatures;
}

export default function SmartFeaturesGrid({ data }: Props) {
  if (!data.row1.length && !data.row2.length) return null;

  return (
    <div className="section">
      <div className="product-page-padding-y">
        <div className="container section-container">
          <div className="section-head">
            <div className="section-head-wrapper">
              <div className="section-head_subtitle">
                <div className="text-overline text-white-68">{data.subtitle}</div>
              </div>
              <div className="section-head_title">
                <h2 className="text-display-h2">{data.title}</h2>
              </div>
              <div className="section-head_paragraph">
                <div className="text-alpha-100">
                  <p className="text-body-l">{data.paragraph}</p>
                </div>
              </div>
            </div>
          </div>

          {data.row1.length > 0 && (
            <div className="section-content-main">
              <div className="w-layout-grid product-page-feature-grid-new">
                {data.row1.map((card, i) => (
                  <FeatureCard key={i} card={card} />
                ))}
              </div>
            </div>
          )}

          {data.testimonial1.logoSrc && (
            <div className="section">
              <div className="container w-container">
                <TestimonialBlock t={data.testimonial1} />
              </div>
            </div>
          )}

          {data.row2.length > 0 && (
            <div className="section-content-main">
              <div className="w-layout-grid product-page-feature-grid-new">
                {data.row2.map((card, i) => (
                  <FeatureCard key={i} card={card} />
                ))}
              </div>
            </div>
          )}

          {data.testimonial2.logoSrc && (
            <div className="section">
              <div className="container w-container">
                <TestimonialBlock t={data.testimonial2} />
              </div>
            </div>
          )}
        </div>
      </div>
      <div className="negative-spacing-bottom" />
    </div>
  );
}
