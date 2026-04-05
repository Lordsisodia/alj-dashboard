import type { Course } from "@/domains/partnerships/academy/03-courses/data/courses";

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

const sortByOrder = <T extends { order?: number }>(collection: T[]) =>
  [...collection].sort((a, b) => (a.order ?? Number.MAX_SAFE_INTEGER) - (b.order ?? Number.MAX_SAFE_INTEGER));

export function mapCourseSummaries(courses: Course[]): CourseSummary[] {
  const moduleCounts = courses.reduce<Record<string, number>>((counts, course) => {
    if (course.moduleOf) counts[course.moduleOf] = (counts[course.moduleOf] ?? 0) + 1;
    return counts;
  }, {});

  return sortByOrder(courses.filter((c) => !c.moduleOf)).map((course) => {
    const { lessons, longDescription, ...rest } = course;
    void lessons;
    void longDescription;
    return {
      ...rest,
      moduleCount: moduleCounts[course.id] ?? 0,
    };
  });
}

export function mapCourseProgram(courses: Course[], courseId: string): CourseProgramData | null {
  const program = courses.find((course) => course.id === courseId && !course.moduleOf);
  if (!program) return null;
  const modules = sortByOrder(courses.filter((course) => course.moduleOf === courseId)).map((course) => ({
    id: course.id,
    title: course.title,
    overview: course.overview,
    level: course.level,
    duration: course.duration,
    progress: course.progress,
    legend: course.legend,
  }));

  return {
    program: {
      id: program.id,
      title: program.title,
      overview: program.overview,
      longDescription: program.longDescription,
      duration: program.duration,
      legend: program.legend,
    },
    modules,
  };
}

