import { useCallback, useEffect, useMemo, useState } from "react";
import type { PrivacySettings } from "../domain/types";
import { createMockPrivacyService, PrivacyService } from "../infrastructure/privacyService";

interface UsePrivacySettingsResult {
  settings: PrivacySettings | null;
  loading: boolean;
  error: Error | null;
  refresh: () => Promise<void>;
  update: (partial: Partial<PrivacySettings>) => Promise<void>;
}

export function usePrivacySettings(service?: PrivacyService): UsePrivacySettingsResult {
  const resolvedService = useMemo(() => service ?? createMockPrivacyService(), [service]);
  const [settings, setSettings] = useState<PrivacySettings | null>(null);
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

  const update = useCallback(
    async (partial: Partial<PrivacySettings>) => {
      try {
        const next = await resolvedService.updateSettings(partial);
        setSettings(next);
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

  return { settings, loading, error, refresh, update };
}
