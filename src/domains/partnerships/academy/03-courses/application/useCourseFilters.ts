import { useMemo, useState } from "react";
import type { CourseSummary } from "./course-service";

export type CourseLevel = "all" | "beginner" | "intermediate" | "advanced";
export type CourseStatus = "all" | "not-started" | "in-progress" | "completed";

const deriveStatus = (progress: number): CourseStatus => {
  if (progress <= 0) return "not-started";
  if (progress >= 100) return "completed";
  return "in-progress";
};

export function useCourseFilters(courses: CourseSummary[]) {
  const [levelFilter, setLevelFilter] = useState<CourseLevel>("all");
  const [statusFilter, setStatusFilter] = useState<CourseStatus>("all");
  const [search, setSearch] = useState<string>("");

  const derived = useMemo(
    () =>
      courses.map((course) => ({
        ...course,
        status: deriveStatus(course.progress),
      })),
    [courses],
  );

  const filtered = useMemo(
    () =>
      derived.filter((course) => {
        const matchesLevel = levelFilter === "all" || course.level === levelFilter;
        const matchesStatus = statusFilter === "all" || course.status === statusFilter;
        const matchesSearch =
          !search ||
          course.title.toLowerCase().includes(search.toLowerCase()) ||
          course.overview.toLowerCase().includes(search.toLowerCase()) ||
          course.tags?.some((tag) => tag.toLowerCase().includes(search.toLowerCase()));
        return matchesLevel && matchesStatus && matchesSearch;
      }),
    [derived, levelFilter, statusFilter, search],
  );

  return {
    levelFilter,
    statusFilter,
    search,
    setLevelFilter,
    setStatusFilter,
    setSearch,
    courses: filtered,
  };
}

