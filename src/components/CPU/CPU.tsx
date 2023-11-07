import React from "react";
import { BoardItem, BoardRow, ShipsInPlay } from "../../types/types";
import { HITS, PLAYER } from "../../constants/constants";
import "./cpu.css";

type Props = {
	board: BoardRow[];
	shipsInPlay: ShipsInPlay | undefined;
};

const CPU = ({ board, shipsInPlay }: Props) => {
	const isSunk = (item: BoardItem) => {
		if (!shipsInPlay) return false;

		const shipId = item.player[PLAYER.CPU].filled;
		const ship = shipsInPlay[PLAYER.CPU]?.find(({ id }) => id === shipId);

		return ship?.sunk;
	};

	const isHit = (item: BoardItem) => {
		return item.player[PLAYER.CPU].hit?.value === HITS.HIT;
	};

	const isMissed = (item: BoardItem) => {
		return item.player[PLAYER.CPU].hit?.value === HITS.MISS;
	};

	return (
		<>
			<div className="cpuWrapper">
				<div className="cpuBoard">
					{board.map((row, rowKey) => (
						<div key={rowKey} className="cpuRow">
							{row.map((box, boxKey) => (
								<div className="cpuBoxWrapper" key={box.label}>
									<div
										data-testid={`cpuBox-${boxKey}`}
										data-hit={isHit(box) ? "true" : "false"}
										data-missed={isMissed(box) ? "true" : "false"}
										className={[
											"cpuBox",
											isHit(box) ? "isHit" : "",
											isMissed(box) ? "isMissed" : "",
											box.player[PLAYER.CPU].hit?.value === HITS.HIT
												? isSunk(box)
													? "isSunk"
													: "notSunk"
												: box.player[PLAYER.CPU].filled
												? "isFilled"
												: "",
										]
											.join(" ")
											.trim()}
									>
										{box.label}
									</div>
								</div>
							))}
						</div>
					))}
				</div>
			</div>
		</>
	);
};

export default CPU;
