'use client';
// UniversityPage — main template assembling all university page sections.

import UniversityHero from './UniversityHero';
import UniversityCampusSection from './UniversityCampusSection';
import UniversityBottomCTA from './UniversityBottomCTA';
import Footer from '@/features/marketing/components/Footer';
import NavBar from '@/features/marketing/components/navbar/NavBar';
import { universityData } from './data/university';

export default function UniversityPage() {
  return (
    <div style={{ background: '#020308', minHeight: '100vh' }}>
      <NavBar />
      <div className="main">
        <UniversityHero hero={universityData.hero} />
        <UniversityCampusSection
          campus={universityData.campus}
          professor={universityData.professor}
        />
        <UniversityBottomCTA bottomCta={universityData.bottomCta} />
      </div>
      <Footer />
    </div>
  );
}
