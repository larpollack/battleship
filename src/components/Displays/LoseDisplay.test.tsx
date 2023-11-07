import { render, screen, fireEvent } from "@testing-library/react";
import "@testing-library/jest-dom/extend-expect";
import LoseDisplay from "./LoseDisplay";

describe("LoseDisplay Component", () => {
	test("renders LoseDisplay component", () => {
		render(<LoseDisplay onReset={() => {}} />);
		const loseDisplayElement = screen.getByText("Sorry, you lose.");
		expect(loseDisplayElement).toBeInTheDocument();
	});

	test("calls onReset when reset button is clicked", () => {
		const onReset = jest.fn();
		render(<LoseDisplay onReset={onReset} />);
		const resetButton = screen.getByTestId("reset-lose");
		fireEvent.click(resetButton);
		expect(onReset).toHaveBeenCalledTimes(1);
	});
});
