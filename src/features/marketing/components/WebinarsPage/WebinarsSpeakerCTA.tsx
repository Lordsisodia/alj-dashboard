// WebinarsSpeakerCTA - "Become a Speaker" tab content with headline, paragraph, and Apply CTA.

import type { WebinarsPageData } from './data/webinars';

interface Props {
  speakerCta: WebinarsPageData['speakerCta'];
}

function ChevronIcon() {
  return (
    <svg viewBox="0 0 20 20" width="20" height="20" fill="none" xmlns="http://www.w3.org/2000/svg">
      <g style={{ transform: 'rotate(-90deg)', transformOrigin: 'center' }}>
        <path d="M5 10L10 5L15 10" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
      </g>
    </svg>
  );
}

export default function WebinarsSpeakerCTA({ speakerCta }: Props) {
  return (
    <div className="fireside-speaker-cta">
      <div className="section-head">
        <div className="section-head-wrapper">
          <div className="section-head_title">
            <h2 className="text-display-h3">{speakerCta.headline}</h2>
          </div>
          <div className="section-head_paragraph">
            <div className="text-alpha-100">
              <p className="text-body-m">{speakerCta.paragraph}</p>
            </div>
          </div>
        </div>
      </div>
      <div className="fireside-speaker-cta-button">
        <a href={speakerCta.ctaHref} className="button-dark button-secondary w-inline-block">
          <div className="button-text-block">
            <div className="text-heading-m">{speakerCta.ctaText}</div>
          </div>
          <div className="button-icon-block icon-right">
            <div className="icon-24">
              <div className="svg w-embed"><ChevronIcon /></div>
            </div>
          </div>
        </a>
      </div>
    </div>
  );
}
