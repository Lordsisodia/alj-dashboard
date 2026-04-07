import { useState } from 'react';

export function useLogDashboard() {
  const [runAllTrigger, setRunAllTrigger] = useState(0);
  return { runAllTrigger, setRunAllTrigger };
}
