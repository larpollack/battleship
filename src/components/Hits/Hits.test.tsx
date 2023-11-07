import { render, screen } from "@testing-library/react";
import "@testing-library/jest-dom/extend-expect";
import Hits from "./Hits";
import { HITS } from "../../constants/constants";

describe("Hits Component", () => {
	test("renders Hits component with hit", () => {
		render(<Hits type={HITS.HIT} content="Hit" />);
		const hitElement = screen.getByText("Hit");
		expect(hitElement).toBeInTheDocument();
		expect(hitElement).toHaveClass("hitsText hitColor");
	});

	test("renders Hits component with miss", () => {
		render(<Hits type={HITS.MISS} content="Miss" />);
		const missElement = screen.getByText("Miss");
		expect(missElement).toBeInTheDocument();
		expect(missElement).toHaveClass("hitsText missColor");
	});
});
