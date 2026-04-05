// @ts-nocheck
"use client";

import { useEffect, useState } from "react";
import { generalSettingsService } from "@/domains/partnerships/settings/01-general/infrastructure/generalSettingsService";
import type { GeneralSettingsData } from "@/domains/partnerships/settings/01-general/domain/types";

export interface GeneralSettingsState {
  // Appearance settings
  currentTheme: "light" | "dark" | "system";
  fontSize: string;
  reducedMotion: boolean;
  hasUnsavedAppearanceChanges: boolean;

  // Language settings
  currentLanguage: string;
  currentTimezone: string;

  // Notification settings
  unreadNotifications: number;
  enabledNotificationCategories: number;
  totalNotificationCategories: number;

  // Integration settings
  connectedIntegrations: number;
  integrations: Array<{
    name: string;
    connected: boolean;
    icon?: string;
  }>;

  // Summary data
  settingsCompleteness: number;
  lastSettingsUpdate: Date;
  securityScore: number;
}

const defaultState: GeneralSettingsState = {
  currentTheme: "system",
  fontSize: "medium",
  reducedMotion: false,
  hasUnsavedAppearanceChanges: false,

  currentLanguage: "en",
  currentTimezone: "America/New_York",

  unreadNotifications: 0,
  enabledNotificationCategories: 0,
  totalNotificationCategories: 6,

  connectedIntegrations: 0,
  integrations: [
    { name: "Notion", connected: false },
    { name: "Google Drive", connected: false },
    { name: "Slack", connected: false },
    { name: "Calendar", connected: false },
  ],

  settingsCompleteness: 15,
  lastSettingsUpdate: new Date(),
  securityScore: 72,
};

function mapToState(data: GeneralSettingsData, stats: SettingsStats): GeneralSettingsState {
  return {
    currentTheme: data.appearance.theme,
    fontSize: data.appearance.fontSize,
    reducedMotion: data.appearance.reducedMotion,
    hasUnsavedAppearanceChanges: false,

    currentLanguage: data.language.language,
    currentTimezone: data.language.timezone,

    unreadNotifications: Math.floor(Math.random() * 5), // Mock - would come from notifications service
    enabledNotificationCategories: stats.activeNotificationCategories,
    totalNotificationCategories: 6,

    connectedIntegrations: stats.connectedIntegrations,
    integrations: data.integrations.map(i => ({
      name: i.name,
      connected: i.connected,
      icon: i.icon,
    })),

    settingsCompleteness: stats.completeness,
    lastSettingsUpdate: stats.lastSettingsUpdate,
    securityScore: stats.securityScore,
  };
}

export function useGeneralSettings(service = generalSettingsService) {
  const [settings, setSettings] = useState<GeneralSettingsState>(defaultState);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const load = async () => {
    try {
      setLoading(true);
      setError(null);
      const [settingsData, stats] = await Promise.all([
        service.getSettings(),
        service.getStats(),
      ]);
      setSettings(mapToState(settingsData, stats));
    } catch (err) {
      setError("Failed to load settings");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const buildDataUpdates = async (
    updates: Partial<GeneralSettingsState>,
  ): Promise<Partial<GeneralSettingsData>> => {
    const currentData = await service.getSettings();
    const dataUpdates: Partial<GeneralSettingsData> = {};

    if (updates.currentTheme || updates.fontSize || updates.reducedMotion !== undefined) {
      dataUpdates.appearance = {
        ...currentData.appearance,
        ...(updates.currentTheme ? { theme: updates.currentTheme } : {}),
        ...(updates.fontSize ? { fontSize: updates.fontSize as GeneralSettingsData["appearance"]["fontSize"] } : {}),
        ...(updates.reducedMotion !== undefined ? { reducedMotion: updates.reducedMotion } : {}),
      };
    }

    if (updates.currentLanguage || updates.currentTimezone) {
      dataUpdates.language = {
        ...currentData.language,
        ...(updates.currentLanguage ? { language: updates.currentLanguage } : {}),
        ...(updates.currentTimezone ? { timezone: updates.currentTimezone } : {}),
      };
    }

    if (updates.integrations) {
      dataUpdates.integrations = updates.integrations.map((integration) => ({
        id: integration.name.toLowerCase().replace(/\s+/g, "-"),
        name: integration.name,
        description: integration.name,
        icon: integration.icon ?? integration.name.toLowerCase(),
        connected: integration.connected,
        permissions: [],
      }));
    }

    return dataUpdates;
  };

  const updateSettings = async (updates: Partial<GeneralSettingsState>) => {
    const previous = settings;
    const optimistic = { ...settings, ...updates, lastSettingsUpdate: new Date() } as GeneralSettingsState;
    setSettings(optimistic);
    setSaving(true);
    setError(null);

    try {
      const dataUpdates = await buildDataUpdates(updates);
      const updatedData = await service.updateSettings(dataUpdates);
      const stats = await service.getStats();
      setSettings(mapToState(updatedData, stats));
    } catch (err) {
      setError("Failed to update settings");
      setSettings(previous);
    } finally {
      setSaving(false);
    }
  };

  const resetToDefaults = async () => {
    try {
      setLoading(true);
      setError(null);
      const defaultData = await service.resetToDefaults();
      const stats = await service.getStats();
      setSettings(mapToState(defaultData, stats));
    } catch (err) {
      setError("Failed to reset settings");
    } finally {
      setLoading(false);
    }
  };

  const refreshSettings = load;

  return {
    settings,
    loading,
    saving,
    error,
    updateSettings,
    resetToDefaults,
    refreshSettings,
  };
}
