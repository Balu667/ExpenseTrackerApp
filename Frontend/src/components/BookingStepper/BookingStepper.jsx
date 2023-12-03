import styles from "./index.module.css";
import HorizontalStepper from "../HorizontalStepper/HorizontalStepper";

function BookingStepper({ activeStep }) {
	const getStepName = (step) => {
		switch (step) {
			case 0:
				return "Cargo Details";
			case 1:
				return "Origin Forwarder";
			case 2:
				return "Destination Forwarder";
			case 3:
				return "Notify Party";
			case 4:
				return "Upload Documents";
			default:
				return "";
		}
	};

	return (
		<div className="container" style={{ marginTop: "30px" }}>
			<div className={styles.mainbox}>
				<div className={styles.titlediv}>
					<h2 className={styles.title}>{getStepName(activeStep)}</h2>
				</div>
				<div className={styles.contentdiv}>
					<div className={styles.contentdivstepper}>
						<HorizontalStepper activeStep={activeStep} />
					</div>
				</div>
			</div>
		</div>
	);
}

export default BookingStepper;
