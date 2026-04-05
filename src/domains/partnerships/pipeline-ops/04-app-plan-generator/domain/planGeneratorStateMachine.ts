export type PlanGenState = "idle" | "collecting" | "generating" | "review" | "error";

export type PlanGenEvent =
  | { type: "START" }
  | { type: "EDIT" }
  | { type: "SUBMIT" }
  | { type: "GENERATED" }
  | { type: "FAIL" }
  | { type: "RESET" };

const allowed: Record<PlanGenState, PlanGenEvent["type"][]> = {
  idle: ["START"],
  collecting: ["EDIT", "SUBMIT", "RESET"],
  generating: ["GENERATED", "FAIL"],
  review: ["EDIT", "RESET"],
  error: ["EDIT", "RESET"],
};

export function transitionPlanGen(state: PlanGenState, event: PlanGenEvent): PlanGenState {
  if (!allowed[state].includes(event.type)) {
    throw new Error(`Invalid transition from ${state} via ${event.type}`);
  }

  switch (event.type) {
    case "START":
      return "collecting";
    case "EDIT":
      return "collecting";
    case "SUBMIT":
      return "generating";
    case "GENERATED":
      return "review";
    case "FAIL":
      return "error";
    case "RESET":
      return "collecting";
    default:
      return state;
  }
}

export function createPlanGenMachine(initial: PlanGenState = "idle") {
  let current = initial;

  return {
    get state() {
      return current;
    },
    send(event: PlanGenEvent) {
      current = transitionPlanGen(current, event);
      return current;
    },
  };
}
