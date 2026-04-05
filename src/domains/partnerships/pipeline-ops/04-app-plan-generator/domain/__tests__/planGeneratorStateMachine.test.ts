import { describe, expect, it } from "vitest";
import { createPlanGenMachine, transitionPlanGen } from "../planGeneratorStateMachine";

describe("plan generator state machine", () => {
  it("walks happy path", () => {
    const machine = createPlanGenMachine();
    expect(machine.state).toBe("idle");
    machine.send({ type: "START" });
    machine.send({ type: "SUBMIT" });
    machine.send({ type: "GENERATED" });
    expect(machine.state).toBe("review");
  });

  it("handles failure and reset", () => {
    const machine = createPlanGenMachine("collecting");
    machine.send({ type: "SUBMIT" });
    machine.send({ type: "FAIL" });
    expect(machine.state).toBe("error");
    machine.send({ type: "RESET" });
    expect(machine.state).toBe("collecting");
  });

  it("rejects invalid transition", () => {
    expect(() => transitionPlanGen("idle", { type: "GENERATED" })).toThrow();
  });
});
