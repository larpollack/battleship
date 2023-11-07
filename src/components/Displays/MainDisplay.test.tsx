import {
	fireEvent,
	render,
	screen,
	renderHook,
	act,
} from "@testing-library/react";
import MainDisplay, { shipSunk } from "./MainDisplay";
import { ShipsInPlay, BoardItem } from "../../types/types";
import { PLAYER, HITS, SHIPS } from "../../constants/constants";
import GamePlay, { createArray, randomNumber } from "../GamePlay/GamePlay";

describe("MainDisplay Component", () => {
	test("renders MainDisplay component", () => {
		render(<MainDisplay />);
		expect(screen.getByTestId("board-view")).toBeInTheDocument();
	});

	test("renders CPU board when 'show CPU ships' button is clicked", () => {
		render(<MainDisplay />);
		fireEvent.click(screen.getByTestId("showShips"));
	});
	test("hides CPU board when 'hide CPU ships' button is clicked", () => {
		render(<MainDisplay />);
		fireEvent.click(screen.getByTestId("showShips"));
		fireEvent.click(screen.getByTestId("hideShips"));
		expect(screen.queryByTestId("cpu-board")).not.toBeInTheDocument();
	});
	test("starts the game when 'Start Game' button is clicked", () => {
		render(<MainDisplay />);
		const startGameButton = screen.getByTestId("start-game");
		fireEvent.click(startGameButton);
	});
	test("places a ship when a board box is clicked", () => {
		render(<MainDisplay />);
		const ship = screen.getByTestId("ship-1");
		fireEvent.click(ship);
		expect(ship).toHaveClass("shipReady hover:cursor-pointer group");
	});
	test("does not allow placing a ship when there is a conflict", () => {
		render(<MainDisplay />);
		const ship = screen.getByTestId("ship-1");
		fireEvent.click(ship);
		fireEvent.click(screen.getByTestId("humanBox-1"));
		expect(ship).toHaveClass("shipReady cursor-not-allowed");
	});
	test("does not allow starting the game when not all ships are placed", () => {
		render(<MainDisplay />);
		const startGameButton = screen.getByTestId("start-game");
		fireEvent.click(startGameButton);
		expect(screen.queryByTestId("cpu-turn")).not.toBeInTheDocument();
	});
	test("does not start the game when not all ships are placed and 'Start Game' button is clicked", () => {
		render(<MainDisplay />);
		const ship = screen.getByTestId("ship-1");
		fireEvent.click(ship);
		fireEvent.click(screen.getByTestId("humanBox-1"));
		const startGameButton = screen.getByTestId("start-game");
		fireEvent.click(startGameButton);
		expect(screen.queryByTestId("cpu-turn")).not.toBeInTheDocument();
	});

	it("does not render <LoseDisplay/> or <WinDisplay/> when game is in play", () => {
		render(<MainDisplay />);
		expect(screen.queryByTestId("lose-display")).not.toBeInTheDocument();
		expect(screen.queryByTestId("win-display")).not.toBeInTheDocument();
	});
});

describe("successHit assignment", () => {
	it("should be true when the human player has filled the item", () => {
		const item = {
			player: {
				[PLAYER.HUMAN]: {
					filled: true,
				},
			},
		};

		const successHit = item?.player[PLAYER.HUMAN].filled;
		expect(successHit).toBe(true);
	});

	it("should be false when the human player has not filled the item", () => {
		const item = {
			player: {
				[PLAYER.HUMAN]: {
					filled: false,
				},
			},
		};

		const successHit = item?.player[PLAYER.HUMAN].filled;
		expect(successHit).toBe(false);
	});
});

describe("shipSunk function", () => {
	const items: BoardItem[] = [
		{
			box: 1,
			col: 1,
			row: 1,
			label: "A1",
			over: false,
			player: {
				human: {
					filled: null,
					hit: null,
				},
				CPU: {
					filled: "ship1",
					hit: { value: HITS.HIT, sunk: false },
				},
			},
		},
		{
			box: 2,
			col: 2,
			row: 1,
			label: "A2",
			over: false,
			player: {
				human: {
					filled: null,
					hit: null,
				},
				CPU: {
					filled: null,
					hit: null,
				},
			},
		},
		{
			box: 3,
			col: 3,
			row: 1,
			label: "A3",
			over: false,
			player: {
				human: {
					filled: null,
					hit: null,
				},
				CPU: {
					filled: null,
					hit: null,
				},
			},
		},
		{
			box: 4,
			col: 4,
			row: 1,
			label: "A4",
			over: false,
			player: {
				human: {
					filled: null,
					hit: null,
				},
				CPU: {
					filled: null,
					hit: null,
				},
			},
		},
		{
			box: 5,
			col: 5,
			row: 1,
			label: "A5",
			over: false,
			player: {
				human: {
					filled: null,
					hit: null,
				},
				CPU: {
					filled: null,
					hit: null,
				},
			},
		},
		{
			box: 6,
			col: 1,
			row: 2,
			label: "B1",
			over: false,
			player: {
				human: {
					filled: null,
					hit: null,
				},
				CPU: {
					filled: null,
					hit: null,
				},
			},
		},
	];

	const shipsInPlay: ShipsInPlay = {
		human: [
			{
				...SHIPS[0],
				squares: [1, 2, 3, 4],
				sunk: false,
			},
			{
				...SHIPS[1],
				squares: [11, 12, 13, 14],
				sunk: false,
			},
			{
				...SHIPS[2],
				squares: [21, 22, 23, 24],
				sunk: false,
			},
		],
		CPU: [
			{
				...SHIPS[0],
				squares: [1, 2, 3, 4],
				sunk: false,
			},
			{
				...SHIPS[1],
				squares: [17, 18, 19, 20],
				sunk: false,
			},
			{
				...SHIPS[2],
				squares: [27, 28, 29, 30],
				sunk: false,
			},
		],
	};

	beforeAll(() => {
		shipsInPlay.CPU.forEach((ship) => {
			ship.squares.forEach((square) => {
				if (square > 0 && square <= items.length) {
					items[square - 1].player[PLAYER.HUMAN].filled = ship.id;
				}
			});
		});
		shipsInPlay.human.forEach((ship) => {
			ship.squares.forEach((square) => {
				if (square > 0 && square <= items.length) {
					items[square - 1].player[PLAYER.HUMAN].filled = ship.id;
				}
			});
		});
	});

	test("ship is sunk", () => {
		const positionOfShip = [1, 2, 3, 4];
		positionOfShip.forEach((square) => {
			if (square > 0 && square <= items.length) {
				items[square - 1].player[PLAYER.CPU].hit = {
					value: HITS.HIT,
					sunk: false,
				};
			}
		});

		const item: BoardItem = items[2];
		const sunk = shipSunk({
			items: items,
			from: PLAYER.CPU,
			item,
			shipsInPlay,
		});

		item.player[PLAYER.CPU].hit = {
			value: HITS.HIT,
			sunk: sunk,
		};

		expect(item.player[PLAYER.CPU].hit?.sunk).toBe(true);
	});

	test("ship is not sunk when missed", () => {
		const positionOfShip = [1, 2, 3, 4, 5];

		positionOfShip.forEach((square) => {
			if (square > 0 && square <= items.length) {
				items[square - 1].player[PLAYER.CPU].hit = {
					value: HITS.HIT,
					sunk: false,
				};
			}
		});

		const item: BoardItem = items[5];
		const sunk = shipSunk({
			items: items,
			from: PLAYER.CPU,
			item,
			shipsInPlay,
		});
		console.log(item, "item");
		item.player[PLAYER.CPU].hit = {
			value: HITS.HIT,
			sunk: sunk,
		};

		expect(item.player[PLAYER.CPU].hit?.sunk).toBe(false);
	});
});

describe("GamePlay hook", () => {
	it("should initialize correctly", () => {
		const { result } = renderHook(() =>
			GamePlay({ setBoxes: jest.fn(), initialItems: [] })
		);

		expect(result.current.gameReady).toBe(false);
		expect(result.current.compWins).toBe(false);
		expect(result.current.humanWins).toBe(false);
	});
	it("should update gameReady when setGameReady is called", () => {
		const { result } = renderHook(() =>
			GamePlay({ setBoxes: jest.fn(), initialItems: [] })
		);

		act(() => {
			result.current.setGameReady(true);
		});

		expect(result.current.gameReady).toBe(true);
	});
	it("should correctly calculate points", () => {
		const initialItems: BoardItem[] = [
			{
				box: 1,
				col: 1,
				row: 1,
				label: "A1",
				over: false,
				player: {
					human: { filled: null, hit: { value: HITS.HIT, sunk: false } },
					CPU: { filled: null, hit: null },
				},
			},
			{
				box: 2,
				col: 2,
				row: 2,
				label: "A2",
				over: false,
				player: {
					human: { filled: null, hit: { value: HITS.HIT, sunk: false } },
					CPU: { filled: null, hit: null },
				},
			},
		];
		const { result } = renderHook(() =>
			GamePlay({ setBoxes: jest.fn(), initialItems })
		);

		expect(result.current.points.human).toEqual([1, 2]);
		expect(result.current.points.CPU).toEqual([]);
	});
});

describe("createArray function", () => {
	it("should create an array of the specified length", () => {
		const length = 5;
		const result = createArray(length);
		expect(result).toHaveLength(length);
	});

	it("should create an array filled with undefined", () => {
		const length = 5;
		const result = createArray(length);
		expect(result).toEqual([
			undefined,
			undefined,
			undefined,
			undefined,
			undefined,
		]);
	});
});

describe("randomNumber function", () => {
	it("should return a number within the specified range", () => {
		const min = 1;
		const max = 5;
		const result = randomNumber(min, max);
		expect(result).toBeGreaterThanOrEqual(min);
		expect(result).toBeLessThanOrEqual(max);
	});

	it("should return an integer", () => {
		const min = 1;
		const max = 5;
		const result = randomNumber(min, max);
		expect(Number.isInteger(result)).toBe(true);
	});
});
