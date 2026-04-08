import { cn } from '@/lib/utils';

interface Props {
  children:   React.ReactNode;
  className?: string;
}

export function TableCard({ children, className }: Props) {
  return (
    <div
      className={cn('relative rounded-xl overflow-hidden bg-white', className)}
      style={{ border: '1px solid rgba(0,0,0,0.07)' }}
    >
      {children}
    </div>
  );
}
