'use client';
// IndustryFeatures — "5 Apps in One" tabbed product section. Client component for interactive tab switching.

import { useState } from 'react';
import Image from 'next/image';
import LazyVideo from '@/features/marketing/components/ProductSection/LazyVideo';
import type { IndustryPageData, FeatureCard } from './types';

interface Props {
  features: IndustryPageData['features'];
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

function FeaturePanel({ card, activeFeature, setActiveFeature }: {
  card: FeatureCard;
  activeFeature: number;
  setActiveFeature: (i: number) => void;
}) {
  return (
    <div className="tabs-video-wrapper">
      <div className="home-product-grid">
        {/* Left: content */}
        <div className="home-product-content">
          <div className="home-research-sidebar-head">
            <div className="text-alpha-50">
              <div className="text-overline">{card.subtitle}</div>
            </div>
            <div className="text-white">
              <h3 className="text-display-h3">{card.title}</h3>
            </div>
          </div>

          <div className="main-cta-buttons">
            <a href={card.ctaHref} className="button-dark button-secondary w-inline-block">
              <div className="button-text-block">
                <div className="text-heading-m">Get Free Trial</div>
              </div>
              <div className="button-icon-block icon-right">
                <div className="icon-24">
                  <div className="svg w-embed"><ChevronIcon /></div>
                </div>
              </div>
            </a>
            <a href="/book-demo" className="button-dark button-ghost w-inline-block">
              <div className="button-text-block">
                <div className="text-heading-m">Book a Demo</div>
              </div>
              <div className="button-icon-block icon-right">
                <div className="icon-24">
                  <div className="svg w-embed"><ChevronIcon /></div>
                </div>
              </div>
            </a>
          </div>

          <div className="home-product-tabs-links">
            {card.features.map((feat, fi) => (
              <div
                key={fi}
                className={`home-product-tab-link${fi === activeFeature ? ' is-active' : ''}`}
                onClick={() => setActiveFeature(fi)}
                style={{ cursor: 'pointer' }}
              >
                <div className="text-label-m">{feat.label}</div>
              </div>
            ))}
          </div>

          <div className="home-product-animation">
            {card.videoSrc && (
              <div className="padding-video w-embed">
                <LazyVideo src={card.videoSrc} autoPlay playsInline muted loop width="100%" height="100%" style={{ margin: 0, padding: 0 }} />
              </div>
            )}
            <Image
              width={300}
              height={300}
              alt=""
              src={card.isoSrc}
              className="product-isometric-image"
            />
          </div>
        </div>

        {/* Right: screenshots */}
        <div className="home-product-figure">
          <div className="home-product-tab-bg">
            <Image width={752} height={640} alt="" src={card.bgSrc} />
          </div>
          <div className="home-product-tab-panes">
            {card.slides.map((slide, si) => (
              <div
                key={si}
                className={`home-product-tab-pane${si === activeFeature ? ' is-active' : ''}`}
              >
                <Image
                  width={752}
                  height={640}
                  alt=""
                  src={slide}
                  className="home-product-tab-image"
                />
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export default function IndustryFeatures({ features }: Props) {
  const [activeTab, setActiveTab] = useState(0);
  const [activeFeature, setActiveFeature] = useState(0);

  const handleTabChange = (idx: number) => {
    setActiveTab(idx);
    setActiveFeature(0);
  };

  return (
    <div className="section">
      <div className="product-page-padding-y">
        <div className="container section-container">
          {/* Section header */}
          <div className="section-head">
            <div className="section-head-wrapper">
              <div className="section-head_subtitle">
                <div className="text-overline text-white-68">{features.subtitle}</div>
              </div>
              <div className="section-head_title">
                <h2 className="text-display-h2">{features.title}</h2>
              </div>
              <div className="section-head_paragraph">
                <div className="text-alpha-100">
                  <p className="text-body-l">{features.paragraph}</p>
                </div>
              </div>
            </div>
          </div>

          <div className="section-content-main">
            <div className="product-page-tabs w-tabs">
              {/* Tab menu */}
              <div className="comparison-tabs-menu w-tab-menu">
                {features.cards.map((card, idx) => (
                  <button
                    key={idx}
                    onClick={() => handleTabChange(idx)}
                    className={`comparison-product-tab w-inline-block w-tab-link${idx === activeTab ? ' w--current' : ''}`}
                    style={{ background: 'none', border: 'none', cursor: 'pointer' }}
                  >
                    <Image
                      src={card.iconSrc}
                      width={40}
                      height={40}
                      alt={`${card.subtitle} logo`}
                      className="comparison-product-icon"
                    />
                    <div className="text-label-m">{card.subtitle}</div>
                  </button>
                ))}
              </div>

              {/* Tab panels */}
              <div className="product-page-tabs-content w-tab-content">
                {features.cards.map((card, idx) => (
                  <div
                    key={idx}
                    className={`w-tab-pane${idx === activeTab ? ' w--tab-active' : ''}`}
                    style={{ display: idx === activeTab ? 'block' : 'none' }}
                  >
                    <FeaturePanel
                      card={card}
                      activeFeature={activeFeature}
                      setActiveFeature={setActiveFeature}
                    />
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
