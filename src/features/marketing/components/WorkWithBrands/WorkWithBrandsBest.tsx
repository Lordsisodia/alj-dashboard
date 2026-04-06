// WorkWithBrandsBest - "The world's best marketers use ISSO" section
// with illustration image.

import type { WorkWithBrandsData } from './data/work-with-brands';

interface Props {
  best: WorkWithBrandsData['bestSection'];
}

export default function WorkWithBrandsBest({ best }: Props) {
  return (
    <div className="section">
      <div className="container section-container">
        <div className="work-best">
          <div className="section-head">
            <div className="section-head-wrapper">
              <div className="section-head_title">
                <h2 className="text-display-h2">{best.headline}</h2>
              </div>
              <div className="section-head_paragraph">
                <div className="text-alpha-100">
                  <p className="text-body-l">
                    {best.paragraph.split('\n').map((line, i) => (
                      <span key={i}>
                        {line}
                        {i < best.paragraph.split('\n').length - 1 && (
                          <>
                            {'\n'}
                            <br />
                          </>
                        )}
                      </span>
                    ))}
                  </p>
                </div>
              </div>
            </div>
          </div>
          <div className="work-best-body">
            <img
              src={best.imageSrc}
              srcSet={best.imageSrcSet}
              loading="lazy"
              width={1136}
              height={590}
              alt=""
              className="image-167"
            />
          </div>
        </div>
      </div>
    </div>
  );
}
