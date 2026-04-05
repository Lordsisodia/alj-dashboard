import { describe, expect, it } from "vitest";
import { getIndustryClients } from "../get-industry-clients";
import { allClients } from "../../data";
import { getVisibleClients } from "../../selectors";

describe("getIndustryClients", () => {
  it("returns only visible clients for an industry", () => {
    const clients = getIndustryClients("saas" as any, getVisibleClients, allClients);
    expect(clients.every((c) => c.industry === "saas")).toBe(true);
  });
});

