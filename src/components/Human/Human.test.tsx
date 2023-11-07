/* eslint-disable testing-library/no-container */
/* eslint-disable testing-library/no-node-access */
import React from "react";
import { render, fireEvent, screen } from "@testing-library/react";
import Human from "./Human";
import { BoardItem, BoardRow, ShipsInPlay } from "../../types/types";
import { PLAYER } from "../../constants/constants";

describe("Human Component", () => {
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
				label: `${String.fromCharCode(65 + i)}${item.label.slice(1)}`,
			}))
		),
		hideShips: false,
		disableClick: false,
		shipsInPlay: ShipsInPlayMock,
		onMouseOver: jest.fn(),
		onClick: jest.fn(),
	};
	it("renders without crashing", () => {
		const { container } = render(<Human {...mockProps} />);
		expect(container).toBeInTheDocument();
	});
	it("calls onMouseOver when mouse is over a board item", () => {
		render(<Human {...mockProps} />);
		fireEvent.mouseOver(screen.getByText("A1"));
		expect(mockProps.onMouseOver).toHaveBeenCalled();
	});

	it("calls onMouseOver with the correct argument when mouse is over a box", () => {
		const box = mockProps.board[0][0];
		render(<Human {...mockProps} />);
		fireEvent.mouseOver(screen.getByText(box.label));
		expect(mockProps.onMouseOver).toHaveBeenCalledWith(box);
	});

	it("calls onClick when a board item is clicked", () => {
		render(<Human {...mockProps} />);
		fireEvent.click(screen.getByText("A1"));
		expect(mockProps.onClick).toHaveBeenCalled();
	});
	it("calls onClick with the correct argument when a box is clicked", () => {
		const box = mockProps.board[0][0];
		render(<Human {...mockProps} />);
		fireEvent.click(screen.getByText(box.label));
		expect(mockProps.onClick).toHaveBeenCalledWith(box);
	});
	it("renders the correct number of boxes", () => {
		const { container } = render(<Human {...mockProps} />);
		const boxes = container.querySelectorAll(".humanRow");
		expect(boxes.length).toBe(mockProps.board.flat().length);
	});
	it("renders the correct number of rows", () => {
		const { container } = render(<Human {...mockProps} />);
		const rows = container.querySelectorAll(".humanContainer");
		expect(rows.length).toBe(mockProps.board.length);
	});
	it("renders hidden ships correctly", () => {
		const box = mockProps.board[0][0];
		box.player[PLAYER.HUMAN].filled = "test-ship-id";
		mockProps.hideShips = true;
		const { container } = render(<Human {...mockProps} />);
		const boxElement = Array.from(container.querySelectorAll(".humanRow")).find(
			(element) => element.textContent === box.label
		);
		expect(boxElement).toHaveClass("hidePlacedShips");
	});
});
