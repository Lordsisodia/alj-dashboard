import { describe, expect, it } from "vitest";
import { mapCourseSummaries, mapCourseProgram } from "../mappers";

const baseCourse = {
  id: "c1",
  title: "Course 1",
  overview: "Overview",
  longDescription: "Long",
  level: "beginner" as const,
  industry: "saas",
  tags: [],
  duration: "10m",
  progress: 0,
  focus: "focus",
  legend: "legend",
  category: "cat",
  order: 2,
  trending: false,
};

describe("mapCourseSummaries", () => {
  it("sorts by order and counts modules", () => {
    const courses = [
      { ...baseCourse, id: "prog", order: 2 },
      { ...baseCourse, id: "module1", moduleOf: "prog", order: 1 },
      { ...baseCourse, id: "module2", moduleOf: "prog", order: 0 },
      { ...baseCourse, id: "other", order: 1 },
    ];
    const summaries = mapCourseSummaries(courses as any);
    expect(summaries[0].id).toBe("other");
    expect(summaries[1].id).toBe("prog");
    const prog = summaries.find((s) => s.id === "prog");
    expect(prog?.moduleCount).toBe(2);
  });
});

describe("mapCourseProgram", () => {
  it("builds program with sorted modules", () => {
    const courses = [
      { ...baseCourse, id: "prog", order: 2 },
      { ...baseCourse, id: "module1", moduleOf: "prog", order: 2 },
      { ...baseCourse, id: "module0", moduleOf: "prog", order: 0 },
    ];
    const program = mapCourseProgram(courses as any, "prog");
    expect(program?.modules[0].id).toBe("module0");
    expect(program?.modules[1].id).toBe("module1");
  });

  it("returns null when program missing", () => {
    const courses = [{ ...baseCourse, id: "module1", moduleOf: "prog" }];
    expect(mapCourseProgram(courses as any, "prog")).toBeNull();
  });
});

