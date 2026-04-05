'use client';

import { useState } from 'react';
import ProductCard from './ProductCard';
import {
  LENS_TABS, LENS_IMAGES,
  BRIEFS_TABS, BRIEFS_IMAGES,
  SWIPE_FILE_TABS, SWIPE_FILE_IMAGES,
  SPYDER_TABS, SPYDER_IMAGES,
  DISCOVERY_TABS, DISCOVERY_IMAGES,
} from './data/products';
import { ChromeExtensionCard } from '../ChromeExtensionSection/ui/ChromeExtensionCard';

const CDN = 'https://cdn.prod.website-files.com/62a4ed18ddad95dde8b8bfa4';

/** Section sub-heading label — no pill, just styled text. */
function SectionPill({ children }: { children: React.ReactNode }) {
  return (
    <span
      style={{
        fontFamily: 'Inter, sans-serif', fontSize: '12px', fontWeight: 550,
        lineHeight: '1rem', letterSpacing: '0.166667em', textTransform: 'uppercase',
        color: 'rgba(255,255,255,0.45)',
      }}
    >
      {children}
    </span>
  );
}

/** Two-line section header block reused for "Research" and "Production" groups. */
function SectionHeader({ pill, title, subtitle }: { pill: string; title: string; subtitle: string }) {
  return (
    <div style={{ display: 'flex', flexFlow: 'column', alignItems: 'center', gap: '12px', textAlign: 'center', maxWidth: '720px', margin: '0 auto', marginBottom: '48px' }}>
      <div><SectionPill>{pill}</SectionPill></div>
      <div>
        <h2 className="product-section-header-h2" style={{ fontFamily: 'Inter Display, Arial, sans-serif', fontSize: '44px', fontWeight: 600, lineHeight: '54px', letterSpacing: '-0.0075em', color: '#ffffff', margin: 0 }}>
          {title}
        </h2>
      </div>
      <div>
        <p className="product-section-header-p" style={{ fontFamily: 'Inter, sans-serif', fontSize: '18px', lineHeight: '28px', color: 'rgba(255,255,255,0.36)', maxWidth: '512px', margin: 0 }}>
          {subtitle}
        </p>
      </div>
    </div>
  );
}

/** Home page section showcasing all 5 ISSO products in tabbed cards. */
export default function ProductSection() {
  const [lensTab, setLensTab] = useState('creative-test');
  const [briefsTab, setBriefsTab] = useState('storyboard');
  const [swipeFileTab, setSwipeFileTab] = useState('save-organize');
  const [spyderTab, setSpyderTab] = useState('ad-scraper');
  const [discoveryTab, setDiscoveryTab] = useState('smart-search');

  return (
    <section style={{ background: '#020308', overflow: 'hidden', paddingTop: '80px', paddingBottom: '80px' }}>
      <style>{`
        .product-card-isometric video { transform: translateY(20%); }
        @media (max-width: 768px) {
          .product-section-header-h2 { font-size: 28px !important; line-height: 36px !important; }
          .product-section-header-p { font-size: 16px !important; line-height: 24px !important; }
          .product-section-section-padding { padding-top: 48px !important; padding-bottom: 48px !important; }
          .product-card-root { flex-direction: column !important; }
          .product-card-figure { min-height: 240px !important; flex: none !important; height: 240px !important; }
          .product-card-isometric { width: 180px !important; height: 180px !important; }
          .product-card-content { flex: none !important; }
        }
        @media (min-width: 769px) and (max-width: 991px) {
          .product-card-isometric video { transform: translateY(-15%) scale(1.6); }
          .product-card-isometric.swipe-file { margin-top: -52px; margin-bottom: -40px; margin-right: -292px; }
          .product-card-isometric.spyder { margin-top: -23px; margin-bottom: 0; margin-right: -197px; }
          .product-card-isometric.discovery { margin-top: -16px; margin-bottom: -219px; margin-right: -58px; }
          .product-card-isometric.lens, .product-card-isometric.briefs { margin-top: -16px; margin-bottom: -219px; margin-right: -58px; justify-content: flex-end; align-items: flex-end; }
        }
        @media (min-width: 480px) and (max-width: 768px) {
          .product-card-isometric video { transform: translateY(-15%) scale(1.6); }
          .product-card-isometric { margin-top: -23px; margin-bottom: 0; margin-right: -197px; }
        }
        @media (max-width: 479px) {
          .product-card-isometric video { transform: translateY(-15%) scale(2); }
          .product-card-isometric { justify-content: center; align-items: center; inset: auto auto -16% -15%; }
        }
        @keyframes pulse-dot {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.35; }
        }
      `}</style>

      <div style={{ maxWidth: '1216px', paddingLeft: '24px', paddingRight: '24px', margin: '0 auto' }}>

        {/* ── Research & Inspiration ── */}
        <SectionHeader
          pill="Your Content Intelligence Layer"
          title="Surface what's working, track your competitors, organize everything."
          subtitle="We track competitors, surface viral trends, and organize everything in one place so your team can act fast."
        />
        <div style={{ marginBottom: '80px' }}>
          <div style={{ marginBottom: '40px' }}>
            <ProductCard label="Hub" title="Your entire content library, organized and accessible" ctaText="Claim Your Hub" tabs={SWIPE_FILE_TABS} images={SWIPE_FILE_IMAGES} bgImage={`${CDN}/680bbc292a514713177aac15_home-swipefile-bg.webp`} videoSrc="https://publicassets.foreplay.co/cta-swipe-file.mov" isometricSrc={`${CDN}/682f93b40d86b433e8039cc9_iso-swipefile.webp`} poster={`${CDN}/682f93b40d86b433e8039cc9_iso-swipefile.webp`} activeTab={swipeFileTab} onTabChange={setSwipeFileTab} learnMoreHref="/swipe-file" productName="swipe-file" dotColor="#3b82f6" />
          </div>
          <div style={{ marginBottom: '40px' }}>
            <ProductCard label="Recon" title="Track any creator or competitor 24/7" ctaText="See Competitors" tabs={SPYDER_TABS} images={SPYDER_IMAGES} bgImage={`${CDN}/680bbc29442689a5eff3f659_home-spyder-bg.webp`} videoSrc="https://publicassets.foreplay.co/cta-spyder.mov" isometricSrc={`${CDN}/682f93b469081ade4aadbbad_iso-spyder.webp`} poster={`${CDN}/682f93b469081ade4aadbbad_iso-spyder.webp`} activeTab={spyderTab} onTabChange={setSpyderTab} learnMoreHref="/spyder-ad-spy" productName="spyder" dotColor="#ef4444" />
          </div>
          <div>
            <ProductCard label="Intelligence" title="AI-powered trend detection before the wave hits" ctaText="Explore Trends" tabs={DISCOVERY_TABS} images={DISCOVERY_IMAGES} bgImage={`${CDN}/680bbc2b22ec562396738e58_home-discovery-bg.webp`} videoSrc="https://publicassets.foreplay.co/cta-discovery.mov" isometricSrc={`${CDN}/682f93b42567b6ff190373b9_iso-discovery.webp`} poster={`${CDN}/682f93b42567b6ff190373b9_iso-discovery.webp`} activeTab={discoveryTab} onTabChange={setDiscoveryTab} learnMoreHref="/discovery" productName="discovery" dotColor="#a855f7" />
          </div>
        </div>

        <div style={{ marginBottom: '80px' }}>
          <ChromeExtensionCard />
        </div>

        {/* ── AI Production ── */}
        <SectionHeader
          pill="Your AI Production Layer"
          title="From insight to published reel, on autopilot."
          subtitle="Your agents handle the creative work — generating reels, iterating scripts, and improving output with every batch."
        />
        <div className="product-section-section-padding" style={{ paddingTop: '80px', marginBottom: '80px' }}>
          <ProductCard label="Agents" title="Your dedicated agent team, transparent and always working" ctaText="Meet Your Agents" tabs={LENS_TABS} images={LENS_IMAGES} bgImage={`${CDN}/6818f491db7df5646bba2c71_lens-product-bg.webp`} videoSrc="https://publicassets.foreplay.co/cta-lens.mp4" isometricSrc={`${CDN}/682f93b43a94db00dbc45367_iso-lens.webp`} poster={`${CDN}/682f93b43a94db00dbc45367_iso-lens.webp`} activeTab={lensTab} onTabChange={setLensTab} learnMoreHref="/lens-creative-analytics" productName="lens" />
        </div>
        <div className="product-section-section-padding">
          <ProductCard label="Content Gen" title="Go from concept to published reel, faster" ctaText="See It Work" tabs={BRIEFS_TABS} images={BRIEFS_IMAGES} bgImage={`${CDN}/680bbc29f6ff9917b3df880f_home-briefs-bg.webp`} videoSrc="https://publicassets.foreplay.co/cta-briefs.webm" isometricSrc={`${CDN}/682f93b44b8360f413644eb7_iso-briefs.webp`} poster={`${CDN}/682f93b44b8360f413644eb7_iso-briefs.webp`} activeTab={briefsTab} onTabChange={setBriefsTab} learnMoreHref="/briefs" productName="briefs" dotColor="#22c55e" />
        </div>
      </div>
    </section>
  );
}
