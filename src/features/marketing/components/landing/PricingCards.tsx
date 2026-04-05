'use client';

import { useState } from 'react';

// SVG Sprite symbols
function ChevronIcon() {
  return (
    <svg viewBox="0 0 20 20" width="20" height="20" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M7.5 4.5L12.5 10L7.5 15.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function CheckIcon() {
  return (
    <svg viewBox="0 0 20 20" width="20" height="20" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M4.5 10.5L8.5 14.5L15.5 6.5" stroke="#10B981" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function CrossIcon() {
  return (
    <svg viewBox="0 0 20 20" width="20" height="20" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M6 6l8 8M14 6l-8 8" stroke="rgba(255,255,255,0.3)" strokeWidth="1.5" strokeLinecap="round" />
    </svg>
  );
}

function NoCcIcon() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="none" viewBox="0 0 20 20">
      <path stroke="rgba(255,255,255,0.68)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M2.3 8.13v6.24c0 .92.74 1.67 1.66 1.67h7.29M2.29 8.13v-2.5c0-.92.75-1.67 1.67-1.67h12.08c.92 0 1.66.74 1.66 1.66v2.5m-15.4 0h15.4m0 0v1.25M17.8 12.6l-1.76 1.77m0 0-1.77 1.77m1.77-1.77-1.77-1.77m1.77 1.77 1.76 1.77" style={{ stroke: 'rgba(255,255,255,0.68)' }} />
    </svg>
  );
}

function SwipeFileIcon() {
  return (
    <div className="sprite-image sprite-library" style={{ width: 40, height: 40, borderRadius: 8, flexShrink: 0 }} />
  );
}

function DiscoveryIcon() {
  return (
    <div className="sprite-image sprite-discovery" style={{ width: 40, height: 40, borderRadius: 8, flexShrink: 0 }} />
  );
}

function BriefsIcon() {
  return (
    <div className="sprite-image sprite-briefs" style={{ width: 40, height: 40, borderRadius: 8, flexShrink: 0 }} />
  );
}

function SpyderIcon() {
  return (
    <div className="sprite-image sprite-spyder" style={{ width: 40, height: 40, borderRadius: 8, flexShrink: 0 }} />
  );
}

function LensIcon() {
  return (
    <div className="sprite-image sprite-lens" style={{ width: 40, height: 40, borderRadius: 8, flexShrink: 0 }} />
  );
}

function ApiIcon() {
  return (
    <div className="sprite-image sprite-api" style={{ width: 40, height: 40, borderRadius: 8, flexShrink: 0 }} />
  );
}

// Slider pricing data: [videosPerDay, pricePerVideo, totalPerMonth]
const SLIDER_DATA: [number, number, number][] = [
  [1,  2.49,  75],
  [2,  2.25, 135],
  [3,  1.99, 179],
  [4,  1.80, 216],
  [5,  1.65, 248],
  [6,  1.50, 270],
  [7,  1.40, 294],
  [8,  1.35, 324],
  [9,  1.30, 351],
  [10, 1.25, 375],
];

// ── FREE card ─────────────────────────────────────────────────────────────────
function FreeCard() {
  return (
    <div className="pricing-card-container is-first">
      <div className="pricing-card">
        {/* Head */}
        <div className="pricing-card-head">
          <div className="text-white">
            <h3 className="text-overline">FREE</h3>
          </div>
          <div className="text-balance">
            <div className="text-alpha-100">
              <p className="text-body-s">Try the platform, no commitment.</p>
            </div>
          </div>
        </div>

        <div className="horizontal_divider" />

        {/* CTA */}
        <div className="pricing-card-cta">
          <div className="flex-col-gap-2">
            <div className="flex-baseline">
              <div className="text-white">
                <div className="text-display-h5">$0</div>
              </div>
              <div className="text-alpha-100">
                <div className="text-body-s">/month</div>
              </div>
            </div>
          </div>

          <div className="flex-col-gap-2">
            <div className="div-block-335">
              <a href="https://app.foreplay.co/sign-up" className="button-dark button-secondary w-inline-block">
                <div className="button-text-block">
                  <div className="text-heading-m">Get Started</div>
                </div>
                <div className="button-icon-block icon-right">
                  <div className="icon-24">
                    <ChevronIcon />
                  </div>
                </div>
              </a>
            </div>
            <div className="no-cc-required">
              <div className="flex-gap-2">
                <div className="icon-20">
                  <NoCcIcon />
                </div>
                <div className="text-alpha-100">
                  <div className="text-label-s">No credit card required</div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="horizontal_divider" />

        {/* Details */}
        <div className="pricing-card-details">
          <ul role="list" className="pricing-card-details-list w-list-unstyled">
            <li>
              <div className="pricing-card-details-item">
                <div className="pricing-card-details-item-text">
                  <SwipeFileIcon />
                  <div>Hub</div>
                </div>
                <div className="text-alpha-100">
                  <div className="text-body-s">Browse only</div>
                </div>
              </div>
            </li>
            <li>
              <div className="pricing-card-details-item">
                <div className="pricing-card-details-item-text">
                  <DiscoveryIcon />
                  <div>Intelligence</div>
                </div>
                <div className="text-alpha-100">
                  <div className="text-body-s">Limited tokens</div>
                </div>
              </div>
            </li>
            <li>
              <div className="pricing-card-details-item">
                <div className="pricing-card-details-item-text">
                  <BriefsIcon />
                  <div>Content Gen</div>
                </div>
                <div className="text-alpha-100">
                  <div className="text-body-s">2 free videos/week</div>
                </div>
              </div>
            </li>
            <li>
              <div className="pricing-card-details-item is-unavailable">
                <div className="pricing-card-details-item-text">
                  <SpyderIcon />
                  <div>Recon</div>
                </div>
                <div className="icon-24" style={{ opacity: 0.3 }}>
                  <CrossIcon />
                </div>
              </div>
            </li>
            <li>
              <div className="pricing-card-details-item is-unavailable">
                <div className="pricing-card-details-item-text">
                  <LensIcon />
                  <div>Agents</div>
                </div>
                <div className="icon-24" style={{ opacity: 0.3 }}>
                  <CrossIcon />
                </div>
              </div>
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
}

// ── PER MODEL card (middle, with slider) ──────────────────────────────────────
function PerModelCard() {
  const [sliderIndex, setSliderIndex] = useState(0); // 0 = 1 video/day
  const [videosPerDay, pricePerVideo, totalPerMonth] = SLIDER_DATA[sliderIndex];

  return (
    <div className="pricing-card-container is-middle">
      <div className="pricing-card">
        {/* Head */}
        <div className="pricing-card-head">
          <div className="text-white">
            <h3 className="text-overline">PER MODEL</h3>
          </div>
          <div className="text-balance">
            <div className="text-alpha-100">
              <p className="text-body-s">Pay per video. Scale as you grow.</p>
            </div>
          </div>
        </div>

        <div className="horizontal_divider" />

        {/* CTA */}
        <div className="pricing-card-cta">
          <div className="flex-col-gap-2">
            {/* Main price */}
            <div className="flex-baseline">
              <div className="text-white">
                <div className="text-display-h5">${totalPerMonth}</div>
              </div>
              <div className="text-alpha-100">
                <div className="text-body-s">/month</div>
              </div>
            </div>

            {/* Slider label */}
            <div className="text-alpha-100">
              <div className="text-label-s">{videosPerDay} video{videosPerDay > 1 ? 's' : ''}/day &bull; ${pricePerVideo.toFixed(2)}/video</div>
            </div>

            {/* Range slider */}
            <div style={{ paddingTop: 4, paddingBottom: 4 }}>
              <input
                type="range"
                min={0}
                max={9}
                step={1}
                value={sliderIndex}
                onChange={(e) => setSliderIndex(Number(e.target.value))}
                style={{
                  width: '100%',
                  accentColor: '#fff',
                  cursor: 'pointer',
                  height: 4,
                  borderRadius: 2,
                  background: `linear-gradient(to right, #fff ${sliderIndex / 9 * 100}%, rgba(255,255,255,0.2) ${sliderIndex / 9 * 100}%)`,
                  appearance: 'none',
                  WebkitAppearance: 'none',
                  outline: 'none',
                  border: 'none',
                }}
              />
              <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 4 }}>
                <div className="text-alpha-100" style={{ fontSize: 10 }}>1/day</div>
                <div className="text-alpha-100" style={{ fontSize: 10 }}>10/day</div>
              </div>
            </div>
          </div>

          <div className="flex-col-gap-2">
            <div className="div-block-335">
              <a href="https://app.foreplay.co/sign-up" className="button-dark button-primary w-inline-block">
                <div className="button-text-block">
                  <div className="text-heading-m">Start</div>
                </div>
                <div className="button-icon-block icon-right">
                  <div className="icon-24">
                    <ChevronIcon />
                  </div>
                </div>
              </a>
            </div>
            <div className="no-cc-required">
              <div className="flex-gap-2">
                <div className="icon-20">
                  <NoCcIcon />
                </div>
                <div className="text-alpha-100">
                  <div className="text-label-s">No credit card required</div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="horizontal_divider" />

        {/* Details */}
        <div className="pricing-card-details">
          <ul role="list" className="pricing-card-details-list w-list-unstyled">
            <li>
              <div className="pricing-card-details-item">
                <div className="pricing-card-details-item-text">
                  <SwipeFileIcon />
                  <div>Hub</div>
                </div>
                <div className="text-alpha-100">
                  <div className="text-body-s">Full access</div>
                </div>
              </div>
            </li>
            <li>
              <div className="pricing-card-details-item">
                <div className="pricing-card-details-item-text">
                  <DiscoveryIcon />
                  <div>Intelligence</div>
                </div>
                <div className="text-alpha-100">
                  <div className="text-body-s">Full access</div>
                </div>
              </div>
            </li>
            <li>
              <div className="pricing-card-details-item">
                <div className="pricing-card-details-item-text">
                  <BriefsIcon />
                  <div>Content Gen</div>
                </div>
                <div className="text-alpha-100">
                  <div className="text-body-s">{videosPerDay} video{videosPerDay > 1 ? 's' : ''}/day</div>
                </div>
              </div>
            </li>
            <li>
              <div className="pricing-card-details-item">
                <div className="pricing-card-details-item-text">
                  <SpyderIcon />
                  <div>Recon</div>
                </div>
                <div className="text-alpha-100">
                  <div className="text-body-s">Full access</div>
                </div>
              </div>
            </li>
            <li>
              <div className="pricing-card-details-item">
                <div className="pricing-card-details-item-text">
                  <LensIcon />
                  <div>Agents</div>
                </div>
                <div className="text-alpha-100">
                  <div className="text-body-s">Full access</div>
                </div>
              </div>
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
}

// ── UNLIMITED card ────────────────────────────────────────────────────────────
function UnlimitedCard() {
  return (
    <div className="pricing-card-container is-last">
      <div className="pricing-card">
        {/* Head */}
        <div className="pricing-card-head">
          <div className="text-white">
            <h3 className="text-overline">UNLIMITED</h3>
          </div>
          <div className="text-balance">
            <div className="text-alpha-100">
              <p className="text-body-s">Flat rate. Unlimited content. You cover API costs.</p>
            </div>
          </div>
        </div>

        <div className="horizontal_divider" />

        {/* CTA */}
        <div className="pricing-card-cta">
          <div className="flex-col-gap-2">
            <div className="flex-baseline">
              <div className="text-white">
                <div className="text-display-h5">$129</div>
              </div>
              <div className="text-alpha-100">
                <div className="text-body-s">/model/month</div>
              </div>
            </div>
            <div className="text-alpha-100">
              <div className="text-label-s">+ ~$1/video API generation cost</div>
            </div>
          </div>

          <div className="flex-col-gap-2">
            <div className="div-block-335">
              <a href="https://app.foreplay.co/sign-up" className="button-dark button-secondary w-inline-block">
                <div className="button-text-block">
                  <div className="text-heading-m">Start</div>
                </div>
                <div className="button-icon-block icon-right">
                  <div className="icon-24">
                    <ChevronIcon />
                  </div>
                </div>
              </a>
            </div>
            <div className="no-cc-required">
              <div className="flex-gap-2">
                <div className="icon-20">
                  <NoCcIcon />
                </div>
                <div className="text-alpha-100">
                  <div className="text-label-s">No credit card required</div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="horizontal_divider" />

        {/* Details */}
        <div className="pricing-card-details">
          <ul role="list" className="pricing-card-details-list w-list-unstyled">
            <li>
              <div className="pricing-card-details-item">
                <div className="pricing-card-details-item-text">
                  <SwipeFileIcon />
                  <div>Hub</div>
                </div>
                <div className="text-alpha-100">
                  <div className="text-body-s">Full access</div>
                </div>
              </div>
            </li>
            <li>
              <div className="pricing-card-details-item">
                <div className="pricing-card-details-item-text">
                  <DiscoveryIcon />
                  <div>Intelligence</div>
                </div>
                <div className="text-alpha-100">
                  <div className="text-body-s">Full access</div>
                </div>
              </div>
            </li>
            <li>
              <div className="pricing-card-details-item">
                <div className="pricing-card-details-item-text">
                  <BriefsIcon />
                  <div>Content Gen</div>
                </div>
                <div className="text-alpha-100">
                  <div className="text-body-s">Unlimited</div>
                </div>
              </div>
            </li>
            <li>
              <div className="pricing-card-details-item">
                <div className="pricing-card-details-item-text">
                  <SpyderIcon />
                  <div>Recon</div>
                </div>
                <div className="text-alpha-100">
                  <div className="text-body-s">Full access</div>
                </div>
              </div>
            </li>
            <li>
              <div className="pricing-card-details-item">
                <div className="pricing-card-details-item-text">
                  <LensIcon />
                  <div>Agents</div>
                </div>
                <div className="text-alpha-100">
                  <div className="text-body-s">Full access</div>
                </div>
              </div>
            </li>
            <li>
              <div className="pricing-card-details-item">
                <div className="pricing-card-details-item-text">
                  <ApiIcon />
                  <div>API Access</div>
                </div>
                <div className="text-alpha-100">
                  <div className="text-body-s">Included</div>
                </div>
              </div>
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
}

export default function PricingCards({ isAnnual: _isAnnual }: { isAnnual?: boolean }) {
  return (
    <div className="pricing-grid" style={{ width: '100%' }}>
      <FreeCard />
      <PerModelCard />
      <UnlimitedCard />
    </div>
  );
}
