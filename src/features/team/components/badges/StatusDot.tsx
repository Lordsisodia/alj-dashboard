import type { Status } from '../../types';

const STATUS_COLORS: Record<Status, string> = {
  Online:  '#22c55e',
  Away:    '#f59e0b',
  Offline: '#d1d5db',
};

export function StatusDot({ status }: { status: Status }) {
  return (
    <span
      className="inline-block w-2 h-2 rounded-full flex-shrink-0"
      style={{ backgroundColor: STATUS_COLORS[status] }}
    />
  );
}
