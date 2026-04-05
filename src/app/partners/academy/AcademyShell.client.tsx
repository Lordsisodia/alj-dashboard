"use client";

import { useEffect } from "react";
import { MobileShell } from "@/domains/partnerships/_shared/shell/ui/Shell";
import { useMobileNavigation } from "@/domains/partnerships/_shared/shell/application/navigation-store";

export function AcademyShell() {
  const { setActiveDrawerSection } = useMobileNavigation();

  useEffect(() => {
    // Ensure the burger drawer loads the Academy nav instead of default "Explore"
    setActiveDrawerSection("academy");
  }, [setActiveDrawerSection]);

  return <MobileShell initialTab="learning" renderViewportContent={() => null} />;
}
