import "./displays.css";

type Props = {
	onReset: () => void;
};

const LoseDisplay = ({ onReset }: Props) => {
	return (
		<div className="loseDisplayWrapper">
			<div className="loseDisplayTextWrapper">
				<div className="loseDisplayHeader">Sorry, you lose.</div>
				<button
					onClick={onReset}
					className="resetButton"
					data-testid="reset-lose"
				>
					Play Again?
				</button>
			</div>
		</div>
	);
};

export default LoseDisplay;
