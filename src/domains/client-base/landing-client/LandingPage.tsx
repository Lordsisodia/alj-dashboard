"use client";

import React, { lazy, Suspense, memo, useEffect } from 'react';
import { LoadingFallback } from './sections/LoadingFallback';
import Footer from '@/components/Footer';
import { HeroSection } from './sections/HeroSection';

// Lazy load non-critical sections
const WhyPartnerSection = lazy(() => import('./sections/WhyPartnerSection').then(m => ({
  default: memo(m.WhyPartnerSection)
})));
const HowItWorksSection = lazy(() => import('./sections/HowItWorksSection').then(m => ({
  default: memo(m.HowItWorksSection)
})));
const EarningsSection = lazy(() => import('./sections/EarningsSection').then(m => ({
  default: memo(m.EarningsSection)
})));
const PortalFeaturesSection = lazy(() => import('./sections/PortalFeaturesSection').then(m => ({
  default: memo(m.PortalFeaturesSection)
})));
const CoSellingSupportSection = lazy(() => import('./sections/CoSellingSupportSection').then(m => ({
  default: memo(m.CoSellingSupportSection)
})));
const CaseStudiesSection = lazy(() => import('./sections/CaseStudiesSection').then(m => ({
  default: memo(m.CaseStudiesSection)
})));
const FAQSection = lazy(() => import('./sections/FAQSection').then(m => ({
  default: memo(m.FAQSection)
})));
const FinalCTASection = lazy(() => import('./sections/FinalCTASection').then(m => ({
  default: memo(m.FinalCTASection)
})));



class LocalErrorBoundary extends React.Component<
  { fallback: React.ReactNode; children?: React.ReactNode },
  { hasError: boolean }
> {
  constructor(props: any) {
    super(props);
    this.state = { hasError: false };
  }
  static getDerivedStateFromError() {
    return { hasError: true };
  }
  componentDidCatch(error: any, info: any) {
    console.error('[LandingPage] Error boundary caught', error, info);
  }
  render() {
    if (this.state.hasError) return this.props.fallback;
    return this.props.children;
  }
}

const LandingPage = () => {
  console.log('[LandingPage] Rendering landing page');

  // Preload critical assets
  useEffect(() => {
    // Preload key images or scripts
    const preconnectLinks = [
      'https://avdgyrepwrvsvwgxrccr.supabase.co'
    ];
    
    preconnectLinks.forEach(url => {
      const link = document.createElement('link');
      link.rel = 'preconnect';
      link.href = url;
      link.crossOrigin = 'anonymous';
      document.head.appendChild(link);
      
      const dnsPrefetch = document.createElement('link');
      dnsPrefetch.rel = 'dns-prefetch';
      dnsPrefetch.href = url;
      document.head.appendChild(dnsPrefetch);
    });
    
    return () => {
      // Clean up preconnect links on unmount
      document.querySelectorAll('link[rel="preconnect"], link[rel="dns-prefetch"]').forEach(el => {
        el.remove();
      });
    };
  }, []);

  return (
    <div className="min-h-screen w-full bg-gradient-to-b from-black via-siso-bg to-black overflow-x-hidden">
      {/* Optimized background elements */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 -left-1/4 w-[250px] md:w-[600px] h-[250px] md:h-[600px] 
          bg-siso-red/15 rounded-full filter blur-[80px] md:blur-[120px] 
          animate-float-slow transform-gpu will-change-transform"
        />
        <div className="absolute bottom-1/4 -right-1/4 w-[250px] md:w-[600px] h-[250px] md:h-[600px] 
          bg-siso-orange/15 rounded-full filter blur-[80px] md:blur-[120px] 
          animate-float-slower transform-gpu will-change-transform"
        />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 
          w-[350px] md:w-[1000px] h-[350px] md:h-[1000px] 
          bg-siso-red/8 rounded-full filter blur-[100px] md:blur-[150px] transform-gpu will-change-transform"
        />
      </div>

      {/* Progressive section loading */}
      <div className="relative z-10 px-4 md:px-0 space-y-12 md:space-y-24">
        <LocalErrorBoundary
          fallback={<div>Error loading hero section</div>}
        >
          <HeroSection />
        </LocalErrorBoundary>

        <LocalErrorBoundary
          fallback={<div>Error loading sections</div>}
        >
          <Suspense fallback={<LoadingFallback />}>
            <WhyPartnerSection />
            <HowItWorksSection />
            <EarningsSection />
            <PortalFeaturesSection />
            <CoSellingSupportSection />
            <CaseStudiesSection />
            <FAQSection />
            <FinalCTASection />
          </Suspense>
        </LocalErrorBoundary>



        <Footer />
      </div>
    </div>
  );
};

export default memo(LandingPage);
