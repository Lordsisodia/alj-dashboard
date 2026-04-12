import { ModelDetailPage } from '@/features/models/components/detail/ModelDetailPage';

export default async function ModelDetailRoute({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  return <ModelDetailPage modelId={id} />;
}
