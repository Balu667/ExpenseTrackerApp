import ProgressBar from "react-bootstrap/ProgressBar";
import "./ContainerFillingStatus.css";

function ContainerFillingStatus({ now }) {
	if (now <= 25) {
		return <ProgressBar striped className="green" now={now} />;
	} else if (now <= 50) {
		return <ProgressBar striped className="yellow" now={now} />;
	} else if (now <= 75) {
		return <ProgressBar striped className="orange" now={now} />;
	} else if (now <= 100) {
		return <ProgressBar striped className="red" now={now} />;
	} else {
		return (
			<ProgressBar striped className="red" now={now > 100 ? 100 : now} />
		);
	}
}
export default ContainerFillingStatus;
