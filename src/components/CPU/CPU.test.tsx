import React from "react";
import { render, screen } from "@testing-library/react";
import { BoardItem, BoardRow, ShipsInPlay } from "../../types/types";
import { HITS, PLAYER } from "../../constants/constants";

jest.mock("uuid", () => ({
	v4: jest.fn(() => "mock-uuid"),
}));

// eslint-disable-next-line import/first
import CPU from "./CPU";

describe("CPU Component", () => {
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
		shipsInPlay: ShipsInPlayMock,
	};
	it("renders without crashing", () => {
		const { container } = render(<CPU {...mockProps} />);
		expect(container).toBeInTheDocument();
	});
	it("renders misses correctly", () => {
		const missProps = {
			...mockProps,
			board: mockProps.board.map((row) =>
				row.map((item) => ({
					...item,
					player: {
						...item.player,
						[PLAYER.CPU]: {
							hit: { value: HITS.MISS, sunk: false },
							filled: null,
						},
						[PLAYER.HUMAN]: {
							hit: { value: HITS.HIT, sunk: false },
							filled: null,
						},
					},
				}))
			),
		};

		render(<CPU {...missProps} />);
		const missedBoxes = screen
			.getAllByTestId("cpuBox-1")
			.filter((box) => box.getAttribute("data-missed") === "true");
		expect(missedBoxes.length).toBeGreaterThan(0);
	});
	it("renders hits correctly", () => {
		const hitProps = {
			...mockProps,
			board: mockProps.board.map((row) =>
				row.map((item) => ({
					...item,
					player: {
						...item.player,
						[PLAYER.CPU]: {
							hit: { value: HITS.HIT, sunk: false },
							filled: null,
						},
						[PLAYER.HUMAN]: {
							hit: { value: HITS.MISS, sunk: false },
							filled: null,
						},
					},
				}))
			),
		};
		render(<CPU {...hitProps} />);
		const hitBoxes = screen
			.getAllByTestId("cpuBox-1")
			.filter((box) => box.getAttribute("data-hit") === "true");
		expect(hitBoxes.length).toBeGreaterThan(0);
	});
});
