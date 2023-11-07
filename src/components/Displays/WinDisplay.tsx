import "./displays.css";

type Props = {
	onReset: () => void;
};

const WinDisplay = ({ onReset }: Props) => {
	return (
		<div className="winDisplayWrapper">
			<div className="winDisplayTextWrapper">
				<div className="winDisplayHeader">You're the Winner!</div>
				<button
					onClick={onReset}
					className="resetButton"
					data-testid="reset-win"
				>
					Play Again?
				</button>
			</div>
		</div>
	);
};

export default WinDisplay;
