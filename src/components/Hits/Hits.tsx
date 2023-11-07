import { HITS } from "../../constants/constants";
import { Hit } from "../../types/types";
import "./hits.css";

type Props = {
	type: Hit;
	content: string;
};

const Hits = ({ type, content }: Props) => {
	return (
		<div className="hitsWrapper">
			<div className="hitsBg">
				<div
					className={[
						"hitsText",
						type === HITS.MISS ? "missColor" : "hitColor",
					].join(" ")}
				>
					{content}
				</div>
			</div>
		</div>
	);
};

export default Hits;
