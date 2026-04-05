// @ts-nocheck
"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { ArrowRight, Bookmark, Filter, Play, Sparkles } from "lucide-react";
import { HighlightCard } from "@/components/ui/card-5-static";
import { Button } from "@/components/ui/button";
import { SettingsGroupCallout } from "@/domains/partnerships/settings/shared/components/SettingsGroupCallout";
import { CustomDropdown } from "@/domains/partnerships/settings/01-general/ui/components/CustomDropdown";
import type { CourseSummary } from "@/domains/partnerships/academy/03-courses/application/course-service";
import { cn } from "@/domains/shared/utils/cn";
import { TierProgressBackdrop } from "@/domains/partnerships/_shared/ui/backgrounds/TierProgressBackdrop";
import { useCourseFilters } from "@/domains/partnerships/academy/03-courses/application/useCourseFilters";
import {
  nestedCardClass,
  secondaryActionButtonClass,
  stackedPanelClass,
} from "@/domains/partnerships/_shared/ui/theme/cardLayers";

const levels = ["all", "beginner", "intermediate", "advanced"] as const;
const statuses = ["all", "not-started", "in-progress", "completed"] as const;

const deriveStatus = (progress: number): "not-started" | "in-progress" | "completed" => {
  if (progress <= 0) return "not-started";
  if (progress >= 100) return "completed";
  return "in-progress";
};

type DerivedCourse = CourseSummary & {
  status: "not-started" | "in-progress" | "completed";
  recommended?: boolean;
  relatedAssets?: { href: string; label: string }[];
};

type CourseCatalogScreenProps = {
  courses: CourseSummary[];
  isLoading?: boolean;
  error?: string | null;
};

function CoursesSkeleton() {
  return (
    <div className="grid gap-6 lg:grid-cols-2">
      {Array.from({ length: 4 }).map((_, idx) => (
        <div key={idx} className={cn("h-44 rounded-2xl bg-white/5", "animate-pulse")} />
      ))}
    </div>
  );
}

export function CourseCatalogScreen({ courses, isLoading = false, error = null }: CourseCatalogScreenProps) {
  const { courses: filteredCourses, levelFilter, statusFilter, setLevelFilter, setStatusFilter } = useCourseFilters(courses);

  return (
    <main className="bg-siso-bg-primary text-siso-text-primary min-h-screen relative overflow-hidden">
      <TierProgressBackdrop />
      <div className="relative z-10 mx-auto flex max-w-6xl flex-col gap-6 px-4 py-10 lg:py-12">
        <div className="relative min-h-[128px]">
          <div className="pointer-events-none absolute inset-y-0 left-3 z-10 flex items-center">
            <Link
              href="/partners/academy"
              aria-label="Back to Academy hub"
              className="pointer-events-auto inline-flex h-8 w-8 items-center justify-center text-white transition hover:text-white/80"
            >
              <ArrowRight className="h-5 w-5 rotate-180" />
            </Link>
          </div>
          <HighlightCard
            color="orange"
            title="Courses catalog"
            description="Stick to the plan with curated learning paths and on-demand lessons."
            icon={<Sparkles className="h-5 w-5 text-siso-orange" />}
            hideDivider
            hideFooter
            titleClassName="uppercase tracking-[0.35em] text-white"
            descriptionClassName="text-sm"
            fullWidth
            className="w-full pl-12"
          />
        </div>

        <FilterControls
          levelFilter={levelFilter}
          statusFilter={statusFilter}
          onLevelChange={setLevelFilter}
          onStatusChange={setStatusFilter}
        />

        {isLoading ? (
          <CoursesSkeleton />
        ) : error ? (
          <div className="rounded-2xl border border-amber-500/40 bg-amber-500/10 p-6 text-center text-amber-100">
            {error}
          </div>
        ) : (
          <div className="grid gap-6 lg:grid-cols-2">
            {filteredCourses.length === 0 ? (
              <div className="col-span-full rounded-2xl border border-white/10 bg-white/5 p-6 text-center text-siso-text-muted">
                No courses match your filters yet.
              </div>
            ) : (
              filteredCourses.map((course) => <CourseCard key={course.id} course={course} />)
            )}
          </div>
        )}
      </div>
    </main>
  );
}

type FilterControlProps = {
  levelFilter: typeof levels[number];
  statusFilter: typeof statuses[number];
  onLevelChange: (value: typeof levels[number]) => void;
  onStatusChange: (value: typeof statuses[number]) => void;
};

function FilterControls({ levelFilter, statusFilter, onLevelChange, onStatusChange }: FilterControlProps) {
  return (
    <SettingsGroupCallout icon={<Filter className="h-4 w-4" />} title="Filter" subtitle="Choose level + status" showChevron={false}>
      <div className={cn(stackedPanelClass, "grid gap-4 md:grid-cols-2 p-4 text-white/85")}>
        <div className="space-y-2">
          <p className="text-xs font-semibold uppercase tracking-[0.3em] text-white/70">Level</p>
          <CustomDropdown
            options={levels.map((level) => ({ label: level, value: level }))}
            value={levelFilter}
            onChange={(value) => onLevelChange((value as typeof levels[number]) ?? "all")}
            searchable={false}
            allowCustom={false}
          />
        </div>
        <div className="space-y-2">
          <p className="text-xs font-semibold uppercase tracking-[0.3em] text-white/70">Status</p>
          <CustomDropdown
            options={statuses.map((status) => ({ label: status, value: status }))}
            value={statusFilter}
            onChange={(value) => onStatusChange((value as typeof statuses[number]) ?? "all")}
            searchable={false}
            allowCustom={false}
          />
        </div>
      </div>
    </SettingsGroupCallout>
  );
}

function CourseCard({ course }: { course: DerivedCourse }) {
  const levelLabel = course.level[0].toUpperCase() + course.level.slice(1);
  return (
    <article className={cn(stackedPanelClass, "flex flex-col gap-4 p-6 text-white/85")}>
      <header className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <p className="text-[11px] uppercase tracking-[0.35em] text-siso-text-muted">
            {levelLabel} • {course.industry}
          </p>
          <h3 className="mt-2 text-xl font-semibold text-white">{course.title}</h3>
          <p className="text-sm text-siso-text-muted">{course.overview}</p>
        </div>
        <div className="text-xs text-siso-text-muted text-right">
          <p>{course.duration}</p>
          {course.recommended ? <p className="text-siso-orange">Recommended</p> : null}
        </div>
      </header>

      <div className="h-2.5 rounded-full bg-white/5">
        <div
          className={cn("h-full rounded-full", course.progress >= 100 ? "bg-emerald-400" : "bg-siso-orange")}
          style={{ width: `${course.progress}%` }}
        />
      </div>
      <p className="text-xs text-siso-text-muted">{course.progress}% complete • {course.legend}</p>

      <div className="flex flex-wrap items-center gap-2 text-[11px] text-siso-text-muted">
        <span className="inline-flex items-center gap-1 text-white/70">
          <Sparkles className="h-3.5 w-3.5 text-siso-orange" /> {course.status.replace("-", " ")}
        </span>
        {course.tags?.slice(0, 2).map((tag) => (
          <span key={tag}>#{tag}</span>
        ))}
      </div>

      <div className="flex flex-wrap items-center gap-2">
        <Button
          asChild
          variant="secondary"
          size="sm"
          className={cn(secondaryActionButtonClass, "rounded-2xl border-white/25 text-xs text-white/90 hover:text-white")}
        >
          <Link href={`/partners/academy/courses/${course.id}`} className="inline-flex items-center gap-1">
            <Play className="h-3.5 w-3.5" /> Start
          </Link>
        </Button>
        <Button
          asChild
          variant="secondary"
          size="sm"
          className={cn(secondaryActionButtonClass, "rounded-2xl border-white/25 text-xs text-white/90 hover:text-white")}
        >
          <Link href={`/partners/academy/saved?add=${course.id}`} className="inline-flex items-center gap-1">
            <Bookmark className="h-4 w-4" /> Save
          </Link>
        </Button>
      </div>

      <div className="flex flex-wrap gap-2 text-[11px]">
        {(course.relatedAssets ?? []).map((asset) => (
          <Link
            key={asset.href}
            href={asset.href}
            className={cn(nestedCardClass, "inline-flex items-center gap-1 border-white/20 px-3 py-1 text-siso-text-muted")}
          >
            <ArrowRight className="h-3 w-3" /> {asset.label}
          </Link>
        ))}
      </div>
    </article>
  );
}
