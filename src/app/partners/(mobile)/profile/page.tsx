import { LazyMobileShell } from "@/domains/partnerships/_shared/shell/ui/LazyShell";
import type { QuickActionId } from "@/domains/partnerships/_shared/shell/types/navigation";

export default function PartnersProfilePage() {
  return (
    <LazyMobileShell initialTab="quick-actions" initialQuickAction={"profile" as QuickActionId} />
  );
}
