'use client';
// AffiliatesPage - top-level component for the /affiliates route.
// Assembles: hero (canvas + content), 3-step how-it-works grid, FAQ accordion, FAQ buttons, footer.

import { useState } from 'react';
import Footer from '@/features/marketing/components/Footer';
import type { AffiliatesPageData } from './data/affiliates';

// ─── Chevron icon (matches codebase pattern) ──────────────────────────────────
function ChevronIcon({ className = '' }: { className?: string }) {
  return (
    <svg viewBox="0 0 20 20" width="20" height="20" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
      <path d="M5 10L10 5L15 10" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

// ─── Hero ─────────────────────────────────────────────────────────────────────
function AffiliatesHero({ hero }: { hero: AffiliatesPageData['hero'] }) {
  return (
    <section id="product-hero-section" className="section relative">
      {/* Canvas background - same class as HTML source */}
      <canvas id="product-hero-canvas" className="product-hero-canvas" />
      <div className="container">
        <div className="fireside-hero">
          <div className="product-hero-content">
            <div className="hero-text">
              <h1 className="text-overline">{hero.overline}</h1>
              <h2 className="text-display-h1 hero-title">{hero.headline}</h2>
              <div className="max-w-lg">
                <div className="text-alpha-100">
                  <p className="text-body-l text-white-84">{hero.paragraph}</p>
                </div>
              </div>
            </div>
            <a
              href={hero.ctaHref}
              target="_blank"
              rel="noopener noreferrer"
              className="button-dark button-primary w-inline-block"
            >
              <div className="button-text-block">
                <div className="text-heading-m">{hero.ctaLabel}</div>
              </div>
              <div className="button-icon-block icon-right opacity-100">
                <div className="icon-24">
                  <div className="svg w-embed"><ChevronIcon /></div>
                </div>
              </div>
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}

// ─── How it works (3-step grid) ─────────────────────────────────────────────
function AffiliatesSteps({ cards }: { cards: AffiliatesPageData['steps']['cards'] }) {
  return (
    <div className="section">
      <div className="container section-container">
        <div className="section-content-main">
          <div className="lens-security-grid">
            {cards.map((card, idx) => (
              <div key={idx} className={`lens-security-card${idx === 1 ? ' is-middle' : ''}`}>
                <div className="lens-security-card-head">
                  <h3 className="text-label-m">{card.title}</h3>
                </div>
                <div className="lens-security-card-body home-card-body">
                  <img
                    src={card.imageSrc}
                    loading="lazy"
                    alt={card.imageAlt}
                    srcSet={card.imageSrcSet}
                    sizes="(max-width: 767px) 100vw, 768px"
                    className="lens-security-card-illustration"
                  />
                </div>
                <div className="lens-security-card-footer">
                  <div className="card-button-holder">
                    <div className="text-alpha-50">
                      <div className="text-body-m">{card.body}</div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── FAQ Accordion ───────────────────────────────────────────────────────────
function AffiliatesFAQ({ faq }: { faq: AffiliatesPageData['faq'] }) {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  return (
    <div className="section">
      <div className="container">
        <div className="faq">
          <div className="section-head">
            <div className="section-head-wrapper">
              <div className="section-head_subtitle">
                <div className="text-overline text-white-68">{faq.sectionSubtitle}</div>
              </div>
              <div className="section-head_title">
                <h3 className="text-display-h2">{faq.sectionTitle}</h3>
              </div>
              <div className="section-head_paragraph">
                <div className="text-alpha-100">
                  <p className="text-body-l">{faq.paragraph}</p>
                </div>
              </div>
            </div>
          </div>

          <div className="faq-block-container">
            {/* Same CSS-transition pattern used in ProductPage/FAQAccordion.tsx */}
            <style>{`
              .aff-chevron-icon { transition: all 900ms cubic-bezier(0.19, 1, 0.22, 1); }
              [data-expanded="true"] .aff-chevron-icon { transform: rotate(180deg); }
              [data-expanded="true"] .faq-block_head { color: white; }
            `}</style>
            {faq.items.map((item, i) => (
              <div
                key={i}
                className={`faq-block${openIndex === i ? ' is-open' : ''}`}
                data-expanded={openIndex === i ? 'true' : 'false'}
              >
                <button
                  className="faq-block_head"
                  onClick={() => setOpenIndex(openIndex === i ? null : i)}
                  style={{ background: 'none', border: 'none', cursor: 'pointer', width: '100%', textAlign: 'left' }}
                >
                  <h4 className="text-label-l">{item.question}</h4>
                  <div className="faq-block_icon">
                    <div className="icon-24">
                      <div className="svg w-embed">
                        <svg viewBox="0 0 20 20" width="20" height="20" xmlns="http://www.w3.org/2000/svg">
                          <path
                            className="aff-chevron-icon"
                            d="M5 10L10 5L15 10"
                            stroke="white"
                            strokeWidth="1.5"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          />
                        </svg>
                      </div>
                    </div>
                  </div>
                </button>
                {openIndex === i && (
                  <div className="faq-block_body">
                    <div className="faq-block_answer">
                      <div className="text-alpha-100">
                        <div className="text-body-s w-richtext">
                          {item.answer.includes('<a ') ? (
                            <p dangerouslySetInnerHTML={{ __html: item.answer }} />
                          ) : (
                            <p>{item.answer}</p>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>

          {/* FAQ action buttons */}
          <div className="faq-buttons">
            <a href="#" className="button-dark ghost-icon-button w-inline-block">
              <div className="button-icon-block icon-left">
                <div className="icon-24">
                  <div className="svg w-embed">
                    <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <g opacity="0.68">
                        <path d="M10 6.25C7.92894 6.25 6.25 7.92893 6.25 10C6.25 12.071 7.92894 13.75 10 13.75C12.071 13.75 13.75 12.071 13.75 10C13.75 7.92893 12.071 6.25 10 6.25ZM5 10C5 7.10051 7.10051 5 10 5C12.8995 5 15 7.10051 15 10C15 12.8995 12.8995 15 10 15C7.10051 15 5 12.8995 5 10Z" fill="white" />
                        <path d="M10 8.75V10M10 11.25H10.0075" stroke="white" strokeWidth="1.5" strokeLinecap="round" />
                      </g>
                    </svg>
                  </div>
                </div>
              </div>
              <div className="button-text-block">
                <div className="text-heading-m">Contact support</div>
              </div>
            </a>
            <a
              href="/help"
              target="_blank"
              rel="noopener noreferrer"
              className="button-dark ghost-icon-button w-inline-block"
            >
              <div className="button-icon-block icon-left">
                <div className="icon-24">
                  <div className="svg w-embed">
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <g opacity="0.68">
                        <path d="M12 7.05L6.09 5.74C4.96 5.49 3.9 6.34 3.9 7.49V16.41C3.9 17.25 4.49 17.98 5.31 18.16L12 19.65M12 7.05L17.91 5.74C19.04 5.49 20.1 6.34 20.1 7.49V16.41C20.1 17.25 19.51 17.98 18.69 18.16L12 19.65M12 7.05V19.65" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                      </g>
                    </svg>
                  </div>
                </div>
              </div>
              <div className="button-text-block">
                <div className="text-heading-m">Knowledge Base</div>
              </div>
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── Root export ─────────────────────────────────────────────────────────────
export default function AffiliatesPage({ data }: { data: AffiliatesPageData }) {
  return (
    <div style={{ background: '#020308', minHeight: '100vh' }}>
      <div className="main">
        <AffiliatesHero hero={data.hero} />
        <AffiliatesSteps cards={data.steps.cards} />
        <AffiliatesFAQ faq={data.faq} />
      </div>
      <Footer />
    </div>
  );
}
