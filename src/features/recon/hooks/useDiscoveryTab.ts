import { useState } from 'react';

export function useDiscoveryTab() {
  const [searchQuery, setSearchQuery]         = useState('');
  const [runDiscoveryTrigger, setRunDiscoveryTrigger] = useState(0);
  const [scheduleHours, setScheduleHours]     = useState(6);
  const [showAnalytics, setShowAnalytics]     = useState(false);

  return {
    searchQuery,
    setSearchQuery,
    runDiscoveryTrigger,
    setRunDiscoveryTrigger,
    scheduleHours,
    setScheduleHours,
    showAnalytics,
    setShowAnalytics,
  };
}
