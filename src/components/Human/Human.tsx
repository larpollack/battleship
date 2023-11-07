import { HITS, PLAYER } from "../../constants/constants";
import { BoardItem, BoardRow, ShipsInPlay } from "../../types/types";
import "./human.css";
import { isSunk, opponentShipSunk } from "./humanHelpers";

type Props = {
	board: BoardRow[];
	hideShips: boolean;
	disableClick: boolean;
	shipsInPlay: ShipsInPlay | undefined;
	onMouseOver: (item: BoardItem) => void;
	onClick: (item: BoardItem) => void;
};

const Human = ({
	onMouseOver,
	onClick,
	board,
	hideShips,
	disableClick,
	shipsInPlay,
}: Props) => {
	return (
		<>
			{board.map((row, rowKey) => {
				return (
					<div key={rowKey} className="humanContainer">
						{row.map((item: BoardItem) => (
							<div
								data-testid={`humanBox-${item.box}`}
								key={item.label}
								onMouseOver={() => onMouseOver(item)}
								onClick={() => onClick(item)}
								className={[
									"humanRow",
									item.player[PLAYER.HUMAN].hit?.value === HITS.HIT
										? opponentShipSunk(item, shipsInPlay)
											? "isHit"
											: "notHit"
										: "",
									item.player[PLAYER.HUMAN].hit?.value === HITS.MISS
										? "isMissed"
										: "",
									item.player[PLAYER.CPU].hit?.value === HITS.HIT
										? isSunk(item, shipsInPlay)
											? "isSunk"
											: "notSunk"
										: "",
									item.over && !disableClick ? "shipsClickableHover" : "",
									item.over && disableClick
										? "shipsNoClickNoHover"
										: "shipsClickableNoHover",
									!hideShips && item.player[PLAYER.HUMAN].filled
										? "showPlacedShips"
										: "",
									hideShips && item.player[PLAYER.HUMAN].filled
										? "hidePlacedShips"
										: "",
								].join(" ")}
							>
								{item.label}
							</div>
						))}
					</div>
				);
			})}
		</>
	);
};

export default Human;
