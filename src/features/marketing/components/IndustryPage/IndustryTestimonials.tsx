// IndustryTestimonials — section title and array of testimonial cards with logo, quote, headshot, bio, and screenshot.

import type { IndustryPageData, Testimonial } from './types';

interface Props {
  testimonials: IndustryPageData['testimonials'];
}

function TestimonialCard({ item }: { item: Testimonial }) {
  return (
    <div className="industries-testimonial">
      <div className="industries-testimonial-content">
        <a href={item.companyUrl} target="_blank" rel="noopener noreferrer" className="industries-testimonial-link w-inline-block">
          <img
            src={item.logoSrc}
            loading="lazy"
            alt={item.logoAlt}
            className="industries-testimonial-logo"
          />
        </a>
        <div className="industries-testimonial-copy">
          <div className="text-white">
            <blockquote className="text-display-h4">{item.quote}</blockquote>
          </div>
        </div>
        <div className="industries-testimonial-bio">
          <img
            src={item.headshot}
            loading="lazy"
            alt={`${item.name} headshot`}
            className="industires-testimonial-headshot"
          />
          <div className="industries-testimonial-bio-content">
            <div className="text-white">
              <div className="text-label-m">{item.name}</div>
            </div>
            <div className="text-alpha-100">
              <div className="text-body-s">{item.title}</div>
            </div>
          </div>
        </div>
      </div>
      <div className="industry-testimonial-image-holder">
        <img
          src={item.screenshotSrc}
          loading="lazy"
          alt={`${item.name} company screenshot`}
          className="industry-testimonial-bg"
        />
        <div className="industry-testimonial-image-fade" />
      </div>
    </div>
  );
}

export default function IndustryTestimonials({ testimonials }: Props) {
  return (
    <div className="section">
      <div className="product-page-padding-y">
        <div className="container section-container">
          {/* Section header */}
          <div className="section-head">
            <div className="section-head-wrapper">
              <div className="section-head_subtitle">
                <div className="text-overline text-white-68">Testimonials</div>
              </div>
              <div className="section-head_title">
                <h2 className="text-display-h2">{testimonials.sectionTitle}</h2>
              </div>
              <div className="section-head_paragraph">
                <div className="text-alpha-100">
                  <p className="text-body-l">
                    In the age of meta andromeda creative velocity and diversity is the only leaver to pull. See how the best brands in the world are building their workflows with ISSO.
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Testimonial cards */}
          <div className="industries-testimonial-wrapper">
            {testimonials.items.map((item, idx) => (
              <TestimonialCard key={idx} item={item} />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
