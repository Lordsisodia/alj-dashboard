import ProductPage from '@/features/marketing/components/ProductPage';
import { swipeFileData } from '@/features/marketing/components/ProductPage/data/swipe-file';

export default function HubPage() {
  return <ProductPage data={swipeFileData} />;
}
