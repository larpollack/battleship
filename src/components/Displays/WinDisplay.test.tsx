import { render, screen, fireEvent } from "@testing-library/react";
import "@testing-library/jest-dom/extend-expect";
import WinDisplay from "./WinDisplay";

describe("WinDisplay Component", () => {
	test("renders WinDisplay component", () => {
		render(<WinDisplay onReset={() => {}} />);
		const winDisplayElement = screen.getByText("You're the Winner!");
		expect(winDisplayElement).toBeInTheDocument();
	});

	test("calls onReset when reset button is clicked", () => {
		const onReset = jest.fn();
		render(<WinDisplay onReset={onReset} />);
		const resetButton = screen.getByTestId("reset-win");
		fireEvent.click(resetButton);
		expect(onReset).toHaveBeenCalledTimes(1);
	});
});
