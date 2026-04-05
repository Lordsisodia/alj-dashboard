// @ts-nocheck
"use client";

import React, { lazy, Suspense, memo, useEffect } from 'react';
import { LoadingFallback } from './sections/LoadingFallback';
import Footer from '@/components/Footer';
import { HeroSection } from './sections/HeroSection';
import { useViewportLoading } from '@/hooks/useViewportLoading';
import { TierProgressBackdrop } from '@/domains/partnerships/_shared/ui/backgrounds/TierProgressBackdrop';

// Only lazy load non-critical sections
const WhyChooseSection = lazy(() => import('./sections/WhyChooseSection').then(m => ({
  default: memo(m.WhyChooseSection)
})));

const PortfolioSection = lazy(() => import('./sections/PortfolioSection').then(m => ({
  default: memo(m.PortfolioSection)
})));



// Lightweight error boundary to avoid pulling react-error-boundary
class LocalErrorBoundary extends React.Component<
  { fallback: React.ReactNode },
  { hasError: boolean; message?: string }
> {
  constructor(props: any) {
    super(props);
    this.state = { hasError: false, message: '' };
  }
  static getDerivedStateFromError() {
    return { hasError: true };
  }
  componentDidCatch(error: any, info: any) {
    console.error('[LandingPage] Error boundary caught', error, info);
    this.setState({ message: error?.message ?? String(error) });
  }
  render() {
    if (this.state.hasError) {
      return (
        <div className="text-center text-red-300">
          {this.props.fallback}
          {this.state.message ? (
            <div className="mt-2 text-sm text-red-400">
              {this.state.message}
            </div>
          ) : null}
        </div>
      );
    }
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
    <div className="relative min-h-screen w-full bg-black overflow-x-hidden">
      {/* Tier progression animated backdrop */}
      <TierProgressBackdrop className="absolute inset-0" />

      {/* Progressive section loading */}
      <div className="relative z-10 px-4 md:px-0 space-y-12 md:space-y-24">
        <LocalErrorBoundary fallback={<div>Error loading hero section</div>}>
          <HeroSection />
        </LocalErrorBoundary>

        <LocalErrorBoundary fallback={<div>Error loading sections</div>}>
          <Suspense fallback={<LoadingFallback />}>
            <WhyChooseSection />
          </Suspense>

          <Suspense fallback={<LoadingFallback />}>
            <PortfolioSection />
          </Suspense>
        </LocalErrorBoundary>

        <Footer />
      </div>
    </div>
  );
};

export default memo(LandingPage);
