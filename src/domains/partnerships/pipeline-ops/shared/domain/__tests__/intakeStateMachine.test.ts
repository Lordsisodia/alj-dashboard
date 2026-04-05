import { describe, expect, it } from "vitest";
import { createIntakeStateMachine, transitionIntakeState } from "../intakeStateMachine";

describe("intake state machine", () => {
  it("progresses through submit happy path", () => {
    const machine = createIntakeStateMachine();

    expect(machine.state).toBe("idle");
    machine.send({ type: "START" });
    expect(machine.state).toBe("editing");
    machine.send({ type: "SUBMIT" });
    expect(machine.state).toBe("submitting");
    machine.send({ type: "RESOLVE" });
    expect(machine.state).toBe("success");
  });

  it("throws on invalid transition", () => {
    expect(() => transitionIntakeState("idle", { type: "RESOLVE" })).toThrow();
  });
});
