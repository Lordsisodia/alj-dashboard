import { render, screen } from "@testing-library/react";
import { TrainingHubScreen } from "../TrainingHubScreen";
import { dashboardCards } from "../../../data/dashboard";

describe("TrainingHubScreen", () => {
  it("renders dashboard cards from props", () => {
    render(<TrainingHubScreen cards={dashboardCards.slice(0, 2)} />);
    expect(screen.getByText(/My Progress/i)).toBeInTheDocument();
    expect(screen.getByText(/Courses catalog/i)).toBeInTheDocument();
  });
});

