import { useState } from "react";
import { BoardItem, BoardRow, Player, ShipsInPlay } from "../../types/types";
import { PLAYER } from "../../constants/constants";
import Human from "../Human/Human";
import "./board.css";

type Props = {
	onMouseLeave: () => void;
	onMouseOver: (item: BoardItem) => void;
	onClick: (item: BoardItem) => void;
	board: BoardRow[];
	counter: {
		value: number;
		label: string;
	};
	turn: Player | null;
	disableClick: boolean;
	gameReady: boolean;
	shipsInPlay: ShipsInPlay;
};

const Board = ({
	onClick,
	onMouseLeave,
	onMouseOver,
	board,
	gameReady,
	counter,
	turn,
	disableClick,
	shipsInPlay,
}: Props) => {
	const [hideShips, setHideShips] = useState<boolean>(false);

	return (
		<div>
			<div
				data-testid="board-view"
				className="boardWrapper"
				onMouseLeave={onMouseLeave}
			>
				{counter.label && (
					<div className="counterWrapper">
						<div className="counter">{counter.label}</div>
					</div>
				)}
				{turn === PLAYER.CPU && (
					<div className="compTurn" data-testid="cpu-turn">
						CPU's Turn
					</div>
				)}

				<Human
					board={board}
					disableClick={disableClick}
					onMouseOver={onMouseOver}
					onClick={onClick}
					hideShips={hideShips}
					shipsInPlay={shipsInPlay}
				/>
			</div>
			{gameReady && !counter.label && (
				<div>
					<div className="hideShipsWrapper">
						<button
							onClick={() => setHideShips((prev) => !prev)}
							className="hideShipsButton"
							data-testid="hideShips"
						>
							{!hideShips && <div>hide ships</div>}
							{hideShips && <div>show ships</div>}
						</button>
					</div>
					<div className="turnWrapper">
						{turn === PLAYER.HUMAN && (
							<span className="turnHuman">Your Turn</span>
						)}
						{turn === PLAYER.CPU && (
							<span className="turnCPU" data-testid="cpu-turn">
								CPU's Turn
							</span>
						)}
					</div>
				</div>
			)}
		</div>
	);
};

export default Board;
