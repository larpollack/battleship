import { Player } from "../../types/types";
import "./scoreboard.css";

type Scores = {
	[K in Player]: number;
};

type Props = {
	scores: Scores;
	maxScores: number;
};

const Scoreboard = ({ scores, maxScores }: Props) => {
	return (
		<div className="scoreboardWrapper">
			<div className="scoreWrapper">
				<div className="scoreHeader">You:</div>
				<div className="scoreBorder">
					<div
						data-testid="human-scores"
						className="humanScoreFill"
						style={{ width: `${(100 * scores.human) / maxScores}%` }}
					></div>
					<div className="scoreText">{scores.human}</div>
				</div>
			</div>
			<div className="scoreWrapper">
				<div className="scoreHeader">CPU:</div>
				<div className="scoreBorder">
					<div
						data-testid="cpu-scores"
						className="cpuScoreFill"
						style={{ width: `${(100 * scores.CPU) / maxScores}%` }}
					></div>
					<div className="scoreText">{scores.CPU}</div>
				</div>
			</div>
		</div>
	);
};

export default Scoreboard;
