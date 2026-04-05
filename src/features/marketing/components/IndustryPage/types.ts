// Shared TypeScript interfaces for the IndustryPage template and all data files.

export interface Testimonial {
  companyUrl: string;
  logoSrc: string;
  logoAlt: string;
  quote: string;
  headshot: string;
  name: string;
  title: string;
  screenshotSrc: string;
}

export interface FeatureTab {
  label: string;
}

export interface FeatureCard {
  iconSrc: string;
  title: string;
  subtitle: string;
  features: FeatureTab[];
  ctaHref: string;
  videoSrc?: string;
  isoSrc: string;
  bgSrc: string;
  slides: string[];
}

export interface AdGalleryBrand {
  name: string;
  avatarSrc: string;
}

export interface AdGalleryItem {
  brand: AdGalleryBrand;
  duration: string;
  imageSrc: string;
}

export interface IndustryPageData {
  slug: string;
  hero: {
    subtitle: string;
    headline: string;
    paragraph: string;
  };
  clientLogos: { src: string; alt: string }[];
  testimonials: {
    sectionTitle: string;
    items: Testimonial[];
  };
  features: {
    subtitle: string;
    title: string;
    paragraph: string;
    cards: FeatureCard[];
  };
  adGallery: {
    subtitle: string;
    title: string;
    ctaText: string;
    items: AdGalleryItem[];
  };
  bottomCta: {
    headline: string;
    paragraph: string;
  };
}
