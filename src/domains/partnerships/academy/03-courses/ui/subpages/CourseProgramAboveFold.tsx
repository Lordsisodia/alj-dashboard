import { ArrowLeft, Clock, Sparkles } from "lucide-react";
import Link from "next/link";
import { HighlightCard } from "@/components/ui/card-5-static";
import { cn } from "@/domains/shared/utils/cn";
import type { CourseProgramHero } from "@/domains/partnerships/academy/03-courses/application/course-service";

export function CourseProgramAboveFold({ program }: { program: CourseProgramHero }) {
  return (
    <div className="relative min-h-[128px]">
      <div className="pointer-events-none absolute inset-y-0 left-3 z-10 flex items-center">
        <Link
          href="/partners/academy/courses"
          className="pointer-events-auto inline-flex h-8 w-8 items-center justify-center text-white transition hover:text-white/80"
          aria-label="Back to catalog"
        >
          <ArrowLeft className="h-5 w-5" />
        </Link>
      </div>
      <HighlightCard
        color="orange"
        title={program.title}
        description={program.longDescription ?? program.overview}
        icon={<Sparkles className="h-5 w-5 text-siso-orange" />}
        hideDivider
        className="pl-12"
        titleClassName="uppercase tracking-[0.3em] text-white"
        descriptionClassName="text-sm"
      >
        <div className="flex flex-wrap items-center gap-2 text-[11px] uppercase tracking-[0.3em] text-white/70">
          <span className="inline-flex items-center gap-1 rounded-full border border-white/10 bg-white/5 px-3 py-1">
            <Clock className="h-3.5 w-3.5" />
            {program.duration}
          </span>
          {program.legend ? (
            <span className="inline-flex items-center gap-1 rounded-full border border-white/10 bg-white/5 px-3 py-1">
              {program.legend}
            </span>
          ) : null}
        </div>
      </HighlightCard>
    </div>
  );
}
