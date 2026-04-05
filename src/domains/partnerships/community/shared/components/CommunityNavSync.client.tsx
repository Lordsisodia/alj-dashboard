"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";
import { useMobileNavigation } from "@/domains/partnerships/_shared/shell/application/navigation-store";
import { getTabForPath } from "@/domains/partnerships/_shared/shell/application/route-map";
import type { NavigationState } from "@/domains/partnerships/_shared/shell/types/navigation";

export function CommunityNavSync({ initialState }: { initialState?: Partial<NavigationState> }) {
  const { setActiveDrawerSection, setActiveTab } = useMobileNavigation();
  const pathname = usePathname();

  useEffect(() => {
    if (!pathname) return;
    const drawer = initialState?.activeDrawerSection ?? "community";
    const tab = initialState?.activeTab ?? getTabForPath(pathname);
    setActiveDrawerSection(drawer);
    setActiveTab(tab, { immersive: tab === "messages" });
  }, [pathname, initialState?.activeDrawerSection, initialState?.activeTab, setActiveDrawerSection, setActiveTab]);

  return null;
}
