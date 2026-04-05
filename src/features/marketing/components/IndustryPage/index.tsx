// IndustryPage — main template component that assembles all industry page sections.
// Pass an IndustryPageData object to render a complete industry/solution page.

import IndustryHero from './IndustryHero';
import IndustryTestimonials from './IndustryTestimonials';
import IndustryFeatures from './IndustryFeatures';
import IndustryAdGallery from './IndustryAdGallery';
import IndustryBottomCTA from './IndustryBottomCTA';
import Footer from '@/features/marketing/components/Footer';
import type { IndustryPageData } from './types';

interface Props {
  data: IndustryPageData;
}

export default function IndustryPage({ data }: Props) {
  return (
    <div style={{ background: '#020308', minHeight: '100vh' }}>
      <div className="main">
        <IndustryHero hero={data.hero} clientLogos={data.clientLogos} />
        <IndustryTestimonials testimonials={data.testimonials} />
        <IndustryFeatures features={data.features} />
        <IndustryAdGallery adGallery={data.adGallery} />
        <IndustryBottomCTA bottomCta={data.bottomCta} />
      </div>
      <Footer />
    </div>
  );
}
