'use client';

import { useState } from 'react';
import { SolutionIcon, GraphCard, Testimonial } from './types';

interface Props {
  icons: SolutionIcon[];
  graphCards: GraphCard[];
  subtext: string;
  testimonials: Testimonial[];
}

function GraphSVG({ color }: { color: 'teal' | 'red' | 'white' | 'rainbow' }) {
  const strokeColor =
    color === 'teal'
      ? '#7CDDB5'
      : color === 'red'
      ? '#E77F6E'
      : color === 'white'
      ? 'white'
      : undefined;

  if (color === 'rainbow') {
    return (
      <svg xmlns="http://www.w3.org/2000/svg" fill="none" width="100%" height="100%" viewBox="0 0 440 260">
        <defs>
          <linearGradient id="rainbow-svg-grad" x1="91.122" x2="345.733" y1="205.894" y2="165.369" gradientUnits="userSpaceOnUse">
            <stop stopColor="#E77F6E" />
            <stop offset="0.16" stopColor="#FFC852" />
            <stop offset="0.36" stopColor="#D2E382" />
            <stop offset="0.6" stopColor="#7CDDB5" />
            <stop offset="0.8" stopColor="#5DBCE5" />
            <stop offset="1" stopColor="#5D78E5" />
          </linearGradient>
        </defs>
        <path className="svg-animate-path" stroke="url(#rainbow-svg-grad)" strokeLinecap="round" strokeWidth="2" d="M0 208h440" />
      </svg>
    );
  }

  if (color === 'white') {
    return (
      <svg xmlns="http://www.w3.org/2000/svg" fill="none" width="100%" height="100%" viewBox="0 0 440 260">
        <path
          className="svg-animate-path svg-graph-ref"
          stroke="white"
          strokeWidth="1.5"
          d="m0 208 50.008-48.156a11.999 11.999 0 0 1 9.507-3.297l45.015 4.461a12.002 12.002 0 0 0 8.822-2.687l43.117-35.581a11.997 11.997 0 0 1 10.264-2.454l42.548 9.543c3.322.745 6.804.044 9.579-1.928l29.475-20.952a12 12 0 0 1 14.788.691l27.781 23.949a12.04 12.04 0 0 0 16.486-.709c13.486-13.811 41.528-42.238 62.36-61.38 19.004-17.462 68.75-70 68.75-70"
        />
      </svg>
    );
  }

  return (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" width="100%" height="100%" viewBox="0 0 440 260">
      <path
        className="svg-animate-path"
        stroke={strokeColor}
        strokeWidth="1.5"
        d="m0 208 50.008-48.156a11.999 11.999 0 0 1 9.507-3.297l45.015 4.461a12.002 12.002 0 0 0 8.822-2.687l43.117-35.581a11.997 11.997 0 0 1 10.264-2.454l42.548 9.543c3.322.745 6.804.044 9.579-1.928l29.475-20.952a12 12 0 0 1 14.788.691l27.781 23.949a12.04 12.04 0 0 0 16.486-.709c13.486-13.811 41.528-42.238 62.36-61.38 19.004-17.462 68.75-70 68.75-70"
      />
    </svg>
  );
}

export default function LensSolutionSection({ icons, graphCards, subtext, testimonials }: Props) {
  const [activeTestimonial, setActiveTestimonial] = useState(0);

  return (
    <section className="section">
      <div className="section-padding">
        <div className="section-white-block">
          <div className="container section-container">
            {/* Solution Icons */}
            <div className="lens-solution-icons">
              {icons.map((icon) => (
                <div key={icon.title} className="lens-solution-icons-card">
                  <div className="icon-24">
                    <div className="svg w-embed">
                      <svg xmlns="http://www.w3.org/2000/svg" width="100%" height="100%" fill="none" viewBox="0 0 24 24">
                        <path stroke="#4C505F" strokeLinecap="round" strokeWidth="2" d={icon.svgPath} />
                      </svg>
                    </div>
                  </div>
                  <div className="lens-solution-text">
                    <h3 className="text-label-m text-solid-700">{icon.title}</h3>
                    <p className="text-body-m text-solid-500">{icon.description}</p>
                  </div>
                </div>
              ))}
            </div>

            {/* Graph Section */}
            <div className="lens-solution-graph">
              <h2 className="text-display-h3 text-solid-900">Axe the ad spend tax.</h2>
              <div className="lens-solution-graph-grid">
                {graphCards.map((card, i) => (
                  <div key={card.title} className={`lens-solution-graph-card svg-animation-container${card.isLens ? ' is-lens' : ''}`}>
                    <div>
                      <h3 className={card.isLens ? 'text-label-l text-white' : 'text-label-l text-solid-800'}>
                        {card.title}
                      </h3>
                      <p className="text-body-m text-alpha-100">{card.description}</p>
                    </div>
                    <div className={`lens-solution-graph-illustration${card.isLens ? ' is-lens' : ''}`}>
                      {i === 0 && (
                        <>
                          <div className="vertical-line-container">
                            <div className="vertical-line" />
                            {[...Array(9)].map((_, j) => (
                              <div key={j} className="vertical-line bg-current" />
                            ))}
                          </div>
                          <div className="horizontal-line-container">
                            {[...Array(6)].map((_, j) => (
                              <div key={j} className="horizontal-line bg-current" />
                            ))}
                          </div>
                        </>
                      )}
                      {i === 1 && (
                        <div className="horizontal-line-container">
                          {[...Array(6)].map((_, j) => (
                            <div key={j} className="horizontal-line bg-current" />
                          ))}
                        </div>
                      )}
                      {i === 1 && (
                        <div className="vertical-line-container">
                          {[...Array(8)].map((_, j) => (
                            <div key={j} className="vertical-line bg-current" />
                          ))}
                        </div>
                      )}
                      <div className="lens-solution-graph-svg">
                        <GraphSVG color={card.legend[0].color} />
                      </div>
                      <div className="lens-solution-graph-svg">
                        <GraphSVG color={card.legend[1].color} />
                      </div>
                    </div>
                    <div className="lens-solution-legend">
                      {card.legend.map((item) => (
                        <div key={item.label} className="lens-solution-legend-badge">
                          <div className={`dot is-${item.color}`} />
                          <div className="text-body-s">{item.label}</div>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
              <div className="max-w-lg mx-auto text-pretty text-solid-600">
                <p>{subtext}</p>
              </div>
            </div>

            {/* Testimonial Carousel */}
            <div data-tabs-name="sharing & presenting" data-tabs="" className="home-sharing">
              <div className="home-sharing-content">
                <div className="section-head is-align-left">
                  <div className="text-overline text-solid-500">CREATIVE REPORTING</div>
                  <h2 className="text-display-h3">Beautiful, shareable white-labeled reports.</h2>
                  <p className="text-body-l text-solid-600">
                    Make reporting look as good as your performance. Create fully customizable reports and generate external
                    links to keep everyone in the loop.
                  </p>
                </div>
                <div className="line" />
              </div>
              <div className="lens-solution-report-main">
                <div className="lens-solution-report-panes">
                  {testimonials.map((t, i) => (
                    <div key={t.name} className={`lens-solution-report-pane${activeTestimonial === i ? ' is-active' : ''}`}>
                      <div className="lens-solution-report-quote-inner">
                        <img
                          src={t.avatarUrl}
                          width={84}
                          loading="lazy"
                          alt={`${t.name} headshot`}
                          className="lens-solution-report-avatar"
                        />
                        <div className="lens-solution-report-quote-text">
                          <p className="text-body-s">{t.quote}</p>
                        </div>
                        <div className="lens-solution-report-position">
                          <strong>{t.name}</strong>
                          <div className="text-overline text-solid-300">
                            {t.title} @ {t.company}
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
                <div className="lens-solution-report-controls">
                  <button
                    className="arrow-button"
                    onClick={() => setActiveTestimonial((p) => (p === 0 ? testimonials.length - 1 : p - 1))}
                    aria-label="Previous testimonial"
                  >
                    <div className="svg w-embed">
                      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 18 18" width="18" height="18">
                        <use href="#sprite-arrow" width="18" height="18" />
                      </svg>
                    </div>
                  </button>
                  <button
                    className="arrow-button"
                    onClick={() => setActiveTestimonial((p) => (p + 1) % testimonials.length)}
                    aria-label="Next testimonial"
                  >
                    <div className="svg w-embed">
                      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 18 18" width="18" height="18">
                        <use href="#sprite-arrow" width="18" height="18" style={{ transform: 'rotate(180deg)', transformOrigin: 'center' }} />
                      </svg>
                    </div>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
