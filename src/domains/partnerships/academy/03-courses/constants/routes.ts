export const COURSES_ROUTES = {
  hub: "/partners/academy/courses",
  program: (id: string) => `/partners/academy/courses/${id}`,
  lesson: (programId: string, lessonId: string) => `/partners/academy/courses/${programId}/lessons/${lessonId}`,
} as const;

