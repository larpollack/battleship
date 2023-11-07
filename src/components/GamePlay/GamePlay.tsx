import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import {
	BoardItem,
	BoardRow,
	Cursor,
	NumHits,
	Orientation,
	Player,
	ShipsInPlay,
} from "../../types/types";
import {
	BOARD_SIZE,
	HITS,
	MAX_SCORES,
	ORIENTATION,
	PLAYER,
	SHIPS,
} from "../../constants/constants";

type Props = {
	setBoxes: (arr: number[]) => void;
	initialItems: BoardItem[];
};
export const createArray = (number: number) => {
	return Array.from(new Array(number));
};

export const randomNumber = (min: number, max: number) => {
	min = Math.ceil(min);
	max = Math.floor(max);
	return Math.floor(Math.random() * (max - min + 1) + min);
};

const GamePlay = ({ setBoxes, initialItems }: Props) => {
	const createBoard = (items: BoardItem[]): BoardRow[] => {
		let cols: BoardItem[] = [];
		return items.reduce((row: BoardRow[], item: BoardItem) => {
			if (item.col % BOARD_SIZE === 0) {
				cols.push(item);
				row.push(cols);

				cols = [];
			} else {
				cols.push(item);
			}

			return row;
		}, []);
	};
	const makeHorizontal = useCallback((box: number, shipLength: number) => {
		let boxes = [box];
		const even = Boolean(shipLength % 2);
		const rest = Math.ceil(shipLength / 2);
		const row = Math.ceil(box / BOARD_SIZE);

		const boxLeft = even ? rest - 1 : rest;
		const boxRight = even ? rest - 1 : rest - 1;

		boxes = [
			...createArray(boxLeft)
				.map((_, k) => box - (k + 1))
				.reverse(),
			...boxes,
			...createArray(boxRight).map((_, k) => box + (k + 1)),
		];

		const outLeft = Math.max(
			0,
			BOARD_SIZE * (row - 1) - (boxes[0] + 1) + boxLeft
		);
		const outRight = Math.max(0, boxes[boxes.length - 1] - BOARD_SIZE * row);

		if (outLeft > 0) {
			boxes = [
				...createArray(boxLeft - outLeft)
					.map((_, k) => box - (k + 1))
					.reverse(),
				box,
				...createArray(outLeft + boxRight).map((_, k) => box + (k + 1)),
			];
		}

		if (outRight > 0) {
			boxes = [
				...createArray(outRight + boxLeft)
					.map((_, k) => box - (k + 1))
					.reverse(),
				box,
				...createArray(boxRight - outRight).map((_, k) => box + (k + 1)),
			];
		}

		return boxes;
	}, []);

	const makeVertical = useCallback((box: number, shipLength: number) => {
		let boxes = [box];
		const even = Boolean(shipLength % 2);
		const rest = Math.ceil(shipLength / 2);

		const boxTop = even ? rest - 1 : rest;
		const boxBottom = even ? rest - 1 : rest - 1;

		boxes = [
			...createArray(boxTop)
				.map((_, k) => {
					return box - (k + 1) * BOARD_SIZE;
				})
				.reverse(),
			...boxes,
			...createArray(boxBottom).map((_, k) => {
				return box + (k + 1) * BOARD_SIZE;
			}),
		];

		const outTop = boxes.filter((i) => i <= 0).length;
		const outBottom = boxes.filter((i) => i > 100).length;

		if (outTop > 0) {
			boxes = [
				...createArray(boxTop - outTop).map((_, k) => {
					return box - (k + 1) * BOARD_SIZE;
				}),
				box,
				...createArray(outTop + boxBottom).map((_, k) => {
					return box + (k + 1) * BOARD_SIZE;
				}),
			];
		} else if (outBottom > 0) {
			boxes = [
				...createArray(boxTop + outBottom)
					.map((_, k) => {
						return box - (k + 1) * BOARD_SIZE;
					})
					.reverse(),
				box,
				...createArray(boxBottom - outBottom).map((_, k) => {
					return box + (k + 1) * BOARD_SIZE;
				}),
			];
		}

		return boxes;
	}, []);

	const [turn, setTurn] = useState<Player | null>(null);

	const orientation = useRef<Orientation>(ORIENTATION.HORIZONTAL);
	const [shipsInPlay, updateShipsInPlay] = useState<ShipsInPlay>({
		human: [],
		CPU: [],
	});
	const [gameReady, setGameReady] = useState<boolean>(false);
	const [CounterValue, updateCounterValue] = useState<number>(3);
	const [CounterLabel, updateCounterLabel] = useState<string>("");
	const [items, updateItems] = useState<BoardItem[]>(initialItems);

	const board = useMemo(() => {
		return createBoard(items);
	}, [items]);

	const humanScores = useMemo(() => {
		return items.filter((item) => {
			return item.player[PLAYER.HUMAN].hit?.value === HITS.HIT;
		}).length;
	}, [items]);

	const compScores = useMemo(() => {
		return items.filter((item) => {
			return item.player[PLAYER.CPU].hit?.value === HITS.HIT;
		}).length;
	}, [items]);

	const compWins = useMemo(() => {
		return compScores === MAX_SCORES;
	}, [compScores]);

	const humanWins = useMemo(() => {
		return humanScores === MAX_SCORES;
	}, [humanScores]);

	const switchOrientation = useCallback(() => {
		orientation.current =
			orientation.current === ORIENTATION.HORIZONTAL
				? ORIENTATION.VERTICAL
				: ORIENTATION.HORIZONTAL;
	}, [orientation]);

	const playersReady = useMemo(() => {
		const shipsLength = SHIPS.map((ship) => ship.length).reduce<number>(
			(acc, curr) => acc + curr,
			0
		);

		const compReady =
			items.filter((item) => item.player[PLAYER.CPU]?.filled).length ===
			shipsLength;
		const humanReady =
			items.filter((item) => item.player[PLAYER.HUMAN]?.filled).length ===
			shipsLength;

		return compReady && humanReady;
	}, [items]);

	const setShipPosition = useCallback(
		({ box, ship }: Cursor) => {
			const horizontal = orientation.current === ORIENTATION.HORIZONTAL;
			const vertical = orientation.current === ORIENTATION.VERTICAL;

			let boxes: number[] = [];

			if (horizontal) {
				boxes = makeHorizontal(box, ship);
			}

			if (vertical) {
				boxes = makeVertical(box, ship);
			}

			setBoxes(boxes);

			return boxes;
		},
		[makeHorizontal, makeVertical, setBoxes]
	);

	const randomOrientation = () => {
		orientation.current = [ORIENTATION.VERTICAL, ORIENTATION.HORIZONTAL][
			randomNumber(0, 1)
		];
	};

	const points = useMemo<NumHits>(() => {
		const hits: NumHits = {
			human: [],
			CPU: [],
		};

		for (const item of items) {
			const compHit = item.player[PLAYER.CPU].hit;
			const humanHit = item.player[PLAYER.HUMAN].hit;

			if (compHit) {
				hits[PLAYER.CPU].push(item.box);
			}

			if (humanHit) {
				hits[PLAYER.HUMAN].push(item.box);
			}
		}

		return hits;
	}, [items]);

	useEffect(() => {
		(Object.entries(points) as [Player, number[]][]).forEach(
			([player, playerHits]) => {
				const opponent = player === PLAYER.CPU ? PLAYER.HUMAN : PLAYER.CPU;

				shipsInPlay[opponent] = shipsInPlay[opponent].map((ship) => {
					ship.sunk = ship.squares.every((square: number) =>
						playerHits.includes(square)
					);
					return ship;
				});
			}
		);

		updateShipsInPlay(shipsInPlay);
	}, [points, shipsInPlay]);

	return {
		setShipPosition,
		switchOrientation,
		randomOrientation,
		setGameReady,
		updateCounterValue,
		updateCounterLabel,
		updateShipsInPlay,
		setTurn,
		updateItems,
		gameReady,
		points,
		playersReady,
		counter: {
			value: CounterValue,
			label: CounterLabel,
		},
		shipsInPlay,
		turn,
		items,
		board,
		scores: {
			human: humanScores,
			CPU: compScores,
		},
		maxScores: MAX_SCORES,
		compWins,
		humanWins,
	};
};

export default GamePlay;
