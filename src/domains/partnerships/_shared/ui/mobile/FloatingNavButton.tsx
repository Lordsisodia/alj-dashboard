"use client";

import { useEffect, useMemo, useState } from "react";
import { Menu as MenuIcon } from "lucide-react";
import { useMobileNavigation } from "@/domains/partnerships/_shared/shell/application/navigation-store";
import { cn } from "@/domains/shared/utils/cn";
import { usePathname } from "next/navigation";

const floatingNavHiddenPrefixes = [
  "/partners/community/channels/general-chat",
  "/partners/community/channels/wins",
  "/partners/community/announcements",
] as const;

function useFloatingNavHiddenFlag() {
  const getHidden = () => {
    if (typeof document === "undefined") return false;
    return document.documentElement.dataset.hideFloatingNavButton === "true";
  };

  const [hidden, setHidden] = useState(getHidden);

  useEffect(() => {
    if (typeof document === "undefined") return undefined;
    const root = document.documentElement;
    const update = () => setHidden(root.dataset.hideFloatingNavButton === "true");
    update();
    if (typeof MutationObserver === "undefined") {
      return undefined;
    }
    const observer = new MutationObserver(update);
    observer.observe(root, { attributes: true, attributeFilter: ["data-hide-floating-nav-button"] });
    return () => observer.disconnect();
  }, []);

  return hidden;
}

export function FloatingNavButton({ className }: { className?: string }) {
  const { openDrawer, isDrawerOpen } = useMobileNavigation();
  const pathname = usePathname();
  const hidden = useFloatingNavHiddenFlag();
  const hideForPath = useMemo(() => {
    if (!pathname) return false;
    return floatingNavHiddenPrefixes.some((prefix) => pathname.startsWith(prefix));
  }, [pathname]);
  if (hidden || hideForPath) {
    return null;
  }
  return (
    <button
      type="button"
      onClick={openDrawer}
      aria-label="Open navigation"
      aria-expanded={isDrawerOpen}
      aria-controls="campus-drawer"
      data-floating-nav-button="true"
      className={cn(
        "fixed right-5 top-6 inline-flex h-10 w-10 items-center justify-center rounded-2xl border border-white/40 bg-black/50 text-white shadow-lg backdrop-blur transition hover:border-white hover:bg-black/70 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/70 pointer-events-auto z-[999] lg:hidden",
        className,
      )}
    >
      <MenuIcon className="h-5 w-5" />
    </button>
  );
}
