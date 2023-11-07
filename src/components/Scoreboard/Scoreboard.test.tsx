import { render, screen } from "@testing-library/react";
import "@testing-library/jest-dom/extend-expect";
import Scoreboard from "./Scoreboard";

describe("Scoreboard Component", () => {
	test("renders Scoreboard component with scores", () => {
		const scores = { human: 5, CPU: 3 };
		const maxScores = 10;
		render(<Scoreboard scores={scores} maxScores={maxScores} />);

		const humanScoreElement = screen.getByTestId("human-scores");
		expect(humanScoreElement).toBeInTheDocument();
		expect(humanScoreElement).toHaveStyle(`width: ${50}%`);

		const cpuScoreElement = screen.getByTestId("cpu-scores");
		expect(cpuScoreElement).toBeInTheDocument();
		expect(cpuScoreElement).toHaveStyle(`width: ${30}%`);
	});
});
