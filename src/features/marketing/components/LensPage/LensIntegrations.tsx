'use client';

import { useState } from 'react';
import LazyVideo from '@/features/marketing/components/ProductSection/LazyVideo';

const CDN = 'https://cdn.prod.website-files.com/62a4ed18ddad95dde8b8bfa4';
const PUBLIC = 'https://publicassets.foreplay.co';

interface Tab {
  label: string;
  imageUrl: string;
}

interface Props {
  tabs: Tab[];
}

export default function LensIntegrations({ tabs }: Props) {
  const [activeTab, setActiveTab] = useState(0);

  return (
    <section className="section">
      <div className="lens-integrations">
        <div className="container">
          <div className="section-head">
            <div className="section-head-wrapper">
              <div className="section-head_subtitle">
                <div className="text-overline text-white-68">Integrations</div>
              </div>
              <h2 className="text-display-h2">Lightning fast insights directly from the source</h2>
              <p className="text-body-l text-alpha-100">
                Trade screenshots, spreadsheets and hours spent searching for direction. Lens allows you to centralize, segment
                and report on your creative data.
              </p>
            </div>
          </div>
        </div>
        <div className="container">
          <figure className="lens-integrations-illustration">
            <div className="lens-integrations-gradient-spectrum">
              <div className="code-video w-embed">
                <LazyVideo src={`${PUBLIC}/gradient-spectrum-optimized.mp4`} autoPlay playsInline muted loop width="100%" height="100%" style={{ margin: 0, padding: 0 }} />
              </div>
            </div>
            <div className="lens-integrations-path-container">
              <div className="lens-integrations-path">
                <div className="svg w-embed">
                  <svg width="100%" height="100%" viewBox="0 0 473 368" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <defs>
                      <linearGradient id="rectGradient" x1="0" y1="0" x2="1" y2="0">
                        <stop offset="0%" stopColor="white" stopOpacity="0" />
                        <stop offset="100%" stopColor="white" stopOpacity="1" />
                      </linearGradient>
                      <path id="lipath-left-top" d="M96 40H230.294C262.12 40 292.643 52.6428 315.147 75.1472L424 184" />
                      <path id="lipath-left-middle" d="M96 184H424" />
                      <path id="lipath-left-bottom" d="M96 328H230.294C262.12 328 292.643 315.357 315.147 292.853L424 184" />
                      <clipPath id="topPathClip">
                        <path d="M230.294 40.5H96V39.5H230.294C262.253 39.5 292.903 52.1955 315.501 74.7937L424.354 183.646L423.646 184.354L314.793 75.5008C292.383 53.0901 261.987 40.5 230.294 40.5Z" />
                      </clipPath>
                      <clipPath id="middlePathClip">
                        <path d="M424 184.5H96V183.5H424V184.5Z" />
                      </clipPath>
                      <clipPath id="bottomPathClip">
                        <path d="M424.354 184.354L315.501 293.207C292.903 315.804 262.253 328.5 230.294 328.5H96V327.5H230.294C261.987 327.5 292.383 314.91 314.793 292.499L423.646 183.646L424.354 184.354Z" />
                      </clipPath>
                    </defs>
                    <use href="#lipath-left-top" stroke="white" strokeOpacity="0.16" />
                    <use href="#lipath-left-middle" stroke="white" strokeOpacity="0.16" />
                    <use href="#lipath-left-bottom" stroke="white" strokeOpacity="0.16" />
                    <g clipPath="url(#middlePathClip)">
                      <rect width="80" height="32" fill="url(#rectGradient)" y="-16">
                        <animateMotion dur="2.8s" repeatCount="indefinite" rotate="auto">
                          <mpath href="#lipath-left-middle" />
                        </animateMotion>
                      </rect>
                    </g>
                    <g clipPath="url(#bottomPathClip)">
                      <rect width="80" height="32" fill="url(#rectGradient)" y="-16">
                        <animateMotion dur="3.2s" repeatCount="indefinite" rotate="auto" begin="1.6s">
                          <mpath href="#lipath-left-bottom" />
                        </animateMotion>
                      </rect>
                    </g>
                    <g clipPath="url(#topPathClip)">
                      <rect width="80" height="32" fill="url(#rectGradient)" y="-16">
                        <animateMotion dur="3.2s" repeatCount="indefinite" rotate="auto" begin="0.8s">
                          <mpath href="#lipath-left-top" />
                        </animateMotion>
                      </rect>
                    </g>
                  </svg>
                </div>
              </div>
              <div className="lens-integrations-path is-inverted">
                <div className="svg w-embed">
                  <svg width="100%" height="100%" viewBox="0 0 473 368" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <use href="#lipath-left-top" stroke="white" strokeOpacity="0.16" />
                    <use href="#lipath-left-middle" stroke="white" strokeOpacity="0.16" />
                    <use href="#lipath-left-bottom" stroke="white" strokeOpacity="0.16" />
                    <g clipPath="url(#middlePathClip)">
                      <rect width="80" height="32" fill="url(#rectGradient)" y="-16">
                        <animateMotion dur="2.8s" repeatCount="indefinite" rotate="auto">
                          <mpath href="#lipath-left-middle" />
                        </animateMotion>
                      </rect>
                    </g>
                    <g clipPath="url(#bottomPathClip)">
                      <rect width="80" height="32" fill="url(#rectGradient)" y="-16">
                        <animateMotion dur="3.2s" repeatCount="indefinite" rotate="auto" begin="0.8s">
                          <mpath href="#lipath-left-bottom" />
                        </animateMotion>
                      </rect>
                    </g>
                    <g clipPath="url(#topPathClip)">
                      <rect width="80" height="32" fill="url(#rectGradient)" y="-16">
                        <animateMotion dur="3.2s" repeatCount="indefinite" rotate="auto" begin="1.6">
                          <mpath href="#lipath-left-top" />
                        </animateMotion>
                      </rect>
                    </g>
                  </svg>
                </div>
              </div>
            </div>
            <div className="lens-integrations-illustration-layout">
              <div className="lens-integrations-illustration-left">
                {/* TikTok */}
                <div className="lens-integrations-logo is-top">
                  <div className="svg w-embed">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" width="100%" height="100%" viewBox="0 0 80 80">
                      <path
                        fill="#D9D9D9"
                        fillRule="evenodd"
                        d="M44.24 26.61c1.93-1.68 4-2.61 6.1-2.61 3.5 0 6.85 2.03 9.4 5.85 2.8 4.18 4.17 9.44 4.17 14.87 0 3.23-.64 5.6-1.72 7.48a7.18 7.18 0 0 1-6.52 3.62 8.11 8.11 0 0 1-6.1-2.43c-1.62-1.52-3.5-4.2-4.94-6.62l-4.3-7.18-.36-.6-.37.66-1.5 2.67c-3.04 5.38-3.8 6.6-5.33 8.62-2.65 3.54-4.92 4.88-7.9 4.88-3.55 0-5.8-1.53-7.18-3.85C16.56 50.1 16 47.62 16 44.8c0-5.12 1.4-10.46 4.08-14.59 2.37-3.65 5.8-6.21 9.72-6.21 2.28 0 4.54.67 6.9 2.6a26.14 26.14 0 0 1 3.9 4.1 25.8 25.8 0 0 1 3.64-4.09ZM22.1 49.07a7.98 7.98 0 0 1-.93-4.09c0-4.43 1.26-9.05 3.32-12.15 1.45-2.2 3.19-3.63 5.23-3.63 2.52 0 4.1 1.58 5.34 2.89.61.65 1.47 1.73 2.46 3.15l-2.03 3.13c-1.51 2.32-3.76 6.02-5.67 8.66-2.37 3.29-3.6 3.62-4.96 3.62a3.16 3.16 0 0 1-2.76-1.58Zm37.24-4.2c0 3.08-.73 5.78-3.67 5.78-1.16 0-2.05-.46-3.32-2-.99-1.2-2.68-3.75-5.65-8.7l-1.23-2.05a89.85 89.85 0 0 0-2.51-3.96l.42-.65c2.24-3.32 4.23-5.19 6.7-5.19 2.3 0 4.37 1.51 5.97 3.99 2.27 3.49 3.3 8.37 3.3 12.77Z"
                        clipRule="evenodd"
                      />
                    </svg>
                  </div>
                </div>
                {/* Meta */}
                <div className="lens-integrations-logo">
                  <div className="svg w-embed">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" width="100%" height="100%" viewBox="0 0 80 80">
                      <path
                        fill="#D9D9D9"
                        fillRule="evenodd"
                        d="M57.32 24.63a5.72 5.72 0 0 1 4.03 4.03c1.5 6.05 1.15 15.6.03 21.89a5.72 5.72 0 0 1-4.03 4.03c-3.53.96-17.75.96-17.75.96s-14.21 0-17.74-.96a5.72 5.72 0 0 1-4.03-4.03c-1.51-6.03-1.1-15.59-.03-21.86a5.72 5.72 0 0 1 4.03-4.03c3.53-.96 17.74-1 17.74-1s14.22 0 17.75.97ZM46.84 39.6l-11.8 6.83V32.77l11.8 6.83Z"
                        clipRule="evenodd"
                      />
                    </svg>
                  </div>
                </div>
                {/* Google */}
                <div className="lens-integrations-logo is-bottom">
                  <div className="svg w-embed">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" width="100%" height="100%" viewBox="0 0 80 80">
                      <path
                        fill="#D9D9D9"
                        fillRule="evenodd"
                        d="M26 19.62h28a6 6 0 0 1 6 6v28a6 6 0 0 1-6 6H26a6 6 0 0 1-6-6v-28a6 6 0 0 1 6-6Zm5.1 13.68a2.9 2.9 0 1 0 0-5.78 2.9 2.9 0 0 0 0 5.78Zm10.54 3.54v-2.06h-5.16v15.47h5.16V40.9c.27-1.28 1.23-2.38 2.73-2.38 1.88 0 2.58 1.4 2.58 3.52v8.2h5.16v-8.83c0-4.76-2.5-6.95-5.94-6.95a5.12 5.12 0 0 0-4.53 2.37Zm-13.13-2.06v15.47h5.16V34.78h-5.16Z"
                        clipRule="evenodd"
                      />
                    </svg>
                  </div>
                </div>
              </div>
              <div className="lens-integrations-icon-container">
                <div className="lens-integrations-icon">
                  <div className="lens-integrations-video">
                    <div className="code-video w-embed">
                      <LazyVideo src={`${PUBLIC}/animated-icon-lens.webm`} autoPlay playsInline muted loop width="100%" height="100%" style={{ margin: 0, padding: 0 }} />
                    </div>
                  </div>
                  <div className="lens-integrations-image">
                    <img
                      src={`${CDN}/682f9f725170de3b3258d310_pi-lens-hq.webp`}
                      loading="eager"
                      width={128}
                      height={128}
                      alt="Lens app icon"
                      className="lens-integrations-image-image"
                    />
                  </div>
                </div>
              </div>
              <div className="lens-integrations-illustration-right">
                {/* YouTube */}
                <div className="lens-integrations-logo is-top">
                  <div className="svg w-embed">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" width="100%" height="100%" viewBox="0 0 80 80">
                      <path
                        fill="#D9D9D9"
                        d="M57.85 35.95c-3.44.01-6.8-1.06-9.6-3.06v13.96A12.7 12.7 0 1 1 37.3 34.26v7.03a5.83 5.83 0 1 0 4.08 5.56v-27.3h6.88a9.55 9.55 0 0 0 4.36 8 9.49 9.49 0 0 0 5.23 1.57v6.83Z"
                      />
                    </svg>
                  </div>
                </div>
                {/* Pinterest / Unknown */}
                <div className="lens-integrations-logo">
                  <div className="svg w-embed">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" width="100%" height="100%" viewBox="0 0 80 80">
                      <path
                        fill="#D9D9D9"
                        d="M39.62 22.37h.22c2.01 0 3.89.6 5.46 1.63l-.04-.02a9.3 9.3 0 0 1 4.46 8.74v-.03c0 .73-.07 2.22-.2 4.47.18.1.4.16.65.17.44-.04.85-.15 1.22-.33l-.02.01a3.4 3.4 0 0 1 1.19-.32c.5 0 .95.17 1.33.43h-.01c.38.22.63.62.63 1.08 0 .53-.3 1-.73 1.26-.47.33-1 .58-1.59.73l-.03.01c-.62.15-1.16.39-1.65.7l.03-.02c-.42.2-.71.62-.74 1.11.03.37.13.72.29 1.03V43a12.48 12.48 0 0 0 2.4 3.52c.93.99 2.05 1.79 3.31 2.34l.07.03c.53.21 1.15.4 1.8.52l.07.01c.37.05.66.37.66.75v.08c0 1.09-1.71 1.9-5.14 2.4-.13.27-.23.59-.25.91v.01c-.05.4-.17.78-.34 1.11v-.02a.81.81 0 0 1-.71.44h-.06c-.52-.02-1.02-.08-1.51-.17l.06.01c-.44-.08-.96-.13-1.48-.15H48.85c-.48 0-.95.05-1.4.13h.05c-.56.09-1.05.27-1.5.53l.02-.01c-.52.3-.96.59-1.39.91l.03-.02c-.42.32-.87.64-1.36.95-.5.32-1.1.6-1.73.77l-.05.02c-.67.2-1.44.31-2.23.31h-.1.01-.06c-.79 0-1.54-.11-2.25-.33l.05.02a6.8 6.8 0 0 1-1.78-.8l.02.01c-.48-.31-.92-.63-1.34-.95-.4-.3-.84-.6-1.3-.86l-.06-.03a4.3 4.3 0 0 0-1.44-.52h-.02c-.42-.08-.9-.13-1.38-.13h-.1c-.56.02-1.08.08-1.6.19l.06-.01c-.4.09-.86.15-1.35.17h-.1a.85.85 0 0 1-.74-.42 3.2 3.2 0 0 1-.32-1.1v-.02a2.56 2.56 0 0 0-.27-.95v.01c-3.41-.52-5.12-1.32-5.12-2.41v-.07c0-.39.28-.7.65-.75.72-.14 1.35-.33 1.95-.57l-.07.03A10.01 10.01 0 0 0 26 46.52c.98-1 1.78-2.16 2.37-3.44l.03-.08c.15-.3.25-.63.28-1-.02-.5-.31-.91-.73-1.12a5.85 5.85 0 0 0-1.59-.68l-.04-.01a5.2 5.2 0 0 1-1.65-.75l.02.01c-.43-.25-.72-.7-.74-1.23.01-.45.25-.84.6-1.06h.01c.36-.27.8-.43 1.3-.44.4.05.79.15 1.14.32l-.02-.01c.36.16.78.27 1.23.3h.04c.26 0 .5-.06.73-.17h-.01a87.31 87.31 0 0 1-.23-5.03c0-1.3.24-2.55.67-3.7l-.02.06a10 10 0 0 1 3.99-4.61l.04-.03a12.58 12.58 0 0 1 6.2-1.47h-.01Z"
                      />
                    </svg>
                  </div>
                </div>
                {/* Snapchat */}
                <div className="lens-integrations-logo is-bottom">
                  <div className="svg w-embed">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" width="100%" height="100%" viewBox="0 0 80 80">
                      <path
                        fill="#D9D9D9"
                        fillRule="evenodd"
                        d="M56.27 48.34a4.78 4.78 0 0 1 4.8 4.8 4.8 4.8 0 1 1-8.6-2.92 49.36 49.36 0 0 0-12.3-1.36 51.43 51.43 0 0 0-12.66 1.36 4.84 4.84 0 0 1-.4 6.36 4.79 4.79 0 0 1-7.82-5.24 4.83 4.83 0 0 1 4.44-3c.63 0 1.25.13 1.84.38l10.5-18.92.1-.14a4.8 4.8 0 1 1 7.69-.02l.06.1 10.5 18.97c.58-.24 1.2-.37 1.85-.37Zm2.89 4.85a2.86 2.86 0 1 0-5.72-.06 2.86 2.86 0 0 0 5.72.06Zm-32.55 0a2.86 2.86 0 1 0-5.5 1.04 2.88 2.88 0 0 0 2.62 1.8 2.88 2.88 0 0 0 2.88-2.84Zm15.22-21.97a4.79 4.79 0 0 1-4.11-.21l-.03.06-9.4 16.92a51.34 51.34 0 0 1 11.88-1.15 55.38 55.38 0 0 1 11.55 1.15L42.3 31.01V31c-.16.08-.32.16-.48.22Zm1.05-4.43a2.84 2.84 0 0 0-2.82-2.83 2.83 2.83 0 1 0 2.82 2.83Z"
                        clipRule="evenodd"
                      />
                    </svg>
                  </div>
                </div>
              </div>
            </div>
          </figure>
        </div>
        <div data-tabs-name="integrations" data-tabs="" className="lens-integrations-tab">
          <div className="lens-integrations-tab-panes">
            {tabs.map((tab, i) => (
              <div key={tab.label} className={`lens-integrations-tab-pane${activeTab === i ? ' is-active' : ''}`}>
                <div className="lens-integrations-mockup-wrapper">
                  <div className="lens-integrations-mockup">
                    <img
                      src={tab.imageUrl}
                      width={1953}
                      height={1202}
                      alt={tab.label}
                      loading="eager"
                      className="lens-integrations-mockup-image"
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>
          <div className="lens-integrations-people">
            <img
              src={`${CDN}/67c6cef61d31b32e3dde9251_8e7cb2680b3833f83c61a14e695bfc7e_lens-people.webp`}
              width={1953}
              height={1202}
              alt="People viewing desktop device"
              loading="eager"
              className="lens-integrations-people-image"
            />
          </div>
          <div className="lens-integrations-tab-links">
            {tabs.map((tab, i) => (
              <button
                key={tab.label}
                className={`lens-integrations-tab-link${activeTab === i ? ' is-active' : ''}`}
                onClick={() => setActiveTab(i)}
              >
                <div className="icon-24">
                  <div className="svg w-embed">
                    <svg xmlns="http://www.w3.org/2000/svg" width="100%" height="100%" fill="none" viewBox="0 0 20 20">
                      <path stroke="currentColor" strokeLinecap="round" strokeWidth="1.5" d="M7.50001 5.83335V9.16669C6.34201 10.6142 4.16667 12.3998 4.16667 14.4154C4.16667 16.119 5.54771 17.5 7.25131 17.5H12.7487C14.4523 17.5 15.8333 16.119 15.8333 14.4154C15.8333 12.3998 13.658 10.6142 12.5 9.16669V5.83335M7.50001 5.83335H12.5M7.50001 5.83335H6.66667M12.5 5.83335H13.3333M5.00001 13.2128C5.74516 13.0812 6.99609 12.8921 7.91667 12.9167C9.57551 12.9609 10.4245 13.7058 12.0833 13.75C13.0039 13.7746 14.2548 13.5855 15 13.4539M8.33334 3.33335H8.34167M11.1667 2.08335H11.3333M11.6667 2.08335C11.6667 2.31347 11.4801 2.50002 11.25 2.50002C11.0199 2.50002 10.8333 2.31347 10.8333 2.08335C10.8333 1.85324 11.0199 1.66669 11.25 1.66669C11.4801 1.66669 11.6667 1.85324 11.6667 2.08335Z" />
                    </svg>
                  </div>
                </div>
                <div className="text-label-l">{tab.label}</div>
              </button>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
