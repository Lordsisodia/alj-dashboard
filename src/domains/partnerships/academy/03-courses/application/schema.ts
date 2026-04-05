import { z } from "zod";

export const CourseSchema = z.object({
  id: z.string(),
  title: z.string(),
  overview: z.string(),
  longDescription: z.string().optional(),
  level: z.enum(["beginner", "intermediate", "advanced"]),
  industry: z.string().optional(),
  tags: z.array(z.string()).optional().default([]),
  duration: z.string().optional(),
  progress: z.number().optional().default(0),
  focus: z.string().optional(),
  legend: z.string().optional(),
  category: z.string().optional(),
  order: z.number().optional(),
  trending: z.boolean().optional().default(false),
  moduleOf: z.string().optional(),
  lessons: z.array(z.any()).optional(),
});

export const CoursesSchema = z.array(CourseSchema);

export type CourseDto = z.infer<typeof CourseSchema>;

