"use client";

import { memo } from 'react';
import { Hero } from './AnimatedHero';
import { motion } from 'framer-motion';
import { useIsMobile } from '@/hooks/use-mobile';

export const HeroSection = memo(() => {
  console.log('[HeroSection] Rendering hero section');
  const isMobile = useIsMobile();

  return (
    <section
      id="hero"
      className="min-h-screen flex items-center justify-center py-12 md:py-16"
      suppressHydrationWarning
    >
      <Hero />
    </section>
  );
});

HeroSection.displayName = 'HeroSection';
