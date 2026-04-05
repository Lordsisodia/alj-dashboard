"use client";

import Frame760 from "@/domains/partnerships/_shared/ui/mobile/campus-sidebar/CampusSidebar";
import { MobileNavigationProvider } from "@/domains/partnerships/_shared/shell/application/navigation-store";

export default function SidebarDemoPage() {
  return (
    <MobileNavigationProvider>
      <main className="min-h-screen bg-black text-neutral-50 flex items-center justify-center p-4">
        <Frame760 />
      </main>
    </MobileNavigationProvider>
  );
}
