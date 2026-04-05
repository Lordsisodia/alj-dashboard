import { useCallback, useEffect, useMemo, useState } from "react";
import type { Integration } from "../domain/types";
import { createMockIntegrationsService, IntegrationsService } from "../infrastructure/integrationsService";

interface UseIntegrationsResult {
  integrations: Integration[];
  loading: boolean;
  error: Error | null;
  refresh: () => Promise<void>;
  connect: (id: Integration["id"]) => Promise<void>;
  disconnect: (id: Integration["id"]) => Promise<void>;
}

export function useIntegrations(service?: IntegrationsService): UseIntegrationsResult {
  const resolvedService = useMemo(() => service ?? createMockIntegrationsService(), [service]);
  const [integrations, setIntegrations] = useState<Integration[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  const refresh = useCallback(async () => {
    setLoading(true);
    try {
      const list = await resolvedService.list();
      setIntegrations(list);
      setError(null);
    } catch (err) {
      setError(err as Error);
    } finally {
      setLoading(false);
    }
  }, [resolvedService]);

  const connect = useCallback(
    async (id: Integration["id"]) => {
      try {
        // optimistic
        setIntegrations(prev => prev.map(i => (i.id === id ? { ...i, connected: true, connectedAt: new Date() } : i)));
        const res = await resolvedService.connect(id);
        if (res) {
          setIntegrations(prev => prev.map(i => (i.id === id ? res : i)));
        } else {
          await refresh();
        }
      } catch (err) {
        setError(err as Error);
      }
    },
    [refresh, resolvedService]
  );

  const disconnect = useCallback(
    async (id: Integration["id"]) => {
      try {
        setIntegrations(prev => prev.map(i => (i.id === id ? { ...i, connected: false, connectedAt: undefined } : i)));
        const res = await resolvedService.disconnect(id);
        if (res) {
          setIntegrations(prev => prev.map(i => (i.id === id ? res : i)));
        } else {
          await refresh();
        }
      } catch (err) {
        setError(err as Error);
      }
    },
    [refresh, resolvedService]
  );

  useEffect(() => {
    void refresh();
  }, [refresh]);

  return { integrations, loading, error, refresh, connect, disconnect };
}
