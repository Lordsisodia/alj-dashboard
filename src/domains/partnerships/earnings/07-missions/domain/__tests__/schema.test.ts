// @vitest-environment node
import { describe, expect, it } from "vitest";
import { missions } from "../../data/missions";
import { MissionSchema, parseMissions } from "../schema";

describe("missions schema", () => {
  it("parses missions", () => {
    const parsed = parseMissions(missions);
    expect(parsed[0].status).toBe("active");
  });

  it("rejects missing steps", () => {
    const bad = { ...missions[0], steps: [] } as unknown;
    expect(() => MissionSchema.parse(bad)).toThrow();
  });
});
