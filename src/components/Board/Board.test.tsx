import React from "react";
import { render, fireEvent, screen } from "@testing-library/react";
import Board from "./Board";
import { Player, BoardItem, BoardRow, ShipsInPlay } from "../../types/types";
import { PLAYER } from "../../constants/constants";

describe("Board Component", () => {
	const BoardItemMock: BoardItem = {
		box: 1,
		col: 1,
		row: 1,
		label: "A1",
		over: false,
		player: {
			[PLAYER.HUMAN]: { hit: null, filled: null },
			[PLAYER.CPU]: { hit: null, filled: null },
			human: {
				hit: null,
				filled: null,
			},
			CPU: {
				hit: null,
				filled: null,
			},
		},
	};

	const BoardRowMock: BoardRow = Array.from({ length: 10 }, (_, i) => ({
		...BoardItemMock,
		label: `A${i + 1}`,
	}));

	const ShipsInPlayMock: ShipsInPlay = {
		[PLAYER.HUMAN]: [],
		[PLAYER.CPU]: [],
		human: [],
		CPU: [],
	};

	const mockProps = {
		board: Array.from({ length: 10 }, (_, i) =>
			BoardRowMock.map((item) => ({
				...item,
				label: `${String.fromCharCode(65 + i)}${item.label.slice(1)}`, // This will generate labels 'A1', 'B1', ..., 'J10'
			}))
		),
		counter: { value: 0, label: "" },
		turn: PLAYER.HUMAN,
		disableClick: false,
		gameReady: true,
		shipsInPlay: ShipsInPlayMock,
		onMouseLeave: jest.fn(),
		onMouseOver: jest.fn(),
		onClick: jest.fn(),
	};
	it("renders without crashing", () => {
		render(<Board {...mockProps} />);

		expect(screen.getByTestId("board-view")).toBeInTheDocument();
	});
	it("calls onMouseOver when mouse is over a board item", () => {
		render(<Board {...mockProps} />);
		fireEvent.mouseOver(screen.getByText("A1"));
		expect(mockProps.onMouseOver).toHaveBeenCalled();
	});

	it("calls onClick when a board item is clicked", () => {
		render(<Board {...mockProps} />);
		fireEvent.click(screen.getByText("A1"));
		expect(mockProps.onClick).toHaveBeenCalled();
	});

	it("calls onMouseLeave when mouse leaves the board", () => {
		render(<Board {...mockProps} />);
		fireEvent.mouseLeave(screen.getByTestId("board-view"));
		expect(mockProps.onMouseLeave).toHaveBeenCalled();
	});
	it("toggles hide ships text on button click", () => {
		const { rerender } = render(<Board {...mockProps} />);

		let button = screen.getByText("hide ships");
		expect(button).toBeInTheDocument();

		fireEvent.click(button);
		rerender(<Board {...mockProps} />);
		button = screen.getByText("show ships");
		expect(button).toBeInTheDocument();
	});
});
