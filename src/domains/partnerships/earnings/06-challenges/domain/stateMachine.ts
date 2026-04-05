export type ChallengeState = "idle" | "enrolled" | "in_progress" | "completed" | "failed";

export type ChallengeEvent =
  | { type: "ENROLL" }
  | { type: "START" }
  | { type: "PROGRESS" }
  | { type: "COMPLETE" }
  | { type: "FAIL" }
  | { type: "RESET" };

const transitions: Record<ChallengeState, ChallengeEvent["type"][]> = {
  idle: ["ENROLL"],
  enrolled: ["START", "RESET"],
  in_progress: ["PROGRESS", "COMPLETE", "FAIL", "RESET"],
  completed: ["RESET"],
  failed: ["RESET"],
};

export function transitionChallenge(state: ChallengeState, event: ChallengeEvent): ChallengeState {
  if (!transitions[state].includes(event.type)) {
    throw new Error(`Invalid transition from ${state} via ${event.type}`);
  }

  switch (event.type) {
    case "ENROLL":
      return "enrolled";
    case "START":
      return "in_progress";
    case "PROGRESS":
      return "in_progress";
    case "COMPLETE":
      return "completed";
    case "FAIL":
      return "failed";
    case "RESET":
      return "idle";
    default:
      return state;
  }
}

export function createChallengeMachine(initial: ChallengeState = "idle") {
  let current = initial;
  return {
    get state() {
      return current;
    },
    send(event: ChallengeEvent) {
      current = transitionChallenge(current, event);
      return current;
    },
  };
}
