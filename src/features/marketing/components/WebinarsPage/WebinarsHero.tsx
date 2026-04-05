'use client';
// WebinarsHero — hero section with Fireside logo, headline, CTA, and tabbed content.

import { useState } from 'react';
import Image from 'next/image';
import type { WebinarsPageData } from './data/webinars';
import type { WebinarReplay } from './data/webinars';
import WebinarsReplayList from './WebinarsReplayList';
import WebinarsSpeakerCTA from './WebinarsSpeakerCTA';

interface Props {
  hero: WebinarsPageData['hero'];
  replays: WebinarReplay[];
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

function CalendarIcon() {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M7.08337 5.33333V6.16667H17.0834V5.33333V4.5H7.08337V5.33333ZM18.75 7H17.9167V8.66667H18.75H19.5834V7H18.75ZM18.75 8.66667H17.9167V17H18.75H19.5834V8.66667H18.75ZM17.0834 18.6667V17.8333H7.08337V18.6667V19.5H17.0834V18.6667ZM5.41671 17H6.25004V8.66667H5.41671H4.58337V17H5.41671ZM5.41671 8.66667H6.25004V7H5.41671H4.58337V8.66667H5.41671ZM5.41671 8.66667V9.5H18.75V8.66667V7.83333H5.41671V8.66667ZM7.08337 18.6667V17.8333C6.62314 17.8333 6.25004 17.4602 6.25004 17H5.41671H4.58337C4.58337 18.3807 5.70267 19.5 7.08337 19.5V18.6667ZM18.75 17H17.9167C17.9167 17.4602 17.5436 17.8333 17.0834 17.8333V18.6667V19.5C18.4641 19.5 19.5834 18.3807 19.5834 17H18.75ZM17.0834 5.33333V6.16667C17.5436 6.16667 17.9167 6.53977 17.9167 7H18.75H19.5834C19.5834 5.61929 18.4641 4.5 17.0834 4.5V5.33333ZM7.08337 5.33333V4.5C5.70267 4.5 4.58337 5.61929 4.58337 7H5.41671H6.25004C6.25004 6.53977 6.62314 6.16667 7.08337 6.16667V5.33333Z" fill="white" />
    </svg>
  );
}

function PlayIcon() {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M5.91667 5.33331H17.5833M10.9167 11.5833V14.9166L13 13.25L10.9167 11.5833ZM5.91667 18.6666H17.5833C18.5038 18.6666 19.25 17.9205 19.25 17V9.49998C19.25 8.5795 18.5038 7.83331 17.5833 7.83331H5.91667C4.99619 7.83331 4.25 8.5795 4.25 9.49998V17C4.25 17.9205 4.99619 18.6666 5.91667 18.6666Z" stroke="white" strokeWidth="1.66667" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function MicIcon() {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M15.2499 11.1667V7.83333C15.2499 5.99238 13.7575 4.5 11.9166 4.5C10.0756 4.5 8.58325 5.99238 8.58325 7.83333V11.1667C8.58325 13.0076 10.0756 14.5 11.9166 14.5C13.7575 14.5 15.2499 13.0076 15.2499 11.1667Z" stroke="white" strokeWidth="1.66667" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M11.9178 19.5V17.8333M11.9178 17.8333C8.85264 17.8333 7.04018 15.9542 6.09644 14.5M11.9178 17.8333C14.983 17.8333 16.7955 15.9542 17.7393 14.5" stroke="white" strokeWidth="1.66667" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

type Tab = 'upcoming' | 'replays' | 'speaker';

export default function WebinarsHero({ hero, replays, speakerCta }: Props) {
  const [activeTab, setActiveTab] = useState<Tab>('replays');

  return (
    <div className="section relative">
      <div className="container">
        <div className="fireside-hero">
          {/* Logo */}
          <div className="fireside-hero-logo-wrapper">
            <Image src={hero.logoSrc} width={240} height={78} alt={hero.logoAlt} className="fireside-hero-logo" />
          </div>

          {/* Content */}
          <div className="product-hero-content">
            <div className="hero-text">
              <h2 className="text-display-h1 hero-title">{hero.headline}</h2>
              <div className="max-w-lg">
                <div className="text-alpha-100">
                  <p className="text-body-l text-white-84">{hero.paragraph}</p>
                </div>
              </div>
            </div>
            <a href={hero.ctaHref} className="button-dark button-primary w-inline-block">
              <div className="button-text-block">
                <div className="text-heading-m">{hero.ctaText}</div>
              </div>
              <div className="button-icon-block icon-right opacity-100">
                <div className="icon-24">
                  <div className="svg w-embed"><ChevronIcon /></div>
                </div>
              </div>
            </a>
          </div>

          {/* Tabs */}
          <div className="section-content-main">
            <div className="product-page-tabs w-tabs">
              <div className="fireside-tabs-menu w-tab-menu">
                <button
                  onClick={() => setActiveTab('upcoming')}
                  className={`product-page-tab fireside w-inline-block w-tab-link${activeTab === 'upcoming' ? ' w--current' : ''}`}
                  style={{ background: 'none', border: 'none', cursor: 'pointer' }}
                >
                  <div className="icon-24 w-embed"><CalendarIcon /></div>
                  <div className="text-label-m">Upcoming Events</div>
                </button>
                <button
                  onClick={() => setActiveTab('replays')}
                  className={`product-page-tab fireside w-inline-block w-tab-link${activeTab === 'replays' ? ' w--current' : ''}`}
                  style={{ background: 'none', border: 'none', cursor: 'pointer' }}
                >
                  <div className="icon-24 w-embed"><PlayIcon /></div>
                  <div className="text-label-m">Watch Replays</div>
                </button>
                <button
                  onClick={() => setActiveTab('speaker')}
                  className={`product-page-tab fireside w-inline-block w-tab-link${activeTab === 'speaker' ? ' w--current' : ''}`}
                  style={{ background: 'none', border: 'none', cursor: 'pointer' }}
                >
                  <div className="product-page-tab-icon">
                    <div className="product-page-tab-svg w-embed"><MicIcon /></div>
                  </div>
                  <div className="text-label-m">Become a Speaker</div>
                </button>
              </div>

              <div className="fireside-tabs-content w-tab-content">
                {activeTab === 'upcoming' && (
                  <div data-w-tab="Upcoming Events" className="w-tab-pane w--tab-active">
                    <div className="fireside-tabs-wrapper">
                      <div className="fireside-upcoming-collection w-dyn-list">
                        <div className="empty-state w-dyn-empty">
                          <div>No items found.</div>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {activeTab === 'replays' && (
                  <div data-w-tab="Watch Replays" className="w-tab-pane w--tab-active">
                    <div className="fireside-tabs-wrapper">
                      <div className="fireside-replay-collection max-w-3xl mx-auto w-dyn-list">
                        <WebinarsReplayList replays={replays} />
                      </div>
                    </div>
                  </div>
                )}

                {activeTab === 'speaker' && (
                  <div data-w-tab="Become a Speaker" className="w-tab-pane w--tab-active">
                    <div className="fireside-tabs-wrapper">
                      <WebinarsSpeakerCTA speakerCta={speakerCta} />
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
