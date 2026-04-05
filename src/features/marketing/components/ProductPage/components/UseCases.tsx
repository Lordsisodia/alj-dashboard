import Image from 'next/image';
import type { UseCases as UseCasesType } from '../types';

interface Props {
  data: UseCasesType;
}

export default function UseCases({ data }: Props) {
  return (
    <div className="section">
      <div className="product-page-padding-y">
        <div className="section-content-main">
          <div className="container">
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
          </div>
          <div data-carousel="" className="product-carousel">
            <div className="container section-container">
              <div className="product-carousel-viewport">
                <div data-track="" className="product-carousel-track">
                  {data.items.map((item, i) => (
                    <div key={i} className="slide">
                      <div className="slide-card">
                        <Image src={item.imageSrc} width={595} height={397} alt={item.title} className="product-carousel-image" />
                        <div className="product-page-carousel-content">
                          <div className="product-page-carousel-text-content">
                            <h3 className="text-label-m">{item.title}</h3>
                            <div className="text-alpha-100">
                              <p className="text-body-m">{item.description}</p>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
                <div className="slide-arrows">
                  <a data-dir="left" aria-label="Previous" href="#" className="carousel-arrow is-disabled w-inline-block">
                    <div className="carousel-icon w-embed">
                      <svg width="18" height="18" viewBox="0 0 18 18" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path transform="rotate(180)" transform-origin="center" d="M10.5 4.5L15 9L10.5 13.5M14.25 9H3" stroke="currentColor" strokeOpacity="0.44" style={{ stroke: 'white', strokeOpacity: 0.44 }} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                      </svg>
                    </div>
                  </a>
                  <a data-dir="right" aria-label="Next" href="#" className="carousel-arrow w-inline-block">
                    <div className="carousel-icon w-embed">
                      <svg width="18" height="18" viewBox="0 0 18 18" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M10.5 4.5L15 9L10.5 13.5M14.25 9H3" stroke="currentColor" strokeOpacity="0.44" style={{ stroke: 'white', strokeOpacity: 0.44 }} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                      </svg>
                    </div>
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
