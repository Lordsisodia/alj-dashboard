'use client';

import { LocationsCard } from './LocationsCard';
import { AgeRangeCard } from './AgeRangeCard';
import { GenderHoursCard } from './GenderHoursCard';
import type { ModelAnalyticsData } from '../../types';

interface AudienceInsightsProps {
  data: ModelAnalyticsData;
}

export function AudienceInsights({ data }: AudienceInsightsProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
      <LocationsCard locations={data.audienceLocations} />
      <AgeRangeCard ranges={data.ageRanges} />
      <GenderHoursCard genderSplit={data.genderSplit} activeHours={data.activeHours} />
    </div>
  );
}
