// BookDemoPage — assembles the book-demo page from modular BookDemo components.

'use client';

import OnboardingHero from '@/features/marketing/components/BookDemo/OnboardingHero';
import OnboardingForm from '@/features/marketing/components/BookDemo/OnboardingForm';
import BrandStrip from '@/features/marketing/components/BookDemo/BrandStrip';
import SocialProof from '@/features/marketing/components/BookDemo/SocialProof';
import CalendarPopup from '@/features/marketing/components/BookDemo/CalendarPopup';
import Footer from '@/features/marketing/components/Footer';
import Script from 'next/script';

export default function BookDemoPage() {
  return (
    <div style={{ background: '#020308' }}>
      {/* Hero Section */}
      <div className="section overflow-hidden" style={{ display: 'block' }}>
        <div className="container section-container">
          <div className="demo-hero">
            <OnboardingHero />
            <OnboardingForm />
          </div>
          <BrandStrip />
        </div>
      </div>

      {/* Social Proof / Testimonials */}
      <SocialProof />

      {/* CTA Popup */}
      <CalendarPopup />

      {/* Footer */}
      <Footer />

      {/* Scripts */}
      <Script
        src="https://widget.senja.io/widget/26b5df20-f5c6-41fa-a198-c3bcb97d0f42/platform.js"
        strategy="lazyOnload"
      />
    </div>
  );
}
