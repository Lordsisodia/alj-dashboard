import { describe, expect, it } from "vitest";
import { recruitmentProspects } from "../../data/prospects";
import {
  ProspectTaskSchema,
  RecruitmentProspectSchema,
  parseRecruitmentProspects,
} from "../schema";

describe("recruitment prospects schema", () => {
  it("parses seeded prospects", () => {
    const parsed = parseRecruitmentProspects(recruitmentProspects);
    expect(parsed).toHaveLength(4);
    expect(parsed[0].tasks[0].complete).toBe(false);
  });

  it("rejects invalid progress range", () => {
    const bad = { ...recruitmentProspects[0], progress: 2 } as unknown;
    expect(() => RecruitmentProspectSchema.parse(bad)).toThrow();
  });

  it("rejects unknown task owner type", () => {
    const badTask = { id: "x", title: "", due: "", owner: 123, complete: false } as unknown;
    expect(() => ProspectTaskSchema.parse(badTask)).toThrow();
  });
});
