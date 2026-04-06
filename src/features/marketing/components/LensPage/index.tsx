'use client';
// LensPage - assembles all Lens page sections.

import NavBar from '@/features/marketing/components/layout/navbar/NavBar';
import LensHero from './LensHero';
import LensSolutionSection from './LensSolutionSection';
import LensIntegrations from './LensIntegrations';
import LensGamificationSection from './LensGamificationSection';
import LensBenchmarking from './LensBenchmarking';
import LensEnrichment from './LensEnrichment';
import LensSecurity from './LensSecurity';
import LensEmbeddedCTA from './LensEmbeddedCTA';
import Footer from '@/features/marketing/components/Footer';
import { lensData } from './data/lens';

export default function LensPage() {
  return (
    <div style={{ background: '#020308', minHeight: '100vh' }}>
      <NavBar />
      <div className="main">
        <LensHero hero={lensData.hero} />
        <LensSolutionSection
          icons={lensData.solutionIcons}
          graphCards={lensData.graphCards}
          subtext={lensData.subtext}
          testimonials={lensData.testimonials}
        />
        <LensIntegrations tabs={lensData.integrationTabs} />
        <LensGamificationSection gamification={lensData.gamification} benchmarks={lensData.benchmarks} />
        <section aria-labelledby="carousel-heading" className="section">
          <div className="section-padding">
            <div className="section-white-block">
              <LensBenchmarking segments={lensData.benchmarkSegments} badges={lensData.benchmarkBadges} />
            </div>
          </div>
        </section>
        <section className="section">
          <div className="lens-enrichment_security">
            <div className="container">
              <LensEnrichment tools={lensData.enrichmentTools} />
            </div>
            <div className="container">
              <LensSecurity cards={lensData.securityCards} />
            </div>
          </div>
        </section>
        <section className="section">
          <div className="container section-container">
            <LensEmbeddedCTA cta={lensData.embeddedCta} />
          </div>
        </section>
      </div>
      <Footer />
    </div>
  );
}
