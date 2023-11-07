import { render, screen } from "@testing-library/react";
import "@testing-library/jest-dom/extend-expect";
import App from "./App";

test("renders MainDisplay component", () => {
	render(<App />);
	const mainDisplayElement = screen.getByTestId("main-display");
	expect(mainDisplayElement).toBeInTheDocument();
});
