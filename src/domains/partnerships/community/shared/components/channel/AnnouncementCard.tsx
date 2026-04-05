import { AlertCircle } from "lucide-react";
import { cn } from "@/lib/utils";
import { stackedPanelClass } from "@/domains/partnerships/_shared/ui/theme/cardLayers";

export const AnnouncementCard = ({ title, body, pill }: { title: string; body: string; pill?: string }) => (
  <div className={cn(stackedPanelClass, "bg-gradient-to-r from-siso-red/10 via-siso-orange/10 to-transparent p-5 text-white")}>
    <div className="flex items-center gap-2 text-sm font-semibold uppercase text-siso-orange">
      <AlertCircle className="h-4 w-4" />
      {pill || "Heads up"}
    </div>
    <h2 className="mt-2 text-xl font-semibold">{title}</h2>
    <p className="text-sm text-siso-text-secondary">{body}</p>
  </div>
);
