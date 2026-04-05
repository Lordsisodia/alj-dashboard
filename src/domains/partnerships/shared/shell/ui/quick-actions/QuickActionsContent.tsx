"use client";

import dynamic from "next/dynamic";
import Loader from "@/domains/partnerships/settings/shared/ui/shared/loader-15";
import { Suspense, useEffect, useMemo, type ReactNode } from "react";
import { useMobileNavigation } from "../../application/navigation-store";
import { settingsRouteRegistry } from "@/domains/partnerships/settings/shared/navigation/routing/settings-route-registry";
const Loading = () => <Loader />;

const ComingSoonView = dynamic(
  () => import("@/domains/partnerships/settings/shared/components/ComingSoonView"),
  { loading: Loading },
);

const SettingsPanel = dynamic(
  () => import("@/domains/partnerships/settings/shared/navigation/menu/SettingsPanel").then(m => m.SettingsPanel),
  { loading: Loading },
);
const WalletPanel = dynamic(
  () => import("@/domains/partnerships/earnings/02-wallet/ui/components/WalletPanel").then((m) => ({ default: m.WalletPanel })),
  { loading: Loading },
);

export function QuickActionsContent() {
  const { activeQuickAction } = useMobileNavigation();
  const target = useMemo(
    () => settingsRouteRegistry.find((r) => r.quickActionId === activeQuickAction),
    [activeQuickAction],
  );

  const renderDeferred = (node: ReactNode) => (
    <Suspense fallback={<Loading />}>
      {node}
    </Suspense>
  );

  // Gentle prefetch for most-used settings when the hub is open
  useEffect(() => {
    if (activeQuickAction !== "settings") return;
    const handle = window.setTimeout(() => {
      void Promise.allSettled([
        import("@/domains/partnerships/settings/02-my-account/ui/screens/AccountSettingsView"),
        import("@/domains/partnerships/settings/03-profile/ui/screens/ProfileSettingsView"),
      ]);
    }, 300);
    return () => window.clearTimeout(handle);
  }, [activeQuickAction]);

  // Non-settings quick actions remain as adapters
  if (activeQuickAction === "wallet") return renderDeferred(<WalletPanel />);
  if (!activeQuickAction || activeQuickAction === "settings") return renderDeferred(<SettingsPanel />);

  if (!target) return <SettingsPanel />;

  if (target.status === "planned" || !target.component) {
    return renderDeferred(<ComingSoonView title={target.title} description={target.description} />);
  }

  const LazyResolved = dynamic(async () => {
    const mod = await target.component!();
    return mod;
  }, { loading: Loading });

  return renderDeferred(<LazyResolved />);
}
