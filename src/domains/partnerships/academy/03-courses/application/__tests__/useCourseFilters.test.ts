import { renderHook, act } from "@testing-library/react";
import { useCourseFilters } from "../useCourseFilters";

const sampleCourses = [
  { id: "c1", title: "Beginner", overview: "Intro", level: "beginner", progress: 0, tags: ["start"] },
  { id: "c2", title: "Advanced", overview: "Deep", level: "advanced", progress: 100, tags: ["pro"] },
] as any;

describe("useCourseFilters", () => {
  it("filters by level and status and search", () => {
    const { result } = renderHook(() => useCourseFilters(sampleCourses));
    expect(result.current.courses.length).toBe(2);

    act(() => result.current.setLevelFilter("advanced"));
    expect(result.current.courses.map((c) => c.id)).toEqual(["c2"]);

    act(() => result.current.setStatusFilter("not-started"));
    expect(result.current.courses).toHaveLength(0);

    act(() => {
      result.current.setLevelFilter("all");
      result.current.setStatusFilter("all");
      result.current.setSearch("intro");
    });
    expect(result.current.courses.map((c) => c.id)).toEqual(["c1"]);
  });
});

