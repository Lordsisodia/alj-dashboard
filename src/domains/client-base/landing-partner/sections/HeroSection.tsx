"use client";

import { memo } from 'react';
import { Hero } from '@/components/ui/animated-hero';

export const HeroSection = memo(() => {
  console.log('[HeroSection] Rendering hero section'); // Debug log

  return (
    <section
      id="hero"
      className="min-h-screen flex items-center justify-center pt-16 sm:pt-16 lg:pt-20 pb-10"
    >
      <Hero />
    </section>
  );
});

HeroSection.displayName = 'HeroSection';
