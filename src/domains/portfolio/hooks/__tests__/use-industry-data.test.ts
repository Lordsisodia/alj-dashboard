// @vitest-environment jsdom
import { renderHook } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { useIndustryData } from "../use-industry-data";
import { PORTFOLIO_ROUTES } from "../../constants";

const mockReplace = vi.fn();
const mockUseParams = vi.fn();
const mockGetIndustryBySlug = vi.fn();
const mockGetIndustryClients = vi.fn();
const mockGetVisibleClients = vi.fn();

vi.mock("next/navigation", () => ({
  useParams: () => mockUseParams(),
  useRouter: () => ({ replace: mockReplace }),
}));

vi.mock("../../data", () => ({
  getIndustryBySlug: (...args: unknown[]) => mockGetIndustryBySlug(...args),
}));

vi.mock("../../lib", () => ({
  getIndustryClients: (...args: unknown[]) => mockGetIndustryClients(...args),
}));

vi.mock("../../selectors", () => ({
  getVisibleClients: (...args: unknown[]) => mockGetVisibleClients(...args),
}));

describe("useIndustryData", () => {
  beforeEach(() => {
    mockReplace.mockReset();
    mockUseParams.mockReset();
    mockGetIndustryBySlug.mockReset();
    mockGetIndustryClients.mockReset();
    mockGetVisibleClients.mockReset();
  });

  it("returns industry and filtered clients when slug valid", () => {
    const industry = { id: "saas", slug: "saas", name: "SaaS" } as any;
    const clients = [{ id: "1" }] as any;
    mockUseParams.mockReturnValue({ industry: "saas" });
    mockGetIndustryBySlug.mockReturnValue(industry);
    mockGetIndustryClients.mockReturnValue(clients);
    mockGetVisibleClients.mockImplementation((list: any[]) => list);

    const { result } = renderHook(() => useIndustryData());

    expect(result.current.industry).toBe(industry);
    expect(result.current.clients).toEqual(clients);
    expect(mockReplace).not.toHaveBeenCalled();
  });

  it("redirects to fallback when industry missing", () => {
    mockUseParams.mockReturnValue({ industry: "missing" });
    mockGetIndustryBySlug.mockReturnValue(null);

    const { result } = renderHook(() => useIndustryData());

    expect(result.current.industry).toBeNull();
    expect(result.current.clients).toEqual([]);
    expect(mockReplace).toHaveBeenCalledWith(PORTFOLIO_ROUTES.fallback);
  });
});
