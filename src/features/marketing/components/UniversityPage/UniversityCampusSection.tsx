// UniversityCampusSection — "Welcome to Your Campus" + "Become a Professor" left-right layout.

import type { UniversityPageData } from './data/university';

interface Props {
  campus: UniversityPageData['campus'];
  professor: UniversityPageData['professor'];
}

function ChevronIcon() {
  return (
    <svg viewBox="0 0 20 20" width="20" height="20" fill="none" xmlns="http://www.w3.org/2000/svg">
      <g style={{ transform: 'rotate(-90deg)', transformOrigin: 'center' }}>
        <path
          d="M5 10L10 5L15 10"
          stroke="currentColor"
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </g>
    </svg>
  );
}

export default function UniversityCampusSection({ campus, professor }: Props) {
  return (
    <div className="section">
      <div className="container section-container">
        <div className="left-right-section-wrapper">
          {/* Campus block — text left, image right */}
          <div className="left-right-section">
            <div className="left-right-section-content">
              <div className="section-head is-align-left">
                <div className="left-right-product-icon-wrapper">
                  <img
                    src={campus.logoSrc}
                    loading="lazy"
                    alt={campus.logoAlt}
                    className="left-right-section-icon"
                  />
                </div>
                <div className="text-alpha-300" />
                <div className="section-head_title">
                  <div className="text-white">
                    <h2 className="text-display-h3">{campus.title}</h2>
                  </div>
                </div>
                <div className="section-head_paragraph">
                  <div className="text-alpha-100">
                    <p className="text-body-l">
                      {campus.paragraphs.map((p, i) => (
                        <span key={i}>
                          {p}
                          {i < campus.paragraphs.length - 1 && <br />}
                          {i < campus.paragraphs.length - 1 && <br />}
                        </span>
                      ))}
                    </p>
                  </div>
                </div>
              </div>
            </div>
            <div className="left-right-section-image-wrapper">
              <img
                width={560}
                loading="lazy"
                alt={campus.imageAlt}
                src={campus.imageSrc}
                className="left-right-section-image"
              />
            </div>
          </div>

          {/* Professor block — image left, text right */}
          <div className="left-right-section">
            <div className="left-right-section-image-wrapper">
              <img
                width={560}
                loading="lazy"
                alt={professor.imageAlt}
                src={professor.imageSrc}
                className="left-right-section-image"
              />
            </div>
            <div className="left-right-section-content">
              <div className="section-head is-align-left">
                <div className="text-alpha-300" />
                <div className="section-head_title">
                  <div className="text-white">
                    <h2 className="text-display-h3">{professor.title}</h2>
                  </div>
                </div>
                <div className="section-head_paragraph">
                  <div className="text-alpha-100">
                    <p className="text-body-l">{professor.paragraph}</p>
                  </div>
                </div>
              </div>
              <div>
                <a
                  href={professor.ctaHref}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="button-dark button-secondary w-inline-block"
                >
                  <div className="button-text-block">
                    <div className="text-heading-m">{professor.ctaText}</div>
                  </div>
                  <div className="button-icon-block icon-right">
                    <div className="icon-24">
                      <div className="svg w-embed">
                        <ChevronIcon />
                      </div>
                    </div>
                  </div>
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
