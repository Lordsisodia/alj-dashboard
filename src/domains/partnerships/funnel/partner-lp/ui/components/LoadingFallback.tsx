import { Skeleton } from '@/components/ui/skeleton';

export const LoadingFallback = () => (
  <div className="container mx-auto px-4 py-10 grid gap-4">
    <Skeleton className="h-10 w-2/3 mx-auto" />
    <Skeleton className="h-6 w-1/2 mx-auto" />
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      <Skeleton className="h-32" />
      <Skeleton className="h-32" />
      <Skeleton className="h-32" />
    </div>
  </div>
);

