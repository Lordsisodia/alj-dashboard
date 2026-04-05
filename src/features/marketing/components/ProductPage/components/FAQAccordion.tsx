'use client';
import { useState } from 'react';
import type { FAQ as FAQType } from '../types';

interface Props {
  data: FAQType;
}

export default function FAQAccordion({ data }: Props) {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  if (!data.items || data.items.length === 0) return null;

  return (
    <div className="section">
      <div className="container">
        <div className="faq">
          <div className="section-head">
            <div className="section-head-wrapper">
              <div className="section-head_subtitle">
                <span style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: 8,
                  background: 'rgba(255,255,255,0.06)',
                  border: '1px solid rgba(255,255,255,0.1)',
                  borderRadius: 100,
                  padding: '8px 18px',
                  fontSize: '0.75rem',
                  lineHeight: '1rem',
                  letterSpacing: '0.166667em',
                  textTransform: 'uppercase',
                  color: 'rgba(255,255,255,0.68)',
                }}>
                  <span style={{
                    width: 6,
                    height: 6,
                    borderRadius: '50%',
                    background: '#fff',
                    boxShadow: '0 0 4px rgba(255,255,255,0.6)',
                    animation: 'pulse-white 2s ease-in-out infinite',
                    flexShrink: 0,
                  }} />
                  FAQ
                </span>
              </div>
              <div className="section-head_title">
                <h3 className="text-display-h2">{data.sectionTitle}</h3>
              </div>
              <div className="section-head_paragraph">
                <div className="text-alpha-100">
                  <p className="text-body-l">{data.sectionParagraph}</p>
                </div>
              </div>
            </div>
          </div>
          <div className="faq-block-container">
            <style>{`.chevron-icon { transition: all 900ms cubic-bezier(0.19, 1, 0.22, 1); } [data-expanded="true"] .chevron-icon { transform: rotate(180deg); } [data-expanded="true"] .faq-block_head { color: white; } @keyframes pulse-white { 0%, 100% { opacity: 1; box-shadow: 0 0 4px rgba(255,255,255,0.6); } 50% { opacity: 0.5; box-shadow: 0 0 2px rgba(255,255,255,0.3); } }`}</style>
            {data.items.map((item, i) => (
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
                          <path className="chevron-icon" d="M5 10L10 5L15 10" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
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
                          <p>{item.answer}</p>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
