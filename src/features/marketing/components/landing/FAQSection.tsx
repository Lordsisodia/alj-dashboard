'use client';

import { useState } from 'react';

interface FAQItem {
  question: string;
  answer: string;
}

const faqData: FAQItem[] = [
  {
    question: 'What do I get on the Free plan?',
    answer: 'You get browse-only access to Hub, limited Intelligence tokens for trend analysis, and 2 free AI-generated videos per week. No credit card required.',
  },
  {
    question: 'How does Per Model pricing work?',
    answer: 'Choose how many videos per day you want generated per model — from 1 to 10. The price per video drops as volume increases, from $2.49 at 1/day down to $1.25 at 10/day.',
  },
  {
    question: 'What does \'you cover API costs\' mean on Unlimited?',
    answer: 'The $129/model/month covers the full ISSO platform. Video generation uses AI models (Kling, Higgsfield) which cost approximately $1 per video. You pay the generation cost directly — no markup.',
  },
  {
    question: 'Can I cancel anytime?',
    answer: 'Yes. No contracts, no lock-in. Cancel anytime and your access continues until the end of your billing period.',
  },
  {
    question: 'How does the 7-day trial work?',
    answer: 'Sign up, get full access to everything on the Per Model plan for 7 days. No credit card required. If you don\'t upgrade, you drop to the Free plan.',
  },
  {
    question: 'What\'s included in Enterprise?',
    answer: 'Everything in Unlimited plus: dedicated account manager, custom integrations, SLA, 24hr agent builds, and volume pricing on API costs. Talk to us to design a plan.',
  },
  {
    question: 'How many models can I manage?',
    answer: 'Free plan: 1 model profile. Per Model and Unlimited: unlimited model profiles. Each model gets their own content pipeline.',
  },
  {
    question: 'What AI models do you use for video generation?',
    answer: 'We use Kling, Higgsfield, and Replicate. Content Gen automatically selects the best model for each brief. You can also specify preferences per model profile.',
  },
];

function ChevronIcon() {
  return (
    <svg viewBox="0 0 20 20" width="20" height="20" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M5 10L10 5L15 10" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function renderAnswerWithLinks(answer: string) {
  const emailRegex = /([a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,})/g;
  const parts = answer.split(emailRegex);

  return parts.map((part, i) => {
    if (emailRegex.test(part)) {
      emailRegex.lastIndex = 0;
      return (
        <a key={i} href={`mailto:${part}`} style={{ color: 'inherit' }}>
          {part}
        </a>
      );
    }
    return part;
  });
}

function FAQBlock({ item, isExpanded, onToggle }: { item: FAQItem; isExpanded: boolean; onToggle: () => void }) {
  return (
    <div
      role="button"
      data-accordion-item=""
      data-expanded={isExpanded}
      aria-expanded={isExpanded}
      className="faq-block"
      onClick={onToggle}
      style={{ cursor: 'pointer' }}
    >
      <div className="faq-block_content">
        <div className="faq-block_head">
          <h4 className="text-label-l">{item.question}</h4>
        </div>
        {isExpanded && (
          <div className="faq-block_body">
            <div className="faq-block_answer">
              <div className="text-alpha-100">
                <div className="text-body-s w-richtext">
                  <p>{renderAnswerWithLinks(item.answer)}</p>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
      <div className="faq-block_icon">
        <div className="icon-24">
          <svg viewBox="0 0 20 20" width="100%" height="100%" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path className="faq-chevron" d="M5 10L10 5L15 10" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </div>
      </div>
    </div>
  );
}

export default function FAQSection() {
  const [expandedIndex, setExpandedIndex] = useState<number | null>(null);

  const handleToggle = (index: number) => {
    setExpandedIndex(expandedIndex === index ? null : index);
  };

  return (
    <div className="section">
      <div className="container">
        <div className="faq">
          <div className="section-head">
            <div className="section-head_title">
              <h2 className="text-display-h3">Questions? We have answers.</h2>
            </div>
            <div className="section-head_paragraph is-large">
              <p className="text-body-l text-white-68">Still curious? Here are some of our frequently asked questions. If you can't find your questions here, please contact our support.</p>
            </div>
          </div>
          <div data-accordion-container="" className="faq-block-container">
            <style>{`
              .faq-block {
                cursor: pointer;
              }
              .faq-chevron {
                transition: transform 900ms cubic-bezier(0.19, 1, 0.22, 1);
              }
              [data-expanded="true"] .faq-chevron {
                transform: rotate(180deg);
              }
              [data-expanded="true"] .faq-block_head {
                color: white;
              }
              [data-expanded="true"] .faq-block_body {
                height: auto;
                overflow: visible;
              }
            `}</style>
            <div className="w-dyn-list">
              <div role="list" className="w-dyn-items">
                {faqData.map((item, index) => (
                  <div key={index} role="listitem" className="w-dyn-item">
                    <FAQBlock
                      item={item}
                      isExpanded={expandedIndex === index}
                      onToggle={() => handleToggle(index)}
                    />
                  </div>
                ))}
              </div>
            </div>
          </div>
          <div className="faq-buttons">
            <a href="#" className="button-dark ghost-icon-button w-inline-block">
              <div className="button-icon-block icon-left">
                <div className="icon-24">
                  <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M5.5 8.5H6.25C6.25 8.08579 5.91421 7.75 5.5 7.75V8.5ZM5.5 13.375V14.125C5.91421 14.125 6.25 13.7892 6.25 13.375H5.5ZM14.875 8.5V7.75C14.4608 7.75 14.125 8.08579 14.125 8.5H14.875ZM14.875 13.375H14.125C14.125 13.7892 14.4608 14.125 14.875 14.125V13.375ZM10.75 15.25C10.75 14.8358 10.4142 14.5 10 14.5C9.58577 14.5 9.25 14.8358 9.25 15.25H10.75ZM16.5625 13.375C16.5625 12.9608 16.2267 12.625 15.8125 12.625C15.3983 12.625 15.0625 12.9608 15.0625 13.375H16.5625ZM4.375 9.25H5.5V7.75H4.375V9.25ZM4.75 8.5V13.375H6.25V8.5H4.75ZM5.5 12.625H4.375V14.125H5.5V12.625ZM4 12.25V9.625H2.5V12.25H4ZM4.375 12.625C4.16789 12.625 4 12.4571 4 12.25H2.5C2.5 13.2855 3.33947 14.125 4.375 14.125V12.625ZM4.375 7.75C3.33947 7.75 2.5 8.58948 2.5 9.625H4C4 9.41792 4.16789 9.25 4.375 9.25V7.75ZM14.875 9.25H16V7.75H14.875V9.25ZM16.375 9.625V12.25H17.875V9.625H16.375ZM16 12.625H14.875V14.125H16V12.625ZM15.625 13.375V8.5H14.125V13.375H15.625ZM16.375 12.25C16.375 12.4571 16.2071 12.625 16 12.625V14.125C17.0355 14.125 17.875 13.2855 17.875 12.25H16.375ZM16 9.25C16.2071 9.25 16.375 9.41792 16.375 9.625H17.875C17.875 8.58948 17.0355 7.75 16 7.75V9.25ZM5.5 8.3125C5.5 5.98035 7.54729 4 10.1875 4V2.5C6.82161 2.5 4 5.05277 4 8.3125H5.5ZM10.1875 4C12.8277 4 14.875 5.98035 14.875 8.3125H16.375C16.375 5.05277 13.5534 2.5 10.1875 2.5V4ZM4 8.3125V8.5H5.5V8.3125H4ZM14.875 8.3125V8.5H16.375V8.3125H14.875ZM12.4375 16H11.125V17.5H12.4375V16ZM10.75 15.625V15.25H9.25V15.625H10.75ZM15.0625 13.375C15.0625 14.8247 13.8872 16 12.4375 16V17.5C14.7157 17.5 16.5625 15.6532 16.5625 13.375H15.0625ZM11.125 16C10.9179 16 10.75 15.8321 10.75 15.625H9.25C9.25 16.6605 10.0895 17.5 11.125 17.5V16Z" fill="white" style={{ fill: 'white', fillOpacity: 1 }} />
                  </svg>
                </div>
              </div>
              <div className="button-text-block">
                <div className="text-heading-m">Contact support</div>
              </div>
            </a>
            <a href="https://isso.featurebase.app/help" target="_blank" rel="noopener noreferrer" className="button-dark ghost-icon-button w-inline-block">
              <div className="button-icon-block icon-left">
                <div className="icon-24">
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M12 7.04982L6.0905 5.73659C4.96637 5.48678 3.90002 6.34217 3.90002 7.49372V16.4059C3.90002 17.2495 4.48598 17.98 5.30955 18.163L12 19.6498M12 7.04982L17.9095 5.73659C19.0337 5.48678 20.1 6.34217 20.1 7.49372V16.4059C20.1 17.2495 19.514 17.98 18.6905 18.163L12 19.6498M12 7.04982V19.6498" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
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
