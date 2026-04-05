'use client';
import { useState } from 'react';
import Image from 'next/image';
import type { CoreFeatures as CoreFeaturesType } from '../types';

interface Props {
  data: CoreFeaturesType;
}

export default function CoreFeatures({ data }: Props) {
  const [activeTab, setActiveTab] = useState(0);

  return (
    <div className="section">
      <div className="product-page-padding-y">
        <div className="container section-container">
          <div className="section-head">
            <div className="section-head-wrapper">
              <div className="section-head_subtitle">
                <div className="text-overline text-white-68">{data.subtitle}</div>
              </div>
              <div className="section-head_title">
                <h2 className="text-display-h2">{data.title}</h2>
              </div>
              <div className="section-head_paragraph">
                <div className="text-alpha-100">
                  <p className="text-body-l">{data.paragraph}</p>
                </div>
              </div>
            </div>
          </div>
          <div className="section-content-main">
            <div data-current={data.tabs[activeTab]?.label} data-easing="ease" data-duration-in="300" data-duration-out="100" className="product-page-tabs w-tabs">
              <div className="product-page-tabs-menu w-tab-menu">
                {data.tabs.map((tab, i) => (
                  <button
                    key={i}
                    onClick={() => setActiveTab(i)}
                    className={`product-page-tab w-inline-block w-tab-link${i === activeTab ? ' w--current' : ''}`}
                    style={{ background: 'none', border: 'none', cursor: 'pointer' }}
                  >
                    <div className="product-page-tab-svg w-embed" dangerouslySetInnerHTML={{ __html: tab.svgContent }} />
                    <div className="text-label-m">{tab.label}</div>
                  </button>
                ))}
              </div>
              <div className="product-page-tabs-content w-tab-content">
                {data.tabs.map((tab, i) => (
                  <div
                    key={i}
                    data-w-tab={tab.label}
                    className={`w-tab-pane${i === activeTab ? ' w--tab-active' : ''}`}
                    style={{ display: i === activeTab ? 'block' : 'none' }}
                  >
                    <div className="tabs-video-wrapper" style={{ position: 'relative' }}>
                      <Image src={tab.imageSrc} alt={tab.label} className="product-page-tabs-image" fill sizes="(max-width: 768px) 100vw, 80vw" />
                    </div>
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
