import type { ReactNode } from "react";
import { LazyMobileShell } from "@/domains/partnerships/_shared/shell/ui/LazyShell";

export default function PartnersMobileLayout({ children }: { children: ReactNode }) {
  return <LazyMobileShell>{children}</LazyMobileShell>;
}
