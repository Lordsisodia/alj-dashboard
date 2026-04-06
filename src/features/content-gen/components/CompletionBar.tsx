import { GRAD } from '../constants';

interface Props { pct: number }

export function CompletionBar({ pct }: Props) {
  return (
    <div className="w-full h-1 rounded-full bg-black/[0.06] overflow-hidden">
      <div
        className="h-full rounded-full transition-all duration-500"
        style={{ width: `${pct}%`, background: pct === 100 ? '#10b981' : GRAD }}
      />
    </div>
  );
}
