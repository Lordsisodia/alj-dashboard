import { MODELS } from '../../constants';
import { ModelCard } from './ModelCard';

export function RosterView({ activeFilter }: { activeFilter: string }) {
  const filtered = MODELS.filter((m) => {
    if (activeFilter === 'active') return m.status === 'Active';
    if (activeFilter === 'paused') return m.status === 'Paused';
    if (activeFilter === 'no-brief') return m.reelsInPipeline === 0;
    return true;
  });

  return (
    <div className="p-4 grid grid-cols-1 gap-3 sm:grid-cols-2">
      {filtered.map((model, i) => (
        <ModelCard key={model.id} model={model} index={i} />
      ))}
    </div>
  );
}
