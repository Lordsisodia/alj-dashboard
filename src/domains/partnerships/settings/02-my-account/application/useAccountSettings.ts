import { useEffect, useMemo, useRef, useState } from "react";
import type { AccountField, TwoFactorAction } from "../domain/types";
import type { AccountSettingsParsed } from "../domain/schema";
import { createMockAccountSettingsService, type AccountSettingsService } from "../infrastructure/accountService";

interface UseAccountSettingsResult {
  settings: AccountSettingsParsed | null;
  loading: boolean;
  error: Error | null;
  refresh: () => Promise<void>;
  contactFields: AccountField[];
  twoFactorActions: TwoFactorAction[];
  hero: { username: string; accountId: string };
}

export function useAccountSettings(service?: AccountSettingsService): UseAccountSettingsResult {
  const resolved = useMemo(() => service ?? createMockAccountSettingsService(), [service]);
  const [settings, setSettings] = useState<AccountSettingsParsed | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const aborted = useRef(false);

  const refresh = async () => {
    setLoading(true);
    try {
      const data = await resolved.get();
      if (aborted.current) return;
      setSettings(data);
      setError(null);
    } catch (err) {
      if (aborted.current) return;
      setError(err as Error);
    } finally {
      if (aborted.current) return;
      setLoading(false);
    }
  };

  useEffect(() => {
    void refresh();
    return () => {
      aborted.current = true;
    };
  }, []);

  const contactFields = settings?.fields ?? [];
  const twoFactorActions = settings?.twoFactorActions ?? [];
  const hero = {
    username: contactFields.find(f => f.id === "username")?.value ?? "@partner",
    accountId: "01JV0EY9FHYKJ08PNC5BMHTJBT",
  };

  return { settings, loading, error, refresh, contactFields, twoFactorActions, hero };
}
