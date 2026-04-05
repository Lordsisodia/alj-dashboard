import { LocationsCard } from './LocationsCard';
import { AgeRangeCard } from './AgeRangeCard';
import { GenderHoursCard } from './GenderHoursCard';

export function AudienceInsights() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
      <LocationsCard />
      <AgeRangeCard />
      <GenderHoursCard />
    </div>
  );
}
