import ProductPage from '@/features/marketing/components/ProductPage';
import { briefsData } from '@/features/marketing/components/ProductPage/data/briefs';

export default function ContentGenPage() {
  return <ProductPage data={briefsData} />;
}
