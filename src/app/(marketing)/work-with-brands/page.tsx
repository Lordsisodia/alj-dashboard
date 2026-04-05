import {
  WorkWithBrandsHero,
  WorkWithBrandsBest,
  WorkWithBrandsSocialProof,
  WorkWithBrandsCTA,
  workWithBrandsData,
} from '@/features/marketing/components/WorkWithBrands';

export default function WorkWithBrandsPage() {
  return (
    <>
      <WorkWithBrandsHero hero={workWithBrandsData.hero} />
      <WorkWithBrandsBest best={workWithBrandsData.bestSection} />
      <WorkWithBrandsSocialProof socialProof={workWithBrandsData.socialProof} />
      <WorkWithBrandsCTA cta={workWithBrandsData.bottomCta} />
    </>
  );
}
