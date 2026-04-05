import { Suspense } from "react";
import { notFound } from "next/navigation";
import { CourseProgramAboveFold } from "./CourseProgramAboveFold";
import { CourseModulesSkeleton, CourseProgramModules } from "./CourseProgramModules";

import type { CourseProgramHero, CourseProgramModule } from "@/domains/partnerships/academy/03-courses/application/course-service";

type CourseProgramScreenProps = {
  program: CourseProgramHero;
  modulesPromise: Promise<CourseProgramModule[]>;
};

export function CourseProgramScreen({ program, modulesPromise }: CourseProgramScreenProps) {
  if (!program) return notFound();

  return (
    <main className="relative min-h-screen bg-siso-bg-primary text-siso-text-primary overflow-hidden">
      <div
        className="pointer-events-none absolute inset-0 z-0"
        style={{
          opacity: 0.82,
          background:
            "radial-gradient(circle at 18% 22%, rgba(248,167,92,0.12), transparent 34%), radial-gradient(circle at 78% 4%, rgba(255,255,255,0.05), transparent 30%), linear-gradient(135deg, #0b0b0f, #101018)",
        }}
      >
        <span className="sr-only">Decorative gradient background</span>
      </div>

      <div className="relative z-10 mx-auto flex max-w-6xl flex-col gap-6 px-4 py-10 lg:py-12">
        <CourseProgramAboveFold program={program} />
        <Suspense fallback={<CourseModulesSkeleton />}>
          <CourseProgramModules modulesPromise={modulesPromise} />
        </Suspense>
      </div>
    </main>
  );
}
