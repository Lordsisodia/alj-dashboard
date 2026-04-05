import HeroSection from '@/features/marketing/components/HeroSection';
import SecretWeaponSection from '@/features/marketing/components/SecretWeaponSection';
import ProductSection from '@/features/marketing/components/ProductSection';
import CollaborationSection from '@/features/marketing/components/CollaborationSection';
import FeaturesSection from '@/features/marketing/components/FeaturesSection';
import HomeCTA from '@/features/marketing/components/HomeCTA';
import Footer from '@/features/marketing/components/Footer';

export default function Home() {
  return (
    <div style={{ background: '#000' }}>
      <HeroSection />
      <SecretWeaponSection />
      <ProductSection />
      {/* CollaborationSection: Sharing & Presenting with Big White card */}
      <CollaborationSection />
      {/* FeaturesSection: Miles beyond the status quo (Expert Swipe Files, Mobile App, API) */}
      <FeaturesSection />
      <HomeCTA />
      <Footer />
    </div>
  );
}
