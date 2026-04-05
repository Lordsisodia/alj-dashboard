// Shared TypeScript interfaces for the ProductPage template and all product data files.

export interface ProductHero {
  subtitle: string;
  headline: string;
  paragraph: string;
  ctaHref: string;
  animatedIconVideoSrc: string;
  staticIconSrc: string;
  heroVideoSrc: string;
  heroVideoPoster: string;
  mockupSrc: string;
}

export interface BeforeAfterCard {
  label: string;
  description: string;
  imageSrc: string;
}

export interface BeforeAfter {
  sectionTitle: string;
  sectionParagraph: string;
  before: BeforeAfterCard;
  after: BeforeAfterCard;
}

export interface UseCaseItem {
  title: string;
  description: string;
  imageSrc: string;
}

export interface CoreFeatureTab {
  label: string;
  svgContent: string;
  imageSrc: string;
}

export interface CoreFeatures {
  subtitle: string;
  title: string;
  paragraph: string;
  tabs: CoreFeatureTab[];
}

export interface UseCases {
  subtitle: string;
  title: string;
  paragraph: string;
  items: UseCaseItem[];
}

export interface SmartFeatures {
  subtitle: string;
  title: string;
  paragraph: string;
  row1: SmartFeatureCard[];
  testimonial1: EmbeddedTestimonial;
  row2: SmartFeatureCard[];
  testimonial2: EmbeddedTestimonial;
}

export interface FAQ {
  sectionTitle: string;
  sectionParagraph: string;
  items: FAQItem[];
}

export interface FAQItem {
  question: string;
  answer: string;
}

export interface BottomCTA {
  headline: string;
  paragraph: string;
  primaryCtaText: string;
  primaryCtaHref: string;
  secondaryCtaText: string;
  secondaryCtaHref: string;
}

export interface SmartFeatureCard {
  imageSrc: string;
  title: string;
  description: string;
}

export interface EmbeddedTestimonial {
  logoSrc: string;
  logoAlt: string;
  quote: string;
  authorName: string;
  authorTitle: string;
  authorHeadshot: string;
}

export interface EmbeddedCTA {
  headline: string;
  paragraph: string;
  primaryCtaText: string;
  primaryCtaHref: string;
  showNoCcBadge: boolean;
  videoSrc?: string;
  iconSrc?: string;
}

export interface ProductPageData {
  slug: string;
  hero: ProductHero;
  beforeAfter: {
    sectionTitle: string;
    sectionParagraph: string;
    before: BeforeAfterCard;
    after: BeforeAfterCard;
  };
  useCases: {
    subtitle: string;
    title: string;
    paragraph: string;
    items: UseCaseItem[];
  };
  coreFeatures: {
    subtitle: string;
    title: string;
    paragraph: string;
    tabs: CoreFeatureTab[];
  };
  smartFeatures: {
    subtitle: string;
    title: string;
    paragraph: string;
    row1: SmartFeatureCard[];
    testimonial1: EmbeddedTestimonial;
    row2: SmartFeatureCard[];
    testimonial2: EmbeddedTestimonial;
  };
  embeddedCta: EmbeddedCTA;
  faq: {
    sectionTitle: string;
    sectionParagraph: string;
    items: FAQItem[];
  };
  bottomCta: BottomCTA;
}
