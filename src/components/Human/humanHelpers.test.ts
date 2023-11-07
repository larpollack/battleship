import { isSunk, opponentShipSunk } from "./humanHelpers";
import { BoardItem, ShipsInPlay } from "../../types/types";
import { PLAYER } from "../../constants/constants";

describe("humanHelpers", () => {
	let item: BoardItem;
	let shipsInPlay: ShipsInPlay;

	beforeEach(() => {
		item = {
			box: 1,
			col: 1,
			row: 1,
			label: "A1",
			over: false,
			player: {
				human: {
					hit: null,
					filled: "ship1",
				},
				CPU: {
					hit: null,
					filled: "ship2",
				},
			},
		};

		shipsInPlay = {
			human: [
				{
					id: "ship1",
					label: "Carrier",
					length: 5,
					squares: [1, 2, 3, 4, 5],
					sunk: false,
				},
			],
			CPU: [
				{
					id: "ship2",
					label: "Battleship",
					length: 4,
					squares: [1, 2, 3, 4],
					sunk: false,
				},
			],
		};
	});

	it("isSunk returns true when the human ship is sunk", () => {
		shipsInPlay[PLAYER.HUMAN][0].sunk = true;
		expect(isSunk(item, shipsInPlay)).toBe(true);
	});

	it("opponentShipSunk returns true when the opponent ship is sunk", () => {
		shipsInPlay[PLAYER.CPU][0].sunk = true;
		expect(opponentShipSunk(item, shipsInPlay)).toBe(true);
	});
	it("isSunk returns false when shipsInPlay is undefined", () => {
		expect(isSunk(item, undefined)).toBe(false);
	});

	it("opponentShipSunk returns false when shipsInPlay is undefined", () => {
		expect(opponentShipSunk(item, undefined)).toBe(false);
	});

	it("isSunk returns false when the human ship is not sunk", () => {
		shipsInPlay[PLAYER.HUMAN][0].sunk = false;
		expect(isSunk(item, shipsInPlay)).toBe(false);
	});

	it("opponentShipSunk returns false when the opponent ship is not sunk", () => {
		shipsInPlay[PLAYER.CPU][0].sunk = false;
		expect(opponentShipSunk(item, shipsInPlay)).toBe(false);
	});
});
