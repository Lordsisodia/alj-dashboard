export type LoadState = "idle" | "loading" | "empty" | "error" | "ready";

export function deriveState<T>(items: T[] | undefined, isLoading: boolean, error?: unknown): LoadState {
  if (isLoading) return "loading";
  if (error) return "error";
  if (!items || items.length === 0) return "empty";
  return "ready";
}
