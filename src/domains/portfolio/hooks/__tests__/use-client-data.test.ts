// @vitest-environment jsdom
import { renderHook } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { useClientData } from "../use-client-data";
import { PORTFOLIO_ROUTES } from "../../constants";

const mockReplace = vi.fn();
const mockUseParams = vi.fn();
const mockGetClientBySlug = vi.fn();

vi.mock("next/navigation", () => ({
  useParams: () => mockUseParams(),
  useRouter: () => ({ replace: mockReplace }),
}));

vi.mock("../../lib", () => ({
  getClientBySlug: (...args: unknown[]) => mockGetClientBySlug(...args),
}));

describe("useClientData", () => {
  beforeEach(() => {
    mockReplace.mockReset();
    mockUseParams.mockReset();
    mockGetClientBySlug.mockReset();
  });

  it("returns client when slug exists", () => {
    const client = { id: "c-1", name: "Client 1" } as any;
    mockUseParams.mockReturnValue({ client: "c-1" });
    mockGetClientBySlug.mockReturnValue(client);

    const { result } = renderHook(() => useClientData());

    expect(result.current).toBe(client);
    expect(mockReplace).not.toHaveBeenCalled();
  });

  it("redirects to fallback when client missing", () => {
    mockUseParams.mockReturnValue({ client: "missing" });
    mockGetClientBySlug.mockReturnValue(null);

    const { result } = renderHook(() => useClientData());

    expect(result.current).toBeNull();
    expect(mockReplace).toHaveBeenCalledWith(PORTFOLIO_ROUTES.fallback);
  });
});
