export type IntakeState = "idle" | "editing" | "submitting" | "success" | "error";

export type IntakeEvent =
  | { type: "START" }
  | { type: "EDIT" }
  | { type: "SUBMIT" }
  | { type: "RESOLVE" }
  | { type: "FAIL" }
  | { type: "RESET" };

const transitionMap: Record<IntakeState, IntakeEvent["type"][]> = {
  idle: ["START", "EDIT"],
  editing: ["EDIT", "SUBMIT"],
  submitting: ["RESOLVE", "FAIL"],
  success: ["EDIT", "RESET"],
  error: ["EDIT", "RESET", "SUBMIT"],
};

export function transitionIntakeState(state: IntakeState, event: IntakeEvent): IntakeState {
  if (!transitionMap[state].includes(event.type)) {
    throw new Error(`Invalid transition from ${state} via ${event.type}`);
  }

  switch (event.type) {
    case "START":
      return "editing";
    case "EDIT":
      return "editing";
    case "SUBMIT":
      return "submitting";
    case "RESOLVE":
      return "success";
    case "FAIL":
      return "error";
    case "RESET":
      return "editing";
    default:
      return state;
  }
}

export function createIntakeStateMachine(initial: IntakeState = "idle") {
  let current = initial;

  return {
    get state() {
      return current;
    },
    send(event: IntakeEvent) {
      current = transitionIntakeState(current, event);
      return current;
    },
  };
}
