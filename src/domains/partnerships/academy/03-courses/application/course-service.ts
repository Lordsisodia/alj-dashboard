// @ts-nocheck
import { cache } from "react";
import { getRequestBaseUrl } from "@/domains/shared/utils/request-base-url";
import type { Course } from "@/domains/partnerships/academy/03-courses/data/courses";
import { CoursesSchema, type CourseDto } from "./schema";

const COURSES_ENDPOINT = "/data/academy/courses.json";
const REVALIDATE_SECONDS = 60 * 15;

const loadCourses = cache(async (): Promise<Course[]> => {
  const baseUrl = await getRequestBaseUrl();
  const response = await fetch(`${baseUrl}${COURSES_ENDPOINT}`, {
    next: { revalidate: REVALIDATE_SECONDS },
  });

  if (!response.ok) {
    throw new Error(`Failed to fetch academy courses (${response.status})`);
  }

  const json = (await response.json()) as unknown;
  const parsed = CoursesSchema.safeParse(json);
  if (!parsed.success) {
    if (process.env.NODE_ENV !== "production") {
      console.warn("Courses payload failed validation; using raw data", parsed.error);
    }
    return json as CourseDto[];
  }

  return parsed.data as CourseDto[];
});

const sortByOrder = <T extends { order?: number }>(collection: T[]) =>
  [...collection].sort((a, b) => (a.order ?? Number.MAX_SAFE_INTEGER) - (b.order ?? Number.MAX_SAFE_INTEGER));

export type CourseSummary = Pick<
  Course,
  | "id"
  | "title"
  | "overview"
  | "level"
  | "industry"
  | "tags"
  | "duration"
  | "progress"
  | "focus"
  | "legend"
  | "category"
  | "order"
  | "trending"
> & { moduleCount: number };

export type CourseProgramHero = Pick<Course, "id" | "title" | "overview" | "longDescription" | "duration" | "legend">;
export type CourseProgramModule = Pick<Course, "id" | "title" | "overview" | "level" | "duration" | "progress" | "legend">;

export type CourseProgramData = {
  program: CourseProgramHero;
  modules: CourseProgramModule[];
};

export async function getCourseSummaries(): Promise<CourseSummary[]> {
  const courses = await loadCourses();
  const moduleCounts = courses.reduce<Record<string, number>>((counts, course) => {
    if (course.moduleOf) {
      counts[course.moduleOf] = (counts[course.moduleOf] ?? 0) + 1;
    }
    return counts;
  }, {});

  return sortByOrder(courses.filter((course) => !course.moduleOf)).map((course) => {
    const { lessons, longDescription, ...courseDetails } = course;
    // discard lesson + long description fields so CourseSummary stays lean
    void lessons;
    void longDescription;
    return {
      ...courseDetails,
      moduleCount: moduleCounts[course.id] ?? 0,
    };
  });
}

export async function getCourseProgramHero(courseId: string): Promise<CourseProgramHero | null> {
  const courses = await loadCourses();
  const program = courses.find((course) => course.id === courseId && !course.moduleOf);
  if (!program) return null;

  return {
    id: program.id,
    title: program.title,
    overview: program.overview,
    longDescription: program.longDescription,
    duration: program.duration,
    legend: program.legend,
  };
}

export async function getCourseModules(courseId: string): Promise<CourseProgramModule[]> {
  const courses = await loadCourses();
  return sortByOrder(courses.filter((course) => course.moduleOf === courseId)).map((course) => ({
    id: course.id,
    title: course.title,
    overview: course.overview,
    level: course.level,
    duration: course.duration,
    progress: course.progress,
    legend: course.legend,
  }));
}

export async function getCourseProgram(courseId: string): Promise<CourseProgramData | null> {
  const program = await getCourseProgramHero(courseId);
  if (!program) return null;
  const modules = await getCourseModules(courseId);
  return { program, modules };
}
