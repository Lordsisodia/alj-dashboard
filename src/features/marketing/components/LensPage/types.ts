export interface SolutionIcon {
  title: string;
  description: string;
  svgPath: string;
}

export interface GraphCard {
  title: string;
  description: string;
  legend: { label: string; color: 'teal' | 'red' | 'white' | 'rainbow' }[];
  isLens?: boolean;
}

export interface Testimonial {
  name: string;
  title: string;
  company: string;
  avatarUrl: string;
  quote: string;
}

export interface BenchmarkSegment {
  name: string;
  imageUrl: string;
}

export interface BenchmarkBadge {
  value: string;
  label: string;
  isGreen?: boolean;
}

export interface EnrichmentTool {
  name: string;
  description: string;
  imageUrl: string;
}

export interface SecurityCard {
  title: string;
  description: string;
  imageUrl: string;
  svgPath: string;
}

export interface LensHeroData {
  headline: string;
  subtext: string;
  ctaText: string;
  ctaHref: string;
  videoWebm: string;
  videoMp4: string;
  videoMp4Src: string;
  videoWebmSrc: string;
  posterUrl: string;
  mockupUrl: string;
  lightboxVideoUrl: string;
  lightboxLabel: string;
  lightboxSubtext: string;
}

export interface LensData {
  hero: LensHeroData;
  solutionIcons: SolutionIcon[];
  graphCards: GraphCard[];
  subtext: string;
  testimonials: Testimonial[];
  integrationTabs: { label: string; imageUrl: string }[];
  gamification: {
    overline: string;
    title: string;
    subtext: string;
    ctaText: string;
    imageUrl: string;
  };
  benchmarks: {
    overline: string;
    title: string;
    subtext: string;
    ctaText: string;
    imageUrl: string;
  };
  benchmarkSegments: BenchmarkSegment[];
  benchmarkBadges: BenchmarkBadge[];
  enrichmentTools: EnrichmentTool[];
  securityCards: SecurityCard[];
  embeddedCta: {
    headline: string;
    subtext: string;
    ctaText: string;
    ctaHref: string;
    videoMp4: string;
    isoImageUrl: string;
  };
}
