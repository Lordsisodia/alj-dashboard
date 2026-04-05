import { useCallback, useEffect, useMemo, useState } from "react";
import type { SecuritySettings } from "../domain/types";
import { createMockSecurityService, SecurityService } from "../infrastructure/securityService";

interface UseSecuritySettingsResult {
  settings: SecuritySettings | null;
  loading: boolean;
  error: Error | null;
  refresh: () => Promise<void>;
  terminateSession: (sessionId: string) => Promise<void>;
  toggleLoginAlerts: (enabled: boolean) => Promise<void>;
}

export function useSecuritySettings(service?: SecurityService): UseSecuritySettingsResult {
  const resolvedService = useMemo(() => service ?? createMockSecurityService(), [service]);
  const [settings, setSettings] = useState<SecuritySettings | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  const refresh = useCallback(async () => {
    setLoading(true);
    try {
      const data = await resolvedService.getSettings();
      setSettings(data);
      setError(null);
    } catch (err) {
      setError(err as Error);
    } finally {
      setLoading(false);
    }
  }, [resolvedService]);

  const terminateSession = useCallback(
    async (sessionId: string) => {
      try {
        await resolvedService.terminateSession(sessionId);
        await refresh();
      } catch (err) {
        setError(err as Error);
      }
    },
    [refresh, resolvedService]
  );

  const toggle = useCallback(
    async (enabled: boolean) => {
      try {
        const updated = await resolvedService.toggleLoginAlerts(enabled);
        setSettings(updated);
        setError(null);
      } catch (err) {
        setError(err as Error);
      }
    },
    [resolvedService]
  );

  useEffect(() => {
    void refresh();
  }, [refresh]);

  return {
    settings,
    loading,
    error,
    refresh,
    terminateSession,
    toggleLoginAlerts: toggle,
  };
}
