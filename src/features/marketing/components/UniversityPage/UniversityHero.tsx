// UniversityHero — hero section with FU logo, headline, and course carousel.

import type { UniversityPageData } from './data/university';

interface Props {
  hero: UniversityPageData['hero'];
}

export default function UniversityHero({ hero }: Props) {
  return (
    <section id="product-hero-section" className="section relative">
      <div className="container">
        <div className="fireside-hero">
          {/* FU Logo */}
          <div className="fireside-hero-logo-wrapper">
            <img
              src={hero.logoSrc}
              loading="lazy"
              alt={hero.logoAlt}
              className="fu-logo"
            />
          </div>

          {/* Headline */}
          <div className="university-hero-content">
            <div className="hero-text">
              <div className="text-white">
                <h2 className="text-display-h2">{hero.headline}</h2>
              </div>
            </div>
          </div>

          {/* Course carousel */}
          <div className="container section-container">
            <div className="university-classes-carousel">
              {hero.courses.map((course, i) => (
                <div
                  key={i}
                  className={`cards-wrapper-new${i > 0 ? ' mobile-hide' : ''}${i === 1 ? ' _2' : ''}${i === 2 ? ' _2' : ''}${i === 4 ? ' _2' : ''}`}
                >
                  <a
                    href={course.href}
                    className={`course-card${!course.isReady ? ' coming-soon' : ''} w-inline-block`}
                  >
                    {/* Watch Now overlay for ready courses */}
                    {course.isReady && course.videoPlaySrc && (
                      <div style={{ opacity: 0 }} className="video-coming-soon-button-copy">
                        <img loading="lazy" src={course.videoPlaySrc} alt="play icon" />
                        <div>Watch Now</div>
                      </div>
                    )}

                    {/* Wordmark or Coming Soon */}
                    <div className={`course-title-wrapper${!course.isReady ? ' coming-soon' : ''}`}>
                      {course.isReady && course.wordmarkSrc ? (
                        <img
                          src={course.wordmarkSrc}
                          loading="lazy"
                          alt={course.wordmarkAlt}
                          className="image-154"
                        />
                      ) : (
                        <div className="text-block-95">Coming Soon</div>
                      )}
                    </div>

                    {/* F-U icon */}
                    <img
                      src="https://cdn.prod.website-files.com/62a4ed18ddad95dde8b8bfa4/670fe1a3b5fc3cea38b7d07b_f-u-logo-transparent-white.svg"
                      loading="lazy"
                      alt="ISSO university icon"
                      className={`image-155${!course.isReady ? ' coming-soon' : ''}`}
                    />

                    <div className={`fu-card-shine${!course.isReady ? ' coming-soon' : ''}`} />
                  </a>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
      <div className="foreplay-university-hero-brackground" />
    </section>
  );
}
