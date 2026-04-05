import WebinarsPage from '@/features/marketing/components/WebinarsPage';
import { webinarsData, webinarsReplays } from '@/features/marketing/components/WebinarsPage/data/webinars';

export default function WebinarsRoute() {
  return <WebinarsPage data={webinarsData} replays={webinarsReplays} />;
}
