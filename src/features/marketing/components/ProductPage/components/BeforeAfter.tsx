import Image from 'next/image';
import type { BeforeAfter as BeforeAfterType } from '../types';

interface Props {
  data: BeforeAfterType;
}

export default function BeforeAfter({ data }: Props) {
  return (
    <section className="section">
      <div className="section-padding">
        <div className="section-white-block">
          <div className="container section-container">
            <div className="product-page-solution">
              <div className="section-head">
                <div className="section-head-wrapper">
                  <div className="section-head_title title-dark">
                    <h2 className="text-display-h3">{data.sectionTitle}</h2>
                  </div>
                  <div className="section-head_paragraph">
                    <div className="text-solid-600">
                      <p className="text-body-m">{data.sectionParagraph}</p>
                    </div>
                  </div>
                </div>
              </div>
              <div className="product-page-solution-grid">
                <div className="static-product-page-solution-card">
                  <div className="static-product-page-solution-text">
                    <div className="home-winning-card-text">
                      <div className="flex-col-gap-1 align-start">
                        <div className="text-solid-900">
                          <div className="text-label-l">{data.before.label}</div>
                        </div>
                        <div className="text-solid-500">
                          <div>{data.before.description}</div>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="static-before-wrapper" style={{ position: 'relative' }}>
                    <Image src={data.before.imageSrc} alt="" className="static-product-page-image object-cover" fill sizes="(max-width: 768px) 100vw, 50vw" />
                  </div>
                </div>
                <div className="static-product-page-solution-card solution-after" style={{ position: 'relative' }}>
                  <div className="static-product-page-solution-text">
                    <div className="home-winning-card-text">
                      <div className="flex-col-gap-1 align-start">
                        <div className="text-white">
                          <div className="text-label-l">{data.after.label}</div>
                        </div>
                        <div className="text-alpha-100">
                          <div>{data.after.description}</div>
                        </div>
                      </div>
                    </div>
                  </div>
                  <Image src={data.after.imageSrc} alt="" className="static-product-page-image object-cover" fill sizes="(max-width: 768px) 100vw, 50vw" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
