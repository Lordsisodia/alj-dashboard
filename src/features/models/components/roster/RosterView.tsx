import { MODELS } from '../../constants';
import { ModelRosterCard } from './ModelRosterCard';
import { PortfolioStatsStrip } from './PortfolioStatsStrip';

export function RosterView({ activeFilter }: { activeFilter: string }) {
  const filtered = MODELS.filter((m) => {
    if (activeFilter === 'active') return m.status === 'Active';
    if (activeFilter === 'paused') return m.status === 'Paused';
    if (activeFilter === 'no-brief') return m.reelsInPipeline === 0;
    if (activeFilter === 'onboarding') return m.onboardingPhase < 6;
    return true;
  });

  return (
    <div>
      <PortfolioStatsStrip />
      <div className="px-4 pb-4 grid grid-cols-1 gap-3 sm:grid-cols-2">
        {filtered.map((model, i) => (
          <ModelRosterCard key={model.id} model={model} index={i} />
        ))}
      </div>
    </div>
  );
}
