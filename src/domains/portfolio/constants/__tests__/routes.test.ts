import { describe, it, expect } from "vitest";
import { PORTFOLIO_ROUTES } from "../routes";

describe("PORTFOLIO_ROUTES", () => {
  it("builds public industry route", () => {
    expect(PORTFOLIO_ROUTES.publicIndustry("saas")).toBe("/portfolio/saas");
  });

  it("builds public client route with industry prefix", () => {
    expect(PORTFOLIO_ROUTES.publicClient("saas", "client-1")).toBe("/portfolio/saas/client-1");
  });

  it("provides portfolio fallback", () => {
    expect(PORTFOLIO_ROUTES.fallback).toBe("/portfolio");
  });
});
