import { BoardItem, ShipsInPlay } from "../../types/types";
import { PLAYER } from "../../constants/constants";

export const isSunk = (
	item: BoardItem,
	shipsInPlay: ShipsInPlay | undefined
) => {
	if (!shipsInPlay) return false;

	const shipId = item.player[PLAYER.HUMAN].filled;
	const ship = shipsInPlay[PLAYER.HUMAN]?.find(({ id }) => id === shipId);

	return ship?.sunk;
};

export const opponentShipSunk = (
	item: BoardItem,
	shipsInPlay: ShipsInPlay | undefined
) => {
	if (!shipsInPlay) return false;

	const shipId = item.player[PLAYER.CPU].filled;
	const ship = shipsInPlay[PLAYER.CPU]?.find(({ id }) => id === shipId);

	return ship?.sunk;
};
