import { Hit, Orientation, Player, Ship } from "../types/types";
import { v4 as uuidv4 } from "uuid";

export const BOARD_SIZE = 10;
export const LETTERS = "ABCDEFGHIJ";

export const SHIPS: Ship[] = [
	{
		id: uuidv4(),
		label: "Carrier",
		length: 5,
	},
	{
		id: uuidv4(),
		label: "Battleship",
		length: 4,
	},
	{
		id: uuidv4(),
		label: "Cruiser",
		length: 3,
	},
	{
		id: uuidv4(),
		label: "Submarine",
		length: 3,
	},
];

export const ORIENTATION: { [K in Uppercase<Orientation>]: Orientation } = {
	VERTICAL: "vertical",
	HORIZONTAL: "horizontal",
};

export const PLAYER: { [K in Uppercase<Player>]: Player } = {
	HUMAN: "human",
	CPU: "CPU",
};

export const HITS: { [K in Uppercase<Hit>]: Hit } = {
	HIT: "hit",
	MISS: "miss",
};

export const MAX_SCORES = SHIPS.map((ship) => ship.length).reduce(
	(a, b) => a + b,
	0
);
