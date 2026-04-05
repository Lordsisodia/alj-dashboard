import { describe, expect, it } from "vitest";
import { CoursesSchema } from "../schema";

const sample = {
  id: "course-1",
  title: "Intro",
  overview: "Overview",
  level: "beginner",
  industry: "saas",
  tags: ["tag"],
  duration: "10m",
  progress: 0,
};

describe("CoursesSchema", () => {
  it("parses valid course array", () => {
    const parsed = CoursesSchema.safeParse([sample]);
    expect(parsed.success).toBe(true);
  });

  it("fails on invalid level", () => {
    const parsed = CoursesSchema.safeParse([{ ...sample, level: "expert" }]);
    expect(parsed.success).toBe(false);
  });
});

