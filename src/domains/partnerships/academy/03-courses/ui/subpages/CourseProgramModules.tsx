import { Badge } from "@/components/ui/badge";
import type { CourseProgramModule } from "@/domains/partnerships/academy/03-courses/application/course-service";

function moduleStatus(progress: number) {
  if (progress >= 100) return { label: "Done", tone: "success" as const };
  if (progress > 0) return { label: "In progress", tone: "info" as const };
  return { label: "Not started", tone: "muted" as const };
}

export async function CourseProgramModules({ modulesPromise }: { modulesPromise: Promise<CourseProgramModule[]> }) {
  const modules = await modulesPromise;
  if (!modules.length) {
    return <p className="text-sm text-siso-text-muted">This course’s chapters are being prepared. Check back soon.</p>;
  }

  return (
    <div className="space-y-3">
      {modules.map((mod) => (
        <CourseModuleCard key={mod.id} module={mod} />
      ))}
    </div>
  );
}

function CourseModuleCard({ module }: { module: CourseProgramModule }) {
  const status = moduleStatus(module.progress);
  return (
    <article className="rounded-3xl border border-white/10 bg-white/[0.03] p-4 shadow-[0_14px_35px_rgba(0,0,0,0.35)]">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div className="min-w-0 space-y-1">
          <div className="flex flex-wrap items-center gap-2">
            <span className="rounded-full bg-siso-orange/15 px-2 py-[2px] text-[10px] font-semibold uppercase tracking-[0.25em] text-siso-orange">
              {module.level}
            </span>
            {module.duration ? (
              <Badge className="border-white/20 bg-white/10 text-white/80">{module.duration}</Badge>
            ) : null}
          </div>
          <p className="text-lg font-semibold text-white">{module.title}</p>
          <p className="text-sm text-white/70">{module.overview}</p>
        </div>
        <div className="text-right">
          <p className="text-xs uppercase tracking-[0.35em] text-white/50">{status.label}</p>
          <p className="text-white text-lg font-semibold">{module.progress}%</p>
        </div>
      </div>
    </article>
  );
}

export function CourseModulesSkeleton() {
  return (
    <div className="space-y-3">
      {Array.from({ length: 4 }).map((_, idx) => (
        <div key={idx} className="h-20 rounded-3xl bg-white/5 animate-pulse" />
      ))}
    </div>
  );
}
