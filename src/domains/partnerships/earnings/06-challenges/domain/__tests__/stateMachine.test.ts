// @vitest-environment node
import { describe, expect, it } from "vitest";
import { createChallengeMachine, transitionChallenge } from "../stateMachine";

describe("challenge state machine", () => {
  it("walks happy path", () => {
    const machine = createChallengeMachine();
    expect(machine.state).toBe("idle");
    machine.send({ type: "ENROLL" });
    machine.send({ type: "START" });
    machine.send({ type: "PROGRESS" });
    machine.send({ type: "COMPLETE" });
    expect(machine.state).toBe("completed");
  });

  it("fails invalid transition", () => {
    expect(() => transitionChallenge("idle", { type: "COMPLETE" })).toThrow();
  });

  it("resets from failed", () => {
    const machine = createChallengeMachine("failed");
    machine.send({ type: "RESET" });
    expect(machine.state).toBe("idle");
  });
});
