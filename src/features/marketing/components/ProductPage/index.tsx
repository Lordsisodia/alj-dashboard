import Footer from '@/features/marketing/components/Footer';
import {
  ProductHero,
  BeforeAfter,
  UseCases,
  CoreFeatures,
  SmartFeaturesGrid,
  EmbeddedCTA,
  ChromeExtension,
  FAQAccordion,
  BottomCTA,
} from './components';
import type { ProductPageData } from './types';

interface Props {
  data: ProductPageData;
}

export default function ProductPage({ data }: Props) {
  return (
    <div style={{ background: '#020308', minHeight: '100vh' }}>
      <div className="main">
        <ProductHero hero={data.hero} />
        <BeforeAfter data={data.beforeAfter} />
        <UseCases data={data.useCases} />
        <CoreFeatures data={data.coreFeatures} />
        <SmartFeaturesGrid data={data.smartFeatures} />
        <EmbeddedCTA data={data.embeddedCta} />
        <ChromeExtension />
        <FAQAccordion data={data.faq} />
        <BottomCTA cta={data.bottomCta} />
      </div>
      <Footer />
    </div>
  );
}
