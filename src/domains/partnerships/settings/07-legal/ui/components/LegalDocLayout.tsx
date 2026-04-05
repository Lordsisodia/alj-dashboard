import type { ReactNode } from "react";
import Link from "next/link";
import { ChevronLeft, FileText } from "lucide-react";
import { SettingsDetailLayout } from "@/domains/partnerships/settings/shared/components/SettingsDetailLayout";
import { HighlightCard } from "@/components/ui/card-5-static";
import { LEGAL_ROUTES } from "@/domains/partnerships/settings/07-legal/domain/routes";

type LegalDocLayoutProps = {
  title: string;
  description?: string;
  children: ReactNode;
};

export function LegalDocLayout({ title, description, children }: LegalDocLayoutProps) {
  return (
    <SettingsDetailLayout title="" description="" wrapContent={false} backHref={null} hideHeader showBackground>
      <div className="space-y-4 pb-32 text-siso-text-primary">
        <div className="relative">
          <div className="pointer-events-none absolute inset-y-0 left-5 z-10 flex items-center">
            <Link
              href={LEGAL_ROUTES.base}
              className="pointer-events-auto inline-flex h-8 w-8 items-center justify-center text-white transition hover:text-white/80"
              aria-label="Back to legal settings"
            >
              <ChevronLeft className="h-5 w-5" />
            </Link>
          </div>
          <HighlightCard
            color="orange"
            className="w-full max-w-none pl-12 text-left"
            title={title}
            description={description ?? "Review the current policy and obligations."}
            hideDivider
            hideFooter
            titleClassName="uppercase tracking-[0.35em] font-semibold text-[26px] leading-[1.2]"
            descriptionClassName="text-xs"
            icon={<FileText className="h-5 w-5" />}
            metricValue=""
            metricLabel=""
            buttonText=""
            fullWidth
          />
        </div>

        <div className="rounded-3xl border border-siso-border bg-siso-bg-secondary/60 p-4 text-sm text-siso-text-muted">
          {children}
        </div>
      </div>
    </SettingsDetailLayout>
  );
}

export default LegalDocLayout;
