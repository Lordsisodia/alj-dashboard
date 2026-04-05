'use client';
// MobileAppPage — assembles all mobile-app page sections.

import NavBar from '@/features/marketing/components/navbar/NavBar';
import MobileAppHero from './MobileAppHero';
import MobileAppFeatures from './MobileAppFeatures';
import MobileAppBottomCTA from './MobileAppBottomCTA';
import Footer from '@/features/marketing/components/Footer';
import { mobileAppData } from './data/mobile-app';

export default function MobileAppPage() {
  const { hero, features, bottomCta } = mobileAppData;

  return (
    <div style={{ background: '#020308', minHeight: '100vh' }}>
      <NavBar />
      <div className="main">
        <MobileAppHero hero={hero} />
        <MobileAppFeatures features={features} />
        <MobileAppBottomCTA bottomCta={bottomCta} />
      </div>
      <Footer />
    </div>
  );
}
