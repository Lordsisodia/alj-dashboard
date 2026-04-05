import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import type { Device } from "../domain/types";
import { createMockDevicesService, DevicesService } from "../infrastructure/devicesService";

interface UseDevicesResult {
  devices: Device[];
  loading: boolean;
  error: Error | null;
  refresh: () => Promise<void>;
  revoke: (deviceId: string) => Promise<void>;
}

export function useDevices(service?: DevicesService): UseDevicesResult {
  const resolvedService = useMemo(() => service ?? createMockDevicesService(), []);
  const [devices, setDevices] = useState<Device[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const aborted = useRef(false);

  const refresh = useCallback(async () => {
    setLoading(true);
    try {
      const list = await resolvedService.list();
      if (aborted.current) return;
      setDevices(list);
      setError(null);
    } catch (err) {
      if (aborted.current) return;
      setError(err as Error);
    } finally {
      if (aborted.current) return;
      setLoading(false);
    }
  }, [resolvedService]);

  const revoke = useCallback(
    async (deviceId: string) => {
      try {
        await resolvedService.revoke({ deviceId });
        await refresh();
      } catch (err) {
        setError(err as Error);
      }
    },
    [refresh, resolvedService]
  );

  useEffect(() => {
    aborted.current = false;
    void refresh();
    return () => {
      aborted.current = true;
    };
  }, [refresh]);

  return { devices, loading, error, refresh, revoke };
}
