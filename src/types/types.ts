export type Orientation = "vertical" | "horizontal";

export type Ship = {
	id: string;
	label: string;
	length: number;
};

export type PlayerShip = Ship & {
	pending: boolean;
	done: boolean;
};

export type Player = "human" | "CPU";

export type Hit = "hit" | "miss";

export type PlayerStatus = {
	hit: null | {
		value: Hit;
		sunk: boolean;
	};
	filled: null | string;
};

export type BoardItem = {
	box: number;
	col: number;
	row: number;
	label: string;
	over: boolean;
	player: { [key in Player]: PlayerStatus };
};

export type BoardRow = BoardItem[];

export type ShipsInPlay = {
	[K in Player]: (Ship & { squares: number[]; sunk: boolean })[];
};

export type NumHits = {
	[K in Player]: number[];
};

export type Cursor = {
	box: number;
	row: number;
	ship: number;
};
