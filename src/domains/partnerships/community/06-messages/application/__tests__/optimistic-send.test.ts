import { describe, expect, it, vi } from "vitest";
import { createOptimisticSend } from "../optimistic-send";

describe("createOptimisticSend", () => {
  it("adds optimistic message and allows revert", () => {
    const add = vi.fn();
    const remove = vi.fn();
    const send = createOptimisticSend(add, remove);

    const result = send({ content: "hey" });

    expect(add).toHaveBeenCalledTimes(1);
    expect(result.optimisticMessage.content).toBe("hey");

    result.revert();
    expect(remove).toHaveBeenCalledWith(result.optimisticMessage.id);
  });
});
