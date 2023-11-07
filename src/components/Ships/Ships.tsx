import React from "react";
import { PlayerShip } from "../../types/types";
import "./ships.css";

type Props = {
	ships: PlayerShip[];
	onClickShip: (ship: PlayerShip, key: number) => void;
	onClickStartGame: () => void;
	playerShipsDone: boolean;
	playersReady: boolean;
};

const Ships = ({
	ships,
	onClickShip,
	onClickStartGame,
	playerShipsDone,
	playersReady,
}: Props) => {
	const createArray = (number: number) => {
		return Array.from(new Array(number));
	};

	return (
		<>
			<div className="shipsWrapper">
				<h2 className="shipsHeader">Ships</h2>
				<div className="shipsBody">
					<p>
						Select a ship to place on the map. Press the space bar to rotate.
					</p>
				</div>
				<div className="shipContainer">
					{ships.map((ship, shipKey: number) => (
						<div
							className={[
								"shipReady",
								ship.done ? "cursor-not-allowed" : "hover:cursor-pointer group",
							].join(" ")}
							key={shipKey}
							onClick={() => onClickShip(ship, shipKey)}
							data-testid={`ship-${shipKey}`}
						>
							<div className="shipLabel">{ship.label}</div>
							<div className="shipSquaresWrapper">
								{createArray(ship.length).map((_, squareKey: number) => {
									return (
										<div
											className={[
												"shipSquares",
												ship.pending ? "shipPending" : "",
												ship.done ? "shipPlaced" : "",
												!ship.pending && !ship.done ? "shipOnDeck" : "",
											].join(" ")}
											key={squareKey}
										></div>
									);
								})}
							</div>
						</div>
					))}
				</div>

				<div className="startButtonWrapper">
					<button
						data-testid="start-game"
						className={["startButton", !playerShipsDone ? "disabled" : ""].join(
							" "
						)}
						disabled={!playersReady}
						onClick={onClickStartGame}
					>
						start
						{/* ideally would make this and other buttons their own components if time were not an issue */}
					</button>
				</div>
			</div>
		</>
	);
};
export default Ships;
