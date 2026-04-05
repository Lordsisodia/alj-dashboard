import type { Profile } from "./schema";

export type ProfileAction =
  | { type: "update"; payload: Partial<Profile> }
  | { type: "replace"; payload: Profile };

export function profileReducer(state: Profile, action: ProfileAction): Profile {
  switch (action.type) {
    case "replace":
      return action.payload;
    case "update":
      return { ...state, ...action.payload };
    default:
      return state;
  }
}
