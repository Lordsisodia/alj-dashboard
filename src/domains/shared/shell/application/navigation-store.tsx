"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
  type ReactNode,
} from "react";
import type { MobileTabId, NavigationState, QuickActionId } from "../types/navigation";
import { getTabForPath } from "./route-map";

interface NavigationContextValue extends NavigationState {
  setActiveTab: (tab: MobileTabId, options?: { immersive?: boolean }) => void;
  toggleQuickActions: (action: QuickActionId) => void;
  closeQuickActions: () => void;
  launchQuickAction: (action: QuickActionId) => void;
  openQuickActionsWith: (actions: QuickActionId[]) => void;
  openDrawer: () => void;
  closeDrawer: () => void;
  setImmersiveMode: (isImmersive: boolean) => void;
  selectQuickAction: (action: QuickActionId) => void;
  setActiveDrawerSection: (section: string) => void;
}

const defaultState: NavigationState = {
  activeTab: "campus",
  previousTab: "campus",
  isQuickActionsOpen: false,
  isDrawerOpen: false,
  activeQuickAction: null,
  contextualQuickActions: [],
  isImmersiveMode: false,
  activeDrawerSection: "home",
};

const STORAGE_KEY = "siso-partners-mobile-nav";

const NavigationContext = createContext<NavigationContextValue | undefined>(undefined);

function sanitizeState(state: Partial<NavigationState> | null | undefined): NavigationState | null {
  if (!state) return null;
  return {
    ...defaultState,
    ...state,
    activeTab: state.activeTab ?? defaultState.activeTab,
    previousTab: state.previousTab ?? defaultState.previousTab,
    activeDrawerSection: state.activeDrawerSection ?? defaultState.activeDrawerSection,
    contextualQuickActions: state.contextualQuickActions ?? defaultState.contextualQuickActions,
  };
}

function readStoredState(): NavigationState | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = window.sessionStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    return sanitizeState(JSON.parse(raw));
  } catch (error) {
    if (process.env.NODE_ENV !== "production") {
      console.warn("Failed to parse stored mobile nav state", error);
    }
    return null;
  }
}

function inferTabFromLocation(): MobileTabId {
  if (typeof window === "undefined") return defaultState.activeTab;
  try {
    return getTabForPath(window.location.pathname);
  } catch {
    return defaultState.activeTab;
  }
}

function persistState(state: NavigationState) {
  if (typeof window === "undefined") return;
  try {
    window.sessionStorage.setItem(
      STORAGE_KEY,
      JSON.stringify({
        ...state,
        // Avoid persisting transient values that would cause loops
        contextualQuickActions: state.contextualQuickActions ?? [],
      }),
    );
  } catch (error) {
    if (process.env.NODE_ENV !== "production") {
      console.warn("Failed to persist mobile nav state", error);
    }
  }
}

export function MobileNavigationProvider({ children, initialState }: { children: ReactNode; initialState?: Partial<NavigationState> }) {
  const [state, setState] = useState<NavigationState>(() => {
    const stored = readStoredState();
    if (stored) return stored;
    const inferred = inferTabFromLocation();
    return {
      ...defaultState,
      ...initialState,
      activeTab: inferred,
      previousTab: inferred,
    };
  });

  useEffect(() => {
    persistState(state);
  }, [state]);

  const setActiveTab = useCallback((tab: MobileTabId, options?: { immersive?: boolean }) => {
    setState((prev) => ({
      ...prev,
      activeTab: tab,
      previousTab: prev.activeTab,
      isQuickActionsOpen: false,
      isDrawerOpen: tab === "campus" ? prev.isDrawerOpen : false,
      activeQuickAction: tab === "quick-actions" ? prev.activeQuickAction : null,
      isImmersiveMode: options?.immersive ?? false,
    }));
  }, []);

  const toggleQuickActions = useCallback((action: QuickActionId) => {
    setState((prev) => {
      const opening = !prev.isQuickActionsOpen || prev.activeQuickAction !== action;
      return {
        ...prev,
        isQuickActionsOpen: opening,
        activeQuickAction: opening ? action : null,
      };
    });
  }, []);

  const closeQuickActions = useCallback(() => {
    setState((prev) => ({
      ...prev,
      isQuickActionsOpen: false,
      activeQuickAction: null,
      contextualQuickActions: [],
    }));
  }, []);

  const launchQuickAction = useCallback((action: QuickActionId) => {
    setState((prev) => ({
      ...prev,
      activeTab: "quick-actions",
      previousTab: prev.activeTab,
      isQuickActionsOpen: false,
      activeQuickAction: action,
      isDrawerOpen: false,
      isImmersiveMode: false,
    }));
  }, []);

  const selectQuickAction = useCallback((action: QuickActionId) => {
    setState((prev) => ({
      ...prev,
      activeQuickAction: action,
    }));
  }, []);

  const openQuickActionsWith = useCallback((actions: QuickActionId[]) => {
    setState((prev) => ({
      ...prev,
      isQuickActionsOpen: true,
      contextualQuickActions: actions,
      activeQuickAction: actions[0] ?? null,
    }));
  }, []);

  const openDrawer = useCallback(() => {
    setState((prev) => ({
      ...prev,
      isDrawerOpen: true,
      isImmersiveMode: true,
    }));
  }, []);

  const closeDrawer = useCallback(() => {
    setState((prev) => ({
      ...prev,
      isDrawerOpen: false,
      isImmersiveMode: false,
    }));
  }, []);

  const setImmersiveMode = useCallback((isImmersive: boolean) => {
    setState((prev) => ({
      ...prev,
      isImmersiveMode: isImmersive,
    }));
  }, []);

  const setActiveDrawerSection = useCallback((section: string) => {
    setState((prev) => ({
      ...prev,
      activeDrawerSection: section,
    }));
  }, []);

  const value = useMemo<NavigationContextValue>(() => ({
    ...state,
    setActiveTab,
    toggleQuickActions,
    closeQuickActions,
    launchQuickAction,
    openQuickActionsWith,
    openDrawer,
    closeDrawer,
    setImmersiveMode,
    selectQuickAction,
    setActiveDrawerSection,
  }), [state, setActiveTab, toggleQuickActions, closeQuickActions, launchQuickAction, openQuickActionsWith, openDrawer, closeDrawer, setImmersiveMode, selectQuickAction, setActiveDrawerSection]);

  return <NavigationContext.Provider value={value}>{children}</NavigationContext.Provider>;
}

export function useMobileNavigation(): NavigationContextValue {
  const context = useContext(NavigationContext);
  if (!context) {
    throw new Error("useMobileNavigation must be used within MobileNavigationProvider");
  }
  return context;
}
