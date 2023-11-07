import React, {
	useCallback,
	useEffect,
	useMemo,
	useRef,
	useState,
} from "react";
import {
	BoardItem,
	Cursor,
	Hit,
	Player,
	PlayerShip,
	Ship,
	ShipsInPlay,
} from "../../types/types";
import {
	BOARD_SIZE,
	HITS,
	LETTERS,
	PLAYER,
	SHIPS,
} from "../../constants/constants";
import GamePlay, { createArray, randomNumber } from "../GamePlay/GamePlay";
import Board from "../Board/Board";
import Ships from "../Ships/Ships";
import Scoreboard from "../Scoreboard/Scoreboard";
import CPU from "../CPU/CPU";
import Hits from "../Hits/Hits";
import LoseDisplay from "./LoseDisplay";
import WinDisplay from "./WinDisplay";
import "./displays.css";

let playerShip: PlayerShip[] = JSON.parse(
	JSON.stringify(
		SHIPS.map((ship) => ({
			...ship,
			pending: false,
			done: false,
		}))
	)
);

const wait = (time: number) => {
	return new Promise((resolve) => setTimeout(() => resolve(null), time));
};

type SunkenProps = {
	item: BoardItem | undefined;
	shipsInPlay: ShipsInPlay;
	items: BoardItem[];
	from: Player;
};

export const shipSunk = ({ items, item, from, shipsInPlay }: SunkenProps) => {
	const opponent = from === PLAYER.HUMAN ? PLAYER.CPU : PLAYER.HUMAN;

	const hit = item?.player[opponent].filled;
	if (!hit) return false;

	const shipSquares = items
		.filter(
			(i) =>
				i.player[opponent].filled === hit &&
				i.player[from].hit?.value === HITS.HIT
		)
		.map((i) => i.box);

	const ship = shipsInPlay[opponent].find((ship) => ship.id === hit);

	if (!ship) return false;

	return ship.squares.every((square) => shipSquares.includes(square));
};

const MainDisplay = () => {
	const fillBoard = (): BoardItem[] => {
		let row = 0;
		return createArray(BOARD_SIZE * BOARD_SIZE).map((_, index): BoardItem => {
			if (index % BOARD_SIZE === 0) {
				row++;
			}

			const col = (index % BOARD_SIZE) + 1;

			return {
				box: index + 1,
				col,
				row,
				label: `${LETTERS[col - 1]}${row}`,
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
			};
		});
	};

	const mounted = useRef(false);
	const [boxes, setBoxes] = useState<number[]>([]);
	const [isCompMoving, setIsCompMoving] = useState<boolean>(false);
	const [showCompShips, setShowCompShips] = useState<boolean>(false);
	const [freeShips, setFreeShips] = useState<{
		ship: PlayerShip;
		key: number;
	} | null>(null);
	const [cursor, setCursor] = useState<Cursor | null>(null);
	const [hitResult, setHitResult] = useState<{
		type: Hit;
		content: string;
	} | null>(null);

	const {
		setShipPosition,
		switchOrientation,
		randomOrientation,
		setGameReady,
		updateCounterValue,
		updateCounterLabel,
		updateShipsInPlay,
		gameReady,
		playersReady,
		counter,
		shipsInPlay,
		scores,
		compWins,
		humanWins,
		items,
		updateItems,
		board,
		turn,
		setTurn,
		maxScores,
	} = GamePlay({
		setBoxes,
		initialItems: JSON.parse(JSON.stringify(fillBoard())),
	});

	const isConflict = useMemo<boolean>(() => {
		return !!(
			freeShips &&
			items.some((item) => {
				return item.player[PLAYER.HUMAN].filled && boxes.includes(item.box);
			})
		);
	}, [boxes, items, freeShips]);

	const playerShipsDone = useMemo(() => {
		const shipLength = SHIPS.map((b) => b.length).reduce((a, b) => a + b, 0);
		return (
			items.filter((i) => i.player[PLAYER.HUMAN].filled).length === shipLength
		);
	}, [items]);

	const resetGame = () => {
		window.location.reload();
	};

	const onKeydownHandler = useCallback(
		async ($event: KeyboardEvent) => {
			if ($event.code === "Space") {
				switchOrientation();

				if (cursor) {
					const boxes = setShipPosition(cursor);
					updateItems((prevItems) => {
						return prevItems.map((item) => {
							item.over = boxes.includes(item.box);

							return item;
						});
					});
				}
			}
		},
		[cursor, setShipPosition, switchOrientation, updateItems]
	);

	const onMouseOverBoard = useCallback(
		({ box, row }: BoardItem) => {
			if (!freeShips) return;

			setCursor({
				box,
				row,
				ship: freeShips.ship.length,
			});
			const boxes = setShipPosition({
				box,
				row,
				ship: freeShips.ship.length,
			});

			updateItems((prevItems) => {
				return prevItems.map((item) => {
					item.over = boxes.includes(item.box);

					return item;
				});
			});
		},
		[setCursor, setShipPosition, updateItems, freeShips]
	);

	const onClickSetShip = useCallback(() => {
		if (isConflict) return;
		if (playerShipsDone) return;
		if (!freeShips) return;

		updateItems((prevItems) => {
			return prevItems.map((item) => {
				if (boxes.includes(item.box)) {
					item.player[PLAYER.HUMAN].filled = freeShips.ship.id;
				}

				return item;
			});
		});

		if (shipsInPlay) {
			if (!shipsInPlay[PLAYER.HUMAN]) {
				shipsInPlay[PLAYER.HUMAN] = [];
			}
			shipsInPlay[PLAYER.HUMAN].push({
				label: freeShips.ship.label,
				squares: boxes,
				length: boxes.length,
				id: freeShips.ship.id,
				sunk: false,
			});
		}

		updateShipsInPlay(shipsInPlay);
		setCursor(null);
		playerShip[freeShips.key].pending = false;
		playerShip[freeShips.key].done = true;
		setFreeShips(null);
		setBoxes([]);
		updateItems((prevItems) => {
			return prevItems.map((i) => {
				i.over = false;

				return i;
			});
		});
	}, [
		boxes,
		freeShips,
		isConflict,
		playerShipsDone,
		shipsInPlay,
		updateItems,
		updateShipsInPlay,
	]);

	const onClickShipSettings = useCallback((ship: PlayerShip, key: number) => {
		if (ship.done) return;

		setFreeShips({ ship, key });

		playerShip = playerShip.map((PlayerShip, shipKey) => {
			PlayerShip.pending = key === shipKey;
			return PlayerShip;
		});
	}, []);

	const onClickShowCompShips = useCallback(() => {
		setShowCompShips((prev: boolean) => !prev);
	}, []);

	const onMouseLeaveBoard = useCallback(() => {
		updateItems((prevItems) => {
			return prevItems.map((i) => {
				i.over = false;

				return i;
			});
		});
	}, [updateItems]);

	const onClickStartGame = useCallback(() => {
		if (playersReady) {
			setGameReady(true);
		}
	}, [playersReady, setGameReady]);

	const onClickToHit = useCallback(
		async (_item: BoardItem) => {
			if (_item.player[PLAYER.HUMAN].hit) return;

			const successHit = _item.player[PLAYER.CPU].filled;

			const isSunk = shipSunk({
				items,
				from: PLAYER.HUMAN,
				item: _item,
				shipsInPlay,
			});

			updateItems((prevItems: BoardItem[]) => {
				return prevItems.map((item: BoardItem) => {
					if (item.box === _item.box) {
						item.player[PLAYER.HUMAN].hit = {
							value: successHit ? HITS.HIT : HITS.MISS,
							sunk: isSunk,
						};
					}

					return item;
				});
			});

			await wait(500);

			if (successHit) {
				setHitResult({
					type: HITS.HIT,
					content: isSunk ? "You just sank a CPU ship!" : "It's a hit!",
				});
			} else {
				setHitResult({
					type: HITS.MISS,
					content: "Miss! Try again",
				});
			}

			await wait(1000);

			setHitResult(null);
			console.log("cpu turn");
			setTurn(PLAYER.CPU);
		},
		[items, setTurn, shipsInPlay, updateItems]
	);

	const randomTurn = useCallback(() => {
		const player = [PLAYER.HUMAN, PLAYER.CPU][randomNumber(0, 1)];

		setTurn(player);
	}, [setTurn]);

	const compsMove = useCallback(async () => {
		if (isCompMoving) {
			return;
		}
		setIsCompMoving(true);
		await wait(1000);

		const allowedBoxes = items.filter((item) => !item.player[PLAYER.CPU].hit);
		const box = randomNumber(0, allowedBoxes.length);
		const alreadyDone = allowedBoxes.find(
			(item, itemIndex) => itemIndex === box && item.player[PLAYER.CPU].hit
		);

		if (alreadyDone) {
			setIsCompMoving(false);
			compsMove();
			return;
		}

		const item = items.find((item) => {
			return item.box === box;
		});

		const successHit = item?.player[PLAYER.HUMAN].filled;

		const isSunk = shipSunk({
			items,
			from: PLAYER.CPU,
			item,
			shipsInPlay,
		});

		await updateItems((prevItems: BoardItem[]) => {
			return prevItems.map((item: BoardItem) => {
				if (item.box === box) {
					item.player[PLAYER.CPU].hit = {
						value: successHit ? HITS.HIT : HITS.MISS,
						sunk: isSunk,
					};
				}

				return item;
			});
		});

		await wait(500);
		console.log("human turn");
		setTurn(PLAYER.HUMAN);

		if (successHit) {
			setHitResult({
				type: HITS.HIT,
				content: isSunk
					? "CPU Player sank your ship!"
					: "One of your ships was hit!",
			});
		} else {
			setHitResult({
				type: HITS.MISS,
				content: "Miss! You're safe for now",
			});
		}

		await wait(1000);

		setHitResult(null);
		setIsCompMoving(false);
	}, [isCompMoving, items, setTurn, shipsInPlay, updateItems]);

	const runCounter = useCallback(async () => {
		updateCounterLabel(String(counter.value));
		await wait(1000);

		if (counter.value === 1) {
			updateCounterValue(0);
			updateCounterLabel("Play!");

			await wait(500);
			updateCounterLabel("");

			randomTurn();

			return;
		}

		if (gameReady) {
			updateCounterValue(counter.value - 1);
		}
	}, [
		updateCounterLabel,
		counter.value,
		gameReady,
		updateCounterValue,
		randomTurn,
	]);

	const onClickBoardBox = (item: BoardItem) => {
		if (gameReady) {
			onClickToHit(item);
		} else {
			onClickSetShip();
		}
	};

	useEffect(() => {
		document.addEventListener("keydown", onKeydownHandler);

		return () => {
			document.removeEventListener("keydown", onKeydownHandler);
		};
	}, [onKeydownHandler]);

	useEffect(() => {
		if (mounted.current) return;
		mounted.current = true;

		const ships: Ship[] = [...SHIPS];

		let _items = items;

		for (let i = ships.length - 1; i >= 0; i--) {
			const ship = ships[i];
			if (!ship) continue;

			const box = randomNumber(1, BOARD_SIZE * BOARD_SIZE);
			const row = Math.ceil(box / BOARD_SIZE);
			randomOrientation();

			const boxes = setShipPosition({ box, row, ship: ship.length });

			const conflict = items.some((item) => {
				return item.player[PLAYER.CPU].filled && boxes.includes(item.box);
			});

			if (conflict) {
				ships.push(ship);

				continue;
			}

			if (shipsInPlay) {
				if (!shipsInPlay[PLAYER.CPU]) {
					shipsInPlay[PLAYER.CPU] = [];
				}
				shipsInPlay[PLAYER.CPU].push({
					label: ship.label,
					squares: boxes,
					length: boxes.length,
					id: ship.id,
					sunk: false,
				});
			}

			_items = _items.map((item) => {
				if (boxes.includes(item.box)) {
					item.player[PLAYER.CPU].filled = ship.id;
				}

				return item;
			});
		}

		updateShipsInPlay(shipsInPlay);
		updateItems(_items);
	}, [
		items,
		randomOrientation,
		setShipPosition,
		shipsInPlay,
		updateItems,
		updateShipsInPlay,
	]);

	useEffect(() => {
		if (turn === PLAYER.CPU) {
			compsMove();
		}
	}, [compsMove, turn]);

	useEffect(() => {
		if (!gameReady || counter.value === 0) return;

		runCounter();
	}, [gameReady, runCounter, counter]);

	if (compWins) {
		return <LoseDisplay onReset={resetGame} />;
	}

	if (humanWins) {
		return <WinDisplay onReset={resetGame} />;
	}

	return (
		<>
			{hitResult && <Hits type={hitResult.type} content={hitResult.content} />}

			<div data-testid="main-display">
				<div className="mainWrapper">
					<div className="main">
						<h2 className="humanBoardHeader">Your board</h2>
						<Board
							onClick={onClickBoardBox}
							onMouseOver={onMouseOverBoard}
							onMouseLeave={onMouseLeaveBoard}
							counter={counter}
							board={board}
							gameReady={gameReady}
							turn={turn}
							disableClick={isConflict && !!freeShips}
							shipsInPlay={shipsInPlay}
						/>
					</div>

					<div className="shipsWrapper">
						{!gameReady && (
							<Ships
								data-testid="ship-component"
								ships={playerShip}
								onClickShip={onClickShipSettings}
								onClickStartGame={onClickStartGame}
								playerShipsDone={playerShipsDone}
								playersReady={playersReady}
							/>
						)}

						{gameReady && (
							<div className="scoresWrapper">
								<h2 className="scoresHeader">Scores</h2>

								<Scoreboard
									data-testid="scoreboard"
									scores={scores}
									maxScores={maxScores}
								/>
							</div>
						)}
					</div>
				</div>

				<div className="showShipsContainer">
					<button onClick={onClickShowCompShips} className="showShipsButton">
						{!showCompShips && (
							<span data-testid="showShips">
								show CPU ships (to test or cheat!)
							</span>
						)}
						{showCompShips && (
							<span data-testid="hideShips">hide CPU ships</span>
						)}
					</button>
				</div>

				{showCompShips && (
					<div className="cpuBoardWrapper">
						<div>
							<h2 className="cpuBoardHeader">CPU board</h2>
							<CPU board={board} shipsInPlay={shipsInPlay} />
						</div>
					</div>
				)}
			</div>
		</>
	);
};

export default MainDisplay;
