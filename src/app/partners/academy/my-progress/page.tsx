import { getProgressSnapshot } from "@/domains/partnerships/academy/shared/application/progress-service";
import { MyProgressScreen } from "@/domains/partnerships/academy/02-my-progress/ui/screens/MyProgressScreen";

export const dynamic = 'force-dynamic';

type SearchParams = { page?: string | string[] };

export default async function MyProgressPage({ searchParams }: { searchParams: Promise<SearchParams> }) {
  const params = await searchParams;
  const pageParam = Array.isArray(params?.page) ? params.page[0] : params?.page;
  const page = Number(pageParam ?? "1");
  const snapshot = await getProgressSnapshot({ page });
  return <MyProgressScreen {...snapshot} />;
}
