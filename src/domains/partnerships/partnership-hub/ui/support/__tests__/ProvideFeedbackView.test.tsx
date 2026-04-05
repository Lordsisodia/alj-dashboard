// @vitest-environment jsdom
import "@testing-library/jest-dom/vitest";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { describe, it, expect, vi } from "vitest";
vi.mock("@/components/ui/button", () => ({
  Button: (props: any) => <button {...props} />,
}));
vi.mock("@/components/ui/textarea", () => ({
  Textarea: (props: any) => <textarea {...props} />,
}));
vi.mock("@/components/ui/input", () => ({
  Input: (props: any) => <input {...props} />,
}));
vi.mock("@/domains/partnerships/settings/shared/components/SettingsGroupCallout", () => ({
  SettingsGroupCallout: ({ children }: { children: React.ReactNode }) => <div>{children}</div>,
}));

import { ProvideFeedbackView } from "../ProvideFeedbackView";

describe("ProvideFeedbackView", () => {
  it("shows validation errors when fields are empty", async () => {
    render(<ProvideFeedbackView />);
    const form = screen.getAllByTestId("feedback-form")[0];
    fireEvent.submit(form);
    await waitFor(() => {
      expect(screen.queryByText(/valid email required/i)).toBeTruthy();
    });
    expect(screen.queryByText(/topic is required/i)).toBeTruthy();
    expect(screen.queryByText(/at least 10 characters/i)).toBeTruthy();
  });

  it("submits successfully with valid input", async () => {
    render(<ProvideFeedbackView />);
    const form = screen.getAllByTestId("feedback-form")[0];
    fireEvent.change(screen.getAllByPlaceholderText(/you@siso.run/i)[0], { target: { value: "test@siso.run" } });
    fireEvent.change(screen.getAllByPlaceholderText(/wallet latency/i)[0], { target: { value: "Latency" } });
    fireEvent.change(screen.getAllByPlaceholderText(/What should we improve/i)[0], {
      target: { value: "Please speed up the wallet views." },
    });
    fireEvent.submit(form);

    await waitFor(() => {
      const sentButton = screen.getAllByRole("button", { name: /sent/i })[0];
      expect(sentButton).toBeDisabled();
    });
  });
});
